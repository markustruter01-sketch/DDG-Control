/**
 * A screen height that stays still while a phone's address bar slides away or back.
 *
 * On phones, flick-scrolling hides and shows the browser's bars. `innerHeight` then changes mid-scroll,
 * and anything sized or positioned from it jumps (the scene re-frames, the orb hops, a dark strip shows
 * at the bottom until the browser catches up). Instead, size the fixed layers to the LARGEST screen height
 * (CSS `100lvh`: the height with the bars hidden) and use that same number in code. It only changes
 * when the width changes (turning the phone, resizing a desktop window).
 */
let probe: HTMLDivElement | null = null;
let h = 0, w = -1;

const measure = (): number => {
  if (!probe) {
    probe = document.createElement('div');
    probe.setAttribute('aria-hidden', 'true');
    probe.style.cssText = 'position:fixed;top:0;left:0;width:0;height:100vh;height:100lvh;visibility:hidden;pointer-events:none';
    document.body.appendChild(probe);
  }
  return Math.max(probe.getBoundingClientRect().height || 0, innerHeight);
};

/** The steady screen height in CSS pixels. */
export function stableHeight(): number {
  if (innerWidth !== w || !h) { w = innerWidth; h = measure(); }
  else if (innerHeight > h) h = innerHeight; // a browser without lvh: grow to the tallest seen
  return h;
}

/** Call `fn` only when the steady size really changes (not when the address bar slides). */
export function onStableResize(fn: () => void): () => void {
  let lastW = innerWidth, lastH = stableHeight();
  const check = () => {
    const nh = stableHeight();
    if (innerWidth === lastW && nh === lastH) return;
    lastW = innerWidth; lastH = nh; fn();
  };
  addEventListener('resize', check);
  return () => removeEventListener('resize', check);
}
