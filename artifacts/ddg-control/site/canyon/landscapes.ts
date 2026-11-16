/**
 * The shape of the land behind the home page: `heightAt(x, z)` gives the height of the ground.
 * A low valley runs along x = 0, so the river (surface at about 4.5) flows down the middle,
 * under the orb, towards the camera at +z.
 */

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
/** 0 on the centre line, rising to 1 at `width` away from it. */
const side = (x: number, width: number, power: number) => Math.min(1, Math.pow(Math.abs(x) / width, power));

/** A noisy canyon that opens out from a narrow floor. Its walls are full height in the distance
 *  and lower near the camera, so the foreground stays open. */
export function heightAt(x: number, z: number): number {
  const v = side(x, 24, 1.7) * (0.45 + 0.55 * step(25, -45, z)) * 0.72;
  const h = (fbm(x * 0.045, z * 0.045) - 0.55) * 26 * (0.12 + v) + v * 11;
  // A low shelf either side keeps the river in its bed where the walls are at their lowest.
  return Math.max(h, step(9, 16, Math.abs(x)) * 7 - 1.2);
}
