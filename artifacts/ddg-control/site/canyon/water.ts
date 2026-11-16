import {
  AdditiveBlending, BufferAttribute, BufferGeometry, DynamicDrawUsage, Mesh, Points, PointsMaterial, ShaderMaterial,
  Vector2, Vector3, type Texture,
} from 'three';

/**
 * The river on the canyon floor, and the spray the air orb throws up from it.
 *
 * River: a strip of water lying along the valley, a little above the floor, so the canyon walls
 * cut its banks. Its surface pattern runs towards the camera (down the canyon). Under the orb the
 * water is pressed into a bowl, spins in spiral arms and sends rings outwards.
 * Spray: droplets wound up from the water to the orb in a spout, and droplets flung out in arcs.
 */

export const WATER_VERT = /* glsl */ `
uniform float uTime;
uniform float uStir;
uniform vec2 uOrb;
varying vec2 vP;
varying float vDepth;
void main() {
  vec3 p = position;
  float d = length(p.xz - uOrb);
  float bowl = -0.7 * exp(-d * d / 10.0);
  float rings = 0.4 * sin(d * 1.5 - uTime * 6.0) * exp(-d / 7.0);
  p.y += uStir * (bowl + rings) + 0.07 * sin(p.z * 0.9 + p.x * 1.3 + uTime * 3.0);
  vP = p.xz;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vDepth = -mv.z;
  gl_Position = projectionMatrix * mv;
}`;

export const WATER_FRAG = /* glsl */ `
uniform float uTime;
uniform float uStir;
uniform float uOpacity;
uniform float uFogNear;
uniform float uFogFar;
uniform vec2 uOrb;
uniform vec3 uFog;
varying vec2 vP;
varying float vDepth;
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) { return 0.55 * noise(p) + 0.3 * noise(p * 2.1 + 3.7) + 0.15 * noise(p * 4.3 + 9.1); }
void main() {
  // The current: long streaks that travel towards +z, which is towards the camera.
  vec2 s = vec2(vP.x * 0.9, vP.y * 0.1 - uTime * 0.6);
  float body = fbm(s);
  float fine = fbm(s * 2.3 + vec2(7.0, -uTime * 0.5));
  float streak = smoothstep(0.52, 0.85, body * 0.6 + fine * 0.5);
  vec3 col = mix(vec3(0.02, 0.09, 0.17), vec3(0.07, 0.35, 0.55), body);
  vec3 glint = vec3(0.62, 0.9, 1.0);
  col += glint * streak * 0.65;

  // Under the orb: spiral arms turning the same way as the air, and rings running outwards.
  vec2 q = vP - uOrb;
  float d = length(q);
  float stir = uStir * exp(-d * d / 55.0);
  float turn = uTime * 1.6;
  vec2 r = vec2(q.x * cos(turn) - q.y * sin(turn), q.x * sin(turn) + q.y * cos(turn));
  float arms = sin(3.0 * atan(-q.y, q.x) + d * 0.9 - uTime * 5.0);
  float foam = smoothstep(0.2, 1.0, arms) * (0.45 + 0.75 * fbm(r * 0.9));
  float rings = smoothstep(0.6, 1.0, sin(d * 1.5 - uTime * 6.0));
  col += glint * stir * (foam * 0.85 + rings * 0.35);

  float fog = smoothstep(uFogNear, uFogFar, vDepth);
  gl_FragColor = vec4(mix(col, uFog, fog), uOpacity * 0.9);
}`;

export type WaterOptions = { small: boolean; zNear: number; heightAt: (x: number, z: number) => number; fogColor: number; glow: Texture };

export function makeWater({ small, zNear, heightAt, fogColor, glow }: WaterOptions) {
  // ── River ──────────────────────────────────────────────────────────────────────────────
  const COLS = small ? 20 : 34, ROWS = small ? 170 : 280, WIDTH = 30, Z_FAR = -150, RISE = 1.5;
  /** Water height at z: the valley floor, smoothed along the canyon, plus a little depth. */
  const levelAt = (z: number) => { let sum = 0; for (let o = -6; o <= 6; o += 2) sum += heightAt(0, z + o); return sum / 7 + RISE; };
  const pos = new Float32Array((COLS + 1) * (ROWS + 1) * 3), idx: number[] = [];
  for (let iz = 0, i = 0; iz <= ROWS; iz++) {
    const z = zNear + (iz / ROWS) * (Z_FAR - zNear), y = levelAt(z);
    for (let ix = 0; ix <= COLS; ix++, i++) { pos[i * 3] = -WIDTH / 2 + (ix / COLS) * WIDTH; pos[i * 3 + 1] = y; pos[i * 3 + 2] = z; }
  }
  for (let iz = 0; iz < ROWS; iz++) for (let ix = 0; ix < COLS; ix++) {
    const a = iz * (COLS + 1) + ix, b = a + 1, c = a + COLS + 1, d = c + 1;
    idx.push(a, c, b, b, c, d);
  }
  const riverGeo = new BufferGeometry();
  riverGeo.setAttribute('position', new BufferAttribute(pos, 3)); riverGeo.setIndex(idx);
  const uniforms = {
    uTime: { value: 0 }, uStir: { value: 1 }, uOpacity: { value: 1 }, uOrb: { value: new Vector2() },
    // The shader writes screen colours directly, so the fog colour is passed as plain 0-1 values.
    uFog: { value: new Vector3(((fogColor >> 16) & 255) / 255, ((fogColor >> 8) & 255) / 255, (fogColor & 255) / 255) }, uFogNear: { value: 30 }, uFogFar: { value: 150 },
  };
  const riverMat = new ShaderMaterial({ uniforms, vertexShader: WATER_VERT, fragmentShader: WATER_FRAG, transparent: true, depthWrite: false });
  const river = new Mesh(riverGeo, riverMat);
  river.frustumCulled = false; // the shader moves the surface, so the stored bounds are not exact
  river.renderOrder = 1; // after the canyon lines, so the water covers the lines beneath it

  // ── Spray ──────────────────────────────────────────────────────────────────────────────
  const SPOUT = small ? 130 : 240, SPLASH = small ? 110 : 200, N = SPOUT + SPLASH;
  const seed = new Float32Array(N * 3);
  for (let i = 0; i < N * 3; i++) seed[i] = Math.random();
  const sprayPos = new Float32Array(N * 3), sprayCol = new Float32Array(N * 3);
  const posAttr = new BufferAttribute(sprayPos, 3), colAttr = new BufferAttribute(sprayCol, 3);
  posAttr.setUsage(DynamicDrawUsage); colAttr.setUsage(DynamicDrawUsage);
  const sprayGeo = new BufferGeometry();
  sprayGeo.setAttribute('position', posAttr); sprayGeo.setAttribute('color', colAttr);
  const sprayMat = new PointsMaterial({ size: small ? 0.5 : 0.42, map: glow, vertexColors: true, blending: AdditiveBlending, transparent: true, depthWrite: false });
  const spray = new Points(sprayGeo, sprayMat);
  spray.frustumCulled = false; spray.renderOrder = 3;

  type Frame = {
    t: number; orbX: number; orbY: number; orbZ: number; orbR: number;
    /** 1 = canyon at full height, 0 = flattened. */ flat: number;
    /** 1 = orb right over the water, 0 = orb gone. */ stir: number;
    /** 1 = water fully shown. */ show: number; fogNear: number; fogFar: number;
  };
  const update = (f: Frame) => {
    river.scale.y = f.flat;
    uniforms.uTime.value = f.t; uniforms.uStir.value = f.stir; uniforms.uOpacity.value = f.show;
    uniforms.uOrb.value.set(f.orbX, f.orbZ); uniforms.uFogNear.value = f.fogNear; uniforms.uFogFar.value = f.fogFar;
    river.visible = spray.visible = f.show > 0.01;
    if (!river.visible) return;

    const waterY = (levelAt(f.orbZ) - 0.4) * f.flat, top = f.orbY - f.orbR * 0.55, power = f.stir * f.show;
    for (let i = 0; i < N; i++) {
      const a = seed[i * 3], b = seed[i * 3 + 1], c = seed[i * 3 + 2];
      let x: number, y: number, z: number, lit: number;
      if (i < SPOUT) {
        // Wound up from the water into the underside of the orb.
        const u = (b + f.t * (0.28 + c * 0.3)) % 1;
        const rad = 0.5 + 3.0 * (1 - u) * (1 - u) + f.orbR * 0.85 * u * u * u;
        const ang = a * 6.283 + u * 9 + f.t * 2;
        x = f.orbX + rad * Math.cos(ang); z = f.orbZ - rad * Math.sin(ang); y = waterY + (top - waterY) * u;
        lit = Math.pow(Math.sin(Math.PI * u), 0.7) * 0.8;
      } else {
        // Thrown out sideways in an arc, carried round by the wind, then falls back.
        const u = (b + f.t * (0.75 + c * 0.5)) % 1, s = u * 1.1;
        const rad = 1.4 + a * 2.6 + (3 + c * 4) * s, ang = (a * 37 + c * 11) % 6.283 + 1.6 * s;
        x = f.orbX + rad * Math.cos(ang); z = f.orbZ - rad * Math.sin(ang);
        const h = (5 + a * 5) * s - 9 * s * s;
        y = waterY + Math.max(0, h); lit = h > 0 ? 1 - u : 0;
      }
      lit *= power;
      sprayPos[i * 3] = x; sprayPos[i * 3 + 1] = y; sprayPos[i * 3 + 2] = z;
      sprayCol[i * 3] = lit * 0.7; sprayCol[i * 3 + 1] = lit * 0.92; sprayCol[i * 3 + 2] = lit;
    }
    posAttr.needsUpdate = true; colAttr.needsUpdate = true;
  };

  return { river, spray, update, disposables: [riverGeo, riverMat, sprayGeo, sprayMat] as { dispose: () => void }[] };
}
