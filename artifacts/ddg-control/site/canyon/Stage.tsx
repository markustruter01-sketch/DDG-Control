import { useEffect, useRef } from 'react';
import {
  AdditiveBlending, BufferAttribute, BufferGeometry, CanvasTexture, DoubleSide, DynamicDrawUsage, Fog, Group,
  LineBasicMaterial, LineSegments, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, Sprite, SpriteMaterial, SRGBColorSpace, Vector3, WebGLRenderer,
} from 'three';
import { makeAirOrb } from './airOrb';
import { makeSky } from './sky';
import { heightAt } from './landscapes';
import { makeWater } from './water';
import { T, tuneOn, mountPanel, applyBrand } from './tune';
import { makeWords } from './words3d';

/**
 * Home background (fixed): a night sky with the Milky Way over a landscape of ice-blue lines (see landscapes.ts for its shape) with the DDG core, a fast-spinning
 * ball of air, floating just above a river that runs down the canyon floor towards the viewer.
 * The air ball churns the water beneath it, turning the same way it spins. Scrolling flattens
 * the canyon into a grid seen from above, then the whole stage fades out as the
 * "Built in Brisbane" section (#work) arrives.
 * Loaded lazily, so the page text never waits for it.
 */

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));

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
    const land = new Mesh(surfGeo, surfMat);
    scene.add(land, new LineSegments(lineGeo, lineMat));
    disposables.push(surfGeo, lineGeo, surfMat, lineMat);

    // The night sky: stars and the Milky Way. The river mirrors the same sky.
    const sky = makeSky(0x0a0d16);
    scene.add(sky.dome);
    disposables.push(...sky.disposables);

    // The DDG core: a ball of spinning air floating just above the river, with a soft glow round it.
    const CORE = new Vector3(0, 9.5, 9), ORB_R = 1.7, HALO = 0.45;
    const orbit = new Group(); orbit.position.copy(CORE); scene.add(orbit);
    const air = makeAirOrb(ORB_R);
    const haloTex = glowTexture('170,225,255');
    const haloMat = new SpriteMaterial({ map: haloTex, blending: AdditiveBlending, depthWrite: false, transparent: true, opacity: HALO });
    const halo = new Sprite(haloMat); halo.scale.set(10, 10, 1);
    halo.renderOrder = 4; // after the river (1) and before the ball (5), so the ball sits in front of the water
    orbit.add(halo, air.group);
    disposables.push(...air.disposables, haloTex, haloMat);

    // The river on the canyon floor and the splashes the orb throws up from it.
    const water = makeWater({ small, grid: { NX, NZ, W, D, Z0, base }, heightAt, fogColor: 0x0a0d16 });
    scene.add(water.river, water.spray);
    disposables.push(...water.disposables);

    // Settings live in tune.ts; in the preview a panel of sliders changes them live.
    const unmountPanel = tuneOn() ? mountPanel() : null;

    // "We build it all." standing on the water in front of the orb.
    const words = makeWords();
    scene.add(words.group);
    disposables.push(...words.disposables);
    let spinClock = 0;

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
      lineMat.opacity = lerp(0.34, 0.16, k) * T.gridLines;
      water.setLook(T);
      applyBrand();
      if (camera.fov !== T.fov) { camera.fov = T.fov; camera.updateProjectionMatrix(); }
      const fog = scene.fog as Fog;
      fog.near = lerp(30, 200, k) * T.fogNear; fog.far = Math.max(fog.near + 1, lerp(150, 420, k) * T.fogFar);
      const camZ = lerp(42, 0, ease(p * 1.2));
      camera.position.set(0, lerp(9, small ? 95 : 70, k), camZ);
      look.set(0, lerp(12, 0, k), lerp(camZ - 40, camZ - 0.01, k));
      camera.lookAt(look);
      sky.update(camera.position, 1 - k);

      // The core drifts up and away as the canyon flattens.
      const away = ease((p - 0.1) / 0.5);
      orbit.position.set(0, CORE.y + T.orbHeight + away * 26, CORE.z - away * 10);
      orbit.scale.setScalar((small ? 1.44 : 2.19) * T.orbSize);
      haloMat.opacity = HALO * T.orbGlow * (1 - away);
      if (!reduced) { clock += dt; spinClock += dt * T.orbSpin; }
      air.update(clock, 1 - away, spinClock, { bands: T.orbStreaks, zap: T.orbSparks, zapRate: T.orbSparkRate });
      // The river stays as the canyon flattens: seen from above it runs down the middle of the screen
      // into the first pipe on the page. The churning stops as the orb leaves.
      water.update({
        t: clock, orbX: orbit.position.x, orbY: orbit.position.y, orbZ: orbit.position.z,
        flat: 1 - k, stir: 1 - ease(away * 2.5), show: 1, fogNear: fog.near, fogFar: fog.far,
      });
      // The words face the screen, then sink into the river and fade as the visitor scrolls.
      const wordsOut = ease(p / T.wordsFade);
      if (T.wordsOn > 0.5) words.setFont(T.wordsFont);
      words.group.visible = T.wordsOn > 0.5 && words.ready() && wordsOut < 0.99;
      const wz = T.wordsZ;
      words.group.position.set(T.wordsX, ((4.25 - 0.01 * wz) + T.wordsY) * (1 - k) - wordsOut * 2.2, wz);
      words.group.quaternion.copy(camera.quaternion);
      words.group.scale.set(T.wordsSize * (small ? 0.72 : 1), T.wordsSize * (small ? 0.72 : 1), T.wordsSize * T.wordsDepth);
      words.mat.uniforms.uOpacity.value = 1 - wordsOut;
      words.mat.uniforms.uBright.value = T.wordsBright; words.refl.uniforms.uBright.value = T.wordsBright;
      words.refl.uniforms.uOpacity.value = T.wordsReflect * (1 - wordsOut);
      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      unmountPanel?.();
      removeEventListener('resize', resize);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
    };
  }, [fadeAt]);

  return <div className="cn-stage" ref={stageRef} aria-hidden="true"><canvas ref={canvasRef} /><ShootingStars /></div>;
}

/** Now and then a shooting star crosses the upper sky: a random one every 5 to 8 seconds. */
function ShootingStars() {
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = box.current;
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let timer = 0;
    const next = () => { timer = window.setTimeout(fire, 5000 + Math.random() * 3000); };
    const fire = () => {
      if (T.starsOn > 0.5 && !document.hidden && scrollY < innerHeight * 0.6) {
        const s = document.createElement('i');
        const right = Math.random() < 0.5, ang = (right ? 1 : -1) * (14 + Math.random() * 22); // degrees below level
        const len = 260 + Math.random() * 260;
        s.className = 'cn-star';
        s.style.cssText = `left:${right ? 5 + Math.random() * 50 : 45 + Math.random() * 50}%;top:${4 + Math.random() * 26}%;` +
          `--a:${right ? ang : 180 + ang}deg;--d:${len}px;--t:${0.7 + Math.random() * 0.5}s`;
        el.appendChild(s);
        setTimeout(() => s.remove(), 1600);
      }
      next();
    };
    next();
    return () => clearTimeout(timer);
  }, []);
  return <div className="cn-sky" ref={box} />;
}
