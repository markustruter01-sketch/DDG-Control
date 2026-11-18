/**
 * Scene settings, and (preview only) a panel of sliders to change them live. The panel shows when
 * the page sets window.__DDG_TUNE__ or its address has #tune. Its "Copy settings" button gives a
 * block of text that can be pasted back to Claude, who then makes those the real defaults.
 */

type Spec = { key: string; label: string; min: number; max: number; step: number; group: string; names?: string[]; text?: true };

import { QUOTES } from '../content';
import { replayIntro } from '../intro';

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
  { group: 'Load-in', key: 'introFade', label: 'Black to page (seconds)', min: 0.2, max: 3, step: 0.1 },
  { group: 'Load-in', key: 'introStyle', label: 'How the orb arrives', min: 0, max: 5, step: 1, names: ['Classic', 'Portal', 'Spark', 'Gathering', 'Lightning', 'Rise from the river'] },
  { group: 'Load-in', key: 'introSpawn', label: 'Orb spawning in (seconds, 0 = off)', min: 0, max: 6, step: 0.1 },
  { group: 'Load-in', key: 'introLoop', label: 'Replay it on a loop (preview only: 0 off, 1 on)', min: 0, max: 1, step: 1 },
  { group: 'Orb', key: 'orbStyle', label: 'Style', min: 0, max: 8, step: 1, names: ['Spinning air (now)', 'Cloud core', 'Liquid pearl', 'Water in glass', 'Storm', 'Aurora', 'Neural net', 'Galaxy', 'Singularity'] },
  { group: 'Orb', key: 'orbFlow', label: 'Movement inside (slow ← → fast)', min: 0.1, max: 4, step: 0.05 },
  { group: 'Orb', key: 'orbHue', label: 'Colour turn', min: -180, max: 180, step: 5 },
  { group: 'Orb', key: 'orbSpin', label: 'Spin speed', min: 0, max: 3, step: 0.05 },
  { group: 'Orb', key: 'orbStreaks', label: 'White streaks', min: 0, max: 3, step: 0.05 },
  { group: 'Orb', key: 'orbSparks', label: 'Spark brightness', min: 0, max: 3, step: 0.05 },
  { group: 'Orb', key: 'orbSparkRate', label: 'Spark how often', min: 0, max: 4, step: 0.05 },
  { group: 'Orb', key: 'camZoom', label: 'Camera: distance from the orb (1 = close, 2 = twice as far)', min: 0.6, max: 4, step: 0.05 },
  { group: 'Orb', key: 'camUp', label: 'Camera: height (higher looks down more)', min: -6, max: 40, step: 0.5 },
  { group: 'Orb', key: 'orbSize', label: 'Size', min: 0.4, max: 2, step: 0.02 },
  { group: 'Orb', key: 'orbHeight', label: 'Height above water', min: -3, max: 6, step: 0.1 },
  { group: 'Orb', key: 'orbGlow', label: 'Glow around it', min: 0, max: 2, step: 0.05 },
  { group: 'Hold the orb', key: 'holdFlyOff', label: 'Words and logos fly off the screen while it charges', min: 0, max: 1, step: 1, names: ['Off', 'On'] },
  { group: 'Hold the orb', key: 'holdOn', label: 'Press and hold the orb (0 off, 1 on)', min: 0, max: 1, step: 1 },
  { group: 'Hold the orb', key: 'holdBolts', label: 'Lightning strikes', min: 0, max: 2, step: 0.05 },
  { group: 'Hold the orb', key: 'holdSkyStrike', label: 'Full charge: lightning from the top of the screen onto the orb', min: 0, max: 3, step: 0.05 },
  { group: 'Hold the orb', key: 'holdBoil', label: 'Water simmering', min: 0, max: 2, step: 0.05 },
  { group: 'Hold the orb', key: 'holdBuild', label: 'Build-up time (seconds to the nova)', min: 2, max: 20, step: 0.5 },
  { group: 'Hold the orb', key: 'holdNova', label: 'Nova blast size (0 none)', min: 0, max: 2, step: 0.05 },
  { group: 'Hold the orb', key: 'holdNovaWave', label: 'Nova: how hard it pushes the water', min: 0, max: 40, step: 0.05 },
  { group: 'Hold the orb', key: 'holdNovaWaveSpeed', label: 'Nova: how fast the push runs out', min: 5, max: 150, step: 1 },
  { group: 'Hold the orb', key: 'holdCalm', label: 'After the blast: seconds until everything has settled', min: 0.5, max: 8, step: 0.25 },
  { group: 'Hold the orb', key: 'holdFxGlobs', label: 'Charge-up: water globules from the lake (0 off, 1 on)', min: 0, max: 1, step: 1 },
  { group: 'Hold the orb', key: 'holdFxGround', label: 'Charge-up: ground lifting (0 off, 1 on)', min: 0, max: 1, step: 1 },
  { group: 'Hold the orb', key: 'holdFxAmount', label: 'Charge-up effect: amount', min: 0, max: 3, step: 0.05 },
  { group: 'Hold the orb', key: 'holdFxSpeed', label: 'Charge-up effect: speed', min: 0.2, max: 3, step: 0.05 },
  { group: 'Hold the orb', key: 'holdZoom', label: 'Camera move (0 none ← → 1 all the way)', min: 0, max: 1, step: 0.05 },
  { group: 'Hold the orb', key: 'holdCamUp', label: 'Camera: how far up', min: 0, max: 20, step: 0.5 },
  { group: 'Hold the orb', key: 'holdCamBack', label: 'Camera: how far back', min: -10, max: 40, step: 0.5 },
  { group: 'Hold the orb', key: 'holdCamTilt', label: 'Camera: how much it looks down', min: 0, max: 1, step: 0.05 },
  { group: 'Hold the orb', key: 'holdRise', label: 'Orb lifts', min: 0, max: 5, step: 0.1 },
  { group: 'Hold the orb', key: 'holdOrbShake', label: 'Orb shake', min: 0, max: 6, step: 0.05 },
  { group: 'Hold the orb', key: 'holdScreenShake', label: 'Screen shake', min: 0, max: 2, step: 0.05 },
  { group: 'Hold the orb', key: 'holdGroundShake', label: 'Ground tremble', min: 0, max: 3, step: 0.05 },
  { group: 'Hold the orb', key: 'holdShock', label: 'Let go: shockwave ring and jolt', min: 0, max: 2, step: 0.05 },
  { group: 'Hold the orb', key: 'holdVignette', label: 'Screen edges darken', min: 0, max: 1, step: 0.05 },
  { group: 'Hold the orb', key: 'holdVibrate', label: 'Phone buzz builds with the charge (0 off; Android only)', min: 0, max: 1, step: 0.05 },
  { group: 'Boiling lake', key: 'holdBoilArea', label: 'How much of the lake (radius)', min: 2, max: 120, step: 1 },
  { group: 'Boiling lake', key: 'holdBoilLift', label: 'Water surface heaves up (real height)', min: 0, max: 3, step: 0.05 },
  { group: 'Boiling lake', key: 'holdBoilHeight', label: 'Surface bubbling', min: 0, max: 3, step: 0.05 },
  { group: 'Boiling lake', key: 'holdBoilSpeed', label: 'Speed', min: 0.2, max: 3, step: 0.05 },
  { group: 'Boiling lake', key: 'holdBoilSpecks', label: 'White specks', min: 0, max: 2, step: 0.05 },
  { group: 'Hold the orb', key: 'holdSky', label: 'Sky turning', min: 0, max: 3, step: 0.05 },
  { group: 'Orb extras', key: 'orbBloom', label: 'Bloom (light bleeding out of it)', min: 0, max: 2, step: 0.05 },
  { group: 'Orb extras', key: 'orbGlass', label: 'Glass shell (bends the stars behind it)', min: 0, max: 1, step: 0.05 },
  { group: 'Orb extras', key: 'orbDepth', label: 'Depth inside (layers of wind within)', min: 0, max: 2, step: 0.05 },
  { group: 'Orb extras', key: 'orbFlashLight', label: 'Lightning lights the inside of the orb', min: 0, max: 2, step: 0.05 },
  { group: 'Orb extras', key: 'orbFlashLand', label: 'Lightning on the land and water (strength)', min: 0, max: 4, step: 0.05 },
  { group: 'Orb extras', key: 'orbFlashReach', label: 'Lightning on the land (how far it reaches)', min: 5, max: 150, step: 1 },
  { group: 'Orb extras', key: 'orbMirror', label: 'Real reflection of the orb in the water', min: 0, max: 1.5, step: 0.05 },
  { group: 'Orb extras', key: 'orbRays', label: 'Light shafts and mist', min: 0, max: 2, step: 0.05 },
  { group: 'Orb extras', key: 'orbFringe', label: 'Rainbow edge', min: 0, max: 1.5, step: 0.05 },
  { group: 'Orb extras', key: 'orbParticles', label: 'Charged sparks circling it', min: 0, max: 1, step: 0.05 },
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
  { group: 'Riverbed pipe', key: 'pipeFluid', label: 'Fluid (0 blue water + data, 1 white ink) · all pipes', min: 0, max: 1, step: 1 },
  { group: 'Riverbed pipe', key: 'inkHue', label: 'Fluid colour: hue (red → yellow → green → blue → pink)', min: 0, max: 360, step: 1 },
  { group: 'Riverbed pipe', key: 'inkSat', label: 'Fluid colour: how much colour (0 white)', min: 0, max: 1, step: 0.02 },
  { group: 'Riverbed pipe', key: 'inkLight', label: 'Fluid colour: brightness', min: 0.3, max: 1, step: 0.02 },
  { group: 'Riverbed pipe', key: 'inkSpeed', label: 'White ink: flow speed', min: 0.2, max: 4, step: 0.05 },
  { group: 'Riverbed pipe', key: 'inkThick', label: 'White ink: how solid', min: 0.2, max: 1.6, step: 0.05 },
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
  { group: 'Quote', key: 'quote', label: 'Which quote', min: 0, max: QUOTES.length - 1, step: 1, names: QUOTES },
  { group: 'Quote', key: 'quoteText', label: 'Your own words (empty = use the slider)', min: 0, max: 0, step: 0, text: true },
  { group: 'Quote', key: 'quoteOn', label: 'Show it (0 off, 1 on)', min: 0, max: 1, step: 1 },
  { group: 'Quote', key: 'quoteFont', label: 'Font', min: 0, max: 13, step: 1, names: BRAND_FONTS.map((f) => f[0]) },
  { group: 'Quote', key: 'quoteSize', label: 'Text size', min: 0.4, max: 3, step: 0.05 },
  { group: 'Quote', key: 'quoteWeight', label: 'Weight (thin ← → heavy)', min: 100, max: 900, step: 100 },
  { group: 'Quote', key: 'quoteSpacing', label: 'Letter spacing', min: -0.05, max: 0.4, step: 0.01 },
  { group: 'Quote', key: 'quoteCaps', label: 'Capitals (0 off, 1 on)', min: 0, max: 1, step: 1 },
  { group: 'Quote', key: 'quoteAlign', label: 'Place (0 left, 1 middle, 2 right)', min: 0, max: 2, step: 1 },
  { group: 'Quote', key: 'quoteWidth', label: 'Line length', min: 12, max: 70, step: 1 },
  { group: 'Quote', key: 'quoteLift', label: 'Move up / down', min: -5, max: 40, step: 0.5 },
  // Soft frosted-glass patch behind the quote
  { group: 'Quote pop', key: 'qpFrame', label: 'Frame round it', min: 0, max: 5, step: 1, names: ['None', 'Thin outline', 'Glowing outline', 'Corner brackets', 'Line above and below', 'Light running round the edge'] },
  { group: 'Quote pop', key: 'qpBright', label: 'Frame brightness', min: 0.05, max: 1, step: 0.05 },
  { group: 'Quote pop', key: 'qpBlue', label: 'Frame colour (white ← → blue)', min: 0, max: 1, step: 0.05 },
  { group: 'Quote pop', key: 'qpGlow', label: 'Glow behind the words', min: 0, max: 2, step: 0.05 },
  { group: 'Quote pop', key: 'qpHi', label: 'Colour the "~25% cheaper" words (0 off, 1 on)', min: 0, max: 1, step: 1 },
  { group: 'Quote pop', key: 'qpAnim', label: 'Movement', min: 0, max: 3, step: 1, names: ['None', 'Shine sweeps across the words', 'Soft pulse', 'Gentle float'] },
  { group: 'Quote pop', key: 'qpSpeed', label: 'Movement speed (slow ← → fast)', min: 0.3, max: 3, step: 0.05 },
  { group: 'Quote background', key: 'qbColour', label: 'Background colour', min: 0, max: 7, step: 1, names: ['Black', 'Charcoal', 'Midnight', 'Deep navy', 'Deep teal', 'Deep purple', 'Deep red', 'White (black words)'] },
  { group: 'Quote background', key: 'qbPadX', label: 'Width around the text', min: 0, max: 200, step: 2 },
  { group: 'Quote background', key: 'qbPadY', label: 'Height around the text', min: 0, max: 120, step: 2 },
  { group: 'Quote background', key: 'qbRadius', label: 'Rounded corners', min: 0, max: 120, step: 2 },
  // The page's colours: base, coloured light behind the glass, lit panel edges, one accent colour
  { group: 'Page look', key: 'baseDark', label: 'Background (0 grey, 1 blue-black)', min: 0, max: 1, step: 0.02 },
  { group: 'Page look', key: 'glowStrength', label: 'Coloured light behind the glass', min: 0, max: 1, step: 0.02 },
  { group: 'Page look', key: 'glowHue1', label: 'Light 1 colour (hue)', min: 0, max: 360, step: 1 },
  { group: 'Page look', key: 'glowHue2', label: 'Light 2 colour (hue)', min: 0, max: 360, step: 1 },
  { group: 'Page look', key: 'glowSize', label: 'Light size', min: 0.3, max: 2, step: 0.05 },
  { group: 'Page look', key: 'glowMove', label: 'Light slowly moving (0 still)', min: 0, max: 2, step: 0.05 },
  { group: 'Page look', key: 'edgeLight', label: 'Lit glass edge', min: 0, max: 1, step: 0.02 },
  { group: 'Page look', key: 'accentHue', label: 'Accent colour (hue)', min: 0, max: 360, step: 1 },
  { group: 'Page look', key: 'accentSat', label: 'Accent colour: how much colour (0 white)', min: 0, max: 1, step: 0.02 },
  { group: 'Page look', key: 'accentWords', label: 'Key words in the accent colour (0 off, 1 on)', min: 0, max: 1, step: 1 },
  // Low clouds over the wireframe land (3D)
  { group: 'Clouds over the land', key: 'cloudsOn', label: 'Show them (0 off, 1 on)', min: 0, max: 1, step: 1 },
  { group: 'Clouds over the land', key: 'cloudCount', label: 'How many', min: 0, max: 1, step: 0.02 },
  { group: 'Clouds over the land', key: 'cloudOpacity', label: 'How see-through (0 invisible)', min: 0, max: 1, step: 0.01 },
  { group: 'Clouds over the land', key: 'cloudSize', label: 'Size', min: 0.3, max: 3, step: 0.05 },
  { group: 'Clouds over the land', key: 'cloudFlat', label: 'Shape (flat ← → puffy)', min: 0.3, max: 2, step: 0.05 },
  { group: 'Clouds over the land', key: 'cloudHeight', label: 'Height above the ground', min: 0, max: 6, step: 0.1 },
  { group: 'Clouds over the land', key: 'cloudSpread', label: 'Gap kept from the water', min: 0, max: 1, step: 0.05 },
  { group: 'Clouds over the land', key: 'cloudDrift', label: 'Wind speed', min: 0, max: 4, step: 0.05 },
  { group: 'Clouds over the land', key: 'cloudOrbPush', label: 'Orb force field: push strength', min: 0, max: 3, step: 0.05 },
  { group: 'Clouds over the land', key: 'cloudOrbRadius', label: 'Orb force field: reach', min: 0.2, max: 3, step: 0.05 },
  { group: 'Clouds over the land', key: 'cloudTint', label: 'Colour (0 white, 1 moonlit blue)', min: 0, max: 1, step: 0.05 },
  // Clouds behind the rest of the page
  { group: 'Clouds behind the page', key: 'pageClouds', label: 'How many (0 none)', min: 0, max: 1, step: 0.02 },
  { group: 'Clouds behind the page', key: 'pageCloudOpacity', label: 'How see-through', min: 0, max: 1, step: 0.01 },
  { group: 'Clouds behind the page', key: 'pageCloudSize', label: 'Size', min: 0.3, max: 3, step: 0.05 },
  { group: 'Clouds behind the page', key: 'pageCloudDepth', label: 'Depth (0 still ← → moves with the page)', min: 0, max: 1, step: 0.02 },
  { group: 'Clouds behind the page', key: 'pageCloudDrift', label: 'Drift speed', min: 0, max: 4, step: 0.05 },
  { group: 'Clouds behind the page', key: 'pageCloudBlur', label: 'Extra softness (blur)', min: 0, max: 20, step: 0.5 },
  // The business reel
  { group: 'Businesses', key: 'bizLayout', label: 'Layout (0 3D reel, 1 stacked)', min: 0, max: 1, step: 1 },
  // "Scroll down" hint
  { group: 'Scroll hint', key: 'shOn', label: 'Show it (0 off, 1 on)', min: 0, max: 1, step: 1 },
  { group: 'Scroll hint', key: 'shText', label: 'Words (| starts a new line; empty = arrow only)', min: 0, max: 0, step: 0, text: true },
  { group: 'Scroll hint', key: 'shHiWords', label: 'Words in colour (exact words, comma between)', min: 0, max: 0, step: 0, text: true },
  { group: 'Scroll hint', key: 'shHiHue', label: 'Their colour (0 red, 300 magenta)', min: 0, max: 360, step: 5 },
  { group: 'Scroll hint', key: 'shHiSat', label: 'How strong the colour is', min: 0, max: 1, step: 0.05 },
  { group: 'Scroll hint', key: 'shArrow', label: 'Arrow style', min: 0, max: 7, step: 1, names: ['Chevron', 'Double chevron', 'Thin arrow', 'Long line arrow', 'Mouse', 'Triangle', 'Circle', 'None'] },
  { group: 'Scroll hint', key: 'shAnim', label: 'Movement', min: 0, max: 5, step: 1, names: ['Still', 'Bounce down', 'Float up and down', 'Fade in and out', 'Drop and fade', 'Line runs down'] },
  { group: 'Scroll hint', key: 'shSpeed', label: 'Seconds per move', min: 0.6, max: 5, step: 0.1 },
  { group: 'Scroll hint', key: 'shTravel', label: 'How far it moves', min: 0, max: 30, step: 1 },
  { group: 'Scroll hint', key: 'shLayout', label: 'Arrow (0 under words, 1 above, 2 right)', min: 0, max: 2, step: 1 },
  { group: 'Scroll hint', key: 'shFont', label: 'Font', min: 0, max: 13, step: 1, names: BRAND_FONTS.map((f) => f[0]) },
  { group: 'Scroll hint', key: 'shSize', label: 'Size', min: 0.5, max: 2.5, step: 0.05 },
  { group: 'Scroll hint', key: 'shSpacing', label: 'Letter spacing', min: 0, max: 0.8, step: 0.02 },
  { group: 'Scroll hint', key: 'shCaps', label: 'Capitals (0 off, 1 on)', min: 0, max: 1, step: 1 },
  { group: 'Scroll hint', key: 'shBright', label: 'Brightness', min: 0.1, max: 1, step: 0.05 },
  { group: 'Scroll hint', key: 'shPlace', label: 'Place (0 top ← → 100 bottom of screen)', min: 0, max: 100, step: 1 },
  // The name and logo above the orb
  { group: 'Name and logo', key: 'brandFont', label: 'Font', min: 0, max: 13, step: 1, names: BRAND_FONTS.map((f) => f[0]) },
  { group: 'Name and logo', key: 'brandSize', label: 'Text size', min: 0.5, max: 2.5, step: 0.05 },
  { group: 'Name and logo', key: 'brandWeight', label: 'Weight (thin ← → heavy)', min: 100, max: 900, step: 100 },
  { group: 'Name and logo', key: 'brandSpacing', label: 'Letter spacing', min: -0.08, max: 0.6, step: 0.01 },
  { group: 'Name and logo', key: 'brandCaps', label: 'Capitals (0 off, 1 on)', min: 0, max: 1, step: 1 },
  { group: 'Name and logo', key: 'groupSize', label: '"GROUP" size (vs the line above)', min: 0.3, max: 1.5, step: 0.02 },
  { group: 'Name and logo', key: 'brandLine', label: 'Gap between the two lines', min: 0.8, max: 2, step: 0.02 },
  { group: 'Name and logo', key: 'logoOn', label: 'Show the logo (0 off, 1 on)', min: 0, max: 1, step: 1 },
  { group: 'Name and logo', key: 'logoSize', label: 'Logo size', min: 0.3, max: 3, step: 0.05 },
  { group: 'Name and logo', key: 'logoPlace', label: 'Where the logo sits', min: 0, max: 1, step: 1, names: ['Above the name', 'Left of the name'] },
  { group: 'Name and logo', key: 'logoGap', label: 'Gap between logo and name', min: 0, max: 60, step: 1 },
  { group: 'Name and logo', key: 'brandLift', label: 'Move up / down', min: -20, max: 30, step: 0.5 },
  { group: 'Name and logo', key: 'phoneLayout', label: 'Phones: space the first screen evenly by itself (0 off: the sliders above place things)', min: 0, max: 1, step: 1, names: ['Off', 'On'] },
];

// First-screen text sizes follow one scale (18 Nov 2026, from phone guidance: nothing under 12 px, the button's
// words 16 px, the name the largest thing): on a 393-wide phone the name is 22 px, the logo 44 px, the button's
// words 16 px, the menu 14 px, the quote 13 px and the scroll hint 12.6 px. brandSize 1, logoSize 0.95,
// quoteSize 0.72 and shSize 1.15 give those numbers; site.css holds the menu and button sizes.
// Markus's settings from the tuner, 17 Nov 2026 (final round, 15:17 Brisbane), with his changes of 18 Nov 19:07.
export const DEFAULTS: Record<string, number> = {
  introFade: 3, introStyle: 2, introSpawn: 1.5, introLoop: 0,
  holdOn: 1, holdVibrate: 1, holdFlyOff: 1, holdBolts: 2, holdSkyStrike: 3, holdBoil: 0.25, holdZoom: 1, holdSky: 3,
  holdCamUp: 10, holdCamBack: 30, holdCamTilt: 0.7, holdRise: 5, holdOrbShake: 6, holdScreenShake: 2, holdGroundShake: 2.5, holdShock: 1, holdVignette: 0,
    holdBoilArea: 15, holdBoilLift: 3, holdBoilHeight: 1.05, holdBoilSpeed: 2, holdBoilSpecks: 0.35, holdBuild: 3, holdNova: 0.05, holdNovaWave: 10.55, holdNovaWaveSpeed: 75, holdCalm: 3, holdFxGlobs: 0, holdFxGround: 1, shHiHue: 300, shHiSat: 1, holdFxAmount: 0.9, holdFxSpeed: 3,
  orbBloom: 0.15, orbGlass: 0.65, orbDepth: 0.55, orbFlashLight: 0.2, orbFlashLand: 0.2, orbFlashReach: 12, orbMirror: 1.5, orbRays: 0, orbFringe: 0.25, orbParticles: 0.05,
  orbStyle: 0, orbFlow: 3.5, orbHue: 0, orbSpin: 1.7, orbStreaks: 0.6, orbSparks: 2.05, orbSparkRate: 2.75, orbSize: 1.16, orbHeight: -2, orbGlow: 0,
  waterDesign: 1, waterTexture: 4, waterRipples: 0.55, swirlSize: 2.25, swirlDepth: 3, swirlSpeed: 3, swirlLines: 2.55, swirlSoft: 3, waterFoam: 0,
  waterGlint: 2.05, waterReflect: 1.1, waterColour: 3, waterSheen: 1.05, sprayAmount: 0.1, spraySize: 0,
  camZoom: 2, camUp: 0, fogNear: 0.2, fogFar: 0.6, fov: 63, gridLines: 0.5,
  wordsOn: 0, starsOn: 1, logoOn: 1, logoStyle: 1, groupSize: 0.7, waterClear: 0.18,
  starsEvery: 2.5, starsLength: 1.4, starsSpeed: 2, starsBright: 0.3, starsWidth: 0.65, starsSteep: 1.05,
  pipeOn: 0, pipeFluid: 1, inkHue: 140, inkSat: 0, inkLight: 1, inkSpeed: 4, inkThick: 0.3, pipeRadius: 4, pipeLift: -0.45, pipeGlass: 2.3, pipeRim: 0.15, pipeGlow: 0.7, dataCount: 1, dataSize: 2.65, dataSpeed: 5, dataBright: 2.4, dataColour: 2, wordsFont: 10, wordsSize: 0.7, wordsDepth: 1.25, wordsZ: 26.5, wordsX: 0, wordsY: 0, wordsBright: 1, wordsReflect: 0.04, wordsFade: 0.3,
  quote: 15, quoteOn: 1, quoteFont: 6, quoteSize: 0.72, quoteWeight: 400, quoteSpacing: 0.09, quoteCaps: 0, quoteAlign: 1, quoteWidth: 42, quoteLift: 7,
  qpFrame: 1, qpBright: 1, qpBlue: 0, qpGlow: 0, qpHi: 1, qpAnim: 0, qpSpeed: 1,
  qbColour: 0, qbPadX: 32, qbPadY: 12, qbRadius: 120,
  bizLayout: 0,
  baseDark: 1, glowStrength: 0.7, glowHue1: 205, glowHue2: 170, glowSize: 1, glowMove: 0.6, edgeLight: 0.6, accentHue: 195, accentSat: 0.75, accentWords: 1,
  cloudsOn: 0, cloudCount: 0.68, cloudOpacity: 0.54, cloudSize: 2.75, cloudFlat: 0.9, cloudHeight: 0.9, cloudSpread: 0.45, cloudDrift: 2.95, cloudOrbPush: 1.5, cloudOrbRadius: 2.35, cloudTint: 0.85,
  pageClouds: 0, pageCloudOpacity: 0.22, pageCloudSize: 1.35, pageCloudDepth: 0.35, pageCloudDrift: 0.6, pageCloudBlur: 6,
  shOn: 1, shArrow: 6, shAnim: 1, shSpeed: 2, shTravel: 10, shLayout: 0, shFont: 2, shSize: 1.15, shSpacing: 0.12, shCaps: 0, shBright: 1, shPlace: 35,
  brandFont: 3, brandSize: 1, brandWeight: 100, brandSpacing: -0.01, brandCaps: 1, brandLine: 1.04, logoSize: 0.95, logoPlace: 1, logoGap: 13, brandLift: 17, phoneLayout: 1,
};

export const T: Record<string, number> = { ...DEFAULTS };
/** Settings that are words, not numbers. */
export const TEXT_DEFAULTS: Record<string, string> = { shText: 'Scroll for Web-Page or | Press & Hold Orb for Fun', quoteText: '', shHiWords: 'Fun' };
export const TX: Record<string, string> = { ...TEXT_DEFAULTS };

const STORE = 'ddg-scene-tune-49'; // new name, so old saved slider positions don't override these defaults
/** The fluid's colour (white ink by default), 0-1 RGB: white mixed towards a pure hue, times brightness. */
export function fluidRGB(k: Record<string, number> = T): [number, number, number] {
  const h = (k.inkHue ?? 200) / 60, x = 1 - Math.abs((h % 2) - 1);
  const [r, g, b] = h < 1 ? [1, x, 0] : h < 2 ? [x, 1, 0] : h < 3 ? [0, 1, x] : h < 4 ? [0, x, 1] : h < 5 ? [x, 0, 1] : [1, 0, x];
  const s = k.inkSat ?? 0, l = k.inkLight ?? 1, mix = (c: number) => (1 - s + s * (0.35 + 0.65 * c)) * l;
  return [mix(r), mix(g), mix(b)];
}

export function tuneOn(): boolean {
  return !!(window as unknown as { __DDG_TUNE__?: unknown }).__DDG_TUNE__ || /tune/.test(location.hash);
}

/** Build the slider panel. Returns a function that removes it. */
let replayTimer = 0;

export function mountPanel(): () => void {
  try { Object.assign(T, JSON.parse(localStorage.getItem(STORE) || '{}')); } catch { /* storage may be blocked */ }
  try { Object.assign(TX, JSON.parse(localStorage.getItem(STORE + '-text') || '{}')); } catch { /* ignore */ }
  const save = () => { try { localStorage.setItem(STORE, JSON.stringify(T)); localStorage.setItem(STORE + '-text', JSON.stringify(TX)); } catch { /* ignore */ } };
  const root = document.createElement('div');
  root.className = 'tune';
  const css = document.createElement('style');
  css.textContent = `
.tune { position: fixed; top: 12px; right: 12px; bottom: 12px; width: 320px; z-index: 2147483600; display: flex; flex-direction: column;
  background: rgba(10,13,20,0.88); border: 1px solid rgba(255,255,255,0.14); border-radius: 14px; color: #dfe8f2;
  font: 12px/1.3 ui-sans-serif, system-ui, sans-serif; backdrop-filter: blur(10px); box-shadow: 0 10px 40px rgba(0,0,0,0.5); }
/* Hidden: nothing is left but one small "Show" button in the corner. */
.tune.min { bottom: auto; width: auto; background: none; border: 0; box-shadow: none; backdrop-filter: none; }
.tune.min .tune-body, .tune.min .tune-foot, .tune.min .tune-head b { display: none; }
.tune.min .tune-head { padding: 0; border: 0; } .tune.min button { opacity: 0.55; }
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
.tune .tune-text { width: 100%; box-sizing: border-box; margin-top: 4px; background: rgba(0,0,0,0.35); color: #fff; border: 1px solid rgba(255,255,255,0.18); border-radius: 6px; padding: 5px 7px; font: inherit; }
.tune-foot { padding: 10px 12px; border-top: 1px solid rgba(255,255,255,0.1); display: grid; gap: 8px; }
.tune textarea { width: 100%; box-sizing: border-box; height: 90px; resize: vertical; background: rgba(0,0,0,0.35); color: #cfe; border: 1px solid rgba(255,255,255,0.14); border-radius: 8px; font: 11px ui-monospace, monospace; padding: 6px; }
.tune-foot div { display: flex; gap: 8px; }
.tune-note { color: #8fa2b5; font-size: 11px; }`;
  root.innerHTML = `<div class="tune-head"><b>Scene settings</b><button data-act="min">Hide</button></div><div class="tune-body"></div>
<div class="tune-foot"><div><button class="go" data-act="copy">Copy settings</button><button data-act="reset">Reset all</button></div>
<textarea readonly></textarea><p class="tune-note">Changes show straight away. When it looks right, press Copy settings and paste it to Claude (or send a screenshot of this box).</p></div>`;
  const body = root.querySelector('.tune-body')!, out = root.querySelector('textarea')!;
  const changed = () => {
    const diff: Record<string, number | string> = {};
    for (const s of SPECS) {
      if (s.text) { if (TX[s.key] !== TEXT_DEFAULTS[s.key]) diff[s.key] = TX[s.key]; }
      else if (T[s.key] !== DEFAULTS[s.key]) diff[s.key] = T[s.key];
    }
    out.value = 'DDG scene settings (changed from default):\n' + JSON.stringify(diff, null, 1);
  };
  const inputs: Record<string, [HTMLInputElement, HTMLElement]> = {};
  const texts: Record<string, HTMLInputElement> = {};
  const input0 = (k: string) => inputs[k][0].dispatchEvent(new Event('input'));
  let group = '';
  let box: HTMLElement = body as HTMLElement;
  let folded: string[] = [];
  try { folded = JSON.parse(localStorage.getItem(STORE + '-folded') || '[]'); } catch { /* ignore */ }
  // Effects switched off (set to 0) are moved to one closed group at the bottom, "Inactive", until turned
  // up again. Only effect groups; choosers and layout settings stay where they are.
  const EFFECT_GROUPS = ['Orb extras', 'Hold the orb', 'Boiling lake'];
  const canSleep = (sp: Spec) => !sp.text && !sp.names && EFFECT_GROUPS.includes(sp.group) && sp.min === 0;
  const inactive = (sp: Spec) => canSleep(sp) && T[sp.key] === 0;
  const ordered = [...SPECS.filter((sp) => !inactive(sp)), ...SPECS.filter(inactive).map((sp) => ({ ...sp, group: 'Inactive (set to 0)', label: `${sp.group}: ${sp.label}` }))];
  for (const s of ordered) {
    if (s.group !== group) {
      group = s.group;
      const sec = document.createElement('section');
      sec.innerHTML = `<h4 data-act="fold">${group}</h4>${group === 'Load-in' ? '<button data-act="replay">Replay the load-in</button>' : ''}`;
      sec.classList.add('folded'); // every group starts closed (Markus, 18 Nov)
      body.appendChild(sec);
      box = sec;
    }
    const l = document.createElement('label');
    if (s.text) {
      l.innerHTML = `<span>${s.label}</span><input type="text" class="tune-text">`;
      const ti = l.querySelector('input')!;
      ti.value = TX[s.key] ?? '';
      ti.addEventListener('input', () => { TX[s.key] = ti.value; changed(); save(); });
      texts[s.key] = ti;
      box.appendChild(l);
      continue;
    }
    l.innerHTML = `<span>${s.label}<i></i></span><input type="range" min="${s.min}" max="${s.max}" step="${s.step}">`;
    const input = l.querySelector('input')!, val = l.querySelector('i')!;
    const show = (v: number) => (s.names ? `${v} · ${s.names[v] ?? ''}` : String(v));
    input.value = String(T[s.key]); val.textContent = show(T[s.key]);
    input.addEventListener('change', () => { const o = SPECS.find((x) => x.key === s.key)!; if (canSleep(o)) moveSlider(body as HTMLElement, l, o, T[s.key] === 0); });
    input.addEventListener('input', () => { T[s.key] = Number(input.value); val.textContent = show(T[s.key]); changed(); save(); if (s.group === 'Load-in') replaySoon(); });
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
    if (act === 'replay') replayNow();
    if (act === 'min') { root.classList.toggle('min'); (e.target as HTMLElement).textContent = root.classList.contains('min') ? 'Show' : 'Hide'; }
    if (act === 'reset') { Object.assign(T, DEFAULTS); Object.assign(TX, TEXT_DEFAULTS); for (const k in texts) texts[k].value = TX[k]; for (const s of SPECS) { if (s.text) continue; inputs[s.key][0].value = String(T[s.key]); inputs[s.key][1].textContent = String(T[s.key]); input0(s.key); } changed(); save(); }
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
  // Load-in replays: after a slider stops moving, and on a loop when "Replay it on a loop" is on.
  let lastPlay = performance.now();
  const loop = window.setInterval(() => {
    if (T.introLoop > 0.5 && performance.now() - lastPlay > (T.introFade + T.introSpawn + 3) * 1000) replayNow();
  }, 250);
  function replayNow() { lastPlay = performance.now(); replayIntro(T.introFade * 1000); }
  function replaySoon() { window.clearTimeout(replayTimer); replayTimer = window.setTimeout(replayNow, 400); }
  return () => { window.clearInterval(loop); window.clearTimeout(replayTimer); root.remove(); css.remove(); };
}

const INACTIVE = 'Inactive (set to 0)';
/** Live: a slider let go at 0 moves to "Inactive"; turned up again it goes back to its own group. */
function moveSlider(body: HTMLElement, l: HTMLElement, s: Spec, off: boolean): void {
  const want = off ? INACTIVE : s.group;
  const find = (g: string) => [...body.querySelectorAll('section')].find((x) => x.querySelector('h4')?.textContent === g);
  const from = l.parentElement;
  let sec = find(want);
  if (sec === from) return;
  if (!sec) {
    sec = document.createElement('section');
    sec.innerHTML = `<h4 data-act="fold">${want}</h4>`;
    const last = find(INACTIVE);
    if (off || !last) body.appendChild(sec); else body.insertBefore(sec, last);
  }
  (l.querySelector('span')!.firstChild as Text).textContent = off ? `${s.group}: ${s.label}` : s.label;
  sec.appendChild(l);
  if (from && !from.querySelector('label')) from.remove();
}

/** Put the name-and-logo settings on the page (CSS variables), loading the chosen web font. */
let lastBrand = '';
let lastFade = '';
const BG_KEYS = ['qbColour', 'qbPadX', 'qbPadY', 'qbRadius'];
/** Background colours behind the quote (Markus, 18 Nov: one simple choice, black by default). */
const QB_COLOURS = [[0, 0, 0], [20, 21, 24], [6, 10, 22], [4, 14, 36], [2, 24, 28], [18, 8, 32], [30, 6, 10], [255, 255, 255]];
const HINT_KEYS = ['baseDark', 'glowStrength', 'glowHue1', 'glowHue2', 'glowSize', 'edgeLight', 'accentHue', 'accentSat', 'accentWords', 'pipeFluid', 'inkHue', 'inkSat', 'inkLight', 'bizLayout', 'shOn', 'shArrow', 'shAnim', 'shSpeed', 'shTravel', 'shLayout', 'shFont', 'shSize', 'shSpacing', 'shCaps', 'shBright', 'shPlace'];
/** Arrow drawings for the scroll hint (24 wide, drawn in currentColor). */
const ARROWS = [
  '<svg viewBox="0 0 24 14" width="24" height="14"><path d="M3 3l9 8 9-8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  '<svg viewBox="0 0 24 22" width="24" height="22"><path d="M4 3l8 7 8-7M4 11l8 7 8-7" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  '<svg viewBox="0 0 24 26" width="24" height="26"><path d="M12 2v21M5 16l7 7 7-7" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  '<svg viewBox="0 0 24 56" width="24" height="56"><path d="M12 2v51" stroke="currentColor" stroke-width="1" stroke-linecap="round"/><path d="M7.5 48.5l4.5 4.5 4.5-4.5" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  '<svg viewBox="0 0 24 36" width="24" height="36"><rect x="3" y="1.5" width="18" height="30" rx="9" fill="none" stroke="currentColor" stroke-width="1.4"/><circle class="sh-dot" cx="12" cy="9" r="2" fill="currentColor"/></svg>',
  '<svg viewBox="0 0 24 14" width="24" height="14"><path d="M5 3h14l-7 9z" fill="currentColor"/></svg>',
  '<svg viewBox="0 0 30 30" width="30" height="30"><circle cx="15" cy="15" r="13.5" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="M9.5 12.5l5.5 5 5.5-5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  '',
];
export function applyBrand(): void {
  const key = ['brandFont', 'brandSize', 'brandWeight', 'brandSpacing', 'brandCaps', 'brandLine', 'logoSize', 'logoPlace', 'logoGap', 'brandLift', 'logoOn', 'logoStyle', 'groupSize', 'quote', 'quoteOn', 'quoteFont', 'quoteSize', 'quoteWeight', 'quoteSpacing', 'quoteCaps', 'quoteAlign', 'quoteWidth', 'quoteLift', 'qpFrame', 'qpBright', 'qpBlue', 'qpGlow', 'qpHi', 'qpAnim', 'qpSpeed', ...BG_KEYS, ...HINT_KEYS].map((k) => T[k]).join(',') + TX.shText + '|' + TX.quoteText + '|' + TX.shHiWords + '|' + T.shHiHue + '|' + T.shHiSat;
  // The hint fades away as soon as the visitor starts scrolling.
  const fade = String(Math.max(0, 1 - scrollY / (innerHeight * 0.2)).toFixed(3));
  if (fade !== lastFade) { lastFade = fade; document.documentElement.style.setProperty('--hint-fade', fade); }
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
  if (q) {
    const words = TX.quoteText || QUOTES[T.quote] || QUOTES[0];
    const holder = q.querySelector<HTMLElement>('.cn-quote-t') ?? q;
    // The price words ("~25% cheaper") can be picked out in the accent colour. Built as text nodes, never as HTML.
    holder.textContent = '';
    const parts = T.qpHi ? words.split(/(~?\d+%(?:\s+cheaper)?)/i) : [words];
    parts.forEach((part, i) => {
      if (!part) return;
      if (i % 2) { const b = document.createElement('b'); b.className = 'cn-quote-hi'; b.textContent = part; holder.appendChild(b); }
      else holder.appendChild(document.createTextNode(part));
    });
    q.style.display = T.quoteOn ? '' : 'none';
    for (let i = 0; i <= 5; i++) q.classList.toggle(`qp-${i}`, T.qpFrame === i);
    for (let i = 0; i <= 3; i++) q.classList.toggle(`qa-${i}`, T.qpAnim === i);
  }
  const b = T.qpBlue;
  s.setProperty('--qp-rgb', `${Math.round(255 - 147 * b)},${Math.round(255 - 56 * b)},${Math.round(255 - 15 * b)}`);
  s.setProperty('--qp-bright', String(T.qpBright));
  s.setProperty('--qp-glow', String(T.qpGlow));
  s.setProperty('--qp-dur', `${(6 / T.qpSpeed).toFixed(2)}s`);
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
  // The patch behind the quote: one solid colour (a touch lighter at the top), the same box as the frame.
  const qc = QB_COLOURS[T.qbColour] ?? QB_COLOURS[0]!;
  s.setProperty('--qb-bg', `linear-gradient(180deg, rgb(${qc.map((v) => Math.min(255, v + 10)).join(',')}), rgb(${qc.join(',')}))`);
  // On a light patch the words (the picked-out ones too) are black; on a dark one they keep their own colours.
  s.setProperty('--quote-ink', qc[0]! + qc[1]! + qc[2]! > 380 ? '#000' : '');
  s.setProperty('--qb-padx', `${T.qbPadX}px`);
  s.setProperty('--qb-pady', `${T.qbPadY}px`);
  s.setProperty('--qb-radius', `${T.qbRadius}px`);
  // Page look: background tone, coloured light behind the glass, lit edges, the accent colour.
  const mixHex = (a: number[], b: number[], k: number) => `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * k)).join(',')})`;
  s.setProperty('--site-base', mixHex([20, 21, 24], [9, 11, 17], T.baseDark));
  const hsl = (h: number, sat: number, l: number, a: number) => `hsla(${h}, ${Math.round(sat * 100)}%, ${l}%, ${a})`;
  s.setProperty('--glow-a', hsl(T.glowHue1, 0.85, 45, 0.22 * T.glowStrength));
  s.setProperty('--glow-b', hsl(T.glowHue2, 0.8, 42, 0.18 * T.glowStrength));
  s.setProperty('--glow-c', hsl((T.glowHue1 + T.glowHue2) / 2 + 40, 0.7, 45, 0.1 * T.glowStrength));
  s.setProperty('--glow-size', `${46 * T.glowSize}vmax`);
  s.setProperty('--edge-top', String(0.14 * T.edgeLight));
  s.setProperty('--edge-shine', String(0.55 * T.edgeLight));
  const accent = hsl(T.accentHue, T.accentSat, 100 - 32 * T.accentSat, 1);
  s.setProperty('--j-accent', accent);
  s.setProperty('--j-word', T.accentWords ? accent : 'inherit');
  // Blue water or white ink in every pipe on the page (site.css, .pipe-ink).
  document.documentElement.classList.toggle('pipe-ink', T.pipeFluid === 1);
  s.setProperty('--pipe-fluid', `rgb(${fluidRGB().map((v) => Math.round(v * 255)).join(',')})`);
  // The business reel: 3D reel or three stacked cards.
  const biz = document.querySelector('.j-biz');
  if (biz) {
    biz.classList.toggle('j-stack', T.bizLayout === 1);
    if (T.bizLayout === 1) biz.querySelectorAll('.j-card').forEach((c) => { c.removeAttribute('inert'); c.removeAttribute('aria-hidden'); });
  }
  // The scroll hint.
  const h = document.querySelector<HTMLElement>('.cn-scroll');
  if (h) {
    h.style.display = T.shOn ? '' : 'none';
    h.className = `cn-scroll lay-${T.shLayout} anim-${T.shAnim}`;
    const w = h.querySelector<HTMLElement>('.cn-scroll-words'), a = h.querySelector<HTMLElement>('.cn-scroll-arrow');
    if (w) {
      // Chosen words in colour (built as text nodes, never as HTML).
      const pick = (TX.shHiWords || '').split(',').map((x) => x.trim().toLowerCase()).filter(Boolean);
      w.textContent = '';
      // A "|" in the words starts a new line (site.css keeps line breaks in this box).
      for (const part of (TX.shText || '').replace(/\s*\|\s*/g, '\n').split(/(\s+)/)) {
        if (pick.includes(part.replace(/[^\p{L}\p{N}]/gu, '').toLowerCase()) && part.trim()) {
          const b = document.createElement('span'); b.className = 'cn-scroll-hi'; b.textContent = part; w.appendChild(b);
        } else w.appendChild(document.createTextNode(part));
      }
      w.style.display = TX.shText ? '' : 'none';
      w.style.setProperty('--sh-hi', `hsl(${T.shHiHue}, ${Math.round(T.shHiSat * 100)}%, ${70 - 10 * T.shHiSat}%)`);
    }
    if (a) { a.innerHTML = ARROWS[T.shArrow] ?? ''; a.style.display = ARROWS[T.shArrow] ? '' : 'none'; }
  }
  s.setProperty('--sh-font', fontOf(T.shFont));
  s.setProperty('--sh-speed', `${T.shSpeed}s`);
  s.setProperty('--sh-travel', `${T.shTravel}px`);
  s.setProperty('--sh-size', String(T.shSize));
  s.setProperty('--sh-track', `${T.shSpacing}em`);
  s.setProperty('--sh-case', T.shCaps ? 'uppercase' : 'none');
  s.setProperty('--sh-bright', String(T.shBright));
  s.setProperty('--sh-place', String(T.shPlace));
  s.setProperty('--brand-size', String(T.brandSize));
  s.setProperty('--brand-weight', String(T.brandWeight));
  s.setProperty('--brand-track', `${T.brandSpacing}em`);
  s.setProperty('--brand-case', T.brandCaps ? 'uppercase' : 'none');
  s.setProperty('--brand-line', String(T.brandLine));
  s.setProperty('--logo-size', String(T.logoSize));
  s.setProperty('--logo-white-show', T.logoOn ? 'block' : 'none');
  s.setProperty('--group-size', String(T.groupSize));
  s.setProperty('--logo-gap', `${T.logoGap}px`);
  s.setProperty('--brand-dir', T.logoPlace > 0.5 ? 'row' : 'column');
  s.setProperty('--brand-text', T.logoPlace > 0.5 ? 'left' : 'center');
  s.setProperty('--brand-lift', `${T.brandLift}vh`);
}
