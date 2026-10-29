import { createHash, timingSafeEqual } from 'node:crypto';
import { CreateAskBody, CreateInboundFinanceExpenseBody, CreateInboundFinanceRevenueBody } from '@workspace/api-zod';
import { asksTable, botPushesTable, db } from '@workspace/db';
import { Router, type IRouter, type Request, type Response } from 'express';
import { createExpense, createRevenue } from './finance';
import { recordSocialSnapshot } from './social';
import { requestBodyRecord, zodErrorText } from './validation';

/**
 * Where the Grok bots push numbers into Control. Each bot has its own key, so every push
 * is signed by the bot that sent it:
 *   DDG_BOT_KEYS = "freya:<key>,tyr:<key>,heimdall:<key>"   (one entry per bot)
 *   DDG_BOT_KEY  = Claude's own key (signed as "claude")
 * Sent as "Authorization: Bearer <key>". Bots can only ADD. Every push, accepted or
 * rejected, goes in the bot_pushes log; Markus can review it and undo a wrong one.
 */
const router: IRouter = Router();

type Kind = 'social' | 'expense' | 'revenue' | 'ask';
type Result = { status: number; data?: { id?: unknown } & Record<string, unknown>; error?: string };

const hash = (value: string) => createHash('sha256').update(value).digest();

export function botKeys(): Array<{ bot: string; key: string }> {
  const keys = (process.env.DDG_BOT_KEYS ?? '')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const at = entry.indexOf(':');
      return { bot: entry.slice(0, at).trim().toLowerCase(), key: entry.slice(at + 1).trim() };
    })
    .filter((k) => /^[a-z]{2,20}$/.test(k.bot) && k.key.length >= 24);
  const claude = process.env.DDG_BOT_KEY?.trim();
  if (claude && claude.length >= 24) keys.push({ bot: 'claude', key: claude });
  return keys;
}

/** Which bot sent this request, or null. Compares against every key so timing gives nothing away. */
function whichBot(req: Request): string | null {
  const token = /^Bearer\s+(.+)$/i.exec(req.get('authorization') ?? '')?.[1]?.trim() ?? '';
  if (!token) return null;
  const sent = hash(token);
  let match: string | null = null;
  for (const { bot, key } of botKeys()) if (timingSafeEqual(sent, hash(key))) match = bot;
  return match;
}

async function audit(bot: string, kind: Kind, payload: unknown, result: Result) {
  const id = result.data?.id;
  await db.insert(botPushesTable).values({
    bot,
    kind,
    record_id: typeof id === 'number' ? id : null,
    payload: (payload ?? {}) as object,
    status: result.status,
  });
}

const handle = (kind: Kind, run: (body: unknown, bot: string) => Promise<Result>) =>
  async (req: Request, res: Response): Promise<void> => {
    const bot = whichBot(req);
    if (!bot) {
      res.status(401).json({ error: 'unknown bot key' });
      return;
    }
    const result = await run(req.body, bot);
    await audit(bot, kind, req.body, result);
    if (result.error) res.status(result.status).json({ error: result.error });
    else res.status(result.status).json(result.data);
  };

const money = (
  schema: typeof CreateInboundFinanceExpenseBody | typeof CreateInboundFinanceRevenueBody,
  create: typeof createExpense | typeof createRevenue,
) => async (body: unknown): Promise<Result> => {
  const parsed = schema.safeParse(body);
  const input = requestBodyRecord(body);
  if (!parsed.success || !input) return { status: 400, error: parsed.success ? 'request body must be an object' : zodErrorText(parsed.error) };
  delete input.idempotency_key;
  const result = await create(input, parsed.data.idempotency_key);
  return 'error' in result ? { status: result.status, error: result.error } : { status: result.status, data: result.data as Result['data'] };
};

router.post('/bots/social', handle('social', async (body) => {
  const result = await recordSocialSnapshot(body, 'bot');
  return 'error' in result ? { status: result.status, error: result.error } : { status: 201, data: result.data };
}));
router.post('/bots/expense', handle('expense', money(CreateInboundFinanceExpenseBody, createExpense)));
router.post('/bots/revenue', handle('revenue', money(CreateInboundFinanceRevenueBody, createRevenue)));
router.post('/bots/ask', handle('ask', async (body, bot) => {
  const parsed = CreateAskBody.strict().safeParse(body);
  if (!parsed.success) return { status: 400, error: zodErrorText(parsed.error) };
  const [row] = await db.insert(asksTable).values({ ...parsed.data, source: `bot:${bot}` }).returning();
  return { status: 201, data: { id: row!.id, text: row!.text } };
}));

export default router;
