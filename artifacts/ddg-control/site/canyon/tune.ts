/**
 * Scene settings, and (preview only) a panel of sliders to change them live. The panel shows when
 * the page sets window.__DDG_TUNE__ or its address has #tune. Its "Copy settings" button gives a
 * block of text that can be pasted back to Claude, who then makes those the real defaults.
 */

type Spec = { key: string; label: string; min: number; max: number; step: number; group: string; names?: string[] };

import { QUOTES } from '../content';

/** 3D fonts for "We build it all." (they come with three.js). */
export const WORD_FONTS = ['Helvetiker', 'Helvetiker Bold', 'Optimer', 'Optimer Bold', 'Gentilis', 'Gentilis Bold', 'Droid Sans', 'Droid Sans Bold', 'Droid Serif', 'Droid Serif Bold', 'Droid Sans Mono'];
/** Web fonts for the name. [name shown, Google Fonts family or '' for the site's own font]. */
export const BRAND_FONTS: [string, string][] = [
  ['Site font (now)', ''], ['Orbitron', 'Orbitron:wght@400..900'], ['Michroma', 'Michroma'], ['Syncopate', 'Syncopate:wght@400;700'],
  ['Audiowide', 'Audiowide'], ['Unbounded', 'Unbounded:wght@200..900'], ['Space Grotesk', 'Space+Grotesk:wght@300..700'], ['Oxanium', 'Oxanium:wght@200..800'],
  ['Chakra Petch', 'Chakra+Petch:wght@300;400;500;600;700'], ['Major Mono Display', 'Major+Mono+Display'], ['Sora', 'Sora:wght@100..800'],
  ['Exo 2', 'Exo+2:wght@100..900'], ['Tektur', 'Tektur:wght@400..900'], ['Bruno Ace SC', 'Bruno+Ace+SC'],
];

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
  { group: 'Water', key: 'swirlLines', label: 'Swirl lines (how wound up)', min: 0, max: 3, step: 0.05 },
  { group: 'Water', key: 'swirlSoft', label: 'Swirl softness (bigger = blurrier)', min: 0.3, max: 3, step: 0.05 },
  { group: 'Water', key: 'waterFoam', label: 'White water', min: 0, max: 3, step: 0.05 },
  { group: 'Water', key: 'waterGlint', label: 'Orb glint on water', min: 0, max: 3, step: 0.05 },
  { group: 'Water', key: 'waterReflect', label: 'Reflection strength', min: 0, max: 3, step: 0.05 },
  { group: 'Water', key: 'waterColour', label: 'Colour brightness', min: 0, max: 3, step: 0.05 },
  { group: 'Water', key: 'waterSheen', label: 'Silk sheen', min: 0, max: 3, step: 0.05 },
  { group: 'Water', key: 'waterClear', label: 'Clearness (see into the water)', min: 0, max: 1, step: 0.02 },
  { group: 'Water', key: 'sprayAmount', label: 'Spray amount', min: 0, max: 1, step: 0.05 },
  { group: 'Water', key: 'spraySize', label: 'Spray drop size', min: 0, max: 3, step: 0.05 },
  // Scene
  { group: 'Scene', key: 'fogNear', label: 'Fog starts', min: 0.2, max: 3, step: 0.05 },
  { group: 'Scene', key: 'fogFar', label: 'Fog full', min: 0.3, max: 3, step: 0.05 },
  { group: 'Scene', key: 'fov', label: 'Camera zoom (field of view)', min: 30, max: 90, step: 1 },
  { group: 'Shooting stars', key: 'starsOn', label: 'On (1) or off (0)', min: 0, max: 1, step: 1 },
  { group: 'Shooting stars', key: 'starsEvery', label: 'About every … seconds', min: 1, max: 30, step: 0.5 },
  { group: 'Shooting stars', key: 'starsLength', label: 'Tail length', min: 0.2, max: 3, step: 0.05 },
  { group: 'Shooting stars', key: 'starsSpeed', label: 'Speed', min: 0.2, max: 3, step: 0.05 },
  { group: 'Shooting stars', key: 'starsBright', label: 'Brightness', min: 0.1, max: 2, step: 0.05 },
  { group: 'Shooting stars', key: 'starsWidth', label: 'Thickness', min: 0.3, max: 4, step: 0.05 },
  { group: 'Shooting stars', key: 'starsSteep', label: 'How steeply they fall', min: 0, max: 2, step: 0.05 },
  { group: 'Riverbed pipe', key: 'pipeOn', label: 'On (1) or off (0)', min: 0, max: 1, step: 1 },
  { group: 'Riverbed pipe', key: 'pipeRadius', label: 'Pipe thickness', min: 0.2, max: 4, step: 0.05 },
  { group: 'Riverbed pipe', key: 'pipeLift', label: 'Raise above the bed', min: -1, max: 4, step: 0.05 },
  { group: 'Riverbed pipe', key: 'pipeGlass', label: 'Glass cloudiness', min: 0, max: 6, step: 0.05 },
  { group: 'Riverbed pipe', key: 'pipeRim', label: 'Glass edge shine', min: 0, max: 3, step: 0.05 },
  { group: 'Riverbed pipe', key: 'pipeGlow', label: 'Glow in the water (volumetric)', min: 0, max: 4, step: 0.05 },
  { group: 'Riverbed pipe', key: 'dataCount', label: 'Data particles: how many', min: 0, max: 1, step: 0.02 },
  { group: 'Riverbed pipe', key: 'dataSize', label: 'Data particles: size', min: 0.2, max: 4, step: 0.05 },
  { group: 'Riverbed pipe', key: 'dataSpeed', label: 'Data particles: speed', min: 0, max: 5, step: 0.05 },
  { group: 'Riverbed pipe', key: 'dataBright', label: 'Data particles: brightness', min: 0, max: 3, step: 0.05 },
  { group: 'Riverbed pipe', key: 'dataColour', label: 'Data particles: colour (0 blue, 1 mint, 2 white)', min: 0, max: 2, step: 0.05 },
  { group: 'Scene', key: 'gridLines', label: 'Line grid brightness', min: 0, max: 3, step: 0.05 },
  // "We build it all." in 3D
  { group: 'Words (We build it all.)', key: 'wordsOn', label: 'Show the words (0 off, 1 on)', min: 0, max: 1, step: 1 },
  { group: 'Words (We build it all.)', key: 'wordsFont', label: 'Font', min: 0, max: 10, step: 1, names: WORD_FONTS },
  { group: 'Words (We build it all.)', key: 'wordsSize', label: 'Size', min: 0.3, max: 3, step: 0.05 },
  { group: 'Words (We build it all.)', key: 'wordsDepth', label: 'Thickness', min: 0, max: 5, step: 0.05 },
  { group: 'Words (We build it all.)', key: 'wordsZ', label: 'Distance (bigger = closer to you)', min: 0, max: 34, step: 0.25 },
  { group: 'Words (We build it all.)', key: 'wordsX', label: 'Left / right', min: -20, max: 20, step: 0.25 },
  { group: 'Words (We build it all.)', key: 'wordsY', label: 'Height above water', min: -2, max: 12, step: 0.1 },
  { group: 'Words (We build it all.)', key: 'wordsBright', label: 'Brightness', min: 0, max: 2, step: 0.05 },
  { group: 'Words (We build it all.)', key: 'wordsReflect', label: 'Reflection in water', min: 0, max: 1, step: 0.02 },
  { group: 'Words (We build it all.)', key: 'wordsFade', label: 'How long they stay when scrolling', min: 0.1, max: 1.5, step: 0.05 },
  // The quote under the orb
  { group: 'Quote', key: 'quote', label: 'Which quote', min: 0, max: 9, step: 1, names: QUOTES },
  { group: 'Quote', key: 'quoteOn', label: 'Show it (0 off, 1 on)', min: 0, max: 1, step: 1 },
  { group: 'Quote', key: 'quoteFont', label: 'Font', min: 0, max: 13, step: 1, names: BRAND_FONTS.map((f) => f[0]) },
  { group: 'Quote', key: 'quoteSize', label: 'Text size', min: 0.4, max: 3, step: 0.05 },
  { group: 'Quote', key: 'quoteWeight', label: 'Weight (thin ← → heavy)', min: 100, max: 900, step: 100 },
  { group: 'Quote', key: 'quoteSpacing', label: 'Letter spacing', min: -0.05, max: 0.4, step: 0.01 },
  { group: 'Quote', key: 'quoteCaps', label: 'Capitals (0 off, 1 on)', min: 0, max: 1, step: 1 },
  { group: 'Quote', key: 'quoteAlign', label: 'Place (0 left, 1 middle, 2 right)', min: 0, max: 2, step: 1 },
  { group: 'Quote', key: 'quoteWidth', label: 'Line length', min: 12, max: 70, step: 1 },
  { group: 'Quote', key: 'quoteLift', label: 'Move up / down', min: -5, max: 40, step: 0.5 },
  // The name and logo above the orb
  { group: 'Name and logo', key: 'brandFont', label: 'Font', min: 0, max: 13, step: 1, names: BRAND_FONTS.map((f) => f[0]) },
  { group: 'Name and logo', key: 'brandSize', label: 'Text size', min: 0.5, max: 2.5, step: 0.05 },
  { group: 'Name and logo', key: 'brandWeight', label: 'Weight (thin ← → heavy)', min: 100, max: 900, step: 100 },
  { group: 'Name and logo', key: 'brandSpacing', label: 'Letter spacing', min: -0.08, max: 0.6, step: 0.01 },
  { group: 'Name and logo', key: 'brandCaps', label: 'Capitals (0 off, 1 on)', min: 0, max: 1, step: 1 },
  { group: 'Name and logo', key: 'groupSize', label: '"GROUP" size (vs the line above)', min: 0.3, max: 1.5, step: 0.02 },
  { group: 'Name and logo', key: 'brandLine', label: 'Gap between the two lines', min: 0.8, max: 2, step: 0.02 },
  { group: 'Name and logo', key: 'logoOn', label: 'Show the logo (0 off, 1 on)', min: 0, max: 1, step: 1 },
  { group: 'Name and logo', key: 'logoStyle', label: 'Logo (0 glitch, 1 plain white)', min: 0, max: 1, step: 1 },
  { group: 'Name and logo', key: 'logoSize', label: 'Logo size', min: 0.3, max: 3, step: 0.05 },
  { group: 'Name and logo', key: 'logoGap', label: 'Gap between logo and name', min: 0, max: 60, step: 1 },
  { group: 'Name and logo', key: 'brandLift', label: 'Move up / down', min: -20, max: 30, step: 0.5 },
];

// Markus's settings from the tuner, 17 Nov 2026 (five rounds).
export const DEFAULTS: Record<string, number> = {
  orbSpin: 2.15, orbStreaks: 0.25, orbSparks: 0.45, orbSparkRate: 2.75, orbSize: 1.32, orbHeight: -1.7, orbGlow: 1.4,
  waterDesign: 4, waterTexture: 4, waterRipples: 0, swirlSize: 1.5, swirlDepth: 3, swirlSpeed: 3, swirlLines: 0.75, swirlSoft: 1.95, waterFoam: 0,
  waterGlint: 3, waterReflect: 0.65, waterColour: 0.8, waterSheen: 0.95, sprayAmount: 0, spraySize: 1,
  fogNear: 0.2, fogFar: 0.6, fov: 63, gridLines: 0.3,
  wordsOn: 0, starsOn: 1, logoOn: 1, logoStyle: 1, groupSize: 0.96, waterClear: 0.45,
  starsEvery: 4.5, starsLength: 1.4, starsSpeed: 2, starsBright: 0.3, starsWidth: 0.65, starsSteep: 1.05,
  pipeOn: 1, pipeRadius: 2.45, pipeLift: -0.35, pipeGlass: 0, pipeRim: 0.75, pipeGlow: 0.5, dataCount: 0.56, dataSize: 1.6, dataSpeed: 5, dataBright: 0.1, dataColour: 2, wordsFont: 10, wordsSize: 0.7, wordsDepth: 1.25, wordsZ: 26.5, wordsX: 0, wordsY: 0, wordsBright: 1, wordsReflect: 0.04, wordsFade: 0.3,
  quote: 0, quoteOn: 1, quoteFont: 3, quoteSize: 1, quoteWeight: 300, quoteSpacing: 0, quoteCaps: 0, quoteAlign: 0, quoteWidth: 30, quoteLift: 0,
  brandFont: 3, brandSize: 0.55, brandWeight: 100, brandSpacing: -0.01, brandCaps: 1, brandLine: 1.06, logoSize: 1.1, logoGap: 7, brandLift: -2.5,
};

export const T: Record<string, number> = { ...DEFAULTS };

const STORE = 'ddg-scene-tune-8'; // new name, so old saved slider positions don't override these defaults
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
.tune h4 { cursor: pointer; user-select: none; } .tune h4::before { content: '▾ '; } .tune section.folded h4::before { content: '▸ '; } .tune section.folded label { display: none; }
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
  const input0 = (k: string) => inputs[k][0].dispatchEvent(new Event('input'));
  let group = '';
  let box: HTMLElement = body as HTMLElement;
  let folded: string[] = [];
  try { folded = JSON.parse(localStorage.getItem(STORE + '-folded') || '[]'); } catch { /* ignore */ }
  for (const s of SPECS) {
    if (s.group !== group) {
      group = s.group;
      const sec = document.createElement('section');
      sec.innerHTML = `<h4 data-act="fold">${group}</h4>`;
      if (folded.includes(group)) sec.classList.add('folded');
      body.appendChild(sec);
      box = sec;
    }
    const l = document.createElement('label');
    l.innerHTML = `<span>${s.label}<i></i></span><input type="range" min="${s.min}" max="${s.max}" step="${s.step}">`;
    const input = l.querySelector('input')!, val = l.querySelector('i')!;
    const show = (v: number) => (s.names ? `${v} · ${s.names[v] ?? ''}` : String(v));
    input.value = String(T[s.key]); val.textContent = show(T[s.key]);
    input.addEventListener('input', () => { T[s.key] = Number(input.value); val.textContent = show(T[s.key]); changed(); save(); });
    inputs[s.key] = [input, val];
    box.appendChild(l);
  }
  root.addEventListener('click', async (e) => {
    const act = (e.target as HTMLElement).dataset?.act;
    if (act === 'fold') {
      const sec = (e.target as HTMLElement).parentElement!;
      sec.classList.toggle('folded');
      folded = [...root.querySelectorAll('section.folded h4')].map((h) => h.textContent || '');
      try { localStorage.setItem(STORE + '-folded', JSON.stringify(folded)); } catch { /* ignore */ }
    }
    if (act === 'min') { root.classList.toggle('min'); (e.target as HTMLElement).textContent = root.classList.contains('min') ? 'Show' : 'Hide'; }
    if (act === 'reset') { Object.assign(T, DEFAULTS); for (const s of SPECS) { inputs[s.key][0].value = String(T[s.key]); inputs[s.key][1].textContent = String(T[s.key]); input0(s.key); } changed(); save(); }
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

/** Put the name-and-logo settings on the page (CSS variables), loading the chosen web font. */
let lastBrand = '';
export function applyBrand(): void {
  const key = ['brandFont', 'brandSize', 'brandWeight', 'brandSpacing', 'brandCaps', 'brandLine', 'logoSize', 'logoGap', 'brandLift', 'logoOn', 'logoStyle', 'groupSize', 'quote', 'quoteOn', 'quoteFont', 'quoteSize', 'quoteWeight', 'quoteSpacing', 'quoteCaps', 'quoteAlign', 'quoteWidth', 'quoteLift'].map((k) => T[k]).join(',');
  if (key === lastBrand) return;
  lastBrand = key;
  const fontOf = (i: number) => {
    const [, family] = BRAND_FONTS[i] ?? BRAND_FONTS[0];
    if (family && !document.getElementById(`bf-${i}`)) {
      const l = document.createElement('link');
      l.id = `bf-${i}`; l.rel = 'stylesheet';
      l.href = `https://fonts.googleapis.com/css2?family=${family}&display=swap`;
      document.head.appendChild(l);
    }
    return family ? `'${family.split(':')[0].replace(/\+/g, ' ')}', var(--ng-font, system-ui), sans-serif` : 'inherit';
  };
  const s = document.documentElement.style;
  s.setProperty('--brand-font', fontOf(T.brandFont));
  // The quote under the orb.
  const q = document.querySelector<HTMLElement>('.cn-quote');
  if (q) { q.textContent = QUOTES[T.quote] ?? QUOTES[0]; q.style.display = T.quoteOn ? '' : 'none'; }
  s.setProperty('--quote-font', fontOf(T.quoteFont));
  s.setProperty('--quote-size', String(T.quoteSize));
  s.setProperty('--quote-weight', String(T.quoteWeight));
  s.setProperty('--quote-track', `${T.quoteSpacing}em`);
  s.setProperty('--quote-case', T.quoteCaps ? 'uppercase' : 'none');
  s.setProperty('--quote-width', `${T.quoteWidth}ch`);
  s.setProperty('--quote-lift', `${T.quoteLift}vh`);
  s.setProperty('--quote-align', ['left', 'center', 'right'][T.quoteAlign] ?? 'left');
  s.setProperty('--quote-left', T.quoteAlign === 2 ? 'auto' : T.quoteAlign === 1 ? '0' : 'var(--s-gutter)');
  s.setProperty('--quote-right', T.quoteAlign === 0 ? 'auto' : T.quoteAlign === 1 ? '0' : 'var(--s-gutter)');
  s.setProperty('--brand-size', String(T.brandSize));
  s.setProperty('--brand-weight', String(T.brandWeight));
  s.setProperty('--brand-track', `${T.brandSpacing}em`);
  s.setProperty('--brand-case', T.brandCaps ? 'uppercase' : 'none');
  s.setProperty('--brand-line', String(T.brandLine));
  s.setProperty('--logo-size', String(T.logoSize));
  s.setProperty('--logo-show', T.logoOn && !T.logoStyle ? 'block' : 'none');
  s.setProperty('--logo-white-show', T.logoOn && T.logoStyle ? 'block' : 'none');
  s.setProperty('--group-size', String(T.groupSize));
  s.setProperty('--logo-gap', `${T.logoGap}px`);
  s.setProperty('--brand-lift', `${T.brandLift}vh`);
}
