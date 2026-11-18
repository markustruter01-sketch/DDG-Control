import {
  AdditiveBlending, BufferAttribute, BufferGeometry, InstancedBufferAttribute, InstancedMesh, Matrix4, Points, ShaderMaterial,
  SphereGeometry, Vector3,
} from 'three';
import { SKY_GLSL } from './sky';

/**
 * Bubbles on the boiling lake while the orb is held. Built the way game effects artists describe it
 * (realtimevfx.com, polycount, 80.lv foam breakdown, 18 Nov 2026):
 *  - each bubble is a dome (part of a sphere) sitting in the water, not a full ball;
 *  - its skin reflects the night sky (Fresnel: clear face-on, mirror-like at the edge) with a thin-film
 *    rainbow sheen whose bands swirl and drift, and the film thins (sheen grows) just before it goes;
 *  - it swells, wobbles, stretches a little upwards, then bursts by dissolving its skin with noise
 *    (alpha-test style), throwing a few droplets up and leaving a ring on the water (water.ts);
 *  - bubbles are spaced out (no two start on top of each other) and come in mixed sizes, many small.
 */

const MAX = 220;
const DROPS = 360;

const VERT = /* glsl */ `
attribute float aFade;
attribute float aSeed;
attribute float aPop;
varying vec3 vWN; varying vec3 vWP; varying vec3 vObj;
varying float vFade; varying float vSeed; varying float vPop;
void main() {
  vFade = aFade; vSeed = aSeed; vPop = aPop; vObj = position;
  vec4 wp = modelMatrix * instanceMatrix * vec4(position, 1.0);
  vWP = wp.xyz;
  vWN = normalize(mat3(modelMatrix) * mat3(instanceMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * wp;
}`;

const FRAG = /* glsl */ `
uniform float uBright;
uniform float uTime;
varying vec3 vWN; varying vec3 vWP; varying vec3 vObj;
varying float vFade; varying float vSeed; varying float vPop;
${SKY_GLSL}
float bh(vec3 p) { return fract(sin(dot(p, vec3(12.9898, 78.233, 37.719))) * 43758.5453); }
float bnoise(vec3 p) {
  vec3 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(bh(i), bh(i + vec3(1,0,0)), f.x), mix(bh(i + vec3(0,1,0)), bh(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(bh(i + vec3(0,0,1)), bh(i + vec3(1,0,1)), f.x), mix(bh(i + vec3(0,1,1)), bh(i + vec3(1,1,1)), f.x), f.y), f.z);
}
void main() {
  // Bursting: the skin dissolves from a random point outwards (noise threshold), with a bright torn edge.
  float tear = bnoise(vObj * 5.0 + vSeed * 17.0) * 0.7 + (1.0 - vObj.y) * 0.3;
  if (tear < vPop) discard;
  float edge = vPop > 0.0 ? smoothstep(0.12, 0.0, tear - vPop) : 0.0;

  vec3 n = normalize(vWN), v = normalize(cameraPosition - vWP);
  float facing = abs(dot(n, v));
  float fres = 0.03 + 0.97 * pow(1.0 - facing, 5.0);
  vec3 r = reflect(-v, n);
  vec3 sky = skyColor(normalize(vec3(r.x, abs(r.y) + 0.02, r.z))) * 2.2;
  // Thin film: thickness varies over the skin and drifts; it thins as the bubble nears its end (vFade low).
  float thick = 0.35 + 0.5 * bnoise(vObj * 2.5 + vec3(0.0, uTime * 0.4, vSeed * 9.0)) - 0.25 * (1.0 - vFade);
  vec3 film = 0.5 + 0.5 * cos(6.283 * (thick * 2.2 + facing * 0.6 + vec3(0.0, 0.33, 0.67)));
  float spec = pow(max(dot(r, normalize(vec3(-0.4, 0.8, 0.45))), 0.0), 60.0);
  vec3 col = sky * fres + film * fres * 0.55 + vec3(1.0) * spec * 1.5 + vec3(0.8, 0.95, 1.0) * edge;
  float a = clamp(fres * 0.9 + spec + edge + 0.03, 0.0, 1.0) * uBright * min(1.0, vFade * 3.0);
  gl_FragColor = vec4(col * a, a);
}`;

const DROP_VERT = /* glsl */ `
attribute float aLife;
uniform float uPx;
varying float vLife;
void main() {
  vLife = aLife;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = aLife > 0.0 ? uPx * 0.05 / max(-mv.z, 0.1) : 0.0;
}`;
const DROP_FRAG = /* glsl */ `
varying float vLife;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.1, d) * vLife;
  gl_FragColor = vec4(vec3(0.8, 0.93, 1.0) * a, 1.0);
}`;

type Bubble = { x: number; y: number; z: number; size: number; age: number; life: number; seed: number; popped: boolean };
type Drop = { x: number; y: number; z: number; vx: number; vy: number; vz: number; age: number; life: number };

export function makeBubbles() {
  const geo = new SphereGeometry(1, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.6); // a dome: the part above water
  const fade = new InstancedBufferAttribute(new Float32Array(MAX), 1);
  const seeds = new InstancedBufferAttribute(new Float32Array(MAX), 1);
  const popA = new InstancedBufferAttribute(new Float32Array(MAX), 1);
  geo.setAttribute('aFade', fade); geo.setAttribute('aSeed', seeds); geo.setAttribute('aPop', popA);
  const mat = new ShaderMaterial({
    uniforms: { uBright: { value: 1 }, uTime: { value: 0 }, uSkyTurn: { value: 0 } },
    vertexShader: VERT, fragmentShader: FRAG, transparent: true, depthWrite: false, premultipliedAlpha: true,
  });
  const mesh = new InstancedMesh(geo, mat, MAX);
  mesh.frustumCulled = false; mesh.renderOrder = 2; mesh.count = 0;

  // Droplets thrown up when a bubble bursts.
  const dPos = new Float32Array(DROPS * 3), dLife = new Float32Array(DROPS);
  const dGeo = new BufferGeometry();
  dGeo.setAttribute('position', new BufferAttribute(dPos, 3)); dGeo.setAttribute('aLife', new BufferAttribute(dLife, 1));
  const dMat = new ShaderMaterial({
    uniforms: { uPx: { value: 800 } }, vertexShader: DROP_VERT, fragmentShader: DROP_FRAG,
    transparent: true, depthWrite: false, blending: AdditiveBlending,
  });
  const drops = new Points(dGeo, dMat); drops.frustumCulled = false; drops.renderOrder = 3;

  const live: Bubble[] = [];
  const flying: Drop[] = [];
  const m = new Matrix4();
  let owed = 0, time = 0;

  /**
   * `strength` 0..1. `look`: amount, size, speed, shine, droplets. `place()` gives a spot on the water or null.
   * `onPop(x, z, size)` as each bursts. `pxScale`: drawing-buffer pixels per world unit at distance 1.
   */
  const update = (dt: number, strength: number, look: { amount: number; size: number; speed: number; bright: number; drops: number },
    place: () => Vector3 | null, onPop: (x: number, z: number, size: number) => void, pxScale: number, skyTurn: number) => {
    time += dt;
    owed += dt * strength * look.amount * 90;
    let tries = 0;
    while (owed >= 1 && live.length < MAX && tries++ < 40) {
      const at = place();
      if (!at) continue;
      // Mixed sizes, mostly small; never right on top of another bubble.
      const size = look.size * (0.06 + 0.3 * Math.random() ** 2.5);
      if (live.some((b) => (b.x - at.x) ** 2 + (b.z - at.z) ** 2 < (b.size + size) ** 2)) continue;
      owed -= 1;
      live.push({ x: at.x, y: at.y, z: at.z, size, age: 0, life: (0.6 + Math.random() * 1.2 + size * 2) / look.speed, seed: Math.random(), popped: false });
    }
    if (owed > 5) owed = 5;
    let n = 0;
    for (let i = live.length - 1; i >= 0; i--) {
      const b = live[i]!;
      b.age += dt;
      const t = b.age / b.life;
      if (t >= 1) { live.splice(i, 1); continue; }
      const grow = Math.min(1, t / 0.7);
      const burst = Math.max(0, (t - 0.84) / 0.16);
      if (burst > 0 && !b.popped) {
        b.popped = true; onPop(b.x, b.z, b.size);
        const k = Math.round(look.drops * (2 + b.size * 30));
        for (let j = 0; j < k && flying.length < DROPS; j++) {
          const a = Math.random() * Math.PI * 2, sp = (0.6 + Math.random()) * (0.8 + b.size * 6);
          flying.push({ x: b.x, y: b.y + b.size * 0.4, z: b.z, vx: Math.cos(a) * sp * 0.35, vy: sp * (1 + Math.random()), vz: Math.sin(a) * sp * 0.35, age: 0, life: 0.35 + Math.random() * 0.35 });
        }
      }
      // Swell (ease out), wobble, and a slight upward stretch just before it goes.
      const wob = 1 + 0.07 * Math.sin(b.age * 21 + b.seed * 40) * (1 - burst);
      const r = b.size * (0.2 + 0.8 * (1 - (1 - grow) ** 2));
      const stretch = 1 + 0.18 * Math.max(0, (t - 0.7) / 0.14) * (1 - burst);
      m.makeScale(r * wob, r * stretch / wob, r * wob).setPosition(b.x, b.y - r * 0.3, b.z);
      mesh.setMatrixAt(n, m);
      fade.setX(n, 1 - Math.max(0, (t - 0.6) / 0.24) * 0.6);
      seeds.setX(n, b.seed);
      popA.setX(n, burst > 0 ? 0.05 + burst * 1.0 : 0);
      n++;
    }
    mesh.count = n; mesh.visible = n > 0;
    mat.uniforms.uBright!.value = look.bright; mat.uniforms.uTime!.value = time; mat.uniforms.uSkyTurn!.value = skyTurn;
    mesh.instanceMatrix.needsUpdate = true; fade.needsUpdate = true; seeds.needsUpdate = true; popA.needsUpdate = true;

    // Droplets: thrown up, fall back under gravity, fade.
    let d = 0;
    for (let i = flying.length - 1; i >= 0; i--) {
      const p = flying[i]!;
      p.age += dt;
      if (p.age >= p.life) { flying.splice(i, 1); continue; }
      p.vy -= 9.8 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt;
      dPos[d * 3] = p.x; dPos[d * 3 + 1] = p.y; dPos[d * 3 + 2] = p.z; dLife[d] = 1 - p.age / p.life;
      d++;
    }
    for (let i = d; i < DROPS; i++) dLife[i] = 0;
    dGeo.setDrawRange(0, d);
    drops.visible = d > 0;
    dMat.uniforms.uPx!.value = pxScale;
    dGeo.attributes.position!.needsUpdate = true; dGeo.attributes.aLife!.needsUpdate = true;
  };
  return { mesh, drops, update, disposables: [geo, mat, dGeo, dMat] as { dispose: () => void }[] };
}
