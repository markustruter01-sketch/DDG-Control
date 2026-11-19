// Stick figures (19 Nov). Usage: node t25.mjs <page> <W> <H> <prefix>
import { createRequire } from 'module'; const puppeteer = createRequire('/opt/npm-tools/node_modules/')('puppeteer');
const [page, W, H, pre] = [process.argv[2], +process.argv[3], +process.argv[4], process.argv[5]];
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', `--window-size=${W},${H}`] });
const p = await b.newPage(); await p.setViewport({ width: W, height: H, isMobile: W < 700, hasTouch: false });
const errs = []; p.on('pageerror', e => errs.push(String(e))); p.on('console', m => { if (m.type() === 'error' && !/404/.test(m.text())) errs.push(m.text()); });
await p.evaluateOnNewDocument(() => { let ft = 0, lastTs = -1; window.__step = 100; window.__ft = () => ft; const raf = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = cb => raf(ts => { if (ts !== lastTs) { lastTs = ts; ft += window.__step; } cb(ft); }); performance.now = () => ft; });
await p.goto('http://localhost:8765/' + page, { waitUntil: 'domcontentloaded' });
const ft = () => p.evaluate(() => window.__ft());
const waitFt = async t => { let g = 0; while (await ft() < t && g++ < 3000) await new Promise(r => setTimeout(r, 60)); };
const status = () => p.evaluate(() => [...document.querySelectorAll('body > div')].map(d => d.textContent).filter(t => /^scroll /.test(t))[0] ?? '');
const shot = async n => { await p.evaluate(() => { document.querySelectorAll('.tune').forEach(t => t.style.display = 'none'); }); await p.screenshot({ path: `/tmp/${pre}-${n}.png` }); };
let g = 0; while (await p.evaluate(() => !!document.getElementById('intro-cover') || document.querySelector('.cn-follow')?.style.opacity !== '1') && g++ < 400) await new Promise(r => setTimeout(r, 300));
await p.evaluate(() => { window.__step = 33; });
await waitFt(await ft() + 2500); await shot('1-rest');
await waitFt(await ft() + 3000); await shot('2-rest-later');
if (process.env.REST_ONLY) { console.log(JSON.stringify({ errors: errs.slice(0, 4) })); await b.close(); process.exit(0); }
const oy = await p.evaluate(() => parseFloat(document.querySelector('.cn-top').style.getPropertyValue('--cn-oy')));
await p.mouse.move(W / 2, oy); await p.mouse.down();
const charge = s => +((s.match(/charge (\d+)%/) || [0, 0])[1]);
let st = ''; g = 0; while (charge(st) < 45 && g++ < 800) { st = await status(); await new Promise(r => setTimeout(r, 80)); }
await shot('3-charge-half');
while (charge(st) < 88 && g++ < 1600) { st = await status(); await new Promise(r => setTimeout(r, 60)); }
await shot('4-charge-high');
while (!/let go first/.test(st) && g++ < 2400) { st = await status(); await new Promise(r => setTimeout(r, 40)); }
await waitFt(await ft() + 250); await shot('5-blast');
await p.mouse.up();
await waitFt(await ft() + 5200); await shot('6-falling-back');
await waitFt(await ft() + 2500); await shot('7-back');
console.log(JSON.stringify({ errors: errs.slice(0, 4), last: st }));
await b.close();
