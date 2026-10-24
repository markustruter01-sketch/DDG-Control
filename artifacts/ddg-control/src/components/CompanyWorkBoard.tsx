import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';

type Outcome = { id: number; project_key: string; title: string; status: string; version: number };
type Item = { id: number; project_key: string; title: string; status: string; plan_version: number;
  outcome_id: number | null; gate_key: string | null; deadline: string };
export type Board = { version: 1; truncated: boolean; projects: Array<{ key: string; control: string; held: boolean;
  outcomes: Outcome[]; items: Item[]; blocking_questions: Array<{ id: number }> }> };
const labels: Record<string, string> = { finance: 'DDG Finance', hypest: 'Hypest',
  'cattle-dog-coffee': 'Cattle Dog Coffee', 'ddg-control-ai-stack': 'DDG Control' };
const integer = (value: unknown) => typeof value === 'number' && Number.isSafeInteger(value) && value > 0;
const record = (value: unknown): value is Record<string, unknown> => Boolean(value && typeof value === 'object' && !Array.isArray(value));

export async function loadBoard(): Promise<Board> {
  const response = await fetch('/api/company/work-board', { cache: 'no-store' });
  if (!response.ok) throw new Error(response.status === 401 || response.status === 403 ?
    'Sign in with a real owner session to view saved company work.' : 'Saved company work is unavailable.');
  const body: unknown = await response.json();
  if (!record(body) || body.version !== 1 || typeof body.truncated !== 'boolean' || !Array.isArray(body.projects) ||
      body.projects.length !== 4 || new Set(body.projects.map(project => record(project) ? project.key : null)).size !== 4 ||
      !body.projects.every(project => record(project) && typeof project.key === 'string' && Object.hasOwn(labels, project.key) &&
        typeof project.held === 'boolean' && ['on', 'off', 'complete', 'unknown'].includes(String(project.control)) &&
        Array.isArray(project.outcomes) && project.outcomes.length <= 100 && project.outcomes.every(outcome => record(outcome) &&
          integer(outcome.id) && outcome.project_key === project.key && typeof outcome.title === 'string' &&
          typeof outcome.status === 'string' && integer(outcome.version)) &&
        Array.isArray(project.items) && project.items.length <= 200 && project.items.every(item => record(item) &&
          integer(item.id) && item.project_key === project.key && typeof item.title === 'string' && typeof item.status === 'string' &&
          integer(item.plan_version) && (item.outcome_id === null || integer(item.outcome_id)) &&
          (item.gate_key === null || typeof item.gate_key === 'string') && typeof item.deadline === 'string' && Number.isFinite(Date.parse(item.deadline))) &&
        Array.isArray(project.blocking_questions) && project.blocking_questions.length <= 200 &&
        project.blocking_questions.every(question => record(question) && integer(question.id)))) {
    throw new Error('Saved company work could not be read safely.');
  }
  return body as Board;
}

/** Owner-only, lazy read projection. No polling, approval or worker action. */
export function CompanyWorkBoard() {
  const [open, setOpen] = useState(false);
  const query = useQuery({ queryKey: ['company-work-board'], queryFn: loadBoard, enabled: open,
    retry: false, refetchOnWindowFocus: false, staleTime: 30_000 });
  return <details id="company-work-board" className="cm-accessible-list" onToggle={event => setOpen(event.currentTarget.open)}>
    <summary>Company work board · saved records</summary>
    {open && <div><p>Four managed projects only; other company work is not included. Saved status is not verified worker activity. Viewing this board starts no work.</p>
      <button type="button" disabled={query.isFetching} onClick={() => void query.refetch()}>Refresh saved records</button>
      {query.isLoading && <p role="status">Loading saved work…</p>}
      {query.isError ? <p role="alert">{query.error instanceof Error ? query.error.message : 'Saved company work is unavailable.'}</p> :
        query.data && <>{query.data.truncated && <p role="status">This is a limited view, not a complete company inventory. Open AI Stack for records.</p>}
          {query.data.projects.map(project => <section key={project.key} aria-label={`${labels[project.key]} saved work`}>
            <h3>{labels[project.key]} · {project.held ? 'Held' : project.control.toUpperCase()}</h3>
            {!project.outcomes.some(outcome => outcome.status === 'approved') && <p>Readiness is not established: no owner-approved outcome is shown in these records.</p>}
            {project.outcomes.length > 0 && <ul>{project.outcomes.map(outcome => <li key={outcome.id}>Outcome #{outcome.id} v{outcome.version}: {outcome.title} · {outcome.status.replaceAll('_', ' ')}</li>)}</ul>}
            <p>{project.blocking_questions.length} saved blocking question(s). Dependencies are not recorded in this view.</p>
            {project.items.length ? <ul>{project.items.map(item => <li key={item.id}>
              <Link href={`/ai-stack#work-item-${item.id}`}>{item.title}</Link> · plan v{item.plan_version} · {item.status.replaceAll('_', ' ')}
              {' · '}outcome {item.outcome_id === null ? 'unconfigured' : `#${item.outcome_id}`} · gate {item.gate_key ?? 'unconfigured'}
            </li>)}</ul> : <p>No saved managed task is shown.</p>}
          </section>)}</>}
      <p><Link href="/ai-stack#work-queue-heading">Open the existing approval queue</Link>. This view grants no approval, dependency completion or company-plan acceptance.</p>
    </div>}
  </details>;
}
