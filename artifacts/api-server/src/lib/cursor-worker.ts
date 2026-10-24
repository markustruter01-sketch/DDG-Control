import { randomUUID } from "node:crypto";
import { db, cursorWorkerInvocationsTable, managedFleetQuestionsTable, managedWorkDispatchConfigTable, managedWorkDispatchesTable, managedWorkItemsTable, managedWorkOutcomesTable, projectWorkControlsTable } from "@workspace/db";
import { and, desc, eq, gt, isNotNull, lt, ne, notExists, sql } from "drizzle-orm";
import { CURSOR_CANCEL_OPERATIONS_VERIFIED, CURSOR_HOSTED_WORKER_VERIFIED, dispatchReadiness, hasWorkControl, normalizeWorkRepository } from "./managed-work-controls";
import { validCursorRecoveryClaim, workerDatabaseTime } from "./cursor-worker-claim";
import { dispatchApprovedCursorWork } from "./cursor-work-dispatch";
import { cursorCancellationRequirement, hasUnreleasedCursorDispatch, processCursorCancellation, recordCursorDeadline } from "./cursor-cancellation";

/** Owner recovery projection only. Never expose claim tokens or credentials. */
export async function readCursorWorkerInvocation(invocationId: string) {
  if (!CURSOR_HOSTED_WORKER_VERIFIED) return { status: 423, body: { state: "disabled", evidence_source: "unavailable" } };
  const [row] = await db.select({ invocation_id: cursorWorkerInvocationsTable.invocation_id,
    state: cursorWorkerInvocationsTable.state, work_item_id: cursorWorkerInvocationsTable.work_item_id,
    operation: cursorWorkerInvocationsTable.operation, recovery_after_dispatch_id: cursorWorkerInvocationsTable.recovery_after_dispatch_id,
    plan_version: cursorWorkerInvocationsTable.plan_version, outcome_version: cursorWorkerInvocationsTable.outcome_version,
    dispatch_id: cursorWorkerInvocationsTable.dispatch_id, result_code: cursorWorkerInvocationsTable.result_code,
    http_status: cursorWorkerInvocationsTable.http_status, expires_at: cursorWorkerInvocationsTable.expires_at,
    created_at: cursorWorkerInvocationsTable.created_at, finished_at: cursorWorkerInvocationsTable.finished_at })
    .from(cursorWorkerInvocationsTable).where(eq(cursorWorkerInvocationsTable.invocation_id, invocationId)).limit(1);
  return { status: row ? 200 : 404, body: { invocation: row ?? null, evidence_source: "saved_ledger_only",
    provider_status_verified_now: false, automatic_retry: false, task_accepted: false } };
}

/** One authenticated hosted invocation, one candidate, no loop or retry.
 * All invocation states (including idle/blocked) are durable replay receipts.
 * Requires a separately reviewed/applied schema; it is source-disabled. */
export async function runCursorWorkerTick(invocationId: string, requestTimestamp: number) {
  if (!CURSOR_HOSTED_WORKER_VERIFIED) return { status: 423, body: { state: "disabled", automatic_pickup: false } };
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(invocationId) ||
      !Number.isSafeInteger(requestTimestamp)) return { status: 400, body: { state: "invalid" } };
  const claim = await db.transaction(async tx => {
    await tx.insert(managedWorkDispatchConfigTable).values({ id: 1 }).onConflictDoNothing();
    const [config] = await tx.select().from(managedWorkDispatchConfigTable)
      .where(eq(managedWorkDispatchConfigTable.id, 1)).for("update").limit(1);
    if (!config) return { kind: "unconfigured" as const };
    const [prior] = await tx.select().from(cursorWorkerInvocationsTable)
      .where(eq(cursorWorkerInvocationsTable.invocation_id, invocationId)).limit(1);
    if (prior) return { kind: "replay" as const, prior };
    const now = await workerDatabaseTime(tx);
    if (Math.abs(now - requestTimestamp) > 60_000) return { kind: "stale" as const };
    const token = randomUUID();
    const base = { invocation_id: invocationId, claim_token: token, request_timestamp: new Date(requestTimestamp),
      expires_at: new Date(now + 90_000), config_version: config.updated_at };
    const [active] = await tx.select({ id: cursorWorkerInvocationsTable.invocation_id }).from(cursorWorkerInvocationsTable)
      .where(and(eq(cursorWorkerInvocationsTable.state, "claimed"), gt(cursorWorkerInvocationsTable.expires_at, new Date(now)))).limit(1);
    // Recovery ignores the new-work toggle/readiness. The global dispatch
    // barrier must be resolved before selecting any further coding task.
    if (!active && await hasUnreleasedCursorDispatch(tx)) {
      const [previous] = await tx.select({ cursor: cursorWorkerInvocationsTable.recovery_after_dispatch_id })
        .from(cursorWorkerInvocationsTable).where(and(eq(cursorWorkerInvocationsTable.state, "finished"),
          isNotNull(cursorWorkerInvocationsTable.recovery_after_dispatch_id)))
        .orderBy(desc(cursorWorkerInvocationsTable.sequence)).limit(1);
      const after = previous?.cursor ?? 0;
      let [dispatch] = await tx.select().from(managedWorkDispatchesTable)
        .where(gt(managedWorkDispatchesTable.id, after)).orderBy(managedWorkDispatchesTable.id).limit(1);
      if (!dispatch && after > 0) [dispatch] = await tx.select().from(managedWorkDispatchesTable)
        .orderBy(managedWorkDispatchesTable.id).limit(1);
      if (dispatch) {
        await tx.insert(cursorWorkerInvocationsTable).values({ ...base, state: "claimed", operation: "recover",
          work_item_id: dispatch.work_item_id, dispatch_id: dispatch.id });
        return { kind: "recover" as const, token, taskId: dispatch.work_item_id, dispatchId: dispatch.id };
      }
    }
    const ready = dispatchReadiness(config).dispatch_enabled && hasWorkControl(config.approved_project_key ?? "");
    const [candidate] = !active && ready ? await tx.select({ item: managedWorkItemsTable, outcome: managedWorkOutcomesTable })
      .from(managedWorkItemsTable)
      .innerJoin(managedWorkOutcomesTable, eq(managedWorkOutcomesTable.id, managedWorkItemsTable.outcome_id))
      .innerJoin(projectWorkControlsTable, eq(projectWorkControlsTable.project_key, managedWorkItemsTable.project_key))
      .where(and(eq(managedWorkItemsTable.status, "approved"), ne(managedWorkItemsTable.project_key, "finance"),
        eq(managedWorkItemsTable.project_key, config.approved_project_key ?? ""),
        eq(managedWorkItemsTable.target_branch, config.approved_starting_branch ?? ""),
        eq(sql<string>`regexp_replace(regexp_replace(regexp_replace(lower(trim(${managedWorkItemsTable.repository})), '^https?://', ''), '[.]git$', ''), '/$', '')`, normalizeWorkRepository(config.approved_repository)),
        eq(managedWorkOutcomesTable.project_key, managedWorkItemsTable.project_key), eq(managedWorkOutcomesTable.status, "approved"),
        eq(projectWorkControlsTable.enabled, true), eq(projectWorkControlsTable.completed, false),
        eq(managedWorkItemsTable.spend_limit_cents, 0), lt(managedWorkItemsTable.attempts, managedWorkItemsTable.max_attempts),
        gt(managedWorkItemsTable.deadline, new Date(now)),
        notExists(tx.select({ id: managedWorkDispatchesTable.id }).from(managedWorkDispatchesTable)
          .where(eq(managedWorkDispatchesTable.work_item_id, managedWorkItemsTable.id))),
        notExists(tx.select({ id: managedFleetQuestionsTable.id }).from(managedFleetQuestionsTable)
          .where(and(eq(managedFleetQuestionsTable.work_item_id, managedWorkItemsTable.id),
            eq(managedFleetQuestionsTable.project_key, managedWorkItemsTable.project_key),
            eq(managedFleetQuestionsTable.plan_version, managedWorkItemsTable.plan_version),
            eq(managedFleetQuestionsTable.blocks_work, true), eq(managedFleetQuestionsTable.status, "open"))))))
      .orderBy(managedWorkItemsTable.id).limit(1) : [];
    if (!candidate) {
      const code = active ? "busy" : ready ? "idle" : "blocked";
      await tx.insert(cursorWorkerInvocationsTable).values({ ...base, state: "finished", http_status: 200,
        result_code: code, finished_at: new Date(now) });
      return { kind: "finished" as const, code };
    }
    await tx.insert(cursorWorkerInvocationsTable).values({ ...base, state: "claimed", work_item_id: candidate.item.id,
      plan_version: candidate.item.plan_version, outcome_version: candidate.outcome.version });
    return { kind: "claimed" as const, token, taskId: candidate.item.id };
  });
  if (claim.kind === "replay") return { status: claim.prior.state === "finished" ? 200 : 409,
    body: { state: "replay", previous_state: claim.prior.state, result: claim.prior.result_code,
      dispatch_id: claim.prior.dispatch_id, previous_http_status: claim.prior.http_status, automatic_retry: false } };
  if (claim.kind !== "claimed" && claim.kind !== "recover") return { status: claim.kind === "stale" ? 401 : claim.kind === "unconfigured" ? 503 : 200,
    body: { state: claim.kind === "finished" ? claim.code : claim.kind, automatic_retry: false } };
  // HTTP occurs only inside the shared dispatcher after durable claim checks.
  // A crash here leaves the claim for inspection. Retrying this invocation ID
  // never resubmits; another invocation must acquire a new valid bounded claim.
  const workerClaim = { invocationId, token: claim.token };
  let status: number;
  let code: string;
  let dispatchId: number | null;
  if (claim.kind === "recover") {
    const authorise = async (tx: Parameters<Parameters<typeof db.transaction>[0]>[0], dispatch: typeof managedWorkDispatchesTable.$inferSelect) =>
      validCursorRecoveryClaim(tx, workerClaim, dispatch.id, dispatch.work_item_id);
    const deadline = await recordCursorDeadline(claim.dispatchId, authorise);
    code = `recovery_${deadline.kind}`;
    status = deadline.kind === "stale" ? 409 : 200;
    dispatchId = claim.dispatchId;
    // A previously saved stop/deadline requirement is necessary. No new
    // cancellation is inferred merely because a dispatch exists.
    if (CURSOR_CANCEL_OPERATIONS_VERIFIED && deadline.kind !== "stale" && deadline.kind !== "released" && deadline.kind !== "missing") {
      const cancelAuthority = async (tx: Parameters<Parameters<typeof db.transaction>[0]>[0], dispatch: typeof managedWorkDispatchesTable.$inferSelect) => {
        const [config] = await tx.select().from(managedWorkDispatchConfigTable)
          .where(eq(managedWorkDispatchConfigTable.id, 1)).limit(1);
        return Boolean(await authorise(tx, dispatch) && config && dispatch.project_key !== "finance" &&
          dispatch.project_key === config.approved_project_key && await cursorCancellationRequirement(tx, dispatch));
      };
      const required = await db.transaction(async tx => {
        await tx.select({ id: managedWorkDispatchConfigTable.id }).from(managedWorkDispatchConfigTable)
          .where(eq(managedWorkDispatchConfigTable.id, 1)).for("update").limit(1);
        const [dispatch] = await tx.select().from(managedWorkDispatchesTable)
          .where(eq(managedWorkDispatchesTable.id, claim.dispatchId)).limit(1);
        return Boolean(dispatch && await cancelAuthority(tx, dispatch));
      });
      if (required) {
        const apiKey = process.env.CURSOR_API_KEY?.trim();
        if (apiKey) {
          const cancellation = await processCursorCancellation(claim.dispatchId, apiKey, cancelAuthority);
          code = `recovery_${cancellation.kind}`;
          if (cancellation.kind === "stale") status = 409;
        } else code = "recovery_credential_unavailable";
      }
    }
  } else {
    const result = await dispatchApprovedCursorWork(claim.taskId, workerClaim);
    status = result.status;
    code = result.status === 202 ? "submitted" : "dispatch_blocked_or_unresolved";
    dispatchId = Number.isSafeInteger(result.body.dispatch_id) ? result.body.dispatch_id as number : null;
  }
  await db.transaction(async tx => {
    await tx.select({ id: managedWorkDispatchConfigTable.id }).from(managedWorkDispatchConfigTable)
      .where(eq(managedWorkDispatchConfigTable.id, 1)).for("update").limit(1);
    const [saved] = await tx.select().from(cursorWorkerInvocationsTable)
      .where(eq(cursorWorkerInvocationsTable.invocation_id, invocationId)).for("update").limit(1);
    if (!saved || saved.claim_token !== claim.token || saved.state !== "claimed") throw new Error("Worker receipt changed");
    const now = await workerDatabaseTime(tx);
    await tx.update(cursorWorkerInvocationsTable).set({ state: "finished", http_status: status,
      result_code: code, dispatch_id: dispatchId,
      // Expired/stale recovery may be recorded, but cannot advance the cursor
      // over work its worker no longer owns. The next call safely rechecks it.
      recovery_after_dispatch_id: claim.kind === "recover" && status !== 409 && saved.expires_at.getTime() > now ? claim.dispatchId : null,
      finished_at: new Date(now) }).where(eq(cursorWorkerInvocationsTable.invocation_id, invocationId));
  });
  return { status, body: { state: code,
    work_item_id: claim.taskId, dispatch_id: dispatchId, automatic_retry: false } };
}
