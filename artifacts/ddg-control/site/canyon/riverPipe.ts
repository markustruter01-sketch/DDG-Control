import {
  AdditiveBlending, BackSide, CatmullRomCurve3, Color, DynamicDrawUsage, FrontSide, Group, InstancedMesh, Mesh, Object3D,
  ShaderMaterial, SphereGeometry, TubeGeometry, Vector3,
} from 'three';
import { fluidRGB } from './tune';

/**
 * A glass pipe lying along the lowest line of the riverbed, running the whole length of the river.
 * Small glowing "data" particles stream through it towards the viewer. A soft glow around it stands
 * in for light scattering through the water (volumetric light). As the land flattens on scroll, the
 * pipe flattens with it and, seen from above, runs down the middle of the screen into the first
 * pipe on the page.
 */

const GLASS_VERT = /* glsl */ `
varying vec3 vN;
varying vec3 vW;
void main() { vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal); gl_Position = projectionMatrix * viewMatrix * w; }`;
// Glass: almost clear face-on, bright and tinted at the edges (fresnel), with a highlight from the orb.
const GLASS_FRAG = /* glsl */ `
uniform vec3 uTint;
uniform float uOpacity;
uniform float uRim;
uniform float uShow;
uniform float uJoin; // 0 = glass pipe in the river; 1 = drawn exactly like the page's pipes (thin glass, blue water)
uniform float uInk; // 1 = the water is white ink
uniform vec3 uInkCol;
uniform vec3 uOrbPos;
varying vec3 vN;
varying vec3 vW;
void main() {
  vec3 v = normalize(cameraPosition - vW), n = normalize(vN);
  float f = pow(1.0 - abs(dot(n, v)), 2.5);
  if (uJoin > 0.001) {
    // The page pipe in cross-section: a faint light wall, then blue water in the middle.
    float across = abs(dot(n, v));
    vec3 page = mix(vec3(0.17, 0.18, 0.2), mix(vec3(0.165, 0.56, 0.74), uInkCol, uInk), smoothstep(0.55, 0.75, across));
    page = mix(vec3(0.04, 0.05, 0.08), page, smoothstep(0.15, 0.3, across));
    vec3 toO = normalize(uOrbPos - vW);
    vec3 glassCol = uTint * (0.25 + 1.6 * f * uRim);
    gl_FragColor = vec4(mix(glassCol, page, uJoin), mix(uOpacity + f * 0.55 * uRim, 1.0, uJoin) * uShow);
    return;
  }
  vec3 toOrb = normalize(uOrbPos - vW);
  float spec = pow(max(dot(reflect(-toOrb, n), v), 0.0), 40.0);
  vec3 col = uTint * (0.25 + 1.6 * f * uRim) + vec3(0.9, 0.97, 1.0) * spec * 0.8;
  gl_FragColor = vec4(col, (uOpacity + f * 0.55 * uRim + spec * 0.5) * uShow);
}`;
// The glow: a wider tube drawn from the inside, bright where you look through the middle of it.
const GLOW_FRAG = /* glsl */ `
uniform vec3 uTint;
uniform float uGlow;
uniform float uShow;
varying vec3 vN;
varying vec3 vW;
void main() {
  vec3 v = normalize(cameraPosition - vW), n = normalize(vN);
  float c = pow(abs(dot(n, v)), 3.0);
  gl_FragColor = vec4(uTint * c * uGlow * 0.35 * uShow, 1.0);
}`;
// White ink: wispy strands of white liquid flowing through the pipe towards the viewer (tuner option).
const INK_VERT = /* glsl */ `
varying vec3 vN;
varying vec3 vW;
varying vec2 vUv;
void main() { vUv = uv; vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal); gl_Position = projectionMatrix * viewMatrix * w; }`;
const INK_FRAG = /* glsl */ `
uniform float uTime;
uniform float uSpeed;
uniform float uThick;
uniform float uShow;
uniform float uJoin;
uniform vec3 uColor;
varying vec3 vN;
varying vec3 vW;
varying vec2 vUv;
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}
float fbm(vec2 p) { float v = 0.0, a = 0.5; for (int i = 0; i < 4; i++) { v += a * noise(p); p = p * 2.03 + 7.1; a *= 0.5; } return v; }
void main() {
  vec3 v = normalize(cameraPosition - vW), n = normalize(vN);
  float face = abs(dot(n, v));
  float along = vUv.x * 240.0 - uTime * uSpeed;
  float ang = vUv.y * 6.2832;
  // Strands that twist slowly as they flow (continuous all the way round the tube).
  vec2 q = vec2(along * 0.45, cos(ang) * 1.6 + 0.6 * sin(along * 0.11));
  vec2 r = vec2(along * 0.45 + 13.0, sin(ang) * 1.6 + 0.6 * cos(along * 0.09));
  float f = 0.5 * (fbm(q) + fbm(r));
  float strands = smoothstep(0.38, 0.7, f);
  float body = smoothstep(0.08, 0.8, face);
  float a = clamp(body * mix(0.45 + 0.55 * strands, 1.0, uJoin) * uThick * 1.3, 0.0, 1.0);
  gl_FragColor = vec4(uColor, a * uShow);
}`;
const DOT_VERT = /* glsl */ `
varying vec3 vN;
void main() { vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0); }`;
const DOT_FRAG = /* glsl */ `
uniform vec3 uColor;
uniform float uBright;
uniform float uShow;
varying vec3 vN;
void main() { float c = 0.5 + 0.5 * abs(vN.z); gl_FragColor = vec4(uColor * uBright * (0.7 + 0.6 * c) * uShow, 1.0); }`;

type Opts = { heightAt: (x: number, z: number) => number; zFar: number; zNear: number; small: boolean };

export function makeRiverPipe({ heightAt, zFar, zNear, small }: Opts) {
  // The lowest point of the bed across each slice of the river.
  const pts: Vector3[] = [];
  for (let z = zFar; z <= zNear; z += 4) {
    // Straight down the middle (so it lines up with the page's pipe), at the bed's lowest point near it.
    let by = Infinity;
    for (let x = -3; x <= 3; x += 0.5) by = Math.min(by, heightAt(x, z));
    pts.push(new Vector3(0, by, z));
  }
  const curve = new CatmullRomCurve3(pts);
  const tube = new TubeGeometry(curve, 400, 1, 24, false);
  const glowTube = new TubeGeometry(curve, 300, 1, 20, false);

  const tint = new Color(0x6cc7f0);
  const shared = { uTint: { value: tint }, uShow: { value: 1 }, uJoin: { value: 0 }, uInk: { value: 0 }, uInkCol: { value: new Color(1, 1, 1) }, uOrbPos: { value: new Vector3() } };
  const glass = new ShaderMaterial({
    vertexShader: GLASS_VERT, fragmentShader: GLASS_FRAG, transparent: true, depthWrite: false, side: FrontSide,
    uniforms: { ...shared, uOpacity: { value: 0.12 }, uRim: { value: 1 } },
  });
  const glow = new ShaderMaterial({
    vertexShader: GLASS_VERT, fragmentShader: GLOW_FRAG, transparent: true, depthWrite: false, side: BackSide, blending: AdditiveBlending,
    uniforms: { ...shared, uGlow: { value: 1 } },
  });
  const inkMat = new ShaderMaterial({
    vertexShader: INK_VERT, fragmentShader: INK_FRAG, transparent: true, depthWrite: false, side: FrontSide,
    uniforms: { uTime: { value: 0 }, uSpeed: { value: 6 }, uThick: { value: 1 }, uShow: { value: 1 }, uJoin: shared.uJoin, uColor: shared.uInkCol },
  });
  const inkCore = new Mesh(new TubeGeometry(curve, 400, 0.55, 20, false), inkMat);
  inkCore.renderOrder = 0.65; inkCore.frustumCulled = false;
  const pipe = new Mesh(tube, glass), halo = new Mesh(glowTube, glow);
  pipe.renderOrder = 0.6; halo.renderOrder = 0.5; // before the water (1), so the water lies over them
  pipe.frustumCulled = halo.frustumCulled = false;

  // Data particles streaming through the pipe towards the viewer.
  const MAX = small ? 300 : 700;
  const seed = new Float32Array(MAX * 3);
  for (let i = 0; i < MAX * 3; i++) seed[i] = Math.random();
  const dotGeo = new SphereGeometry(1, 8, 6);
  const dotMat = new ShaderMaterial({
    vertexShader: DOT_VERT, fragmentShader: DOT_FRAG, transparent: true, depthWrite: false, blending: AdditiveBlending,
    uniforms: { uColor: { value: new Color(0x8fe6ff) }, uBright: { value: 1 }, uShow: { value: 1 } },
  });
  const dots = new InstancedMesh(dotGeo, dotMat, MAX);
  dots.instanceMatrix.setUsage(DynamicDrawUsage);
  dots.frustumCulled = false; dots.renderOrder = 0.7;
  const one = new Object3D(), p = new Vector3();

  const group = new Group();
  group.add(halo, inkCore, pipe, dots);

  let radius = 0.6, count = 0.5, size = 1, speed = 1, lift = 0, ink = 0;
  const cool = new Color(0x8fe6ff), mint = new Color(0x7ff0c0), white = new Color(0xffffff);
  const setLook = (k: Record<string, number>) => {
    radius = 0.6 * k.pipeRadius; count = k.dataCount; size = k.dataSize; speed = k.dataSpeed; lift = k.pipeLift;
    glass.uniforms.uOpacity.value = 0.12 * k.pipeGlass; glass.uniforms.uRim.value = k.pipeRim;
    glow.uniforms.uGlow.value = k.pipeGlow;
    dotMat.uniforms.uBright.value = k.dataBright;
    const c = k.dataColour; // 0 ice blue, 1 mint, 2 white
    dotMat.uniforms.uColor.value.copy(c <= 1 ? cool.clone().lerp(mint, c) : mint.clone().lerp(white, c - 1));
    group.visible = k.pipeOn > 0.5;
    ink = k.pipeFluid > 0.5 ? 1 : 0;
    shared.uInk.value = ink; inkCore.visible = ink > 0;
    shared.uInkCol.value.setRGB(...fluidRGB(k));
    inkMat.uniforms.uSpeed.value = 4 * k.inkSpeed; inkMat.uniforms.uThick.value = k.inkThick;
  };

  /** `flat` follows the land as it flattens (1 = full height); `show` fades it with the stage. */
  /** `join` (0-1): near the end of the scroll the pipe narrows to `joinWidth` (a fraction of its own width)
   *  and takes on the page pipe's look, so it runs straight into the first pipe on the page. */
  const update = (t: number, flat: number, orb: Vector3, show: number, join = 0, joinWidth = 1) => {
    if (!group.visible) return;
    group.scale.set(1 + (joinWidth - 1) * join, Math.max(flat, 0.02), 1);
    shared.uJoin.value = join; halo.visible = join < 0.98;
    dotMat.uniforms.uShow.value = show * (1 - join) * (1 - ink);
    inkMat.uniforms.uTime.value = t; inkMat.uniforms.uShow.value = show;
    group.position.y = (1 - flat) * 0.15 + lift * flat;
    shared.uShow.value = show; shared.uOrbPos.value.copy(orb);
    const n = Math.round(MAX * Math.min(1, count));
    for (let i = 0; i < MAX; i++) {
      if (i >= n) { one.scale.setScalar(0); one.updateMatrix(); dots.setMatrixAt(i, one.matrix); continue; }
      const u = (seed[i * 3] + t * 0.012 * speed * (0.7 + 0.6 * seed[i * 3 + 1])) % 1;
      curve.getPointAt(Math.min(0.999, Math.max(0, u)), p); // the very end can round past 1
      const a = seed[i * 3 + 2] * 6.283, r = radius * 0.55 * Math.sqrt(seed[(i * 3 + 4) % (MAX * 3)]);
      one.position.set(p.x + Math.cos(a) * r, p.y + Math.sin(a) * r * Math.max(flat, 0.05), p.z);
      one.scale.setScalar(0.07 * size * (0.6 + 0.8 * seed[i * 3 + 1]));
      one.updateMatrix(); dots.setMatrixAt(i, one.matrix);
    }
    dots.instanceMatrix.needsUpdate = true;
  };
  return { group, setLook, update, curve, rebuild: (r: number) => {
    // Rebuild the tubes when the radius slider moves (cheap: a few hundred rings).
    pipe.geometry.dispose(); halo.geometry.dispose(); inkCore.geometry.dispose();
    pipe.geometry = new TubeGeometry(curve, 400, r, 24, false);
    inkCore.geometry = new TubeGeometry(curve, 400, r * 0.55, 20, false);
    halo.geometry = new TubeGeometry(curve, 300, r * 2.6, 20, false);
  }, disposables: [tube, glowTube, glass, glow, dotGeo, dotMat, inkMat, { dispose: () => { pipe.geometry.dispose(); halo.geometry.dispose(); inkCore.geometry.dispose(); } }] as { dispose: () => void }[] };
}
