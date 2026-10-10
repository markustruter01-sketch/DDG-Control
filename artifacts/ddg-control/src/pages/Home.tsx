import type { CSSProperties } from 'react';
import { Link } from 'wouter';
import {
  getGetFinanceSummaryQueryKey,
  getGetCattleDogCoffeeProfitQueryKey,
  getGetProjectFinanceFleetLatestQueryKey,
  getListDecisionsQueryKey,
  getListLatestAgentUpdatesQueryKey,
  getListProjectDailySalesQueryKey,
  getListProjectMetricsQueryKey,
  getListProjectsQueryKey,
  useGetFinanceSummary,
  useGetCattleDogCoffeeProfit,
  useGetProjectFinanceFleetLatest,
  useListDecisions,
  useListLatestAgentUpdates,
  useListProjectDailySales,
  useListProjectMetrics,
  useListProjects,
  type DailySalesRow,
  type FinanceSummaryResponse,
  type LatestAgentProjectUpdate,
  type Project,
} from '@workspace/api-client-react';
import { PROJECT_HEADLINE_METRIC } from '@workspace/project-constants';
import { Header } from '@/components/header';
import { SocialBar } from '@/components/SocialBar';
import { serverErrorText } from '@/lib/errors';
import { formatAgo, formatFigure, formatFinanceCents } from '@/lib/format';

function Sparkline({ rows }: { rows: DailySalesRow[] }) {
  if (rows.length < 2) return null;
  const values = rows.map((row) => row.sales_cents);
  const low = Math.min(...values);
  const range = Math.max(1, Math.max(...values) - low);
  const points = values.map((value, index) => {
    const x = (index / (values.length - 1)) * 100;
    const y = 26 - ((value - low) / range) * 22;
    return `${x},${y}`;
  }).join(' ');
  return <svg className="tile-sparkline" viewBox="0 0 100 28" role="img" aria-label="Daily sales trend"><polyline points={points} /></svg>;
}

function FinanceKpiCard({
  testId,
  label,
  value,
  detail,
  negative = false,
}: {
  testId: string;
  label: string;
  value: string;
  detail: string;
  negative?: boolean;
}) {
  return (
    <article className="finance-kpi-card" data-testid={testId}>
      <p className="finance-kpi-label">{label}</p>
      <p className={`finance-kpi-value${negative ? ' finance-kpi-value-negative' : ''}`}>{value}</p>
      <p className="finance-kpi-detail">{detail}</p>
    </article>
  );
}

function FinanceSummaryBar({
  summary,
  projects,
  isLoading,
  error,
  onRetry,
  updatedAt,
}: {
  summary: FinanceSummaryResponse | undefined;
  projects: Project[];
  updatedAt: number;
  isLoading: boolean;
  error: unknown;
  onRetry: () => void;
}) {
  const missingRevenueProjects = (summary?.ventures_without_revenue_source ?? []).map(
    (slug) => projects.find((project) => project.slug === slug)?.name ?? slug,
  );
  const placeholder = isLoading ? '…' : '—';
  const customerCount = summary
    ? summary.customers === null
      ? '–'
      : formatFigure(summary.customers, 'count')
    : placeholder;

  return (
    <section className="finance-summary" aria-label="Company-wide key figures" data-testid="finance-summary">
      <div className="finance-kpi-grid">
        <FinanceKpiCard
          testId="finance-kpi-profit"
          label="Profit · last 30 days"
          value={summary ? formatFinanceCents(summary.profit_30d_cents) : placeholder}
          detail={`Revenue ${summary ? formatFigure(summary.revenue_30d_cents, 'aud_cents') : placeholder}`}
          negative={Boolean(summary && summary.profit_30d_cents < 0)}
        />
        <FinanceKpiCard
          testId="finance-kpi-debt"
          label="Debt"
          value={summary ? formatFigure(summary.debt_cents, 'aud_cents') : placeholder}
          detail=" "
        />
        <FinanceKpiCard
          testId="finance-kpi-expenses"
          label="Expected expenses · next month"
          value={summary ? formatFigure(summary.expected_expenses_next_month_cents, 'aud_cents') : placeholder}
          detail=" "
        />
        <FinanceKpiCard
          testId="finance-kpi-expected-profit"
          label="Expected profit · next month"
          value={summary ? formatFinanceCents(summary.expected_profit_next_month_cents) : placeholder}
          detail={`Expected revenue ${summary ? formatFigure(summary.expected_revenue_next_month_cents, 'aud_cents') : placeholder} · estimate`}
          negative={Boolean(summary && summary.expected_profit_next_month_cents < 0)}
        />
        <FinanceKpiCard
          testId="finance-kpi-customers"
          label="Online customers · last 30 days"
          value={customerCount}
          detail="Cattle Dog Coffee, Stripe only"
        />
      </div>
      {summary && <p className="finance-partial-line" data-testid="finance-summary-updated">Updated {formatAgo(updatedAt)}</p>}
      {isLoading && <p className="finance-summary-state" role="status">Loading company figures…</p>}
      {error != null && (
        <div className="finance-summary-state finance-summary-error" role="alert">
          <span>{serverErrorText(error, 'Unable to load company figures.')}</span>
          <button className="retry-button" type="button" onClick={onRetry}>Retry</button>
        </div>
      )}
      {missingRevenueProjects.length > 0 && (
        <p className="finance-partial-line">
          Partial: no revenue data for {missingRevenueProjects.join(', ')}
        </p>
      )}
      {summary && summary.notes.length > 0 && (
        <ul className="finance-summary-notes">
          {summary.notes.map((note) => <li key={note}>{note}</li>)}
        </ul>
      )}
    </section>
  );
}

export function Home() {
  const projectsQuery = useListProjects({
    query: { queryKey: getListProjectsQueryKey() },
  });
  const agentUpdatesQuery = useListLatestAgentUpdates({
    query: {
      queryKey: getListLatestAgentUpdatesQueryKey(),
      staleTime: 60_000,
    },
  });
  const pendingDecisionsQuery = useListDecisions(
    { status: 'pending' },
    { query: { queryKey: getListDecisionsQueryKey({ status: 'pending' }) } },
  );
  const financeSummaryQuery = useGetFinanceSummary({
    query: {
      queryKey: getGetFinanceSummaryQueryKey(),
      staleTime: 60_000,
    },
  });
  const fleetLatestQuery = useGetProjectFinanceFleetLatest({
    query: {
      queryKey: getGetProjectFinanceFleetLatestQueryKey(),
      staleTime: 60_000,
    },
  });
  const coffeeProfitQuery = useGetCattleDogCoffeeProfit({
    query: {
      queryKey: getGetCattleDogCoffeeProfitQueryKey(),
      staleTime: 60_000,
    },
  });
  const coffeeSlug = 'cattle-dog-coffee';
  const coffeeMetricsQuery = useListProjectMetrics(coffeeSlug, {
    query: { queryKey: getListProjectMetricsQueryKey(coffeeSlug) },
  });
  const coffeeSalesQuery = useListProjectDailySales(coffeeSlug, {
    query: { queryKey: getListProjectDailySalesQueryKey(coffeeSlug) },
  });
  const backgroundStyle = {
    '--home-background': `url("${import.meta.env.BASE_URL}dashboard-background.jpg")`,
  } as CSSProperties;
  const projects = projectsQuery.data ?? [];
  const reportChanges = (agentUpdatesQuery.data ?? []).flatMap(
    (update: LatestAgentProjectUpdate) => {
      const previous = update.previous;
      if (!previous) return [];
      const differences: string[] = [];
      if (previous.status_light !== update.status_light) {
        differences.push(`Status: ${previous.status_light} → ${update.status_light}`);
      }
      if (
        previous.priority &&
        update.priority &&
        previous.priority !== update.priority
      ) {
        differences.push(`Priority: ${previous.priority} → ${update.priority}`);
      }
      if (previous.next_action !== update.next_action) {
        differences.push(`Next action changed: ${update.next_action}`);
      }
      if (differences.length === 0) return [];
      const project = projects.find((item) => item.slug === update.project_slug);
      return [{
        project_slug: update.project_slug,
        project_name: project?.name ?? update.project_slug,
        differences,
      }];
    },
  );

  return (
    <div className="app-shell home-shell" style={backgroundStyle}>
      <Header />
      <main className="page-wrap home-main">
        <p className="eyebrow">Control panel</p>
        <h1 className="home-title">Projects</h1>
        <FinanceSummaryBar
          summary={financeSummaryQuery.data}
          projects={projects}
          isLoading={financeSummaryQuery.isLoading}
          error={financeSummaryQuery.isError ? financeSummaryQuery.error : null}
          onRetry={() => void financeSummaryQuery.refetch()}
          updatedAt={financeSummaryQuery.dataUpdatedAt}
        />
        <SocialBar projects={projects} />
        {(pendingDecisionsQuery.data?.length ?? 0) > 0 && (
          <Link className="decisions-waiting" href="/decisions" data-testid="link-decisions-waiting">
            Decisions waiting: {pendingDecisionsQuery.data?.length}
            <span aria-hidden="true">→</span>
          </Link>
        )}
        <div className="section-rule"><span>Projects</span></div>

        {projectsQuery.isLoading ? (
          <section className="state-panel" aria-live="polite" data-testid="status-projects-loading">
            <div className="skeleton loading-line" aria-hidden="true" />
            <p className="state-copy loading-label">Loading projects…</p>
          </section>
        ) : projectsQuery.isError ? (
          <section className="state-panel" role="alert" data-testid="status-projects-error">
            <h2 className="state-title">Unable to load projects.</h2>
            <p className="state-copy">Please try again.</p>
            <button className="retry-button" type="button" onClick={() => void projectsQuery.refetch()} data-testid="button-retry-projects">
              Retry
            </button>
          </section>
        ) : projectsQuery.data?.length ? (
          <div className="project-grid" data-testid="list-projects">
            {projectsQuery.data.map((project) => {
              const latestUpdate = agentUpdatesQuery.data?.find(
                (update) => update.project_slug === project.slug,
              );
              const headlineKey = PROJECT_HEADLINE_METRIC[project.slug as keyof typeof PROJECT_HEADLINE_METRIC];
              const headlineMetric = headlineKey
                ? coffeeMetricsQuery.data?.find((metric) => metric.key === headlineKey)
                : undefined;
              const fleet = fleetLatestQuery.data && !('empty' in fleetLatestQuery.data)
                ? fleetLatestQuery.data
                : undefined;
              const financeHeadline = project.slug === 'finance'
                ? fleetLatestQuery.isError
                  ? 'No data yet'
                  : fleet?.mode === 'paper'
                    ? `${formatFigure(fleet.total_equity_cents, 'usd_cents')} · Fleet value (paper) · updated ${formatAgo(fleet.generated_at)}`
                    : 'No data yet'
                : null;
              const coffeeProfitHeadline = project.slug === coffeeSlug
                ? coffeeProfitQuery.data
                  ? `${formatFigure(coffeeProfitQuery.data.last30d.grossRevenueCents, 'aud_cents')} sales · ${coffeeProfitQuery.data.last30d.netProfitCents === null ? '—' : formatFigure(coffeeProfitQuery.data.last30d.netProfitCents, 'aud_cents')} profit · last 30 days · updated ${formatAgo(coffeeProfitQuery.data.generatedAt)}`
                  : coffeeProfitQuery.isError
                    ? `${headlineMetric ? `${formatFigure(headlineMetric.value, headlineMetric.unit)} · ${headlineMetric.label}` : 'No data yet'} (online only)`
                    : 'Loading…'
                : null;
              const dailySales = project.slug === coffeeSlug ? (coffeeSalesQuery.data ?? []) : [];
              return (
                <Link
                  key={project.id}
                  href={`/projects/${project.slug}`}
                  className="project-tile"
                  data-testid={`link-project-${project.slug}`}
                >
                  <div className="tile-top">
                    <h2 className="tile-name" data-testid={`text-project-name-${project.slug}`}>{project.name}</h2>
                    <div className="tile-status-group">
                      <span className="status-badge" data-testid={`status-project-${project.slug}`}>
                        <span className="status-dot" aria-hidden="true" />
                        {project.status}
                      </span>
                      {latestUpdate && (
                        <span
                          className={`agent-light-dot agent-light-${latestUpdate.status_light}`}
                          title={`Ollie: ${latestUpdate.status_light}`}
                          aria-label={`Ollie's status light: ${latestUpdate.status_light}`}
                          data-testid={`agent-light-${project.slug}`}
                        />
                      )}
                      {latestUpdate?.priority && (
                        <span className={`priority-chip priority-${latestUpdate.priority}`} data-testid={`priority-project-${project.slug}`}>
                          {latestUpdate.priority}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="tile-facts">
                    <p className="tile-fact">
                      <strong>Headline:</strong>{' '}
                      {project.slug === 'finance'
                        ? financeHeadline
                        : project.slug === coffeeSlug
                          ? coffeeProfitHeadline
                        : headlineMetric
                          ? `${formatFigure(headlineMetric.value, headlineMetric.unit)} · ${headlineMetric.label}`
                          : 'No data yet'}
                    </p>
                    {project.slug === 'finance' && fleet?.stale && (
                      <p className="tile-fact fleet-tile-stale" role="status">
                        Stale — no update for {fleet.age_minutes} min
                      </p>
                    )}
                    {project.slug === coffeeSlug && <Sparkline rows={dailySales} />}
                    <p className="tile-fact">
                      <strong>Next action:</strong> {latestUpdate?.next_action ?? 'No data yet'}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <section className="state-panel" data-testid="status-projects-empty">
            <h2 className="state-title">No projects found.</h2>
          </section>
        )}

        <section className="report-section" aria-labelledby="report-title" data-testid="section-since-report">
          <div className="report-heading">
            <div>
              <p className="eyebrow">Ollie’s latest comparison</p>
              <h2 id="report-title" className="report-title">Since last report</h2>
            </div>
          </div>
          {agentUpdatesQuery.isLoading ? (
            <div className="report-state" role="status" aria-live="polite">
              <span className="skeleton loading-line" aria-hidden="true" />
              <span>Checking the latest report…</span>
            </div>
          ) : agentUpdatesQuery.isError ? (
            <div className="report-state report-state-error" role="alert">
              <span>Unable to load report changes.</span>
              <button className="retry-button" type="button" onClick={() => void agentUpdatesQuery.refetch()}>
                Retry
              </button>
            </div>
          ) : reportChanges.length === 0 ? (
            <p className="report-empty">No changes since last report</p>
          ) : (
            <div className="report-list">
              {reportChanges.map((change) => (
                  <article className="report-item" key={change.project_slug} data-testid={`report-project-${change.project_slug}`}>
                    <Link href={`/projects/${change.project_slug}`} className="report-project-link">
                      {change.project_name}
                    </Link>
                    <ul className="report-differences">
                      {change.differences.map((difference) => <li key={difference}>{difference}</li>)}
                    </ul>
                  </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
