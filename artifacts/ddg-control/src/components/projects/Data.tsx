import { type ReactNode } from 'react';
import { queryClient } from '@/lib/query-client';
import {
  getGetCattleDogCoffeeProfitQueryKey,
  getGetProjectFinanceFleetHistoryQueryKey,
  getGetProjectFinanceFleetLatestQueryKey,
  getListProjectMetricsQueryKey,
  getListProjectDailySalesQueryKey,
  getListProjectMetricHistoryQueryKey,
  useGetCattleDogCoffeeProfit,
  useGetProjectFinanceFleetHistory,
  useGetProjectFinanceFleetLatest,
  useListProjectMetrics,
  useListProjectDailySales,
  useListProjectMetricHistory,
  useRefreshProjectMetrics,
  type FleetHistoryResponse,
  type FleetLatestSnapshotResponse,
  type ProjectMetric,
  type MetricHistoryRow,
} from '@workspace/api-client-react';
import { METRIC_DEFINITIONS } from '@workspace/project-constants';
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { serverErrorText } from '@/lib/errors';
import { formatBrisbaneDateTime, formatCurrencyCents, formatDueDate, formatFigure } from '@/lib/format';

function MetricValue({ metric }: { metric?: ProjectMetric }) {
  return <>{metric ? formatFigure(metric.value, metric.unit) : 'No data yet'}</>;
}

export function ChartFrame({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="data-chart-panel">
      <h3 className="todo-group-title">{title}</h3>
      {children}
    </section>
  );
}

export function RevenueWorkspace({ slug }: { slug: string }) {
  const isCoffee = slug === 'cattle-dog-coffee';
  const profitQuery = useGetCattleDogCoffeeProfit({
    query: {
      queryKey: getGetCattleDogCoffeeProfitQueryKey(),
      enabled: isCoffee,
    },
  });
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
        queryClient.invalidateQueries({ queryKey: getGetCattleDogCoffeeProfitQueryKey() }),
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
      <section className="profit-loss-card data-chart-panel" aria-labelledby="profit-loss-title" data-testid="card-profit-loss">
        <h3 className="todo-group-title" id="profit-loss-title">Profit &amp; loss</h3>
        {profitQuery.isLoading ? (
          <p className="task-state-message" role="status" data-testid="status-profit-loss-loading">Loading…</p>
        ) : profitQuery.isError ? (
          <p className="data-error" role="alert" data-testid="error-profit-loss">
            {serverErrorText(profitQuery.error, 'Unable to load profit summary.')}
          </p>
        ) : profitQuery.data ? (
          <>
            <div className="profit-loss-table-wrap">
              <table className="profit-loss-table">
                <thead>
                  <tr>
                    <th scope="col" aria-label="Metric"></th>
                    <th scope="col">Last 30 days</th>
                    <th scope="col">All time</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">Orders</th>
                    <td>{new Intl.NumberFormat('en-AU').format(profitQuery.data.last30d.orderCount)}</td>
                    <td>{new Intl.NumberFormat('en-AU').format(profitQuery.data.allTime.orderCount)}</td>
                  </tr>
                  <tr>
                    <th scope="row">Sales incl. shipping</th>
                    <td>{formatCurrencyCents(profitQuery.data.last30d.grossRevenueCents, 'AUD')}</td>
                    <td>{formatCurrencyCents(profitQuery.data.allTime.grossRevenueCents, 'AUD')}</td>
                  </tr>
                  <tr>
                    <th scope="row">Coffee</th>
                    <td>{profitQuery.data.last30d.estimatedCoffeeCostCents === null ? '—' : <><span aria-hidden="true">{profitQuery.data.last30d.estimatedCoffeeCostCents > 0 ? '−' : ''}</span>{formatCurrencyCents(profitQuery.data.last30d.estimatedCoffeeCostCents, 'AUD')}</>}</td>
                    <td>{profitQuery.data.allTime.estimatedCoffeeCostCents === null ? '—' : <><span aria-hidden="true">{profitQuery.data.allTime.estimatedCoffeeCostCents > 0 ? '−' : ''}</span>{formatCurrencyCents(profitQuery.data.allTime.estimatedCoffeeCostCents, 'AUD')}</>}</td>
                  </tr>
                  <tr>
                    <th scope="row">Bags &amp; labels</th>
                    <td><span aria-hidden="true">{profitQuery.data.last30d.estimatedBagCostCents > 0 ? '−' : ''}</span>{formatCurrencyCents(profitQuery.data.last30d.estimatedBagCostCents, 'AUD')}</td>
                    <td><span aria-hidden="true">{profitQuery.data.allTime.estimatedBagCostCents > 0 ? '−' : ''}</span>{formatCurrencyCents(profitQuery.data.allTime.estimatedBagCostCents, 'AUD')}</td>
                  </tr>
                  <tr>
                    <th scope="row">Satchels</th>
                    <td><span aria-hidden="true">{profitQuery.data.last30d.estimatedSatchelCostCents > 0 ? '−' : ''}</span>{formatCurrencyCents(profitQuery.data.last30d.estimatedSatchelCostCents, 'AUD')}</td>
                    <td><span aria-hidden="true">{profitQuery.data.allTime.estimatedSatchelCostCents > 0 ? '−' : ''}</span>{formatCurrencyCents(profitQuery.data.allTime.estimatedSatchelCostCents, 'AUD')}</td>
                  </tr>
                  <tr>
                    <th scope="row">Stripe fees, estimated</th>
                    <td><span aria-hidden="true">{profitQuery.data.last30d.estimatedStripeFeeCents > 0 ? '−' : ''}</span>{formatCurrencyCents(profitQuery.data.last30d.estimatedStripeFeeCents, 'AUD')}</td>
                    <td><span aria-hidden="true">{profitQuery.data.allTime.estimatedStripeFeeCents > 0 ? '−' : ''}</span>{formatCurrencyCents(profitQuery.data.allTime.estimatedStripeFeeCents, 'AUD')}</td>
                  </tr>
                  <tr>
                    <th scope="row">RSPCA, $1 per bag</th>
                    {[profitQuery.data.last30d, profitQuery.data.allTime].map((period, index) => (
                      <td key={index}>
                        <span aria-hidden="true">{period.charityCents > 0 ? '−' : ''}</span>
                        {formatCurrencyCents(period.charityCents, 'AUD')}
                        <small className="profit-loss-bag-count">{new Intl.NumberFormat('en-AU').format(period.bagCount)} bags</small>
                      </td>
                    ))}
                  </tr>
                  <tr className="profit-loss-net-row">
                    <th scope="row">Net profit</th>
                    {[profitQuery.data.last30d, profitQuery.data.allTime].map((period, index) => (
                      <td key={index}>
                        <strong className={period.netProfitCents !== null && period.netProfitCents < 0 ? 'profit-loss-net-negative' : undefined}>
                          {period.netProfitCents === null ? '—' : formatCurrencyCents(period.netProfitCents, 'AUD')}
                        </strong>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
            {profitQuery.data.last30d.netProfitCents === null && (
              <p className="profit-loss-warning" role="status" data-testid="warning-profit-loss-missing-cost">
                Missing coffee cost for: {profitQuery.data.last30d.missingUnitCostProducts.join(', ')}
              </p>
            )}
            {profitQuery.data.allTime.netProfitCents === null && (
              <p className="profit-loss-warning" role="status" data-testid="warning-profit-loss-missing-cost-all-time">
                Missing coffee cost for: {profitQuery.data.allTime.missingUnitCostProducts.join(', ')}
              </p>
            )}
            <p className="profit-loss-footnote" data-testid="text-profit-loss-source">
              Includes in-person sales. Stripe fees are estimated. Source: Cattle Dog Coffee store, updated {formatBrisbaneDateTime(profitQuery.data.generatedAt)}.
            </p>
          </>
        ) : null}
      </section>
    </div>
  );
}

export function FinanceFleetWorkspace() {
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

export function FinanceTradingHealth() {
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

export function CustomerWorkspace({ slug }: { slug: string }) {
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
