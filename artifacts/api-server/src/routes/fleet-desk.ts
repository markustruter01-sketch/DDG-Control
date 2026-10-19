import { randomUUID } from "node:crypto";
import { and, desc, eq, inArray, isNull } from "drizzle-orm";
import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import {
  managedFleetAnswersTable, managedFleetConversationsTable, managedFleetMessagesTable,
  managedFleetQuestionEventsTable, managedFleetQuestionsTable, managedWorkDispatchesTable,
  managedWorkItemsTable, managedWorkOutcomesTable,
} from "@workspace/db/schema";
import { hasWorkControl, isProjectWorkEnabled } from "./work-management";
import { requireRealOwnerSession } from "./auth";

const router: IRouter = Router();
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const secretPattern = /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|(?:gh[pousr]_[A-Za-z0-9]{20,}|xai-[A-Za-z0-9_-]{20,}|sk-[A-Za-z0-9_-]{20,}|Bearer\s+[A-Za-z0-9._-]{16,})/i;

async function resolveScope(projectKey: unknown, workItemId: unknown, expectedPlan: unknown, expectedOutcome: unknown) {
  if (typeof projectKey !== "string" || !hasWorkControl(projectKey)) return { error: "Invalid project." } as const;
  let item: typeof managedWorkItemsTable.$inferSelect | null = null;
  let outcome: typeof managedWorkOutcomesTable.$inferSelect | null = null;
  if (workItemId !== null) {
    const id = Number(workItemId);
    if (!Number.isSafeInteger(id) || id < 1) return { error: "Invalid task." } as const;
    const [found] = await db.select().from(managedWorkItemsTable).where(eq(managedWorkItemsTable.id, id)).limit(1);
    if (!found || found.project_key !== projectKey) return { error: "Task does not belong to this project." } as const;
    item = found;
    if (item.outcome_id) {
      const [foundOutcome] = await db.select().from(managedWorkOutcomesTable).where(eq(managedWorkOutcomesTable.id, item.outcome_id)).limit(1);
      if (!foundOutcome || foundOutcome.project_key !== projectKey) return { error: "Task outcome does not belong to this project." } as const;
      outcome = foundOutcome;
    }
    const planVersion = item.plan_version ?? 1;
    const outcomeVersion = outcome?.version ?? null;
    if (expectedPlan !== planVersion || expectedOutcome !== outcomeVersion) {
      return { error: "The task or outcome changed. Refresh and explicitly select the current version." } as const;
    }
  } else if (expectedPlan !== null || expectedOutcome !== null) {
    return { error: "Project-only notes cannot carry task versions." } as const;
  }
  const planVersion = item ? item.plan_version ?? 1 : null;
  const outcomeVersion = outcome?.version ?? null;
  const scopeKey = `${projectKey}:task-${item?.id ?? "none"}:plan-${planVersion ?? "none"}:outcome-${outcome?.id ?? "none"}-${outcomeVersion ?? "none"}`;
  return { projectKey, item, outcome, planVersion, outcomeVersion, scopeKey } as const;
}

async function conversationFor(scope: NonNullable<Awaited<ReturnType<typeof resolveScope>> extends infer R ? R extends { scopeKey: string } ? R : never : never>) {
  await db.insert(managedFleetConversationsTable).values({
    project_key: scope.projectKey, scope_key: scope.scopeKey, work_item_id: scope.item?.id ?? null,
    plan_version: scope.planVersion, outcome_id: scope.outcome?.id ?? null, outcome_version: scope.outcomeVersion,
  }).onConflictDoNothing();
  const [conversation] = await db.select().from(managedFleetConversationsTable)
    .where(eq(managedFleetConversationsTable.scope_key, scope.scopeKey)).limit(1);
  return conversation!;
}

router.get("/fleet/thread", async (req, res): Promise<void> => {
  const taskId = typeof req.query.work_item_id === "string" ? Number(req.query.work_item_id) : null;
  let plan: number | null = null; let outcomeVersion: number | null = null;
  if (taskId !== null) {
    const [task] = await db.select().from(managedWorkItemsTable).where(eq(managedWorkItemsTable.id, taskId)).limit(1);
    if (!task) { res.status(404).json({ error: "Task not found." }); return; }
    plan = task.plan_version ?? 1;
    if (task.outcome_id) {
      const [outcome] = await db.select({ version: managedWorkOutcomesTable.version }).from(managedWorkOutcomesTable).where(eq(managedWorkOutcomesTable.id, task.outcome_id)).limit(1);
      outcomeVersion = outcome?.version ?? null;
    }
  }
  const scope = await resolveScope(req.query.project_key, taskId, plan, outcomeVersion);
  if ("error" in scope) { res.status(409).json({ error: scope.error }); return; }
  const [conversation] = await db.select().from(managedFleetConversationsTable).where(eq(managedFleetConversationsTable.scope_key, scope.scopeKey)).limit(1);
  const sameTask = scope.item ? eq(managedFleetMessagesTable.work_item_id, scope.item.id) : isNull(managedFleetMessagesTable.work_item_id);
  const sameQuestionTask = scope.item ? eq(managedFleetQuestionsTable.work_item_id, scope.item.id) : isNull(managedFleetQuestionsTable.work_item_id);
  const messages = await db.select().from(managedFleetMessagesTable)
    .where(and(eq(managedFleetMessagesTable.project_key, scope.projectKey), sameTask)).orderBy(desc(managedFleetMessagesTable.created_at));
  const questions = await db.select().from(managedFleetQuestionsTable)
    .where(and(eq(managedFleetQuestionsTable.project_key, scope.projectKey), sameQuestionTask)).orderBy(desc(managedFleetQuestionsTable.created_at));
  const answers = questions.length ? await db.select().from(managedFleetAnswersTable)
    .where(inArray(managedFleetAnswersTable.question_id, questions.map((q) => q.id))).orderBy(managedFleetAnswersTable.created_at) : [];
  const dispatchConditions = [eq(managedWorkDispatchesTable.project_key, scope.projectKey), eq(managedWorkDispatchesTable.status, "running")];
  if (scope.item) dispatchConditions.push(eq(managedWorkDispatchesTable.work_item_id, scope.item.id));
  const [activeDispatch] = await db.select().from(managedWorkDispatchesTable).where(and(...dispatchConditions)).orderBy(desc(managedWorkDispatchesTable.started_at)).limit(1);
  res.json({
    conversation_id: conversation?.id ?? null, project_key: scope.projectKey, work_item_id: scope.item?.id ?? null,
    plan_version: scope.planVersion, outcome_version: scope.outcomeVersion, messages,
    questions: questions.map((question) => ({
      ...question,
      status: question.plan_version !== scope.planVersion || question.outcome_version !== scope.outcomeVersion ? "stale" : question.status,
      answers: answers.filter((a) => a.question_id === question.id),
    })),
    worker_label: activeDispatch?.agent_id ? `Cursor agent ${activeDispatch.agent_id}` : "No active worker",
    model_label: activeDispatch?.model_id ?? "Unknown",
    delivery_blocker: "Provider messaging is unavailable; Fleet Desk content is stored on this dashboard and is not sent.",
  });
});

router.post("/fleet/messages", async (req, res): Promise<void> => {
  const body = req.body;
  if (!body || !uuidPattern.test(body.client_request_id ?? "") || !["draft", "note"].includes(body.kind) ||
      typeof body.body !== "string" || !body.body.trim() || body.body.length > 5000 || secretPattern.test(body.body)) {
    res.status(400).json({ error: "Message is invalid or contains a credential-like string." }); return;
  }
  const scope = await resolveScope(body.project_key, body.work_item_id ?? null, body.plan_version ?? null, body.outcome_version ?? null);
  if ("error" in scope) { res.status(409).json({ error: scope.error }); return; }
  const [prior] = await db.select().from(managedFleetMessagesTable).where(eq(managedFleetMessagesTable.client_request_id, body.client_request_id)).limit(1);
  if (prior) {
    const same = prior.project_key === scope.projectKey && prior.work_item_id === (scope.item?.id ?? null) &&
      prior.plan_version === scope.planVersion && prior.outcome_version === scope.outcomeVersion && prior.body === body.body && prior.kind === body.kind;
    if (!same) { res.status(409).json({ error: "Request ID was already used for a different message or target." }); return; }
    res.json({ message: prior, duplicate: true }); return;
  }
  const conversation = await conversationFor(scope);
  const [active] = await db.select({ id: managedWorkDispatchesTable.id }).from(managedWorkDispatchesTable)
    .where(and(eq(managedWorkDispatchesTable.project_key, scope.projectKey), eq(managedWorkDispatchesTable.status, "running"),
      ...(scope.item ? [eq(managedWorkDispatchesTable.work_item_id, scope.item.id)] : []))).limit(1);
  const deliveryState = body.kind === "draft" ? "draft" : active ? "queued" : "dashboard_only";
  const [message] = await db.insert(managedFleetMessagesTable).values({
    conversation_id: conversation.id, client_request_id: body.client_request_id, project_key: scope.projectKey,
    work_item_id: scope.item?.id ?? null, plan_version: scope.planVersion, outcome_id: scope.outcome?.id ?? null,
    outcome_version: scope.outcomeVersion, body: body.body.trim(), kind: body.kind, delivery_state: deliveryState,
  }).returning();
  res.status(201).json({ message, duplicate: false, delivery_note: active ? "Queued for possible owner follow-up only; not sent and does not affect the active run." : "Saved on the dashboard only; not sent." });
});

router.post("/fleet/questions", async (req, res): Promise<void> => {
  const b = req.body;
  if (!b || !uuidPattern.test(b.request_id ?? "") || typeof b.question !== "string" || !b.question.trim() || b.question.length > 1500 ||
      !Array.isArray(b.options) || b.options.length < 2 || b.options.length > 4 || b.options.some((x: unknown) => typeof x !== "string" || !x.trim() || x.length > 200) ||
      new Set(b.options).size !== b.options.length || typeof b.recommendation !== "string" || !b.recommendation.trim() || b.recommendation.length > 500 ||
      typeof b.blocks_work !== "boolean" || secretPattern.test(`${b.question} ${b.recommendation} ${b.options.join(" ")}`)) {
    res.status(400).json({ error: "Question requires a clear prompt, 2–4 unique options, recommendation, and blocking status." }); return;
  }
  const scope = await resolveScope(b.project_key, b.work_item_id ?? null, b.plan_version ?? null, b.outcome_version ?? null);
  if ("error" in scope) { res.status(409).json({ error: scope.error }); return; }
  const conversation = await conversationFor(scope);
  const questionKey = b.request_id as string;
  const [prior] = await db.select().from(managedFleetQuestionsTable).where(eq(managedFleetQuestionsTable.question_key, questionKey)).limit(1);
  if (prior) { res.status(409).json({ error: "Duplicate question request.", question: prior }); return; }
  const [question] = await db.insert(managedFleetQuestionsTable).values({
    question_key: questionKey, conversation_id: conversation.id, project_key: scope.projectKey,
    work_item_id: scope.item?.id ?? null, plan_version: scope.planVersion, outcome_id: scope.outcome?.id ?? null,
    outcome_version: scope.outcomeVersion, question: b.question.trim(), options: b.options.map((x: string) => x.trim()),
    recommendation: b.recommendation.trim(), blocks_work: b.blocks_work, status: "open",
  }).returning();
  await db.insert(managedFleetQuestionEventsTable).values({ question_id: question.id, project_key: scope.projectKey, event_type: "question_created", actor: "Markus", details: { question_version: 1, blocks_work: b.blocks_work } });
  res.status(201).json(question);
});

router.post("/fleet/questions/:id/answers", requireRealOwnerSession, async (req, res): Promise<void> => {
  const id = Number(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
  const b = req.body;
  if (!Number.isSafeInteger(id) || id < 1 || !b || !Number.isInteger(b.question_version) || typeof b.selected_option !== "string" || typeof b.comment !== "string" || b.comment.length > 1000) {
    res.status(400).json({ error: "Invalid answer." }); return;
  }
  const [question] = await db.select().from(managedFleetQuestionsTable).where(eq(managedFleetQuestionsTable.id, id)).limit(1);
  if (!question) { res.status(404).json({ error: "Question not found." }); return; }
  if (question.status !== "open" || b.question_version !== question.question_version) { res.status(409).json({ error: "Question is already answered or stale; prior answers are preserved." }); return; }
  if (b.task_plan_version !== question.plan_version || b.outcome_version !== question.outcome_version) { res.status(409).json({ error: "Answer target does not match the question's saved task and outcome version." }); return; }
  if (!question.options.includes(b.selected_option)) { res.status(400).json({ error: "Select one of the recorded options; prose is not approval." }); return; }
  const scope = await resolveScope(question.project_key, question.work_item_id, question.plan_version, question.outcome_version);
  if ("error" in scope) {
    await db.update(managedFleetQuestionsTable).set({ status: "stale" }).where(eq(managedFleetQuestionsTable.id, id));
    await db.insert(managedFleetQuestionEventsTable).values({ question_id: id, project_key: question.project_key, event_type: "question_marked_stale", actor: "system", details: { reason: "plan_or_outcome_version_changed" } });
    res.status(409).json({ error: "The task/outcome version changed. Question marked stale; create a new question for the revised plan." }); return;
  }
  if (secretPattern.test(b.comment)) { res.status(400).json({ error: "Do not store credentials in an owner answer." }); return; }
  let answer: typeof managedFleetAnswersTable.$inferSelect;
  try {
    [answer] = await db.insert(managedFleetAnswersTable).values({ question_id: id, question_version: question.question_version, selected_option: b.selected_option, comment: b.comment.trim() }).returning();
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "23505") {
      res.status(409).json({ error: "A decision was already recorded for this question version; prior answers are preserved." }); return;
    }
    throw error;
  }
  await db.update(managedFleetQuestionsTable).set({ status: "answered" }).where(eq(managedFleetQuestionsTable.id, id));
  await db.insert(managedFleetQuestionEventsTable).values({ question_id: id, project_key: question.project_key, event_type: "answer_recorded", actor: "Markus", details: { question_version: question.question_version, selected_option: b.selected_option } });
  res.status(201).json({ answer, resumed: false, approval_granted: false, note: "Answer recorded only. Work prerequisites must be checked again; this does not resume or approve work." });
});

export default router;
