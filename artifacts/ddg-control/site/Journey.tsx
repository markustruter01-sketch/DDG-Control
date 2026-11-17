import { Link } from 'wouter';
import { ABOUT, BUILT, RUN } from './content';

// The home page journey after the 3D first screen. Every panel marked data-pipe gets a water pipe
// round its edge (canyon/wires.ts), in page order.

/** 1. What we are. */
export function About({ onSee }: { onSee: () => void }) {
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
              <span>{x.text}</span>
              {x.href
                ? (x.external
                  ? <a className="j-tick-link" href={x.href} target="_blank" rel="noopener noreferrer">{x.name} <i aria-hidden="true">↗</i></a>
                  : <Link className="j-tick-link" href={x.href}>{x.name} <i aria-hidden="true">→</i></Link>)
                : <span className="j-tick-soon">{x.name ? `${x.name} \u00b7 ` : ''}{x.soon}</span>}
            </li>
          ))}
        </ul>
        <p className="j-line">{ABOUT.line}</p>
        <div className="j-actions">
          <a className="s-btn" href="#build" onClick={(e) => { e.preventDefault(); onSee(); }}>{ABOUT.see} ↓</a>
          <Link className="s-btn fill" href="/start">{ABOUT.start} →</Link>
        </div>
      </div>
    </section>
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
