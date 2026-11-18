import { useEffect, useRef } from 'react';
import {
  AdditiveBlending, BufferAttribute, BufferGeometry, CanvasTexture, DoubleSide, DynamicDrawUsage, Fog, Group,
  LineSegments, Mesh, ShaderMaterial, MeshBasicMaterial, PerspectiveCamera, Scene, Sprite, SpriteMaterial, SRGBColorSpace, Vector3, WebGLRenderer,
} from 'three';
import { makeAirOrb, lightningNow } from './airOrb';
import { makeSky } from './sky';
import { heightAt } from './landscapes';
import { makeWater } from './water';
import { makeAura } from './aura';
import { T, tuneOn, mountPanel, applyBrand } from './tune';
import { makeClouds3D } from './clouds';
import { makeWords } from './words3d';
import { makeRiverPipe } from './riverPipe';
import { makeStars } from './stars3d';
import { onStableResize, stableHeight } from './viewport';

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
    // Sharpness: at most 1.5× (beyond that the extra pixels are hard to see but costly). If frames come
    // slowly once the scene has settled, step it down (1.5 → 1.2 → 1), so slower devices stay smooth.
    const ratios = [1.5, 1.2, 1].filter((r) => r <= Math.max(1, devicePixelRatio));
    let ratioStep = 0;
    renderer.setPixelRatio(Math.min(devicePixelRatio, ratios[0] ?? 1));
    let slowSince = -1, slowFrames = 0, sampled = 0;
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
    // The land's lines, hidden wherever the river covers the ground (so no grid shows under or over the water).
    lineGeo.setAttribute('aBase', new BufferAttribute(base, 1));
    const lineMat = new ShaderMaterial({
      transparent: true,
      uniforms: { uOpacity: { value: 0.34 }, uFogNear: { value: 30 }, uFogFar: { value: 150 } },
      vertexShader: `attribute float aBase; varying float vWet; varying float vDist;
        void main() { vWet = step(aBase, 4.62 - 0.01 * position.z); vec4 mv = modelViewMatrix * vec4(position, 1.0); vDist = -mv.z; gl_Position = projectionMatrix * mv; }`,
      fragmentShader: `uniform float uOpacity; uniform float uFogNear; uniform float uFogFar; varying float vWet; varying float vDist;
        void main() { if (vWet > 0.5) discard; gl_FragColor = vec4(0.42, 0.78, 0.94, uOpacity * (1.0 - smoothstep(uFogNear, uFogFar, vDist))); }`,
    });
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
    const aura = makeAura(ORB_R);
    orbit.add(halo, aura.group, air.group);
    disposables.push(...aura.disposables, ...air.disposables, haloTex, haloMat);

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

    // A glass pipe along the bottom of the riverbed, with data flowing through it.
    const riverPipe = makeRiverPipe({ heightAt, zFar: -150, zNear: Z0, small });
    scene.add(riverPipe.group);
    disposables.push(...riverPipe.disposables);
    let pipeR = -1;
    // Soft low clouds lying over the land.
    const clouds = makeClouds3D(heightAt, small);
    scene.add(clouds.group);
    disposables.push(...clouds.disposables);
    const stars = makeStars(scene);
    disposables.push(...stars.disposables);

    // Tall phone screens: the scene is framed for wide screens, so on a phone the orb sat low, near the quote,
    // with empty sky above. Slide the picture up by part of the screen height (none on wide screens, ~17% on a
    // tall phone). The word positions are worked out from the same camera, so they follow automatically.
    let liftPx = 0;
    const portraitLift = (W: number, H: number) => Math.min(1, Math.max(0, (H / W - 1.15) / 0.8)) * 0.17 * H;
    const resize = () => {
      const H = stableHeight(); renderer.setSize(innerWidth, H, false); camera.aspect = innerWidth / H;
      liftPx = portraitLift(innerWidth, H);
      if (liftPx > 0) camera.setViewOffset(innerWidth, H, 0, liftPx, innerWidth, H); else camera.clearViewOffset();
      camera.updateProjectionMatrix();
    };
    resize(); const stopResize = onStableResize(resize);

    const look = new Vector3();
    // For keeping the name, frame and quote lined up with the orb while it moves.
    const restCam = new PerspectiveCamera(58, 1, 0.1, 500), restLook = new Vector3(0, 12, 2), pv = new Vector3();
    const topEl = (document.querySelector('.cn-top') as HTMLElement | null) ?? document.documentElement;
    let lastAlign = '';
    const onScreen = (cam: PerspectiveCamera, at: Vector3, r: number) => {
      pv.copy(at).project(cam);
      const d = cam.position.distanceTo(at);
      const H = stableHeight();
      return [((1 - pv.y) / 2) * H, (r / (d * Math.tan((cam.fov * Math.PI) / 360))) * (H / 2)];
    };
    let shownK = -1, smoothY = scrollY, last = performance.now(), raf = 0, clock = 0;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const raw = now - last;
      const dt = Math.min(0.05, raw / 1000); last = now;
      // Quality check: after a short settle, look at 90 frames; if most took over 22 ms, step down once
      // and look again. Hidden tabs and the first frames after a scroll jump are ignored.
      if (!document.hidden && raw < 250 && ratioStep < ratios.length - 1) {
        if (slowSince < 0) slowSince = now;
        if (now - slowSince > 1500) {
          sampled++; if (raw > 22) slowFrames++;
          if (sampled >= 90) {
            if (slowFrames > 60) { ratioStep++; renderer.setPixelRatio(Math.min(devicePixelRatio, ratios[ratioStep])); resize(); slowSince = now; }
            else ratioStep = ratios.length; // fast enough: stop checking
            sampled = 0; slowFrames = 0;
          }
        }
      }
      smoothY += (scrollY - smoothY) * (reduced ? 1 : 0.12);
      const vh = stableHeight();
      // Fade the whole stage away as the first section after the canyon arrives.
      const fadeEl = document.getElementById(fadeAt);
      const top = fadeEl ? fadeEl.getBoundingClientRect().top : vh;
      const show = Math.min(1, Math.max(0, (top - vh * 0.3) / (vh * 0.55)));
      stage.style.opacity = String(show);
      if (show <= 0) { document.documentElement.style.setProperty('--pipe-join', '1'); topEl.style.setProperty('--cn-fade', '0'); topEl.style.setProperty('--cn-pe', 'none'); lastAlign = ''; return; }

      // 0 → 1 over the hero and the room after it: the canyon settles into a flat grid seen from above.
      const p = Math.min(1, Math.max(0, smoothY / (vh * 1.35)));
      const k = ease((p - 0.18) / 0.72);
      if (Math.abs(k - shownK) > 0.0005) {
        const flat = 1 - k;
        for (let i = 0; i < count; i++) pos[i * 3 + 1] = base[i] * flat;
        attr.needsUpdate = true; shownK = k;
      }
      lineMat.uniforms.uOpacity.value = lerp(0.34, 0.16, k) * T.gridLines;
      water.setLook(T); riverPipe.setLook(T);
      if (T.pipeRadius !== pipeR) { pipeR = T.pipeRadius; riverPipe.rebuild(0.6 * pipeR); }
      applyBrand();
      if (camera.fov !== T.fov) { camera.fov = T.fov; camera.updateProjectionMatrix(); }
      const fog = scene.fog as Fog;
      fog.near = lerp(30, 200, k) * T.fogNear; fog.far = Math.max(fog.near + 1, lerp(150, 420, k) * T.fogFar);
      lineMat.uniforms.uFogNear.value = fog.near; lineMat.uniforms.uFogFar.value = fog.far;
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
      // Where the orb is on screen now, and where it sits before any scrolling. The name and frame follow
      // it exactly; the quote and the scroll hint move by the same amount as the orb's lower edge.
      camera.updateMatrixWorld();
      const R = ORB_R * orbit.scale.x, FRAME = 1.22;
      const [oy, orR] = onScreen(camera, orbit.position, R);
      restCam.fov = camera.fov; restCam.aspect = camera.aspect;
      if (liftPx > 0) { const H = stableHeight(); restCam.setViewOffset(innerWidth, H, 0, liftPx, innerWidth, H); } else restCam.clearViewOffset();
      restCam.updateProjectionMatrix();
      restCam.position.set(0, 9, 42); restCam.lookAt(restLook); restCam.updateMatrixWorld();
      pv.set(0, CORE.y + T.orbHeight, CORE.z);
      const [oy0, or0] = onScreen(restCam, pv.clone(), R);
      // The name, frame, quote and hint fade out early, well before the orb has gone.
      const fadeOut = 1 - ease((p - 0.06) / 0.22);
      // These words sit in a fixed layer (.cn-follow), so they use screen positions straight from the
      // orb: nothing here waits on the page's own scrolling, so they move exactly with it.
      const align = `${fadeOut.toFixed(3)}|${oy.toFixed(2)}|${(orR * FRAME).toFixed(2)}|${(oy + orR * FRAME - (oy0 + or0 * FRAME)).toFixed(2)}`;
      if (align !== lastAlign) {
        lastAlign = align;
        const [f, a, b, c] = align.split('|');
        topEl.style.setProperty('--cn-fade', f);
        topEl.style.setProperty('--cn-pe', Number(f) > 0.3 ? 'auto' : 'none'); // the quote button only takes taps while it can be seen
        topEl.style.setProperty('--cn-oy', `${a}px`); topEl.style.setProperty('--cn-or', `${b}px`); topEl.style.setProperty('--cn-dy', `${c}px`);
      }
      if (!reduced) { clock += dt; spinClock += dt * T.orbSpin; }
      // Lightning is timed here, so the ball, its glow, the water and the land can all flash together.
      const bolt = lightningNow(clock, T.orbSparkRate);
      const flash = bolt.flash * T.orbFlashLight * Math.min(T.orbSparks, 1.5) * (1 - away);
      air.update(clock, 1 - away, spinClock, {
        bands: T.orbStreaks, zap: T.orbSparks, zapRate: T.orbSparkRate, style: T.orbStyle, hue: T.orbHue, flow: T.orbFlow,
        gate: bolt.gate, flash: flash * 0.6, depth: T.orbDepth, glass: T.orbGlass, fringe: T.orbFringe, cam: camera.position,
      });
      aura.update(clock, 1 - away, { bloom: T.orbBloom, rays: T.orbRays, sparks: T.orbParticles, flash, pxScale: canvas.height / (2 * Math.tan((camera.fov * Math.PI) / 360)) });
      haloMat.opacity *= 1 + flash;
      lineMat.uniforms.uOpacity.value *= 1 + 0.9 * flash;
      // The river stays as the canyon flattens: seen from above it runs down the middle of the screen
      // into the first pipe on the page. The churning stops as the orb leaves.
      // The box behind the quote, in canvas pixels, so the water can go calm exactly there.
      const calm: [number, number, number, number, number, number] = [0, 0, 0, 0, 0, 0];
      const quoteEl = T.qbCalm > 0 && T.quoteOn && fadeOut > 0.01 ? document.querySelector<HTMLElement>('.cn-quote') : null;
      if (quoteEl) {
        const qr = quoteEl.getBoundingClientRect(), cr = canvas.getBoundingClientRect(), sc = canvas.width / Math.max(cr.width, 1);
        calm[0] = (qr.left - T.qbPadX - cr.left) * sc; calm[2] = (qr.right + T.qbPadX - cr.left) * sc;
        calm[1] = (cr.bottom - qr.bottom - T.qbPadY) * sc; calm[3] = (cr.bottom - qr.top + T.qbPadY) * sc;
        calm[4] = T.qbCalm * fadeOut; calm[5] = T.qbFade / 100;
      }
      water.update({
        t: clock, orbX: orbit.position.x, orbY: orbit.position.y, orbZ: orbit.position.z,
        flat: 1 - k, stir: 1 - ease(away * 2.5), show: 1, fogNear: fog.near, fogFar: fog.far, calm,
        mirror: [T.orbMirror * (1 - away), R, spinClock, flash], flash: flash * 0.8,
      });
      // The join: once the land is almost flat, the riverbed pipe narrows to exactly the page pipe's width
      // on screen (3.5 px) and takes on its look; the page then draws its own pipe on top from the same spot.
      const join = ease((k - 0.75) / 0.25);
      const dist = camera.position.y - 0.15;
      const pxWorld = (2 * dist * Math.tan((camera.fov * Math.PI) / 360)) / vh;
      riverPipe.update(clock, 1 - k, orbit.position, 1, join, (1.75 * pxWorld) / (0.6 * T.pipeRadius));
      document.documentElement.style.setProperty('--pipe-join', String(join));
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
      clouds.update(clock, camera, 1 - k, show, orbit.position);
      stars.update(now, camera, T, k < 0.3);
      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      unmountPanel?.();
      stopResize();
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
    };
  }, [fadeAt]);

  return <div className="cn-stage" ref={stageRef} aria-hidden="true"><canvas ref={canvasRef} /></div>;
}
