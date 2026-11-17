import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { makeInk, type Scene } from './inkfx';
import { Link } from 'wouter';
import { ABOUT, BUILT, RUN, SHOWCASE, type ShowcaseKey } from './content';
import { ABOUT_SCENE, COFFEE_SCENE, CONTROL_SCENE, FINANCE_SCENE, FITNESS_SCENE } from './inkScenes';

// The home page journey after the 3D first screen. Every panel marked data-pipe gets a water pipe
// round its edge (canyon/wires.ts), in page order.

const TURN_MS = 9000; // how long each business shows before the reel turns by itself
const ART: Record<ShowcaseKey, Scene> = { finance: FINANCE_SCENE, coffee: COFFEE_SCENE, fitness: FITNESS_SCENE };

/**
 * A system explained in white ink (inkfx.ts): crisp line parts, one drop of liquid ink flowing through
 * them. Only runs while on screen; with reduced motion it shows one still frame.
 */
function Art({ scene, className = '' }: { scene: Scene; className?: string }) {
  const wrap = useRef<HTMLDivElement>(null), inkC = useRef<HTMLCanvasElement>(null), lineC = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const el = wrap.current, a = inkC.current, b = lineC.current;
    if (!el || !a || !b) return;
    const ink = a.getContext('2d')!, line = b.getContext('2d')!;
    const fx = makeInk(scene);
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0, seen = false;
    const t0 = performance.now() - Math.random() * 4000;
    const paint = (t: number) => fx.draw(ink, line, t);
    const size = () => {
      const w = el.clientWidth, h = (w * scene.h) / scene.w, d = Math.min(2, window.devicePixelRatio || 1);
      for (const [c, x] of [[a, ink], [b, line]] as const) { c.width = Math.round(w * d); c.height = Math.round(h * d); x.setTransform((w * d) / scene.w, 0, 0, (h * d) / scene.h, 0, 0); }
      paint(still ? 2.2 : (performance.now() - t0) / 1000);
    };
    const loop = (now: number) => { raf = 0; if (!seen) return; paint((now - t0) / 1000); raf = requestAnimationFrame(loop); };
    const ro = new ResizeObserver(size); ro.observe(el);
    const io = new IntersectionObserver(([e]) => { seen = e.isIntersecting; if (seen && !still && !raf) raf = requestAnimationFrame(loop); });
    io.observe(el);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); };
  }, [scene]);
  return (
    <div className={`j-art ${className}`} aria-hidden="true">
      <div className="j-ink" ref={wrap} style={{ aspectRatio: `${scene.w} / ${scene.h}` }}><canvas ref={lineC} /><canvas ref={inkC} className="j-goo" /></div>
    </div>
  );
}

/** The "goo" filter for the ink: blur, then a sharp cut-off, so touching drops melt together like liquid. */
export const InkFilter = () => (
  <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
    <filter id="j-goo" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="2.4" /><feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8" /></filter>
  </svg>
);

/** Small glass logos for each business, in the same white ink. */
const MARKS: Record<ShowcaseKey, string> = {
  finance: '<path d="M11 31l8-8 6 5 12-13" class="ink"/><circle cx="37" cy="15" r="2.4" class="fill"/><path d="M8 24a16 16 0 0 1 30-9" class="ink faint"/>',
  coffee: '<g transform="rotate(-25 24 24)"><ellipse cx="24" cy="24" rx="10" ry="14" class="ink"/><path d="M24 10c-6 7 6 14 0 28" class="ink"/></g>',
  fitness: '<circle cx="24" cy="24" r="14" class="ink faint"/><path d="M6 25h10l3-6 4 12 4-14 3 8h12" class="ink"/>',
};
const Mark = ({ k }: { k: ShowcaseKey }) => (
  <svg className="j-mark ink-art" viewBox="0 0 48 48" aria-hidden="true" dangerouslySetInnerHTML={{ __html: `<rect x="1" y="1" width="46" height="46" rx="13" class="j-mark-bg"/>${MARKS[k]}` }} />
);

/** 1. What we are. */
export function About({ onSee }: { onSee: () => void }) {
  return (
    <section id="about" className="j-panel j-about" data-pipe aria-labelledby="about-title">
      <InkFilter />
      <div className="j-text">
        <p className="s-eyebrow">{ABOUT.eyebrow}</p>
        <h2 id="about-title">{ABOUT.title}</h2>
        <p className="j-line">{ABOUT.line}</p>
        <div className="j-actions">
          <a className="s-btn" href="#businesses" onClick={(e) => { e.preventDefault(); onSee(); }}>{ABOUT.see} ↓</a>
          <Link className="s-btn fill" href="/start">{ABOUT.start} →</Link>
        </div>
      </div>
      <Art scene={ABOUT_SCENE} />
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
        <h2 id="b-title"><span>{BUILT.left}</span> <span>{BUILT.right}</span></h2>
        <p className="j-line">{BUILT.line}</p>
      </div>
      <div className="j-core" data-pipe aria-hidden="true"><img src="/ddg-logo-white-512.png" alt="" /></div>
      <div className="j-reel-wrap" onPointerEnter={() => setHeld(true)} onPointerLeave={() => setHeld(false)} onFocus={() => setHeld(true)} onBlur={() => setHeld(false)}>
        {/* The three businesses as tabs along the top of the reel: always shows there are three. */}
        <div className="j-tabs" role="tablist" aria-label="Our businesses">
          {SHOWCASE.map((b, i) => (
            <button key={b.key} type="button" role="tab" aria-selected={i === at} className="j-tab" onClick={() => go(i)}>
              <Mark k={b.key} /><span><b>{b.name}</b><em>{b.tab}</em></span>
              <i className="j-tab-bar" aria-hidden="true">{i === at && <i key={`${at}-${turning}`} className={turning ? 'run' : 'full'} style={{ animationDuration: `${TURN_MS}ms` }} />}</i>
            </button>
          ))}
        </div>
        <div className="j-reel" role="region" aria-roledescription="carousel" aria-label="Our businesses" tabIndex={0} onKeyDown={keys} onPointerDown={down} onPointerUp={up}>
          <div className="j-slot" data-pipe aria-hidden="true" />
          {SHOWCASE.map((b, i) => {
            const o = off(i);
            return (
              <article key={b.key} className="j-card" data-pipe data-off={o} role="tabpanel" aria-label={`${i + 1} of ${n}: ${b.name}`}
                aria-hidden={o !== 0} inert={o !== 0} onClick={o !== 0 ? () => go(i) : undefined}>
                <Art scene={ART[b.key]} className="j-card-art" />
                <div className="j-card-text">
                  <p className="j-count">{String(i + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}</p>
                  <div className="j-card-top"><Mark k={b.key} /><div><b>{b.name}</b><span className="j-kind">{b.kind}</span></div></div>
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
      <Art scene={CONTROL_SCENE} />
      <div className="j-text">
        <p className="s-eyebrow">{RUN.eyebrow}</p>
        <h2 id="run-title">{RUN.title}</h2>
        <p className="j-line">{RUN.line}</p>
        <ul className="j-list">{RUN.built.map((x) => <li key={x}>{x}</li>)}</ul>
      </div>
    </section>
  );
}
