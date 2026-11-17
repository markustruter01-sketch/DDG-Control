import { useEffect, useRef, useState } from 'react';
import { Link } from 'wouter';
import { ABOUT, BUILT, RUN, SHOTS } from './content';

// The home page journey after the 3D first screen. Every panel marked data-pipe gets a water pipe
// round its edge (canyon/wires.ts), in page order.

/** 1. What we are. */
export function About({ onSee, onQuote }: { onSee: () => void; onQuote: () => void }) {
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
          {ABOUT.built.map((x) => (
            <li key={x.text}>
              <span><b>{x.lead}</b> {x.text}</span>
              {x.href
                ? (x.external
                  ? <a className="j-tick-link" href={x.href} target="_blank" rel="noopener noreferrer">{x.name} <i aria-hidden="true">↗</i></a>
                  : <Link className="j-tick-link" href={x.href}>{x.name} <i aria-hidden="true">→</i></Link>)
                : <span className="j-tick-soon">{x.name ? `${x.name} \u00b7 ` : ''}{x.soon}</span>}
              {x.standards && (
                <details className="j-std">
                  <summary>{ABOUT.standardsLabel}</summary>
                  <ul>{ABOUT.standards.map((n) => <li key={n}>{n}</li>)}</ul>
                </details>
              )}
            </li>
          ))}
        </ul>
        <p className="j-line">{ABOUT.line}</p>
        <div className="j-actions">
          <a className="s-btn" href="#build" onClick={(e) => { e.preventDefault(); onSee(); }}>{ABOUT.see} ↓</a>
          <a className="s-btn fill" href="/#start" onClick={(e) => { e.preventDefault(); onQuote(); }}>{ABOUT.start} →</a>
        </div>
      </div>
    </section>
  );
}

/** One product's screenshots: a small carousel inside the big one. Arrows step through the pictures, and
 *  the enlarge button opens the same pictures in a larger box (not full screen). */
function Gallery({ imgs, name }: { imgs: { src: string; alt: string }[]; name: string }) {
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
    <div className={inBox ? 'j-gal j-gal-big' : 'j-gal'}>
      {imgs.map((im, i) => <img key={im.src} className={i === at ? 'on' : ''} src={im.src} alt={i === at ? im.alt : ''} loading="lazy" decoding="async" />)}
      {n > 1 && <>
        <button type="button" className="j-gal-arrow prev" aria-label={`Previous ${name} screenshot`} onClick={(e) => { e.stopPropagation(); step(-1); }}>‹</button>
        <button type="button" className="j-gal-arrow next" aria-label={`Next ${name} screenshot`} onClick={(e) => { e.stopPropagation(); step(1); }}>›</button>
        <span className="j-gal-count">{at + 1} / {n}</span>
      </>}
      <button type="button" className="j-gal-zoom" aria-label={inBox ? 'Close the larger view' : 'Make this screenshot bigger'} onClick={(e) => { e.stopPropagation(); setBig(!inBox); }}>{inBox ? '✕' : '⤢'}</button>
    </div>
  );
  return (
    <>
      {view(false)}
      {big && <div className="j-gal-back" role="dialog" aria-modal="true" aria-label={`${name} screenshots`} onClick={() => setBig(false)}><div onClick={(e) => e.stopPropagation()}>{view(true)}</div></div>}
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
