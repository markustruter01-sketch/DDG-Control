import {
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  Group,
  InstancedMesh,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  Quaternion,
  ShaderMaterial,
  SphereGeometry,
  Vector3
} from "three";
const N = 11;
const BONES = [[0, 1], [1, 2], [1, 3], [3, 4], [1, 5], [5, 6], [0, 7], [7, 8], [0, 9], [9, 10]];
function sitPose(t) {
  const tapL = Math.sin(t * 13) * 0.012, tapR = Math.sin(t * 13 + 1.9) * 0.012, nod = Math.sin(t * 1.3) * 0.012;
  const u = t % 7.5, up = u < 1.4 ? Math.sin(u / 1.4 * Math.PI) : 0;
  return [
    [0, 0.08, 0],
    [0, 0.36, 0.03 - 0.02 * up],
    [0, 0.5 + 0.03 * up, 0.07 + nod - 0.05 * up],
    [0.14, 0.25, 0.09],
    [0.07, 0.2 + tapL, 0.21],
    [-0.14, 0.25, 0.09],
    [-0.07, 0.2 + tapR, 0.21],
    [0.21, 0.07, 0.12],
    [-0.07, 0.04, 0.19],
    [-0.21, 0.07, 0.12],
    [0.07, 0.04, 0.17]
  ];
}
function walkPose(ph, go, t) {
  const a = 0.3 * Math.sin(ph) * go;
  const hipY = 0.46 - 0.012 * go * (1 - Math.cos(2 * ph)) / 2;
  const think = Math.sin(t * 0.7) * 0.015;
  const leg = (sx, ang, bend) => {
    const kx = sx * 0.07, ky = hipY - 0.22 * Math.cos(ang), kz = 0.22 * Math.sin(ang);
    return [[kx, ky, kz], [kx, ky - 0.24 * Math.cos(ang - bend), kz + 0.24 * Math.sin(ang - bend)]];
  };
  const [lk, lf] = leg(1, a, 0.55 * go * Math.max(0, -Math.cos(ph)));
  const [rk, rf] = leg(-1, -a, 0.55 * go * Math.max(0, Math.cos(ph)));
  return [
    [0, hipY, 0],
    [0, hipY + 0.27, 0.03],
    [think, hipY + 0.42, 0.08],
    [0.15, hipY + 0.14, -0.07],
    [0.03, hipY + 0.03, -0.14],
    [-0.15, hipY + 0.14, -0.07],
    [-0.03, hipY + 0.04, -0.14],
    lk,
    lf,
    rk,
    rf
  ];
}
const VERT = (
  /* glsl */
  `
varying vec3 vN; varying vec3 vW;
void main() {
  vec4 w = modelMatrix * instanceMatrix * vec4(position, 1.0);
  vW = w.xyz;
  vN = normalize(mat3(modelMatrix) * mat3(instanceMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * w;
}`
);
const FRAG = (
  /* glsl */
  `
uniform vec3 uCam; uniform vec3 uScreen; uniform float uScreenOn; uniform float uScreenFall;
uniform vec3 uOrb; uniform float uOrbGlow; uniform float uOpacity;
varying vec3 vN; varying vec3 vW;
void main() {
  vec3 n = normalize(vN), v = normalize(uCam - vW);
  float diff = 0.58 + 0.42 * max(dot(n, normalize(vec3(-0.4, 0.85, 0.45))), 0.0);
  float rim = pow(1.0 - max(dot(n, v), 0.0), 2.5);
  vec3 c = vec3(0.93, 0.96, 1.0) * diff + vec3(0.55, 0.8, 1.0) * rim * 0.35;
  vec3 ts = uScreen - vW; float sd = length(ts);
  c += vec3(0.42, 0.8, 0.96) * max(dot(n, ts / sd), 0.0) * uScreenOn / (1.0 + sd * sd * uScreenFall);
  vec3 to = uOrb - vW;
  c += vec3(0.5, 0.8, 1.0) * max(dot(n, normalize(to)), 0.0) * uOrbGlow;
  gl_FragColor = vec4(c, uOpacity);
}`
);
function tube(seg = 12) {
  const pos = [], nor = [], idx = [];
  for (let i = 0; i <= seg; i++) {
    const a = i / seg * Math.PI * 2, x = Math.cos(a), z = Math.sin(a);
    pos.push(x, 0, z, x, 1, z);
    nor.push(x, 0, z, x, 0, z);
    if (i < seg) {
      const q = i * 2;
      idx.push(q, q + 1, q + 2, q + 1, q + 3, q + 2);
    }
  }
  const g = new BufferGeometry();
  g.setAttribute("position", new BufferAttribute(new Float32Array(pos), 3));
  g.setAttribute("normal", new BufferAttribute(new Float32Array(nor), 3));
  g.setIndex(idx);
  return g;
}
function makeFigures() {
  const group = new Group();
  const mat = new ShaderMaterial({
    uniforms: {
      uCam: { value: new Vector3() },
      uScreen: { value: new Vector3() },
      uScreenOn: { value: 0 },
      uScreenFall: { value: 1 },
      uOrb: { value: new Vector3() },
      uOrbGlow: { value: 0 },
      uOpacity: { value: 1 }
    },
    vertexShader: VERT,
    fragmentShader: FRAG,
    transparent: true
  });
  const tubeGeo = tube(), ballGeo = new SphereGeometry(1, 14, 10);
  const limbs = new InstancedMesh(tubeGeo, mat, BONES.length * 2);
  const balls = new InstancedMesh(ballGeo, mat, N * 2);
  limbs.frustumCulled = false;
  balls.frustumCulled = false;
  group.add(limbs, balls);
  const lap = new Group();
  const shell = new MeshBasicMaterial({ color: 12899040, transparent: true });
  const glow = new MeshBasicMaterial({ color: 8378111, transparent: true });
  const baseGeo = new BoxGeometry(0.26, 0.018, 0.17), lidGeo = new BoxGeometry(0.26, 0.17, 0.012);
  const base = new Mesh(baseGeo, shell);
  const lid = new Mesh(lidGeo, [shell, shell, shell, shell, shell, glow]);
  lid.rotation.x = -0.26;
  lid.position.set(0, 9e-3 + 0.085 * Math.cos(0.26), 0.085 + 0.085 * Math.sin(0.26));
  const markGeo = new BoxGeometry(0.05, 0.05, 4e-3);
  const mark = new Mesh(markGeo, glow);
  mark.position.set(0, 0.01, 8e-3);
  lid.add(mark);
  lap.add(base, lid);
  group.add(lap);
  const lapP = new Vector3(), lapO = new Vector3(), lapQ = new Quaternion(), lapSpin = new Vector3(), lapFrom = new Vector3(), lapQFrom = new Quaternion();
  const LAP_HOME = new Vector3(0, 0.165, 0.22);
  const mk = (coder) => ({
    coder,
    p: Array.from({ length: N }, () => new Vector3()),
    o: Array.from({ length: N }, () => new Vector3()),
    len: BONES.map(() => 0.2),
    from: Array.from({ length: N }, () => new Vector3()),
    mode: "gone",
    timer: 0,
    home: new Vector3(),
    yaw: 0,
    zA: 0,
    zB: 0,
    s: 0.5,
    dir: 1,
    ph: 0,
    stop: 0,
    turn: 0
  });
  const figs = [mk(true), mk(false)];
  let S = 1, placed = false, lastSide = -1, lastSize = -1, needPlace = true;
  const onResize = () => {
    needPlace = true;
  };
  addEventListener("resize", onResize);
  const v = new Vector3(), w = new Vector3(), up = new Vector3(0, 1, 0), q = new Quaternion(), m = new Matrix4(), sc = new Vector3();
  let seed = 7;
  const rnd = () => {
    seed = seed * 16807 % 2147483647;
    return seed / 2147483647;
  };
  const bankX = (z, side, f) => {
    const wl = f.water(z);
    for (let x = 0.5; x < 45; x += 0.25) if (f.land(side * x, z) > wl + 0.15 * S) return side * (x + 0.5 * S);
    return side * 8;
  };
  const onScreen = (x, y, z, cam) => {
    v.set(x, y, z).project(cam);
    return Math.abs(v.x) < 0.8 && v.y > -0.4 && v.y < 0.55 && v.z < 1;
  };
  const place = (f) => {
    S = 0.55 * f.R * f.size;
    f.cam.updateMatrixWorld();
    const side = f.side > 0.5 ? 1 : -1, cam = f.cam.position;
    let t = 0.5;
    for (; t < 0.86; t += 0.05) {
      const z = cam.z + (f.orb.z - cam.z) * t, x = bankX(z, side, f);
      if (onScreen(x, f.land(x, z) + 0.3 * S, z, f.cam)) break;
    }
    const zc = cam.z + (f.orb.z - cam.z) * Math.min(t, 0.85), xc = bankX(zc, side, f);
    const c = figs[0];
    c.home.set(xc, f.land(xc, zc), zc);
    c.yaw = Math.atan2(-side, 1) * 0.75;
    const wk = figs[1];
    const zm = cam.z + (f.orb.z - cam.z) * Math.min(0.85, t + 0.1);
    let half = 2.2 * f.R;
    for (; half > 0.4 * f.R; half *= 0.8) {
      const a = zm - half, b = zm + half, xa = bankX(a, -side, f), xb = bankX(b, -side, f);
      if (onScreen(xa, f.land(xa, a) + 0.5 * S, a, f.cam) && onScreen(xb, f.land(xb, b) + 0.5 * S, b, f.cam)) break;
    }
    wk.zA = zm - half;
    wk.zB = zm + half;
    wk.home.set(bankX(zm, -side, f), 0, zm);
    placed = true;
    needPlace = false;
    lastSide = f.side;
    lastSize = f.size;
  };
  const poseWorld = (g, f, out, dropY = 0) => {
    let pose, yaw = g.yaw, bx = g.home.x, bz = g.home.z;
    if (g.coder) pose = sitPose(f.reduced ? 0 : f.t);
    else {
      bz = g.zA + (g.zB - g.zA) * g.s;
      bx = bankX(bz, Math.sign(g.home.x) || 1, f);
      pose = walkPose(g.ph, g.stop > 0 || f.reduced ? 0 : 1, f.t);
      yaw = (g.dir > 0 ? 0 : Math.PI) + g.turn;
    }
    const by = f.land(bx, bz) + dropY, cy = Math.cos(yaw), sy = Math.sin(yaw);
    for (let i = 0; i < N; i++) {
      const [x, y, z] = pose[i];
      out[i].set(bx + (x * cy + z * sy) * S, by + y * S, bz + (-x * sy + z * cy) * S);
    }
  };
  const lapHome = (g, f, outP, outQ, dropY = 0) => {
    const cy = Math.cos(g.yaw), sy = Math.sin(g.yaw), L = LAP_HOME;
    outP.set(g.home.x + (L.x * cy + L.z * sy) * S, f.land(g.home.x, g.home.z) + dropY + L.y * S, g.home.z + (-L.x * sy + L.z * cy) * S);
    outQ.setFromAxisAngle(up, g.yaw);
  };
  const physics = (g, f, dt, thrown) => {
    const ch = f.charge, G = 9 * S;
    const grav = thrown ? -G * 0.6 : -G * (1 - 1.3 * ch);
    const pullK = thrown ? 0 : f.pull * Math.pow(ch, 1.6) * S * 7;
    const damp = Math.pow(thrown ? 0.995 : 0.975, dt * 60);
    for (let i = 0; i < N; i++) {
      const p = g.p[i], o = g.o[i];
      v.copy(p).sub(o).multiplyScalar(damp);
      w.copy(f.orb).sub(p);
      const d = Math.max(1e-3, w.length());
      w.divideScalar(d);
      const near = 1 + 3 * Math.min(1, Math.max(0, 1 - (d - f.R) / (6 * f.R)));
      const ax = w.x * pullK * near + -w.z * pullK * 0.25, az = w.z * pullK * near + w.x * pullK * 0.25;
      const ay = grav + w.y * pullK * near;
      o.copy(p);
      p.x += v.x + ax * dt * dt;
      p.y += v.y + ay * dt * dt;
      p.z += v.z + az * dt * dt;
    }
    for (let it = 0; it < 4; it++) {
      BONES.forEach(([a, b], k) => {
        const pa = g.p[a], pb = g.p[b];
        v.copy(pb).sub(pa);
        const d = Math.max(1e-5, v.length()), diff = (d - g.len[k]) / d * 0.5;
        pa.addScaledVector(v, diff);
        pb.addScaledVector(v, -diff);
      });
    }
    for (let i = 0; i < N; i++) {
      const p = g.p[i];
      if (!thrown) {
        w.copy(p).sub(f.orb);
        const d = w.length();
        if (d < f.R * 1.08) p.copy(f.orb).addScaledVector(w, f.R * 1.08 / Math.max(d, 1e-4));
      }
      const floor = Math.max(f.land(p.x, p.z), f.water(p.z));
      if (p.y < floor) {
        p.y = floor;
        const o = g.o[i];
        o.x += (p.x - o.x) * 0.3;
        o.z += (p.z - o.z) * 0.3;
      }
    }
  };
  const lapPhysics = (f, dt, thrown) => {
    const ch = f.charge, G = 9 * S;
    v.copy(lapP).sub(lapO).multiplyScalar(Math.pow(thrown ? 0.995 : 0.975, dt * 60));
    w.copy(f.orb).sub(lapP);
    const d = Math.max(1e-3, w.length());
    w.divideScalar(d);
    const pullK = thrown ? 0 : f.pull * Math.pow(ch, 1.6) * S * 7 * (1 + 3 * Math.min(1, Math.max(0, 1 - (d - f.R) / (6 * f.R))));
    lapO.copy(lapP);
    lapP.x += v.x + w.x * pullK * dt * dt;
    lapP.z += v.z + w.z * pullK * dt * dt;
    lapP.y += v.y + ((thrown ? -G * 0.6 : -G * (1 - 1.4 * ch)) + w.y * pullK) * dt * dt;
    if (!thrown) {
      w.copy(lapP).sub(f.orb);
      const dd = w.length();
      if (dd < f.R * 1.08) lapP.copy(f.orb).addScaledVector(w, f.R * 1.08 / Math.max(dd, 1e-4));
    }
    const floor = Math.max(f.land(lapP.x, lapP.z), f.water(lapP.z));
    if (lapP.y < floor) lapP.y = floor;
    if (lapSpin.lengthSq() > 1e-8) {
      q.setFromAxisAngle(v.copy(lapSpin).normalize(), lapSpin.length() * dt);
      lapQ.premultiply(q);
    }
  };
  const throwOut = (pts, olds, f) => {
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      v.copy(p).sub(f.orb);
      v.y = Math.max(v.y, 0) + v.length() * 0.35;
      v.normalize();
      olds[i].copy(p).addScaledVector(v, -(26 + 8 * rnd()) * S * (1 / 60));
    }
  };
  const ease = (x) => {
    const t = Math.min(1, Math.max(0, x));
    return t * t * (3 - 2 * t);
  };
  const DROP = 0.7;
  const update = (f) => {
    group.visible = f.on && f.fade > 0.01;
    if (!f.on) {
      for (const g of figs) g.mode = "gone";
      placed = false;
      return;
    }
    if (f.side !== lastSide || f.size !== lastSize) needPlace = true;
    if (needPlace && f.calmView && figs.every((g) => g.mode === "gone" || g.mode === "pose")) place(f);
    if (!placed) {
      group.visible = false;
      return;
    }
    const dt = Math.min(f.dt, 1 / 30);
    for (const g of figs) {
      g.timer += dt;
      if (!g.coder && (g.mode === "pose" || g.mode === "drop") && !f.reduced) {
        if (g.stop > 0) {
          g.stop -= dt;
          g.turn = g.stop < 0.9 ? Math.PI * ease(1 - g.stop / 0.9) : 0;
          if (g.stop <= 0) {
            g.dir = -g.dir;
            g.turn = 0;
            g.stop = 0;
          }
        } else {
          const len = Math.max(0.01, Math.abs(g.zB - g.zA)), speed = 0.32 * S * f.walk;
          g.s += g.dir * speed * dt / len;
          g.ph += speed * dt / (0.21 * S);
          if (g.s >= 1 || g.s <= 0) {
            g.s = Math.min(1, Math.max(0, g.s));
            g.stop = 2.2;
          }
        }
      }
      if (g.mode === "pose" && f.charge > 0.03 && f.building && !f.reduced) {
        g.mode = "free";
        BONES.forEach(([a, b], k) => {
          g.len[k] = g.p[a].distanceTo(g.p[b]);
        });
        if (g.coder) {
          lapO.copy(lapP);
          lapSpin.set(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).multiplyScalar(1.2);
        }
      }
      if (g.mode === "free") {
        if (f.nova) {
          g.mode = "thrown";
          g.timer = 0;
          throwOut(g.p, g.o, f);
          if (g.coder) {
            throwOut([lapP], [lapO], f);
            lapSpin.multiplyScalar(6);
          }
        } else if (f.charge <= 1e-3) {
          g.mode = "return";
          g.timer = 0;
          g.from.forEach((p, i) => p.copy(g.p[i]));
          if (g.coder) {
            lapFrom.copy(lapP);
            lapQFrom.copy(lapQ);
          }
        } else {
          physics(g, f, dt, false);
          if (g.coder) lapPhysics(f, dt, false);
        }
      } else if (g.mode === "thrown") {
        physics(g, f, dt, true);
        if (g.coder) lapPhysics(f, dt, true);
        if (g.timer > 1.6) g.mode = "gone";
      } else if (g.mode === "gone") {
        if (f.settled) {
          g.mode = "drop";
          g.timer = g.coder ? 0 : -0.25;
          g.s = 0.5;
          g.stop = 0;
          g.turn = 0;
        }
      } else if (g.mode === "return") {
        poseWorld(g, f, g.o);
        const k = ease(g.timer / 1.1), lift = Math.sin(k * Math.PI) * S * 0.6;
        for (let i = 0; i < N; i++) g.p[i].lerpVectors(g.from[i], g.o[i], k).y += lift;
        if (g.coder) {
          lapHome(g, f, lapO, q);
          lapP.lerpVectors(lapFrom, lapO, k);
          lapQ.slerpQuaternions(lapQFrom, q, k);
        }
        if (g.timer >= 1.1) g.mode = "pose";
        if (f.building && f.charge > 0.03) {
          g.mode = "free";
          BONES.forEach(([a, b], kk) => {
            g.len[kk] = g.p[a].distanceTo(g.p[b]);
          });
          g.o.forEach((o, i) => o.copy(g.p[i]));
        }
      }
      if (g.mode === "drop" || g.mode === "pose") {
        let dropY = 0;
        if (g.mode === "drop") {
          const tt = g.timer;
          if (tt < DROP) dropY = 4 * S * (1 - tt / DROP * (tt / DROP));
          else {
            const u = tt - DROP;
            dropY = -0.05 * S * Math.exp(-7 * u) * Math.sin(16 * u);
            if (u > 0.6) g.mode = "pose";
          }
          if (tt < 0) dropY = 99 * S;
        }
        poseWorld(g, f, g.p, dropY);
        g.o.forEach((o, i) => o.copy(g.p[i]));
        if (g.coder) {
          const lt = g.timer - 0.15;
          const ld = g.mode === "pose" ? 0 : lt < DROP ? 4 * S * (1 - Math.max(0, lt / DROP) ** 2) : 0;
          lapHome(g, f, lapP, lapQ, ld);
          lapO.copy(lapP);
        }
      }
    }
    const r = 0.042 * S;
    let li = 0, bi = 0;
    for (const g of figs) {
      const show = g.mode !== "gone" && !(g.mode === "drop" && g.timer < 0);
      for (const [a, b] of BONES) {
        const pa = g.p[a], pb = g.p[b];
        v.copy(pb).sub(pa);
        const L = v.length();
        q.setFromUnitVectors(up, L > 1e-6 ? v.divideScalar(L) : up);
        m.compose(pa, q, sc.set(show ? r : 0, show ? L : 0, show ? r : 0));
        limbs.setMatrixAt(li++, m);
      }
      for (let i = 0; i < N; i++) {
        const s = show ? i === 2 ? 0.1 * S : i === 0 || i === 1 ? r * 1.15 : r : 0;
        m.compose(g.p[i], q.identity(), sc.set(s, s, s));
        balls.setMatrixAt(bi++, m);
      }
    }
    limbs.instanceMatrix.needsUpdate = true;
    balls.instanceMatrix.needsUpdate = true;
    const coder = figs[0];
    lap.visible = coder.mode !== "gone" && !(coder.mode === "drop" && coder.timer < 0.15 - 0);
    lap.position.copy(lapP);
    lap.quaternion.copy(lapQ);
    lap.scale.setScalar(S);
    lid.localToWorld(mat.uniforms.uScreen.value.set(0, 0, -0.01));
    mat.uniforms.uScreenOn.value = coder.mode === "pose" ? 0.9 : 0.5;
    mat.uniforms.uScreenFall.value = 40 / (S * S);
    mat.uniforms.uCam.value.copy(f.cam.position);
    mat.uniforms.uOrb.value.copy(f.orb);
    mat.uniforms.uOrbGlow.value = 0.08 + 0.45 * f.charge;
    mat.uniforms.uOpacity.value = f.fade;
    shell.opacity = glow.opacity = f.fade;
  };
  const disposables = [tubeGeo, ballGeo, mat, baseGeo, lidGeo, markGeo, shell, glow, { dispose: () => removeEventListener("resize", onResize) }];
  return { group, update, disposables };
}
export {
  makeFigures
};
