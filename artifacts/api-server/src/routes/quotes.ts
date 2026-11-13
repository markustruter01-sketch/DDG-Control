import { randomBytes } from 'node:crypto';
import { AcceptPublicQuoteBody, CreateQuoteBody, WithdrawQuoteParams } from '@workspace/api-zod';
import { asksTable, db, enquiriesTable, quotesTable } from '@workspace/db';
import { desc, eq } from 'drizzle-orm';
import { Router, type IRouter } from 'express';
import { emailOwner } from '../lib/email';
import { logger } from '../lib/logger';
import { getClientAddress } from './auth';
import { zodErrorText } from './validation';

// DDG Build quotes: Markus writes a fixed-price quote in Control → Clients; the client opens
// a private link (ddg.limited/quote/<token>), accepts it, and pays the deposit through Stripe.
// Payments are off until STRIPE_DDG_SECRET_KEY is set (DDG's own Stripe account, not the
// coffee shop's); until then accepting records the acceptance and Markus invoices the deposit.

export const PUBLIC_SITE_URL = (process.env.PUBLIC_SITE_URL ?? 'https://ddg.limited').replace(/\/+$/, '');
const STRIPE_API = 'https://api.stripe.com/v1';
const stripeKey = () => process.env.STRIPE_DDG_SECRET_KEY?.trim() || null;
const brisbaneToday = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Australia/Brisbane' }).format(new Date());
const dollars = (cents: number) => `$${(cents / 100).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

type QuoteRow = typeof quotesTable.$inferSelect;

/** Pure: deposit rounded to whole dollars, never more than the total. */
export function depositCents(totalCents: number, depositPct: number): number {
  return Math.min(totalCents, Math.round((totalCents * depositPct) / 100 / 100) * 100);
}

/** Pure: what the client sees as the state of their quote. */
export function publicStatus(row: Pick<QuoteRow, 'status' | 'valid_until'>, today: string): 'sent' | 'accepted' | 'paid' | 'withdrawn' | 'expired' {
  if (row.status === 'sent' && today > row.valid_until) return 'expired';
  return row.status as 'sent' | 'accepted' | 'paid' | 'withdrawn';
}

const toQuote = (q: QuoteRow) => ({
  id: q.id,
  link: `${PUBLIC_SITE_URL}/quote/${q.token}`,
  enquiry_id: q.enquiry_id,
  client_name: q.client_name,
  client_email: q.client_email,
  title: q.title,
  scope: q.scope,
  total_cents: q.total_cents,
  deposit_cents: q.deposit_cents,
  valid_until: q.valid_until,
  status: q.status as 'sent' | 'accepted' | 'paid' | 'withdrawn',
  accepted_name: q.accepted_name,
  accepted_at: q.accepted_at?.toISOString() ?? null,
  paid_at: q.paid_at?.toISOString() ?? null,
  created_at: q.created_at.toISOString(),
});

const toPublicQuote = (q: QuoteRow) => ({
  client_name: q.client_name,
  title: q.title,
  scope: q.scope,
  total_cents: q.total_cents,
  deposit_cents: q.deposit_cents,
  valid_until: q.valid_until,
  status: publicStatus(q, brisbaneToday()),
  accepted_name: q.accepted_name,
  payments_ready: stripeKey() !== null,
});

async function findByToken(token: string): Promise<QuoteRow | null> {
  if (!/^[A-Za-z0-9_-]{20,80}$/.test(token)) return null;
  const [row] = await db.select().from(quotesTable).where(eq(quotesTable.token, token)).limit(1);
  return row ?? null;
}

async function stripe(path: string, body?: URLSearchParams): Promise<Record<string, unknown>> {
  const res = await fetch(`${STRIPE_API}${path}`, {
    method: body ? 'POST' : 'GET',
    headers: { Authorization: `Bearer ${stripeKey()}`, ...(body ? { 'Content-Type': 'application/x-www-form-urlencoded' } : {}) },
    body,
  });
  const json = (await res.json()) as Record<string, unknown>;
  if (!res.ok) throw new Error(`Stripe ${res.status}: ${String((json.error as { message?: string } | undefined)?.message ?? 'error').slice(0, 200)}`);
  return json;
}

async function depositCheckout(q: QuoteRow): Promise<string> {
  const link = `${PUBLIC_SITE_URL}/quote/${q.token}`;
  const body = new URLSearchParams({
    mode: 'payment',
    customer_email: q.client_email,
    'line_items[0][quantity]': '1',
    'line_items[0][price_data][currency]': 'aud',
    'line_items[0][price_data][unit_amount]': String(q.deposit_cents),
    'line_items[0][price_data][product_data][name]': `Deposit: ${q.title}`.slice(0, 250),
    success_url: `${link}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: link,
    'metadata[ddg_quote_id]': String(q.id),
  });
  const session = await stripe('/checkout/sessions', body);
  await db.update(quotesTable).set({ stripe_session_id: String(session.id), updated_at: new Date() }).where(eq(quotesTable.id, q.id));
  return String(session.url);
}

/** Stripe says this session paid this quote's deposit: mark it paid (once) and tell Markus. */
export async function confirmDeposit(q: QuoteRow, sessionId: string): Promise<QuoteRow> {
  if (q.status === 'paid' || !stripeKey() || !/^cs_[A-Za-z0-9_]+$/.test(sessionId)) return q;
  const session = await stripe(`/checkout/sessions/${encodeURIComponent(sessionId)}`);
  const metadata = (session.metadata ?? {}) as Record<string, string>;
  if (session.payment_status !== 'paid' || metadata.ddg_quote_id !== String(q.id) || session.amount_total !== q.deposit_cents) return q;
  const [row] = await db.update(quotesTable).set({ status: 'paid', paid_at: new Date(), stripe_session_id: sessionId, updated_at: new Date() })
    .where(eq(quotesTable.id, q.id)).returning();
  await db.insert(asksTable).values({ text: `Deposit paid: ${q.title} · ${q.client_name} (${dollars(q.deposit_cents)})`.slice(0, 200), source: 'website' })
    .catch((err) => logger.error({ err: String(err) }, 'deposit ask failed'));
  await emailOwner(`Deposit paid: ${q.title}`, `${q.client_name} paid the ${dollars(q.deposit_cents)} deposit for "${q.title}" (total ${dollars(q.total_cents)}).`, q.client_email);
  return row ?? q;
}

export const quotesPublicRouter: IRouter = Router();

quotesPublicRouter.get('/public/quotes/:token', async (req, res) => {
  const q = await findByToken(req.params.token);
  if (!q) return void res.status(404).json({ error: 'Quote not found' });
  res.setHeader('Cache-Control', 'no-store');
  res.json(toPublicQuote(q));
});

quotesPublicRouter.get('/public/quotes/:token/payment/:session_id', async (req, res) => {
  const q = await findByToken(req.params.token);
  if (!q) return void res.status(404).json({ error: 'Quote not found' });
  try {
    res.setHeader('Cache-Control', 'no-store');
    res.json(toPublicQuote(await confirmDeposit(q, req.params.session_id)));
  } catch (err) {
    logger.error({ err: String(err), quoteId: q.id }, 'deposit check failed');
    res.json(toPublicQuote(q));
  }
});

quotesPublicRouter.post('/public/quotes/:token/accept', async (req, res) => {
  const q = await findByToken(req.params.token);
  if (!q) return void res.status(404).json({ error: 'Quote not found' });
  const body = AcceptPublicQuoteBody.strict().safeParse(req.body);
  if (!body.success) return void res.status(400).json({ error: zodErrorText(body.error) });
  const status = publicStatus(q, brisbaneToday());
  if (status === 'paid') return void res.json({ status: 'paid', checkout_url: null });
  if (status === 'withdrawn' || status === 'expired') return void res.status(409).json({ error: `This quote is ${status}. Please contact us for a new one.` });

  let row = q;
  if (q.status === 'sent') {
    [row] = await db.update(quotesTable)
      .set({ status: 'accepted', accepted_name: body.data.name.trim(), accepted_at: new Date(), updated_at: new Date() })
      .where(eq(quotesTable.id, q.id)).returning() as [QuoteRow];
    logger.info({ quoteId: q.id, from: getClientAddress(req) }, 'quote accepted');
    await db.insert(asksTable).values({ text: `Quote accepted: ${q.title} · ${q.client_name}`.slice(0, 200), source: 'website' })
      .catch((err) => logger.error({ err: String(err) }, 'quote ask failed'));
    await emailOwner(`Quote accepted: ${q.title}`,
      `${body.data.name.trim()} accepted "${q.title}" (total ${dollars(q.total_cents)}, deposit ${dollars(q.deposit_cents)}).` +
      (stripeKey() ? '\nThey were sent to Stripe to pay the deposit.' : '\nPayments are not set up yet: send them the deposit invoice.'), q.client_email);
  }
  if (!stripeKey()) return void res.json({ status: 'accepted', checkout_url: null });
  try {
    res.json({ status: 'accepted', checkout_url: await depositCheckout(row) });
  } catch (err) {
    logger.error({ err: String(err), quoteId: q.id }, 'deposit checkout failed');
    res.json({ status: 'accepted', checkout_url: null });
  }
});

export const quotesOwnerRouter: IRouter = Router();

quotesOwnerRouter.get('/quotes', async (_req, res) => {
  res.json((await db.select().from(quotesTable).orderBy(desc(quotesTable.created_at)).limit(300)).map(toQuote));
});

quotesOwnerRouter.post('/quotes', async (req, res) => {
  const body = CreateQuoteBody.strict().safeParse(req.body);
  if (!body.success) return void res.status(400).json({ error: zodErrorText(body.error) });
  const b = body.data;
  if (b.enquiry_id !== null) {
    const [e] = await db.select({ id: enquiriesTable.id }).from(enquiriesTable).where(eq(enquiriesTable.id, b.enquiry_id)).limit(1);
    if (!e) return void res.status(400).json({ error: 'enquiry not found' });
  }
  const validUntil = new Date(Date.now() + b.valid_days * 86_400_000);
  const [row] = await db.insert(quotesTable).values({
    token: randomBytes(24).toString('base64url'),
    enquiry_id: b.enquiry_id,
    client_name: b.client_name.trim(),
    client_email: b.client_email.trim(),
    title: b.title.trim(),
    scope: b.scope.map((s) => s.trim()).filter(Boolean),
    total_cents: b.total_cents,
    deposit_cents: depositCents(b.total_cents, b.deposit_pct),
    valid_until: new Intl.DateTimeFormat('en-CA', { timeZone: 'Australia/Brisbane' }).format(validUntil),
  }).returning();
  if (b.enquiry_id !== null) {
    await db.update(enquiriesTable).set({ stage: 'quote', updated_at: new Date() }).where(eq(enquiriesTable.id, b.enquiry_id));
  }
  res.status(201).json(toQuote(row!));
});

quotesOwnerRouter.post('/quotes/:id/withdraw', async (req, res) => {
  const params = WithdrawQuoteParams.safeParse(req.params);
  if (!params.success) return void res.status(400).json({ error: 'bad id' });
  const [q] = await db.select().from(quotesTable).where(eq(quotesTable.id, params.data.id)).limit(1);
  if (!q) return void res.status(404).json({ error: 'not found' });
  if (q.status === 'paid') return void res.status(409).json({ error: 'A paid quote cannot be withdrawn; refund it in Stripe first.' });
  const [row] = await db.update(quotesTable).set({ status: 'withdrawn', updated_at: new Date() }).where(eq(quotesTable.id, q.id)).returning();
  res.json(toQuote(row!));
});
