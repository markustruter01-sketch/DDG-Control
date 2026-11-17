/**
 * White-ink line drawings for the home page. Each one explains a system in a short loop:
 * lines draw themselves in, hold, fade and start again (styles in site.css, under .ink-art).
 * They are plain SVG text so they cost nothing to load. Words in them are labels only.
 */

const L = (x: number, y: number, s: string, a: 'start' | 'middle' | 'end' = 'middle') =>
  `<text x="${x}" y="${y}" class="lab" text-anchor="${a}">${s}</text>`;
const draw = (d: string, delay: number, extra = '') => `<path pathLength="1" d="${d}" class="ink draw ${extra}" style="--d:${delay}s"/>`;
const flow = (d: string, delay = 0) => `<path pathLength="1" d="${d}" class="ink flow" style="animation-delay:-${delay}s"/>`;
const pop = (x: number, y: number, r: number, delay: number) => `<circle cx="${x}" cy="${y}" r="${r}" class="dot p" style="--d:${delay}s"/>`;
const svg = (w: number, h: number, body: string) =>
  `<svg viewBox="0 0 ${w} ${h}" class="ink-art" role="presentation" focusable="false" preserveAspectRatio="xMidYMid meet">${body}</svg>`;

/** A wireframe globe that turns. */
const globe = (cx: number, cy: number, r: number, dur = 7) => `
<circle cx="${cx}" cy="${cy}" r="${r}" class="ink dim"/>
<ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${r}" class="ink faint"><animate attributeName="rx" values="${r};1;${r}" dur="${dur}s" repeatCount="indefinite"/></ellipse>
<ellipse cx="${cx}" cy="${cy}" rx="1" ry="${r}" class="ink faint"><animate attributeName="rx" values="1;${r};1" dur="${dur}s" repeatCount="indefinite"/></ellipse>
<path d="M${cx - r} ${cy}h${2 * r}M${cx - r * 0.87} ${cy - r * 0.5}h${r * 1.74}M${cx - r * 0.87} ${cy + r * 0.5}h${r * 1.74}" class="ink faint"/>`;

/** A small square box with a label, drawn in. */
const box = (x: number, y: number, w: number, h: number, label: string, delay: number) =>
  `<rect pathLength="1" x="${x}" y="${y}" width="${w}" height="${h}" rx="7" class="ink draw" style="--d:${delay}s"/>` +
  `<text x="${x + w / 2}" y="${y + h / 2 + 3}" class="t" text-anchor="middle">${label}</text>`;

const clock = (cx: number, cy: number, delay: number) => `
<circle cx="${cx}" cy="${cy}" r="13" class="ink"/><path d="M${cx} ${cy}v-8" class="ink hand"/>
${draw(`M${cx - 6} ${cy + 1}l4 4 8-9`, delay)}`;

// ── DDG Finance: markets → four strategies → AI council → two brokers → orders with stops → hourly check
export const FINANCE_ART = svg(760, 300, `
${globe(86, 146, 60)}
${pop(64, 118, 2.8, 0)}${pop(110, 130, 2.8, 0.5)}${pop(72, 168, 2.8, 1)}${pop(104, 180, 2.8, 1.5)}${pop(52, 146, 2.8, 2)}${pop(120, 108, 2.8, 2.5)}
${L(86, 232, 'GLOBAL MARKETS')}${L(86, 246, 'STOCKS · INDEXES · BONDS')}${L(86, 258, 'GOLD · CRYPTO · FOREX')}
${flow('M146 146C170 146 176 86 206 86')}${flow('M146 146C172 146 180 128 206 128', 0.4)}${flow('M146 146C172 146 180 166 206 166', 0.8)}${flow('M146 146C170 146 176 208 206 208', 1.2)}
${box(206, 72, 104, 28, 'ATLAS', 0.2)}${box(206, 114, 104, 28, 'ATLAS V2', 0.45)}${box(206, 152, 104, 28, 'MOMENTUM', 0.7)}${box(206, 194, 104, 28, 'FOREX', 0.95)}
${L(258, 52, 'FOUR STRATEGIES')}
${flow('M310 86C340 86 336 140 352 146')}${flow('M310 128C334 128 338 142 352 146', 0.5)}${flow('M310 166C334 166 338 152 352 148', 0.9)}${flow('M310 208C340 208 336 154 352 150', 1.3)}
${draw('M388 106l36 20v40l-36 20-36-20v-40z', 1.2)}
<text x="388" y="151" class="t big" text-anchor="middle">AI</text>
<path d="M388 146m-58 0a58 22 0 1 0 116 0a58 22 0 1 0 -116 0" class="ink faint dash"/>
<circle r="3" class="dot"><animateMotion dur="5s" repeatCount="indefinite" path="M388 146m-58 0a58 22 0 1 0 116 0a58 22 0 1 0 -116 0"/></circle>
<circle r="3" class="dot"><animateMotion dur="5s" begin="-2.5s" repeatCount="indefinite" path="M388 146m-58 0a58 22 0 1 0 116 0a58 22 0 1 0 -116 0"/></circle>
${L(388, 214, 'AI RESEARCH COUNCIL')}${L(388, 228, 'TESTED BEFORE IT TRADES')}
${flow('M424 136C450 136 452 110 470 110')}${flow('M424 156C450 156 452 184 470 184', 0.6)}
${box(470, 96, 84, 28, 'BROKER 1', 1.6)}${box(470, 170, 84, 28, 'BROKER 2', 1.8)}
${L(512, 222, 'ORDERS + STOPS')}
${flow('M554 110H582')}${flow('M554 184H582', 0.5)}
<path d="M590 52v190h158" class="ink faint"/>
${draw('M596 214l18-14 16 8 18-28 16 10 18-34 16 12 18-40 18-10', 2)}
${draw('M596 232l36 0 0-12 36 0 0-16 36 0 0-20 40 0', 2.5, 'stop')}
${L(744, 120, 'STOP RISES', 'end')}
<path d="M630 204l4-6 4 6z" class="fill p" style="--d:2.4s"/><path d="M664 176l4-6 4 6z" class="fill p" style="--d:2.9s"/><path d="M698 140l4-6 4 6z" class="fill p" style="--d:3.4s"/>
${clock(724, 52, 3)}${L(700, 56, 'CHECKED HOURLY', 'end')}
`);

// ── DDG Coffee: beans → bag → online store → card checkout → order in Control → packed → your door; $1 to charity
export const COFFEE_ART = svg(760, 300, `
<g transform="rotate(-25 50 150)">${draw('M50 128a15 22 0 1 0 0.01 0z', 0)}${draw('M50 128c-8 10 8 22 0 44', 0.3)}</g>
${L(50, 206, 'BEANS')}
${flow('M74 150h22')}
${draw('M104 120h40l-4 12 6 56H102l6-56z M108 132h36', 0.6)}${draw('M116 160c3-6 15-6 18 0', 1)}
${L(124, 206, 'BAG')}
<g class="rise"><path d="M124 104c-4-6-12-2-8 4l8 8 8-8c4-6-4-10-8-4z" class="ink"/></g>
${L(124, 60, '$1 PER BAG → ANIMAL CHARITIES')}
${flow('M156 150h26')}
${draw('M190 88h60a6 6 0 0 1 6 6v112a6 6 0 0 1-6 6h-60a6 6 0 0 1-6-6V94a6 6 0 0 1 6-6z', 1)}
${draw('M196 104h48v30h-48z M196 142h48v30h-48z', 1.3)}${draw('M204 186h32', 1.6)}
${L(220, 236, 'ONLINE STORE')}
${flow('M264 150h26')}
${draw('M298 126h70a6 6 0 0 1 6 6v40a6 6 0 0 1-6 6h-70a6 6 0 0 1-6-6v-40a6 6 0 0 1 6-6z', 1.7)}<path d="M292 138h82" class="ink faint"/>${draw('M322 160l7 7 14-15', 2.1)}
${L(333, 206, 'CARD CHECKOUT')}
${flow('M382 150h26')}
${draw('M416 108h112v84H416z', 2.2)}<path d="M416 122h112" class="ink faint"/>
<g class="bars"><path d="M432 180v-16M448 180v-26M464 180v-20M480 180v-34M496 180v-24M512 180v-40" class="ink"/></g>
${L(472, 216, 'ORDER IN DDG CONTROL')}
${flow('M536 150h22')}
${draw('M568 136l22-11 22 11v28l-22 11-22-11z M568 136l22 11 22-11 M590 147v28', 2.6)}
${L(590, 206, 'PACKED')}
<path d="M612 168C640 236 690 236 712 176" class="ink faint dash"/>
<circle r="3.5" class="dot"><animateMotion dur="3.5s" repeatCount="indefinite" path="M612 168C640 236 690 236 712 176"/></circle>
${draw('M692 150l20-18 20 18v28h-40z M706 178v-12h12v12', 3)}
${L(712, 120, 'YOUR DOOR')}
`);

// ── DDG Fitness: a turning globe of people, AI agents circling it, a heartbeat. Coming soon, so nothing more.
const people: [number, number][] = [[330, 110], [420, 96], [450, 160], [380, 196], [320, 170], [400, 140], [352, 140], [436, 206], [372, 80]];
const orbit = (rx: number, ry: number, rot: number) => `M380 150m-${rx} 0a${rx} ${ry} ${rot} 1 0 ${2 * rx} 0a${rx} ${ry} ${rot} 1 0 -${2 * rx} 0`;
export const FITNESS_ART = svg(760, 300, `
${globe(380, 150, 96, 9)}
${people.map(([x, y], i) => pop(x, y, 2.8, i * 0.45)).join('')}
${[[170, 44, -10, 8], [150, 70, 18, 10], [190, 34, 6, 12]].map(([rx, ry, rot, t]) =>
  `<path d="${orbit(rx, ry, rot)}" class="ink faint dash"/><path d="M0-5l5 5-5 5-5-5z" class="fill"><animateMotion dur="${t}s" repeatCount="indefinite" path="${orbit(rx, ry, rot)}"/></path>`).join('')}
${draw('M20 270h300l10-18 10 34 10-46 10 30h380', 0, 'fast')}
${L(40, 40, 'EVERYONE ON EARTH', 'start')}${L(720, 40, 'AI AGENTS', 'end')}
`);

// ── What we are: your idea → our AI-powered build → the platform you need
export const ABOUT_ART = svg(760, 300, `
${draw('M96 112a36 36 0 1 1 48 34v18h-24v-18a36 36 0 0 1-24-34z M122 174h20 M124 184h16', 0)}
${draw('M120 86l6 14 12-20', 0.4)}
${L(132, 222, 'YOUR IDEA')}
${flow('M182 150h86')}
<circle cx="350" cy="150" r="46" class="ink dim"/><circle cx="350" cy="150" r="64" class="ink faint dash"/>
<text x="350" y="155" class="t big" text-anchor="middle">AI</text>
<circle r="3" class="dot"><animateMotion dur="4s" repeatCount="indefinite" path="M350 150m-64 0a64 64 0 1 0 128 0a64 64 0 1 0 -128 0"/></circle>
<circle r="3" class="dot"><animateMotion dur="4s" begin="-1.33s" repeatCount="indefinite" path="M350 150m-64 0a64 64 0 1 0 128 0a64 64 0 1 0 -128 0"/></circle>
<circle r="3" class="dot"><animateMotion dur="4s" begin="-2.66s" repeatCount="indefinite" path="M350 150m-64 0a64 64 0 1 0 128 0a64 64 0 1 0 -128 0"/></circle>
${L(350, 238, 'AI-POWERED BUILD')}
${flow('M416 150C450 150 450 66 486 66')}${flow('M416 150C452 150 452 124 486 124', 0.4)}${flow('M416 150C452 150 452 182 486 182', 0.8)}${flow('M416 150C450 150 450 240 486 240', 1.2)}
${draw('M494 50h92v34h-92z M494 60h92', 1.2)}${L(600, 71, 'WEBSITE', 'start')}
${draw('M500 110h28l-3 8 4 22h-30l4-22z M503 118h22', 1.6)}${L(600, 129, 'ONLINE STORE', 'start')}
${draw('M494 168h92v30h-92z', 2)}<path d="M504 192l14-10 12 4 14-12 14 6 18-10" class="ink faint"/>${L(600, 187, 'PLATFORM', 'start')}
${draw('M500 222h20a3 3 0 0 1 3 3v34a3 3 0 0 1-3 3h-20a3 3 0 0 1-3-3v-34a3 3 0 0 1 3-3z', 2.4)}${L(600, 245, 'PHONE APP', 'start')}
`);

// ── How we run it: shop, trading and social numbers flow into one screen; nine AI employees report into it
const team = Array.from({ length: 9 }, (_, i) => [600 + (i % 3) * 40, 100 + Math.floor(i / 3) * 44] as [number, number]);
export const CONTROL_ART = svg(760, 300, `
<g transform="rotate(-25 70 80)">${draw('M70 66a9 14 0 1 0 0.01 0z', 0)}</g>${L(70, 112, 'SHOP')}
${draw('M52 160l12-10 10 6 16-16', 0.3)}${L(70, 186, 'TRADING')}
${draw('M54 230h32v18H64l-8 6v-6h-2z', 0.6)}${L(70, 272, 'SOCIALS')}
${flow('M100 80C170 80 190 120 250 120')}${flow('M100 150H250', 0.5)}${flow('M100 238C170 238 190 180 250 180', 1)}
${draw('M250 76h220v148H250z', 0.8)}<path d="M250 92h220" class="ink faint"/>
${draw('M262 104h60v40h-60z M330 104h60v40h-60z M398 104h60v40h-60z', 1.2)}
${draw('M262 152h128v60H262z', 1.6)}<path d="M270 200l16-14 14 6 18-20 16 8 18-16 22 4" class="ink faint"/>
${draw('M398 152h60v60h-60z', 1.9)}
${draw('M330 224v20M390 224v20M310 244h100', 0.9)}
${L(360, 268, 'DDG CONTROL · OWNER ONLY')}
${draw('M356 40h8v-4a4 4 0 0 1 8 0v4h8v14h-24z', 2.2)}
${team.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="9" class="ink dim"/>${pop(x, y, 3, i * 0.35)}`).join('')}
${team.map(([x, y], i) => `<path pathLength="1" d="M${x - 9} ${y}C${x - 60} ${y} 520 150 470 150" class="ink flow faint-flow" style="animation-delay:-${i * 0.2}s"/>`).join('')}
${L(640, 252, 'NINE AI EMPLOYEES')}${L(640, 266, 'EVERY ACTION CHECKED + UNDOABLE')}
`);
