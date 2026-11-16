/**
 * The pipes down the home page. The river on the first screen is the AI core's power; below it,
 * that same water runs through glass pipes from one part of the page to the next, so it reads
 * as the core feeding everything beneath it.
 *
 * Each pipe is a glass tube that fills with water as the visitor scrolls down to it, with light
 * glinting along the flow. They are drawn into one SVG behind the page from the live positions
 * of the sections, so they follow any layout (PC or phone) and redraw when it changes.
 */

const R = 18; // corner radius

/** Down from (x1,y1) to a bus at yb, across to x2, then down to y2, with rounded corners. */
function route(x1: number, y1: number, yb: number, x2: number, y2: number): string {
  if (Math.abs(x2 - x1) < 1) return `M${x1} ${y1} V${y2}`;
  const s = x2 > x1 ? 1 : -1;
  const r = Math.min(R, Math.abs(x2 - x1) / 2, (yb - y1) / 2, (y2 - yb) / 2);
  return `M${x1} ${y1} V${yb - r} Q${x1} ${yb} ${x1 + s * r} ${yb} H${x2 - s * r} Q${x2} ${yb} ${x2} ${yb + r} V${y2}`;
}

/** Work out where the pipes go and draw them. Call again whenever the page's layout changes. */
export function drawPipes(page: HTMLElement, svg: SVGSVGElement): void {
  const p = page.getBoundingClientRect();
  const box = (el: Element | null) => {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: r.left - p.left, y: r.top - p.top, w: r.width, h: r.height, r: r.right - p.left, b: r.bottom - p.top, cx: r.left - p.left + r.width / 2 };
  };
  const q = (sel: string) => box(page.querySelector(sel));
  const W = page.clientWidth, H = page.scrollHeight;
  const clampX = (x: number) => Math.min(W - 20, Math.max(20, x));
  const out: string[] = [], ports: string[] = [];
  let n = 0;
  // One pipe: the glass, the water (drawn only as far as it has filled), and glints that show only on the water.
  const pipe = (x1: number, y1: number, x2: number, y2: number, yb = (y1 + y2) / 2) => {
    if (y2 - y1 < 28) return;
    const a = clampX(x1), b = clampX(x2), d = route(a, y1, yb, b, y2), id = `cn-pipe-${n++}`;
    out.push(
      `<g class="pipe" data-y0="${y1}" data-y1="${y2}">` +
      `<path class="wall" d="${d}"/><path class="hollow" d="${d}"/>` +
      `<path class="water fill" pathLength="1" d="${d}"/>` +
      `<mask id="${id}" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><path class="fill" pathLength="1" d="${d}" stroke="#fff" stroke-width="9" fill="none" stroke-linecap="round"/></mask>` +
      `<g mask="url(#${id})"><path class="glint" d="${d}"/><path class="glint slow" d="${d}"/></g>` +
      `<path class="shine" d="${d}"/></g>`);
    ports.push(`<circle class="port" cx="${a}" cy="${y1}" r="8"/><circle class="port" cx="${b}" cy="${y2}" r="8"/>`);
  };

  const workHead = q('#work .cn-head'), reel = q('#work .s-work'), bizHead = q('#businesses h2');
  const cards = [...page.querySelectorAll('#businesses .s-card')].map((c) => box(c)!);
  const build = q('#build'), kase = q('.s-case'), charity = q('#charity');

  // 1. From the river on the first screen, down into "Our work".
  if (workHead) pipe(W / 2, 6, workHead.cx, workHead.y - 16);
  // 2. Our work feeds the businesses.
  if (reel && bizHead) pipe(reel.cx, reel.b + 14, bizHead.x + 10, bizHead.y - 16);
  // 3. One branch to each business.
  if (bizHead && cards.length) {
    const top = Math.min(...cards.map((c) => c.y));
    for (const c of cards) if (c.y - top < 4) pipe(bizHead.x + 10, bizHead.b + 10, c.cx, c.y - 10, bizHead.b + 10 + (top - bizHead.b - 20) / 2);
  }
  // 4. Then on down the page: Build, how it connects, giving back.
  const grid = q('#businesses .s-grid');
  if (grid && build) pipe(grid.cx, grid.b + 12, build.x + 10, build.y - 16);
  if (build && kase) pipe(build.x + 10, build.b + 12, kase.x + 34, kase.y - 10);
  if (kase && charity) pipe(kase.cx, kase.b + 10, charity.cx, charity.y - 10);

  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.style.height = `${H}px`;
  svg.innerHTML = out.join('') + ports.join('');
}

/** Fill each pipe as far as the visitor has scrolled: the water front sits 70% down the screen. */
export function fillPipes(page: HTMLElement, svg: SVGSVGElement): void {
  const front = window.innerHeight * 0.7 - page.getBoundingClientRect().top;
  svg.querySelectorAll<SVGGElement>('.pipe').forEach((g) => {
    const y0 = Number(g.dataset.y0), y1 = Number(g.dataset.y1);
    const full = Math.min(1, Math.max(0, (front - y0) / (y1 - y0)));
    g.style.setProperty('--full', String(full));
    g.classList.toggle('dry', full <= 0);
  });
}
