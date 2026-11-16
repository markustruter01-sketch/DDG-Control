import { useEffect, useRef } from 'react';
import {
  AdditiveBlending, BufferAttribute, BufferGeometry, CanvasTexture, DoubleSide, DynamicDrawUsage, Fog, Group,
  LineBasicMaterial, LineSegments, Mesh, MeshBasicMaterial, PerspectiveCamera, Points,
  PointsMaterial, Scene, Sprite, SpriteMaterial, SRGBColorSpace, Vector3, WebGLRenderer,
} from 'three';
import { makeAirOrb } from './airOrb';
import { makeWater } from './water';

/**
 * Home background (fixed): a night canyon of ice-blue lines with the DDG core, a fast-spinning
 * ball of air, floating just above a river that runs down the canyon floor towards the viewer.
 * The air ball churns the water beneath it, turning the same way it spins. Scrolling flattens
 * the canyon into a grid seen from above, then the whole stage fades out as the
 * "Built in Brisbane" section (#work) arrives.
 * Loaded lazily, so the page text never waits for it.
 */

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));

// Canyon heights: smooth value noise, with a valley down the middle where the core floats.
const hash = (x: number, y: number) => { const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return s - Math.floor(s); };
const sm = (t: number) => t * t * (3 - 2 * t);
function noise(x: number, y: number) {
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
  const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
  const u = sm(xf), w = sm(yf);
  return a + (b - a) * u + (c - a) * w + (a - b - c + d) * u * w;
}
function fbm(x: number, y: number) { let v = 0, amp = 1, f = 1; for (let i = 0; i < 5; i++) { v += amp * noise(x * f, y * f); amp *= 0.5; f *= 2.03; } return v; }
function heightAt(x: number, z: number) {
  const valley = Math.min(1, Math.pow(Math.abs(x) / 24, 1.7));
  return (fbm(x * 0.045, z * 0.045) - 0.55) * 26 * (0.12 + valley) + valley * 11;
}

function glowTexture(rgb: string) {
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const g = c.getContext('2d')!;
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, `rgba(${rgb},1)`); grd.addColorStop(0.25, `rgba(${rgb},0.45)`); grd.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grd; g.fillRect(0, 0, 128, 128);
  const t = new CanvasTexture(c); t.colorSpace = SRGBColorSpace; return t;
}

export default function Stage({ fadeAt }: { fadeAt: string }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!, stage = stageRef.current!;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const small = innerWidth < 700;
    let renderer: WebGLRenderer;
    try { renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true }); } catch { stage.style.display = 'none'; return; }
    renderer.setPixelRatio(Math.min(devicePixelRatio, small ? 1.5 : 1.75));
    const scene = new Scene();
    scene.fog = new Fog(0x0a0d16, 30, 150);
    const camera = new PerspectiveCamera(58, 1, 0.1, 500);
    const disposables: { dispose: () => void }[] = [];

    // One grid of points, drawn twice: a dark surface (hides lines behind hills) and the lines.
    const NX = small ? 80 : 110, NZ = small ? 150 : 200, W = 200, D = 380, Z0 = 60;
    const count = (NX + 1) * (NZ + 1);
    const base = new Float32Array(count), pos = new Float32Array(count * 3);
    for (let iz = 0, i = 0; iz <= NZ; iz++) for (let ix = 0; ix <= NX; ix++, i++) {
      const x = -W / 2 + (ix / NX) * W, z = Z0 - (iz / NZ) * D;
      base[i] = heightAt(x, z); pos[i * 3] = x; pos[i * 3 + 1] = base[i]; pos[i * 3 + 2] = z;
    }
    const attr = new BufferAttribute(pos, 3); attr.setUsage(DynamicDrawUsage);
    const tri: number[] = [], seg: number[] = [];
    for (let iz = 0; iz < NZ; iz++) for (let ix = 0; ix < NX; ix++) {
      const a = iz * (NX + 1) + ix, b = a + 1, c = a + NX + 1, d = c + 1;
      tri.push(a, c, b, b, c, d); seg.push(a, b, a, c);
    }
    for (let ix = 0; ix < NX; ix++) { const a = NZ * (NX + 1) + ix; seg.push(a, a + 1); }
    for (let iz = 0; iz < NZ; iz++) { const a = iz * (NX + 1) + NX; seg.push(a, a + NX + 1); }
    const surfGeo = new BufferGeometry(); surfGeo.setAttribute('position', attr); surfGeo.setIndex(tri);
    const lineGeo = new BufferGeometry(); lineGeo.setAttribute('position', attr); lineGeo.setIndex(seg);
    // Both sides: the grid's triangles face downwards, so one-sided the surface was never drawn from above.
    const surfMat = new MeshBasicMaterial({ color: 0x07090f, side: DoubleSide, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 });
    const lineMat = new LineBasicMaterial({ color: 0x6cc7f0, transparent: true, opacity: 0.34 });
    scene.add(new Mesh(surfGeo, surfMat), new LineSegments(lineGeo, lineMat));
    disposables.push(surfGeo, lineGeo, surfMat, lineMat);

    const starPos = new Float32Array(900 * 3);
    for (let i = 0; i < 900; i++) { starPos[i * 3] = (Math.random() - 0.5) * 400; starPos[i * 3 + 1] = 40 + Math.random() * 120; starPos[i * 3 + 2] = -Math.random() * 360; }
    const starGeo = new BufferGeometry(); starGeo.setAttribute('position', new BufferAttribute(starPos, 3));
    const starMat = new PointsMaterial({ color: 0xffffff, size: 0.45, transparent: true, opacity: 0.8, depthWrite: false });
    scene.add(new Points(starGeo, starMat));
    disposables.push(starGeo, starMat);

    // The DDG core: a ball of spinning air floating just above the river, with a soft glow round it.
    const CORE = new Vector3(0, 9.5, 4), ORB_R = 1.7, HALO = 0.45;
    const orbit = new Group(); orbit.position.copy(CORE); scene.add(orbit);
    const air = makeAirOrb(ORB_R);
    const haloTex = glowTexture('170,225,255');
    const haloMat = new SpriteMaterial({ map: haloTex, blending: AdditiveBlending, depthWrite: false, transparent: true, opacity: HALO });
    const halo = new Sprite(haloMat); halo.scale.set(10, 10, 1);
    halo.renderOrder = 4; // after the river (1) and before the ball (5), so the ball sits in front of the water
    orbit.add(halo, air.group);
    disposables.push(...air.disposables, haloTex, haloMat);

    // The river on the canyon floor and the splashes the orb throws up from it.
    const sprayTex = glowTexture('200,236,255');
    const water = makeWater({ small, zNear: Z0, heightAt, fogColor: 0x0a0d16, glow: sprayTex });
    scene.add(water.river, water.spray);
    disposables.push(sprayTex, ...water.disposables);

    const resize = () => { renderer.setSize(innerWidth, innerHeight, false); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); };
    resize(); addEventListener('resize', resize);

    const look = new Vector3();
    let shownK = -1, smoothY = scrollY, last = performance.now(), raf = 0, clock = 0;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      smoothY += (scrollY - smoothY) * (reduced ? 1 : 0.12);
      const vh = innerHeight;
      // Fade the whole stage away as the first section after the canyon arrives.
      const fadeEl = document.getElementById(fadeAt);
      const top = fadeEl ? fadeEl.getBoundingClientRect().top : vh;
      const show = Math.min(1, Math.max(0, (top - vh * 0.3) / (vh * 0.55)));
      stage.style.opacity = String(show);
      if (show <= 0) return;

      // 0 → 1 over the hero and the room after it: the canyon settles into a flat grid seen from above.
      const p = Math.min(1, Math.max(0, smoothY / (vh * 1.35)));
      const k = ease((p - 0.18) / 0.72);
      if (Math.abs(k - shownK) > 0.0005) {
        const flat = 1 - k;
        for (let i = 0; i < count; i++) pos[i * 3 + 1] = base[i] * flat;
        attr.needsUpdate = true; shownK = k;
      }
      lineMat.opacity = lerp(0.34, 0.16, k);
      const fog = scene.fog as Fog;
      fog.near = lerp(30, 200, k); fog.far = lerp(150, 420, k);
      starMat.opacity = 0.8 * (1 - k);
      const camZ = lerp(42, 0, ease(p * 1.2));
      camera.position.set(0, lerp(9, small ? 95 : 70, k), camZ);
      look.set(0, lerp(12, 0, k), lerp(camZ - 40, camZ - 0.01, k));
      camera.lookAt(look);

      // The core drifts up and away as the canyon flattens.
      const away = ease((p - 0.1) / 0.5);
      orbit.position.set(0, CORE.y + away * 26, CORE.z - away * 10);
      orbit.scale.setScalar(small ? 1.44 : 2.19);
      haloMat.opacity = HALO * (1 - away);
      if (!reduced) clock += dt;
      air.update(clock, 1 - away);
      // The water drains away as the canyon flattens; the churning stops as the orb leaves.
      water.update({
        t: clock, orbX: orbit.position.x, orbY: orbit.position.y, orbZ: orbit.position.z,
        flat: 1 - k, stir: 1 - ease(away * 2.5), show: 1 - ease(k * 3), fogNear: fog.near, fogFar: fog.far,
      });
      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('resize', resize);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
    };
  }, [fadeAt]);

  return <div className="cn-stage" ref={stageRef} aria-hidden="true"><canvas ref={canvasRef} /></div>;
}
