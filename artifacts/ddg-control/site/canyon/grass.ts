import {
  BufferAttribute, BufferGeometry, Color, DoubleSide, InstancedBufferAttribute, InstancedBufferGeometry, Mesh, ShaderMaterial, Vector3,
} from 'three';

/**
 * A field of short, thick grass over the hills instead of the line grid. Every blade is a thin,
 * flat, tapered strip, bent by a soft wind that rolls across the field in slow waves. The ground
 * under the blades is painted as more grass, so no bare earth shows between them.
 *
 * Lighting is done like a film camera would see a moonlit field: cool moonlight from behind (so
 * the blades glow where light passes through them), the orb as a blue light that brightens the
 * grass near it, darker roots, lighter tips, slow patches of colour, and a filmic tone curve.
 */

const LIGHT = /* glsl */ `
uniform vec3 uOrbPos;
uniform vec3 uFog;
uniform float uFogNear;
uniform float uFogFar;
uniform float uTime;
float h2(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n2(vec2 p) { vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(h2(i), h2(i + vec2(1.0, 0.0)), u.x), mix(h2(i + vec2(0.0, 1.0)), h2(i + vec2(1.0, 1.0)), u.x), u.y); }
vec3 tone(vec3 c) { return clamp((c * (2.51 * c + 0.03)) / (c * (2.43 * c + 0.59) + 0.14), 0.0, 1.0); }
// up: 0 at the root, 1 at the tip. n: the blade's face. Returns the final colour, fog included.
vec3 shadeGrass(vec3 world, vec3 n, float up, float shade) {
  vec3 v = normalize(cameraPosition - world);
  vec3 moon = normalize(vec3(-0.35, 0.55, -0.75));
  // Slow patches of colour across the field, like real grass.
  float spot = n2(world.xz * 0.06) * 0.6 + n2(world.xz * 0.21 + 3.0) * 0.4;
  vec3 root = vec3(0.012, 0.05, 0.02), tip = mix(vec3(0.16, 0.42, 0.11), vec3(0.24, 0.48, 0.12), spot);
  vec3 albedo = mix(root, tip, pow(up, 1.2)) * shade;
  float diff = 0.45 + 0.55 * abs(dot(n, moon));
  float through = pow(max(dot(v, -moon), 0.0), 3.0) * up;         // moonlight shining through the blade
  float ao = mix(0.22, 1.0, pow(up, 0.8));                          // roots sit in shadow
  vec3 sky = vec3(0.07, 0.1, 0.16);
  vec3 col = albedo * (sky * 2.2 + vec3(0.5, 0.6, 0.85) * (diff * 0.9 + through * 1.4)) * ao;
  // The orb lights the grass around it with a soft blue glow.
  vec3 toOrb = uOrbPos - world; float d2 = dot(toOrb, toOrb);
  float orb = 30.0 / (1.0 + d2 * 0.012) * (0.5 + 0.5 * abs(dot(n, normalize(toOrb))));
  col += albedo * vec3(0.35, 0.65, 1.0) * orb * 0.09 * ao;
  // A cool sheen on the tips where they catch the light.
  col += vec3(0.25, 0.32, 0.45) * pow(max(dot(reflect(-moon, n), v), 0.0), 20.0) * up * 0.25;
  col = tone(col * 1.6);
  return mix(col, uFog, smoothstep(uFogNear, uFogFar, length(cameraPosition - world)));
}`;

const VERT = /* glsl */ `
attribute vec3 aRoot;   // x, ground height, z
attribute vec4 aShape;  // turn, height, width, shade
uniform float uTime;
uniform float uFlat;
varying float vUp;
varying float vShade;
varying vec3 vWorld;
varying vec3 vN;
void main() {
  float up = position.y;
  float c = cos(aShape.x), s = sin(aShape.x);
  vec3 p = vec3(position.x * aShape.z * (1.0 - up * 0.8), up * aShape.y, 0.0);
  p = vec3(c * p.x, p.y, -s * p.x);
  vec2 w = aRoot.xz;
  float wave = sin(w.x * 0.11 + w.y * 0.07 - uTime * 1.3) * 0.5 + sin(w.x * 0.05 - w.y * 0.13 - uTime * 0.8) * 0.5;
  float flutter = sin(uTime * 4.0 + aShape.x * 7.0 + w.x) * 0.08;
  float bend = (0.25 + 0.35 * (wave * 0.5 + 0.5) + flutter) * up * up * aShape.y;
  p.x += bend * 0.8; p.z += bend * 0.35; p.y -= bend * bend * 0.12;
  vec3 world = vec3(aRoot.x, aRoot.y * uFlat, aRoot.z) + p * max(uFlat, 0.0);
  vUp = up;
  vShade = aShape.w * (0.85 + 0.3 * (wave * 0.5 + 0.5));
  vWorld = world;
  vN = normalize(vec3(s, 0.25, c));
  gl_Position = projectionMatrix * viewMatrix * vec4(world, 1.0);
}`;
const FRAG = /* glsl */ `
${LIGHT}
varying float vUp;
varying float vShade;
varying vec3 vWorld;
varying vec3 vN;
void main() { gl_FragColor = vec4(shadeGrass(vWorld, vN, vUp, vShade), 1.0); }`;

// The ground under the blades: painted as the dense lower part of the grass, with fine streaks.
const GROUND_VERT = /* glsl */ `
varying vec3 vWorld;
void main() { vec4 w = modelMatrix * vec4(position, 1.0); vWorld = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`;
const GROUND_FRAG = /* glsl */ `
${LIGHT}
varying vec3 vWorld;
void main() {
  float streak = n2(vWorld.xz * vec2(9.0, 3.0)) * 0.5 + n2(vWorld.xz * vec2(3.0, 11.0) + 7.0) * 0.5;
  gl_FragColor = vec4(shadeGrass(vWorld, vec3(0.0, 1.0, 0.0), 0.35 + 0.3 * streak, 0.9), 1.0);
}`;

type Opts = { small: boolean; heightAt: (x: number, z: number) => number; W: number; D: number; Z0: number };

export function makeGrass({ small, heightAt, W, D, Z0 }: Opts) {
  const blade = new BufferGeometry();
  const v: number[] = [], idx: number[] = [];
  const STEPS = 3;
  for (let i = 0; i <= STEPS; i++) { const y = i / STEPS; v.push(-0.5, y, 0, 0.5, y, 0); }
  for (let i = 0; i < STEPS; i++) { const a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
  blade.setAttribute('position', new BufferAttribute(new Float32Array(v), 3));
  blade.setIndex(idx);

  const cap = Number(/g(\d+)k/.exec(location.hash)?.[1] ?? 0) * 1000; // preview: lower count for slow screenshot machines
  const N = cap || (small ? 160000 : 400000);
  const root = new Float32Array(N * 3), shape = new Float32Array(N * 4);
  const camZ = 42;
  let n = 0, tries = 0;
  while (n < N && tries < N * 4) {
    tries++;
    const z = camZ - 2 - Math.pow(Math.random(), 2.0) * (camZ - (Z0 - D) - 2);
    const dist = camZ - z;
    const half = Math.min(W / 2, 10 + dist * 0.9);
    const x = (Math.random() * 2 - 1) * half;
    const h = heightAt(x, z);
    if (h < 4.5 - 0.01 * z + 0.12) continue;
    root.set([x, h, z], n * 3);
    const grow = 1 + dist * 0.03;
    shape.set([Math.random() * 6.283, (0.22 + Math.random() * 0.24) * grow, (0.1 + Math.random() * 0.06) * grow, 0.75 + Math.random() * 0.45], n * 4);
    n++;
  }
  const geo = new InstancedBufferGeometry();
  geo.index = blade.index; geo.setAttribute('position', blade.getAttribute('position'));
  geo.setAttribute('aRoot', new InstancedBufferAttribute(root, 3));
  geo.setAttribute('aShape', new InstancedBufferAttribute(shape, 4));
  geo.instanceCount = n;

  const shared = {
    uTime: { value: 0 }, uOrbPos: { value: new Vector3() },
    uFog: { value: new Color(0x0a0d16) }, uFogNear: { value: 30 }, uFogFar: { value: 150 },
  };
  const mat = new ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, side: DoubleSide, uniforms: { ...shared, uFlat: { value: 1 } } });
  const ground = new ShaderMaterial({ vertexShader: GROUND_VERT, fragmentShader: GROUND_FRAG, side: DoubleSide, uniforms: shared, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 });
  const mesh = new Mesh(geo, mat);
  mesh.frustumCulled = false;
  const update = (t: number, flat: number, orb: Vector3, fogNear: number, fogFar: number) => {
    shared.uTime.value = t; mat.uniforms.uFlat.value = flat;
    shared.uOrbPos.value.copy(orb); shared.uFogNear.value = fogNear; shared.uFogFar.value = fogFar;
    mesh.visible = flat > 0.02;
  };
  return { mesh, ground, update, disposables: [blade, geo, mat, ground] as { dispose: () => void }[] };
}
