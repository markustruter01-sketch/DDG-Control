import { useEffect, useState, type MouseEvent } from 'react';
import { flushSync } from 'react-dom';
import type { PublicSummary } from '@workspace/api-client-react';
import { Link, Route, Router, Switch, useLocation } from 'wouter';
import { BusinessIcon } from '@/components/BusinessIcon';
import { PlatformIcon } from '@/components/PlatformIcon';
import { LAUNCH_DATE } from '@/lib/company';
import { daysUntil } from '@/lib/money';
import { SOCIALS, type Platform } from '@/lib/public-info';
import { Build, EnquiryForm } from './Build';
import { FinancePage } from './Finance';
import { QuotePage } from './Quote';
import { CHARITY, COMPANY, CONTROL_CASE, HERO, HIRE, SITE_BUSINESSES, START, WORK, type SiteBusiness } from './content';

const LOGO = '/ddg-professional-white-transparent.png';
const count = (n: number | null | undefined) => (n === null || n === undefined ? '—' : n.toLocaleString('en-AU'));
const dollars = (cents: number | null | undefined) =>
  cents === null || cents === undefined ? '—' : `$${(cents / 100).toLocaleString('en-AU', { maximumFractionDigits: 0 })}`;

/** Live public numbers (social footprint, charity). Shows dashes until loaded or if unavailable. */
function usePublicSummary(): PublicSummary | null {
  const [data, setData] = useState<PublicSummary | null>(null);
  useEffect(() => {
    let live = true;
    fetch('/api/public/summary')
      .then((r) => (r.ok ? r.json() : null))
      .then((body) => { if (live) setData(body); })
      .catch(() => {});
    return () => { live = false; };
  }, []);
  return data;
}

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Scroll to a home section (#businesses, #build, #charity). */
function toSection(id: string, smooth: boolean) {
  document.getElementById(id)?.scrollIntoView({ behavior: smooth && !reducedMotion() ? 'smooth' : 'auto', block: 'start' });
}

function Nav() {
  const [path, navigate] = useLocation();
  // A section link: on the home page it scrolls there; from another page it opens home at that section.
  const section = (id: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    if (path === '/') {
      history.replaceState(null, '', `/#${id}`);
      toSection(id, true);
    } else navigate(`/#${id}`);
  };
  return (
    <header className="s-nav">
      <Link href="/" className="s-brand" aria-label="DDG home"><img src={LOGO} alt="" /><b>DDG</b></Link>
      <nav aria-label="Site">
        <a href="/#businesses" onClick={section('businesses')}>Businesses</a>
        <Link href="/finance">Finance</Link>
        <a href="/#build" onClick={section('build')}>Build</a>
        <a href="/#charity" onClick={section('charity')}>Charity</a>
      </nav>
    </header>
  );
}

/** Footer: icon links to each DDG account. */
function Socials() {
  return (
    <ul className="s-socials">
      {SOCIALS.filter((s) => s.href).map((s) => (
        <li key={s.platform}>
          <a href={s.href!} target="_blank" rel="noopener noreferrer" aria-label={`DDG on ${s.name}`}>
            <PlatformIcon platform={s.platform as Platform} size={18} />
          </a>
        </li>
      ))}
    </ul>
  );
}

/** The headline number on each business card. Live numbers show "—" until loaded, never a guess. */
function cardStat(key: SiteBusiness['key'], s: PublicSummary | null): { value: string; label: string } {
  switch (key) {
    case 'coffee': return { value: count(s?.coffee_bags_sold), label: 'Bags sold' };
    case 'finance': {
      const days = daysUntil(LAUNCH_DATE);
      return days > 0 ? { value: String(days), label: 'Days to the public record' } : { value: 'Live', label: 'Public track record' };
    }
    case 'fitness': return { value: 'Soon', label: 'AI coaches on your phone' };
  }
}

function BusinessCard({ b, summary }: { b: SiteBusiness; summary: PublicSummary | null }) {
  const stat = cardStat(b.key, summary);
  return (
    <article className="s-card" style={{ ['--accent' as string]: b.accent }}>
      <div className="s-card-top">
        <span className="s-ico"><BusinessIcon icon={b.key} size={22} strokeWidth={1.6} /></span>
        <span className="s-status"><span className="s-dot" />{b.status}</span>
      </div>
      <p className="s-stat"><b>{stat.value}</b><span>{stat.label}</span></p>
      <h3>{b.name}</h3>
      <p className="s-product">{b.product}</p>
      <p>{b.line}</p>
      <ul className="s-built s-chips-built" aria-label="What we built">{b.built.map((x) => <li key={x}>{x}</li>)}</ul>
      {b.note && <p className="s-note">{b.note}</p>}
      {b.link && (b.link.external
        ? <a className="s-btn" href={b.link.href} target="_blank" rel="noopener noreferrer">{b.link.label} ↗</a>
        : <Link className="s-btn" href={b.link.href}>{b.link.label} →</Link>)}
    </article>
  );
}

function Home() {
  const summary = usePublicSummary();
  // Opened at a section (/#build from another page): go there once the page is drawn.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (id) toSection(id, false);
  }, []);

  return (
    <>
      {/* First screen: who we are, then our work and a card to hire us. Fits one screen on PC. */}
      <section className="s-hero">
        <Nav />
        <div className="s-hero-top">
          <div className="s-hero-copy">
            <p className="s-eyebrow">{HERO.eyebrow}</p>
            <h1>{HERO.title}</h1>
            <p className="s-lead">{HERO.body} <Link className="s-ask" href="/start">{HERO.ask} →</Link></p>
          </div>
        </div>
        <div className="s-work" aria-label="Our work">
          {WORK.map((w) => (
            <figure key={w.key} className={`s-work-${w.shape}`}>
              <div className="s-work-frame"><img src={w.img} alt={w.alt} loading="eager" /></div>
              <figcaption><b>{w.name}</b> · {w.line}</figcaption>
            </figure>
          ))}
          {/* Hire us: sits at the end of the work row, the whole card links to /start. */}
          <Link className="s-hire" href="/start">
            <span className="s-hire-in">
              <span className="s-hire-status"><i aria-hidden="true" />{HIRE.status}</span>
              <b>{HIRE.title}</b>
              <span className="s-hire-price">{HIRE.priceFrom} <strong>{HIRE.price}</strong></span>
              <ul className="s-hire-done" aria-label="What we have built">
                {HIRE.done.map((d) => <li key={d}><span aria-hidden="true">→</span>{d}<em>done</em></li>)}
              </ul>
              <span className="s-hire-go">{HIRE.cta}<span className="s-hire-arrow" aria-hidden="true">→</span></span>
            </span>
          </Link>
        </div>
      </section>
      <main className="s-main">
        <section id="businesses" aria-labelledby="b-title">
          <h2 id="b-title">Three businesses</h2>
          <div className="s-grid">{SITE_BUSINESSES.map((b) => <BusinessCard key={b.key} b={b} summary={summary} />)}</div>
        </section>
        <Build summary={summary} />
        <section className="s-case glass-plain" aria-labelledby="case-title">
          <div>
            <p className="s-eyebrow">How it all connects</p>
            <h2 id="case-title">{CONTROL_CASE.title}</h2>
            <p>{CONTROL_CASE.line}</p>
          </div>
          <ul className="s-built">{CONTROL_CASE.built.map((x) => <li key={x}>{x}</li>)}</ul>
        </section>
        <section id="charity" className="s-charity" aria-labelledby="c-title">
          <div>
            <h2 id="c-title">{CHARITY.title}</h2>
            <p>{CHARITY.body}</p>
            <a className="s-btn fill" href={CHARITY.donate.href} target="_blank" rel="noopener noreferrer">{CHARITY.donate.label} ↗</a>
          </div>
          <dl className="s-stats">
            <div><dt>Given from coffee sales</dt><dd>{dollars(summary?.coffee_charity_cents)}</dd></div>
            <div><dt>1% of other revenue · from 1 Jan 2027</dt><dd>{dollars(summary?.charity_revenue_share_cents)}</dd></div>
            <div><dt>Bags sold</dt><dd>{count(summary?.coffee_bags_sold)}</dd></div>
          </dl>
        </section>
      </main>
      <Footer />
    </>
  );
}

/** /start: the one-page enquiry form, linked from the hire card and the Build section. */
function Start() {
  return (
    <div className="s-plain dusk">
      <Nav />
      <main className="s-main s-start">
        <p className="s-eyebrow">{START.eyebrow}</p>
        <h1 className="s-page-title">{START.title}</h1>
        <p className="s-lead">{START.line}</p>
        <EnquiryForm />
      </main>
      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer className="s-footer">
      <div><b>{COMPANY.legalName}</b><span>ABN {COMPANY.abn} · {COMPANY.place}</span></div>
      <Socials />
    </footer>
  );
}

function NotFound() {
  return (
    <div className="s-plain dusk">
      <Nav />
      <main className="s-main"><h1 className="s-page-title">Page not found</h1><p><Link className="s-btn" href="/">Back home</Link></p></main>
    </div>
  );
}

/**
 * Moving between pages: a short cross-fade (the browser's View Transitions, where it has
 * them; otherwise the page just changes). A new page opens at the top unless it names a section.
 */
function fadeNav(navigate: (to: string, options?: object) => void, to: string, options?: object) {
  const go = () => {
    flushSync(() => navigate(to, options));
    if (!to.includes('#')) window.scrollTo(0, 0);
  };
  const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
  if (!doc.startViewTransition || reducedMotion()) go();
  else doc.startViewTransition(go);
}

export function Site() {
  return (
    <Router aroundNav={fadeNav}>
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/start" component={Start} />
      <Route path="/finance">{() => <FinancePage Nav={Nav} Footer={Footer} />}</Route>
      <Route path="/quote/:token">{(params) => <QuotePage token={params.token} Nav={Nav} Footer={Footer} />}</Route>
      <Route component={NotFound} />
    </Switch>
    </Router>
  );
}
