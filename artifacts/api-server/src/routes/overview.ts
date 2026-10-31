import { GetOverviewResponse } from '@workspace/api-zod';
import { db, expensesTable, fleetBotSnapshotsTable, fleetSnapshotsTable, projectsTable, revenueEntriesTable, socialSnapshotsTable } from '@workspace/db';
import { and, desc, eq, gte, sql } from 'drizzle-orm';
import { Router, type IRouter } from 'express';
import { getCattleDogCoffeeProfit } from '../lib/cdc-store';
import { CHARITY, revenueShareCents } from '../lib/charity';
import { getHypestSummary } from '../lib/hypest-store';

const router: IRouter = Router();
const COFFEE = 'cattle-dog-coffee';
const CREATIVE = 'ddg-music'; // the Creative business's database name

const toCents = (value: bigint | string | number | null): number => {
  const n = Number(value ?? 0);
  if (!Number.isSafeInteger(n)) throw new Error('Amount outside safe range');
  return n;
};

const PLATFORMS = ['youtube', 'instagram', 'facebook', 'x', 'tiktok'] as const;

/**
 * The home-screen equation, all time, AUD cents:
 *   expenses − gross revenue = debt,   gross revenue − expenses − charity = net profit.
 * Expenses = one-off payments recorded in Money (recurring rows are forecasts, not payments).
 * Gross revenue = Money's revenue ledger (Coffee rows excluded) + the Coffee store's own total, so Coffee is never counted twice.
 * Charity = the Coffee store's $1-per-bag RSPCA contribution + 1% of every other business's
 *   revenue received from CHARITY.revenueShareFrom (lib/charity.ts).
 * If a part can't be read, it and everything built on it is null — never guessed.
 */
export async function computeOverview() {
  const [projects, spent, ledger, ledgerSinceShare, social, store, fleet, hypest] = await Promise.all([
    db.select({ id: projectsTable.id, slug: projectsTable.slug }).from(projectsTable),
    db.select({ total: sql<string>`coalesce(sum(${expensesTable.amount_cents}), 0)` }).from(expensesTable)
      .where(eq(expensesTable.kind, 'one_off')),
    db.select({ project_id: revenueEntriesTable.project_id, total: sql<string>`coalesce(sum(${revenueEntriesTable.amount_cents}), 0)` })
      .from(revenueEntriesTable).groupBy(revenueEntriesTable.project_id),
    db.select({ project_id: revenueEntriesTable.project_id, total: sql<string>`coalesce(sum(${revenueEntriesTable.amount_cents}), 0)` })
      .from(revenueEntriesTable).where(and(gte(revenueEntriesTable.received_on, CHARITY.revenueShareFrom)))
      .groupBy(revenueEntriesTable.project_id),
    db.select().from(socialSnapshotsTable).orderBy(desc(socialSnapshotsTable.captured_on), desc(socialSnapshotsTable.id)).limit(1000),
    getCattleDogCoffeeProfit(),
    db.select().from(fleetSnapshotsTable).orderBy(desc(fleetSnapshotsTable.generated_at)).limit(1),
    getHypestSummary(),
  ]);
  const fleetBots = fleet[0]
    ? await db.select().from(fleetBotSnapshotsTable).where(eq(fleetBotSnapshotsTable.snapshot_id, fleet[0].id)).orderBy(fleetBotSnapshotsTable.bot_id)
    : [];

  const slugOf = new Map(projects.map((p) => [p.id, p.slug]));
  const notes: string[] = [];
  const expenses = toCents(spent[0]?.total ?? 0);
  const ledgerRevenue = ledger
    .filter((row) => row.project_id === null || slugOf.get(row.project_id) !== COFFEE)
    .reduce((sum, row) => sum + toCents(row.total), 0);

  // 1% of every non-Coffee business's revenue from the start date (Coffee gives $1 a bag instead).
  const shareBase = ledgerSinceShare
    .filter((row) => row.project_id === null || slugOf.get(row.project_id) !== COFFEE)
    .reduce((sum, row) => sum + toCents(row.total), 0);
  const charityShare = revenueShareCents(shareBase);

  let gross: number | null = null;
  let charity: number | null = null;
  let charityCoffee: number | null = null;
  if (store.ok) {
    gross = ledgerRevenue + store.data.allTime.grossRevenueCents;
    charityCoffee = store.data.allTime.charityCents;
    charity = charityCoffee + charityShare;
  } else {
    notes.push(`Coffee store not reachable (${store.error}), so revenue, debt, charity and net profit are hidden.`);
  }
  const debt = gross === null ? null : expenses - gross;
  const net = gross === null || charity === null ? null : gross - expenses - charity;

  // Latest reading per business + platform, then summed per platform across businesses.
  const latest = new Map<string, (typeof social)[number]>();
  for (const row of social) {
    const key = `${row.project_id}:${row.platform}`;
    if (!latest.has(key)) latest.set(key, row);
  }
  const rows = [...latest.values()];
  const total = (values: Array<number | null>) => {
    const known = values.filter((v): v is number => v !== null);
    return known.length ? known.reduce((a, b) => a + b, 0) : null;
  };
  const platforms = PLATFORMS.map((platform) => {
    const mine = rows.filter((r) => r.platform === platform);
    const days = mine.map((r) => r.captured_on).sort();
    return {
      platform,
      followers: total(mine.map((r) => r.followers)),
      views_30d: total(mine.map((r) => r.impressions_30d)),
      likes_30d: total(mine.map((r) => r.engagements_30d)),
      views_all_time: total(mine.map((r) => r.views_all_time)),
      likes_all_time: total(mine.map((r) => r.likes_all_time)),
      captured_on: days[0] ?? null,
    };
  });

  const creativeId = projects.find((p) => p.slug === CREATIVE)?.id;
  const creativeRevenue = toCents(ledger.find((row) => creativeId !== undefined && row.project_id === creativeId)?.total ?? 0);
  const creativeFollowers = total(rows.filter((r) => r.project_id === creativeId).map((r) => r.followers));
  const snap = fleet[0];

  return GetOverviewResponse.parse({
    read_at: new Date().toISOString(),
    money: {
      expenses_cents: expenses, gross_revenue_cents: gross, debt_cents: debt, charity_cents: charity, net_cents: net,
      charity_coffee_cents: charityCoffee, charity_revenue_share_cents: charityShare,
      donated_via_link_cents: null, coffee_store: store.ok ? 'ok' : 'unavailable', notes,
    },
    social: {
      followers: total(platforms.map((p) => p.followers)),
      views_30d: total(platforms.map((p) => p.views_30d)),
      likes_30d: total(platforms.map((p) => p.likes_30d)),
      views_all_time: total(platforms.map((p) => p.views_all_time)),
      likes_all_time: total(platforms.map((p) => p.likes_all_time)),
      platforms,
    },
    businesses: {
      finance: snap ? {
        as_of: snap.generated_at.toISOString(), mode: snap.mode,
        total_equity_cents: snap.total_equity_cents, total_starting_cents: snap.total_starting_cents,
        bots: fleetBots.map((b) => ({ bot_id: b.bot_id, equity_cents: b.equity_cents, starting_cents: b.starting_cents, paused: b.paused, stale: b.stale })),
      } : null,
      coffee: store.ok ? {
        bags_sold: store.data.allTime.bagCount, charity_cents: store.data.allTime.charityCents,
        revenue_cents: store.data.allTime.grossRevenueCents, subscribers: store.data.activeSubscribers,
      } : null,
      fitness: hypest ? {
        plan_purchases: hypest.planPurchases, subscribers: hypest.activeSubscribers, monthly_recurring_cents: hypest.monthlyRecurringCents,
      } : null,
      creative: { followers: creativeFollowers, revenue_cents: creativeRevenue },
    },
  });
}

router.get('/overview', async (_req, res): Promise<void> => {
  res.setHeader('Cache-Control', 'private, no-store');
  res.json(await computeOverview());
});

export default router;
