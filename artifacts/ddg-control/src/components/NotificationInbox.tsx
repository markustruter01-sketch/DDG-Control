import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'wouter';
import { getListDecisionsQueryKey, useListDecisions } from '@workspace/api-client-react';
import { decisionNotificationPayload } from '@workspace/project-constants';
import { formatCurrentDisplayName } from '@/lib/format';

type Receipt = { decision_id: number; source_version: string; read_at: string | null };
type ReceiptList = { items: Receipt[] };
type Snapshot = Array<{ id: number; payload: string }>;
type Versions = { snapshot: Snapshot; items: Array<{ decision_id: number; source_version: string }> };
const PAGE_SIZE = 20;
const RECEIPT_KEY = 'decision-notification-receipts';

async function loadReceipts(ids: number[]): Promise<ReceiptList> {
  const response = await fetch('/api/notification-receipts?decision_ids=' + ids.join(','), { cache: 'no-store' });
  if (!response.ok) throw new Error('Saved read markers are unavailable. Decision records remain separate.');
  return response.json();
}

async function saveReceipt(input: { decision_id: number; source_version: string }): Promise<Receipt> {
  const response = await fetch('/api/notification-receipts', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(typeof body?.error === 'string' ? body.error : 'Read marker save is unconfirmed. Refresh before retrying.');
  }
  return response.json();
}

/** Saved decisions only. Read receipts never grant approval or execution. */
export function NotificationInbox({ devBypass = false }: { devBypass?: boolean }) {
  const client = useQueryClient();
  const query = useListDecisions({ status: 'pending' }, {
    query: { queryKey: getListDecisionsQueryKey({ status: 'pending' }) },
  });
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [versions, setVersions] = useState<Versions | null>(null);
  const [versionError, setVersionError] = useState(false);
  const panelId = useId();
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const decisions = query.data ?? [];
  const pages = Math.max(1, Math.ceil(decisions.length / PAGE_SIZE));
  const visible = decisions.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const snapshot = useMemo<Snapshot>(() => (query.data ?? [])
    .slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
    .map((decision) => ({ id: decision.id, payload: decisionNotificationPayload(decision) })), [query.data, page]);

  useEffect(() => { if (page >= pages) setPage(0); }, [page, pages]);

  useEffect(() => {
    if (!open || devBypass || !snapshot.length) return;
    let cancelled = false;
    setVersionError(false);
    async function hash() {
      try {
        if (!globalThis.crypto?.subtle) throw new Error('Secure hashing unavailable');
        const items = await Promise.all(snapshot.map(async ({ id, payload }) => {
          const bytes = await globalThis.crypto.subtle.digest('SHA-256', new TextEncoder().encode(payload));
          return { decision_id: id, source_version: Array.from(new Uint8Array(bytes), (byte) => byte.toString(16).padStart(2, '0')).join('') };
        }));
        if (!cancelled) setVersions({ snapshot, items });
      } catch { if (!cancelled) setVersionError(true); }
    }
    void hash();
    return () => { cancelled = true; };
  }, [snapshot, open, devBypass]);

  const readyVersions = versions && versions.snapshot === snapshot ? versions.items : null;
  const receipts = useQuery({
    queryKey: [RECEIPT_KEY, readyVersions ?? []],
    queryFn: () => loadReceipts(snapshot.map((entry) => entry.id)),
    enabled: open && !devBypass && Boolean(readyVersions) && snapshot.length > 0 && !query.isError,
    retry: false, refetchOnWindowFocus: false,
  });
  const markRead = useMutation({
    mutationFn: saveReceipt, retry: false,
    onSuccess: async () => { await client.invalidateQueries({ queryKey: [RECEIPT_KEY] }); },
    onError: () => setOpen(true),
  });

  useEffect(() => {
    if (!open) return;
    function outside(event: PointerEvent) {
      if (event.target instanceof Node && !root.current?.contains(event.target)) setOpen(false);
    }
    function escape(event: KeyboardEvent) {
      if (event.key === 'Escape') { setOpen(false); trigger.current?.focus(); }
    }
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('keydown', escape);
    };
  }, [open]);

  function stateFor(id: number) {
    const expected = readyVersions?.find((item) => item.decision_id === id);
    const saved = receipts.data?.items.find((item) => item.decision_id === id);
    const ready = !devBypass && !versionError && !receipts.isError && !receipts.isFetching &&
      Boolean(expected && saved && expected.source_version === saved.source_version);
    return { expected, ready, read: ready && Boolean(saved?.read_at) };
  }

  function read(id: number) {
    const state = stateFor(id);
    if (state.ready && state.expected && !state.read && !markRead.isPending) markRead.mutate(state.expected);
  }

  function refresh() {
    markRead.reset();
    void query.refetch();
    void client.invalidateQueries({ queryKey: [RECEIPT_KEY] });
  }

  return (
    <div className="notification-inbox" ref={root}>
      <button ref={trigger} type="button" className="notification-trigger"
        aria-expanded={open} aria-controls={panelId}
        aria-label={query.isLoading ? 'Notifications loading' : query.isError ? 'Notifications unavailable' : `Notifications: ${decisions.length} pending saved decisions`}
        onClick={() => setOpen((value) => !value)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></svg>
        {!query.isLoading && !query.isError && decisions.length > 0 && <span className="notification-count">{decisions.length}</span>}
        {query.isError && <span aria-hidden="true">!</span>}
      </button>
      {open && (
        <section id={panelId} className="notification-panel" aria-labelledby={`${panelId}-title`}>
          <div className="notification-heading"><h2 id={`${panelId}-title`}>Needs your review</h2><button type="button" onClick={() => { setOpen(false); trigger.current?.focus(); }} aria-label="Close notifications">×</button></div>
          <p className="notification-note">Badge counts pending decisions. Reading is not approval; a read record can still need your decision.</p>
          {devBypass ? <p role="note">Preview mode: saved read markers require a real owner sign-in.</p> :
            <p className="notification-note">Mark read saves across your signed-in devices. Opening a decision leaves its read state unchanged.</p>}
          {versionError && <p role="alert">Read status unavailable in this browser. You can still open decisions; no read marker will be saved.</p>}
          {receipts.isError && <p role="alert">Saved read markers unavailable. Decisions remain unchanged.</p>}
          {markRead.isError && <p role="alert">{markRead.error.message}</p>}
          {!devBypass && !query.isLoading && decisions.length > 0 && <button type="button" onClick={refresh} disabled={query.isFetching || receipts.isFetching || markRead.isPending}>Refresh records and read status</button>}
          {query.isLoading ? <p role="status">Loading decisions…</p>
            : query.isError ? <div role="alert"><p>Notifications unavailable.</p><button type="button" onClick={() => void query.refetch()}>Retry</button></div>
              : decisions.length === 0 ? <p>No pending decision records. Other system alerts are not connected here yet.</p>
                : <>
                  <ul className="notification-list">{visible.map((decision) => {
                    const state = stateFor(decision.id);
                    const label = devBypass || !state.ready ? 'Read status unknown' : state.read ? 'Read · still needs a decision' : 'Unread · review record';
                    return <li key={decision.id} className={state.read ? 'notification-read' : state.ready ? 'notification-unread' : 'notification-unknown'}>
                      <Link href={`/decisions#decision-${decision.id}`} onClick={() => { setOpen(false); window.setTimeout(() => window.dispatchEvent(new CustomEvent('ddg:decision-focus', { detail: decision.id })), 0); }}>
                        <span className="notification-meta">{decision.project_slug} · {decision.urgency} urgency</span>
                        <strong>{formatCurrentDisplayName(decision.title)}</strong>
                        <small>{label} →</small>
                      </Link>
                      {!state.read && <button type="button" onClick={() => read(decision.id)} disabled={!state.ready || markRead.isPending} aria-label={`Mark ${formatCurrentDisplayName(decision.title)} as read`}>
                        {markRead.isPending && markRead.variables?.decision_id === decision.id ? 'Saving…' : 'Mark read'}
                      </button>}
                    </li>;
                  })}</ul>
                  {pages > 1 && <nav className="notification-pagination" aria-label="Notification pages">
                    <button type="button" disabled={page === 0 || markRead.isPending} onClick={() => setPage((value) => value - 1)}>Previous</button>
                    <span aria-live="polite">Page {page + 1} of {pages}</span>
                    <button type="button" disabled={page + 1 >= pages || markRead.isPending} onClick={() => setPage((value) => value + 1)}>Next</button>
                  </nav>}
                </>}
          <Link className="notification-view-all" href="/decisions" onClick={() => setOpen(false)}>Open all decision records →</Link>
        </section>
      )}
    </div>
  );
}
