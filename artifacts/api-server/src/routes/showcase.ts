import { db, financeShowcaseTable } from '@workspace/db';
import { eq } from 'drizzle-orm';
import express, { Router, type IRouter } from 'express';
import { logger } from '../lib/logger';
import { requireInboundKey } from './inbound';

// The DDG Finance showcase (ddg.limited/live/finance, Markus 19 Nov): a display-only copy of the Finance main
// dashboard. Finance pushes one snapshot of the dashboard's GET answers (path -> JSON) while the US market is
// closed; the public page reads it back. Nothing here can change Finance.

/** The dashboard paths the showcase may hold (the main dashboard's reads, nothing else). */
export const SHOWCASE_PATHS = new Set([
  '/fleet/equity', '/market-state', '/status/summary', '/positions/live', '/claude-report', '/fleet/entry-windows',
  '/runner/status', '/bots/pause-state', '/fleet-v1/state', '/fleet-v1/record', '/momo-v2/state', '/fleet/comparison',
  '/vault/per-bot/summary', '/fleet/holdings', '/bot-registry', '/fleet/equity-history', '/fleet/bot-history?days=90',
]);
const MAX_BYTES = 4_000_000;
// Never shown in public, whatever Finance sends: account numbers, keys, tokens, secrets.
const HIDDEN_KEY = /(account_?(id|number|no)|secret|token|api_?key|password|dsn|database_url)/i;

function scrub(v: unknown, depth = 0): unknown {
  if (depth > 40) return null;
  if (Array.isArray(v)) return v.map((x) => scrub(x, depth + 1));
  if (v && typeof v === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, x] of Object.entries(v)) if (!HIDDEN_KEY.test(k)) out[k] = scrub(x, depth + 1);
    return out;
  }
  return v;
}

export const showcaseInboundRouter: IRouter = Router();
// The key is checked before the body is read, so strangers cannot make the server parse big bodies.
showcaseInboundRouter.post('/inbound/finance-showcase', requireInboundKey('FLEET_INBOUND_KEY'), express.json({ limit: MAX_BYTES }), async (req, res): Promise<void> => {
  const body = req.body as { taken_at?: unknown; data?: unknown } | undefined;
  const takenAt = typeof body?.taken_at === 'string' ? Date.parse(body.taken_at) : NaN;
  if (!Number.isFinite(takenAt) || takenAt > Date.now() + 5 * 60_000) { res.status(400).json({ error: 'taken_at must be an ISO time, not in the future' }); return; }
  if (!body?.data || typeof body.data !== 'object' || Array.isArray(body.data)) { res.status(400).json({ error: 'data must be an object of path -> answer' }); return; }
  const data: Record<string, unknown> = {};
  for (const [path, answer] of Object.entries(body.data as Record<string, unknown>)) if (SHOWCASE_PATHS.has(path)) data[path] = scrub(answer);
  const row = { id: 1, taken_at: new Date(takenAt), body: data, received_at: new Date() };
  await db.insert(financeShowcaseTable).values(row).onConflictDoUpdate({ target: financeShowcaseTable.id, set: { taken_at: row.taken_at, body: row.body, received_at: row.received_at } });
  cached = null;
  logger.info({ paths: Object.keys(data).length }, 'finance showcase snapshot saved');
  res.json({ ok: true, paths: Object.keys(data).length });
});

let cached: { at: number; json: string } | null = null;
export const showcasePublicRouter: IRouter = Router();
showcasePublicRouter.get('/public/finance-showcase', async (_req, res) => {
  if (!cached || Date.now() - cached.at > 60_000) {
    const [row] = await db.select().from(financeShowcaseTable).where(eq(financeShowcaseTable.id, 1));
    cached = { at: Date.now(), json: JSON.stringify({ taken_at: row ? row.taken_at.toISOString() : null, data: row ? row.body : {} }) };
  }
  res.setHeader('Cache-Control', 'public, max-age=60');
  res.type('application/json').send(cached.json);
});
