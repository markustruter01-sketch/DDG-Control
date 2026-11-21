import { useEffect, useRef, useState, type ComponentType } from 'react';
import { LIVE, LIVE_VIEWS, type LiveKey } from './content';

/**
 * ddg.limited/live/<name> (Markus, 19 Nov; redesigned 21 Nov): one of our own platforms, running for real,
 * display only. A PC / Phone switch at the top picks the frame:
 *  - PC: a browser window. On a narrow screen the page is drawn at desktop width and scaled down to fit,
 *    so a phone sees the real desktop layout instead of a squashed one.
 *  - Phone: a phone-shaped frame (390 x 844). On a wide screen the words sit beside it, so the screen is used.
 * Opens on Phone on phones and on PC on wider screens. Nothing here calls a platform's API.
 */
type View = 'pc' | 'phone';
const DESKTOP_W = 1440;   // the width the PC view is drawn at
const DESKTOP_H = 900;
const NARROW = '(max-width: 760px)';

function useNarrow() {
  const [narrow, setNarrow] = useState(() => typeof window !== 'undefined' && window.matchMedia(NARROW).matches);
  useEffect(() => {
    const m = window.matchMedia(NARROW);
    const on = () => setNarrow(m.matches);
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, []);
  return narrow;
}

/** The desktop page, scaled to the width of its box (1 on a big screen, less on a small one). */
function PcWindow({ src, title, address }: { src: string; title: string; address: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setScale(Math.min(1, e.contentRect.width / DESKTOP_W)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const fits = scale >= 1;
  return (
    <div className="lv-win">
      <div className="lv-bar" aria-hidden="true"><i /><i /><i /><span>{address}</span></div>
      <div className="lv-pc" ref={box} style={fits ? undefined : { height: DESKTOP_H * scale }}>
        <iframe title={title} src={src} loading="eager"
          style={fits ? undefined : { width: DESKTOP_W, height: DESKTOP_H, transform: `scale(${scale})`, transformOrigin: '0 0' }} />
      </div>
    </div>
  );
}

function PhoneFrame({ src, title }: { src: string; title: string }) {
  return (
    <div className="lv-phone">
      <span className="lv-notch" aria-hidden="true" />
      <iframe title={title} src={src} loading="eager" />
    </div>
  );
}

export function LivePage({ which, Nav, Footer }: { which: LiveKey; Nav: ComponentType; Footer: ComponentType }) {
  const it = LIVE[which];
  const narrow = useNarrow();
  const [picked, setPicked] = useState<View | null>(null);
  const view: View = picked ?? (narrow ? 'phone' : 'pc');
  const title = `${it.name}: ${view === 'pc' ? LIVE_VIEWS.pc : LIVE_VIEWS.phone}, display only`;

  const head = (
    <header className="lv-head">
      <p className="s-eyebrow">{it.eyebrow}</p>
      <h1>{it.name}</h1>
      <p className="lv-line">{it.line}</p>
    </header>
  );
  const controls = (
    <div className="lv-controls">
      <div className="lv-switch" role="tablist" aria-label="Show as">
        {(['pc', 'phone'] as const).map((v) => (
          <button key={v} role="tab" aria-selected={view === v} className={view === v ? 'on' : ''} onClick={() => setPicked(v)}>
            {v === 'pc' ? LIVE_VIEWS.pc : LIVE_VIEWS.phone}
          </button>
        ))}
      </div>
      <a className="s-btn fill" href="/#start">Get a fixed quote →</a>
    </div>
  );
  const notes = <p className="lv-note">{it.note} {LIVE_VIEWS.note}</p>;

  return (
    <div className="s-plain dusk lv-page">
      <Nav />
      <main className="lv-main">
        {view === 'pc' ? (
          <>
            <div className="lv-top">{head}{controls}</div>
            <PcWindow src={it.src} title={title} address={it.address} />
            {notes}
          </>
        ) : (
          <div className="lv-phone-layout">
            <div className="lv-side">{head}{controls}{notes}</div>
            <PhoneFrame src={it.src} title={title} />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
