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
void main() {
  // Wind bands: noise stretched along the direction of spin, on two tilted axes at two speeds.
  vec3 a = rotY(rotX(vObj, 0.28), uTime * 18.0);
  vec3 b = rotY(rotZ(vObj, -0.55), uTime * 28.5 + 2.0);
  float n1 = noise3(a * vec3(1.5, 8.0, 1.5)) * 0.65 + noise3(a * vec3(3.2, 17.0, 3.2) + 4.0) * 0.35;
  float n2 = noise3(b * vec3(2.2, 12.0, 2.2) + 9.0);
  // Kept light: the white streaks are an accent on the ball, not its main surface.
  float bands = (smoothstep(0.5, 0.82, n1) * 0.75 + smoothstep(0.58, 0.88, n2) * 0.45) * 0.41;

  float facing = abs(dot(normalize(vN), normalize(vV)));
  float rim = pow(1.0 - facing, 2.2);
  float centre = pow(facing, 2.5);
  if (uSkin > 0.5) {
    gl_FragColor = vec4(vec3(0.6, 0.88, 1.0), bands * 0.25 * pow(facing, 0.7) * uOpacity);
    return;
  }
  vec3 col = mix(vec3(0.14, 0.46, 0.92), vec3(0.86, 0.97, 1.0), clamp(bands + centre * 0.5, 0.0, 1.0));
  col *= 0.8 + 0.2 * normalize(vN).y; // a little darker underneath, so it reads as a round ball
  col += rim * vec3(0.45, 0.8, 1.0) * 0.9;
  float zap = clamp(arc(0.0, 2.6, 0.16) + arc(1.0, 3.7, 0.11), 0.0, 1.5);
  col += vec3(0.85, 0.95, 1.0) * zap * 1.95;
  gl_FragColor = vec4(col, clamp(0.58 + bands * 0.4 + rim * 0.45 + centre * 0.2 + zap * 0.6, 0.0, 1.0) * uOpacity);
}`;

export function makeAirOrb(R: number) {
  const group = new Group();
  const make = (skin: number) => new ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uOpacity: { value: 1 }, uSkin: { value: skin } },
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
  const update = (t: number, opacity: number) => {
    for (const m of [ballMat, skinMat]) { m.uniforms.uTime.value = t; m.uniforms.uOpacity.value = opacity; }
    group.position.y = Math.sin(t * 1.3) * 0.05;
  };
  return { group, update, disposables: [ballGeo, skinGeo, ballMat, skinMat] as { dispose: () => void }[] };
}
