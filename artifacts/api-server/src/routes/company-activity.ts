import { db, managedFleetQuestionEventsTable, managedWorkEventsTable, managedWorkOutcomeEventsTable, projectHandoverEventsTable, projectWorkAuditTable } from '@workspace/db';
import { desc, inArray, sql } from 'drizzle-orm';
import { Router, type IRouter } from 'express';
import { requireRealOwnerSession } from './auth';
import { WORK_KEYS } from '../lib/managed-work-controls';

export const companyActivityRouter: IRouter = Router();
const positiveInteger = (value: unknown): number | null =>
  typeof value === 'number' && Number.isSafeInteger(value) && value > 0 ? value : null;

companyActivityRouter.get('/company/activity', requireRealOwnerSession, async (_req, res): Promise<void> => {
  res.setHeader('Cache-Control', 'private, no-store');
  try {
    const sources = [
      { name: 'managed_work_events', table: managedWorkEventsTable, reference: managedWorkEventsTable.work_item_id, kind: 'task' },
      { name: 'managed_work_outcome_events', table: managedWorkOutcomeEventsTable, reference: managedWorkOutcomeEventsTable.outcome_id, kind: 'outcome' },
      { name: 'managed_fleet_question_events', table: managedFleetQuestionEventsTable, reference: managedFleetQuestionEventsTable.question_id, kind: 'question' },
      { name: 'project_handover_events', table: projectHandoverEventsTable, reference: projectHandoverEventsTable.checkpoint_id, kind: 'handover' },
    ] as const;
    // Select only named metadata. Raw details, worker output and private prose never leave storage.
    const groups = await Promise.all(sources.map(async source => {
      const table = source.table;
      const rows = await db.select({ id: table.id, project_key: table.project_key, actor: table.actor,
        event_type: table.event_type, recorded_at: table.created_at, reference_id: source.reference,
        plan_version: sql<unknown>`${table.details}->'plan_version'`,
        outcome_version: sql<unknown>`${table.details}->'outcome_version'`,
        reviewed_version: sql<unknown>`${table.details}->'reviewed_version'`,
      }).from(table).where(inArray(table.project_key, [...WORK_KEYS])).orderBy(desc(table.id)).limit(51);
      return { source: source.name, reference_kind: source.kind, truncated: rows.length > 50,
        events: rows.slice(0, 50).map(row => ({ ...row, plan_version: positiveInteger(row.plan_version),
          outcome_version: positiveInteger(row.outcome_version), reviewed_version: positiveInteger(row.reviewed_version) })) };
    }));
    const audit = await db.select({ id: projectWorkAuditTable.id, project_key: projectWorkAuditTable.project_key,
      event_type: projectWorkAuditTable.event_type, enabled: projectWorkAuditTable.enabled,
      owner_confirmed: projectWorkAuditTable.owner_confirmed,
    }).from(projectWorkAuditTable).where(inArray(projectWorkAuditTable.project_key, [...WORK_KEYS]))
      .orderBy(desc(projectWorkAuditTable.id)).limit(51);
    res.json({ version: 1, scope: [...WORK_KEYS], groups, project_controls: { source: 'project_work_audit',
      truncated: audit.length > 50, events: audit.slice(0, 50) }, complete_history: false, execution_verified: false });
  } catch {
    res.status(503).json({ error: 'Saved activity is unavailable. No work was requested.' });
  }
});
