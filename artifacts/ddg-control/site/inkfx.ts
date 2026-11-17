/**
 * White-ink motion: one drop of liquid ink travels between the parts of a system on smooth,
 * bending paths, leaving a wispy trail. Where it arrives it splashes (under gravity) and that part
 * lights up. The parts themselves are plain, crisp line drawings: only the travelling ink is fluid.
 *
 * Everything is a pure function of time, so the same frame can be drawn again exactly (for video).
 * Draw onto two canvases: `ink` (shown through a "goo" SVG filter, so drops melt together like
 * liquid) and `line` (crisp lines, labels and the thin wisps).
 */

export type Ctx = CanvasRenderingContext2D;
export type Station = {
  id: string; x: number; y: number;
  /** Draw this part. `on` (0-1) is how lit it is just after the ink arrives. */
  draw: (c: Ctx, t: number, on: number) => void;
};
export type Scene = {
  w: number; h: number;
  stations: Station[];
  /** Station ids, or [x, y] points the ink passes through without stopping (e.g. along a chart line). */
  route: (string | [number, number])[];
  /** Ink speed, in scene units per second. */
  speed: number;
  /** Background drawing that is always there (labels, connecting hints). */
  under?: (c: Ctx, t: number) => void;
  /** Build mode: each part draws itself in the first time the ink reaches it (for the explainer video). */
  build?: boolean;
  /** Extra seconds on the way into a station (slows the ink down there; used by the explainer video). */
  dwell?: Record<string, number>;
  /** How big the ink is, in scene units. */
  size?: number;
};

type Leg = { p0: number[]; c1: number[]; c2: number[]; p1: number[]; t0: number; dur: number; to?: string };

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const rnd = (s: number) => { const x = Math.sin(s * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const bez = (l: Leg, u: number) => {
  const v = 1 - u, a = v * v * v, b = 3 * v * v * u, c = 3 * v * u * u, d = u * u * u;
  return [a * l.p0[0] + b * l.c1[0] + c * l.c2[0] + d * l.p1[0], a * l.p0[1] + b * l.c1[1] + c * l.c2[1] + d * l.p1[1]];
};
// A slow swirling current: trails drift and curl in it, like ink in water.
const flow = (x: number, y: number, t: number) => [
  Math.sin(y * 0.03 + t * 0.9) + 0.6 * Math.sin(x * 0.017 - t * 1.4),
  Math.cos(x * 0.026 + t * 0.8) + 0.6 * Math.cos(y * 0.021 + t * 1.2) - 0.5,
];

export function makeInk(scene: Scene) {
  const S = scene.size ?? 1;
  const byId = new Map(scene.stations.map((s) => [s.id, s]));
  const pts = scene.route.map((r) => (typeof r === 'string' ? { p: [byId.get(r)!.x, byId.get(r)!.y], to: r } : { p: r, to: undefined }));
  // Plan the legs: each one leaves along the direction the last one arrived in, then bends on its way,
  // so the whole path is one smooth, flowing line. The route closes back on itself, so it loops.
  const legs: Leg[] = [];
  let dir = [1, 0], time = 0;
  for (let pass = 0; pass < 2; pass++) {
    legs.length = 0; time = 0;
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i], b = pts[(i + 1) % pts.length];
      const p0 = a.p, p1 = b.p, dx = p1[0] - p0[0], dy = p1[1] - p0[1], L = Math.hypot(dx, dy) || 1;
      const straight = !b.to || !a.to; // legs along a chart line stay close to it
      const bend = straight ? 0 : (rnd(i * 3.7) - 0.5) * 0.9;
      const nx = -dy / L, ny = dx / L;
      const k1 = straight ? 0.3 : 0.45;
      const c1 = [p0[0] + dir[0] * L * k1, p0[1] + dir[1] * L * k1];
      const c2 = [p1[0] - (dx / L) * L * 0.3 + nx * L * bend, p1[1] - (dy / L) * L * 0.3 + ny * L * bend];
      const ex = p1[0] - c2[0], ey = p1[1] - c2[1], el = Math.hypot(ex, ey) || 1;
      dir = [ex / el, ey / el];
      const dur = Math.max(straight ? 0.18 : 0.55, (L * (straight ? 1 : 1.25)) / scene.speed) + (b.to && pass === 1 && !legs.some((l) => l.to === b.to) ? scene.dwell?.[b.to] ?? 0 : 0);
      legs.push({ p0, c1, c2, p1, t0: time, dur, to: b.to });
      time += dur;
    }
  }
  const duration = time;

  /** Where the ink is at time t (and which leg), looping. */
  const at = (t: number) => {
    const tt = ((t % duration) + duration) % duration;
    let i = 0; while (i < legs.length - 1 && legs[i + 1].t0 <= tt) i++;
    const l = legs[i], s = clamp((tt - l.t0) / l.dur);
    // Eases into each part and out again (slower on arrival), but never stops: a fluid line.
    const u = l.to ? s - (0.55 * Math.sin(2 * Math.PI * s)) / (2 * Math.PI) : s;
    return { p: bez(l, u), leg: i, s };
  };
  /** Every arrival (station id and time) up to time t in the current loop, plus the previous loop's last. */
  const arrivals = (t: number) => {
    const loop = Math.floor(t / duration), out: { id: string; t: number; n: number; x: number; y: number }[] = [];
    for (const k of [loop - 1, loop]) legs.forEach((l, i) => {
      if (!l.to) return;
      const ta = k * duration + l.t0 + l.dur;
      if (ta <= t && t - ta < 3) out.push({ id: l.to, t: ta, n: k * 1000 + i, x: l.p1[0], y: l.p1[1] });
    });
    return out;
  };
  /** First time the ink reaches each station (for build mode). */
  const first = new Map<string, number>();
  legs.forEach((l) => { if (l.to && !first.has(l.to)) first.set(l.to, l.t0 + l.dur); });
  if (scene.route[0] && typeof scene.route[0] === 'string') first.set(scene.route[0] as string, 0);

  function draw(ink: Ctx, line: Ctx, t: number, fade = 1) {
    ink.clearRect(0, 0, scene.w, scene.h); line.clearRect(0, 0, scene.w, scene.h);
    line.globalAlpha = fade; ink.globalAlpha = fade;
    line.lineCap = 'round'; line.lineJoin = 'round';
    const arr = arrivals(t);
    scene.under?.(line, t);
    for (const st of scene.stations) {
      const last = arr.filter((a) => a.id === st.id).pop();
      const on = last ? Math.exp(-2.2 * (t - last.t)) : 0;
      const shown = scene.build ? clamp((t - (first.get(st.id) ?? 1e9) + 0.15) / 0.7) : 1;
      if (shown <= 0) continue;
      line.save(); line.globalAlpha = fade * shown; st.draw(line, t, on); line.restore();
    }
    // The wispy trail: where the ink has been, drifting on the current and thinning out.
    const N = 70, dt = 0.011;
    let prev: number[] | null = null, prevW = 0;
    const trail: number[][] = [];
    for (let i = N; i >= 0; i--) {
      const age = i * dt, q = at(t - age).p, f = flow(q[0], q[1], t), drift = age * age * 26 * S;
      trail.push([q[0] + f[0] * drift, q[1] + f[1] * drift, age]);
    }
    for (const [x, y, age] of trail) {
      const k = 1 - age / (N * dt), w = Math.max(0.3, 3.4 * S * Math.pow(k, 2.2));
      if (prev) {
        line.strokeStyle = `rgba(255,255,255,${0.95 * Math.pow(k, 1.3)})`; line.lineWidth = (w + prevW) / 2;
        line.beginPath(); line.moveTo(prev[0], prev[1]); line.lineTo(x, y); line.stroke();
        // Two fine strands peel off and fray apart as the trail ages.
        for (const side of [-1, 1]) {
          const o = side * age * age * 60 * S;
          line.strokeStyle = `rgba(255,255,255,${0.32 * Math.pow(k, 1.6)})`; line.lineWidth = 0.5;
          line.beginPath(); line.moveTo(prev[0] + o * 0.7, prev[1] - o); line.lineTo(x + o * 0.7, y - o); line.stroke();
        }
      }
      prev = [x, y]; prevW = w;
    }
    // The head: a drop of liquid, stretched along its path, with a short liquid tail melting into it.
    ink.fillStyle = '#fff';
    const head = at(t).p, back = at(t - 0.02).p, vx = head[0] - back[0], vy = head[1] - back[1], sp = Math.hypot(vx, vy) / 0.02;
    for (let i = 10; i >= 1; i--) { const q = at(t - i * 0.009).p; ink.beginPath(); ink.arc(q[0], q[1], 4.6 * S * Math.pow(1 - i / 11, 1.4), 0, 7); ink.fill(); }
    const st = 1 + Math.min(0.7, sp / (scene.speed * 3));
    ink.save(); ink.translate(head[0], head[1]); ink.rotate(Math.atan2(vy, vx));
    ink.beginPath(); ink.ellipse(0, 0, 5.2 * S * st, (5.2 * S) / Math.sqrt(st), 0, 0, 7); ink.fill(); ink.restore();
    // Splashes where the ink arrives: drops thrown up and out, falling under gravity, and a fine mist.
    const G = 520 * S;
    for (const a of arr) {
      const age = t - a.t;
      if (age > 1.1) continue;
      for (let j = 0; j < 9; j++) {
        const s = a.n * 13.1 + j * 7.3, ang = -Math.PI / 2 + (rnd(s) - 0.5) * 3.2, v = (90 + rnd(s + 1) * 170) * S;
        const x = a.x + Math.cos(ang) * v * age, y = a.y + Math.sin(ang) * v * age + 0.5 * G * age * age;
        const k = 1 - age / (0.55 + rnd(s + 2) * 0.55); if (k <= 0) continue;
        const r = (0.7 + rnd(s + 3) * 1.9) * S * k, vy2 = Math.sin(ang) * v + G * age, ss = 1 + Math.min(2, Math.hypot(Math.cos(ang) * v, vy2) / (220 * S));
        ink.save(); ink.translate(x, y); ink.rotate(Math.atan2(vy2, Math.cos(ang) * v)); ink.beginPath(); ink.ellipse(0, 0, r * ss, r, 0, 0, 7); ink.fill(); ink.restore();
      }
      for (let j = 0; j < 10; j++) {
        const s = a.n * 5.7 + j * 3.1, ang = rnd(s) * 7, v = (20 + rnd(s + 1) * 70) * S, k = 1 - age / 0.9;
        if (k <= 0) continue;
        line.fillStyle = `rgba(255,255,255,${0.5 * k})`; line.beginPath(); line.arc(a.x + Math.cos(ang) * v * age, a.y + Math.sin(ang) * v * age - 8 * age * S, 0.6 * S, 0, 7); line.fill();
      }
      // A thin ring that spreads from the arrival.
      if (age < 0.5) { line.strokeStyle = `rgba(255,255,255,${0.4 * (1 - age / 0.5)})`; line.lineWidth = 0.7; line.beginPath(); line.arc(a.x, a.y, (4 + 26 * (1 - Math.pow(1 - age / 0.5, 3))) * S, 0, 7); line.stroke(); }
    }
    line.globalAlpha = 1; ink.globalAlpha = 1;
  }
  return { duration, draw, first };
}

// ── Small drawing helpers for scenes (crisp white lines) ────────────────────────────────────
export const stroke = (c: Ctx, d: string, a: number, w = 1.1) => { c.strokeStyle = `rgba(255,255,255,${a})`; c.lineWidth = w; c.stroke(new Path2D(d)); };
export const fillP = (c: Ctx, d: string, a: number) => { c.fillStyle = `rgba(255,255,255,${a})`; c.fill(new Path2D(d)); };
export const text = (c: Ctx, s: string, x: number, y: number, a = 0.5, align: CanvasTextAlign = 'center', size = 7.5) => {
  c.fillStyle = `rgba(255,255,255,${a})`; c.font = `500 ${size}px ui-monospace, 'Geist Mono', 'DejaVu Sans Mono', monospace`; c.textAlign = align;
  (c as Ctx & { letterSpacing?: string }).letterSpacing = '0.8px';
  c.fillText(s, x, y);
  (c as Ctx & { letterSpacing?: string }).letterSpacing = '0px';
};
export const box = (x: number, y: number, w: number, h: number, r = 6) =>
  `M${x + r} ${y}h${w - 2 * r}a${r} ${r} 0 0 1 ${r} ${r}v${h - 2 * r}a${r} ${r} 0 0 1 -${r} ${r}h-${w - 2 * r}a${r} ${r} 0 0 1 -${r} -${r}v-${h - 2 * r}a${r} ${r} 0 0 1 ${r} -${r}z`;
/** A part drawn as a line shape that brightens and fills faintly when the ink arrives. */
export const part = (d: string, label?: [string, number, number, CanvasTextAlign?]) => (c: Ctx, _t: number, on: number) => {
  fillP(c, d, 0.08 * on); stroke(c, d, 0.5 + 0.45 * on, 1.1 + 0.5 * on);
  if (label) text(c, label[0], label[1], label[2], 0.5 + 0.4 * on, label[3] ?? 'center');
};
/** A wireframe globe that turns. */
export const globe = (cx: number, cy: number, r: number, label?: [string, number, number]) => (c: Ctx, t: number, on: number) => {
  const a = 0.45 + 0.4 * on;
  c.strokeStyle = `rgba(255,255,255,${a})`; c.lineWidth = 1.1;
  c.beginPath(); c.arc(cx, cy, r, 0, 7); c.stroke();
  c.strokeStyle = `rgba(255,255,255,${a * 0.45})`; c.lineWidth = 0.9;
  const m = Math.abs(Math.cos(t * 0.5)) * r;
  c.beginPath(); c.ellipse(cx, cy, Math.max(0.5, m), r, 0, 0, 7); c.stroke();
  c.beginPath(); c.ellipse(cx, cy, Math.max(0.5, r - m), r, 0, 0, 7); c.stroke();
  for (const k of [-0.5, 0, 0.5]) { const y = cy + k * r, hw = Math.sqrt(1 - k * k) * r; c.beginPath(); c.moveTo(cx - hw, y); c.lineTo(cx + hw, y); c.stroke(); }
  if (label) text(c, label[0], label[1], label[2], 0.5 + 0.4 * on);
};
/** A plain, good-looking clock: twelve ticks, an hour and a minute hand. */
export const clock = (cx: number, cy: number, r: number, label?: [string, number, number, CanvasTextAlign?]) => (c: Ctx, t: number, on: number) => {
  const a = 0.6 + 0.35 * on;
  c.strokeStyle = `rgba(255,255,255,${a})`; c.lineWidth = 1.2; c.beginPath(); c.arc(cx, cy, r, 0, 7); c.stroke();
  for (let i = 0; i < 12; i++) {
    const g = (i / 12) * Math.PI * 2, long = i % 3 === 0;
    c.lineWidth = long ? 1.3 : 0.8; c.beginPath();
    c.moveTo(cx + Math.cos(g) * r * (long ? 0.72 : 0.8), cy + Math.sin(g) * r * (long ? 0.72 : 0.8)); c.lineTo(cx + Math.cos(g) * r * 0.9, cy + Math.sin(g) * r * 0.9); c.stroke();
  }
  const mm = t * 1.2 - Math.PI / 2, hh = t * 0.1 - Math.PI / 2;
  c.lineWidth = 1.6; c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + Math.cos(hh) * r * 0.45, cy + Math.sin(hh) * r * 0.45); c.stroke();
  c.lineWidth = 1; c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + Math.cos(mm) * r * 0.75, cy + Math.sin(mm) * r * 0.75); c.stroke();
  c.fillStyle = '#fff'; c.beginPath(); c.arc(cx, cy, 1.6, 0, 7); c.fill();
  if (on > 0.05) { // a tick mark appears briefly when the check passes
    c.strokeStyle = `rgba(255,255,255,${on})`; c.lineWidth = 1.6;
    c.beginPath(); c.moveTo(cx + r + 6, cy); c.lineTo(cx + r + 10, cy + 4); c.lineTo(cx + r + 18, cy - 5); c.stroke();
  }
  if (label) text(c, label[0], label[1], label[2], 0.5 + 0.4 * on, label[3] ?? 'center');
};
