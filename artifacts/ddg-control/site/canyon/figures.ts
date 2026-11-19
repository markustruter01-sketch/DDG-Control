import {
  BoxGeometry, BufferAttribute, BufferGeometry, Group, InstancedMesh, Matrix4, Mesh, MeshBasicMaterial,
  PerspectiveCamera, Quaternion, ShaderMaterial, SphereGeometry, Vector3,
} from 'three';

/**
 * Two 3D stick figures by the river (Markus, 19 Nov 2026).
 *  - The Coder sits cross-legged on one bank, halfway between the camera and the orb, typing on a laptop.
 *  - The Walker paces the other bank slowly, hands behind his back, deep in thought.
 * While the orb charges, gravity fades and the orb pulls them in, harder the closer they get. The nova throws
 * them off the screen; once everything has settled they drop back in. Thick white limbs with ball joints.
 *
 * Each figure is 11 points joined by 10 bones. Calm, the points follow a hand-made pose (sitting and typing,
 * or walking). Charging, they become a rag doll: each point moves on its own (Verlet), and the bones are put
 * back to their lengths a few times per frame.
 */

// Points: 0 hip, 1 chest, 2 head, 3/4 left elbow/hand, 5/6 right elbow/hand, 7/8 left knee/foot, 9/10 right knee/foot.
const N = 11;
const BONES: [number, number][] = [[0, 1], [1, 2], [1, 3], [3, 4], [1, 5], [5, 6], [0, 7], [7, 8], [0, 9], [9, 10]];
type P3 = [number, number, number];

/** Sitting cross-legged and typing. Units: a standing figure is 1 tall; +z is the way he faces. */
function sitPose(t: number): P3[] {
  const tapL = Math.sin(t * 13) * 0.012, tapR = Math.sin(t * 13 + 1.9) * 0.012, nod = Math.sin(t * 1.3) * 0.012;
  const u = t % 7.5, up = u < 1.4 ? Math.sin((u / 1.4) * Math.PI) : 0; // now and then he looks up at the orb
  return [
    [0, 0.08, 0], [0, 0.36, 0.03 - 0.02 * up], [0, 0.5 + 0.03 * up, 0.07 + nod - 0.05 * up],
    [0.14, 0.25, 0.09], [0.07, 0.2 + tapL, 0.21],
    [-0.14, 0.25, 0.09], [-0.07, 0.2 + tapR, 0.21],
    [0.21, 0.07, 0.12], [-0.07, 0.04, 0.19],
    [-0.21, 0.07, 0.12], [0.07, 0.04, 0.17],
  ];
}

/** Walking slowly, hands behind the back, head down. `ph` is the stride phase; `go` 0 = standing still. */
function walkPose(ph: number, go: number, t: number): P3[] {
  const a = 0.3 * Math.sin(ph) * go;
  const hipY = 0.46 - 0.012 * go * (1 - Math.cos(2 * ph)) / 2;
  const think = Math.sin(t * 0.7) * 0.015;
  const leg = (sx: number, ang: number, bend: number): [P3, P3] => {
    const kx = sx * 0.07, ky = hipY - 0.22 * Math.cos(ang), kz = 0.22 * Math.sin(ang);
    return [[kx, ky, kz], [kx, ky - 0.24 * Math.cos(ang - bend), kz + 0.24 * Math.sin(ang - bend)]];
  };
  const [lk, lf] = leg(1, a, 0.55 * go * Math.max(0, -Math.cos(ph)));
  const [rk, rf] = leg(-1, -a, 0.55 * go * Math.max(0, Math.cos(ph)));
  return [
    [0, hipY, 0], [0, hipY + 0.27, 0.03], [think, hipY + 0.42, 0.08],
    [0.15, hipY + 0.14, -0.07], [0.03, hipY + 0.03, -0.14],
    [-0.15, hipY + 0.14, -0.07], [-0.03, hipY + 0.04, -0.14],
    lk, lf, rk, rf,
  ];
}

// The figures' look: white, lit from above, a cool rim, blue light from the laptop screen and from the orb.
const VERT = /* glsl */ `
varying vec3 vN; varying vec3 vW;
void main() {
  vec4 w = modelMatrix * instanceMatrix * vec4(position, 1.0);
  vW = w.xyz;
  vN = normalize(mat3(modelMatrix) * mat3(instanceMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * w;
}`;
const FRAG = /* glsl */ `
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
}`;

/** An open tube 1 tall (y 0 to 1), radius 1: scaled per bone. The ball joints close its ends. */
function tube(seg = 12): BufferGeometry {
  const pos: number[] = [], nor: number[] = [], idx: number[] = [];
  for (let i = 0; i <= seg; i++) {
    const a = (i / seg) * Math.PI * 2, x = Math.cos(a), z = Math.sin(a);
    pos.push(x, 0, z, x, 1, z); nor.push(x, 0, z, x, 0, z);
    if (i < seg) { const q = i * 2; idx.push(q, q + 1, q + 2, q + 1, q + 3, q + 2); }
  }
  const g = new BufferGeometry();
  g.setAttribute('position', new BufferAttribute(new Float32Array(pos), 3));
  g.setAttribute('normal', new BufferAttribute(new Float32Array(nor), 3));
  g.setIndex(idx);
  return g;
}

export type FigureFrame = {
  dt: number; t: number; orb: Vector3; R: number;
  /** Charge 0 to 1, whether it is building now, the nova this frame, the scene calm again after a blast. */
  charge: number; building: boolean; nova: boolean; settled: boolean;
  /** The resting first-screen view (no scroll, no hold): only then are the figures placed. */
  calmView: boolean; cam: PerspectiveCamera;
  land: (x: number, z: number) => number; water: (z: number) => number;
  on: boolean; size: number; side: number; pull: number; walk: number; reduced: boolean; fade: number;
};

type Fig = {
  coder: boolean; p: Vector3[]; o: Vector3[]; len: number[]; from: Vector3[];
  mode: 'gone' | 'drop' | 'pose' | 'free' | 'thrown' | 'return'; timer: number;
  home: Vector3; yaw: number;
  // Walker: where on his beat he is (0..1 along zA to zB), which way, his stride, and a pause at each end.
  zA: number; zB: number; s: number; dir: number; ph: number; stop: number; turn: number;
};

export function makeFigures() {
  const group = new Group();
  const mat = new ShaderMaterial({
    uniforms: {
      uCam: { value: new Vector3() }, uScreen: { value: new Vector3() }, uScreenOn: { value: 0 }, uScreenFall: { value: 1 },
      uOrb: { value: new Vector3() }, uOrbGlow: { value: 0 }, uOpacity: { value: 1 },
    },
    vertexShader: VERT, fragmentShader: FRAG, transparent: true,
  });
  const tubeGeo = tube(), ballGeo = new SphereGeometry(1, 14, 10);
  const limbs = new InstancedMesh(tubeGeo, mat, BONES.length * 2);
  const balls = new InstancedMesh(ballGeo, mat, N * 2);
  limbs.frustumCulled = false; balls.frustumCulled = false;
  group.add(limbs, balls);

  // The laptop: a light base and a lid whose inside (facing the coder) glows blue.
  const lap = new Group();
  const shell = new MeshBasicMaterial({ color: 0xc4d2e0, transparent: true });
  const glow = new MeshBasicMaterial({ color: 0x7fd6ff, transparent: true });
  const baseGeo = new BoxGeometry(0.26, 0.018, 0.17), lidGeo = new BoxGeometry(0.26, 0.17, 0.012);
  const base = new Mesh(baseGeo, shell);
  const lid = new Mesh(lidGeo, [shell, shell, shell, shell, shell, glow]);
  lid.rotation.x = -0.26; lid.position.set(0, 0.009 + 0.085 * Math.cos(0.26), 0.085 + 0.085 * Math.sin(0.26));
  // A small glowing mark on the back of the lid, the side the camera sees.
  const markGeo = new BoxGeometry(0.05, 0.05, 0.004);
  const mark = new Mesh(markGeo, glow); mark.position.set(0, 0.01, 0.008); lid.add(mark);
  lap.add(base, lid); group.add(lap);
  const lapP = new Vector3(), lapO = new Vector3(), lapQ = new Quaternion(), lapSpin = new Vector3(), lapFrom = new Vector3(), lapQFrom = new Quaternion();
  const LAP_HOME = new Vector3(0, 0.165, 0.22);

  const mk = (coder: boolean): Fig => ({
    coder, p: Array.from({ length: N }, () => new Vector3()), o: Array.from({ length: N }, () => new Vector3()),
    len: BONES.map(() => 0.2), from: Array.from({ length: N }, () => new Vector3()),
    mode: 'gone', timer: 0, home: new Vector3(), yaw: 0, zA: 0, zB: 0, s: 0.5, dir: 1, ph: 0, stop: 0, turn: 0,
  });
  const figs = [mk(true), mk(false)];
  let S = 1, placed = false, lastSide = -1, lastSize = -1, needPlace = true;
  const onResize = () => { needPlace = true; };
  addEventListener('resize', onResize);

  const v = new Vector3(), w = new Vector3(), up = new Vector3(0, 1, 0), q = new Quaternion(), m = new Matrix4(), sc = new Vector3();
  let seed = 7;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };

  /** Where the river's edge is at depth z on one side (+1 right, -1 left), with the figure set just onto the land. */
  const bankX = (z: number, side: number, f: FigureFrame) => {
    const wl = f.water(z);
    for (let x = 0.5; x < 45; x += 0.25) if (f.land(side * x, z) > wl + 0.15 * S) return side * (x + 0.5 * S);
    return side * 8;
  };
  /** How far a point sits from the middle of the screen, sideways (0 middle, 1 edge); 9 if it is above, below or behind. */
  const offCentre = (x: number, y: number, z: number, cam: PerspectiveCamera) => {
    v.set(x, y, z).project(cam);
    return v.z < 1 && v.y > -0.4 && v.y < 0.55 ? Math.abs(v.x) : 9;
  };
  /**
   * Place both figures for the current view. The Coder goes halfway from camera to orb, or closer to the orb until
   * he is well inside the screen (on a narrow phone the banks near the camera are off the sides; Markus, 19 Nov:
   * "I can't see the stick men on the phone"). If no spot is inside, the one nearest the middle is used.
   */
  const place = (f: FigureFrame) => {
    S = 0.55 * f.R * f.size;
    f.cam.updateMatrixWorld();
    const side = f.side > 0.5 ? 1 : -1, cam = f.cam.position;
    const spot = (sd: number, h: number, from: number) => {
      let best = from, bestOff = 99;
      for (let t = from; t <= 0.97; t += 0.03) {
        const z = cam.z + (f.orb.z - cam.z) * t, x = bankX(z, sd, f), o = offCentre(x, f.land(x, z) + h * S, z, f.cam);
        if (o < 0.72) return t;
        if (o < bestOff) { bestOff = o; best = t; }
      }
      return best;
    };
    const t = spot(side, 0.3, 0.5);
    const zc = cam.z + (f.orb.z - cam.z) * t, xc = bankX(zc, side, f);
    const c = figs[0]!;
    c.home.set(xc, f.land(xc, zc), zc);
    c.yaw = Math.atan2(-side, 1) * 0.75; // turned towards the river and the camera
    // The Walker's beat on the other bank: its middle found the same way, then shortened until both ends are inside.
    const wk = figs[1]!;
    const tm = spot(-side, 0.5, Math.min(0.97, t + 0.06));
    const zm = cam.z + (f.orb.z - cam.z) * tm;
    let half = 2.2 * f.R;
    for (; half > 0.3 * f.R; half *= 0.8) {
      const a = zm - half, b = zm + half, xa = bankX(a, -side, f), xb = bankX(b, -side, f);
      if (offCentre(xa, f.land(xa, a) + 0.5 * S, a, f.cam) < 0.78 && offCentre(xb, f.land(xb, b) + 0.5 * S, b, f.cam) < 0.78) break;
    }
    wk.zA = zm - half; wk.zB = zm + half; wk.home.set(bankX(zm, -side, f), 0, zm);
    placed = true; needPlace = false; lastSide = f.side; lastSize = f.size;
  };

  /** The figure's calm pose, in the world, written into `out`. */
  const poseWorld = (g: Fig, f: FigureFrame, out: Vector3[], dropY = 0) => {
    let pose: P3[], yaw = g.yaw, bx = g.home.x, bz = g.home.z;
    if (g.coder) pose = sitPose(f.reduced ? 0 : f.t);
    else {
      bz = g.zA + (g.zB - g.zA) * g.s; bx = bankX(bz, Math.sign(g.home.x) || 1, f);
      pose = walkPose(g.ph, g.stop > 0 || f.reduced ? 0 : 1, f.t);
      yaw = (g.dir > 0 ? 0 : Math.PI) + g.turn;
    }
    const by = f.land(bx, bz) + dropY, cy = Math.cos(yaw), sy = Math.sin(yaw);
    for (let i = 0; i < N; i++) {
      const [x, y, z] = pose[i]!;
      out[i]!.set(bx + (x * cy + z * sy) * S, by + y * S, bz + (-x * sy + z * cy) * S);
    }
  };
  const lapHome = (g: Fig, f: FigureFrame, outP: Vector3, outQ: Quaternion, dropY = 0) => {
    const cy = Math.cos(g.yaw), sy = Math.sin(g.yaw), L = LAP_HOME;
    outP.set(g.home.x + (L.x * cy + L.z * sy) * S, f.land(g.home.x, g.home.z) + dropY + L.y * S, g.home.z + (-L.x * sy + L.z * cy) * S);
    outQ.setFromAxisAngle(up, g.yaw);
  };

  /** One rag-doll step: gravity that fades with the charge, the orb's pull, the bones, the ground and the orb's skin. */
  const physics = (g: Fig, f: FigureFrame, dt: number, thrown: boolean) => {
    const ch = f.charge, G = 9 * S;
    const grav = thrown ? -G * 0.6 : -G * (1 - 1.3 * ch);
    const pullK = thrown ? 0 : f.pull * Math.pow(ch, 1.6) * S * 7;
    const damp = Math.pow(thrown ? 0.995 : 0.975, dt * 60);
    for (let i = 0; i < N; i++) {
      const p = g.p[i]!, o = g.o[i]!;
      v.copy(p).sub(o).multiplyScalar(damp);
      w.copy(f.orb).sub(p); const d = Math.max(0.001, w.length()); w.divideScalar(d);
      const near = 1 + 3 * Math.min(1, Math.max(0, 1 - (d - f.R) / (6 * f.R))); // pulled harder the closer it gets
      const ax = w.x * pullK * near + (-w.z) * pullK * 0.25, az = w.z * pullK * near + w.x * pullK * 0.25;
      const ay = grav + w.y * pullK * near;
      o.copy(p);
      p.x += v.x + ax * dt * dt; p.y += v.y + ay * dt * dt; p.z += v.z + az * dt * dt;
    }
    for (let it = 0; it < 4; it++) {
      BONES.forEach(([a, b], k) => {
        const pa = g.p[a]!, pb = g.p[b]!;
        v.copy(pb).sub(pa); const d = Math.max(1e-5, v.length()), diff = (d - g.len[k]!) / d * 0.5;
        pa.addScaledVector(v, diff); pb.addScaledVector(v, -diff);
      });
    }
    for (let i = 0; i < N; i++) {
      const p = g.p[i]!;
      if (!thrown) {
        w.copy(p).sub(f.orb); const d = w.length();
        if (d < f.R * 1.08) p.copy(f.orb).addScaledVector(w, (f.R * 1.08) / Math.max(d, 1e-4));
      }
      const floor = Math.max(f.land(p.x, p.z), f.water(p.z));
      if (p.y < floor) { p.y = floor; const o = g.o[i]!; o.x += (p.x - o.x) * 0.3; o.z += (p.z - o.z) * 0.3; }
    }
  };
  const lapPhysics = (f: FigureFrame, dt: number, thrown: boolean) => {
    const ch = f.charge, G = 9 * S;
    v.copy(lapP).sub(lapO).multiplyScalar(Math.pow(thrown ? 0.995 : 0.975, dt * 60));
    w.copy(f.orb).sub(lapP); const d = Math.max(0.001, w.length()); w.divideScalar(d);
    const pullK = thrown ? 0 : f.pull * Math.pow(ch, 1.6) * S * 7 * (1 + 3 * Math.min(1, Math.max(0, 1 - (d - f.R) / (6 * f.R))));
    lapO.copy(lapP);
    lapP.x += v.x + w.x * pullK * dt * dt; lapP.z += v.z + w.z * pullK * dt * dt;
    lapP.y += v.y + ((thrown ? -G * 0.6 : -G * (1 - 1.4 * ch)) + w.y * pullK) * dt * dt;
    if (!thrown) { w.copy(lapP).sub(f.orb); const dd = w.length(); if (dd < f.R * 1.08) lapP.copy(f.orb).addScaledVector(w, (f.R * 1.08) / Math.max(dd, 1e-4)); }
    const floor = Math.max(f.land(lapP.x, lapP.z), f.water(lapP.z));
    if (lapP.y < floor) lapP.y = floor;
    if (lapSpin.lengthSq() > 1e-8) { q.setFromAxisAngle(v.copy(lapSpin).normalize(), lapSpin.length() * dt); lapQ.premultiply(q); }
  };
  const throwOut = (pts: Vector3[], olds: Vector3[], f: FigureFrame) => {
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i]!;
      v.copy(p).sub(f.orb); v.y = Math.max(v.y, 0) + v.length() * 0.35; v.normalize();
      olds[i]!.copy(p).addScaledVector(v, -(26 + 8 * rnd()) * S * (1 / 60));
    }
  };

  const ease = (x: number) => { const t = Math.min(1, Math.max(0, x)); return t * t * (3 - 2 * t); };
  const DROP = 0.7;

  const update = (f: FigureFrame) => {
    group.visible = f.on && f.fade > 0.01;
    if (!f.on) { for (const g of figs) g.mode = 'gone'; placed = false; return; }
    if (f.side !== lastSide || f.size !== lastSize) needPlace = true;
    if (needPlace && f.calmView && figs.every((g) => g.mode === 'gone' || g.mode === 'pose')) place(f);
    if (!placed) { group.visible = false; return; }
    const dt = Math.min(f.dt, 1 / 30);

    for (const g of figs) {
      g.timer += dt;
      // Walker's beat: walk, stop at the end, think, turn round, walk back.
      if (!g.coder && (g.mode === 'pose' || g.mode === 'drop') && !f.reduced) {
        if (g.stop > 0) {
          g.stop -= dt;
          g.turn = g.stop < 0.9 ? Math.PI * ease(1 - g.stop / 0.9) : 0;
          if (g.stop <= 0) { g.dir = -g.dir; g.turn = 0; g.stop = 0; }
        } else {
          const len = Math.max(0.01, Math.abs(g.zB - g.zA)), speed = 0.32 * S * f.walk;
          g.s += (g.dir * speed * dt) / len; g.ph += (speed * dt) / (0.21 * S);
          if (g.s >= 1 || g.s <= 0) { g.s = Math.min(1, Math.max(0, g.s)); g.stop = 2.2; }
        }
      }
      // Calm → rag doll when the orb starts charging (not for reduced motion).
      if (g.mode === 'pose' && f.charge > 0.03 && f.building && !f.reduced) {
        g.mode = 'free';
        BONES.forEach(([a, b], k) => { g.len[k] = g.p[a]!.distanceTo(g.p[b]!); });
        if (g.coder) { lapO.copy(lapP); lapSpin.set(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).multiplyScalar(1.2); }
      }
      if (g.mode === 'free') {
        if (f.nova) {
          g.mode = 'thrown'; g.timer = 0; throwOut(g.p, g.o, f);
          if (g.coder) { throwOut([lapP], [lapO], f); lapSpin.multiplyScalar(6); }
        } else if (f.charge <= 0.001) { g.mode = 'return'; g.timer = 0; g.from.forEach((p, i) => p.copy(g.p[i]!)); if (g.coder) { lapFrom.copy(lapP); lapQFrom.copy(lapQ); } }
        else { physics(g, f, dt, false); if (g.coder) lapPhysics(f, dt, false); }
      } else if (g.mode === 'thrown') {
        physics(g, f, dt, true); if (g.coder) lapPhysics(f, dt, true);
        if (g.timer > 1.6) g.mode = 'gone';
      } else if (g.mode === 'gone') {
        if (f.settled) { g.mode = 'drop'; g.timer = g.coder ? 0 : -0.25; g.s = 0.5; g.stop = 0; g.turn = 0; }
      } else if (g.mode === 'return') {
        // Let go before the blast: they are set gently back where they were.
        poseWorld(g, f, g.o);
        const k = ease(g.timer / 1.1), lift = Math.sin(k * Math.PI) * S * 0.6;
        for (let i = 0; i < N; i++) g.p[i]!.lerpVectors(g.from[i]!, g.o[i]!, k).y += lift;
        if (g.coder) { lapHome(g, f, lapO, q); lapP.lerpVectors(lapFrom, lapO, k); lapQ.slerpQuaternions(lapQFrom, q, k); }
        if (g.timer >= 1.1) g.mode = 'pose';
        if (f.building && f.charge > 0.03) { g.mode = 'free'; BONES.forEach(([a, b], kk) => { g.len[kk] = g.p[a]!.distanceTo(g.p[b]!); }); g.o.forEach((o, i) => o.copy(g.p[i]!)); }
      }
      if (g.mode === 'drop' || g.mode === 'pose') {
        // Drop in from above after the blast (and at load), land with a small bounce, carry on.
        let dropY = 0;
        if (g.mode === 'drop') {
          const tt = g.timer;
          if (tt < DROP) dropY = 4 * S * (1 - (tt / DROP) * (tt / DROP));
          else { const u = tt - DROP; dropY = -0.05 * S * Math.exp(-7 * u) * Math.sin(16 * u); if (u > 0.6) g.mode = 'pose'; }
          if (tt < 0) dropY = 99 * S;
        }
        poseWorld(g, f, g.p, dropY);
        g.o.forEach((o, i) => o.copy(g.p[i]!));
        if (g.coder) {
          const lt = g.timer - 0.15;
          const ld = g.mode === 'pose' ? 0 : lt < DROP ? 4 * S * (1 - Math.max(0, lt / DROP) ** 2) : 0;
          lapHome(g, f, lapP, lapQ, ld); lapO.copy(lapP);
        }
      }
    }

    // Draw: a tube per bone, a ball per joint (the head bigger).
    const r = 0.042 * S;
    let li = 0, bi = 0;
    for (const g of figs) {
      const show = g.mode !== 'gone' && !(g.mode === 'drop' && g.timer < 0);
      for (const [a, b] of BONES) {
        const pa = g.p[a]!, pb = g.p[b]!;
        v.copy(pb).sub(pa); const L = v.length();
        q.setFromUnitVectors(up, L > 1e-6 ? v.divideScalar(L) : up);
        m.compose(pa, q, sc.set(show ? r : 0, show ? L : 0, show ? r : 0));
        limbs.setMatrixAt(li++, m);
      }
      for (let i = 0; i < N; i++) {
        const s = show ? (i === 2 ? 0.1 * S : i === 0 || i === 1 ? r * 1.15 : r) : 0;
        m.compose(g.p[i]!, q.identity(), sc.set(s, s, s));
        balls.setMatrixAt(bi++, m);
      }
    }
    limbs.instanceMatrix.needsUpdate = true; balls.instanceMatrix.needsUpdate = true;
    const coder = figs[0]!;
    lap.visible = coder.mode !== 'gone' && !(coder.mode === 'drop' && coder.timer < 0.15 - 0.0);
    lap.position.copy(lapP); lap.quaternion.copy(lapQ); lap.scale.setScalar(S);
    lid.localToWorld(mat.uniforms.uScreen!.value.set(0, 0, -0.01));
    mat.uniforms.uScreenOn!.value = coder.mode === 'pose' ? 0.9 : 0.5;
    mat.uniforms.uScreenFall!.value = 40 / (S * S);
    mat.uniforms.uCam!.value.copy(f.cam.position);
    mat.uniforms.uOrb!.value.copy(f.orb);
    mat.uniforms.uOrbGlow!.value = 0.08 + 0.45 * f.charge;
    mat.uniforms.uOpacity!.value = f.fade;
    shell.opacity = glow.opacity = f.fade;
  };

  const disposables = [tubeGeo, ballGeo, mat, baseGeo, lidGeo, markGeo, shell, glow, { dispose: () => removeEventListener('resize', onResize) }];
  return { group, update, disposables };
}
