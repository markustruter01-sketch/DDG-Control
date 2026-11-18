import { T } from './tune';

/**
 * The page building itself at the bottom of the screen (Markus, 18 Nov 2026). Across the bottom part of the
 * screen (T.pbHeight, about a sixth) the page is drawn as pieces that come together as the visitor scrolls
 * down, and come apart again when they scroll up. Where the white lines (the pipes round each section) cross
 * into that strip they glow, and the pieces near them join first, as if the lines carry the power that
 * builds the page. One 2D canvas, fixed to the bottom, never takes clicks. Ten looks (T.pbStyle, 0 = off).
 */

type Cell = { x: number; y: number; r1: number; r2: number; r3: number; r4: number };
type Pt = { x: number; y: number };

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (v: number) => { const t = clamp(v); return t * t * (3 - 2 * t); };
const hash = (n: number) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };

/** Each look's piece size in CSS pixels at T.pbSize = 1. */
const PIECE = [0, 7, 22, 26, 18, 20, 24, 28, 14, 24, 10];

export function mountPageBuild(): { dispose: () => void } {
  const cv = document.createElement('canvas');
  cv.className = 'pb-canvas';
  cv.setAttribute('aria-hidden', 'true');
  document.body.appendChild(cv);
  const ctx = cv.getContext('2d');
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (!ctx || reduced) return { dispose: () => cv.remove() };

  let W = 0, H = 0, bandH = 0, dpr = 1, gridKey = '';
  let cells: Cell[] = [];
  let bg = '9,11,17';
  let lastY = scrollY, vel = 0, drift = 0, last = performance.now(), raf = 0;
  let pipes: Pt[][] = [], pipeKey = '';

  const size = () => {
    W = innerWidth; H = innerHeight;
    bandH = Math.max(40, Math.round(H * T.pbHeight));
    dpr = Math.min(2, devicePixelRatio || 1);
    cv.width = Math.round(W * dpr); cv.height = Math.round(bandH * dpr);
    cv.style.height = `${bandH}px`;
    const m = /(\d+)\D+(\d+)\D+(\d+)/.exec(getComputedStyle(document.documentElement).getPropertyValue('--site-base'));
    if (m) bg = `${m[1]},${m[2]},${m[3]}`;
    gridKey = '';
  };

  const buildGrid = (style: number) => {
    const s = Math.max(4, PIECE[style]! * T.pbSize);
    const key = `${style}|${s}|${W}|${bandH}`;
    if (key === gridKey) return s;
    gridKey = key; cells = [];
    let i = 0;
    for (let y = 0; y < bandH + s; y += s) {
      const odd = Math.round(y / s) % 2;
      for (let x = style === 9 && odd ? -s / 2 : 0; x < W + s; x += s) {
        cells.push({ x, y, r1: hash(i), r2: hash(i + 0.37), r3: hash(i + 0.71), r4: hash(i + 0.13) });
        i++;
      }
    }
    return s;
  };

  /** The water paths of the white lines, sampled every 8 px, in page coordinates. Re-read when they change. */
  const readPipes = () => {
    const svg = document.querySelector<SVGSVGElement>('svg.cn-pipes');
    if (!svg) { pipes = []; return; }
    const key = `${svg.getAttribute('viewBox')}|${svg.querySelectorAll('.water path').length}`;
    if (key === pipeKey) return;
    pipeKey = key;
    const top = svg.getBoundingClientRect().top + scrollY, left = svg.getBoundingClientRect().left;
    pipes = [...svg.querySelectorAll<SVGPathElement>('.water path')].map((p) => {
      const len = p.getTotalLength(), pts: Pt[] = [];
      for (let l = 0; l <= len; l += 8) { const q = p.getPointAtLength(l); pts.push({ x: q.x + left, y: q.y + top }); }
      return pts;
    });
  };

  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    const style = Math.round(T.pbStyle);
    const v = (scrollY - lastY) / Math.max(dt, 0.001); lastY = scrollY;
    vel += (v - vel) * 0.15;
    drift += dt * T.pbSpeed * (1 + clamp(Math.abs(vel) / 900, 0, 3));
    if (Math.round(H * T.pbHeight) !== bandH && Math.round(H * T.pbHeight) >= 40) size();

    // Only below the first screen (the 3D scene has its own show), and not once the page has run out.
    const docH = document.documentElement.scrollHeight;
    const active = style > 0
      ? T.pbStrength * clamp((scrollY - H * 0.5) / (H * 0.5)) * clamp((docH - (scrollY + H)) / bandH)
      : 0;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, bandH);
    if (active < 0.005) return;

    const s = buildGrid(style);
    readPipes();
    // Where the lines cross the top edge of the strip, and the parts of them inside it.
    const lineY = scrollY + H - bandH;
    const hits: number[] = [];
    const inside: Pt[][] = [];
    for (const pts of pipes) {
      let run: Pt[] = [];
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1]!, b = pts[i]!;
        if ((a.y - lineY) * (b.y - lineY) <= 0 && a.y !== b.y) hits.push(a.x + ((lineY - a.y) / (b.y - a.y)) * (b.x - a.x));
        if (b.y >= lineY && b.y <= lineY + bandH) run.push({ x: b.x, y: b.y - lineY });
        else if (run.length) { inside.push(run); run = []; }
      }
      if (run.length) inside.push(run);
    }
    const feed = T.pbFeed;
    const near = (x: number) => { let m = 0; for (const h of hits) m = Math.max(m, Math.exp(-((x - h) ** 2) / (2 * 70 * 70))); return m * feed; };
    // Scrolling up takes the page apart a little; scrolling down puts it together.
    const apart = clamp(-vel / 1600) * 0.45, together = clamp(vel / 1600) * 0.25;

    const unformed = (c: Cell) => {
      const d = (c.y + s / 2) / bandH; // 0 at the top of the strip, 1 at the bottom
      let u = clamp((d - 0.12 - 0.38 * c.r1) / 0.55);
      u = clamp(u + apart - together);
      return u * (1 - 0.85 * clamp(near(c.x + s / 2)));
    };
    const cover = (alpha: number) => `rgba(${bg},${clamp(alpha * active * 2.1)})`;
    const line = (alpha: number) => `rgba(255,255,255,${clamp(alpha * active * 1.6)})`;
    ctx.lineWidth = 1;

    if (style === 4) {
      // Weld seam: below a seam that wavers across the strip the page is not made yet; the seam glows and sparks.
      const seam = (x: number) => bandH * (0.55 + 0.12 * Math.sin(x / 90 + drift * 1.3) + 0.06 * Math.sin(x / 31 - drift * 2.1) - 0.3 * clamp(near(x)) + (apart - together) * bandH * 0.004);
      ctx.beginPath(); ctx.moveTo(0, bandH);
      for (let x = 0; x <= W; x += 8) ctx.lineTo(x, seam(x));
      ctx.lineTo(W, bandH); ctx.closePath();
      ctx.fillStyle = cover(0.9); ctx.fill();
      ctx.beginPath();
      for (let x = 0; x <= W; x += 8) (x ? ctx.lineTo(x, seam(x)) : ctx.moveTo(x, seam(x)));
      ctx.strokeStyle = line(0.55); ctx.stroke();
      for (let i = 0; i < 40; i++) {
        const x = (hash(i) * W + drift * 60 * (hash(i + 2) - 0.5)) % W, ph = (drift * 2 + hash(i + 5)) % 1;
        ctx.fillStyle = line(0.8 * (1 - ph)); ctx.fillRect((x + W) % W, seam(x) - ph * 18, 1.5, 1.5);
      }
    } else {
      for (const c of cells) {
        const u = unformed(c);
        if (u <= 0.01) continue;
        const cx = c.x + s / 2, cy = c.y + s / 2;
        // The empty slot: the page is not there yet, so it is covered in the page's own colour.
        if (style === 1) { ctx.fillStyle = cover(u > c.r2 ? 0.95 : 0.25 * u); ctx.fillRect(c.x, c.y, s, s); }
        else if (style === 10) { ctx.fillStyle = cover(u * 0.9); ctx.fillRect(c.x, c.y, s, s); }
        else { ctx.fillStyle = cover(u * 0.85); ctx.fillRect(c.x, c.y, s + 0.5, s + 0.5); }
        // The piece on its way in: it travels from below and to the side, turning, and lands in its slot.
        const t = u, mid = 4 * t * (1 - t);
        const ox = (c.r2 - 0.5) * s * 3 * t + Math.sin(drift * 1.7 + c.r3 * 6.28) * 2 * t;
        const oy = t * s * (1.2 + 2 * c.r4);
        const rot = (c.r3 - 0.5) * 2.4 * t;
        const k = 1 - 0.45 * t;
        ctx.save(); ctx.translate(cx + ox, cy + oy); ctx.rotate(rot); ctx.scale(k, k);
        const h = s / 2 - 1;
        ctx.strokeStyle = line(0.45 * mid + 0.1 * t);
        switch (style) {
          case 1: ctx.fillStyle = line(0.7 * mid); ctx.fillRect(-0.8, -0.8, 1.6, 1.6); break;
          case 2: ctx.strokeRect(-h, -h, 2 * h, 2 * h); break;
          case 3: { // a wire cube: front face, back face, and the four edges between
            const b = h * (0.55 + 0.35 * t), o = h * 0.45 * t;
            ctx.strokeRect(-h, -h, 2 * h, 2 * h); ctx.strokeRect(-b + o, -b - o, 2 * b, 2 * b);
            ctx.beginPath();
            ctx.moveTo(-h, -h); ctx.lineTo(-b + o, -b - o); ctx.moveTo(h, -h); ctx.lineTo(b + o, -b - o);
            ctx.moveTo(-h, h); ctx.lineTo(-b + o, b - o); ctx.moveTo(h, h); ctx.lineTo(b + o, b - o);
            ctx.stroke(); break;
          }
          case 5: ctx.restore(); ctx.save(); ctx.translate(cx, cy + t * bandH * 0.6 * (0.4 + c.r4)); ctx.strokeRect(-h, -h * 0.6, 2 * h, 1.2 * h); break;
          case 6: ctx.beginPath(); ctx.moveTo(-h, -h); ctx.lineTo(h, -h * (c.r1 > 0.5 ? 1 : -1)); ctx.lineTo(-h, h); ctx.closePath(); ctx.stroke(); break;
          case 7: ctx.restore(); ctx.save(); ctx.translate(c.x, c.y); ctx.strokeStyle = line(0.22 * t); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(s, 0); ctx.moveTo(0, 0); ctx.lineTo(0, s); ctx.stroke(); break;
          case 8: if (c.r1 > 0.86) { ctx.restore(); ctx.save(); const g = ctx.createLinearGradient(0, cy + s, 0, cy - s * 3); g.addColorStop(0, line(0)); g.addColorStop(0.5, line(0.5 * t)); g.addColorStop(1, line(0)); ctx.fillStyle = g; ctx.fillRect(c.x + s / 2, cy - s * 3 + ((drift * 40 * (0.5 + c.r2)) % (s * 2)), 1, s * 4); } break;
          case 9: ctx.beginPath(); for (let a = 0; a < 6; a++) { const an = Math.PI / 6 + (a * Math.PI) / 3; (a ? ctx.lineTo : ctx.moveTo).call(ctx, Math.cos(an) * h, Math.sin(an) * h); } ctx.closePath(); ctx.stroke(); break;
          case 10: ctx.restore(); ctx.save(); ctx.translate((c.r2 - 0.5) * 60 * t * Math.sin(drift * 3 + c.y), 0); ctx.fillStyle = line(0.12 * mid); ctx.fillRect(c.x, c.y, s, 1); break;
        }
        ctx.restore();
      }
    }

    // The power: the lines themselves inside the strip, brighter, with light running down them, and a glow
    // where each one meets the top of the strip.
    if (feed > 0) {
      ctx.lineCap = 'round';
      for (const run of inside) {
        if (run.length < 2) continue;
        ctx.beginPath(); ctx.moveTo(run[0]!.x, run[0]!.y);
        for (const p of run) ctx.lineTo(p.x, p.y);
        ctx.setLineDash([10, 26]); ctx.lineDashOffset = -drift * 60;
        ctx.strokeStyle = line(0.5 * feed); ctx.lineWidth = 1.5; ctx.stroke();
      }
      ctx.setLineDash([]); ctx.lineWidth = 1;
      for (const x of hits) {
        const pulse = 0.6 + 0.4 * Math.sin(drift * 4 + x);
        const g = ctx.createRadialGradient(x, 0, 0, x, 0, 46 * feed);
        g.addColorStop(0, line(0.55 * pulse * feed)); g.addColorStop(1, line(0));
        ctx.fillStyle = g; ctx.fillRect(x - 50 * feed, 0, 100 * feed, 50 * feed);
        const down = ctx.createLinearGradient(0, 0, 0, bandH * 0.7);
        down.addColorStop(0, line(0.4 * feed)); down.addColorStop(1, line(0));
        ctx.fillStyle = down; ctx.fillRect(x - 0.75, 0, 1.5, bandH * 0.7);
      }
    }
  };

  size();
  const onResize = () => size();
  addEventListener('resize', onResize);
  raf = requestAnimationFrame(frame);
  return {
    dispose: () => { cancelAnimationFrame(raf); removeEventListener('resize', onResize); cv.remove(); },
  };
}
