import { GetOverviewResponse } from '@workspace/api-zod';
import { db, expensesTable, projectsTable, revenueEntriesTable, socialSnapshotsTable } from '@workspace/db';
import { desc, eq, sql } from 'drizzle-orm';
import { Router, type IRouter } from 'express';
import { getCattleDogCoffeeProfit } from '../lib/cdc-store';

const router: IRouter = Router();
const COFFEE = 'cattle-dog-coffee';

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
 * Charity = the Coffee store's per-bag RSPCA contribution.
 * If a part can't be read, it and everything built on it is null — never guessed.
 */
export async function computeOverview() {
  const [projects, spent, ledger, social, store] = await Promise.all([
    db.select({ id: projectsTable.id, slug: projectsTable.slug }).from(projectsTable),
    db.select({ total: sql<string>`coalesce(sum(${expensesTable.amount_cents}), 0)` }).from(expensesTable)
      .where(eq(expensesTable.kind, 'one_off')),
    db.select({ project_id: revenueEntriesTable.project_id, total: sql<string>`coalesce(sum(${revenueEntriesTable.amount_cents}), 0)` })
      .from(revenueEntriesTable).groupBy(revenueEntriesTable.project_id),
    db.select().from(socialSnapshotsTable).orderBy(desc(socialSnapshotsTable.captured_on), desc(socialSnapshotsTable.id)).limit(1000),
    getCattleDogCoffeeProfit(),
  ]);

  const slugOf = new Map(projects.map((p) => [p.id, p.slug]));
  const notes: string[] = [];
  const expenses = toCents(spent[0]?.total ?? 0);
  const ledgerRevenue = ledger
    .filter((row) => row.project_id === null || slugOf.get(row.project_id) !== COFFEE)
    .reduce((sum, row) => sum + toCents(row.total), 0);

  let gross: number | null = null;
  let charity: number | null = null;
  if (store.ok) {
    gross = ledgerRevenue + store.data.allTime.grossRevenueCents;
    charity = store.data.allTime.charityCents;
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
      captured_on: days[0] ?? null,
    };
  });

  return GetOverviewResponse.parse({
    read_at: new Date().toISOString(),
    money: {
      expenses_cents: expenses, gross_revenue_cents: gross, debt_cents: debt, charity_cents: charity, net_cents: net,
      donated_via_link_cents: null, coffee_store: store.ok ? 'ok' : 'unavailable', notes,
    },
    social: {
      followers: total(platforms.map((p) => p.followers)),
      views_30d: total(platforms.map((p) => p.views_30d)),
      likes_30d: total(platforms.map((p) => p.likes_30d)),
      platforms,
    },
  });
}

router.get('/overview', async (_req, res): Promise<void> => {
  res.setHeader('Cache-Control', 'private, no-store');
  res.json(await computeOverview());
});

export default router;
