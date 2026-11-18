/**
 * The first moments on the page (Markus, 18 Nov 2026): the page starts black (a cover drawn by index.html
 * before any script runs), fades in once the scene and fonts are ready, and only then the orb spawns.
 * `introStart()` is when the spawn began (performance.now()), or null while the cover is still up.
 */
let revealed = false;
let startedAt: number | null = null;

export function introStart(): number | null {
  return startedAt;
}

/** Fade the black cover away; the orb's spawn starts when the fade is mostly done. Safe to call twice. */
export function revealPage(fadeMs = 1000): void {
  if (revealed) return;
  revealed = true;
  const cover = document.getElementById('intro-cover');
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  startedAt = performance.now() + (cover && !reduced ? fadeMs * 0.8 : 0);
  if (!cover) return;
  cover.style.transition = `opacity ${reduced ? 200 : fadeMs}ms ease`;
  requestAnimationFrame(() => { cover.style.opacity = '0'; });
  window.setTimeout(() => cover.remove(), (reduced ? 200 : fadeMs) + 200);
}

/**
 * Preview only (the settings panel): play the load-in again from black, so a change to its settings can be
 * seen. Jumps to the top, puts the black cover back, and reveals again after a short pause.
 */
export function replayIntro(fadeMs: number): void {
  scrollTo(0, 0);
  let cover = document.getElementById('intro-cover');
  if (!cover) {
    cover = document.createElement('div');
    cover.id = 'intro-cover';
    cover.setAttribute('aria-hidden', 'true');
    document.body.prepend(cover);
  }
  cover.style.transition = 'none';
  cover.style.opacity = '1';
  revealed = false;
  startedAt = null;
  window.setTimeout(() => revealPage(fadeMs), 600);
}

// Never leave a visitor on a black screen: show the page after 4 s whatever happens.
window.setTimeout(() => revealPage(), 4000);
