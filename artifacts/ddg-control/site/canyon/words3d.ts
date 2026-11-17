import { DoubleSide, Group, Mesh, ShaderMaterial } from 'three';
import { FontLoader, type FontData } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import font from 'three/examples/fonts/helvetiker_regular.typeface.json';

/**
 * "We build it all." as solid 3D letters standing on the water just in front of the orb. The words
 * always turn to face the screen; as the visitor scrolls they sink into the river and fade away.
 * A faint upside-down copy under them reads as their reflection in the water.
 */

const VERT = /* glsl */ `
varying vec3 vN;
varying vec3 vObj;
void main() { vN = normal; vObj = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
// Front faces: cool white, a little brighter at the top. Sides: ice blue, lit from the upper left.
const FRAG = /* glsl */ `
uniform float uOpacity;
uniform float uTop;
varying vec3 vN;
varying vec3 vObj;
void main() {
  vec3 n = normalize(vN);
  float front = smoothstep(0.6, 0.95, n.z);
  float h = clamp(vObj.y / uTop, 0.0, 1.0);
  vec3 face = mix(vec3(0.72, 0.84, 0.95), vec3(0.97, 0.99, 1.0), h);
  float lit = 0.35 + 0.65 * max(dot(n, normalize(vec3(-0.5, 0.7, 0.5))), 0.0);
  vec3 side = vec3(0.16, 0.42, 0.62) * lit + vec3(0.3, 0.6, 0.8) * pow(1.0 - abs(n.z), 3.0) * 0.4;
  gl_FragColor = vec4(mix(side, face, front), uOpacity);
}`;

export function makeWords(text = 'We build it all.') {
  const parsed = new FontLoader().parse(font as unknown as FontData);
  const geo = new TextGeometry(text, {
    font: parsed, size: 1.15, depth: 0.32, curveSegments: 8,
    bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.02, bevelSegments: 2,
  });
  geo.computeBoundingBox();
  const bb = geo.boundingBox!;
  geo.translate(-(bb.min.x + bb.max.x) / 2, -bb.min.y, -(bb.min.z + bb.max.z) / 2); // stands on its base, centred
  const top = bb.max.y - bb.min.y;
  const mat = new ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, transparent: true, uniforms: { uOpacity: { value: 1 }, uTop: { value: top } } });
  const refl = new ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, transparent: true, depthWrite: false, side: DoubleSide, uniforms: { uOpacity: { value: 0.12 }, uTop: { value: top } } });
  const words = new Mesh(geo, mat), mirror = new Mesh(geo, refl);
  mirror.scale.y = -1;
  words.renderOrder = 3; mirror.renderOrder = 2; // after the river (1), so they sit over the water
  const group = new Group();
  group.add(words, mirror);
  return { group, mat, refl, disposables: [geo, mat, refl] as { dispose: () => void }[] };
}
