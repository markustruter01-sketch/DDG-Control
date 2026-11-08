import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';

/**
 * Website home: one-screen sections on a sheet (same turn as DDG Finance's dashboard).
 * No scrolling: each scroll turns the sheet over (like lifting an A4 page and flipping
 * it) to the next screen, or the one before when scrolling up; after the last comes
 * the first. Also arrow keys, PageDown/PageUp, a swipe and the dots on the right. On
 * small or short screens the screens simply stack and the page scrolls normally.
 */
export const FLIP_QUERY = '(min-width: 1024px) and (min-height: 700px)'; // = the hero's one-screen layout (site.css)
const FLIP_MS = 1200;          // matches the CSS: 600ms out, then 600ms in from 560ms
const REDUCED_MS = 320;
const WHEEL_MIN = 12;          // ignore tiny trackpad noise

function useMedia(query: string): boolean {
  const [match, setMatch] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatch(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [query]);
  return match;
}

export function FlipPages({ pages, side, onSide, labels }: {
  pages: ReactNode[]; side: number; onSide: (s: number) => void; labels: string[];
}) {
  const flipMode = useMedia(FLIP_QUERY);
  const reduced = useMedia('(prefers-reduced-motion: reduce)');
  const [anim, setAnim] = useState<{ dir: 'down' | 'up'; from: number } | null>(null);
  const shown = useRef(side);
  const nextDir = useRef<'down' | 'up' | null>(null);  // set by scroll/swipe/keys; links and dots go by page order
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const n = pages.length;

  // Animate whenever the screen changes (wheel, keys, swipe, dots or menu links).
  // Layout effect: the animation classes land before the first paint of the new screen.
  useLayoutEffect(() => {
    if (side === shown.current) return;
    const from = shown.current;
    const dir = nextDir.current ?? (side > from ? 'down' : 'up');
    nextDir.current = null;
    shown.current = side;
    if (!flipMode) {
      refs.current[side]?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
      return;
    }
    refs.current[side]?.scrollTo({ top: 0 });
    setAnim({ dir, from });
    const t = window.setTimeout(() => setAnim(null), reduced ? REDUCED_MS : FLIP_MS);
    return () => window.clearTimeout(t);
  }, [side, flipMode, reduced]); // eslint-disable-line react-hooks/exhaustive-deps

  // Turn to the next screen (down) or the one before (up); past the last comes the first.
  const turn = useCallback((dir: 'down' | 'up') => {
    if (anim) return;
    nextDir.current = dir;
    onSide(dir === 'down' ? (side + 1) % n : (side - 1 + n) % n);
  }, [anim, side, onSide, n]);

  useEffect(() => {
    if (!flipMode) return;
    const page = () => refs.current[side];
    // A screen only scrolls inside itself when it is taller than the window (short screens).
    const atBottom = (el: HTMLElement) => el.scrollTop + el.clientHeight >= el.scrollHeight - 2;
    const onWheel = (e: WheelEvent) => {
      const el = page();
      if (!el || Math.abs(e.deltaY) < WHEEL_MIN) return;
      if (e.deltaY > 0 && atBottom(el)) turn('down');
      else if (e.deltaY < 0 && el.scrollTop <= 0) turn('up');
    };
    let startY: number | null = null;
    const onStart = (e: TouchEvent) => { startY = e.touches[0]?.clientY ?? null; };
    const onEnd = (e: TouchEvent) => {
      const el = page();
      const endY = e.changedTouches[0]?.clientY;
      if (!el || startY === null || endY === undefined) return;
      const dy = startY - endY;
      if (dy > 60 && atBottom(el)) turn('down');
      else if (dy < -60 && el.scrollTop <= 0) turn('up');
      startY = null;
    };
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)) return;
      if (e.key === 'PageDown' || e.key === 'ArrowDown') turn('down');
      if (e.key === 'PageUp' || e.key === 'ArrowUp') turn('up');
    };
    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchend', onEnd, { passive: true });
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onStart);
      window.removeEventListener('touchend', onEnd);
      window.removeEventListener('keydown', onKey);
    };
  }, [flipMode, side, turn]);

  return (
    <div className={`flip-stage${flipMode ? ' on' : ''}${anim ? ` flipping-${anim.dir}` : ''}${reduced ? ' reduced' : ''}`}>
      {pages.map((content, i) => {
        const current = i === side;
        const cls = !flipMode ? '' : current ? (anim ? ' is-current flip-in' : ' is-current') : anim?.from === i ? ' flip-out' : ' is-away';
        return (
          <div key={i} ref={(el) => { refs.current[i] = el; }} className={`flip-page${cls}`} aria-hidden={flipMode && !current ? true : undefined}>
            {content}
          </div>
        );
      })}
      {flipMode && (
        <nav className="flip-dots" aria-label="Screens">
          {labels.map((l, i) => (
            <button key={l} type="button" aria-label={l} aria-current={i === side ? 'true' : undefined}
              className={i === side ? 'on' : ''} onClick={() => { if (!anim) onSide(i); }} />
          ))}
        </nav>
      )}
    </div>
  );
}
