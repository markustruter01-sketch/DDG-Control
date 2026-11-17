import { box, clock, globe, part, stroke, text, type Ctx, type Scene, type Station } from './inkfx';

// The systems on the home page, drawn as plain white line parts with one drop of ink flowing through
// them. All scenes are 760 × 300 units. Words are labels only; nothing here is a live number.

const W = 760, H = 300;

// ── What we are: your idea → our AI-powered build → the platform you need ──────────────────
export const ABOUT_SCENE: Scene = {
  w: W, h: H, speed: 330,
  stations: [
    { id: 'idea', x: 120, y: 132, draw: part('M100 128a24 24 0 1 1 40 18v14h-20v-14a24 24 0 0 1-20-18z M122 172h16 M124 180h12', ['YOUR IDEA', 130, 214]) },
    { id: 'ai', x: 350, y: 150, draw: (c, t, on) => {
      part('M396 150a46 46 0 1 1 -92 0a46 46 0 1 1 92 0z', ['AI-POWERED BUILD', 350, 226])(c, t, on);
      c.setLineDash([2, 4]); stroke(c, 'M414 150a64 64 0 1 1 -128 0a64 64 0 1 1 128 0z', 0.2); c.setLineDash([]);
      text(c, 'AI', 350, 154, 0.85 + 0.15 * on, 'center', 12);
    } },
    { id: 'web', x: 540, y: 66, draw: part(`${box(500, 50, 84, 32, 5)} M500 60h84`, ['WEBSITE', 600, 69, 'left']) },
    { id: 'store', x: 540, y: 128, draw: part('M528 112h26l-3 8 4 22h-28l4-22z M531 120h20', ['ONLINE STORE', 600, 131, 'left']) },
    { id: 'platform', x: 540, y: 188, draw: part(`${box(500, 174, 84, 30, 5)} M508 196l12-8 10 3 12-10 12 5 14-8`, ['PLATFORM', 600, 191, 'left']) },
    { id: 'app', x: 540, y: 248, draw: part(`${box(528, 228, 22, 40, 4)} M536 262h6`, ['PHONE APP', 600, 251, 'left']) },
  ],
  route: ['idea', 'ai', 'web', 'ai', 'store', 'ai', 'platform', 'ai', 'app'],
};

// ── DDG Finance: markets → strategies → AI council → brokers → orders with a stop → hourly check ──
const STRAT = ['ATLAS', 'ATLAS V2', 'MOMENTUM', 'FOREX'];
const PRICE: [number, number][] = [[566, 200], [588, 186], [606, 192], [628, 160], [646, 168], [668, 132], [684, 142], [706, 104], [724, 110], [744, 74]];
const STOP = 'M566 214h40v-22h40v-30h40v-34h58';
export const FINANCE_SCENE: Scene = {
  w: W, h: H, speed: 300,
  stations: [
    { id: 'globe', x: 82, y: 146, draw: (c, t, on) => {
      globe(82, 146, 54, ['GLOBAL MARKETS', 82, 226])(c, t, on);
      text(c, 'STOCKS · INDEXES · BONDS', 82, 240, 0.35); text(c, 'GOLD · CRYPTO · FOREX', 82, 252, 0.35);
    } },
    ...STRAT.map((name, i): Station => ({ id: `s${i}`, x: 236, y: 74 + i * 48, draw: part(box(188, 61 + i * 48, 96, 26, 6), [name, 236, 77 + i * 48]) })),
    { id: 'hex', x: 368, y: 146, draw: (c, t, on) => {
      part('M368 110l32 18v36l-32 18-32-18v-36z', ['AI RESEARCH COUNCIL', 368, 206])(c, t, on);
      text(c, 'AI', 368, 150, 0.85, 'center', 11);
    } },
    { id: 'b0', x: 478, y: 112, draw: part(box(436, 99, 84, 26, 6), ['BROKER 1', 478, 115]) },
    { id: 'b1', x: 478, y: 180, draw: part(box(436, 167, 84, 26, 6), ['BROKER 2', 478, 183]) },
    { id: 'chart', x: PRICE[0][0], y: PRICE[0][1], draw: (c, _t, on) => {
      stroke(c, 'M560 56v168h190', 0.35, 1);
      stroke(c, 'M' + PRICE.map((p) => p.join(' ')).join('L'), 0.35 + 0.3 * on, 1);
      c.setLineDash([5, 4]); stroke(c, STOP, 0.55, 1); c.setLineDash([]);
      text(c, 'STOP RISES WITH THE PRICE', 655, 238, 0.45);
    } },
    { id: 'end', x: PRICE[PRICE.length - 1][0], y: PRICE[PRICE.length - 1][1], draw: () => {} },
    { id: 'clock', x: 706, y: 268, draw: clock(706, 268, 18, ['CHECKED HOURLY', 680, 271, 'right']) },
  ],
  // Each loop takes a different strategy and broker, so over time the ink visits every part.
  route: [0, 1, 2, 3].flatMap((i) => ['globe', `s${i}`, 'hex', `b${i % 2}`, 'chart', ...PRICE.slice(1, -1), 'end', 'clock']),
};

// ── DDG Coffee: beans → bag → online store → card checkout → order in DDG Control → packed → your door
export const COFFEE_SCENE: Scene = {
  w: W, h: H, speed: 330,
  stations: [
    { id: 'bean', x: 52, y: 150, draw: part('M52 128c-12 0 -18 12 -16 24s10 20 20 18 14-14 12-26-6-16-16-16z M50 130c-6 10 8 22 2 38', ['BEANS', 52, 200]) },
    { id: 'bag', x: 126, y: 152, draw: (c, t, on) => {
      part('M106 122h40l-4 12 6 56H104l6-56z M110 134h36 M118 160c3-6 15-6 18 0', ['BAG', 126, 208])(c, t, on);
      text(c, '$1 PER BAG → ANIMAL CHARITIES', 126, 96, 0.4);
    } },
    { id: 'store', x: 222, y: 150, draw: part(`${box(192, 88, 60, 124, 7)} M198 104h48v30h-48z M198 142h48v30h-48z M206 190h32`, ['ONLINE STORE', 222, 234]) },
    { id: 'pay', x: 334, y: 152, draw: part(`${box(298, 126, 72, 52, 6)} M298 140h72 M322 162l7 7 14-15`, ['CARD CHECKOUT', 334, 200]) },
    { id: 'ctl', x: 472, y: 150, draw: part('M416 108h112v84H416z M416 122h112 M432 180v-16M448 180v-26M464 180v-20M480 180v-34M496 180v-24M512 180v-40', ['ORDER IN DDG CONTROL', 472, 214]) },
    { id: 'box', x: 590, y: 152, draw: part('M568 138l22-11 22 11v28l-22 11-22-11z M568 138l22 11 22-11 M590 149v28', ['PACKED', 590, 200]) },
    { id: 'door', x: 712, y: 160, draw: part('M692 152l20-18 20 18v28h-40z M706 180v-12h12v12', ['YOUR DOOR', 712, 204]) },
  ],
  route: ['bean', 'bag', 'store', 'pay', 'ctl', 'box', 'door'],
};

// ── DDG Fitness (coming soon): one AI agent travels the world, reaching person after person.
const PEOPLE: [number, number][] = [[318, 104], [404, 84], [452, 140], [430, 206], [356, 214], [306, 168], [372, 140], [420, 120]];
export const FITNESS_SCENE: Scene = {
  w: W, h: H, speed: 280,
  under: (c: Ctx, t: number) => {
    globe(380, 150, 100)(c, t, 0);
    text(c, 'EVERYONE ON EARTH', 40, 40, 0.45, 'left'); text(c, 'AN AI AGENT FOR EACH OF THEM', 720, 40, 0.45, 'right');
    text(c, 'COMING SOON', 380, 284, 0.5);
  },
  stations: PEOPLE.map(([x, y], i): Station => ({ id: `p${i}`, x, y, draw: (c, _t, on) => {
    c.fillStyle = `rgba(255,255,255,${0.45 + 0.55 * on})`; c.beginPath(); c.arc(x, y, 2.6 + 2.5 * on, 0, 7); c.fill();
    if (on > 0.05) { c.strokeStyle = `rgba(255,255,255,${0.5 * on})`; c.lineWidth = 0.8; c.beginPath(); c.arc(x, y, 8 + 10 * (1 - on), 0, 7); c.stroke(); }
  } })),
  route: [0, 1, 7, 2, 3, 4, 6, 5].map((i) => `p${i}`),
};

// ── How we run it: shop, trading and social numbers come into one screen; nine AI employees report in.
const TEAM = Array.from({ length: 9 }, (_, i) => [600 + (i % 3) * 44, 96 + Math.floor(i / 3) * 48] as [number, number]);
export const CONTROL_SCENE: Scene = {
  w: W, h: H, speed: 330,
  under: (c: Ctx) => { text(c, 'NINE AI EMPLOYEES', 644, 252, 0.45); text(c, 'EVERY ACTION CHECKED + UNDOABLE', 644, 266, 0.35); },
  stations: [
    { id: 'shop', x: 66, y: 76, draw: part('M66 62c-8 0-12 8-11 15s7 13 13 12 9-9 8-16-3-11-10-11z', ['SHOP', 66, 112]) },
    { id: 'trade', x: 66, y: 152, draw: part('M48 160l12-10 10 6 16-16', ['TRADING', 66, 184]) },
    { id: 'social', x: 66, y: 238, draw: part('M50 228h32v18H62l-8 6v-6h-4z', ['SOCIALS', 66, 270]) },
    { id: 'screen', x: 360, y: 150, draw: (c, t, on) => {
      part('M250 76h220v148H250z M250 92h220 M262 104h60v40h-60z M330 104h60v40h-60z M398 104h60v40h-60z M262 152h128v60H262z M398 152h60v60h-60z M330 224v18M390 224v18M310 242h100', ['DDG CONTROL · OWNER ONLY', 360, 264])(c, t, on);
      stroke(c, 'M270 200l16-14 14 6 18-20 16 8 18-16 22 4', 0.3);
    } },
    ...TEAM.map(([x, y], i): Station => ({ id: `a${i}`, x, y, draw: (c, _t, on) => {
      stroke(c, `M${x + 10} ${y}a10 10 0 1 1 -20 0a10 10 0 1 1 20 0z`, 0.45 + 0.5 * on);
      c.fillStyle = `rgba(255,255,255,${0.5 + 0.5 * on})`; c.beginPath(); c.arc(x, y, 2.6 + 1.5 * on, 0, 7); c.fill();
    } })),
  ],
  route: ['shop', 'screen', 'a0', 'screen', 'trade', 'screen', 'a4', 'screen', 'social', 'screen', 'a8', 'screen', 'a2', 'screen', 'a6', 'screen'],
};
