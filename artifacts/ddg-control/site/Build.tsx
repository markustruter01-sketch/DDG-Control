import { useState, type FormEvent, type ReactNode } from 'react';
import type { PublicSummary } from '@workspace/api-client-react';
import { BUILD_FORM, BUILD_STEPS, CARE, SERVICES, START, type ServiceKey } from './content';

// DDG Build: we build platforms for other businesses. Shown as a teaser until the server says
// it is open (SERVICES_OPEN_ON on the server). ?preview=build shows the full section; the server
// only accepts a test enquiry from a logged-in owner before the opening date.

const ICONS: Record<ServiceKey, ReactNode> = {
  website: <><rect pathLength={1} x="3" y="4" width="18" height="16" rx="2" /><path pathLength={1} d="M3 9h18M6.5 6.5h.01M9.5 6.5h.01" /></>,
  store: <><path pathLength={1} d="M5 8h14l-1.2 12H6.2z" /><path pathLength={1} d="M9 8V6.5a3 3 0 0 1 6 0V8" /></>,
  platform: <><path pathLength={1} d="M12 3l9 5-9 5-9-5z" /><path pathLength={1} d="M3 13l9 5 9-5" /></>,
  app: <><rect pathLength={1} x="7" y="2.5" width="10" height="19" rx="2.5" /><path pathLength={1} d="M11 18.5h2" /></>,
  ai: <path pathLength={1} d="M12 3v5M12 16v5M3 12h5M16 12h5M6 6l3 3M15 15l3 3M18 6l-3 3M9 15l-3 3" />,
};
const ServiceIcon = ({ k }: { k: ServiceKey }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{ICONS[k]}</svg>
);
const aud = (n: number) => `$${n.toLocaleString('en-AU')}`;
const openDate = (iso: string) => new Intl.DateTimeFormat('en-AU', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${iso}T00:00:00Z`));

type Kind = ServiceKey | 'unsure';
type Sent = { state: 'idle' } | { state: 'sending' } | { state: 'done'; test: boolean } | { state: 'error'; message: string };

/** The one-page enquiry form: what, what it does, what exists, when and budget, who. */
export function EnquiryForm() {
  const [kind, setKind] = useState<Kind | null>(null);
  const [hasNow, setHasNow] = useState('');
  const [timing, setTiming] = useState('');
  const [budget, setBudget] = useState('');
  const [sent, setSent] = useState<Sent>({ state: 'idle' });

  async function submit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const form = new FormData(ev.currentTarget);
    const name = String(form.get('name') ?? '').trim();
    const email = String(form.get('email') ?? '').trim();
    if (!kind || !hasNow || !timing || !budget || !name || !email) {
      return setSent({ state: 'error', message: 'Please answer all five questions.' });
    }
    setSent({ state: 'sending' });
    const body = {
      kind, features: [], has_now: hasNow, timing, budget, name, email,
      about: String(form.get('about') ?? '').trim() || undefined, fax: String(form.get('fax') ?? ''),
    };
    try {
      const r = await fetch('/api/public/enquiry', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
      const json = await r.json().catch(() => ({}));
      if (r.ok) return setSent({ state: 'done', test: Boolean(json.test) });
      setSent({ state: 'error', message: typeof json.error === 'string' ? json.error : 'Something went wrong. Please try again.' });
    } catch {
      setSent({ state: 'error', message: 'Could not send. Check your connection and try again.' });
    }
  }

  if (sent.state === 'done') {
    return (
      <div className="s-form glass-plain" role="status">
        <h3>{sent.test ? 'Test enquiry saved.' : START.done}</h3>
        {sent.test && <p>It is in Control → Clients, marked Test.</p>}
      </div>
    );
  }

  return (
    <form className="s-form glass-plain" onSubmit={submit} noValidate>
      <fieldset>
        <legend><span>1</span> What do you want built?</legend>
        <div className="s-chips">
          {BUILD_FORM.kinds.map((k) => (
            <label key={k.key} className="s-chip"><input type="radio" name="kind" checked={kind === k.key} onChange={() => setKind(k.key)} />{k.label}</label>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend><span>2</span> {START.aboutLabel}</legend>
        <textarea name="about" maxLength={300} rows={3} placeholder={START.aboutHint} aria-label={START.aboutLabel} />
      </fieldset>
      <fieldset>
        <legend><span>3</span> Do you have anything already?</legend>
        <div className="s-chips">
          {BUILD_FORM.hasNow.map((h) => (
            <label key={h.key} className="s-chip"><input type="radio" name="has_now" checked={hasNow === h.key} onChange={() => setHasNow(h.key)} />{h.label}</label>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend><span>4</span> When, and roughly what budget?</legend>
        <div className="s-pair">
          <select aria-label="When" value={timing} onChange={(e) => setTiming(e.target.value)}>
            <option value="" disabled>When</option>
            {BUILD_FORM.timing.map((t) => <option key={t.key} value={t.key}>{t.label}</option>)}
          </select>
          <select aria-label="Budget" value={budget} onChange={(e) => setBudget(e.target.value)}>
            <option value="" disabled>Budget (AUD)</option>
            {BUILD_FORM.budget.map((b) => <option key={b.key} value={b.key}>{b.label}</option>)}
          </select>
        </div>
      </fieldset>
      <fieldset>
        <legend><span>5</span> How do we reach you?</legend>
        <div className="s-pair">
          <input name="name" required maxLength={80} placeholder="Name" autoComplete="name" aria-label="Name" />
          <input name="email" type="email" required maxLength={160} placeholder="Email" autoComplete="email" aria-label="Email" />
        </div>
        <input name="fax" tabIndex={-1} autoComplete="off" className="s-hp" aria-hidden="true" />
      </fieldset>
      <div className="s-form-foot">
        <p className="s-note">We only use your details to reply. No GST: DDG is not registered for GST.</p>
        <button className="s-btn fill" type="submit" disabled={sent.state === 'sending'}>{sent.state === 'sending' ? 'Sending…' : 'Send'}</button>
      </div>
      {sent.state === 'error' && <p className="s-form-error" role="alert">{sent.message}</p>}
    </form>
  );
}

export function Build({ summary }: { summary: PublicSummary | null }) {
  const preview = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('preview') === 'build';
  const open = Boolean(summary?.services_open);
  const opensOn = summary?.services_open_on ?? '2026-11-08';
  return (
    <section id="build" className="s-build" aria-labelledby="build-title">
      <p className="s-eyebrow">DDG Build{open ? '' : ` · opens ${openDate(opensOn)}`}</p>
      <h2 id="build-title">We build platforms like these, for you.</h2>
      <p className="s-lead">Websites, online stores, platforms, phone apps and AI, built the way we build our own businesses, at about 25% below typical Australian prices.</p>
      {!open && !preview ? (
        <div className="s-teaser glass-plain">
          <ul className="s-teaser-list">
            {SERVICES.map((s) => <li key={s.key}><ServiceIcon k={s.key} />{s.name}</li>)}
          </ul>
          <p>Coming {openDate(opensOn)}. We are finishing our own platforms first.</p>
        </div>
      ) : (
        <>
          {!open && <p className="s-preview" role="note">Preview. Opens {openDate(opensOn)}; until then only a logged-in owner can send a test enquiry.</p>}
          <div className="s-services">
            {SERVICES.map((s) => (
              <article key={s.key} className="s-service glass-plain">
                <span className="s-ico"><ServiceIcon k={s.key} /></span>
                <h3>{s.name}</h3>
                <p>{s.line}</p>
                <p className="s-price"><b>from {aud(s.from)}</b><span>typically {aud(s.from)}–{aud(s.to)}</span></p>
                <p className="s-note">{s.proof}</p>
              </article>
            ))}
          </div>
          <p className="s-note">{CARE}</p>
          <ol className="s-steps">
            {BUILD_STEPS.map((s, i) => <li key={s.title}><span>{i + 1}</span><b>{s.title}</b><p>{s.line}</p></li>)}
          </ol>
          <p><a className="s-btn fill" href="/start">Start your build →</a></p>
        </>
      )}
    </section>
  );
}
