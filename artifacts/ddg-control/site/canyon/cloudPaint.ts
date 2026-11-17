import { T } from './tune';
import { onStableResize, stableHeight } from './viewport';

/**
 * Soft clouds, painted once in code (no image files): many soft round puffs in a cluster, roughened
 * with noise and blurred, lit a little from above. Used by the 3D scene (clouds.ts) and by a light
 * layer behind the rest of the page that drifts past slower than the page scrolls, seen blurred
 * through the frosted glass panels. This file has no three.js in it, so the page can load it alone.
 */

let seed = 9;
export const reseed = (s: number) => { seed = s; };
export const rand = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
const hash = (x: number, y: number, s: number) => { const v = Math.sin(x * 127.1 + y * 311.7 + s * 74.7) * 43758.5453; return v - Math.floor(v); };
const noise = (x: number, y: number, s: number) => {
  const ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy, u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy);
  const a = hash(ix, iy, s), b = hash(ix + 1, iy, s), c = hash(ix, iy + 1, s), d = hash(ix + 1, iy + 1, s);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
};
const fbm = (x: number, y: number, s: number) => { let t = 0, a = 0.5; for (let i = 0; i < 5; i++) { t += a * noise(x, y, s); x *= 2.03; y *= 2.03; a *= 0.5; } return t; };

/** Paint one cloud. Wider than tall, a flatter base, brighter on top. */
function paintCloud(k: number, size = 256): HTMLCanvasElement {
  const c = document.createElement('canvas'); c.width = size; c.height = size / 2;
  const g = c.getContext('2d')!;
  const puffs = 10 + Math.floor(rand() * 10);
  for (let i = 0; i < puffs; i++) {
    const px = size * (0.18 + rand() * 0.64), py = size * (0.22 + rand() * 0.14) + Math.abs(px - size / 2) * 0.12;
    const r = size * (0.08 + rand() * 0.13) * (1 - Math.abs(px / size - 0.5));
    const grd = g.createRadialGradient(px, py - r * 0.2, 0, px, py, r * 1.6);
    grd.addColorStop(0, 'rgba(255,255,255,0.55)'); grd.addColorStop(0.5, 'rgba(235,242,250,0.22)'); grd.addColorStop(1, 'rgba(220,230,245,0)');
    g.fillStyle = grd; g.beginPath(); g.arc(px, py, r * 1.6, 0, 7); g.fill();
  }
  // Wisps: break the edges up with noise so it reads as vapour, not as discs.
  const img = g.getImageData(0, 0, c.width, c.height), d = img.data;
  for (let y = 0; y < c.height; y++) for (let x = 0; x < c.width; x++) {
    const i = (y * c.width + x) * 4, n = fbm(x / 34, y / 22, k);
    // Fade to nothing well inside the picture's edges, so no edge of the picture can ever show.
    const ex = (x / c.width - 0.5) * 2, ey = (y / c.height - 0.5) * 2, e = Math.sqrt(ex * ex + ey * ey);
    const edge = Math.max(0, Math.min(1, (1 - e) / 0.45));
    d[i + 3] = Math.max(0, Math.min(255, d[i + 3] * (0.35 + 1.1 * n) * (1 - 0.35 * (y / c.height)) * edge * edge * (3 - 2 * edge)));
    const shade = 1 - 0.18 * (y / c.height); // a touch darker underneath
    d[i] *= shade; d[i + 1] *= shade; d[i + 2] *= Math.min(1, shade + 0.06);
  }
  g.putImageData(img, 0, 0);
  const out = document.createElement('canvas'); out.width = c.width; out.height = c.height;
  const o = out.getContext('2d')!; o.filter = 'blur(3px)'; o.drawImage(c, 0, 0);
  return out;
}

let pictures: HTMLCanvasElement[] | null = null;
export function cloudPictures(): HTMLCanvasElement[] {
  if (!pictures) { seed = 9; pictures = Array.from({ length: 6 }, (_, i) => paintCloud(i + 1)); }
  return pictures;
}

// ── The page: clouds drifting behind the panels ───────────────────────────────────────────
/** Puts a fixed layer of clouds behind the page. Returns a function that removes it. */
export function mountPageClouds(): () => void {
  const canvas = document.createElement('canvas');
  canvas.className = 'cn-clouds';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.prepend(canvas);
  const g = canvas.getContext('2d')!;
  const pics = cloudPictures();
  reseed(33);
  const clouds = Array.from({ length: 40 }, () => ({ x: rand(), y: rand(), size: 0.6 + rand() * 0.9, pic: Math.floor(rand() * pics.length), drift: 0.4 + rand(), depth: 0.6 + rand() * 0.8 }));
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let raf = 0, lastDraw = 0, blurFor = -1, soft: HTMLCanvasElement[] = pics;
  const t0 = performance.now();
  const size = () => { canvas.width = innerWidth; canvas.height = stableHeight(); lastDraw = 0; };
  size(); const stopSize = onStableResize(size);
  // Softened copies of the pictures, made once per blur setting (blurring every frame is costly).
  const soften = (b: number) => pics.map((p) => {
    if (b <= 0) return p;
    const pad = Math.ceil(b * 2), c = document.createElement('canvas'); c.width = p.width + pad * 2; c.height = p.height + pad * 2;
    const x = c.getContext('2d')!; x.filter = `blur(${b}px)`; x.drawImage(p, pad, pad); return c;
  });
  const page = document.querySelector<HTMLElement>('.cn-page');
  let lastY = -1;
  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    // Nothing to draw while the first screen still covers the layer, or the tab is hidden.
    if (document.hidden) return;
    const top = page ? page.getBoundingClientRect().top : 0;
    if (top > stableHeight()) { if (lastDraw) { g.clearRect(0, 0, canvas.width, canvas.height); lastDraw = 0; } return; }
    // About 30 frames a second is plenty for slow clouds; redraw sooner when the page scrolls.
    if (now - lastDraw < 33 && scrollY === lastY) return;
    if (T.glowMove > 0 && !still) {
      const m = ((now - t0) / 1000) * 0.05 * T.glowMove;
      canvas.style.setProperty('--glow-ax', `${18 + 10 * Math.sin(m)}%`); canvas.style.setProperty('--glow-ay', `${30 + 12 * Math.cos(m * 0.8)}%`);
      canvas.style.setProperty('--glow-bx', `${82 - 10 * Math.sin(m * 0.7)}%`); canvas.style.setProperty('--glow-by', `${72 - 12 * Math.cos(m * 0.9)}%`);
    }
    lastDraw = now; lastY = scrollY;
    if (T.pageCloudBlur !== blurFor) { blurFor = T.pageCloudBlur; soft = soften(blurFor); }
    const W = canvas.width, H = canvas.height, t = still ? 0 : (now - t0) / 1000;
    g.clearRect(0, 0, W, H);
    if (T.pageClouds <= 0) return;
    const n = Math.round(clouds.length * T.pageClouds), span = H * 2.2;
    for (let i = 0; i < n; i++) {
      const c = clouds[i], p = soft[c.pic];
      const w = W * 0.45 * T.pageCloudSize * c.size, h = (w * p.height) / p.width;
      const x = ((c.x * (W + w) + t * 8 * T.pageCloudDrift * c.drift) % (W + w) + (W + w)) % (W + w) - w;
      const y = ((c.y * span - scrollY * T.pageCloudDepth * 0.5 * c.depth) % span + span) % span - h;
      g.globalAlpha = T.pageCloudOpacity * (0.7 + 0.3 * Math.sin(t * 0.25 + i));
      g.drawImage(p, x, y, w, h);
    }
    g.globalAlpha = 1;
  };
  raf = requestAnimationFrame(frame);
  return () => { cancelAnimationFrame(raf); stopSize(); canvas.remove(); };
}
