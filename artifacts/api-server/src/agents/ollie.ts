import {
  agentProjectUpdatesTable,
  agentRunsTable,
  db,
  membersTable,
  projectsTable,
  tasksTable,
} from "@workspace/db";
import { STATUS_LIGHTS } from "@workspace/project-constants";
import { eq, inArray } from "drizzle-orm";
import { z } from "zod/v4";
import {
  isCalendarDate,
  validateCalendarDate,
  validateTitle,
} from "../routes/validation";

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
