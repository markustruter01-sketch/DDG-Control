import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  getListEnquiriesQueryKey, getListQuotesQueryKey, useCreateQuote, useListEnquiries, useListQuotes, useUpdateEnquiry, useWithdrawQuote,
  type Enquiry, type Quote,
} from '@workspace/api-client-react';
import { Header } from '@/components/header';
import { serverErrorText } from '@/lib/errors';

// DDG Build: website enquiries from people who want DDG to build something (public from 1 Jan 2027).
const STAGES: { key: Enquiry['stage']; label: string }[] = [
  { key: 'new', label: 'New' }, { key: 'call', label: 'Call' }, { key: 'quote', label: 'Quote sent' },
  { key: 'won', label: 'Won' }, { key: 'lost', label: 'Lost' },
];
const KIND: Record<string, string> = {
  website: 'Business website', store: 'Online store', platform: 'Web platform', app: 'Phone app', ai: 'AI assistant / automation', unsure: 'Not sure yet',
};
const when = (iso: string) => new Intl.DateTimeFormat('en-AU', { timeZone: 'Australia/Brisbane', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }).format(new Date(iso));

const money = (cents: number) => `$${(cents / 100).toLocaleString('en-AU', { maximumFractionDigits: 2 })}`;
const QUOTE_STATUS: Record<Quote['status'], string> = { sent: 'Sent', accepted: 'Accepted', paid: 'Deposit paid', withdrawn: 'Withdrawn' };

/** DDG Build quotes for one enquiry: write one, copy its private link, see accepted / paid. */
function Quotes({ e, quotes }: { e: Enquiry; quotes: Quote[] }) {
  const client = useQueryClient();
  const refresh = () => {
    client.invalidateQueries({ queryKey: getListQuotesQueryKey() });
    client.invalidateQueries({ queryKey: getListEnquiriesQueryKey() });
  };
  const create = useCreateQuote({ mutation: { onSuccess: () => { refresh(); setOpen(false); } } });
  const withdraw = useWithdrawQuote({ mutation: { onSuccess: refresh } });
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: '', scope: '', total: '', deposit: '30', days: '14' });
  const [copied, setCopied] = useState<number | null>(null);
  const totalCents = Math.round(Number(form.total.replace(/[$,\s]/g, '')) * 100);
  const scope = form.scope.split('\n').map((l) => l.trim()).filter(Boolean);
  const ready = form.title.trim() && scope.length > 0 && totalCents >= 100 && Number(form.deposit) >= 10 && Number(form.deposit) <= 100 && Number(form.days) >= 1;
  const set = (key: keyof typeof form) => (ev: { target: { value: string } }) => setForm({ ...form, [key]: ev.target.value });
  return (
    <div className="client-quotes">
      {quotes.map((q) => (
        <div key={q.id} className="client-facts note">
          <span><b>{q.title}</b> · {money(q.total_cents)} (deposit {money(q.deposit_cents)}) · {QUOTE_STATUS[q.status]}
            {q.accepted_name ? ` by ${q.accepted_name}` : ''} · valid to {q.valid_until}</span>
          <span>
            <button type="button" className="btn" onClick={() => navigator.clipboard.writeText(q.link).then(() => setCopied(q.id))}>
              {copied === q.id ? 'Link copied' : 'Copy client link'}
            </button>{' '}
            {(q.status === 'sent' || q.status === 'accepted') && (
              <button type="button" className="btn" disabled={withdraw.isPending} onClick={() => withdraw.mutate({ id: q.id })}>Withdraw</button>
            )}
          </span>
        </div>
      ))}
      {!open ? (
        <button type="button" className="btn" onClick={() => { setForm({ ...form, title: form.title || (KIND[e.kind] ?? 'Your build') }); setOpen(true); }}>Write a quote</button>
      ) : (
        <div className="field quote-form">
          <input aria-label="Quote title" maxLength={120} placeholder="Title, e.g. Business website" value={form.title} onChange={set('title')} />
          <textarea aria-label="What is included" rows={4} placeholder="What's included, one line each" value={form.scope} onChange={set('scope')} />
          <div className="quote-row">
            <input aria-label="Total price in AUD" inputMode="decimal" placeholder="Total $ (AUD)" value={form.total} onChange={set('total')} />
            <input aria-label="Deposit percent" inputMode="numeric" placeholder="Deposit %" value={form.deposit} onChange={set('deposit')} />
            <input aria-label="Valid for days" inputMode="numeric" placeholder="Valid days" value={form.days} onChange={set('days')} />
          </div>
          <p className="note">Deposit {ready ? money(Math.min(totalCents, Math.round((totalCents * Number(form.deposit)) / 100 / 100) * 100)) : '—'} · {e.name} &lt;{e.email}&gt; gets the link from you.</p>
          <div>
            <button type="button" className="btn" disabled={!ready || create.isPending}
              onClick={() => create.mutate({ data: { enquiry_id: e.id, client_name: e.name, client_email: e.email, title: form.title.trim(), scope, total_cents: totalCents, deposit_pct: Number(form.deposit), valid_days: Number(form.days) } })}>
              {create.isPending ? 'Saving…' : 'Create quote'}
            </button>{' '}
            <button type="button" className="btn" onClick={() => setOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
      {(create.isError || withdraw.isError) && <p className="alert">{serverErrorText(create.error ?? withdraw.error)}</p>}
    </div>
  );
}

function Row({ e, quotes }: { e: Enquiry; quotes: Quote[] }) {
  const client = useQueryClient();
  const [notes, setNotes] = useState(e.notes ?? '');
  const update = useUpdateEnquiry({ mutation: { onSuccess: () => client.invalidateQueries({ queryKey: getListEnquiriesQueryKey() }) } });
  const save = (body: { stage?: Enquiry['stage']; notes?: string | null }) => update.mutate({ id: e.id, data: body });
  return (
    <li className="client">
      <div className="client-head">
        <div>
          <b>{e.test && <span className="label">Test · </span>}#{e.id} {KIND[e.kind] ?? e.kind}</b>
          <div className="note">{e.name} · <a href={`mailto:${e.email}`}>{e.email}</a> · {when(e.created_at)}</div>
        </div>
        <div className="field">
          <select aria-label={`Stage of enquiry ${e.id}`} value={e.stage} disabled={update.isPending}
            onChange={(ev) => save({ stage: ev.target.value as Enquiry['stage'] })}>
            {STAGES.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
          </select>
        </div>
      </div>
      <div className="client-facts note">
        {e.features.length > 0 && <span>Needs: {e.features.join(', ')}</span>}
        <span>Has: {e.has_now} · When: {e.timing} · Budget: {e.budget}</span>
        {e.ballpark && <span>Ballpark shown: {e.ballpark}</span>}
        {e.about && <span>About: {e.about}</span>}
      </div>
      <div className="field">
        <textarea aria-label={`Notes for enquiry ${e.id}`} rows={2} maxLength={2000} placeholder="Your notes (call booked, quote amount…)"
          value={notes} onChange={(ev) => setNotes(ev.target.value)}
          onBlur={() => { if (notes !== (e.notes ?? '')) save({ notes: notes.trim() || null }); }} />
      </div>
      {update.isError && <p className="alert">{serverErrorText(update.error)}</p>}
      <Quotes e={e} quotes={quotes} />
    </li>
  );
}

export function Clients() {
  const list = useListEnquiries({ query: { queryKey: getListEnquiriesQueryKey(), refetchInterval: 60_000 } });
  const quotes = useListQuotes({ query: { queryKey: getListQuotesQueryKey(), refetchInterval: 60_000 } }).data ?? [];
  const rows = list.data ?? [];
  const [stage, setStage] = useState<Enquiry['stage'] | 'all'>('all');
  const shown = stage === 'all' ? rows : rows.filter((r) => r.stage === stage);
  return (
    <div className="ng-page dusk">
      <div className="ng-wrap">
        <Header />
        <section className="glass panel" aria-label="Clients">
          <div className="panel-head">
            <h2>Clients · DDG Build</h2>
            <span className="label">Website enquiries open to the public on 1 Jan 2027</span>
          </div>
          <div className="nav" role="tablist" aria-label="Stage" style={{ padding: 0, flexWrap: 'wrap' }}>
            {[{ key: 'all' as const, label: 'All' }, ...STAGES].map((s) => (
              <button key={s.key} type="button" role="tab" aria-selected={stage === s.key} className="btn"
                style={{ border: 0, minHeight: 40, background: stage === s.key ? 'rgba(255,255,255,0.10)' : 'transparent' }}
                onClick={() => setStage(s.key)}>
                {s.label} {s.key === 'all' ? rows.length : rows.filter((r) => r.stage === s.key).length}
              </button>
            ))}
          </div>
          <ul className="list clients">
            {shown.map((e) => <Row key={e.id} e={e} quotes={quotes.filter((q) => q.enquiry_id === e.id)} />)}
            {!shown.length && <li className="note">{list.isLoading ? 'Loading…' : list.isError ? 'Couldn\'t load enquiries.' : 'No enquiries here yet.'}</li>}
          </ul>
        </section>
      </div>
    </div>
  );
}
