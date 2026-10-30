import { useState, type FormEvent } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  getGetOverviewQueryKey, getListFinanceExpensesQueryKey, getListFinanceRevenueQueryKey,
  useCreateFinanceExpense, useCreateFinanceRevenue, useDeleteFinanceExpense, useDeleteFinanceRevenue,
  useListFinanceExpenses, useListFinanceRevenue,
} from '@workspace/api-client-react';
import { Header } from '@/components/header';
import { LEDGER_BUSINESSES, ledgerLabel } from '@/lib/company';
import { serverErrorText } from '@/lib/errors';
import { currentBrisbaneDate, dollarsToCents } from '@/lib/format';
import { aud } from '@/lib/money';

type Row = { id: number; project_slug: string | null; name: string; amount_cents: number; day: string | null };
type Entry = { project_slug: string | null; name: string; amount_cents: number; day: string };

function Ledger({ title, hint, example, rows, loading, onAdd, onDelete }: {
  title: string; hint: string; example: string; rows: Row[]; loading: boolean;
  onAdd: (entry: Entry) => Promise<unknown>; onDelete: (id: number) => Promise<unknown>;
}) {
  const [business, setBusiness] = useState('');
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [day, setDay] = useState(currentBrisbaneDate());
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const total = rows.reduce((sum, r) => sum + r.amount_cents, 0);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    let cents: number;
    try { cents = dollarsToCents(amount); } catch { setError('Enter an amount like 49.95'); return; }
    setBusy(true);
    try {
      await onAdd({ project_slug: business || null, name: name.trim(), amount_cents: cents, day });
      setName(''); setAmount('');
    } catch (e) { setError(serverErrorText(e, 'Could not save.')); } finally { setBusy(false); }
  };

  return (
    <section className="glass panel" aria-label={title}>
      <div className="panel-head"><h2>{title}</h2><span className="num" style={{ fontSize: 22 }}>{aud(total)}</span></div>
      <p className="note" style={{ margin: 0 }}>{hint}</p>
      <form className="form" onSubmit={submit}>
        <label className="field">Business
          <select value={business} onChange={(e) => setBusiness(e.target.value)}>
            {LEDGER_BUSINESSES.map((b) => <option key={b.slug} value={b.slug}>{b.label}</option>)}
          </select>
        </label>
        <label className="field" style={{ flex: '2 1 220px' }}>What
          <input value={name} onChange={(e) => setName(e.target.value)} required maxLength={200} placeholder={example} />
        </label>
        <label className="field">Amount (AUD)
          <input value={amount} onChange={(e) => setAmount(e.target.value)} required inputMode="decimal" placeholder="0.00" />
        </label>
        <label className="field">Date
          <input type="date" value={day} onChange={(e) => setDay(e.target.value)} required />
        </label>
        <button type="submit" className="btn fill" disabled={busy}>{busy ? 'Saving…' : 'Add'}</button>
      </form>
      {error && <p className="alert" role="alert" style={{ margin: 0 }}>{error}</p>}
      <div className="table-scroll">
        <table>
          <thead><tr><th>Date</th><th>Business</th><th>What</th><th style={{ textAlign: 'right' }}>Amount</th><th><span className="sr-only">Remove</span></th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>{r.day ?? '—'}</td><td>{ledgerLabel(r.project_slug)}</td><td>{r.name}</td><td className="money">{aud(r.amount_cents)}</td>
                <td style={{ textAlign: 'right' }}>
                  <button type="button" className="btn" style={{ minHeight: 36 }} aria-label={`Remove ${r.name}`}
                    onClick={() => { if (window.confirm(`Remove "${r.name}" (${aud(r.amount_cents)})?`)) void onDelete(r.id).catch((e) => setError(serverErrorText(e, 'Could not remove.'))); }}>Remove</button>
                </td>
              </tr>
            ))}
            {!rows.length && <tr><td colSpan={5} className="note">{loading ? 'Loading…' : 'Nothing recorded yet.'}</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function Money() {
  const client = useQueryClient();
  const expenses = useListFinanceExpenses();
  const revenue = useListFinanceRevenue();
  const addExpense = useCreateFinanceExpense();
  const addRevenue = useCreateFinanceRevenue();
  const delExpense = useDeleteFinanceExpense();
  const delRevenue = useDeleteFinanceRevenue();
  const refresh = (key: readonly unknown[]) => Promise.all([
    client.invalidateQueries({ queryKey: key }), client.invalidateQueries({ queryKey: getGetOverviewQueryKey() }),
  ]);
  const payments = (expenses.data ?? []).filter((e) => e.kind === 'one_off');
  const recurring = (expenses.data ?? []).filter((e) => e.kind !== 'one_off');

  return (
    <div className="ng-page dusk">
      <div className="ng-wrap">
        <Header />
        <h1 style={{ margin: 0, fontSize: 32, fontWeight: 400 }}>Money</h1>
        <p className="muted" style={{ margin: 0, maxWidth: 720 }}>
          Every payment and every dollar earned, all businesses. Home adds them up: expenses − gross revenue = debt, and gross revenue − expenses − charity = net profit.
          Coffee shop sales and its RSPCA contribution come from the shop automatically, so don't add Coffee sales here.
        </p>
        <Ledger title="Expenses" example="e.g. Replit subscription" hint="Money paid out. Add each payment when it happens, including monthly bills."
          loading={expenses.isLoading}
          rows={payments.map((e) => ({ id: e.id, project_slug: e.project_slug, name: e.name, amount_cents: e.amount_cents, day: e.spent_on }))}
          onAdd={(x) => addExpense.mutateAsync({ data: { project_slug: x.project_slug, name: x.name, kind: 'one_off', amount_cents: x.amount_cents, spent_on: x.day } })
            .then(() => refresh(getListFinanceExpensesQueryKey()))}
          onDelete={(id) => delExpense.mutateAsync({ id }).then(() => refresh(getListFinanceExpensesQueryKey()))} />
        <Ledger title="Revenue" example="e.g. YouTube payout" hint="Money earned outside the Coffee shop (e.g. YouTube, Hypest, the novel)."
          loading={revenue.isLoading}
          rows={(revenue.data ?? []).map((r) => ({ id: r.id, project_slug: r.project_slug, name: r.name, amount_cents: r.amount_cents, day: r.received_on }))}
          onAdd={(x) => addRevenue.mutateAsync({ data: { project_slug: x.project_slug, name: x.name, amount_cents: x.amount_cents, received_on: x.day } })
            .then(() => refresh(getListFinanceRevenueQueryKey()))}
          onDelete={(id) => delRevenue.mutateAsync({ id }).then(() => refresh(getListFinanceRevenueQueryKey()))} />
        {recurring.length > 0 && (
          <p className="note" style={{ margin: 0 }}>
            {recurring.length} older monthly-bill entr{recurring.length === 1 ? 'y is' : 'ies are'} saved as forecasts and not counted in expenses. Add the actual payments above.
          </p>
        )}
      </div>
    </div>
  );
}
