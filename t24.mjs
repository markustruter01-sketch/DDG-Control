// Sky strike at full charge (19 Nov). Usage: node t24.mjs <page> <prefix>
import { createRequire } from 'module'; const puppeteer = createRequire('/opt/npm-tools/node_modules/')('puppeteer');
const [page, pre] = [process.argv[2], process.argv[3]]; const W = 1000, H = 640;
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', `--window-size=${W},${H}`] });
const p = await b.newPage(); await p.setViewport({ width: W, height: H });
const errs = []; p.on('pageerror', e => errs.push(String(e))); p.on('console', m => { if (m.type() === 'error' && !/404/.test(m.text())) errs.push(m.text()); });
await p.evaluateOnNewDocument(() => { let ft = 0, lastTs = -1; window.__step = 200; window.__ft = () => ft; const raf = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = cb => raf(ts => { if (ts !== lastTs) { lastTs = ts; ft += window.__step; } cb(ft); }); performance.now = () => ft; });
await p.goto('http://localhost:8765/' + page, { waitUntil: 'domcontentloaded' });
const ft = () => p.evaluate(() => window.__ft());
const waitFt = async t => { while (await ft() < t) await new Promise(r => setTimeout(r, 100)); };
const status = () => p.evaluate(() => [...document.querySelectorAll('body > div')].map(d => d.textContent).filter(t => /^scroll /.test(t))[0] ?? '');
while (await p.evaluate(() => !!document.getElementById('intro-cover') || document.querySelector('.cn-follow')?.style.opacity !== '1')) await new Promise(r => setTimeout(r, 300));
await p.evaluate(() => { window.__step = 50; document.querySelectorAll('.tune').forEach(t => t.style.display = 'none'); });
const oy = await p.evaluate(() => parseFloat(document.querySelector('.cn-top').style.getPropertyValue('--cn-oy')));
await p.mouse.move(W / 2, oy); await p.mouse.down();
let st = '', guard = 0;
const charge = s => +((s.match(/charge (\d+)%/) || [0, 0])[1]);
while (charge(st) < 85 && guard++ < 600) { st = await status(); await new Promise(r => setTimeout(r, 120)); }
await p.evaluate(() => { window.__step = 4; });
while (!/let go first/.test(st) && guard++ < 2000) { st = await status(); await new Promise(r => setTimeout(r, 30)); }
await p.evaluate(() => { window.__step = 0; });
const tN = await ft(); const shots = [];
await p.evaluate(() => { window.__step = 12; });
for (const dt of [24, 60, 110, 170, 260, 420]) { await waitFt(tN + dt); await p.evaluate(() => { window.__step = 0; }); await new Promise(r => setTimeout(r, 400)); const f = `/tmp/${pre}-${dt}.png`; await p.screenshot({ path: f }); shots.push(f); await p.evaluate(() => { window.__step = 12; }); }
await p.mouse.up();
const flashDiv = await p.evaluate(() => [...document.querySelectorAll('.cn-stage > div')].length);
console.log(JSON.stringify({ reachedNova: /let go first/.test(st), flashDivs: flashDiv, shots, errors: errs.slice(0, 3) }));
await b.close();
