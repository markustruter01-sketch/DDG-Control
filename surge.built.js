import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Group,
  Line,
  LineBasicMaterial,
  Mesh,
  PlaneGeometry,
  Points,
  PointsMaterial,
  ShaderMaterial,
  SphereGeometry,
  Vector3
} from "three";
const SEG = 24;
const BOLTS = 4;
function jag(a, b, out, rnd) {
  const pts = [a.clone(), b.clone()];
  let rough = a.distanceTo(b) * 0.16;
  while (pts.length < SEG) {
    for (let i = pts.length - 1; i > 0; i--) {
      if (pts.length >= SEG) break;
      const m = pts[i - 1].clone().lerp(pts[i], 0.5);
      m.x += (rnd() - 0.5) * rough;
      m.y += (rnd() - 0.5) * rough * 0.6;
      m.z += (rnd() - 0.5) * rough;
      pts.splice(i, 0, m);
    }
    rough *= 0.55;
  }
  for (let i = 0; i < SEG; i++) {
    const p = pts[i] ?? pts[pts.length - 1];
    out[i * 3] = p.x;
    out[i * 3 + 1] = p.y;
    out[i * 3 + 2] = p.z;
  }
}
const NOVA_FRAG = (
  /* glsl */
  `
uniform float uAlpha;
varying vec3 vN; varying vec3 vV; varying float vY;
void main() {
  float facing = abs(dot(normalize(vN), normalize(vV)));
  float rim = pow(1.0 - facing, 3.0);
  gl_FragColor = vec4(vec3(0.75, 0.92, 1.0) * (rim * 1.4 + 0.05) * uAlpha, 1.0);
}`
);
const BEAM_VERT = (
  /* glsl */
  `
varying vec3 vN; varying vec3 vV; varying float vY;
void main() {
  vY = uv.y;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vN = normalMatrix * normal; vV = -mv.xyz;
  gl_Position = projectionMatrix * mv;
}`
);
const RIBBON_VERT = (
  /* glsl */
  `
attribute float aAlong; attribute float aAcross;
varying float vAlong; varying float vAcross;
void main() { vAlong = aAlong; vAcross = aAcross; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`
);
const RIBBON_FRAG = (
  /* glsl */
  `
uniform float uReveal; uniform float uLeader; uniform float uMain;
varying float vAlong; varying float vAcross;
void main() {
  float x = abs(vAcross);
  float core = smoothstep(0.32, 0.0, x);
  float glow = exp(-x * x * 5.0) * (1.0 - x);
  float led = smoothstep(uReveal, uReveal - 0.12, vAlong) * uLeader * (0.55 + 0.45 * smoothstep(uReveal - 0.05, uReveal, vAlong));
  float k = max(uMain, led);
  vec3 col = vec3(0.45, 0.72, 1.0) * glow * 0.7 + vec3(0.92, 0.97, 1.0) * core * 1.4;
  gl_FragColor = vec4(col * k, 1.0);
}`
);
const NOVA_FX_VERT = (
  /* glsl */
  `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`
);
const NOVA_FX_FRAG = (
  /* glsl */
  `
uniform float uT; uniform float uA; uniform float uCalm;
varying vec2 vUv;
float wave(float r, float at, float w) {
  float d = r - at;
  return d > 0.0 ? exp(-pow(d / w, 2.0)) : exp(-pow(d / (w * 4.0), 2.0)) * 0.55 + exp(-pow(d / w, 2.0)) * 0.45;
}
void main() {
  vec2 p = (vUv - 0.5) * 2.0;
  float r = length(p);
  if (r > 1.0) discard;
  float r1 = 0.97 * (1.0 - exp(-uT * 3.0)), r2 = 0.97 * (1.0 - exp(-uT * 1.6));
  float w1 = 0.008 + 0.02 * uT, w2 = 0.012 + 0.03 * uT;
  float f1 = exp(-uT * 2.2) * smoothstep(0.0, 0.03, uT), f2 = exp(-uT * 1.5) * smoothstep(0.08, 0.16, uT);
  float k = wave(r, r1, w1) * f1 * 1.5 + (1.0 - uCalm) * wave(r, r2, w2) * f2 * 0.7;
  gl_FragColor = vec4(vec3(0.78, 0.9, 1.0) * k * uA, 1.0);
}`
);
function makeSurge() {
  const group = new Group();
  const bolts = Array.from({ length: BOLTS }, () => {
    const pos = new Float32Array(SEG * 3);
    const geo = new BufferGeometry();
    geo.setAttribute("position", new BufferAttribute(pos, 3));
    const mat = new LineBasicMaterial({ color: 14217471, transparent: true, opacity: 0, blending: AdditiveBlending, depthWrite: false });
    const line = new Line(geo, mat);
    line.frustumCulled = false;
    line.renderOrder = 7;
    line.visible = false;
    group.add(line);
    return { pos, geo, mat, line, life: 9, target: new Vector3() };
  });
  const novaGeo = new SphereGeometry(1, 40, 24);
  const novaMat = new ShaderMaterial({ uniforms: { uAlpha: { value: 0 } }, vertexShader: BEAM_VERT, fragmentShader: NOVA_FRAG, transparent: true, depthWrite: false, blending: AdditiveBlending });
  const nova = new Mesh(novaGeo, novaMat);
  nova.renderOrder = 7;
  nova.visible = false;
  nova.frustumCulled = false;
  group.add(nova);
  const fxGeo = new PlaneGeometry(2, 2);
  const fxMat = new ShaderMaterial({ uniforms: { uT: { value: 0 }, uA: { value: 0 }, uCalm: { value: 0 } }, vertexShader: NOVA_FX_VERT, fragmentShader: NOVA_FX_FRAG, transparent: true, depthWrite: false, depthTest: false, blending: AdditiveBlending });
  const fx = new Mesh(fxGeo, fxMat);
  fx.renderOrder = 8;
  fx.visible = false;
  fx.frustumCulled = false;
  group.add(fx);
  const novaAt = (t, orb, radius, size, camQ, calm = false) => {
    const live = t >= 0 && size > 0;
    const k = Math.sqrt(Math.min(3, size / 0.05));
    nova.visible = live && t < 1.6 && !calm;
    if (nova.visible) {
      nova.position.copy(orb);
      nova.scale.setScalar(radius * (1.1 + 30 * size * (1 - Math.exp(-t * 2.2))));
      novaMat.uniforms.uAlpha.value = 0.5 * Math.exp(-t * 2.4) * Math.min(1, t * 20);
    }
    fx.visible = live && t < 2.6;
    if (fx.visible) {
      fx.position.copy(orb);
      if (camQ) fx.quaternion.copy(camQ);
      fx.scale.setScalar(radius * 9 * k);
      fxMat.uniforms.uT.value = t;
      fxMat.uniforms.uA.value = Math.min(1.5, 0.6 + 0.4 * k) * (calm ? 0.5 : 1);
      fxMat.uniforms.uCalm.value = calm ? 1 : 0;
    }
  };
  const burstAll = (orb, radius, pick) => {
    for (const b of bolts) {
      b.target.copy(pick());
      dir.copy(b.target).sub(orb).normalize();
      from.copy(orb).addScaledVector(dir, radius * 0.95);
      jag(from, b.target, b.pos, rnd);
      b.geo.attributes.position.needsUpdate = true;
      b.life = 0;
    }
  };
  const SKY_FORKS = 7, LEAD = 0.09;
  const ribbon = (n) => {
    const pts = Array.from({ length: n }, () => new Vector3());
    const pos = new Float32Array(n * 2 * 3), along = new Float32Array(n * 2), across = new Float32Array(n * 2);
    const idx = [];
    for (let i = 0; i < n; i++) {
      along[i * 2] = along[i * 2 + 1] = i / (n - 1);
      across[i * 2] = -1;
      across[i * 2 + 1] = 1;
      if (i < n - 1) {
        const q = i * 2;
        idx.push(q, q + 1, q + 2, q + 1, q + 3, q + 2);
      }
    }
    const geo = new BufferGeometry();
    geo.setAttribute("position", new BufferAttribute(pos, 3));
    geo.setAttribute("aAlong", new BufferAttribute(along, 1));
    geo.setAttribute("aAcross", new BufferAttribute(across, 1));
    geo.setIndex(idx);
    const mat = new ShaderMaterial({ uniforms: { uReveal: { value: 0 }, uLeader: { value: 0 }, uMain: { value: 0 } }, vertexShader: RIBBON_VERT, fragmentShader: RIBBON_FRAG, transparent: true, depthWrite: false, depthTest: false, blending: AdditiveBlending });
    const mesh = new Mesh(geo, mat);
    mesh.frustumCulled = false;
    mesh.renderOrder = 8;
    mesh.visible = false;
    group.add(mesh);
    return { pts, pos, geo, mat, mesh, width: 1, start: 0 };
  };
  const skyMain = ribbon(SEG);
  const skyForks = Array.from({ length: SKY_FORKS }, () => ribbon(12));
  const tmp = new Float32Array(SEG * 3);
  const loadPts = (r, from2) => {
    r.pts.forEach((p, i) => p.set(from2[i * 3], from2[i * 3 + 1], from2[i * 3 + 2]));
  };
  const t1 = new Vector3(), side = new Vector3(), view = new Vector3();
  const layRibbon = (r, cam) => {
    const n = r.pts.length;
    for (let i = 0; i < n; i++) {
      const p = r.pts[i];
      t1.copy(r.pts[Math.min(n - 1, i + 1)]).sub(r.pts[Math.max(0, i - 1)]).normalize();
      view.copy(cam).sub(p).normalize();
      side.crossVectors(t1, view).normalize().multiplyScalar(r.width * (1 - 0.55 * i / (n - 1)));
      r.pos[i * 6] = p.x - side.x;
      r.pos[i * 6 + 1] = p.y - side.y;
      r.pos[i * 6 + 2] = p.z - side.z;
      r.pos[i * 6 + 3] = p.x + side.x;
      r.pos[i * 6 + 4] = p.y + side.y;
      r.pos[i * 6 + 5] = p.z + side.z;
    }
    r.geo.attributes.position.needsUpdate = true;
  };
  const SPARKS = 48;
  const sparkPos = new Float32Array(SPARKS * 3), sparkVel = new Float32Array(SPARKS * 3);
  const sparkGeo = new BufferGeometry();
  sparkGeo.setAttribute("position", new BufferAttribute(sparkPos, 3));
  const sparkMat = new PointsMaterial({ color: 14086143, size: 0.18, transparent: true, opacity: 0, blending: AdditiveBlending, depthWrite: false });
  const sparks = new Points(sparkGeo, sparkMat);
  sparks.frustumCulled = false;
  sparks.renderOrder = 8;
  sparks.visible = false;
  group.add(sparks);
  let skyLife = 9, skyPower = 0, sparkLife = 9, sparksFired = true;
  const skyAt = new Vector3(), fork = new Vector3(), forkEnd = new Vector3(), lastCam = new Vector3(0, 10, 40);
  const skyStrike = (top, hit, power) => {
    const P = 3 * power, D = top.distanceTo(hit);
    jag(top, hit, tmp, rnd);
    loadPts(skyMain, tmp);
    skyMain.width = D * 0.02 * (0.7 + 0.1 * P);
    for (const f of skyForks) {
      const at = 3 + Math.floor(rnd() * 13);
      fork.copy(skyMain.pts[at]);
      forkEnd.copy(hit).sub(top).multiplyScalar(0.12 + rnd() * 0.22).add(fork);
      forkEnd.x += (rnd() - 0.5) * D * 0.38;
      forkEnd.z += (rnd() - 0.5) * D * 0.22;
      const out = new Float32Array(SEG * 3);
      jag(fork, forkEnd, out, rnd);
      f.pts.forEach((p, i) => {
        const j = Math.round(i * (SEG - 1) / (f.pts.length - 1));
        p.set(out[j * 3], out[j * 3 + 1], out[j * 3 + 2]);
      });
      f.width = skyMain.width * (0.28 + rnd() * 0.12);
      f.start = at / (SEG - 1);
    }
    skyAt.copy(hit);
    skyLife = 0;
    skyPower = P;
    sparksFired = false;
  };
  const mainAt = (t, calm) => {
    if (calm) return 0.7 * Math.exp(-t * 5);
    if (t < LEAD) return 0;
    const u = t - LEAD, pulses = skyPower >= 1.5 ? [0, 0.1, 0.21] : [0, 0.12];
    let k = 0.28 * Math.exp(-u * 3.2);
    for (const p0 of pulses) if (u >= p0) k = Math.max(k, Math.exp(-(u - p0) * 22) * (p0 === 0 ? 1.6 : 1.15));
    return k;
  };
  const updateSky = (dt, cam, calm) => {
    if (cam) lastCam.copy(cam);
    skyLife += dt;
    const live = skyLife < LEAD + 1;
    const main = live ? mainAt(skyLife, calm) : 0;
    const reveal = calm ? 1 : Math.min(1, skyLife / LEAD);
    const leader = calm ? 0 : skyLife < LEAD + 0.04 ? 0.6 : 0;
    skyMain.mesh.visible = live && (main > 0.01 || leader > 0);
    if (skyMain.mesh.visible) {
      layRibbon(skyMain, lastCam);
      skyMain.mat.uniforms.uMain.value = main;
      skyMain.mat.uniforms.uReveal.value = reveal * 1.12;
      skyMain.mat.uniforms.uLeader.value = leader;
    }
    for (const f of skyForks) {
      const fk = live && !calm ? Math.min(main, 1.1) * Math.exp(-Math.max(0, skyLife - LEAD) * 5) : 0;
      const fReveal = Math.min(1, Math.max(0, (reveal - f.start) / Math.max(0.05, 1 - f.start)));
      f.mesh.visible = skyPower >= 1 && live && !calm && (fk > 0.01 || leader > 0 && fReveal > 0);
      if (!f.mesh.visible) continue;
      layRibbon(f, lastCam);
      f.mat.uniforms.uMain.value = fk * 0.8;
      f.mat.uniforms.uReveal.value = fReveal * 1.12;
      f.mat.uniforms.uLeader.value = leader * 0.6;
    }
    if (!sparksFired && (calm || skyLife >= LEAD)) {
      sparksFired = true;
      sparkLife = 0;
      const sp = Math.max(1, skyPower);
      for (let i = 0; i < SPARKS; i++) {
        sparkPos[i * 3] = skyAt.x;
        sparkPos[i * 3 + 1] = skyAt.y;
        sparkPos[i * 3 + 2] = skyAt.z;
        const a = rnd() * Math.PI * 2, up = 0.2 + rnd() * 0.9, v = (3 + rnd() * 7) * (0.6 + 0.15 * sp);
        sparkVel[i * 3] = Math.cos(a) * v;
        sparkVel[i * 3 + 1] = up * v;
        sparkVel[i * 3 + 2] = Math.sin(a) * v;
      }
    }
    sparkLife += dt;
    sparks.visible = !calm && sparkLife < 0.7;
    if (sparks.visible) {
      for (let i = 0; i < SPARKS; i++) {
        sparkVel[i * 3 + 1] -= 18 * dt;
        sparkPos[i * 3] += sparkVel[i * 3] * dt;
        sparkPos[i * 3 + 1] += sparkVel[i * 3 + 1] * dt;
        sparkPos[i * 3 + 2] += sparkVel[i * 3 + 2] * dt;
      }
      sparkGeo.attributes.position.needsUpdate = true;
      sparkMat.opacity = Math.max(0, 1 - sparkLife / 0.7);
    }
    return { flash: Math.min(3, main * skyPower * 0.55), main };
  };
  let timer = 0;
  let seed = 1;
  const rnd = () => {
    seed = seed * 16807 % 2147483647;
    return seed / 2147483647;
  };
  const from = new Vector3(), dir = new Vector3();
  const update = (t, dt, power, orb, radius, waterY, look, pick) => {
    timer -= dt;
    if (power > 0.25 && look.bolts > 0 && timer <= 0) {
      const free = bolts.find((b) => b.life > 0.3);
      if (free) {
        free.target.copy(pick());
        dir.copy(free.target).sub(orb).normalize();
        from.copy(orb).addScaledVector(dir, radius * 0.95);
        jag(from, free.target, free.pos, rnd);
        free.geo.attributes.position.needsUpdate = true;
        free.life = 0;
      }
      timer = (0.15 + 0.85 * (1 - power)) * (0.5 + rnd()) / look.bolts;
    }
    let flash = 0, at = null;
    for (const b of bolts) {
      b.life += dt;
      const on = b.life < 0.3 ? Math.exp(-b.life * 12) * (b.life % 0.06 < 0.03 ? 1 : 0.45) : 0;
      b.line.visible = on > 0.01;
      b.mat.opacity = Math.min(1, on * 1.4);
      if (on > flash) {
        flash = on;
        at = b.target;
      }
    }
    const skyNow = updateSky(dt, look.cam, !!look.calm);
    if (skyNow.flash > flash) {
      flash = skyNow.flash;
      at = skyAt;
    }
    return { flash, at, sky: skyNow.main };
  };
  const disposables = [novaGeo, novaMat, fxGeo, fxMat, ...bolts.flatMap((b) => [b.geo, b.mat]), ...[skyMain, ...skyForks].flatMap((b) => [b.geo, b.mat]), sparkGeo, sparkMat];
  return { group, update, novaAt, burstAll, skyStrike, disposables };
}
export {
  makeSurge
};
