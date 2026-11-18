import {
  AdditiveBlending, BufferAttribute, BufferGeometry, CylinderGeometry, DoubleSide, Group, Line, LineBasicMaterial, Mesh,
  ShaderMaterial, Vector3,
} from 'three';

/**
 * "Press and hold the orb" (Markus, 18 Nov 2026). While the visitor holds the orb it charges up: lightning
 * jumps from it to the water and the land around it, and a beam of light runs from the orb down into the
 * water. This file draws the bolts and the beam; Stage.tsx works out how charged the orb is (0 to 1) and
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

const BEAM_VERT = /* glsl */ `
varying vec3 vN; varying vec3 vV; varying float vY;
void main() {
  vY = uv.y;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vN = normalMatrix * normal; vV = -mv.xyz;
  gl_Position = projectionMatrix * mv;
}`;
const BEAM_FRAG = /* glsl */ `
uniform float uTime; uniform float uPower;
varying vec3 vN; varying vec3 vV; varying float vY;
void main() {
  float facing = abs(dot(normalize(vN), normalize(vV)));
  float core = pow(facing, 3.0);
  float flow = 0.75 + 0.25 * sin(vY * 40.0 + uTime * 30.0) * sin(vY * 13.0 - uTime * 17.0);
  float ends = smoothstep(0.0, 0.08, vY) * smoothstep(1.0, 0.85, vY);
  vec3 col = mix(vec3(0.35, 0.7, 1.0), vec3(1.0), core);
  gl_FragColor = vec4(col * (0.25 + core) * flow * ends * uPower, 1.0);
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
  // The beam: an open tube, unit height, stretched from the orb to the water each frame.
  const beamGeo = new CylinderGeometry(1, 1, 1, 20, 1, true);
  beamGeo.translate(0, -0.5, 0); // top at 0, bottom at -1
  const beamMat = new ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uPower: { value: 0 } },
    vertexShader: BEAM_VERT, fragmentShader: BEAM_FRAG, transparent: true, depthWrite: false, blending: AdditiveBlending, side: DoubleSide,
  });
  const beam = new Mesh(beamGeo, beamMat); beam.renderOrder = 6; beam.visible = false; beam.frustumCulled = false;
  group.add(beam);

  let timer = 0;
  let seed = 1;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  const from = new Vector3(), dir = new Vector3();

  /**
   * `power` 0..1. `orb`/`radius`: where the orb is (world). `waterY`: the water's height under it.
   * `pick()` gives a strike point on the water or land. Returns the brightest strike now (for flashes).
   */
  const update = (t: number, dt: number, power: number, orb: Vector3, radius: number, waterY: number,
    look: { beam: number; bolts: number }, pick: () => Vector3): { flash: number; at: Vector3 | null } => {
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
    // The beam: from just under the orb's centre to the water, as wide as the charge allows.
    const bp = Math.max(0, (power - 0.35) / 0.65) * look.beam;
    beam.visible = bp > 0.01;
    if (beam.visible) {
      const top = orb.y - radius * 0.2, h = Math.max(0.1, top - waterY);
      const w = radius * (0.06 + 0.1 * bp) * (1 + 0.15 * Math.sin(t * 40));
      beam.position.set(orb.x, top, orb.z);
      beam.scale.set(w, h, w);
      beamMat.uniforms.uTime!.value = t; beamMat.uniforms.uPower!.value = bp;
    }
    return { flash, at };
  };

  const disposables: { dispose: () => void }[] = [beamGeo, beamMat, ...bolts.flatMap((b) => [b.geo, b.mat])];
  return { group, update, disposables };
}
