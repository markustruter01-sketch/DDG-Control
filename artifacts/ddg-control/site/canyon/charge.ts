import {
  AdditiveBlending, BufferAttribute, BufferGeometry, Group, InstancedBufferAttribute, InstancedMesh, Matrix4,
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
 *  - a vortex of droplets spiralling round the orb, and loose ground lifting into the air;
 *  - at the nova everything is flung outwards; drops fall back into the lake (each leaves a ring) and the
 *    ground settles, over the calm-down time.
 * Each effect has its own on/off switch (T.holdFxGlobs, holdFxVortex, holdFxGround, holdFxStreaks).
 */

const DROPS = 320, ROCKS = 160;
type P = {
  x: number; y: number; z: number; vx: number; vy: number; vz: number; age: number; life: number; size: number; seed: number; out: boolean;
  /** Vortex only: its look, angle round the orb, distance out, height, and the last few places it was (its trail). */
  look?: number; th?: number; r?: number; h?: number; trail?: Float32Array; tn?: number;
};

const DROP_VERT = /* glsl */ `
attribute float aFade;
attribute float aMix;
varying vec3 vWN; varying vec3 vWP; varying float vFade; varying float vMix;
void main() {
  vFade = aFade; vMix = aMix;
  vec4 wp = modelMatrix * instanceMatrix * vec4(position, 1.0);
  vWP = wp.xyz;
  vWN = normalize(mat3(modelMatrix) * mat3(instanceMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * wp;
}`;
const DROP_FRAG = /* glsl */ `
uniform float uGlow;
varying vec3 vWN; varying vec3 vWP; varying float vFade; varying float vMix;
${SKY_GLSL}
void main() {
  vec3 n = normalize(vWN), v = normalize(cameraPosition - vWP);
  float facing = abs(dot(n, v));
  float fres = 0.04 + 0.96 * pow(1.0 - facing, 4.0);
  vec3 r = reflect(-v, n);
  vec3 sky = skyColor(normalize(vec3(r.x, abs(r.y) + 0.02, r.z))) * 2.5;
  // Leaving the lake it is lake water: near-black blue, mostly mirroring the sky. As it nears the orb it takes
  // on the orb's colour and light: bright blue, glowing from inside, white at the core (vMix 0 -> 1).
  vec3 lake = mix(vec3(0.006, 0.035, 0.08), vec3(0.03, 0.12, 0.2), pow(1.0 - facing, 2.0));
  vec3 orb = mix(vec3(0.86, 0.97, 1.0), vec3(0.2, 0.55, 1.0), pow(1.0 - facing, 1.2)) * (1.0 + 0.6 * uGlow);
  vec3 body = mix(lake, orb, vMix);
  float spec = pow(max(dot(r, normalize(vec3(-0.35, 0.85, 0.4))), 0.0), 90.0);
  vec3 col = mix(body, sky * (1.0 - 0.6 * vMix) + vec3(0.3, 0.6, 1.0) * 0.3 * vMix, fres * (1.0 - 0.5 * vMix)) + vec3(1.0) * spec * 1.4;
  gl_FragColor = vec4(col, (0.85 + 0.15 * fres) * vFade);
}`;
// Soft glowing points for the vortex looks that are light rather than water: a gaussian spot (wind and sparks),
// or a soft cloud puff with a little noise in it (mist). Added light, so they glow where they overlap.
const GLOW_VERT = /* glsl */ `
attribute float aA;
attribute float aS;
uniform float uPx;
varying float vA; varying float vSeed;
void main() {
  vA = aA; vSeed = fract(position.x * 1.7 + position.z * 3.1);
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = aA > 0.0 ? uPx * aS / max(-mv.z, 0.1) : 0.0;
}`;
const GLOW_FRAG = /* glsl */ `
uniform vec3 uColor; uniform float uCore; uniform float uPuff;
varying float vA; varying float vSeed;
void main() {
  vec2 q = gl_PointCoord - 0.5;
  float d = length(q);
  float soft = exp(-d * d * 18.0);
  float core = exp(-d * d * 160.0) * uCore;
  // Mist: break the round spot up a little so it reads as vapour, not a dot.
  float n = 0.5 + 0.5 * sin(q.x * 13.0 + vSeed * 30.0) * sin(q.y * 11.0 - vSeed * 17.0);
  float a = mix(soft, soft * (0.55 + 0.45 * n), uPuff);
  gl_FragColor = vec4((uColor * a + vec3(1.0) * core) * vA, 1.0);
}`;
const GLOW = 2400, TRAIL = 10;

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
  const dMix = new InstancedBufferAttribute(new Float32Array(DROPS), 1);
  dGeo.setAttribute('aFade', dFade); dGeo.setAttribute('aMix', dMix);
  const dMat = new ShaderMaterial({
    uniforms: { uGlow: { value: 0 }, uSkyTurn: { value: 0 } },
    vertexShader: DROP_VERT, fragmentShader: DROP_FRAG, transparent: true, depthWrite: true,
  });
  const drops = new InstancedMesh(dGeo, dMat, DROPS);
  drops.frustumCulled = false; drops.renderOrder = 6; drops.count = 0;
  // Ground chunks.
  const rPos = new Float32Array(ROCKS * 3), rA = new Float32Array(ROCKS);
  const rGeo = new BufferGeometry();
  rGeo.setAttribute('position', new BufferAttribute(rPos, 3)); rGeo.setAttribute('aA', new BufferAttribute(rA, 1));
  const rMat = new ShaderMaterial({ uniforms: { uPx: { value: 800 } }, vertexShader: ROCK_VERT, fragmentShader: ROCK_FRAG, transparent: true, depthWrite: false });
  const rocks = new Points(rGeo, rMat); rocks.frustumCulled = false; rocks.renderOrder = 3;
  // Glow points for the light-made vortex looks.
  const gPos = new Float32Array(GLOW * 3), gA = new Float32Array(GLOW), gS = new Float32Array(GLOW);
  const gGeo = new BufferGeometry();
  gGeo.setAttribute('position', new BufferAttribute(gPos, 3)); gGeo.setAttribute('aA', new BufferAttribute(gA, 1)); gGeo.setAttribute('aS', new BufferAttribute(gS, 1));
  const gMat = new ShaderMaterial({
    uniforms: { uPx: { value: 800 }, uColor: { value: new Vector3(0.5, 0.8, 1.0) }, uCore: { value: 0 }, uPuff: { value: 0 } },
    vertexShader: GLOW_VERT, fragmentShader: GLOW_FRAG, transparent: true, depthWrite: false, blending: AdditiveBlending,
  });
  const glow = new Points(gGeo, gMat); glow.frustumCulled = false; glow.renderOrder = 7;
  group.add(drops, rocks, glow);

  const globs: P[] = [], swirls: P[] = [], chunks: P[] = [];
  let owed = 0;
  const m = new Matrix4(), q = new Quaternion(), up = new Vector3(0, 1, 0), dir = new Vector3(), scl = new Vector3(), pos = new Vector3();
  const c = new Vector3();
  const rand = (a: number, b: number) => a + Math.random() * (b - a);
  const mk = (x: number, y: number, z: number, life: number, size: number): P => ({ x, y, z, vx: 0, vy: 0, vz: 0, age: 0, life, size, seed: Math.random(), out: false });

  /** The nova: everything flies outwards from the orb. */
  const explode = (orb: Vector3, force: number) => {
    for (const list of [globs, swirls, chunks]) for (const p of list) {
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
  const update = (dt: number, power: number, orb: Vector3, radius: number, look: { on: [boolean, boolean, boolean]; amount: number; speed: number; vortex: { look: number; size: number; reach: number; trail: number; glow: number } },
    ground: (x: number, z: number) => number, waterAt: (x: number, z: number) => number | null,
    onSplash: (x: number, z: number, size: number) => void, pxScale: number, skyTurn: number) => {
    const want = (k: number) => look.on[k - 1] === true;
    c.copy(orb);
    // Spawn: slow at first, climbing steeply towards the end of the charge.
    owed += dt * look.amount * (power > 0.02 ? 20 + 300 * power * power : 0);
    let guard = 0;
    while (owed >= 1 && guard++ < 60) {
      owed -= 1;
      const kinds = [1, 2, 3].filter(want);
      if (kinds.length === 0) { owed = 0; break; }
      const kind = kinds[Math.floor(Math.random() * kinds.length)]!;
      const a = Math.random() * Math.PI * 2;
      if (kind === 1 && globs.length < DROPS * 0.7) {
        // A globule lifts out of the lake somewhere around the orb (tries a few spots for open water).
        for (let t = 0; t < 5; t++) {
          const r = radius * rand(1.6, 7), x = c.x + Math.cos(a + t) * r, z = c.z + Math.sin(a + t) * r * 0.8, w = waterAt(x, z);
          if (w === null) continue;
          const p = mk(x, w - 0.1, z, rand(2.5, 4), radius * rand(0.035, 0.09));
          p.vy = rand(0.8, 1.8); globs.push(p); onSplash(x, z, p.size * 6); break;
        }
      } else if (kind === 2 && swirls.length < 260) {
        // A vortex particle: placed round the orb by angle, distance and height, and moved by those.
        const V = look.vortex, vl = Math.round(V.look);
        const p = mk(0, 0, 0, rand(1.6, 2.8), radius * rand(0.015, 0.035) * V.size);
        p.look = vl; p.th = a; p.tn = 0; p.trail = new Float32Array(TRAIL * 3);
        if (vl === 4) { // water spout: starts on the lake under and round the orb and spirals up into it
          p.r = radius * rand(1.4, 2.8) * V.reach; p.h = (waterAt(c.x, c.z) ?? c.y - radius * 2) - c.y; p.life = rand(1.8, 3);
        } else {
          p.r = radius * rand(1.25, 2.4) * V.reach; p.h = rand(-0.7, 0.6) * radius;
        }
        if (vl === 3) { p.size = radius * rand(0.5, 1.1) * V.size; p.life = rand(2.5, 4); } // mist: big soft puffs
        p.x = c.x + Math.cos(a) * p.r; p.y = c.y + p.h; p.z = c.z + Math.sin(a) * p.r;
        for (let k = 0; k < TRAIL; k++) p.trail.set([p.x, p.y, p.z], k * 3);
        swirls.push(p);
      } else if (kind === 3 && chunks.length < ROCKS) {
        const r = radius * rand(1.6, 6), x = c.x + Math.cos(a) * r, z = c.z + Math.sin(a) * r * 0.8;
        chunks.push(mk(x, ground(x, z), z, rand(4, 7), 1));
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
      // How far along from the lake to the orb: 0 at the water, 1 at the orb's skin.
      const d = Math.hypot(c.x - p.x, c.y - p.y, c.z - p.z);
      drops.setMatrixAt(nd, m); dFade.setX(nd, fade); dMix.setX(nd, Math.min(1, Math.max(0, (radius * 4 - d) / (radius * 3)))); nd++;
    };
    // Glow drawing: one point per particle plus its trail (fading back along it).
    let ng = 0;
    const V = look.vortex, vl = Math.round(V.look);
    const glowOf = (p: P) => {
      const f = Math.min(1, p.age * 4) * Math.min(1, (p.life - p.age) * 2.5);
      const lk = p.look ?? 1;
      const flick = lk === 2 ? 0.6 + 0.4 * Math.sin(p.age * 60 + p.seed * 40) : 1;
      const head = lk === 3 ? 0.07 : lk === 2 ? 0.9 : 0.22;
      const sz = lk === 3 ? p.size * 0.9 : lk === 2 ? radius * 0.05 * V.size : radius * 0.09 * V.size;
      const steps = lk === 3 ? 1 : Math.max(1, Math.round(TRAIL * Math.min(1, V.trail * (lk === 2 ? 0.5 : 1))));
      for (let k = 0; k < steps && ng < GLOW; k++) {
        const j = ((p.tn ?? 0) - k + TRAIL) % TRAIL, t = 1 - k / steps;
        gPos[ng * 3] = p.trail![j * 3]!; gPos[ng * 3 + 1] = p.trail![j * 3 + 1]!; gPos[ng * 3 + 2] = p.trail![j * 3 + 2]!;
        gA[ng] = f * flick * head * t * V.glow; gS[ng] = (sz * (0.5 + 0.5 * t)) / radius; ng++;
      }
    };
    for (const list of [globs, swirls]) {
      for (let i = list.length - 1; i >= 0; i--) {
        const p = list[i]!;
        p.age += dt;
        let dead = p.age > p.life;
        if (p.out && list === swirls && p.look !== undefined && p.look !== 0 && p.look !== 4) {
          // Light thrown out by the nova: no weight, just slows and fades.
          const drag = Math.exp(-dt * 1.5); p.vx *= drag; p.vy *= drag; p.vz *= drag;
          p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt;
        } else if (p.out) {
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
          // Round and round, faster closer in (like a real vortex), slowly spiralling inwards; a spout climbs.
          const r0 = p.r!, w = ((1.6 + 6 * power) * sp) / Math.max(0.6, r0 / radius);
          p.th! += w * dt;
          p.r = Math.max(radius * 1.02, r0 - radius * (0.12 + 0.5 * power) * sp * dt * (p.look === 4 ? 0.6 : 1));
          if (p.look === 4) p.h! += (radius * (0.9 + 1.4 * power) * sp) * dt;
          else p.h! += Math.sin(p.age * 2 + p.seed * 6) * radius * 0.25 * dt;
          const nx = c.x + Math.cos(p.th!) * p.r!, ny = c.y + p.h!, nz = c.z + Math.sin(p.th!) * p.r!;
          p.vx = (nx - p.x) / Math.max(dt, 1e-3); p.vy = (ny - p.y) / Math.max(dt, 1e-3); p.vz = (nz - p.z) / Math.max(dt, 1e-3);
          p.x = nx; p.y = ny; p.z = nz;
          if (power < 0.01 && p.age > 0.2) { p.out = true; p.age = 0; p.life = 1; } // let go early: they scatter and fade
          if (p.look === 4 && p.h! > -radius * 0.6) dead = true; // the spout has reached the orb
        }
        // Their trail: the last few places they were.
        if (p.trail) { p.tn = ((p.tn ?? 0) + 1) % TRAIL; p.trail.set([p.x, p.y, p.z], p.tn * 3); }
        if (dead) { list.splice(i, 1); continue; }
        // Light-made vortex looks are drawn as glow, not as water drops.
        if (list === swirls && p.look !== undefined && p.look !== 0 && p.look !== 4) { glowOf(p); continue; }
        drawDrop(p, Math.min(1, p.age * 5) * Math.min(1, (p.life - p.age) * 3));
      }
    }
    drops.count = nd; drops.visible = nd > 0;
    gGeo.setDrawRange(0, ng); glow.visible = ng > 0;
    gGeo.attributes.position!.needsUpdate = true; gGeo.attributes.aA!.needsUpdate = true; gGeo.attributes.aS!.needsUpdate = true;
    gMat.uniforms.uPx!.value = pxScale * radius;
    // Colour per look: wind pale blue-white, sparks electric blue with a white core, mist soft blue.
    (gMat.uniforms.uColor!.value as Vector3).set(...((vl === 2 ? [0.35, 0.65, 1.0] : vl === 3 ? [0.45, 0.7, 0.95] : [0.75, 0.88, 1.0]) as [number, number, number]));
    gMat.uniforms.uCore!.value = vl === 2 ? 1 : 0; gMat.uniforms.uPuff!.value = vl === 3 ? 1 : 0;
    drops.instanceMatrix.needsUpdate = true; dFade.needsUpdate = true; dMix.needsUpdate = true;
    dMat.uniforms.uGlow!.value = power; dMat.uniforms.uSkyTurn!.value = skyTurn;

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
  return { group, update, explode, disposables: [dGeo, dMat, rGeo, rMat, gGeo, gMat] as { dispose: () => void }[] };
}
