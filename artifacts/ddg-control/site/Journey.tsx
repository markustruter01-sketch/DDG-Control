import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { Link } from 'wouter';
import { ABOUT, BUILT, RUN, SHOWCASE, type ShowcaseKey } from './content';

// The home page journey after the 3D first screen. Every panel marked data-pipe gets a water pipe
// round its edge (canyon/wires.ts), in page order.

const TURN_MS = 9000; // how long each business shows before the reel turns by itself
/** Screenshots of the live platforms. Fitness is kept secret until launch, so its picture is blurred. */
const SHOTS: Record<ShowcaseKey, { src: string; alt: string; secret?: boolean }> = {
  finance: { src: '/work/finance.webp?v=3', alt: 'The DDG Finance trading dashboard' },
  coffee: { src: '/work/coffee.webp?v=3', alt: 'The Cattle Dog Coffee admin dashboard' },
  fitness: { src: '/work/hypest.webp', alt: '', secret: true },
};
function Shot({ k }: { k: ShowcaseKey }) {
  const s = SHOTS[k];
  return (
    <div className={`j-shot${s.secret ? ' j-shot-secret' : ''}`}>
      <img src={s.src} alt={s.alt} loading="lazy" decoding="async" width="1400" height="875" />
      {s.secret && <span className="j-soon">Coming soon</span>}
    </div>
  );
}

/** 1. What we are. */
export function About({ onSee }: { onSee: () => void }) {
  return (
    <section id="about" className="j-panel j-about" data-pipe aria-labelledby="about-title">
      <div className="j-text">
        <p className="s-eyebrow">{ABOUT.eyebrow}</p>
        <h2 id="about-title">{ABOUT.title.split('AI-powered').flatMap((part, i) => (i ? [<span key={i} className="j-hi">AI-powered</span>, part] : [part]))}</h2>
        <p className="j-ticks-label">{ABOUT.builtLabel}</p>
        <ul className="j-ticks">{ABOUT.built.map((x) => <li key={x}>{x}</li>)}</ul>
        <p className="j-line">{ABOUT.line}</p>
        <div className="j-actions">
          <a className="s-btn" href="#businesses" onClick={(e) => { e.preventDefault(); onSee(); }}>{ABOUT.see} ↓</a>
          <Link className="s-btn fill" href="/start">{ABOUT.start} →</Link>
        </div>
      </div>
    </section>
  );
}

/** 2. What we have built: one wide card at a time, on a 3D reel. Finance first. */
export function Showcase() {
  const [at, setAt] = useState(0);
  const [auto, setAuto] = useState(true); // turns itself every few seconds until the visitor takes over
  const [held, setHeld] = useState(false); // paused while the pointer or keyboard focus is on the reel
  const n = SHOWCASE.length;
  const go = (i: number, byHand = true) => { setAt(((i % n) + n) % n); if (byHand) setAuto(false); };
  const off = (i: number) => { let d = i - at; if (d > n / 2) d -= n; if (d < -n / 2) d += n; return d; };
  const turning = auto && !held && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  useEffect(() => {
    if (!turning) return;
    const t = window.setTimeout(() => go(at + 1, false), TURN_MS);
    return () => window.clearTimeout(t);
  }, [at, turning]); // eslint-disable-line react-hooks/exhaustive-deps
  // Swipe on phones and trackpads.
  const start = useRef<number | null>(null);
  const down = (e: PointerEvent) => { start.current = e.clientX; };
  const up = (e: PointerEvent) => {
    if (start.current === null) return;
    const dx = e.clientX - start.current; start.current = null;
    if (Math.abs(dx) > 50) go(at + (dx < 0 ? 1 : -1));
  };
  const keys = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(at + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(at - 1); }
  };
  return (
    <section id="businesses" className="j-biz" aria-labelledby="b-title">
      <div className="j-biz-head">
        <p className="s-eyebrow">{BUILT.eyebrow}</p>
        <h2 id="b-title"><span>{BUILT.left}</span> <span className="j-hi">{BUILT.right}</span></h2>
        <p className="j-line">{BUILT.line}</p>
      </div>
      <div className="j-core" data-pipe aria-hidden="true"><img src="/ddg-logo-white-512.png" alt="" /></div>
      <div className="j-reel-wrap" onPointerEnter={() => setHeld(true)} onPointerLeave={() => setHeld(false)} onFocus={() => setHeld(true)} onBlur={() => setHeld(false)}>
        {/* The three businesses as tabs along the top of the reel: always shows there are three. */}
        <div className="j-tabs" role="tablist" aria-label="Our projects">
          {SHOWCASE.map((b, i) => (
            <button key={b.key} type="button" role="tab" aria-selected={i === at} className="j-tab" onClick={() => go(i)}>
              <span><b>{b.name}</b><em>{b.tab}</em></span>
              <i className="j-tab-bar" aria-hidden="true">{i === at && <i key={`${at}-${turning}`} className={turning ? 'run' : 'full'} style={{ animationDuration: `${TURN_MS}ms` }} />}</i>
            </button>
          ))}
        </div>
        <div className="j-reel" role="region" aria-roledescription="carousel" aria-label="Our projects" tabIndex={0} onKeyDown={keys} onPointerDown={down} onPointerUp={up}>
          <div className="j-slot" data-pipe aria-hidden="true" />
          {SHOWCASE.map((b, i) => {
            const o = off(i);
            return (
              <article key={b.key} className="j-card" data-pipe data-off={o} role="tabpanel" aria-label={`${i + 1} of ${n}: ${b.name}`}
                aria-hidden={o !== 0} inert={o !== 0} onClick={o !== 0 ? () => go(i) : undefined}>
                <Shot k={b.key} />
                <div className="j-card-text">
                  <p className="j-count">{String(i + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}</p>
                  <div className="j-card-top"><div><b>{b.name}</b><span className="j-kind">{b.kind}</span></div></div>
                  <h3>{b.title}</h3>
                  <p>{b.line}</p>
                  {b.steps.length > 0 && <ol className="j-steps">{b.steps.map((s) => <li key={s}>{s}</li>)}</ol>}
                  {b.note && <p className="s-note">{b.note}</p>}
                  {b.link ? (b.link.external
                    ? <a className="s-btn" href={b.link.href} target="_blank" rel="noopener noreferrer">{b.link.label} ↗</a>
                    : <Link className="s-btn" href={b.link.href}>{b.link.label} →</Link>)
                    : <span className="j-soon">Coming soon</span>}
                </div>
              </article>
            );
          })}
          <button type="button" className="j-arrow prev" aria-label="Previous business" onClick={() => go(at - 1)}>←</button>
          <button type="button" className="j-arrow next" aria-label="Next business" onClick={() => go(at + 1)}>→</button>
        </div>
      </div>
    </section>
  );
}

/** 3. How we run it: DDG Control. */
export function Run() {
  return (
    <section id="control" className="j-panel j-run" data-pipe aria-labelledby="run-title">
      <div className="j-text">
        <p className="s-eyebrow">{RUN.eyebrow}</p>
        <h2 id="run-title">{RUN.title}</h2>
        <p className="j-line">{RUN.line}</p>
      </div>
      <ul className="j-list">{RUN.built.map((x) => <li key={x}>{x}</li>)}</ul>
    </section>
  );
}
