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
} from "./validation";

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
    return { error: parsed.error.message };
  }

  return { note: parsed.data.note ?? null };
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

router.post("/decisions/:id/approve", async (req, res): Promise<void> => {
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

  const outcome = await db.transaction(async (tx) => {
    const [decision] = await tx
      .select()
      .from(decisionsTable)
      .where(eq(decisionsTable.id, id))
      .limit(1)
      .for("update");

    if (!decision) {
      return { kind: "not-found" as const };
    }
    if (decision.status !== DECISION_STATUSES[0]) {
      return { kind: "not-pending" as const };
    }

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

    const [updated] = await tx
      .update(decisionsTable)
      .set({
        status: DECISION_STATUSES[1],
        decided_at: new Date(),
        note: actionBody.note,
        task_id: task.id,
      })
      .where(eq(decisionsTable.id, id))
      .returning();
    if (!updated) {
      throw new Error("could not approve decision");
    }
    return { kind: "ok" as const, decision: updated };
  });

  if (outcome.kind === "not-found") {
    res.status(404).json({ error: "not found" });
    return;
  }
  if (outcome.kind === "not-pending") {
    res.status(409).json({ error: "decision is not pending" });
    return;
  }
  res.json(toApiDecision(outcome.decision));
});

router.post("/decisions/:id/decline", async (req, res): Promise<void> => {
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

  const outcome = await db.transaction(async (tx) => {
    const [decision] = await tx
      .select()
      .from(decisionsTable)
      .where(eq(decisionsTable.id, id))
      .limit(1)
      .for("update");

    if (!decision) {
      return { kind: "not-found" as const };
    }
    if (decision.status !== DECISION_STATUSES[0]) {
      return { kind: "not-pending" as const };
    }

    const [updated] = await tx
      .update(decisionsTable)
      .set({
        status: DECISION_STATUSES[2],
        decided_at: new Date(),
        note: actionBody.note,
      })
      .where(eq(decisionsTable.id, id))
      .returning();
    if (!updated) {
      throw new Error("could not decline decision");
    }
    return { kind: "ok" as const, decision: updated };
  });

  if (outcome.kind === "not-found") {
    res.status(404).json({ error: "not found" });
    return;
  }
  if (outcome.kind === "not-pending") {
    res.status(409).json({ error: "decision is not pending" });
    return;
  }
  res.json(toApiDecision(outcome.decision));
});

export default router;
