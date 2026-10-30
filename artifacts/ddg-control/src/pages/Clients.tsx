import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getListEnquiriesQueryKey, useListEnquiries, useUpdateEnquiry, type Enquiry } from '@workspace/api-client-react';
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

function Row({ e }: { e: Enquiry }) {
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
    </li>
  );
}

export function Clients() {
  const list = useListEnquiries({ query: { queryKey: getListEnquiriesQueryKey(), refetchInterval: 60_000 } });
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
            {shown.map((e) => <Row key={e.id} e={e} />)}
            {!shown.length && <li className="note">{list.isLoading ? 'Loading…' : list.isError ? 'Couldn\'t load enquiries.' : 'No enquiries here yet.'}</li>}
          </ul>
        </section>
      </div>
    </div>
  );
}
