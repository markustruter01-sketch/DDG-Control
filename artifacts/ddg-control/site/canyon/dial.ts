import { CanvasTexture, Mesh, PlaneGeometry, ShaderMaterial } from 'three';

/**
 * The build-up dial, as part of the 3D scene: a flat square fixed to the orb's centre that always faces the
 * camera, so it sits exactly round the orb wherever the camera goes and whatever the orb does. The shader
 * draws thin tick marks round a 270° sweep (like a speedometer), a faint track, the filled arc with a bright
 * tip, and the percentage (a tiny canvas, redrawn only when the number changes).
 */

const VERT = /* glsl */ `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;

const FRAG = /* glsl */ `
uniform float uProgress; uniform float uAlpha; uniform sampler2D uText;
varying vec2 vUv;
const float SWEEP = 270.0, TICKS = 50.0;
float band(float x, float c, float w) { float f = fwidth(x); return 1.0 - smoothstep(w - f, w + f, abs(x - c)); }
void main() {
  vec2 p = (vUv - 0.5) * 2.0;
  float r = length(p);
  // Angle measured clockwise from the bottom-left (225°), 0..270 inside the sweep.
  float theta = mod(225.0 - degrees(atan(p.y, p.x)), 360.0);
  float t = theta / SWEEP;
  float inSweep = step(theta, SWEEP);
  // Tick marks: short ones, a longer one every fifth.
  float k = t * TICKS, idx = floor(k + 0.5), off = abs(k - idx);
  float tickW = fwidth(k) * 0.9;
  float longTick = step(mod(idx, 5.0), 0.5);
  float tick = (1.0 - smoothstep(tickW, tickW * 2.0, off)) * step(longTick > 0.5 ? 0.86 : 0.9, r) * step(r, 0.95) * inSweep;
  float track = band(r, 0.8, 0.003) * inSweep;
  float fill = band(r, 0.8, 0.007) * inSweep * step(t, uProgress);
  vec2 tipAt = vec2(cos(radians(225.0 - SWEEP * uProgress)), sin(radians(225.0 - SWEEP * uProgress))) * 0.8;
  float tip = 1.0 - smoothstep(0.012, 0.022, length(p - tipAt));
  float glow = exp(-pow((r - 0.8) / 0.03, 2.0)) * inSweep * step(t, uProgress) * 0.35;
  // The percentage, under the gap at the bottom.
  vec2 tq = (p - vec2(0.0, -0.74)) / vec2(0.28, 0.07) * 0.5 + 0.5;
  float text = (tq.x > 0.0 && tq.x < 1.0 && tq.y > 0.0 && tq.y < 1.0) ? texture2D(uText, tq).a : 0.0;
  float a = tick * 0.35 + track * 0.12 + fill + tip + glow + text * 0.85;
  vec3 col = mix(vec3(1.0), vec3(0.6, 0.85, 1.0), glow * 2.0);
  gl_FragColor = vec4(col, clamp(a, 0.0, 1.0) * uAlpha);
}`;

export function makeDial() {
  const c = document.createElement('canvas'); c.width = 128; c.height = 32;
  const g = c.getContext('2d')!;
  const tex = new CanvasTexture(c);
  const geo = new PlaneGeometry(2, 2);
  const mat = new ShaderMaterial({
    uniforms: { uProgress: { value: 0 }, uAlpha: { value: 0 }, uText: { value: tex } },
    vertexShader: VERT, fragmentShader: FRAG, transparent: true, depthWrite: false, depthTest: false,
  });
  const mesh = new Mesh(geo, mat);
  mesh.renderOrder = 9; mesh.frustumCulled = false; mesh.visible = false;
  // Always face the camera (the orb's group is never rotated, so the camera's turn is the right one).
  mesh.onBeforeRender = (_r, _s, camera) => { mesh.quaternion.copy(camera.quaternion); mesh.updateMatrixWorld(); };
  let shown = 0, lastPct = -1;
  /** `radius`: the orb's radius in the orb group's own units. `want` 1 while held. */
  const update = (progress: number, want: number, radius: number) => {
    shown += (want - shown) * 0.12;
    mesh.visible = shown > 0.01;
    mesh.scale.setScalar(radius * 1.42);
    mat.uniforms.uProgress!.value = progress; mat.uniforms.uAlpha!.value = shown;
    const pct = Math.round(progress * 100);
    if (pct !== lastPct) {
      lastPct = pct;
      g.clearRect(0, 0, 128, 32);
      g.fillStyle = '#fff'; g.font = '500 20px ui-monospace, Menlo, monospace'; g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText(`${pct}%`, 64, 17);
      tex.needsUpdate = true;
    }
  };
  return { mesh, update, disposables: [geo, mat, tex] as { dispose: () => void }[] };
}
