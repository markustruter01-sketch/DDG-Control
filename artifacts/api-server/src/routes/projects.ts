import { db, membersTable, projectsTable, type Project } from "@workspace/db";
import {
  GetProjectParams,
  GetProjectResponse,
  ListProjectsResponse,
  UpdateProjectParams,
  UpdateProjectResponse,
} from "@workspace/api-zod";
import {
  MEMBER_KINDS,
  PROJECT_STATUSES,
  type ProjectStatus,
} from "@workspace/project-constants";
import { eq } from "drizzle-orm";
import { Router, type IRouter } from "express";
import { zodErrorText } from "./validation";
import { hasWorkControl, isProjectWorkEnabled, withProjectWorkWrite } from "../lib/managed-work-controls";
import { requireRealOwnerSession } from "./auth";

const router: IRouter = Router();

const initialProjects: Array<typeof projectsTable.$inferInsert> = [
  {
    slug: "hypest",
    name: "DDG - Hypest",
    description: null,
    status: PROJECT_STATUSES[0],
    sort_order: 1,
  },
  {
    slug: "finance",
    name: "DDG - Finance",
    description: null,
    status: PROJECT_STATUSES[0],
    sort_order: 2,
  },
  {
    slug: "cattle-dog-coffee",
    name: "Cattle Dog Coffee",
    description: null,
    status: PROJECT_STATUSES[0],
    sort_order: 3,
  },
  {
    slug: "ddg-music",
    name: "DDG Music",
    description: null,
    status: PROJECT_STATUSES[0],
    sort_order: 4,
  },
];

const initialMembers: Array<typeof membersTable.$inferInsert> = [
  { name: "Markus", kind: MEMBER_KINDS[0] },
];

export async function seedProjectsIfEmpty(): Promise<void> {
  const existing = await db
    .select({ id: projectsTable.id })
    .from(projectsTable)
    .limit(1);

  if (existing.length === 0) {
    await db.insert(projectsTable).values(initialProjects);
  }

  // One-time venture swap (approved by Markus 11 Oct 2026): Gods Eye View moved
  // to another Claude account; its slot becomes DDG Music. Idempotent: a no-op
  // once no row has the old slug. Keeps the row id, so history stays attached.
  await db
    .update(projectsTable)
    .set({ slug: "ddg-music", name: "DDG Music", description: null })
    .where(eq(projectsTable.slug, "gods-eye-view"));

  const existingMembers = await db
    .select({ id: membersTable.id })
    .from(membersTable)
    .limit(1);

  if (existingMembers.length === 0) {
    await db.insert(membersTable).values(initialMembers)
      .onConflictDoNothing({ target: membersTable.name });
  }

  // Company roles are not runtime accounts. Do not create agent members
  // from a presentation roster on startup. Existing rows/IDs/history remain.
  // A report-writer actor must be provisioned explicitly by the owner.
}

function toApiProject(project: Project) {
  if (
    !PROJECT_STATUSES.includes(
      project.status as ProjectStatus,
    )
  ) {
    throw new Error(`Project "${project.slug}" has an invalid status`);
  }

  return {
    ...project,
    created_at: project.created_at?.toISOString() ?? null,
  };
}

router.get("/projects", async (_req, res): Promise<void> => {
  const projects = await db
    .select()
    .from(projectsTable)
    .orderBy(projectsTable.sort_order);

  res.json(ListProjectsResponse.parse(projects.map(toApiProject)));
});

router.get("/projects/:slug", async (req, res): Promise<void> => {
  const params = GetProjectParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: zodErrorText(params.error) });
    return;
  }

  const [project] = await db
    .select()
    .from(projectsTable)
    .where(eq(projectsTable.slug, params.data.slug))
    .limit(1);

  if (!project) {
    res.status(404).json({ error: "not found" });
    return;
  }

  res.json(GetProjectResponse.parse(toApiProject(project)));
});

router.patch("/projects/:slug", requireRealOwnerSession, async (req, res): Promise<void> => {
  const params = UpdateProjectParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: zodErrorText(params.error) });
    return;
  }

  const [existing] = await db
    .select({ id: projectsTable.id })
    .from(projectsTable)
    .where(eq(projectsTable.slug, params.data.slug))
    .limit(1);

  if (!existing) {
    res.status(404).json({ error: "not found" });
    return;
  }
  if (hasWorkControl(params.data.slug) && !(await isProjectWorkEnabled(params.data.slug))) {
    res.status(423).json({ error: "Project work is OFF. Project updates are paused." });
    return;
  }

  if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
    res.status(400).json({ error: "request body must be an object" });
    return;
  }

  const body = req.body as Record<string, unknown>;
  const unknownField = Object.keys(body).find(
    (field) =>
      field !== "status" &&
      field !== "description" &&
      field !== "drive_url",
  );
  if (unknownField) {
    res.status(400).json({ error: `unknown field: ${unknownField}` });
    return;
  }

  const fields = Object.keys(body);
  if (fields.length === 0) {
    res.status(400).json({ error: "nothing to update" });
    return;
  }

  const updates: Partial<
    Pick<
      typeof projectsTable.$inferInsert,
      "status" | "description" | "drive_url"
    >
  > = {};

  if (Object.hasOwn(body, "status")) {
    const status = body.status;
    if (
      typeof status !== "string" ||
      !PROJECT_STATUSES.includes(status as ProjectStatus)
    ) {
      res.status(400).json({ error: "invalid status" });
      return;
    }
    updates.status = status;
  }

  if (Object.hasOwn(body, "description")) {
    const description = body.description;
    if (description !== null && typeof description !== "string") {
      res.status(400).json({ error: "description must be a string or null" });
      return;
    }

    const trimmedDescription =
      typeof description === "string" ? description.trim() : null;
    if (trimmedDescription !== null && trimmedDescription.length > 2000) {
      res.status(400).json({ error: "description exceeds 2000 characters" });
      return;
    }
    updates.description = trimmedDescription || null;
  }

  if (Object.hasOwn(body, "drive_url")) {
    const driveUrl = body.drive_url;
    if (driveUrl === null || driveUrl === "") {
      updates.drive_url = null;
    } else if (typeof driveUrl !== "string") {
      res.status(400).json({ error: "drive_url must be a string or null" });
      return;
    } else if (driveUrl.length > 500) {
      res.status(400).json({ error: "drive_url exceeds 500 characters" });
      return;
    } else if (!driveUrl.startsWith("https://drive.google.com/")) {
      res.status(400).json({ error: "invalid drive_url" });
      return;
    } else {
      updates.drive_url = driveUrl;
    }
  }

  const mutation = await withProjectWorkWrite(params.data.slug, tx => tx
    .update(projectsTable)
    .set(updates)
    .where(eq(projectsTable.slug, params.data.slug))
    .returning());
  if (!mutation.allowed) { res.status(423).json({ error: "Project work is OFF, held or complete. Project updates are paused." }); return; }
  const [updated] = mutation.value;

  if (!updated) {
    res.status(404).json({ error: "not found" });
    return;
  }

  res.json(UpdateProjectResponse.parse(toApiProject(updated)));
});

export default router;
