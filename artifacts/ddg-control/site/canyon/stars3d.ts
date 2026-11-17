import { AdditiveBlending, BufferAttribute, BufferGeometry, Camera, Mesh, PerspectiveCamera, ShaderMaterial, Vector3 } from 'three';
import { stableHeight } from './viewport';

/**
 * Shooting stars drawn in the 3D scene, far behind the land: hills, the orb and the water all pass in
 * front of them, so a star that falls towards the horizon slips behind it instead of crossing over.
 */

const VERT = /* glsl */ `
attribute float aT; // 0 at the tail, 1 at the head
varying float vT;
void main() { vT = aT; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const FRAG = /* glsl */ `
uniform float uAlpha;
varying float vT;
void main() {
  float a = pow(vT, 2.2) * uAlpha;
  vec3 col = mix(vec3(0.55, 0.75, 1.0), vec3(1.0), smoothstep(0.85, 1.0, vT));
  gl_FragColor = vec4(col * a, a);
}`;

type Star = { mesh: Mesh; geo: BufferGeometry; mat: ShaderMaterial; start: number; dur: number; a: Vector3; b: Vector3 };
const DIST = 440; // beyond the far end of the land (about 360 away), inside the camera's reach (500)

export function makeStars(scene: { add: (m: Mesh) => void; remove: (m: Mesh) => void }) {
  const live: Star[] = [];
  let next = -1;
  const v = new Vector3(), head = new Vector3(), tail = new Vector3(), side = new Vector3(), view = new Vector3();

  const spawn = (now: number, cam: PerspectiveCamera, k: Record<string, number>) => {
    const right = Math.random() < 0.5;
    const x0 = right ? -0.9 + Math.random() * 1.1 : -0.2 + Math.random() * 1.1, y0 = 0.25 + Math.random() * 0.7;
    const ang = ((14 + Math.random() * 22) * k.starsSteep * Math.PI) / 180;
    const len = (0.35 + Math.random() * 0.3) * k.starsLength;
    const x1 = x0 + (right ? 1 : -1) * Math.cos(ang) * len * (stableHeight() / innerWidth) * 1.6, y1 = y0 - Math.sin(ang) * len;
    const toWorld = (x: number, y: number) => {
      v.set(x, y, 0.5).unproject(cam).sub(cam.position).normalize();
      return cam.position.clone().addScaledVector(v, DIST);
    };
    const geo = new BufferGeometry();
    geo.setAttribute('position', new BufferAttribute(new Float32Array(12), 3));
    geo.setAttribute('aT', new BufferAttribute(new Float32Array([0, 0, 1, 1]), 1));
    geo.setIndex([0, 1, 2, 1, 3, 2]);
    const mat = new ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, transparent: true, depthWrite: false, blending: AdditiveBlending, uniforms: { uAlpha: { value: 0 } } });
    const mesh = new Mesh(geo, mat);
    mesh.frustumCulled = false; mesh.renderOrder = -0.5; // first of the see-through things; the land hides it
    scene.add(mesh);
    live.push({ mesh, geo, mat, start: now, dur: ((0.7 + Math.random() * 0.5) / k.starsSpeed) * 1000, a: toWorld(x0, y0), b: toWorld(x1, y1) });
  };

  /** Call every frame. `on`: show them at all (only near the top of the page). */
  const update = (now: number, cam: PerspectiveCamera, k: Record<string, number>, on: boolean) => {
    if (next < 0) next = now + k.starsEvery * 1000 * (0.77 + Math.random() * 0.46);
    if (now >= next) {
      if (on && k.starsOn > 0.5) spawn(now, cam, k);
      next = now + k.starsEvery * 1000 * (0.77 + Math.random() * 0.46);
    }
    const pxWorld = (2 * DIST * Math.tan((cam.fov * Math.PI) / 360)) / stableHeight();
    const w = 1.1 * k.starsWidth * pxWorld;
    for (let i = live.length - 1; i >= 0; i--) {
      const s = live[i], u = (now - s.start) / s.dur;
      if (u >= 1) { scene.remove(s.mesh); s.geo.dispose(); s.mat.dispose(); live.splice(i, 1); continue; }
      const e = u * (2 - u); // fast start, slowing as it burns out
      head.lerpVectors(s.a, s.b, e);
      tail.lerpVectors(s.a, s.b, Math.max(0, e - 0.45));
      view.copy(head).sub((cam as Camera).position).normalize();
      side.copy(head).sub(tail).cross(view).normalize().multiplyScalar(w);
      const p = s.geo.getAttribute('position') as BufferAttribute;
      p.setXYZ(0, tail.x + side.x * 0.3, tail.y + side.y * 0.3, tail.z + side.z * 0.3);
      p.setXYZ(1, tail.x - side.x * 0.3, tail.y - side.y * 0.3, tail.z - side.z * 0.3);
      p.setXYZ(2, head.x + side.x, head.y + side.y, head.z + side.z);
      p.setXYZ(3, head.x - side.x, head.y - side.y, head.z - side.z);
      p.needsUpdate = true;
      s.mat.uniforms.uAlpha.value = Math.min(1, u * 8) * (1 - Math.max(0, (u - 0.7) / 0.3)) * k.starsBright * 1.4;
    }
  };
  const dispose = () => { for (const s of live) { s.geo.dispose(); s.mat.dispose(); } };
  return { update, disposables: [{ dispose }] as { dispose: () => void }[] };
}
