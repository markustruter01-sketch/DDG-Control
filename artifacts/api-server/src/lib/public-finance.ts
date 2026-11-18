import type { GetPublicFinanceResponse } from '@workspace/api-zod';
import { db, fleetBotSnapshotsTable, fleetSnapshotDetailsTable, fleetSnapshotsTable } from '@workspace/db';
import { asc, desc, gte, inArray, sql } from 'drizzle-orm';
import type { z } from 'zod';

/**
 * The public DDG Finance numbers (ddg.limited/finance). Built only from the trading
 * platform's hourly push (fleet snapshots), so the public site adds no way into the
 * trading system. Shows equity, returns and holdings by group; never account ids,
 * orders, stops, keys or alarms.
 */
export type PublicFinance = z.infer<typeof GetPublicFinanceResponse>;

/** First day of the public track record (Brisbane). Returns count from the first push on or after it. */
export const RECORD_START = '2027-01-01';
const BRISBANE_OFFSET = '+10:00';
export const recordStartInstant = () => new Date(`${RECORD_START}T00:00:00${BRISBANE_OFFSET}`);
/** The S&P 500 benchmark is measured from the last close before the record starts. */
export const BENCHMARK_BASE_DATE = '2026-12-31';
const LIVE_WITHIN_MS = 2 * 60 * 60_000;
const REHEARSAL_DAYS = 120;

/** Internal account id -> public name key. Accounts not listed are never shown. */
export const PUBLIC_BOT_KEYS: Record<string, string> = {
  oracle: 'atlas',
  jerome_macro: 'atlas-v2',
  spy_qqq_trend: 'momentum',
  forex_ai: 'forex',
};

type BotRow = {
  bot_id: string; equity_cents: number; paused: boolean;
  /** Rehearsal figures from the same push (optional: older test fixtures leave them out). */
  starting_cents?: number; pnl_cents?: number; open_positions?: number; stale?: boolean;
};
type Holding = { bot_id: string; label: string; pct: number };
type Benchmark = { symbol: string; base_date: string; as_of: string; total_return_pct: number };
export type Snapshot = { generated_at: Date; bots: BotRow[]; holdings?: Holding[]; benchmark?: Benchmark | null };

const pct = (value: number) => Math.round(value * 100) / 100;
const growth = (now: number, base: number) => pct((now / base - 1) * 100);
const utcDate = (d: Date) => d.toISOString().slice(0, 10);

function validBenchmark(b: Benchmark | null | undefined): b is Benchmark {
  return !!b && b.base_date === BENCHMARK_BASE_DATE && Number.isFinite(b.total_return_pct);
}

/** Pure: everything the public page shows, from the latest snapshot, the first one in the record and one per day. */
export function buildPublicFinance(input: {
  now: Date;
  latest: Snapshot | null;
  baseline: Snapshot | null;
  daily: Snapshot[];
  /** The last push of each of the most recent days, for the rehearsal chart (any date). */
  recent?: Snapshot[];
}): PublicFinance {
  const { now, latest, baseline, daily } = input;
  const started = now >= recordStartInstant() && baseline !== null;
  const base = new Map((started ? baseline!.bots : []).filter((b) => b.equity_cents > 0).map((b) => [b.bot_id, b.equity_cents]));
  const shown = (bots: BotRow[]) => bots.filter((b) => PUBLIC_BOT_KEYS[b.bot_id] !== undefined);

  const fleetPct = (bots: BotRow[]): number | null => {
    const inRecord = shown(bots).filter((b) => base.has(b.bot_id));
    const baseSum = inRecord.reduce((sum, b) => sum + base.get(b.bot_id)!, 0);
    return inRecord.length === 0 || baseSum <= 0 ? null : growth(inRecord.reduce((sum, b) => sum + b.equity_cents, 0), baseSum);
  };

  const latestBots = latest ? shown(latest.bots) : [];
  const benchmarks = [...daily, ...(latest ? [latest] : [])].map((s) => s.benchmark).filter(validBenchmark);
  const latestBenchmark = started && latest && validBenchmark(latest.benchmark) ? latest.benchmark : null;

  const series = started
    ? daily
        .filter((s) => s.generated_at >= recordStartInstant())
        .map((s) => {
          const date = utcDate(s.generated_at);
          const spy = benchmarks.filter((b) => b.as_of <= date).sort((a, b) => a.as_of.localeCompare(b.as_of)).at(-1);
          const fleet = fleetPct(s.bots);
          return fleet === null
            ? null
            : {
                date,
                fleet_pct: fleet,
                sp500_pct: spy ? pct(spy.total_return_pct) : null,
                bots: shown(s.bots).filter((b) => base.has(b.bot_id)).map((b) => ({ key: PUBLIC_BOT_KEYS[b.bot_id]!, pct: growth(b.equity_cents, base.get(b.bot_id)!) })),
              };
        })
        .filter((p): p is NonNullable<typeof p> => p !== null)
    : [];

  return {
    updated_at: now,
    data_as_of: latest?.generated_at ?? null,
    live: !!latest && now.getTime() - latest.generated_at.getTime() < LIVE_WITHIN_MS,
    record_start: RECORD_START,
    record_started: started,
    fleet_equity_usd: latest ? Math.round(latestBots.reduce((sum, b) => sum + b.equity_cents, 0)) / 100 : null,
    fleet_return_pct: started && latest ? fleetPct(latest.bots) : null,
    sp500_return_pct: latestBenchmark ? pct(latestBenchmark.total_return_pct) : null,
    sp500_as_of: latestBenchmark?.as_of ?? null,
    bots: latestBots.map((b) => ({
      key: PUBLIC_BOT_KEYS[b.bot_id]!,
      equity_usd: b.equity_cents / 100,
      return_pct: started && base.has(b.bot_id) ? growth(b.equity_cents, base.get(b.bot_id)!) : null,
      paused: b.paused,
      holdings: (latest?.holdings ?? []).filter((h) => h.bot_id === b.bot_id).map((h) => ({ label: h.label, pct: h.pct })),
    })),
    series,
    rehearsal: latest ? rehearsalOf(latestBots, input.recent ?? []) : null,
  };
}

const dollars = (cents: number) => Math.round(cents) / 100;
const sumOf = (rows: BotRow[], pick: (b: BotRow) => number | undefined) =>
  rows.every((b) => typeof pick(b) === 'number') ? rows.reduce((sum, b) => sum + pick(b)!, 0) : null;

/**
 * The paper rehearsal as it stands now: what the dashboard shows, view only. Profit and loss is the
 * platform's own figure since each bot started; the chart uses profit, not equity, so an account
 * joining the fleet is not drawn as a gain.
 */
function rehearsalOf(bots: BotRow[], recent: Snapshot[]): NonNullable<PublicFinance['rehearsal']> {
  const shownBots = bots.filter((b) => PUBLIC_BOT_KEYS[b.bot_id] !== undefined);
  const start = sumOf(shownBots, (b) => b.starting_cents);
  const pnl = sumOf(shownBots, (b) => b.pnl_cents);
  return {
    equity_usd: dollars(shownBots.reduce((sum, b) => sum + b.equity_cents, 0)),
    starting_usd: start === null ? null : dollars(start),
    pnl_usd: pnl === null ? null : dollars(pnl),
    pnl_pct: pnl === null || start === null || start <= 0 ? null : pct((pnl / start) * 100),
    bots: shownBots.map((b) => ({
      key: PUBLIC_BOT_KEYS[b.bot_id]!,
      equity_usd: dollars(b.equity_cents),
      starting_usd: typeof b.starting_cents === 'number' ? dollars(b.starting_cents) : null,
      pnl_usd: typeof b.pnl_cents === 'number' ? dollars(b.pnl_cents) : null,
      pnl_pct: typeof b.pnl_cents === 'number' && typeof b.starting_cents === 'number' && b.starting_cents > 0 ? pct((b.pnl_cents / b.starting_cents) * 100) : null,
      open_positions: typeof b.open_positions === 'number' ? b.open_positions : null,
      stale: b.stale === true,
      paused: b.paused,
    })),
    series: recent
      .map((s) => {
        const rows = s.bots.filter((b) => PUBLIC_BOT_KEYS[b.bot_id] !== undefined);
        const p = sumOf(rows, (b) => b.pnl_cents);
        return rows.length === 0 || p === null ? null : { date: utcDate(s.generated_at), pnl_usd: dollars(p) };
      })
      .filter((p): p is { date: string; pnl_usd: number } => p !== null),
  };
}

async function loadSnapshots(ids: number[]): Promise<Map<number, { bots: BotRow[]; holdings?: Holding[]; benchmark?: Benchmark | null }>> {
  const out = new Map<number, { bots: BotRow[]; holdings?: Holding[]; benchmark?: Benchmark | null }>();
  if (ids.length === 0) return out;
  for (const id of ids) out.set(id, { bots: [] });
  const bots = await db
    .select({ snapshot_id: fleetBotSnapshotsTable.snapshot_id, bot_id: fleetBotSnapshotsTable.bot_id, equity_cents: fleetBotSnapshotsTable.equity_cents, paused: fleetBotSnapshotsTable.paused, starting_cents: fleetBotSnapshotsTable.starting_cents, pnl_cents: fleetBotSnapshotsTable.pnl_cents, open_positions: fleetBotSnapshotsTable.open_positions, stale: fleetBotSnapshotsTable.stale })
    .from(fleetBotSnapshotsTable)
    .where(inArray(fleetBotSnapshotsTable.snapshot_id, ids));
  for (const b of bots) out.get(b.snapshot_id)!.bots.push({ bot_id: b.bot_id, equity_cents: b.equity_cents, paused: b.paused, starting_cents: b.starting_cents, pnl_cents: b.pnl_cents, open_positions: b.open_positions, stale: b.stale });
  const details = await db
    .select({ snapshot_id: fleetSnapshotDetailsTable.snapshot_id, detail: fleetSnapshotDetailsTable.detail })
    .from(fleetSnapshotDetailsTable)
    .where(inArray(fleetSnapshotDetailsTable.snapshot_id, ids));
  for (const d of details) {
    const detail = d.detail as { holdings?: Holding[]; benchmark?: Benchmark | null };
    const entry = out.get(d.snapshot_id)!;
    entry.holdings = detail.holdings;
    entry.benchmark = detail.benchmark ?? null;
  }
  return out;
}

export async function computePublicFinance(now = new Date()): Promise<PublicFinance> {
  const [latestRow] = await db.select({ id: fleetSnapshotsTable.id, generated_at: fleetSnapshotsTable.generated_at }).from(fleetSnapshotsTable).orderBy(desc(fleetSnapshotsTable.generated_at)).limit(1);
  const start = recordStartInstant();
  const [baseRow] = now >= start
    ? await db.select({ id: fleetSnapshotsTable.id, generated_at: fleetSnapshotsTable.generated_at }).from(fleetSnapshotsTable).where(gte(fleetSnapshotsTable.generated_at, start)).orderBy(asc(fleetSnapshotsTable.generated_at)).limit(1)
    : [];
  // The last push of each UTC day: after the US close, so it carries that session's closing equity.
  const dailyRows = now >= start
    ? ((await db.execute(sql`
        SELECT DISTINCT ON ((generated_at AT TIME ZONE 'UTC')::date) id, generated_at
        FROM fleet_snapshots WHERE generated_at >= ${start.toISOString()}
        ORDER BY (generated_at AT TIME ZONE 'UTC')::date, generated_at DESC`)).rows as Array<{ id: number; generated_at: string | Date }>)
    : [];
  // The rehearsal chart: the last push of each UTC day over the past 120 days.
  const since = new Date(now.getTime() - REHEARSAL_DAYS * 86_400_000);
  const recentRows = (await db.execute(sql`
      SELECT DISTINCT ON ((generated_at AT TIME ZONE 'UTC')::date) id, generated_at
      FROM fleet_snapshots WHERE generated_at >= ${since.toISOString()}
      ORDER BY (generated_at AT TIME ZONE 'UTC')::date, generated_at DESC`)).rows as Array<{ id: number; generated_at: string | Date }>;
  const ids = [...new Set([latestRow?.id, baseRow?.id, ...dailyRows.map((r) => r.id), ...recentRows.map((r) => Number(r.id))].filter((id): id is number => typeof id === 'number'))];
  const loaded = await loadSnapshots(ids);
  const snap = (id: number, at: string | Date): Snapshot => ({ generated_at: new Date(at), ...loaded.get(id)! });
  return buildPublicFinance({
    now,
    latest: latestRow ? snap(latestRow.id, latestRow.generated_at) : null,
    baseline: baseRow ? snap(baseRow.id, baseRow.generated_at) : null,
    daily: dailyRows.map((r) => snap(Number(r.id), r.generated_at)),
    recent: recentRows.map((r) => snap(Number(r.id), r.generated_at)),
  });
}
