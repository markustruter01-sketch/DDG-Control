import { useEffect } from 'react';
import { useState } from 'react';
import { Link } from 'wouter';
import {
  getListDecisionsQueryKey,
  getListProjectsQueryKey,
  useListDecisions,
  useListProjects,
  type DecisionWithNames,
} from '@workspace/api-client-react';
import { Header } from '@/components/header';
import { serverErrorText } from '@/lib/errors';
import { formatBrisbaneDateTime, formatCurrentDisplayName, formatDueDate } from '@/lib/format';

export function sourceLabelForDecision(source: string): string {
  return source === 'ollie_daily' ? 'Heimdall daily' : source === 'cursor' ? 'Cursor' : source;
}

export function DecisionsPage() {
  const pendingQuery = useListDecisions(
    { status: 'pending' },
    { query: { queryKey: getListDecisionsQueryKey({ status: 'pending' }) } },
  );
  const approvedQuery = useListDecisions(
    { status: 'approved' },
    { query: { queryKey: getListDecisionsQueryKey({ status: 'approved' }) } },
  );
  const declinedQuery = useListDecisions(
    { status: 'declined' },
    { query: { queryKey: getListDecisionsQueryKey({ status: 'declined' }) } },
  );
  const projectsQuery = useListProjects({
    query: { queryKey: getListProjectsQueryKey() },
  });
  const [projectFilter, setProjectFilter] = useState('all');
  const pending = pendingQuery.data ?? [];
  const visiblePending = pending.filter((decision) => projectFilter === 'all' || decision.project_slug === projectFilter);
  const projectNames = new Map((projectsQuery.data ?? []).map((project) => [project.slug, project.name]));
  const sortedHistory: DecisionWithNames[] = [
    ...(approvedQuery.data ?? []),
    ...(declinedQuery.data ?? []),
  ].sort((a, b) => {
    const aTime = a.decided_at ? new Date(a.decided_at).getTime() : 0;
    const bTime = b.decided_at ? new Date(b.decided_at).getTime() : 0;
    return bTime - aTime;
  });
  const visibleHistory = sortedHistory.filter((decision) => projectFilter === 'all' || decision.project_slug === projectFilter);
  const historyLoading = approvedQuery.isLoading || declinedQuery.isLoading;
  const historyError = approvedQuery.error ?? declinedQuery.error;
  useEffect(() => {
    const match = /^#decision-(\\d+)$/.exec(window.location.hash);
    if (!match || pendingQuery.isLoading) return;
    const target = document.getElementById(`decision-${match[1]}`);
    if (!(target instanceof HTMLDetailsElement)) return;
    target.open = true;
    target.scrollIntoView({ behavior: 'auto', block: 'center' });
    target.querySelector('summary')?.focus();
  }, [pendingQuery.isLoading, pendingQuery.data]);

  return (
    <div className="app-shell">
      <Header />
      <main className="page-wrap detail-main decisions-main home-cockpit">
        <Link className="back-link" href="/" data-testid="link-decisions-home">← Home</Link>
        <div className="detail-heading decisions-heading home-cockpit-heading">
          <p className="eyebrow">Review queue</p>
          <h1 className="detail-title">Decisions</h1>
          <p className="detail-description">Review the queue. Open a card for the full recommendation.</p>
        </div>

        <section className="home-health-panel" aria-label="Decision overview">
          <div className="home-health-status">
            <div><span>Waiting for you</span><strong>{pendingQuery.isLoading ? '…' : pendingQuery.isError ? 'Unknown' : pending.length}</strong><small>Saved pending records</small></div>
            <div><span>Resolved</span><strong>{historyLoading ? '…' : historyError ? 'Unknown' : sortedHistory.length}</strong><small>Approved and declined records</small></div>
          </div>
          <label className="home-source-details" htmlFor="decision-project-filter">Project</label>
          <select id="decision-project-filter" value={projectFilter} onChange={(event) => setProjectFilter(event.target.value)}>
            <option value="all">All projects</option>
            {[...new Set([...projectNames.keys(), ...pending.map((decision) => decision.project_slug), ...sortedHistory.map((decision) => decision.project_slug)])].map((slug) => <option key={slug} value={slug}>{projectNames.get(slug) ?? slug}</option>)}
          </select>
          {projectsQuery.isError && <p className="home-unknown-state">Project names unavailable; repository labels shown where needed.</p>}
          <p className="home-unknown-state">Opening a card does not approve work. Use the existing decision workflow with Heimdall; this page does not start agents.</p>
        </section>

        <section className="decision-section home-health-panel" aria-labelledby="pending-decisions-title">
          <div className="decision-section-heading">
            <h2 id="pending-decisions-title">Waiting for review</h2>
            {!pendingQuery.isLoading && !pendingQuery.isError && <span className="decision-count">{visiblePending.length} shown</span>}
          </div>
          {pendingQuery.isLoading ? (
            <div className="decision-skeleton" role="status" aria-label="Loading decisions"><span /><span /></div>
          ) : pendingQuery.isError ? (
            <div className="task-query-error" role="alert">
              <p>{serverErrorText(pendingQuery.error, 'Unable to load decisions.')}</p>
              <button className="task-secondary-button" type="button" onClick={() => {
                void Promise.all([pendingQuery.refetch(), approvedQuery.refetch(), declinedQuery.refetch()]);
              }}>Retry</button>
            </div>
          ) : visiblePending.length === 0 ? (
            <p className="decision-empty" data-testid="status-no-decisions">{projectFilter === 'all' ? 'No decisions waiting' : 'No pending decisions for this project'}</p>
          ) : (
            <div className="decision-list" data-testid="list-pending-decisions">
              {visiblePending.map((decision) => (
                  <details className="decision-card" id={`decision-${decision.id}`} key={decision.id} data-testid={`card-decision-${decision.id}`}>
                    <summary className="decision-card-top">
                      <div>
                        <p className="decision-project">{projectNames.get(decision.project_slug) ?? decision.project_slug}</p>
                        <h3 className="decision-title">{formatCurrentDisplayName(decision.title)}</h3>
                      </div>
                      <span className={`decision-urgency urgency-${decision.urgency}`}>{decision.urgency} urgency</span>
                    </summary>
                    <p className="decision-recommendation">{formatCurrentDisplayName(decision.recommendation)}</p>
                    <dl className="decision-facts">
                      <div><dt>Cost</dt><dd>{decision.cost_estimate_aud == null ? 'Cost unknown' : `${new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(decision.cost_estimate_aud)} est.`}</dd></div>
                      <div><dt>Risk</dt><dd>{decision.risk}</dd></div>
                      <div><dt>Confidence</dt><dd>{decision.confidence}</dd></div>
                      <div><dt>Owner</dt><dd>{formatCurrentDisplayName(decision.owner_name)}</dd></div>
                      <div><dt>Due</dt><dd>{decision.due_date ? formatDueDate(decision.due_date) : 'Date unavailable'}</dd></div>
                    </dl>
                    <div className="decision-origin">
                      <span>Source: {sourceLabelForDecision(decision.source)}</span>
                      <span>Decided via: {decision.decided_via ?? 'Not recorded'}</span>
                    </div>
                    {decision.note && <p className="history-note">{formatCurrentDisplayName(decision.note)}</p>}
                  </details>
                ))}
            </div>
          )}
        </section>

        <details className="decision-history home-health-panel">
          <summary className="decision-section-heading"><strong>Decision history</strong><span>{historyLoading ? 'Loading…' : historyError ? 'Unavailable' : `${visibleHistory.length} records`}</span></summary>
          <div className="decision-section-heading">
            <h2 id="decision-history-title">Decision history</h2>
            
          </div>
          {historyLoading ? (
            <div className="decision-history-skeleton" role="status" aria-label="Loading decision history" />
          ) : historyError ? (
            <div className="task-query-error" role="alert"><p>{serverErrorText(historyError, 'Unable to load decision history.')}</p><button className="task-secondary-button" type="button" onClick={() => { void Promise.all([approvedQuery.refetch(), declinedQuery.refetch()]); }}>Retry history</button></div>
          ) : visibleHistory.length === 0 ? (
            <p className="decision-empty">No decisions recorded yet</p>
          ) : (
            <div className="decision-history-list" data-testid="list-decision-history">
              {visibleHistory.map((decision) => (
                <article className="decision-history-row" key={decision.id} data-testid={`history-decision-${decision.id}`}>
                  <div className="history-decision-copy">
                    <p className="decision-project">{projectNames.get(decision.project_slug) ?? decision.project_slug}</p>
                    <h3>{formatCurrentDisplayName(decision.title)}</h3>
                    {decision.note && <p className="history-note">{formatCurrentDisplayName(decision.note)}</p>}
                    <p className="history-note">Source: {sourceLabelForDecision(decision.source)} · Decided via: {decision.decided_via ?? 'Not recorded'}</p>
                  </div>
                  <div className="history-decision-meta">
                    <span className={`history-status history-status-${decision.status}`}>{decision.status}</span>
                    <time>{formatBrisbaneDateTime(decision.decided_at)}</time>
                    {decision.status === 'approved' && (
                      <Link className="history-task-link" href={`/projects/${decision.project_slug}?tab=To-do`}>
                        View task
                      </Link>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </details>
      </main>
    </div>
  );
}
