// Visitor counting (no cookies, nothing personal). Each event is sent at most once per browser tab.
const sent = new Set<string>();
export function hit(e: string) {
  try {
    if (sent.has(e) || sessionStorage.getItem(`ddg-hit-${e}`)) return;
    sent.add(e); sessionStorage.setItem(`ddg-hit-${e}`, '1');
  } catch { if (sent.has(e)) return; sent.add(e); }
  fetch('/api/public/hit', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ e }), keepalive: true }).catch(() => {});
}

/** Counts "view" once, then each section the first time half of it is on screen. */
export function watchSections(ids: Record<string, string>) {
  hit('view');
  if (!('IntersectionObserver' in window)) return () => {};
  const io = new IntersectionObserver((es) => es.forEach((en) => {
    if (en.isIntersecting) { const ev = ids[en.target.id]; if (ev) hit(ev); io.unobserve(en.target); }
  }), { threshold: 0.35 });
  Object.keys(ids).forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
  return () => io.disconnect();
}
