import {
  AdditiveBlending, BufferAttribute, BufferGeometry, DoubleSide, Group, Mesh, MeshBasicMaterial, SphereGeometry,
  type Material,
} from 'three';

/**
 * The DDG core as a ball of spinning air: three shells of thin wind streaks wrapped round a
 * sphere, each shell on its own tilted axis and speed. Every streak is bright at its head and
 * fades to nothing at its tail, so the ball reads as fast-moving air and not as a solid object.
 */

// Fixed seed, so the orb looks the same on every visit.
function seeded(seed: number) {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}

const SEG = 22; // pieces per streak

/** One shell: `streaks` ribbons on a sphere of `radius`, heads leading in the +Y spin direction. */
function shellGeometry(radius: number, streaks: number, seed: number): BufferGeometry {
  const rnd = seeded(seed);
  const pos: number[] = [], col: number[] = [], idx: number[] = [];
  for (let s = 0; s < streaks; s++) {
    const lat0 = (rnd() * 2 - 1) * 1.25, lon0 = rnd() * Math.PI * 2;
    const len = 1.1 + rnd() * 3.2, width = 0.018 + rnd() * 0.05, drift = (rnd() * 2 - 1) * 0.4;
    const white = rnd(); // 0 = ice blue, 1 = white
    const start = pos.length / 3;
    for (let j = 0; j <= SEG; j++) {
      const t = j / SEG;
      const lon = lon0 - t * len, lat = lat0 + drift * t, w = width * (1 - t * 0.85);
      const glow = Math.pow(1 - t, 1.6) * Math.min(1, t * 9 + 0.15);
      for (const side of [-1, 1]) {
        const la = lat + side * w, c = Math.cos(la);
        pos.push(radius * c * Math.cos(lon), radius * Math.sin(la), -radius * c * Math.sin(lon));
        col.push(glow * (0.5 + 0.5 * white), glow * (0.82 + 0.18 * white), glow);
      }
      if (j < SEG) { const a = start + j * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
    }
  }
  const geo = new BufferGeometry();
  geo.setAttribute('position', new BufferAttribute(new Float32Array(pos), 3));
  geo.setAttribute('color', new BufferAttribute(new Float32Array(col), 3));
  geo.setIndex(idx);
  return geo;
}

// radius (× orb radius), streak count, turns per second (radians), axis tilt (x, z)
const SHELLS = [
  { r: 1.0, n: 46, speed: 5.4, tx: 0.1, tz: 0.08 },
  { r: 0.8, n: 30, speed: 7.6, tx: -0.42, tz: 0.3 },
  { r: 1.17, n: 16, speed: 3.4, tx: 0.3, tz: -0.22 },
];

export function makeAirOrb(R: number, small: boolean) {
  const group = new Group();
  const streakMat = new MeshBasicMaterial({ vertexColors: true, blending: AdditiveBlending, transparent: true, depthWrite: false, side: DoubleSide });
  const bodyMat = new MeshBasicMaterial({ color: 0x9fdcff, blending: AdditiveBlending, transparent: true, opacity: 0.07, depthWrite: false });
  const bodyGeo = new SphereGeometry(R * 0.96, 32, 20);
  group.add(new Mesh(bodyGeo, bodyMat));
  const disposables: { dispose: () => void }[] = [bodyGeo];
  const spinners = SHELLS.map((s, i) => {
    const axis = new Group(); axis.rotation.set(s.tx, 0, s.tz); group.add(axis);
    const geo = shellGeometry(R * s.r, small ? Math.round(s.n * 0.7) : s.n, 11 + i * 97);
    const mesh = new Mesh(geo, streakMat); axis.add(mesh);
    disposables.push(geo);
    return { mesh, speed: s.speed };
  });
  const materials: Material[] = [streakMat, bodyMat];
  /** Spin the shells; a slow wobble keeps the ball from looking mechanical. */
  const update = (dt: number, t: number) => {
    for (const s of spinners) s.mesh.rotation.y += dt * s.speed;
    group.rotation.z = Math.sin(t * 0.7) * 0.06;
    group.position.y = Math.sin(t * 1.3) * 0.06;
  };
  return { group, materials, disposables, update };
}
