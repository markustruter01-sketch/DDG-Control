// Public DDG Finance numbers (ddg.limited/finance). Pure; no database.
// Run: npx tsx src/test-public-finance.ts
import assert from 'node:assert/strict';
import { buildPublicFinance, recordStartInstant, type Snapshot } from './lib/public-finance';

const at = (iso: string) => new Date(iso);
const bots = (atlas: number, momentum: number, extra = 0) => [
  { bot_id: 'oracle', equity_cents: atlas, paused: false },
  { bot_id: 'spy_qqq_trend', equity_cents: momentum, paused: false },
  ...(extra ? [{ bot_id: 'secret_internal_bot', equity_cents: extra, paused: false }] : []),
];
const holdings = [{ bot_id: 'oracle', label: 'S&P 500', pct: 60 }, { bot_id: 'oracle', label: 'Cash', pct: 40 }, { bot_id: 'secret_internal_bot', label: 'X', pct: 100 }];

// Before the record starts: holdings and equity only; no returns, no series.
const pre: Snapshot = { generated_at: at('2026-11-12T08:00:00Z'), bots: bots(10_000_000, 9_000_000, 5), holdings };
const before = buildPublicFinance({ now: at('2026-11-12T09:00:00Z'), latest: pre, baseline: null, daily: [] });
assert.equal(before.record_started, false);
assert.equal(before.fleet_return_pct, null);
assert.equal(before.sp500_return_pct, null);
assert.deepEqual(before.series, []);
assert.equal(before.live, true);
assert.deepEqual(before.bots.map((b) => b.key), ['atlas', 'momentum'], 'unknown accounts are never shown');
assert.equal(before.fleet_equity_usd, 190_000);
assert.deepEqual(before.bots[0]!.holdings, [{ label: 'S&P 500', pct: 60 }, { label: 'Cash', pct: 40 }]);
assert.equal(before.bots[0]!.return_pct, null);
assert.ok(!JSON.stringify(before).includes('oracle') && !JSON.stringify(before).includes('secret_internal_bot'), 'no internal ids');

// Stale data: not live after 2 hours.
assert.equal(buildPublicFinance({ now: at('2026-11-12T11:00:00Z'), latest: pre, baseline: null, daily: [] }).live, false);

// After the start: returns from the first push of the record; S&P from the benchmark.
assert.equal(recordStartInstant().toISOString(), '2026-12-31T14:00:00.000Z');
const base: Snapshot = { generated_at: at('2026-12-31T14:05:00Z'), bots: bots(10_000_000, 10_000_000) };
const bench = (as_of: string, total_return_pct: number) => ({ symbol: 'SPY', base_date: '2026-12-31', as_of, total_return_pct });
const day1: Snapshot = { generated_at: at('2027-01-04T23:05:00Z'), bots: bots(10_100_000, 9_900_000), benchmark: bench('2027-01-04', 0.5) };
const day2: Snapshot = { generated_at: at('2027-01-05T23:05:00Z'), bots: bots(10_200_000, 10_300_000), benchmark: bench('2027-01-05', -0.25), holdings };
const wrongBase: Snapshot = { ...day2, benchmark: { ...bench('2027-01-05', 9), base_date: '2026-11-01' } };
const after = buildPublicFinance({ now: at('2027-01-06T00:00:00Z'), latest: day2, baseline: base, daily: [base, day1, day2] });
assert.equal(after.record_started, true);
assert.equal(after.fleet_return_pct, 2.5); // 20.5m / 20m
assert.equal(after.sp500_return_pct, -0.25);
assert.equal(after.sp500_as_of, '2027-01-05');
assert.deepEqual(after.bots.map((b) => [b.key, b.return_pct]), [['atlas', 2], ['momentum', 3]]);
assert.deepEqual(after.series.map((p) => [p.date, p.fleet_pct, p.sp500_pct]), [['2026-12-31', 0, null], ['2027-01-04', 0, 0.5], ['2027-01-05', 2.5, -0.25]]);
assert.deepEqual(after.series[2]!.bots, [{ key: 'atlas', pct: 2 }, { key: 'momentum', pct: 3 }]);
// A benchmark measured from the wrong start is ignored.
assert.equal(buildPublicFinance({ now: at('2027-01-06T00:00:00Z'), latest: wrongBase, baseline: base, daily: [base, wrongBase] }).sp500_return_pct, null);

console.log('test-public-finance: all checks passed');

// The rehearsal (view only): the platform's own P&L since each bot started; unknown accounts never shown.
const rb = (bot_id: string, equity: number, starting: number, pnl: number, open = 3) => ({ bot_id, equity_cents: equity, paused: false, starting_cents: starting, pnl_cents: pnl, open_positions: open, stale: false });
const r1: Snapshot = { generated_at: at('2026-11-10T23:05:00Z'), bots: [rb('oracle', 10_100_000, 10_000_000, 100_000), rb('secret_internal_bot', 1, 1, 0)] };
const r2: Snapshot = { generated_at: at('2026-11-11T23:05:00Z'), bots: [rb('oracle', 10_200_000, 10_000_000, 200_000), rb('forex_ai', 9_900_000, 10_000_000, -100_000, 0)] };
const reh = buildPublicFinance({ now: at('2026-11-12T00:00:00Z'), latest: r2, baseline: null, daily: [], recent: [r1, r2] }).rehearsal!;
assert.equal(reh.equity_usd, 201_000);
assert.equal(reh.starting_usd, 200_000);
assert.equal(reh.pnl_usd, 1_000);
assert.equal(reh.pnl_pct, 0.5);
assert.deepEqual(reh.bots.map((b) => [b.key, b.pnl_pct, b.open_positions]), [['atlas', 2, 3], ['forex', -1, 0]]);
assert.deepEqual(reh.series, [{ date: '2026-11-10', pnl_usd: 1_000 }, { date: '2026-11-11', pnl_usd: 1_000 }], 'P&L, so a joining account is not drawn as a gain');
assert.ok(!JSON.stringify(reh).includes('oracle') && !JSON.stringify(reh).includes('secret_internal_bot'), 'no internal ids in the rehearsal');
// Older pushes without P&L give nulls, never a guess.
assert.equal(buildPublicFinance({ now: at('2026-11-12T09:00:00Z'), latest: pre, baseline: null, daily: [] }).rehearsal!.pnl_usd, null);
assert.equal(buildPublicFinance({ now: at('2026-11-12T09:00:00Z'), latest: null, baseline: null, daily: [] }).rehearsal, null);
console.log('test-public-finance: rehearsal checks passed');
