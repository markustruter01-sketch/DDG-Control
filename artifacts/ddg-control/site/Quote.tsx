import { useEffect, useState, type ReactElement } from 'react';
import type { PublicQuote } from '@workspace/api-client-react';
import { QUOTE_PAGE } from './content';

// ddg.limited/quote/<token>: a client's private quote. They read it, type their name to
// accept, then pay the deposit through Stripe (or we invoice it while payments are not set up).

const money = (cents: number) => `$${(cents / 100).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const longDate = (ymd: string) => new Date(`${ymd}T00:00:00+10:00`).toLocaleDateString('en-AU', { timeZone: 'Australia/Brisbane', day: 'numeric', month: 'long', year: 'numeric' });

export function QuotePage({ token, Nav, Footer }: { token: string; Nav: (props: { home?: boolean }) => ReactElement; Footer: () => ReactElement }) {
  const [quote, setQuote] = useState<PublicQuote | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [agree, setAgree] = useState(false);
  const [busy, setBusy] = useState(false);
  const [invoiceNext, setInvoiceNext] = useState(false);

  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get('session_id');
    const url = sessionId
      ? `/api/public/quotes/${encodeURIComponent(token)}/payment/${encodeURIComponent(sessionId)}`
      : `/api/public/quotes/${encodeURIComponent(token)}`;
    fetch(url)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(r.status === 404 ? QUOTE_PAGE.notFound : QUOTE_PAGE.loadError))))
      .then((q: PublicQuote) => setQuote(q))
      .catch((err: Error) => setError(err.message));
  }, [token]);

  const accept = async () => {
    setBusy(true);
    setError(null);
    try {
      const r = await fetch(`/api/public/quotes/${encodeURIComponent(token)}/accept`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: name.trim(), agree: true }),
      });
      const body = await r.json();
      if (!r.ok) throw new Error(body?.error ?? QUOTE_PAGE.loadError);
      if (body.checkout_url) { window.location.href = body.checkout_url; return; }
      setInvoiceNext(true);
      setQuote((q) => (q ? { ...q, status: body.status, accepted_name: name.trim() } : q));
    } catch (err) {
      setError(err instanceof Error ? err.message : QUOTE_PAGE.loadError);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="s-plain dusk">
      <Nav />
      <main className="s-main s-start q-main">
        <p className="s-eyebrow">{QUOTE_PAGE.eyebrow}</p>
        {!quote && <h1 className="s-page-title">{error ?? 'Loading your quote…'}</h1>}
        {quote && (
          <>
            <h1 className="s-page-title">{quote.title}</h1>
            <p className="s-lead">Prepared for {quote.client_name}. Valid until {longDate(quote.valid_until)}.</p>
            <section className="s-card q-card" aria-label="What's included">
              <h2>What’s included</h2>
              <ul className="q-scope">{quote.scope.map((line) => <li key={line}>{line}</li>)}</ul>
              <dl className="q-price">
                <div><dt>Fixed price</dt><dd>{money(quote.total_cents)}</dd></div>
                <div><dt>Deposit to start</dt><dd>{money(quote.deposit_cents)}</dd></div>
                <div><dt>The rest</dt><dd>{money(quote.total_cents - quote.deposit_cents)}, in stages as agreed</dd></div>
              </dl>
              <p className="s-note">{QUOTE_PAGE.gst}</p>
            </section>
            <section className="s-card q-card" aria-label="How it works from here">
              <h2>{QUOTE_PAGE.termsTitle}</h2>
              <ul className="q-scope">{QUOTE_PAGE.terms.map((line) => <li key={line}>{line}</li>)}</ul>
            </section>
            {quote.status === 'paid' && <p className="q-done">{QUOTE_PAGE.paid}</p>}
            {quote.status === 'accepted' && (
              <div className="q-done">
                <p>{QUOTE_PAGE.accepted(quote.accepted_name ?? '')}</p>
                {quote.payments_ready && !invoiceNext
                  ? <button type="button" className="s-btn" disabled={busy} onClick={accept}>{busy ? 'Opening payment…' : `Pay the ${money(quote.deposit_cents)} deposit`}</button>
                  : <p>{QUOTE_PAGE.invoice}</p>}
              </div>
            )}
            {(quote.status === 'withdrawn' || quote.status === 'expired') && <p className="q-done">{QUOTE_PAGE.closed(quote.status)}</p>}
            {quote.status === 'sent' && (
              <form className="s-card q-card q-accept" onSubmit={(ev) => { ev.preventDefault(); void accept(); }}>
                <h2>Accept this quote</h2>
                <label className="q-field">
                  <span>Your full name</span>
                  <input value={name} onChange={(ev) => setName(ev.target.value)} maxLength={120} autoComplete="name" required minLength={2} />
                </label>
                <label className="q-check">
                  <input type="checkbox" checked={agree} onChange={(ev) => setAgree(ev.target.checked)} />
                  <span>{QUOTE_PAGE.agree}</span>
                </label>
                <button type="submit" className="s-btn" disabled={busy || !agree || name.trim().length < 2}>
                  {busy ? 'Saving…' : quote.payments_ready ? `Accept and pay the ${money(quote.deposit_cents)} deposit` : 'Accept this quote'}
                </button>
              </form>
            )}
            {error && <p className="s-form-error">{error}</p>}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
