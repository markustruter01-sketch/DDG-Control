/**
 * Scene settings, and (preview only) a panel of sliders to change them live. The panel shows when
 * the page sets window.__DDG_TUNE__ or its address has #tune. Its "Copy settings" button gives a
 * block of text that can be pasted back to Claude, who then makes those the real defaults.
 */

type Spec = { key: string; label: string; min: number; max: number; step: number; group: string };

export const SPECS: Spec[] = [
  // Orb
  { group: 'Orb', key: 'orbSpin', label: 'Spin speed', min: 0, max: 3, step: 0.05 },
  { group: 'Orb', key: 'orbStreaks', label: 'White streaks', min: 0, max: 3, step: 0.05 },
  { group: 'Orb', key: 'orbSparks', label: 'Spark brightness', min: 0, max: 3, step: 0.05 },
  { group: 'Orb', key: 'orbSparkRate', label: 'Spark how often', min: 0, max: 4, step: 0.05 },
  { group: 'Orb', key: 'orbSize', label: 'Size', min: 0.4, max: 2, step: 0.02 },
  { group: 'Orb', key: 'orbHeight', label: 'Height above water', min: -3, max: 6, step: 0.1 },
  { group: 'Orb', key: 'orbGlow', label: 'Glow around it', min: 0, max: 2, step: 0.05 },
  // Water
  { group: 'Water', key: 'waterDesign', label: 'Design (0 old, 1 glass, 2 cartoon, 3 mirror, 4 silk)', min: 0, max: 4, step: 1 },
  { group: 'Water', key: 'waterTexture', label: 'Texture (swells)', min: 0, max: 4, step: 0.05 },
  { group: 'Water', key: 'waterRipples', label: 'Fine ripples', min: 0, max: 4, step: 0.05 },
  { group: 'Water', key: 'swirlSize', label: 'Swirl size', min: 0.3, max: 3, step: 0.05 },
  { group: 'Water', key: 'swirlDepth', label: 'Swirl depth', min: 0, max: 3, step: 0.05 },
  { group: 'Water', key: 'swirlSpeed', label: 'Swirl speed', min: 0, max: 3, step: 0.05 },
  { group: 'Water', key: 'waterFoam', label: 'White water', min: 0, max: 3, step: 0.05 },
  { group: 'Water', key: 'waterGlint', label: 'Orb glint on water', min: 0, max: 3, step: 0.05 },
  { group: 'Water', key: 'waterReflect', label: 'Reflection strength', min: 0, max: 3, step: 0.05 },
  { group: 'Water', key: 'waterColour', label: 'Colour brightness', min: 0, max: 3, step: 0.05 },
  { group: 'Water', key: 'waterSheen', label: 'Silk sheen', min: 0, max: 3, step: 0.05 },
  { group: 'Water', key: 'sprayAmount', label: 'Spray amount', min: 0, max: 1, step: 0.05 },
  { group: 'Water', key: 'spraySize', label: 'Spray drop size', min: 0, max: 3, step: 0.05 },
  // Grass
  { group: 'Grass', key: 'grassOn', label: 'Grass on (1) or line grid (0)', min: 0, max: 1, step: 1 },
  { group: 'Grass', key: 'grassDensity', label: 'Density', min: 0.05, max: 1, step: 0.05 },
  { group: 'Grass', key: 'grassHeight', label: 'Blade length', min: 0.2, max: 4, step: 0.05 },
  { group: 'Grass', key: 'grassWidth', label: 'Blade thickness', min: 0.2, max: 4, step: 0.05 },
  { group: 'Grass', key: 'grassTaper', label: 'Blade point (0 square, 1 sharp)', min: 0, max: 1, step: 0.05 },
  { group: 'Grass', key: 'grassLean', label: 'Lean', min: 0, max: 3, step: 0.05 },
  { group: 'Grass', key: 'windStrength', label: 'Wind strength', min: 0, max: 4, step: 0.05 },
  { group: 'Grass', key: 'windSpeed', label: 'Wind speed', min: 0, max: 4, step: 0.05 },
  { group: 'Grass', key: 'windWaves', label: 'Wind wave size (small = big waves)', min: 0.2, max: 4, step: 0.05 },
  { group: 'Grass', key: 'windFlutter', label: 'Blade flutter', min: 0, max: 4, step: 0.05 },
  { group: 'Grass', key: 'grassTip', label: 'Tip brightness', min: 0, max: 3, step: 0.05 },
  { group: 'Grass', key: 'grassRoot', label: 'Root brightness', min: 0, max: 4, step: 0.05 },
  { group: 'Grass', key: 'grassSat', label: 'Colour strength', min: 0, max: 2, step: 0.05 },
  { group: 'Grass', key: 'grassHue', label: 'Colour (yellow ← → blue-green)', min: -1, max: 1, step: 0.05 },
  { group: 'Grass', key: 'grassPatches', label: 'Colour patches', min: 0, max: 3, step: 0.05 },
  { group: 'Grass', key: 'groundBright', label: 'Ground between blades', min: 0, max: 3, step: 0.05 },
  // Lighting
  { group: 'Lighting', key: 'exposure', label: 'Exposure (overall)', min: 0.2, max: 3, step: 0.05 },
  { group: 'Lighting', key: 'moon', label: 'Moonlight', min: 0, max: 3, step: 0.05 },
  { group: 'Lighting', key: 'moonAngle', label: 'Moon direction', min: -3.14, max: 3.14, step: 0.05 },
  { group: 'Lighting', key: 'backlight', label: 'Light through blades', min: 0, max: 3, step: 0.05 },
  { group: 'Lighting', key: 'orbLight', label: 'Orb light on grass', min: 0, max: 4, step: 0.05 },
  { group: 'Lighting', key: 'ambient', label: 'Sky light (shadows)', min: 0, max: 3, step: 0.05 },
  { group: 'Lighting', key: 'sheen', label: 'Shine on tips', min: 0, max: 4, step: 0.05 },
  // Scene
  { group: 'Scene', key: 'fogNear', label: 'Fog starts', min: 0.2, max: 3, step: 0.05 },
  { group: 'Scene', key: 'fogFar', label: 'Fog full', min: 0.3, max: 3, step: 0.05 },
  { group: 'Scene', key: 'fov', label: 'Camera zoom (field of view)', min: 30, max: 90, step: 1 },
  { group: 'Scene', key: 'gridLines', label: 'Line grid brightness (grass off)', min: 0, max: 3, step: 0.05 },
];

export const DEFAULTS: Record<string, number> = {
  orbSpin: 1, orbStreaks: 1, orbSparks: 1, orbSparkRate: 1, orbSize: 1, orbHeight: 0, orbGlow: 1,
  waterDesign: 4, waterTexture: 1, waterRipples: 1, swirlSize: 1, swirlDepth: 1, swirlSpeed: 1, waterFoam: 1,
  waterGlint: 1, waterReflect: 1, waterColour: 1, waterSheen: 1, sprayAmount: 1, spraySize: 1,
  grassOn: 1, grassDensity: 1, grassHeight: 1, grassWidth: 1, grassTaper: 0.8, grassLean: 1, windStrength: 1, windSpeed: 1,
  windWaves: 1, windFlutter: 1, grassTip: 1, grassRoot: 1, grassSat: 1, grassHue: 0, grassPatches: 1, groundBright: 1,
  exposure: 1, moon: 1, moonAngle: 0, backlight: 1, orbLight: 1, ambient: 1, sheen: 1,
  fogNear: 1, fogFar: 1, fov: 58, gridLines: 1,
};

export const T: Record<string, number> = { ...DEFAULTS };

const STORE = 'ddg-scene-tune';
export function tuneOn(): boolean {
  return !!(window as unknown as { __DDG_TUNE__?: unknown }).__DDG_TUNE__ || /tune/.test(location.hash);
}

/** Build the slider panel. Returns a function that removes it. */
export function mountPanel(): () => void {
  try { Object.assign(T, JSON.parse(localStorage.getItem(STORE) || '{}')); } catch { /* storage may be blocked */ }
  const save = () => { try { localStorage.setItem(STORE, JSON.stringify(T)); } catch { /* ignore */ } };
  const root = document.createElement('div');
  root.className = 'tune';
  const css = document.createElement('style');
  css.textContent = `
.tune { position: fixed; top: 12px; right: 12px; bottom: 12px; width: 320px; z-index: 50; display: flex; flex-direction: column;
  background: rgba(10,13,20,0.88); border: 1px solid rgba(255,255,255,0.14); border-radius: 14px; color: #dfe8f2;
  font: 12px/1.3 ui-sans-serif, system-ui, sans-serif; backdrop-filter: blur(10px); box-shadow: 0 10px 40px rgba(0,0,0,0.5); }
.tune.min { bottom: auto; }
.tune.min .tune-body, .tune.min .tune-foot { display: none; }
.tune-head { display: flex; align-items: center; gap: 8px; padding: 10px 12px; border-bottom: 1px solid rgba(255,255,255,0.1); }
.tune-head b { flex: 1; font-weight: 600; font-size: 13px; }
.tune button { background: rgba(255,255,255,0.08); color: inherit; border: 1px solid rgba(255,255,255,0.18); border-radius: 8px; padding: 6px 9px; font: inherit; cursor: pointer; }
.tune button:hover { background: rgba(255,255,255,0.16); }
.tune button.go { background: #6cc7f0; color: #061018; border-color: #6cc7f0; font-weight: 600; }
.tune-body { overflow-y: auto; padding: 4px 12px 12px; flex: 1; }
.tune h4 { margin: 14px 0 6px; font: 600 11px ui-monospace, monospace; letter-spacing: 0.12em; text-transform: uppercase; color: #6cc7f0; }
.tune label { display: block; margin: 7px 0; }
.tune label span { display: flex; justify-content: space-between; color: #b9c6d4; }
.tune label span i { font-style: normal; color: #fff; font-family: ui-monospace, monospace; }
.tune input[type=range] { width: 100%; accent-color: #6cc7f0; }
.tune-foot { padding: 10px 12px; border-top: 1px solid rgba(255,255,255,0.1); display: grid; gap: 8px; }
.tune textarea { width: 100%; box-sizing: border-box; height: 90px; resize: vertical; background: rgba(0,0,0,0.35); color: #cfe; border: 1px solid rgba(255,255,255,0.14); border-radius: 8px; font: 11px ui-monospace, monospace; padding: 6px; }
.tune-foot div { display: flex; gap: 8px; }
.tune-note { color: #8fa2b5; font-size: 11px; }`;
  root.innerHTML = `<div class="tune-head"><b>Scene settings</b><button data-act="min">Hide</button></div><div class="tune-body"></div>
<div class="tune-foot"><div><button class="go" data-act="copy">Copy settings</button><button data-act="reset">Reset all</button></div>
<textarea readonly></textarea><p class="tune-note">Changes show straight away. When it looks right, press Copy settings and paste it to Claude (or send a screenshot of this box).</p></div>`;
  const body = root.querySelector('.tune-body')!, out = root.querySelector('textarea')!;
  const changed = () => {
    const diff: Record<string, number> = {};
    for (const s of SPECS) if (T[s.key] !== DEFAULTS[s.key]) diff[s.key] = T[s.key];
    out.value = 'DDG scene settings (changed from default):\n' + JSON.stringify(diff, null, 1);
  };
  const inputs: Record<string, [HTMLInputElement, HTMLElement]> = {};
  let group = '';
  for (const s of SPECS) {
    if (s.group !== group) { group = s.group; body.insertAdjacentHTML('beforeend', `<h4>${group}</h4>`); }
    const l = document.createElement('label');
    l.innerHTML = `<span>${s.label}<i></i></span><input type="range" min="${s.min}" max="${s.max}" step="${s.step}">`;
    const input = l.querySelector('input')!, val = l.querySelector('i')!;
    input.value = String(T[s.key]); val.textContent = String(T[s.key]);
    input.addEventListener('input', () => { T[s.key] = Number(input.value); val.textContent = input.value; changed(); save(); });
    inputs[s.key] = [input, val];
    body.appendChild(l);
  }
  root.addEventListener('click', async (e) => {
    const act = (e.target as HTMLElement).dataset?.act;
    if (act === 'min') { root.classList.toggle('min'); (e.target as HTMLElement).textContent = root.classList.contains('min') ? 'Show' : 'Hide'; }
    if (act === 'reset') { Object.assign(T, DEFAULTS); for (const s of SPECS) { inputs[s.key][0].value = String(T[s.key]); inputs[s.key][1].textContent = String(T[s.key]); } changed(); save(); }
    if (act === 'copy') {
      out.select();
      try { await navigator.clipboard.writeText(out.value); (e.target as HTMLElement).textContent = 'Copied'; } catch { (e.target as HTMLElement).textContent = 'Select the text below and copy it'; }
      setTimeout(() => { (e.target as HTMLElement).textContent = 'Copy settings'; }, 2500);
    }
  });
  // Scrolling over the panel scrolls the panel, not the page.
  root.addEventListener('wheel', (e) => e.stopPropagation(), { passive: true });
  document.head.appendChild(css); document.body.appendChild(root);
  changed();
  return () => { root.remove(); css.remove(); };
}
