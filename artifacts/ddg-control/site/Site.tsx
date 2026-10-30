import { useEffect, useRef, useState } from 'react';
import type { PublicSummary } from '@workspace/api-client-react';
import { Link, Route, Switch } from 'wouter';
import { PlatformIcon } from '@/components/PlatformIcon';
import { SocialFootprint } from '@/components/SocialFootprint';
import { SOCIALS, type Platform } from '@/lib/public-info';
import { CHARITY, COMPANY, CREATIVE, HERO, SITE_BUSINESSES, type SiteBusiness } from './content';

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

/** PC showcase: the business cards start as a tilted glass stack and fan out into a row
 *  as you scroll; scrolling back up stacks them again. Sets data-fan and --p (0..1 scroll
 *  progress) on the section; site.css does the rest. Off on small screens and for
 *  reduced motion, where the cards are a plain grid. */
function useFan<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mq = window.matchMedia('(min-width: 1024px) and (min-height: 600px) and (prefers-reduced-motion: no-preference)');
    let frame = 0;
    const update = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      el.style.setProperty('--p', Math.min(1, Math.max(0, -r.top / (r.height - window.innerHeight))).toFixed(4));
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    const stop = () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(frame);
      frame = 0;
    };
    const apply = () => {
      stop();
      if (mq.matches) {
        el.dataset.fan = '';
        update();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
      } else {
        delete el.dataset.fan;
        el.style.removeProperty('--p');
      }
    };
    apply();
    mq.addEventListener('change', apply);
    return () => { mq.removeEventListener('change', apply); stop(); };
  }, []);
  return ref;
}

function Nav() {
  return (
    <header className="s-nav">
      <Link href="/" className="s-brand" aria-label="DDG home"><img src={LOGO} alt="" /><b>DDG</b></Link>
      <nav aria-label="Site">
        <a href="/#businesses">Businesses</a>
        <Link href="/creative">Creative</Link>
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

function BusinessCard({ b }: { b: SiteBusiness }) {
  return (
    <article className="s-card" style={{ ['--accent' as string]: b.accent }}>
      <div className="s-card-top"><span className="s-dot" /> <span className="s-status">{b.status}</span></div>
      <h3>{b.name}</h3>
      <p className="s-product">{b.product}</p>
      <p>{b.line}</p>
      {b.note && <p className="s-note">{b.note}</p>}
      {b.link && (b.link.external
        ? <a className="s-btn" href={b.link.href} target="_blank" rel="noopener noreferrer">{b.link.label} ↗</a>
        : <Link className="s-btn" href={b.link.href}>{b.link.label} →</Link>)}
    </article>
  );
}

function Home() {
  const summary = usePublicSummary();
  const fan = useFan<HTMLElement>();
  return (
    <>
      <section className="s-hero">
        <Nav />
        <div className="s-hero-copy">
          <p className="s-eyebrow">{HERO.eyebrow}</p>
          <h1>{HERO.title}</h1>
          <p className="s-lead">{HERO.body}</p>
          <div className="s-hero-actions">
            <a className="s-btn fill" href="#businesses">Our businesses</a>
            <Link className="s-btn" href="/creative">Watch us build</Link>
          </div>
        </div>
        <section className="s-hero-social glass-photo" aria-label="Social footprint, all platforms">
          <SocialFootprint
            totals={summary && { followers: summary.followers_total, views_30d: summary.views_30d_total, likes_30d: summary.likes_30d_total }}
            platforms={summary?.platforms} links />
        </section>
      </section>

      <main className="s-main">
        <section id="businesses" ref={fan} className="s-fan" aria-labelledby="b-title">
          <div className="s-fan-stage">
            <h2 id="b-title">Four businesses</h2>
            <div className="s-grid">{SITE_BUSINESSES.map((b) => <BusinessCard key={b.key} b={b} />)}</div>
          </div>
        </section>

        <section id="charity" className="s-charity" aria-labelledby="c-title">
          <div>
            <h2 id="c-title">{CHARITY.title}</h2>
            <p>{CHARITY.body}</p>
            <a className="s-btn fill" href={CHARITY.donate.href} target="_blank" rel="noopener noreferrer">{CHARITY.donate.label} ↗</a>
          </div>
          <dl className="s-stats">
            <div><dt>Given from coffee sales</dt><dd>{dollars(summary?.coffee_charity_cents)}</dd></div>
            <div><dt>Bags sold</dt><dd>{count(summary?.coffee_bags_sold)}</dd></div>
          </dl>
        </section>
      </main>
      <Footer />
    </>
  );
}

function Creative() {
  return (
    <div className="s-plain dusk">
      <Nav />
      <main className="s-main">
        <p className="s-eyebrow">DDG Creative</p>
        <h1 className="s-page-title">What we make</h1>
        <div className="s-list">
          {CREATIVE.map((p) => (
            <article key={p.name} className="s-row">
              <div><h3>{p.name}</h3><p>{p.line}</p></div>
              <span className="s-status">{p.status}</span>
              {p.href && <a className="s-btn" href={p.href} target="_blank" rel="noopener noreferrer">Watch ↗</a>}
            </article>
          ))}
        </div>
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
      <Route path="/creative" component={Creative} />
      <Route component={NotFound} />
    </Switch>
  );
}
