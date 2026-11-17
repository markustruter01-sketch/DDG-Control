import {
  BufferAttribute, BufferGeometry, DoubleSide, DynamicDrawUsage, InstancedMesh, Mesh, Object3D, ShaderMaterial, SphereGeometry,
  Vector2, Vector3,
} from 'three';
import { SKY_GLSL } from './sky';

/**
 * The river on the valley floor, and the splashes the air orb throws up from it.
 *
 * River: a sheet of water at one level, laid on the same grid as the land, so the shader knows
 * exactly how deep the water is at every point and can fade it out softly where it meets a bank.
 * It is shaded like real water at night: a near-glassy surface with slow swells that travel towards the camera (down
 * the valley), a surface that mirrors the night sky (see sky.ts) and the glow of the orb, colour that goes
 * from teal in the shallows to near-black in the deep middle, and foam along the banks.
 * Under the orb the water is pressed into a wide dish and dragged round in spiral arms,
 * clockwise seen from above, the same way the orb spins. The arms fade to nothing at the very
 * centre, so they do not meet in a point there.
 * Splashes: beads of water flung out from under the orb, falling back under gravity; the
 * furthest land on the banks.
 */

// Shared by both shaders: how strongly the orb stirs the water at a distance d, and the spiral arms.
const STIR = /* glsl */ `
uniform float uTime;
uniform float uStir;
uniform vec2 uOrb;
float stirAt(float d) { return uStir * exp(-d * d / 220.0); }
uniform float uVar;
uniform float uSwirlR, uSwirlDepth, uSwirlSpeed;
// Preview water designs 1-4 (0 = the current swirl). Each is a round dent pushed into the water by
// the orb's air, with a different kind of spin inside it.
float bowl(float d, float r, float depth) { return -depth * exp(-d * d / (r * r)); }
float shapeH0(vec2 q, float d, float tt) {
  float a = atan(q.y, q.x + 0.0001);
  if (uVar < 1.5) return bowl(d, 3.2, 1.1) + 0.07 * sin(a * 4.0 + d * 1.6 - tt * 6.0) * exp(-d * d / 16.0);
  if (uVar < 2.5) return bowl(d, 4.0, 1.7) + 0.13 * sin(a * 3.0 + d * 2.6 - tt * 7.0) * exp(-d * d / 22.0) * smoothstep(0.4, 2.0, d);
  if (uVar < 3.5) return bowl(d, 2.7, 1.0) + 0.32 * exp(-(d - 3.7) * (d - 3.7) / 0.9) + 0.035 * sin(d * 4.0 - tt * 5.0) * exp(-d * d / 45.0) * smoothstep(4.2, 5.2, d);
  return bowl(d, 3.6, 0.65) + 0.02 * sin(a * 2.0 + d * 0.9 - tt * 2.5) * exp(-d * d / 18.0); // only a soft, broad lean; the swirl detail is in vortex()
}
float shapeH(vec2 q, float d) { return uSwirlDepth * shapeH0(q, d / uSwirlR, uTime * uSwirlSpeed); }
float shapeFoam0(vec2 q, float d, float lace, float tt) {
  float a = atan(q.y, q.x + 0.0001);
  if (uVar < 1.5) return smoothstep(0.55, 1.0, sin(a * 4.0 + d * 1.6 - tt * 6.0)) * exp(-d * d / 14.0) * (0.4 + lace);
  if (uVar < 2.5) return smoothstep(0.4, 1.0, sin(a * 3.0 + d * 2.6 - tt * 7.0)) * exp(-d * d / 18.0) * smoothstep(0.4, 1.6, d) * (0.5 + lace);
  if (uVar < 3.5) return exp(-(d - 3.6) * (d - 3.6) / 0.6) * (0.25 + 1.3 * lace) + 0.3 * smoothstep(0.7, 1.0, sin(a * 5.0 + d * 1.2 - tt * 6.0)) * exp(-d * d / 6.0) * lace;
  return 0.0; // silk: soft foam comes from vortex() instead of lines
}
float shapeFoam(vec2 q, float d, float lace) { return shapeFoam0(q, d / uSwirlR, lace, uTime * uSwirlSpeed); }
float swirl(vec2 q, float d, float arms, float wind, float speed) {
  return sin(arms * atan(q.y, q.x + 0.0001) + d * wind - uTime * speed) * smoothstep(1.5, 6.5, d);
}`;

export const WATER_VERT = /* glsl */ `
attribute float aBed;
${STIR}
uniform float uFlat;
varying vec2 vP;
varying vec3 vWorld;
varying float vView;
varying float vBed;
void main() {
  vec3 p = position;
  vec2 q = p.xz - uOrb;
  float d = length(q);
  float dish = -0.9 * uStir * exp(-d * d / 40.0);
  float arms = 0.55 * swirl(q, d, 3.0, 0.9, 5.0) + 0.3 * swirl(q, d, 2.0, 0.35, 2.6);
  float swell = 0.05 * sin(p.z * 0.3 + p.x * 0.2 + uTime * 1.6);
  float lift = uVar > 0.5 ? uStir * shapeH(q, d) + swell : dish + stirAt(d) * arms + swell;
  p.y += lift;
  vP = p.xz;
  vBed = (aBed + lift) * max(uFlat, 0.45); // the river keeps some depth when the land lies flat, so it stays visible
  vec4 world = modelMatrix * vec4(p, 1.0);
  vWorld = world.xyz;
  vec4 mv = viewMatrix * world;
  vView = -mv.z;
  gl_Position = projectionMatrix * mv;
}`;

export const WATER_FRAG = /* glsl */ `
${STIR}
uniform float uRough, uDetailK, uFoamK, uGlintK, uReflect, uBody, uSilk, uSwirlLines, uSwirlSoft;
${SKY_GLSL}
uniform float uGlow;
uniform float uOpacity;
uniform float uFogNear;
uniform float uFogFar;
uniform vec3 uOrbPos;
uniform vec3 uFog;
varying vec2 vP;
varying vec3 vWorld;
varying float vView;
varying float vBed;
// Simplex noise (Ian McEwan, Ashima Arts, MIT licence). Smooth in every direction, so the water
// shows no square cells the way grid-based noise does.
vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m; m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 a0 = x - floor(x + 0.5);
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
vec2 turn(vec2 p, float a) { float c = cos(a), s = sin(a); return vec2(c * p.x - s * p.y, s * p.x + c * p.y); }
// Silk swirl: the water's own pattern is twisted round the dent (more twist near the middle) and the
// whole twist turns slowly. The twist is a fixed amount, so the streaks never wind up tighter and
// tighter over time (that was what filled it with fine rings).
vec2 vortexUV(vec2 q, float d) {
  float dn = d / uSwirlR, spin = uTime * uSwirlSpeed * 0.9 + 2.2 * uSwirlLines * exp(-dn * dn / 9.0);
  float c = cos(spin), s = sin(spin);
  return vec2(c * q.x - s * q.y, s * q.x + c * q.y) / uSwirlR;
}
float vortex(vec2 q, float d) {
  vec2 r = vortexUV(q, d);
  float dn = d / uSwirlR;
  return (0.6 * snoise(r * vec2(0.45, 0.25) / uSwirlSoft) + 0.4 * snoise(r * 0.9 / uSwirlSoft + 3.7)) * exp(-dn * dn / 12.0);
}
// Height of the surface detail. Slow swells ride the current, which runs towards +z
// (the camera); near the orb they are bent round it and the spiral arms are added.
float surface(vec2 p, float detail) {
  vec2 q = p - uOrb;
  float d = length(q), stir = stirAt(d);
  vec2 f = uOrb + turn(q, -1.1 * stir);
  f.y -= uTime * 4.0;
  // Away from the orb the water is close to glass: long, low swells moving with the current, a few
  // gentle wave trains crossing it, and two faint layers of fine ripples drifting in different
  // directions (blended, they never repeat and never look like a pattern).
  // Preview styles: how much surface texture each one keeps (1 = today's water).
  float rough = uVar < 0.5 ? 1.0 : uVar < 1.5 ? 0.18 : uVar < 2.5 ? 0.45 : uVar < 3.5 ? 0.08 : 0.345;
  rough *= uRough;
  detail *= (uVar > 0.5 ? (uVar > 3.5 ? 0.15 : 0.0) : 1.0) * uDetailK;
  float h = 0.16 * rough * snoise(f * vec2(0.11, 0.055));
  h += 0.045 * rough * snoise(f * vec2(0.26, 0.14) + vec2(3.1, -uTime * 0.25));
  h += rough * (0.035 * sin(dot(p, vec2(0.21, 0.43)) - uTime * 1.1) + 0.022 * sin(dot(p, vec2(-0.37, 0.29)) - uTime * 1.45) + 0.014 * sin(dot(p, vec2(0.52, -0.18)) - uTime * 1.9));
  h += detail * (0.009 * snoise(p * 0.9 + vec2(uTime * 0.21, -uTime * 0.33)) + 0.007 * snoise(p * 1.6 + vec2(-uTime * 0.29, -uTime * 0.17) + 7.3));
  if (uVar > 3.5) h += 0.07 * uStir * uSwirlDepth * vortex(q, d);
  h += uVar > 0.5 ? 0.6 * uStir * shapeH(q, d) : stir * (0.42 * swirl(q, d, 3.0, 0.9, 5.0) + 0.05 * swirl(q, d, 7.0, 2.2, 9.0));
  return h;
}
void main() {
  if (vBed <= 0.0) discard;
  // Far away the finest ripples are smaller than a pixel, so they are faded out there.
  float detail = 1.0 - smoothstep(20.0, 80.0, vView);
  float e = 0.12, h0 = surface(vP, detail);
  vec3 n = normalize(vec3(-(surface(vP + vec2(e, 0.0), detail) - h0) / e, 1.0, -(surface(vP + vec2(0.0, e), detail) - h0) / e));
  vec3 v = normalize(cameraPosition - vWorld);
  vec3 r = reflect(-v, n);
  float fresnel = clamp((0.03 + 0.97 * pow(1.0 - max(dot(n, v), 0.0), 5.0)) * uReflect, 0.0, 1.0);

  // What the surface mirrors: the real sky above it (stars and Milky Way, a little brighter than
  // life so they read on the water), a soft lift towards the horizon, and the orb's glow.
  vec3 sky = skyColor(normalize(vec3(r.x, abs(r.y) + 0.02, r.z))) * 1.7 + vec3(0.07, 0.12, 0.2) * (1.0 - smoothstep(0.0, 0.4, r.y));
  vec3 toOrb = normalize(uOrbPos - vWorld);
  float aim = max(dot(r, toOrb), 0.0);
  sky += vec3(0.75, 0.92, 1.0) * uGlow * (pow(aim, 70.0) * 1.6 + pow(aim, 12.0) * 0.4);

  // What shows through: teal over the shallows, near-black where it is deep. The orb lights it a little.
  float depth = vBed;
  vec3 body = mix(vec3(0.05, 0.3, 0.36), vec3(0.004, 0.03, 0.07), 1.0 - exp(-depth * 0.6)) * uBody;
  float reach = uGlow * exp(-length(uOrbPos.xz - vWorld.xz) / 16.0);
  body *= 0.75 + 1.3 * max(dot(n, toOrb), 0.0) * reach;
  // Light passing through: shallows glow faintly, with soft moving light-lines on the bed.
  float shallow = exp(-depth * 1.1);
  float caust = pow(0.5 + 0.5 * snoise(vP * 0.7 + vec2(uTime * 0.18, -uTime * 0.4)), 6.0) + pow(0.5 + 0.5 * snoise(vP * 1.1 - vec2(uTime * 0.23, uTime * 0.31) + 4.0), 6.0);
  body += vec3(0.1, 0.32, 0.34) * caust * shallow * 0.35 * (0.4 + reach) * (uVar > 0.5 && uVar < 1.5 ? 0.0 : 1.0);
  vec3 col = mix(body, sky, fresnel);
  // The orb as a light: a tight, bright glint on the water under it and a softer sheen round that.
  vec3 hv = normalize(toOrb + v);
  float nh = max(dot(n, hv), 0.0);
  col += vec3(0.8, 0.93, 1.0) * uGlow * (pow(nh, 420.0) * 2.2 + pow(nh, 64.0) * 0.18) * uGlintK * exp(-length(uOrbPos.xz - vWorld.xz) / 30.0);

  // Foam: along the banks (more where the orb throws water at them), and on the spiral arms.
  vec2 q = vP - uOrb;
  float d = length(q), stir = stirAt(d);
  float lace = (0.5 + 0.5 * snoise(vP * 0.55 + vec2(0.0, -uTime * 1.3))) * (0.5 + 0.5 * snoise(vP * 1.5 + vec2(1.3, -uTime * 2.0)));
  float shore = (1.0 - smoothstep(0.0, 0.5, depth)) * smoothstep(0.14, 0.36, lace) * (0.3 + 1.8 * stir);
  float churn = uVar > 0.5 ? uStir * shapeFoam(q, d, lace) : stir * 1.15 * smoothstep(0.25, 1.0, swirl(q, d, 3.0, 0.9, 5.0)) * (0.3 + 1.5 * lace);
  if (uVar > 3.5) {
    float dn = d / uSwirlR, vn = 0.5 + 0.5 * vortex(q, d) / max(exp(-dn * dn / 12.0), 0.001);
    churn += uStir * 0.32 * smoothstep(0.45, 0.95, vn) * exp(-dn * dn / 11.0) * (0.5 + lace);
  }
  float foam = clamp((shore + churn) * uFoamK, 0.0, 1.0);
  col = mix(col, vec3(0.8, 0.93, 1.0), foam * 0.85);
  // Style 2: cartoon (cel) water. Colours snap to a few bands and foam gets a crisp edge.
  if (uVar > 1.5 && uVar < 2.5) {
    float lum = dot(col, vec3(0.3, 0.55, 0.15));
    float band = floor(lum * 6.0 + 0.5) / 6.0;
    col = mix(vec3(0.02, 0.07, 0.14), vec3(0.55, 0.85, 1.0), band) ;
    col = mix(col, vec3(0.92, 0.98, 1.0), step(0.45, foam));
  }
  // Style 4: silk. Broad, soft highlights and a faint colour shift at grazing angles.
  if (uVar > 3.5) col += vec3(0.05, 0.08, 0.16) * fresnel + vec3(0.12, 0.16, 0.2) * pow(max(dot(n, normalize(toOrb + v)), 0.0), 12.0) * uGlow * 0.6 * uSilk;

  // The water thins out to nothing exactly where it meets the land, so the edge is soft.
  float edge = smoothstep(0.0, 0.4, depth);
  float alpha = edge * max(mix(0.8, 0.97, 1.0 - exp(-depth * 1.2)), foam * 0.85);
  float fog = smoothstep(uFogNear, uFogFar, vView);
  gl_FragColor = vec4(mix(col, uFog, fog), alpha * uOpacity);
}`;

// A droplet: a bead of water with a bright rim and a small highlight, on an instanced sphere.
const DROP_VERT = /* glsl */ `
varying vec3 vN;
varying vec3 vV;
void main() {
  vec4 mv = modelViewMatrix * instanceMatrix * vec4(position, 1.0);
  vN = normalize((modelViewMatrix * instanceMatrix * vec4(normal, 0.0)).xyz);
  vV = -mv.xyz;
  gl_Position = projectionMatrix * mv;
}`;
const DROP_FRAG = /* glsl */ `
varying vec3 vN;
varying vec3 vV;
void main() {
  vec3 n = normalize(vN), v = normalize(vV);
  float facing = max(dot(n, v), 0.0), rim = pow(1.0 - facing, 2.0);
  float glint = pow(max(dot(n, normalize(vec3(0.25, 0.85, 0.45))), 0.0), 26.0);
  vec3 col = mix(vec3(0.16, 0.42, 0.56), vec3(0.75, 0.92, 1.0), rim) + glint * 0.9;
  gl_FragColor = vec4(col, clamp(0.55 + rim * 0.4 + glint, 0.0, 1.0));
}`;

/** The land's grid, as Stage builds it: `base` holds the height of every grid point, row by row. */
export type LandGrid = { NX: number; NZ: number; W: number; D: number; Z0: number; base: Float32Array };
export type WaterOptions = { small: boolean; grid: LandGrid; heightAt: (x: number, z: number) => number; fogColor: number };

export function makeWater({ small, grid, heightAt, fogColor }: WaterOptions) {
  // ── River ──────────────────────────────────────────────────────────────────────────────
  // LEVEL is the height of the surface at z = 0; SLOPE tilts it gently downhill towards the camera.
  // The sheet covers the land grid's own points within HALF of the centre line, back to Z_FAR.
  const LEVEL = 4.5, SLOPE = 0.01, HALF = 44, Z_FAR = -150;
  const levelAt = (z: number) => LEVEL - SLOPE * z;
  const { NX, NZ, W, D, Z0, base } = grid, dx = W / NX, dz = D / NZ;
  const ix0 = Math.max(0, Math.floor((W / 2 - HALF) / dx)), ix1 = Math.min(NX, Math.ceil((W / 2 + HALF) / dx));
  const COLS = ix1 - ix0, ROWS = Math.min(NZ, Math.ceil((Z0 - Z_FAR) / dz));
  const count = (COLS + 1) * (ROWS + 1);
  const pos = new Float32Array(count * 3), bed = new Float32Array(count), idx: number[] = [];
  for (let iz = 0, i = 0; iz <= ROWS; iz++) {
    const z = Z0 - iz * dz, y = levelAt(z);
    for (let ix = ix0; ix <= ix1; ix++, i++) {
      pos[i * 3] = -W / 2 + ix * dx; pos[i * 3 + 1] = y; pos[i * 3 + 2] = z;
      bed[i] = y - base[iz * (NX + 1) + ix]; // depth of water here; below zero means dry land
    }
  }
  // Same triangle split as the land, so the depth between grid points matches the land exactly.
  for (let iz = 0; iz < ROWS; iz++) for (let ix = 0; ix < COLS; ix++) {
    const a = iz * (COLS + 1) + ix, b = a + 1, c = a + COLS + 1, d = c + 1;
    idx.push(a, c, b, b, c, d);
  }
  const riverGeo = new BufferGeometry();
  riverGeo.setAttribute('position', new BufferAttribute(pos, 3)); riverGeo.setAttribute('aBed', new BufferAttribute(bed, 1));
  riverGeo.setIndex(idx);
  const uniforms = {
    uTime: { value: 0 }, uVar: { value: 0 }, uSwirlR: { value: 1 }, uSwirlDepth: { value: 1 }, uSwirlSpeed: { value: 1 },
    uRough: { value: 1 }, uSwirlLines: { value: 1 }, uSwirlSoft: { value: 1 }, uDetailK: { value: 1 }, uFoamK: { value: 1 }, uGlintK: { value: 1 }, uReflect: { value: 1 }, uBody: { value: 1 }, uSilk: { value: 1 }, uStir: { value: 1 }, uGlow: { value: 1 }, uOpacity: { value: 1 }, uFlat: { value: 1 },
    uOrb: { value: new Vector2() }, uOrbPos: { value: new Vector3() },
    // The shader writes screen colours directly, so the fog colour is passed as plain 0-1 values.
    uFog: { value: new Vector3(((fogColor >> 16) & 255) / 255, ((fogColor >> 8) & 255) / 255, (fogColor & 255) / 255) },
    uFogNear: { value: 30 }, uFogFar: { value: 150 },
  };
  // Both sides: like the land grid, these triangles face downwards.
  const riverMat = new ShaderMaterial({ uniforms, vertexShader: WATER_VERT, fragmentShader: WATER_FRAG, transparent: true, depthWrite: false, side: DoubleSide });
  const river = new Mesh(riverGeo, riverMat);
  river.frustumCulled = false; // the shader moves the surface, so the stored bounds are not exact
  river.renderOrder = 1; // after the land's lines, so the water covers the lines beneath it

  // ── Splashes ───────────────────────────────────────────────────────────────────────────
  // Real droplets, not glowing dots: small beads of water, each stretched along the way it is
  // flying, with a bright rim like a drop catching the light.
  const N = small ? 44 : 80;
  const seed = new Float32Array(N * 3);
  for (let i = 0; i < N * 3; i++) seed[i] = Math.random();
  const dropGeo = new SphereGeometry(1, 10, 8);
  const dropMat = new ShaderMaterial({ vertexShader: DROP_VERT, fragmentShader: DROP_FRAG, transparent: true, depthWrite: false });
  const spray = new InstancedMesh(dropGeo, dropMat, N);
  spray.instanceMatrix.setUsage(DynamicDrawUsage);
  spray.frustumCulled = false; spray.renderOrder = 7; // over the orb
  const drop = new Object3D(), UP = new Vector3(0, 1, 0), vel = new Vector3();

  type Frame = {
    t: number; orbX: number; orbY: number; orbZ: number;
    /** 1 = land at full height, 0 = flattened. */ flat: number;
    /** 1 = orb right over the water, 0 = orb gone. */ stir: number;
    /** 1 = water fully shown. */ show: number; fogNear: number; fogFar: number;
  };
  const update = (f: Frame) => {
    river.scale.y = Math.max(f.flat, 0.02);
    river.position.y = (1 - f.flat) * 0.3; // just above the flat grid, so they never flicker through each other
    uniforms.uTime.value = f.t; uniforms.uStir.value = f.stir; uniforms.uGlow.value = f.stir; uniforms.uOpacity.value = f.show; uniforms.uFlat.value = f.flat;
    uniforms.uOrb.value.set(f.orbX, f.orbZ); uniforms.uOrbPos.value.set(f.orbX, f.orbY, f.orbZ);
    uniforms.uFogNear.value = f.fogNear; uniforms.uFogFar.value = f.fogFar;
    river.visible = spray.visible = f.show > 0.01;
    if (!river.visible) return;

    const waterY = (levelAt(f.orbZ) - 0.4) * f.flat, power = f.stir * f.show, G = 18, LIFE = 1.5;
    for (let i = 0; i < N; i++) {
      // Each droplet is thrown up and out from the churned water, carried a little way round by the
      // wind, and falls back under gravity. One in four is thrown hard enough to reach the banks.
      const a = seed[i * 3], b = seed[i * 3 + 1], c = seed[i * 3 + 2], far = i % 4 === 0;
      const u = (b + (f.t / LIFE) * (0.8 + c * 0.4)) % 1, s = u * LIFE;
      const out = far ? 10 + c * 6 : 3.5 + c * 4, up = far ? 10 + a * 3 : 6.5 + a * 4, wind = 0.5;
      const rad = 2.5 + a * 3.5 + out * s, ang = (a * 37 + c * 11) % 6.283 + wind * s, cos = Math.cos(ang), sin = Math.sin(ang);
      const x = f.orbX + rad * cos, z = f.orbZ + rad * sin, y = waterY + up * s - 0.5 * G * s * s;
      const flying = power > 0.02 && y > waterY && y > heightAt(x, z) * f.flat;
      const size = flying && i < N * sprayAmount ? (0.032 + 0.05 * c * c) * spraySize * Math.min(1, s * 14) * Math.min(1, power * 2) : 0;
      vel.set(out * cos - rad * wind * sin, up - G * s, out * sin + rad * wind * cos);
      const speed = vel.length();
      drop.position.set(x, y, z);
      drop.quaternion.setFromUnitVectors(UP, vel.divideScalar(speed || 1));
      drop.scale.set(size, size * (1 + speed * 0.045), size);
      drop.updateMatrix(); spray.setMatrixAt(i, drop.matrix);
    }
    spray.instanceMatrix.needsUpdate = true;
  };

  const setVariant = (v: number) => { uniforms.uVar.value = v; };
  let sprayAmount = 1, spraySize = 1;
  /** Live look settings (from the preview sliders). */
  const setLook = (k: Record<string, number>) => {
    uniforms.uVar.value = k.waterDesign; uniforms.uRough.value = k.waterTexture; uniforms.uDetailK.value = k.waterRipples;
    uniforms.uSwirlR.value = k.swirlSize; uniforms.uSwirlDepth.value = k.swirlDepth; uniforms.uSwirlSpeed.value = k.swirlSpeed; uniforms.uSwirlLines.value = k.swirlLines; uniforms.uSwirlSoft.value = k.swirlSoft;
    uniforms.uFoamK.value = k.waterFoam; uniforms.uGlintK.value = k.waterGlint; uniforms.uReflect.value = k.waterReflect;
    uniforms.uBody.value = k.waterColour; uniforms.uSilk.value = k.waterSheen; sprayAmount = k.sprayAmount; spraySize = k.spraySize;
  };
  return { river, spray, update, setVariant, setLook, disposables: [riverGeo, riverMat, dropGeo, dropMat] as { dispose: () => void }[] };
}
