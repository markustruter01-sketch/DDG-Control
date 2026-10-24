import { createHash } from 'node:crypto';
import { WORK_KEYS, type WorkKey } from './managed-work-controls';

type OutcomeRef = { id: number; version: number; project_key: WorkKey };
type TaskRef = { id: number; plan_version: number; project_key: WorkKey; outcome_id: number; outcome_version: number; gate_key: string };
export type CompanyPlanManifest = { version: 1; projects: WorkKey[]; outcomes: OutcomeRef[]; tasks: TaskRef[];
  dependencies: Array<{ task_id: number; prerequisite_id: number }> };
const object = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
const keys = (v: Record<string, unknown>, expected: string[]) =>
  Object.keys(v).length === expected.length && expected.every(key => Object.hasOwn(v, key));
const integer = (v: unknown): v is number => typeof v === 'number' && Number.isSafeInteger(v) && v > 0;
const project = (v: unknown): v is WorkKey => typeof v === 'string' && (WORK_KEYS as readonly string[]).includes(v);
const invalid = (): never => { throw new Error('Invalid company plan manifest. Check references, limits and dependency cycles.'); };

/** Strict bounded reference manifest. No task prose, status or approval is accepted from a caller. */
export function parseCompanyPlan(value: unknown): CompanyPlanManifest {
  if (!object(value) || !keys(value, ['version', 'projects', 'outcomes', 'tasks', 'dependencies']) || value.version !== 1 ||
      !Array.isArray(value.projects) || value.projects.length < 1 || value.projects.length > 4 ||
      !value.projects.every(project) || new Set(value.projects).size !== value.projects.length ||
      !Array.isArray(value.outcomes) || value.outcomes.length > 100 || !Array.isArray(value.tasks) || value.tasks.length > 200 ||
      !Array.isArray(value.dependencies) || value.dependencies.length > 400) return invalid();
  const projects = [...value.projects] as WorkKey[];
  const outcomes: OutcomeRef[] = value.outcomes.map(v => {
    if (!object(v) || !keys(v, ['id', 'version', 'project_key']) || !integer(v.id) || !integer(v.version) ||
        !project(v.project_key) || !projects.includes(v.project_key)) return invalid();
    return { id: v.id, version: v.version, project_key: v.project_key };
  });
  if (new Set(outcomes.map(v => v.id)).size !== outcomes.length) return invalid();
  const tasks: TaskRef[] = value.tasks.map(v => {
    if (!object(v) || !keys(v, ['id', 'plan_version', 'project_key', 'outcome_id', 'outcome_version', 'gate_key']) ||
        !integer(v.id) || !integer(v.plan_version) || !project(v.project_key) || !projects.includes(v.project_key) ||
        !integer(v.outcome_id) || !integer(v.outcome_version) || typeof v.gate_key !== 'string' ||
        !v.gate_key.trim() || v.gate_key.length > 120 || v.gate_key !== v.gate_key.trim() ||
        !outcomes.some(o => o.id === v.outcome_id && o.version === v.outcome_version && o.project_key === v.project_key)) return invalid();
    return { id: v.id, plan_version: v.plan_version, project_key: v.project_key,
      outcome_id: v.outcome_id, outcome_version: v.outcome_version, gate_key: v.gate_key };
  });
  const ids = new Set(tasks.map(t => t.id));
  if (ids.size !== tasks.length || new Set(tasks.map(t => `${t.outcome_id}:${t.gate_key}`)).size !== tasks.length) return invalid();
  const dependencies = value.dependencies.map(v => {
    if (!object(v) || !keys(v, ['task_id', 'prerequisite_id']) || !integer(v.task_id) || !integer(v.prerequisite_id) ||
        v.task_id === v.prerequisite_id || !ids.has(v.task_id) || !ids.has(v.prerequisite_id)) return invalid();
    return { task_id: v.task_id, prerequisite_id: v.prerequisite_id };
  });
  if (new Set(dependencies.map(e => `${e.task_id}:${e.prerequisite_id}`)).size !== dependencies.length) return invalid();
  const visiting = new Set<number>(), visited = new Set<number>();
  const visit = (id: number): void => {
    if (visiting.has(id)) return invalid();
    if (visited.has(id)) return;
    visiting.add(id);
    for (const edge of dependencies) if (edge.task_id === id) visit(edge.prerequisite_id);
    visiting.delete(id); visited.add(id);
  };
  tasks.forEach(t => visit(t.id));
  return { version: 1, projects: projects.sort((a, b) => WORK_KEYS.indexOf(a) - WORK_KEYS.indexOf(b)),
    outcomes: outcomes.sort((a, b) => a.id - b.id), tasks: tasks.sort((a, b) => a.id - b.id),
    dependencies: dependencies.sort((a, b) => a.task_id - b.task_id || a.prerequisite_id - b.prerequisite_id) };
}

export const companyPlanDigest = (manifest: CompanyPlanManifest) =>
  createHash('sha256').update(JSON.stringify(parseCompanyPlan(manifest))).digest('hex');

export type CompanyPlanRecords = {
  outcomes: Array<{ id: number; version: number; project_key: string; status: string; gates: Array<{ key: string }> }>;
  tasks: Array<{ id: number; plan_version: number; project_key: string; outcome_id: number | null;
    gate_key: string | null; status: string; acceptance_evidence: boolean }>;
  controls: Array<{ project_key: string; enabled: boolean; completed: boolean }>;
};

/** Pure evaluator reused by previews and future locked approval/dispatch paths.
 * Preview records alone never grant execution authority. */
export function evaluateCompanyPlan(manifest: CompanyPlanManifest, records: CompanyPlanRecords) {
  const plan = parseCompanyPlan(manifest);
  const outcomeValid = (ref: OutcomeRef) => records.outcomes.some(o => o.id === ref.id && o.project_key === ref.project_key &&
    o.version === ref.version && (o.status === 'approved' || o.status === 'completed'));
  const bindingValid = (ref: TaskRef) => {
    const outcome = plan.outcomes.find(o => o.id === ref.outcome_id)!;
    return outcomeValid(outcome) && records.outcomes.some(o => o.id === ref.outcome_id &&
      Array.isArray(o.gates) && o.gates.some(g => g?.key === ref.gate_key)) &&
      records.tasks.some(t => t.id === ref.id && t.project_key === ref.project_key && t.plan_version === ref.plan_version &&
        t.outcome_id === ref.outcome_id && t.gate_key === ref.gate_key);
  };
  const exactBindings = plan.outcomes.every(outcomeValid) && plan.tasks.every(bindingValid);
  const tasks = plan.tasks.map(ref => {
    const ancestors = new Set<number>();
    const collect = (id: number): void => {
      for (const edge of plan.dependencies) if (edge.task_id === id && !ancestors.has(edge.prerequisite_id)) {
        ancestors.add(edge.prerequisite_id); collect(edge.prerequisite_id);
      }
    };
    collect(ref.id);
    const blockedBy = [...ancestors].filter(id => {
      const prerequisite = plan.tasks.find(t => t.id === id)!;
      const saved = records.tasks.find(t => t.id === prerequisite.id);
      return !bindingValid(prerequisite) || saved?.status !== 'completed' || saved.acceptance_evidence !== true;
    }).sort((a, b) => a - b);
    const control = records.controls.find(c => c.project_key === ref.project_key);
    return { task_id: ref.id, binding_current: bindingValid(ref), blocked_by: blockedBy,
      project_allows_new_work: ref.project_key !== 'finance' && control?.enabled === true && control.completed === false,
      dependencies_satisfied: blockedBy.length === 0 };
  });
  return { digest: companyPlanDigest(plan), references_current: exactBindings,
    declared_scope_has_goals: plan.projects.every(p => plan.outcomes.some(o => o.project_key === p)),
    tasks, accepted: false as const, execution_authorized: false as const };
}
