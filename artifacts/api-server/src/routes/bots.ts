import { createHash, timingSafeEqual } from 'node:crypto';
import { botKeys } from '../lib/bot-keys';
import { CreateAskBody, CreateInboundFinanceExpenseBody, CreateInboundFinanceRevenueBody } from '@workspace/api-zod';
import { asksTable, botPushesTable, db } from '@workspace/db';
import { Router, type IRouter, type Request, type Response } from 'express';
import { createExpense, createRevenue } from './finance';
import { recordSocialSnapshot } from './social';
import { dailyBrief, inbox, sendMessage } from '../lib/messages';
import { requestBodyRecord, zodErrorText } from './validation';

/**
 * Where the Grok bots push numbers into Control. Each bot has its own key (see lib/bot-keys),
 * so every push is signed by the bot that sent it. Sent as "Authorization: Bearer <key>". Bots can only ADD. Every push, accepted or
 * rejected, goes in the bot_pushes log; Markus can review it and undo a wrong one.
 */
const router: IRouter = Router();

type Kind = 'social' | 'expense' | 'revenue' | 'ask';
type Result = { status: number; data?: { id?: unknown } & Record<string, unknown>; error?: string };

const hash = (value: string) => createHash('sha256').update(value).digest();

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
    error: result.error?.slice(0, 300) ?? null,
  });
}

const handle = (kind: Kind, run: (body: unknown, bot: string) => Promise<Result>) =>
  async (req: Request, res: Response): Promise<void> => {
    const bot = whichBot(req);
    if (!bot) {
      res.status(401).json({ error: 'unknown bot key' });
      return;
    }
    let result: Result;
    try {
      result = await run(req.body, bot);
    } catch {
      result = { status: 500, error: 'could not save' };
    }
    await audit(bot, kind, req.body, result); // logged whether it worked or not
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
  const result = await recordSocialSnapshot(body);
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

// Messages: each bot checks its inbox (and the automatic daily brief) and can reply.
router.get('/bots/inbox', async (req, res) => {
  const bot = whichBot(req);
  if (!bot) return void res.status(401).json({ error: 'unknown bot key' });
  const after = Number(req.query.after ?? 0);
  res.json({ you: bot, brief: await dailyBrief(), messages: await inbox(bot, Number.isSafeInteger(after) && after > 0 ? after : 0) });
});
router.post('/bots/message', async (req, res) => {
  const bot = whichBot(req);
  if (!bot) return void res.status(401).json({ error: 'unknown bot key' });
  const result = await sendMessage(bot, req.body);
  if ('error' in result) return void res.status(result.status).json({ error: result.error });
  res.status(201).json(result.data);
});

export default router;
