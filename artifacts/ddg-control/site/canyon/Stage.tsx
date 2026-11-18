import { useEffect, useRef } from 'react';
import {
  AdditiveBlending, BufferAttribute, BufferGeometry, CanvasTexture, DoubleSide, DynamicDrawUsage, Fog, Group,
  LineSegments, Mesh, ShaderMaterial, MeshBasicMaterial, PerspectiveCamera, Scene, Sprite, SpriteMaterial, SRGBColorSpace, Vector3, Vector4, WebGLRenderer,
} from 'three';
import { makeAirOrb, lightningNow } from './airOrb';
import { makeSky } from './sky';
import { heightAt } from './landscapes';
import { makeWater } from './water';
import { makeAura } from './aura';
import { makeSurge } from './surge';
import { makeCharge } from './charge';
import { makeDial } from './dial';
import { makeSpawnFx, spawnLook } from './spawn';
import { introStart, revealPage } from '../intro';
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
      uniforms: { uOpacity: { value: 0.34 }, uFogNear: { value: 30 }, uFogFar: { value: 150 }, uBolt: { value: new Vector4(0, 0, 0, 1) } },
      vertexShader: `attribute float aBase; varying float vWet; varying float vDist; varying vec2 vXZ;
        void main() { vXZ = position.xz; vWet = step(aBase, 4.62 - 0.01 * position.z); vec4 mv = modelViewMatrix * vec4(position, 1.0); vDist = -mv.z; gl_Position = projectionMatrix * mv; }`,
      // uBolt: where the orb is (x, z), how bright the lightning is right now, and how far its light reaches over the land.
      fragmentShader: `uniform float uOpacity; uniform float uFogNear; uniform float uFogFar; uniform vec4 uBolt; varying float vWet; varying float vDist; varying vec2 vXZ;
        void main() { if (vWet > 0.5) discard;
          float lit = uBolt.z * exp(-distance(vXZ, uBolt.xy) / uBolt.w);
          gl_FragColor = vec4(mix(vec3(0.42, 0.78, 0.94), vec3(0.85, 0.95, 1.0), clamp(lit, 0.0, 1.0) * 0.7), min(uOpacity * (1.0 + 3.0 * lit), 1.0) * (1.0 - smoothstep(uFogNear, uFogFar, vDist))); }`,
    });
    const land = new Mesh(surfGeo, surfMat);
    const landLines = new LineSegments(lineGeo, lineMat);
    scene.add(land, landLines);
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

    // Press and hold the orb: lightning to the water and land, and the nova (surge.ts).
    const surge = makeSurge();
    scene.add(surge.group);
    disposables.push(...surge.disposables);
    /** A big bolt from just above the top edge of the screen (a little in front of the camera) onto the top of the orb. */
    const strikeFromSky = (power: number, R: number) => {
      const top = new Vector3((Math.random() - 0.5) * 0.4, 1.25, 0.5).unproject(camera).sub(camera.position).normalize()
        .multiplyScalar(camera.position.distanceTo(orbit.position) * 0.35).add(camera.position);
      surge.skyStrike(top, new Vector3(orbit.position.x, orbit.position.y + R, orbit.position.z), power);
    };
    // The orb's load-in looks (spawn.ts): the portal, the spark, the motes.
    const spawnFx = makeSpawnFx();
    scene.add(spawnFx.group);
    disposables.push(...spawnFx.disposables);
    let spawnPrev = 0, introWaveT = -1, introWave = 0;
    const introWaveAt = new Vector3();
    const ISO_POS = new Vector3(), ISO_LOOK = new Vector3(), strikeAt = new Vector3();
    const chargeFx = makeCharge();
    scene.add(chargeFx.group);
    disposables.push(...chargeFx.disposables);
    // Rings on the water: drops landing, and one big ring when the orb is let go. [x, z, age 0..1, size]
    const pops: [number, number, number, number][] = [];
    let popNext = 0, wasHeld = false, shock = 0, novaT = -1, novaLock = false;
    // After the nova the river level drops (water thrown out) and fills up again over T.holdRefill seconds.
    let drainY = 0;
    const novaAt = new Vector3(); // where the nova went off (x, z in x, y)
    const lvl = (z: number) => water.levelAt(z) - drainY;
    // The build-up dial: part of the 3D scene, fixed to the orb's centre and facing the camera (dial.ts).
    const dial = makeDial();
    orbit.add(dial.mesh);
    disposables.push(...dial.disposables);
    const addPop = (x: number, z: number, size: number) => { pops[popNext] = [x, z, 0.001, size]; popNext = (popNext + 1) % 8; };

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
    // The name's web font can arrive after the first frame and change its height: measure again then.
    document.fonts?.ready.then(() => { lastAlign = ''; }).catch(() => {});
    const onScreen = (cam: PerspectiveCamera, at: Vector3, r: number) => {
      pv.copy(at).project(cam);
      const d = cam.position.distanceTo(at);
      const H = stableHeight();
      return [((1 - pv.y) / 2) * H, (r / (d * Math.tan((cam.fov * Math.PI) / 360))) * (H / 2)];
    };
    let shownK = -1, smoothY = scrollY, last = performance.now(), raf = 0, clock = 0;
    // Holding the orb: a press that starts on the orb, held until it is let go (or the browser cancels it for a scroll).
    let charge = 0, camHold = 0, skyTurn = 0, fly = 0, flyOn = false;
    const flyDir = new Vector3();
    const hold = { down: false, id: -1, x: 0, y: 0 };
    // The orb can be pressed until the page has scrolled this far (as a part of the scroll that flattens the
    // land). It was 0.06, about 70 px: a small scroll left the orb looking the same but dead to a press.
    const HOLD_REACH = 0.25;
    // Preview only (the settings panel is on): one line of facts at the bottom left, so a problem with the hold
    // can be read off the screen and not guessed at.
    const statusEl = tuneOn() ? document.createElement('div') : null;
    if (statusEl) {
      statusEl.style.cssText = 'position:fixed;left:10px;bottom:8px;z-index:2147482000;font:11px/1.4 ui-monospace,Menlo,monospace;color:#9fd8ff;background:rgba(0,0,0,.6);padding:3px 8px;border-radius:6px;pointer-events:none';
      document.body.appendChild(statusEl);
    }
    let lastPress = 'none yet', statusAt = 0, fps = 0;
    const orbOnScreen = { x: 0, y: 0, r: 0 };
    const heroEl = document.querySelector<HTMLElement>('.cn-hero');
    const onOrb = (x: number, y: number) => T.holdOn > 0.5 && orbOnScreen.r > 0 && (x - orbOnScreen.x) ** 2 + (y - orbOnScreen.y) ** 2 <= (orbOnScreen.r * 1.05) ** 2;
    const onDown = (e: PointerEvent) => {
      if (e.button > 0 || !onOrb(e.clientX, e.clientY)) { lastPress = e.button > 0 ? 'not the main button' : orbOnScreen.r > 0 ? 'missed the orb' : 'orb not ready'; return; }
      if ((e.target as Element | null)?.closest?.('a,button,input,textarea,select,label,.tune')) { lastPress = 'on a button or the panel'; return; }
      lastPress = 'on the orb';
      hold.down = true; hold.id = e.pointerId; hold.x = e.clientX; hold.y = e.clientY;
      // The page may be scrolled a little (a nudge of the wheel, or the browser putting the old scroll place back
      // after a reload). The press then brings the page back to the top, and the scene glides there by itself.
      if (scrollY > 0) scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    };
    const onMove = (e: PointerEvent) => {
      // Moving the mouse while holding keeps the charge going. On a phone, a finger that starts scrolling the page
      // makes the browser cancel the press (pointercancel), which ends the hold, so scrolling still works.
      if (e.pointerType === 'mouse' && heroEl) heroEl.style.cursor = onOrb(e.clientX, e.clientY) ? 'pointer' : '';
    };
    // After the nova the orb needs a fresh press: letting go unlocks it.
    const onUp = (e: PointerEvent) => { if (e.pointerId === hold.id) { if (hold.down && e.type === 'pointercancel') lastPress = 'cancelled by the browser'; hold.down = false; novaLock = false; } };
    const noMenu = (e: Event) => { if (hold.down) e.preventDefault(); };
    addEventListener('pointerdown', onDown, true);
    addEventListener('pointermove', onMove, { passive: true });
    addEventListener('pointerup', onUp);
    addEventListener('pointercancel', onUp);
    addEventListener('contextmenu', noMenu);
    document.addEventListener('selectstart', noMenu);
    // The load-in: wait for the fonts and a few drawn frames (so every word has found its place), then fade
    // the black cover away; the orb spawns after that (introStart).
    let fontsIn = false, framesDrawn = 0;
    Promise.race([document.fonts?.ready ?? Promise.resolve(), new Promise((r) => setTimeout(r, 2500))]).then(() => { fontsIn = true; });
    const followEl = topEl.querySelector<HTMLElement>('.cn-follow');

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const raw = now - last;
      // Never negative: the first frame's time stamp can be earlier than the clock read at set-up, and a negative
      // step used to give the orb a little charge by itself at load (words flying off, dark edges).
      const dt = Math.min(0.05, Math.max(0, raw / 1000)); last = now;
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
      if (raw > 0 && raw < 1000) fps += (1000 / raw - fps) * 0.1;
      smoothY += (scrollY - smoothY) * (reduced ? 1 : 0.12);
      const vh = stableHeight();
      // Fade the whole stage away as the first section after the canyon arrives.
      const fadeEl = document.getElementById(fadeAt);
      const top = fadeEl ? fadeEl.getBoundingClientRect().top : vh;
      const show = Math.min(1, Math.max(0, (top - vh * 0.3) / (vh * 0.55)));
      stage.style.opacity = String(show);
      if (show <= 0 && fontsIn) revealPage(T.introFade * 1000); // opened part-way down the page: nothing 3D to wait for
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
      // Holding the orb builds its charge slowly over T.holdBuild seconds (about 10): more and more violent.
      // At the top it goes nova (a blast of light, a shock front, every bolt at once), then everything calms
      // down over T.holdCalm seconds. A fresh press starts it again. The camera moves back and up over 2 s,
      // looking down on the river with the sky still in view, while the sky turns as if time ran faster.
      // Scrolling away while holding ends the hold (the real scroll place, not the smoothed one: a press on a
      // slightly scrolled page jumps to the top first, and the smoothed value is still catching up).
      if (hold.down && (scrollY > vh * 0.1 || T.holdOn < 0.5)) hold.down = false;
      const building = hold.down && !novaLock;
      charge = building ? Math.min(1, charge + dt / Math.max(1, T.holdBuild)) : Math.max(0, charge - dt / (novaT >= 0 ? Math.max(0.5, T.holdCalm) : 1.2));
      let novaNow = false;
      if (building && charge >= 1) { novaNow = true; novaLock = true; hold.down = false; novaT = 0; shock = 1.6; }
      if (novaT >= 0) { novaT += dt; if (novaT > Math.max(4, T.holdCalm + 1)) novaT = -1; }
      camHold = building ? Math.min(1, camHold + dt / 2) : Math.max(0, camHold - dt / (novaT >= 0 ? Math.max(1, T.holdCalm) : 1.6));
      const ch = Math.pow(charge, 1.4), cv = ease(camHold) * T.holdZoom;
      // After the blast every charge-up effect stops at once (Markus, 18 Nov): what is in the air falls back,
      // nothing new appears, and only the camera, sky, glow and orb settle back over the calm-down time.
      const fxCh = novaT >= 0 ? 0 : ch;
      // While it charges (and until it has calmed) the words and logos fly off the screen: the page ones by a
      // class (site.css, 0.3 s), the 3D "We build it all." here, sliding off to the left at the same pace.
      const flyWant = T.holdFlyOff > 0.5 && (hold.down || novaT >= 0 || charge > 0.02);
      if (flyWant !== flyOn) { flyOn = flyWant; topEl.classList.toggle('cn-fly', flyOn); }
      fly = flyOn ? Math.min(1, fly + dt / 0.3) : Math.max(0, fly - dt / 0.7);
      skyTurn += dt * ease(camHold) * 0.35 * T.holdSky * (1 + 2 * ch); // spins up to 3x faster at full charge
      const camZ = lerp(42, 0, ease(p * 1.2));
      camera.position.set(0, lerp(9, small ? 95 : 70, k), camZ);
      look.set(0, lerp(12, 0, k), lerp(camZ - 40, camZ - 0.01, k));
      // Where the camera goes while the orb is held: up, back, and tipped to look down (all sliders).
      ISO_POS.set(0, 9 + T.holdCamUp, 42 + T.holdCamBack);
      ISO_LOOK.set(0, 12 - 9 * T.holdCamTilt, 2 + 4 * T.holdCamTilt);
      if (cv > 0) { camera.position.lerp(ISO_POS, cv); look.lerp(ISO_LOOK, cv); }
      // Screen shake while charging, and a short jolt when it is let go.
      camera.lookAt(look);
      // Screen shake: the 3D picture itself is moved a few pixels (the words on the page are not), growing
      // with the charge, plus a hard jolt at the nova.
      const jolt = reduced ? 0 : T.holdScreenShake * ch * ch * 7 + shock * T.holdShock * 12;
      const shakeCss = jolt > 0.05 ? `translate(${((Math.random() - 0.5) * jolt).toFixed(1)}px, ${((Math.random() - 0.5) * jolt).toFixed(1)}px)` : '';
      if (canvas.style.transform !== shakeCss) canvas.style.transform = shakeCss;
      // The ground trembles.
      const tremble = reduced ? 0 : (T.holdGroundShake * ease(charge) + shock * T.holdShock * 0.6) * 0.12 * Math.sin(clock * 47) * Math.sin(clock * 31 + 1);
      land.position.y = tremble; landLines.position.y = tremble;
      sky.update(camera.position, 1 - k, skyTurn);

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
      orbOnScreen.x = innerWidth / 2; orbOnScreen.y = oy; orbOnScreen.r = p < HOLD_REACH ? orR : 0;
      // Charging: the orb lifts a little and trembles. Applied after the words have found their places, so the
      // name and quote stay still while the orb shakes.
      if (ch > 0) {
        orbit.position.y += T.holdRise * ch;
        if (!reduced) { const sh = 0.14 * T.holdOrbShake * fxCh * (0.4 + fxCh) * (1 + fxCh * fxCh); /* twice as hard at full charge */ orbit.position.x += (Math.random() - 0.5) * sh; orbit.position.y += (Math.random() - 0.5) * sh * 0.5; orbit.position.z += (Math.random() - 0.5) * sh; }
      }
      // The dial round the orb: 0 to 100% of the build-up, thin lines, like a speedometer.
      dial.update(charge, hold.down ? 1 : 0, ORB_R);
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
        // On shorter screens the "Scroll" hint could sit on top of the company name. At rest (not scrolled),
        // push it down just enough to clear the name. Measured only at rest, so scrolling stays cheap.
        if (Math.abs(Number(c)) < 0.5) {
          const brandEl = topEl.querySelector<HTMLElement>('.cn-brand'), hintEl = topEl.querySelector<HTMLElement>('.cn-scroll');
          if (brandEl && hintEl && hintEl.offsetParent) {
            const pushNow = parseFloat(topEl.style.getPropertyValue('--sh-push')) || 0;
            const need = Math.max(0, Math.ceil(brandEl.getBoundingClientRect().bottom + 12 - (hintEl.getBoundingClientRect().top - pushNow)));
            if (need !== pushNow) topEl.style.setProperty('--sh-push', `${need}px`);
          }
        }
      }
      if (!reduced) { clock += dt; spinClock += dt * T.orbSpin; }
      // The orb's spawn, over T.introSpawn seconds once the cover has faded: a point of light, the ball
      // swelling out of it (a little past full size, then settling), a bright pulse, then the words.
      const t0 = introStart();
      const spawn = reduced || T.introSpawn <= 0 ? (t0 === null ? 0 : 1) : t0 === null ? 0 : Math.min(1, Math.max(0, (now - t0) / (T.introSpawn * 1000)));
      const arrive = spawnLook(T.introStyle, spawn, R);
      let born: number;
      if (arrive.classic) {
        const seed = ease(spawn / 0.22);
        const swell = spawn <= 0.15 ? 0 : Math.min(1, (spawn - 0.15) / 0.6);
        const body = swell >= 1 ? 1 : 1 + 2.2 * Math.pow(swell - 1, 3) + 1.2 * Math.pow(swell - 1, 2); // ease out, slightly past 1
        const pulse = Math.exp(-Math.pow((spawn - 0.78) / 0.07, 2));
        born = Math.max(0.001, body);
        orbit.scale.multiplyScalar(born);
        haloMat.opacity = Math.max(haloMat.opacity, (seed * (1 - swell) * 0.95 + pulse * 0.6) * (1 - away));
        halo.scale.setScalar(10 * (0.35 + 0.65 * seed) * (1 + pulse * 0.5));
      } else {
        born = Math.max(0.001, arrive.scale);
        orbit.scale.multiplyScalar(born);
        orbit.position.y -= arrive.lift;
        haloMat.opacity = Math.max(haloMat.opacity * Math.min(1, arrive.scale), arrive.halo * (1 - away));
        halo.scale.setScalar(10 * arrive.haloSize);
      }
      // One-off moments of the load-in: the push on the water and the strike from the sky.
      const passed = (at: number) => at >= 0 && spawnPrev < at && spawn >= at;
      if (spawn < spawnPrev) introWaveT = -1; // replayed
      if (passed(arrive.waveAt)) { introWaveT = 0; introWave = arrive.wave; introWaveAt.set(orbit.position.x, orbit.position.z, 0); }
      if (passed(arrive.strikeAt)) strikeFromSky(1, R);
      spawnPrev = spawn;
      if (introWaveT >= 0) { introWaveT += dt; if (introWaveT > 4) introWaveT = -1; }
      spawnFx.update(T.introStyle, spawn, clock, orbit.position, R, camera, canvas.height / (2 * Math.tan((camera.fov * Math.PI) / 360)));
      if (followEl) followEl.style.opacity = String(Math.min(1, Math.max(0, (spawn - 0.7) / 0.3)) * (1 - ease(camHold)));
      haloMat.opacity += 0.5 * ch * (1 - away);
      // Lightning is timed here, so the ball, its glow, the water and the land can all flash together.
      const bolt = lightningNow(clock, T.orbSparkRate);
      const flash = bolt.flash * T.orbFlashLight * Math.min(T.orbSparks, 1.5) * (1 - away);
      air.update(clock, 1 - away, spinClock, {
        bands: T.orbStreaks, zap: T.orbSparks * (1 + ch), zapRate: T.orbSparkRate * (1 + 3 * ch), style: T.orbStyle, hue: T.orbHue, flow: T.orbFlow,
        gate: bolt.gate, flash: flash * 0.6, depth: T.orbDepth, glass: T.orbGlass, fringe: T.orbFringe, cam: camera.position,
      });
      aura.update(clock, (1 - away) * born, { bloom: T.orbBloom + ch, rays: T.orbRays, sparks: T.orbParticles, flash, pxScale: canvas.height / (2 * Math.tan((camera.fov * Math.PI) / 360)) });
      haloMat.opacity *= 1 + flash;
      const landFlash = bolt.flash * T.orbFlashLand * (1 - away);
      lineMat.uniforms.uBolt.value.set(orbit.position.x, orbit.position.z, landFlash, T.orbFlashReach);
      // The surge: bolts to the water and land. A strike lights the land where it lands.
      const waterY = lvl(orbit.position.z);
      const strike = surge.update(clock, dt, fxCh * (1 - away), orbit.position, R, waterY, { bolts: T.holdBolts }, () => {
        const a = Math.random() * Math.PI * 2;
        if (Math.random() < 0.6) {
          const r = R * (1.3 + 1.9 * Math.random());
          return strikeAt.set(orbit.position.x + Math.cos(a) * r, waterY, orbit.position.z + Math.sin(a) * r * 0.7);
        }
        const x = (Math.random() < 0.5 ? -1 : 1) * (14 + 24 * Math.random()), z = orbit.position.z - 25 + 35 * Math.random();
        return strikeAt.set(x, heightAt(x, z) * (1 - k), z);
      });
      if (strike.at && strike.flash * T.holdBolts * 1.5 > landFlash) lineMat.uniforms.uBolt.value.set(strike.at.x, strike.at.z, strike.flash * T.holdBolts * 1.5, 14);
      // Letting go after a good charge sends a ring of light out across the water and jolts the scene.
      if (wasHeld && !hold.down && !novaNow && charge > 0.5 && T.holdShock > 0) shock = 1;
      // The nova: a shell of light races out, every bolt fires, a huge ring runs across the water.
      if (novaNow && T.holdNova > 0) {
        surge.burstAll(orbit.position, R, () => {
          const a = Math.random() * Math.PI * 2, r = R * (1.5 + 4 * Math.random());
          return strikeAt.set(orbit.position.x + Math.cos(a) * r, lvl(orbit.position.z), orbit.position.z + Math.sin(a) * r * 0.7);
        });
      }
      if (novaNow && T.holdSkyStrike > 0) strikeFromSky(T.holdSkyStrike, R);
      surge.novaAt(novaT, orbit.position, R, T.holdNova);
      if (novaT >= 0) haloMat.opacity += Math.exp(-novaT * 3) * 2.5 * T.holdNova;
      wasHeld = hold.down;
      shock = Math.max(0, shock - dt * 2.5);
      haloMat.opacity += shock * 0.8 * T.holdShock;
      // The lake boils: strength follows the charge.
      const boil = Math.max(0, (fxCh - 0.1) / 0.9) * T.holdBoil * (1 - away);
      const px = canvas.height / (2 * Math.tan((camera.fov * Math.PI) / 360));
      // What swirls round the orb as it charges (charge.ts).
      if (novaNow) {
        chargeFx.explode(orbit.position, T.holdNova);
        // The only water effect of the blast is its push on the river (novaWave in water.ts).
        novaAt.set(orbit.position.x, orbit.position.z, 0);
      }
      chargeFx.update(dt, fxCh * (1 - away), orbit.position, R, { // (No vortex round the orb: removed, Markus 18 Nov. charge.ts still has the code for it, switched off here.)
          on: [T.holdFxGlobs > 0.5, false, T.holdFxGround > 0.5], amount: T.holdFxAmount, speed: T.holdFxSpeed,
          vortex: { look: 0, size: 1, reach: 1, trail: 0, glow: 0 } },
        (x, z) => Math.max(lvl(z), heightAt(x, z) * (1 - k)),
        (x, z) => { const y = lvl(z); return Math.abs(x) < 40 && z < 55 && y - heightAt(x, z) > 0.3 ? y : null; },
        () => {}, px, skyTurn); // no splash rings: the nova's push is the only water effect
      for (const pp of pops) if (pp && pp[2] > 0) { pp[2] += dt / (pp[3] > 2 ? 1.6 : 0.7); if (pp[2] >= 1) pp[2] = 0; }
      if (stage.style.getPropertyValue('--hold') !== (ch * T.holdVignette).toFixed(2)) stage.style.setProperty('--hold', (ch * T.holdVignette).toFixed(2));
      // The river stays as the canyon flattens: seen from above it runs down the middle of the screen
      // into the first pipe on the page. The churning stops as the orb leaves.
      // (The calm-water box behind the quote is no longer used: Markus, 18 Nov. All zeros = off.)
      const calm: [number, number, number, number, number, number, number] = [0, 0, 0, 0, 0, 0, 0];
      water.update({
        t: clock, orbX: orbit.position.x, orbY: orbit.position.y, orbZ: orbit.position.z,
        // The orb's light on the water (its glow, glint and mirror image) follows the orb itself: nothing until it
        // has spawned, so the reflection never appears before the orb does.
        flat: 1 - k, stir: (1 - ease(away * 2.5)) * born, show: 1, fogNear: fog.near, fogFar: fog.far, calm, drop: drainY,
        nova: novaT >= 0 ? [novaAt.x, novaAt.y, novaT, T.holdNovaWave] : [introWaveAt.x, introWaveAt.y, introWaveT, introWave * 2.5], novaSpeed: novaT >= 0 ? T.holdNovaWaveSpeed : 30,
        mirror: [T.orbMirror * (1 - away) * born, R * born, spinClock, flash], flash: landFlash * 0.5 + strike.flash * 0.35 * T.holdBolts,
        boil: [orbit.position.x, orbit.position.z, boil, T.holdBoilArea], boilLook: [T.holdBoilHeight, T.holdBoilSpeed, T.holdBoilSpecks, T.holdBoilLift], pops, skyTurn,
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
      if (fly > 0) words.group.position.addScaledVector(flyDir.set(1, 0, 0).applyQuaternion(camera.quaternion), -120 * (flyOn ? fly * fly : 1 - (1 - fly) * (1 - fly)));
      words.group.scale.set(T.wordsSize * (small ? 0.72 : 1), T.wordsSize * (small ? 0.72 : 1), T.wordsSize * T.wordsDepth);
      words.mat.uniforms.uOpacity.value = 1 - wordsOut;
      words.mat.uniforms.uBright.value = T.wordsBright; words.refl.uniforms.uBright.value = T.wordsBright;
      words.refl.uniforms.uOpacity.value = T.wordsReflect * (1 - wordsOut);
      clouds.update(clock, camera, 1 - k, show, orbit.position);
      stars.update(now, camera, T, k < 0.3);
      renderer.render(scene, camera);
      if (statusEl && now - statusAt > 250) {
        statusAt = now;
        statusEl.textContent = `scroll ${Math.round(scrollY)} px · orb: ${hold.down ? 'HELD' : novaLock ? 'let go first' : orbOnScreen.r > 0 ? 'ready to press' : 'cannot be pressed (page scrolled too far)'} · last press: ${lastPress} · charge ${Math.round(charge * 100)}% · ${Math.round(fps)} frames/s`;
      }
      if (++framesDrawn >= 3 && fontsIn) revealPage(T.introFade * 1000);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      unmountPanel?.();
      removeEventListener('pointerdown', onDown, true);
      removeEventListener('pointermove', onMove);
      removeEventListener('pointerup', onUp);
      removeEventListener('pointercancel', onUp);
      removeEventListener('contextmenu', noMenu);
      document.removeEventListener('selectstart', noMenu);
      if (followEl) followEl.style.opacity = '';
      statusEl?.remove();
      stopResize();
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
    };
  }, [fadeAt]);

  return <div className="cn-stage" ref={stageRef} aria-hidden="true"><canvas ref={canvasRef} /></div>;
}
