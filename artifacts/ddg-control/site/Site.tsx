import { useEffect, useState } from 'react';
import type { PublicSummary } from '@workspace/api-client-react';
import { Link, Route, Switch } from 'wouter';
import { BusinessIcon } from '@/components/BusinessIcon';
import { PlatformIcon } from '@/components/PlatformIcon';
import { LAUNCH_DATE } from '@/lib/company';
import { daysUntil } from '@/lib/money';
import { SOCIALS, type Platform } from '@/lib/public-info';
import { Build, EnquiryForm } from './Build';
import { FlipPages } from './FlipPages';
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

function Nav() {
  return (
    <header className="s-nav">
      <Link href="/" className="s-brand" aria-label="DDG home"><img src={LOGO} alt="" /><b>DDG</b></Link>
      <nav aria-label="Site">
        <a href="/#businesses">Businesses</a>
        <a href="/#build">Build</a>
        <a href="/#charity">Charity</a>
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

// The home screens, in order. The menu links (/#businesses etc.) turn to that screen.
const SCREENS = ['home', 'businesses', 'build', 'charity'];

function Home() {
  const summary = usePublicSummary();
  const [side, setSide] = useState(0);
  // A menu link to a section turns to that screen.
  useEffect(() => {
    const go = () => {
      const i = SCREENS.indexOf(window.location.hash.slice(1));
      if (i > 0) setSide(i);
    };
    go();
    window.addEventListener('hashchange', go);
    return () => window.removeEventListener('hashchange', go);
  }, []);

  const overview = (
      /* First screen: who we are, then our work and a card to hire us. Fits one screen on PC. */
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
          {/* Hire us: sits at the end of the work row, the whole card links to #build. */}
          <Link className="s-hire glass-photo" href="/start">
            <span className="s-eyebrow">{HIRE.eyebrow}</span>
            <b>{HIRE.title}</b>
            <span>{HIRE.line}</span>
            <span className="s-hire-go">{HIRE.cta} →</span>
          </Link>
        </div>
        <button className="s-flip-hint" type="button" onClick={() => setSide(1)}>Scroll ↓</button>
      </section>
  );

  const businesses = (
    <div className="s-screen">
      <Nav />
      <main className="s-main s-screen-body">
        <section id="businesses" aria-labelledby="b-title">
          <h2 id="b-title">Three businesses</h2>
          <div className="s-grid">{SITE_BUSINESSES.map((b) => <BusinessCard key={b.key} b={b} summary={summary} />)}</div>
        </section>
      </main>
    </div>
  );
  const build = (
    <div className="s-screen">
      <Nav />
      <main className="s-main s-screen-body">
        <Build summary={summary} />
      </main>
    </div>
  );
  const charityScreen = (
    <div className="s-screen">
      <Nav />
      <main className="s-main s-screen-body">
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
    </div>
  );

  return <FlipPages pages={[overview, businesses, build, charityScreen]} side={side} onSide={setSide}
    labels={['Home', 'Businesses', 'Build with us', 'Charity']} />;
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

export function Site() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/start" component={Start} />
      <Route component={NotFound} />
    </Switch>
  );
}
