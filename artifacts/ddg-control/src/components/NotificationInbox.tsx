import { useEffect, useId, useRef, useState } from 'react';
import { Link } from 'wouter';
import { getListDecisionsQueryKey, useListDecisions } from '@workspace/api-client-react';
import { formatCurrentDisplayName } from '@/lib/format';

/** Notifications are projections of existing decisions, not a second approval system. */
export function NotificationInbox() {
  const query = useListDecisions({ status: 'pending' }, {
    query: { queryKey: getListDecisionsQueryKey({ status: 'pending' }) },
  });
  const [readIds, setReadIds] = useState<Set<number>>(() => new Set());
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const decisions = query.data ?? [];
  const unread = decisions.filter((decision) => !readIds.has(decision.id)).length;

  useEffect(() => {
    if (!open) return;
    function outside(event: PointerEvent) {
      if (event.target instanceof Node && !root.current?.contains(event.target)) setOpen(false);
    }
    function escape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
        trigger.current?.focus();
      }
    }
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('keydown', escape);
    };
  }, [open]);

  function markRead(id: number) {
    setReadIds((previous) => new Set([...previous, id]));
  }

  return (
    <div className="notification-inbox" ref={root}>
      <button ref={trigger} type="button" className="notification-trigger"
        aria-expanded={open} aria-controls={panelId}
        aria-label={query.isLoading ? 'Notifications loading' : query.isError ? 'Notifications unavailable' : `Notifications: ${unread} unread saved decisions`}
        onClick={() => setOpen((value) => !value)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></svg>
        {!query.isLoading && !query.isError && unread > 0 && <span className="notification-count">{unread}</span>}
        {query.isError && <span aria-hidden="true">!</span>}
      </button>
      {open && (
        <section id={panelId} className="notification-panel" aria-labelledby={`${panelId}-title`}>
          <div className="notification-heading"><h2 id={`${panelId}-title`}>Needs your review</h2><button type="button" onClick={() => { setOpen(false); trigger.current?.focus(); }} aria-label="Close notifications">×</button></div>
          <p className="notification-note">Saved decisions only. Reading is not approval. Read markers reset when this page reloads.</p>
          {query.isLoading ? <p role="status">Loading decisions…</p>
            : query.isError ? <div role="alert"><p>Notifications unavailable.</p><button type="button" onClick={() => void query.refetch()}>Retry</button></div>
              : decisions.length === 0 ? <p>No pending decision records. Other system alerts are not connected here yet.</p>
                : <ul className="notification-list">{decisions.map((decision) => (
                  <li key={decision.id} className={readIds.has(decision.id) ? 'notification-read' : 'notification-unread'}>
                    <Link href={`/decisions#decision-${decision.id}`} onClick={() => { markRead(decision.id); setOpen(false); }}>
                      <span className="notification-meta">{decision.project_slug} · {decision.urgency} urgency</span>
                      <strong>{formatCurrentDisplayName(decision.title)}</strong>
                      <small>{readIds.has(decision.id) ? 'Read · still needs a decision' : 'Unread · review record'} →</small>
                    </Link>
                    {!readIds.has(decision.id) && <button type="button" onClick={() => markRead(decision.id)} aria-label={`Mark ${formatCurrentDisplayName(decision.title)} as read`}>Mark read</button>}
                  </li>
                ))}</ul>}
          <Link className="notification-view-all" href="/decisions" onClick={() => setOpen(false)}>Open all decision records →</Link>
        </section>
      )}
    </div>
  );
}
