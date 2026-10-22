import { useState } from 'react';

type LedgerTask = { id: number; project_key: string; title: string; repository: string | null; branch: string | null; commit_ref: string | null };
type LedgerEvent = { id: number; work_item_id: number; actor: string; event_type: string; created_at: string; details: Record<string, unknown> };
type LedgerDispatch = { id: number; work_item_id: number; provider: string; model_id: string | null; agent_id: string | null; run_id: string | null; provider_status: string | null; status: string; branch: string | null; started_at: string };
type Props = { data?: { items: LedgerTask[]; events: LedgerEvent[]; dispatches: LedgerDispatch[] }; loading: boolean; failed: boolean; onRetry: () => void };

function timeLabel(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Time unknown' : date.toLocaleString('en-AU', { timeZone: 'Australia/Brisbane', dateStyle: 'medium', timeStyle: 'short' });
}

const LINK_LABELS = { plan_version:'Plan version', outcome_id:'Outcome ID', outcome_version:'Outcome version', reviewed_version:'Reviewed version', dispatch_id:'Dispatch ID', checkpoint_id:'Checkpoint ID' } as const;
function recordedLinks(details: unknown): Partial<Record<keyof typeof LINK_LABELS, number>> {
  const links: Partial<Record<keyof typeof LINK_LABELS, number>> = {};
  if (!details || typeof details !== 'object' || Array.isArray(details)) return links;
  for (const key of Object.keys(LINK_LABELS) as Array<keyof typeof LINK_LABELS>) {
    const value = (details as Record<string,unknown>)[key];
    if (typeof value === 'number' && Number.isSafeInteger(value) && value > 0) links[key] = value;
  }
  return links;
}

export function WorkLedger({ data, loading, failed, onRetry }: Props) {
  const [project, setProject] = useState('all');
  const [task, setTask] = useState('all');
  const [limit, setLimit] = useState(50);
  const tasks = data?.items ?? [];
  const projects = [...new Set(tasks.map((item) => item.project_key))].sort();
  const selectedTasks = tasks.filter((item) => (project === 'all' || item.project_key === project) && (task === 'all' || String(item.id) === task));
  const taskIds = new Set(selectedTasks.map((item) => item.id));
  const loadedTaskIds = new Set(tasks.map((item) => item.id));
  const unassociatedEvents = (data?.events ?? []).filter((event) => !loadedTaskIds.has(event.work_item_id)).length;
  const unassociatedRuns = (data?.dispatches ?? []).filter((run) => !loadedTaskIds.has(run.work_item_id)).length;
  const invalidSelection = (project !== 'all' && !projects.includes(project)) ||
    (task !== 'all' && !tasks.some((item) => String(item.id) === task && (project === 'all' || item.project_key === project)));
  function resetSelection() { setProject('all'); setTask('all'); setLimit(50); }

  const events = (data?.events ?? []).filter((event) => taskIds.has(event.work_item_id)).sort((a,b) => (Date.parse(b.created_at) || 0) - (Date.parse(a.created_at) || 0));
  const dispatches = (data?.dispatches ?? []).filter((run) => taskIds.has(run.work_item_id));
  function exportSnapshot() {
    if (!data || loading || failed || invalidSelection) return;
    const snapshot = {
      format_version: 2,
      exported_at: new Date().toISOString(),
      scope: 'Loaded DDG Control work records only; not full company or external-provider history.',
      filters: { project, task },
      tasks: selectedTasks.map(({ id, project_key, repository, branch, commit_ref }) => ({ id, project_key, repository, branch, commit_ref })),
      events: events.map(({ id, work_item_id, actor, event_type, created_at, details }) => {
        const links = recordedLinks(details);
        return { id, work_item_id, actor, event_type, created_at, recorded_links:links,
          dispatch_link: links.dispatch_id == null ? 'not_recorded' : dispatches.some(run=>run.id===links.dispatch_id && run.work_item_id===work_item_id) ? 'matched_loaded_run_and_task' : 'matching_run_not_in_loaded_selection' };
      }),
      dispatches: dispatches.map(({ id, work_item_id, provider, model_id, agent_id, run_id, provider_status, status, branch, started_at }) => ({ id, work_item_id, provider, model_id, agent_id, run_id, provider_status, status, branch, started_at })),
      limitations: ['Only allowlisted positive integer linkage/version fields are included from event details; no raw payloads, prompts, credentials or task free text.', 'Recorded links are not proof of complete or independently verified history; unmatched links are not inferred.', 'Run model identity is not automatically assigned to surrounding events.', 'This export is not a signed or independently tamper-verified audit.', 'Loaded events or dispatches without matching loaded task metadata are excluded; this export does not establish complete history.'],
    };
    const url = URL.createObjectURL(new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ddg-work-ledger-snapshot.json';
    document.body.appendChild(link); link.click(); link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <details className="ai-stack-cockpit-category work-ledger" id="work-ledger">
      <summary><strong>Activity ledger</strong><small>{loading ? 'Loading…' : failed ? 'Unavailable' : `${events.length} matching events · ${dispatches.length} matching dispatches`}</small></summary>
      <p className="ai-stack-help">Saved task actions and dispatch identities. Model/provider are shown only on their actual run records. Missing attribution and decision reasons are not inferred.</p>
      {loading ? <p role="status">Loading ledger…</p> : failed ? <div role="alert"><p>Ledger unavailable; this is not an empty successful history.</p><button type="button" className="work-toggle" onClick={onRetry}>Retry</button></div> : <>
        {invalidSelection && <div role="status"><p>The selected project or task is no longer in the loaded records. This does not establish deletion or completion.</p><button type="button" className="work-toggle" onClick={resetSelection}>Show all loaded records</button></div>}
        {project === 'all' && task === 'all' && (unassociatedEvents > 0 || unassociatedRuns > 0) && <p className="ai-stack-help" role="status">{unassociatedEvents} loaded events and {unassociatedRuns} loaded dispatches lack matching task metadata. They are excluded from this view and export; history coverage is incomplete.</p>}
        <div className="ledger-filters">
          <label>Project<select value={project} onChange={(event) => { setProject(event.target.value); setTask('all'); setLimit(50); }}><option value="all">All loaded projects</option>{projects.map((key) => <option key={key} value={key}>{key}</option>)}</select></label>
          <label>Task<select value={task} onChange={(event) => { setTask(event.target.value); setLimit(50); }}><option value="all">All matching tasks</option>{tasks.filter((item) => project === 'all' || item.project_key === project).map((item) => <option key={item.id} value={item.id}>#{item.id} {item.title}</option>)}</select></label>
          <button type="button" className="work-toggle" onClick={exportSnapshot} disabled={!data || invalidSelection}>Export selected records</button>
        </div>
        <h3>Task events</h3>
        {events.length === 0 ? <p className="ai-stack-help">No matching events in the loaded selection. Missing task metadata and unconnected systems are not covered.</p> : <ol className="ledger-events">{events.slice(0,limit).map((event) => {
          const item = tasks.find((candidate) => candidate.id === event.work_item_id);
          const links = recordedLinks(event.details);
          const entries = Object.entries(links) as Array<[keyof typeof LINK_LABELS,number]>;
          const matchedRun = links.dispatch_id != null && dispatches.some(run=>run.id===links.dispatch_id && run.work_item_id===event.work_item_id);
          return <li key={event.id}><div><strong>{event.event_type.replaceAll('_',' ')}</strong><time dateTime={event.created_at}>{timeLabel(event.created_at)} · Brisbane</time></div><p>Task #{event.work_item_id} · {item?.project_key ?? 'Project unknown'} · Actor: {event.actor || 'Unknown'}</p>
            <p className="ai-stack-help">Recorded links: {entries.length ? entries.map(([key,value])=>`${LINK_LABELS[key]} ${value}`).join(' · ') : 'Unknown — no supported links recorded.'}</p>
            {links.dispatch_id != null && <p className="ai-stack-help">{matchedRun ? 'Dispatch ID matches a loaded run for this task.' : 'Matching dispatch/task metadata is not in this loaded selection. No run or model is inferred.'}</p>}
            <small>Event #{event.id} · Model/reason attribution not established by this event view.</small></li>;
        })}</ol>}
        {events.length > limit && <button type="button" className="work-toggle" onClick={() => setLimit((value) => value + 50)}>Show 50 more</button>}
        <details className="ledger-runs"><summary>Provider/run records · {dispatches.length}</summary>{dispatches.length === 0 ? <p>No saved dispatches. This does not prove no external work occurred.</p> : dispatches.map((run) => <article key={run.id}>
          <h4>Dispatch #{run.id} · task #{run.work_item_id}</h4><p>{run.provider || 'Provider unknown'} / {run.model_id || 'Model unknown'} · {run.status}</p><p>Agent {run.agent_id || 'Unknown'} · run {run.run_id || 'Unknown'}</p><p>Branch {run.branch || 'Unknown'} · provider state {run.provider_status || 'Unknown'}</p><time dateTime={run.started_at}>{timeLabel(run.started_at)} · Brisbane</time>
        </article>)}</details>
        <p className="ai-stack-help">Export contains selected identifiers and allowlisted recorded version/link numbers, not raw event payloads or task text. No record editing is offered. Storage immutability, complete reasoning provenance and external activity coverage require separate verification.</p>
      </>}
    </details>
  );
}
