import { useEffect, useRef, useState, type ComponentType, type MouseEvent } from 'react';
import { LIVE, LIVE_VIEWS, type LiveKey } from './content';

/**
 * ddg.limited/live/<name> (Markus, 19 Nov): one of our own platforms, running for real inside a browser-style
 * window, display only. The platform itself loads from `src` (its own page or app); this page adds the window,
 * one line about it, the quote button, and (Markus, 20 Nov) a PC view / Phone view choice that opens the same
 * display-only page full screen in a computer-shaped or phone-shaped frame. Nothing here calls a platform's API.
 */
type View = 'pc' | 'phone';

function Popup({ view, setView, src, name }: { view: View; setView: (v: View | null) => void; src: string; name: string }) {
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const buttons = () => [...(box.current?.querySelectorAll<HTMLElement>('.lv-pop-bar button') ?? [])];
    buttons()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); setView(null); }
      if (e.key === 'Tab') {                                    // keep focus on the pop-up's buttons
        const f = buttons(); if (!f.length) return;
        e.preventDefault();
        const i = f.indexOf(document.activeElement as HTMLElement);
        (e.shiftKey ? f[i <= 0 ? f.length - 1 : i - 1] : f[i === -1 || i === f.length - 1 ? 0 : i + 1]).focus();
      }
    };
    document.addEventListener('keydown', onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = overflow; };
  }, [setView]);
  return (
    <div className="lv-pop" role="dialog" aria-modal="true" aria-label={`${name}: ${view === 'pc' ? LIVE_VIEWS.pc : LIVE_VIEWS.phone}`} ref={box}
      onClick={(e) => { if (e.target === e.currentTarget) setView(null); }}>
      <div className="lv-pop-bar">
        <span>{LIVE_VIEWS.note}</span>
        <button className="s-btn" onClick={() => setView(view === 'pc' ? 'phone' : 'pc')}>{view === 'pc' ? LIVE_VIEWS.phone : LIVE_VIEWS.pc}</button>
        <button className="s-btn" onClick={() => setView(null)}>{LIVE_VIEWS.close}</button>
      </div>
      <div className={view === 'pc' ? 'lv-frame-pc' : 'lv-frame-phone'}>
        <iframe title={`${name}: ${view === 'pc' ? LIVE_VIEWS.pc : LIVE_VIEWS.phone}, display only`} src={src} tabIndex={-1} />
      </div>
    </div>
  );
}

export function LivePage({ which, Nav, Footer }: { which: LiveKey; Nav: ComponentType; Footer: ComponentType }) {
  const it = LIVE[which];
  const [view, setView] = useState<View | null>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const open = (v: View) => (e: MouseEvent<HTMLButtonElement>) => { opener.current = e.currentTarget; setView(v); };
  const close = (v: View | null) => { setView(v); if (!v) window.setTimeout(() => opener.current?.focus(), 0); };
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
          <button className="s-btn" onClick={open('pc')}>{LIVE_VIEWS.pc}</button>
          <button className="s-btn" onClick={open('phone')}>{LIVE_VIEWS.phone}</button>
          <a className="s-btn fill" href="/#start">Get a fixed quote →</a>
        </p>
      </main>
      {view && <Popup view={view} setView={close} src={it.src} name={it.name} />}
      <Footer />
    </div>
  );
}
