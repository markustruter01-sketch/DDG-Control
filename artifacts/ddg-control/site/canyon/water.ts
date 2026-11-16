import {
  AdditiveBlending, BufferAttribute, BufferGeometry, DoubleSide, DynamicDrawUsage, Mesh, Points, PointsMaterial, ShaderMaterial,
  Vector2, Vector3, type Texture,
} from 'three';

/**
 * The river on the canyon floor, and the splashes the air orb throws up from it.
 *
 * River: a strip of water lying along the valley, well above the floor, so the canyon walls cut
 * its banks. It is shaded like real water at night: small waves that travel towards the camera
 * (down the canyon), a surface that mirrors the dark sky and the glow of the orb, colour that
 * goes from teal in the shallows to near-black in the deep middle, and foam along the banks.
 * Under the orb the water is pressed into a bowl, turns in spiral arms and sends rings outwards.
 * Splashes: droplets flung out from under the orb in low arcs.
 */

export const WATER_VERT = /* glsl */ `
attribute float aBed;
uniform float uTime;
uniform float uStir;
uniform vec2 uOrb;
varying vec2 vP;
varying vec3 vWorld;
varying float vView;
varying float vBed;
void main() {
  vec3 p = position;
  float d = length(p.xz - uOrb);
  float bowl = -1.1 * exp(-d * d / 16.0);
  float rings = 0.45 * sin(d * 1.5 - uTime * 6.0) * exp(-d / 8.0);
  float swell = 0.1 * sin(p.z * 0.55 + p.x * 0.4 + uTime * 2.2) + 0.06 * sin(p.z * 1.3 - p.x * 0.9 + uTime * 3.1);
  float lift = uStir * (bowl + rings) + swell;
  p.y += lift;
  vP = p.xz;
  vBed = aBed + lift;
  vec4 world = modelMatrix * vec4(p, 1.0);
  vWorld = world.xyz;
  vec4 mv = viewMatrix * world;
  vView = -mv.z;
  gl_Position = projectionMatrix * mv;
}`;

export const WATER_FRAG = /* glsl */ `
uniform float uTime;
uniform float uStir;
uniform float uGlow;
uniform float uOpacity;
uniform float uFogNear;
uniform float uFogFar;
uniform vec2 uOrb;
uniform vec3 uOrbPos;
uniform vec3 uFog;
varying vec2 vP;
varying vec3 vWorld;
varying float vView;
varying float vBed;
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float stirAt(float d) { return uStir * exp(-d * d / 90.0); }
float armsAt(vec2 q, float d) { return sin(3.0 * atan(-q.y, q.x) + d * 0.9 - uTime * 5.0); }
// One travelling ripple: adds its slope to g.
void ripple(vec2 f, float deg, float len, float amp, float speed, inout vec2 g) {
  float a = radians(deg), k = 6.2832 / len;
  vec2 dir = vec2(sin(a), cos(a));
  g += amp * k * dir * cos(dot(dir, f) * k + uTime * speed);
}
// Slope of the small waves. They ride the current, which runs towards +z (the camera).
// Sums of ripples of many sizes and headings, bent by slow noise so they never line up.
vec2 slope(vec2 p, float detail) {
  vec2 f = vec2(p.x, p.y - uTime * 4.0);
  f += 2.2 * vec2(noise(f * 0.13), noise(f * 0.13 + 31.7));
  vec2 g = vec2(0.0);
  ripple(f, 10.0, 7.0, 0.10, 1.1, g);
  ripple(f, -25.0, 4.3, 0.07, 1.6, g);
  ripple(f, 40.0, 2.9, 0.05, 2.1, g);
  ripple(f, -55.0, 1.9, 0.035, 2.7, g);
  // The fine ripples get a second, tighter bend, or they cross in a regular dotted pattern.
  vec2 f2 = f + 0.9 * vec2(noise(f * 0.6 + 7.3), noise(f * 0.6 + 19.1));
  vec2 fine = vec2(0.0);
  ripple(f2, 75.0, 1.37, 0.022, 3.3, fine);
  ripple(f2, -80.0, 0.93, 0.015, 3.9, fine);
  ripple(f2, 23.0, 0.61, 0.009, 4.6, fine);
  ripple(f2, -38.0, 0.47, 0.006, 5.2, fine);
  return g + fine * detail;
}
// Height the orb adds: spiral arms and rings.
float churnHeight(vec2 p) {
  vec2 q = p - uOrb;
  float d = length(q);
  return stirAt(d) * (0.3 * armsAt(q, d) + 0.25 * sin(d * 1.5 - uTime * 6.0));
}
void main() {
  // Far away the finest ripples are smaller than a pixel, so they are faded out there.
  vec2 g = slope(vP, 1.0 - smoothstep(20.0, 80.0, vView));
  float e = 0.2, c0 = churnHeight(vP);
  g += vec2(churnHeight(vP + vec2(e, 0.0)) - c0, churnHeight(vP + vec2(0.0, e)) - c0) / e;
  vec3 n = normalize(vec3(-g.x, 1.0, -g.y));
  vec3 v = normalize(cameraPosition - vWorld);
  vec3 r = reflect(-v, n);
  float fresnel = 0.03 + 0.97 * pow(1.0 - max(dot(n, v), 0.0), 5.0);

  // What the surface mirrors: a night sky, lighter towards the horizon, and the orb's glow.
  vec3 sky = mix(vec3(0.16, 0.27, 0.42), vec3(0.02, 0.035, 0.07), smoothstep(0.0, 0.55, r.y));
  vec3 toOrb = normalize(uOrbPos - vWorld);
  float aim = max(dot(r, toOrb), 0.0);
  sky += vec3(0.75, 0.92, 1.0) * uGlow * (pow(aim, 70.0) * 1.6 + pow(aim, 12.0) * 0.4);

  // What shows through: teal over the shallows, near-black where it is deep. The orb lights it a little.
  float depth = max(vBed, 0.0);
  vec3 body = mix(vec3(0.05, 0.3, 0.36), vec3(0.004, 0.03, 0.07), 1.0 - exp(-depth * 0.6));
  float reach = uGlow * exp(-length(uOrbPos.xz - vWorld.xz) / 16.0);
  body *= 0.75 + 1.3 * max(dot(n, toOrb), 0.0) * reach;
  vec3 col = mix(body, sky, fresnel);

  // Foam: along the banks, and where the orb churns the water.
  float lace = noise(vP * 1.6 + vec2(0.0, -uTime * 2.4)) * noise(vP * 4.3 + vec2(1.3, -uTime * 3.4));
  float shore = (1.0 - smoothstep(0.0, 0.55, depth)) * smoothstep(0.1, 0.32, lace);
  vec2 q = vP - uOrb;
  float d = length(q);
  float churn = stirAt(d) * (smoothstep(0.25, 1.0, armsAt(q, d)) * (0.35 + 1.6 * lace) + 0.3 * smoothstep(0.7, 1.0, sin(d * 1.5 - uTime * 6.0)));
  float foam = clamp(shore * 0.85 + churn, 0.0, 1.0);
  col = mix(col, vec3(0.8, 0.93, 1.0), foam * 0.85);

  // Thin water at the very edge lets the bank show through.
  float alpha = smoothstep(0.0, 0.15, depth) * mix(0.78, 0.97, 1.0 - exp(-depth * 1.2));
  alpha = max(alpha, foam * 0.8);
  float fog = smoothstep(uFogNear, uFogFar, vView);
  gl_FragColor = vec4(mix(col, uFog, fog), alpha * uOpacity);
}`;

export type WaterOptions = { small: boolean; zNear: number; heightAt: (x: number, z: number) => number; fogColor: number; glow: Texture };

export function makeWater({ small, zNear, heightAt, fogColor, glow }: WaterOptions) {
  // ── River ──────────────────────────────────────────────────────────────────────────────
  // LEVEL is the height of the surface. The valley floor averages about 1.3, so the river is about
  // 3 deep at its middle. SLOPE tilts it gently downhill towards the camera.
  const COLS = small ? 30 : 52, ROWS = small ? 170 : 280, WIDTH = 52, Z_FAR = -150, LEVEL = 4.5, SLOPE = 0.01;
  /** Water height at z. */
  const levelAt = (z: number) => LEVEL - SLOPE * z;
  const count = (COLS + 1) * (ROWS + 1);
  const pos = new Float32Array(count * 3), bed = new Float32Array(count), idx: number[] = [];
  for (let iz = 0, i = 0; iz <= ROWS; iz++) {
    const z = zNear + (iz / ROWS) * (Z_FAR - zNear), y = levelAt(z);
    for (let ix = 0; ix <= COLS; ix++, i++) {
      const x = -WIDTH / 2 + (ix / COLS) * WIDTH;
      pos[i * 3] = x; pos[i * 3 + 1] = y; pos[i * 3 + 2] = z;
      bed[i] = y - heightAt(x, z); // depth of water here; below zero means dry land
    }
  }
  for (let iz = 0; iz < ROWS; iz++) for (let ix = 0; ix < COLS; ix++) {
    const a = iz * (COLS + 1) + ix, b = a + 1, c = a + COLS + 1, d = c + 1;
    idx.push(a, c, b, b, c, d);
  }
  const riverGeo = new BufferGeometry();
  riverGeo.setAttribute('position', new BufferAttribute(pos, 3)); riverGeo.setAttribute('aBed', new BufferAttribute(bed, 1));
  riverGeo.setIndex(idx);
  const uniforms = {
    uTime: { value: 0 }, uStir: { value: 1 }, uGlow: { value: 1 }, uOpacity: { value: 1 },
    uOrb: { value: new Vector2() }, uOrbPos: { value: new Vector3() },
    // The shader writes screen colours directly, so the fog colour is passed as plain 0-1 values.
    uFog: { value: new Vector3(((fogColor >> 16) & 255) / 255, ((fogColor >> 8) & 255) / 255, (fogColor & 255) / 255) },
    uFogNear: { value: 30 }, uFogFar: { value: 150 },
  };
  // Both sides: like the canyon grid, these triangles face downwards.
  const riverMat = new ShaderMaterial({ uniforms, vertexShader: WATER_VERT, fragmentShader: WATER_FRAG, transparent: true, depthWrite: false, side: DoubleSide });
  const river = new Mesh(riverGeo, riverMat);
  river.frustumCulled = false; // the shader moves the surface, so the stored bounds are not exact
  river.renderOrder = 1; // after the canyon lines, so the water covers the lines beneath it

  // ── Splashes ───────────────────────────────────────────────────────────────────────────
  const N = small ? 90 : 160;
  const seed = new Float32Array(N * 3);
  for (let i = 0; i < N * 3; i++) seed[i] = Math.random();
  const sprayPos = new Float32Array(N * 3), sprayCol = new Float32Array(N * 3);
  const posAttr = new BufferAttribute(sprayPos, 3), colAttr = new BufferAttribute(sprayCol, 3);
  posAttr.setUsage(DynamicDrawUsage); colAttr.setUsage(DynamicDrawUsage);
  const sprayGeo = new BufferGeometry();
  sprayGeo.setAttribute('position', posAttr); sprayGeo.setAttribute('color', colAttr);
  const sprayMat = new PointsMaterial({ size: small ? 0.6 : 0.5, map: glow, vertexColors: true, blending: AdditiveBlending, transparent: true, depthWrite: false });
  const spray = new Points(sprayGeo, sprayMat);
  spray.frustumCulled = false; spray.renderOrder = 3;

  type Frame = {
    t: number; orbX: number; orbY: number; orbZ: number;
    /** 1 = canyon at full height, 0 = flattened. */ flat: number;
    /** 1 = orb right over the water, 0 = orb gone. */ stir: number;
    /** 1 = water fully shown. */ show: number; fogNear: number; fogFar: number;
  };
  const update = (f: Frame) => {
    river.scale.y = f.flat;
    uniforms.uTime.value = f.t; uniforms.uStir.value = f.stir; uniforms.uGlow.value = f.stir; uniforms.uOpacity.value = f.show;
    uniforms.uOrb.value.set(f.orbX, f.orbZ); uniforms.uOrbPos.value.set(f.orbX, f.orbY, f.orbZ);
    uniforms.uFogNear.value = f.fogNear; uniforms.uFogFar.value = f.fogFar;
    river.visible = spray.visible = f.show > 0.01;
    if (!river.visible) return;

    const waterY = (levelAt(f.orbZ) - 0.5) * f.flat, power = f.stir * f.show;
    for (let i = 0; i < N; i++) {
      // Thrown out sideways in a low arc, carried round by the wind, then falls back.
      const a = seed[i * 3], b = seed[i * 3 + 1], c = seed[i * 3 + 2];
      const u = (b + f.t * (0.75 + c * 0.5)) % 1, s = u * 1.1;
      const rad = 2.2 + a * 2.6 + (3 + c * 4) * s, ang = (a * 37 + c * 11) % 6.283 + 1.6 * s;
      const h = (3.5 + a * 4) * s - 9 * s * s, lit = h > 0 ? (1 - u) * power : 0;
      sprayPos[i * 3] = f.orbX + rad * Math.cos(ang); sprayPos[i * 3 + 1] = waterY + Math.max(0, h); sprayPos[i * 3 + 2] = f.orbZ - rad * Math.sin(ang);
      sprayCol[i * 3] = lit * 0.7; sprayCol[i * 3 + 1] = lit * 0.92; sprayCol[i * 3 + 2] = lit;
    }
    posAttr.needsUpdate = true; colAttr.needsUpdate = true;
  };

  return { river, spray, update, disposables: [riverGeo, riverMat, sprayGeo, sprayMat] as { dispose: () => void }[] };
}
