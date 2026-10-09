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
import { formatBrisbaneDateTime, formatDueDate } from '@/lib/format';

export function sourceLabelForDecision(source: string): string {
  return source === 'ollie_daily' ? 'Ollie daily' : source === 'cursor' ? 'Cursor' : source;
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
  const pending = pendingQuery.data ?? [];
  const projectNames = new Map((projectsQuery.data ?? []).map((project) => [project.slug, project.name]));
  const sortedHistory: DecisionWithNames[] = [
    ...(approvedQuery.data ?? []),
    ...(declinedQuery.data ?? []),
  ].sort((a, b) => {
    const aTime = a.decided_at ? new Date(a.decided_at).getTime() : 0;
    const bTime = b.decided_at ? new Date(b.decided_at).getTime() : 0;
    return bTime - aTime;
  });
  const isLoading = pendingQuery.isLoading || approvedQuery.isLoading || declinedQuery.isLoading;
  const queryError = pendingQuery.error ?? approvedQuery.error ?? declinedQuery.error;

  return (
    <div className="app-shell">
      <Header />
      <main className="page-wrap detail-main decisions-main">
        <Link className="back-link" href="/" data-testid="link-decisions-home">← Home</Link>
        <div className="detail-heading decisions-heading">
          <p className="eyebrow">Review queue</p>
          <h1 className="detail-title">Decisions</h1>
          <p className="detail-description">Ollie’s recommendations, ready for your call.</p>
          <p className="cursor-decision-cta">Decide with Ollie in Cursor</p>
        </div>

        <section className="decision-section" aria-labelledby="pending-decisions-title">
          <div className="decision-section-heading">
            <h2 id="pending-decisions-title">Waiting for review</h2>
            {!pendingQuery.isLoading && <span className="decision-count">{pending.length} pending</span>}
          </div>
          {isLoading ? (
            <div className="decision-skeleton" role="status" aria-label="Loading decisions"><span /><span /></div>
          ) : queryError ? (
            <div className="task-query-error" role="alert">
              <p>{serverErrorText(queryError, 'Unable to load decisions.')}</p>
              <button className="task-secondary-button" type="button" onClick={() => {
                void Promise.all([pendingQuery.refetch(), approvedQuery.refetch(), declinedQuery.refetch()]);
              }}>Retry</button>
            </div>
          ) : pending.length === 0 ? (
            <p className="decision-empty" data-testid="status-no-decisions">No decisions waiting</p>
          ) : (
            <div className="decision-list" data-testid="list-pending-decisions">
              {pending.map((decision) => (
                  <article className="decision-card" key={decision.id} data-testid={`card-decision-${decision.id}`}>
                    <div className="decision-card-top">
                      <div>
                        <p className="decision-project">{projectNames.get(decision.project_slug) ?? decision.project_slug}</p>
                        <h3 className="decision-title">{decision.title}</h3>
                      </div>
                      <span className={`decision-urgency urgency-${decision.urgency}`}>{decision.urgency} urgency</span>
                    </div>
                    <p className="decision-recommendation">{decision.recommendation}</p>
                    <dl className="decision-facts">
                      <div><dt>Cost</dt><dd>{decision.cost_estimate_aud == null ? 'Cost unknown' : `${new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(decision.cost_estimate_aud)} est.`}</dd></div>
                      <div><dt>Risk</dt><dd>{decision.risk}</dd></div>
                      <div><dt>Confidence</dt><dd>{decision.confidence}</dd></div>
                      <div><dt>Owner</dt><dd>{decision.owner_name}</dd></div>
                      <div><dt>Due</dt><dd>{decision.due_date ? formatDueDate(decision.due_date) : 'Date unavailable'}</dd></div>
                    </dl>
                    <div className="decision-origin">
                      <span>Source: {sourceLabelForDecision(decision.source)}</span>
                      <span>Decided via: {decision.decided_via ?? 'Not recorded'}</span>
                    </div>
                    {decision.note && <p className="history-note">{decision.note}</p>}
                  </article>
                ))}
            </div>
          )}
        </section>

        <section className="decision-history" aria-labelledby="decision-history-title">
          <div className="decision-section-heading">
            <h2 id="decision-history-title">Decision history</h2>
            <span className="decision-count">{sortedHistory.length} resolved</span>
          </div>
          {isLoading ? (
            <div className="decision-history-skeleton" role="status" aria-label="Loading decision history" />
          ) : sortedHistory.length === 0 ? (
            <p className="decision-empty">No decisions recorded yet</p>
          ) : (
            <div className="decision-history-list" data-testid="list-decision-history">
              {sortedHistory.map((decision) => (
                <article className="decision-history-row" key={decision.id} data-testid={`history-decision-${decision.id}`}>
                  <div className="history-decision-copy">
                    <p className="decision-project">{projectNames.get(decision.project_slug) ?? decision.project_slug}</p>
                    <h3>{decision.title}</h3>
                    {decision.note && <p className="history-note">{decision.note}</p>}
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
        </section>
      </main>
    </div>
  );
}
