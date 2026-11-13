/**
 * Data pipes on the home page: orthogonal glass pipes, top to bottom, linking each part of the
 * page to the next (work reel → at a glance → Coffee → Finance → Fitness → command centre).
 * Drawn into one SVG over the page from the live positions of the elements, so they follow
 * any layout (PC or phone) and redraw when it changes.
 */

const R = 18; // corner radius

/** Down from (x1,y1) to a bus at yb, across to x2, then down to y2, with rounded corners. */
function route(x1: number, y1: number, yb: number, x2: number, y2: number): string {
  if (Math.abs(x2 - x1) < 1) return `M${x1} ${y1} V${y2}`;
  const s = x2 > x1 ? 1 : -1;
  const r = Math.min(R, Math.abs(x2 - x1) / 2, (yb - y1) / 2, (y2 - yb) / 2);
  return `M${x1} ${y1} V${yb - r} Q${x1} ${yb} ${x1 + s * r} ${yb} H${x2 - s * r} Q${x2} ${yb} ${x2} ${yb + r} V${y2}`;
}

export function drawWires(page: HTMLElement, svg: SVGSVGElement): void {
  const p = page.getBoundingClientRect();
  const box = (el: Element | null) => {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: r.left - p.left, y: r.top - p.top, w: r.width, h: r.height, r: r.right - p.left, b: r.bottom - p.top };
  };
  const q = (sel: string) => box(page.querySelector(sel));
  const W = page.clientWidth;
  const clampX = (x: number) => Math.min(W - 20, Math.max(20, x));
  const paths: string[] = [], ports: string[] = [];
  const pipe = (d: string, tint = '') => paths.push(
    `<path class="wall" d="${d}"/><path class="hollow" d="${d}"/><path class="glass" d="${d}"/><path class="shine" d="${d}"/><path class="flow ${tint}" d="${d}"/>`);
  const port = (x: number, y: number) => ports.push(`<circle class="port" cx="${x}" cy="${y}" r="9"/><circle class="port-in" cx="${x}" cy="${y}" r="3.5"/>`);

  // 1. Our work (the reel) feeds the at-a-glance panel.
  const reel = q('.cn-reel'), head = q('#glance .cn-head');
  const figs = [...page.querySelectorAll('.cn-reel figure')].slice(0, 2).map((f) => box(f)!);
  if (reel && head) {
    const yb = (reel.b + head.y) / 2, tx = head.x + 6;
    figs.forEach((f, i) => { const fx = clampX(f.x + f.w / 2); pipe(route(fx, f.b + 6, yb, tx, head.y - 10), i ? 'white' : 'mint'); port(fx, f.b + 6); });
    port(tx, head.y - 10);
  }

  // 2. Inside the panel: each tile hands on to the next, like a circuit.
  const tiles = [...page.querySelectorAll('#glance .cn-tile')].map((t) => box(t)!);
  for (let i = 0; i < tiles.length - 1; i++) {
    const a = tiles[i], b = tiles[i + 1];
    if (Math.abs(a.y - b.y) < 4) pipe(`M${a.r} ${a.y + a.h / 2} H${b.x}`);
    else if (b.y >= a.b - 2 && Math.abs(a.x - b.x) < 4) pipe(`M${a.x + 28} ${a.b} V${b.y}`);
  }

  // 3. Down the businesses to the command centre.
  const last = tiles[tiles.length - 1];
  const coffee = q('#coffee .cn-shot'), finance = q('#finance .cn-shot'), donuts = q('#finance .cn-donuts');
  const fitness = q('#fitness .cn-shot'), fitSec = q('#fitness'), map = q('#connects .cn-map'), mapHead = q('#connects .cn-head');
  const legs: [number, number, number, number, string][] = [];
  if (last && coffee) legs.push([last.x + last.w / 2, last.b + 8, coffee.x + coffee.w * 0.25, coffee.y - 10, 'white']);
  if (coffee && finance) legs.push([coffee.x + coffee.w / 2, coffee.b + 8, finance.x + finance.w / 2, finance.y - 10, 'mint']);
  if (donuts && fitness) legs.push([donuts.x + donuts.w / 2, donuts.b + 30, fitness.x + fitness.w / 2, fitness.y - 10, '']);
  if (fitness && fitSec && map && mapHead) legs.push([fitness.x + fitness.w / 2, Math.max(fitness.b, fitSec.b - 40) + 8, map.x + map.w / 2, mapHead.y - 10, 'violet']);
  for (const [ax, y1, bx, y2, tint] of legs) {
    const x1 = clampX(ax), x2 = clampX(bx);
    if (y2 - y1 < 24) continue;
    pipe(route(x1, y1, (y1 + y2) / 2, x2, y2), tint); port(x1, y1); port(x2, y2);
  }

  svg.setAttribute('viewBox', `0 0 ${W} ${page.scrollHeight}`);
  svg.innerHTML = paths.join('') + ports.join('');
}
