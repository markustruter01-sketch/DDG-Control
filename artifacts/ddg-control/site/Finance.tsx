import { type ReactElement } from 'react';
import type { PublicFinance, PublicFinancePoint } from '@workspace/api-client-react';
import { daysUntil } from '@/lib/money';
import { usePublicFinance } from './hooks';
import {
  FINANCE_BOTS, FINANCE_FINE_PRINT, FINANCE_HOLDINGS_NOTE, FINANCE_HOW, FINANCE_LINEUP_NOTE, FINANCE_PAGE, FINANCE_PAPER, type FinanceBotKey,
} from './content';

// ddg.limited/finance: DDG Finance in public. Every number comes from /api/public/finance
// (the trading platform's hourly push); "—" until loaded, never a guess.

const signed = (n: number | null | undefined) => (n === null || n === undefined ? '—' : `${n > 0 ? '+' : ''}${n.toFixed(2)}%`);
const usd = (n: number | null | undefined) => (n === null || n === undefined ? '—' : `$${Math.round(n).toLocaleString('en-AU')}`);
const brisbaneTime = (iso: string | Date | null) =>
  iso ? new Date(iso).toLocaleString('en-AU', { timeZone: 'Australia/Brisbane', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }) : '—';
const longDate = (ymd: string) => new Date(`${ymd}T00:00:00+10:00`).toLocaleDateString('en-AU', { timeZone: 'Australia/Brisbane', day: 'numeric', month: 'long', year: 'numeric' });

/** Fleet vs S&P 500, % since the record start. Plain SVG; scales to its box. */
function PerformanceChart({ series }: { series: PublicFinancePoint[] }) {
  const W = 800, H = 260, PAD = 8;
  const values = series.flatMap((p) => [p.fleet_pct, ...(p.sp500_pct === null ? [] : [p.sp500_pct])]);
  const lo = Math.min(0, ...values), hi = Math.max(0, ...values);
  const span = hi - lo || 1;
  const x = (i: number) => PAD + (series.length <= 1 ? 0 : (i / (series.length - 1)) * (W - 2 * PAD));
  const y = (v: number) => PAD + (1 - (v - lo) / span) * (H - 2 * PAD);
  const line = (pick: (p: PublicFinancePoint) => number | null) =>
    series.map((p, i) => { const v = pick(p); return v === null ? '' : `${x(i).toFixed(1)},${y(v).toFixed(1)}`; }).filter(Boolean).join(' ');
  return (
    <figure className="f-chart">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" role="img"
        aria-label={`DDG Finance ${signed(series.at(-1)?.fleet_pct)} against the S&P 500 ${signed(series.at(-1)?.sp500_pct)} since the record started`}>
        <line x1={PAD} x2={W - PAD} y1={y(0)} y2={y(0)} className="f-zero" />
        <polyline points={line((p) => p.sp500_pct)} className="f-line f-line-spx" />
        <polyline points={line((p) => p.fleet_pct)} className="f-line f-line-ddg" />
      </svg>
      <figcaption>
        <span><i className="f-key f-key-ddg" />DDG Finance (all four bots)</span>
        <span><i className="f-key f-key-spx" />S&amp;P 500 (SPY, dividends included)</span>
        <span>{series[0]?.date} → {series.at(-1)?.date}</span>
      </figcaption>
    </figure>
  );
}

function Record({ data }: { data: PublicFinance | null }) {
  const start = data?.record_start ?? '2027-01-01';
  if (!data?.record_started) {
    const days = daysUntil(start);
    return (
      <section className="f-record s-card f-glass" aria-labelledby="f-record-title">
        <p className="s-stat"><b>{days > 0 ? days : '—'}</b><span>Days until the public record starts</span></p>
        <h2 id="f-record-title">The record starts on {longDate(start)}.</h2>
        <p>From then, this page shows every bot’s result against the S&amp;P 500, updated every hour. Until then the bots are running a rehearsal, so the numbers that count haven’t started yet.</p>
      </section>
    );
  }
  const ahead = data.fleet_return_pct !== null && data.sp500_return_pct !== null ? data.fleet_return_pct - data.sp500_return_pct : null;
  return (
    <section className="f-record s-card f-glass" aria-labelledby="f-record-title">
      <h2 id="f-record-title" className="f-sr">Performance since {longDate(start)}</h2>
      <div className="f-numbers">
        <p className="s-stat"><b>{signed(data.fleet_return_pct)}</b><span>DDG Finance since {longDate(start)}</span></p>
        <p className="s-stat"><b>{signed(data.sp500_return_pct)}</b><span>S&amp;P 500 over the same dates</span></p>
        <p className="s-stat"><b>{ahead === null ? '—' : `${ahead > 0 ? '+' : ''}${ahead.toFixed(2)} pts`}</b><span>{ahead === null ? 'Ahead or behind' : ahead >= 0 ? 'Ahead of the S&P 500' : 'Behind the S&P 500'}</span></p>
        <p className="s-stat"><b>{usd(data.fleet_equity_usd)}</b><span>Combined accounts (US$)</span></p>
      </div>
      {data.series.length > 1 && <PerformanceChart series={data.series} />}
    </section>
  );
}

function Bots({ data }: { data: PublicFinance | null }) {
  const byKey = new Map((data?.bots ?? []).map((b) => [b.key as FinanceBotKey, b]));
  return (
    <section aria-labelledby="f-bots-title">
      <h2 id="f-bots-title">The four bots</h2>
      <div className="f-bots">
        {FINANCE_BOTS.map((bot) => {
          const live = byKey.get(bot.key);
          return (
            <article key={bot.key} className="s-card f-glass f-bot">
              <div className="s-card-top"><h3>{bot.name}</h3><span className="s-status">{live?.paused ? 'Paused' : bot.broker}</span></div>
              <p>{bot.line}</p>
              {data?.record_started && (
                <p className="f-bot-stat"><b>{signed(live?.return_pct)}</b><span>{usd(live?.equity_usd)} account (US$)</span></p>
              )}
              <p className="f-hold-title">Holding now</p>
              {live && live.holdings.length > 0 ? (
                <ul className="f-holdings">
                  {live.holdings.map((h) => (
                    <li key={h.label}>
                      <span>{h.label}</span>
                      <span className="f-bar" aria-hidden="true"><i style={{ width: `${Math.min(100, Math.abs(h.pct))}%` }} className={h.pct < 0 ? 'f-neg' : ''} /></span>
                      <b>{h.pct.toFixed(1)}%</b>
                    </li>
                  ))}
                </ul>
              ) : <p className="s-note">{data ? 'Not reported yet.' : '—'}</p>}
            </article>
          );
        })}
      </div>
      <p className="s-note f-after">{FINANCE_LINEUP_NOTE} {FINANCE_HOLDINGS_NOTE}</p>
    </section>
  );
}

export function FinancePage({ Nav, Footer }: { Nav: () => ReactElement; Footer: () => ReactElement }) {
  const { data, failed } = usePublicFinance();
  return (
    <div className="s-plain dusk">
      <Nav />
      <main className="s-main f-main">
        <header className="f-head">
          <p className="s-eyebrow">{FINANCE_PAGE.eyebrow}</p>
          <h1 className="s-page-title">{FINANCE_PAGE.title}</h1>
          <p className="s-lead">{FINANCE_PAGE.lead}</p>
          <p className="f-live">
            <span className={`f-pulse ${data?.live ? 'on' : ''}`} />
            {failed ? 'Live numbers are unavailable right now.' : data ? `${data.live ? 'Live' : 'Last update'} · ${brisbaneTime(data.data_as_of)} Brisbane` : 'Loading live numbers…'}
          </p>
        </header>
        <Record data={data} />
        <Bots data={data} />
        <section aria-labelledby="f-how-title">
          <h2 id="f-how-title">How it works</h2>
          <ol className="s-steps f-how">
            {FINANCE_HOW.map((step, i) => (
              <li key={step.title} className="s-card f-glass"><span className="s-status">{String(i + 1).padStart(2, '0')}</span><h3>{step.title}</h3><p>{step.line}</p></li>
            ))}
          </ol>
        </section>
        <section className="s-card f-glass f-paper" aria-labelledby="f-paper-title">
          <h2 id="f-paper-title">{FINANCE_PAPER.title}</h2>
          <p>{FINANCE_PAPER.line}</p>
          <p className="s-status"><span className="s-dot" />{FINANCE_PAPER.status}</p>
        </section>
        <section aria-labelledby="f-fine-title">
          <h2 id="f-fine-title">Read this too</h2>
          <ul className="f-fine">{FINANCE_FINE_PRINT.map((line) => <li key={line}>{line}</li>)}</ul>
          <p className="s-note">{FINANCE_PAGE.note}</p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
