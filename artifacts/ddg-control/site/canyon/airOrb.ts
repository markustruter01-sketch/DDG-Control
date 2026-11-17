import { AdditiveBlending, Group, Mesh, ShaderMaterial, SphereGeometry } from 'three';

/**
 * The DDG core as a solid ball of spinning air (clockwise seen from above). One smooth sphere whose surface is drawn by a
 * shader: bands of wind racing round it on two tilted axes, a bright centre and a glowing rim,
 * so it reads as one dense ball and not as loose streaks. A second, slightly larger and much
 * fainter sphere adds a thin skin of wind just off the surface.
 */

const VERT = /* glsl */ `
varying vec3 vObj;
varying vec3 vN;
varying vec3 vV;
void main() {
  vObj = normalize(position);
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vN = normalMatrix * normal;
  vV = -mv.xyz;
  gl_Position = projectionMatrix * mv;
}`;

const FRAG = /* glsl */ `
uniform float uTime;
uniform float uOpacity;
uniform float uSkin; // 0 = the ball itself, 1 = the faint outer skin
uniform float uSpinT;   // spin clock (speed set from outside)
uniform float uBandsK;  // strength of the white streaks
uniform float uZapK;    // spark brightness
uniform float uZapRate; // how often sparks happen
uniform float uStyle;   // which orb (0 air, 1 clouds, 2 liquid pearl, 3 water, 4 storm, 5 aurora, 6 neural net, 7 galaxy, 8 singularity)
uniform float uHue;     // colour turn, radians
uniform float uFlow;    // speed of the movement inside
varying vec3 vObj;
varying vec3 vN;
varying vec3 vV;
float hash3(vec3 p) { return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
float noise3(vec3 p) {
  vec3 i = floor(p), f = fract(p);
  vec3 u = f * f * (3.0 - 2.0 * f);
  float a = mix(mix(hash3(i), hash3(i + vec3(1.0, 0.0, 0.0)), u.x), mix(hash3(i + vec3(0.0, 1.0, 0.0)), hash3(i + vec3(1.0, 1.0, 0.0)), u.x), u.y);
  float b = mix(mix(hash3(i + vec3(0.0, 0.0, 1.0)), hash3(i + vec3(1.0, 0.0, 1.0)), u.x), mix(hash3(i + vec3(0.0, 1.0, 1.0)), hash3(i + vec3(1.0, 1.0, 1.0)), u.x), u.y);
  return mix(a, b, u.z);
}
vec3 rotY(vec3 p, float a) { float c = cos(a), s = sin(a); return vec3(c * p.x + s * p.z, p.y, -s * p.x + c * p.z); }
vec3 rotX(vec3 p, float a) { float c = cos(a), s = sin(a); return vec3(p.x, c * p.y - s * p.z, s * p.y + c * p.z); }
vec3 rotZ(vec3 p, float a) { float c = cos(a), s = sin(a); return vec3(c * p.x - s * p.y, s * p.x + c * p.y, p.z); }
// Lightning that walks across the surface: now and then a thin, jagged arc flickers on for a
// split second at a random spot. Two independent streams, so the timing never looks regular.
float arc(float lane, float rate, float chance) {
  float slot = floor(uTime * rate + lane * 13.7), lt = fract(uTime * rate + lane * 13.7);
  float r = hash3(vec3(slot, lane, 1.3));
  if (r > chance) return 0.0;
  vec3 c = normalize(vec3(hash3(vec3(slot, 2.1, lane)), hash3(vec3(slot, 5.7, lane)), hash3(vec3(slot, 9.2, lane))) * 2.0 - 1.0);
  c.z = abs(c.z) * 0.8 + 0.2; // keep most flashes on the side facing the camera
  c = normalize(c);
  vec3 t = normalize(cross(c, abs(c.y) < 0.9 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0)));
  float a = hash3(vec3(slot, 3.3, lane)) * 6.283;
  t = t * cos(a) + cross(c, t) * sin(a);
  vec3 b = cross(c, t);
  if (dot(vObj, c) < 0.6) return 0.0;
  float u = dot(vObj, t), v = dot(vObj, b), L = 0.22 + 0.18 * hash3(vec3(slot, 7.7, lane));
  // Jagged path: two layers of noise bend the line; a short fork leaves it part-way along.
  float j = (noise3(vec3(u * 9.0, slot, lane)) - 0.5) * 0.09 + (noise3(vec3(u * 31.0, slot + 4.0, lane)) - 0.5) * 0.03;
  float along = 1.0 - smoothstep(L * 0.6, L, abs(u));
  float line = exp(-abs(v - j) / 0.0035) * along;
  float fu = u - L * 0.2, fork = exp(-abs(v - j - fu * 0.8 - (noise3(vec3(u * 27.0, slot, 8.0)) - 0.5) * 0.03) / 0.003) * step(0.0, fu) * (1.0 - smoothstep(0.0, L * 0.45, fu));
  float glow = exp(-abs(v - j) / 0.03) * along * 0.25;
  // A quick double flicker, then gone.
  float flick = exp(-lt * 9.0) * (0.6 + 0.4 * step(0.5, fract(lt * 14.0)));
  return (line + fork * 0.7 + glow) * flick;
}
float fbm(vec3 p) { float a = 0.5, s = 0.0; for (int i = 0; i < 4; i++) { s += a * noise3(p); p = p * 2.03 + vec3(1.7, 9.2, 4.1); a *= 0.5; } return s; }
// Turn every colour round the colour wheel by the same angle (the tuner's colour slider).
vec3 hueShift(vec3 c, float a) { vec3 k = vec3(0.57735); float ca = cos(a), sa = sin(a); return c * ca + cross(k, c) * sa + k * dot(k, c) * (1.0 - ca); }
void main() {
  vec3 N = normalize(vN);
  float facing = abs(dot(N, normalize(vV)));
  float rim = pow(1.0 - facing, 2.2);
  float centre = pow(facing, 2.5);
  float ft = uTime * uFlow;
  vec3 col = vec3(0.0);
  float alpha = 1.0;
  if (uStyle < 0.5) {
    // 0. Spinning air (the first orb). Wind bands: noise stretched along the spin, on two tilted axes.
    vec3 a = rotY(rotX(vObj, 0.28), uSpinT * 18.0);
    vec3 b = rotY(rotZ(vObj, -0.55), uSpinT * 28.5 + 2.0);
    float n1 = noise3(a * vec3(1.5, 8.0, 1.5)) * 0.65 + noise3(a * vec3(3.2, 17.0, 3.2) + 4.0) * 0.35;
    float n2 = noise3(b * vec3(2.2, 12.0, 2.2) + 9.0);
    float bands = (smoothstep(0.5, 0.82, n1) * 0.75 + smoothstep(0.58, 0.88, n2) * 0.45) * 0.41 * uBandsK;
    if (uSkin > 0.5) { gl_FragColor = vec4(hueShift(vec3(0.6, 0.88, 1.0), uHue), bands * 0.25 * pow(facing, 0.7) * uOpacity); return; }
    col = mix(vec3(0.14, 0.46, 0.92), vec3(0.86, 0.97, 1.0), clamp(bands + centre * 0.5, 0.0, 1.0));
    col *= 0.8 + 0.2 * N.y;
    col += rim * vec3(0.45, 0.8, 1.0) * 0.9;
    float zap = clamp(arc(0.0, 2.6, 0.16 * uZapRate) + arc(1.0, 3.7, 0.11 * uZapRate), 0.0, 1.5);
    col += vec3(0.85, 0.95, 1.0) * zap * 1.95 * uZapK;
    alpha = clamp(0.58 + bands * 0.4 + rim * 0.45 + centre * 0.2 + zap * 0.6, 0.0, 1.0);
  } else {
    if (uSkin > 0.5) { gl_FragColor = vec4(0.0); return; } // the outer skin belongs to the air orb only
    if (uStyle < 1.5) {
      // 1. Cloud core: soft clouds drifting and folding inside a blue ball.
      vec3 q = rotY(vObj, ft * 0.15) * 1.6;
      float n = fbm(q + vec3(0.0, ft * 0.12, 0.0));
      float n2 = fbm(q * 2.1 - vec3(ft * 0.2, 0.0, 0.0) + 3.0);
      float c = smoothstep(0.35, 0.75, n * 0.7 + n2 * 0.45);
      col = mix(vec3(0.10, 0.32, 0.85), vec3(0.55, 0.8, 1.0), n);
      col = mix(col, vec3(1.0), c * 0.85);
      col += rim * vec3(0.5, 0.75, 1.0) * 0.7;
      alpha = 0.93;
    } else if (uStyle < 2.5) {
      // 2. Liquid pearl: thick white liquid folding over itself, with a wet highlight.
      vec3 q = rotY(vObj, ft * 0.9);
      vec3 w = vec3(fbm(q * 1.8 + ft * 0.3), fbm(q * 1.8 + 5.2 - ft * 0.25), fbm(q * 1.8 + 9.1));
      float n = fbm(q * 1.4 + w * 2.2);
      float ridge = abs(sin(n * 14.0));
      col = mix(vec3(0.60, 0.66, 0.80), vec3(1.0), smoothstep(0.15, 0.9, ridge));
      col *= 0.75 + 0.25 * N.y;
      col += pow(max(dot(N, normalize(vec3(0.4, 0.7, 0.6))), 0.0), 24.0) * 0.6;
      col += rim * 0.35;
      alpha = 0.97;
    } else if (uStyle < 3.5) {
      // 3. Water in glass: a clear ball half full of water that sloshes from side to side.
      float lvl = 0.02 + 0.22 * sin(ft * 1.6) * vObj.x + 0.12 * sin(ft * 2.3 + 1.0) * vObj.z + (noise3(vec3(vObj.xz * 5.0, ft * 1.5)) - 0.5) * 0.06;
      float d = vObj.y - lvl;
      float under = 1.0 - smoothstep(-0.01, 0.01, d);
      float ca = noise3(vec3(vObj.xz * 6.0 + ft * 0.6, ft * 0.8));
      vec3 water = mix(vec3(0.03, 0.22, 0.6), vec3(0.2, 0.65, 1.0), clamp(ca * 0.8 - d * 0.3, 0.0, 1.0));
      vec3 glass = vec3(0.55, 0.8, 1.0) * (0.08 + rim * 0.9);
      col = mix(glass, water, under);
      col += exp(-abs(d) / 0.012) * vec3(0.9, 0.97, 1.0) * 0.9;
      col += rim * vec3(0.5, 0.8, 1.0) * 0.5;
      alpha = mix(0.22 + rim * 0.6, 0.93, under);
    } else if (uStyle < 4.5) {
      // 4. Storm: a dark thundercloud lit from inside by flashes, with bolts across its face.
      vec3 q = rotY(vObj, ft * 0.25) * 1.8;
      float n = fbm(q + vec3(0.0, ft * 0.1, 0.0));
      float n2 = fbm(q * 2.3 + 7.0 - ft * 0.15);
      float cl = smoothstep(0.3, 0.8, n * 0.65 + n2 * 0.5);
      col = mix(vec3(0.03, 0.04, 0.09), vec3(0.32, 0.36, 0.48), cl);
      float slot = floor(uTime * 2.2), lt = fract(uTime * 2.2);
      float on = step(1.0 - 0.28 * uZapRate, hash3(vec3(slot, 3.1, 7.7)));
      float flash = on * exp(-lt * 7.0) * (0.6 + 0.4 * step(0.5, fract(lt * 11.0)));
      vec3 fc = normalize(vec3(hash3(vec3(slot, 1.0, 2.0)), hash3(vec3(slot, 4.0, 5.0)), hash3(vec3(slot, 8.0, 6.0))) * 2.0 - 1.0);
      col += vec3(0.75, 0.85, 1.0) * flash * smoothstep(-0.2, 0.9, dot(vObj, fc)) * (0.4 + cl) * 1.4 * uZapK;
      float zap = clamp(arc(0.0, 2.6, 0.16 * uZapRate) + arc(1.0, 3.7, 0.11 * uZapRate), 0.0, 1.5);
      col += vec3(0.85, 0.95, 1.0) * zap * 1.95 * uZapK;
      col += rim * vec3(0.3, 0.45, 0.8) * 0.6;
      alpha = 0.95;
    } else if (uStyle < 5.5) {
      // 5. Aurora: ribbons of coloured light sliding round a dark ball.
      vec3 q = rotY(vObj, ft * 0.3);
      float w = fbm(q * 1.5 + vec3(0.0, ft * 0.2, 0.0));
      float r = smoothstep(0.55, 1.0, sin(q.y * 5.0 + w * 6.0 + ft * 0.8)) + 0.5 * smoothstep(0.7, 1.0, sin(q.y * 9.0 - w * 8.0 - ft * 1.1));
      vec3 hc = 0.5 + 0.5 * cos(6.283 * (w * 0.8 + q.y * 0.25 + vec3(0.0, 0.33, 0.67)) + ft * 0.2);
      col = vec3(0.02, 0.03, 0.10) + hc * r * 1.1 + rim * vec3(0.3, 0.9, 0.8) * 0.6;
      alpha = 0.9;
    } else if (uStyle < 6.5) {
      // 6. Neural net: glowing points joined by lines, with pulses of light passing between them.
      vec3 q = rotY(vObj, ft * 0.12) * 4.5;
      vec3 ip = floor(q), fp = fract(q);
      float d1 = 9.0, d2 = 9.0, id = 0.0;
      for (int x = -1; x <= 1; x++) for (int y = -1; y <= 1; y++) for (int z = -1; z <= 1; z++) {
        vec3 g = vec3(float(x), float(y), float(z));
        vec3 o = vec3(hash3(ip + g), hash3(ip + g + 17.0), hash3(ip + g + 31.0));
        float d = length(g + o - fp);
        if (d < d1) { d2 = d1; d1 = d; id = hash3(ip + g + 5.0); } else if (d < d2) { d2 = d; }
      }
      float node = exp(-d1 * d1 * 40.0);
      float edge = 1.0 - smoothstep(0.0, 0.06, d2 - d1);
      float pulse = 0.5 + 0.5 * sin(ft * 2.5 + id * 40.0);
      col = vec3(0.02, 0.05, 0.14) + vec3(0.25, 0.7, 1.0) * edge * (0.25 + 0.6 * pulse) + vec3(0.9, 0.97, 1.0) * node * (0.5 + pulse);
      col += rim * vec3(0.3, 0.6, 1.0) * 0.7;
      alpha = 0.93;
    } else if (uStyle < 7.5) {
      // 7. Galaxy: spiral arms turning round a bright centre, with twinkling stars.
      vec3 q = rotX(vObj, 0.9);
      float r = length(q.xz), ang = atan(q.z, q.x);
      float arms = smoothstep(0.2, 1.0, sin(ang * 2.0 - log(r + 0.05) * 6.0 + ft * 0.8)) * (1.0 - smoothstep(0.15, 1.0, r));
      vec3 cell = floor(vObj * 38.0);
      float stars = step(0.985, hash3(cell)) * (0.5 + 0.5 * sin(ft * 3.0 + hash3(cell + 3.0) * 40.0));
      float core = exp(-r * r * 14.0);
      col = vec3(0.02, 0.02, 0.08) + vec3(0.45, 0.55, 1.0) * arms * 0.9 + vec3(1.0, 0.9, 0.75) * core * 1.2 + vec3(stars);
      col += rim * vec3(0.4, 0.5, 1.0) * 0.5;
      alpha = 0.93;
    } else {
      // 8. Singularity: a black centre with a ring of light streaming round it.
      float core = smoothstep(0.55, 0.8, facing);
      float a = atan(N.y, N.x);
      float sw = noise3(vec3(cos(a) * 2.0, sin(a) * 2.0, facing * 6.0 - ft));
      float rd = (facing - 0.5) / 0.12;
      float ring = exp(-rd * rd) * (0.6 + 0.8 * sw);
      col = vec3(0.5, 0.8, 1.0) * ring * 1.6 + rim * vec3(0.3, 0.6, 1.0);
      alpha = max(core * 0.97, clamp(ring + rim * 0.6, 0.0, 1.0));
    }
  }
  gl_FragColor = vec4(hueShift(col, uHue), alpha * uOpacity);
}`;

export function makeAirOrb(R: number) {
  const group = new Group();
  const make = (skin: number) => new ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uOpacity: { value: 1 }, uSkin: { value: skin }, uSpinT: { value: 0 }, uBandsK: { value: 1 }, uZapK: { value: 1 }, uZapRate: { value: 1 }, uStyle: { value: 0 }, uHue: { value: 0 }, uFlow: { value: 1 } },
    vertexShader: VERT, fragmentShader: FRAG, transparent: true, depthWrite: false,
    ...(skin ? { blending: AdditiveBlending } : {}),
  });
  const ballMat = make(0), skinMat = make(1);
  const ballGeo = new SphereGeometry(R, 64, 48), skinGeo = new SphereGeometry(R * 1.14, 48, 32);
  const ball = new Mesh(ballGeo, ballMat), skin = new Mesh(skinGeo, skinMat);
  // Set on the meshes themselves: three.js sorts by each object's own order, and these must be drawn
  // after the river (1), or the water behind the ball is painted over it.
  ball.renderOrder = 5; skin.renderOrder = 6;
  group.add(ball, skin);
  /** `t` drives the spin (hold it still for reduced motion); `opacity` fades the whole orb. */
  const update = (t: number, opacity: number, spinT = t, look = { bands: 1, zap: 1, zapRate: 1, style: 0, hue: 0, flow: 1 }) => {
    for (const m of [ballMat, skinMat]) {
      m.uniforms.uTime.value = t; m.uniforms.uOpacity.value = opacity; m.uniforms.uSpinT.value = spinT;
      m.uniforms.uBandsK.value = look.bands; m.uniforms.uZapK.value = look.zap; m.uniforms.uZapRate.value = look.zapRate;
      m.uniforms.uStyle.value = look.style; m.uniforms.uHue.value = (look.hue * Math.PI) / 180; m.uniforms.uFlow.value = look.flow;
    }
    group.position.y = Math.sin(t * 1.3) * 0.05;
  };
  return { group, update, disposables: [ballGeo, skinGeo, ballMat, skinMat] as { dispose: () => void }[] };
}
