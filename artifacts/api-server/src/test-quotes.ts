// DDG Build quotes: deposit maths, status, accept + Stripe deposit check. Local test database only.
// Run: DATABASE_URL=postgresql://...localhost.../ddg_test npx tsx src/test-quotes.ts
import assert from 'node:assert/strict';
import { db, quotesTable, asksTable } from '@workspace/db';
import { eq, sql } from 'drizzle-orm';
import { confirmDeposit, depositCents, publicStatus } from './routes/quotes';

if (!/localhost|127\.0\.0\.1/.test(process.env.DATABASE_URL ?? '')) throw new Error('Refusing: not a local test database');

assert.equal(depositCents(450_000, 30), 135_000);
assert.equal(depositCents(149_950, 30), 45_000); // rounded to whole dollars
assert.equal(depositCents(10_000, 100), 10_000);
assert.equal(publicStatus({ status: 'sent', valid_until: '2026-11-20' }, '2026-11-21'), 'expired');
assert.equal(publicStatus({ status: 'sent', valid_until: '2026-11-20' }, '2026-11-20'), 'sent');
assert.equal(publicStatus({ status: 'paid', valid_until: '2026-11-01' }, '2026-11-21'), 'paid');

await db.execute(sql`TRUNCATE quotes, asks RESTART IDENTITY CASCADE`);
const [q] = await db.insert(quotesTable).values({
  token: 'tok_' + 'a'.repeat(30), client_name: 'Sam', client_email: 'sam@example.com', title: 'Business website',
  scope: ['5 pages'], total_cents: 300_000, deposit_cents: 90_000, valid_until: '2099-01-01', status: 'accepted',
}).returning();

// No Stripe key: nothing is checked or changed.
delete process.env.STRIPE_DDG_SECRET_KEY;
assert.equal((await confirmDeposit(q!, 'cs_test_1')).status, 'accepted');

process.env.STRIPE_DDG_SECRET_KEY = 'sk_test_dummy';
const realFetch = globalThis.fetch;
const session = (over: Record<string, unknown>) => ({ id: 'cs_test_1', payment_status: 'paid', amount_total: 90_000, metadata: { ddg_quote_id: String(q!.id) }, ...over });
const stub = (body: unknown) => { globalThis.fetch = (async () => new Response(JSON.stringify(body), { status: 200 })) as typeof fetch; };

stub(session({ payment_status: 'unpaid' }));
assert.equal((await confirmDeposit(q!, 'cs_test_1')).status, 'accepted', 'unpaid session does not mark paid');
stub(session({ metadata: { ddg_quote_id: '999' } }));
assert.equal((await confirmDeposit(q!, 'cs_test_1')).status, 'accepted', 'another quote’s session does not count');
stub(session({ amount_total: 1_00 }));
assert.equal((await confirmDeposit(q!, 'cs_test_1')).status, 'accepted', 'wrong amount does not count');
assert.equal((await confirmDeposit(q!, 'not-a-session')).status, 'accepted', 'bad session id is ignored');
stub(session({}));
const paid = await confirmDeposit(q!, 'cs_test_1');
assert.equal(paid.status, 'paid');
assert.ok(paid.paid_at instanceof Date);
const asks = await db.select().from(asksTable);
assert.equal(asks.length, 1);
assert.match(asks[0]!.text, /Deposit paid: Business website/);
// Already paid: no second notice.
assert.equal((await confirmDeposit(paid, 'cs_test_1')).status, 'paid');
assert.equal((await db.select().from(asksTable)).length, 1);
const [row] = await db.select().from(quotesTable).where(eq(quotesTable.id, q!.id));
assert.equal(row!.stripe_session_id, 'cs_test_1');

globalThis.fetch = realFetch;
console.log('test-quotes: all checks passed');
process.exit(0);
