import {
  ApproveDecisionBody,
  ApproveDecisionParams,
  DeclineDecisionBody,
  DeclineDecisionParams,
  ListDecisionsQueryParams,
} from "@workspace/api-zod";
import {
  db,
  decisionsTable,
  membersTable,
  projectsTable,
  tasksTable,
} from "@workspace/db";
import {
  DECISION_STATUSES,
  TASK_STATUSES,
} from "@workspace/project-constants";
import { desc, eq } from "drizzle-orm";
import { Router, type IRouter } from "express";
import {
  getUnknownFieldError,
  requestBodyRecord,
  zodErrorText,
} from "./validation";
import { hasWorkControl, isProjectWorkHeld, lockWorkControl } from "../lib/managed-work-controls";
import { requireRealOwnerSession } from "./auth";

const router: IRouter = Router();

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

function parseDecisionId(rawId: string | string[]): number | null {
  const value = Array.isArray(rawId) ? rawId[0] : rawId;
  if (!value || !/^[1-9]\d*$/.test(value)) {
    return null;
  }
  const id = Number(value);
  return Number.isSafeInteger(id) && id <= 2147483647 ? id : null;
}

function parseActionBody(
  rawBody: unknown,
  action: "approve" | "decline",
): { note: string | null } | { error: string } {
  const body = requestBodyRecord(rawBody ?? {});
  if (!body) {
    return { error: "request body must be an object" };
  }

  const unknownFieldError = getUnknownFieldError(body, ["note"]);
  if (unknownFieldError) {
    return { error: unknownFieldError };
  }

  const schema = action === "approve" ? ApproveDecisionBody : DeclineDecisionBody;
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return { error: zodErrorText(parsed.error) };
  }

  return { note: parsed.data.note ?? null };
}

type DecisionOutcome = "approved" | "declined";
type DecisionVia = "dashboard" | "cursor";
type DbTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

async function decideWithinTransaction(
  tx: DbTransaction,
  id: number,
  outcome: DecisionOutcome,
  note: string | null,
  decidedVia: DecisionVia,
) {
  // Match managed work's project-first lock order. Recheck the decision after
  // acquiring that lock so an OFF/completion change cannot race approval.
  const [hint] = await tx.select({ project_id: decisionsTable.project_id, slug: projectsTable.slug })
    .from(decisionsTable).innerJoin(projectsTable, eq(decisionsTable.project_id, projectsTable.id))
    .where(eq(decisionsTable.id, id)).limit(1);
  if (!hint) return { kind: "not-found" as const };
  const control = hasWorkControl(hint.slug) ? await lockWorkControl(tx, hint.slug) : null;
  if (control && (!control.enabled || control.completed || isProjectWorkHeld(hint.slug))) {
    return { kind: "paused" as const };
  }
  const [decision] = await tx
    .select()
    .from(decisionsTable)
    .where(eq(decisionsTable.id, id))
    .limit(1)
    .for("update");

  if (!decision || decision.project_id !== hint.project_id) {
    return { kind: "not-found" as const };
  }
  if (decision.status !== DECISION_STATUSES[0]) {
    return { kind: "not-pending" as const };
  }

  let taskId: number | null = null;
  if (outcome === "approved") {
    const [task] = await tx
      .insert(tasksTable)
      .values({
        project_id: decision.project_id,
        title: decision.title,
        notes: `Approved decision #${decision.id}: ${decision.recommendation}`,
        status: TASK_STATUSES[0],
        owner_id: decision.owner_id,
        due_date: decision.due_date,
      })
      .returning({ id: tasksTable.id });
    if (!task) {
      throw new Error("could not create decision task");
    }
    taskId = task.id;
  }

  const [updated] = await tx
    .update(decisionsTable)
    .set({
      status: outcome,
      decided_at: new Date(),
      note,
      decided_via: decidedVia,
      ...(taskId === null ? {} : { task_id: taskId }),
    })
    .where(eq(decisionsTable.id, id))
    .returning({
      id: decisionsTable.id,
      run_id: decisionsTable.run_id,
      project_id: decisionsTable.project_id,
      title: decisionsTable.title,
      recommendation: decisionsTable.recommendation,
      cost_estimate_aud: decisionsTable.cost_estimate_aud,
      risk: decisionsTable.risk,
      urgency: decisionsTable.urgency,
      confidence: decisionsTable.confidence,
      owner_id: decisionsTable.owner_id,
      due_date: decisionsTable.due_date,
      status: decisionsTable.status,
      note: decisionsTable.note,
      decided_at: decisionsTable.decided_at,
      task_id: decisionsTable.task_id,
      created_at: decisionsTable.created_at,
    });
  if (!updated) {
    throw new Error(`could not ${outcome === "approved" ? "approve" : "decline"} decision`);
  }
  return { kind: "ok" as const, decision: updated };
}

export function decideDecision(
  id: number,
  outcome: DecisionOutcome,
  note: string | null,
  decidedVia: DecisionVia,
  transaction?: DbTransaction,
) {
  if (transaction) {
    return decideWithinTransaction(transaction, id, outcome, note, decidedVia);
  }
  return db.transaction((tx) =>
    decideWithinTransaction(tx, id, outcome, note, decidedVia),
  );
}

router.get("/decisions", async (req, res): Promise<void> => {
  const query = ListDecisionsQueryParams.safeParse(req.query);
  if (
    !query.success ||
    !DECISION_STATUSES.includes(
      query.data.status as (typeof DECISION_STATUSES)[number],
    )
  ) {
    res.status(400).json({ error: "status must be a valid decision status" });
    return;
  }

  const rows = await db
    .select({
      id: decisionsTable.id,
      run_id: decisionsTable.run_id,
      project_id: decisionsTable.project_id,
      project_slug: projectsTable.slug,
      source: decisionsTable.source,
      decided_via: decisionsTable.decided_via,
      title: decisionsTable.title,
      recommendation: decisionsTable.recommendation,
      cost_estimate_aud: decisionsTable.cost_estimate_aud,
      risk: decisionsTable.risk,
      urgency: decisionsTable.urgency,
      confidence: decisionsTable.confidence,
      owner_id: decisionsTable.owner_id,
      owner_name: membersTable.name,
      due_date: decisionsTable.due_date,
      status: decisionsTable.status,
      note: decisionsTable.note,
      decided_at: decisionsTable.decided_at,
      task_id: decisionsTable.task_id,
      created_at: decisionsTable.created_at,
    })
    .from(decisionsTable)
    .innerJoin(projectsTable, eq(decisionsTable.project_id, projectsTable.id))
    .innerJoin(membersTable, eq(decisionsTable.owner_id, membersTable.id))
    .where(eq(decisionsTable.status, query.data.status))
    .orderBy(desc(decisionsTable.created_at), desc(decisionsTable.id));

  res.json(rows.map(toApiDecision));
});

router.post("/decisions/:id/approve", requireRealOwnerSession, async (req, res): Promise<void> => {
  const id = parseDecisionId(req.params.id);
  if (id === null || !ApproveDecisionParams.safeParse({ id }).success) {
    res.status(400).json({ error: "invalid decision id" });
    return;
  }

  const actionBody = parseActionBody(req.body, "approve");
  if ("error" in actionBody) {
    res.status(400).json({ error: actionBody.error });
    return;
  }

  const outcome = await decideDecision(
    id,
    DECISION_STATUSES[1],
    actionBody.note,
    "dashboard",
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
    res.status(423).json({ error: "Project work is OFF. Turn it ON before approving work." });
    return;
  }
  res.json(toApiDecision(outcome.decision));
});

router.post("/decisions/:id/decline", requireRealOwnerSession, async (req, res): Promise<void> => {
  const id = parseDecisionId(req.params.id);
  if (id === null || !DeclineDecisionParams.safeParse({ id }).success) {
    res.status(400).json({ error: "invalid decision id" });
    return;
  }

  const actionBody = parseActionBody(req.body, "decline");
  if ("error" in actionBody) {
    res.status(400).json({ error: actionBody.error });
    return;
  }

  const outcome = await decideDecision(
    id,
    DECISION_STATUSES[2],
    actionBody.note,
    "dashboard",
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
  res.json(toApiDecision(outcome.decision));
});

export default router;

