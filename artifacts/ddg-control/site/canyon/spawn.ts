import {
  AdditiveBlending, BufferAttribute, BufferGeometry, Group, Mesh, PlaneGeometry, Points, ShaderMaterial, Vector3,
} from 'three';
import type { Camera } from 'three';

/**
 * The orb's load-in (Markus, 18 Nov: "more dynamic than a fade"). Six looks, chosen in the tuner (Load-in):
 *  0 Classic   – a point of light, the ball swells out of it, a pulse.
 *  1 Portal    – a ring of light tears open in the air, the orb grows out of it, the portal closes behind it.
 *  2 Spark     – a single spark darts in, hovers and crackles, then ignites into the orb with a blast on the water.
 *  3 Gathering – motes of light stream in from all round and condense into the orb.
 *  4 Lightning – a bolt drops from the top of the screen and the orb bursts into being where it lands.
 *  5 Rise      – the orb glows under the river and rises out of it, pushing a ring of water out as it breaks through.
 * `spawnLook` says what the orb itself does at each moment (s = 0..1 through the load-in); `makeSpawnFx` draws
 * the portal, the spark and the motes. Stage.tsx applies both and fires the strike and the water push.
 */
export const SPAWN_NAMES = ['Classic', 'Portal', 'Spark', 'Gathering', 'Lightning', 'Rise from the river'];

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const ease = (x: number) => { const t = clamp01(x); return t * t * (3 - 2 * t); };
/** Grow from nothing to full size, a little past it, then settle (u = 0..1). */
const pop = (u: number) => (u <= 0 ? 0 : u >= 1 ? 1 : 1 + 2.2 * Math.pow(u - 1, 3) + 1.2 * Math.pow(u - 1, 2));
const bump = (s: number, at: number, w: number) => Math.exp(-Math.pow((s - at) / w, 2));

export type SpawnLook = {
  scale: number; // the orb's size (0 none, 1 full)
  halo: number; // extra glow round it
  haloSize: number; // glow size (x10 units)
  lift: number; // how far below its place it is (Rise), in units
  waveAt: number; // when the water push goes off (s), -1 none
  wave: number; // how hard
  strikeAt: number; // when the sky strike lands (s), -1 none
  classic: boolean;
};

export function spawnLook(style: number, s: number, radius: number): SpawnLook {
  const L: SpawnLook = { scale: 1, halo: 0, haloSize: 1, lift: 0, waveAt: -1, wave: 0, strikeAt: -1, classic: false };
  switch (style) {
    case 1: { // Portal
      L.scale = pop((s - 0.3) / 0.45);
      const p = bump(s, 0.76, 0.06);
      L.halo = 0.25 * ease(s / 0.3) * (1 - ease((s - 0.75) / 0.2)) + p * 0.7; L.haloSize = 1 + p * 0.5;
      break;
    }
    case 2: { // Spark
      L.scale = pop((s - 0.68) / 0.16);
      const f = bump(s, 0.69, 0.05);
      L.halo = f * 1.3; L.haloSize = 0.4 + f * 1.4;
      L.waveAt = 0.68; L.wave = 1.2;
      break;
    }
    case 3: { // Gathering
      L.scale = pop((s - 0.35) / 0.55);
      const p = bump(s, 0.92, 0.05);
      L.halo = 0.45 * ease((s - 0.15) / 0.6) * (1 - ease((s - 0.88) / 0.12)) + p * 0.7; L.haloSize = 0.6 + 0.4 * ease(s) + p * 0.5;
      break;
    }
    case 4: { // Lightning
      L.strikeAt = 0.22;
      L.scale = pop((s - 0.24) / 0.2);
      const f = bump(s, 0.25, 0.05);
      L.halo = f * 1.6; L.haloSize = 1 + f * 1.2;
      L.waveAt = 0.24; L.wave = 1.6;
      break;
    }
    case 5: { // Rise from the river
      L.lift = (radius * 3 + 2) * (1 - ease(s / 0.8));
      L.scale = 0.6 + 0.4 * ease(s);
      const p = bump(s, 0.5, 0.07);
      L.halo = 0.35 * ease(s / 0.4) * (1 - ease((s - 0.8) / 0.2)) + p * 0.6; L.haloSize = 1 + p * 0.4;
      L.waveAt = 0.45; L.wave = 1;
      break;
    }
    default: L.classic = true;
  }
  return L;
}

const PORTAL_VERT = /* glsl */ `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
// A ring of light that opens from a thin vertical slit into a circle, with light swirling inside.
const PORTAL_FRAG = /* glsl */ `
uniform float uOpen; uniform float uTime; uniform float uAlpha;
varying vec2 vUv;
void main() {
  vec2 p = (vUv - 0.5) * 2.0;
  vec2 q = vec2(p.x / max(uOpen, 0.015), p.y / min(1.0, uOpen * 2.5 + 0.1));
  float r = length(q), a = atan(q.y, q.x);
  float rim = exp(-pow((r - 0.8) * 9.0, 2.0));
  float swirl = 0.5 + 0.5 * sin(a * 5.0 - r * 10.0 + uTime * 6.0);
  float inside = smoothstep(0.82, 0.45, r) * (0.3 + 0.7 * swirl) * (1.0 - 0.6 * r);
  vec3 col = vec3(0.55, 0.85, 1.0) * rim * 1.6 + vec3(0.2, 0.45, 1.0) * inside * 0.8 + vec3(1.0) * pow(rim, 3.0) * 0.7;
  gl_FragColor = vec4(col * uAlpha, 1.0);
}`;
// Motes and the spark: soft round dots of light.
const DOT_VERT = /* glsl */ `
attribute float aA; attribute float aS;
uniform float uPx;
varying float vA;
void main() {
  vA = aA;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = aA > 0.0 ? uPx * aS / max(-mv.z, 0.1) : 0.0;
}`;
const DOT_FRAG = /* glsl */ `
varying float vA;
void main() {
  float d = length(gl_PointCoord - 0.5) * 2.0;
  float g = exp(-d * d * 4.0) + 0.6 * exp(-d * d * 30.0);
  gl_FragColor = vec4(mix(vec3(0.45, 0.75, 1.0), vec3(1.0), exp(-d * d * 20.0)) * g * vA, 1.0);
}`;

const N = 320; // motes (Gathering); the first TRAIL of them are the spark and its trail (Spark)
const TRAIL = 24;

export function makeSpawnFx() {
  const group = new Group(); group.visible = false;
  const portalMat = new ShaderMaterial({ uniforms: { uOpen: { value: 0 }, uTime: { value: 0 }, uAlpha: { value: 0 } }, vertexShader: PORTAL_VERT, fragmentShader: PORTAL_FRAG, transparent: true, depthWrite: false, blending: AdditiveBlending });
  const portalGeo = new PlaneGeometry(1, 1);
  const portal = new Mesh(portalGeo, portalMat); portal.renderOrder = 6; portal.frustumCulled = false;
  group.add(portal);

  const pos = new Float32Array(N * 3), aA = new Float32Array(N), aS = new Float32Array(N);
  const dotGeo = new BufferGeometry();
  dotGeo.setAttribute('position', new BufferAttribute(pos, 3)); dotGeo.setAttribute('aA', new BufferAttribute(aA, 1)); dotGeo.setAttribute('aS', new BufferAttribute(aS, 1));
  const dotMat = new ShaderMaterial({ uniforms: { uPx: { value: 600 } }, vertexShader: DOT_VERT, fragmentShader: DOT_FRAG, transparent: true, depthWrite: false, blending: AdditiveBlending });
  const dots = new Points(dotGeo, dotMat); dots.frustumCulled = false; dots.renderOrder = 7;
  group.add(dots);

  // Each mote: where it starts (direction and distance from the orb), when it sets off, how big it is.
  const start = Array.from({ length: N }, () => {
    const a = Math.random() * Math.PI * 2, y = -0.15 + Math.random() * 1.1;
    const d = new Vector3(Math.cos(a), y, Math.sin(a)).normalize();
    return { d, far: 18 + Math.random() * 28, delay: Math.random() * 0.35, size: 0.25 + Math.random() * 0.5, spin: (Math.random() < 0.5 ? -1 : 1) * (1.5 + Math.random() * 2) };
  });
  const v = new Vector3();
  /** The spark's path at s (0..0.68): darting in from the right, weaving, then hovering at the centre. */
  const sparkAt = (s: number, orb: Vector3, out: Vector3) => {
    const e = ease(s / 0.5);
    out.set(16, 7, 6).multiplyScalar(1 - e);
    const w = (1 - e) * 1.8 + 0.12;
    out.x += Math.sin(s * 41) * w; out.y += Math.cos(s * 33) * w * 0.7; out.z += Math.sin(s * 27 + 1) * w;
    return out.add(orb);
  };

  /** Draw the effects for `style` at s (0..1). Nothing shows outside the load-in. */
  const update = (style: number, s: number, clock: number, orb: Vector3, radius: number, camera: Camera, px: number) => {
    group.visible = s > 0 && s < 1 && (style === 1 || style === 2 || style === 3);
    if (!group.visible) return;
    dotMat.uniforms.uPx!.value = px;
    // Portal
    portal.visible = style === 1;
    if (portal.visible) {
      const open = ease(s / 0.35), close = ease((s - 0.78) / 0.22);
      portalMat.uniforms.uOpen!.value = open * (1 - close) + 0.001;
      portalMat.uniforms.uAlpha!.value = Math.min(1, s / 0.05) * (1 - close);
      portalMat.uniforms.uTime!.value = clock;
      portal.position.copy(orb); portal.quaternion.copy(camera.quaternion);
      portal.scale.setScalar(radius * 5.5);
    }
    // Dots
    dots.visible = style === 2 || style === 3;
    if (!dots.visible) return;
    aA.fill(0);
    if (style === 3) {
      for (let i = 0; i < N; i++) {
        const m = start[i]!, u = clamp01((s - m.delay) / 0.5);
        if (u <= 0 || u >= 1) continue;
        const e = u * u * u, ang = (1 - e) * m.spin;
        v.copy(m.d).multiplyScalar(m.far * (1 - e));
        const c = Math.cos(ang), sn = Math.sin(ang);
        pos[i * 3] = orb.x + v.x * c - v.z * sn; pos[i * 3 + 1] = orb.y + v.y; pos[i * 3 + 2] = orb.z + v.x * sn + v.z * c;
        aA[i] = ease(u / 0.15) * (1 - ease((u - 0.9) / 0.1)); aS[i] = m.size * (0.6 + 0.6 * e);
      }
    } else if (s < 0.72) {
      // The spark and a fading trail behind it; it flickers as it crackles at the centre.
      const flick = s > 0.5 ? 0.6 + 0.4 * Math.sin(clock * 90) * Math.sin(clock * 37) : 1;
      for (let i = 0; i < TRAIL; i++) {
        const t = s - i * 0.006;
        if (t < 0) break;
        sparkAt(t, orb, v);
        pos[i * 3] = v.x; pos[i * 3 + 1] = v.y; pos[i * 3 + 2] = v.z;
        aA[i] = (i === 0 ? 1.4 : 0.7 * (1 - i / TRAIL)) * flick * Math.min(1, s / 0.03);
        aS[i] = i === 0 ? 1.2 + (s > 0.5 ? 0.8 * (s - 0.5) / 0.18 : 0) : 0.5 * (1 - i / TRAIL);
      }
    }
    dotGeo.attributes.position!.needsUpdate = true; dotGeo.attributes.aA!.needsUpdate = true; dotGeo.attributes.aS!.needsUpdate = true;
  };

  return { group, update, disposables: [portalGeo, portalMat, dotGeo, dotMat] as { dispose: () => void }[] };
}
