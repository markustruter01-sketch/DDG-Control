import {
  getListDecisionsQueryKey,
  getListLatestAgentUpdatesQueryKey,
  getListProjectOllieHistoryQueryKey,
  getListProjectNotesQueryKey,
  getListProjectTasksQueryKey,
  useListDecisions,
  useListLatestAgentUpdates,
  useListProjectTasks,
  useListProjectOllieHistory,
  useListProjectNotes,
  type Task,
  type OllieHistoryRow,
  type ProjectNote,
} from '@workspace/api-client-react';
import { TASK_STATUS_LABELS, type TaskStatus } from '@workspace/project-constants';
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { serverErrorText } from '@/lib/errors';
import { formatBrisbaneDateTime, formatDueDate } from '@/lib/format';
import { sourceLabelForDecision } from '@/pages/Decisions';
import { ChartFrame, FinanceTradingHealth } from '@/components/projects/Data';

function OllieTimeline({ rows, loading, error }: { rows: OllieHistoryRow[]; loading: boolean; error: unknown }) {
  if (loading) return <p className="task-state-message" role="status">Loading Ollie status history…</p>;
  if (error) return <p className="data-error" role="alert">{serverErrorText(error, 'Unable to load Ollie status history.')}</p>;
  if (!rows.length) return <p className="data-empty">No status history yet</p>;
  return (
    <ol className="status-timeline">
      {rows.map((row, index) => (
        <li key={`${row.created_at}-${index}`}>
          <span className={`agent-light-dot agent-light-${row.status_light}`} aria-label={`${row.status_light} status`} />
          <span className="timeline-status">{row.status_light}</span>
          {row.priority && <span className={`priority-chip priority-${row.priority}`}>{row.priority}</span>}
          <time>{formatBrisbaneDateTime(row.created_at)}</time>
        </li>
      ))}
    </ol>
  );
}

function TaskStatusChart({ tasks, loading, error }: { tasks: Task[]; loading: boolean; error: unknown }) {
  if (loading) return <p className="task-state-message" role="status">Loading task status…</p>;
  if (error) return <p className="data-error" role="alert">{serverErrorText(error, 'Unable to load project tasks.')}</p>;
  const counts = tasks.reduce<Record<string, number>>((result, task) => {
    result[task.status] = (result[task.status] ?? 0) + 1;
    return result;
  }, {});
  const data = Object.entries(counts).map(([status, count]) => ({ status: TASK_STATUS_LABELS[status as TaskStatus] ?? status, count }));
  if (!data.length) return <p className="data-empty">No tasks yet</p>;
  return (
    <ResponsiveContainer width="100%" height={210}>
      <BarChart data={data} margin={{ top: 8, right: 6, bottom: 0, left: 0 }}>
        <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeDasharray="3 4" />
        <XAxis dataKey="status" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} stroke="hsl(var(--border))" />
        <YAxis allowDecimals={false} width={28} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} stroke="hsl(var(--border))" />
        <Tooltip contentStyle={{ background: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }} />
        <Bar dataKey="count" name="Tasks" fill="hsl(var(--chart-3))" fillOpacity={0.88} radius={[2, 2, 0, 0]} isAnimationActive={false} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function OverviewWorkspace({ slug }: { slug: string }) {
  const history = useListProjectOllieHistory(slug, { query: { queryKey: getListProjectOllieHistoryQueryKey(slug) } });
  const tasks = useListProjectTasks(slug, { query: { queryKey: getListProjectTasksQueryKey(slug) } });
  return (
    <div className="overview-data">
      {slug === 'finance' && <FinanceTradingHealth />}
      <section className="agent-latest-box">
        <h2 className="todo-group-title">Ollie status history</h2>
        <OllieTimeline rows={history.data ?? []} loading={history.isLoading} error={history.error} />
      </section>
      <ChartFrame title="Project tasks by status">
        <TaskStatusChart tasks={tasks.data ?? []} loading={tasks.isLoading} error={tasks.error} />
      </ChartFrame>
    </div>
  );
}

export function AgentActivityWorkspace({ slug }: { slug: string }) {
  const history = useListProjectOllieHistory(slug, { query: { queryKey: getListProjectOllieHistoryQueryKey(slug) } });
  const notes = useListProjectNotes(slug, { query: { queryKey: getListProjectNotesQueryKey(slug) } });
  const pending = useListDecisions({ status: 'pending' }, { query: { queryKey: getListDecisionsQueryKey({ status: 'pending' }) } });
  const approved = useListDecisions({ status: 'approved' }, { query: { queryKey: getListDecisionsQueryKey({ status: 'approved' }) } });
  const declined = useListDecisions({ status: 'declined' }, { query: { queryKey: getListDecisionsQueryKey({ status: 'declined' }) } });
  const decisions = [...(pending.data ?? []), ...(approved.data ?? []), ...(declined.data ?? [])]
    .filter((decision) => decision.project_slug === slug)
    .sort((a, b) => (b.decided_at ?? b.created_at ?? '').localeCompare(a.decided_at ?? a.created_at ?? ''));
  const decisionsError = pending.error ?? approved.error ?? declined.error;
  const decisionsLoading = pending.isLoading || approved.isLoading || declined.isLoading;
  const sourceLabel = (source: string) => source === 'ollie_daily' ? 'Ollie daily' : source === 'cursor' ? 'Cursor' : source;
  return (
    <div className="activity-columns">
      <section className="agent-latest-box"><h2 className="todo-group-title">Ollie history</h2><OllieTimeline rows={history.data ?? []} loading={history.isLoading} error={history.error} /></section>
      <section className="activity-panel">
        <h2 className="todo-group-title">Project decisions</h2>
        {decisionsLoading ? <p className="task-state-message">Loading decisions…</p> : decisionsError ? <p className="data-error" role="alert">{serverErrorText(decisionsError, 'Unable to load decisions.')}</p> : decisions.length === 0 ? <p className="data-empty">No decisions yet</p> : (
          <div className="activity-list">{decisions.map((decision) => <article className="activity-entry" key={decision.id}>
            <div className="activity-entry-head"><strong>{decision.title}</strong><span className={`history-status history-status-${decision.status}`}>{decision.status}</span></div>
            <p>{decision.recommendation}</p><div className="activity-meta"><span>Source: {sourceLabel(decision.source)}</span><span>Decided via: {decision.decided_via ?? 'Not recorded'}</span><time>{formatBrisbaneDateTime(decision.decided_at ?? decision.created_at)}</time></div>
          </article>)}</div>
        )}
      </section>
      <section className="activity-panel">
        <h2 className="todo-group-title">Project notes</h2>
        {notes.isLoading ? <p className="task-state-message">Loading project notes…</p> : notes.isError ? <p className="data-error" role="alert">{serverErrorText(notes.error, 'Unable to load project notes.')}</p> : (notes.data?.length ?? 0) === 0 ? <p className="data-empty">No notes yet</p> : (
          <div className="activity-list">{(notes.data ?? []).map((note: ProjectNote) => <article className="activity-entry" key={note.id}>
            <div className="activity-entry-head"><span>{note.kind}</span><span className={`risk-severity severity-${note.severity}`}>{note.severity}</span></div>
            <p>{note.text}</p><time>{formatBrisbaneDateTime(note.created_at)}</time>
          </article>)}</div>
        )}
      </section>
    </div>
  );
}

export function NextActionWorkspace({ slug }: { slug: string }) {
  const updates = useListLatestAgentUpdates({ query: { queryKey: getListLatestAgentUpdatesQueryKey(), staleTime: 60_000 } });
  const tasksQuery = useListProjectTasks(slug, { query: { queryKey: getListProjectTasksQueryKey(slug) } });
  const pendingQuery = useListDecisions({ status: 'pending' }, { query: { queryKey: getListDecisionsQueryKey({ status: 'pending' }) } });
  const update = updates.data?.find((entry) => entry.project_slug === slug);
  const tasks = (tasksQuery.data ?? []).filter((task) => task.status !== 'done').sort((a, b) => {
    if (!a.due_date && !b.due_date) return 0;
    if (!a.due_date) return 1;
    if (!b.due_date) return -1;
    return a.due_date.localeCompare(b.due_date);
  }).slice(0, 3);
  const decisions = (pendingQuery.data ?? []).filter((decision) => decision.project_slug === slug);
  return (
    <div className="next-action-workspace">
      <section className="next-action-feature">
        <p className="eyebrow">Ollie’s latest recommendation</p>
        {updates.isLoading ? <p className="task-state-message">Loading next action…</p> : updates.isError ? <p className="data-error" role="alert">{serverErrorText(updates.error, 'Unable to load Ollie’s recommendation.')}</p> : <h2>{update?.next_action ?? 'No next action yet'}</h2>}
        {update?.created_at && <time>{formatBrisbaneDateTime(update.created_at)}</time>}
      </section>
      <section className="activity-panel">
        <h2 className="todo-group-title">Pending decisions</h2>
        {pendingQuery.isLoading ? <p className="task-state-message">Loading decisions…</p> : pendingQuery.isError ? <p className="data-error" role="alert">{serverErrorText(pendingQuery.error, 'Unable to load decisions.')}</p> : decisions.length ? <div className="activity-list">{decisions.map((decision) => <article className="activity-entry" key={decision.id}><strong>{decision.title}</strong><p>{decision.recommendation}</p><span className="decision-count">{sourceLabelForDecision(decision.source)}</span></article>)}</div> : <p className="data-empty">No pending decisions</p>}
      </section>
      <section className="activity-panel">
        <h2 className="todo-group-title">Upcoming tasks</h2>
        {tasksQuery.isLoading ? <p className="task-state-message">Loading tasks…</p> : tasksQuery.isError ? <p className="data-error" role="alert">{serverErrorText(tasksQuery.error, 'Unable to load project tasks.')}</p> : tasks.length ? <div className="activity-list">{tasks.map((task) => <article className="activity-entry" key={task.id}><strong>{task.title}</strong><div className="activity-meta"><span>{TASK_STATUS_LABELS[task.status as TaskStatus] ?? task.status}</span><span>{task.due_date ? `Due ${formatDueDate(task.due_date)}` : 'Undated'}</span></div></article>)}</div> : <p className="data-empty">No open tasks</p>}
      </section>
    </div>
  );
}
