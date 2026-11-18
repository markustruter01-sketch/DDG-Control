import {
  AdditiveBlending, BufferAttribute, BufferGeometry, Group, LineSegments, Mesh, MeshBasicMaterial, Points, ShaderMaterial,
  TorusGeometry, Vector3,
} from 'three';

/**
 * What swirls round the orb while it charges (held). Following how game effects artists build a charge-up
 * (realtimevfx.com, 80.lv laser and anime-beam breakdowns, 18 Nov 2026): energy streaks pulled in from all
 * around towards the centre, more of them and faster as it nears the release; rings round the source; light
 * gathered from the surroundings; a swirling vortex; and loose ground lifting into the air.
 * Looks (T.holdFx): 0 off, 1 streaks pulled in, 2 light gathered from the land and water, 3 vortex,
 * 4 ground lifting, 5 rings, 6 streaks + rings, 7 all of them.
 */

const N = 700;

type P = { x: number; y: number; z: number; vx: number; vy: number; vz: number; age: number; life: number; kind: number; seed: number };

const LINE_VERT = /* glsl */ `
attribute float aA;
varying float vA;
void main() { vA = aA; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const LINE_FRAG = /* glsl */ `
varying float vA;
void main() { gl_FragColor = vec4(vec3(0.72, 0.9, 1.0) * vA, 1.0); }`;
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
  gl_FragColor = vec4(mix(vec3(0.06, 0.08, 0.12), vec3(0.45, 0.7, 0.9), 0.25 * (1.0 - gl_PointCoord.y)), vA);
}`;

export function makeCharge() {
  const group = new Group();
  const lPos = new Float32Array(N * 6), lA = new Float32Array(N * 2);
  const lGeo = new BufferGeometry();
  lGeo.setAttribute('position', new BufferAttribute(lPos, 3)); lGeo.setAttribute('aA', new BufferAttribute(lA, 1));
  const lMat = new ShaderMaterial({ vertexShader: LINE_VERT, fragmentShader: LINE_FRAG, transparent: true, depthWrite: false, blending: AdditiveBlending });
  const lines = new LineSegments(lGeo, lMat); lines.frustumCulled = false; lines.renderOrder = 7;
  const rPos = new Float32Array(N * 3), rA = new Float32Array(N);
  const rGeo = new BufferGeometry();
  rGeo.setAttribute('position', new BufferAttribute(rPos, 3)); rGeo.setAttribute('aA', new BufferAttribute(rA, 1));
  const rMat = new ShaderMaterial({ uniforms: { uPx: { value: 800 } }, vertexShader: ROCK_VERT, fragmentShader: ROCK_FRAG, transparent: true, depthWrite: false });
  const rocks = new Points(rGeo, rMat); rocks.frustumCulled = false; rocks.renderOrder = 3;
  // Rings: three thin hoops at different tilts, spinning faster as the charge grows.
  const ringGeo = new TorusGeometry(1, 0.012, 6, 96);
  const ringMat = new MeshBasicMaterial({ color: 0xbfe6ff, transparent: true, opacity: 0, blending: AdditiveBlending, depthWrite: false });
  const rings = [0, 1, 2].map((i) => { const m = new Mesh(ringGeo, ringMat); m.renderOrder = 7; m.rotation.set(1.2 + i * 0.5, i * 1.1, 0); group.add(m); return m; });
  group.add(lines, rocks);

  const ps: P[] = [];
  let owed = 0, spin = 0;
  const c = new Vector3();

  /**
   * `power` 0..1 (grows over the hold). `look`: style, amount, speed. `ground(x, z)` gives the land or water
   * height there. `pxScale`: drawing-buffer pixels per world unit at distance 1.
   */
  const update = (dt: number, power: number, orb: Vector3, radius: number, look: { style: number; amount: number; speed: number },
    ground: (x: number, z: number) => number, pxScale: number) => {
    const s = Math.round(look.style);
    const want = (k: number) => s === k || (s === 6 && (k === 1 || k === 5)) || s === 7;
    c.copy(orb);
    // Spawn: the rate climbs steeply towards the end of the charge (a curve, as the breakdowns advise).
    owed += dt * look.amount * (power > 0.02 ? 30 + 420 * power * power : 0);
    while (owed >= 1 && ps.length < N) {
      owed -= 1;
      const kinds = [1, 2, 3, 4].filter(want);
      if (kinds.length === 0) { owed = 0; break; }
      const kind = kinds[Math.floor(Math.random() * kinds.length)]!;
      const a = Math.random() * Math.PI * 2, u = Math.random() * 2 - 1, sq = Math.sqrt(1 - u * u);
      const p: P = { x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, age: 0, life: 1.2, kind, seed: Math.random() };
      if (kind === 1) { // streak: from a shell well outside the orb, pulled to the centre
        const r = radius * (2.5 + 3 * Math.random());
        p.x = c.x + Math.cos(a) * sq * r; p.y = c.y + u * r * 0.8; p.z = c.z + Math.sin(a) * sq * r; p.life = 1.6;
      } else if (kind === 2) { // mote: from the land or water around, drifting in
        const r = radius * (3 + 6 * Math.random());
        p.x = c.x + Math.cos(a) * r; p.z = c.z + Math.sin(a) * r * 0.8; p.y = ground(p.x, p.z) + 0.2; p.life = 3;
      } else if (kind === 3) { // vortex: round the orb, spiralling down towards the water
        const r = radius * (1.3 + 1.5 * Math.random());
        p.x = c.x + Math.cos(a) * r; p.z = c.z + Math.sin(a) * r; p.y = c.y + (Math.random() - 0.3) * radius; p.life = 1.8;
      } else { // ground lifting: a chunk off the land or the water's edge, rising and circling
        const r = radius * (1.6 + 5 * Math.random());
        p.x = c.x + Math.cos(a) * r; p.z = c.z + Math.sin(a) * r * 0.8; p.y = ground(p.x, p.z); p.life = 4 + 3 * Math.random();
      }
      ps.push(p);
    }
    if (owed > 10) owed = 10;
    const sp = look.speed * (0.4 + 1.6 * power);
    let nl = 0, nr = 0;
    for (let i = ps.length - 1; i >= 0; i--) {
      const p = ps[i]!;
      p.age += dt;
      const dx = c.x - p.x, dy = c.y - p.y, dz = c.z - p.z, d = Math.hypot(dx, dy, dz) || 1;
      const ox = p.x, oy = p.y, oz = p.z;
      if (p.kind === 1) {
        const pull = (6 + 30 * power) * sp;
        p.vx += (dx / d) * pull * dt; p.vy += (dy / d) * pull * dt; p.vz += (dz / d) * pull * dt;
      } else if (p.kind === 2) {
        const pull = (1.5 + 8 * power) * sp;
        p.vx = (dx / d) * pull - (dz / d) * pull * 0.4; p.vy = (dy / d) * pull; p.vz = (dz / d) * pull + (dx / d) * pull * 0.4;
      } else if (p.kind === 3) {
        const w = (2.5 + 7 * power) * sp; // round the orb
        p.vx = -dz * w * 0.35 + dx * 0.2; p.vz = dx * w * 0.35 + dz * 0.2; p.vy = -radius * 0.6 * sp;
      } else {
        const lift = power > 0.15 ? (0.6 + 2.2 * power) * sp : -3;
        p.vy += (lift - p.vy) * Math.min(1, dt * 2);
        const w = (0.3 + 1.2 * power) * sp;
        p.vx = -dz * w * 0.12; p.vz = dx * w * 0.12;
      }
      p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt;
      const reached = p.kind !== 4 && d < radius * 0.9;
      const fell = p.kind === 4 && p.y < ground(p.x, p.z) - 0.2 && p.age > 0.5;
      if (p.age > p.life || reached || fell || (power < 0.01 && p.kind !== 4)) { ps.splice(i, 1); continue; }
      const fadeIn = Math.min(1, p.age * 4), fadeOut = Math.min(1, (p.life - p.age) * 3);
      if (p.kind === 4) {
        rPos[nr * 3] = p.x; rPos[nr * 3 + 1] = p.y; rPos[nr * 3 + 2] = p.z; rA[nr] = fadeIn * fadeOut * 0.9; nr++;
      } else {
        // A trail behind each one, longer the faster it goes.
        const trail = p.kind === 2 ? 1.5 : 4;
        const tx = p.x - (p.x - ox) * trail, ty = p.y - (p.y - oy) * trail, tz = p.z - (p.z - oz) * trail;
        const a = fadeIn * fadeOut * (p.kind === 1 ? 0.9 : p.kind === 2 ? 0.8 : 0.5);
        lPos.set([p.x, p.y, p.z, tx, ty, tz], nl * 6); lA[nl * 2] = a; lA[nl * 2 + 1] = 0; nl++;
      }
    }
    lGeo.setDrawRange(0, nl * 2); lines.visible = nl > 0;
    rGeo.setDrawRange(0, nr); rocks.visible = nr > 0;
    lGeo.attributes.position!.needsUpdate = true; lGeo.attributes.aA!.needsUpdate = true;
    rGeo.attributes.position!.needsUpdate = true; rGeo.attributes.aA!.needsUpdate = true;
    rMat.uniforms.uPx!.value = pxScale;
    // Rings.
    spin += dt * (0.5 + 6 * power) * look.speed;
    const showRings = want(5) && power > 0.05;
    ringMat.opacity = showRings ? Math.min(0.7, power * 0.9) : 0;
    rings.forEach((m, i) => {
      m.visible = showRings;
      m.position.copy(c);
      m.scale.setScalar(radius * (1.25 + 0.25 * i) * (1 + 0.04 * Math.sin(spin * 3 + i)));
      m.rotation.z = spin * (i % 2 ? -1 : 1) * (1 + i * 0.3);
    });
  };
  return { group, update, disposables: [lGeo, lMat, rGeo, rMat, ringGeo, ringMat] as { dispose: () => void }[] };
}
