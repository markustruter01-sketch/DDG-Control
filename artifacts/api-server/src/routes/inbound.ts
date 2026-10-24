import {
  CreateInboundFinanceExpenseBody,
  CreateInboundFinanceRevenueBody,
  GetInboundStateResponse,
  PostInboundDecisionBody,
  PostInboundDecisionResponse,
  PostInboundNoteBody,
  PostInboundNoteResponse,
  PostInboundTaskStatusBody,
  PostInboundTaskStatusParams,
  PostInboundTaskStatusResponse,
} from "@workspace/api-zod";
import {
  db,
  decisionsTable,
  inboundNotesTable,
  membersTable,
  projectsTable,
  tasksTable,
  type Task,
} from "@workspace/db";
import {
  DECISION_SOURCES,
  DECISION_STATUSES,
  LEVELS,
  NOTE_KINDS,
  TASK_STATUSES,
} from "@workspace/project-constants";
import { createHash, timingSafeEqual } from "node:crypto";
import { desc, eq, ne } from "drizzle-orm";
import { Router, type IRouter, type RequestHandler } from "express";
import { decideDecision } from "./decisions";
import { requireRealOwnerSession } from "./auth";
import { hasWorkControl, isProjectWorkEnabled, isProjectWorkHeld, lockWorkControl } from "../lib/managed-work-controls";
import { getTradingSnapshot } from "../agents/ollie";
import {
  computeFinanceSummary,
  createExpense,
  createRevenue,
} from "./finance";
import {
  getUnknownFieldError,
  requestBodyRecord,
  validateCalendarDate,
  validateTitle,
  zodErrorText,
} from "./validation";

const router: IRouter = Router();

export function requireInboundKey(envVarName: string): RequestHandler {
  return (req, res, next): void => {
    const configuredKey = process.env[envVarName];
    if (!configuredKey) {
      res.status(503).json({ error: "inbound not configured" });
      return;
    }

    const authorization = req.get("authorization") ?? "";
    const token = /^Bearer\s+(.+)$/i.exec(authorization)?.[1] ?? "";
    const expectedHash = createHash("sha256").update(configuredKey).digest();
    const tokenHash = createHash("sha256").update(token).digest();
    if (!token || !timingSafeEqual(expectedHash, tokenHash)) {
      res.status(401).json({ error: "unauthorised" });
      return;
    }

    next();
  };
}

router.use("/inbound", requireInboundKey("OLLIE_INBOUND_KEY"));

function toApiDecision<T extends {
  created_at: Date | null;
  decided_at: Date | null;
}>(decision: T) {
  return {
    ...decision,
    created_at: decision.created_at?.toISOString() ?? null,
    decided_at: decision.decided_at?.toISOString() ?? null,
  };
}

function toApiTask(task: Task) {
  return {
    ...task,
    completed_at: task.completed_at?.toISOString() ?? null,
    created_at: task.created_at?.toISOString() ?? null,
    updated_at: task.updated_at?.toISOString() ?? null,
  };
}

router.get("/inbound/state", async (_req, res): Promise<void> => {
  const pending_decisions = await db
    .select({
      id: decisionsTable.id,
      project_slug: projectsTable.slug,
      title: decisionsTable.title,
      recommendation: decisionsTable.recommendation,
    })
    .from(decisionsTable)
    .innerJoin(projectsTable, eq(decisionsTable.project_id, projectsTable.id))
    .where(eq(decisionsTable.status, DECISION_STATUSES[0]))
    .orderBy(desc(decisionsTable.created_at), desc(decisionsTable.id));

  const tasks = await db
    .select({
      id: tasksTable.id,
      project_slug: projectsTable.slug,
      title: tasksTable.title,
      status: tasksTable.status,
      owner_name: membersTable.name,
      due_date: tasksTable.due_date,
    })
    .from(tasksTable)
    .innerJoin(projectsTable, eq(tasksTable.project_id, projectsTable.id))
    .innerJoin(membersTable, eq(tasksTable.owner_id, membersTable.id))
    .where(ne(tasksTable.status, "done"))
    .orderBy(tasksTable.created_at);

  const projects = await db
    .select({ slug: projectsTable.slug })
    .from(projectsTable)
    .orderBy(projectsTable.sort_order);
  const members = await db
    .select({ name: membersTable.name })
    .from(membersTable)
    .orderBy(membersTable.id);
  const finance = await computeFinanceSummary();
  let trading: Awaited<ReturnType<typeof getTradingSnapshot>> | "unavailable";
  try {
    trading = await getTradingSnapshot();
  } catch {
    trading = "unavailable";
  }

  const response = {
    pending_decisions,
    tasks,
    project_slugs: projects.map((project) => project.slug),
    member_names: members.map((member) => member.name),
    finance,
    trading,
  };
  GetInboundStateResponse.parse(response);
  res.status(200).json(response);
});

router.post("/inbound/finance/expenses", async (req, res): Promise<void> => {
  const parsed = CreateInboundFinanceExpenseBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: zodErrorText(parsed.error) });
    return;
  }

  const input = requestBodyRecord(req.body);
  if (!input) {
    res.status(400).json({ error: "request body must be an object" });
    return;
  }
  delete input.idempotency_key;
  const idempotencyKey = parsed.data.idempotency_key;
  const result = await createExpense(input, idempotencyKey);
  if ("error" in result) {
    res.status(result.status).json({ error: result.error });
    return;
  }
  res.status(result.status).json(result.data);
});

router.post("/inbound/finance/revenue", async (req, res): Promise<void> => {
  const parsed = CreateInboundFinanceRevenueBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: zodErrorText(parsed.error) });
    return;
  }

  const input = requestBodyRecord(req.body);
  if (!input) {
    res.status(400).json({ error: "request body must be an object" });
    return;
  }
  delete input.idempotency_key;
  const idempotencyKey = parsed.data.idempotency_key;
  const result = await createRevenue(input, idempotencyKey);
  if ("error" in result) {
    res.status(result.status).json({ error: result.error });
    return;
  }
  res.status(result.status).json(result.data);
});

// An inbound key identifies an integration, not the owner. This legacy
// endpoint immediately decides records, so both existing key auth and a real
// owner session are required. Provider-only requests cannot approve themselves.
router.post("/inbound/decisions", requireRealOwnerSession, async (req, res): Promise<void> => {
  const body = requestBodyRecord(req.body);
  if (!body) {
    res.status(400).json({ error: "request body must be an object" });
    return;
  }

  const hasDecisionId = Object.hasOwn(body, "decision_id");
  const allowedFields = hasDecisionId
    ? ["decision_id", "outcome", "note"]
    : [
        "project_slug",
        "title",
        "summary",
        "owner_name",
        "due_date",
        "outcome",
        "note",
      ];
  const unknownFieldError = getUnknownFieldError(body, allowedFields);
  if (unknownFieldError) {
    res.status(400).json({ error: unknownFieldError });
    return;
  }

  const parsed = PostInboundDecisionBody.safeParse(body);
  if (!parsed.success) {
    res.status(400).json({ error: zodErrorText(parsed.error) });
    return;
  }

  if ("decision_id" in parsed.data) {
    if (
      !Number.isSafeInteger(parsed.data.decision_id) ||
      parsed.data.decision_id > 2147483647
    ) {
      res.status(400).json({ error: "invalid decision id" });
      return;
    }

    const outcome = await decideDecision(
      parsed.data.decision_id,
      parsed.data.outcome,
      parsed.data.note ?? null,
      "cursor",
    );
    if (outcome.kind === "not-found") {
      res.status(404).json({ error: "not found" });
      return;
    }
    if (outcome.kind === "not-pending") {
      res.status(409).json({ error: "decision is not pending" });
      return;
    }
    if (outcome.kind === "paused") {
      res.status(423).json({ error: "Project work is OFF. The decision cannot create work." });
      return;
    }

    const response = toApiDecision(outcome.decision);
    PostInboundDecisionResponse.parse(response);
    res.status(200).json(response);
    return;
  }

  const createInput = parsed.data;
  const title = validateTitle(body.title);
  if ("error" in title) {
    res.status(400).json({ error: title.error });
    return;
  }

  const dueDate =
    body.due_date === undefined
      ? { value: null }
      : validateCalendarDate(body.due_date, "due_date");
  if ("error" in dueDate) {
    res.status(400).json({ error: dueDate.error });
    return;
  }

  const [project] = await db
    .select({ id: projectsTable.id, slug: projectsTable.slug })
    .from(projectsTable)
    .where(eq(projectsTable.slug, createInput.project_slug))
    .limit(1);
  if (!project) {
    res.status(400).json({ error: "unknown project" });
    return;
  }
  if (hasWorkControl(project.slug) && !(await isProjectWorkEnabled(project.slug))) {
    res.status(423).json({ error: "Project work is OFF. New recommendations are paused." });
    return;
  }

  const [owner] = await db
    .select({ id: membersTable.id })
    .from(membersTable)
    .where(eq(membersTable.name, createInput.owner_name))
    .limit(1);
  if (!owner) {
    res.status(400).json({ error: "unknown owner" });
    return;
  }

  const decided = await db.transaction(async (tx) => {
    // Check under the same project lock before inserting. A concurrent OFF or
    // completion must not leave a new pending record from a refused request.
    if (hasWorkControl(project.slug)) {
      const control = await lockWorkControl(tx, project.slug);
      if (!control.enabled || control.completed || isProjectWorkHeld(project.slug)) {
        return { kind: "paused" as const };
      }
    }
    const [created] = await tx
      .insert(decisionsTable)
      .values({
        project_id: project.id,
        source: DECISION_SOURCES[1],
        title: title.value,
        recommendation: createInput.summary,
        risk: "Recorded from Cursor",
        urgency: "medium",
        confidence: "medium",
        owner_id: owner.id,
        due_date: dueDate.value,
        status: DECISION_STATUSES[0],
      })
      .returning({ id: decisionsTable.id });
    if (!created) {
      throw new Error("could not create inbound decision");
    }
    return decideDecision(
      created.id,
      createInput.outcome,
      createInput.note ?? null,
      "cursor",
      tx,
    );
  });

  if (decided.kind === "not-found") {
    res.status(404).json({ error: "not found" });
    return;
  }
  if (decided.kind === "not-pending") {
    res.status(409).json({ error: "decision is not pending" });
    return;
  }
  if (decided.kind === "paused") {
    res.status(423).json({ error: "Project work is OFF. The decision cannot create work." });
    return;
  }

  const response = toApiDecision(decided.decision);
  PostInboundDecisionResponse.parse(response);
  res.status(200).json(response);
});

router.post("/inbound/tasks/:id/status", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  if (!/^[1-9]\d*$/.test(rawId)) {
    res.status(400).json({ error: "invalid task id" });
    return;
  }

  const params = PostInboundTaskStatusParams.safeParse({ id: Number(rawId) });
  if (
    !params.success ||
    !Number.isSafeInteger(params.data.id) ||
    params.data.id > 2147483647
  ) {
    res.status(400).json({ error: "invalid task id" });
    return;
  }

  const body = requestBodyRecord(req.body);
  if (!body) {
    res.status(400).json({ error: "request body must be an object" });
    return;
  }
  const unknownFieldError = getUnknownFieldError(body, ["status"]);
  if (unknownFieldError) {
    res.status(400).json({ error: unknownFieldError });
    return;
  }

  const parsed = PostInboundTaskStatusBody.safeParse(body);
  if (
    !parsed.success ||
    !TASK_STATUSES.includes(
      parsed.data.status as (typeof TASK_STATUSES)[number],
    )
  ) {
    res.status(400).json({ error: "invalid status" });
    return;
  }

  const [existing] = await db
    .select()
    .from(tasksTable)
    .where(eq(tasksTable.id, params.data.id))
    .limit(1);
  if (!existing) {
    res.status(404).json({ error: "not found" });
    return;
  }
  const [taskProject] = await db.select({ slug: projectsTable.slug }).from(projectsTable)
    .where(eq(projectsTable.id, existing.project_id)).limit(1);
  if (!taskProject || (hasWorkControl(taskProject.slug) && !(await isProjectWorkEnabled(taskProject.slug)))) {
    res.status(423).json({ error: "Project work is OFF. Task status updates are paused." });
    return;
  }

  const updates: Partial<typeof tasksTable.$inferInsert> = {
    status: parsed.data.status,
    updated_at: new Date(),
  };
  if (existing.status !== "done" && parsed.data.status === "done") {
    updates.completed_at = new Date();
  } else if (existing.status === "done" && parsed.data.status !== "done") {
    updates.completed_at = null;
  }

  const [updated] = await db
    .update(tasksTable)
    .set(updates)
    .where(eq(tasksTable.id, params.data.id))
    .returning();
  if (!updated) {
    res.status(404).json({ error: "not found" });
    return;
  }

  const response = toApiTask(updated);
  PostInboundTaskStatusResponse.parse(response);
  res.status(200).json(response);
});

router.post("/inbound/notes", async (req, res): Promise<void> => {
  const body = requestBodyRecord(req.body);
  if (!body) {
    res.status(400).json({ error: "request body must be an object" });
    return;
  }
  const unknownFieldError = getUnknownFieldError(body, [
    "project_slug",
    "kind",
    "severity",
    "text",
  ]);
  if (unknownFieldError) {
    res.status(400).json({ error: unknownFieldError });
    return;
  }

  const parsed = PostInboundNoteBody.safeParse(body);
  if (!parsed.success) {
    res.status(400).json({ error: zodErrorText(parsed.error) });
    return;
  }
  if (
    !NOTE_KINDS.includes(parsed.data.kind as (typeof NOTE_KINDS)[number]) ||
    !LEVELS.includes(parsed.data.severity as (typeof LEVELS)[number])
  ) {
    res.status(400).json({ error: "invalid note kind or severity" });
    return;
  }

  const [project] = await db
    .select({ id: projectsTable.id, slug: projectsTable.slug })
    .from(projectsTable)
    .where(eq(projectsTable.slug, parsed.data.project_slug))
    .limit(1);
  if (!project) {
    res.status(400).json({ error: "unknown project" });
    return;
  }
  if (hasWorkControl(project.slug) && !(await isProjectWorkEnabled(project.slug))) {
    res.status(423).json({ error: "Project work is OFF. New project notes are paused." });
    return;
  }

  const [created] = await db
    .insert(inboundNotesTable)
    .values({
      project_id: project.id,
      kind: parsed.data.kind,
      severity: parsed.data.severity,
      text: parsed.data.text,
    })
    .returning();
  if (!created) {
    res.status(500).json({ error: "could not store note" });
    return;
  }

  const response = {
    id: created.id,
    project_slug: project.slug,
    kind: created.kind,
    severity: created.severity,
    text: created.text,
    created_at: created.created_at?.toISOString() ?? null,
  };
  PostInboundNoteResponse.parse(response);
  res.status(200).json(response);
});

export default router;

