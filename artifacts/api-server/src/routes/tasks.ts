import {
  CreateProjectTaskBody,
  CreateProjectTaskParams,
  CreateProjectTaskResponse,
  ListMembersResponse,
  ListProjectTasksParams,
  ListProjectTasksResponse,
  UpdateTaskBody,
  UpdateTaskParams,
  UpdateTaskResponse,
} from "@workspace/api-zod";
import {
  db,
  membersTable,
  projectsTable,
  tasksTable,
  type Member,
  type Task,
} from "@workspace/db";
import { MEMBER_KINDS, TASK_STATUSES } from "@workspace/project-constants";
import { eq } from "drizzle-orm";
import { Router, type IRouter } from "express";
import {
  getMissingRequiredFieldError,
  getUnknownFieldError,
  requestBodyRecord,
  validateCalendarDate,
  validateNotes,
  validateTitle,
  zodErrorText,
} from "./validation";

const router: IRouter = Router();

type TaskStatus = (typeof TASK_STATUSES)[number];

type ValidTaskFields = {
  title?: string;
  notes?: string | null;
  status?: TaskStatus;
  owner_id?: number;
  due_date?: string | null;
};

const createTaskFields = ["title", "owner_id", "notes", "status", "due_date"] as const;
const updateTaskFields = ["title", "notes", "status", "owner_id", "due_date"] as const;
const statusOrder = new Map<string, number>(
  TASK_STATUSES.map((status, index) => [status, index]),
);

function toApiMember(member: Member) {
  if (!MEMBER_KINDS.includes(member.kind as (typeof MEMBER_KINDS)[number])) {
    throw new Error(`Member "${member.name}" has an invalid kind`);
  }

  return {
    ...member,
    created_at: member.created_at?.toISOString() ?? null,
  };
}

function toApiTask(task: Task) {
  if (!TASK_STATUSES.includes(task.status as TaskStatus)) {
    throw new Error(`Task "${task.id}" has an invalid status`);
  }

  return {
    ...task,
    completed_at: task.completed_at?.toISOString() ?? null,
    created_at: task.created_at?.toISOString() ?? null,
    updated_at: task.updated_at?.toISOString() ?? null,
  };
}

function parseTaskFields(
  body: Record<string, unknown>,
  allowedFields: readonly string[],
  requiredFields: readonly string[],
): { fields: ValidTaskFields } | { error: string } {
  const unknownFieldError = getUnknownFieldError(body, allowedFields);
  if (unknownFieldError) {
    return { error: unknownFieldError };
  }

  const requiredFieldError = getMissingRequiredFieldError(body, requiredFields);
  if (requiredFieldError) {
    return { error: requiredFieldError };
  }

  const fields: ValidTaskFields = {};

  if (Object.hasOwn(body, "title")) {
    const title = validateTitle(body.title);
    if ("error" in title) {
      return { error: title.error };
    }
    fields.title = title.value;
  }

  if (Object.hasOwn(body, "owner_id")) {
    if (
      typeof body.owner_id !== "number" ||
      !Number.isInteger(body.owner_id) ||
      body.owner_id < 1
    ) {
      return { error: "owner_id must be a positive integer" };
    }
    fields.owner_id = body.owner_id;
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
      !TASK_STATUSES.includes(body.status as TaskStatus)
    ) {
      return { error: "invalid status" };
    }
    fields.status = body.status as TaskStatus;
  }

  if (Object.hasOwn(body, "due_date")) {
    const dueDate = validateCalendarDate(body.due_date, "due_date");
    if ("error" in dueDate) {
      return { error: dueDate.error };
    }
    fields.due_date = dueDate.value;
  }

  return { fields };
}

async function ownerExists(ownerId: number): Promise<boolean> {
  const [owner] = await db
    .select({ id: membersTable.id })
    .from(membersTable)
    .where(eq(membersTable.id, ownerId))
    .limit(1);
  return Boolean(owner);
}

router.get("/members", async (_req, res): Promise<void> => {
  const members = await db
    .select()
    .from(membersTable)
    .orderBy(membersTable.id);
  const response = members.map(toApiMember);
  ListMembersResponse.parse(response);
  res.json(response);
});

router.get("/projects/:slug/tasks", async (req, res): Promise<void> => {
  const params = ListProjectTasksParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: zodErrorText(params.error) });
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

  const tasks = await db
    .select()
    .from(tasksTable)
    .where(eq(tasksTable.project_id, project.id))
    .orderBy(tasksTable.created_at);

  tasks.sort((left, right) => {
    const rankDifference =
      (statusOrder.get(left.status) ?? TASK_STATUSES.length) -
      (statusOrder.get(right.status) ?? TASK_STATUSES.length);
    if (rankDifference !== 0) {
      return rankDifference;
    }
    return (
      (left.created_at?.getTime() ?? Number.POSITIVE_INFINITY) -
      (right.created_at?.getTime() ?? Number.POSITIVE_INFINITY)
    );
  });

  const response = tasks.map(toApiTask);
  ListProjectTasksResponse.parse(response);
  res.json(response);
});

router.post("/projects/:slug/tasks", async (req, res): Promise<void> => {
  const params = CreateProjectTaskParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: zodErrorText(params.error) });
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

  const parsed = parseTaskFields(body, createTaskFields, ["title", "owner_id"]);
  if ("error" in parsed) {
    res.status(400).json({ error: parsed.error });
    return;
  }

  const validatedBody = CreateProjectTaskBody.safeParse(parsed.fields);
  if (!validatedBody.success) {
    res.status(400).json({ error: zodErrorText(validatedBody.error) });
    return;
  }

  const fields = parsed.fields;
  if (fields.owner_id === undefined || !(await ownerExists(fields.owner_id))) {
    res.status(400).json({ error: "unknown owner" });
    return;
  }

  const status = fields.status ?? TASK_STATUSES[0];
  const values: typeof tasksTable.$inferInsert = {
    project_id: project.id,
    title: fields.title as string,
    notes: fields.notes ?? null,
    status,
    owner_id: fields.owner_id,
    due_date: fields.due_date ?? null,
    ...(status === "done" ? { completed_at: new Date() } : {}),
  };

  const [created] = await db.insert(tasksTable).values(values).returning();
  if (!created) {
    res.status(500).json({ error: "unable to create task" });
    return;
  }

  const response = toApiTask(created);
  CreateProjectTaskResponse.parse(response);
  res.status(201).json(response);
});

router.patch("/tasks/:id", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  if (!/^[1-9]\d*$/.test(rawId)) {
    res.status(400).json({ error: "invalid task id" });
    return;
  }

  const params = UpdateTaskParams.safeParse({ id: Number(rawId) });
  if (!params.success || !Number.isSafeInteger(params.data.id) || params.data.id > 2147483647) {
    res.status(400).json({ error: "invalid task id" });
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

  const body = requestBodyRecord(req.body);
  if (!body) {
    res.status(400).json({ error: "request body must be an object" });
    return;
  }
  if (Object.keys(body).length === 0) {
    res.status(400).json({ error: "nothing to update" });
    return;
  }

  const parsed = parseTaskFields(body, updateTaskFields, []);
  if ("error" in parsed) {
    res.status(400).json({ error: parsed.error });
    return;
  }

  const validatedBody = UpdateTaskBody.safeParse(parsed.fields);
  if (!validatedBody.success) {
    res.status(400).json({ error: zodErrorText(validatedBody.error) });
    return;
  }

  const fields = parsed.fields;
  if (
    Object.hasOwn(fields, "owner_id") &&
    (fields.owner_id === undefined || !(await ownerExists(fields.owner_id)))
  ) {
    res.status(400).json({ error: "unknown owner" });
    return;
  }

  const updates: Partial<typeof tasksTable.$inferInsert> = {
    updated_at: new Date(),
  };
  if (Object.hasOwn(fields, "title")) {
    updates.title = fields.title;
  }
  if (Object.hasOwn(fields, "notes")) {
    updates.notes = fields.notes ?? null;
  }
  if (Object.hasOwn(fields, "owner_id")) {
    updates.owner_id = fields.owner_id;
  }
  if (Object.hasOwn(fields, "due_date")) {
    updates.due_date = fields.due_date ?? null;
  }
  if (Object.hasOwn(fields, "status")) {
    const status = fields.status as TaskStatus;
    updates.status = status;
    if (existing.status !== "done" && status === "done") {
      updates.completed_at = new Date();
    } else if (existing.status === "done" && status !== "done") {
      updates.completed_at = null;
    }
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
  UpdateTaskResponse.parse(response);
  res.json(response);
});

export default router;
