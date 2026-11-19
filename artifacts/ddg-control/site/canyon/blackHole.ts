import { AdditiveBlending, DoubleSide, Group, Mesh, MeshBasicMaterial, PlaneGeometry, type Quaternion, RingGeometry, ShaderMaterial, SphereGeometry } from 'three';

/**
 * The black hole (orb 2 of 3, Markus 19 Nov). Press and hold: it spins up and starts swallowing the scene
 * (Stage.tsx bends the land's grid lines into it); at the top it bursts out as a white flash (the nova).
 *
 * Built light, for slow computers: a black ball (the event horizon), a flat glowing disk of hot gas round it
 * tilted towards the camera, and one camera-facing card that draws the thin bright photon ring and the
 * far side of the disk bent up over the top and under the bottom (the "Interstellar" look). Three draw calls.
 */

const NOISE = /* glsl */ `
float bhH(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float bhN(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(bhH(i), bhH(i + vec2(1.0, 0.0)), f.x), mix(bhH(i + vec2(0.0, 1.0)), bhH(i + vec2(1.0, 1.0)), f.x), f.y); }
float bhF(vec2 p) { float v = 0.0, a = 0.5; for (int i = 0; i < 4; i++) { v += a * bhN(p); p *= 2.07; a *= 0.5; } return v; }
// Hot gas: white at the inner edge, through gold to deep orange and red further out.
vec3 bhHeat(float t) { return mix(mix(vec3(1.0, 0.36, 0.08), vec3(1.0, 0.72, 0.32), smoothstep(0.0, 0.5, t)), vec3(1.0, 0.97, 0.9), smoothstep(0.55, 1.0, t)); }`;

const DISK_VERT = /* glsl */ `varying vec2 vP; void main() { vP = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const DISK_FRAG = /* glsl */ `
uniform float uT; uniform float uSpin; uniform float uPower; uniform float uIn; uniform float uOut; uniform float uShow;
varying vec2 vP;
${NOISE}
void main() {
  float r = length(vP), a = atan(vP.y, vP.x);
  float u = (r - uIn) / (uOut - uIn); // 0 inner edge .. 1 outer edge
  if (u < 0.0 || u > 1.0) discard;
  // Gas streams round, faster near the middle (spiral arms that wind as they turn).
  float swirl = a + uSpin / (0.35 + u) + u * 3.0;
  float g = bhF(vec2(swirl * 2.2, u * 9.0 - uSpin * 0.4)) * 0.75 + bhF(vec2(swirl * 7.0, u * 30.0)) * 0.35;
  float heat = (1.0 - u) * 0.85 + g * 0.35;
  // Doppler: the side coming towards the camera is brighter.
  float dop = 0.65 + 0.55 * sin(a + 1.57);
  float edge = smoothstep(0.0, 0.06, u) * (1.0 - smoothstep(0.6, 1.0, u));
  float k = edge * (0.45 + 1.1 * g) * dop * (1.1 + 1.4 * uPower) * uShow;
  gl_FragColor = vec4(bhHeat(clamp(heat, 0.0, 1.0)) * k, k);
}`;

// The camera-facing card: photon ring, and the disk's far side lensed into arcs above and below the hole.
const CARD_VERT = /* glsl */ `varying vec2 vP; void main() { vP = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const CARD_FRAG = /* glsl */ `
uniform float uT; uniform float uSpin; uniform float uPower; uniform float uHole; uniform float uShow;
varying vec2 vP;
${NOISE}
void main() {
  float r = length(vP), a = atan(vP.y, vP.x);
  float h = uHole;
  // Thin, very bright ring just outside the horizon.
  float ring = exp(-pow((r - h * 1.06) / (h * 0.035), 2.0)) * 1.4;
  // The far side of the disk, bent over the top and under the bottom: a band hugging the hole, thick at the
  // top and bottom, thinning to nothing at the sides.
  float side = abs(sin(a));
  float band = exp(-pow((r - h * (1.22 + 0.1 * side)) / (h * (0.06 + 0.16 * side)), 2.0)) * smoothstep(0.15, 0.7, side);
  float g = bhF(vec2(a * 3.0 + uSpin * 0.8, r * 4.0));
  float k = (ring + band * (0.9 + 1.2 * g)) * (1.0 + 1.0 * uPower);
  // Soft glow round it all.
  k += exp(-max(0.0, r - h) / (h * 0.5)) * 0.18 * (0.5 + uPower);
  if (r < h * 1.0) k *= smoothstep(h * 0.96, h * 1.0, r); // nothing in front of the black
  k *= uShow;
  gl_FragColor = vec4(bhHeat(clamp(0.55 + 0.45 * g, 0.0, 1.0)) * k, k);
}`;

export function makeBlackHole(R: number) {
  const group = new Group();
  const HOLE = R * 0.46, IN = R * 0.62, OUT = R * 2.4;
  const holeGeo = new SphereGeometry(HOLE, 32, 24);
  const holeMat = new MeshBasicMaterial({ color: 0x000000 });
  const hole = new Mesh(holeGeo, holeMat); hole.renderOrder = 4; // drawn first: the disk's near side passes in front, its far side is hidden behind

  const diskUni = { uT: { value: 0 }, uSpin: { value: 0 }, uPower: { value: 0 }, uIn: { value: IN }, uOut: { value: OUT }, uShow: { value: 1 } };
  const diskGeo = new RingGeometry(IN, OUT, 96, 1);
  const diskMat = new ShaderMaterial({ uniforms: diskUni, vertexShader: DISK_VERT, fragmentShader: DISK_FRAG, transparent: true, depthWrite: false, blending: AdditiveBlending, side: DoubleSide });
  const disk = new Mesh(diskGeo, diskMat); disk.renderOrder = 5;
  const tilt = new Group(); tilt.rotation.x = -Math.PI / 2 + 0.28; tilt.add(disk); // nearly edge-on, tipped a little towards the camera

  const cardUni = { uT: { value: 0 }, uSpin: { value: 0 }, uPower: { value: 0 }, uHole: { value: HOLE }, uShow: { value: 1 } };
  const cardGeo = new PlaneGeometry(R * 4, R * 4);
  const cardMat = new ShaderMaterial({ uniforms: cardUni, vertexShader: CARD_VERT, fragmentShader: CARD_FRAG, transparent: true, depthWrite: false, depthTest: false, blending: AdditiveBlending });
  const card = new Mesh(cardGeo, cardMat); card.renderOrder = 7; card.frustumCulled = false;

  group.add(tilt, hole, card);
  let spin = 0;
  /**
   * `power` 0..1 (the charge), `show` 0..1 (fades it in and out), `camQ` the camera's turn (the card faces it).
   * Spins faster and grows a little as it charges.
   */
  const update = (t: number, dt: number, power: number, show: number, camQ: Quaternion) => {
    group.visible = show > 0.01;
    if (!group.visible) return;
    spin += dt * (0.6 + 5 * power * power);
    diskUni.uT.value = cardUni.uT.value = t;
    diskUni.uSpin.value = cardUni.uSpin.value = spin;
    diskUni.uPower.value = cardUni.uPower.value = power;
    diskUni.uShow.value = cardUni.uShow.value = show;
    card.quaternion.copy(camQ);
    disk.scale.setScalar(1 + 0.25 * power);
  };
  return { group, update, disposables: [holeGeo, holeMat, diskGeo, diskMat, cardGeo, cardMat] as { dispose: () => void }[] };
}
