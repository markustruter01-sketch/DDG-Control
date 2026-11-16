import { BackSide, Mesh, ShaderMaterial, SphereGeometry, Vector3 } from 'three';

/**
 * The night sky: stars and the Milky Way running diagonally across the view.
 *
 * It is drawn by a formula, not loaded from a photo: `skyColor(direction)` gives the colour of
 * the sky in any direction. The sky dome uses it, and so does the river (water.ts) for its
 * reflections, so what the water mirrors is exactly the sky above it.
 */
export const SKY_GLSL = /* glsl */ `
float skyHash(vec3 p) { return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
float skyNoise(vec3 p) {
  vec3 i = floor(p), f = fract(p);
  vec3 u = f * f * (3.0 - 2.0 * f);
  float a = mix(mix(skyHash(i), skyHash(i + vec3(1.0, 0.0, 0.0)), u.x), mix(skyHash(i + vec3(0.0, 1.0, 0.0)), skyHash(i + vec3(1.0, 1.0, 0.0)), u.x), u.y);
  float b = mix(mix(skyHash(i + vec3(0.0, 0.0, 1.0)), skyHash(i + vec3(1.0, 0.0, 1.0)), u.x), mix(skyHash(i + vec3(0.0, 1.0, 1.0)), skyHash(i + vec3(1.0, 1.0, 1.0)), u.x), u.y);
  return mix(a, b, u.z);
}
float skyFbm(vec3 p) { float v = 0.0, a = 0.5; for (int i = 0; i < 5; i++) { v += a * skyNoise(p); p = p * 2.03 + 11.3; a *= 0.5; } return v; }
// One layer of stars: the sphere of directions is cut into cells, and some cells hold one star.
float skyStars(vec3 d, float cells, float chance, float size) {
  vec3 p = d * cells, c = floor(p);
  if (skyHash(c) > chance) return 0.0;
  vec3 at = (vec3(skyHash(c + 1.7), skyHash(c + 5.3), skyHash(c + 9.1)) - 0.5) * 0.5;
  float bright = 0.2 + 1.3 * pow(skyHash(c + 3.3), 5.0);
  return bright * smoothstep(size, 0.0, length(fract(p) - 0.5 - at));
}
// MILKY_AXIS is the pole of the Milky Way's band; MILKY_CORE the direction of its brightest part.
const vec3 MILKY_AXIS = vec3(0.6543, -0.7436, -0.1376);
const vec3 MILKY_CORE = vec3(0.3016, 0.4235, -0.8542);
vec3 skyColor(vec3 d) {
  vec3 col = mix(vec3(0.040, 0.052, 0.088), vec3(0.008, 0.012, 0.028), pow(clamp(d.y, 0.0, 1.0), 0.55));
  float lat = dot(d, MILKY_AXIS) + (skyFbm(d * 3.0) - 0.5) * 0.14;
  float band = exp(-lat * lat / 0.032);
  float clouds = skyFbm(d * 6.0 + 3.0);
  float dust = smoothstep(0.42, 0.7, skyFbm(d * 10.0 + 20.0)) * exp(-lat * lat / 0.006);
  float core = 0.4 + 0.6 * exp(-pow(distance(d, MILKY_CORE) / 0.95, 2.0));
  float milky = band * (0.25 + 1.1 * clouds * clouds * 2.0) * core * (1.0 - 0.8 * dust);
  col += milky * vec3(0.17, 0.22, 0.32) + milky * milky * vec3(0.20, 0.17, 0.15) * 0.5;
  float stars = skyStars(d, 55.0, 0.05, 0.13) * 1.5 + skyStars(d, 105.0, 0.1 + 0.25 * band, 0.2) + skyStars(d, 190.0, 0.12 + 0.5 * band, 0.3) * 0.55;
  return col + stars * vec3(0.85, 0.92, 1.0);
}`;

const VERT = /* glsl */ `
varying vec3 vDir;
void main() {
  vDir = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const FRAG = /* glsl */ `
${SKY_GLSL}
uniform float uShow;
uniform vec3 uFog;
varying vec3 vDir;
void main() { gl_FragColor = vec4(mix(uFog, skyColor(normalize(vDir)), uShow), 1.0); }`;

/** A dome that always sits round the camera. `fogColor` is what it fades to when hidden. */
export function makeSky(fogColor: number) {
  const uniforms = {
    uShow: { value: 1 },
    // The shader writes screen colours directly, so the fog colour is passed as plain 0-1 values.
    uFog: { value: new Vector3(((fogColor >> 16) & 255) / 255, ((fogColor >> 8) & 255) / 255, (fogColor & 255) / 255) },
  };
  const geo = new SphereGeometry(450, 48, 32);
  const mat = new ShaderMaterial({ uniforms, vertexShader: VERT, fragmentShader: FRAG, side: BackSide, depthWrite: false, depthTest: false });
  const dome = new Mesh(geo, mat);
  dome.frustumCulled = false; dome.renderOrder = -1; // behind everything
  /** Keep the dome round the camera; `show` 1 = full sky, 0 = plain background colour. */
  const update = (cameraPosition: Vector3, show: number) => { dome.position.copy(cameraPosition); uniforms.uShow.value = show; };
  return { dome, update, disposables: [geo, mat] as { dispose: () => void }[] };
}
