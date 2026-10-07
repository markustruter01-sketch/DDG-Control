import {
  CreateProjectGoalBody,
  CreateProjectGoalParams,
  CreateProjectGoalResponse,
  ListProjectGoalsParams,
  ListProjectGoalsResponse,
  UpdateGoalBody,
  UpdateGoalParams,
  UpdateGoalResponse,
} from "@workspace/api-zod";
import { db, goalsTable, projectsTable, type Goal } from "@workspace/db";
import {
  GOAL_STATUSES,
  type GoalStatus,
} from "@workspace/project-constants";
import { eq } from "drizzle-orm";
import { Router, type IRouter } from "express";
import {
  getMissingRequiredFieldError,
  getUnknownFieldError,
  requestBodyRecord,
  validateCalendarDate,
  validateNotes,
  validateTitle,
} from "./validation";

const router: IRouter = Router();

type ValidGoalFields = {
  title?: string;
  notes?: string | null;
  status?: GoalStatus;
  target_date?: string | null;
};

const createGoalFields = ["title", "notes", "status", "target_date"] as const;
const updateGoalFields = ["title", "notes", "status", "target_date"] as const;
const statusOrder = new Map<string, number>(
  GOAL_STATUSES.map((status, index) => [status, index]),
);

function parseGoalFields(
  body: Record<string, unknown>,
  allowedFields: readonly string[],
  requiredFields: readonly string[],
): { fields: ValidGoalFields } | { error: string } {
  const unknownFieldError = getUnknownFieldError(body, allowedFields);
  if (unknownFieldError) {
    return { error: unknownFieldError };
  }

  const requiredFieldError = getMissingRequiredFieldError(body, requiredFields);
  if (requiredFieldError) {
    return { error: requiredFieldError };
  }

  const fields: ValidGoalFields = {};

  if (Object.hasOwn(body, "title")) {
    const title = validateTitle(body.title);
    if ("error" in title) {
      return { error: title.error };
    }
    fields.title = title.value;
  }

  if (Object.hasOwn(body, "notes")) {
    const notes = validateNotes(body.notes);
    if ("error" in notes) {
      return { error: notes.error };
    }
    fields.notes = notes.value;
  }

  if (Object.hasOwn(body, "status")) {
    if (
      typeof body.status !== "string" ||
      !GOAL_STATUSES.includes(body.status as GoalStatus)
    ) {
      return { error: "invalid status" };
    }
    fields.status = body.status as GoalStatus;
  }

  if (Object.hasOwn(body, "target_date")) {
    const targetDate = validateCalendarDate(body.target_date, "target_date");
    if ("error" in targetDate) {
      return { error: targetDate.error };
    }
    fields.target_date = targetDate.value;
  }

  return { fields };
}

function toApiGoal(goal: Goal) {
  if (!GOAL_STATUSES.includes(goal.status as GoalStatus)) {
    throw new Error(`Goal "${goal.id}" has an invalid status`);
  }

  return {
    ...goal,
    achieved_at: goal.achieved_at?.toISOString() ?? null,
    created_at: goal.created_at?.toISOString() ?? null,
    updated_at: goal.updated_at?.toISOString() ?? null,
  };
}

router.get("/projects/:slug/goals", async (req, res): Promise<void> => {
  const params = ListProjectGoalsParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [project] = await db
    .select({ id: projectsTable.id })
    .from(projectsTable)
    .where(eq(projectsTable.slug, params.data.slug))
    .limit(1);

  if (!project) {
    res.status(404).json({ error: "not found" });
    return;
  }

  const goals = await db
    .select()
    .from(goalsTable)
    .where(eq(goalsTable.project_id, project.id));

  goals.sort((left, right) => {
    const statusDifference =
      (statusOrder.get(left.status) ?? GOAL_STATUSES.length) -
      (statusOrder.get(right.status) ?? GOAL_STATUSES.length);
    if (statusDifference !== 0) {
      return statusDifference;
    }

    if (left.target_date !== right.target_date) {
      if (left.target_date === null) {
        return 1;
      }
      if (right.target_date === null) {
        return -1;
      }
      return left.target_date < right.target_date ? -1 : 1;
    }

    return (
      (left.created_at?.getTime() ?? Number.POSITIVE_INFINITY) -
      (right.created_at?.getTime() ?? Number.POSITIVE_INFINITY)
    );
  });

  const response = goals.map(toApiGoal);
  ListProjectGoalsResponse.parse(response);
  res.json(response);
});

router.post("/projects/:slug/goals", async (req, res): Promise<void> => {
  const params = CreateProjectGoalParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [project] = await db
    .select({ id: projectsTable.id })
    .from(projectsTable)
    .where(eq(projectsTable.slug, params.data.slug))
    .limit(1);

  if (!project) {
    res.status(404).json({ error: "not found" });
    return;
  }

  const body = requestBodyRecord(req.body);
  if (!body) {
    res.status(400).json({ error: "request body must be an object" });
    return;
  }

  const parsed = parseGoalFields(body, createGoalFields, ["title"]);
  if ("error" in parsed) {
    res.status(400).json({ error: parsed.error });
    return;
  }

  const validatedBody = CreateProjectGoalBody.safeParse(parsed.fields);
  if (!validatedBody.success) {
    res.status(400).json({ error: validatedBody.error.message });
    return;
  }

  const fields = parsed.fields;
  const status = fields.status ?? GOAL_STATUSES[0];
  const values: typeof goalsTable.$inferInsert = {
    project_id: project.id,
    title: fields.title as string,
    notes: fields.notes ?? null,
    status,
    target_date: fields.target_date ?? null,
    ...(status === "achieved" ? { achieved_at: new Date() } : {}),
  };

  const [created] = await db.insert(goalsTable).values(values).returning();
  if (!created) {
    res.status(500).json({ error: "unable to create goal" });
    return;
  }

  const response = toApiGoal(created);
  CreateProjectGoalResponse.parse(response);
  res.status(201).json(response);
});

router.patch("/goals/:id", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  if (!/^[1-9]\d*$/.test(rawId)) {
    res.status(400).json({ error: "invalid goal id" });
    return;
  }

  const id = Number(rawId);
  const params = UpdateGoalParams.safeParse({ id });
  if (
    !params.success ||
    !Number.isSafeInteger(params.data.id) ||
    params.data.id > 2147483647
  ) {
    res.status(400).json({ error: "invalid goal id" });
    return;
  }

  const [existing] = await db
    .select()
    .from(goalsTable)
    .where(eq(goalsTable.id, params.data.id))
    .limit(1);

  if (!existing) {
    res.status(404).json({ error: "not found" });
    return;
  }

  const body = requestBodyRecord(req.body);
  if (!body) {
    res.status(400).json({ error: "request body must be an object" });
    return;
  }
  if (Object.keys(body).length === 0) {
    res.status(400).json({ error: "nothing to update" });
    return;
  }

  const parsed = parseGoalFields(body, updateGoalFields, []);
  if ("error" in parsed) {
    res.status(400).json({ error: parsed.error });
    return;
  }

  const validatedBody = UpdateGoalBody.safeParse(parsed.fields);
  if (!validatedBody.success) {
    res.status(400).json({ error: validatedBody.error.message });
    return;
  }

  const fields = parsed.fields;
  const updates: Partial<typeof goalsTable.$inferInsert> = {
    updated_at: new Date(),
  };
  if (Object.hasOwn(fields, "title")) {
    updates.title = fields.title;
  }
  if (Object.hasOwn(fields, "notes")) {
    updates.notes = fields.notes ?? null;
  }
  if (Object.hasOwn(fields, "target_date")) {
    updates.target_date = fields.target_date ?? null;
  }
  if (Object.hasOwn(fields, "status")) {
    const status = fields.status as GoalStatus;
    updates.status = status;
    if (existing.status !== "achieved" && status === "achieved") {
      updates.achieved_at = new Date();
    } else if (existing.status === "achieved" && status !== "achieved") {
      updates.achieved_at = null;
    }
  }

  const [updated] = await db
    .update(goalsTable)
    .set(updates)
    .where(eq(goalsTable.id, params.data.id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "not found" });
    return;
  }

  const response = toApiGoal(updated);
  UpdateGoalResponse.parse(response);
  res.json(response);
});

export default router;
