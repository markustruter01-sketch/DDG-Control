import { CompleteAskParams, CreateAskBody, UndoBotPushParams } from '@workspace/api-zod';
import {
  asksTable, botMessagesTable, botPushesTable, db, expensesTable, revenueEntriesTable,
} from '@workspace/db';
import { and, asc, desc, eq, isNull } from 'drizzle-orm';
import { Router, type IRouter } from 'express';
import { getConnections, sendMessage, toMessage } from '../lib/messages';
import { socialTableFor } from '../lib/social-rows';
import { zodErrorText } from './validation';

// Owner-only (mounted behind the login): Needs-you list, bot push log, feed health, messages.
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
  const cents = (v: unknown) => (typeof v === 'number' ? `${v < 0 ? '−' : ''}$${(Math.abs(v) / 100).toFixed(2)}` : '?');
  if (kind === 'social') return `${p.platform ?? '?'} · ${p.followers ?? '?'} followers · ${p.project_slug ?? '?'}`;
  if (kind === 'expense' || kind === 'revenue') return `${p.name ?? '?'} · ${cents(p.amount_cents)} · ${p.project_slug ?? 'company'}`;
  if (kind === 'ask') return String(p.text ?? '?');
  return kind;
}
const toPush = (r: typeof botPushesTable.$inferSelect) => ({
  id: r.id, bot: r.bot, kind: r.kind, record_id: r.record_id, status: r.status, error: r.error,
  summary: summarise(r.kind, (r.payload ?? {}) as Record<string, unknown>),
  received_at: r.received_at.toISOString(), undone_at: iso(r.undone_at),
});

router.get('/bot-pushes', async (_req, res) => {
  res.json((await db.select().from(botPushesTable).orderBy(desc(botPushesTable.received_at)).limit(200)).map(toPush));
});

const TABLE_FOR = { expense: expensesTable, revenue: revenueEntriesTable, ask: asksTable } as const;

router.post('/bot-pushes/:id/undo', async (req, res) => {
  const params = UndoBotPushParams.safeParse(req.params);
  if (!params.success) return void res.status(400).json({ error: 'bad id' });
  const result = await db.transaction(async (tx) => {
    const [push] = await tx.select().from(botPushesTable).where(eq(botPushesTable.id, params.data.id)).for('update');
    if (!push) return { status: 404 as const, error: 'not found' };
    if (push.undone_at) return { status: 409 as const, error: 'already undone' };
    if (push.record_id === null) return { status: 409 as const, error: 'this push created nothing' };
    // Social readings live in two tables; the id says which (lib/social-rows).
    const table = push.kind === 'social' ? socialTableFor(push.record_id) : TABLE_FOR[push.kind as keyof typeof TABLE_FOR];
    if (!table) return { status: 409 as const, error: 'unknown kind' };
    await tx.delete(table).where(eq(table.id, push.record_id));
    const [row] = await tx.update(botPushesTable).set({ undone_at: new Date() }).where(eq(botPushesTable.id, push.id)).returning();
    return { status: 200 as const, row: row! };
  });
  if ('error' in result) return void res.status(result.status).json({ error: result.error });
  res.json(toPush(result.row));
});

router.get('/connections', async (_req, res) => {
  res.json(await getConnections());
});

router.get('/messages', async (_req, res) => {
  res.json((await db.select().from(botMessagesTable).orderBy(desc(botMessagesTable.id)).limit(200)).map(toMessage));
});

router.post('/messages', async (req, res) => {
  const result = await sendMessage('markus', req.body);
  if ('error' in result) return void res.status(result.status).json({ error: result.error });
  res.status(201).json(result.data);
});

export default router;
