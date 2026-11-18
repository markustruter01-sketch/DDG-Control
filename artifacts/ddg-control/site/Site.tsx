import { lazy, Suspense, useEffect, useRef, useState, type MouseEvent } from 'react';
import { flushSync } from 'react-dom';
import type { PublicSummary } from '@workspace/api-client-react';
import { Link, Route, Router, Switch, useLocation } from 'wouter';
import { PlatformIcon } from '@/components/PlatformIcon';
import { SOCIALS, type Platform } from '@/lib/public-info';
import { Build, EnquiryForm } from './Build';
import { FinancePage } from './Finance';
import { QuotePage } from './Quote';
import { drawPipes, fillPipes } from './canyon/wires';
import { mountPageClouds } from './canyon/cloudPaint';
import { CHARITY, COMPANY, CONTACT, HOME, PRIVACY, START, QUOTES } from './content';
import { About, Showcase } from './Journey';

// The 3D first screen is loaded on its own, so the page's words never wait for it.
const Stage = lazy(() => import('./canyon/Stage'));

const LOGO = '/ddg-core-logo.jpg'; // the DDG glitch mark, on black; site.css blends the black away
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

function Nav({ home = false }: { home?: boolean }) {
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
    <header className={home ? 's-nav s-nav-home' : 's-nav'}>
      <Link href="/" className="s-brand" aria-label="Digital Dynamics Group home"><img src={LOGO} alt="" loading="lazy" /><b><span className="s-brand-full">Digital Dynamics Group</span><span className="s-brand-short">DDG</span></b></Link>
      <nav aria-label="Site">
        <a href="/#about" onClick={section('about')}>Portfolio</a>
        <Link href="/finance">Finance</Link>
        <a href="/#build" onClick={section('build')}>Prices</a>
        <a href="/#charity" onClick={section('charity')}>Charity</a>
        <a href="/#contact" onClick={section('contact')}>Contact</a>
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

/** Keeps the pipes drawn to the page's current layout, and filled to where the visitor has scrolled. */
function usePipes() {
  const page = useRef<HTMLDivElement>(null), svg = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const p = page.current, v = svg.current;
    if (!p || !v) return;
    let raf = 0;
    const fill = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => fillPipes(p, v)); };
    const draw = () => { drawPipes(p, v); fill(); };
    draw();
    const watch = new ResizeObserver(draw);
    watch.observe(p);
    window.addEventListener('scroll', fill, { passive: true });
    return () => { cancelAnimationFrame(raf); watch.disconnect(); window.removeEventListener('scroll', fill); };
  }, []);
  return { page, svg };
}

/** Which quote shows under the orb (index into QUOTES); the tuner can switch it live. */
const QUOTE = 15;

function Home() {
  const summary = usePublicSummary();
  // Raised for charity so far: coffee's $1 a bag, plus the revenue share once it starts. A dash until the number loads.
  const raised = summary?.coffee_charity_cents == null ? null : summary.coffee_charity_cents + (summary.charity_revenue_share_cents ?? 0);
  const pipes = usePipes();
  // Soft clouds behind the page, seen blurred through the glass panels.
  useEffect(() => mountPageClouds(), []);
  // Opened at a section (/#build from another page): go there once the page is drawn.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (id) toSection(id, false);
  }, []);

  return (
    <>
      {/* First screen: the 3D stage (night sky, canyon, river and the AI core) with a few quiet words over it. */}
      <div className="cn-top">
        <Suspense fallback={null}><Stage fadeAt="about" /></Suspense>
        <section className="cn-hero">
          <Nav home />
          {/* The company's name and mark, above the orb. "We build it all." stands in the 3D scene. */}
          {/* Fixed to the screen and moved by the 3D stage, so the name, frame and quote stay on the orb. */}
          <div className="cn-follow">
            <h1 className="cn-brand"><img className="cn-logo-white" src="/ddg-logo-white-512.png" alt="" width="512" height="512" /><span>Digital Dynamics<br /><span className="cn-group">Group</span></span><span className="sr-only"> · {HOME.title}</span></h1>
            <div className="cn-frame" aria-hidden="true"><i /><i /><i /><i /></div>
            <p className="cn-quote"><span className="cn-quote-t">{QUOTES[QUOTE]}</span></p>
            <a className="cn-cta" href="/#start" onClick={(e) => { e.preventDefault(); history.replaceState(null, '', '/#start'); toSection('start', true); }}>{HOME.cta} →</a>
            <div className="cn-scroll lay-0 anim-1" aria-hidden="true"><span className="cn-scroll-words">Scroll for WebPage or Press Orb for Fun</span><span className="cn-scroll-arrow" /></div>
          </div>
        </section>
        {/* Room to scroll while the canyon settles flat and the core lifts away. */}
        <div className="cn-room" aria-hidden="true" />
      </div>
      <div className="cn-page" ref={pipes.page}>
        <svg className="cn-pipes" ref={pipes.svg} aria-hidden="true" />
        <main className="s-main j-main">
          <About onSee={() => toSection('build', true)} onQuote={() => toSection('start', true)} />
          <Showcase />
          <section id="charity" className="j-give" data-pipe aria-label={CHARITY.label}>
            <p className="j-give-sum"><b>{dollars(raised)}</b><span>{CHARITY.label}</span></p>
            <p className="j-give-line">{CHARITY.body}</p>
          </section>
          <Build summary={summary} />
          <section id="start" className="j-panel j-start" data-pipe aria-labelledby="start-title">
            <div className="j-text">
              <p className="s-eyebrow">{START.eyebrow}</p>
              <h2 id="start-title">{START.title}</h2>
              <p className="j-line">{START.line}</p>
            </div>
            <EnquiryForm />
          </section>
          <section id="contact" className="j-panel j-contact" data-pipe aria-labelledby="contact-title">
            <div className="j-text">
              <p className="s-eyebrow">{CONTACT.eyebrow}</p>
              <h2 id="contact-title">{CONTACT.title}</h2>
              <p className="j-line">{CONTACT.line}</p>
            </div>
            <dl className="j-contact-list">
              <div><dt>{CONTACT.emailLabel}</dt><dd><a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a></dd></div>
              <div><dt>{CONTACT.postLabel}</dt><dd>{COMPANY.legalName}<br />{COMPANY.post}</dd></div>
            </dl>
          </section>
        </main>
      </div>
      <QuoteDock />
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

/** A "Get a fixed quote" button that stays in the corner once the first screen has scrolled away, so the
 *  form is always one tap off. It hides while the form itself is on screen. */
function QuoteDock() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const check = () => {
      const form = document.getElementById('start')?.getBoundingClientRect();
      const formOnScreen = !!form && form.top < innerHeight * 0.8 && form.bottom > innerHeight * 0.2;
      setShow(scrollY > innerHeight * 0.9 && !formOnScreen);
    };
    check();
    addEventListener('scroll', check, { passive: true });
    return () => removeEventListener('scroll', check);
  }, []);
  return (
    <a className={`s-dock${show ? ' on' : ''}`} href="/#start" tabIndex={show ? 0 : -1} aria-hidden={!show}
      onClick={(e) => { e.preventDefault(); history.replaceState(null, '', '/#start'); toSection('start', true); }}>{HOME.cta} →</a>
  );
}

function Footer() {
  return (
    <footer className="s-footer">
      <div><b>{COMPANY.legalName}</b><span>ABN {COMPANY.abn} · {COMPANY.place} · <Link href="/privacy">Privacy</Link></span><span><a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a> · {COMPANY.post}</span></div>
      <Socials />
    </footer>
  );
}

/** /privacy: what the website collects and why. */
function Privacy() {
  return (
    <div className="s-plain dusk">
      <Nav />
      <main className="s-main s-privacy">
        <h1 className="s-page-title">{PRIVACY.title}</h1>
        <p className="s-note">{PRIVACY.updated}</p>
        {PRIVACY.sections.map((x) => (
          <section key={x.h}><h2>{x.h}</h2>{x.p.map((line) => <p key={line}>{line}</p>)}</section>
        ))}
      </main>
      <Footer />
    </div>
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
      <Route path="/privacy" component={Privacy} />
      <Route path="/finance">{() => <FinancePage Nav={Nav} Footer={Footer} />}</Route>
      <Route path="/quote/:token">{(params) => <QuotePage token={params.token} Nav={Nav} Footer={Footer} />}</Route>
      <Route component={NotFound} />
    </Switch>
    </Router>
  );
}
