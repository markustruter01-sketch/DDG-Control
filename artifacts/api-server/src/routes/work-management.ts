import { db, projectHandoverTable, projectWorkAuditTable, projectWorkControlsTable, projectsTable } from "@workspace/db";
import { desc, eq } from "drizzle-orm";
import { Router, type IRouter } from "express";

export const WORK_KEYS = ["finance", "hypest", "cattle-dog-coffee", "ddg-control-ai-stack"] as const;
export type WorkKey = (typeof WORK_KEYS)[number];

export async function isProjectWorkEnabled(key: string): Promise<boolean> {
  if (!WORK_KEYS.includes(key as WorkKey)) return false;
  const [row] = await db.select({ enabled: projectWorkControlsTable.enabled })
    .from(projectWorkControlsTable).where(eq(projectWorkControlsTable.project_key, key)).limit(1);
  return row?.enabled === true;
}

const router: IRouter = Router();

router.get("/work-controls", async (_req, res): Promise<void> => {
  for (const project_key of WORK_KEYS) {
    await db.insert(projectWorkControlsTable).values({ project_key }).onConflictDoNothing();
  }
  const controls = await db.select().from(projectWorkControlsTable);
  const audit = await db.select().from(projectWorkAuditTable).orderBy(desc(projectWorkAuditTable.created_at)).limit(30);
  res.json({ controls, audit });
});

router.patch("/work-controls/:key", async (req, res): Promise<void> => {
  const key = Array.isArray(req.params.key) ? req.params.key[0] : req.params.key;
  if (!WORK_KEYS.includes(key as WorkKey) || typeof req.body?.enabled !== "boolean" || req.body?.owner_confirmed !== true) {
    res.status(400).json({ error: "Choose a valid work area and confirm the change as owner." });
    return;
  }
  const enabled = req.body.enabled as boolean;
  await db.insert(projectWorkControlsTable).values({ project_key: key, enabled })
    .onConflictDoUpdate({ target: projectWorkControlsTable.project_key, set: { enabled, updated_by: "Markus", updated_at: new Date() } });
  await db.insert(projectWorkAuditTable).values({ project_key: key, enabled, owner_confirmed: true });
  const [control] = await db.select().from(projectWorkControlsTable).where(eq(projectWorkControlsTable.project_key, key)).limit(1);
  res.json(control);
});

router.get("/work-handovers", async (req, res): Promise<void> => {
  const key = typeof req.query.project_key === "string" ? req.query.project_key : null;
  const query = db.select({
    id: projectHandoverTable.id, project_key: projectHandoverTable.project_key,
    project_id: projectHandoverTable.project_id, task_id: projectHandoverTable.task_id,
    branch: projectHandoverTable.branch, commit_ref: projectHandoverTable.commit_ref,
    status: projectHandoverTable.status, completed_work: projectHandoverTable.completed_work,
    next_action: projectHandoverTable.next_action, blockers: projectHandoverTable.blockers,
    verification: projectHandoverTable.verification, recovery_note: projectHandoverTable.recovery_note,
    created_at: projectHandoverTable.created_at,
  }).from(projectHandoverTable);
  const rows = key ? await query.where(eq(projectHandoverTable.project_key, key)).orderBy(desc(projectHandoverTable.created_at)).limit(50) : await query.orderBy(desc(projectHandoverTable.created_at)).limit(100);
  res.json(rows);
});

router.post("/work-handovers", async (req, res): Promise<void> => {
  const b = req.body;
  if (!b || !WORK_KEYS.includes(b.project_key) || typeof b.status !== "string" || typeof b.completed_work !== "string" || typeof b.next_action !== "string" || typeof b.recovery_note !== "string" || typeof b.blockers !== "string" || typeof b.verification !== "string" || (b.branch != null && typeof b.branch !== "string") || (b.commit_ref != null && typeof b.commit_ref !== "string") || (b.task_id != null && !Number.isInteger(b.task_id))) {
    res.status(400).json({ error: "Provide project, status, completed work, next action, blockers, verification, and recovery note." });
    return;
  }
  const [project] = await db.select({ id: projectsTable.id }).from(projectsTable).where(eq(projectsTable.slug, b.project_key)).limit(1);
  const [saved] = await db.insert(projectHandoverTable).values({
    project_key: b.project_key, project_id: project?.id ?? null, task_id: b.task_id ?? null,
    branch: b.branch ?? null, commit_ref: b.commit_ref ?? null, status: b.status,
    completed_work: b.completed_work, next_action: b.next_action, blockers: b.blockers,
    verification: b.verification, recovery_note: b.recovery_note,
  }).returning();
  res.status(201).json(saved);
});

export default router;
