import { db, debtsTable, expensesTable, revenueEntriesTable, metricSnapshotsV2Table, socialSnapshotsTable, projectsTable } from '@workspace/db';
import { and, desc, eq, gte, lte, sql } from 'drizzle-orm';
import { Router, type IRouter } from 'express';

const router: IRouter = Router();
type Point = { label: string; value: number };
type Card = { key: string; title: string; unit: 'aud_cents' | 'count'; value: number | null;
  bars: Point[]; note: string; state: 'partial' | 'unavailable' | 'missing'; as_of: string | null };
const safe = (n: number) => Number.isSafeInteger(n) && n >= 0;
const cents = (n: bigint) => { const value = Number(n); if (!safe(value)) throw new Error('Amount outside safe display range'); return value; };
function grouped(rows: Array<{ label: string; value: number }>): Point[] {
  const groups = new Map<string, number>();
  for (const row of rows) {
    if (!safe(row.value)) throw new Error('Invalid saved count');
    const value = (groups.get(row.label) ?? 0) + row.value;
    if (!safe(value)) throw new Error('Aggregate outside safe display range');
    groups.set(row.label, value);
  }
  return [...groups].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
}
const total = (bars: Point[]) => { const value = bars.reduce((sum, p) => sum + p.value, 0); if (!safe(value)) throw new Error('Invalid total'); return value; };
router.get('/monitor', async (_req, res): Promise<void> => {
  res.setHeader('Cache-Control', 'private, no-store');
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Australia/Brisbane' }).format(new Date());
  const start = new Date(`${today}T00:00:00Z`); start.setUTCDate(start.getUTCDate() - 29);
  const since = start.toISOString().slice(0, 10);
  // Saved tables only: no provider call, refresh write, model, seeding or schema change.
  const [projects, debts, income, costs, customers, social, sales] = await Promise.allSettled([
    db.select({ id: projectsTable.id, name: projectsTable.name }).from(projectsTable).orderBy(projectsTable.id).limit(101),
    db.select({ project_id: debtsTable.project_id, amount: debtsTable.balance_cents }).from(debtsTable).orderBy(debtsTable.id).limit(501),
    db.select({ project_id: revenueEntriesTable.project_id, amount: revenueEntriesTable.amount_cents, day: revenueEntriesTable.received_on })
      .from(revenueEntriesTable).where(and(gte(revenueEntriesTable.received_on, since), lte(revenueEntriesTable.received_on, today))).orderBy(desc(revenueEntriesTable.id)).limit(1001),
    db.select({ project_id: expensesTable.project_id, amount: expensesTable.amount_cents, kind: expensesTable.kind })
      .from(expensesTable).where(and(eq(expensesTable.kind, 'recurring_monthly'), eq(expensesTable.active, true))).orderBy(expensesTable.id).limit(501),
    db.select({ id: metricSnapshotsV2Table.id, project_id: metricSnapshotsV2Table.project_id, value: metricSnapshotsV2Table.value,
      day: sql<string>`to_char(${metricSnapshotsV2Table.captured_at}, 'YYYY-MM-DD')` }).from(metricSnapshotsV2Table)
      .where(and(eq(metricSnapshotsV2Table.key, 'customers_30d'), lte(sql<string>`to_char(${metricSnapshotsV2Table.captured_at}, 'YYYY-MM-DD')`, today)))
      .orderBy(desc(metricSnapshotsV2Table.captured_at), desc(metricSnapshotsV2Table.id)).limit(501),
    db.select({ id: socialSnapshotsTable.id, project_id: socialSnapshotsTable.project_id, platform: socialSnapshotsTable.platform,
      followers: socialSnapshotsTable.followers, impressions: socialSnapshotsTable.impressions_30d,
      engagements: socialSnapshotsTable.engagements_30d, day: socialSnapshotsTable.captured_on })
      .from(socialSnapshotsTable).where(lte(socialSnapshotsTable.captured_on, today))
      .orderBy(desc(socialSnapshotsTable.captured_on), desc(socialSnapshotsTable.id)).limit(501),
    db.select({ id: metricSnapshotsV2Table.id, project_id: metricSnapshotsV2Table.project_id, value: metricSnapshotsV2Table.value,
      day: sql<string>`to_char(${metricSnapshotsV2Table.captured_at}, 'YYYY-MM-DD')` }).from(metricSnapshotsV2Table)
      .where(and(eq(metricSnapshotsV2Table.key, 'sales_30d'), lte(sql<string>`to_char(${metricSnapshotsV2Table.captured_at}, 'YYYY-MM-DD')`, today)))
      .orderBy(desc(metricSnapshotsV2Table.captured_at), desc(metricSnapshotsV2Table.id)).limit(501),
  ]);
  const name = (id: number | null) => {
    if (id === null) return 'Company · unassigned';
    const project = projects.status === 'fulfilled' ? projects.value.find(p => p.id === id) : undefined;
    if (!project) return `Business #${id}`;
    // Names are not unique in storage. Never merge separate businesses merely
    // because their labels match (or equal the unassigned company bucket).
    return `${project.name} · #${id}`;
  };
  const cards: Card[] = [];
  const add = (key: string, title: string, unit: Card['unit'], read: () => { bars: Point[]; note: string; as_of?: string | null }, available: boolean) => {
    try {
      if (!available) throw new Error('Unavailable source');
      const result = read();
      cards.push({ key, title, unit, value: result.bars.length ? total(result.bars) : null, bars: result.bars.slice(0, 6),
        note: result.bars.length ? `${result.note}${result.bars.length > 6 ? ' · top six shown' : ''}` : 'No saved readings', state: result.bars.length ? 'partial' : 'missing', as_of: result.as_of ?? null });
    } catch { cards.push({ key, title, unit, value: null, bars: [], note: 'Saved source unavailable', state: 'unavailable', as_of: null }); }
  };
  cards.push({ key: 'profit', title: 'Consolidated profit', unit: 'aud_cents', value: null, bars: [],
    state: 'missing', note: 'Verified net-profit source missing', as_of: null });
  // Saved store sales are a separate source, never added to ledger income.
  // Do not hide a failed ledger read by replacing it with another source.
  if (income.status === 'fulfilled' && income.value.length === 0 && sales.status === 'fulfilled' && sales.value.length > 0) {
    add('income', 'Saved online sales', 'aud_cents', () => {
      const latest = new Map<number, { value: number; day: string }>();
      for (const row of sales.value.slice(0, 500)) if (!latest.has(row.project_id)) latest.set(row.project_id, row);
      const days = [...latest.values()].map(r => r.day).sort();
      return { bars: grouped([...latest].map(([id, row]) => ({ label: name(id), value: row.value }))),
        note: `${sales.value.length > 500 ? 'Limited snapshots' : 'Saved sales snapshots'} · rolling 30 days · not net profit`,
        as_of: days.length ? days[0] === days[days.length - 1] ? days[0] : `${days[0]} – ${days[days.length - 1]}` : null };
    }, true);
  } else add('income', 'Recorded income', 'aud_cents', () => ({ bars: grouped(income.status === 'fulfilled' ? income.value.slice(0, 1000).map(r => ({ label: name(r.project_id), value: cents(r.amount) })) : []),
    note: income.status === 'fulfilled' && income.value.length > 1000 ? 'Limited ledger entries · 30 days' : 'Ledger only · last 30 days' }), income.status === 'fulfilled');
  add('debt', 'Recorded debt', 'aud_cents', () => ({ bars: grouped(debts.status === 'fulfilled' ? debts.value.slice(0, 500).map(r => ({ label: name(r.project_id), value: cents(r.amount) })) : []),
    note: debts.status === 'fulfilled' && debts.value.length > 500 ? 'Limited saved balances' : 'Saved balances · not verified live' }), debts.status === 'fulfilled');
  add('customers', 'Online customers', 'count', () => {
    const latest = new Map<number, { value: number; day: string }>();
    if (customers.status === 'fulfilled') for (const row of customers.value.slice(0, 500)) if (!latest.has(row.project_id)) latest.set(row.project_id, row);
    const days = [...latest.values()].map(r => r.day).sort();
    return { bars: grouped([...latest].map(([id, row]) => ({ label: name(id), value: row.value }))),
      note: customers.status === 'fulfilled' && customers.value.length > 500 ? 'Limited online counts · not deduplicated' : 'Saved online counts · not deduplicated',
      as_of: days.length ? days[0] === days[days.length - 1] ? days[0] : `${days[0]} – ${days[days.length - 1]}` : null };
  }, customers.status === 'fulfilled');
  const readings = new Map<string, { platform: string; followers: number; impressions: number | null; engagements: number | null; day: string }>();
  if (social.status === 'fulfilled') for (const row of social.value.slice(0, 500)) {
    const key = `${row.project_id}:${row.platform}`; if (!readings.has(key)) readings.set(key, row);
  }
  for (const [key, title, field, note] of [
    ['followers', 'Social footprint', 'followers', 'Account followers · not unique people'],
    ['reach', 'Social reach', 'impressions', 'Reported 30-day impressions'],
    ['engagement', 'Social engagement', 'engagements', 'Reported 30-day interactions'],
  ] as const) add(key, title, 'count', () => {
    const rows = [...readings.values()].filter(r => r[field] !== null);
    const days = rows.map(r => r.day).sort();
    return { bars: grouped(rows.map(r => ({ label: r.platform, value: r[field]! }))),
      note: social.status === 'fulfilled' && social.value.length > 500 ? 'Limited saved account readings' : note,
      as_of: days.length ? days[0] === days[days.length - 1] ? days[0] : `${days[0]} – ${days[days.length - 1]}` : null };
  }, social.status === 'fulfilled');
  add('costs', 'Monthly commitments', 'aud_cents', () => ({ bars: grouped(costs.status === 'fulfilled' ? costs.value.slice(0, 500).map(r => ({ label: name(r.project_id), value: cents(r.amount) })) : []),
    note: costs.status === 'fulfilled' && costs.value.length > 500 ? 'Limited recurring cost records' : 'Recorded recurring costs · not total expenses' }), costs.status === 'fulfilled');
  res.json({ version: 2, read_at: new Date().toISOString(), evidence: 'saved_records', live_verified: false,
    currency: 'AUD', currency_basis: 'existing_dashboard_convention', period: { from: since, to: today }, cards });
});
export default router;
