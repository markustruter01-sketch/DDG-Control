/**
 * Shapes for the land behind the home page. Each is a function giving the height of the ground
 * at (x, z). All keep a low valley along x = 0 so the river (surface at about 4.5) runs down the
 * middle, under the orb at (0, 4), towards the camera at +z.
 *
 * WIP: ten trial shapes beside the original canyon, for the owner to choose from. Delete the
 * ones not chosen.
 */

export type Landscape = (x: number, z: number) => number;

const hash = (x: number, y: number) => { const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return s - Math.floor(s); };
const sm = (t: number) => t * t * (3 - 2 * t);
const step = (a: number, b: number, v: number) => sm(Math.min(1, Math.max(0, (v - a) / (b - a))));
/** Smooth noise, 0 to 1. */
function noise(x: number, y: number) {
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
  const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
  const u = sm(xf), w = sm(yf);
  return a + (b - a) * u + (c - a) * w + (a - b - c + d) * u * w;
}
/** Five layers of noise, about 0.3 to 1.6. */
function fbm(x: number, y: number) { let v = 0, amp = 1, f = 1; for (let i = 0; i < 5; i++) { v += amp * noise(x * f, y * f); amp *= 0.5; f *= 2.03; } return v; }
/** Noise folded into sharp ridges, 0 to 1. */
function ridged(x: number, y: number) { let v = 0, amp = 0.5, f = 1; for (let i = 0; i < 4; i++) { const n = 1 - Math.abs(2 * noise(x * f, y * f) - 1); v += amp * n * n; amp *= 0.5; f *= 2.1; } return v / 0.94; }
/** 0 on the centre line, rising to 1 at `width` away from it. */
const side = (x: number, width: number, power: number) => Math.min(1, Math.pow(Math.abs(x) / width, power));
/** The river bed: gently uneven, always under the water. */
const bed = (x: number, z: number) => (fbm(x * 0.045, z * 0.045) - 0.55) * 3.1;
const ORB_Z = 4;

/** The original: a noisy canyon that opens out from a narrow floor. */
const canyon: Landscape = (x, z) => {
  const v = side(x, 24, 1.7);
  return (fbm(x * 0.045, z * 0.045) - 0.55) * 26 * (0.12 + v) + v * 11;
};

/** Sheer walls cut into flat steps, like quarried rock. */
const gorge: Landscape = (x, z) => {
  const wall = side(Math.max(0, Math.abs(x) - 7 + 3 * noise(z * 0.07, 3.3)), 30, 0.75) * (9 + 12 * fbm(x * 0.028, z * 0.028));
  const t = wall / 3.2, whole = Math.floor(t);
  return bed(x, z) + (whole + step(0.7, 1, t - whole)) * 3.2;
};

/** Tall, sharp mountain ridges either side of a V-shaped valley. */
const alpine: Landscape = (x, z) => bed(x, z) + side(x, 26, 1.25) * (7 + 40 * ridged(x * 0.03, z * 0.03));

/** The canyon, but beyond the orb the river snakes from side to side into the distance. */
const meander: Landscape = (x, z) => {
  const xc = x - 15 * step(0, 45, ORB_Z - z) * Math.sin((z - ORB_Z) * 0.05), v = side(xc, 20, 1.7);
  return (fbm(xc * 0.045, z * 0.045) - 0.55) * 26 * (0.12 + v) + v * 12;
};

/** Smooth, rolling dunes in long diagonal waves. */
const dunes: Landscape = (x, z) =>
  bed(x, z) * 0.5 + side(x, 15, 2) * (9.5 + 4 * Math.sin(x * 0.15 + z * 0.085 + 5 * noise(x * 0.02, z * 0.02)) + 3 * Math.sin(x * 0.05 - z * 0.04) + 3 * noise(x * 0.05, z * 0.05));

/** A flat plain with flat-topped rock towers standing on it. */
const mesas: Landscape = (x, z) => {
  const tower = step(0.6, 0.65, noise(x * 0.045 + 9, z * 0.045)) * step(14, 20, Math.abs(x)) * step(30, 12, z) * (12 + 12 * noise(x * 0.012, z * 0.012 + 4));
  return bed(x, z) * 0.5 + side(x, 11, 3) * 7.5 + tower;
};

/** Square blocks of different heights, like a city or a bar chart. */
const blocks: Landscape = (x, z) => {
  const CELL = 9, cx = Math.floor(x / CELL), cz = Math.floor(z / CELL), mid = (cx + 0.5) * CELL;
  if (Math.abs(mid) < CELL) return bed(x, z) * 0.4;
  return 7 + Math.round(hash(cx, cz) * side(mid, 70, 0.8) * 34 / 3.5) * 3.5;
};

/** The orb floats over a wide round lake inside a crater; the river runs in through a gap at the back. */
const crater: Landscape = (x, z) => {
  const d = Math.hypot(x, z - ORB_Z), gap = z < ORB_Z ? side(x, 7, 2.2) : 1;
  const rim = 20 * Math.exp(-((d - 50) * (d - 50)) / 90) * (0.75 + 0.6 * noise(x * 0.07, z * 0.07));
  return bed(x, z) * 0.5 + gap * (rim + step(46, 58, d) * (8 + 5 * fbm(x * 0.03, z * 0.03)));
};

/** Wide water between high, far-apart walls, with a few rock islands. */
const fjord: Landscape = (x, z) => {
  const wall = step(17, 32, Math.abs(x) + 9 * (fbm(z * 0.02, 1.7) - 0.9));
  const island = step(0.62, 0.72, noise(x * 0.055 + 3, z * 0.055)) * step(7, 11, Math.abs(x)) * (1 - wall) * 7;
  return bed(x, z) * 0.5 + wall * (20 + 22 * fbm(x * 0.022, z * 0.022)) + island;
};

/** Low banks covered in thin, sharp spires. */
const needles: Landscape = (x, z) =>
  bed(x, z) * 0.4 + side(x, 10, 2.5) * 7 + side(x, 18, 2) * Math.pow(noise(x * 0.085, z * 0.085), 8) * 190;

/** The land itself ripples outwards from the orb in rings, as if frozen mid-shockwave. */
const shockwave: Landscape = (x, z) => {
  const d = Math.hypot(x, z - ORB_Z);
  return bed(x, z) * 0.3 + side(x, 9, 2) * (7 + d * 0.075 + 3.2 * Math.sin(d * 0.42));
};

export const LANDSCAPES = { canyon, gorge, alpine, meander, dunes, mesas, blocks, crater, fjord, needles, shockwave } satisfies Record<string, Landscape>;
export type LandscapeKey = keyof typeof LANDSCAPES;
