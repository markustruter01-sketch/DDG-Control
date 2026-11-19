import { Group, IcosahedronGeometry, Mesh, ShaderMaterial, Vector3, Vector4 } from 'three';
import { SKY_GLSL } from './sky';

/**
 * The mercury orb (orb 3 of 3, Markus 19 Nov): a ball of liquid metal you can grab, drag about, wobble and flick.
 *
 * The physics is a few numbers on the CPU, so it costs almost nothing:
 * - `pos` / `vel`: where the blob is from its home (the orb's spot) and how fast it moves.
 * - Grab and drag: it chases your pointer on springs, so it lags and stretches.
 * - Let go slowly: it springs home and jiggles. Flick it: it flies off, slows to a stop, then the "magnet"
 *   pulls it back, slowly at first and faster and faster, until it snaps home with a big wobble.
 * - Two wobble springs (one up-down, one side-to-side) are kicked by every change of speed; with the stretch
 *   along the motion and a dent where you press, they make the surface move like liquid metal.
 * The shape is bent in the vertex shader (one ball of about 10,000 points), and the shading is a mirror of the
 * same night sky the scene uses (sky.ts), so it looks like polished mercury in this world.
 */

const VERT = /* glsl */ `
uniform vec3 uVel;      // velocity (world units/s, already scaled down)
uniform vec4 uWob;      // wobble: up-down, side-to-side, ripple, time
uniform vec4 uPoke;     // where it is pressed (unit direction from the centre), strength
uniform float uR;
varying vec3 vN; varying vec3 vW;
vec3 shape(vec3 n) {
  vec3 p = n * uR;
  // Stretch along the motion, slimmer across it (volume roughly kept).
  float sp = length(uVel);
  if (sp > 1e-4) { vec3 d = uVel / sp; float s = min(sp, 1.6); p += d * dot(n, d) * uR * s * 0.38 - (n - d * dot(n, d)) * uR * s * 0.11; }
  // Two wobble shapes: tall/flat and a side-to-side lean, plus a fine ripple running round it.
  p += n * uR * (uWob.x * (n.y * n.y - 0.333) + uWob.y * n.x * n.y * 1.5);
  p += n * uR * uWob.z * 0.022 * sin(n.x * 3.5 + uWob.w * 5.0) * sin(n.y * 3.0 - uWob.w * 4.0) * sin(n.z * 3.2 + uWob.w * 4.5);
  // A soft dent where the finger is.
  float c = dot(n, uPoke.xyz);
  p -= n * uR * uPoke.w * 0.18 * exp(-pow(max(0.0, 1.0 - c) / 0.18, 2.0));
  return p;
}
void main() {
  vec3 n = normalize(position);
  vec3 t1 = normalize(cross(n, abs(n.y) < 0.95 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0)));
  vec3 t2 = cross(n, t1);
  float e = 0.04;
  vec3 p0 = shape(n), p1 = shape(normalize(n + t1 * e)), p2 = shape(normalize(n + t2 * e));
  vec3 nn = normalize(cross(p1 - p0, p2 - p0));
  vec4 w = modelMatrix * vec4(p0, 1.0);
  vW = w.xyz; vN = normalize(mat3(modelMatrix) * nn);
  gl_Position = projectionMatrix * viewMatrix * w;
}`;

const FRAG = /* glsl */ `
${SKY_GLSL}
uniform float uShow;
varying vec3 vN; varying vec3 vW;
void main() {
  vec3 v = normalize(vW - cameraPosition), n = normalize(vN);
  vec3 r = reflect(v, n);
  // Polished metal (Markus, 19 Nov: "more metallic"): a near-perfect mirror of the night sky, a bright
  // horizon line wrapping round it (the classic chrome look), dark ground below, and sharp highlights.
  float up = r.y;
  vec3 env = skyColor(normalize(vec3(r.x, abs(r.y), r.z))) * 3.2;
  env += vec3(0.75, 0.8, 0.88) * exp(-pow((up - 0.04) / 0.07, 2.0)) * 0.9;           // the horizon band
  vec3 below = mix(vec3(0.09, 0.11, 0.15), vec3(0.04, 0.05, 0.07), smoothstep(0.0, -0.6, up));
  below += vec3(0.3, 0.48, 0.75) * exp(-pow((up + 0.3) / 0.16, 2.0)) * 0.7;        // the lit river below
  env = up > 0.0 ? env : below;
  float fres = pow(1.0 - max(0.0, dot(-v, n)), 5.0);
  vec3 metal = vec3(0.86, 0.88, 0.92);                                                  // silver
  vec3 col = env * mix(metal, vec3(1.0), fres);
  float spec = pow(max(0.0, dot(r, normalize(vec3(-0.35, 0.85, 0.25)))), 180.0) * 5.0
             + pow(max(0.0, dot(r, normalize(vec3(0.6, 0.35, 0.7)))), 90.0) * 1.2;
  col += vec3(1.0) * spec;
  gl_FragColor = vec4(col * uShow, 1.0);
}`;

type Mode = 'rest' | 'drag' | 'fly' | 'return';

export function makeMercury(R: number) {
  const uniforms = {
    uVel: { value: new Vector3() }, uWob: { value: new Vector4() }, uPoke: { value: new Vector4(0, 0, 1, 0) },
    uR: { value: R }, uShow: { value: 1 }, uSkyTurn: { value: 0 },
  };
  const geo = new IcosahedronGeometry(1, 24); // about 11,500 triangles: smooth enough for the stretch and dents
  const mat = new ShaderMaterial({ uniforms, vertexShader: VERT, fragmentShader: FRAG });
  const ball = new Mesh(geo, mat); ball.renderOrder = 5; ball.frustumCulled = false;
  const group = new Group(); group.add(ball);

  const pos = new Vector3(), vel = new Vector3(), target = new Vector3(), prevVel = new Vector3(), acc = new Vector3();
  const hist: { t: number; p: Vector3 }[] = [];
  let mode: Mode = 'rest', back = 0, poke = 0;
  const wob = { a: 0, av: 0, b: 0, bv: 0, ripple: 0 };
  const MAX = 34; // never further than this from home (world units)

  /** Pointer down on the blob: `at` is the pointer on the plane through home that faces the camera (world). */
  const grab = (at: Vector3, home: Vector3, now: number) => {
    mode = 'drag'; target.copy(at).sub(home); hist.length = 0; hist.push({ t: now, p: target.clone() }); poke = 1;
  };
  const drag = (at: Vector3, home: Vector3, now: number) => {
    if (mode !== 'drag') return;
    target.copy(at).sub(home); if (target.length() > MAX) target.setLength(MAX);
    hist.push({ t: now, p: target.clone() }); while (hist.length > 2 && now - hist[0]!.t > 90) hist.shift();
  };
  /** Let go: a quick flick sends it flying; a slow release lets it spring home. */
  const release = (now: number) => {
    if (mode !== 'drag') return;
    const first = hist[0], last = hist[hist.length - 1];
    const dtS = first && last ? Math.max(0.016, (last.t - first.t) / 1000) : 1;
    const flick = first && last && now - last.t < 120 ? last.p.clone().sub(first.p).divideScalar(dtS) : new Vector3();
    if (flick.length() > 9) { vel.copy(flick).multiplyScalar(1.15); mode = 'fly'; }
    else mode = 'rest';
    poke = 0;
  };
  const busy = () => mode !== 'rest' || pos.lengthSq() > 0.01;

  /** One step. `dt` seconds. Returns the blob's offset from home (world), for the orb's group. */
  const step = (dt: number) => {
    prevVel.copy(vel);
    if (mode === 'drag') {
      // Chase the pointer on a stiff spring: it lags a little, so it stretches as you move it.
      acc.copy(target).sub(pos).multiplyScalar(220).addScaledVector(vel, -24);
      vel.addScaledVector(acc, dt);
    } else if (mode === 'fly') {
      vel.multiplyScalar(Math.exp(-2.6 * dt)); // drag slows it down
      if (pos.length() > MAX) vel.multiplyScalar(Math.exp(-12 * dt));
      if (vel.length() < 0.6) { mode = 'return'; back = 0; vel.set(0, 0, 0); }
    } else if (mode === 'return') {
      // The magnet: slow at first, faster and faster, straight home.
      back += dt;
      const speed = 1.5 + 9 * back + 40 * back * back;
      const d = pos.length();
      if (d < speed * dt * 1.2 || d < 0.08) {
        // Snap home: the speed it arrived with becomes one big wobble.
        wob.av += -speed * 0.9; wob.bv += (Math.random() - 0.5) * speed * 0.6; wob.ripple = 1;
        pos.set(0, 0, 0); vel.set(0, 0, 0); mode = 'rest';
      } else vel.copy(pos).multiplyScalar(-speed / d);
    } else {
      // At rest: a soft spring home, jelly-like.
      acc.copy(pos).multiplyScalar(-90).addScaledVector(vel, -11);
      vel.addScaledVector(acc, dt);
    }
    pos.addScaledVector(vel, dt);
    // Wobble springs, kicked by every change of speed (up-down and side to side).
    acc.copy(vel).sub(prevVel).divideScalar(Math.max(dt, 1e-3));
    const kick = 0.0045;
    wob.av += (-140 * wob.a - 5 * wob.av + acc.y * kick * 6) * dt; wob.a += wob.av * dt;
    wob.bv += (-110 * wob.b - 4.5 * wob.bv + acc.x * kick * 6) * dt; wob.b += wob.bv * dt;
    wob.a = Math.max(-0.28, Math.min(0.28, wob.a)); wob.b = Math.max(-0.28, Math.min(0.28, wob.b));
    wob.ripple = Math.max(0, wob.ripple - dt * 0.9) + Math.min(0.6, vel.length() * 0.02);
    return pos;
  };

  let clock = 0;
  /** Draw state: `show` fades it, `pokeDir` where the finger is (unit vector from the centre, world), `skyTurn` as the sky. */
  const update = (dt: number, show: number, pokeDir: Vector3 | null, skyTurn: number) => {
    group.visible = show > 0.01;
    clock += dt;
    // The stretch uses the speed, scaled to this ball's size.
    uniforms.uVel.value.copy(vel).multiplyScalar(0.045 / Math.max(0.5, R));
    // A slow breathing ripple even at rest, so it always reads as liquid.
    uniforms.uWob.value.set(wob.a + 0.012 * Math.sin(clock * 1.7), wob.b + 0.01 * Math.sin(clock * 1.3 + 1), Math.min(1, wob.ripple + 0.35), clock);
    if (pokeDir) uniforms.uPoke.value.set(pokeDir.x, pokeDir.y, pokeDir.z, poke);
    else uniforms.uPoke.value.w = Math.max(0, uniforms.uPoke.value.w - dt * 4);
    uniforms.uShow.value = show; uniforms.uSkyTurn.value = skyTurn;
  };
  return { group, grab, drag, release, step, update, busy, dragging: () => mode === 'drag', disposables: [geo, mat] as { dispose: () => void }[] };
}
