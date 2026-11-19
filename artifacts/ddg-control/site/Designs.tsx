import { useEffect, useRef, useState, type KeyboardEvent } from 'react';

/**
 * Designs (Markus, 19 Nov 2026): a carousel of small browser windows, each holding a working concept site for a
 * made-up business, to show range. The visitor scrolls inside the front window or opens it full size. Only the
 * front window loads its site, and only once the section is near the screen; the others show a cover card.
 * The sites are plain pages in public/designs/<slug>/index.html, each labelled "Concept design by DDG".
 */
const DESIGNS = [
  { slug: 'tarn', name: 'Tarn', kind: 'Water bottle brand', host: 'tarn.example', bg: 'linear-gradient(140deg,#f4fbfd 0%,#bfe9f3 55%,#3ab8d6 100%)', ink: '#0d2a3a' },
  { slug: 'brightside', name: 'Brightside Electrical', kind: 'Electrician and solar', host: 'brightside.example', bg: 'linear-gradient(140deg,#111 0%,#111 55%,#ffd21f 100%)', ink: '#ffd21f' },
  { slug: 'wobble', name: 'Wobble Academy', kind: "Children's learning", host: 'wobble.example', bg: 'linear-gradient(140deg,#8fd3ff 0%,#fffaf0 60%,#ffd23f 100%)', ink: '#253046' },
  { slug: 'hartwell', name: 'Hartwell & Vance', kind: 'Law firm', host: 'hartwellvance.example', bg: 'linear-gradient(140deg,#f6f1e7 0%,#f6f1e7 50%,#14213d 100%)', ink: '#14213d' },
  { slug: 'kickform', name: 'KICKFORM', kind: 'Sneaker store', host: 'kickform.example', bg: 'linear-gradient(140deg,#c6ff00 0%,#f2f0e9 55%,#ff2e88 100%)', ink: '#0a0a0a' },
  { slug: 'stillpoint', name: 'Still Point', kind: 'Physio clinic', host: 'stillpoint.example', bg: 'linear-gradient(140deg,#eef4ef 0%,#eef4ef 50%,#7fa38a 100%)', ink: '#2f4a3c' },
  { slug: 'haulio', name: 'Haulio', kind: 'Freight dashboard', host: 'app.haulio.example', bg: 'linear-gradient(140deg,#0b0f17 0%,#121826 55%,#5b8cff 100%)', ink: '#e6ecf7' },
  { slug: 'mossmilk', name: 'Moss & Milk', kind: 'Skincare store', host: 'mossandmilk.example', bg: 'linear-gradient(140deg,#f3ede4 0%,#e7d8c4 55%,#5d6b48 100%)', ink: '#2b2620' },
  { slug: 'voltage', name: 'Voltage', kind: 'Gym and classes', host: 'voltage.example', bg: 'linear-gradient(140deg,#07070a 0%,#07070a 55%,#39ff88 100%)', ink: '#39ff88' },
  { slug: 'ember', name: 'Ember & Ash', kind: 'Restaurant', host: 'emberandash.example', bg: 'linear-gradient(140deg,#17110d 0%,#2a1a10 55%,#ff7a2f 100%)', ink: '#f1e6d6' },
];

export function Designs() {
  const [i, setI] = useState(0);
  const [near, setNear] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const n = DESIGNS.length;
  const go = (d: number) => setI((x) => (x + d + n) % n);
  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) { setNear(true); return; }
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { setNear(true); io.disconnect(); } }, { rootMargin: '600px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const onKey = (e: KeyboardEvent) => {
    if ((e.target as HTMLElement).tagName === 'IFRAME') return;
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
  };
  const cur = DESIGNS[i]!;
  return (
    <section id="designs" ref={ref} className="j-panel j-designs" data-pipe aria-labelledby="designs-title">
      <div className="j-text">
        <p className="s-eyebrow">Designs</p>
        <h2 id="designs-title">One studio, many looks.</h2>
        <p className="j-line">Concept sites for made-up businesses, built to show range. Scroll inside the window, or open it full size.</p>
      </div>
      <div className="d-car" role="region" aria-roledescription="carousel" aria-label="Concept designs" onKeyDown={onKey}>
        <div className="d-track">
          {DESIGNS.map((d, k) => {
            const pos = (k - i + n) % n;
            const rel = pos === 0 ? 'mid' : pos === 1 ? 'next' : pos === n - 1 ? 'prev' : 'far';
            const front = rel === 'mid';
            return (
              <div key={d.slug} className={`d-win d-${rel}`} aria-hidden={!front} onClick={front ? undefined : () => setI(k)}>
                <div className="d-bar">
                  <span className="d-dots3" aria-hidden="true"><i /><i /><i /></span>
                  <span className="d-host">{d.host}</span>
                  <a href={`/designs/${d.slug}/index.html`} target="_blank" rel="noopener" tabIndex={front ? 0 : -1}>Open full size ↗</a>
                </div>
                {front && near
                  ? <iframe title={`${d.name}, ${d.kind}: concept design`} src={`/designs/${d.slug}/index.html`} sandbox="allow-scripts" />
                  : <div className="d-cover" style={{ background: d.bg, color: d.ink }}><b>{d.name}</b><span>{d.kind}</span></div>}
              </div>
            );
          })}
        </div>
        <div className="d-ctrl">
          <button type="button" aria-label="Previous design" onClick={() => go(-1)}>←</button>
          <p aria-live="polite"><b>{cur.name}</b><span>{cur.kind}</span></p>
          <button type="button" aria-label="Next design" onClick={() => go(1)}>→</button>
        </div>
        <div className="d-pips">
          {DESIGNS.map((d, k) => <button key={d.slug} type="button" aria-label={`Show ${d.name}`} aria-current={k === i} onClick={() => setI(k)} />)}
        </div>
      </div>
    </section>
  );
}
