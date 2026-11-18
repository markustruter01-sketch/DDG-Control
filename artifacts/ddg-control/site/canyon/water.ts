import {
  BufferAttribute, BufferGeometry, DoubleSide, DynamicDrawUsage, InstancedMesh, Mesh, Object3D, ShaderMaterial, SphereGeometry,
  Vector2, Vector3, Vector4,
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
}
uniform vec4 uNova;      // the nova's push on the water: x, z, seconds since the blast (below 0 = none), height
uniform float uNovaSpeed; // how fast the ring runs out (units a second)
// The nova pushes the water: a crest of water heaped up at the ring as it runs outwards, the middle pushed
// down and filling back in, and a few waves trailing behind the crest. All of it fades as it spreads.
// It is not a perfect ring (Markus, 18 Nov: "more organic, less uniform"): the front runs a little ahead in
// some directions and behind in others, its line is bent by the water it crosses, the crest is tall in places
// and low in others with chop along its top, and the waves behind it are not evenly spaced.
float novaWave(vec2 p) {
  if (uNova.z < 0.0 || uNova.w <= 0.0) return 0.0;
  vec2 q = p - uNova.xy;
  float t = uNova.z, d0 = length(q), a = atan(q.y, q.x + 0.0001);
  float lobes = 0.5 * sin(a * 3.0 + 1.7) + 0.3 * sin(a * 7.0 - 0.6) + 0.2 * sin(a * 13.0 + 2.9);
  float bend = 1.1 * sin(p.x * 0.23 + 1.3) * sin(p.y * 0.19 - 0.7) + 0.6 * sin(p.x * 0.51 - p.y * 0.37 + 0.4);
  float d = d0 + bend * smoothstep(0.0, 6.0, d0), front = t * uNovaSpeed * (1.0 + 0.09 * lobes);
  float k = d - front;
  float tall = 1.0 + 0.4 * sin(a * 5.0 + 4.1) + 0.25 * sin(a * 11.0 - 1.3 + t * 1.5);
  float chop = 1.0 + 0.3 * sin(p.x * 0.9 + p.y * 1.3 + t * 5.0) * sin(p.x * 1.4 - p.y * 0.8 - t * 3.0);
  float crest = exp(-k * k / ((2.5 + front * 0.15) * (1.0 + 0.6 * lobes * lobes))) * tall * chop;
  float hollow = -0.9 * exp(-d0 * d0 / (front * front * 0.3 + 4.0)) * exp(-t * 1.1);
  float trail = 0.35 * sin(k * (1.3 + 0.3 * lobes) + 0.8 * bend) * exp(k * 0.12) * step(k, 0.0) * (0.6 + 0.4 * tall);
  return uNova.w * (crest + hollow + trail) * exp(-t * 0.55) * smoothstep(0.0, 0.08, t);
}
uniform vec4 uBoil;      // the boil: centre x, z (under the orb), strength (0 to 1), how far it spreads (radius)
uniform vec4 uBoilLook;  // fine bubbling, speed, white specks, how high the surface heaves (real height)
// A rolling boil: the surface split into jittered cells (Voronoi), each a dome that swells and sinks on its
// own clock, the way boiling water heaves (the cell method foam and lava artists use).
float boilHash(vec2 c) { return fract(sin(dot(c, vec2(127.1, 311.7))) * 43758.5453); }
float boilCells(vec2 p, float t) {
  vec2 g = floor(p), f = fract(p);
  float h = 0.0;
  for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
    vec2 o = vec2(float(x), float(y)), c = g + o;
    vec2 r = vec2(boilHash(c), boilHash(c + 7.1));
    float ph = fract(t * (0.5 + 0.9 * r.x) + r.y);
    float dome = sin(3.14159 * ph) * smoothstep(0.55 + 0.25 * r.y, 0.0, length(o + r - f));
    h = max(h, dome);
  }
  return h;
}
// The heave: big slow domes that lift the water's actual surface (used by the vertex shader to move the mesh,
// and by the colour shader so the lighting matches). Cheap: two cell lookups, only where it boils.
float boilHeave(vec2 p) {
  if (uBoil.z <= 0.001 || uBoilLook.w <= 0.0) return 0.0;
  vec2 bq = p - uBoil.xy;
  float near = exp(-dot(bq, bq) / (uBoil.w * uBoil.w)), sp = uBoilLook.y;
  return uBoil.z * near * uBoilLook.w * (0.8 * boilCells(p * 0.42, uTime * 0.9 * sp) + 0.35 * boilCells(p * 0.85 + 5.0, uTime * 1.4 * sp));
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
  lift += boilHeave(p.xz) + novaWave(p.xz); // the boiling lake and the nova's push move the real surface
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
uniform float uRough, uDetailK, uFoamK, uGlintK, uReflect, uBody, uSilk, uSwirlLines, uSwirlSoft, uClear;
${SKY_GLSL}
uniform float uGlow;
uniform vec4 uCalm;      // a box on screen (left, bottom, right, top, in canvas pixels) where the water is kept calm
uniform vec4 uPops[8];   // bubbles bursting and the release shockwave: x, z, age (0 to 1), size
uniform vec4 uMirror;    // the orb mirrored in the water: x strength, y the orb's radius, z its spin clock, w the lightning flash
uniform vec3 uCalmK;     // x: how calm (0 off, 1 no reflections or highlights at all), y: how soft the box's edges are (part of its size)
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
  h += boilHeave(p) + novaWave(p);
  // The boil: small fast bumps over the lake (as far as uBoil.w reaches), and rings running out from the beam.
  if (uBoil.z > 0.001) {
    vec2 bq = p - uBoil.xy; float bd = length(bq), near = exp(-bd * bd / (uBoil.w * uBoil.w)), sp = uBoilLook.y;
    h += uBoil.z * near * uBoilLook.x * (0.09 * boilCells(p * 1.3, uTime * 1.6 * sp) + 0.05 * detail * boilCells(p * 2.9 + 13.0, uTime * 2.3 * sp) + 0.04 * snoise(p * 2.6 + vec2(uTime * 3.1, -uTime * 2.7) * sp) + 0.05 * detail * snoise(p * 5.3 - vec2(uTime * 4.3, uTime * 3.7) * sp) + 0.03 * sin(bd * 7.0 - uTime * 14.0 * sp) * exp(-bd * 0.15));
  }
  // Rings from bubbles bursting (and the big one when the orb is let go).
  for (int i = 0; i < 8; i++) {
    vec4 pp = uPops[i];
    if (pp.z <= 0.0 || pp.z >= 1.0) continue;
    float ring = length(p - pp.xy) - pp.z * pp.w * 6.0;
    h += 0.05 * min(pp.w, 2.0) * (1.0 - pp.z) * exp(-ring * ring / (0.05 + 0.02 * pp.w));
  }
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
  // Behind the quote the water goes quiet: no mirrored sky, no orb glint, no foam or light-lines, so the
  // words are read against plain dark water. The box fades out at its edges.
  // It is the same rounded box as the frosted patch and the frame round the quote (one shape for all three).
  vec2 cc = (uCalm.xy + uCalm.zw) * 0.5, hs = max((uCalm.zw - uCalm.xy) * 0.5, vec2(0.5));
  float cr = min(uCalmK.z, min(hs.x, hs.y));
  vec2 cq = abs(gl_FragCoord.xy - cc) - hs + cr;
  float csd = length(max(cq, 0.0)) + min(max(cq.x, cq.y), 0.0) - cr;
  float cfe = max(uCalmK.y * 2.0 * min(hs.x, hs.y), 1.0);
  float lit = 1.0 - uCalmK.x * (1.0 - smoothstep(-cfe, 0.0, csd));
  float fresnel = clamp((0.03 + 0.97 * pow(1.0 - max(dot(n, v), 0.0), 5.0)) * uReflect, 0.0, 1.0) * lit;

  // What the surface mirrors: the real sky above it (stars and Milky Way, a little brighter than
  // life so they read on the water), a soft lift towards the horizon, and the orb's glow.
  vec3 sky = skyColor(normalize(vec3(r.x, abs(r.y) + 0.02, r.z))) * 1.7 + vec3(0.07, 0.12, 0.2) * (1.0 - smoothstep(0.0, 0.4, r.y));
  vec3 toOrb = normalize(uOrbPos - vWorld);
  float aim = max(dot(r, toOrb), 0.0);
  sky += vec3(0.75, 0.92, 1.0) * uGlow * (pow(aim, 70.0) * 1.6 + pow(aim, 12.0) * 0.4);

  // A true mirror image of the orb: where the reflected line of sight meets the ball, show the ball.
  float orbSeen = 0.0; vec3 orbCol = vec3(0.0);
  if (uMirror.x > 0.001) {
    vec3 oc = vWorld - uOrbPos;
    float bq = dot(oc, r), disc = bq * bq - (dot(oc, oc) - uMirror.y * uMirror.y);
    if (disc > 0.0 && bq < 0.0) {
      vec3 hn = normalize(oc + r * (-bq - sqrt(disc)));
      float fc = max(dot(hn, -r), 0.0), cr = cos(uMirror.z * 18.0), sr = sin(uMirror.z * 18.0);
      vec3 hr = vec3(cr * hn.x + sr * hn.z, hn.y, -sr * hn.x + cr * hn.z);
      float bnd = smoothstep(0.1, 0.7, snoise(vec2(hr.x * 1.5 + hr.z * 0.7, hr.y * 8.0)));
      orbCol = mix(vec3(0.14, 0.46, 0.92), vec3(0.86, 0.97, 1.0), clamp(bnd * 0.3 + pow(fc, 2.5) * 0.5, 0.0, 1.0)) + pow(1.0 - fc, 2.2) * vec3(0.45, 0.8, 1.0) * 0.9;
      orbCol *= 1.0 + 2.0 * uMirror.w;
      orbSeen = uMirror.x * smoothstep(0.0, 0.12 * uMirror.y * uMirror.y, disc) * lit;
      sky = mix(sky, orbCol * 1.4, clamp(orbSeen, 0.0, 1.0));
    }
  }

  // What shows through: teal over the shallows, near-black where it is deep. The orb lights it a little.
  float depth = vBed;
  vec3 body = mix(vec3(0.05, 0.3, 0.36), vec3(0.004, 0.03, 0.07), 1.0 - exp(-depth * 0.6)) * uBody;
  float reach = uGlow * exp(-length(uOrbPos.xz - vWorld.xz) / 16.0) * lit;
  body *= 0.75 + 1.3 * max(dot(n, toOrb), 0.0) * reach;
  // Light passing through: shallows glow faintly, with soft moving light-lines on the bed.
  float shallow = exp(-depth * 1.1);
  float caust = pow(0.5 + 0.5 * snoise(vP * 0.7 + vec2(uTime * 0.18, -uTime * 0.4)), 6.0) + pow(0.5 + 0.5 * snoise(vP * 1.1 - vec2(uTime * 0.23, uTime * 0.31) + 4.0), 6.0);
  body += vec3(0.1, 0.32, 0.34) * caust * shallow * 0.35 * (0.4 + reach) * lit * (uVar > 0.5 && uVar < 1.5 ? 0.0 : 1.0);
  vec3 col = mix(body, sky, fresnel) + orbCol * orbSeen * 0.3;
  // The orb as a light: a tight, bright glint on the water under it and a softer sheen round that.
  vec3 hv = normalize(toOrb + v);
  float nh = max(dot(n, hv), 0.0);
  col += vec3(0.8, 0.93, 1.0) * uGlow * (pow(nh, 420.0) * 2.2 + pow(nh, 64.0) * 0.18) * uGlintK * lit * exp(-length(uOrbPos.xz - vWorld.xz) / 30.0);

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
  float foam = clamp((shore + churn) * uFoamK, 0.0, 1.0) * lit;
  // White specks wherever the water boils; the rings catch the light.
  if (uBoil.z > 0.001) {
    float bd = length(vP - uBoil.xy);
    float near = exp(-bd * bd / (uBoil.w * uBoil.w));
    float specks = smoothstep(0.72, 0.95, snoise(vP * 4.5 + vec2(uTime * 5.0, -uTime * 4.0) * uBoilLook.y) * 0.5 + 0.5);
    col += vec3(0.65, 0.88, 1.0) * uBoil.z * near * 0.06;
    foam = max(foam, uBoil.z * near * specks * 0.8 * uBoilLook.z);
  }
  for (int i = 0; i < 8; i++) {
    vec4 pp = uPops[i];
    if (pp.z <= 0.0 || pp.z >= 1.0) continue;
    float ring = length(vP - pp.xy) - pp.z * pp.w * 6.0;
    col += vec3(0.7, 0.9, 1.0) * (1.0 - pp.z) * exp(-ring * ring / (0.03 + 0.03 * pp.w)) * (pp.w > 2.0 ? 0.9 : 0.35);
  }
  col = mix(col, vec3(0.8, 0.93, 1.0), foam * 0.85);
  // Style 2: cartoon (cel) water. Colours snap to a few bands and foam gets a crisp edge.
  if (uVar > 1.5 && uVar < 2.5) {
    float lum = dot(col, vec3(0.3, 0.55, 0.15));
    float band = floor(lum * 6.0 + 0.5) / 6.0;
    col = mix(vec3(0.02, 0.07, 0.14), vec3(0.55, 0.85, 1.0), band) ;
    col = mix(col, vec3(0.92, 0.98, 1.0), step(0.45, foam));
  }
  // Style 4: silk. Broad, soft highlights and a faint colour shift at grazing angles.
  if (uVar > 3.5) col += vec3(0.05, 0.08, 0.16) * fresnel + vec3(0.12, 0.16, 0.2) * pow(max(dot(n, normalize(toOrb + v)), 0.0), 12.0) * uGlow * 0.6 * uSilk * lit;

  // The water thins out to nothing exactly where it meets the land, so the edge is soft.
  float edge = smoothstep(0.0, 0.4, depth);
  float alpha = edge * max(mix(0.8, 0.97, 1.0 - exp(-depth * 1.2)) * (1.0 - 0.75 * uClear), max(foam * 0.85, fresnel * 0.9));
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
  // The river's own mesh is twice as fine as the land's, so the boiling surface has points to heave with.
  // The ground under each point is read off the land's own triangles (same split), so the shore matches.
  const SUB = 2, RC = COLS * SUB, RR = ROWS * SUB;
  const landAt = (fx: number, fz: number) => { // fx, fz in land grid cells (fractional)
    const cx = Math.min(NX - 1, Math.max(0, Math.floor(fx))), cz = Math.min(NZ - 1, Math.max(0, Math.floor(fz)));
    const u = fx - cx, v = fz - cz;
    const h = (ix: number, iz: number) => base[iz * (NX + 1) + ix]!;
    const a = h(cx, cz), b = h(cx + 1, cz), c = h(cx, cz + 1), d = h(cx + 1, cz + 1);
    // Triangles (a, c, b) and (b, c, d), as the land draws them.
    return u + v <= 1 ? a + (b - a) * u + (c - a) * v : d + (c - d) * (1 - u) + (b - d) * (1 - v);
  };
  const count = (RC + 1) * (RR + 1);
  const pos = new Float32Array(count * 3), bed = new Float32Array(count), idx: number[] = [];
  for (let iz = 0, i = 0; iz <= RR; iz++) {
    const fz = iz / SUB, z = Z0 - fz * dz, y = levelAt(z);
    for (let ix = 0; ix <= RC; ix++, i++) {
      const fx = ix0 + ix / SUB;
      pos[i * 3] = -W / 2 + fx * dx; pos[i * 3 + 1] = y; pos[i * 3 + 2] = z;
      bed[i] = y - landAt(fx, fz); // depth of water here; below zero means dry land
    }
  }
  for (let iz = 0; iz < RR; iz++) for (let ix = 0; ix < RC; ix++) {
    const a = iz * (RC + 1) + ix, b = a + 1, c = a + RC + 1, d = c + 1;
    idx.push(a, c, b, b, c, d);
  }
  const riverGeo = new BufferGeometry();
  riverGeo.setAttribute('position', new BufferAttribute(pos, 3)); riverGeo.setAttribute('aBed', new BufferAttribute(bed, 1));
  riverGeo.setIndex(idx);
  const uniforms = {
    uTime: { value: 0 }, uVar: { value: 0 }, uSwirlR: { value: 1 }, uSwirlDepth: { value: 1 }, uSwirlSpeed: { value: 1 },
    uRough: { value: 1 }, uClear: { value: 0 }, uSwirlLines: { value: 1 }, uSwirlSoft: { value: 1 }, uDetailK: { value: 1 }, uFoamK: { value: 1 }, uGlintK: { value: 1 }, uReflect: { value: 1 }, uBody: { value: 1 }, uSilk: { value: 1 }, uStir: { value: 1 }, uGlow: { value: 1 }, uOpacity: { value: 1 }, uFlat: { value: 1 },
    uNova: { value: new Vector4(0, 0, -1, 0) }, uNovaSpeed: { value: 22 },
    uBoil: { value: new Vector4(0, 0, 0, 3) }, uBoilLook: { value: new Vector4(1, 1, 1, 1) }, uPops: { value: Array.from({ length: 8 }, () => new Vector4()) }, uSkyTurn: { value: 0 },
    uMirror: { value: new Vector4() }, uCalm: { value: new Vector4() }, uCalmK: { value: new Vector3() },
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
    /** The calm box behind the quote: left, bottom, right, top in canvas pixels, how calm (0 to 1), edge softness. */ calm: [number, number, number, number, number, number, number?];
    /** The orb mirrored in the water: strength, orb radius, spin clock, lightning flash. And how much lightning brightens the water. */ mirror: [number, number, number, number]; flash: number;
    /** How far the river level has dropped (after the nova). */ drop?: number;
    /** The nova's push: x, z, seconds since (below 0 = none), height; and its speed. */ nova?: [number, number, number, number]; novaSpeed?: number;
    /** The boil (x, z, strength 0..1, radius), its look (height, speed, specks, spot size), bursting rings, and how far the sky has turned. Optional. */ boil?: [number, number, number, number]; boilLook?: [number, number, number, number]; pops?: [number, number, number, number][]; skyTurn?: number;
  };
  const update = (f: Frame) => {
    river.scale.y = Math.max(f.flat, 0.02);
    river.position.y = (1 - f.flat) * 0.3 - (f.drop ?? 0); // just above the flat grid, so they never flicker through each other
    uniforms.uTime.value = f.t; uniforms.uStir.value = f.stir; uniforms.uGlow.value = f.stir * (1 + f.flash); uniforms.uOpacity.value = f.show; uniforms.uFlat.value = f.flat;
    uniforms.uOrb.value.set(f.orbX, f.orbZ); uniforms.uOrbPos.value.set(f.orbX, f.orbY, f.orbZ);
    uniforms.uFogNear.value = f.fogNear; uniforms.uFogFar.value = f.fogFar;
    uniforms.uCalm.value.set(f.calm[0], f.calm[1], f.calm[2], f.calm[3]); uniforms.uCalmK.value.set(f.calm[4], f.calm[5], f.calm[6] ?? 0);
    uniforms.uMirror.value.set(f.mirror[0], f.mirror[1], f.mirror[2], f.mirror[3]);
    if (f.boil) uniforms.uBoil.value.set(f.boil[0], f.boil[1], f.boil[2], f.boil[3]); else uniforms.uBoil.value.z = 0;
    if (f.nova) uniforms.uNova.value.set(f.nova[0], f.nova[1], f.nova[2], f.nova[3]); else uniforms.uNova.value.z = -1;
    uniforms.uNovaSpeed.value = f.novaSpeed ?? 22;
    if (f.boilLook) uniforms.uBoilLook.value.set(f.boilLook[0], f.boilLook[1], f.boilLook[2], f.boilLook[3]);
    for (let i = 0; i < 8; i++) { const pp = f.pops?.[i]; if (pp) uniforms.uPops.value[i]!.set(pp[0], pp[1], pp[2], pp[3]); else uniforms.uPops.value[i]!.z = 0; }
    uniforms.uSkyTurn.value = f.skyTurn ?? 0;
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
    uniforms.uSwirlR.value = k.swirlSize; uniforms.uSwirlDepth.value = k.swirlDepth; uniforms.uSwirlSpeed.value = k.swirlSpeed; uniforms.uSwirlLines.value = k.swirlLines; uniforms.uClear.value = k.waterClear; uniforms.uSwirlSoft.value = k.swirlSoft;
    uniforms.uFoamK.value = k.waterFoam; uniforms.uGlintK.value = k.waterGlint; uniforms.uReflect.value = k.waterReflect;
    uniforms.uBody.value = k.waterColour; uniforms.uSilk.value = k.waterSheen; sprayAmount = k.sprayAmount; spraySize = k.spraySize;
  };
  return { river, spray, update, setVariant, setLook, levelAt, disposables: [riverGeo, riverMat, dropGeo, dropMat] as { dispose: () => void }[] };
}
