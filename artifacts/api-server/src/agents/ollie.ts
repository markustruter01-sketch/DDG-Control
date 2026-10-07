import {
  agentProjectUpdatesTable,
  agentRunsTable,
  db,
  goalsTable,
  membersTable,
  metricSnapshotsTable,
  projectsTable,
  tasksTable,
} from "@workspace/db";
import {
  AGENT_RUN_STATUSES,
  GOAL_STATUSES,
  METRIC_DEFINITIONS,
  STATUS_LIGHTS,
  type MetricKey,
} from "@workspace/project-constants";
import { and, desc, eq, gte, inArray, ne } from "drizzle-orm";
import { z } from "zod/v4";
import { readFile } from "node:fs/promises";
import {
  isCalendarDate,
  validateCalendarDate,
  validateTitle,
} from "../routes/validation";
import { logger } from "../lib/logger";

export const OllieForm = z
  .object({
    report_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    projects: z.array(
      z
        .object({
          slug: z.string(),
          status_light: z.enum(STATUS_LIGHTS),
          summary: z.string().min(1).max(200),
          next_action: z.string().min(1).max(120),
          risks: z.array(z.string().min(1).max(200)).max(5),
        })
        .strict(),
    ),
    proposed_tasks: z
      .array(
        z
          .object({
            project_slug: z.string(),
            title: z.string().min(1).max(200),
            owner_name: z.string(),
            due_date: z.union([z.string().regex(/^\d{4}-\d{2}-\d{2}$/), z.null()]),
            reason: z.string().min(1).max(200),
          })
          .strict(),
      )
      .max(5),
  })
  .strict();

export const ollieFormJsonSchema = z.toJSONSchema(OllieForm);

export async function slotOllieReport(
  runId: number,
  rawText: string,
): Promise<{ status: "ok" | "invalid"; taskIds: number[]; error?: string }> {
  try {
    const parsed = OllieForm.safeParse(JSON.parse(rawText) as unknown);
    if (!parsed.success) {
      const errorText = parsed.error.issues
        .map((issue) => {
          const path = issue.path.join(".");
          return path ? `${path}: ${issue.message}` : issue.message;
        })
        .join("; ");
      throw new Error(errorText);
    }

    const form = parsed.data;
    if (!isCalendarDate(form.report_date)) {
      throw new Error("report_date must be a real YYYY-MM-DD date");
    }

    const seenProjectSlugs = new Set<string>();
    for (const project of form.projects) {
      if (seenProjectSlugs.has(project.slug)) {
        throw new Error(`duplicate project slug: ${project.slug}`);
      }
      seenProjectSlugs.add(project.slug);
    }

    const allProjectSlugs = Array.from(
      new Set([
        ...form.projects.map((project) => project.slug),
        ...form.proposed_tasks.map((task) => task.project_slug),
      ]),
    );
    const existingProjects =
      allProjectSlugs.length > 0
        ? await db
            .select({ id: projectsTable.id, slug: projectsTable.slug })
            .from(projectsTable)
            .where(inArray(projectsTable.slug, allProjectSlugs))
        : [];
    const projectBySlug = new Map(
      existingProjects.map((project) => [project.slug, project]),
    );
    for (const slug of allProjectSlugs) {
      if (!projectBySlug.has(slug)) {
        throw new Error(`unknown project: ${slug}`);
      }
    }

    const ownerNames = Array.from(
      new Set(form.proposed_tasks.map((task) => task.owner_name)),
    );
    const existingMembers =
      ownerNames.length > 0
        ? await db
            .select({ id: membersTable.id, name: membersTable.name })
            .from(membersTable)
            .where(inArray(membersTable.name, ownerNames))
        : [];
    const memberByName = new Map(
      existingMembers.map((member) => [member.name, member]),
    );
    for (const ownerName of ownerNames) {
      if (!memberByName.has(ownerName)) {
        throw new Error(`unknown member: ${ownerName}`);
      }
    }

    const checkedTasks = form.proposed_tasks.map((task) => {
      const titleResult = validateTitle(task.title);
      if ("error" in titleResult) {
        throw new Error(titleResult.error);
      }

      const dueDateResult = validateCalendarDate(task.due_date, "due_date");
      if ("error" in dueDateResult) {
        throw new Error(dueDateResult.error);
      }

      return {
        ...task,
        title: titleResult.value,
        due_date: dueDateResult.value,
      };
    });

    const projectUpdates = form.projects.map((project) => {
      const dbProject = projectBySlug.get(project.slug);
      if (!dbProject) {
        throw new Error(`unknown project: ${project.slug}`);
      }
      return {
        run_id: runId,
        project_id: dbProject.id,
        status_light: project.status_light,
        summary: project.summary,
        next_action: project.next_action,
        risks: project.risks,
      };
    });

    const tasks = checkedTasks.map((task) => {
      const dbProject = projectBySlug.get(task.project_slug);
      const owner = memberByName.get(task.owner_name);
      if (!dbProject) {
        throw new Error(`unknown project: ${task.project_slug}`);
      }
      if (!owner) {
        throw new Error(`unknown member: ${task.owner_name}`);
      }
      return {
        project_id: dbProject.id,
        title: task.title,
        notes: `Ollie: ${task.reason}`,
        status: "needs_approval",
        owner_id: owner.id,
        due_date: task.due_date,
      };
    });

    const taskIds = await db.transaction(async (tx) => {
      if (projectUpdates.length > 0) {
        await tx.insert(agentProjectUpdatesTable).values(projectUpdates);
      }

      const insertedTasks =
        tasks.length > 0
          ? await tx
              .insert(tasksTable)
              .values(tasks)
              .returning({ id: tasksTable.id })
          : [];

      const [updatedRun] = await tx
        .update(agentRunsTable)
        .set({ status: "ok", finished_at: new Date() })
        .where(eq(agentRunsTable.id, runId))
        .returning({ id: agentRunsTable.id });
      if (!updatedRun) {
        throw new Error(`agent run not found: ${runId}`);
      }

      return insertedTasks.map((task) => task.id);
    });

    return { status: "ok", taskIds };
  } catch (error) {
    const errorText = error instanceof Error ? error.message : String(error);
    await db
      .update(agentRunsTable)
      .set({
        status: "invalid",
        error: errorText,
        raw_output: rawText,
        finished_at: new Date(),
      })
      .where(eq(agentRunsTable.id, runId));
    return { status: "invalid", taskIds: [], error: errorText };
  }
}

type AgentRunRow = typeof agentRunsTable.$inferSelect;
type SerializedAgentRun = Omit<AgentRunRow, "started_at" | "finished_at"> & {
  started_at: string;
  finished_at: string | null;
};

export type OllieRunOutcome = {
  httpStatus: number;
  response: SerializedAgentRun | { error: string };
};

let ollieRunInProgress = false;
let providerAttemptedDate: string | null = null;

function brisbaneDate(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-AU", {
    timeZone: "Australia/Brisbane",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;
  if (!year || !month || !day) {
    throw new Error("could not determine Brisbane calendar date");
  }
  return `${year}-${month}-${day}`;
}

function redactSnapshotText(value: string | null, apiKey: string): string | null {
  if (value === null) {
    return null;
  }

  let safeValue = value
    .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, "[redacted email]")
    .replace(
      /\b(?:Bearer\s+)?(?:xai-[A-Za-z0-9_-]{12,}|sk-[A-Za-z0-9_-]{12,})\b/gi,
      "[redacted secret]",
    )
    .replace(
      /\b(api[_ -]?key|password|secret)\s*[:=]\s*[^\s,;]+/gi,
      "$1=[redacted]",
    );
  if (apiKey.length > 0) {
    safeValue = safeValue.split(apiKey).join("[redacted secret]");
  }
  return safeValue;
}

async function buildOllieSnapshot(
  date: string,
  ollieMemberId: number,
  apiKey: string,
): Promise<string> {
  const [
    projects,
    activeGoals,
    openTasks,
    metricRows,
    members,
    ollieUpdateRows,
  ] = await Promise.all([
    db.select().from(projectsTable).orderBy(projectsTable.sort_order),
    db
      .select({
        project_slug: projectsTable.slug,
        title: goalsTable.title,
        target_date: goalsTable.target_date,
      })
      .from(goalsTable)
      .innerJoin(projectsTable, eq(goalsTable.project_id, projectsTable.id))
      .where(eq(goalsTable.status, GOAL_STATUSES[0])),
    db
      .select({
        project_slug: projectsTable.slug,
        title: tasksTable.title,
        status: tasksTable.status,
        owner_name: membersTable.name,
        due_date: tasksTable.due_date,
      })
      .from(tasksTable)
      .innerJoin(projectsTable, eq(tasksTable.project_id, projectsTable.id))
      .innerJoin(membersTable, eq(tasksTable.owner_id, membersTable.id))
      .where(ne(tasksTable.status, "done")),
    db
      .select({
        project_id: metricSnapshotsTable.project_id,
        project_slug: projectsTable.slug,
        key: metricSnapshotsTable.key,
        value: metricSnapshotsTable.value,
        captured_at: metricSnapshotsTable.captured_at,
      })
      .from(metricSnapshotsTable)
      .innerJoin(
        projectsTable,
        eq(metricSnapshotsTable.project_id, projectsTable.id),
      )
      .orderBy(desc(metricSnapshotsTable.captured_at)),
    db
      .select({ name: membersTable.name, kind: membersTable.kind })
      .from(membersTable)
      .orderBy(membersTable.id),
    db
      .select({
        project_id: agentProjectUpdatesTable.project_id,
        status_light: agentProjectUpdatesTable.status_light,
        summary: agentProjectUpdatesTable.summary,
        next_action: agentProjectUpdatesTable.next_action,
        created_at: agentProjectUpdatesTable.created_at,
      })
      .from(agentProjectUpdatesTable)
      .innerJoin(
        agentRunsTable,
        eq(agentProjectUpdatesTable.run_id, agentRunsTable.id),
      )
      .where(eq(agentRunsTable.member_id, ollieMemberId))
      .orderBy(desc(agentProjectUpdatesTable.created_at)),
  ]);

  const latestMetricKeys = new Set<string>();
  const latestFigures: Array<{
    project_slug: string;
    key: string;
    label: string;
    value: number;
    unit: string;
    captured_at: string;
  }> = [];
  for (const row of metricRows) {
    const compositeKey = `${row.project_id}:${row.key}`;
    if (latestMetricKeys.has(compositeKey)) {
      continue;
    }
    latestMetricKeys.add(compositeKey);

    const definition = METRIC_DEFINITIONS[row.key as MetricKey];
    if (!definition) {
      continue;
    }
    latestFigures.push({
      project_slug: row.project_slug,
      key: row.key,
      label: definition.label,
      value: row.value,
      unit: definition.unit,
      captured_at: row.captured_at.toISOString(),
    });
  }

  const latestUpdateByProject = new Map<
    number,
    (typeof ollieUpdateRows)[number]
  >();
  for (const update of ollieUpdateRows) {
    if (!latestUpdateByProject.has(update.project_id)) {
      latestUpdateByProject.set(update.project_id, update);
    }
  }

  return JSON.stringify({
    today: date,
    projects: projects.map((project) => ({
      slug: project.slug,
      name: project.name,
      status: project.status,
      description: redactSnapshotText(project.description, apiKey),
    })),
    active_goals: activeGoals.map((goal) => ({
      project_slug: goal.project_slug,
      title: redactSnapshotText(goal.title, apiKey),
      target_date: goal.target_date,
    })),
    tasks: openTasks.map((task) => ({
      project_slug: task.project_slug,
      title: redactSnapshotText(task.title, apiKey),
      status: task.status,
      owner_name: task.owner_name,
      due_date: task.due_date,
    })),
    latest_figures: latestFigures,
    members: members.map((member) => ({
      name: member.name,
      kind: member.kind,
    })),
    ollie_latest_updates: projects.flatMap((project) => {
      const update = latestUpdateByProject.get(project.id);
      return update
        ? [
            {
              project_slug: project.slug,
              status_light: update.status_light,
              summary: redactSnapshotText(update.summary, apiKey),
              next_action: redactSnapshotText(update.next_action, apiKey),
            },
          ]
        : [];
    }),
  });
}

function serializeAgentRun(run: AgentRunRow): SerializedAgentRun {
  return {
    ...run,
    started_at: run.started_at.toISOString(),
    finished_at: run.finished_at?.toISOString() ?? null,
  };
}

async function getRunOutcome(runId: number): Promise<OllieRunOutcome> {
  const [run] = await db
    .select()
    .from(agentRunsTable)
    .where(eq(agentRunsTable.id, runId));
  if (!run) {
    return { httpStatus: 500, response: { error: "run not found" } };
  }
  return { httpStatus: 200, response: serializeAgentRun(run) };
}

async function setRunError(runId: number, error: string): Promise<void> {
  await db
    .update(agentRunsTable)
    .set({ status: "error", error, finished_at: new Date() })
    .where(eq(agentRunsTable.id, runId));
}

export async function runOllie(
  options: { force?: boolean } = {},
): Promise<OllieRunOutcome> {
  if (ollieRunInProgress) {
    logger.info({ reason: "already running" }, "ollie-run-skipped");
    return { httpStatus: 409, response: { error: "already running" } };
  }

  ollieRunInProgress = true;
  try {
    const [ollieMember] = await db
      .select({ id: membersTable.id })
      .from(membersTable)
      .where(eq(membersTable.name, "Ollie"));
    if (!ollieMember) {
      return {
        httpStatus: 503,
        response: { error: "Ollie member not found" },
      };
    }

    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    const [recentRun] = await db
      .select({ id: agentRunsTable.id })
      .from(agentRunsTable)
      .where(
        and(
          eq(agentRunsTable.member_id, ollieMember.id),
          eq(agentRunsTable.status, "running"),
          gte(agentRunsTable.started_at, tenMinutesAgo),
        ),
      )
      .limit(1);
    if (recentRun) {
      logger.info(
        { runId: recentRun.id, reason: "already running" },
        "ollie-run-skipped",
      );
      return { httpStatus: 409, response: { error: "already running" } };
    }

    const today = brisbaneDate(new Date());
    if (options.force !== true) {
      if (providerAttemptedDate === today) {
        logger.info({ today }, "ollie-run-skipped");
        return { httpStatus: 409, response: { error: "already ran today" } };
      }
      const completedRuns = await db
        .select({
          started_at: agentRunsTable.started_at,
          status: agentRunsTable.status,
          error: agentRunsTable.error,
        })
        .from(agentRunsTable)
        .where(
          and(
            eq(agentRunsTable.member_id, ollieMember.id),
            inArray(agentRunsTable.status, AGENT_RUN_STATUSES.slice(1)),
          ),
        );
      if (
        completedRuns.some(
          (run) =>
            brisbaneDate(run.started_at) === today &&
            !(run.status === "error" && run.error === "could not build Ollie snapshot"),
        )
      ) {
        logger.info({ today }, "ollie-run-skipped");
        return { httpStatus: 409, response: { error: "already ran today" } };
      }
    }

    const model = process.env.XAI_MODEL?.trim();
    const apiKey = process.env.XAI_API_KEY;
    if (!model || !apiKey) {
      logger.error(
        { modelConfigured: Boolean(model), apiKeyConfigured: Boolean(apiKey) },
        "ollie-provider-not-configured",
      );
      return { httpStatus: 503, response: { error: "xai not configured" } };
    }

    const [run] = await db
      .insert(agentRunsTable)
      .values({
        member_id: ollieMember.id,
        status: "running",
        model,
      })
      .returning();
    if (!run) {
      return { httpStatus: 500, response: { error: "could not create run" } };
    }

    let instructions: string;
    let snapshot: string;
    try {
      [instructions, snapshot] = await Promise.all([
        readFile(new URL("../src/agents/ollie-instructions.md", import.meta.url), "utf8"),
        buildOllieSnapshot(today, ollieMember.id, apiKey),
      ]);
    } catch {
      await setRunError(run.id, "could not build Ollie snapshot");
      return getRunOutcome(run.id);
    }

    const controller = new AbortController();
    let timedOut = false;
    const timeout = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, 60_000);

    try {
      providerAttemptedDate = today;
      logger.info({ runId: run.id }, "ollie-provider-request-start");
      const response = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: instructions },
            { role: "user", content: snapshot },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "ollie_daily_report",
              schema: ollieFormJsonSchema,
              strict: true,
            },
          },
          max_tokens: 2000,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        await setRunError(run.id, `xai ${response.status}`);
        logger.warn(
          { runId: run.id, status: response.status },
          "ollie-provider-request-failed",
        );
        return getRunOutcome(run.id);
      }

      let responseBody: unknown;
      try {
        responseBody = await response.json();
      } catch {
        const error = timedOut ? "timeout" : "xai invalid response";
        await setRunError(run.id, error);
        if (timedOut) {
          logger.warn({ runId: run.id }, "ollie-provider-request-timeout");
        }
        return getRunOutcome(run.id);
      }
      clearTimeout(timeout);

      if (
        responseBody === null ||
        typeof responseBody !== "object" ||
        Array.isArray(responseBody)
      ) {
        await setRunError(run.id, "xai invalid response");
        return getRunOutcome(run.id);
      }
      const completion = responseBody as Record<string, unknown>;
      const usage =
        completion.usage &&
        typeof completion.usage === "object" &&
        !Array.isArray(completion.usage)
          ? (completion.usage as Record<string, unknown>)
          : null;
      const promptTokens = usage?.prompt_tokens;
      const completionTokens = usage?.completion_tokens;
      if (
        !Number.isInteger(promptTokens) ||
        !Number.isInteger(completionTokens) ||
        (promptTokens as number) < 0 ||
        (completionTokens as number) < 0
      ) {
        await setRunError(run.id, "xai invalid usage");
        return getRunOutcome(run.id);
      }

      await db
        .update(agentRunsTable)
        .set({
          input_tokens: promptTokens as number,
          output_tokens: completionTokens as number,
        })
        .where(eq(agentRunsTable.id, run.id));

      const choices = completion.choices;
      const firstChoice =
        Array.isArray(choices) && choices.length > 0 ? choices[0] : null;
      const message =
        firstChoice &&
        typeof firstChoice === "object" &&
        "message" in firstChoice &&
        firstChoice.message &&
        typeof firstChoice.message === "object" &&
        "content" in firstChoice.message
          ? firstChoice.message
          : null;
      const content =
        message && typeof message.content === "string" ? message.content : null;
      if (content === null) {
        await setRunError(run.id, "xai missing message content");
        return getRunOutcome(run.id);
      }

      let candidate: unknown;
      try {
        candidate = JSON.parse(content);
      } catch {
        candidate = undefined;
      }
      const candidateReport = OllieForm.safeParse(candidate);
      if (candidateReport.success) {
        const snapshotProjectSlugs = (
          JSON.parse(snapshot) as { projects: Array<{ slug: string }> }
        ).projects
          .map((project) => project.slug)
          .sort();
        const reportProjectSlugs = candidateReport.data.projects
          .map((project) => project.slug)
          .sort();
        if (
          reportProjectSlugs.length !== snapshotProjectSlugs.length ||
          reportProjectSlugs.some(
            (slug, index) => slug !== snapshotProjectSlugs[index],
          )
        ) {
          await db
            .update(agentRunsTable)
            .set({
              status: "invalid",
              error: "report must contain exactly one entry per project",
              raw_output: content,
              finished_at: new Date(),
            })
            .where(eq(agentRunsTable.id, run.id));
          return getRunOutcome(run.id);
        }
      }

      await slotOllieReport(run.id, content);
      return getRunOutcome(run.id);
    } catch {
      const error = timedOut ? "timeout" : "xai network error";
      await setRunError(run.id, error);
      if (timedOut) {
        logger.warn({ runId: run.id }, "ollie-provider-request-timeout");
      } else {
        logger.warn({ runId: run.id }, "ollie-provider-request-failed");
      }
      return getRunOutcome(run.id);
    } finally {
      clearTimeout(timeout);
    }
  } finally {
    ollieRunInProgress = false;
  }
}
