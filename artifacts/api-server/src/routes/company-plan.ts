import { db, managedWorkItemsTable, managedWorkOutcomesTable, projectWorkControlsTable } from '@workspace/db';
import { and, inArray, sql } from 'drizzle-orm';
import { Router, type IRouter } from 'express';
import { requireRealOwnerSession } from './auth';
import { evaluateCompanyPlan, parseCompanyPlan, type CompanyPlanManifest } from '../lib/company-plan';
import { COMPANY_PLAN_REVISIONS_VERIFIED, CompanyPlanError, parseCompanyPlanCommand, readCompanyPlanRevisions, recordCompanyPlanRevision } from '../lib/company-plan-revisions';

export const companyPlanRouter: IRouter = Router();
const planError = (res: import('express').Response, error: unknown) => res.status(error instanceof CompanyPlanError ? error.status : 503)
  .json({ error: error instanceof CompanyPlanError ? error.message : 'Saved plan records are unavailable.' });
companyPlanRouter.get('/company/plan/revisions', requireRealOwnerSession, async (_req, res): Promise<void> => {
  res.setHeader('Cache-Control', 'private, no-store');
  try { res.json(await readCompanyPlanRevisions()); } catch (error) { planError(res, error); }
});
for (const [path, kind] of [['propose', 'proposed'], ['accept', 'accepted'], ['withdraw', 'withdrawn']] as const) {
  companyPlanRouter.post(`/company/plan/${path}`, requireRealOwnerSession, async (req, res): Promise<void> => {
    res.setHeader('Cache-Control', 'private, no-store');
    // Return before parsing/service/new-table access while rollout is disabled.
    if (!COMPANY_PLAN_REVISIONS_VERIFIED) { res.status(423).json({ error: 'Saved company plans are disabled pending reviewed rollout and enforcement.' }); return; }
    try { res.json(await recordCompanyPlanRevision(parseCompanyPlanCommand(kind, req.body))); }
    catch (error) { planError(res, error); }
  });
}
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
