/**
 * The pipes down the home page. The river on the first screen is the AI core's power; below it,
 * that same water runs through thin glass pipes, wrapping around the edge of each panel, so it
 * reads as the core feeding everything beneath it.
 *
 * The water is one flow: every pipe knows how far along the flow it starts (t0) and how long it
 * is. Scrolling sets how far the water should have reached (it follows a point 70% down the
 * screen); the water then runs there at a steady speed, so long sideways stretches fill visibly
 * instead of in one jump. A pipe around a panel splits at the top, runs down both sides and
 * meets again at the bottom.
 */

const R = 16; // corner radius for joining pipes
const SPEED = 1100; // how fast the water runs, in page pixels per second
const BACK = 3; // draining when scrolling up is this many times faster

type Seg = { el: SVGPathElement; t0: number; len: number; pts: { y: number; s: number }[] };
type Flow = { segs: Seg[]; s: number; target: number; raf: number; last: number };
type Box = { x: number; y: number; w: number; h: number; r: number; b: number; cx: number };

/** A path through points with rounded corners. */
function rounded(pts: [number, number][]): string {
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x, y] = pts[i];
    if (i === pts.length - 1) { d += ` L${x} ${y}`; break; }
    const [px, py] = pts[i - 1], [nx, ny] = pts[i + 1];
    const a = Math.hypot(x - px, y - py), b = Math.hypot(nx - x, ny - y);
    const r = Math.min(R, a / 2, b / 2);
    if (r < 0.5) { d += ` L${x} ${y}`; continue; }
    d += ` L${x - ((x - px) / a) * r} ${y - ((y - py) / a) * r} Q${x} ${y} ${x + ((nx - x) / b) * r} ${y + ((ny - y) / b) * r}`;
  }
  return d;
}

/** Work out where the pipes go and draw them. Call again whenever the page's layout changes. */
export function drawPipes(page: HTMLElement, svg: SVGSVGElement): void {
  // Measure panels where they will end up, not part-way through their slide-in animation.
  page.classList.add('cn-measuring');
  try { layout(page, svg); } catch { /* a half-drawn layout: the next resize draws it again */ } finally { page.classList.remove('cn-measuring'); }
}

function layout(page: HTMLElement, svg: SVGSVGElement): void {
  const p = page.getBoundingClientRect();
  const box = (el: Element | null): Box | null => {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return null;
    return { x: r.left - p.left, y: r.top - p.top, w: r.width, h: r.height, r: r.right - p.left, b: r.bottom - p.top, cx: r.left - p.left + r.width / 2 };
  };
  const q = (sel: string) => box(page.querySelector(sel));
  const W = page.clientWidth, H = page.scrollHeight;
  const radius = (el: Element | null) => {
    if (!el) return 16;
    const v = getComputedStyle(el).borderTopLeftRadius;
    return v.endsWith('%') ? (el.getBoundingClientRect().width * parseFloat(v)) / 100 : parseFloat(v) || 16;
  };

  // Each pipe: [path, the pipe it follows on from (index) or -1]. Timing is worked out after drawing.
  // `from` starts a pipe part-way along another one (where it branches off), instead of at its end.
  const plan: { d: string; after: number[]; from?: [number, number] }[] = [];
  const add = (pts: [number, number][], after: number[]) => (plan.push({ d: rounded(pts), after }), plan.length - 1);

  /** A pipe around a panel's edge: in at the top middle, both sides down, out at the bottom middle. Returns both halves. */
  const ring = (bx: Box, rr: number, after: number[], ex = bx.cx): number[] => {
    const { x, y, r, b, cx } = bx, k = Math.min(rr, bx.w / 2, bx.h / 2);
    // A round panel: two half circles.
    if (k >= bx.w / 2 - 0.5 && Math.abs(bx.w - bx.h) < 1) {
      const c = cx, rad = bx.w / 2;
      const left = plan.push({ d: `M${c} ${y} A${rad} ${rad} 0 0 0 ${c} ${b}`, after }) - 1;
      const right = plan.push({ d: `M${c} ${y} A${rad} ${rad} 0 0 1 ${c} ${b}`, after }) - 1;
      return [left, right];
    }
    const e = Math.min(r - k - 2, Math.max(x + k + 2, ex));
    // Corners use the panel's own radius.
    const left = plan.push({ d: `M${e} ${y} H${x + k} Q${x} ${y} ${x} ${y + k} V${b - k} Q${x} ${b} ${x + k} ${b} H${cx}`, after }) - 1;
    const right = plan.push({ d: `M${e} ${y} H${r - k} Q${r} ${y} ${r} ${y + k} V${b - k} Q${r} ${b} ${r - k} ${b} H${cx}`, after }) - 1;
    return [left, right];
  };

  // Every panel that wants a pipe round it says so with data-pipe, in page order. On the business
  // reel only the middle slot gets one (the cards turn through it); stacked, each card does.
  const panels = [...page.querySelectorAll<HTMLElement>('[data-pipe]')]
    .filter((el) => !el.matches('.j-biz:not(.j-stack) .j-card'))
    .map((el) => ({ el, bx: box(el) }))
    .filter((x): x is { el: HTMLElement; bx: Box } => !!x.bx);
  // Words on the page, so joining pipes can run down a clear column instead of through text.
  // A heading split either side of the pipe counts as its two halves, so the pipe can pass between them.
  const words = [...page.querySelectorAll('h1, h2, h3, p, .s-eyebrow, .cn-head *')].flatMap((el) => (el.matches('.j-biz-head h2') ? [...el.children] : [el])).map((el) => {
    const rg = document.createRange();
    rg.selectNodeContents(el);
    const r = rg.getBoundingClientRect();
    return { l: r.left - p.left - 18, r: r.right - p.left + 18, t: r.top - p.top - 6, b: r.bottom - p.top + 6 };
  }).filter((w) => w.r - w.l > 36);
  const clearAt = (x: number, y0: number, y1: number) => !words.some((w) => x > w.l && x < w.r && w.b > y0 && w.t < y1);
  /** Join the pipe from where it is to the top of a panel, down a column with no words in it. */
  const join = (bx: Box, after: number[]): { seg: number; ex: number } => {
    const k = 40, y0 = at[1] + 2, y1 = bx.y - 2;
    const tries = [at[0], bx.cx, bx.r - k, bx.x + k, bx.r - 2 * k, bx.x + 2 * k];
    const xc = tries.find((x) => clearAt(x, y0, y1));
    if (xc === undefined) {
      // No clear column straight down (narrow screens): run down the page's edge instead, past the words.
      const gx = [6, W - 6].find((x) => clearAt(x, y0, y1)) ?? 6;
      const t1 = at[1] + Math.min(18, (bx.y - at[1]) / 4), t2 = bx.y - Math.min(18, (bx.y - at[1]) / 4);
      const seg = add([at, [at[0], t1], [gx, t1], [gx, t2], [bx.cx, t2], [bx.cx, bx.y]], after);
      return { seg, ex: bx.cx };
    }
    const turn = at[1] + Math.min(28, (bx.y - at[1]) / 3);
    const seg = Math.abs(xc - at[0]) < 1 ? add([at, [xc, bx.y]], after) : add([at, [at[0], turn], [xc, turn], [xc, bx.y]], after);
    return { seg, ex: xc };
  };

  let tail: number[] = [];
  let at: [number, number] = [W / 2, 6];

  // From the river down the page, around each panel in turn.
  for (const { el, bx } of panels) {
    if (bx.y - at[1] < 12) continue;
    const j = join(bx, tail);
    tail = ring(bx, radius(el), [j.seg], j.ex);
    at = [bx.cx, bx.b];
  }

  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.style.height = `${H}px`;
  // Drawn in layers (all glass walls, then all insides, then all water) so where pipes meet or
  // run side by side they merge into one tube with no visible joins.
  const layer = (cls: string) => `<g class="${cls}">${plan.map(({ d }) => `<path d="${d}"/>`).join('')}</g>`;
  // Above the page: the same pipe carries on up the screen, so the riverbed pipe in the 3D scene runs
  // straight into it. It only shows once the scene has narrowed its pipe to match (--pipe-join).
  const up = `M${W / 2} ${-window.innerHeight * 1.4} V${6}`;
  const joinPipe = `<g class="join"><path class="jw" d="${up}"/><path class="jh" d="${up}"/><path class="jv" d="${up}"/></g>`;
  svg.innerHTML = joinPipe + layer('wall') + layer('hollow') + layer('water') + '<g class="sparks"></g>';

  // Timing: each pipe starts where the latest of the pipes before it ends.
  const waters = [...svg.querySelectorAll<SVGPathElement>('.water path')];
  const segs: Seg[] = [];
  plan.forEach(({ after }, i) => {
    const path = waters[i];
    const len = path.getTotalLength();
    const from = plan[i].from;
    const t0 = from ? segs[from[0]].t0 + from[1] : after.length ? Math.max(...after.map((j) => segs[j].t0 + segs[j].len)) : 0;
    const pts: { y: number; s: number }[] = [];
    for (let l = 0; l <= len; l += 6) pts.push({ y: path.getPointAtLength(l).y, s: t0 + l });
    pts.push({ y: path.getPointAtLength(len).y, s: t0 + len });
    path.style.strokeDasharray = `${len} ${len + 1}`;
    segs.push({ el: path, t0, len, pts });
  });

  const old = (svg as unknown as { _flow?: Flow })._flow;
  if (old) cancelAnimationFrame(old.raf);
  (svg as unknown as { _flow?: Flow })._flow = { segs, s: old?.s ?? 0, target: 0, raf: 0, last: 0 };
  paint(svg);
}

const SPARK =
  '<g class="spark"><circle class="halo" r="7"/><circle class="core" r="1.7"/>' +
  '<circle class="bit b1" r="0.7"/><circle class="bit b2" r="0.6"/><circle class="bit b3" r="0.5"/></g>';

function paint(svg: SVGSVGElement): void {
  const f = (svg as unknown as { _flow?: Flow })._flow;
  if (!f) return;
  // Every place the water is still running forward gets a small spark, like a soldering tip.
  const fronts: DOMPoint[] = [];
  for (const g of f.segs) {
    const got = Math.min(g.len, Math.max(0, f.s - g.t0));
    g.el.style.strokeDashoffset = String(g.len - got);
    g.el.classList.toggle('dry', got <= 0);
    if (got > 0.5 && got < g.len - 0.5 && fronts.length < 8) fronts.push(g.el.getPointAtLength(got));
  }
  const box = svg.querySelector('.sparks');
  if (!box) return;
  while (box.children.length < fronts.length) box.insertAdjacentHTML('beforeend', SPARK);
  [...box.children].forEach((el, i) => {
    const pt = fronts[i];
    (el as SVGGElement).style.display = pt ? '' : 'none';
    if (pt) el.setAttribute('transform', `translate(${pt.x} ${pt.y})`);
  });
}

/** Set how far the water should reach (a point 70% down the screen, or the very end at the bottom of the page), then let it run there. */
export function fillPipes(page: HTMLElement, svg: SVGSVGElement): void {
  const f = (svg as unknown as { _flow?: Flow })._flow;
  if (!f) return;
  const vh = window.innerHeight, box = page.getBoundingClientRect();
  // Near the end of the page the front slides down to the very bottom, so the water can finish.
  const left = document.documentElement.scrollHeight - (window.scrollY + vh);
  const end = Math.min(1, Math.max(0, 1 - left / (vh * 0.6)));
  const line = vh * 0.7 + end * Math.max(0, box.bottom + 20 - vh * 0.7);
  const front = line - box.top;
  let target = 0;
  for (const g of f.segs) for (const pt of g.pts) if (pt.y <= front && pt.s > target) target = pt.s;
  f.target = target;
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) { f.s = target; paint(svg); return; }
  if (f.raf) return;
  f.last = performance.now();
  const step = (now: number) => {
    const dt = Math.min(0.05, (now - f.last) / 1000);
    f.last = now;
    const gap = f.target - f.s;
    // Steady speed for normal scrolling; a big jump (fast scroll, a link) catches up quicker.
    const move = Math.max(gap > 0 ? SPEED : SPEED * BACK, Math.abs(gap) * 2.5) * dt;
    f.s = Math.abs(gap) <= move ? f.target : f.s + Math.sign(gap) * move;
    paint(svg);
    f.raf = f.s === f.target ? 0 : requestAnimationFrame(step);
  };
  f.raf = requestAnimationFrame(step);
}
