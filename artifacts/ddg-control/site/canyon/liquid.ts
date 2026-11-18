import {
  BufferAttribute, BufferGeometry, Color, FloatType, HalfFloatType, LinearFilter, Matrix3, Mesh, MeshBasicMaterial, NearestFilter,
  OrthographicCamera, PlaneGeometry, Points, RGBAFormat, Scene, ShaderMaterial, SphereGeometry, Vector2, Vector3, Vector4,
  WebGLRenderTarget,
} from 'three';
import type { PerspectiveCamera, WebGLRenderer } from 'three';
import { SKY_GLSL } from './sky';

/**
 * The liquid vortex (Markus, 18 Nov): while the orb charges, water is drawn up off the river and swirls round
 * it as a tornado of liquid, blobs running together into bigger streams; the nova throws it all away and it
 * falls back into the river without a splash.
 *
 * How it looks like one liquid and not a cloud of balls ("screen-space fluid", as games do it):
 *  1. every drop is drawn as a small ball, but only its distance from the camera is kept (off screen);
 *  2. those distances are smoothed, so balls that touch melt into one surface;
 *  3. that smooth surface is lit like the river: dark water, the night sky mirrored at grazing angles, and
 *     the orb's light shining on it and glowing through it.
 * The drops themselves move on the CPU: each belongs to one of a few strands, lifts off the river at the
 * strand's foot, spirals up round the orb faster and tighter as the charge grows, and at the top is flung
 * out and falls back. The river dips into a funnel under the orb (`funnel`, used by water.ts).
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
const DEPTH_FRAG = /* glsl */ `
uniform mat4 projectionMatrix; // (three.js only declares it for the vertex stage)
varying vec3 vView; varying float vR;
void main() {
  vec2 c = gl_PointCoord * 2.0 - 1.0; c.y = -c.y;
  float r2 = dot(c, c);
  if (r2 > 1.0) discard;
  vec3 p = vView + vec3(c * vR, sqrt(1.0 - r2) * vR);
  vec4 clip = projectionMatrix * vec4(p, 1.0);
  gl_FragDepth = clip.z / clip.w * 0.5 + 0.5;
  gl_FragColor = vec4(-p.z, 1.0, 0.0, 1.0);
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
  // and r already filled in beside the liquid.
  vec4 c = texture2D(uTex, vUv);
  float sum = 0.0, wsum = 0.0, cov = 0.0, csum = 0.0;
  for (int i = -7; i <= 7; i++) {
    float fi = float(i);
    vec4 s = texture2D(uTex, vUv + uStep * fi);
    float g = exp(-fi * fi / 18.0);
    cov += (uPass > 0.5 ? s.b : s.g) * g; csum += g;
    if ((uPass > 0.5 ? s.r : s.g - 0.5) <= 0.0) continue;
    float w = g;
    if (c.g > 0.5) { float dz = (s.r - c.r) * uFall; w *= exp(-dz * dz); }
    sum += s.r * w; wsum += w;
  }
  float d = wsum > 0.0 ? sum / wsum : 0.0;
  gl_FragColor = vec4(d, c.g, cov / csum, 1.0);
}`;
// Light the smoothed surface like the river.
const SHADE_FRAG = /* glsl */ `
uniform sampler2D uTex; uniform vec2 uTexel; uniform mat4 uInvProj; uniform mat3 uViewToWorld;
uniform vec3 uOrb; uniform float uOrbR; uniform float uGlow; uniform float uFade;
varying vec2 vUv;
${SKY_GLSL}
vec3 viewAt(vec2 uv, float z) {
  vec4 v = uInvProj * vec4(uv * 2.0 - 1.0, -1.0, 1.0); v.xyz /= v.w;
  return v.xyz * (z / -v.z);
}
void main() {
  vec4 c = texture2D(uTex, vUv);
  float cover = smoothstep(0.35, 0.65, c.b);
  if (cover <= 0.01 || c.r <= 0.0) discard;
  vec3 P = viewAt(vUv, c.r);
  float zr = texture2D(uTex, vUv + vec2(uTexel.x, 0.0)).r, zl = texture2D(uTex, vUv - vec2(uTexel.x, 0.0)).r;
  float zu = texture2D(uTex, vUv + vec2(0.0, uTexel.y)).r, zd = texture2D(uTex, vUv - vec2(0.0, uTexel.y)).r;
  vec3 dx = abs(zr - c.r) < abs(c.r - zl) && zr > 0.0 ? viewAt(vUv + vec2(uTexel.x, 0.0), zr) - P : P - viewAt(vUv - vec2(uTexel.x, 0.0), zl > 0.0 ? zl : c.r);
  vec3 dy = abs(zu - c.r) < abs(c.r - zd) && zu > 0.0 ? viewAt(vUv + vec2(0.0, uTexel.y), zu) - P : P - viewAt(vUv - vec2(0.0, uTexel.y), zd > 0.0 ? zd : c.r);
  vec3 n = normalize(cross(dx, dy));
  if (n.z < 0.0) n = -n;
  vec3 v = normalize(-P);
  float facing = max(dot(n, v), 0.0);
  float fres = 0.04 + 0.96 * pow(1.0 - facing, 5.0);
  vec3 r = uViewToWorld * reflect(-v, n);
  vec3 sky = skyColor(normalize(vec3(r.x, abs(r.y) + 0.02, r.z))) * 2.5;
  // The orb is the light: shining on the water, a hot highlight, and light glowing through the thinner water.
  vec3 L = uOrb - P; float dist = length(L); L /= dist;
  float att = 1.0 / (1.0 + dist * dist / (uOrbR * uOrbR * 12.0));
  vec3 lightCol = vec3(0.45, 0.75, 1.0) * (0.9 + uGlow);
  float diff = max(dot(n, L), 0.0);
  float spec = pow(max(dot(reflect(-L, n), v), 0.0), 90.0);
  float through = pow(max(dot(-L, v), 0.0), 3.0);
  vec3 body = vec3(0.02, 0.08, 0.14) + lightCol * (0.35 * diff + 0.7 * through + 0.25) * att;
  vec3 col = mix(body, sky, fres) + lightCol * spec * 2.5 * att + vec3(0.75, 0.9, 1.0) * spec * 0.35;
  gl_FragColor = vec4(col, cover * mix(0.6, 0.95, fres) * uFade); // see-through where you look straight in
}`;

type Drop = { on: boolean; free: boolean; strand: number; th: number; r: number; x: number; y: number; z: number; vx: number; vy: number; vz: number; size: number; rise: number; top: number };
export type LiquidLook = { amount: number; speed: number; size: number; reach: number; glow: number };

const STRANDS = 5;

export function makeLiquid(renderer: WebGLRenderer) {
  const small = typeof innerWidth === 'number' && innerWidth < 700;
  const N = small ? 350 : 700;
  // Needs a float target to keep distances; without one (rare), the liquid simply stays off.
  const ok = renderer.extensions.has('EXT_color_buffer_float') || renderer.extensions.has('EXT_color_buffer_half_float');

  const drops: Drop[] = Array.from({ length: N }, () => ({ on: false, free: false, strand: 0, th: 0, r: 0, x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, size: 0, rise: 0, top: 0 }));
  const pos = new Float32Array(N * 3), aSize = new Float32Array(N);
  const geo = new BufferGeometry();
  geo.setAttribute('position', new BufferAttribute(pos, 3)); geo.setAttribute('aSize', new BufferAttribute(aSize, 1));
  const depthMat = new ShaderMaterial({ uniforms: { uPx: { value: 600 } }, vertexShader: DEPTH_VERT, fragmentShader: DEPTH_FRAG, depthTest: true, depthWrite: true });
  const points = new Points(geo, depthMat); points.frustumCulled = false;
  // The orb as a hidden blocker, so liquid behind it is hidden.
  const blockGeo = new SphereGeometry(1, 24, 16), blockMat = new MeshBasicMaterial({ colorWrite: false });
  const block = new Mesh(blockGeo, blockMat);
  const dropScene = new Scene(); dropScene.add(points, block);

  // Full floats where they can also be smoothly sampled (most computers); half floats otherwise.
  const type = renderer.extensions.has('EXT_color_buffer_float') && renderer.extensions.has('OES_texture_float_linear') ? FloatType : HalfFloatType;
  const mk = (smooth: boolean, depth: boolean) => {
    const t = new WebGLRenderTarget(4, 4, { type, format: RGBAFormat, minFilter: smooth ? LinearFilter : NearestFilter, magFilter: smooth ? LinearFilter : NearestFilter, depthBuffer: depth });
    t.texture.generateMipmaps = false;
    return t;
  };
  const rtA = mk(false, true), rtB = mk(false, false), rtC = mk(true, false); // drops; smoothed across; smoothed both ways
  const quadGeo = new PlaneGeometry(1, 1);
  const blurMat = new ShaderMaterial({ uniforms: { uTex: { value: null }, uStep: { value: new Vector2() }, uFall: { value: 2 }, uPass: { value: 0 } }, vertexShader: QUAD_VERT, fragmentShader: BLUR_FRAG, depthTest: false, depthWrite: false });
  const shadeMat = new ShaderMaterial({
    uniforms: { uTex: { value: null }, uTexel: { value: new Vector2() }, uInvProj: { value: null }, uViewToWorld: { value: new Matrix3() }, uOrb: { value: new Vector3() }, uOrbR: { value: 1 }, uGlow: { value: 1 }, uFade: { value: 1 }, uSkyTurn: { value: 0 } },
    vertexShader: QUAD_VERT, fragmentShader: SHADE_FRAG, transparent: true, depthTest: false, depthWrite: false,
  });
  const quad = new Mesh(quadGeo, blurMat); quad.frustumCulled = false;
  const quadScene = new Scene(); quadScene.add(quad);
  const quadCam = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const size = new Vector2();

  let live = 0, emitDebt = 0, clock = 0;
  const funnel = new Vector4(0, 0, 0, 1);
  const rnd = (a: number, b: number) => a + Math.random() * (b - a);
  const strandAt = (k: number) => (k / STRANDS) * Math.PI * 2 + clock * 0.35 * (k % 2 ? 1 : 0.8);

  /**
   * `p` 0..1: how charged (0 = none, drops fall away). `orb`, `radius`: where the orb is. `ground(x, z)`: the
   * height of the river (or land) there, where drops start and end.
   */
  const update = (dt: number, p: number, orb: Vector3, radius: number, look: LiquidLook, ground: (x: number, z: number) => number) => {
    if (!ok) return;
    dt = Math.min(dt, 0.05); clock += dt;
    const R = Math.max(radius, 0.01), sizeK = Math.sqrt(Math.max(0.3, look.size)), reach = look.reach, speed = 0.4 + 0.3 * look.speed;
    // The river dips into a funnel under the orb as the water is drawn up.
    funnel.set(orb.x, orb.z, p * R * 0.9 * Math.min(1.5, look.amount / 3 + 0.3), R * (1.8 + reach));
    const dip = (x: number, z: number) => funnel.z * Math.exp(-((x - orb.x) ** 2 + (z - orb.z) ** 2) / (funnel.w * funnel.w));
    // New drops lift off the river at the feet of the strands.
    const want = p > 0.03 ? N * Math.min(1, p * 1.3) * Math.min(1, look.amount / 3) : 0;
    emitDebt += Math.max(0, want - live) * dt * 1.6;
    for (let i = 0; i < N && emitDebt >= 1; i++) {
      const d = drops[i]!;
      if (d.on) continue;
      emitDebt -= 1;
      const k = Math.floor(Math.random() * STRANDS);
      d.on = true; d.free = false; d.strand = k;
      d.th = strandAt(k) + rnd(-0.12, 0.12);
      d.r = R * (1.4 + 0.6 * reach) * rnd(0.9, 1.1);
      d.x = orb.x + Math.cos(d.th) * d.r; d.z = orb.z + Math.sin(d.th) * d.r;
      d.y = ground(d.x, d.z) - dip(d.x, d.z) + 0.05;
      d.size = R * rnd(0.035, 0.07) * sizeK * (Math.random() < 0.08 ? 1.8 : 1);
      d.rise = rnd(0.8, 1.3); d.top = orb.y + R * rnd(1.2, 2.4);
      live++;
    }
    for (let i = 0; i < N; i++) {
      const d = drops[i]!;
      if (!d.on) continue;
      if (!d.free) {
        if (p < 0.03) { // let go: it falls
          d.free = true; d.vx = -Math.sin(d.th) * d.r * 1.5; d.vz = Math.cos(d.th) * d.r * 1.5; d.vy = 0;
        } else {
          // Round and up: faster and tighter as the charge grows; each strand weaves in and out.
          const rt = R * (1.2 + 0.35 * reach * (1 - 0.4 * p)) + Math.sin(clock * 1.3 + d.strand * 1.7) * R * 0.25;
          const w = speed * (0.7 + 2.2 * p) * Math.pow((R * 2.2) / Math.max(d.r, R), 0.8);
          d.th += w * dt;
          d.r += (rt - d.r) * Math.min(1, dt * (0.8 + 1.5 * p));
          d.y += R * d.rise * (0.5 + 1.3 * p) * speed * dt;
          d.x = orb.x + Math.cos(d.th) * d.r; d.z = orb.z + Math.sin(d.th) * d.r;
          d.y += Math.sin(clock * 3 + d.th * 2) * R * 0.15 * dt;
          if (d.y > d.top) { // flung off the top, out and down
            d.free = true;
            const vt = w * d.r;
            d.vx = -Math.sin(d.th) * vt + Math.cos(d.th) * R * 0.8; d.vz = Math.cos(d.th) * vt + Math.sin(d.th) * R * 0.8; d.vy = R * 0.6;
          }
        }
      }
      if (d.free) {
        d.vy -= 22 * dt;
        d.x += d.vx * dt; d.y += d.vy * dt; d.z += d.vz * dt;
        // Back into the river (no splash), or gone far away.
        if (d.y < ground(d.x, d.z) - dip(d.x, d.z) - d.size || Math.abs(d.x - orb.x) > 150 || Math.abs(d.z - orb.z) > 150) { d.on = false; live--; }
      }
      pos[i * 3] = d.x; pos[i * 3 + 1] = d.y; pos[i * 3 + 2] = d.z; aSize[i] = d.on ? d.size : 0;
    }
    for (let i = 0; i < N; i++) if (!drops[i]!.on) aSize[i] = 0;
    geo.attributes.position!.needsUpdate = true; geo.attributes.aSize!.needsUpdate = true;
    block.position.copy(orb); block.scale.setScalar(R * 0.98);
    shadeMat.uniforms.uGlow!.value = look.glow;
  };

  /** The nova: every drop is thrown outwards and up, and falls back. */
  const scatter = (orb: Vector3) => {
    for (const d of drops) {
      if (!d.on) continue;
      d.free = true;
      const dx = d.x - orb.x, dy = d.y - orb.y, dz = d.z - orb.z, l = Math.hypot(dx, dy, dz) || 1, s = rnd(30, 55);
      d.vx = (dx / l) * s; d.vy = (dy / l) * s * 0.5 + rnd(6, 14); d.vz = (dz / l) * s;
    }
  };

  const v3 = new Vector3(), prevColor = new Color();
  /** Draw it over the frame already drawn (call right after the main render). */
  const render = (camera: PerspectiveCamera, orb: Vector3, radius: number, skyTurn: number) => {
    if (!ok || live <= 0) return;
    renderer.getDrawingBufferSize(size);
    const w = Math.max(4, Math.round(size.x * 0.6)), h = Math.max(4, Math.round(size.y * 0.6));
    if (rtA.width !== w || rtA.height !== h) { rtA.setSize(w, h); rtB.setSize(w, h); rtC.setSize(w, h); }
    const prevTarget = renderer.getRenderTarget(), prevAuto = renderer.autoClear, prevAlpha = renderer.getClearAlpha();
    renderer.getClearColor(prevColor);
    renderer.autoClear = false;
    // 1. Distances of the drops.
    depthMat.uniforms.uPx!.value = h / (2 * Math.tan((camera.fov * Math.PI) / 360)) / Math.max(camera.zoom, 0.0001);
    renderer.setRenderTarget(rtA); renderer.setClearColor(0x000000, 0); renderer.clear(true, true, false);
    renderer.render(dropScene, camera);
    // 2. Smooth them, across then down.
    quad.material = blurMat;
    blurMat.uniforms.uFall!.value = 1.5 / Math.max(radius * 0.25, 0.05);
    blurMat.uniforms.uTex!.value = rtA.texture; blurMat.uniforms.uStep!.value.set(1.3 / w, 0); blurMat.uniforms.uPass!.value = 0;
    renderer.setRenderTarget(rtB); renderer.clear(true, false, false); renderer.render(quadScene, quadCam);
    blurMat.uniforms.uTex!.value = rtB.texture; blurMat.uniforms.uStep!.value.set(0, 1.3 / h); blurMat.uniforms.uPass!.value = 1;
    renderer.setRenderTarget(rtC); renderer.clear(true, false, false); renderer.render(quadScene, quadCam);
    // 3. Light it, over the picture.
    quad.material = shadeMat;
    shadeMat.uniforms.uTex!.value = rtC.texture; shadeMat.uniforms.uTexel!.value.set(1 / w, 1 / h);
    shadeMat.uniforms.uInvProj!.value = camera.projectionMatrixInverse;
    shadeMat.uniforms.uViewToWorld!.value.setFromMatrix4(camera.matrixWorld);
    shadeMat.uniforms.uOrb!.value.copy(v3.copy(orb).applyMatrix4(camera.matrixWorldInverse));
    shadeMat.uniforms.uOrbR!.value = Math.max(radius, 0.01);
    shadeMat.uniforms.uFade!.value = 1;
    shadeMat.uniforms.uSkyTurn!.value = skyTurn;
    renderer.setRenderTarget(prevTarget); renderer.render(quadScene, quadCam);
    renderer.autoClear = prevAuto; renderer.setClearColor(prevColor, prevAlpha);
  };

  const disposables: { dispose: () => void }[] = [geo, depthMat, blockGeo, blockMat, rtA, rtB, rtC, quadGeo, blurMat, shadeMat];
  return { update, scatter, render, funnel, disposables };
}
