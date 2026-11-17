import { DoubleSide, Group, Mesh, ShaderMaterial } from 'three';
import { FontLoader, type FontData } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

/**
 * "We build it all." as solid 3D letters standing on the water in front of the orb. The words
 * always turn to face the screen; as the visitor scrolls they sink into the river and fade away.
 * A faint upside-down copy under them reads as their reflection in the water.
 * Fonts come with three.js and are only downloaded when chosen (order matches WORD_FONTS in tune.ts).
 */

type FontJson = { default: unknown };
const FONT_FILES: (() => Promise<FontJson>)[] = [
  () => import('three/examples/fonts/helvetiker_regular.typeface.json'),
  () => import('three/examples/fonts/helvetiker_bold.typeface.json'),
  () => import('three/examples/fonts/optimer_regular.typeface.json'),
  () => import('three/examples/fonts/optimer_bold.typeface.json'),
  () => import('three/examples/fonts/gentilis_regular.typeface.json'),
  () => import('three/examples/fonts/gentilis_bold.typeface.json'),
  () => import('three/examples/fonts/droid/droid_sans_regular.typeface.json'),
  () => import('three/examples/fonts/droid/droid_sans_bold.typeface.json'),
  () => import('three/examples/fonts/droid/droid_serif_regular.typeface.json'),
  () => import('three/examples/fonts/droid/droid_serif_bold.typeface.json'),
  () => import('three/examples/fonts/droid/droid_sans_mono_regular.typeface.json'),
];

const VERT = /* glsl */ `
varying vec3 vN;
varying vec3 vObj;
void main() { vN = normal; vObj = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
// Front faces: cool white, a little brighter at the top. Sides: ice blue, lit from the upper left.
const FRAG = /* glsl */ `
uniform float uOpacity;
uniform float uTop;
uniform float uBright;
varying vec3 vN;
varying vec3 vObj;
void main() {
  vec3 n = normalize(vN);
  float front = smoothstep(0.6, 0.95, n.z);
  float h = clamp(vObj.y / uTop, 0.0, 1.0);
  vec3 face = mix(vec3(0.72, 0.84, 0.95), vec3(0.97, 0.99, 1.0), h);
  float lit = 0.35 + 0.65 * max(dot(n, normalize(vec3(-0.5, 0.7, 0.5))), 0.0);
  vec3 side = vec3(0.16, 0.42, 0.62) * lit + vec3(0.3, 0.6, 0.8) * pow(1.0 - abs(n.z), 3.0) * 0.4;
  gl_FragColor = vec4(mix(side, face, front) * uBright, uOpacity);
}`;

export function makeWords(text = 'We build it all.') {
  const mat = new ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, transparent: true, uniforms: { uOpacity: { value: 1 }, uTop: { value: 1 }, uBright: { value: 1 } } });
  const refl = new ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, transparent: true, depthWrite: false, side: DoubleSide, uniforms: { uOpacity: { value: 0.12 }, uTop: { value: 1 }, uBright: { value: 1 } } });
  const words = new Mesh(undefined, mat), mirror = new Mesh(undefined, refl);
  mirror.scale.y = -1;
  words.renderOrder = 3; mirror.renderOrder = 2; // after the river (1), so they sit over the water
  const group = new Group();
  group.add(words, mirror);
  group.visible = false;

  let current = -1, wanted = -1;
  const build = (json: unknown) => {
    const font = new FontLoader().parse(json as FontData);
    const geo = new TextGeometry(text, { font, size: 1.15, depth: 0.32, curveSegments: 8, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.02, bevelSegments: 2 });
    geo.computeBoundingBox();
    const bb = geo.boundingBox!;
    geo.translate(-(bb.min.x + bb.max.x) / 2, -bb.min.y, -(bb.min.z + bb.max.z) / 2); // stands on its base, centred
    const top = bb.max.y - bb.min.y;
    mat.uniforms.uTop.value = refl.uniforms.uTop.value = top;
    words.geometry.dispose();
    words.geometry = mirror.geometry = geo;
  };
  /** Switch font (index into the list); loads it the first time it is used. */
  const setFont = (i: number) => {
    const n = Math.max(0, Math.min(FONT_FILES.length - 1, Math.round(i)));
    if (n === wanted) return;
    wanted = n;
    FONT_FILES[n]().then((m) => { if (wanted === n && current !== n) { build(m.default); current = n; } }).catch(() => { /* keep the last font */ });
  };
  return { group, mat, refl, setFont, ready: () => current >= 0, disposables: [mat, refl, { dispose: () => words.geometry.dispose() }] as { dispose: () => void }[] };
}
