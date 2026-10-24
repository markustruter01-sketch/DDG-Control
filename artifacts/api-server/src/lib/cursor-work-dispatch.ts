import { randomUUID } from "node:crypto";
import { db, managedFleetQuestionsTable, managedWorkDispatchConfigTable, managedWorkDispatchesTable, managedWorkEventsTable, managedWorkItemsTable, managedWorkOutcomesTable } from "@workspace/db";
import { and, eq, inArray, ne } from "drizzle-orm";
import { buildCursorAgentPayload, createCursorAgent } from "./cursor-dispatch";
import { cursorCancellationRequirement, hasUnreleasedCursorDispatch, requireCursorCancellation } from "./cursor-cancellation";
import { CURSOR_HOSTED_WORKER_VERIFIED, FINANCE_REVIEW_REQUIRED, dispatchReadiness, lockWorkItem, normalizeWorkRepository, readDispatchConfig } from "./managed-work-controls";
import { validCursorWorkerClaim, type CursorWorkerClaim } from "./cursor-worker-claim";
import { companyPlanAllows, companyPlanReceipt, lockCompanyPlanContext, sameCompanyPlan } from "./company-plan-revisions";

export type CursorDispatchServiceResult = { status: number; body: Record<string, unknown> };

/** Called only by an authenticated, authorised entry point. Shared execution
 * primitive, not permission to dispatch. Readiness is rechecked under the
 * singleton reservation lock. Never retries an ambiguous submission. */
export async function dispatchApprovedCursorWork(id: number, workerClaim?: CursorWorkerClaim): Promise<CursorDispatchServiceResult> {
  if (!Number.isSafeInteger(id) || id < 1) return { status: 400, body: { error: "Invalid work item." } };
  if (workerClaim && !CURSOR_HOSTED_WORKER_VERIFIED) return { status: 423, body: { error: "Hosted worker is disabled." } };
  const config = await readDispatchConfig();
  const readiness = dispatchReadiness(config);
  if (!readiness.dispatch_enabled) { return { status: 423, body: { error: "Dispatch is blocked.", blockers: readiness.blockers } }; }
  const reservation = await db.transaction(async (tx) => {
    // Global reservation/stop order: singleton config, project control, task.
    // Re-read readiness under the stop-all lock; the earlier snapshot can age.
    const [config] = await tx.select().from(managedWorkDispatchConfigTable)
      .where(eq(managedWorkDispatchConfigTable.id, 1)).for("update").limit(1);
    if (!config || !dispatchReadiness(config).dispatch_enabled) return { kind: "disabled" as const };
    const companyPlan = await lockCompanyPlanContext(tx);
    // Serialize reservations across projects. Local terminal status cannot
    // release this barrier without a verified external termination receipt.
    if (await hasUnreleasedCursorDispatch(tx)) return { kind: "duplicate" as const, status: "global_run_requires_verified_release" };
    const locked = await lockWorkItem(tx, id);
    if (!locked) return { kind: "missing" as const };
    const { item, control } = locked;
    if (!companyPlanAllows(companyPlan, id)) return { kind: "not_ready" as const };
    if ((item.project_key === "finance" && FINANCE_REVIEW_REQUIRED) || !control.enabled || control.completed) return { kind: "off" as const };
    const [blockingQuestion] = await tx.select({ id: managedFleetQuestionsTable.id }).from(managedFleetQuestionsTable)
      .where(and(eq(managedFleetQuestionsTable.project_key, item.project_key), eq(managedFleetQuestionsTable.work_item_id, item.id),
        eq(managedFleetQuestionsTable.plan_version, item.plan_version ?? 1), eq(managedFleetQuestionsTable.blocks_work, true), eq(managedFleetQuestionsTable.status, "open"))).limit(1);
    if (blockingQuestion) return { kind: "question" as const };
    const normalizeRepository = normalizeWorkRepository;
    if (item.project_key === "finance" || item.project_key !== config.approved_project_key || !item.repository || !item.target_branch ||
        normalizeRepository(item.repository) !== normalizeRepository(config.approved_repository) ||
        item.target_branch !== config.approved_starting_branch || item.status !== "approved" ||
        item.attempts >= item.max_attempts || item.spend_limit_cents !== 0 || new Date() >= item.deadline) return { kind: "not_ready" as const };
    const [outcome] = await tx.select().from(managedWorkOutcomesTable).where(eq(managedWorkOutcomesTable.id, item.outcome_id!)).limit(1);
    if (!outcome || outcome.project_key !== item.project_key || outcome.status !== "approved") return { kind: "not_ready" as const };
    if (workerClaim && !await validCursorWorkerClaim(tx, workerClaim, id, item.plan_version, outcome.version, config.updated_at)) {
      return { kind: "not_ready" as const };
    }
    const [prior] = await tx.select({ id: managedWorkDispatchesTable.id, status: managedWorkDispatchesTable.status }).from(managedWorkDispatchesTable).where(eq(managedWorkDispatchesTable.work_item_id, id)).limit(1);
    if (prior) return { kind: "duplicate" as const, status: prior.status };
    const [repoActive] = await tx.select({ id: managedWorkItemsTable.id }).from(managedWorkItemsTable)
      .where(and(eq(managedWorkItemsTable.repository, item.repository), ne(managedWorkItemsTable.id, id), inArray(managedWorkItemsTable.status, ["approved", "in_progress"]))).limit(1);
    if (repoActive) return { kind: "duplicate" as const, status: "repository_active" };
    const idempotencyKey = randomUUID();
    const [dispatch] = await tx.insert(managedWorkDispatchesTable).values({
      work_item_id: id, project_key: item.project_key, outcome_id: outcome.id, outcome_version: outcome.version,
      idempotency_key: idempotencyKey, agent_id: `bc-${idempotencyKey}`, model_id: config.selected_model_id, branch: item.target_branch,
      status: "submitting", started_at: new Date(),
    }).returning();
    await tx.insert(managedWorkEventsTable).values({ work_item_id: id, project_key: item.project_key,
      actor: "system", event_type: "cursor_execution_bound", details: { version: 1, dispatch_id: dispatch.id,
        agent_id: dispatch.agent_id, plan_version: item.plan_version, time_limit_minutes: item.time_limit_minutes,
        owner_deadline: item.deadline.toISOString(), effective_deadline: new Date(Math.min(item.deadline.getTime(),
          dispatch.started_at.getTime() + item.time_limit_minutes * 60_000)).toISOString(), provider_enforced: false } });
    await tx.update(managedWorkItemsTable).set({ attempts: item.attempts + 1, started_at: new Date(), updated_at: new Date() }).where(eq(managedWorkItemsTable.id, id));
    await tx.insert(managedWorkEventsTable).values({ work_item_id: id, project_key: item.project_key, actor: workerClaim ? "system:cursor-worker-v1" : "Markus", event_type: "dispatch_reserved", from_status: "approved", to_status: "approved", details: { dispatch_id: dispatch.id, idempotency_key: idempotencyKey, outcome_version: outcome.version, invocation_id: workerClaim?.invocationId ?? null, ...companyPlanReceipt(companyPlan) } });
    return { kind: "reserved" as const, item, dispatch, config, companyPlan,
      outcomeVersion: outcome.version,
      effectiveDeadline: new Date(Math.min(item.deadline.getTime(), dispatch.started_at.getTime() + item.time_limit_minutes * 60_000)) };
  });
  if (reservation.kind !== "reserved") {
    const status = reservation.kind === "missing" ? 404 : reservation.kind === "off" || reservation.kind === "question" || reservation.kind === "disabled" ? 423 : 409;
    return { status: status, body: { error: reservation.kind === "disabled" ? "Dispatch settings changed or managed work was blocked. Refresh readiness before any further action." : reservation.kind === "off" ? "Project work is OFF." : reservation.kind === "question" ? "A blocking owner question is still open for this task version." : reservation.kind === "duplicate" ? "A prior dispatch requires verified external termination, or repository work is active. Inspect history; do not retry." : reservation.kind === "not_ready" ? "Task is not owner-approved and Ready." : "Work item not found.", ...(reservation.kind === "duplicate" ? { dispatch_status: reservation.status } : {}) } };
  }
  const apiKey = process.env.CURSOR_API_KEY?.trim();
  if (!apiKey) {
    await db.update(managedWorkDispatchesTable).set({ status: "needs_owner", error_summary: "Server secret missing after reservation; do not retry automatically." }).where(eq(managedWorkDispatchesTable.id, reservation.dispatch.id));
    return { status: 503, body: { error: "Dispatch reserved but server secret is unavailable; owner review required." } };
  }
  let acceptedRun: Awaited<ReturnType<typeof createCursorAgent>> | undefined;
  try {
    const suspicious = /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|(?:gh[pousr]_[A-Za-z0-9]{20,}|xai-[A-Za-z0-9_-]{20,}|sk-[A-Za-z0-9_-]{20,}|Bearer\s+[A-Za-z0-9._-]{16,})/i;
    const promptText = [reservation.item.title, reservation.item.objective, reservation.item.outcome, reservation.item.stop_condition, reservation.item.gate_key ?? '', ...reservation.item.checklist, ...reservation.item.acceptance_checks].join("\n");
    if (suspicious.test(promptText)) throw new Error("Task contains a credential-like string; dispatch refused.");
    const agentUuid = reservation.dispatch.idempotency_key;
    const payload = buildCursorAgentPayload({
      task: {
        ...reservation.item,
        repository: reservation.item.repository!,
        target_branch: reservation.item.target_branch!,
      },
      modelId: reservation.config.selected_model_id!,
      agentId: `bc-${agentUuid}`,
      ...(reservation.companyPlan.mode === 'accepted' ? { planScope: {
        planVersion: reservation.item.plan_version, outcomeId: reservation.item.outcome_id!, outcomeVersion: reservation.outcomeVersion,
        gateKey: reservation.item.gate_key!, acceptanceId: reservation.companyPlan.acceptance_id,
        proposalId: reservation.companyPlan.proposal_id, digest: reservation.companyPlan.digest,
      } } : {}),
    });
    // Persist a submission boundary before HTTP. Recheck the same reservation
    // under the stop lock; a stop after this commit leaves a durable recovery
    // intent even if the provider accepts only after the stop response.
    const submit = await db.transaction(async tx => {
      const [currentConfig] = await tx.select().from(managedWorkDispatchConfigTable)
        .where(eq(managedWorkDispatchConfigTable.id, 1)).for("update").limit(1);
      const currentPlan = await lockCompanyPlanContext(tx);
      if (!sameCompanyPlan(reservation.companyPlan, currentPlan) || !companyPlanAllows(currentPlan, id)) return false;
      const current = await lockWorkItem(tx, id);
      const [dispatch] = await tx.select().from(managedWorkDispatchesTable)
        .where(eq(managedWorkDispatchesTable.id, reservation.dispatch.id)).for("update").limit(1);
      if (!currentConfig || !current || !dispatch || !dispatchReadiness(currentConfig).dispatch_enabled ||
          currentConfig.updated_at.getTime() !== reservation.config.updated_at.getTime() ||
          !current.control.enabled || current.control.completed || current.item.status !== "approved" ||
          current.item.plan_version !== reservation.item.plan_version || new Date() >= current.item.deadline ||
          dispatch.status !== "submitting" || dispatch.agent_id !== payload.agentId || dispatch.run_id !== null) return false;
      if (new Date() >= reservation.effectiveDeadline || await cursorCancellationRequirement(tx, dispatch)) return false;
      const [outcome] = await tx.select().from(managedWorkOutcomesTable)
        .where(eq(managedWorkOutcomesTable.id, dispatch.outcome_id!)).limit(1);
      if (!outcome || outcome.project_key !== current.item.project_key || outcome.status !== "approved" ||
          outcome.version !== dispatch.outcome_version) return false;
      if (workerClaim && !await validCursorWorkerClaim(tx, workerClaim, id, current.item.plan_version, outcome.version, currentConfig.updated_at)) return false;
      const [question] = await tx.select({ id: managedFleetQuestionsTable.id }).from(managedFleetQuestionsTable)
        .where(and(eq(managedFleetQuestionsTable.work_item_id, id), eq(managedFleetQuestionsTable.project_key, current.item.project_key),
          eq(managedFleetQuestionsTable.plan_version, current.item.plan_version), eq(managedFleetQuestionsTable.blocks_work, true),
          eq(managedFleetQuestionsTable.status, "open"))).limit(1);
      if (question) return false;
      await tx.insert(managedWorkEventsTable).values({ work_item_id: id, project_key: current.item.project_key,
        actor: "system", event_type: "cursor_submission_started", details: { dispatch_id: dispatch.id,
          reserved_agent_id: dispatch.agent_id, config_version: currentConfig.updated_at.toISOString(),
          plan_version: current.item.plan_version, outcome_version: dispatch.outcome_version, automatic_retry: false,
          ...companyPlanReceipt(reservation.companyPlan) } });
      return true;
    });
    if (!submit) throw new Error("Submission blocked by changed controls or task state");
    const result = await createCursorAgent(apiKey, payload);
    acceptedRun = result;
    const dashboardStatus = await db.transaction(async (tx) => {
      // Store the accepted run, task state and event together. A stop while the
      // network request was in flight must not be overwritten as permission.
      const [currentConfig] = await tx.select().from(managedWorkDispatchConfigTable)
        .where(eq(managedWorkDispatchConfigTable.id, 1)).for("update").limit(1);
      const returnedPlan = await lockCompanyPlanContext(tx);
      const current = await lockWorkItem(tx, id);
      if (!current) throw new Error("Accepted run could not be linked to its task; owner review required.");
      const [savedDispatch] = await tx.select().from(managedWorkDispatchesTable)
        .where(eq(managedWorkDispatchesTable.id, reservation.dispatch.id)).for("update").limit(1);
      if (!savedDispatch || savedDispatch.agent_id !== result.agentId ||
          (savedDispatch.run_id !== null && savedDispatch.run_id !== result.runId)) {
        throw new Error("Accepted run conflicts with saved recovery binding.");
      }
      const [question] = await tx.select({ id: managedFleetQuestionsTable.id }).from(managedFleetQuestionsTable)
        .where(and(eq(managedFleetQuestionsTable.work_item_id, id), eq(managedFleetQuestionsTable.project_key, current.item.project_key),
          eq(managedFleetQuestionsTable.plan_version, current.item.plan_version ?? 1), eq(managedFleetQuestionsTable.blocks_work, true), eq(managedFleetQuestionsTable.status, "open"))).limit(1);
      const cancellationRequired = await cursorCancellationRequirement(tx, reservation.dispatch);
      const nextStatus = sameCompanyPlan(reservation.companyPlan, returnedPlan) && companyPlanAllows(returnedPlan, id) &&
        !cancellationRequired && currentConfig?.enabled && currentConfig.updated_at.getTime() === reservation.config.updated_at.getTime() &&
        current.control.enabled && !current.control.completed && current.item.status === "approved" &&
        current.item.plan_version === reservation.item.plan_version && new Date() < current.item.deadline &&
        new Date() < reservation.effectiveDeadline && !question
        ? "in_progress" : "needs_owner";
      await tx.update(managedWorkDispatchesTable).set({ agent_id: result.agentId, run_id: result.runId, provider_status: result.runStatus, status: "running" })
        .where(eq(managedWorkDispatchesTable.id, reservation.dispatch.id));
      await tx.update(managedWorkItemsTable).set({ status: nextStatus, branch: reservation.item.target_branch, updated_at: new Date() })
        .where(eq(managedWorkItemsTable.id, id));
      if (nextStatus === "needs_owner") await requireCursorCancellation(tx, reservation.dispatch, "controls_task_or_company_plan_changed_during_submission");
      await tx.insert(managedWorkEventsTable).values({ work_item_id: id, project_key: reservation.item.project_key, actor: "system", event_type: "cursor_dispatch_started", from_status: current.item.status, to_status: nextStatus, details: { dispatch_id: reservation.dispatch.id, provider: "cursor", model_id: reservation.config.selected_model_id, agent_id: result.agentId, run_id: result.runId, run_status: result.runStatus, branch: reservation.item.target_branch, provider_cancellation: "not_requested_or_verified" } });
      return nextStatus;
    });
    return { status: 202, body: { dispatch_id: reservation.dispatch.id, work_item_id: id, provider: "cursor", model_id: reservation.config.selected_model_id, agent_id: result.agentId, run_id: result.runId, status: result.runStatus, dashboard_status: dashboardStatus, provider_cancellation: "not_requested_or_verified", automatic_pickup: false } };
  } catch {
    // A local persistence failure after an accepted start must retain the
    // validated external binding when recovery storage is available. Never
    // persist arbitrary database/network error messages or provider excerpts.
    const summary = acceptedRun
      ? "Cursor accepted the run, but its local start record could not be confirmed."
      : "Cursor submission was refused or its result could not be confirmed.";
    await db.transaction(async (tx) => {
      await tx.select({ id: managedWorkDispatchConfigTable.id }).from(managedWorkDispatchConfigTable)
        .where(eq(managedWorkDispatchConfigTable.id, 1)).for("update").limit(1);
      const current = await lockWorkItem(tx, id);
      const [savedDispatch] = await tx.select().from(managedWorkDispatchesTable)
        .where(eq(managedWorkDispatchesTable.id, reservation.dispatch.id)).for("update").limit(1);
      const maySaveBinding = acceptedRun && savedDispatch?.agent_id === acceptedRun.agentId &&
        (savedDispatch.run_id === null || savedDispatch.run_id === acceptedRun.runId);
      await tx.update(managedWorkDispatchesTable).set({
        status: "needs_owner", error_summary: `${summary} No automatic retry; inspect Cursor before any next action.`,
        ...(maySaveBinding && acceptedRun ? { agent_id: acceptedRun.agentId, run_id: acceptedRun.runId, provider_status: acceptedRun.runStatus } : {}),
      }).where(eq(managedWorkDispatchesTable.id, reservation.dispatch.id));
      if (acceptedRun) await requireCursorCancellation(tx, reservation.dispatch, "accepted_start_persistence_requires_recovery");
      await tx.insert(managedWorkEventsTable).values({ work_item_id: id, project_key: reservation.item.project_key, actor: "system", event_type: "cursor_dispatch_needs_owner", from_status: current?.item.status ?? "unknown", to_status: current?.item.status ?? "unknown", details: { dispatch_id: reservation.dispatch.id, error: summary, accepted_run_binding_retained: Boolean(maySaveBinding), accepted_run_binding_conflict: Boolean(acceptedRun && !maySaveBinding) } });
    });
    return { status: 502, body: { error: "Cursor request outcome requires owner review. The reservation prevents duplicate submission." } };
  }
}
