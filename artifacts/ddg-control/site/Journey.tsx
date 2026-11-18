import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'wouter';
import { ABOUT, BUILT, RUN, SHOTS } from './content';

// The home page journey after the 3D first screen. Every panel marked data-pipe gets a water pipe
// round its edge (canyon/wires.ts), in page order.

/** Thin white-line icons, one per project. */
function ProjectIcon({ k }: { k: string }) {
  const p = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return (
    <svg viewBox="0 0 48 48" width="44" height="44" aria-hidden="true" className="j-pi">
      {k === 'globe' && <><circle cx="24" cy="24" r="16" {...p} /><ellipse cx="24" cy="24" rx="7" ry="16" {...p} /><path d="M8 24h32M10.5 16h27M10.5 32h27" {...p} /><ellipse cx="24" cy="24" rx="22" ry="7" transform="rotate(-25 24 24)" {...p} opacity="0.6" /></>}
      {k === 'finance' && <><path d="M8 40h32M8 40V8" {...p} /><path d="M12 32l7-8 6 5 9-13 6 4" {...p} /><circle cx="34" cy="16" r="1.6" {...p} /></>}
      {k === 'coffee' && <><path d="M12 18h20v10a10 10 0 0 1-20 0z" {...p} /><path d="M32 21h3a4 4 0 0 1 0 8h-3" {...p} /><path d="M17 8c-2 3 2 4 0 7M23 8c-2 3 2 4 0 7" {...p} /><path d="M10 40h26" {...p} /></>}
      {k === 'fitness' && <><path d="M6 26h8l4-9 6 18 5-13 3 4h10" {...p} /><circle cx="24" cy="24" r="19" {...p} opacity="0.5" /></>}
      {k === 'greenlight' && <><path d="M24 6l15 6v10c0 10-6.5 17-15 20-8.5-3-15-10-15-20V12z" {...p} /><path d="M17 24l5 5 9-10" {...p} /></>}
    </svg>
  );
}

/** The pop-up for one project: what it is, a white-line picture of how it works, a few facts, a chart
 *  where we have real numbers, one screenshot, and a link to the live thing. */
function ProjectPop({ i, onClose }: { i: number; onClose: () => void }) {
  const x = ABOUT.built[i];
  const m = ABOUT.more[x.key];
  const shot = SHOTS.find((s) => s.key === x.key)?.imgs[0];
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const back = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const key = (e: globalThis.KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    addEventListener('keydown', key);
    const html = document.documentElement, was = html.style.overflow;
    html.style.overflow = 'hidden';
    return () => { removeEventListener('keydown', key); html.style.overflow = was; back?.focus(); };
  }, [onClose]);
  return createPortal(
    <div className="j-pop-back" onClick={onClose}>
      <div className="j-pop" role="dialog" aria-modal="true" aria-labelledby="j-pop-title" onClick={(e) => e.stopPropagation()}>
        <button ref={closeRef} className="j-pop-x" onClick={onClose} aria-label={ABOUT.close}>×</button>
        <header className="j-pop-head">
          <ProjectIcon k={x.key} />
          <div>
            <p className="j-pop-name">{x.name || x.soon}</p>
            <h3 id="j-pop-title">{x.lead}</h3>
          </div>
        </header>
        <p className="j-pop-text">{x.text}</p>
        {m && <>
          <p className="j-pop-label">{m.flowLabel}</p>
          <ol className="j-flow">
            {m.flow.map((f, k) => <li key={f} className={m.gate === k ? 'gate' : ''} style={{ animationDelay: `${0.08 * k}s` }}><span>{f}</span></li>)}
          </ol>
          {m.chart && (
            <figure className="j-bars">
              <figcaption>{m.chartLabel}</figcaption>
              {m.total && <p className="j-bars-total"><span>{m.total[0]}%</span><i aria-hidden="true">→</i><b>{m.total[1]}%</b><em>ready overall</em></p>}
              {m.chart.map(([name, a, b]) => (
                <div className="j-bar" key={name}>
                  <span className="j-bar-name">{name}</span>
                  <span className="j-bar-track" aria-hidden="true"><i className="was" style={{ width: `${a}%` }} /><i className="now" style={{ width: `${b}%` }} /></span>
                  <span className="j-bar-num">{a} → <b>{b}</b></span>
                </div>
              ))}
            </figure>
          )}
          {m.chips.length > 0 && <><p className="j-pop-label">{m.chipsLabel}</p><ul className="j-chips">{m.chips.map((c) => <li key={c}>{c}</li>)}</ul></>}
          {x.standards && <><p className="j-pop-label">{ABOUT.standardsLabel.replace('See all', 'All')}</p><ul className="j-chips">{ABOUT.standards.map((c) => <li key={c}>{c.split(':')[0]}</li>)}</ul></>}
          {m.note && <p className="j-pop-note">{m.note}</p>}
        </>}
        {shot && <figure className="j-pop-shot"><img src={shot.src} alt={shot.alt} loading="lazy" decoding="async" /><figcaption>{shot.cap}</figcaption></figure>}
        {x.href && (
          <div className="j-pop-go">
            {x.external
              ? <a className="j-tick-link" href={x.href} target="_blank" rel="noopener noreferrer">{ABOUT.visit}: {x.name} <i aria-hidden="true">↗</i></a>
              : <Link className="j-tick-link" href={x.href} onClick={onClose}>{ABOUT.visit}: {x.name} <i aria-hidden="true">→</i></Link>}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}

/** 1. What we are. */
export function About({ onSee, onQuote }: { onSee: () => void; onQuote: () => void }) {
  const [open, setOpen] = useState<number | null>(null);
  const close = useCallback(() => setOpen(null), []);
  return (
    <section id="about" className="j-panel j-about" data-pipe aria-labelledby="about-title">
      <div className="j-text">
        <div className="j-about-top">
          <p className="s-eyebrow j-brandline"><img src="/ddg-logo-white-512.png" alt="" width="22" height="22" />{ABOUT.brand}</p>
          <p className="j-portfolio">{ABOUT.portfolio}</p>
        </div>
        <h2 id="about-title">{ABOUT.title.split('AI-powered').flatMap((part, i) => (i ? [<span key={i} className="j-hi">AI-powered</span>, part] : [part]))}</h2>
        <p className="j-ticks-label">{ABOUT.builtLabel}</p>
        <ul className="j-ticks">
          {ABOUT.built.map((x, i) => (
            <li key={x.key} className={x.soon ? 'soon' : ''}>
              <b>{x.lead}</b>
              {x.soon && <span className="j-tick-soon">{x.soon}</span>}
              <button type="button" className="j-expand" onClick={() => setOpen(i)} aria-haspopup="dialog">{ABOUT.expand}<i aria-hidden="true">→</i></button>
            </li>
          ))}
        </ul>
        <p className="j-line">{ABOUT.line}</p>
        <div className="j-actions">
          <a className="s-btn" href="#build" onClick={(e) => { e.preventDefault(); onSee(); }}>{ABOUT.see} ↓</a>
          <a className="s-btn fill" href="/#start" onClick={(e) => { e.preventDefault(); onQuote(); }}>{ABOUT.start} →</a>
        </div>
      </div>
      {open !== null && <ProjectPop i={open} onClose={close} />}
    </section>
  );
}

/** One product's screenshots: a small carousel inside the big one. Arrows step through the pictures, and
 *  the enlarge button opens the same pictures in a larger box (not full screen). */
function Gallery({ imgs, name }: { imgs: { src: string; cap: string; alt: string }[]; name: string }) {
  const [at, setAt] = useState(0);
  const [big, setBig] = useState(false);
  const n = imgs.length;
  const step = (d: number) => setAt((at + d + n) % n);
  useEffect(() => {
    if (!big) return;
    const key = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') setBig(false);
      if (e.key === 'ArrowRight') setAt((v) => (v + 1) % n);
      if (e.key === 'ArrowLeft') setAt((v) => (v - 1 + n) % n);
    };
    addEventListener('keydown', key);
    return () => removeEventListener('keydown', key);
  }, [big, n]);
  const view = (inBox: boolean) => (
    <div className={inBox ? 'j-gal-wrap big' : 'j-gal-wrap'}>
    <p className="j-gal-cap" aria-live="polite">{imgs[at].cap}</p>
    <div className={inBox ? 'j-gal j-gal-big' : 'j-gal'}>
      {imgs.map((im, i) => <img key={im.src} className={i === at ? 'on' : ''} src={im.src} alt={i === at ? im.alt : ''} loading="lazy" decoding="async" />)}
      {n > 1 && <>
        <button type="button" className="j-gal-arrow prev" aria-label={`Previous ${name} screenshot`} onClick={(e) => { e.stopPropagation(); step(-1); }}>‹</button>
        <button type="button" className="j-gal-arrow next" aria-label={`Next ${name} screenshot`} onClick={(e) => { e.stopPropagation(); step(1); }}>›</button>
        <span className="j-gal-count">{at + 1} / {n}</span>
      </>}
      <button type="button" className="j-gal-zoom" aria-label={inBox ? 'Close the larger view' : 'Make this screenshot bigger'} onClick={(e) => { e.stopPropagation(); setBig(!inBox); }}>{inBox ? '✕' : '⤢'}</button>
    </div>
    </div>
  );
  return (
    <>
      {view(false)}
      {/* In the page body, not the slide: the slide's glass would otherwise trap a fixed box inside itself. */}
      {big && createPortal(<div className="j-gal-back" role="dialog" aria-modal="true" aria-label={`${name} screenshots`} onClick={() => setBig(false)}><div onClick={(e) => e.stopPropagation()}>{view(true)}</div></div>, document.body)}
    </>
  );
}

/** A plain sideways carousel of our products. The slides on each side peek in, so it is clear there is more
 *  to see. Swipe, scroll, the arrows or the dots all move it; the browser does the snapping. The light pipe
 *  runs round .j-car-slot, a still frame exactly where the slide in front sits, so it never crosses a picture. */
function Carousel() {
  const track = useRef<HTMLDivElement>(null);
  const [at, setAt] = useState(0);
  const n = SHOTS.length;
  const go = (i: number) => {
    const el = track.current; if (!el) return;
    const slide = el.children[((i % n) + n) % n] as HTMLElement;
    el.scrollTo({ left: slide.offsetLeft - (el.clientWidth - slide.clientWidth) / 2, behavior: 'smooth' });
  };
  const onScroll = () => {
    const el = track.current; if (!el) return;
    const mid = el.scrollLeft + el.clientWidth / 2;
    let best = 0, gap = Infinity;
    [...el.children].forEach((c, i) => { const s = c as HTMLElement; const d = Math.abs(s.offsetLeft + s.clientWidth / 2 - mid); if (d < gap) { gap = d; best = i; } });
    if (best !== at) setAt(best);
  };
  return (
    <div className="j-car" role="region" aria-roledescription="carousel" aria-label="Screenshots of what we have built">
      <div className="j-car-slot" data-pipe aria-hidden="true" />
      <div className="j-car-track" ref={track} onScroll={onScroll}>
        {SHOTS.map((x, i) => (
          <figure key={x.key} className={`j-slide${i === at ? ' on' : ''}`} aria-label={`${i + 1} of ${n}: ${x.name}`} onClick={i === at ? undefined : () => go(i)}>
            <Gallery imgs={x.imgs} name={x.name} />
            <figcaption>
              <span><b>{x.name}</b><em>{x.kind}</em></span>
              {x.external
                ? <a className="j-tick-link" href={x.href} target="_blank" rel="noopener noreferrer">Open <i aria-hidden="true">↗</i></a>
                : <Link className="j-tick-link" href={x.href}>Open <i aria-hidden="true">→</i></Link>}
            </figcaption>
          </figure>
        ))}
      </div>
      <button type="button" className="j-car-arrow prev" aria-label="Previous product" onClick={() => go(at - 1)}>←</button>
      <button type="button" className="j-car-arrow next" aria-label="Next product" onClick={() => go(at + 1)}>→</button>
      <div className="j-car-dots">{SHOTS.map((x, i) => <button key={x.key} type="button" aria-label={`Show ${x.name}`} aria-current={i === at} onClick={() => go(i)} />)}</div>
    </div>
  );
}

/** 2. "Complex platforms. Built in-house." and the DDG core. The portfolio itself is the tick list above. */
export function Showcase() {
  return (
    <section id="businesses" className="j-biz" aria-labelledby="b-title">
      <div className="j-biz-head">
        <p className="s-eyebrow">{BUILT.eyebrow}</p>
        <h2 id="b-title"><span>{BUILT.left}</span> <span className="j-hi">{BUILT.right}</span></h2>
        <p className="j-line">{BUILT.line}</p>
      </div>
      <div className="j-core" data-pipe aria-hidden="true"><img src="/ddg-logo-white-512.png" alt="" /></div>
      <Carousel />
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
