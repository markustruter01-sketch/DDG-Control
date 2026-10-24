import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/header';
import { setAuthenticationRequired } from '@/components/auth';

type Source = { available: boolean; truncated: boolean };
type Project = { id: number; slug: string; name: string; status: string; source_url: string | null };
type Task = { id: number; project_id: number; title: string; status: string };
type Activity = { id: number; project_key: string; event_type: string; actor: string; recorded_at: string };
type Snapshot = { read_at: string; projects: Project[]; tasks: Task[]; activity: Activity[];
  sources: { projects: Source; tasks: Source; activity: Source } };
const record = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
const id = (v: unknown) => typeof v === 'number' && Number.isSafeInteger(v) && v > 0;
const text = (v: unknown): v is string => typeof v === 'string' && v.length <= 1000;
const source = (v: unknown) => record(v) && typeof v.available === 'boolean' && typeof v.truncated === 'boolean';
const attention = (task: Task) => ['blocked', 'needs_approval'].includes(task.status);
const label = (value: string) => value.replaceAll('_', ' ');
function savedLink(value: string | null) {
  try { const url = new URL(value ?? ''); return url.protocol === 'https:' && !url.username && !url.password ? url.href : null; }
  catch { return null; }
}
async function loadSnapshot(): Promise<Snapshot> {
  const controller = new AbortController(), timer = setTimeout(() => controller.abort(), 20_000);
  try {
    const response = await fetch('/api/monitor', { cache: 'no-store', signal: controller.signal });
    if (response.status === 401 || response.status === 403) { setAuthenticationRequired(true); throw new Error('Owner login is required.'); }
    if (!response.ok) throw new Error('Saved records are unavailable. Try refreshing shortly.');
    const v: unknown = await response.json();
    if (!record(v) || v.version !== 1 || v.evidence !== 'saved_records' || v.live_verified !== false || !text(v.read_at) ||
        !Number.isFinite(Date.parse(v.read_at)) || !record(v.sources) || !['projects', 'tasks', 'activity'].every(k => source((v.sources as Record<string, unknown>)[k])) ||
        !Array.isArray(v.projects) || v.projects.length > 100 || !v.projects.every(p => record(p) && id(p.id) && text(p.slug) && text(p.name) && text(p.status) && (p.source_url === null || text(p.source_url))) ||
        !Array.isArray(v.tasks) || v.tasks.length > 200 || !v.tasks.every(t => record(t) && id(t.id) && id(t.project_id) && text(t.title) && text(t.status)) ||
        !Array.isArray(v.activity) || v.activity.length > 30 || !v.activity.every(e => record(e) && id(e.id) && text(e.project_key) && text(e.event_type) && text(e.actor) && text(e.recorded_at) && Number.isFinite(Date.parse(e.recorded_at)))) {
      throw new Error('Saved records could not be read safely.');
    }
    return v as Snapshot;
  } finally { clearTimeout(timer); }
}
export function Monitor() {
  const [filter, setFilter] = useState<'all' | 'attention'>('all');
  const [selected, setSelected] = useState<number | null>(null);
  const query = useQuery({ queryKey: ['monitor-snapshot'], queryFn: loadSnapshot, retry: false, refetchOnWindowFocus: false, refetchOnReconnect: false, staleTime: Infinity });
  const data = query.data, tasks = data?.tasks ?? [], alerts = tasks.filter(attention);
  const limited = data && Object.values(data.sources).some(s => !s.available || s.truncated);
  const projects = (data?.projects ?? []).filter(p => filter === 'all' || alerts.some(t => t.project_id === p.id));
  const chosen = data?.projects.find(p => p.id === selected);
  const counts = [
    { title: 'Projects', count: data?.sources.projects.available ? data.projects.length : null, partial: data?.sources.projects.truncated },
    { title: 'Recorded in progress', count: data?.sources.tasks.available ? tasks.filter(t => t.status === 'in_progress').length : null, partial: data?.sources.tasks.truncated },
    { title: 'Needs attention', count: data?.sources.tasks.available ? alerts.length : null, partial: data?.sources.tasks.truncated },
  ];
  return <div className="monitor-shell"><Header /><main className="monitor-main" id="main-content">
    <section className="monitor-intro"><div><p className="eyebrow">DDG / AT A GLANCE</p><h1>Company overview</h1><p>A clear view of projects and recorded updates.</p></div>
      <button className="monitor-refresh" type="button" disabled={query.isFetching} onClick={() => void query.refetch()}>{query.isFetching ? 'Refreshing…' : 'Refresh records'} <span aria-hidden="true">↗</span></button></section>
    <div className="monitor-evidence"><span className="monitor-evidence-dot" aria-hidden="true" />Saved records · manual refresh · live connections unverified
      {data && <time dateTime={data.read_at}>Read {new Date(data.read_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</time>}</div>
    {query.isLoading && <p className="monitor-notice" role="status">Loading saved records…</p>}
    {query.isError && <p className="monitor-notice" role="alert">{query.error instanceof Error ? query.error.message : 'Monitoring is unavailable.'}{data && ' Previous records remain below; they are not current.'}</p>}
    {limited && <p className="monitor-notice">Some sources are unavailable or limited. Counts describe only the records shown.</p>}
    <section className="monitor-stats" aria-label="Saved record summary">{counts.map(c => <article key={c.title}><span>{c.title}</span><strong>{c.count === null ? '—' : `${c.partial ? '≥ ' : ''}${c.count}`}</strong></article>)}</section>
    <div className="monitor-columns"><section className="monitor-project-section" aria-labelledby="projects-title">
      <div className="monitor-section-head"><h2 id="projects-title">Projects</h2><div className="monitor-filters" aria-label="Filter projects"><button type="button" aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>All</button><button type="button" aria-pressed={filter === 'attention'} disabled={!data?.sources.tasks.available} onClick={() => setFilter('attention')}>Needs attention</button></div></div>
      {!data?.sources.projects.available ? <p className="monitor-empty">Project records unavailable.</p> : projects.length === 0 ? <p className="monitor-empty">No matching project in the loaded records.</p> :
        <div className="monitor-project-grid">{projects.map(p => { const projectTasks = tasks.filter(t => t.project_id === p.id), url = savedLink(p.source_url), needs = projectTasks.filter(attention).length;
          return <article className={`monitor-project ${needs ? 'has-attention' : ''}`} key={p.id}><div className="monitor-project-heading"><span className="monitor-project-initial" aria-hidden="true">{p.name.slice(0, 1)}</span><span className="monitor-status">{label(p.status)}</span></div>
            <h3>{p.name}</h3><p>{!data.sources.tasks.available ? 'Work records unavailable' : needs ? `${needs} recorded item${needs === 1 ? '' : 's'} need attention` : 'No alerts in loaded work records'}</p>
            <div className="monitor-project-foot"><button type="button" aria-expanded={selected === p.id} aria-controls="monitor-project-detail" onClick={() => setSelected(selected === p.id ? null : p.id)}>View records <span aria-hidden="true">→</span></button>{url && <a href={url} target="_blank" rel="noopener noreferrer">Open saved link ↗</a>}</div>
          </article>;
        })}</div>}
      {chosen && <section className="monitor-detail" id="monitor-project-detail" aria-label={`${chosen.name} saved tasks`}><div className="monitor-section-head"><h3>{chosen.name} · saved work</h3><button type="button" onClick={() => setSelected(null)}>Close</button></div>
        <ul>{tasks.filter(t => t.project_id === chosen.id).map(t => <li key={t.id}><span>{t.title}</span><small>{label(t.status)}</small></li>)}</ul>
        {!tasks.some(t => t.project_id === chosen.id) && <p>No task is shown in these records.</p>}
      </section>}
    </section><aside className="monitor-sidebar"><section className="monitor-panel" aria-labelledby="alerts-title"><div className="monitor-section-head"><h2 id="alerts-title">Attention</h2><span>{data?.sources.tasks.available ? alerts.length : '—'}</span></div>
      {!data?.sources.tasks.available ? <p className="monitor-empty">Work records unavailable.</p> : alerts.length ? <ul className="monitor-alerts">{alerts.slice(0, 8).map(t => <li key={t.id}><small>{label(t.status)}</small><p>{t.title}</p><span>{data.projects.find(p => p.id === t.project_id)?.name ?? 'Project not in loaded view'}</span></li>)}</ul> : <p className="monitor-empty">No alerts in loaded records.</p>}
      {alerts.length > 8 && <p className="monitor-footnote">Showing eight alerts from loaded records.</p>}<p className="monitor-footnote">Review or change work in its original tool.</p>
    </section><section className="monitor-panel" aria-labelledby="activity-title"><h2 id="activity-title">Recent activity</h2>
      {!data?.sources.activity.available ? <p className="monitor-empty">Activity source unavailable.</p> : data.activity.length ? <ol className="monitor-activity">{data.activity.slice(0, 6).map(e => <li key={e.id}><span className="monitor-timeline-dot" aria-hidden="true" /><div><p>{label(e.event_type)}</p><small>{e.project_key} · recorded actor: {e.actor}</small><time dateTime={e.recorded_at}>{new Date(e.recorded_at).toLocaleString()}</time></div></li>)}</ol> : <p className="monitor-empty">No activity record is shown.</p>}
      <p className="monitor-footnote">Saved history, not a live agent feed.</p>
    </section></aside></div>
    <footer className="monitor-footer"><span>DDG Control · monitoring only</span><span>No workers, approvals or spending run from this dashboard.</span></footer>
  </main></div>;
}
