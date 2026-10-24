import { db, managedWorkItemsTable, managedWorkOutcomesTable, projectWorkControlsTable } from '@workspace/db';
import { and, inArray, sql } from 'drizzle-orm';
import { Router, type IRouter } from 'express';
import { requireRealOwnerSession } from './auth';
import { evaluateCompanyPlan, parseCompanyPlan, type CompanyPlanManifest } from '../lib/company-plan';

export const companyPlanRouter: IRouter = Router();
/** Read-only proposal preview. No plan receipt, approval, database write or provider call. */
companyPlanRouter.post('/company/plan/preview', requireRealOwnerSession, async (req, res): Promise<void> => {
  res.setHeader('Cache-Control', 'private, no-store');
  let manifest: CompanyPlanManifest;
  try { manifest = parseCompanyPlan(req.body); }
  catch { res.status(400).json({ error: 'Invalid plan references, scope, limits or dependency graph.' }); return; }
  try {
    const [outcomes, tasks, controls] = await Promise.all([
      manifest.outcomes.length ? db.select({ id: managedWorkOutcomesTable.id, version: managedWorkOutcomesTable.version,
        project_key: managedWorkOutcomesTable.project_key, status: managedWorkOutcomesTable.status, gates: managedWorkOutcomesTable.gates })
        .from(managedWorkOutcomesTable).where(and(inArray(managedWorkOutcomesTable.id, manifest.outcomes.map(o => o.id)),
          inArray(managedWorkOutcomesTable.project_key, manifest.projects))).limit(100) : Promise.resolve([]),
      manifest.tasks.length ? db.select({ id: managedWorkItemsTable.id, plan_version: managedWorkItemsTable.plan_version,
        project_key: managedWorkItemsTable.project_key, outcome_id: managedWorkItemsTable.outcome_id,
        gate_key: managedWorkItemsTable.gate_key, status: managedWorkItemsTable.status,
        acceptance_evidence: sql<boolean>`length(trim(${managedWorkItemsTable.acceptance_evidence})) > 0` })
        .from(managedWorkItemsTable).where(and(inArray(managedWorkItemsTable.id, manifest.tasks.map(t => t.id)),
          inArray(managedWorkItemsTable.project_key, manifest.projects))).limit(200) : Promise.resolve([]),
      db.select({ project_key: projectWorkControlsTable.project_key, enabled: projectWorkControlsTable.enabled,
        completed: projectWorkControlsTable.completed }).from(projectWorkControlsTable)
        .where(inArray(projectWorkControlsTable.project_key, manifest.projects)).limit(4),
    ]);
    res.json({ version: 1, mode: 'unaccepted_preview', ...evaluateCompanyPlan(manifest, { outcomes, tasks, controls }),
      snapshot_verified: false, blocking_questions_checked: false, dispatch_readiness_checked: false,
      persistence: 'not_saved', reason: 'Preview only. Independent saved reads are not approval or permission to start work.' });
  } catch { res.status(503).json({ error: 'Plan preview is unavailable. No plan was saved or approved.' }); }
});
