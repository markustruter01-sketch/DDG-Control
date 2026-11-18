import {
  AdditiveBlending, BufferAttribute, BufferGeometry, Group, InstancedBufferAttribute, InstancedMesh, LineSegments, Matrix4,
  Points, Quaternion, ShaderMaterial, SphereGeometry, Vector3,
} from 'three';
import { SKY_GLSL } from './sky';

/**
 * What the orb pulls in while it charges, and throws out when it goes nova. Made the way water and charge-up
 * effects are described by game effects artists and rain-rendering work (realtimevfx.com, 80.lv, the
 * CESCG droplet paper, the "Rain It In" droplet project; researched 18 Nov 2026):
 *  - water globules: real 3D drops lifted out of the lake, each a sphere stretched along its direction of travel
 *    (faster = longer), shaded as water: dark blue body, the sky mirrored at the edges (Fresnel), a sharp
 *    highlight, mostly solid rather than see-through. A small ring marks where each one leaves the water;
 *  - streaks: thin blue lines pulled into the centre, more and faster towards the end;
 *  - a vortex of droplets spiralling round the orb, and loose ground lifting into the air;
 *  - at the nova everything is flung outwards; drops fall back into the lake (each leaves a ring) and the
 *    ground settles, over the calm-down time.
 * Looks (T.holdFx): 0 none, 1 water globules, 2 vortex, 3 ground lifting, 4 streaks, 5 all of them.
 */

const DROPS = 320, LINES = 260, ROCKS = 160;
type P = { x: number; y: number; z: number; vx: number; vy: number; vz: number; age: number; life: number; size: number; seed: number; out: boolean };

const DROP_VERT = /* glsl */ `
attribute float aFade;
varying vec3 vWN; varying vec3 vWP; varying float vFade;
void main() {
  vFade = aFade;
  vec4 wp = modelMatrix * instanceMatrix * vec4(position, 1.0);
  vWP = wp.xyz;
  vWN = normalize(mat3(modelMatrix) * mat3(instanceMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * wp;
}`;
const DROP_FRAG = /* glsl */ `
uniform float uGlow;
varying vec3 vWN; varying vec3 vWP; varying float vFade;
${SKY_GLSL}
void main() {
  vec3 n = normalize(vWN), v = normalize(cameraPosition - vWP);
  float facing = abs(dot(n, v));
  float fres = 0.04 + 0.96 * pow(1.0 - facing, 4.0);
  vec3 r = reflect(-v, n);
  vec3 sky = skyColor(normalize(vec3(r.x, abs(r.y) + 0.02, r.z))) * 2.5;
  // The body: deep blue in the middle (looking through more water), lighter towards the rim, lit by the orb.
  vec3 body = mix(vec3(0.05, 0.25, 0.55), vec3(0.2, 0.55, 0.95), pow(1.0 - facing, 1.5)) * (0.55 + uGlow);
  float spec = pow(max(dot(r, normalize(vec3(-0.35, 0.85, 0.4))), 0.0), 80.0);
  vec3 col = mix(body, sky + vec3(0.25, 0.45, 0.7) * 0.4, fres) + vec3(1.0) * spec * 1.6;
  gl_FragColor = vec4(col, (0.82 + 0.18 * fres) * vFade);
}`;
const LINE_VERT = /* glsl */ `
attribute float aA;
varying float vA;
void main() { vA = aA; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const LINE_FRAG = /* glsl */ `
varying float vA;
void main() { gl_FragColor = vec4(vec3(0.3, 0.65, 1.0) * vA, 1.0); }`;
const ROCK_VERT = /* glsl */ `
attribute float aA;
uniform float uPx;
varying float vA;
void main() {
  vA = aA;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = aA > 0.0 ? uPx * 0.16 / max(-mv.z, 0.1) : 0.0;
}`;
const ROCK_FRAG = /* glsl */ `
varying float vA;
void main() {
  vec2 q = abs(gl_PointCoord - 0.5);
  if (max(q.x * 1.2, q.y) > 0.42) discard; // a rough chunk, not a dot
  gl_FragColor = vec4(mix(vec3(0.05, 0.06, 0.09), vec3(0.35, 0.6, 0.85), 0.3 * (1.0 - gl_PointCoord.y)), vA);
}`;

export function makeCharge() {
  const group = new Group();
  // Water globules: an instanced sphere, stretched and turned along each drop's travel.
  const dGeo = new SphereGeometry(1, 16, 12);
  const dFade = new InstancedBufferAttribute(new Float32Array(DROPS), 1);
  dGeo.setAttribute('aFade', dFade);
  const dMat = new ShaderMaterial({
    uniforms: { uGlow: { value: 0 }, uSkyTurn: { value: 0 } },
    vertexShader: DROP_VERT, fragmentShader: DROP_FRAG, transparent: true, depthWrite: true,
  });
  const drops = new InstancedMesh(dGeo, dMat, DROPS);
  drops.frustumCulled = false; drops.renderOrder = 6; drops.count = 0;
  // Streaks.
  const lPos = new Float32Array(LINES * 6), lA = new Float32Array(LINES * 2);
  const lGeo = new BufferGeometry();
  lGeo.setAttribute('position', new BufferAttribute(lPos, 3)); lGeo.setAttribute('aA', new BufferAttribute(lA, 1));
  const lMat = new ShaderMaterial({ vertexShader: LINE_VERT, fragmentShader: LINE_FRAG, transparent: true, depthWrite: false, blending: AdditiveBlending });
  const lines = new LineSegments(lGeo, lMat); lines.frustumCulled = false; lines.renderOrder = 7;
  // Ground chunks.
  const rPos = new Float32Array(ROCKS * 3), rA = new Float32Array(ROCKS);
  const rGeo = new BufferGeometry();
  rGeo.setAttribute('position', new BufferAttribute(rPos, 3)); rGeo.setAttribute('aA', new BufferAttribute(rA, 1));
  const rMat = new ShaderMaterial({ uniforms: { uPx: { value: 800 } }, vertexShader: ROCK_VERT, fragmentShader: ROCK_FRAG, transparent: true, depthWrite: false });
  const rocks = new Points(rGeo, rMat); rocks.frustumCulled = false; rocks.renderOrder = 3;
  group.add(drops, lines, rocks);

  const globs: P[] = [], swirls: P[] = [], streaks: P[] = [], chunks: P[] = [];
  let owed = 0;
  const m = new Matrix4(), q = new Quaternion(), up = new Vector3(0, 1, 0), dir = new Vector3(), scl = new Vector3(), pos = new Vector3();
  const c = new Vector3();
  const rand = (a: number, b: number) => a + Math.random() * (b - a);
  const mk = (x: number, y: number, z: number, life: number, size: number): P => ({ x, y, z, vx: 0, vy: 0, vz: 0, age: 0, life, size, seed: Math.random(), out: false });

  /** The nova: everything flies outwards from the orb. */
  const explode = (orb: Vector3, force: number) => {
    for (const list of [globs, swirls, streaks, chunks]) for (const p of list) {
      dir.set(p.x - orb.x, p.y - orb.y, p.z - orb.z);
      if (dir.lengthSq() < 1e-4) dir.set(Math.random() - 0.5, 0.3, Math.random() - 0.5);
      dir.normalize();
      const sp = force * rand(10, 24);
      p.vx = dir.x * sp; p.vy = Math.abs(dir.y) * sp * 0.6 + rand(3, 9) * force; p.vz = dir.z * sp;
      p.out = true; p.age = 0; p.life = rand(1.4, 3);
    }
  };

  /**
   * `power` 0..1. `look`: style, amount, speed. `ground(x, z)`: land or water height there. `waterAt(x, z)`:
   * the water's height, or null on dry land. `onSplash(x, z, size)`: a drop leaving or landing in the lake.
   */
  const update = (dt: number, power: number, orb: Vector3, radius: number, look: { style: number; amount: number; speed: number },
    ground: (x: number, z: number) => number, waterAt: (x: number, z: number) => number | null,
    onSplash: (x: number, z: number, size: number) => void, pxScale: number, skyTurn: number) => {
    const s = Math.round(look.style);
    const want = (k: number) => s === k || s === 5;
    c.copy(orb);
    // Spawn: slow at first, climbing steeply towards the end of the charge.
    owed += dt * look.amount * (power > 0.02 ? 20 + 300 * power * power : 0);
    let guard = 0;
    while (owed >= 1 && guard++ < 60) {
      owed -= 1;
      const kinds = [1, 2, 3, 4].filter(want);
      if (kinds.length === 0) { owed = 0; break; }
      const kind = kinds[Math.floor(Math.random() * kinds.length)]!;
      const a = Math.random() * Math.PI * 2;
      if (kind === 1 && globs.length < DROPS * 0.7) {
        // A globule lifts out of the lake somewhere around the orb (tries a few spots for open water).
        for (let t = 0; t < 5; t++) {
          const r = radius * rand(1.6, 7), x = c.x + Math.cos(a + t) * r, z = c.z + Math.sin(a + t) * r * 0.8, w = waterAt(x, z);
          if (w === null) continue;
          const p = mk(x, w - 0.1, z, rand(2.5, 4), radius * rand(0.025, 0.07));
          p.vy = rand(0.8, 1.8); globs.push(p); onSplash(x, z, p.size * 6); break;
        }
      } else if (kind === 2 && swirls.length < DROPS * 0.3) {
        const r = radius * rand(1.3, 2.6);
        swirls.push(mk(c.x + Math.cos(a) * r, c.y + rand(-0.6, 0.5) * radius, c.z + Math.sin(a) * r, rand(1.5, 2.5), radius * rand(0.015, 0.035)));
      } else if (kind === 3 && chunks.length < ROCKS) {
        const r = radius * rand(1.6, 6), x = c.x + Math.cos(a) * r, z = c.z + Math.sin(a) * r * 0.8;
        chunks.push(mk(x, ground(x, z), z, rand(4, 7), 1));
      } else if (kind === 4 && streaks.length < LINES) {
        const u = rand(-1, 1), sq = Math.sqrt(1 - u * u), r = radius * rand(2.5, 5.5);
        streaks.push(mk(c.x + Math.cos(a) * sq * r, c.y + u * r * 0.8, c.z + Math.sin(a) * sq * r, 1.6, 1));
      }
    }
    if (owed > 10) owed = 10;
    const sp = look.speed * (0.4 + 1.6 * power);
    const pull = (p: P, k: number, swirl: number) => {
      const dx = c.x - p.x, dy = c.y - p.y, dz = c.z - p.z, d = Math.hypot(dx, dy, dz) || 1;
      p.vx += ((dx / d) * k - (dz / d) * swirl) * dt; p.vy += (dy / d) * k * dt; p.vz += ((dz / d) * k + (dx / d) * swirl) * dt;
      const drag = Math.exp(-dt * 1.2); p.vx *= drag; p.vy *= drag; p.vz *= drag;
      return d;
    };
    const fly = (p: P) => { p.vy -= 9.8 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt; };

    // Globules and vortex drops (the same 3D drops).
    let nd = 0;
    const drawDrop = (p: P, fade: number) => {
      if (nd >= DROPS) return;
      const v = Math.hypot(p.vx, p.vy, p.vz);
      dir.set(p.vx, p.vy, p.vz); if (v > 1e-3) dir.divideScalar(v); else dir.set(0, 1, 0);
      q.setFromUnitVectors(up, dir);
      const stretch = 1 + Math.min(2.5, v * 0.12); // faster = longer, as real drops do
      scl.set(p.size / Math.sqrt(stretch), p.size * stretch, p.size / Math.sqrt(stretch));
      m.compose(pos.set(p.x, p.y, p.z), q, scl);
      drops.setMatrixAt(nd, m); dFade.setX(nd, fade); nd++;
    };
    for (const list of [globs, swirls]) {
      for (let i = list.length - 1; i >= 0; i--) {
        const p = list[i]!;
        p.age += dt;
        let dead = p.age > p.life;
        if (p.out) {
          fly(p);
          const w = waterAt(p.x, p.z);
          if (p.vy < 0 && p.y < (w ?? ground(p.x, p.z))) { if (w !== null) onSplash(p.x, p.z, p.size * 8); dead = true; }
        } else if (list === globs) {
          // First a slow lift out of the water, then pulled in along a curve.
          const lift = Math.min(1, p.age / 0.6);
          const d = pull(p, (4 + 26 * power) * sp * lift, (2 + 6 * power) * sp * lift);
          if (lift < 1) p.vy = Math.max(p.vy, 1.2);
          p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt;
          if (d < radius * 0.95) dead = true;
          if (power < 0.01) { p.out = true; p.vx *= 0.3; p.vz *= 0.3; } // let go early: they drop back
        } else {
          const dx = c.x - p.x, dz = c.z - p.z, w = (2.5 + 7 * power) * sp;
          p.vx = -dz * w * 0.35 + dx * 0.25; p.vz = dx * w * 0.35 + dz * 0.25; p.vy = (c.y - p.y) * 0.8;
          p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt;
          if (Math.hypot(dx, c.y - p.y, dz) < radius * 0.95 || power < 0.01) dead = true;
        }
        if (dead) { list.splice(i, 1); continue; }
        drawDrop(p, Math.min(1, p.age * 5) * Math.min(1, (p.life - p.age) * 3));
      }
    }
    drops.count = nd; drops.visible = nd > 0;
    drops.instanceMatrix.needsUpdate = true; dFade.needsUpdate = true;
    dMat.uniforms.uGlow!.value = power; dMat.uniforms.uSkyTurn!.value = skyTurn;

    // Streaks: pulled in fast, with a trail; flung out at the nova.
    let nl = 0;
    for (let i = streaks.length - 1; i >= 0; i--) {
      const p = streaks[i]!;
      p.age += dt;
      const ox = p.x, oy = p.y, oz = p.z;
      let dead = p.age > p.life;
      if (p.out) { p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt; }
      else {
        const d = pull(p, (8 + 40 * power) * sp, 0);
        p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt;
        if (d < radius * 0.95 || power < 0.01) dead = true;
      }
      if (dead) { streaks.splice(i, 1); continue; }
      const a = Math.min(1, p.age * 4) * Math.min(1, (p.life - p.age) * 3) * 0.85;
      lPos.set([p.x, p.y, p.z, p.x - (p.x - ox) * 4, p.y - (p.y - oy) * 4, p.z - (p.z - oz) * 4], nl * 6);
      lA[nl * 2] = a; lA[nl * 2 + 1] = 0; nl++;
    }
    lGeo.setDrawRange(0, nl * 2); lines.visible = nl > 0;
    lGeo.attributes.position!.needsUpdate = true; lGeo.attributes.aA!.needsUpdate = true;

    // Ground chunks: rise and circle while charging; thrown out at the nova; fall back when it ends.
    let nr = 0;
    for (let i = chunks.length - 1; i >= 0; i--) {
      const p = chunks[i]!;
      p.age += dt;
      if (p.out) fly(p);
      else {
        const lift = power > 0.12 ? (0.6 + 2.2 * power) * sp : -4;
        p.vy += (lift - p.vy) * Math.min(1, dt * 2);
        const dx = c.x - p.x, dz = c.z - p.z, w = (0.3 + 1.2 * power) * sp;
        p.vx = -dz * w * 0.12; p.vz = dx * w * 0.12;
        p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt;
      }
      const g = ground(p.x, p.z);
      if ((p.age > 0.5 && p.y < g - 0.2) || p.age > (p.out ? p.life : 30)) { chunks.splice(i, 1); continue; }
      rPos[nr * 3] = p.x; rPos[nr * 3 + 1] = p.y; rPos[nr * 3 + 2] = p.z;
      rA[nr] = Math.min(1, p.age * 4) * (p.out ? Math.min(1, (p.life - p.age) * 2) : 1) * 0.9; nr++;
    }
    rGeo.setDrawRange(0, nr); rocks.visible = nr > 0;
    rGeo.attributes.position!.needsUpdate = true; rGeo.attributes.aA!.needsUpdate = true;
    rMat.uniforms.uPx!.value = pxScale;
  };
  return { group, update, explode, disposables: [dGeo, dMat, lGeo, lMat, rGeo, rMat] as { dispose: () => void }[] };
}
