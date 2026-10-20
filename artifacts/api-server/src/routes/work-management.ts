import { randomUUID } from "node:crypto";
import { db, goalsTable, managedFleetQuestionsTable, managedWorkDispatchConfigTable, managedWorkDispatchesTable, managedWorkEventsTable, managedWorkItemsTable, managedWorkOutcomeEventsTable, managedWorkOutcomesTable, projectHandoverEventsTable, projectHandoverTable, projectWorkAuditTable, projectWorkControlsTable, projectsTable, tasksTable } from "@workspace/db";
import { and, desc, eq, inArray, ne } from "drizzle-orm";
import { Router, type IRouter } from "express";
import { requireRealOwnerSession } from "./auth";
import { buildCursorAgentPayload, createCursorAgent } from "../lib/cursor-dispatch";

export const WORK_KEYS = ["finance", "hypest", "cattle-dog-coffee", "ddg-control-ai-stack"] as const;
export type WorkKey = (typeof WORK_KEYS)[number];
const FINANCE_REVIEW_REQUIRED = true;
const CURSOR_AUTOMATIC_PICKUP = false;
const CURSOR_HARD_WALL_CLOCK_STOP_VERIFIED = false;
// Also fail closed until external termination, global/repository reservations,
// stop barriers and blocking-question synchronization are verified together.
const CURSOR_RUN_SAFETY_VERIFIED = false;
const RUN_SAFETY_BLOCKER = "Dispatch stays blocked: provider termination, global/repository reservation, stop barriers and question synchronization are not verified.";
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
    ...(!CURSOR_RUN_SAFETY_VERIFIED ? [RUN_SAFETY_BLOCKER] : []),
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

export function isProjectWorkHeld(key: string): boolean {
  return key === "finance" && FINANCE_REVIEW_REQUIRED;
}

export async function isProjectWorkEnabled(key: string): Promise<boolean> {
  if (!hasWorkControl(key)) return false;
  if (key === "finance" && FINANCE_REVIEW_REQUIRED) return false;
  const [row] = await db.select({ enabled: projectWorkControlsTable.enabled, completed: projectWorkControlsTable.completed })
    .from(projectWorkControlsTable).where(eq(projectWorkControlsTable.project_key, key)).limit(1);
  return row?.enabled === true && row.completed === false;
}

export type WorkTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

/** Serialize project record changes: control first, then outcome/task rows. */
export async function lockWorkControl(tx: WorkTransaction, key: string) {
  await tx.insert(projectWorkControlsTable).values({ project_key: key }).onConflictDoNothing();
  const [control] = await tx.select().from(projectWorkControlsTable)
    .where(eq(projectWorkControlsTable.project_key, key)).for("update").limit(1);
  return control!;
}

async function lockWorkItem(tx: WorkTransaction, id: number) {
  const [hint] = await tx.select({ project_key: managedWorkItemsTable.project_key }).from(managedWorkItemsTable)
    .where(eq(managedWorkItemsTable.id, id)).limit(1);
  if (!hint || !hasWorkControl(hint.project_key)) return null;
  const control = await lockWorkControl(tx, hint.project_key);
  const [item] = await tx.select().from(managedWorkItemsTable)
    .where(eq(managedWorkItemsTable.id, id)).for("update").limit(1);
  return item ? { item, control } : null;
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
  if (values.enabled && !CURSOR_RUN_SAFETY_VERIFIED) {
    res.status(423).json({ error: RUN_SAFETY_BLOCKER });
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
  if (!Number.isSafeInteger(id) || id < 1) { res.status(400).json({ error: "Invalid outcome." }); return; }
  const result = await db.transaction(async (tx) => {
    const [hint] = await tx.select({ project_key: managedWorkOutcomesTable.project_key }).from(managedWorkOutcomesTable)
      .where(eq(managedWorkOutcomesTable.id, id)).limit(1);
    if (!hint || !hasWorkControl(hint.project_key)) return { kind: "missing" as const };
    const control = await lockWorkControl(tx, hint.project_key);
    if ((hint.project_key === "finance" && FINANCE_REVIEW_REQUIRED) || !control.enabled || control.completed) return { kind: "off" as const };
    const [outcome] = await tx.select().from(managedWorkOutcomesTable).where(eq(managedWorkOutcomesTable.id, id)).for("update").limit(1);
    if (!outcome) return { kind: "missing" as const };
    if (outcome.status === "approved") return { kind: "ok" as const, outcome };
    if (outcome.status !== "pending_approval") return { kind: "state" as const };
    const [saved] = await tx.update(managedWorkOutcomesTable).set({ status: "approved", updated_at: new Date() }).where(eq(managedWorkOutcomesTable.id, id)).returning();
    await tx.insert(managedWorkOutcomeEventsTable).values({ outcome_id: id, project_key: outcome.project_key, actor: "Markus", event_type: "outcome_approved", details: { version: outcome.version } });
    return { kind: "ok" as const, outcome: saved };
  });
  if (result.kind !== "ok") {
    res.status(result.kind === "missing" ? 404 : result.kind === "off" ? 423 : 409).json({
      error: result.kind === "missing" ? "Outcome not found." : result.kind === "off" ? "Project work is OFF, held or complete." : "Only pending outcomes can be approved.",
    }); return;
  }
  res.json(result.outcome);
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

router.post("/work-items", requireRealOwnerSession, async (req, res): Promise<void> => {
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
      (b.goal_id != null && (!Number.isSafeInteger(b.goal_id) || b.goal_id < 1)) ||
      !Number.isSafeInteger(b.outcome_id) || typeof b.gate_key !== "string" || !b.gate_key.trim() ||
      typeof b.repository !== "string" || !b.repository.trim() || typeof b.target_branch !== "string" ||
      !/^[A-Za-z0-9._/-]{1,200}$/.test(b.target_branch)) {
    res.status(400).json({ error: "Provide an outcome/gate, repository, target branch, bounded objective and checklist, future deadline, time limit, attempt limit, zero app spend, and stop condition." });
    return;
  }
  if (b.project_key === "finance" && FINANCE_REVIEW_REQUIRED) {
    res.status(423).json({ error: "Finance work remains held for review." }); return;
  }
  const result = await db.transaction(async (tx) => {
    const control = await lockWorkControl(tx, b.project_key);
    if (!control.enabled || control.completed) return { kind: "off" as const };
    const [outcome] = await tx.select().from(managedWorkOutcomesTable).where(eq(managedWorkOutcomesTable.id, b.outcome_id)).limit(1);
    if (!outcome || outcome.project_key !== b.project_key || !["pending_approval", "approved"].includes(outcome.status) ||
        !outcome.gates.some((gate) => gate.key === b.gate_key)) return { kind: "outcome" as const };
    const [project] = await tx.select({ id: projectsTable.id }).from(projectsTable).where(eq(projectsTable.slug, b.project_key)).limit(1);
    if (b.project_key !== "ddg-control-ai-stack" && !project) return { kind: "project" as const };
    if (b.goal_id != null) {
      const [goal] = await tx.select({ project_id: goalsTable.project_id }).from(goalsTable).where(eq(goalsTable.id, b.goal_id)).limit(1);
      if (!goal || goal.project_id !== project?.id) return { kind: "goal" as const };
    }
    const [item] = await tx.insert(managedWorkItemsTable).values({
      project_key: b.project_key, project_id: project?.id ?? null, goal_id: b.goal_id ?? null,
      outcome_id: outcome.id, gate_key: b.gate_key, repository: b.repository.trim().toLowerCase(),
      target_branch: b.target_branch.trim(), dispatch_state: "disabled",
      dispatch_block_reason: "Dispatch stays OFF until account, model, spend, project/repository/branch, and enforceable run-stop checks are verified.",
      title: b.title.trim(), objective: b.objective.trim(), outcome: b.outcome.trim(),
      checklist: b.checklist, acceptance_checks: b.acceptance_checks,
      deadline: new Date(b.deadline), time_limit_minutes: b.time_limit_minutes,
      max_attempts: b.max_attempts, spend_limit_cents: 0, stop_condition: b.stop_condition.trim(),
    }).onConflictDoNothing().returning();
    if (!item) return { kind: "duplicate" as const };
    await tx.insert(managedWorkEventsTable).values({ work_item_id: item.id, project_key: item.project_key, actor: "Markus", event_type: "created_pending_approval", to_status: item.status, details: { title: item.title } });
    return { kind: "ok" as const, item };
  });
  if (result.kind !== "ok") {
    res.status(result.kind === "off" ? 423 : result.kind === "duplicate" ? 409 : 400).json({
      error: result.kind === "off" ? "Project work is OFF or complete. New work cannot be queued." :
        result.kind === "outcome" ? "The outcome gate must belong to this project's pending or approved outcome." :
        result.kind === "project" ? "Project is unavailable." : result.kind === "goal" ? "Goal must belong to the selected project." :
        "A task already exists for this outcome gate; inspect the saved task instead of queuing it again.",
    });
    return;
  }
  res.status(201).json(result.item);
});

router.post("/work-items/:id/approve", requireRealOwnerSession, async (req, res): Promise<void> => {
  const id = Number(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
  const b = req.body;
  if (!Number.isSafeInteger(id) || id < 1 || !b || typeof b !== "object" || Array.isArray(b) ||
      Object.keys(b).some((key) => !["expected_plan_version", "expected_outcome_version"].includes(key)) ||
      !Number.isSafeInteger(b.expected_plan_version) || b.expected_plan_version < 1 ||
      !Number.isSafeInteger(b.expected_outcome_version) || b.expected_outcome_version < 1) {
    res.status(400).json({ error: "Select the exact task plan and outcome versions before approving." }); return;
  }
  const readiness = dispatchReadiness(await readDispatchConfig());
  if (!readiness.dispatch_enabled) {
    res.status(423).json({ error: "Approval is held until dispatch readiness is verified.", blockers: readiness.blockers });
    return;
  }
  const result = await db.transaction(async (tx) => {
    const locked = await lockWorkItem(tx, id);
    if (!locked) return { kind: "missing" as const };
    const { item, control } = locked;
    if ((item.project_key === "finance" && FINANCE_REVIEW_REQUIRED) || !control.enabled || control.completed) return { kind: "off" as const };
    const [outcome] = item.outcome_id
      ? await tx.select().from(managedWorkOutcomesTable).where(eq(managedWorkOutcomesTable.id, item.outcome_id)).limit(1)
      : [];
    if (!outcome || outcome.project_key !== item.project_key || outcome.status !== "approved") return { kind: "state" as const };
    if ((item.plan_version ?? 1) !== b.expected_plan_version || outcome.version !== b.expected_outcome_version) {
      return { kind: "stale" as const };
    }
    if (item.status === "approved") return { kind: "ok" as const, item };
    if (item.status !== "pending_approval") return { kind: "state" as const };
    const [blockingQuestion] = await tx.select({ id: managedFleetQuestionsTable.id }).from(managedFleetQuestionsTable)
      .where(and(eq(managedFleetQuestionsTable.project_key, item.project_key), eq(managedFleetQuestionsTable.work_item_id, item.id),
        eq(managedFleetQuestionsTable.plan_version, item.plan_version ?? 1), eq(managedFleetQuestionsTable.blocks_work, true), eq(managedFleetQuestionsTable.status, "open"))).limit(1);
    if (blockingQuestion) return { kind: "question" as const };
    const [active] = await tx.select({ id: managedWorkItemsTable.id }).from(managedWorkItemsTable).where(and(eq(managedWorkItemsTable.project_key, item.project_key), inArray(managedWorkItemsTable.status, ["approved", "in_progress"]))).limit(1);
    if (active) return { kind: "duplicate" as const };
    const [activeRepo] = await tx.select({ id: managedWorkItemsTable.id }).from(managedWorkItemsTable).where(and(eq(managedWorkItemsTable.repository, item.repository!), ne(managedWorkItemsTable.id, id), inArray(managedWorkItemsTable.status, ["approved", "in_progress"]))).limit(1);
    if (item.repository && activeRepo) return { kind: "duplicate" as const };
    const [updated] = await tx.update(managedWorkItemsTable).set({ status: "approved", updated_at: new Date() }).where(eq(managedWorkItemsTable.id, id)).returning();
    await tx.insert(managedWorkEventsTable).values({ work_item_id: id, project_key: item.project_key, actor: "Markus", event_type: "approved", from_status: item.status, to_status: "approved", details: { plan_version: item.plan_version ?? 1, outcome_id: outcome.id, outcome_version: outcome.version } });
    return { kind: "ok" as const, item: updated };
  });
  if (result.kind !== "ok") {
    const status = result.kind === "missing" ? 404 : result.kind === "off" || result.kind === "question" ? 423 : 409;
    res.status(status).json({ error: result.kind === "off" ? "Project work is OFF." : result.kind === "question" ? "A blocking owner question is still open for this task version." : result.kind === "duplicate" ? "An active work item already exists for this project or repository." : result.kind === "stale" ? "The task plan or outcome changed. Refresh and review the current versions before approving." : result.kind === "state" ? "Outcome must be owner-approved before its task can be approved." : "Work item not found." });
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
    const locked = await lockWorkItem(tx, id);
    if (!locked) return { kind: "missing" as const };
    const { item, control } = locked;
    if ((item.project_key === "finance" && FINANCE_REVIEW_REQUIRED) || !control.enabled || control.completed) return { kind: "off" as const };
    const [blockingQuestion] = await tx.select({ id: managedFleetQuestionsTable.id }).from(managedFleetQuestionsTable)
      .where(and(eq(managedFleetQuestionsTable.project_key, item.project_key), eq(managedFleetQuestionsTable.work_item_id, item.id),
        eq(managedFleetQuestionsTable.plan_version, item.plan_version ?? 1), eq(managedFleetQuestionsTable.blocks_work, true), eq(managedFleetQuestionsTable.status, "open"))).limit(1);
    if (blockingQuestion) return { kind: "question" as const };
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
    const status = reservation.kind === "missing" ? 404 : reservation.kind === "off" || reservation.kind === "question" ? 423 : 409;
    res.status(status).json({ error: reservation.kind === "off" ? "Project work is OFF." : reservation.kind === "question" ? "A blocking owner question is still open for this task version." : reservation.kind === "duplicate" ? "A dispatch already exists or same-repository work is active; inspect history, do not retry." : reservation.kind === "not_ready" ? "Task is not owner-approved and Ready." : "Work item not found.", ...(reservation.kind === "duplicate" ? { dispatch_status: reservation.status } : {}) });
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

router.patch("/work-items/:id/status", requireRealOwnerSession, async (req, res): Promise<void> => {
  const id = Number(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
  const next = req.body?.status;
  if (!Number.isSafeInteger(id) || id < 1 || !workStatuses.includes(next)) { res.status(400).json({ error: "Invalid work item or status." }); return; }
  const result = await db.transaction(async (tx) => {
    const locked = await lockWorkItem(tx, id);
    if (!locked) return { kind: "missing" as const };
    const { item, control } = locked;
    if (item.project_key === "finance" && FINANCE_REVIEW_REQUIRED) return { kind: "off" as const };
    // A status edit must never stand in for readiness checks, approval or dispatch.
    if (next === "approved" || next === "in_progress") return { kind: "blocked" as const };
    if (item.status === next) return { kind: "ok" as const, item };
    const recovery = ["needs_owner", "failed", "completed", "rejected"].includes(next);
    if ((!control.enabled || control.completed) && !recovery) return { kind: "off" as const };
    const permitted =
      (["pending_approval", "approved"].includes(item.status) && next === "rejected") ||
      (item.status === "approved" && next === "needs_owner") ||
      (item.status === "in_progress" && ["needs_owner", "failed", "completed"].includes(next)) ||
      (["needs_owner", "failed"].includes(item.status) && next === "rejected");
    if (!permitted) return { kind: "transition" as const };
    const evidence = typeof req.body?.acceptance_evidence === "string" ? req.body.acceptance_evidence.trim().slice(0, 4000) : "";
    if (next === "completed" && !evidence) return { kind: "evidence" as const };
    if (item.started_at && Date.now() - item.started_at.getTime() > item.time_limit_minutes * 60_000 && !["needs_owner", "failed", "rejected"].includes(next)) return { kind: "limit" as const };
    const [updated] = await tx.update(managedWorkItemsTable).set({
      status: next, updated_at: new Date(),
      ...(typeof req.body?.result === "string" ? { result: req.body.result.slice(0, 4000) } : {}),
      ...(evidence ? { acceptance_evidence: evidence } : {}),
      ...(typeof req.body?.branch === "string" ? { branch: req.body.branch.slice(0, 300) } : {}),
      ...(typeof req.body?.commit_ref === "string" ? { commit_ref: req.body.commit_ref.slice(0, 200) } : {}),
      ...(typeof req.body?.review_link === "string" ? { review_link: req.body.review_link.slice(0, 1000) } : {}),
    }).where(eq(managedWorkItemsTable.id, id)).returning();
    await tx.insert(managedWorkEventsTable).values({
      work_item_id: id, project_key: item.project_key, actor: "Markus", event_type: "status_changed",
      from_status: item.status, to_status: next,
      details: { result_recorded: typeof req.body?.result === "string", acceptance_evidence_recorded: Boolean(evidence), work_enabled: control.enabled && !control.completed, provider_status_unmodified: true },
    });
    // Owner task records are separate from provider state. Do not fabricate
    // finished_at, cancellation or external termination from this action.
    return { kind: "ok" as const, item: updated };
  });
  if (result.kind !== "ok") {
    res.status(result.kind === "missing" ? 404 : result.kind === "off" || result.kind === "blocked" ? 423 : 409).json({
      error: result.kind === "off" ? "Project work is OFF or held." :
        result.kind === "blocked" ? "Use the guarded approval/resume/dispatch flow; status edits cannot start or approve work." :
        result.kind === "limit" ? "Time limit reached; save recovery notes and mark owner-needed or failed." :
        result.kind === "evidence" ? "Acceptance evidence is required before completion." :
        result.kind === "transition" ? "Invalid status transition." : "Work item not found.",
    }); return;
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


/** Blocks managed dashboard starts; does not claim provider cancellation. */
router.post("/work-stop", requireRealOwnerSession, async (req, res): Promise<void> => {
  if (req.body?.action !== "block_all_managed_work") {
    res.status(400).json({ error: "Explicitly confirm blocking all managed dashboard work." });
    return;
  }
  const saved = await db.transaction(async (tx) => {
    await tx.insert(managedWorkDispatchConfigTable).values({ id: 1, enabled: false })
      .onConflictDoUpdate({ target: managedWorkDispatchConfigTable.id, set: { enabled: false, updated_by: "Markus", updated_at: new Date() } });
    for (const key of WORK_KEYS) {
      await tx.insert(projectWorkControlsTable).values({ project_key: key, enabled: false })
        .onConflictDoUpdate({ target: projectWorkControlsTable.project_key, set: { enabled: false, updated_by: "Markus", updated_at: new Date() } });
      await tx.insert(projectWorkAuditTable).values({ project_key: key, enabled: false, owner_confirmed: true, event_type: "all_dashboard_work_blocked" });
    }
    const open = await tx.select().from(managedWorkItemsTable)
      .where(inArray(managedWorkItemsTable.status, ["approved", "in_progress", "needs_owner"]));
    for (const item of open) {
      await tx.insert(managedWorkEventsTable).values({
        work_item_id: item.id, project_key: item.project_key, actor: "Markus",
        event_type: "all_dashboard_work_blocked", from_status: item.status, to_status: item.status,
        details: { project_controls_disabled: true, dispatch_disabled: true, provider_cancellation: "not_requested_or_verified" },
      });
    }
    const unresolved = await tx.select({
      id: managedWorkDispatchesTable.id, work_item_id: managedWorkDispatchesTable.work_item_id,
      project_key: managedWorkDispatchesTable.project_key, agent_id: managedWorkDispatchesTable.agent_id,
      run_id: managedWorkDispatchesTable.run_id, status: managedWorkDispatchesTable.status,
    }).from(managedWorkDispatchesTable)
      .where(inArray(managedWorkDispatchesTable.status, ["submitting", "running", "needs_owner"]));
    return { affected_task_records: open.length, unresolved_dispatches: unresolved };
  });
  res.json({
    dashboard_work_blocked: true,
    blocked_project_keys: WORK_KEYS,
    ...saved,
    provider_cancellation: "not_requested_or_verified",
    message: "All managed project controls and dispatch are OFF. In-flight or external work may still be running. Review provider controls manually; no task was marked stopped or completed.",
  });
});

router.patch("/work-controls/:key", requireRealOwnerSession, async (req, res): Promise<void> => {
  const key = Array.isArray(req.params.key) ? req.params.key[0] : req.params.key;
  if (!hasWorkControl(key) || typeof req.body?.enabled !== "boolean") {
    res.status(400).json({ error: "Choose a valid work area and enabled state." }); return;
  }
  const enabled = req.body.enabled as boolean;
  if (key === "finance" && enabled && FINANCE_REVIEW_REQUIRED) {
    res.status(423).json({ error: "Finance work remains OFF until Claude's later review." }); return;
  }
  const result = await db.transaction(async (tx) => {
    const previous = await lockWorkControl(tx, key);
    if (enabled && previous.completed) return { kind: "complete" as const };
    const [control] = await tx.update(projectWorkControlsTable)
      .set({ enabled, updated_by: "Markus", updated_at: new Date() })
      .where(eq(projectWorkControlsTable.project_key, key)).returning();
    await tx.insert(projectWorkAuditTable).values({ project_key: key, enabled, owner_confirmed: true, event_type: enabled ? "work_enabled" : "work_disabled" });
    return { kind: "ok" as const, control };
  });
  if (result.kind === "complete") {
    res.status(409).json({ error: "This project is owner-completed. Reopen it explicitly before enabling work." }); return;
  }
  res.json(result.control);
});

router.post("/work-controls/:key/complete", requireRealOwnerSession, async (req, res): Promise<void> => {
  const key = Array.isArray(req.params.key) ? req.params.key[0] : req.params.key;
  if (!hasWorkControl(key)) { res.status(404).json({ error: "Unknown project." }); return; }
  if (key === "finance" && FINANCE_REVIEW_REQUIRED) {
    res.status(423).json({ error: "Finance completion is held until Claude review and owner release." }); return;
  }
  const result = await db.transaction(async (tx) => {
    const control = await lockWorkControl(tx, key);
    if (control.completed) return { kind: "ok" as const, control };
    const [open] = await tx.select({ id: managedWorkItemsTable.id }).from(managedWorkItemsTable)
      .where(and(eq(managedWorkItemsTable.project_key, key), inArray(managedWorkItemsTable.status, ["pending_approval", "approved", "in_progress", "needs_owner", "failed"]))).limit(1);
    if (open) return { kind: "open" as const };
    const [question] = await tx.select({ id: managedFleetQuestionsTable.id }).from(managedFleetQuestionsTable)
      .where(and(eq(managedFleetQuestionsTable.project_key, key), eq(managedFleetQuestionsTable.blocks_work, true), eq(managedFleetQuestionsTable.status, "open"))).limit(1);
    if (question) return { kind: "question" as const };
    // No trustworthy provider-terminal acknowledgement is connected yet.
    // Legacy local dispatch status/finished_at cannot prove an external run ended.
    const [dispatch] = await tx.select({ id: managedWorkDispatchesTable.id }).from(managedWorkDispatchesTable)
      .where(eq(managedWorkDispatchesTable.project_key, key)).limit(1);
    if (dispatch) return { kind: "provider" as const };
    const outcomes = await tx.select().from(managedWorkOutcomesTable)
      .where(and(eq(managedWorkOutcomesTable.project_key, key), inArray(managedWorkOutcomesTable.status, ["draft", "pending_approval", "approved"])));
    const outcome = outcomes[0];
    if (outcomes.length !== 1 || outcome?.status !== "approved" || !Array.isArray(outcome.gates) || !outcome.gates.length ||
        outcome.gates.some((gate) => !gate || typeof gate.key !== "string" || !gate.key.trim() || !Array.isArray(gate.acceptance) || !gate.acceptance.length || gate.acceptance.some((check) => typeof check !== "string" || !check.trim())) ||
        new Set(outcome.gates.map((gate) => gate.key)).size !== outcome.gates.length) return { kind: "outcome" as const };
    const tasks = await tx.select().from(managedWorkItemsTable)
      .where(and(eq(managedWorkItemsTable.project_key, key), eq(managedWorkItemsTable.outcome_id, outcome.id)));
    const gateTasks = outcome.gates.map((gate) => tasks.find((task) => task.gate_key === gate.key && task.status === "completed" && task.acceptance_evidence.trim()));
    if (gateTasks.some((task) => !task)) return { kind: "evidence" as const };
    const [saved] = await tx.update(projectWorkControlsTable)
      .set({ completed: true, enabled: false, updated_by: "Markus", updated_at: new Date() })
      .where(eq(projectWorkControlsTable.project_key, key)).returning();
    await tx.update(managedWorkOutcomesTable).set({ status: "completed", updated_at: new Date() })
      .where(eq(managedWorkOutcomesTable.id, outcome.id));
    await tx.insert(managedWorkOutcomeEventsTable).values({
      outcome_id: outcome.id, project_key: key, actor: "Markus", event_type: "owner_completed_with_gate_records",
      details: { version: outcome.version, task_ids: gateTasks.map((task) => task!.id), evidence_source: "owner_saved_records", independent_verification: "not_asserted" },
    });
    await tx.insert(projectWorkAuditTable).values({ project_key: key, enabled: false, owner_confirmed: true, event_type: "project_completed" });
    return { kind: "ok" as const, control: saved };
  });
  if (result.kind !== "ok") {
    const errors = {
      open: "Resolve every queued, active, failed, or owner-needed item before completing this project.",
      question: "Resolve all blocking owner questions before completing this project.",
      provider: "Provider-linked work needs independently confirmed run termination. That verification is not connected; project completion remains blocked.",
      outcome: "One owner-approved outcome with valid acceptance gates is required before project completion.",
      evidence: "Every gate needs a completed task with saved acceptance evidence. Saved text is an owner record, not independent verification.",
    };
    res.status(409).json({ error: errors[result.kind] }); return;
  }
  res.json(result.control);
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

router.post("/work-handovers", requireRealOwnerSession, async (req, res): Promise<void> => {
  const b = req.body;
  if (!b || !WORK_KEYS.includes(b.project_key) || typeof b.status !== "string" || typeof b.completed_work !== "string" || typeof b.next_action !== "string" || typeof b.recovery_note !== "string" || typeof b.blockers !== "string" || typeof b.verification !== "string" || (b.branch != null && typeof b.branch !== "string") || (b.commit_ref != null && typeof b.commit_ref !== "string") || (b.task_id != null && !Number.isSafeInteger(b.task_id)) || (b.work_item_id != null && !Number.isSafeInteger(b.work_item_id))) {
    res.status(400).json({ error: "Provide project, status, completed work, next action, blockers, verification, and recovery note." }); return;
  }
  if (b.project_key === "finance" && FINANCE_REVIEW_REQUIRED) {
    res.status(423).json({ error: "Finance checkpoints are held until Claude's later review." }); return;
  }
  const result = await db.transaction(async (tx) => {
    const control = await lockWorkControl(tx, b.project_key);
    // A checkpoint is an append-only recovery record, safe to save while OFF.
    const [project] = await tx.select({ id: projectsTable.id }).from(projectsTable).where(eq(projectsTable.slug, b.project_key)).limit(1);
    if (b.task_id != null) {
      if (!project) return { kind: "task" as const };
      const [task] = await tx.select({ project_id: tasksTable.project_id }).from(tasksTable).where(eq(tasksTable.id, b.task_id)).limit(1);
      if (!task || task.project_id !== project.id) return { kind: "task" as const };
    }
    if (b.work_item_id != null) {
      const [item] = await tx.select({ project_key: managedWorkItemsTable.project_key }).from(managedWorkItemsTable).where(eq(managedWorkItemsTable.id, b.work_item_id)).limit(1);
      if (!item || item.project_key !== b.project_key) return { kind: "item" as const };
    }
    const [saved] = await tx.insert(projectHandoverTable).values({
      project_key: b.project_key, project_id: project?.id ?? null, task_id: b.task_id ?? null, work_item_id: b.work_item_id ?? null,
      branch: b.branch ?? null, commit_ref: b.commit_ref ?? null, status: b.status,
      completed_work: b.completed_work, next_action: b.next_action, blockers: b.blockers,
      verification: b.verification, recovery_note: b.recovery_note,
    }).returning();
    await tx.insert(projectHandoverEventsTable).values({
      checkpoint_id: saved.id, project_key: saved.project_key, task_id: saved.task_id,
      actor: "Markus", event_type: "checkpoint_saved",
      details: { status: saved.status, work_item_id: saved.work_item_id, work_enabled: control.enabled && !control.completed, execution_requested: false },
    });
    return { kind: "ok" as const, saved };
  });
  if (result.kind !== "ok") {
    res.status(400).json({ error: result.kind === "task" ? "The task must belong to the selected project." : "The work item must belong to the selected project." }); return;
  }
  res.status(201).json(result.saved);
});

router.post("/work-handovers/:id/resume", requireRealOwnerSession, async (req, res): Promise<void> => {
  const id = Number(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
  if (!Number.isSafeInteger(id) || id < 1) { res.status(400).json({ error: "Invalid checkpoint id." }); return; }
  const result = await db.transaction(async (tx) => {
    const [checkpoint] = await tx.select().from(projectHandoverTable).where(eq(projectHandoverTable.id, id)).limit(1);
    if (!checkpoint || !hasWorkControl(checkpoint.project_key)) return { kind: "missing" as const };
    const control = await lockWorkControl(tx, checkpoint.project_key);
    if ((checkpoint.project_key === "finance" && FINANCE_REVIEW_REQUIRED) || !control.enabled || control.completed) return { kind: "off" as const };
    if (checkpoint.task_id != null) {
      const [task] = await tx.select({ project_id: tasksTable.project_id, status: tasksTable.status }).from(tasksTable).where(eq(tasksTable.id, checkpoint.task_id)).limit(1);
      if (!task || task.project_id !== checkpoint.project_id || task.status === "done") return { kind: "task" as const };
    }
    if (checkpoint.work_item_id != null) {
      const [item] = await tx.select().from(managedWorkItemsTable).where(eq(managedWorkItemsTable.id, checkpoint.work_item_id)).for("update").limit(1);
      if (!item || item.project_key !== checkpoint.project_key || !["needs_owner", "pending_approval"].includes(item.status)) return { kind: "item" as const };
      const [dispatch] = await tx.select({ id: managedWorkDispatchesTable.id }).from(managedWorkDispatchesTable)
        .where(eq(managedWorkDispatchesTable.work_item_id, item.id)).limit(1);
      if (dispatch) return { kind: "provider" as const };
      const [question] = await tx.select({ id: managedFleetQuestionsTable.id }).from(managedFleetQuestionsTable)
        .where(and(eq(managedFleetQuestionsTable.project_key, item.project_key), eq(managedFleetQuestionsTable.work_item_id, item.id),
          eq(managedFleetQuestionsTable.plan_version, item.plan_version ?? 1), eq(managedFleetQuestionsTable.blocks_work, true), eq(managedFleetQuestionsTable.status, "open"))).limit(1);
      if (question) return { kind: "question" as const };
      // Resuming a note does not grant task approval. The explicit approval
      // endpoint must recheck outcome, readiness, limits and blocking questions.
      if (item.status === "needs_owner") {
        await tx.update(managedWorkItemsTable).set({ status: "pending_approval", updated_at: new Date() }).where(eq(managedWorkItemsTable.id, item.id));
        await tx.insert(managedWorkEventsTable).values({
          work_item_id: item.id, project_key: item.project_key, actor: "Markus", event_type: "checkpoint_returned_for_approval",
          from_status: "needs_owner", to_status: "pending_approval", details: { checkpoint_id: checkpoint.id, agent_started: false },
        });
      }
    }
    await tx.insert(projectHandoverEventsTable).values({
      checkpoint_id: checkpoint.id, project_key: checkpoint.project_key, task_id: checkpoint.task_id,
      actor: "Markus", event_type: "resume_requested",
      details: { work_item_id: checkpoint.work_item_id, from_status: checkpoint.status, to_status: "owner_review_ready", agent_started: false },
    });
    return { kind: "ok" as const, checkpoint };
  });
  if (result.kind !== "ok") {
    const errors = {
      missing: "Checkpoint not found.",
      off: "Project work is OFF, held or complete. Recovery notes can still be saved, but resume is blocked.",
      task: "The linked task is missing, belongs to another project, or is already complete.",
      item: "Only a pending or owner-needed work item can return for approval.",
      provider: "This work item has a provider dispatch. Confirm its external state before recovery; automatic restart is blocked.",
      question: "A blocking owner question is open for this task version.",
    };
    res.status(result.kind === "missing" ? 404 : result.kind === "off" || result.kind === "question" ? 423 : 409).json({ error: errors[result.kind] }); return;
  }
  const checkpoint = result.checkpoint;
  res.json({
    checkpoint_id: checkpoint.id, project_key: checkpoint.project_key, task_id: checkpoint.task_id,
    next_action: checkpoint.next_action, blockers: checkpoint.blockers, recovery_note: checkpoint.recovery_note,
    status: "owner_review_ready", agent_started: false,
  });
});

export default router;
