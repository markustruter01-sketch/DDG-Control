import { randomUUID } from "node:crypto";
import { db, goalsTable, managedWorkDispatchConfigTable, managedWorkDispatchesTable, managedWorkEventsTable, managedWorkItemsTable, managedWorkOutcomeEventsTable, managedWorkOutcomesTable, projectHandoverEventsTable, projectHandoverTable, projectWorkAuditTable, projectWorkControlsTable, projectsTable, tasksTable } from "@workspace/db";
import { and, desc, eq, inArray, ne } from "drizzle-orm";
import { Router, type IRouter } from "express";
import { requireRealOwnerSession } from "./auth";
import { buildCursorAgentPayload, createCursorAgent } from "../lib/cursor-dispatch";

export const WORK_KEYS = ["finance", "hypest", "cattle-dog-coffee", "ddg-control-ai-stack"] as const;
export type WorkKey = (typeof WORK_KEYS)[number];
const FINANCE_REVIEW_REQUIRED = true;
const CURSOR_AUTOMATIC_PICKUP = false;
const CURSOR_HARD_WALL_CLOCK_STOP_VERIFIED = false;
const BACKGROUND_WORKER_BLOCKER = "Automatic queue pickup is unavailable: Replit deployments can restart or move processes, and this app has no separately verified durable worker.";
const TASK_LIMIT_BLOCKER = "Dispatch stays blocked: this adapter cannot enforce or verify a provider-side wall-clock stop for an active run.";

async function readDispatchConfig() {
  await db.insert(managedWorkDispatchConfigTable).values({ id: 1 }).onConflictDoNothing();
  const [config] = await db.select().from(managedWorkDispatchConfigTable).where(eq(managedWorkDispatchConfigTable.id, 1)).limit(1);
  return config!;
}

function dispatchReadiness(config: Awaited<ReturnType<typeof readDispatchConfig>>) {
  const secretPresent = Boolean(process.env.CURSOR_API_KEY?.trim());
  const normalizeRepository = (value: string | null) => value?.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\.git$/, "").replace(/\/$/, "") ?? "";
  const ownerBlockers = [
    ...(!CURSOR_HARD_WALL_CLOCK_STOP_VERIFIED ? [TASK_LIMIT_BLOCKER] : []),
    ...(!config.plan_model_confirmed ? ["Owner has not verified eligible plan and exact model."] : []),
    ...(!config.included_allowance_confirmed ? ["Owner has not verified included allowance for that model."] : []),
    ...(!config.no_overage_confirmed ? ["Owner has not verified no-overage or a hard spend cap."] : []),
    ...(!config.github_access_confirmed ? ["Owner has not verified GitHub repository access and starting branch."] : []),
    ...(!config.approved_project_key || !normalizeRepository(config.approved_repository) || !config.approved_starting_branch ? ["Owner-approved project, repository, and starting branch are not configured."] : []),
    ...(!config.secret_owner_verified || !secretPresent ? ["Cursor server secret must be present and owner-verified; secret values are never returned."] : []),
    ...(!config.selected_model_id ? ["An explicit owner-verified model ID is required; no fallback is configured."] : []),
  ];
  const blockers = [...ownerBlockers, ...(!config.enabled ? ["Dispatch toggle is OFF."] : [])];
  return {
    manual_dispatch_ready: ownerBlockers.length === 0,
    dispatch_enabled: config.enabled && ownerBlockers.length === 0,
    automatic_pickup: CURSOR_AUTOMATIC_PICKUP,
    background_worker_blocker: BACKGROUND_WORKER_BLOCKER,
    secret_present: secretPresent,
    config: {
      enabled: config.enabled,
      plan_model_confirmed: config.plan_model_confirmed,
      included_allowance_confirmed: config.included_allowance_confirmed,
      no_overage_confirmed: config.no_overage_confirmed,
      github_access_confirmed: config.github_access_confirmed,
      secret_owner_verified: config.secret_owner_verified,
      selected_model_id: config.selected_model_id,
      approved_repository: config.approved_repository,
      approved_starting_branch: config.approved_starting_branch,
      approved_project_key: config.approved_project_key,
      updated_at: config.updated_at,
    },
    blockers,
  };
}

export function hasWorkControl(key: string): key is WorkKey {
  return WORK_KEYS.includes(key as WorkKey);
}

export async function isProjectWorkEnabled(key: string): Promise<boolean> {
  if (!hasWorkControl(key)) return false;
  if (key === "finance" && FINANCE_REVIEW_REQUIRED) return false;
  const [row] = await db.select({ enabled: projectWorkControlsTable.enabled, completed: projectWorkControlsTable.completed })
    .from(projectWorkControlsTable).where(eq(projectWorkControlsTable.project_key, key)).limit(1);
  return row?.enabled === true && row.completed === false;
}

const router: IRouter = Router();
const workStatuses = ["pending_approval", "approved", "in_progress", "needs_owner", "failed", "completed", "rejected"] as const;

router.get("/work-items", async (req, res): Promise<void> => {
  const key = typeof req.query.project_key === "string" ? req.query.project_key : null;
  const base = db.select().from(managedWorkItemsTable);
  const items = key
    ? await base.where(eq(managedWorkItemsTable.project_key, key)).orderBy(desc(managedWorkItemsTable.created_at)).limit(100)
    : await base.orderBy(desc(managedWorkItemsTable.created_at)).limit(200);
  const eventsQuery = db.select().from(managedWorkEventsTable);
  const events = key
    ? await eventsQuery.where(eq(managedWorkEventsTable.project_key, key)).orderBy(desc(managedWorkEventsTable.created_at)).limit(200)
    : await eventsQuery.orderBy(desc(managedWorkEventsTable.created_at)).limit(200);
  const dispatchQuery = db.select().from(managedWorkDispatchesTable);
  const dispatches = key
    ? await dispatchQuery.where(eq(managedWorkDispatchesTable.project_key, key)).orderBy(desc(managedWorkDispatchesTable.started_at)).limit(200)
    : await dispatchQuery.orderBy(desc(managedWorkDispatchesTable.started_at)).limit(200);
  res.json({ items, events, dispatches });
});

router.get("/work-outcomes", async (req, res): Promise<void> => {
  const key = typeof req.query.project_key === "string" ? req.query.project_key : null;
  const outcomesQuery = db.select().from(managedWorkOutcomesTable);
  const eventsQuery = db.select().from(managedWorkOutcomeEventsTable);
  const outcomes = key
    ? await outcomesQuery.where(eq(managedWorkOutcomesTable.project_key, key)).orderBy(desc(managedWorkOutcomesTable.created_at))
    : await outcomesQuery.orderBy(desc(managedWorkOutcomesTable.created_at));
  const events = key
    ? await eventsQuery.where(eq(managedWorkOutcomeEventsTable.project_key, key)).orderBy(desc(managedWorkOutcomeEventsTable.created_at)).limit(200)
    : await eventsQuery.orderBy(desc(managedWorkOutcomeEventsTable.created_at)).limit(200);
  res.json({ outcomes, events });
});

router.get("/work-dispatch-config", async (_req, res): Promise<void> => {
  res.json(dispatchReadiness(await readDispatchConfig()));
});

router.patch("/work-dispatch-config", requireRealOwnerSession, async (req, res): Promise<void> => {
  const b = req.body;
  const flags = ["enabled", "plan_model_confirmed", "included_allowance_confirmed", "no_overage_confirmed", "github_access_confirmed", "secret_owner_verified"];
  if (!b || flags.some((key) => typeof b[key] !== "boolean") ||
      (b.selected_model_id !== null && typeof b.selected_model_id !== "string") ||
      (b.approved_repository !== null && typeof b.approved_repository !== "string") ||
      (b.approved_starting_branch !== null && typeof b.approved_starting_branch !== "string") ||
      (b.approved_project_key !== null && typeof b.approved_project_key !== "string") ||
      (typeof b.selected_model_id === "string" && (b.selected_model_id.length < 1 || b.selected_model_id.length > 120))) {
    res.status(400).json({ error: "Provide owner confirmations, model ID, repository, starting branch, and enabled state." });
    return;
  }
  const values = {
    id: 1, enabled: b.enabled, plan_model_confirmed: b.plan_model_confirmed,
    included_allowance_confirmed: b.included_allowance_confirmed, no_overage_confirmed: b.no_overage_confirmed,
    github_access_confirmed: b.github_access_confirmed, secret_owner_verified: b.secret_owner_verified,
    selected_model_id: b.selected_model_id?.trim() || null, updated_by: "Markus", updated_at: new Date(),
    approved_repository: b.approved_repository?.trim() || null,
    approved_starting_branch: b.approved_starting_branch?.trim() || null,
    approved_project_key: b.approved_project_key?.trim() || null,
  };
  if (values.enabled && (!values.plan_model_confirmed || !values.included_allowance_confirmed || !values.no_overage_confirmed ||
      !values.github_access_confirmed || !values.secret_owner_verified || !values.selected_model_id || !values.approved_repository ||
      !values.approved_starting_branch || !values.approved_project_key || !process.env.CURSOR_API_KEY?.trim())) {
    res.status(423).json({ error: "Dispatch cannot be enabled until every owner check passes and the server secret is present." });
    return;
  }
  if (values.enabled && !CURSOR_HARD_WALL_CLOCK_STOP_VERIFIED) {
    res.status(423).json({ error: TASK_LIMIT_BLOCKER });
    return;
  }
  await db.insert(managedWorkDispatchConfigTable).values(values).onConflictDoUpdate({ target: managedWorkDispatchConfigTable.id, set: values });
  res.json(dispatchReadiness(await readDispatchConfig()));
});

router.post("/work-outcomes/:id/approve", requireRealOwnerSession, async (req, res): Promise<void> => {
  const id = Number(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
  const [outcome] = await db.select().from(managedWorkOutcomesTable).where(eq(managedWorkOutcomesTable.id, id)).limit(1);
  if (!outcome) { res.status(404).json({ error: "Outcome not found." }); return; }
  if (!(await isProjectWorkEnabled(outcome.project_key))) { res.status(423).json({ error: "Project work is OFF." }); return; }
  if (outcome.status !== "pending_approval") { res.status(409).json({ error: "Only pending outcomes can be approved." }); return; }
  const [saved] = await db.update(managedWorkOutcomesTable).set({ status: "approved", updated_at: new Date() }).where(eq(managedWorkOutcomesTable.id, id)).returning();
  if (saved) await db.insert(managedWorkOutcomeEventsTable).values({ outcome_id: id, project_key: saved.project_key, actor: "Markus", event_type: "outcome_approved", details: { version: saved.version } });
  res.json(saved);
});

router.get("/work-readiness", async (_req, res): Promise<void> => {
  const config = await readDispatchConfig();
  const readiness = dispatchReadiness(config);
  const ambiguous = await db.select({ id: managedWorkDispatchesTable.id, work_item_id: managedWorkDispatchesTable.work_item_id })
    .from(managedWorkDispatchesTable).where(inArray(managedWorkDispatchesTable.status, ["submitting", "needs_owner"])).limit(20);
  res.json({
    ...readiness,
    status: readiness.dispatch_enabled ? "manual_dispatch_ready" : "blocked",
    blockers: [...readiness.blockers, ...(ambiguous.length ? ["Prior dispatch is ambiguous; owner review is required before any further dispatch."] : [])],
    ambiguous_dispatches: ambiguous,
    automatic_pickup: false,
    finance_hold: "DDG Finance remains hard-held until Claude review and Markus approval.",
    local_limits: "Dashboard records enforce deadlines, time/attempt caps, and zero app-side spend; provider billing limits remain owner-verified.",
  });
});

router.post("/work-items", async (req, res): Promise<void> => {
  const b = req.body;
  const validList = (v: unknown) => Array.isArray(v) && v.length > 0 && v.length <= 20 && v.every((x) => typeof x === "string" && x.trim().length > 0 && x.length <= 500);
  if (!b || !WORK_KEYS.includes(b.project_key) || typeof b.title !== "string" || !b.title.trim() || b.title.length > 160 ||
      typeof b.objective !== "string" || !b.objective.trim() || b.objective.length > 1000 ||
      typeof b.outcome !== "string" || !b.outcome.trim() || b.outcome.length > 1000 ||
      !validList(b.checklist) || !validList(b.acceptance_checks) ||
      typeof b.deadline !== "string" || !Number.isFinite(Date.parse(b.deadline)) || Date.parse(b.deadline) <= Date.now() ||
      !Number.isInteger(b.time_limit_minutes) || b.time_limit_minutes < 5 || b.time_limit_minutes > 1440 ||
      !Number.isInteger(b.max_attempts) || b.max_attempts < 1 || b.max_attempts > 10 ||
      b.spend_limit_cents !== 0 || typeof b.stop_condition !== "string" || !b.stop_condition.trim() || b.stop_condition.length > 1000 ||
      !Number.isSafeInteger(b.outcome_id) || typeof b.gate_key !== "string" || !b.gate_key.trim() ||
      typeof b.repository !== "string" || !b.repository.trim() || typeof b.target_branch !== "string" ||
      !/^[A-Za-z0-9._/-]{1,200}$/.test(b.target_branch)) {
    res.status(400).json({ error: "Provide an outcome/gate, repository, target branch, bounded objective and checklist, future deadline, time limit, attempt limit, zero app spend, and stop condition." });
    return;
  }
  if (!(await isProjectWorkEnabled(b.project_key))) {
    res.status(423).json({ error: "Project work is OFF. Enable it before queuing work." });
    return;
  }
  const [outcome] = await db.select().from(managedWorkOutcomesTable).where(eq(managedWorkOutcomesTable.id, b.outcome_id)).limit(1);
  if (!outcome || outcome.project_key !== b.project_key || outcome.status !== "pending_approval" ||
      !outcome.gates.some((gate) => gate.key === b.gate_key)) {
    res.status(400).json({ error: "The outcome gate must exist and belong to this project's pending outcome." });
    return;
  }
  const [project] = await db.select({ id: projectsTable.id }).from(projectsTable).where(eq(projectsTable.slug, b.project_key)).limit(1);
  if (b.project_key !== "ddg-control-ai-stack" && !project) {
    res.status(400).json({ error: "Project is unavailable." });
    return;
  }
  if (b.goal_id != null) {
    const [goal] = await db.select({ project_id: goalsTable.project_id }).from(goalsTable).where(eq(goalsTable.id, b.goal_id)).limit(1);
    if (!goal || goal.project_id !== project?.id) {
      res.status(400).json({ error: "Outcome must belong to the selected project." });
      return;
    }
  }
  const [item] = await db.insert(managedWorkItemsTable).values({
    project_key: b.project_key, project_id: project?.id ?? null, goal_id: b.goal_id ?? null,
    outcome_id: outcome.id, gate_key: b.gate_key, repository: b.repository.trim().toLowerCase(),
    target_branch: b.target_branch.trim(), dispatch_state: "disabled",
    dispatch_block_reason: "Dispatch stays OFF until account, model, spend, project/repository/branch, and enforceable run-stop checks are verified.",
    title: b.title.trim(), objective: b.objective.trim(), outcome: b.outcome.trim(),
    checklist: b.checklist, acceptance_checks: b.acceptance_checks,
    deadline: new Date(b.deadline), time_limit_minutes: b.time_limit_minutes,
    max_attempts: b.max_attempts, spend_limit_cents: 0, stop_condition: b.stop_condition.trim(),
  }).returning();
  if (!item) { res.status(500).json({ error: "Could not queue work." }); return; }
  await db.insert(managedWorkEventsTable).values({ work_item_id: item.id, project_key: item.project_key, actor: "Markus", event_type: "created_pending_approval", to_status: item.status, details: { title: item.title } });
  res.status(201).json(item);
});

router.post("/work-items/:id/approve", requireRealOwnerSession, async (req, res): Promise<void> => {
  const id = Number(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
  const readiness = dispatchReadiness(await readDispatchConfig());
  if (!readiness.dispatch_enabled) {
    res.status(423).json({ error: "Approval is held until dispatch readiness is verified.", blockers: readiness.blockers });
    return;
  }
  const result = await db.transaction(async (tx) => {
    const [item] = await tx.select().from(managedWorkItemsTable).where(eq(managedWorkItemsTable.id, id)).for("update").limit(1);
    if (!item) return { kind: "missing" as const };
    if (!(await isProjectWorkEnabled(item.project_key))) return { kind: "off" as const };
    if (item.status === "approved") return { kind: "ok" as const, item };
    if (item.status !== "pending_approval") return { kind: "state" as const };
    if (item.outcome_id) {
      const [outcome] = await tx.select().from(managedWorkOutcomesTable).where(eq(managedWorkOutcomesTable.id, item.outcome_id)).limit(1);
      if (!outcome || outcome.project_key !== item.project_key || outcome.status !== "approved") return { kind: "state" as const };
    } else return { kind: "state" as const };
    const [active] = await tx.select({ id: managedWorkItemsTable.id }).from(managedWorkItemsTable).where(and(eq(managedWorkItemsTable.project_key, item.project_key), inArray(managedWorkItemsTable.status, ["approved", "in_progress"]))).limit(1);
    if (active) return { kind: "duplicate" as const };
    const [activeRepo] = await tx.select({ id: managedWorkItemsTable.id }).from(managedWorkItemsTable).where(and(eq(managedWorkItemsTable.repository, item.repository!), ne(managedWorkItemsTable.id, id), inArray(managedWorkItemsTable.status, ["approved", "in_progress"]))).limit(1);
    if (item.repository && activeRepo) return { kind: "duplicate" as const };
    const [updated] = await tx.update(managedWorkItemsTable).set({ status: "approved", updated_at: new Date() }).where(eq(managedWorkItemsTable.id, id)).returning();
    await tx.insert(managedWorkEventsTable).values({ work_item_id: id, project_key: item.project_key, actor: "Markus", event_type: "approved", from_status: item.status, to_status: "approved" });
    return { kind: "ok" as const, item: updated };
  });
  if (result.kind !== "ok") {
    const status = result.kind === "missing" ? 404 : result.kind === "off" ? 423 : 409;
    res.status(status).json({ error: result.kind === "off" ? "Project work is OFF." : result.kind === "duplicate" ? "An active work item already exists for this project or repository." : result.kind === "state" ? "Outcome must be owner-approved before its task can be approved." : "Work item not found." });
    return;
  }
  res.json(result.item);
});

router.post("/work-items/:id/dispatch", requireRealOwnerSession, async (req, res): Promise<void> => {
  const id = Number(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
  if (!Number.isSafeInteger(id) || id < 1) { res.status(400).json({ error: "Invalid work item." }); return; }
  const config = await readDispatchConfig();
  const readiness = dispatchReadiness(config);
  if (!readiness.dispatch_enabled) { res.status(423).json({ error: "Dispatch is blocked.", blockers: readiness.blockers }); return; }
  const reservation = await db.transaction(async (tx) => {
    const [item] = await tx.select().from(managedWorkItemsTable).where(eq(managedWorkItemsTable.id, id)).for("update").limit(1);
    if (!item) return { kind: "missing" as const };
    if (!(await isProjectWorkEnabled(item.project_key))) return { kind: "off" as const };
    const normalizeRepository = (value: string | null) => value?.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\.git$/, "").replace(/\/$/, "") ?? "";
    if (item.project_key === "finance" || item.project_key !== config.approved_project_key || !item.repository || !item.target_branch ||
        normalizeRepository(item.repository) !== normalizeRepository(config.approved_repository) ||
        item.target_branch !== config.approved_starting_branch || item.status !== "approved" ||
        item.attempts >= item.max_attempts || item.spend_limit_cents !== 0 || new Date() >= item.deadline) return { kind: "not_ready" as const };
    const [outcome] = await tx.select().from(managedWorkOutcomesTable).where(eq(managedWorkOutcomesTable.id, item.outcome_id!)).limit(1);
    if (!outcome || outcome.project_key !== item.project_key || outcome.status !== "approved") return { kind: "not_ready" as const };
    const [prior] = await tx.select({ id: managedWorkDispatchesTable.id, status: managedWorkDispatchesTable.status }).from(managedWorkDispatchesTable).where(eq(managedWorkDispatchesTable.work_item_id, id)).limit(1);
    if (prior) return { kind: "duplicate" as const, status: prior.status };
    const [repoActive] = await tx.select({ id: managedWorkItemsTable.id }).from(managedWorkItemsTable)
      .where(and(eq(managedWorkItemsTable.repository, item.repository), ne(managedWorkItemsTable.id, id), inArray(managedWorkItemsTable.status, ["approved", "in_progress"]))).limit(1);
    if (repoActive) return { kind: "duplicate" as const, status: "repository_active" };
    const idempotencyKey = randomUUID();
    const [dispatch] = await tx.insert(managedWorkDispatchesTable).values({
      work_item_id: id, project_key: item.project_key, outcome_id: outcome.id, outcome_version: outcome.version,
      idempotency_key: idempotencyKey, model_id: config.selected_model_id, branch: item.target_branch,
      status: "submitting", started_at: new Date(),
    }).returning();
    await tx.update(managedWorkItemsTable).set({ attempts: item.attempts + 1, started_at: new Date(), updated_at: new Date() }).where(eq(managedWorkItemsTable.id, id));
    await tx.insert(managedWorkEventsTable).values({ work_item_id: id, project_key: item.project_key, actor: "Markus", event_type: "dispatch_reserved", from_status: "approved", to_status: "approved", details: { dispatch_id: dispatch.id, idempotency_key: idempotencyKey, outcome_version: outcome.version } });
    return { kind: "reserved" as const, item, dispatch };
  });
  if (reservation.kind !== "reserved") {
    const status = reservation.kind === "missing" ? 404 : reservation.kind === "off" ? 423 : 409;
    res.status(status).json({ error: reservation.kind === "off" ? "Project work is OFF." : reservation.kind === "duplicate" ? "A dispatch already exists or same-repository work is active; inspect history, do not retry." : reservation.kind === "not_ready" ? "Task is not owner-approved and Ready." : "Work item not found.", ...(reservation.kind === "duplicate" ? { dispatch_status: reservation.status } : {}) });
    return;
  }
  const apiKey = process.env.CURSOR_API_KEY?.trim();
  if (!apiKey) {
    await db.update(managedWorkDispatchesTable).set({ status: "needs_owner", error_summary: "Server secret missing after reservation; do not retry automatically." }).where(eq(managedWorkDispatchesTable.id, reservation.dispatch.id));
    res.status(503).json({ error: "Dispatch reserved but server secret is unavailable; owner review required." });
    return;
  }
  try {
    const suspicious = /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|(?:gh[pousr]_[A-Za-z0-9]{20,}|xai-[A-Za-z0-9_-]{20,}|sk-[A-Za-z0-9_-]{20,}|Bearer\s+[A-Za-z0-9._-]{16,})/i;
    const promptText = [reservation.item.objective, reservation.item.outcome, reservation.item.stop_condition, ...reservation.item.checklist, ...reservation.item.acceptance_checks].join("\n");
    if (suspicious.test(promptText)) throw new Error("Task contains a credential-like string; dispatch refused.");
    const agentUuid = reservation.dispatch.idempotency_key;
    const payload = buildCursorAgentPayload({
      task: {
        ...reservation.item,
        repository: reservation.item.repository!,
        target_branch: reservation.item.target_branch!,
      },
      modelId: config.selected_model_id!,
      agentId: `bc-${agentUuid}`,
    });
    const result = await createCursorAgent(apiKey, payload);
    await db.update(managedWorkDispatchesTable).set({ agent_id: result.agentId, run_id: result.runId, provider_status: result.runStatus, status: "running" }).where(eq(managedWorkDispatchesTable.id, reservation.dispatch.id));
    await db.update(managedWorkItemsTable).set({ status: "in_progress", branch: reservation.item.target_branch, updated_at: new Date() }).where(eq(managedWorkItemsTable.id, id));
    await db.insert(managedWorkEventsTable).values({ work_item_id: id, project_key: reservation.item.project_key, actor: "Markus", event_type: "cursor_dispatch_started", from_status: "approved", to_status: "in_progress", details: { dispatch_id: reservation.dispatch.id, provider: "cursor", model_id: config.selected_model_id, agent_id: result.agentId, run_id: result.runId, run_status: result.runStatus, branch: reservation.item.target_branch } });
    res.status(202).json({ dispatch_id: reservation.dispatch.id, work_item_id: id, provider: "cursor", model_id: config.selected_model_id, agent_id: result.agentId, run_id: result.runId, status: result.runStatus, automatic_pickup: false });
  } catch (error) {
    const summary = error instanceof Error ? error.message.slice(0, 500) : "Unknown dispatch result.";
    await db.update(managedWorkDispatchesTable).set({ status: "needs_owner", error_summary: `${summary} No automatic retry; inspect Cursor before any next action.` }).where(eq(managedWorkDispatchesTable.id, reservation.dispatch.id));
    await db.insert(managedWorkEventsTable).values({ work_item_id: id, project_key: reservation.item.project_key, actor: "system", event_type: "cursor_dispatch_needs_owner", from_status: "approved", to_status: "approved", details: { dispatch_id: reservation.dispatch.id, error: summary } });
    res.status(502).json({ error: "Cursor request outcome requires owner review. The reservation prevents duplicate submission." });
  }
});

router.patch("/work-items/:id/status", async (req, res): Promise<void> => {
  const id = Number(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
  const next = req.body?.status;
  if (!Number.isSafeInteger(id) || id < 1 || !workStatuses.includes(next)) { res.status(400).json({ error: "Invalid work item or status." }); return; }
  const result = await db.transaction(async (tx) => {
    const [item] = await tx.select().from(managedWorkItemsTable).where(eq(managedWorkItemsTable.id, id)).for("update").limit(1);
    if (!item) return { kind: "missing" as const };
    if (!(await isProjectWorkEnabled(item.project_key))) return { kind: "off" as const };
    if (next === "in_progress") return { kind: "blocked" as const };
    if (item.status === next) return { kind: "ok" as const, item };
    const permitted = (item.status === "approved" && next === "in_progress") ||
      (item.status === "in_progress" && ["needs_owner", "failed", "completed"].includes(next)) ||
      (item.status === "needs_owner" && ["approved", "rejected"].includes(next));
    if (!permitted) return { kind: "transition" as const };
    if (next === "completed" && !(typeof req.body?.acceptance_evidence === "string" && req.body.acceptance_evidence.trim())) return { kind: "evidence" as const };
    if (next === "in_progress" && (item.attempts >= item.max_attempts || new Date() > item.deadline)) return { kind: "limit" as const };
    if (item.started_at && Date.now() - item.started_at.getTime() > item.time_limit_minutes * 60_000 && !["needs_owner", "failed"].includes(next)) return { kind: "limit" as const };
    const [updated] = await tx.update(managedWorkItemsTable).set({
      status: next, updated_at: new Date(),
      ...(next === "in_progress" ? { attempts: item.attempts + 1 } : {}),
      ...(next === "in_progress" && !item.started_at ? { started_at: new Date() } : {}),
      ...(typeof req.body?.result === "string" ? { result: req.body.result.slice(0, 4000) } : {}),
      ...(typeof req.body?.acceptance_evidence === "string" ? { acceptance_evidence: req.body.acceptance_evidence.slice(0, 4000) } : {}),
      ...(typeof req.body?.branch === "string" ? { branch: req.body.branch.slice(0, 300) } : {}),
      ...(typeof req.body?.commit_ref === "string" ? { commit_ref: req.body.commit_ref.slice(0, 200) } : {}),
      ...(typeof req.body?.review_link === "string" ? { review_link: req.body.review_link.slice(0, 1000) } : {}),
    }).where(eq(managedWorkItemsTable.id, id)).returning();
     await tx.insert(managedWorkEventsTable).values({ work_item_id: id, project_key: item.project_key, actor: "Markus", event_type: "status_changed", from_status: item.status, to_status: next, details: { result_recorded: typeof req.body?.result === "string", acceptance_evidence_recorded: typeof req.body?.acceptance_evidence === "string" } });
     if (["needs_owner", "failed", "completed"].includes(next)) {
       const dispatchStatus = next === "completed" ? "completed" : next === "failed" ? "failed" : "needs_owner";
       await tx.update(managedWorkDispatchesTable).set({
         status: dispatchStatus,
         error_summary: next === "failed" ? "Owner marked work failed." : next === "needs_owner" ? "Owner requested review." : "",
         ...(next === "failed" || next === "completed" ? { finished_at: new Date() } : {}),
       }).where(and(eq(managedWorkDispatchesTable.work_item_id, id), eq(managedWorkDispatchesTable.status, "running")));
     }
    return { kind: "ok" as const, item: updated };
  });
  if (result.kind !== "ok") {
    const status = result.kind === "missing" ? 404 : result.kind === "off" || result.kind === "blocked" ? 423 : result.kind === "limit" || result.kind === "evidence" ? 409 : 409;
    res.status(status).json({ error: result.kind === "off" ? "Project work is OFF." : result.kind === "blocked" ? "No eligible worker is connected; in-progress cannot be claimed." : result.kind === "limit" ? "Deadline or attempt limit reached; owner review required." : result.kind === "evidence" ? "Acceptance evidence is required before completion." : result.kind === "transition" ? "Invalid status transition." : "Work item not found." });
    return;
  }
  res.json(result.item);
});

router.get("/work-controls", async (_req, res): Promise<void> => {
  for (const project_key of WORK_KEYS) {
    await db.insert(projectWorkControlsTable).values({ project_key }).onConflictDoNothing();
  }
  const controls = await db.select().from(projectWorkControlsTable);
  const audit = await db.select().from(projectWorkAuditTable).orderBy(desc(projectWorkAuditTable.created_at)).limit(30);
  res.json({ controls, audit });
});

router.patch("/work-controls/:key", async (req, res): Promise<void> => {
  const key = Array.isArray(req.params.key) ? req.params.key[0] : req.params.key;
  if (!WORK_KEYS.includes(key as WorkKey) || typeof req.body?.enabled !== "boolean") {
    res.status(400).json({ error: "Choose a valid work area and enabled state." });
    return;
  }
  const enabled = req.body.enabled as boolean;
  if (key === "finance" && enabled && FINANCE_REVIEW_REQUIRED) {
    res.status(423).json({ error: "Finance work remains OFF until Claude's later review. Trading logic and strategies are not changed here." });
    return;
  }
  const [previous] = await db.select({ completed: projectWorkControlsTable.completed })
    .from(projectWorkControlsTable).where(eq(projectWorkControlsTable.project_key, key)).limit(1);
  if (enabled && previous?.completed) {
    res.status(409).json({ error: "This project is owner-completed. Reopen it explicitly before enabling work." });
    return;
  }
  await db.transaction(async (tx) => {
    await tx.insert(projectWorkControlsTable).values({ project_key: key, enabled })
      .onConflictDoUpdate({ target: projectWorkControlsTable.project_key, set: { enabled, updated_by: "Markus", updated_at: new Date() } });
    await tx.insert(projectWorkAuditTable).values({ project_key: key, enabled, owner_confirmed: true, event_type: enabled ? "work_enabled" : "work_disabled" });
  });
  // This router is mounted after requireAuth; identity comes from the verified
  // session, never from a client-supplied confirmation field.
  const [control] = await db.select().from(projectWorkControlsTable).where(eq(projectWorkControlsTable.project_key, key)).limit(1);
  res.json(control);
});

router.post("/work-controls/:key/complete", async (req, res): Promise<void> => {
  const key = Array.isArray(req.params.key) ? req.params.key[0] : req.params.key;
  if (!WORK_KEYS.includes(key as WorkKey)) { res.status(404).json({ error: "Unknown project." }); return; }
  const [open] = await db.select({ id: managedWorkItemsTable.id }).from(managedWorkItemsTable)
    .where(and(eq(managedWorkItemsTable.project_key, key), inArray(managedWorkItemsTable.status, ["pending_approval", "approved", "in_progress", "needs_owner", "failed"]))).limit(1);
  if (open) { res.status(409).json({ error: "Resolve every queued, active, failed, or owner-needed item before completing this project." }); return; }
  await db.insert(projectWorkControlsTable).values({ project_key: key }).onConflictDoNothing();
  await db.update(projectWorkControlsTable).set({ completed: true, enabled: false, updated_by: "Markus", updated_at: new Date() }).where(eq(projectWorkControlsTable.project_key, key));
  await db.insert(projectWorkAuditTable).values({ project_key: key, enabled: false, owner_confirmed: true, event_type: "project_completed" });
  res.json({ project_key: key, completed: true, enabled: false });
});

router.get("/work-handovers", async (req, res): Promise<void> => {
  const key = typeof req.query.project_key === "string" ? req.query.project_key : null;
  const query = db.select({
    id: projectHandoverTable.id, project_key: projectHandoverTable.project_key,
    project_id: projectHandoverTable.project_id, task_id: projectHandoverTable.task_id,
    work_item_id: projectHandoverTable.work_item_id,
    branch: projectHandoverTable.branch, commit_ref: projectHandoverTable.commit_ref,
    status: projectHandoverTable.status, completed_work: projectHandoverTable.completed_work,
    next_action: projectHandoverTable.next_action, blockers: projectHandoverTable.blockers,
    verification: projectHandoverTable.verification, recovery_note: projectHandoverTable.recovery_note,
    created_at: projectHandoverTable.created_at,
  }).from(projectHandoverTable);
  const rows = key ? await query.where(eq(projectHandoverTable.project_key, key)).orderBy(desc(projectHandoverTable.created_at)).limit(50) : await query.orderBy(desc(projectHandoverTable.created_at)).limit(100);
  res.json(rows);
});

router.get("/work-handover-events", async (_req, res): Promise<void> => {
  const events = await db.select().from(projectHandoverEventsTable)
    .orderBy(desc(projectHandoverEventsTable.created_at)).limit(100);
  res.json(events);
});

router.post("/work-handovers", async (req, res): Promise<void> => {
  const b = req.body;
  if (!b || !WORK_KEYS.includes(b.project_key) || typeof b.status !== "string" || typeof b.completed_work !== "string" || typeof b.next_action !== "string" || typeof b.recovery_note !== "string" || typeof b.blockers !== "string" || typeof b.verification !== "string" || (b.branch != null && typeof b.branch !== "string") || (b.commit_ref != null && typeof b.commit_ref !== "string") || (b.task_id != null && !Number.isInteger(b.task_id)) || (b.work_item_id != null && !Number.isInteger(b.work_item_id))) {
    res.status(400).json({ error: "Provide project, status, completed work, next action, blockers, verification, and recovery note." });
    return;
  }
  if (b.project_key === "finance" && FINANCE_REVIEW_REQUIRED) {
    res.status(423).json({ error: "Finance checkpoints are held until Claude's later review." });
    return;
  }
  if (!(await isProjectWorkEnabled(b.project_key))) {
    res.status(423).json({ error: "Project work is OFF. New checkpoints are paused." });
    return;
  }
  const [project] = await db.select({ id: projectsTable.id }).from(projectsTable).where(eq(projectsTable.slug, b.project_key)).limit(1);
  if (b.task_id != null) {
    if (!project) {
      res.status(400).json({ error: "Control-only handovers cannot reference a task." });
      return;
    }
    const [task] = await db.select({ project_id: tasksTable.project_id }).from(tasksTable).where(eq(tasksTable.id, b.task_id)).limit(1);
    if (!task || task.project_id !== project.id) {
      res.status(400).json({ error: "The task must belong to the selected project." });
      return;
    }
  }
  if (b.work_item_id != null) {
    const [item] = await db.select({ project_key: managedWorkItemsTable.project_key }).from(managedWorkItemsTable).where(eq(managedWorkItemsTable.id, b.work_item_id)).limit(1);
    if (!item || item.project_key !== b.project_key) {
      res.status(400).json({ error: "The work item must belong to the selected project." });
      return;
    }
  }
  const [saved] = await db.insert(projectHandoverTable).values({
    project_key: b.project_key, project_id: project?.id ?? null, task_id: b.task_id ?? null, work_item_id: b.work_item_id ?? null,
    branch: b.branch ?? null, commit_ref: b.commit_ref ?? null, status: b.status,
    completed_work: b.completed_work, next_action: b.next_action, blockers: b.blockers,
    verification: b.verification, recovery_note: b.recovery_note,
  }).returning();
  if (saved) await db.insert(projectHandoverEventsTable).values({
    checkpoint_id: saved.id, project_key: saved.project_key, task_id: saved.task_id,
    actor: "Markus", event_type: "checkpoint_saved", details: { status: saved.status, work_item_id: saved.work_item_id },
  });
  res.status(201).json(saved);
});

router.post("/work-handovers/:id/resume", async (req, res): Promise<void> => {
  const id = Number(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
  if (!Number.isSafeInteger(id) || id < 1) {
    res.status(400).json({ error: "Invalid checkpoint id." });
    return;
  }
  const [checkpoint] = await db.select().from(projectHandoverTable).where(eq(projectHandoverTable.id, id)).limit(1);
  if (!checkpoint) {
    res.status(404).json({ error: "Checkpoint not found." });
    return;
  }
  if (!(await isProjectWorkEnabled(checkpoint.project_key))) {
    res.status(423).json({ error: "Project work is OFF. Enable it before resuming work." });
    return;
  }
  if (checkpoint.task_id != null) {
    const [task] = await db.select({ project_id: tasksTable.project_id, status: tasksTable.status }).from(tasksTable).where(eq(tasksTable.id, checkpoint.task_id)).limit(1);
    if (!task || task.project_id !== checkpoint.project_id || task.status === "done") {
      res.status(409).json({ error: "The linked task is missing, belongs to another project, or is already complete." });
      return;
    }
  }
  if (checkpoint.work_item_id != null) {
    const [item] = await db.select().from(managedWorkItemsTable).where(eq(managedWorkItemsTable.id, checkpoint.work_item_id)).limit(1);
    if (!item || item.project_key !== checkpoint.project_key || ["completed", "failed", "rejected"].includes(item.status)) {
      res.status(409).json({ error: "The linked work item is not resumable." });
      return;
    }
    if (item.status === "needs_owner") {
      const [alreadyActive] = await db.select({ id: managedWorkItemsTable.id }).from(managedWorkItemsTable)
        .where(and(eq(managedWorkItemsTable.project_key, item.project_key), inArray(managedWorkItemsTable.status, ["approved", "in_progress"]))).limit(1);
      if (alreadyActive) {
        res.status(409).json({ error: "Another work item is active for this project." });
        return;
      }
      await db.update(managedWorkItemsTable).set({ status: "approved", updated_at: new Date() }).where(eq(managedWorkItemsTable.id, item.id));
      await db.insert(managedWorkEventsTable).values({ work_item_id: item.id, project_key: item.project_key, actor: "Markus", event_type: "resumed_from_checkpoint", from_status: "needs_owner", to_status: "approved", details: { checkpoint_id: checkpoint.id } });
    }
  }
  await db.insert(projectHandoverEventsTable).values({
    checkpoint_id: checkpoint.id, project_key: checkpoint.project_key, task_id: checkpoint.task_id,
    actor: "Markus", event_type: "resume_requested",
    details: { work_item_id: checkpoint.work_item_id, from_status: checkpoint.status, to_status: "resume_ready" },
  });
  res.json({
    checkpoint_id: checkpoint.id,
    project_key: checkpoint.project_key,
    task_id: checkpoint.task_id,
    next_action: checkpoint.next_action,
    blockers: checkpoint.blockers,
    recovery_note: checkpoint.recovery_note,
    status: "ready_to_resume",
    agent_started: false,
  });
});

export default router;
