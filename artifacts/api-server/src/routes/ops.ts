import { CompleteAskParams, CreateAskBody, UndoBotPushParams } from '@workspace/api-zod';
import {
  asksTable, botPushesTable, db, expensesTable, fleetSnapshotsTable, revenueEntriesTable, socialSnapshotsTable,
} from '@workspace/db';
import { and, asc, desc, eq, isNull, max } from 'drizzle-orm';
import { Router, type IRouter } from 'express';
import { getCattleDogCoffeeProfit } from '../lib/cdc-store';
import { getHypestSummary } from '../lib/hypest-store';
import { botKeys } from './bots';
import { zodErrorText } from './validation';

// Owner-only (mounted behind the login): the "Needs you" list, the bot push log, and feed health.
const router: IRouter = Router();
const iso = (d: Date | null) => (d ? d.toISOString() : null);
const toAsk = (r: typeof asksTable.$inferSelect) => ({
  id: r.id, text: r.text, business: r.business, due: r.due, source: r.source, created_at: r.created_at.toISOString(), done_at: iso(r.done_at),
});

router.get('/asks', async (_req, res) => {
  res.json((await db.select().from(asksTable).where(isNull(asksTable.done_at)).orderBy(asc(asksTable.created_at))).map(toAsk));
});

router.post('/asks', async (req, res) => {
  const parsed = CreateAskBody.strict().safeParse(req.body);
  if (!parsed.success) return void res.status(400).json({ error: zodErrorText(parsed.error) });
  const [row] = await db.insert(asksTable).values({ ...parsed.data, source: 'owner' }).returning();
  res.status(201).json(toAsk(row!));
});

router.post('/asks/:id/done', async (req, res) => {
  const params = CompleteAskParams.safeParse(req.params);
  if (!params.success) return void res.status(400).json({ error: 'bad id' });
  const [row] = await db.update(asksTable).set({ done_at: new Date() })
    .where(and(eq(asksTable.id, params.data.id), isNull(asksTable.done_at))).returning();
  if (!row) return void res.status(404).json({ error: 'not found or already done' });
  res.json(toAsk(row));
});

/** One readable line per push so the log scans quickly. */
function summarise(kind: string, p: Record<string, unknown>): string {
  const cents = (v: unknown) => (typeof v === 'number' ? `$${(v / 100).toFixed(2)}` : '?');
  if (kind === 'social') return `${p.platform ?? '?'} · ${p.followers ?? '?'} followers · ${p.project_slug ?? '?'}`;
  if (kind === 'expense' || kind === 'revenue') return `${p.name ?? '?'} · ${cents(p.amount_cents)} · ${p.project_slug ?? 'company'}`;
  if (kind === 'ask') return String(p.text ?? '?');
  return kind;
}
const toPush = (r: typeof botPushesTable.$inferSelect) => ({
  id: r.id, bot: r.bot, kind: r.kind, record_id: r.record_id, status: r.status,
  summary: summarise(r.kind, (r.payload ?? {}) as Record<string, unknown>),
  received_at: r.received_at.toISOString(), undone_at: iso(r.undone_at),
});

router.get('/bot-pushes', async (_req, res) => {
  res.json((await db.select().from(botPushesTable).orderBy(desc(botPushesTable.received_at)).limit(200)).map(toPush));
});

const TABLE_FOR = { social: socialSnapshotsTable, expense: expensesTable, revenue: revenueEntriesTable, ask: asksTable } as const;

router.post('/bot-pushes/:id/undo', async (req, res) => {
  const params = UndoBotPushParams.safeParse(req.params);
  if (!params.success) return void res.status(400).json({ error: 'bad id' });
  const result = await db.transaction(async (tx) => {
    const [push] = await tx.select().from(botPushesTable).where(eq(botPushesTable.id, params.data.id)).for('update');
    if (!push) return { status: 404 as const, error: 'not found' };
    if (push.undone_at) return { status: 409 as const, error: 'already undone' };
    if (push.record_id === null) return { status: 409 as const, error: 'this push created nothing' };
    const table = TABLE_FOR[push.kind as keyof typeof TABLE_FOR];
    if (!table) return { status: 409 as const, error: 'unknown kind' };
    await tx.delete(table).where(eq(table.id, push.record_id));
    const [row] = await tx.update(botPushesTable).set({ undone_at: new Date() }).where(eq(botPushesTable.id, push.id)).returning();
    return { status: 200 as const, row: row! };
  });
  if ('error' in result) return void res.status(result.status).json({ error: result.error });
  res.json(toPush(result.row));
});

const HOUR = 3_600_000;
const age = (d: Date | null) => (d ? Date.now() - d.getTime() : Infinity);

router.get('/connections', async (_req, res) => {
  const [store, hypest, fleet, social, pushes] = await Promise.all([
    getCattleDogCoffeeProfit(),
    getHypestSummary(),
    db.select({ at: max(fleetSnapshotsTable.generated_at) }).from(fleetSnapshotsTable),
    db.select({ at: max(socialSnapshotsTable.created_at) }).from(socialSnapshotsTable),
    db.select({ bot: botPushesTable.bot, at: max(botPushesTable.received_at) }).from(botPushesTable).groupBy(botPushesTable.bot),
  ]);
  const fleetAt = fleet[0]?.at ?? null;
  const socialAt = social[0]?.at ?? null;
  const rows = [
    store.ok
      ? { key: 'coffee', label: 'Coffee shop', state: 'ok', detail: 'Sales and charity read live from the shop', as_of: store.data.generatedAt.toISOString() }
      : { key: 'coffee', label: 'Coffee shop', state: 'off', detail: `Not reachable: ${store.error}`, as_of: null },
    { key: 'finance', label: 'DDG Finance', state: age(fleetAt) < 3 * HOUR ? 'ok' : fleetAt ? 'stale' : 'off',
      detail: fleetAt ? 'Hourly push from the trading platform' : 'No push received yet', as_of: iso(fleetAt) },
    hypest
      ? { key: 'fitness', label: 'Hypest', state: 'ok', detail: 'Purchases and subscribers read live', as_of: hypest.generatedAt }
      : { key: 'fitness', label: 'Hypest', state: 'off', detail: 'Not connected until Hypest is published', as_of: null },
    { key: 'social', label: 'Social numbers', state: age(socialAt) < 8 * 24 * HOUR ? 'ok' : socialAt ? 'stale' : 'off',
      detail: socialAt ? 'Latest reading from Freya or the Social page' : 'No readings yet', as_of: iso(socialAt) },
    ...botKeys().map(({ bot }) => {
      const at = pushes.find((p) => p.bot === bot)?.at ?? null;
      return { key: `bot-${bot}`, label: `Bot · ${bot[0]!.toUpperCase()}${bot.slice(1)}`, state: at ? 'ok' : 'off',
        detail: at ? 'Key set; last push received' : 'Key set; nothing pushed yet', as_of: iso(at) };
    }),
  ];
  res.json(rows);
});

export default router;
