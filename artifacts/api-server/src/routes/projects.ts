import { db, projectsTable, type Project } from "@workspace/db";
import {
  GetProjectParams,
  GetProjectResponse,
  ListProjectsResponse,
} from "@workspace/api-zod";
import { PROJECT_STATUSES, type ProjectStatus } from "@workspace/project-constants";
import { eq } from "drizzle-orm";
import { Router, type IRouter } from "express";

const router: IRouter = Router();

const initialProjects: Array<typeof projectsTable.$inferInsert> = [
  {
    slug: "hypest",
    name: "DD - Hypest",
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
    slug: "gods-eye-view",
    name: "Gods Eye View",
    description: null,
    status: PROJECT_STATUSES[0],
    sort_order: 4,
  },
];

export async function seedProjectsIfEmpty(): Promise<void> {
  const existing = await db
    .select({ id: projectsTable.id })
    .from(projectsTable)
    .limit(1);

  if (existing.length === 0) {
    await db.insert(projectsTable).values(initialProjects);
  }
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
    res.status(400).json({ error: params.error.message });
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

export default router;
