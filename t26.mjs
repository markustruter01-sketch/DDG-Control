// Orb glitch and nova (19 Nov). Usage: node t26.mjs <page> <prefix>
import { createRequire } from 'module'; const puppeteer = createRequire('/opt/npm-tools/node_modules/')('puppeteer');
const [page, pre] = [process.argv[2], process.argv[3]]; const W = 1000, H = 640;
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', `--window-size=${W},${H}`] });
const p = await b.newPage(); await p.setViewport({ width: W, height: H });
const errs = []; p.on('pageerror', e => errs.push(String(e))); p.on('console', m => { if (m.type() === 'error' && !/404/.test(m.text())) errs.push(m.text()); });
await p.evaluateOnNewDocument(() => { let ft = 0, lastTs = -1; window.__step = 100; window.__ft = () => ft; const raf = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = cb => raf(ts => { if (ts !== lastTs) { lastTs = ts; ft += window.__step; } cb(ft); }); performance.now = () => ft; });
await p.goto('http://localhost:8765/' + page, { waitUntil: 'domcontentloaded' });
const ft = () => p.evaluate(() => window.__ft());
const waitFt = async t => { let g = 0; while (await ft() < t && g++ < 3000) await new Promise(r => setTimeout(r, 50)); };
const status = () => p.evaluate(() => [...document.querySelectorAll('body > div')].map(d => d.textContent).filter(t => /^scroll /.test(t))[0] ?? '');
const charge = s => +((s.match(/charge (\d+)%/) || [0, 0])[1]);
const step = v => p.evaluate(x => { window.__step = x; }, v);
const shot = async n => { await step(0); await new Promise(r => setTimeout(r, 500)); await p.evaluate(() => { document.querySelectorAll('.tune').forEach(t => t.style.display = 'none'); }); await p.screenshot({ path: `/tmp/${pre}-${n}.png` }); };
let g = 0; while (await p.evaluate(() => !!document.getElementById('intro-cover') || document.querySelector('.cn-follow')?.style.opacity !== '1') && g++ < 400) await new Promise(r => setTimeout(r, 300));
await step(33); await waitFt(await ft() + 3000);
const oy = await p.evaluate(() => parseFloat(document.querySelector('.cn-top').style.getPropertyValue('--cn-oy')));
await p.mouse.move(W / 2, oy); await p.mouse.down();
let st = ''; g = 0; while (charge(st) < 80 && g++ < 900) { st = await status(); await new Promise(r => setTimeout(r, 60)); }
await shot('a-80'); await step(6);
const want = [[87, 'b-glitch1'], [95, 'c-glitch2'], [97, 'd-blink']]; let wi = 0;
while (!/let go first/.test(st) && g++ < 6000) { st = await status(); if (wi < want.length && charge(st) >= want[wi][0]) { await shot(want[wi][1] + '-' + charge(st)); wi++; await step(6); } await new Promise(r => setTimeout(r, 15)); }
await step(0); const tN = await ft();
for (const dt of [30, 90, 200, 450, 900, 1500]) { await step(10); await waitFt(tN + dt); await shot('n-' + dt); }
await p.mouse.up();
console.log(JSON.stringify({ errors: errs.slice(0, 4), last: st }));
await b.close();
