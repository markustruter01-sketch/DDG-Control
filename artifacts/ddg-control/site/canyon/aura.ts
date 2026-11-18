import { AdditiveBlending, BufferAttribute, BufferGeometry, Group, Mesh, PlaneGeometry, Points, ShaderMaterial } from 'three';

/**
 * Light round the orb, all off unless turned up in the tuner:
 *  - bloom: bright light bleeding out past the orb's edge (stronger for a moment when lightning fires);
 *  - shafts and mist: faint rays turning slowly through a soft haze;
 *  - sparks: small charged points circling the orb on tilted paths.
 * The glow is one flat square that always faces the camera; the sparks are points.
 */

const AURA_VERT = /* glsl */ `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;

const AURA_FRAG = /* glsl */ `
uniform float uTime, uBloom, uRays, uFlash, uOpacity, uReach;
varying vec2 vUv;
void main() {
  vec2 p = (vUv - 0.5) * 2.0;
  float r = length(p) * uReach;          // distance from the centre, in orb radii
  float past = max(r - 1.0, 0.0);        // how far past the orb's edge
  float ang = atan(p.y, p.x);
  float bloom = (exp(-past * 3.5) * 0.9 + exp(-past * 1.1) * 0.35) * uBloom * (1.0 + 1.5 * uFlash);
  float s1 = 0.5 + 0.5 * sin(ang * 7.0 + uTime * 0.15);
  float s2 = 0.5 + 0.5 * sin(ang * 13.0 - uTime * 0.11 + 1.3);
  float s3 = 0.5 + 0.5 * sin(ang * 23.0 + uTime * 0.07 + 4.0);
  float ray = pow(s1 * s2, 2.0) + 0.5 * pow(s2 * s3, 3.0);
  float rays = (ray * exp(-past * 0.75) * smoothstep(0.0, 0.3, past) * 0.5 + exp(-past * 0.45) * 0.12) * uRays * (1.0 + uFlash);
  float fade = 1.0 - smoothstep(0.7, 1.0, length(p));
  gl_FragColor = vec4(vec3(0.55, 0.82, 1.0) * (bloom + rays) * fade * uOpacity, 1.0);
}`;

const SPARK_VERT = /* glsl */ `
attribute vec4 aSeed;
uniform float uTime, uAmount, uSize, uR;
varying float vA;
void main() {
  float rad = uR * (1.15 + 0.9 * aSeed.x);
  float a = aSeed.z * 6.283 + uTime * (0.6 + 1.4 * aSeed.y) * uR / rad;
  vec3 p = vec3(cos(a) * rad, 0.0, sin(a) * rad);
  float tilt = (aSeed.w - 0.5) * 2.2, ct = cos(tilt), st = sin(tilt);
  p = vec3(p.x, -st * p.z, ct * p.z);
  float tw = aSeed.x * 6.283, cw = cos(tw), sw = sin(tw);
  p = vec3(cw * p.x + sw * p.z, p.y, -sw * p.x + cw * p.z);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * (0.6 + aSeed.y) / max(-mv.z, 0.1);
  vA = step(fract(aSeed.x * 7.31 + aSeed.w * 3.17), uAmount) * (0.55 + 0.45 * sin(uTime * 3.0 + aSeed.z * 40.0));
}`;

const SPARK_FRAG = /* glsl */ `
uniform float uOpacity;
varying float vA;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.0, d);
  gl_FragColor = vec4(vec3(0.75, 0.92, 1.0) * a * a * vA * uOpacity, 1.0);
}`;

export function makeAura(R: number) {
  const group = new Group();
  const REACH = 4.2; // the square reaches this many orb radii from the centre
  const auraGeo = new PlaneGeometry(2 * R * REACH, 2 * R * REACH);
  const auraMat = new ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uBloom: { value: 0 }, uRays: { value: 0 }, uFlash: { value: 0 }, uOpacity: { value: 1 }, uReach: { value: REACH } },
    vertexShader: AURA_VERT, fragmentShader: AURA_FRAG, transparent: true, depthWrite: false, blending: AdditiveBlending,
  });
  const aura = new Mesh(auraGeo, auraMat);
  aura.renderOrder = 4; // after the river, before the ball
  aura.onBeforeRender = (_r, _s, camera) => { aura.quaternion.copy(camera.quaternion); aura.updateMatrixWorld(); };

  const N = 160;
  const seeds = new Float32Array(N * 4);
  // Fixed pseudo-random seeds, so the sparks are the same on every visit.
  for (let i = 0; i < N * 4; i++) { const x = Math.sin(i * 12.9898 + 4.1) * 43758.5453; seeds[i] = x - Math.floor(x); }
  const sparkGeo = new BufferGeometry();
  sparkGeo.setAttribute('position', new BufferAttribute(new Float32Array(N * 3), 3));
  sparkGeo.setAttribute('aSeed', new BufferAttribute(seeds, 4));
  const sparkMat = new ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uAmount: { value: 0 }, uSize: { value: 60 }, uR: { value: R }, uOpacity: { value: 1 } },
    vertexShader: SPARK_VERT, fragmentShader: SPARK_FRAG, transparent: true, depthWrite: false, blending: AdditiveBlending,
  });
  const sparks = new Points(sparkGeo, sparkMat);
  sparks.frustumCulled = false; sparks.renderOrder = 7;
  group.add(aura, sparks);

  /** `pxScale`: drawing-buffer pixels per world unit at distance 1 (so the sparks keep their size on any screen). */
  const update = (t: number, opacity: number, look: { bloom: number; rays: number; sparks: number; flash: number; pxScale: number }) => {
    auraMat.uniforms.uTime.value = t; auraMat.uniforms.uBloom.value = look.bloom; auraMat.uniforms.uRays.value = look.rays;
    auraMat.uniforms.uFlash.value = look.flash; auraMat.uniforms.uOpacity.value = opacity;
    aura.visible = (look.bloom > 0 || look.rays > 0) && opacity > 0.01;
    sparkMat.uniforms.uTime.value = t; sparkMat.uniforms.uAmount.value = look.sparks; sparkMat.uniforms.uOpacity.value = opacity;
    sparkMat.uniforms.uSize.value = 0.11 * look.pxScale;
    sparks.visible = look.sparks > 0 && opacity > 0.01;
  };
  return { group, update, disposables: [auraGeo, auraMat, sparkGeo, sparkMat] as { dispose: () => void }[] };
}
