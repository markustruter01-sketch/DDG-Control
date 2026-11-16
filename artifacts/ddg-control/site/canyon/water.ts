import {
  AdditiveBlending, BufferAttribute, BufferGeometry, DoubleSide, DynamicDrawUsage, Mesh, Points, PointsMaterial, ShaderMaterial,
  Vector2, Vector3, type Texture,
} from 'three';

/**
 * The river on the valley floor, and the splashes the air orb throws up from it.
 *
 * River: a sheet of water at one level, laid on the same grid as the land, so the shader knows
 * exactly how deep the water is at every point and can fade it out softly where it meets a bank.
 * It is shaded like real water at night: smooth ripples that travel towards the camera (down
 * the valley), a surface that mirrors the dark sky and the glow of the orb, colour that goes
 * from teal in the shallows to near-black in the deep middle, and foam along the banks.
 * Under the orb the water is pressed into a wide dish and dragged round in spiral arms,
 * clockwise seen from above, the same way the orb spins. The arms fade to nothing at the very
 * centre, so they do not meet in a point there.
 * Splashes: droplets flung out from under the orb; the furthest land on the banks.
 */

// Shared by both shaders: how strongly the orb stirs the water at a distance d, and the spiral arms.
const STIR = /* glsl */ `
uniform float uTime;
uniform float uStir;
uniform vec2 uOrb;
float stirAt(float d) { return uStir * exp(-d * d / 220.0); }
float swirl(vec2 q, float d, float arms, float wind, float speed) {
  return sin(arms * atan(q.y, q.x + 0.0001) + d * wind - uTime * speed) * smoothstep(1.5, 6.5, d);
}`;

export const WATER_VERT = /* glsl */ `
attribute float aBed;
${STIR}
uniform float uFlat;
varying vec2 vP;
varying vec3 vWorld;
varying float vView;
varying float vBed;
void main() {
  vec3 p = position;
  vec2 q = p.xz - uOrb;
  float d = length(q);
  float dish = -0.9 * uStir * exp(-d * d / 40.0);
  float arms = 0.55 * swirl(q, d, 3.0, 0.9, 5.0) + 0.3 * swirl(q, d, 2.0, 0.35, 2.6);
  float swell = 0.1 * sin(p.z * 0.55 + p.x * 0.4 + uTime * 2.2) + 0.06 * sin(p.z * 1.3 - p.x * 0.9 + uTime * 3.1);
  float lift = dish + stirAt(d) * arms + swell;
  p.y += lift;
  vP = p.xz;
  vBed = (aBed + lift) * uFlat;
  vec4 world = modelMatrix * vec4(p, 1.0);
  vWorld = world.xyz;
  vec4 mv = viewMatrix * world;
  vView = -mv.z;
  gl_Position = projectionMatrix * mv;
}`;

export const WATER_FRAG = /* glsl */ `
${STIR}
uniform float uGlow;
uniform float uOpacity;
uniform float uFogNear;
uniform float uFogFar;
uniform vec3 uOrbPos;
uniform vec3 uFog;
varying vec2 vP;
varying vec3 vWorld;
varying float vView;
varying float vBed;
// Simplex noise (Ian McEwan, Ashima Arts, MIT licence). Smooth in every direction, so the water
// shows no square cells the way grid-based noise does.
vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m; m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 a0 = x - floor(x + 0.5);
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
vec2 turn(vec2 p, float a) { float c = cos(a), s = sin(a); return vec2(c * p.x - s * p.y, s * p.x + c * p.y); }
// Height of the surface detail. Ripples of four sizes ride the current, which runs towards +z
// (the camera); near the orb they are bent round it and the spiral arms are added.
float surface(vec2 p, float detail) {
  vec2 q = p - uOrb;
  float d = length(q), stir = stirAt(d);
  vec2 f = uOrb + turn(q, -1.1 * stir);
  f.y -= uTime * 4.0;
  float h = 0.5 * snoise(f * vec2(0.2, 0.1));
  h += 0.24 * snoise(f * vec2(0.47, 0.25) + vec2(3.1, -uTime * 0.35));
  h += 0.11 * snoise(f * vec2(1.05, 0.6) + vec2(-uTime * 0.3, 5.2));
  h += 0.05 * detail * snoise(f * vec2(2.2, 1.3) + vec2(uTime * 0.4, 1.7));
  h += stir * (0.5 * swirl(q, d, 3.0, 0.9, 5.0) + 0.14 * swirl(q, d, 7.0, 2.2, 9.0));
  return h;
}
void main() {
  if (vBed <= 0.0) discard;
  // Far away the finest ripples are smaller than a pixel, so they are faded out there.
  float detail = 1.0 - smoothstep(20.0, 80.0, vView);
  float e = 0.12, h0 = surface(vP, detail);
  vec3 n = normalize(vec3(-(surface(vP + vec2(e, 0.0), detail) - h0) / e, 1.0, -(surface(vP + vec2(0.0, e), detail) - h0) / e));
  vec3 v = normalize(cameraPosition - vWorld);
  vec3 r = reflect(-v, n);
  float fresnel = 0.03 + 0.97 * pow(1.0 - max(dot(n, v), 0.0), 5.0);

  // What the surface mirrors: a night sky, lighter towards the horizon, and the orb's glow.
  vec3 sky = mix(vec3(0.16, 0.27, 0.42), vec3(0.02, 0.035, 0.07), smoothstep(0.0, 0.55, r.y));
  vec3 toOrb = normalize(uOrbPos - vWorld);
  float aim = max(dot(r, toOrb), 0.0);
  sky += vec3(0.75, 0.92, 1.0) * uGlow * (pow(aim, 70.0) * 1.6 + pow(aim, 12.0) * 0.4);

  // What shows through: teal over the shallows, near-black where it is deep. The orb lights it a little.
  float depth = vBed;
  vec3 body = mix(vec3(0.05, 0.3, 0.36), vec3(0.004, 0.03, 0.07), 1.0 - exp(-depth * 0.6));
  float reach = uGlow * exp(-length(uOrbPos.xz - vWorld.xz) / 16.0);
  body *= 0.75 + 1.3 * max(dot(n, toOrb), 0.0) * reach;
  vec3 col = mix(body, sky, fresnel);

  // Foam: along the banks (more where the orb throws water at them), and on the spiral arms.
  vec2 q = vP - uOrb;
  float d = length(q), stir = stirAt(d);
  float lace = (0.5 + 0.5 * snoise(vP * 0.55 + vec2(0.0, -uTime * 1.3))) * (0.5 + 0.5 * snoise(vP * 1.5 + vec2(1.3, -uTime * 2.0)));
  float shore = (1.0 - smoothstep(0.0, 0.7, depth)) * smoothstep(0.12, 0.34, lace) * (0.55 + 1.6 * stir);
  float churn = stir * 1.3 * (smoothstep(0.2, 1.0, swirl(q, d, 3.0, 0.9, 5.0)) * (0.35 + 1.7 * lace) + smoothstep(0.5, 1.0, swirl(q, d, 7.0, 2.2, 9.0)) * (0.1 + 1.3 * lace));
  float foam = clamp(shore + churn, 0.0, 1.0);
  col = mix(col, vec3(0.8, 0.93, 1.0), foam * 0.85);

  // The water thins out to nothing exactly where it meets the land, so the edge is soft.
  float edge = smoothstep(0.0, 0.4, depth);
  float alpha = edge * max(mix(0.8, 0.97, 1.0 - exp(-depth * 1.2)), foam * 0.85);
  float fog = smoothstep(uFogNear, uFogFar, vView);
  gl_FragColor = vec4(mix(col, uFog, fog), alpha * uOpacity);
}`;

/** The land's grid, as Stage builds it: `base` holds the height of every grid point, row by row. */
export type LandGrid = { NX: number; NZ: number; W: number; D: number; Z0: number; base: Float32Array };
export type WaterOptions = { small: boolean; grid: LandGrid; heightAt: (x: number, z: number) => number; fogColor: number; glow: Texture };

export function makeWater({ small, grid, heightAt, fogColor, glow }: WaterOptions) {
  // ── River ──────────────────────────────────────────────────────────────────────────────
  // LEVEL is the height of the surface at z = 0; SLOPE tilts it gently downhill towards the camera.
  // The sheet covers the land grid's own points within HALF of the centre line, back to Z_FAR.
  const LEVEL = 4.5, SLOPE = 0.01, HALF = 44, Z_FAR = -150;
  const levelAt = (z: number) => LEVEL - SLOPE * z;
  const { NX, NZ, W, D, Z0, base } = grid, dx = W / NX, dz = D / NZ;
  const ix0 = Math.max(0, Math.floor((W / 2 - HALF) / dx)), ix1 = Math.min(NX, Math.ceil((W / 2 + HALF) / dx));
  const COLS = ix1 - ix0, ROWS = Math.min(NZ, Math.ceil((Z0 - Z_FAR) / dz));
  const count = (COLS + 1) * (ROWS + 1);
  const pos = new Float32Array(count * 3), bed = new Float32Array(count), idx: number[] = [];
  for (let iz = 0, i = 0; iz <= ROWS; iz++) {
    const z = Z0 - iz * dz, y = levelAt(z);
    for (let ix = ix0; ix <= ix1; ix++, i++) {
      pos[i * 3] = -W / 2 + ix * dx; pos[i * 3 + 1] = y; pos[i * 3 + 2] = z;
      bed[i] = y - base[iz * (NX + 1) + ix]; // depth of water here; below zero means dry land
    }
  }
  // Same triangle split as the land, so the depth between grid points matches the land exactly.
  for (let iz = 0; iz < ROWS; iz++) for (let ix = 0; ix < COLS; ix++) {
    const a = iz * (COLS + 1) + ix, b = a + 1, c = a + COLS + 1, d = c + 1;
    idx.push(a, c, b, b, c, d);
  }
  const riverGeo = new BufferGeometry();
  riverGeo.setAttribute('position', new BufferAttribute(pos, 3)); riverGeo.setAttribute('aBed', new BufferAttribute(bed, 1));
  riverGeo.setIndex(idx);
  const uniforms = {
    uTime: { value: 0 }, uStir: { value: 1 }, uGlow: { value: 1 }, uOpacity: { value: 1 }, uFlat: { value: 1 },
    uOrb: { value: new Vector2() }, uOrbPos: { value: new Vector3() },
    // The shader writes screen colours directly, so the fog colour is passed as plain 0-1 values.
    uFog: { value: new Vector3(((fogColor >> 16) & 255) / 255, ((fogColor >> 8) & 255) / 255, (fogColor & 255) / 255) },
    uFogNear: { value: 30 }, uFogFar: { value: 150 },
  };
  // Both sides: like the land grid, these triangles face downwards.
  const riverMat = new ShaderMaterial({ uniforms, vertexShader: WATER_VERT, fragmentShader: WATER_FRAG, transparent: true, depthWrite: false, side: DoubleSide });
  const river = new Mesh(riverGeo, riverMat);
  river.frustumCulled = false; // the shader moves the surface, so the stored bounds are not exact
  river.renderOrder = 1; // after the land's lines, so the water covers the lines beneath it

  // ── Splashes ───────────────────────────────────────────────────────────────────────────
  const N = small ? 150 : 280;
  const seed = new Float32Array(N * 3);
  for (let i = 0; i < N * 3; i++) seed[i] = Math.random();
  const sprayPos = new Float32Array(N * 3), sprayCol = new Float32Array(N * 3);
  const posAttr = new BufferAttribute(sprayPos, 3), colAttr = new BufferAttribute(sprayCol, 3);
  posAttr.setUsage(DynamicDrawUsage); colAttr.setUsage(DynamicDrawUsage);
  const sprayGeo = new BufferGeometry();
  sprayGeo.setAttribute('position', posAttr); sprayGeo.setAttribute('color', colAttr);
  const sprayMat = new PointsMaterial({ size: small ? 0.7 : 0.6, map: glow, vertexColors: true, blending: AdditiveBlending, transparent: true, depthWrite: false });
  const spray = new Points(sprayGeo, sprayMat);
  spray.frustumCulled = false; spray.renderOrder = 7; // over the orb

  type Frame = {
    t: number; orbX: number; orbY: number; orbZ: number;
    /** 1 = land at full height, 0 = flattened. */ flat: number;
    /** 1 = orb right over the water, 0 = orb gone. */ stir: number;
    /** 1 = water fully shown. */ show: number; fogNear: number; fogFar: number;
  };
  const update = (f: Frame) => {
    river.scale.y = f.flat;
    uniforms.uTime.value = f.t; uniforms.uStir.value = f.stir; uniforms.uGlow.value = f.stir; uniforms.uOpacity.value = f.show; uniforms.uFlat.value = f.flat;
    uniforms.uOrb.value.set(f.orbX, f.orbZ); uniforms.uOrbPos.value.set(f.orbX, f.orbY, f.orbZ);
    uniforms.uFogNear.value = f.fogNear; uniforms.uFogFar.value = f.fogFar;
    river.visible = spray.visible = f.show > 0.01;
    if (!river.visible) return;

    const waterY = (levelAt(f.orbZ) - 0.4) * f.flat, power = f.stir * f.show;
    for (let i = 0; i < N; i++) {
      // Thrown up and out, carried clockwise by the wind. One in five is thrown hard enough to
      // reach the banks. A droplet goes dark once it lands, on water or on land.
      const a = seed[i * 3], b = seed[i * 3 + 1], c = seed[i * 3 + 2], far = i % 5 === 0;
      const u = (b + f.t * (0.55 + c * 0.35)) % 1, s = u * 1.5;
      const rad = 2.5 + a * 3.5 + (far ? 9 + c * 7 : 3 + c * 4) * s, ang = (a * 37 + c * 11) % 6.283 + 1.3 * s;
      const x = f.orbX + rad * Math.cos(ang), z = f.orbZ + rad * Math.sin(ang);
      const y = waterY + (far ? 8 + a * 4 : 4 + a * 4) * s - 7 * s * s;
      const lit = y > waterY && y > heightAt(x, z) * f.flat ? Math.sqrt(1 - u) * power : 0;
      sprayPos[i * 3] = x; sprayPos[i * 3 + 1] = y; sprayPos[i * 3 + 2] = z;
      sprayCol[i * 3] = lit * 0.7; sprayCol[i * 3 + 1] = lit * 0.92; sprayCol[i * 3 + 2] = lit;
    }
    posAttr.needsUpdate = true; colAttr.needsUpdate = true;
  };

  return { river, spray, update, disposables: [riverGeo, riverMat, sprayGeo, sprayMat] as { dispose: () => void }[] };
}
