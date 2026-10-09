import { createContext, useContext, useEffect, useState, useSyncExternalStore, type CSSProperties, type FormEvent, type ReactNode } from 'react';
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
  useQueryClient,
  type QueryKey,
} from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import {
  getGetFinanceSummaryQueryKey,
  getGetProjectFinanceFleetHistoryQueryKey,
  getGetProjectFinanceFleetLatestQueryKey,
  getGetProjectQueryKey,
  getGetSessionQueryKey,
  getListFinanceDebtsQueryKey,
  getListFinanceExpensesQueryKey,
  getListFinanceRevenueQueryKey,
  getListAgentRunsQueryKey,
  getListDecisionsQueryKey,
  getListLatestAgentUpdatesQueryKey,
  getListProjectGoalsQueryKey,
  getListProjectMetricsQueryKey,
  getListProjectDailySalesQueryKey,
  getListProjectMetricHistoryQueryKey,
  getListProjectOllieHistoryQueryKey,
  getListProjectNotesQueryKey,
  getListMembersQueryKey,
  getListProjectTasksQueryKey,
  getListProjectsQueryKey,
  useCreateProjectGoal,
  useCreateProjectTask,
  useCreateFinanceDebt,
  useCreateFinanceExpense,
  useCreateFinanceRevenue,
  useDeleteFinanceDebt,
  useDeleteFinanceExpense,
  useDeleteFinanceRevenue,
  useGetFinanceSummary,
  useGetProjectFinanceFleetHistory,
  useGetProjectFinanceFleetLatest,
  useGetProject,
  useGetSession,
  useLogin,
  useLogout,
  useListDecisions,
  useListProjectGoals,
  useListMembers,
  useListAgentRuns,
  useListLatestAgentUpdates,
  useListProjectTasks,
  useListProjects,
  useListProjectMetrics,
  useListProjectDailySales,
  useListProjectMetricHistory,
  useListProjectOllieHistory,
  useListProjectNotes,
  useListFinanceDebts,
  useListFinanceExpenses,
  useListFinanceRevenue,
  useRefreshProjectMetrics,
  useRunOllie,
  useUpdateGoal,
  useUpdateFinanceDebt,
  useUpdateFinanceExpense,
  useUpdateFinanceRevenue,
  useUpdateTask,
  useUpdateProject,
  type FinanceDebt,
  type FinanceExpense,
  type FinanceRevenue,
  type FinanceSummaryResponse,
  type FleetHistoryResponse,
  type FleetLatestSnapshotResponse,
  type Goal,
  type GoalInput,
  type GoalUpdate,
  type DecisionWithNames,
  type LatestAgentProjectUpdate,
  type Member,
  type Project,
  type Task,
  type TaskInput,
  type TaskUpdate,
  type ProjectMetric,
  type DailySalesRow,
  type MetricHistoryRow,
  type OllieHistoryRow,
  type ProjectNote,
} from '@workspace/api-client-react';
import {
  GOAL_STATUSES,
  GOAL_STATUS_LABELS,
  EXPENSE_KINDS,
  PROJECT_STATUSES,
  PROJECT_TABS,
  ORG_CHART,
  PRINCIPLES,
  TASK_STATUSES,
  TASK_STATUS_LABELS,
  METRIC_DEFINITIONS,
  PROJECT_HEADLINE_METRIC,
  type GoalStatus,
  type ProjectStatus,
  type TaskStatus,
} from '@workspace/project-constants';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import {
  Link,
  Route,
  Switch,
  useParams,
  useLocation,
  Router as WouterRouter,
} from 'wouter';
import './ddg.css';

let authenticationRequired = false;
const authenticationListeners = new Set<() => void>();

function setAuthenticationRequired(required: boolean): void {
  if (authenticationRequired === required) return;
  authenticationRequired = required;
  authenticationListeners.forEach((listener) => listener());
}

function useAuthenticationRequired(): boolean {
  return useSyncExternalStore(
    (listener) => {
      authenticationListeners.add(listener);
      return () => {
        authenticationListeners.delete(listener);
      };
    },
    () => authenticationRequired,
    () => authenticationRequired,
  );
}

function isUnauthorizedError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const candidate = error as {
    status?: number;
    statusCode?: number;
    response?: { status?: number };
  };
  return candidate.status === 401
    || candidate.statusCode === 401
    || candidate.response?.status === 401;
}

function handleUnauthorizedError(error: unknown): void {
  if (!isUnauthorizedError(error)) return;
  queryClient.clear();
  setAuthenticationRequired(true);
}

const queryClient = new QueryClient({
  queryCache: new QueryCache({ onError: handleUnauthorizedError }),
  mutationCache: new MutationCache({ onError: handleUnauthorizedError }),
  defaultOptions: {
    queries: {
      retry: (failureCount, error) =>
        isUnauthorizedError(error) ? false : failureCount < 3,
    },
  },
});

const DevAuthBypassContext = createContext(false);

type ColorMode = 'dark' | 'day';

const ColorModeContext = createContext<{
  mode: ColorMode;
  toggleMode: () => void;
} | null>(null);

function useColorMode() {
  const colorMode = useContext(ColorModeContext);
  if (!colorMode) throw new Error('Color mode context is missing');
  return colorMode;
}

function ColorModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ColorMode>(() => {
    try {
      return window.localStorage.getItem('ddg-control-color-mode') === 'day'
        ? 'day'
        : 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    if (mode === 'day') {
      document.documentElement.dataset.theme = 'day';
    } else {
      delete document.documentElement.dataset.theme;
    }

    try {
      window.localStorage.setItem('ddg-control-color-mode', mode);
    } catch {
      // The selected mode still applies for this session if storage is unavailable.
    }
  }, [mode]);

  const toggleMode = () => {
    setMode((currentMode) => currentMode === 'dark' ? 'day' : 'dark');
  };

  return (
    <ColorModeContext.Provider value={{ mode, toggleMode }}>
      {children}
    </ColorModeContext.Provider>
  );
}

function Header({ showLogout = true }: { showLogout?: boolean }) {
  const client = useQueryClient();
  const logoutMutation = useLogout();
  const devBypass = useContext(DevAuthBypassContext);
  const { mode, toggleMode } = useColorMode();
  const pendingDecisionsQuery = useListDecisions(
    { status: 'pending' },
    { query: { queryKey: getListDecisionsQueryKey({ status: 'pending' }) } },
  );
  const pendingCount = pendingDecisionsQuery.data?.length ?? 0;

  return (
    <header className="topbar">
      <Link href="/" className="brand" data-testid="link-home-brand">
        <span className="brand-mark" aria-hidden="true">dd</span>
        <span>DDG Control</span>
      </Link>
      <nav className="topbar-actions" aria-label="Main navigation">
        {showLogout && (
          <Link href="/organisation" className="header-link" data-testid="link-organisation">
            Organisation
          </Link>
        )}
        <Link href="/agents" className="header-link" data-testid="link-agents">
          Agents
        </Link>
        <Link href="/decisions" className="header-link" data-testid="link-decisions">
          Decisions{pendingCount > 0 && <span className="header-count">[{pendingCount}]</span>}
        </Link>
        <Link href="/finances" className="header-link" data-testid="link-finances">
          Finances
        </Link>
        <button
          className="theme-toggle"
          type="button"
          onClick={toggleMode}
          aria-label={`Switch to ${mode === 'dark' ? 'day' : 'night'} mode`}
          data-testid="button-theme-toggle"
        >
          {mode === 'dark' ? 'Day mode' : 'Night mode'}
        </button>
        {showLogout && !devBypass && (
          <button
            className="logout-button"
            type="button"
            disabled={logoutMutation.isPending}
            onClick={() => logoutMutation.mutate(undefined, {
              onSuccess: () => {
                client.clear();
                setAuthenticationRequired(true);
              },
            })}
            data-testid="button-logout"
          >
            {logoutMutation.isPending ? 'Logging out…' : 'Log out'}
          </button>
        )}
      </nav>
    </header>
  );
}

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

function formatFinanceCents(value: number): string {
  return formatCurrencyCents(value, 'AUD');
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
}: {
  summary: FinanceSummaryResponse | undefined;
  projects: Project[];
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
          label="Customers · paid in last 30 days"
          value={customerCount}
          detail="Cattle Dog Coffee only"
        />
      </div>
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

function Home() {
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
        />
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
                    ? `${formatFigure(fleet.total_equity_cents, 'usd_cents')} · Fleet value (paper)`
                    : 'No data yet'
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

type ExpenseKind = (typeof EXPENSE_KINDS)[number];

const expenseKindLabels: Record<ExpenseKind, string> = {
  recurring_monthly: 'Monthly recurring',
  one_off: 'One-off',
};

function dollarsToCents(value: string): number {
  if (!/^\d+(\.\d{1,2})?$/.test(value)) {
    throw new Error('Enter an amount like 12.34');
  }
  const [whole, fraction = ''] = value.split('.');
  const cents = BigInt(whole) * 100n + BigInt(fraction.padEnd(2, '0') || '0');
  if (cents > BigInt(Number.MAX_SAFE_INTEGER)) {
    throw new Error('Enter an amount like 12.34');
  }
  return Number(cents);
}

function centsToDollarInput(value: number): string {
  const digits = String(value);
  return digits.length < 3
    ? `0.${digits.padStart(2, '0')}`
    : `${digits.slice(0, -2)}.${digits.slice(-2)}`;
}

function currentBrisbaneDate(): string {
  const parts = new Intl.DateTimeFormat('en-AU', {
    timeZone: 'Australia/Brisbane',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());
  const year = parts.find((part) => part.type === 'year')?.value ?? '';
  const month = parts.find((part) => part.type === 'month')?.value ?? '';
  const day = parts.find((part) => part.type === 'day')?.value ?? '';
  return `${year}-${month}-${day}`;
}

function financeVentureName(slug: string | null, projects: Project[]): string {
  if (!slug) return 'Company';
  return projects.find((project) => project.slug === slug)?.name ?? slug;
}

async function refreshFinanceData(client: QueryClient, listQueryKey: QueryKey): Promise<void> {
  await Promise.all([
    client.invalidateQueries({ queryKey: listQueryKey }),
    client.invalidateQueries({ queryKey: getGetFinanceSummaryQueryKey() }),
  ]);
}

function FinanceProjectSelect({
  projects,
  value,
  onChange,
}: {
  projects: Project[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="task-field">
      Venture
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="company">Company</option>
        {projects.map((project) => (
          <option key={project.id} value={project.slug}>{project.name}</option>
        ))}
      </select>
    </label>
  );
}

function FinancePage() {
  const projectsQuery = useListProjects({
    query: { queryKey: getListProjectsQueryKey() },
  });
  const projects = projectsQuery.data ?? [];

  return (
    <div className="app-shell">
      <Header />
      <main className="page-wrap finances-main" data-testid="page-finances">
        <p className="eyebrow">Company-wide</p>
        <h1 className="home-title">Finances</h1>
        {projectsQuery.isLoading && (
          <p className="finance-page-state" role="status">Loading ventures…</p>
        )}
        {projectsQuery.isError && (
          <p className="finance-page-error" role="alert">
            {serverErrorText(projectsQuery.error, 'Unable to load ventures.')}
          </p>
        )}
        <div className="finance-sections">
          <FinanceDebtsSection projects={projects} />
          <FinanceExpensesSection projects={projects} />
          <FinanceRevenueSection projects={projects} />
        </div>
      </main>
    </div>
  );
}

function FinanceDebtsSection({ projects }: { projects: Project[] }) {
  const client = useQueryClient();
  const debtsQuery = useListFinanceDebts();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [draft, setDraft] = useState({
    name: '',
    balance: '',
    projectSlug: 'company',
    note: '',
  });
  const createMutation = useCreateFinanceDebt({
    mutation: {
      onSuccess: () => refreshFinanceData(client, getListFinanceDebtsQueryKey()),
    },
  });
  const updateMutation = useUpdateFinanceDebt({
    mutation: {
      onSuccess: () => refreshFinanceData(client, getListFinanceDebtsQueryKey()),
    },
  });
  const deleteMutation = useDeleteFinanceDebt({
    mutation: {
      onSuccess: () => refreshFinanceData(client, getListFinanceDebtsQueryKey()),
    },
  });
  const isSaving = createMutation.isPending || updateMutation.isPending;

  const openAdd = () => {
    setEditingId(null);
    setDraft({ name: '', balance: '', projectSlug: 'company', note: '' });
    setError('');
    setIsEditorOpen(true);
  };
  const openEdit = (entry: FinanceDebt) => {
    setEditingId(entry.id);
    setDraft({
      name: entry.name,
      balance: centsToDollarInput(entry.balance_cents),
      projectSlug: entry.project_slug ?? 'company',
      note: entry.note ?? '',
    });
    setError('');
    setIsEditorOpen(true);
  };
  const closeEditor = () => {
    setIsEditorOpen(false);
    setEditingId(null);
    setError('');
  };
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    let balanceCents: number;
    try {
      balanceCents = dollarsToCents(draft.balance);
    } catch {
      setError('Enter an amount like 12.34');
      return;
    }
    const data = {
      name: draft.name.trim(),
      balance_cents: balanceCents,
      project_slug: draft.projectSlug === 'company' ? null : draft.projectSlug,
      note: draft.note.trim() || null,
    };
    try {
      if (editingId === null) {
        await createMutation.mutateAsync({ data });
      } else {
        await updateMutation.mutateAsync({ id: editingId, data });
      }
      closeEditor();
    } catch (saveError) {
      setError(serverErrorText(saveError, 'Unable to save debt.'));
    }
  };
  const remove = async (entry: FinanceDebt) => {
    if (!window.confirm(`Delete "${entry.name}"? This cannot be undone.`)) return;
    setError('');
    try {
      await deleteMutation.mutateAsync({ id: entry.id });
    } catch (deleteError) {
      setError(serverErrorText(deleteError, 'Unable to delete debt.'));
    }
  };

  return (
    <section className="finance-section" aria-labelledby="finance-debts-title" data-testid="section-finance-debts">
      <div className="finance-section-heading">
        <h2 id="finance-debts-title">Debts</h2>
        <button className="task-primary-button" type="button" onClick={openAdd} data-testid="button-add-debt">
          Add debt
        </button>
      </div>
      {error && !isEditorOpen && <p className="finance-form-error" role="alert">{error}</p>}
      {debtsQuery.isLoading ? (
        <p className="task-state-message" role="status">Loading debts…</p>
      ) : debtsQuery.isError ? (
        <p className="finance-form-error" role="alert">{serverErrorText(debtsQuery.error, 'Unable to load debts.')}</p>
      ) : debtsQuery.data?.length ? (
        <div className="finance-entry-list">
          {debtsQuery.data.map((entry) => (
            <article className="finance-entry" key={entry.id} data-testid={`finance-debt-${entry.id}`}>
              <div className="finance-entry-content">
                <div>
                  <h3 className="finance-entry-name">{entry.name}</h3>
                  <p className="finance-entry-meta">{financeVentureName(entry.project_slug, projects)}</p>
                </div>
                <p className="finance-entry-amount">{formatFigure(entry.balance_cents, 'aud_cents')}</p>
              </div>
              <div className="finance-entry-actions">
                <button className="task-secondary-button" type="button" onClick={() => openEdit(entry)}>Edit</button>
                <button className="task-secondary-button finance-delete-button" type="button" onClick={() => void remove(entry)} disabled={deleteMutation.isPending}>Delete</button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="task-state-message">Nothing added yet</p>
      )}
      {isEditorOpen && (
        <form className="finance-entry-form task-editor-form" onSubmit={submit} data-testid="form-finance-debt">
          <label className="task-field">
            Name
            <input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} required maxLength={100} />
          </label>
          <label className="task-field">
            Balance (dollars)
            <input type="text" inputMode="decimal" value={draft.balance} onChange={(event) => setDraft({ ...draft, balance: event.target.value })} required data-testid="input-finance-debt-balance" />
          </label>
          <FinanceProjectSelect projects={projects} value={draft.projectSlug} onChange={(projectSlug) => setDraft({ ...draft, projectSlug })} />
          <label className="task-field">
            Note <span className="task-field-optional">(optional)</span>
            <textarea rows={2} maxLength={300} value={draft.note} onChange={(event) => setDraft({ ...draft, note: event.target.value })} />
          </label>
          {error && <p className="finance-form-error" role="alert">{error}</p>}
          <div className="task-form-actions">
            <button className="task-primary-button" type="submit" disabled={isSaving}>
              {isSaving ? 'Saving…' : editingId === null ? 'Add debt' : 'Save changes'}
            </button>
            <button className="task-secondary-button" type="button" onClick={closeEditor} disabled={isSaving}>Cancel</button>
          </div>
        </form>
      )}
    </section>
  );
}

function FinanceExpensesSection({ projects }: { projects: Project[] }) {
  const client = useQueryClient();
  const expensesQuery = useListFinanceExpenses();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [draft, setDraft] = useState({
    name: '',
    kind: 'one_off' as ExpenseKind,
    amount: '',
    projectSlug: 'company',
    spentOn: currentBrisbaneDate(),
    active: true,
    note: '',
  });
  const createMutation = useCreateFinanceExpense({
    mutation: {
      onSuccess: () => refreshFinanceData(client, getListFinanceExpensesQueryKey()),
    },
  });
  const updateMutation = useUpdateFinanceExpense({
    mutation: {
      onSuccess: () => refreshFinanceData(client, getListFinanceExpensesQueryKey()),
    },
  });
  const deleteMutation = useDeleteFinanceExpense({
    mutation: {
      onSuccess: () => refreshFinanceData(client, getListFinanceExpensesQueryKey()),
    },
  });
  const isSaving = createMutation.isPending || updateMutation.isPending;
  const emptyDraft = () => ({
    name: '',
    kind: 'one_off' as ExpenseKind,
    amount: '',
    projectSlug: 'company',
    spentOn: currentBrisbaneDate(),
    active: true,
    note: '',
  });
  const openAdd = () => {
    setEditingId(null);
    setDraft(emptyDraft());
    setError('');
    setIsEditorOpen(true);
  };
  const openEdit = (entry: FinanceExpense) => {
    setEditingId(entry.id);
    setDraft({
      name: entry.name,
      kind: entry.kind as ExpenseKind,
      amount: centsToDollarInput(entry.amount_cents),
      projectSlug: entry.project_slug ?? 'company',
      spentOn: entry.spent_on ?? '',
      active: entry.active,
      note: entry.note ?? '',
    });
    setError('');
    setIsEditorOpen(true);
  };
  const closeEditor = () => {
    setIsEditorOpen(false);
    setEditingId(null);
    setError('');
  };
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    let amountCents: number;
    try {
      amountCents = dollarsToCents(draft.amount);
    } catch {
      setError('Enter an amount like 12.34');
      return;
    }
    const data = {
      name: draft.name.trim(),
      kind: draft.kind,
      amount_cents: amountCents,
      project_slug: draft.projectSlug === 'company' ? null : draft.projectSlug,
      spent_on: draft.kind === 'one_off' ? draft.spentOn : null,
      active: draft.active,
      note: draft.note.trim() || null,
    };
    try {
      if (editingId === null) {
        await createMutation.mutateAsync({ data });
      } else {
        await updateMutation.mutateAsync({ id: editingId, data });
      }
      closeEditor();
    } catch (saveError) {
      setError(serverErrorText(saveError, 'Unable to save expense.'));
    }
  };
  const remove = async (entry: FinanceExpense) => {
    if (!window.confirm(`Delete "${entry.name}"? This cannot be undone.`)) return;
    setError('');
    try {
      await deleteMutation.mutateAsync({ id: entry.id });
    } catch (deleteError) {
      setError(serverErrorText(deleteError, 'Unable to delete expense.'));
    }
  };
  const setActive = async (entry: FinanceExpense, active: boolean) => {
    setError('');
    try {
      await updateMutation.mutateAsync({ id: entry.id, data: { active } });
    } catch (updateError) {
      setError(serverErrorText(updateError, 'Unable to update expense.'));
    }
  };

  return (
    <section className="finance-section" aria-labelledby="finance-expenses-title" data-testid="section-finance-expenses">
      <div className="finance-section-heading">
        <h2 id="finance-expenses-title">Expenses</h2>
        <button className="task-primary-button" type="button" onClick={openAdd} data-testid="button-add-expense">
          Add expense
        </button>
      </div>
      {error && !isEditorOpen && <p className="finance-form-error" role="alert">{error}</p>}
      {expensesQuery.isLoading ? (
        <p className="task-state-message" role="status">Loading expenses…</p>
      ) : expensesQuery.isError ? (
        <p className="finance-form-error" role="alert">{serverErrorText(expensesQuery.error, 'Unable to load expenses.')}</p>
      ) : expensesQuery.data?.length ? (
        <div className="finance-entry-list">
          {expensesQuery.data.map((entry) => (
            <article className="finance-entry" key={entry.id} data-testid={`finance-expense-${entry.id}`}>
              <div className="finance-entry-content">
                <div>
                  <h3 className="finance-entry-name">{entry.name}</h3>
                  <p className="finance-entry-meta">
                    {financeVentureName(entry.project_slug, projects)} · {expenseKindLabels[entry.kind as ExpenseKind] ?? entry.kind}
                    {entry.kind === 'one_off' && entry.spent_on ? ` · ${formatDueDate(entry.spent_on)}` : ''}
                  </p>
                </div>
                <p className="finance-entry-amount">{formatFigure(entry.amount_cents, 'aud_cents')}</p>
              </div>
              <div className="finance-entry-actions">
                {entry.kind === 'recurring_monthly' && (
                  <label className="finance-active-toggle">
                    <input
                      type="checkbox"
                      checked={entry.active}
                      disabled={updateMutation.isPending || editingId === entry.id}
                      onChange={(event) => void setActive(entry, event.target.checked)}
                      aria-label={`${entry.active ? 'Deactivate' : 'Activate'} ${entry.name}`}
                    />
                    <span>Active</span>
                  </label>
                )}
                <button className="task-secondary-button" type="button" onClick={() => openEdit(entry)}>Edit</button>
                <button className="task-secondary-button finance-delete-button" type="button" onClick={() => void remove(entry)} disabled={deleteMutation.isPending}>Delete</button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="task-state-message">Nothing added yet</p>
      )}
      {isEditorOpen && (
        <form className="finance-entry-form task-editor-form" onSubmit={submit} data-testid="form-finance-expense">
          <label className="task-field">
            Name
            <input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} required maxLength={100} data-testid="input-finance-expense-name" />
          </label>
          <label className="task-field">
            Kind
            <select value={draft.kind} onChange={(event) => setDraft({ ...draft, kind: event.target.value as ExpenseKind })} data-testid="select-finance-expense-kind">
              {EXPENSE_KINDS.map((kind) => <option key={kind} value={kind}>{expenseKindLabels[kind]}</option>)}
            </select>
          </label>
          <label className="task-field">
            Amount (dollars)
            <input type="text" inputMode="decimal" value={draft.amount} onChange={(event) => setDraft({ ...draft, amount: event.target.value })} required data-testid="input-finance-expense-amount" />
          </label>
          <FinanceProjectSelect projects={projects} value={draft.projectSlug} onChange={(projectSlug) => setDraft({ ...draft, projectSlug })} />
          {draft.kind === 'one_off' && (
            <label className="task-field">
              Date spent
              <input type="date" value={draft.spentOn} onChange={(event) => setDraft({ ...draft, spentOn: event.target.value })} required data-testid="input-finance-expense-date" />
            </label>
          )}
          {draft.kind === 'recurring_monthly' && (
            <label className="finance-active-toggle finance-form-active">
              <input type="checkbox" checked={draft.active} onChange={(event) => setDraft({ ...draft, active: event.target.checked })} />
              <span>Active</span>
            </label>
          )}
          <label className="task-field">
            Note <span className="task-field-optional">(optional)</span>
            <textarea rows={2} maxLength={300} value={draft.note} onChange={(event) => setDraft({ ...draft, note: event.target.value })} />
          </label>
          {error && <p className="finance-form-error" role="alert" data-testid="error-finance-expense">{error}</p>}
          <div className="task-form-actions">
            <button className="task-primary-button" type="submit" disabled={isSaving} data-testid="button-submit-finance-expense">
              {isSaving ? 'Saving…' : editingId === null ? 'Add expense' : 'Save changes'}
            </button>
            <button className="task-secondary-button" type="button" onClick={closeEditor} disabled={isSaving}>Cancel</button>
          </div>
        </form>
      )}
    </section>
  );
}

function FinanceRevenueSection({ projects }: { projects: Project[] }) {
  const client = useQueryClient();
  const revenueQuery = useListFinanceRevenue();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [draft, setDraft] = useState({
    name: '',
    amount: '',
    projectSlug: 'company',
    receivedOn: currentBrisbaneDate(),
  });
  const createMutation = useCreateFinanceRevenue({
    mutation: {
      onSuccess: () => refreshFinanceData(client, getListFinanceRevenueQueryKey()),
    },
  });
  const updateMutation = useUpdateFinanceRevenue({
    mutation: {
      onSuccess: () => refreshFinanceData(client, getListFinanceRevenueQueryKey()),
    },
  });
  const deleteMutation = useDeleteFinanceRevenue({
    mutation: {
      onSuccess: () => refreshFinanceData(client, getListFinanceRevenueQueryKey()),
    },
  });
  const isSaving = createMutation.isPending || updateMutation.isPending;
  const emptyDraft = () => ({
    name: '',
    amount: '',
    projectSlug: 'company',
    receivedOn: currentBrisbaneDate(),
  });
  const openAdd = () => {
    setEditingId(null);
    setDraft(emptyDraft());
    setError('');
    setIsEditorOpen(true);
  };
  const openEdit = (entry: FinanceRevenue) => {
    setEditingId(entry.id);
    setDraft({
      name: entry.name,
      amount: centsToDollarInput(entry.amount_cents),
      projectSlug: entry.project_slug ?? 'company',
      receivedOn: entry.received_on,
    });
    setError('');
    setIsEditorOpen(true);
  };
  const closeEditor = () => {
    setIsEditorOpen(false);
    setEditingId(null);
    setError('');
  };
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    let amountCents: number;
    try {
      amountCents = dollarsToCents(draft.amount);
    } catch {
      setError('Enter an amount like 12.34');
      return;
    }
    const data = {
      name: draft.name.trim(),
      amount_cents: amountCents,
      project_slug: draft.projectSlug === 'company' ? null : draft.projectSlug,
      received_on: draft.receivedOn,
    };
    try {
      if (editingId === null) {
        await createMutation.mutateAsync({ data });
      } else {
        await updateMutation.mutateAsync({ id: editingId, data });
      }
      closeEditor();
    } catch (saveError) {
      setError(serverErrorText(saveError, 'Unable to save revenue.'));
    }
  };
  const remove = async (entry: FinanceRevenue) => {
    if (!window.confirm(`Delete "${entry.name}"? This cannot be undone.`)) return;
    setError('');
    try {
      await deleteMutation.mutateAsync({ id: entry.id });
    } catch (deleteError) {
      setError(serverErrorText(deleteError, 'Unable to delete revenue.'));
    }
  };

  return (
    <section className="finance-section" aria-labelledby="finance-revenue-title" data-testid="section-finance-revenue">
      <div className="finance-section-heading">
        <h2 id="finance-revenue-title">Revenue</h2>
        <button className="task-primary-button" type="button" onClick={openAdd} data-testid="button-add-revenue">
          Add revenue
        </button>
      </div>
      {error && !isEditorOpen && <p className="finance-form-error" role="alert">{error}</p>}
      {revenueQuery.isLoading ? (
        <p className="task-state-message" role="status">Loading revenue…</p>
      ) : revenueQuery.isError ? (
        <p className="finance-form-error" role="alert">{serverErrorText(revenueQuery.error, 'Unable to load revenue.')}</p>
      ) : revenueQuery.data?.length ? (
        <div className="finance-entry-list">
          {revenueQuery.data.map((entry) => (
            <article className="finance-entry" key={entry.id} data-testid={`finance-revenue-${entry.id}`}>
              <div className="finance-entry-content">
                <div>
                  <h3 className="finance-entry-name">{entry.name}</h3>
                  <p className="finance-entry-meta">
                    {financeVentureName(entry.project_slug, projects)} · Received {formatDueDate(entry.received_on)}
                  </p>
                </div>
                <p className="finance-entry-amount">{formatFigure(entry.amount_cents, 'aud_cents')}</p>
              </div>
              <div className="finance-entry-actions">
                <button className="task-secondary-button" type="button" onClick={() => openEdit(entry)}>Edit</button>
                <button className="task-secondary-button finance-delete-button" type="button" onClick={() => void remove(entry)} disabled={deleteMutation.isPending}>Delete</button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="task-state-message">Nothing added yet</p>
      )}
      {isEditorOpen && (
        <form className="finance-entry-form task-editor-form" onSubmit={submit} data-testid="form-finance-revenue">
          <label className="task-field">
            Name
            <input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} required maxLength={100} />
          </label>
          <label className="task-field">
            Amount (dollars)
            <input type="text" inputMode="decimal" value={draft.amount} onChange={(event) => setDraft({ ...draft, amount: event.target.value })} required />
          </label>
          <FinanceProjectSelect projects={projects} value={draft.projectSlug} onChange={(projectSlug) => setDraft({ ...draft, projectSlug })} />
          <label className="task-field">
            Date received
            <input type="date" value={draft.receivedOn} onChange={(event) => setDraft({ ...draft, receivedOn: event.target.value })} required />
          </label>
          {error && <p className="finance-form-error" role="alert">{error}</p>}
          <div className="task-form-actions">
            <button className="task-primary-button" type="submit" disabled={isSaving}>
              {isSaving ? 'Saving…' : editingId === null ? 'Add revenue' : 'Save changes'}
            </button>
            <button className="task-secondary-button" type="button" onClick={closeEditor} disabled={isSaving}>Cancel</button>
          </div>
        </form>
      )}
    </section>
  );
}

function OrganisationPage() {
  type OrgPerson = (typeof ORG_CHART)[number];
  type VenturePerson = Extract<OrgPerson, { group: 'venture' }>;
  const founder = ORG_CHART.filter((person) => person.group === 'founder');
  const generalManagers = ORG_CHART.filter((person) => person.group === 'gm');
  const corporateTeam = ORG_CHART.filter((person) => person.group === 'corporate');
  const ventureManagers = ORG_CHART.filter(
    (person): person is VenturePerson => person.group === 'venture',
  );

  const renderPeople = (people: OrgPerson[]) => people.map((person) => (
    <article className="org-person" key={`${person.group}-${person.name}`}>
      <span className="org-person-name">{person.name}</span>
      <span className="org-person-role">{person.role}</span>
    </article>
  ));

  return (
    <div className="app-shell organisation-shell">
      <Header />
      <main className="page-wrap organisation-main">
        <Link className="back-link" href="/" data-testid="link-organisation-home">← Projects</Link>
        <header className="organisation-heading">
          <p className="eyebrow">People & accountability</p>
          <h1 className="home-title">Organisation</h1>
          <p className="organisation-intro">The team recommending and delivering approved work across DDG.</p>
        </header>

        <section className="org-chart" aria-labelledby="org-chart-title">
          <div className="section-rule"><span id="org-chart-title">Operating structure</span></div>
          <div className="org-tier org-tier-founder">
            <h2>Founder</h2>
            <div className="org-people">{renderPeople(founder)}</div>
          </div>
          <div className="org-connector" aria-hidden="true" />
          <div className="org-tier org-tier-gm">
            <h2>GM</h2>
            <div className="org-people">{renderPeople(generalManagers)}</div>
          </div>
          <div className="org-connector" aria-hidden="true" />
          <div className="org-branches">
            <section className="org-branch" aria-labelledby="corporate-title">
              <div className="org-tier">
                <h2 id="corporate-title">Corporate team</h2>
                <div className="org-people">{renderPeople(corporateTeam)}</div>
              </div>
            </section>
            <section className="org-branch" aria-labelledby="ventures-title">
              <div className="org-tier">
                <h2 id="ventures-title">Venture managers</h2>
                <div className="org-people">
                  {ventureManagers.map((person) => (
                    <Link
                      href={`/projects/${person.project_slug}`}
                      className="org-person org-person-link"
                      key={`${person.group}-${person.name}`}
                      data-testid={`link-org-project-${person.project_slug}`}
                    >
                      <span className="org-person-name">{person.name}</span>
                      <span className="org-person-role">{person.role}</span>
                      <span className="org-project-arrow" aria-hidden="true">↗</span>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </section>

        <section className="principles-section" aria-labelledby="principles-title">
          <div className="section-rule"><span id="principles-title">Principles</span></div>
          <ol className="principles-list">
            {PRINCIPLES.map((principle, index) => (
              <li key={principle}>
                <span className="principle-index">{String(index + 1).padStart(2, '0')}</span>
                <span>{principle}</span>
              </li>
            ))}
          </ol>
          <p className="organisation-note">Agents recommend. Markus decides.</p>
        </section>
      </main>
    </div>
  );
}

function isNotFound(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const candidate = error as {
    status?: number;
    statusCode?: number;
    response?: { status?: number };
    data?: { error?: string };
    error?: string;
  };
  return candidate.status === 404
    || candidate.statusCode === 404
    || candidate.response?.status === 404
    || candidate.data?.error === 'not found'
    || candidate.error === 'not found';
}

function serverErrorText(error: unknown, fallback = 'Unable to save project.'): string {
  if (error && typeof error === 'object' && 'data' in error) {
    const data = (error as { data?: unknown }).data;
    if (
      data &&
      typeof data === 'object' &&
      'error' in data &&
      typeof data.error === 'string'
    ) {
      return data.error;
    }
  }
  return error instanceof Error ? error.message : fallback;
}

function LoginScreen({ initialError }: { initialError?: string }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(initialError ?? '');
  const loginMutation = useLogin();

  const submitLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const submittedPassword = password;
    setPassword('');
    setError('');

    try {
      await loginMutation.mutateAsync({ data: { password: submittedPassword } });
      setAuthenticationRequired(false);
      await queryClient.invalidateQueries({
        queryKey: getGetSessionQueryKey(),
        exact: true,
      });
    } catch (loginError) {
      setError(serverErrorText(loginError, 'Unable to log in.'));
    }
  };

  return (
    <div className="app-shell auth-shell">
      <Header showLogout={false} />
      <main className="auth-main">
        <section className="auth-card">
          <p className="eyebrow">Control panel</p>
          <h1 className="auth-title">Log in</h1>
          <form className="auth-form" onSubmit={submitLogin} data-testid="login-form">
            <label className="auth-field" htmlFor="login-password">
              Password
              <input
                id="login-password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                data-testid="input-login-password"
              />
            </label>
            {error && <p className="auth-error" role="alert" data-testid="error-login">{error}</p>}
            <button
              className="task-primary-button auth-submit"
              type="submit"
              disabled={loginMutation.isPending}
              data-testid="button-login"
            >
              {loginMutation.isPending ? 'Logging in…' : 'Log in'}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

type TaskDraft = {
  title: string;
  ownerId: string;
  dueDate: string;
  notes: string;
  status: TaskStatus;
};

function emptyTaskDraft(): TaskDraft {
  return {
    title: '',
    ownerId: '',
    dueDate: '',
    notes: '',
    status: TASK_STATUSES[0],
  };
}

function taskDraftFromTask(task: Task): TaskDraft {
  return {
    title: task.title,
    ownerId: String(task.owner_id),
    dueDate: task.due_date ?? '',
    notes: task.notes ?? '',
    status: task.status as TaskStatus,
  };
}

function formatDueDate(value: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return value;

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = Number(match[2]);
  if (month < 1 || month > 12) return value;
  return `${Number(match[3])} ${months[month - 1]} ${match[1]}`;
}

const completedDateFormatter = new Intl.DateTimeFormat('en-AU', {
  timeZone: 'Australia/Brisbane',
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});
const brisbaneDateTimeFormatter = new Intl.DateTimeFormat('en-AU', {
  timeZone: 'Australia/Brisbane',
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
});

function formatCompletedDate(value: string | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : completedDateFormatter.format(date);
}

function formatBrisbaneDateTime(value: string | null): string {
  if (!value) return 'Date unavailable';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? 'Date unavailable'
    : brisbaneDateTimeFormatter.format(date);
}

function formatCurrencyCents(value: number, currency: 'AUD' | 'USD'): string {
  const absoluteValue = Math.abs(value) / 100;
  const formatted = currency === 'AUD'
    ? new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(absoluteValue)
    : `US$${new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(absoluteValue)}`;
  return value < 0 ? `−${formatted}` : formatted;
}

function formatFigure(value: number, unit: string): string {
  if (unit === 'aud_cents') return formatCurrencyCents(value, 'AUD');
  if (unit === 'usd_cents') return formatCurrencyCents(value, 'USD');
  return new Intl.NumberFormat('en-AU', { maximumFractionDigits: 0 }).format(value);
}

function TaskEditorForm({
  mode,
  draft,
  members,
  isPending,
  error,
  onChange,
  onSubmit,
  onCancel,
}: {
  mode: 'create' | 'edit';
  draft: TaskDraft;
  members: Member[];
  isPending: boolean;
  error: unknown;
  onChange: (field: keyof TaskDraft, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}) {
  const isCreate = mode === 'create';

  return (
    <form
      className="task-editor-form"
      onSubmit={onSubmit}
      data-testid={isCreate ? 'form-create-task' : 'form-edit-task'}
    >
      <label className="task-field">
        <span>Title</span>
        <input
          type="text"
          required
          maxLength={200}
          value={draft.title}
          onChange={(event) => onChange('title', event.target.value)}
          data-testid="input-task-title"
        />
      </label>
      <label className="task-field">
        <span>Owner</span>
        <select
          required
          value={draft.ownerId}
          onChange={(event) => onChange('ownerId', event.target.value)}
          data-testid="select-task-owner"
        >
          <option value="">Select a member</option>
          {members.map((member) => (
            <option key={member.id} value={member.id}>{member.name}</option>
          ))}
        </select>
      </label>
      <label className="task-field">
        <span>Due date <span className="task-field-optional">(optional)</span></span>
        <input
          type="date"
          value={draft.dueDate}
          onChange={(event) => onChange('dueDate', event.target.value)}
          data-testid="input-task-due-date"
        />
      </label>
      {mode === 'edit' && (
        <label className="task-field">
          <span>Status</span>
          <select
            value={draft.status}
            onChange={(event) => onChange('status', event.target.value)}
            data-testid="select-task-status"
          >
            {TASK_STATUSES.map((status) => (
              <option key={status} value={status}>{TASK_STATUS_LABELS[status]}</option>
            ))}
          </select>
        </label>
      )}
      <label className="task-field task-field-wide">
        <span>Notes <span className="task-field-optional">(optional)</span></span>
        <textarea
          rows={3}
          maxLength={2000}
          value={draft.notes}
          onChange={(event) => onChange('notes', event.target.value)}
          data-testid="input-task-notes"
        />
      </label>
      {error != null && (
        <p className="task-form-error" role="alert" data-testid="error-save-task">
          {serverErrorText(error, isCreate ? 'Unable to create task.' : 'Unable to update task.')}
        </p>
      )}
      <div className="task-form-actions">
        <button
          className="task-primary-button"
          type="submit"
          disabled={isPending || members.length === 0}
          data-testid={isCreate ? 'button-submit-create-task' : 'button-submit-edit-task'}
        >
          {isPending ? 'Saving…' : isCreate ? 'Add task' : 'Save changes'}
        </button>
        <button
          className="task-secondary-button"
          type="button"
          disabled={isPending}
          onClick={onCancel}
          data-testid="button-cancel-task"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function ProjectTodo({ slug }: { slug: string }) {
  const tasksQuery = useListProjectTasks(slug, {
    query: { queryKey: getListProjectTasksQueryKey(slug) },
  });
  const membersQuery = useListMembers({
    query: { queryKey: getListMembersQueryKey() },
  });
  const createTaskMutation = useCreateProjectTask({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: getListProjectTasksQueryKey(slug),
        });
      },
    },
  });
  const updateTaskMutation = useUpdateTask({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: getListProjectTasksQueryKey(slug),
        });
      },
    },
  });
  const [isAdding, setIsAdding] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [draft, setDraft] = useState<TaskDraft>(emptyTaskDraft);
  const tasks = tasksQuery.data ?? [];
  const members = membersQuery.data ?? [];
  const memberNames = new Map(members.map((member) => [member.id, member.name] as const));
  const groupedTasks = TASK_STATUSES
    .map((status) => ({
      status,
      tasks: tasks.filter((task) => task.status === status),
    }))
    .filter((group) => group.tasks.length > 0);
  const canShowTaskList = !tasksQuery.isLoading
    && !membersQuery.isLoading
    && !tasksQuery.isError
    && !membersQuery.isError;

  const updateDraft = (field: keyof TaskDraft, value: string) => {
    setDraft((current) => ({ ...current, [field]: value } as TaskDraft));
  };

  const openCreateForm = () => {
    createTaskMutation.reset();
    updateTaskMutation.reset();
    setEditingTask(null);
    setDraft(emptyTaskDraft());
    setIsAdding(true);
  };

  const openEditForm = (task: Task) => {
    createTaskMutation.reset();
    updateTaskMutation.reset();
    setIsAdding(false);
    setEditingTask(task);
    setDraft(taskDraftFromTask(task));
  };

  const cancelCreate = () => {
    createTaskMutation.reset();
    setIsAdding(false);
    setDraft(emptyTaskDraft());
  };

  const cancelEdit = () => {
    updateTaskMutation.reset();
    setEditingTask(null);
    setDraft(emptyTaskDraft());
  };

  const saveNewTask = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createTaskMutation.reset();
    const ownerId = Number(draft.ownerId);
    if (!Number.isSafeInteger(ownerId) || ownerId < 1) return;

    const data: TaskInput = {
      title: draft.title.trim(),
      owner_id: ownerId,
      notes: draft.notes.trim() || null,
      due_date: draft.dueDate || null,
    };

    try {
      await createTaskMutation.mutateAsync({ slug, data });
      setIsAdding(false);
      setDraft(emptyTaskDraft());
    } catch {
      // Keep the form open and show the server error.
    }
  };

  const saveTaskChanges = async (task: Task, event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateTaskMutation.reset();

    const changes: TaskUpdate = {};
    const title = draft.title.trim();
    const notes = draft.notes.trim() || null;
    const ownerId = Number(draft.ownerId);
    const dueDate = draft.dueDate || null;
    if (title !== task.title) changes.title = title;
    if (notes !== (task.notes ?? null)) changes.notes = notes;
    if (draft.status !== task.status) changes.status = draft.status;
    if (ownerId !== task.owner_id) changes.owner_id = ownerId;
    if (dueDate !== (task.due_date ?? null)) changes.due_date = dueDate;

    if (Object.keys(changes).length === 0) {
      setEditingTask(null);
      setDraft(emptyTaskDraft());
      return;
    }

    try {
      await updateTaskMutation.mutateAsync({ id: task.id, data: changes });
      setEditingTask(null);
      setDraft(emptyTaskDraft());
    } catch {
      // Keep the form open and show the server error.
    }
  };

  return (
    <section className="todo-workspace" data-testid="section-project-tasks">
      <div className="todo-toolbar">
        <button
          className="task-primary-button"
          type="button"
          onClick={openCreateForm}
          disabled={membersQuery.isLoading || membersQuery.isError || members.length === 0}
          data-testid="button-add-task"
        >
          Add task
        </button>
      </div>

      {isAdding && (
        <TaskEditorForm
          mode="create"
          draft={draft}
          members={members}
          isPending={createTaskMutation.isPending}
          error={createTaskMutation.error}
          onChange={updateDraft}
          onSubmit={saveNewTask}
          onCancel={cancelCreate}
        />
      )}

      {tasksQuery.isLoading || membersQuery.isLoading ? (
        <p className="task-state-message" role="status">Loading tasks…</p>
      ) : null}
      {tasksQuery.isError && (
        <div className="task-query-error" role="alert">
          <p>{serverErrorText(tasksQuery.error, 'Unable to load tasks.')}</p>
          <button className="task-secondary-button" type="button" onClick={() => void tasksQuery.refetch()}>
            Retry
          </button>
        </div>
      )}
      {membersQuery.isError && (
        <div className="task-query-error" role="alert">
          <p>{serverErrorText(membersQuery.error, 'Unable to load members.')}</p>
          <button className="task-secondary-button" type="button" onClick={() => void membersQuery.refetch()}>
            Retry
          </button>
        </div>
      )}

      {!tasksQuery.isLoading && !tasksQuery.isError && tasks.length === 0 && (
        <p className="task-state-message" data-testid="status-no-tasks">No tasks yet</p>
      )}
      {canShowTaskList && groupedTasks.map((group) => (
        <section className="todo-group" key={group.status} data-testid={`group-tasks-${group.status}`}>
          <h2 className="todo-group-title">{TASK_STATUS_LABELS[group.status]}</h2>
          <div className="todo-task-list">
            {group.tasks.map((task) => {
              const completedDate = task.status === 'done'
                ? formatCompletedDate(task.completed_at)
                : null;

              return (
                <article className="todo-task-card" key={task.id} data-testid={`task-${task.id}`}>
                  {editingTask?.id === task.id ? (
                    <TaskEditorForm
                      mode="edit"
                      draft={draft}
                      members={members}
                      isPending={updateTaskMutation.isPending}
                      error={updateTaskMutation.error}
                      onChange={updateDraft}
                      onSubmit={(event) => void saveTaskChanges(task, event)}
                      onCancel={cancelEdit}
                    />
                  ) : (
                    <button
                      className="todo-task-trigger"
                      type="button"
                      onClick={() => openEditForm(task)}
                      data-testid={`button-edit-task-${task.id}`}
                    >
                      <span className="todo-task-title">{task.title}</span>
                      <span className="todo-task-meta">
                        <span>{memberNames.get(task.owner_id) ?? 'Unknown owner'}</span>
                        {task.due_date && (
                          <span>Due {formatDueDate(task.due_date)}</span>
                        )}
                      </span>
                      {task.status === 'done' && (
                        <span className="todo-task-completed">
                          Completed{completedDate ? ` · ${completedDate}` : ''}
                        </span>
                      )}
                    </button>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      ))}
    </section>
  );
}

type GoalDraft = {
  title: string;
  targetDate: string;
  notes: string;
  status: GoalStatus;
};

function emptyGoalDraft(): GoalDraft {
  return {
    title: '',
    targetDate: '',
    notes: '',
    status: GOAL_STATUSES[0],
  };
}

function goalDraftFromGoal(goal: Goal): GoalDraft {
  return {
    title: goal.title,
    targetDate: goal.target_date ?? '',
    notes: goal.notes ?? '',
    status: goal.status as GoalStatus,
  };
}

function GoalEditorForm({
  mode,
  draft,
  isPending,
  error,
  onChange,
  onSubmit,
  onCancel,
}: {
  mode: 'create' | 'edit';
  draft: GoalDraft;
  isPending: boolean;
  error: unknown;
  onChange: (field: keyof GoalDraft, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}) {
  return (
    <form className="task-editor-form goal-editor-form" onSubmit={onSubmit}>
      <label className="task-field task-field-wide">
        Title
        <input
          required
          maxLength={200}
          value={draft.title}
          onChange={(event) => onChange('title', event.target.value)}
          data-testid="input-goal-title"
        />
      </label>
      {mode === 'edit' && (
        <label className="task-field">
          Status
          <select
            value={draft.status}
            onChange={(event) => onChange('status', event.target.value)}
            data-testid="select-goal-status"
          >
            {GOAL_STATUSES.map((status) => (
              <option key={status} value={status}>{GOAL_STATUS_LABELS[status]}</option>
            ))}
          </select>
        </label>
      )}
      <label className="task-field">
        Target date <span className="task-field-optional">(optional)</span>
        <input
          type="date"
          value={draft.targetDate}
          onChange={(event) => onChange('targetDate', event.target.value)}
          data-testid="input-goal-target-date"
        />
      </label>
      <label className="task-field task-field-wide">
        Notes <span className="task-field-optional">(optional)</span>
        <textarea
          maxLength={2000}
          value={draft.notes}
          onChange={(event) => onChange('notes', event.target.value)}
          data-testid="input-goal-notes"
        />
      </label>
      {error != null && (
        <p className="task-form-error" role="alert" data-testid="error-save-goal">
          {serverErrorText(error, 'Unable to save goal.')}
        </p>
      )}
      <div className="task-form-actions">
        <button className="task-primary-button" type="submit" disabled={isPending}>
          {isPending ? 'Saving…' : mode === 'create' ? 'Add goal' : 'Save'}
        </button>
        <button
          className="task-secondary-button"
          type="button"
          disabled={isPending}
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function ProjectGoals({ slug }: { slug: string }) {
  const goalsQuery = useListProjectGoals(slug, {
    query: { queryKey: getListProjectGoalsQueryKey(slug) },
  });
  const agentUpdatesQuery = useListLatestAgentUpdates({
    query: {
      queryKey: getListLatestAgentUpdatesQueryKey(),
      staleTime: 60_000,
    },
  });
  const createGoalMutation = useCreateProjectGoal({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: getListProjectGoalsQueryKey(slug),
        });
      },
    },
  });
  const updateGoalMutation = useUpdateGoal({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: getListProjectGoalsQueryKey(slug),
        });
      },
    },
  });
  const [isAdding, setIsAdding] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [draft, setDraft] = useState<GoalDraft>(emptyGoalDraft);
  const goals = goalsQuery.data ?? [];
  const latestUpdate = agentUpdatesQuery.data?.find(
    (update) => update.project_slug === slug,
  );
  const groupedGoals = GOAL_STATUSES
    .map((status) => ({
      status,
      goals: goals.filter((goal) => goal.status === status),
    }))
    .filter((group) => group.goals.length > 0);

  const updateDraft = (field: keyof GoalDraft, value: string) => {
    setDraft((current) => {
      if (field === 'status') return { ...current, status: value as GoalStatus };
      if (field === 'title') return { ...current, title: value };
      if (field === 'targetDate') return { ...current, targetDate: value };
      return { ...current, notes: value };
    });
  };

  const openCreateForm = () => {
    createGoalMutation.reset();
    updateGoalMutation.reset();
    setEditingGoal(null);
    setDraft(emptyGoalDraft());
    setIsAdding(true);
  };

  const openEditForm = (goal: Goal) => {
    createGoalMutation.reset();
    updateGoalMutation.reset();
    setIsAdding(false);
    setEditingGoal(goal);
    setDraft(goalDraftFromGoal(goal));
  };

  const cancelCreate = () => {
    createGoalMutation.reset();
    setIsAdding(false);
    setDraft(emptyGoalDraft());
  };

  const cancelEdit = () => {
    updateGoalMutation.reset();
    setEditingGoal(null);
    setDraft(emptyGoalDraft());
  };

  const saveNewGoal = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createGoalMutation.reset();
    const data: GoalInput = {
      title: draft.title.trim(),
      target_date: draft.targetDate || null,
      notes: draft.notes.trim() || null,
    };

    try {
      await createGoalMutation.mutateAsync({ slug, data });
      setIsAdding(false);
      setDraft(emptyGoalDraft());
    } catch {
      // Keep the form open and show the server error.
    }
  };

  const saveGoalChanges = async (
    goal: Goal,
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    updateGoalMutation.reset();

    const changes: GoalUpdate = {};
    const title = draft.title.trim();
    const notes = draft.notes.trim() || null;
    const targetDate = draft.targetDate || null;
    const originalTargetDate = goal.target_date ?? null;
    if (title !== goal.title) changes.title = title;
    if (notes !== (goal.notes ?? null)) changes.notes = notes;
    if (draft.status !== goal.status) changes.status = draft.status;
    if (targetDate !== originalTargetDate) {
      changes.target_date = targetDate;
    }

    if (Object.keys(changes).length === 0) {
      setEditingGoal(null);
      setDraft(emptyGoalDraft());
      return;
    }

    try {
      await updateGoalMutation.mutateAsync({ id: goal.id, data: changes });
      setEditingGoal(null);
      setDraft(emptyGoalDraft());
    } catch {
      // Keep the form open and show the server error.
    }
  };

  const canShowGoalList = !goalsQuery.isLoading && !goalsQuery.isError;

  return (
    <section className="goal-workspace" data-testid="section-project-goals">
      <aside className="agent-latest-box" data-testid="box-ollie-latest">
        <h2 className="todo-group-title">Ollie's latest</h2>
        {agentUpdatesQuery.isLoading ? (
          <p className="task-state-message" role="status">Loading Ollie's latest…</p>
        ) : agentUpdatesQuery.isError ? (
          <p className="task-form-error" role="alert">
            {serverErrorText(agentUpdatesQuery.error, "Unable to load Ollie's latest report.")}
          </p>
        ) : !latestUpdate ? (
          <p className="task-state-message" data-testid="status-no-ollie-report">
            No report from Ollie yet
          </p>
        ) : (
          <>
            <div className="agent-update-light">
              <span
                className={`agent-light-dot agent-light-${latestUpdate.status_light}`}
                aria-hidden="true"
                data-testid={`agent-overview-light-${slug}`}
              />
              <span>{latestUpdate.status_light}</span>
              {latestUpdate.priority && (
                <span className={`priority-chip priority-${latestUpdate.priority}`} data-testid={`priority-overview-${slug}`}>
                  {latestUpdate.priority}
                </span>
              )}
            </div>
            <p className="agent-update-summary" data-testid={`agent-overview-summary-${slug}`}>
              {latestUpdate.summary}
            </p>
            <div className="agent-update-risks">
              <strong>Risks</strong>
              {latestUpdate.risks.length > 0 ? (
                <ul>
                  {latestUpdate.risks.map((risk, index) => (
                    <li key={`${risk.text}-${index}`}>
                      {risk.text}
                      {risk.severity && <span className={`risk-severity severity-${risk.severity}`}>{risk.severity}</span>}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="task-state-message">No risks listed</p>
              )}
            </div>
            <p className="agent-update-date" data-testid={`agent-overview-updated-${slug}`}>
              Updated {formatBrisbaneDateTime(latestUpdate.created_at)}
            </p>
          </>
        )}
      </aside>

      <div className="todo-toolbar">
        <button
          className="task-primary-button"
          type="button"
          onClick={openCreateForm}
          data-testid="button-add-goal"
        >
          Add goal
        </button>
      </div>

      {isAdding && (
        <GoalEditorForm
          mode="create"
          draft={draft}
          isPending={createGoalMutation.isPending}
          error={createGoalMutation.error}
          onChange={updateDraft}
          onSubmit={saveNewGoal}
          onCancel={cancelCreate}
        />
      )}

      {goalsQuery.isLoading && (
        <p className="task-state-message" role="status">Loading goals…</p>
      )}
      {goalsQuery.isError && (
        <div className="task-query-error" role="alert">
          <p>{serverErrorText(goalsQuery.error, 'Unable to load goals.')}</p>
          <button
            className="task-secondary-button"
            type="button"
            onClick={() => void goalsQuery.refetch()}
          >
            Retry
          </button>
        </div>
      )}

      {canShowGoalList && goals.length === 0 && (
        <p className="task-state-message" data-testid="status-no-goals">No goals yet</p>
      )}
      {canShowGoalList && groupedGoals.map((group) => (
        <section
          className="todo-group"
          key={group.status}
          data-testid={`group-goals-${group.status}`}
        >
          <h2 className="todo-group-title">{GOAL_STATUS_LABELS[group.status]}</h2>
          <div className="todo-task-list">
            {group.goals.map((goal) => {
              const achievedDate = goal.status === 'achieved'
                ? formatCompletedDate(goal.achieved_at)
                : null;

              return (
                <article className="todo-task-card" key={goal.id} data-testid={`goal-${goal.id}`}>
                  {editingGoal?.id === goal.id ? (
                    <GoalEditorForm
                      mode="edit"
                      draft={draft}
                      isPending={updateGoalMutation.isPending}
                      error={updateGoalMutation.error}
                      onChange={updateDraft}
                      onSubmit={(event) => void saveGoalChanges(goal, event)}
                      onCancel={cancelEdit}
                    />
                  ) : (
                    <button
                      className="todo-task-trigger"
                      type="button"
                      onClick={() => openEditForm(goal)}
                      data-testid={`button-edit-goal-${goal.id}`}
                    >
                      <span className="todo-task-title">{goal.title}</span>
                      {(goal.target_date || achievedDate) && (
                        <span className="todo-task-meta">
                          {goal.target_date && (
                            <span>Target {formatDueDate(goal.target_date)}</span>
                          )}
                          {achievedDate && (
                            <span className="todo-task-completed">
                              Achieved · {achievedDate}
                            </span>
                          )}
                        </span>
                      )}
                      {goal.notes && <span className="goal-notes">{goal.notes}</span>}
                    </button>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      ))}
    </section>
  );
}

function MetricValue({ metric }: { metric?: ProjectMetric }) {
  return <>{metric ? formatFigure(metric.value, metric.unit) : 'No data yet'}</>;
}

function ChartFrame({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="data-chart-panel">
      <h3 className="todo-group-title">{title}</h3>
      {children}
    </section>
  );
}

function RevenueWorkspace({ slug }: { slug: string }) {
  const isCoffee = slug === 'cattle-dog-coffee';
  const metricsQuery = useListProjectMetrics(slug, {
    query: { queryKey: getListProjectMetricsQueryKey(slug), enabled: isCoffee },
  });
  const dailySalesQuery = useListProjectDailySales(slug, {
    query: { queryKey: getListProjectDailySalesQueryKey(slug), enabled: isCoffee },
  });
  const historyParams = { key: 'sales_30d' };
  const historyQuery = useListProjectMetricHistory(slug, historyParams, {
    query: { queryKey: getListProjectMetricHistoryQueryKey(slug, historyParams), enabled: isCoffee },
  });
  const refreshMutation = useRefreshProjectMetrics();
  const refresh = async () => {
    try {
      await refreshMutation.mutateAsync({ slug });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: getListProjectMetricsQueryKey(slug) }),
        queryClient.invalidateQueries({ queryKey: getListProjectDailySalesQueryKey(slug) }),
        queryClient.invalidateQueries({ queryKey: getListProjectMetricHistoryQueryKey(slug, historyParams) }),
      ]);
    } catch {
      // Server response is rendered below.
    }
  };
  const metrics = metricsQuery.data ?? [];
  const historyRows: MetricHistoryRow[] = [...(historyQuery.data ?? [])]
    .sort((a, b) => a.captured_at.localeCompare(b.captured_at));
  const salesHistoryDomain: [number, number] | undefined = historyRows.length > 0
    ? [
      Math.min(...historyRows.map((row) => row.value)) * 0.99,
      Math.max(...historyRows.map((row) => row.value)) * 1.01,
    ]
    : undefined;
  const latestMetric = metrics.reduce<ProjectMetric | undefined>((latest, metric) => (
    !latest || new Date(metric.captured_at).getTime() > new Date(latest.captured_at).getTime()
      ? metric
      : latest
  ), undefined);
  if (!isCoffee) return <p className="data-empty">No data source yet</p>;

  return (
    <div className="data-workspace">
      <div className="data-toolbar">
        {latestMetric && <p className="data-updated">Updated {formatBrisbaneDateTime(latestMetric.captured_at)}</p>}
        <button className="task-secondary-button" type="button" disabled={refreshMutation.isPending} onClick={() => void refresh()} data-testid="button-refresh-project-metrics">
          {refreshMutation.isPending ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>
      {refreshMutation.isError && <p className="data-error" role="alert">{serverErrorText(refreshMutation.error, 'Unable to refresh metrics.')}</p>}
      {metricsQuery.isLoading ? <p className="task-state-message" role="status">Loading metrics…</p> : metricsQuery.isError ? (
        <div className="task-query-error" role="alert"><p>{serverErrorText(metricsQuery.error, 'Unable to load metrics.')}</p><button className="task-secondary-button" type="button" onClick={() => void metricsQuery.refetch()}>Retry</button></div>
      ) : (
        <div className="metric-grid">
          {Object.entries(METRIC_DEFINITIONS).map(([key, definition]) => {
            const metric = metrics.find((entry) => entry.key === key);
            return <article className="metric-card" key={key}><span>{definition.label}</span><strong><MetricValue metric={metric} /></strong></article>;
          })}
        </div>
      )}
      <div className="chart-grid">
        <ChartFrame title="Daily sales · last 30 days">
          {dailySalesQuery.isLoading ? <p className="task-state-message">Loading daily sales…</p> : dailySalesQuery.isError ? (
            <p className="data-error" role="alert">{serverErrorText(dailySalesQuery.error, 'Unable to load daily sales.')}</p>
          ) : (dailySalesQuery.data?.length ?? 0) === 0 ? <p className="data-empty">No data yet</p> : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={dailySalesQuery.data} margin={{ top: 10, right: 4, bottom: 0, left: 0 }}>
                <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeDasharray="3 4" />
                <XAxis dataKey="day" tickFormatter={(day: string) => formatDueDate(day)} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} stroke="hsl(var(--border))" minTickGap={25} />
                <YAxis tickFormatter={(value: number) => formatFigure(value, 'aud_cents')} width={60} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} stroke="hsl(var(--border))" />
                <Tooltip formatter={(value: number) => formatFigure(value, 'aud_cents')} labelFormatter={(day: string) => formatDueDate(day)} contentStyle={{ background: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }} />
                <Bar dataKey="sales_cents" name="Sales" fill="hsl(var(--chart-1))" fillOpacity={0.88} radius={[2, 2, 0, 0]} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartFrame>
        <ChartFrame title="Sales, last 30 days · history">
          {historyQuery.isLoading ? <p className="task-state-message">Loading sales history…</p> : historyQuery.isError ? (
            <p className="data-error" role="alert">{serverErrorText(historyQuery.error, 'Unable to load sales history.')}</p>
          ) : historyRows.length === 0 ? <p className="data-empty">No data yet</p> : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={historyRows} margin={{ top: 10, right: 8, bottom: 0, left: 0 }}>
                <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeDasharray="3 4" />
                <XAxis dataKey="captured_at" tickFormatter={(value: string) => formatDueDate(value.slice(0, 10))} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} stroke="hsl(var(--border))" minTickGap={24} />
                <YAxis domain={salesHistoryDomain} tickFormatter={(value: number) => formatFigure(value, 'aud_cents')} width={60} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} stroke="hsl(var(--border))" />
                <Tooltip formatter={(value: number) => formatFigure(value, 'aud_cents')} labelFormatter={(value: string) => formatBrisbaneDateTime(value)} contentStyle={{ background: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }} />
                <Line dataKey="value" name="Sales" type="monotone" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} activeDot={{ r: 4 }} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </ChartFrame>
      </div>
    </div>
  );
}

function FinanceFleetWorkspace() {
  const latestQuery = useGetProjectFinanceFleetLatest({
    query: {
      queryKey: getGetProjectFinanceFleetLatestQueryKey(),
      staleTime: 30_000,
      refetchOnWindowFocus: true,
    },
  });
  const historyQuery = useGetProjectFinanceFleetHistory({
    query: {
      queryKey: getGetProjectFinanceFleetHistoryQueryKey(),
      staleTime: 60_000,
      refetchOnWindowFocus: true,
    },
  });
  const latest: FleetLatestSnapshotResponse | undefined = latestQuery.data && !('empty' in latestQuery.data)
    ? latestQuery.data
    : undefined;
  const history: FleetHistoryResponse = historyQuery.data ?? [];
  const oldestHistoryDay = history.reduce<string | undefined>((oldest, row) => (
    !oldest || row.day < oldest ? row.day : oldest
  ), undefined);
  const fleetEquityDomain: [number, number] | undefined = history.length > 0
    ? [
      Math.min(...history.map((row) => row.total_equity_cents)) * 0.99,
      Math.max(...history.map((row) => row.total_equity_cents)) * 1.01,
    ]
    : undefined;

  if (latestQuery.isLoading) {
    return (
      <div className="fleet-state" role="status" aria-label="Loading trading fleet">
        <span className="skeleton loading-line" />
        <span className="skeleton fleet-loading-block" />
        <p>Loading trading fleet…</p>
      </div>
    );
  }
  if (latestQuery.isError) {
    return (
      <div className="fleet-state fleet-error" role="alert">
        <h3>Unable to load the trading fleet.</h3>
        <p>{serverErrorText(latestQuery.error, 'The latest snapshot could not be retrieved.')}</p>
        <button className="task-secondary-button" type="button" onClick={() => void latestQuery.refetch()} data-testid="button-retry-fleet">
          Retry
        </button>
      </div>
    );
  }
  if (!latest) {
    return (
      <div className="fleet-workspace">
        <div className="fleet-state fleet-empty" data-testid="status-fleet-empty">
          <span className="fleet-empty-mark" aria-hidden="true">—</span>
          <div><h3>No fleet snapshot yet</h3><p>Trading fleet data will appear here after the first snapshot is received.</p></div>
        </div>
        <FleetDetailPanels detail={null} />
      </div>
    );
  }

  const pnlPositive = latest.total_pnl_cents >= 0;
  return (
    <div className="fleet-workspace" data-testid="workspace-finance-fleet">
      <header className="fleet-toolbar">
        <div className="fleet-mode-line">
          <span className={`fleet-mode fleet-mode-${latest.mode}`}>
            {latest.mode === 'paper' ? 'PAPER — practice money' : latest.mode.toUpperCase()}
          </span>
          <span className="fleet-updated">
            Updated {formatBrisbaneDateTime(latest.generated_at)} ({latest.age_minutes} min ago)
          </span>
        </div>
        {latest.stale && <p className="fleet-stale-warning" role="status">Stale — no update for {latest.age_minutes} min</p>}
      </header>

      <section className="fleet-overview" aria-label="Fleet summary">
        <article className="fleet-equity-card">
          <span className="fleet-metric-label">Total equity</span>
          <strong>{formatFigure(latest.total_equity_cents, 'usd_cents')}</strong>
          <span className="fleet-equity-note">Paper portfolio value</span>
        </article>
        <div className="fleet-metric-grid">
          <article className="fleet-metric-card">
            <span className="fleet-metric-label">Total P&amp;L</span>
            <strong className={pnlPositive ? 'fleet-positive' : 'fleet-negative'}>{formatFigure(latest.total_pnl_cents, 'usd_cents')}</strong>
          </article>
          <article className="fleet-metric-card"><span className="fleet-metric-label">{oldestHistoryDay ? `Drawdown · since ${formatDueDate(oldestHistoryDay)}` : 'Drawdown'}</span><strong>{latest.drawdown_pct.toFixed(2)}%</strong></article>
          <article className="fleet-metric-card"><span className="fleet-metric-label">Peak equity</span><strong>{formatFigure(latest.peak_equity_cents, 'usd_cents')}</strong></article>
          <article className="fleet-metric-card"><span className="fleet-metric-label">Open positions</span><strong>{formatFigure(latest.open_positions, 'count')}</strong></article>
          <article className="fleet-metric-card"><span className="fleet-metric-label">Paused bots</span><strong>{formatFigure(latest.paused_bots, 'count')}</strong></article>
        </div>
      </section>

      <div className="fleet-dashboard-grid">
        <ChartFrame title="Equity · last 30 days">
          {historyQuery.isLoading ? (
            <div className="fleet-chart-skeleton" role="status"><span className="skeleton loading-line" /><span className="skeleton fleet-chart-placeholder" /></div>
          ) : historyQuery.isError ? (
            <div className="task-query-error" role="alert">
              <p>{serverErrorText(historyQuery.error, 'Unable to load fleet history.')}</p>
              <button className="task-secondary-button" type="button" onClick={() => void historyQuery.refetch()}>Retry history</button>
            </div>
          ) : history.length === 0 ? (
            <p className="data-empty">No equity history yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={history} margin={{ top: 12, right: 12, bottom: 0, left: 3 }}>
                <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeDasharray="3 4" />
                <XAxis dataKey="day" tickFormatter={(day: string) => formatDueDate(day)} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} stroke="hsl(var(--border))" minTickGap={26} />
                <YAxis domain={fleetEquityDomain} tickFormatter={(value: number) => formatFigure(value, 'usd_cents')} width={82} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} stroke="hsl(var(--border))" />
                <Tooltip
                  formatter={(value: number) => formatFigure(value, 'usd_cents')}
                  labelFormatter={(day: string) => formatDueDate(day)}
                  contentStyle={{ background: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }}
                />
                <Line dataKey="total_equity_cents" name="Equity" type="monotone" stroke="hsl(var(--chart-1))" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </ChartFrame>

        <section className="fleet-errors-panel" aria-labelledby="fleet-errors-title">
          <div className="fleet-panel-heading">
            <h3 id="fleet-errors-title">Snapshot errors</h3>
            <span>{latest.errors.length}</span>
          </div>
          {latest.errors.length ? (
            <ul className="fleet-error-list">{latest.errors.map((message, index) => <li key={`${message}-${index}`}>{message}</li>)}</ul>
          ) : (
            <p className="fleet-no-errors">No reported errors</p>
          )}
        </section>
      </div>

      <section className="fleet-bots-panel" aria-labelledby="fleet-bots-title">
        <div className="fleet-panel-heading">
          <div><p className="eyebrow">Portfolio detail</p><h3 id="fleet-bots-title">Bots</h3></div>
          <span>{latest.bots.length} tracked</span>
        </div>
        {latest.bots.length === 0 ? (
          <p className="data-empty">No bots in this snapshot</p>
        ) : (
          <div className="fleet-table-scroll">
            <table className="fleet-table">
              <thead><tr><th scope="col">Bot</th><th scope="col">Equity</th><th scope="col">P&amp;L</th><th scope="col">P&amp;L %</th><th scope="col">Positions</th><th scope="col">Status</th></tr></thead>
              <tbody>
                {latest.bots.map((bot) => {
                  const pnlPercent = bot.starting_cents > 0 ? (bot.pnl_cents / bot.starting_cents) * 100 : null;
                  const status = bot.paused ? 'Paused' : bot.stale ? 'Stale' : 'Running';
                  return (
                    <tr key={bot.id} data-testid={`row-fleet-bot-${bot.bot_id}`}>
                      <th scope="row" className="fleet-bot-id">{bot.bot_id}</th>
                      <td>{formatFigure(bot.equity_cents, 'usd_cents')}</td>
                      <td className={bot.pnl_cents >= 0 ? 'fleet-positive' : 'fleet-negative'}>{formatFigure(bot.pnl_cents, 'usd_cents')}</td>
                      <td className={pnlPercent === null ? '' : pnlPercent >= 0 ? 'fleet-positive' : 'fleet-negative'}>{pnlPercent === null ? '—' : `${pnlPercent.toFixed(2)}%`}</td>
                      <td>{formatFigure(bot.open_positions, 'count')}</td>
                      <td><span className={`fleet-bot-status fleet-bot-${status.toLowerCase()}`}>{status}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <FleetDetailPanels detail={latest.detail} />
    </div>
  );
}

function FleetDetailPanels({ detail }: { detail: FleetLatestSnapshotResponse['detail'] }) {
  const nearZeroPositionCount = detail?.positions.filter((position) => Math.abs(position.qty) < 0.000001).length ?? 0;
  const visiblePositions = detail?.positions.filter((position) => Math.abs(position.qty) >= 0.000001) ?? [];

  return (
    <div className="fleet-detail-panels">
      <section className="fleet-detail-panel" aria-labelledby="fleet-positions-title" data-testid="fleet-positions">
        <div className="fleet-panel-heading">
          <h3 id="fleet-positions-title">Positions</h3>
          {detail && <span>{detail.positions.length} reported</span>}
        </div>
        {!detail ? (
          <p className="data-empty">No detail yet</p>
        ) : (
          <>
          {nearZeroPositionCount > 0 && (
            <p className="fleet-near-zero-note">{nearZeroPositionCount} near-zero position(s) hidden</p>
          )}
          {visiblePositions.length === 0 ? nearZeroPositionCount === 0 && (
            <p className="data-empty">No positions reported</p>
          ) : (
          <div className="fleet-table-scroll">
            <table className="fleet-table fleet-detail-table">
              <thead>
                <tr><th scope="col">Bot</th><th scope="col">Symbol</th><th scope="col">Qty</th><th scope="col">Entry</th><th scope="col">Stop</th><th scope="col">Protected</th></tr>
              </thead>
              <tbody>
                {visiblePositions.map((position, index) => (
                  <tr
                    key={`${position.bot_id}-${position.symbol}-${index}`}
                    className={position.has_broker_stop === false ? 'fleet-position-no-stop' : undefined}
                  >
                    <th scope="row" className="fleet-bot-id">{position.bot_id}</th>
                    <td>{position.symbol}</td>
                    <td>{new Intl.NumberFormat('en-US', { maximumFractionDigits: 6 }).format(position.qty)}</td>
                    <td>{position.entry_price === null ? '—' : formatFigure(position.entry_price * 100, 'usd_cents')}</td>
                    <td>{position.stop_price === null ? '—' : formatFigure(position.stop_price * 100, 'usd_cents')}</td>
                    <td>{position.has_broker_stop === true ? '✅' : position.has_broker_stop === false ? '❌ No stop' : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}
          </>
        )}
      </section>

      <section className="fleet-detail-panel" aria-labelledby="fleet-bot-registry-title" data-testid="fleet-bot-registry">
        <div className="fleet-panel-heading">
          <h3 id="fleet-bot-registry-title">Bots</h3>
          {detail && <span>{detail.bots_meta.length} configured</span>}
        </div>
        {!detail ? (
          <p className="data-empty">No detail yet</p>
        ) : detail.bots_meta.length === 0 ? (
          <p className="data-empty">No bot metadata reported</p>
        ) : (
          <div className="fleet-table-scroll">
            <table className="fleet-table fleet-detail-table fleet-bots-meta-table">
              <thead>
                <tr><th scope="col">Bot</th><th scope="col">Strategy</th><th scope="col">Broker</th><th scope="col">Mode</th><th scope="col">Status</th><th scope="col">Instruments</th></tr>
              </thead>
              <tbody>
                {detail.bots_meta.map((bot, index) => (
                  <tr key={`${bot.bot_id}-${index}`}>
                    <th scope="row" className="fleet-bot-id">{bot.bot_id}</th>
                    <td>{bot.strategy || '—'}</td>
                    <td>{bot.broker || '—'}</td>
                    <td>{bot.account_mode}</td>
                    <td>{bot.registry_status || '—'}</td>
                    <td>{bot.instruments.length > 0 ? bot.instruments.join(', ') : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function FinanceTradingHealth() {
  const latestQuery = useGetProjectFinanceFleetLatest({
    query: {
      queryKey: getGetProjectFinanceFleetLatestQueryKey(),
      staleTime: 30_000,
      refetchOnWindowFocus: true,
    },
  });
  const latest: FleetLatestSnapshotResponse | undefined = latestQuery.data && !('empty' in latestQuery.data)
    ? latestQuery.data
    : undefined;
  const detail = latest?.detail;

  let healthContent: ReactNode;
  if (latestQuery.isLoading) {
    healthContent = <p className="task-state-message" role="status">Loading trading health…</p>;
  } else if (latestQuery.isError) {
    healthContent = <p className="data-error" role="alert">{serverErrorText(latestQuery.error, 'Unable to load trading health.')}</p>;
  } else if (!latest || !detail) {
    healthContent = <p className="data-empty">No detail yet</p>;
  } else {
    const runnerMinutesAgo = detail.runner?.last_heartbeat
      ? Math.max(0, Math.floor((Date.now() - Date.parse(detail.runner.last_heartbeat)) / 60_000))
      : null;
    const incidents = [...detail.incidents].sort((a, b) => Date.parse(b.ts) - Date.parse(a.ts));
    const unresolvedRecentIncidents = incidents.filter((incident) => (
      !incident.resolved &&
      Date.parse(incident.ts) >= Date.now() - 48 * 60 * 60 * 1000 &&
      Date.parse(incident.ts) <= Date.now()
    ));

    healthContent = (
      <div className="fleet-health-grid">
        <article className="fleet-health-item">
          <h4>Runner</h4>
          {detail.runner ? (
            <>
              <p>{detail.runner.status}</p>
              <p>{runnerMinutesAgo === null ? 'Last heartbeat not reported' : `Last heartbeat ${runnerMinutesAgo} min ago`}</p>
            </>
          ) : <p>Not reported yet</p>}
        </article>
        <article className="fleet-health-item">
          <h4>Kill switch</h4>
          {detail.kill_switch ? (
            <>
              <p>Mode: {detail.kill_switch.mode}</p>
              <p>Would trip: {detail.kill_switch.would_trip ? 'yes' : 'no'}</p>
              {detail.kill_switch.triggers.length > 0 ? (
                <ul>
                  {detail.kill_switch.triggers.map((trigger, index) => (
                    <li key={`${trigger.kind}-${trigger.bot_id ?? ''}-${index}`}>
                      {trigger.kind}: {trigger.detail}
                      {(trigger.bot_id || trigger.symbol) && <span> ({[trigger.bot_id, trigger.symbol].filter(Boolean).join(' · ')})</span>}
                    </li>
                  ))}
                </ul>
              ) : <p>No triggers reported</p>}
            </>
          ) : <p>Not reported yet</p>}
        </article>
        <article className="fleet-health-item">
          <h4>Reconciliation</h4>
          {detail.reconciliation ? (
            <>
              <p>{detail.reconciliation.clean === null ? 'Not reported yet' : detail.reconciliation.clean ? 'Clean' : 'Not clean'}</p>
              <p>Last run: {detail.reconciliation.last_run ? formatBrisbaneDateTime(detail.reconciliation.last_run) : 'Not reported yet'}</p>
              {detail.reconciliation.flags.length > 0 ? (
                <ul>{detail.reconciliation.flags.map((flag, index) => <li key={`${flag}-${index}`}>{flag}</li>)}</ul>
              ) : <p>No flags reported</p>}
            </>
          ) : <p>Not reported yet</p>}
        </article>
        <article className="fleet-health-item fleet-incidents-item">
          <h4>Incidents</h4>
          <p>{unresolvedRecentIncidents.length} unresolved in last 48h</p>
          {incidents.length > 0 ? (
            <ul className="fleet-incident-list">
              {incidents.slice(0, 10).map((incident, index) => (
                <li key={`${incident.ts}-${incident.component}-${index}`}>
                  <div className="fleet-incident-meta"><strong>{incident.severity}</strong><span>{incident.component}</span></div>
                  <p>{incident.message}</p>
                  <div className="fleet-incident-meta"><time>{formatBrisbaneDateTime(incident.ts)}</time><span>Resolved: {incident.resolved ? 'yes' : 'no'}</span></div>
                </li>
              ))}
            </ul>
          ) : <p>No incidents reported</p>}
        </article>
      </div>
    );
  }

  return (
    <section className="fleet-detail-panel fleet-health-panel" aria-labelledby="fleet-health-title" data-testid="finance-trading-health">
      <div className="fleet-panel-heading">
        <h3 id="fleet-health-title">Trading health</h3>
        {latest && <span>Updated {formatBrisbaneDateTime(latest.generated_at)}</span>}
      </div>
      {healthContent}
    </section>
  );
}

function CustomerWorkspace({ slug }: { slug: string }) {
  const isCoffee = slug === 'cattle-dog-coffee';
  const query = useListProjectMetrics(slug, {
    query: { queryKey: getListProjectMetricsQueryKey(slug), enabled: isCoffee },
  });
  if (!isCoffee) return <p className="data-empty">No customer data source yet</p>;
  if (query.isLoading) return <p className="task-state-message" role="status">Loading customer metrics…</p>;
  if (query.isError) return <div className="task-query-error" role="alert"><p>{serverErrorText(query.error, 'Unable to load customer metrics.')}</p><button className="task-secondary-button" type="button" onClick={() => void query.refetch()}>Retry</button></div>;
  const metrics = query.data ?? [];
  const customers = metrics.find((metric) => metric.key === 'customers_30d');
  const repeat = metrics.find((metric) => metric.key === 'repeat_customers_30d');
  const repeatRate = customers && repeat && customers.value > 0
    ? `${Math.round((repeat.value / customers.value) * 100)}%`
    : customers?.value === 0 ? '–' : 'No data yet';
  return (
    <div className="metric-grid customer-metrics">
      <article className="metric-card"><span>Customers, last 30 days</span><strong><MetricValue metric={customers} /></strong></article>
      <article className="metric-card"><span>Repeat customers, last 30 days</span><strong><MetricValue metric={repeat} /></strong></article>
      <article className="metric-card"><span>Repeat rate</span><strong>{repeatRate}</strong></article>
    </div>
  );
}

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

function OverviewWorkspace({ slug }: { slug: string }) {
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

function AgentActivityWorkspace({ slug }: { slug: string }) {
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

function NextActionWorkspace({ slug }: { slug: string }) {
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

function sourceLabelForDecision(source: string): string {
  return source === 'ollie_daily' ? 'Ollie daily' : source === 'cursor' ? 'Cursor' : source;
}

function DecisionsPage() {
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

function AgentsPage() {
  const client = useQueryClient();
  const runsQuery = useListAgentRuns({
    query: { queryKey: getListAgentRunsQueryKey() },
  });
  const [runNotice, setRunNotice] = useState<{ text: string; isError: boolean } | null>(null);
  const runMutation = useRunOllie({
    mutation: {
      onSuccess: async (run) => {
        setRunNotice({
          text: `Run status: ${run.status}${run.error ? ` — ${run.error}` : ''}`,
          isError: run.status === 'error' || run.status === 'invalid',
        });
        await Promise.all([
          client.invalidateQueries({ queryKey: getListAgentRunsQueryKey() }),
          client.invalidateQueries({ queryKey: getListLatestAgentUpdatesQueryKey() }),
        ]);
      },
      onError: (error) => {
        setRunNotice({
          text: serverErrorText(error, 'Unable to run Ollie.'),
          isError: true,
        });
      },
    },
  });
  const runs = runsQuery.data ?? [];

  return (
    <div className="app-shell">
      <Header />
      <main className="page-wrap detail-main agents-main">
        <Link className="back-link" href="/" data-testid="link-agents-home">← Home</Link>
        <div className="detail-heading agents-heading">
          <p className="eyebrow">Team activity</p>
          <h1 className="detail-title">Agents</h1>
          <p className="detail-description">Daily report runs and their results.</p>
        </div>

        <section className="agents-run-panel" aria-labelledby="agents-run-title">
          <div className="agents-run-toolbar">
            <h2 id="agents-run-title" className="todo-group-title">Ollie</h2>
            <button
              className="task-primary-button"
              type="button"
              disabled={runMutation.isPending}
              onClick={() => {
                setRunNotice(null);
                runMutation.mutate({ data: {} });
              }}
              data-testid="button-run-ollie"
            >
              {runMutation.isPending ? 'Running…' : 'Run Ollie now'}
            </button>
          </div>
          {runNotice && (
            <p
              className={runNotice.isError ? 'agents-run-notice agents-run-notice-error' : 'agents-run-notice'}
              role={runNotice.isError ? 'alert' : 'status'}
              data-testid="status-ollie-run"
            >
              {runNotice.text}
            </p>
          )}
        </section>

        <section className="agents-history" aria-labelledby="agents-history-title">
          <h2 id="agents-history-title" className="section-rule">
            <span>Recent runs</span>
          </h2>
          {runsQuery.isLoading ? (
            <p className="task-state-message" role="status">Loading agent runs…</p>
          ) : runsQuery.isError ? (
            <div className="task-query-error" role="alert">
              <p>{serverErrorText(runsQuery.error, 'Unable to load agent runs.')}</p>
              <button
                className="task-secondary-button"
                type="button"
                onClick={() => void runsQuery.refetch()}
              >
                Retry
              </button>
            </div>
          ) : runs.length === 0 ? (
            <p className="task-state-message" data-testid="status-no-agent-runs">No agent runs yet</p>
          ) : (
            <ol className="agents-run-list" data-testid="list-agent-runs">
              {runs.map((run) => (
                <li className="agents-run-card" key={run.id} data-testid={`card-agent-run-${run.id}`}>
                  <div className="agents-run-header">
                    <strong>{run.member_name}</strong>
                    <span className={`agents-run-status agents-run-status-${run.status}`}>
                      {run.status}
                    </span>
                  </div>
                  <p className="agents-run-date">Started {formatBrisbaneDateTime(run.started_at)}</p>
                  <div className="agents-run-tokens">
                    <span>Input tokens: {run.input_tokens ?? 'No data yet'}</span>
                    <span>Output tokens: {run.output_tokens ?? 'No data yet'}</span>
                  </div>
                  {run.error && <p className="agents-run-error">{run.error}</p>}
                </li>
              ))}
            </ol>
          )}
        </section>
      </main>
    </div>
  );
}

function ProjectDetail() {
  const { slug = '' } = useParams<{ slug: string }>();
  const projectQuery = useGetProject(slug, {
    query: { queryKey: getGetProjectQueryKey(slug), retry: false },
  });
  const [activeTab, setActiveTab] = useState<(typeof PROJECT_TABS)[number]>(() => (
    new URLSearchParams(window.location.search).get('tab') === 'To-do'
      ? 'To-do'
      : PROJECT_TABS[0]
  ));
  const [isEditing, setIsEditing] = useState(false);
  const [draftStatus, setDraftStatus] = useState<ProjectStatus>(PROJECT_STATUSES[0]);
  const [draftDescription, setDraftDescription] = useState('');
  const [draftDriveUrl, setDraftDriveUrl] = useState('');
  const updateProjectMutation = useUpdateProject({
    mutation: {
      onSuccess: async (updated) => {
        queryClient.setQueryData(getGetProjectQueryKey(updated.slug), updated);
        queryClient.setQueryData<Project[]>(getListProjectsQueryKey(), (projects) =>
          projects?.map((item) => item.slug === updated.slug ? updated : item),
        );
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: getGetProjectQueryKey(updated.slug),
          }),
          queryClient.invalidateQueries({
            queryKey: getListProjectsQueryKey(),
          }),
        ]);
      },
    },
  });

  if (projectQuery.isLoading) {
    return (
      <div className="app-shell">
        <Header />
        <main className="page-wrap detail-main">
          <Link className="back-link" href="/" data-testid="link-home">← Home</Link>
          <div className="detail-heading" aria-label="Loading project" data-testid="status-project-loading">
            <div className="skeleton" />
          </div>
        </main>
      </div>
    );
  }

  if (projectQuery.isError) {
    if (isNotFound(projectQuery.error)) {
      return (
        <div className="app-shell">
          <Header />
          <main className="page-wrap not-found">
            <h1 className="home-title" data-testid="status-project-not-found">Project not found</h1>
            <Link className="back-link" href="/" data-testid="link-home">← Home</Link>
          </main>
        </div>
      );
    }
    return (
      <div className="app-shell">
        <Header />
        <main className="page-wrap detail-main">
          <Link className="back-link" href="/" data-testid="link-home">← Home</Link>
          <section className="state-panel" role="alert" data-testid="status-project-error">
            <h1 className="state-title">Unable to load project.</h1>
            <p className="state-copy">Please try again.</p>
            <button className="retry-button" type="button" onClick={() => void projectQuery.refetch()} data-testid="button-retry-project">
              Retry
            </button>
          </section>
        </main>
      </div>
    );
  }

  const project = projectQuery.data;
  if (!project) return null;

  const openEditor = () => {
    updateProjectMutation.reset();
    setDraftStatus(project.status as ProjectStatus);
    setDraftDescription(project.description ?? '');
    setDraftDriveUrl(project.drive_url ?? '');
    setIsEditing(true);
  };

  const closeEditor = () => {
    updateProjectMutation.reset();
    setIsEditing(false);
  };

  const saveProject = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateProjectMutation.reset();

    const changes: { status?: string; description?: string | null; drive_url?: string | null } = {};
    if (draftStatus !== project.status) changes.status = draftStatus;
    if (draftDescription !== (project.description ?? '')) {
      changes.description = draftDescription;
    }
    const driveUrl = draftDriveUrl.trim() || null;
    if (driveUrl !== project.drive_url) changes.drive_url = driveUrl;

    if (Object.keys(changes).length === 0) {
      setIsEditing(false);
      return;
    }

    try {
      await updateProjectMutation.mutateAsync({ slug: project.slug, data: changes });
      setIsEditing(false);
    } catch {
      // Keep the editor open; the mutation error is shown inside the form.
    }
  };

  return (
    <div className="app-shell">
      <Header />
      <main className="page-wrap detail-main" data-project-slug={project.slug}>
        <Link className="back-link" href="/" data-testid="link-home">← Home</Link>
        <section className="detail-heading">
          <div className="detail-title-row">
            <h1 className="detail-title" data-testid="text-project-name">{project.name}</h1>
            <span className="status-badge" data-testid="status-project">
              <span className="status-dot" aria-hidden="true" />
              {project.status}
            </span>
          </div>
          <p className="detail-description" data-testid="text-project-description">
            {project.description ?? 'No description yet'}
          </p>
          <div className="project-heading-actions">
            {project.drive_url && (
              <a
                className="project-files-link"
                href={project.drive_url}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="link-project-files"
              >
                Files <span aria-hidden="true">↗</span>
              </a>
            )}
            {!isEditing ? (
              <button className="retry-button" type="button" onClick={openEditor} data-testid="button-edit-project">
                Edit
              </button>
            ) : (
              <form
                className="state-panel"
                onSubmit={saveProject}
                style={{ display: 'grid', gap: 14, maxWidth: 560, marginTop: 8 }}
                data-testid="form-edit-project"
              >
                <label htmlFor="project-edit-status" style={{ display: 'grid', gap: 7 }}>
                  Status
                  <select
                    id="project-edit-status"
                    value={draftStatus}
                    onChange={(event) => setDraftStatus(event.target.value as ProjectStatus)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 7,
                      color: 'hsl(var(--foreground))',
                      background: 'hsl(var(--background))',
                      font: 'inherit',
                    }}
                    data-testid="select-project-status"
                  >
                    {PROJECT_STATUSES.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </label>
                <label htmlFor="project-edit-description" style={{ display: 'grid', gap: 7 }}>
                  Description
                  <textarea
                    id="project-edit-description"
                    rows={4}
                    maxLength={2000}
                    value={draftDescription}
                    onChange={(event) => setDraftDescription(event.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 7,
                      color: 'hsl(var(--foreground))',
                      background: 'hsl(var(--background))',
                      font: 'inherit',
                      resize: 'vertical',
                    }}
                    data-testid="input-project-description"
                  />
                </label>
                <label htmlFor="project-edit-drive-url" className="project-edit-field">
                  Drive folder link
                  <input
                    id="project-edit-drive-url"
                    type="url"
                    inputMode="url"
                    value={draftDriveUrl}
                    onChange={(event) => setDraftDriveUrl(event.target.value)}
                    placeholder="https://drive.google.com/…"
                    data-testid="input-project-drive-url"
                  />
                </label>
                {updateProjectMutation.isError && (
                  <p role="alert" className="state-copy" data-testid="error-save-project">
                    {serverErrorText(updateProjectMutation.error)}
                  </p>
                )}
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    className="retry-button"
                    type="submit"
                    disabled={updateProjectMutation.isPending}
                    data-testid="button-save-project"
                  >
                    {updateProjectMutation.isPending ? 'Saving…' : 'Save'}
                  </button>
                  <button
                    className="retry-button"
                    type="button"
                    disabled={updateProjectMutation.isPending}
                    onClick={closeEditor}
                    data-testid="button-cancel-edit"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>
        <div className="tab-list" role="tablist" aria-label="Project sections" data-testid="tab-list-project">
          {PROJECT_TABS.map((tab) => (
            <button
              key={tab}
              className="tab-button"
              type="button"
              role="tab"
              id={`tab-${tab}`}
              aria-selected={activeTab === tab}
              aria-controls="project-tab-panel"
              onClick={() => setActiveTab(tab)}
              data-testid={`tab-${tab}`}
            >
              {tab}
            </button>
          ))}
        </div>
        <section
          className={`tab-panel${activeTab === 'To-do' ? ' todo-tab-panel' : activeTab === 'Overview & Goals' ? ' goal-tab-panel' : ' data-tab-panel'}`}
          role="tabpanel"
          id="project-tab-panel"
          aria-labelledby={`tab-${activeTab}`}
          data-testid="panel-project-tab"
        >
          {activeTab === 'To-do'
            ? <ProjectTodo slug={project.slug} />
            : activeTab === 'Overview & Goals'
              ? <><ProjectGoals slug={project.slug} /><OverviewWorkspace slug={project.slug} /></>
              : activeTab === 'Customers'
                ? project.slug === 'finance'
                  ? <p className="data-empty">Not applicable — trading fleet</p>
                  : <CustomerWorkspace slug={project.slug} />
                : activeTab === 'Revenue & Subscriptions'
                  ? project.slug === 'finance'
                    ? <FinanceFleetWorkspace />
                    : <RevenueWorkspace slug={project.slug} />
                  : activeTab === 'Marketing'
                    ? <p className="data-empty">No marketing data source connected yet. Connect a source (for example site analytics or an ad account) to fill this tab.</p>
                    : activeTab === 'Agent Activity'
                      ? <AgentActivityWorkspace slug={project.slug} />
                      : <NextActionWorkspace slug={project.slug} />}
        </section>
      </main>
    </div>
  );
}

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/organisation" component={OrganisationPage} />
        <Route path="/agents" component={AgentsPage} />
        <Route path="/decisions" component={DecisionsPage} />
        <Route path="/finances" component={FinancePage} />
        <Route path="/projects/:slug" component={ProjectDetail} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function AuthGate() {
  const authRequired = useAuthenticationRequired();
  const sessionQuery = useGetSession({
    query: {
      queryKey: getGetSessionQueryKey(),
      enabled: !authRequired,
      retry: false,
    },
  });

  if (authRequired) {
    return <LoginScreen />;
  }
  if (sessionQuery.isSuccess) {
    const devBypass = sessionQuery.data.dev_bypass;
    return (
      <DevAuthBypassContext.Provider value={devBypass}>
        {devBypass && (
          <div className="dev-auth-banner" role="status">
            DEV: login off
          </div>
        )}
        <Router />
      </DevAuthBypassContext.Provider>
    );
  }
  if (sessionQuery.isError) {
    return (
      <LoginScreen
        initialError={
          isUnauthorizedError(sessionQuery.error)
            ? undefined
            : serverErrorText(sessionQuery.error, 'Unable to check session.')
        }
      />
    );
  }

  return <main className="auth-loading" aria-live="polite">Loading…</main>;
}

function App() {
  return (
    <ColorModeProvider>
      <QueryClientProvider client={queryClient}>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <AuthGate />
        </WouterRouter>
      </QueryClientProvider>
    </ColorModeProvider>
  );
}

export default App;
