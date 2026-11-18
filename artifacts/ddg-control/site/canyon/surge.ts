import {
  AdditiveBlending, BufferAttribute, BufferGeometry, Group, Line, LineBasicMaterial, Mesh,
  ShaderMaterial, SphereGeometry, Vector3,
} from 'three';

/**
 * "Press and hold the orb" (Markus, 18 Nov 2026). While the visitor holds the orb it charges up: lightning
 * jumps from it to the water and the land around it. This file draws the bolts and the nova; Stage.tsx works out how charged the orb is (0 to 1) and
 * does the rest (shake, rise, glow, the water simmering, the camera and the sky).
 */

const SEG = 24; // points along one bolt
const BOLTS = 4;

/** A jagged line from a to b: each half split again with a sideways nudge, five times over. */
function jag(a: Vector3, b: Vector3, out: Float32Array, rnd: () => number): void {
  const pts: Vector3[] = [a.clone(), b.clone()];
  let rough = a.distanceTo(b) * 0.16;
  while (pts.length < SEG) {
    for (let i = pts.length - 1; i > 0; i--) {
      if (pts.length >= SEG) break;
      const m = pts[i - 1]!.clone().lerp(pts[i]!, 0.5);
      m.x += (rnd() - 0.5) * rough; m.y += (rnd() - 0.5) * rough * 0.6; m.z += (rnd() - 0.5) * rough;
      pts.splice(i, 0, m);
    }
    rough *= 0.55;
  }
  for (let i = 0; i < SEG; i++) { const p = pts[i] ?? pts[pts.length - 1]!; out[i * 3] = p.x; out[i * 3 + 1] = p.y; out[i * 3 + 2] = p.z; }
}

// The nova: a shell of light racing out from the orb, brightest at its edge (seen side-on), like a shock front.
const NOVA_FRAG = /* glsl */ `
uniform float uAlpha;
varying vec3 vN; varying vec3 vV; varying float vY;
void main() {
  float facing = abs(dot(normalize(vN), normalize(vV)));
  float rim = pow(1.0 - facing, 3.0);
  gl_FragColor = vec4(vec3(0.75, 0.92, 1.0) * (rim * 1.4 + 0.05) * uAlpha, 1.0);
}`;

const BEAM_VERT = /* glsl */ `
varying vec3 vN; varying vec3 vV; varying float vY;
void main() {
  vY = uv.y;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vN = normalMatrix * normal; vV = -mv.xyz;
  gl_Position = projectionMatrix * mv;
}`;

export function makeSurge() {
  const group = new Group();
  // Bolts: plain lines, added light, a quick double flicker each.
  const bolts = Array.from({ length: BOLTS }, () => {
    const pos = new Float32Array(SEG * 3);
    const geo = new BufferGeometry(); geo.setAttribute('position', new BufferAttribute(pos, 3));
    const mat = new LineBasicMaterial({ color: 0xd8f0ff, transparent: true, opacity: 0, blending: AdditiveBlending, depthWrite: false });
    const line = new Line(geo, mat); line.frustumCulled = false; line.renderOrder = 7; line.visible = false;
    group.add(line);
    return { pos, geo, mat, line, life: 9, target: new Vector3() };
  });

  const novaGeo = new SphereGeometry(1, 40, 24);
  const novaMat = new ShaderMaterial({ uniforms: { uAlpha: { value: 0 } }, vertexShader: BEAM_VERT, fragmentShader: NOVA_FRAG, transparent: true, depthWrite: false, blending: AdditiveBlending });
  const nova = new Mesh(novaGeo, novaMat); nova.renderOrder = 7; nova.visible = false; nova.frustumCulled = false;
  group.add(nova);
  /** The nova shell `t` seconds after the blast (nothing after 1.6 s). */
  const novaAt = (t: number, orb: Vector3, radius: number, size: number) => {
    nova.visible = t >= 0 && t < 1.6 && size > 0;
    if (!nova.visible) return;
    const r = radius * (1.1 + 30 * size * (1 - Math.exp(-t * 2.2)));
    nova.position.copy(orb); nova.scale.setScalar(r);
    novaMat.uniforms.uAlpha!.value = Math.exp(-t * 2.4) * Math.min(1, t * 20);
  };
  /** Fire every bolt at once (the blast). */
  const burstAll = (orb: Vector3, radius: number, pick: () => Vector3) => {
    for (const b of bolts) {
      b.target.copy(pick());
      dir.copy(b.target).sub(orb).normalize();
      from.copy(orb).addScaledVector(dir, radius * 0.95);
      jag(from, b.target, b.pos, rnd);
      b.geo.attributes.position!.needsUpdate = true;
      b.life = 0;
    }
  };

  // The sky strike (Markus, 18 Nov): at full charge one big bolt drops from above the top of the screen onto
  // the top of the orb. The main bolt is drawn three times side by side so it reads thick, plus two forks.
  const sky = Array.from({ length: 5 }, () => {
    const pos = new Float32Array(SEG * 3);
    const geo = new BufferGeometry(); geo.setAttribute('position', new BufferAttribute(pos, 3));
    const mat = new LineBasicMaterial({ color: 0xeef8ff, transparent: true, opacity: 0, blending: AdditiveBlending, depthWrite: false });
    const line = new Line(geo, mat); line.frustumCulled = false; line.renderOrder = 8; line.visible = false;
    group.add(line);
    return { pos, geo, mat, line };
  });
  let skyLife = 9, skyPower = 0;
  const skyAt = new Vector3(), fork = new Vector3(), forkEnd = new Vector3();
  /** Fire the sky strike from `top` (just above the screen) to `hit` (the top of the orb). */
  const skyStrike = (top: Vector3, hit: Vector3, power: number) => {
    const main = sky[0]!.pos, w = top.distanceTo(hit) * 0.004;
    jag(top, hit, main, rnd);
    for (let k = 1; k < 3; k++) for (let i = 0; i < SEG * 3; i++) sky[k]!.pos[i] = main[i]! + (i % 3 === 1 ? 0 : (k === 1 ? w : -w));
    for (let k = 3; k < 5; k++) {
      const at = 4 + Math.floor(rnd() * 10);
      fork.set(main[at * 3]!, main[at * 3 + 1]!, main[at * 3 + 2]!);
      forkEnd.copy(hit).sub(top).multiplyScalar(0.25 + rnd() * 0.2).add(fork);
      forkEnd.x += (rnd() - 0.5) * top.distanceTo(hit) * 0.35; forkEnd.z += (rnd() - 0.5) * top.distanceTo(hit) * 0.2;
      jag(fork, forkEnd, sky[k]!.pos, rnd);
    }
    for (const b of sky) b.geo.attributes.position!.needsUpdate = true;
    skyAt.copy(hit); skyLife = 0; skyPower = power;
  };

  let timer = 0;
  let seed = 1;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  const from = new Vector3(), dir = new Vector3();

  /**
   * `power` 0..1. `orb`/`radius`: where the orb is (world). `waterY`: the water's height under it.
   * `pick()` gives a strike point on the water or land. Returns the brightest strike now (for flashes).
   */
  const update = (t: number, dt: number, power: number, orb: Vector3, radius: number, waterY: number,
    look: { bolts: number }, pick: () => Vector3): { flash: number; at: Vector3 | null } => {
    // Bolts: more often as it charges; none below a quarter charge.
    timer -= dt;
    if (power > 0.25 && look.bolts > 0 && timer <= 0) {
      const free = bolts.find((b) => b.life > 0.3);
      if (free) {
        free.target.copy(pick());
        dir.copy(free.target).sub(orb).normalize();
        from.copy(orb).addScaledVector(dir, radius * 0.95);
        jag(from, free.target, free.pos, rnd);
        free.geo.attributes.position!.needsUpdate = true;
        free.life = 0;
      }
      timer = (0.15 + 0.85 * (1 - power)) * (0.5 + rnd()) / look.bolts;
    }
    let flash = 0, at: Vector3 | null = null;
    for (const b of bolts) {
      b.life += dt;
      const on = b.life < 0.3 ? Math.exp(-b.life * 12) * (b.life % 0.06 < 0.03 ? 1 : 0.45) : 0;
      b.line.visible = on > 0.01;
      b.mat.opacity = Math.min(1, on * 1.4);
      if (on > flash) { flash = on; at = b.target; }
    }
    skyLife += dt;
    const sOn = skyLife < 0.6 ? Math.exp(-skyLife * 4) * (skyLife % 0.09 < 0.05 ? 1 : 0.35) * skyPower : 0;
    sky.forEach((b, i) => { b.line.visible = sOn > 0.01; b.mat.opacity = Math.min(1, sOn * (i < 3 ? 1.5 : 0.8)); });
    if (sOn > flash) { flash = Math.min(1.5, sOn); at = skyAt; }
    return { flash, at };
  };

  const disposables: { dispose: () => void }[] = [novaGeo, novaMat, ...bolts.flatMap((b) => [b.geo, b.mat]), ...sky.flatMap((b) => [b.geo, b.mat])];
  return { group, update, novaAt, burstAll, skyStrike, disposables };
}
