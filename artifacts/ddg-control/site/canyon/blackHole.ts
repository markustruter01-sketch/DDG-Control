import { AdditiveBlending, BufferAttribute, BufferGeometry, DoubleSide, DynamicDrawUsage, Group, Mesh, MeshBasicMaterial, PlaneGeometry, Points, type Quaternion, RingGeometry, ShaderMaterial, SphereGeometry } from 'three';

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
  // Spinning very fast, the gas smears round into fine streaks (fewer bumps along the turn, more across it).
  float blur = 1.0 + 5.0 * uPower * uPower;
  float g = bhF(vec2(swirl * 2.2 / blur, u * 9.0 * (1.0 + uPower) - uSpin * 0.05)) * 0.75 + bhF(vec2(swirl * 7.0 / blur, u * 30.0 * (1.0 + uPower))) * 0.35;
  float heat = (1.0 - u) * 0.85 + g * 0.35;
  // Doppler: the side coming towards the camera is brighter.
  float dop = 0.85 + 0.25 * cos(a);
  float edge = smoothstep(0.0, 0.06, u) * (1.0 - smoothstep(0.6, 1.0, u));
  float k = edge * (0.35 + 0.9 * g) * dop * (0.85 + 1.4 * uPower) * uShow;
  k += exp(-u / 0.05) * 0.5 * uShow; // a thin white-hot inner edge
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
  float band = exp(-pow((r - h * (1.25 + 0.12 * side)) / (h * (0.07 + 0.2 * side)), 2.0)) * smoothstep(0.1, 0.6, side) * (vP.y > 0.0 ? 1.0 : 0.55);
  float g = bhF(vec2(a * 3.0 + uSpin * 0.8, r * 4.0));
  float k = (ring + band * (0.7 + 0.9 * g)) * (0.75 + 1.2 * uPower);
  // Soft glow round it all.
  k += exp(-max(0.0, r - h) / (h * 0.5)) * 0.18 * (0.5 + uPower);
  if (r < h * 1.0) k *= smoothstep(h * 0.96, h * 1.0, r); // nothing in front of the black
  k *= uShow;
  gl_FragColor = vec4(bhHeat(clamp(0.55 + 0.45 * g, 0.0, 1.0)) * k, k);
}`;

const ease = (x: number) => { const t = Math.min(1, Math.max(0, x)); return t * t * (3 - 2 * t); };

export function makeBlackHole(R: number) {
  const group = new Group();
  // The same size as the other orbs (Markus, 19 Nov): the disk at rest ends just inside the orb's radius, and is
  // half as wide as first built. It grows to twice its width as it charges (uOut).
  const HOLE = R * 0.4, IN = R * 0.5, OUT = R * 0.82;
  const holeGeo = new SphereGeometry(HOLE, 32, 24);
  const holeMat = new MeshBasicMaterial({ color: 0x000000 });
  const hole = new Mesh(holeGeo, holeMat); hole.renderOrder = 4; // drawn first: the disk's near side passes in front, its far side is hidden behind

  const diskUni = { uT: { value: 0 }, uSpin: { value: 0 }, uPower: { value: 0 }, uIn: { value: IN }, uOut: { value: OUT }, uShow: { value: 1 } };
  const diskGeo = new RingGeometry(IN, OUT * 2.05, 128, 1);
  const diskMat = new ShaderMaterial({ uniforms: diskUni, vertexShader: DISK_VERT, fragmentShader: DISK_FRAG, transparent: true, depthWrite: false, blending: AdditiveBlending, side: DoubleSide });
  const disk = new Mesh(diskGeo, diskMat); disk.renderOrder = 5;
  const tilt = new Group(); tilt.rotation.x = -Math.PI / 2 + 0.28; tilt.add(disk); // nearly edge-on, tipped a little towards the camera

  const cardUni = { uT: { value: 0 }, uSpin: { value: 0 }, uPower: { value: 0 }, uHole: { value: HOLE }, uShow: { value: 1 } };
  const cardGeo = new PlaneGeometry(R * 4, R * 4);
  const cardMat = new ShaderMaterial({ uniforms: cardUni, vertexShader: CARD_VERT, fragmentShader: CARD_FRAG, transparent: true, depthWrite: false, depthTest: false, blending: AdditiveBlending });
  const card = new Mesh(cardGeo, cardMat); card.renderOrder = 7; card.frustumCulled = false;

  // Sparks: a small pool of hot points living in the disk's own plane (so they fly off along it).
  const SPARKS = 90;
  const sPos = new Float32Array(SPARKS * 3), sVel = new Float32Array(SPARKS * 3), sA = new Float32Array(SPARKS), sLife = new Float32Array(SPARKS), sSpan = new Float32Array(SPARKS);
  const sparkGeo = new BufferGeometry();
  sparkGeo.setAttribute('position', new BufferAttribute(sPos, 3).setUsage(DynamicDrawUsage));
  sparkGeo.setAttribute('aA', new BufferAttribute(sA, 1).setUsage(DynamicDrawUsage));
  const sparkMat = new ShaderMaterial({
    uniforms: { uPx: { value: 800 } }, transparent: true, depthWrite: false, blending: AdditiveBlending,
    vertexShader: `attribute float aA; uniform float uPx; varying float vA;
      void main() { vA = aA; vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * mv; gl_PointSize = clamp(uPx * 0.09 / -mv.z, 1.5, 9.0) * (0.5 + 0.5 * aA); }`,
    fragmentShader: `varying float vA; void main() { float d = length(gl_PointCoord - 0.5); if (vA <= 0.0 || d > 0.5) discard;
      float k = smoothstep(0.5, 0.0, d) * vA; gl_FragColor = vec4(mix(vec3(1.0, 0.55, 0.15), vec3(1.0, 0.95, 0.8), vA) * k, k); }`,
  });
  const sparks = new Points(sparkGeo, sparkMat); sparks.frustumCulled = false; sparks.renderOrder = 8;
  disk.add(sparks);
  let emit = 0, next = 0;
  group.add(tilt, hole, card);
  let spin = 0;
  /**
   * `power` 0..1 (the charge), `show` 0..1 (fades it in and out), `camQ` the camera's turn (the card faces it).
   * Spins faster and grows a little as it charges.
   */
  const update = (t: number, dt: number, power: number, show: number, camQ: Quaternion, px = 800) => {
    sparkMat.uniforms.uPx.value = px;
    group.visible = show > 0.01;
    if (!group.visible) return;
    spin += dt * (0.6 + 22 * power * power); // faster and faster
    diskUni.uT.value = cardUni.uT.value = t;
    diskUni.uSpin.value = cardUni.uSpin.value = spin;
    diskUni.uPower.value = cardUni.uPower.value = power;
    diskUni.uShow.value = cardUni.uShow.value = show;
    card.quaternion.copy(camQ);
    // The disk, not the hole, does the spinning (Markus, 19 Nov): faster and faster, and wider, up to twice
    // its width at full charge.
    const out = OUT * (1 + ease(power));
    diskUni.uOut.value = out;
    // Sparks thrown off its rim, more as it spins faster (never many).
    emit += dt * 70 * power * power;
    while (emit >= 1) {
      emit -= 1;
      const i = next++ % SPARKS, a = Math.random() * Math.PI * 2, sp = (6 + 10 * power) * (0.7 + 0.6 * Math.random());
      const rr = out * (0.92 + 0.08 * Math.random());
      sPos[i * 3] = Math.cos(a) * rr; sPos[i * 3 + 1] = Math.sin(a) * rr; sPos[i * 3 + 2] = 0;
      // Off the rim along the spin (the gas pattern turns towards -angle), a little outwards and a little off the plane.
      sVel[i * 3] = Math.sin(a) * sp + Math.cos(a) * sp * 0.25; sVel[i * 3 + 1] = -Math.cos(a) * sp + Math.sin(a) * sp * 0.25; sVel[i * 3 + 2] = (Math.random() - 0.5) * sp * 0.3;
      sLife[i] = 1; sSpan[i] = 0.45 + 0.5 * Math.random();
    }
    for (let i = 0; i < SPARKS; i++) {
      if (sLife[i]! <= 0) { sA[i] = 0; continue; }
      sLife[i] = sLife[i]! - dt / sSpan[i]!;
      const drag = Math.exp(-1.6 * dt);
      sVel[i * 3] *= drag; sVel[i * 3 + 1] *= drag; sVel[i * 3 + 2] = sVel[i * 3 + 2]! * drag - 3 * dt; // they curve gently down
      sPos[i * 3] += sVel[i * 3]! * dt; sPos[i * 3 + 1] += sVel[i * 3 + 1]! * dt; sPos[i * 3 + 2] += sVel[i * 3 + 2]! * dt;
      sA[i] = Math.max(0, sLife[i]!) * show;
    }
    sparkGeo.attributes.position!.needsUpdate = true; sparkGeo.attributes.aA!.needsUpdate = true;
  };
  return { group, update, disposables: [holeGeo, holeMat, diskGeo, diskMat, cardGeo, cardMat, sparkGeo, sparkMat] as { dispose: () => void }[] };
}
