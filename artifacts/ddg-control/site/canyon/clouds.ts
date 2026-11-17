import { CanvasTexture, Group, SRGBColorSpace, Sprite, SpriteMaterial, Vector3, type PerspectiveCamera } from 'three';
import { T } from './tune';
import { cloudPictures, rand, reseed } from './cloudPaint';

/** Low, soft clouds lying over the wireframe land in the 3D scene (pictures from cloudPaint.ts). */

// ── 3D: low clouds over the land ──────────────────────────────────────────────────────────
export function makeClouds3D(heightAt: (x: number, z: number) => number, small: boolean) {
  const MAX = small ? 70 : 140;
  const tex = cloudPictures().map((p) => { const t = new CanvasTexture(p); t.colorSpace = SRGBColorSpace; return t; });
  const group = new Group();
  reseed(21);
  const items = Array.from({ length: MAX }, () => {
    const mat = new SpriteMaterial({ map: tex[Math.floor(rand() * tex.length)], transparent: true, depthWrite: false, depthTest: false, fog: true, opacity: 0 });
    // No depth test: a hill never slices a cloud with a hard line; distance fog fades far ones instead.
    const s = new Sprite(mat);
    s.renderOrder = 3.5; // after the land, river and halo; the orb (5) still draws over them
    group.add(s);
    return { s, mat, x: -95 + rand() * 190, z: 50 - rand() * 340, size: 0.6 + rand() * 0.9, lift: rand(), drift: 0.6 + rand() * 0.8, fade: rand() };
  });
  const tint = { white: [1, 1, 1], blue: [0.72, 0.84, 1] };
  const cam = new Vector3();
  const update = (t: number, camera: PerspectiveCamera, flat: number, show: number) => {
    group.visible = T.cloudsOn > 0.5 && show > 0.01;
    if (!group.visible) return;
    camera.getWorldPosition(cam);
    const n = Math.round(MAX * T.cloudCount);
    const c = T.cloudTint, col = [0, 1, 2].map((i) => tint.white[i] + (tint.blue[i] - tint.white[i]) * c);
    items.forEach((it, i) => {
      if (i >= n) { it.s.visible = false; return; }
      // Keep clear of the river's middle, as much as the "spread" slider asks.
      const gap = 10 * (1 - T.cloudSpread);
      let x = it.x + t * T.cloudDrift * it.drift;
      x = ((x + 100) % 200 + 200) % 200 - 100;
      if (Math.abs(x) < gap) x = Math.sign(x || 1) * (gap + (gap - Math.abs(x)) * 0.5);
      const ground = heightAt(x, it.z) * flat;
      const y = Math.max(ground, 4.5 * flat) + (0.4 + it.lift * 2.5) * T.cloudHeight;
      it.s.visible = true;
      it.s.position.set(x, y, it.z);
      const w = 22 * T.cloudSize * it.size;
      it.s.scale.set(w, w * 0.5 * T.cloudFlat, 1);
      // Fade out as one gets close, so no cloud ever sits flat across the screen.
      const d = it.s.position.distanceTo(cam);
      const near = Math.min(1, Math.max(0, (d - 8) / (18 * T.cloudSize)));
      const breathe = 0.75 + 0.25 * Math.sin(t * 0.3 + it.fade * 6.3);
      it.mat.opacity = T.cloudOpacity * near * breathe * show;
      it.mat.color.setRGB(col[0], col[1], col[2]);
    });
  };
  return { group, update, disposables: [...tex, ...items.map((it) => it.mat)] };
}
