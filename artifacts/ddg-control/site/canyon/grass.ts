import { BufferAttribute, BufferGeometry, Color, DoubleSide, InstancedBufferAttribute, InstancedBufferGeometry, Mesh, ShaderMaterial } from 'three';

/**
 * Preview: a field of grass over the hills instead of the line grid. Every blade is a thin, flat,
 * tapered strip, bent by a soft wind that rolls across the field in slow waves. Blades are packed
 * densely near the camera and grow a little larger with distance, so the far hills still read as a
 * full, soft carpet. None grow in the river.
 */

const VERT = /* glsl */ `
attribute vec3 aRoot;   // x, ground height, z
attribute vec4 aShape;  // turn, height, width, shade
uniform float uTime;
uniform float uFlat;
varying float vUp;
varying float vShade;
varying float vView;
void main() {
  float up = position.y;                     // 0 at the root, 1 at the tip
  float c = cos(aShape.x), s = sin(aShape.x);
  vec3 p = vec3(position.x * aShape.z * (1.0 - up * 0.85), up * aShape.y, 0.0);
  p = vec3(c * p.x, p.y, -s * p.x);
  // Wind: long slow waves rolling across the field, plus a little flutter of each blade.
  vec2 w = aRoot.xz;
  float wave = sin(w.x * 0.11 + w.y * 0.07 - uTime * 1.3) * 0.5 + sin(w.x * 0.05 - w.y * 0.13 - uTime * 0.8) * 0.5;
  float flutter = sin(uTime * 4.0 + aShape.x * 7.0 + w.x) * 0.08;
  float bend = (0.25 + 0.35 * (wave * 0.5 + 0.5) + flutter) * up * up * aShape.y;
  p.x += bend * 0.8; p.z += bend * 0.35; p.y -= bend * bend * 0.12;
  vec3 world = vec3(aRoot.x, aRoot.y * uFlat, aRoot.z) + p * max(uFlat, 0.0);
  vUp = up;
  vShade = aShape.w * (0.85 + 0.3 * (wave * 0.5 + 0.5));
  vec4 mv = viewMatrix * vec4(world, 1.0);
  vView = -mv.z;
  gl_Position = projectionMatrix * mv;
}`;

const FRAG = /* glsl */ `
uniform vec3 uRoot;
uniform vec3 uTip;
uniform vec3 uFog;
uniform float uFogNear;
uniform float uFogFar;
varying float vUp;
varying float vShade;
varying float vView;
void main() {
  vec3 col = mix(uRoot, uTip, pow(vUp, 1.4)) * vShade;
  col += vec3(0.05, 0.09, 0.12) * pow(vUp, 3.0); // cool moonlight on the tips
  col = mix(col, uFog, smoothstep(uFogNear, uFogFar, vView));
  gl_FragColor = vec4(col, 1.0);
}`;

type Opts = { small: boolean; heightAt: (x: number, z: number) => number; W: number; D: number; Z0: number };

export function makeGrass({ small, heightAt, W, D, Z0 }: Opts) {
  // One blade: a strip in 4 steps from root to tip.
  const blade = new BufferGeometry();
  const v: number[] = [], idx: number[] = [];
  const STEPS = 4;
  for (let i = 0; i <= STEPS; i++) { const y = i / STEPS; v.push(-0.5, y, 0, 0.5, y, 0); }
  for (let i = 0; i < STEPS; i++) { const a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
  blade.setAttribute('position', new BufferAttribute(new Float32Array(v), 3));
  blade.setIndex(idx);

  const cap = Number(/g(\d+)k/.exec(location.hash)?.[1] ?? 0) * 1000; // preview: lower count for slow screenshot machines
  const N = cap || (small ? 90000 : 220000);
  const root = new Float32Array(N * 3), shape = new Float32Array(N * 4);
  const camZ = 42;
  let n = 0, tries = 0;
  while (n < N && tries < N * 4) {
    tries++;
    // More blades close to the camera; the visible width widens with distance.
    const z = camZ - 2 - Math.pow(Math.random(), 1.8) * (camZ - (Z0 - D) - 2);
    const dist = camZ - z;
    const half = Math.min(W / 2, 10 + dist * 0.9);
    const x = (Math.random() * 2 - 1) * half;
    const h = heightAt(x, z);
    if (h < 4.5 - 0.01 * z + 0.12) continue; // the river
    root.set([x, h, z], n * 3);
    const grow = 1 + dist * 0.02;
    shape.set([Math.random() * 6.283, (0.45 + Math.random() * 0.45) * grow, (0.07 + Math.random() * 0.04) * grow, 0.75 + Math.random() * 0.4], n * 4);
    n++;
  }
  const geo = new InstancedBufferGeometry();
  geo.index = blade.index; geo.setAttribute('position', blade.getAttribute('position'));
  geo.setAttribute('aRoot', new InstancedBufferAttribute(root, 3));
  geo.setAttribute('aShape', new InstancedBufferAttribute(shape, 4));
  geo.instanceCount = n;

  const mat = new ShaderMaterial({
    vertexShader: VERT, fragmentShader: FRAG, side: DoubleSide,
    uniforms: {
      uTime: { value: 0 }, uFlat: { value: 1 },
      uRoot: { value: new Color(0x0b2a12) }, uTip: { value: new Color(0x5aa847) },
      uFog: { value: new Color(0x0a0d16) }, uFogNear: { value: 30 }, uFogFar: { value: 150 },
    },
  });
  const mesh = new Mesh(geo, mat);
  mesh.frustumCulled = false;
  const update = (t: number, flat: number) => {
    mat.uniforms.uTime.value = t; mat.uniforms.uFlat.value = flat;
    mesh.visible = flat > 0.02;
  };
  return { mesh, update, disposables: [blade, geo, mat] as { dispose: () => void }[] };
}
