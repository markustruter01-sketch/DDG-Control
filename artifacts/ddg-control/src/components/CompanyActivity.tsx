import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';

const projects = ['finance', 'hypest', 'cattle-dog-coffee', 'ddg-control-ai-stack'];
const sources = ['managed_work_events', 'managed_work_outcome_events', 'managed_fleet_question_events', 'project_handover_events'];
const kinds = ['task', 'outcome', 'question', 'handover'];
type Event = { id: number; project_key: string; actor: string; event_type: string; recorded_at: string;
  reference_id: number; plan_version: number | null; outcome_version: number | null; reviewed_version: number | null };
type Activity = { groups: Array<{ source: string; reference_kind: string; truncated: boolean; events: Event[] }>;
  project_controls: { truncated: boolean; events: Array<{ id: number; project_key: string; event_type: string; enabled: boolean; owner_confirmed: boolean }> } };
const record = (v: unknown): v is Record<string, unknown> => Boolean(v && typeof v === 'object' && !Array.isArray(v));
const integer = (v: unknown) => typeof v === 'number' && Number.isSafeInteger(v) && v > 0;
const version = (v: unknown) => v === null || integer(v);
async function loadActivity(): Promise<Activity> {
  const response = await fetch('/api/company/activity', { cache: 'no-store' });
  if (!response.ok) throw new Error([401, 403].includes(response.status) ? 'Sign in as the owner to view activity.' : 'Saved activity is unavailable.');
  const body: unknown = await response.json();
  if (!record(body) || body.version !== 1 || body.complete_history !== false || body.execution_verified !== false ||
      !Array.isArray(body.scope) || body.scope.length !== 4 || !projects.every(p => body.scope instanceof Array && body.scope.includes(p)) ||
      !Array.isArray(body.groups) || body.groups.length !== 4 || !body.groups.every((group, i) => record(group) &&
        group.source === sources[i] && group.reference_kind === kinds[i] && typeof group.truncated === 'boolean' &&
        Array.isArray(group.events) && group.events.length <= 50 && group.events.every(event => record(event) &&
          integer(event.id) && projects.includes(String(event.project_key)) && typeof event.actor === 'string' &&
          typeof event.event_type === 'string' && integer(event.reference_id) && typeof event.recorded_at === 'string' &&
          Number.isFinite(Date.parse(event.recorded_at)) && version(event.plan_version) && version(event.outcome_version) && version(event.reviewed_version))) ||
      !record(body.project_controls) || body.project_controls.source !== 'project_work_audit' ||
      typeof body.project_controls.truncated !== 'boolean' || !Array.isArray(body.project_controls.events) ||
      body.project_controls.events.length > 50 || !body.project_controls.events.every(event => record(event) && integer(event.id) &&
        projects.includes(String(event.project_key)) && typeof event.event_type === 'string' &&
        typeof event.enabled === 'boolean' && typeof event.owner_confirmed === 'boolean')) throw new Error('Saved activity could not be read safely.');
  return body as Activity;
}

export function CompanyActivity() {
  const [open, setOpen] = useState(false);
  const [project, setProject] = useState('all');
  const query = useQuery({ queryKey: ['company-activity'], queryFn: loadActivity, enabled: open,
    retry: false, refetchOnWindowFocus: false, staleTime: 30_000 });
  return <details className="cm-accessible-list" onToggle={event => setOpen(event.currentTarget.open)}>
    <summary>Activity and evidence · saved records</summary>
    {open && <div><p>Four managed projects. Latest 50 records per source, ordered by each source ID. This is partial history, not a verified worker log or a single snapshot. Actors and dates are recorded values; missing versions remain unknown.</p>
      <label>Project <select value={project} onChange={event => setProject(event.target.value)}><option value="all">All managed projects</option>
        {projects.map(key => <option key={key} value={key}>{key}</option>)}</select></label>{' '}
      <button type="button" disabled={query.isFetching} onClick={() => void query.refetch()}>Refresh activity</button>
      {query.isLoading && <p role="status">Loading saved activity…</p>}
      {query.isError ? <p role="alert">{query.error instanceof Error ? query.error.message : 'Saved activity is unavailable.'}</p> : query.data && <>
        {query.data.groups.map(group => { const events = group.events.filter(e => project === 'all' || e.project_key === project);
          return <section key={group.source}><h3>{group.reference_kind} events · {group.source}</h3>
            {group.truncated && <p>Older records are omitted from this source.</p>}
            {events.length ? <ul>{events.map(event => <li key={event.id}>
              #{event.id} · {event.project_key} · {event.event_type} · recorded actor: {event.actor} · <time dateTime={event.recorded_at}>{event.recorded_at}</time>
              {' · '}{group.reference_kind === 'task' ? <Link href={`/ai-stack#work-item-${event.reference_id}`}>Task #{event.reference_id}</Link> : `${group.reference_kind} #${event.reference_id}`}
              {' · '}plan v{event.plan_version ?? '?'} / outcome v{event.outcome_version ?? '?'} / reviewed v{event.reviewed_version ?? '?'}
            </li>)}</ul> : <p>No matching record in this limited view.</p>}</section>;
        })}
        <section><h3>Project controls · project_work_audit</h3>
          <p>Actor and timezone are not established by these older records; no global time ordering is claimed.</p>
          {query.data.project_controls.truncated && <p>Older control records are omitted.</p>}
          <ul>{query.data.project_controls.events.filter(e => project === 'all' || e.project_key === project).map(event =>
            <li key={event.id}>#{event.id} · {event.project_key} · {event.event_type} · saved enabled: {String(event.enabled)} · saved owner confirmation: {String(event.owner_confirmed)}</li>)}</ul>
        </section>
      </>}
      <p>Viewing records starts no work. Handover records are not proof of recoverable code. Model, cost and provider execution are not verified here.</p>
    </div>}
  </details>;
}
