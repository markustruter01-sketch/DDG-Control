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
  const radius = (el: Element | null) => (el ? parseFloat(getComputedStyle(el).borderTopLeftRadius) || 16 : 16);

  // Each pipe: [path, the pipe it follows on from (index) or -1]. Timing is worked out after drawing.
  // `from` starts a pipe part-way along another one (where it branches off), instead of at its end.
  const plan: { d: string; after: number[]; from?: [number, number] }[] = [];
  const add = (pts: [number, number][], after: number[]) => (plan.push({ d: rounded(pts), after }), plan.length - 1);

  /** A pipe around a panel's edge: in at the top middle, both sides down, out at the bottom middle. Returns both halves. */
  const ring = (bx: Box, rr: number, after: number[], ex = bx.cx): number[] => {
    const { x, y, r, b, cx } = bx, k = Math.min(rr, bx.w / 2, bx.h / 2);
    const e = Math.min(r - k - 2, Math.max(x + k + 2, ex));
    // Corners use the panel's own radius.
    const left = plan.push({ d: `M${e} ${y} H${x + k} Q${x} ${y} ${x} ${y + k} V${b - k} Q${x} ${b} ${x + k} ${b} H${cx}`, after }) - 1;
    const right = plan.push({ d: `M${e} ${y} H${r - k} Q${r} ${y} ${r} ${y + k} V${b - k} Q${r} ${b} ${r - k} ${b} H${cx}`, after }) - 1;
    return [left, right];
  };

  const workHead = q('#work .cn-head'), reel = q('#work .s-work'), bizHead = q('#businesses h2');
  const cardEls = [...page.querySelectorAll('#businesses .s-card')];
  const cards = cardEls.map((c) => box(c)).filter((c): c is Box => !!c);
  const buildEl = page.querySelector('#build .glass-plain'), build = box(buildEl);
  const kaseEl = page.querySelector('.s-case'), kase = box(kaseEl);
  const charEl = page.querySelector('#charity'), charity = box(charEl);

  // Words on the page, so joining pipes can run down a clear column instead of through text.
  const words = [...page.querySelectorAll('h1, h2, h3, p, .s-eyebrow, .cn-head *')].map((el) => {
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
    const xc = tries.find((x) => clearAt(x, y0, y1)) ?? bx.r - k;
    const turn = at[1] + Math.min(28, (bx.y - at[1]) / 3);
    const seg = Math.abs(xc - at[0]) < 1 ? add([at, [xc, bx.y]], after) : add([at, [at[0], turn], [xc, turn], [xc, bx.y]], after);
    return { seg, ex: xc };
  };

  let tail: number[] = [];
  let at: [number, number] = [W / 2, 6];

  // 1. From the river, down and around "Our work" (heading and screenshots together).
  if (workHead && reel) {
    const g = 12;
    const wb: Box = { x: reel.x - g, y: workHead.y - g, w: reel.w + 2 * g, h: reel.b - workHead.y + 2 * g, r: reel.r + g, b: reel.b + g, cx: reel.cx };
    const mid = (at[1] + wb.y) / 2;
    tail = [add([at, [at[0], mid], [wb.cx, mid], [wb.cx, wb.y]], tail)];
    tail = ring(wb, 22, tail);
    at = [wb.cx, wb.b];
  }

  // 2. Into the top of the first row of business cards. Their top edges join into one rail, so the
  //    water runs along it from card to card, then down both sides of each card.
  if (bizHead && cards.length) {
    const top = Math.min(...cards.map((c) => c.y));
    const row = cards.map((c, i) => ({ c, i })).filter(({ c }) => c.y - top < 4).sort((a, b) => a.c.x - b.c.x);
    const rk = Math.min(radius(cardEls[0]), 24);
    const ends: number[][] = cards.map(() => []);
    const rings: (number[] | null)[] = cards.map(() => null);
    // Straight down if the heading's words are clear of the pipe; otherwise down a column left of them.
    const straight = clearAt(at[0], at[1], top) && row.some(({ c }) => at[0] > c.x + rk && at[0] < c.r - rk);
    let first = 0, feed: number, ex: number;
    if (straight) {
      first = row.findIndex(({ c }) => at[0] > c.x + rk && at[0] < c.r - rk);
      feed = add([at, [at[0], top]], tail);
      ex = at[0];
    } else {
      const c = row[0].c, col = Math.max(6, Math.min(bizHead.x, c.x) - 10), turn = at[1] + Math.min(28, (top - at[1]) / 3);
      feed = add([at, [at[0], turn], [col, turn], [col, c.y + rk], [c.x, c.y + rk]], tail);
      ex = c.x + rk + 2;
    }
    rings[row[first].i] = ring(row[first].c, rk, [feed], ex);
    // Spread out along the rail from the fed card: to the right, then to the left.
    const along = (k: number, dir: 1 | -1) => {
      const prev = row[k - dir], cur = row[k];
      const pr = rings[prev.i]!, half = dir > 0 ? pr[1] : pr[0];
      const e = Math.min(prev.c.r - rk - 2, Math.max(prev.c.x + rk + 2, prev.k ?? prev.c.cx));
      const startX = dir > 0 ? prev.c.r - rk : prev.c.x + rk, endX = dir > 0 ? cur.c.x + rk + 2 : cur.c.r - rk - 2;
      const link = plan.push({ d: `M${startX} ${cur.c.y} H${endX}`, after: [], from: [half, Math.abs(startX - e)] }) - 1;
      rings[cur.i] = ring(cur.c, rk, [link], endX);
      (cur as { k?: number }).k = endX;
    };
    (row[first] as { k?: number }).k = ex;
    for (let k = first + 1; k < row.length; k++) along(k, 1);
    for (let k = first - 1; k >= 0; k--) along(k, -1);
    // Lower rows (phones): each card is fed from the bottom of the card above it.
    cards.forEach((c, i) => {
      if (rings[i]) { ends[i] = rings[i]!; return; }
      const above = cards.map((o, j) => ({ o, j })).filter(({ o, j }) => rings[j] && o.b <= c.y + 2 && Math.abs(o.cx - c.cx) < c.w / 2).sort((a, b) => b.o.b - a.o.b)[0];
      if (!above) return;
      const f = add([[above.o.cx, above.o.b], [c.cx, c.y]], ends[above.j]);
      ends[i] = rings[i] = ring(c, rk, [f]);
    });
    // Carry on from the bottom card nearest the middle.
    const lowest = Math.max(...cards.map((c, i) => (rings[i] ? c.b : 0)));
    const pick = cards.map((c, i) => ({ c, i })).filter(({ c, i }) => rings[i] && lowest - c.b < 4).sort((a, b) => Math.abs(a.c.cx - W / 2) - Math.abs(b.c.cx - W / 2))[0];
    at = [pick.c.cx, pick.c.b];
    tail = ends[pick.i];
  }

  // 3. Then on down the page, around each panel in turn.
  for (const [bx, el] of [[build, buildEl], [kase, kaseEl], [charity, charEl]] as const) {
    if (!bx || bx.y - at[1] < 24) continue;
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
