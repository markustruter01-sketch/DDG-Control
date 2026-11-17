import { CanvasTexture, Group, SRGBColorSpace, Sprite, SpriteMaterial, Vector3, type PerspectiveCamera } from 'three';
import { T } from './tune';
import { cloudPictures, rand, reseed } from './cloudPaint';

/** Low, soft clouds lying over the wireframe land in the 3D scene (pictures from cloudPaint.ts). */

// ── 3D: low clouds over the land ──────────────────────────────────────────────────────────
// Each cloud is a soft body with a position and a velocity. A light wind carries it in along the
// banks towards the viewer; the river's edge holds it off the water; the orb pushes it away like a
// force field, and the wind then takes it on in its new direction. Clouds never pop: they fade in
// far away, fade out near the camera or the edge of the land, and are then reborn upstream.
const WATER = 4.62; // the river covers the ground below this height (same as the land shader)
const Z_FAR = -300, Z_NEAR = 58;

export function makeClouds3D(heightAt: (x: number, z: number) => number, small: boolean) {
  const MAX = small ? 70 : 140;
  const tex = cloudPictures().map((p) => { const t = new CanvasTexture(p); t.colorSpace = SRGBColorSpace; return t; });
  const group = new Group();
  // Where the water ends on each side, every 2 units along the river.
  const edge: number[] = [];
  for (let z = Z_FAR; z <= Z_NEAR + 2; z += 2) {
    let x = 0; while (x < 60 && heightAt(x, z) < WATER - 0.01 * z && heightAt(-x, z) < WATER - 0.01 * z) x += 0.5;
    edge.push(x);
  }
  const edgeAt = (z: number) => edge[Math.max(0, Math.min(edge.length - 1, Math.round((z - Z_FAR) / 2)))];
  reseed(21);
  type Cloud = { s: Sprite; mat: SpriteMaterial; x: number; y: number; z: number; vx: number; vz: number; size: number; lift: number; gust: number; life: number; fade: number };
  const spawn = (c: Cloud, anywhere: boolean) => {
    c.z = anywhere ? Z_FAR + rand() * (Z_NEAR - Z_FAR - 10) : Z_FAR + rand() * 30;
    const side = rand() < 0.5 ? -1 : 1;
    c.x = side * (edgeAt(c.z) + 6 + rand() * 70);
    c.y = heightAt(c.x, c.z) + 2;
    c.vx = 0; c.vz = 0; c.life = anywhere ? 1 : 0;
  };
  const items: Cloud[] = Array.from({ length: MAX }, (_, i) => {
    const mat = new SpriteMaterial({ map: tex[Math.floor(rand() * tex.length)], transparent: true, depthWrite: false, depthTest: false, fog: true, opacity: 0 });
    // No depth test: a hill never slices a cloud with a hard line; distance fog fades far ones instead.
    const s = new Sprite(mat);
    s.renderOrder = 3.5; // after the land, river and halo; the orb (5) still draws over them
    group.add(s);
    const c: Cloud = { s, mat, x: 0, y: 0, z: 0, vx: 0, vz: 0, size: 0.6 + rand() * 0.9, lift: rand(), gust: rand() * 6.3, life: 1, fade: i < MAX * T.cloudCount ? 1 : 0 };
    spawn(c, true);
    return c;
  });
  const tint = { white: [1, 1, 1], blue: [0.72, 0.84, 1] };
  const cam = new Vector3();
  let last = -1;
  const update = (t: number, camera: PerspectiveCamera, flat: number, show: number, orb: Vector3) => {
    group.visible = T.cloudsOn > 0.5 && show > 0.01;
    const dt = last < 0 ? 0 : Math.min(0.05, Math.max(0, t - last)); last = t;
    if (!group.visible) return;
    camera.getWorldPosition(cam);
    const n = Math.round(MAX * T.cloudCount);
    const col = [0, 1, 2].map((i) => tint.white[i] + (tint.blue[i] - tint.white[i]) * T.cloudTint);
    const wind = 2.2 * T.cloudDrift, R = 30 * T.cloudOrbRadius;
    items.forEach((c, i) => {
      const w = 22 * T.cloudSize * c.size;
      // The wind: mostly down the valley towards the viewer, drifting in towards the river, with slow gusts.
      const g = Math.sin(t * 0.13 + c.gust) * 0.6;
      let ax = (-Math.sign(c.x) * 0.35 + 0.25 * g) * wind - c.vx, az = (1 + 0.3 * g) * wind - c.vz;
      // The river's edge holds the cloud off the water (a soft wall a little way back from the bank).
      const keep = edgeAt(c.z) + w * (0.32 + 0.5 * T.cloudSpread);
      const into = keep - Math.abs(c.x);
      if (into > 0) ax += Math.sign(c.x || 1) * into * 1.6;
      // The orb's force field: a gentle push outwards, strongest close in, nothing beyond its reach.
      const dx = c.x - orb.x, dz = c.z - orb.z, d = Math.hypot(dx, dz) || 1;
      if (d < R) { const f = 26 * T.cloudOrbPush * Math.pow(1 - d / R, 2); ax += (dx / d) * f; az += (dz / d) * f * 0.6; }
      c.vx += ax * dt * 0.8; c.vz += az * dt * 0.8;
      c.x += c.vx * dt; c.z += c.vz * dt;
      // Follow the ground smoothly, so a cloud glides over hills instead of jumping.
      const ground = Math.max(heightAt(c.x, c.z), WATER) * flat;
      const want = ground + (0.4 + c.lift * 2.5) * T.cloudHeight;
      c.y += (want - c.y) * Math.min(1, dt * 1.5);
      // Fade in after being born, fade out near the end of the land, then start again upstream.
      const leaving = c.z > Z_NEAR - 6 || Math.abs(c.x) > 105;
      c.life = Math.max(0, Math.min(1, c.life + dt * (leaving ? -0.6 : 0.35)));
      if (leaving && c.life <= 0) spawn(c, false);
      // Clouds beyond the "how many" slider fade away rather than vanish.
      c.fade += ((i < n ? 1 : 0) - c.fade) * Math.min(1, dt * 0.8);
      const near = Math.min(1, Math.max(0, (c.s.position.distanceTo(cam) - 8) / (18 * T.cloudSize)));
      const breathe = 0.75 + 0.25 * Math.sin(t * 0.3 + c.gust);
      const a = T.cloudOpacity * near * breathe * show * c.life * c.fade;
      c.s.visible = a > 0.003;
      c.s.position.set(c.x, c.y, c.z);
      c.s.scale.set(w, w * 0.5 * T.cloudFlat, 1);
      c.mat.opacity = a;
      c.mat.color.setRGB(col[0], col[1], col[2]);
    });
  };
  return { group, update, disposables: [...tex, ...items.map((c) => c.mat)] };
}
