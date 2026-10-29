import { useState, type FormEvent } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  getGetConnectionsQueryKey, getListAsksQueryKey, getListBotPushesQueryKey, getListMessagesQueryKey, getGetOverviewQueryKey,
  useCreateAsk, useGetConnections, useListBotPushes, useListMessages, useSendMessage, useUndoBotPush,
} from '@workspace/api-client-react';
import { Header } from '@/components/header';
import { serverErrorText } from '@/lib/errors';

const STATE_DOT: Record<string, string> = { ok: '#ffffff', stale: 'var(--ng-amber)', off: 'transparent' };
const when = (iso: string | null) => (iso
  ? new Intl.DateTimeFormat('en-AU', { timeZone: 'Australia/Brisbane', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }).format(new Date(iso))
  : '—');

function Connections() {
  const feeds = useGetConnections();
  return (
    <section className="glass panel" aria-label="Connections">
      <div className="panel-head"><h2>Connections</h2><span className="label">Where Control's numbers come from</span></div>
      <div className="table-scroll">
        <table>
          <thead><tr><th>Feed</th><th>State</th><th>Detail</th><th>Last update</th></tr></thead>
          <tbody>
            {(feeds.data ?? []).map((f) => (
              <tr key={f.key}>
                <td>{f.label}</td>
                <td><span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
                  <span className="dot" style={{ background: STATE_DOT[f.state], boxShadow: f.state === 'off' ? 'inset 0 0 0 1px rgba(255,255,255,0.55)' : undefined }} />
                  {f.state === 'ok' ? 'Connected' : f.state === 'stale' ? 'Late' : 'Not connected'}
                </span></td>
                <td className="muted">{f.detail}</td>
                <td className="note">{when(f.as_of)}</td>
              </tr>
            ))}
            {!feeds.data && <tr><td colSpan={4} className="note">{feeds.isError ? 'Couldn\'t check the feeds.' : 'Checking…'}</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  );
}

const KIND_LABEL: Record<string, string> = { ask: 'to-do', social: 'social', expense: 'expense', revenue: 'revenue' };
const name = (who: string) => (who === 'all' ? 'All bots' : who[0]!.toUpperCase() + who.slice(1));

function Messages() {
  const client = useQueryClient();
  const list = useListMessages({ query: { queryKey: getListMessagesQueryKey(), refetchInterval: 60_000 } });
  const send = useSendMessage();
  const [to, setTo] = useState('all');
  const [text, setText] = useState('');
  const [message, setMessage] = useState('');
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage('');
    try {
      await send.mutateAsync({ data: { to, text: text.trim() } });
      await client.invalidateQueries({ queryKey: getListMessagesQueryKey() });
      setText('');
    } catch (e) { setMessage(serverErrorText(e, 'Could not send.')); }
  };
  return (
    <section className="glass panel" aria-label="Messages">
      <div className="panel-head"><h2>Messages</h2><span className="label">Markus · Claude · Grok bots · newest first</span></div>
      <form className="form" onSubmit={submit}>
        <label className="field" style={{ flex: '0 1 180px' }}>To
          <select value={to} onChange={(e) => setTo(e.target.value)}>
            <option value="all">All bots</option><option value="heimdall">Heimdall</option><option value="freya">Freya</option>
            <option value="tyr">Tyr</option><option value="claude">Claude</option>
          </select>
        </label>
        <label className="field" style={{ flex: '3 1 320px' }}>Message<input value={text} onChange={(e) => setText(e.target.value)} maxLength={4000} required /></label>
        <button type="submit" className="btn fill" disabled={send.isPending}>{send.isPending ? 'Sending…' : 'Send'}</button>
      </form>
      {message && <p role="alert" className="alert" style={{ margin: 0 }}>{message}</p>}
      <div className="table-scroll" style={{ maxHeight: 360 }}>
        <table>
          <thead><tr><th>When</th><th>From → To</th><th>Message</th><th>Read</th></tr></thead>
          <tbody>
            {(list.data ?? []).map((m) => (
              <tr key={m.id}>
                <td className="note" style={{ whiteSpace: 'nowrap' }}>{when(m.created_at)}</td>
                <td style={{ whiteSpace: 'nowrap' }}>{name(m.from)} → {name(m.to)}</td>
                <td style={{ whiteSpace: 'pre-wrap' }}>{m.text}</td>
                <td className="note">{m.to === 'all' || m.to === 'markus' ? '—' : m.read_at ? when(m.read_at) : 'Not yet'}</td>
              </tr>
            ))}
            {!list.data?.length && <tr><td colSpan={4} className="note">{list.isLoading ? 'Loading…' : 'No messages yet.'}</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function AddAsk() {
  const client = useQueryClient();
  const create = useCreateAsk();
  const [text, setText] = useState('');
  const [business, setBusiness] = useState('');
  const [due, setDue] = useState('');
  const [message, setMessage] = useState('');
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage('');
    try {
      await create.mutateAsync({ data: { text: text.trim(), business: (business || null) as never, due: due.trim() || null } });
      await client.invalidateQueries({ queryKey: getListAsksQueryKey() });
      setText(''); setDue(''); setMessage('Added to Needs you.');
    } catch (e) { setMessage(serverErrorText(e, 'Could not add.')); }
  };
  return (
    <section className="glass panel" aria-label="Add to Needs you">
      <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>Add to Needs you</h2>
      <form className="form" onSubmit={submit}>
        <label className="field" style={{ flex: '3 1 320px' }}>What needs doing<input value={text} onChange={(e) => setText(e.target.value)} maxLength={200} required /></label>
        <label className="field">Business
          <select value={business} onChange={(e) => setBusiness(e.target.value)}>
            <option value="">DDG (company)</option><option value="finance">Finance</option><option value="coffee">Coffee</option>
            <option value="fitness">Fitness</option><option value="creative">Creative</option>
          </select>
        </label>
        <label className="field">When<input value={due} onChange={(e) => setDue(e.target.value)} maxLength={40} placeholder="e.g. 16 Nov" /></label>
        <button type="submit" className="btn fill" disabled={create.isPending}>{create.isPending ? 'Adding…' : 'Add'}</button>
      </form>
      {message && <p role="status" className="muted" style={{ margin: 0 }}>{message}</p>}
    </section>
  );
}

function BotLog() {
  const client = useQueryClient();
  const pushes = useListBotPushes();
  const undo = useUndoBotPush();
  const [error, setError] = useState('');
  const doUndo = async (id: number, summary: string) => {
    if (!window.confirm(`Undo this push and remove what it added?\n\n${summary}`)) return;
    setError('');
    try {
      await undo.mutateAsync({ id });
      await Promise.all([getListBotPushesQueryKey(), getGetOverviewQueryKey(), getListAsksQueryKey(), getGetConnectionsQueryKey()]
        .map((queryKey) => client.invalidateQueries({ queryKey })));
    } catch (e) { setError(serverErrorText(e, 'Could not undo.')); }
  };
  return (
    <section className="glass panel" aria-label="Bot push log">
      <div className="panel-head"><h2>Bot push log</h2><span className="label">Every number a bot sent · newest first</span></div>
      {error && <p className="alert" role="alert" style={{ margin: 0 }}>{error}</p>}
      <div className="table-scroll">
        <table>
          <thead><tr><th>When</th><th>Bot</th><th>What</th><th>Details</th><th>Result</th><th><span className="sr-only">Undo</span></th></tr></thead>
          <tbody>
            {(pushes.data ?? []).map((p) => {
              const accepted = p.status < 300;
              return (
                <tr key={p.id} style={p.undone_at ? { opacity: 0.45 } : undefined}>
                  <td className="note">{when(p.received_at)}</td>
                  <td style={{ textTransform: 'capitalize' }}>{p.bot}</td>
                  <td>{KIND_LABEL[p.kind] ?? p.kind}</td>
                  <td>{p.summary}</td>
                  <td>{p.undone_at ? `Undone ${when(p.undone_at)}` : accepted ? 'Saved' : <span className="alert">Rejected{p.error ? `: ${p.error}` : ` (${p.status})`}</span>}</td>
                  <td style={{ textAlign: 'right' }}>
                    {accepted && !p.undone_at && p.record_id !== null && (
                      <button type="button" className="btn" style={{ minHeight: 36 }} disabled={undo.isPending} onClick={() => void doUndo(p.id, p.summary)}>Undo</button>
                    )}
                  </td>
                </tr>
              );
            })}
            {!pushes.data?.length && <tr><td colSpan={6} className="note">{pushes.isLoading ? 'Loading…' : 'No bot has pushed anything yet.'}</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function Ops() {
  return (
    <div className="ng-page">
      <div className="ng-wrap">
        <Header />
        <h1 style={{ margin: 0, fontSize: 32, fontWeight: 400 }}>Ops</h1>
        <p className="muted" style={{ margin: 0, maxWidth: 760 }}>
          Talk to the bots, see what feeds Control, what the bots have sent, and what needs you. Bots can only add; if a bot sends something wrong, press Undo and it's removed everywhere.
        </p>
        <Messages />
        <Connections />
        <AddAsk />
        <BotLog />
      </div>
    </div>
  );
}
