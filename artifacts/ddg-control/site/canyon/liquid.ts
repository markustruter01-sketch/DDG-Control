import {
  BufferAttribute, BufferGeometry, Color, FloatType, FramebufferTexture, HalfFloatType, LinearFilter, Matrix3, Mesh, MeshBasicMaterial, NearestFilter,
  OrthographicCamera, PlaneGeometry, Points, RGBAFormat, Scene, ShaderMaterial, SphereGeometry, Vector2, Vector3, Vector4,
  WebGLRenderTarget,
} from 'three';
import type { PerspectiveCamera, WebGLRenderer } from 'three';
import { SKY_GLSL } from './sky';

/**
 * The liquid vortex (Markus, 18 Nov): while the orb charges, gravity lets go of the river round it. The story,
 * in the order it is seen:
 *  1. the dish the orb presses into the water fills and swells up into a mound (`funnel`, used by water.ts);
 *  2. globules peel off the water all round the orb and float up slowly, each trailing a neck of smaller
 *     drops, wobbling as if only surface tension held them together;
 *  3. they are drawn inwards and wound into ribbons of water that climb a narrow stem from the mound, wrap
 *     round the orb and spin faster and tighter as the charge grows: a tornado of water with the orb in its head;
 *  4. drops flung off the top drift out almost weightless;
 *  5. the nova throws everything outwards, it hangs for a moment, then gravity comes back and it rains into
 *     the river without a splash.
 *
 * How it looks like one liquid and not a cloud of balls ("screen-space fluid", as games do it):
 *  1. every drop is drawn as a small ball, but only its distance from the camera is kept (off screen);
 *  2. those distances are smoothed, so balls that touch melt into one surface;
 *  3. that surface is shaded with the river's own formulas and the river's own live values (reflection,
 *     colour, glint, sheen, clearness, the orb's glow and its mirror image: see WATER_FRAG in water.ts, and
 *     keep the two in step), plus the orb's light caught by water this close to it;
 *  4. the river lies over a dark bed, but this water hangs in the air, so what is behind it (the orb, the sky,
 *     the river) shows through it, bent as a drop of water bends it. For that the picture drawn so far is
 *     copied once a frame (only while there is water in the air).
 */

const DEPTH_VERT = /* glsl */ `
attribute float aSize;
uniform float uPx;
varying vec3 vView; varying float vR;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vView = mv.xyz; vR = aSize;
  gl_Position = projectionMatrix * mv;
  gl_PointSize = aSize > 0.0 ? uPx * aSize * 2.0 / max(-mv.z, 0.1) : 0.0;
}`;
// Each point is a ball: its true surface distance is written, and its depth too, so balls cut into each other.
// The distance is kept as "how much nearer or further than the orb", not from the camera: small numbers, so they
// stay exact even on devices that can only draw to half-size floats (most phones). Kept from the camera, the
// steps were coarse there and the water came out speckled.
const DEPTH_FRAG = /* glsl */ `
uniform mat4 projectionMatrix; // (three.js only declares it for the vertex stage)
uniform float uRef;
varying vec3 vView; varying float vR;
void main() {
  vec2 c = gl_PointCoord * 2.0 - 1.0; c.y = -c.y;
  float r2 = dot(c, c);
  if (r2 > 1.0) discard;
  vec3 p = vView + vec3(c * vR, sqrt(1.0 - r2) * vR);
  vec4 clip = projectionMatrix * vec4(p, 1.0);
  gl_FragDepth = clip.z / clip.w * 0.5 + 0.5;
  gl_FragColor = vec4(-p.z - uRef, 1.0, 0.0, 1.0);
}`;

const QUAD_VERT = /* glsl */ `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position.xy * 2.0, 0.0, 1.0); }`;
// Smooth the distances along one direction, only mixing with neighbours at a similar distance (so separate
// streams don't blur into each other). Empty pixels next to the liquid take the nearby distance too (but stay
// empty), so the edges can be smoothed later without a dark rim.
const BLUR_FRAG = /* glsl */ `
uniform sampler2D uTex; uniform vec2 uStep; uniform float uFall; uniform float uPass;
varying vec2 vUv;
void main() {
  // Pass 0 (across) reads the drops: g = covered. Pass 1 (down) reads pass 0: b = coverage smoothed across,
  // r already filled in beside the liquid, and a = "r holds a distance" (r itself can be above or below zero).
  vec4 c = texture2D(uTex, vUv);
  float sum = 0.0, wsum = 0.0, cov = 0.0, csum = 0.0;
  for (int i = -7; i <= 7; i++) {
    float fi = float(i);
    vec4 s = texture2D(uTex, vUv + uStep * fi);
    float g = exp(-fi * fi / 18.0);
    cov += (uPass > 0.5 ? s.b : s.g) * g; csum += g;
    if ((uPass > 0.5 ? s.a : s.g) < 0.5) continue;
    float w = g;
    if (c.g > 0.5) { float dz = (s.r - c.r) * uFall; w *= exp(-dz * dz); }
    sum += s.r * w; wsum += w;
  }
  float d = wsum > 0.0 ? sum / wsum : 0.0;
  gl_FragColor = vec4(d, c.g, cov / csum, wsum > 0.0 ? 1.0 : 0.0);
}`;
// Shade the smoothed surface as the river is shaded (WATER_FRAG in water.ts): same formulas, same numbers.
const SHADE_FRAG = /* glsl */ `
uniform sampler2D uTex; uniform vec2 uTexel; uniform mat4 uInvProj; uniform mat3 uViewToWorld; uniform vec3 uCamPos;
uniform vec3 uOrbW; uniform float uOrbR; uniform float uThick; uniform float uRef;
uniform float uReflect, uBody, uGlintK, uSilk, uClear, uGlow, uMirror, uVGlow;
uniform sampler2D uScene; uniform float uRefr;
varying vec2 vUv;
${SKY_GLSL}
vec3 viewAt(vec2 uv, float z) {
  vec4 v = uInvProj * vec4(uv * 2.0 - 1.0, -1.0, 1.0); v.xyz /= v.w;
  return v.xyz * ((z + uRef) / -v.z);
}
void main() {
  vec4 c = texture2D(uTex, vUv);
  float cover = smoothstep(0.24, 0.5, c.b);
  if (cover <= 0.01 || c.a < 0.5) discard;
  vec3 Pv = viewAt(vUv, c.r);
  // The slope of the surface, from the neighbours two steps away (smoother than one), taking the side that is
  // closer in distance so that an edge between two streams does not bend the light.
  vec2 ex = vec2(uTexel.x * 2.0, 0.0), ey = vec2(0.0, uTexel.y * 2.0);
  vec4 sr = texture2D(uTex, vUv + ex), sl = texture2D(uTex, vUv - ex), su = texture2D(uTex, vUv + ey), sd = texture2D(uTex, vUv - ey);
  float zr = sr.r, zl = sl.r, zu = su.r, zd = sd.r;
  vec3 dx = abs(zr - c.r) < abs(c.r - zl) && sr.a > 0.5 ? viewAt(vUv + ex, zr) - Pv : Pv - viewAt(vUv - ex, sl.a > 0.5 ? zl : c.r);
  vec3 dy = abs(zu - c.r) < abs(c.r - zd) && su.a > 0.5 ? viewAt(vUv + ey, zu) - Pv : Pv - viewAt(vUv - ey, sd.a > 0.5 ? zd : c.r);
  vec3 nv = normalize(cross(dx, dy));
  if (nv.z < 0.0) nv = -nv;
  // From here on in world space, as the river's shader works.
  vec3 n = normalize(uViewToWorld * nv), v = normalize(uViewToWorld * -Pv), P = uCamPos + uViewToWorld * Pv;
  float facing = max(dot(n, v), 0.0);
  vec3 r = reflect(-v, n);
  float fresnel = clamp((0.03 + 0.97 * pow(1.0 - facing, 5.0)) * uReflect, 0.0, 1.0);
  // What it mirrors: the same sky, the same lift towards the horizon, the same glow of the orb. A drop also has
  // an underside, which mirrors the dark river below it and not the sky.
  vec3 sky = skyColor(normalize(vec3(r.x, abs(r.y) + 0.02, r.z))) * 1.7 + vec3(0.07, 0.12, 0.2) * (1.0 - smoothstep(0.0, 0.4, abs(r.y)));
  sky *= mix(0.5, 1.0, smoothstep(-0.3, 0.05, r.y));
  vec3 toOrb = uOrbW - P; float dO = length(toOrb); toOrb /= dO;
  float aim = max(dot(r, toOrb), 0.0);
  sky += vec3(0.75, 0.92, 1.0) * uGlow * (pow(aim, 70.0) * 1.6 + pow(aim, 12.0) * 0.4);
  // The orb mirrored in the water, as on the river: where the mirrored line of sight meets the ball.
  float orbSeen = 0.0; vec3 orbCol = vec3(0.0);
  if (uMirror > 0.001) {
    vec3 oc = P - uOrbW;
    float bq = dot(oc, r), disc = bq * bq - (dot(oc, oc) - uOrbR * uOrbR);
    if (disc > 0.0 && bq < 0.0) {
      vec3 hn = normalize(oc + r * (-bq - sqrt(disc)));
      float fc = max(dot(hn, -r), 0.0);
      orbCol = mix(vec3(0.14, 0.46, 0.92), vec3(0.86, 0.97, 1.0), clamp(0.12 + pow(fc, 2.5) * 0.5, 0.0, 1.0)) + pow(1.0 - fc, 2.2) * vec3(0.45, 0.8, 1.0) * 0.9;
      orbSeen = uMirror * smoothstep(0.0, 0.12 * uOrbR * uOrbR, disc);
      sky = mix(sky, orbCol * 1.4, clamp(orbSeen, 0.0, 1.0));
    }
  }
  // What shows through: the river's teal where the water is thin (the rim of a drop, a fine thread), near-black
  // where it is thick (the heart of a ribbon). "Depth" here is how much water the eye looks through.
  float depth = facing * uThick * (0.35 + 0.65 * c.b);
  // What is behind the water, seen through it: bent the way a drop bends light (most at its rim), and tinted
  // a little by the water.
  vec2 bend = nv.xy * uRefr * (0.35 + 0.65 * c.b) * vec2(uTexel.x / uTexel.y, 1.0);
  vec3 behind = texture2D(uScene, clamp(vUv - bend, 0.002, 0.998)).rgb * mix(vec3(1.0), vec3(0.7, 0.92, 1.0), 1.0 - exp(-depth * 0.8));
  vec3 body = mix(vec3(0.05, 0.3, 0.36), vec3(0.004, 0.03, 0.07), 1.0 - exp(-depth * 0.6)) * uBody;
  float reach = uGlow * exp(-dO / 16.0);
  float lit = max(dot(n, toOrb), 0.0);
  body *= 0.75 + 1.3 * lit * reach;
  vec3 col = mix(body, sky, fresnel) + orbCol * orbSeen * 0.3;
  vec3 hv = normalize(toOrb + v);
  float nh = max(dot(n, hv), 0.0);
  col += vec3(0.8, 0.93, 1.0) * uGlow * (pow(nh, 420.0) * 2.2 + pow(nh, 64.0) * 0.18) * uGlintK * exp(-dO / 30.0);
  col += vec3(0.05, 0.08, 0.16) * fresnel * step(0.0001, uSilk) + vec3(0.12, 0.16, 0.2) * pow(nh, 12.0) * uGlow * 0.6 * uSilk;
  // Only the vortex has this: it is right beside the orb, so it catches the orb's light on the side facing it
  // and glows where the orb shines through thin water from behind ("Vortex: brightness").
  float att = 1.0 / (1.0 + dO * dO / (uOrbR * uOrbR * 5.0));
  float through = pow(max(dot(-toOrb, v), 0.0), 3.0) * (1.0 - 0.6 * facing);
  vec3 glow = vec3(0.3, 0.68, 1.0) * uVGlow * att * (0.3 * lit + 0.55 * through + 0.06);
  // As see-through as the river ("Clearness") for the same amount of water, and solid where it mirrors. The
  // river is deep; a drop is not, so less of the river's dark body shows and more of what is behind it.
  float alpha = max(mix(0.8, 0.97, 1.0 - exp(-depth * 1.2)) * (1.0 - 0.75 * uClear) * (1.0 - exp(-depth * 0.7)), fresnel * 0.9);
  gl_FragColor = vec4(mix(behind, col, clamp(alpha, 0.0, 1.0)) + glow, cover);
}`;

/** mode: 0 = wound into the vortex, 1 = a globule floating up off the river, 2 = falling free. */
type Drop = { on: boolean; mode: number; strand: number; th: number; r: number; x: number; y: number; z: number; vx: number; vy: number; vz: number; size: number; rise: number; top: number; age: number; seed: number };
export type LiquidLook = {
  amount: number; speed: number; size: number; reach: number; glow: number;
  /** The dish the orb presses into the river (water.ts): how deep it is now, and how wide. */
  bowlDepth?: number; bowlR?: number;
};
/** The river material's own uniforms (water.ts), read every frame so the vortex is always the river's water. */
export type RiverUniforms = Record<string, { value: unknown } | undefined>;

const STRANDS = 6;
const smooth = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));

export function makeLiquid(renderer: WebGLRenderer) {
  const small = typeof innerWidth === 'number' && innerWidth < 700;
  const N = small ? 700 : 1500, N_BEAD = Math.round(N * 0.24);
  // Needs a float target to keep distances; without one (rare), the liquid simply stays off.
  const ok = renderer.extensions.has('EXT_color_buffer_float') || renderer.extensions.has('EXT_color_buffer_half_float');

  const drops: Drop[] = Array.from({ length: N }, () => ({ on: false, mode: 0, strand: 0, th: 0, r: 0, x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, size: 0, rise: 0, top: 0, age: 0, seed: 0 }));
  const pos = new Float32Array(N * 3), aSize = new Float32Array(N);
  const geo = new BufferGeometry();
  geo.setAttribute('position', new BufferAttribute(pos, 3)); geo.setAttribute('aSize', new BufferAttribute(aSize, 1));
  const depthMat = new ShaderMaterial({ uniforms: { uPx: { value: 600 }, uRef: { value: 0 } }, vertexShader: DEPTH_VERT, fragmentShader: DEPTH_FRAG, depthTest: true, depthWrite: true });
  const points = new Points(geo, depthMat); points.frustumCulled = false;
  // The orb as a hidden blocker, so liquid behind it is hidden.
  const blockGeo = new SphereGeometry(1, 24, 16), blockMat = new MeshBasicMaterial({ colorWrite: false });
  const block = new Mesh(blockGeo, blockMat);
  const dropScene = new Scene(); dropScene.add(points, block);

  // Full floats where they can also be smoothly sampled (most computers); half floats otherwise.
  const type = renderer.extensions.has('EXT_color_buffer_float') && renderer.extensions.has('OES_texture_float_linear') ? FloatType : HalfFloatType;
  const mk = (soft: boolean, depth: boolean) => {
    const t = new WebGLRenderTarget(4, 4, { type, format: RGBAFormat, minFilter: soft ? LinearFilter : NearestFilter, magFilter: soft ? LinearFilter : NearestFilter, depthBuffer: depth });
    t.texture.generateMipmaps = false;
    return t;
  };
  const rtA = mk(false, true), rtB = mk(false, false), rtC = mk(true, false); // drops; smoothed across; smoothed both ways
  const quadGeo = new PlaneGeometry(1, 1);
  const blurMat = new ShaderMaterial({ uniforms: { uTex: { value: null }, uStep: { value: new Vector2() }, uFall: { value: 2 }, uPass: { value: 0 } }, vertexShader: QUAD_VERT, fragmentShader: BLUR_FRAG, depthTest: false, depthWrite: false });
  const shadeMat = new ShaderMaterial({
    uniforms: {
      uTex: { value: null }, uTexel: { value: new Vector2() }, uInvProj: { value: null }, uViewToWorld: { value: new Matrix3() }, uCamPos: { value: new Vector3() },
      uOrbW: { value: new Vector3() }, uOrbR: { value: 1 }, uThick: { value: 1 }, uRef: { value: 0 }, uSkyTurn: { value: 0 }, uScene: { value: null }, uRefr: { value: 0.02 },
      uReflect: { value: 1 }, uBody: { value: 1 }, uGlintK: { value: 1 }, uSilk: { value: 0 }, uClear: { value: 0 }, uGlow: { value: 1 }, uMirror: { value: 0 }, uVGlow: { value: 1 },
    },
    vertexShader: QUAD_VERT, fragmentShader: SHADE_FRAG, transparent: true, depthTest: false, depthWrite: false,
  });
  const quad = new Mesh(quadGeo, blurMat); quad.frustumCulled = false;
  const quadScene = new Scene(); quadScene.add(quad);
  const quadCam = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const size = new Vector2();

  let live = 0, liveBead = 0, debtS = 0, debtB = 0, clock = 0;
  // How much of gravity is left (1 = normal). It lets go as the orb charges, and comes back after.
  let grav = 1, hang = 0, mound = 0, ballSize = 0.4;
  // The river's surface under the orb, for water.ts: x, z, height (below zero = lifted into a mound), width.
  const funnel = new Vector4(0, 0, 0, 1);
  const rnd = (a: number, b: number) => a + Math.random() * (b - a);
  const strandAt = (k: number) => (k / STRANDS) * Math.PI * 2 + clock * 0.5 * (k % 2 ? 1 : 0.8);

  /**
   * `p` 0..1: how charged (0 = none: what is in the air falls back). `orb`, `radius`: where the orb is.
   * `ground(x, z)`: the height of the river (or land) there, before the orb's dish and the mound.
   */
  const update = (dt: number, p: number, orb: Vector3, radius: number, look: LiquidLook, ground: (x: number, z: number) => number) => {
    if (!ok) return;
    dt = Math.min(Math.max(dt, 0), 0.05); clock += dt;
    const R = Math.max(radius, 0.01), sizeK = Math.max(0.1, look.size), reach = look.reach, speed = 0.4 + 0.3 * look.speed;
    const amountK = Math.min(1.2, Math.max(0, look.amount)), on = p > 0.03;
    ballSize = R * 0.11 * sizeK;
    // Gravity lets go with the charge (never quite all of it), and comes back over about a second.
    if (hang > 0) hang -= dt;
    else grav += ((on ? 1 - 0.88 * p : 1.6) - grav) * Math.min(1, dt * (on ? 4 : 2.6));
    // The river under the orb: its dish fills and swells into a mound the vortex stands on.
    const bowl = Math.max(0, look.bowlDepth ?? 0), bowlR = Math.max(0.5, look.bowlR ?? 6);
    const moundWant = on ? (bowl + R * 0.42 * Math.min(1, amountK)) * smooth(Math.pow(p, 0.55)) : 0;
    mound += (moundWant - mound) * Math.min(1, dt * (moundWant > mound ? 5 : 3.5));
    const moundW = R * 1.45;
    funnel.set(orb.x, orb.z, -mound, moundW);
    const riverY = ground(orb.x, orb.z);
    const surf = (x: number, z: number) => {
      const d2 = (x - orb.x) ** 2 + (z - orb.z) ** 2;
      return ground(x, z) - bowl * Math.exp(-d2 / (bowlR * bowlR)) + mound * Math.exp(-d2 / (moundW * moundW));
    };
    // The shape of the tornado: its feet stand in a ring on the swollen river round the orb, the water leans in
    // as it climbs, wraps the orb with a little air between them, closes to a twisting peak over the top and is
    // flung off there. `rt(y)` is how far from the middle the water runs at height y.
    const gap = R * (0.1 + 0.13 * reach) * (1 - 0.3 * p), yt = orb.y + R, footR = R * (1.05 + 0.2 * reach);
    const foot = surf(orb.x + footR, orb.z);
    const rt = (y: number) => {
      const lean = footR * (1 - 0.4 * smooth((y - foot) / Math.max(0.5, orb.y - foot)));
      if (y >= yt) return gap + R * 0.45 * Math.min(1.5, (y - yt) / R);
      return Math.max(lean * smooth((yt - y) / (0.6 * R)), Math.sqrt(Math.max(0, R * R - (y - orb.y) ** 2)) + gap);
    };
    const spin = (r: number) => speed * (1.6 + 3.8 * p) * Math.pow((R * 1.2) / Math.max(r, R * 0.35), 0.7);
    const climb = speed * R * (0.9 + 1.5 * p);

    // New water. Globules first, all round the orb; then, as the pull grows, the ribbons at the foot of the stem.
    const wantB = on ? N_BEAD * Math.min(1, p / 0.2) * Math.min(1, amountK) : 0;
    const wantS = on ? (N - N_BEAD) * smooth((p - 0.03) / 0.35) * Math.min(1, amountK) : 0;
    debtB = Math.min(40, debtB + Math.max(0, wantB - liveBead) * dt * 1.4);
    // Ribbons need a steady flow, or they break into beads: enough each second to replace every drop as it leaves.
    debtS = Math.min(80, debtS + (wantS > live - liveBead ? (wantS / Math.max(0.6, (yt + R - foot) / climb)) * 1.25 * dt : 0));
    let cluster = 0, cth = 0, cr = 0, cy = 0, cs = 0;
    for (let i = 0; i < N && (debtS >= 1 || debtB >= 1 || cluster > 0); i++) {
      const d = drops[i]!;
      if (d.on) continue;
      d.on = true; d.age = 0; d.seed = Math.random(); d.vx = d.vy = d.vz = 0;
      if (cluster > 0 || debtB >= 1) {
        // A globule, and behind it two smaller drops that rise a little slower: together a drop with a neck
        // that stretches and pinches off, the way water leaves a surface when little is pulling it down.
        d.mode = 1; liveBead++;
        if (cluster === 0) {
          debtB -= 1; cluster = Math.random() < 0.7 ? 3 : 1;
          cth = rnd(0, Math.PI * 2); cr = R * (0.7 + 2.6 * Math.sqrt(Math.random()));
          cs = R * rnd(0.1, 0.2) * sizeK * (Math.random() < 0.12 ? 1.5 : 1);
          const x = orb.x + Math.cos(cth) * cr, z = orb.z + Math.sin(cth) * cr * 0.85;
          cy = surf(x, z);
          // Only off the water, never off the banks.
          if (ground(x, z) > riverY + 0.012 * Math.abs(z - orb.z) + 0.05) { d.on = false; liveBead--; cluster = 0; continue; }
          d.size = cs; d.rise = rnd(0.8, 1.25); d.y = cy - cs * 0.7;
        } else {
          const k = cluster === 2 ? 1 : 2; // (the cluster counts 3, 2, 1: this is the 1st or 2nd follower)
          d.size = cs * (k === 1 ? 0.72 : 0.5); d.rise = (k === 1 ? 0.8 : 0.62) * rnd(0.95, 1.05); d.y = cy - cs * (0.7 + 0.5 * k);
        }
        cluster--;
        d.th = cth; d.r = cr; d.strand = 0; d.top = yt + R * rnd(0.15, 0.9);
        d.x = orb.x + Math.cos(d.th) * d.r; d.z = orb.z + Math.sin(d.th) * d.r * 0.85;
      } else {
        debtS -= 1;
        const k = Math.floor(Math.random() * STRANDS);
        d.mode = 0; d.strand = k;
        // Each ribbon is a rope of drops so close together that they melt into one stream. The rope swells and
        // thins along its length (the pulse below), and a few loose drops ride beside it.
        const loose = Math.random() < 0.12, pulse = 0.78 + 0.34 * Math.sin(clock * 5.1 + k * 2.4) + 0.14 * Math.sin(clock * 11.7 + k);
        d.th = strandAt(k) + (loose ? rnd(-0.3, 0.3) : rnd(-0.045, 0.045));
        d.y = surf(orb.x + Math.cos(d.th) * footR, orb.z + Math.sin(d.th) * footR) - R * 0.1 + rnd(0, climb * dt); // (spread along the path, so one frame's drops are not a clump)
        d.r = rt(d.y);
        d.seed = loose ? Math.random() : rnd(0.4, 0.6); // (how far in or out of the rope it runs)
        d.x = orb.x + Math.cos(d.th) * d.r; d.z = orb.z + Math.sin(d.th) * d.r;
        d.size = R * (loose ? rnd(0.05, 0.09) : 0.125 * pulse) * sizeK;
        d.rise = loose ? rnd(0.8, 1.25) : rnd(0.97, 1.03); d.top = yt + R * rnd(0.5, 1.1);
      }
      live++;
    }
    for (let i = 0; i < N; i++) {
      const d = drops[i]!;
      if (!d.on) { aSize[i] = 0; continue; }
      d.age += dt;
      let wob = 1;
      if (d.mode !== 2 && !on) { // let go: gravity takes it back
        if (d.mode === 1) liveBead--;
        const wound = d.mode === 0, vt = wound ? spin(d.r) * d.r * 0.5 : 0;
        d.mode = 2; d.vx = -Math.sin(d.th) * vt; d.vz = Math.cos(d.th) * vt; d.vy = wound ? climb * 0.3 : 0;
      }
      if (d.mode === 1) {
        // Floating up: slow, wobbling, drifting round the orb and drawn in, faster as the charge grows.
        const want = rt(d.y) + R * 0.1;
        d.th += speed * (0.25 + 1.3 * p) * Math.min(3, R / Math.max(d.r, 0.3 * R)) * dt;
        d.r -= R * (0.12 + 1.5 * p * p) * speed * Math.min(1, d.age / 0.5) * dt;
        d.y += R * d.rise * (0.14 + 0.5 * p) * speed * dt + Math.sin(clock * 2.3 + d.seed * 40) * R * 0.03 * dt;
        d.x = orb.x + Math.cos(d.th) * d.r; d.z = orb.z + Math.sin(d.th) * d.r * (0.85 + 0.15 * smooth(1 - (d.r - want) / (2 * R)));
        wob = 1 + 0.13 * Math.sin(d.age * 9 + d.seed * 6.283);
        if (d.r <= want) { d.mode = 0; liveBead--; d.strand = Math.floor(d.seed * STRANDS); d.rise = rnd(0.85, 1.2); d.seed = rnd(0.3, 1); } // caught by the vortex
        else if (d.y > yt + R * 0.4) { d.mode = 2; liveBead--; d.vx = d.vz = 0; d.vy = R * 0.2; }
      } else if (d.mode === 0) {
        // Round and up: each ribbon weaves in and out a little, and follows the tornado's shape.
        const w = spin(d.r), target = rt(d.y) + Math.sin(clock * 1.7 + d.strand * 1.7 + d.y * 0.9 / R) * R * 0.05;
        d.th += w * dt;
        d.r += (target * (0.86 + 0.28 * d.seed) - d.r) * Math.min(1, dt * 7);
        d.y += d.rise * climb * dt;
        d.x = orb.x + Math.cos(d.th) * d.r; d.z = orb.z + Math.sin(d.th) * d.r;
        if (d.y > d.top) { // flung off the top: out, and only a little up
          d.mode = 2;
          const vt = w * d.r * 0.55;
          d.vx = -Math.sin(d.th) * vt + Math.cos(d.th) * R * 0.9; d.vz = Math.cos(d.th) * vt + Math.sin(d.th) * R * 0.9; d.vy = R * 0.5;
        }
      }
      if (d.mode === 2) {
        // Free: thin air slows it, and whatever is left of gravity pulls it down.
        const drag = Math.exp(-dt * (hang > 0 ? 2.6 : 0.5));
        d.vx *= drag; d.vz *= drag; d.vy = d.vy * drag - 22 * grav * dt;
        d.x += d.vx * dt; d.y += d.vy * dt; d.z += d.vz * dt;
        // Back into the river (no splash), or gone far away.
        if ((d.vy < 0 && d.y < surf(d.x, d.z) - d.size) || d.y < -40 || Math.abs(d.x - orb.x) > 150 || Math.abs(d.z - orb.z) > 150) { d.on = false; live--; aSize[i] = 0; continue; }
      }
      pos[i * 3] = d.x; pos[i * 3 + 1] = d.y; pos[i * 3 + 2] = d.z;
      aSize[i] = d.size * wob * Math.min(1, 0.35 + d.age * 5);
    }
    geo.attributes.position!.needsUpdate = true; geo.attributes.aSize!.needsUpdate = true;
    block.position.copy(orb); block.scale.setScalar(R * 0.98);
    shadeMat.uniforms.uVGlow!.value = look.glow;
  };

  /** The nova: every drop is thrown outwards and up; it hangs, then gravity comes back and it rains down. */
  const scatter = (orb: Vector3) => {
    hang = 0.4; grav = 0.04; debtS = debtB = 0;
    for (const d of drops) {
      if (!d.on) continue;
      if (d.mode === 1) liveBead--;
      d.mode = 2;
      const dx = d.x - orb.x, dy = d.y - orb.y, dz = d.z - orb.z, l = Math.hypot(dx, dy, dz) || 1, s = rnd(22, 48);
      d.vx = (dx / l) * s; d.vy = (dy / l) * s * 0.45 + rnd(3, 10); d.vz = (dz / l) * s;
    }
  };

  const prevColor = new Color(), v3 = new Vector3();
  let sceneTex: FramebufferTexture | null = null;
  const num = (u: RiverUniforms | undefined, key: string, or: number) => { const v = u?.[key]?.value; return typeof v === 'number' ? v : or; };
  /** Draw it over the frame already drawn (call right after the main render). `river`: the river's uniforms. */
  const render = (camera: PerspectiveCamera, orb: Vector3, radius: number, skyTurn: number, river?: RiverUniforms) => {
    if (!ok || live <= 0) return;
    renderer.getDrawingBufferSize(size);
    // 0. Keep a copy of the picture so far: it is what shows through the water.
    if (!sceneTex || sceneTex.image.width !== size.x || sceneTex.image.height !== size.y) {
      sceneTex?.dispose();
      sceneTex = new FramebufferTexture(size.x, size.y);
      sceneTex.magFilter = sceneTex.minFilter = LinearFilter;
    }
    renderer.copyFramebufferToTexture(sceneTex);
    const w = Math.max(4, Math.round(size.x * 0.66)), h = Math.max(4, Math.round(size.y * 0.66));
    if (rtA.width !== w || rtA.height !== h) { rtA.setSize(w, h); rtB.setSize(w, h); rtC.setSize(w, h); }
    const prevTarget = renderer.getRenderTarget(), prevAuto = renderer.autoClear, prevAlpha = renderer.getClearAlpha();
    renderer.getClearColor(prevColor);
    renderer.autoClear = false;
    // 1. Distances of the drops.
    const px = h / (2 * Math.tan((camera.fov * Math.PI) / 360)) / Math.max(camera.zoom, 0.0001);
    depthMat.uniforms.uPx!.value = px;
    const ref = -v3.copy(orb).applyMatrix4(camera.matrixWorldInverse).z; // how far the orb is in front of the camera
    depthMat.uniforms.uRef!.value = ref; shadeMat.uniforms.uRef!.value = ref;
    renderer.setRenderTarget(rtA); renderer.setClearColor(0x000000, 0); renderer.clear(true, true, false);
    renderer.render(dropScene, camera);
    // 2. Smooth them, across then down, over about the width of one drop on screen.
    const reachPx = Math.min(3, Math.max(1, ((px * ballSize) / Math.max(1, camera.position.distanceTo(orb))) * 0.2));
    quad.material = blurMat;
    blurMat.uniforms.uFall!.value = 1 / Math.max(ballSize * 2.2, 0.05); // drops within about a drop's width of each other in depth melt together
    blurMat.uniforms.uTex!.value = rtA.texture; blurMat.uniforms.uStep!.value.set(reachPx / w, 0); blurMat.uniforms.uPass!.value = 0;
    renderer.setRenderTarget(rtB); renderer.clear(true, false, false); renderer.render(quadScene, quadCam);
    blurMat.uniforms.uTex!.value = rtB.texture; blurMat.uniforms.uStep!.value.set(0, reachPx / h); blurMat.uniforms.uPass!.value = 1;
    renderer.setRenderTarget(rtC); renderer.clear(true, false, false); renderer.render(quadScene, quadCam);
    // 3. Shade it as the river, over the picture: the river's own live values, read here every frame.
    const U = shadeMat.uniforms;
    quad.material = shadeMat;
    U.uTex!.value = rtC.texture; U.uTexel!.value.set(1 / w, 1 / h);
    U.uInvProj!.value = camera.projectionMatrixInverse;
    U.uViewToWorld!.value.setFromMatrix4(camera.matrixWorld);
    U.uCamPos!.value.setFromMatrixPosition(camera.matrixWorld);
    U.uOrbW!.value.copy(orb);
    U.uOrbR!.value = Math.max(radius, 0.01);
    U.uThick!.value = ballSize * 2.4;
    U.uScene!.value = sceneTex; U.uRefr!.value = (px * ballSize) / Math.max(1, ref) / h; // bends by up to about one drop's width
    U.uSkyTurn!.value = skyTurn;
    U.uReflect!.value = num(river, 'uReflect', 1); U.uBody!.value = num(river, 'uBody', 1); U.uGlintK!.value = num(river, 'uGlintK', 1);
    U.uSilk!.value = num(river, 'uVar', 0) > 3.5 ? num(river, 'uSilk', 1) : 0; U.uClear!.value = num(river, 'uClear', 0);
    U.uGlow!.value = num(river, 'uGlow', 1);
    const mirror = river?.uMirror?.value as { x?: number } | undefined;
    U.uMirror!.value = typeof mirror?.x === 'number' ? mirror.x : 0;
    renderer.setRenderTarget(prevTarget); renderer.render(quadScene, quadCam);
    renderer.autoClear = prevAuto; renderer.setClearColor(prevColor, prevAlpha);
  };

  const disposables: { dispose: () => void }[] = [geo, depthMat, blockGeo, blockMat, rtA, rtB, rtC, quadGeo, blurMat, shadeMat, { dispose: () => sceneTex?.dispose() }];
  return { update, scatter, render, funnel, ok, disposables };
}
