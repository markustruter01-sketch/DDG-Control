import { CreateInboundFinanceExpenseBody, CreateInboundFinanceRevenueBody } from '@workspace/api-zod';
import { Router, type IRouter, type Request, type Response } from 'express';
import { createExpense, createRevenue } from './finance';
import { requireInboundKey } from './inbound';
import { createSocialSnapshot } from './social';
import { requestBodyRecord, zodErrorText } from './validation';

/**
 * Where the Grok bots push numbers into Control (e.g. Freya reading the social dashboards).
 * One key, DDG_BOT_KEY, sent as "Authorization: Bearer <key>". Bots can only ADD readings,
 * payments and revenue — never change or delete anything. Markus can remove a wrong row on the Money page.
 */
const router: IRouter = Router();
router.use('/bots', requireInboundKey('DDG_BOT_KEY'));

router.post('/bots/social', createSocialSnapshot);

const money = (
  schema: typeof CreateInboundFinanceExpenseBody | typeof CreateInboundFinanceRevenueBody,
  create: typeof createExpense | typeof createRevenue,
) => async (req: Request, res: Response): Promise<void> => {
  const parsed = schema.safeParse(req.body);
  const input = requestBodyRecord(req.body);
  if (!parsed.success || !input) {
    res.status(400).json({ error: parsed.success ? 'request body must be an object' : zodErrorText(parsed.error) });
    return;
  }
  delete input.idempotency_key;
  const result = await create(input, parsed.data.idempotency_key);
  if ('error' in result) {
    res.status(result.status).json({ error: result.error });
    return;
  }
  res.status(result.status).json(result.data);
};

router.post('/bots/expense', money(CreateInboundFinanceExpenseBody, createExpense));
router.post('/bots/revenue', money(CreateInboundFinanceRevenueBody, createRevenue));

export default router;
