import { db, companyPlanRevisionsTable, managedWorkDispatchConfigTable, managedWorkItemsTable, managedWorkOutcomesTable, projectWorkControlsTable } from '@workspace/db';
import { and, desc, eq, inArray, sql } from 'drizzle-orm';
import { companyPlanDigest, evaluateCompanyPlan, parseCompanyPlan, type CompanyPlanManifest } from './company-plan';
import { lockWorkControl, WORK_KEYS, type WorkTransaction } from './managed-work-controls';

// Requires reviewed schema rollout/recovery AND all approval/selection/submission
// consumers before enablement. No environment override or owner UI toggle.
export const COMPANY_PLAN_REVISIONS_VERIFIED = false;
export class CompanyPlanError extends Error {
  constructor(readonly status: number, message: string) { super(message); }
}
const disabled = () => { throw new CompanyPlanError(423, 'Saved company plans are disabled pending reviewed rollout and enforcement.'); };
const conflict = (message: string): never => { throw new CompanyPlanError(409, message); };
type Command = { request_id: string; expected_head_id: number | null } & (
  { kind: 'proposed'; manifest: CompanyPlanManifest } |
  { kind: 'accepted' | 'withdrawn'; target_revision_id: number; digest: string });

export function parseCompanyPlanCommand(kind: Command['kind'], value: unknown): Command {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new CompanyPlanError(400, 'Invalid plan request.');
  const body = value as Record<string, unknown>;
  const expected = kind === 'proposed' ? ['request_id', 'expected_head_id', 'manifest'] : ['request_id', 'expected_head_id', 'target_revision_id', 'digest'];
  if (Object.keys(body).length !== expected.length || !expected.every(k => Object.hasOwn(body, k)) ||
      typeof body.request_id !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(body.request_id) ||
      (body.expected_head_id !== null && (!Number.isSafeInteger(body.expected_head_id) || Number(body.expected_head_id) < 1))) {
    throw new CompanyPlanError(400, 'Provide a request UUID and the exact reviewed history head.');
  }
  const common = { request_id: body.request_id.toLowerCase(), expected_head_id: body.expected_head_id as number | null };
  if (kind === 'proposed') {
    try { return { ...common, kind, manifest: parseCompanyPlan(body.manifest) }; }
    catch { throw new CompanyPlanError(400, 'Invalid plan manifest.'); }
  }
  if (!Number.isSafeInteger(body.target_revision_id) || Number(body.target_revision_id) < 1 ||
      typeof body.digest !== 'string' || !/^[0-9a-f]{64}$/.test(body.digest)) throw new CompanyPlanError(400, 'Provide the exact revision ID and digest reviewed.');
  return { ...common, kind, target_revision_id: body.target_revision_id as number, digest: body.digest };
}

export async function readCompanyPlanRevisions() {
  if (!COMPANY_PLAN_REVISIONS_VERIFIED) return disabled();
  const rows = await db.select().from(companyPlanRevisionsTable).orderBy(desc(companyPlanRevisionsTable.id)).limit(21);
  return { version: 1, revisions: rows.slice(0, 20), truncated: rows.length > 20, execution_authorized: false };
}

async function readPlanRecords(tx: WorkTransaction, manifest: CompanyPlanManifest, lockRows = true) {
  const outcomeQuery = tx.select({ id: managedWorkOutcomesTable.id, version: managedWorkOutcomesTable.version,
    project_key: managedWorkOutcomesTable.project_key, status: managedWorkOutcomesTable.status, gates: managedWorkOutcomesTable.gates })
    .from(managedWorkOutcomesTable).where(and(inArray(managedWorkOutcomesTable.id, manifest.outcomes.map(o => o.id)),
      inArray(managedWorkOutcomesTable.project_key, manifest.projects))).orderBy(managedWorkOutcomesTable.id).limit(100);
  const outcomes = manifest.outcomes.length ? await (lockRows ? outcomeQuery.for('update') : outcomeQuery) : [];
  const taskQuery = tx.select({ id: managedWorkItemsTable.id, plan_version: managedWorkItemsTable.plan_version,
    project_key: managedWorkItemsTable.project_key, outcome_id: managedWorkItemsTable.outcome_id,
    gate_key: managedWorkItemsTable.gate_key, status: managedWorkItemsTable.status,
    acceptance_evidence: sql<boolean>`length(trim(${managedWorkItemsTable.acceptance_evidence})) > 0` })
    .from(managedWorkItemsTable).where(and(inArray(managedWorkItemsTable.id, manifest.tasks.map(t => t.id)),
      inArray(managedWorkItemsTable.project_key, manifest.projects))).orderBy(managedWorkItemsTable.id).limit(200);
  const tasks = manifest.tasks.length ? await (lockRows ? taskQuery.for('update') : taskQuery) : [];
  const controls = await tx.select().from(projectWorkControlsTable).where(inArray(projectWorkControlsTable.project_key, manifest.projects));
  return { outcomes, tasks, controls };
}

/** Consistent owner review snapshot, not permission to execute. Disabled mode
 * returns before any database query; enabled mode is a read-only transaction. */
export async function readCompanyPlanReview() {
  if (!COMPANY_PLAN_REVISIONS_VERIFIED) return { version: 1, enabled: false, head_id: null,
    proposal: null, active: null, execution_authorized: false };
  return db.transaction(async tx => {
    const [head] = await tx.select({ id: companyPlanRevisionsTable.id }).from(companyPlanRevisionsTable).orderBy(desc(companyPlanRevisionsTable.id)).limit(1);
    const [latest] = await tx.select().from(companyPlanRevisionsTable).where(eq(companyPlanRevisionsTable.kind, 'proposed')).orderBy(desc(companyPlanRevisionsTable.id)).limit(1);
    const [action] = await tx.select().from(companyPlanRevisionsTable).where(inArray(companyPlanRevisionsTable.kind, ['accepted', 'withdrawn'])).orderBy(desc(companyPlanRevisionsTable.id)).limit(1);
    const project = async (row: typeof latest) => {
      const manifest = parseCompanyPlan(row.manifest);
      if (companyPlanDigest(manifest) !== row.digest) return conflict('The stored proposal cannot be verified.');
      return { id: row.id, digest: row.digest, manifest, recorded_actor: row.actor, recorded_at: row.created_at,
        evaluation: evaluateCompanyPlan(manifest, await readPlanRecords(tx, manifest, false)) };
    };
    let active = null;
    if (action?.kind === 'accepted' && action.target_revision_id) {
      const [proposal] = await tx.select().from(companyPlanRevisionsTable).where(eq(companyPlanRevisionsTable.id, action.target_revision_id)).limit(1);
      if (!proposal || proposal.kind !== 'proposed' || proposal.digest !== action.digest) return conflict('The active plan receipt cannot be verified.');
      active = { acceptance_id: action.id, ...await project(proposal) };
    }
    return { version: 1, enabled: true, head_id: head?.id ?? null, proposal: latest ? await project(latest) : null,
      active, snapshot_consistent: true, execution_authorized: false };
  }, { isolationLevel: 'repeatable read', accessMode: 'read only' });
}

export type CompanyPlanContext = { mode: 'legacy' | 'blocked' } | {
  mode: 'accepted'; acceptance_id: number; proposal_id: number; digest: string; allowed_task_ids: Set<number>;
};

/** Call BEFORE any project/task lock. Holds config then every managed project
 * control in fixed order, preventing cross-project prerequisite races. Callers
 * must retain this transaction through their approval/reservation decision. */
export async function lockCompanyPlanContext(tx: WorkTransaction): Promise<CompanyPlanContext> {
  if (!COMPANY_PLAN_REVISIONS_VERIFIED) return { mode: 'legacy' };
  const [config] = await tx.select({ id: managedWorkDispatchConfigTable.id }).from(managedWorkDispatchConfigTable)
    .where(eq(managedWorkDispatchConfigTable.id, 1)).for('update').limit(1);
  if (!config) return { mode: 'blocked' };
  for (const key of WORK_KEYS) await lockWorkControl(tx, key);
  const [acceptance] = await tx.select().from(companyPlanRevisionsTable)
    .where(inArray(companyPlanRevisionsTable.kind, ['accepted', 'withdrawn'])).orderBy(desc(companyPlanRevisionsTable.id)).limit(1);
  if (!acceptance || acceptance.kind !== 'accepted' || !acceptance.target_revision_id) return { mode: 'blocked' };
  const [proposal] = await tx.select().from(companyPlanRevisionsTable)
    .where(eq(companyPlanRevisionsTable.id, acceptance.target_revision_id)).limit(1);
  if (!proposal || proposal.kind !== 'proposed' || proposal.digest !== acceptance.digest) return { mode: 'blocked' };
  let manifest: CompanyPlanManifest;
  try { manifest = parseCompanyPlan(proposal.manifest); }
  catch { return { mode: 'blocked' }; }
  if (companyPlanDigest(manifest) !== acceptance.digest) return { mode: 'blocked' };
  const evaluation = evaluateCompanyPlan(manifest, await readPlanRecords(tx, manifest));
  if (!evaluation.references_current || !evaluation.declared_scope_has_goals) return { mode: 'blocked' };
  return { mode: 'accepted', acceptance_id: acceptance.id, proposal_id: proposal.id, digest: acceptance.digest,
    allowed_task_ids: new Set(evaluation.tasks.filter(t => t.binding_current && t.project_allows_new_work && t.dependencies_satisfied).map(t => t.task_id)) };
}

export const companyPlanAllows = (context: CompanyPlanContext, taskId: number) =>
  context.mode === 'legacy' || (context.mode === 'accepted' && context.allowed_task_ids.has(taskId));

export const sameCompanyPlan = (before: CompanyPlanContext, after: CompanyPlanContext) =>
  before.mode === 'legacy' ? after.mode === 'legacy' : before.mode === 'accepted' && after.mode === 'accepted' &&
    before.acceptance_id === after.acceptance_id && before.proposal_id === after.proposal_id && before.digest === after.digest;

export const companyPlanReceipt = (context: CompanyPlanContext) => context.mode === 'accepted' ? {
  company_plan_acceptance_id: context.acceptance_id, company_plan_proposal_id: context.proposal_id, company_plan_digest: context.digest,
} : {};

export async function recordCompanyPlanRevision(command: Command) {
  if (!COMPANY_PLAN_REVISIONS_VERIFIED) return disabled();
  return db.transaction(async tx => {
    // Existing reservation order first. Every plan writer shares this order.
    await tx.insert(managedWorkDispatchConfigTable).values({ id: 1 }).onConflictDoNothing();
    await tx.select({ id: managedWorkDispatchConfigTable.id }).from(managedWorkDispatchConfigTable)
      .where(eq(managedWorkDispatchConfigTable.id, 1)).for('update').limit(1);
    let manifest: CompanyPlanManifest | null = command.kind === 'proposed' ? parseCompanyPlan(command.manifest) : null;
    if (command.kind === 'accepted') {
      const [proposal] = await tx.select().from(companyPlanRevisionsTable).where(eq(companyPlanRevisionsTable.id, command.target_revision_id)).limit(1);
      if (!proposal || proposal.kind !== 'proposed' || proposal.digest !== command.digest) return conflict('The proposed revision or digest does not match.');
      manifest = parseCompanyPlan(proposal.manifest);
      if (companyPlanDigest(manifest) !== proposal.digest) return conflict('The stored proposal cannot be verified.');
    }
    // Withdrawals only reduce authority; OFF/held controls cannot prevent them.
    if (manifest) for (const key of WORK_KEYS) if (manifest.projects.includes(key)) await lockWorkControl(tx, key);
    const records = manifest ? await readPlanRecords(tx, manifest) : null;
    // The existing singleton config row already serializes all plan writers;
    // do not add another lock table, advisory namespace or approval store.
    const digest = command.kind === 'proposed' ? companyPlanDigest(command.manifest) : command.digest;
    const [prior] = await tx.select().from(companyPlanRevisionsTable).where(eq(companyPlanRevisionsTable.request_id, command.request_id)).limit(1);
    if (prior) {
      if (prior.kind !== command.kind || prior.digest !== digest || prior.target_revision_id !== (command.kind === 'proposed' ? null : command.target_revision_id)) {
        return conflict('That request ID belongs to a different plan action.');
      }
      return { revision: prior, replayed: true, execution_authorized: false };
    }
    const [head] = await tx.select({ id: companyPlanRevisionsTable.id }).from(companyPlanRevisionsTable).orderBy(desc(companyPlanRevisionsTable.id)).limit(1);
    if ((head?.id ?? null) !== command.expected_head_id) return conflict('Plan history changed. Refresh and review before continuing.');
    const [lastAction] = await tx.select().from(companyPlanRevisionsTable)
      .where(inArray(companyPlanRevisionsTable.kind, ['accepted', 'withdrawn'])).orderBy(desc(companyPlanRevisionsTable.id)).limit(1);
    if (command.kind === 'accepted') {
      if (lastAction?.kind === 'accepted') return conflict('Withdraw the current accepted revision before replacing it.');
      const evaluation = evaluateCompanyPlan(manifest!, records!);
      if (!evaluation.references_current || !evaluation.declared_scope_has_goals ||
          manifest!.projects.some(key => key === 'finance' || !records!.controls.some(c => c.project_key === key && c.enabled && !c.completed))) {
        return conflict('Goals, versions or project controls do not permit accepting this plan.');
      }
      // Dependencies need not be complete to approve a future plan. Each task's
      // approval and dispatch must separately enforce its current prerequisites.
    }
    if (command.kind === 'withdrawn' && (lastAction?.kind !== 'accepted' || lastAction.id !== command.target_revision_id || lastAction.digest !== command.digest)) {
      return conflict('Only the exact current acceptance can be withdrawn.');
    }
    const [revision] = await tx.insert(companyPlanRevisionsTable).values({ request_id: command.request_id, kind: command.kind,
      target_revision_id: command.kind === 'proposed' ? null : command.target_revision_id,
      manifest: command.kind === 'proposed' ? manifest as unknown as Record<string, unknown> : null,
      digest, actor: 'Markus' }).returning();
    return { revision, replayed: false, execution_authorized: false };
  });
}
