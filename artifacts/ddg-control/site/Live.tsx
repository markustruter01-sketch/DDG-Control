import type { ComponentType } from 'react';
import { LIVE, type LiveKey } from './content';

/**
 * ddg.limited/live/<name> (Markus, 19 Nov): one of our own platforms, running for real inside a browser-style
 * window, display only. The platform itself loads from `src` (its own page or app); this page adds the window,
 * one line about it, a full-screen link and the quote button.
 */
export function LivePage({ which, Nav, Footer }: { which: LiveKey; Nav: ComponentType; Footer: ComponentType }) {
  const it = LIVE[which];
  return (
    <div className="s-plain dusk lv-page">
      <Nav />
      <main className="lv-main">
        <header className="lv-head">
          <p className="s-eyebrow">{it.eyebrow}</p>
          <h1>{it.name}</h1>
          <p className="lv-line">{it.line}</p>
        </header>
        <div className="lv-win">
          <div className="lv-bar" aria-hidden="true"><i /><i /><i /><span>{it.address}</span></div>
          <iframe title={`${it.name}: live, display only`} src={it.src} loading="eager" allow="fullscreen" />
        </div>
        <p className="lv-foot">
          <span>{it.note}</span>
          <a className="s-btn" href={it.src} target="_blank" rel="noopener">Open full screen ↗</a>
          <a className="s-btn fill" href="/#start">Get a fixed quote →</a>
        </p>
      </main>
      <Footer />
    </div>
  );
}
