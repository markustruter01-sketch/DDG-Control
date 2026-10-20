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
  useGetSocialSummary,
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
import { formatAgo, formatCurrentDisplayName, formatFigure, formatFinanceCents } from '@/lib/format';

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
  isLoading,
  error,
  onRetry,
}: {
  summary: FinanceSummaryResponse | undefined;
  isLoading: boolean;
  error: unknown;
  onRetry: () => void;
}) {
  const placeholder = isLoading ? '…' : '—';
  const customerCount = summary
    ? summary.customers === null
      ? '–'
      : formatFigure(summary.customers, 'count')
    : placeholder;
  const scale = Math.max(summary?.revenue_30d_cents ?? 0, summary?.expenses_30d_cents ?? 0, 1);

  return (
    <section className="home-performance-panel home-finance-panel" aria-labelledby="home-finance-title" data-testid="finance-summary">
      <div className="home-panel-heading">
        <div>
          <p className="home-section-kicker">Business performance</p>
          <h2 id="home-finance-title">Finance</h2>
        </div>
        <Link className="home-panel-link" href="/finances">Open Finance</Link>
      </div>
      <div className="home-finance-metrics">
        <FinanceKpiCard
          testId="finance-kpi-profit"
          label="Profit · 30 days"
          value={summary ? formatFinanceCents(summary.profit_30d_cents) : placeholder}
          detail={`Revenue ${summary ? formatFigure(summary.revenue_30d_cents, 'aud_cents') : placeholder}`}
          negative={Boolean(summary && summary.profit_30d_cents < 0)}
        />
        <FinanceKpiCard
          testId="finance-kpi-expected-profit"
          label="Expected profit · next month"
          value={summary ? formatFinanceCents(summary.expected_profit_next_month_cents) : placeholder}
          detail={`Estimate · revenue ${summary ? formatFigure(summary.expected_revenue_next_month_cents, 'aud_cents') : placeholder}`}
          negative={Boolean(summary && summary.expected_profit_next_month_cents < 0)}
        />
        <FinanceKpiCard
          testId="finance-kpi-customers"
          label="Online customers · 30 days"
          value={customerCount}
          detail="Cattle Dog Coffee · Stripe"
        />
        <FinanceKpiCard
          testId="finance-kpi-expenses"
          label="Expected expenses · next month"
          value={summary ? formatFigure(summary.expected_expenses_next_month_cents, 'aud_cents') : placeholder}
          detail="Estimate"
        />
        <FinanceKpiCard
          testId="finance-kpi-debt"
          label="Debt · current"
          value={summary ? formatFigure(summary.debt_cents, 'aud_cents') : placeholder}
          detail="Source date Unknown"
        />
      </div>
      <div className="home-performance-bars" aria-label="Revenue and expenses comparison">
        <div className="home-bar-row">
          <span>Revenue · last 30 days</span>
          <div className="home-bar-track"><i className="home-bar-revenue" style={{ width: `${summary ? (summary.revenue_30d_cents / scale) * 100 : 0}%` }} /></div>
          <strong>{summary ? formatFigure(summary.revenue_30d_cents, 'aud_cents') : placeholder}</strong>
        </div>
        <div className="home-bar-row">
          <span>Expenses · last 30 days</span>
          <div className="home-bar-track"><i className="home-bar-expenses" style={{ width: `${summary ? (summary.expenses_30d_cents / scale) * 100 : 0}%` }} /></div>
          <strong>{summary ? formatFigure(summary.expenses_30d_cents, 'aud_cents') : placeholder}</strong>
        </div>
      </div>
      <p className="home-chart-caption">Bars compare reported revenue and expenses over the same 30-day window; they are not a trend.</p>
      {isLoading && <p className="finance-summary-state" role="status">Loading company figures…</p>}
      {error != null && (
        <div className="finance-summary-state finance-summary-error" role="alert">
          <span>{serverErrorText(error, 'Unable to load company figures.')}</span>
          <button className="retry-button" type="button" onClick={onRetry}>Retry</button>
        </div>
      )}
      <details className="home-source-details">
        <summary>Periods and source notes</summary>
        <p>Revenue, expenses and profit: last 30 days. Expected values: next-month estimate. Finance response does not provide a source timestamp; source date is Unknown.</p>
        {summary?.notes.map((note, index) => <p key={`${index}-${note}`}>{note}</p>)}
      </details>
    </section>
  );
}


function CompanyAtlas({ projects }: { projects: Project[] }) {
  const node = (slug: string, label: string, symbol: string, position: string, note: string) => {
    const project = projects.find((item) => item.slug === slug);
    return (
      <details key={slug} className={`atlas-node atlas-node-${position}`}>
        <summary><span className="atlas-node-icon" aria-hidden="true">{symbol}</span><strong>{label}</strong><small>{note}</small></summary>
        <span className="atlas-node-detail">{project ? <Link href={`/projects/${project.slug}`}>Open project →</Link> : <Link href="/organisation">View context →</Link>}</span>
      </details>
    );
  };
  return (
    <section className="atlas-map-panel" aria-labelledby="atlas-title">
      <div className="atlas-map-heading"><div><p className="home-section-kicker">People · systems · projects</p><h2 id="atlas-title">Company Atlas</h2></div><Link href="/organisation">Explore connections →</Link></div>
      <div className="atlas-map-legend"><span>○ Company structure</span><span>┄ Unverified data path</span></div>
      <div className="atlas-map-canvas">
        <svg className="atlas-cables" viewBox="0 0 800 460" preserveAspectRatio="none" aria-hidden="true"><path d="M400 230 Q260 225 245 90 M400 230 Q530 230 560 90 M400 230 Q230 340 110 260 M400 230 Q580 350 675 260 M400 230 L400 385" /></svg>
        {node('hypest', 'Hypest', '↗', 'fitness', 'Fitness')}
        {node('ddg-finance', 'DDG Finance', '≋', 'finance', 'Held · Claude review')}
        {node('creative', 'Creative', '✧', 'creative', 'Gaming · music experiments')}
        {node('cattle-dog-coffee', 'Cattle Dog Coffee', '☕', 'coffee', 'DDG Coffee')}
        {node('ddg-music', 'DDG Music', '♫', 'music', 'Undecided · unchanged')}
        <Link className="atlas-node atlas-node-core" href="/ai-stack"><span className="atlas-node-icon" aria-hidden="true">⌘</span><strong>DDG Control</strong><small>Control platform</small></Link>
      </div>
      <p className="atlas-evidence-note">Agreed company structure. Transfer observation is not connected; cables do not claim live traffic.</p>
    </section>
  );
}

export function Home() {
  const socialSummaryQuery = useGetSocialSummary();
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
  const projects = projectsQuery.data ?? [];
  const socialReadings = socialSummaryQuery.data?.ventures.flatMap((venture) => venture.platforms) ?? [];
  const socialSourceDates = socialReadings.map((reading) => reading.captured_on).filter(Boolean).sort();
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
        differences.push(`Next action changed: ${formatCurrentDisplayName(update.next_action)}`);
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
  const latestUpdates = [...(agentUpdatesQuery.data ?? [])].sort((a, b) =>
    new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime(),
  );
  const pendingDecisions = pendingDecisionsQuery.data ?? [];
  const flaggedUpdates = latestUpdates.filter((update) => update.status_light === 'red');
  const formatSourceDate = (value: string | null) => value
    ? new Intl.DateTimeFormat('en-AU', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Australia/Brisbane' }).format(new Date(value))
    : 'Source date Unknown';

  return (
    <div className="app-shell home-shell">
      <Header />
      <main className="page-wrap home-main home-cockpit atlas-home">
        <div className="home-cockpit-heading">
          <div>
            <p className="eyebrow">Company overview</p>
            <h1 className="home-title">Company overview</h1>
          </div>
          <Link className="company-map-home-link" href="/organisation#company-map-title" data-testid="link-company-map">
            <span><strong>Company Map</strong><small>People, systems, projects and delivery gaps</small></span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <section className="home-overview-grid" aria-label="Company health and attention">
          <article className="home-health-panel">
            <div className="home-panel-heading">
              <div>
                <p className="home-section-kicker">1 · Company health</p>
                <h2>At a glance</h2>
              </div>
              <Link className="home-panel-link" href="/organisation">Company Map</Link>
            </div>
            <div className="home-health-status">
              <div>
                <span>Service health</span>
                <strong>Unknown</strong>
                <small>No dependency-health check is available on this dashboard.</small>
              </div>
              <div>
                <span>Project records</span>
                <strong>{projectsQuery.isLoading ? '…' : projectsQuery.isError ? 'Unknown' : projects.length}</strong>
                <small>{projectsQuery.isError ? 'Unable to read project registry.' : 'Registry count · not a live-service status'}</small>
              </div>
              <div><span>Profit · last 30 days</span><strong>{financeSummaryQuery.isLoading ? '…' : financeSummaryQuery.isError || !financeSummaryQuery.data ? 'Unknown' : formatFinanceCents(financeSummaryQuery.data.profit_30d_cents)}</strong><small>Reported total · source details below</small></div>
              <div><span>Social footprint</span><strong>{socialSummaryQuery.isLoading ? '…' : socialSummaryQuery.isError || socialReadings.length === 0 ? 'Unknown' : formatFigure(socialSummaryQuery.data!.total_followers, 'count')}</strong><small>{socialReadings.length > 0 ? `Summed followers · oldest reading ${socialSourceDates[0] ?? 'Unknown'}` : 'No saved readings'} · not unique people</small></div>
              <div><span>Employee roster</span><strong>9</strong><small>Named roles · not active worker count</small></div>
            </div>
            {projectsQuery.isError ? (
              <p className="home-unknown-state" role="alert">Project status unavailable.</p>
            ) : projects.length > 0 ? (
              <div className="home-status-list">
                {projects.map((project) => (
                  <Link key={project.id} href={`/projects/${project.slug}`} className="home-status-item">
                    <span>{project.name}</span><strong>{project.status}</strong>
                  </Link>
                ))}
              </div>
            ) : projectsQuery.isLoading ? <p className="home-unknown-state" role="status">Loading project registry…</p> : <p className="home-unknown-state">No project records returned.</p>}
          </article>

          <CompanyAtlas projects={projects} />
          <aside className="home-attention-panel" aria-labelledby="home-attention-title">
            <div className="home-panel-heading">
              <div>
                <p className="home-section-kicker">Owner review</p>
                <h2 id="home-attention-title">Needs attention</h2>
              </div>
              <span className="home-attention-count">{pendingDecisions.length + flaggedUpdates.length}</span>
            </div>
            {pendingDecisionsQuery.isLoading ? <p className="home-unknown-state" role="status">Checking decisions…</p>
              : pendingDecisionsQuery.isError ? <p className="home-unknown-state" role="alert">Decision queue unavailable.</p>
                : pendingDecisions.length === 0 && flaggedUpdates.length === 0 ? <p className="home-unknown-state">No pending decisions or red report flags in the available records.</p>
                  : (
                    <ul className="home-attention-list">
                      {pendingDecisions.slice(0, 3).map((decision) => (
                        <li key={decision.id}><Link href="/decisions"><span>{projects.find((project) => project.slug === decision.project_slug)?.name ?? decision.project_slug}</span><strong>{formatCurrentDisplayName(decision.title)}</strong><small>Owner decision · {decision.urgency} urgency</small></Link></li>
                      ))}
                      {flaggedUpdates.slice(0, 2).map((update) => (
                        <li key={`flag-${update.project_slug}`}><Link href={`/projects/${update.project_slug}`}><span>{projects.find((project) => project.slug === update.project_slug)?.name ?? update.project_slug}</span><strong>Red status in saved Heimdall report</strong><small>{formatCurrentDisplayName(update.next_action)}</small></Link></li>
                      ))}
                    </ul>
                  )}
            <Link className="home-panel-link" href="/decisions">Open decision records →</Link>
          </aside>
        </section>

        <section aria-label="Business performance">
          <div className="home-section-title">
            <p className="home-section-kicker">2 · Business performance</p>
            <p>Periods and source coverage are shown with each figure.</p>
          </div>
          <div className="home-performance-grid">
            <FinanceSummaryBar
              summary={financeSummaryQuery.data}
              isLoading={financeSummaryQuery.isLoading}
              error={financeSummaryQuery.isError ? financeSummaryQuery.error : null}
              onRetry={() => void financeSummaryQuery.refetch()}
            />
            <SocialBar projects={projects} />
          </div>
        </section>

        <section className="home-activity-panel" aria-labelledby="home-activity-title">
          <div className="home-panel-heading">
            <div>
              <p className="home-section-kicker">3 · Agent activity</p>
              <h2 id="home-activity-title">Latest saved project updates</h2>
              <p className="home-panel-caption">Heimdall report records; these do not prove a worker is active.</p>
            </div>
            <Link className="home-panel-link" href="/ai-stack">Open AI Stack</Link>
          </div>
          {agentUpdatesQuery.isLoading ? <p className="home-unknown-state" role="status">Loading saved updates…</p>
            : agentUpdatesQuery.isError ? <div className="home-unknown-state" role="alert">Saved updates unavailable. <button className="retry-button" type="button" onClick={() => void agentUpdatesQuery.refetch()}>Retry</button></div>
              : latestUpdates.length === 0 ? <p className="home-unknown-state">Unknown · no saved project updates.</p>
                : <div className="home-agent-list">{latestUpdates.slice(0, 4).map((update) => (
                  <Link key={update.project_slug} href={`/projects/${update.project_slug}`} className="home-agent-item">
                    <span className={`home-agent-status status-${update.status_light}`}>{update.status_light}</span>
                    <span className="home-agent-copy"><strong>{projects.find((project) => project.slug === update.project_slug)?.name ?? update.project_slug}</strong><small>{formatCurrentDisplayName(update.next_action)}</small></span>
                    <time>{formatSourceDate(update.created_at)}</time>
                  </Link>
                ))}</div>}
        </section>

        <div className="section-rule" id="project-list" data-testid="section-project-list"><span>Projects · open a project</span></div>

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
                          title={`Heimdall: ${latestUpdate.status_light}`}
                          aria-label={`Heimdall's status light: ${latestUpdate.status_light}`}
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
                      <strong>Next action:</strong> {latestUpdate ? formatCurrentDisplayName(latestUpdate.next_action) : 'No data yet'}
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

        <details className="report-section home-report-disclosure" data-testid="section-since-report">
          <summary>Since last report · saved comparisons</summary>
          <div className="report-heading">
            <div>
              <p className="eyebrow">Heimdall’s latest comparison</p>
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
        </details>
      </main>
    </div>
  );
}
