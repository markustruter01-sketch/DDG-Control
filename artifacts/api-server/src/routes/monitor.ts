import { db, projectsTable, tasksTable, managedWorkEventsTable } from '@workspace/db';
import { desc } from 'drizzle-orm';
import { Router, type IRouter } from 'express';

const router: IRouter = Router();
router.get('/monitor', async (_req, res): Promise<void> => {
  res.setHeader('Cache-Control', 'private, no-store');
  // Existing records only. No seeding, schema changes, external API or model calls.
  const [projects, tasks, activity] = await Promise.allSettled([
    db.select({ id: projectsTable.id, slug: projectsTable.slug, name: projectsTable.name,
      status: projectsTable.status, source_url: projectsTable.drive_url }).from(projectsTable).orderBy(projectsTable.sort_order, projectsTable.id).limit(101),
    db.select({ id: tasksTable.id, project_id: tasksTable.project_id, title: tasksTable.title,
      status: tasksTable.status }).from(tasksTable).orderBy(desc(tasksTable.id)).limit(201),
    db.select({ id: managedWorkEventsTable.id, project_key: managedWorkEventsTable.project_key,
      event_type: managedWorkEventsTable.event_type, actor: managedWorkEventsTable.actor,
      recorded_at: managedWorkEventsTable.created_at }).from(managedWorkEventsTable).orderBy(desc(managedWorkEventsTable.id)).limit(31),
  ]);
  const source = (result: PromiseSettledResult<unknown[]>, limit: number) => ({
    available: result.status === 'fulfilled', truncated: result.status === 'fulfilled' && result.value.length > limit,
  });
  if ([projects, tasks, activity].every(r => r.status === 'rejected')) {
    res.status(503).json({ error: 'Saved monitoring records are unavailable.' }); return;
  }
  res.json({ version: 1, read_at: new Date().toISOString(), evidence: 'saved_records', live_verified: false,
    sources: { projects: source(projects, 100), tasks: source(tasks, 200), activity: source(activity, 30) },
    projects: projects.status === 'fulfilled' ? projects.value.slice(0, 100) : [],
    tasks: tasks.status === 'fulfilled' ? tasks.value.slice(0, 200) : [],
    activity: activity.status === 'fulfilled' ? activity.value.slice(0, 30) : [],
  });
});
export default router;
