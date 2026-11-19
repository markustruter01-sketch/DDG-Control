import { BufferAttribute, BufferGeometry, Mesh, ShaderMaterial, Vector3 } from 'three';
import { heightAt } from './landscapes';

/**
 * The land beyond the canyon (Markus, 19 Nov): when the camera pulls back while the orb is held, the
 * old grid's edges showed. This is a much bigger ground round it: it starts exactly where the canyon's
 * grid ends, carries on as a wide rolling plain with the same grid lines, and rises into big mountains
 * far away. The plain fades into the night like the canyon; the mountains stay as dark shapes against
 * the sky, so the world looks endless.
 *
 * The grid lines here are drawn by the shader (every SPACING units of ground), so they match the
 * canyon's lines without needing a vertex at every crossing.
 */

// The canyon grid's edges (Stage.tsx: W = 200, D = 470, Z0 = 150). This ground is cut out inside them.
export const INNER = { x: 100, zNear: 150, zFar: -320 };
const SPACING = 1.84;

const hash = (x: number, y: number) => { const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return s - Math.floor(s); };
const sm = (t: number) => t * t * (3 - 2 * t);
function noise(x: number, y: number) {
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
  const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
  const u = sm(xf), w = sm(yf);
  return a + (b - a) * u + (c - a) * w + (a - b - c + d) * u * w;
}
const fbm = (x: number, y: number, n = 5) => { let v = 0, amp = 1, f = 1; for (let i = 0; i < n; i++) { v += amp * noise(x * f, y * f); amp *= 0.5; f *= 2.03; } return v; };
/** Sharp mountain ridges (0 to about 1.3). */
const ridges = (x: number, y: number) => { let v = 0, amp = 0.6, f = 1; for (let i = 0; i < 5; i++) { v += amp * (1 - Math.abs(noise(x * f, y * f) * 2 - 1)); amp *= 0.5; f *= 2.1; } return v; };

/** How far a point is outside the canyon's grid (0 inside). */
const outside = (x: number, z: number) => Math.hypot(Math.max(0, Math.abs(x) - INNER.x), Math.max(0, z - INNER.zNear, INNER.zFar - z));

/** Ground height beyond the canyon: the canyon's own shape at its edge, easing into a low rolling plain,
 *  then a ring of mountains from about 1000 out (`mountains` scales their height). */
export function worldHeight(x: number, z: number, mountains: number) {
  const out = outside(x, z);
  const edge = Math.exp(-out / 60);
  const plain = 3 + (fbm(x * 0.008, z * 0.008, 4) - 0.9) * 10;
  let h = heightAt(x, z) * edge + plain * (1 - edge);
  // Mountains on a big ring round the scene, highest straight ahead and to the sides, lower behind the camera.
  const r = Math.hypot(x, z + 120);
  const ring = sm(Math.min(1, Math.max(0, (r - 1000) / 700)));
  if (ring > 0) {
    const ahead = 0.55 + 0.45 * Math.max(0, -(z + 120) / r);
    h += ring * ahead * mountains * 95 * (0.25 + ridges(x * 0.0042, z * 0.0042)) * (0.6 + 0.4 * fbm(x * 0.002 + 9, z * 0.002, 3) / 1.9);
  }
  return h;
}

/** Grid coordinates along one axis: fine next to the canyon's edges, coarser further away. */
function axis(lo: number, hi: number, innerLo: number, innerHi: number, fine: number, coarse: number, inside: number) {
  const out = new Set<number>([lo, hi, innerLo, innerHi]);
  for (let v = innerLo; v > innerLo - 260 && v > lo; v -= fine) out.add(v);
  for (let v = innerHi; v < innerHi + 260 && v < hi; v += fine) out.add(v);
  for (let v = innerLo - 260; v > lo; v -= coarse) out.add(v);
  for (let v = innerHi + 260; v < hi; v += coarse) out.add(v);
  for (let v = innerLo; v < innerHi; v += inside) out.add(v);
  return [...out].sort((a, b) => a - b);
}

const VERT = /* glsl */ `
varying vec3 vW; varying float vDist;
void main() { vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; vec4 mv = viewMatrix * w; vDist = -mv.z; gl_Position = projectionMatrix * mv; }`;
const FRAG = /* glsl */ `
uniform float uFogNear; uniform float uFogFar; uniform vec3 uFog; uniform float uLines; uniform vec4 uInner; uniform float uSpacing;
varying vec3 vW; varying float vDist;
void main() {
  // The canyon's own grid covers this part: cut it out (with a hair of overlap under the canyon's edge).
  if (abs(vW.x) < uInner.x - 0.4 && vW.z < uInner.y - 0.4 && vW.z > uInner.z + 0.4) discard;
  vec2 g = vW.xz / uSpacing, fw = fwidth(g);
  vec2 cell = abs(fract(g - 0.5) - 0.5) / max(fw, 1e-4);
  float line = 1.0 - min(min(cell.x, cell.y), 1.0);
  line *= 1.0 - smoothstep(0.25, 0.9, max(fw.x, fw.y)); // far away the lines would blur into grey: fade them out
  float fog = smoothstep(uFogNear, uFogFar, vDist);
  // Mountains (high ground) never fully fade: they stay as dark shapes against the sky.
  float high = smoothstep(15.0, 70.0, vW.y);
  float fogK = fog * (1.0 - 0.45 * high);
  vec3 ground = vec3(0.027, 0.035, 0.059);
  vec3 lineCol = vec3(0.42, 0.78, 0.94);
  vec3 col = mix(ground, lineCol, line * uLines * (1.0 - fog));
  gl_FragColor = vec4(mix(col, uFog, fogK), 1.0);
}`;

export function makeWorld(small: boolean, fogColor: number) {
  // Fewer points than first built (19 Nov speed pass): about 40% less work at load, same look through the fog.
  const fine = small ? 12 : 8, coarse = small ? 75 : 50, inside = 40;
  const xs = axis(-2600, 2600, -INNER.x, INNER.x, fine, coarse, inside);
  const zs = axis(-3000, 1500, INNER.zFar, INNER.zNear, fine, coarse, inside);
  const nx = xs.length, nz = zs.length;
  const pos = new Float32Array(nx * nz * 3);
  const uniforms = {
    uFogNear: { value: 30 }, uFogFar: { value: 150 }, uLines: { value: 0.34 }, uSpacing: { value: SPACING },
    uInner: { value: new Vector3(INNER.x, INNER.zNear, INNER.zFar) },
    uFog: { value: new Vector3(((fogColor >> 16) & 255) / 255, ((fogColor >> 8) & 255) / 255, (fogColor & 255) / 255) },
  };
  const geo = new BufferGeometry();
  const idx: number[] = [];
  for (let j = 0; j < nz - 1; j++) for (let i = 0; i < nx - 1; i++) {
    const a = j * nx + i, b = a + 1, c = a + nx, d = c + 1;
    idx.push(a, c, b, b, c, d);
  }
  geo.setAttribute('position', new BufferAttribute(pos, 3));
  geo.setIndex(idx);
  let built = -1;
  /** (Re)build the heights; `mountains` 0 = flat plain, 1 = default mountains. */
  const build = (mountains: number) => {
    if (mountains === built) return;
    built = mountains;
    for (let j = 0, k = 0; j < nz; j++) for (let i = 0; i < nx; i++, k++) {
      const x = xs[i]!, z = zs[j]!;
      pos[k * 3] = x; pos[k * 3 + 1] = worldHeight(x, z, mountains) - (outside(x, z) < 0.01 ? 0.05 : 0); pos[k * 3 + 2] = z;
    }
    geo.attributes.position!.needsUpdate = true;
    geo.computeBoundingSphere();
  };
  build(1);
  const mat = new ShaderMaterial({ uniforms, vertexShader: VERT, fragmentShader: FRAG });
  const mesh = new Mesh(geo, mat);
  mesh.frustumCulled = false;
  /** Match the canyon's fog and line brightness each frame. */
  const update = (fogNear: number, fogFar: number, lines: number, mountains: number) => {
    uniforms.uFogNear.value = fogNear; uniforms.uFogFar.value = fogFar; uniforms.uLines.value = lines;
    build(Math.round(mountains * 20) / 20);
  };
  return { mesh, update, disposables: [geo, mat] as { dispose: () => void }[] };
}
