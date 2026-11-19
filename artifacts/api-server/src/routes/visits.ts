import { db, siteVisitsTable } from '@workspace/db';
import { desc, gte, sql } from 'drizzle-orm';
import { Router, type IRouter } from 'express';
import { logger } from '../lib/logger';
import { getClientAddress } from './auth';

// Visitor counting for the public site. Counts are held in memory and written once a minute,
// so a visit never waits on the database. Only events on this list are counted.
export const VISIT_EVENTS = [
  'view', 'reach:portfolio', 'reach:build', 'reach:start', 'form:sent', 'kit:shop', 'kit:control', 'kit:desk',
] as const;
const ALLOWED = new Set<string>(VISIT_EVENTS);
const BOT = /bot|crawl|spider|slurp|preview|headless|lighthouse|monitor|curl|wget/i;
const PER_HOUR = 40; // most hits one address can add in an hour

const brisbaneDay = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Australia/Brisbane' }).format(new Date());
const pending = new Map<string, number>(); // "day|event" -> count
const perAddress = new Map<string, { hour: number; n: number }>(); // address is never stored

async function flush() {
  if (!pending.size) return;
  const rows = [...pending].map(([k, count]) => { const [day, event] = k.split('|'); return { day: day!, event: event!, count }; });
  pending.clear();
  try {
    await db.insert(siteVisitsTable).values(rows)
      .onConflictDoUpdate({ target: [siteVisitsTable.day, siteVisitsTable.event], set: { count: sql`${siteVisitsTable.count} + excluded.count` } });
  } catch (err) {
    logger.warn({ err }, 'site visits: could not save counts');
  }
}
setInterval(() => {
  void flush();
  const hour = Math.floor(Date.now() / 3_600_000);
  for (const [a, v] of perAddress) if (v.hour !== hour) perAddress.delete(a);
}, 60_000).unref();

export const visitsPublicRouter: IRouter = Router();
visitsPublicRouter.post('/public/hit', (req, res) => {
  const event = typeof req.body?.e === 'string' ? req.body.e : '';
  if (!ALLOWED.has(event) || BOT.test(String(req.headers['user-agent'] ?? ''))) return res.status(204).end();
  const addr = getClientAddress(req) || 'unknown';
  const hour = Math.floor(Date.now() / 3_600_000);
  const seen = perAddress.get(addr);
  const n = seen && seen.hour === hour ? seen.n + 1 : 1;
  perAddress.set(addr, { hour, n });
  if (n <= PER_HOUR) { const key = `${brisbaneDay()}|${event}`; pending.set(key, (pending.get(key) ?? 0) + 1); }
  res.status(204).end();
});

// Owner only (mounted after the login check): the last 30 days, newest first.
export const visitsOwnerRouter: IRouter = Router();
visitsOwnerRouter.get('/site-visits', async (_req, res) => {
  await flush();
  const from = new Date(Date.now() - 30 * 86_400_000).toISOString().slice(0, 10);
  const rows = await db.select().from(siteVisitsTable).where(gte(siteVisitsTable.day, from)).orderBy(desc(siteVisitsTable.day));
  res.json({ events: VISIT_EVENTS, rows });
});
