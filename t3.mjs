// Hold the orb under a fake clock (so slow software drawing still gives the right motion) and take pictures.
// node t3.mjs TAG [W H] [scrollPx] [clipAroundOrb 0/1]
import { createRequire } from 'module'; const puppeteer = createRequire('/opt/npm-tools/node_modules/')('puppeteer');
const tag = process.argv[2] ?? 'v', W = Number(process.argv[3] ?? 1100), H = Number(process.argv[4] ?? 700), scrollPx = Number(process.argv[5] ?? 0);
const shots = (process.argv[6] ?? '0.5,1.0,1.5,2.0,2.5,2.95,3.15,3.5,4.2,5.5').split(',').map(Number);
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', `--window-size=${W},${H}`] });
const p = await b.newPage(); await p.setViewport({ width: W, height: H });
const errs = []; p.on('pageerror', e => errs.push(String(e))); p.on('console', m => { if (m.type() === 'error' && !/404/.test(m.text())) errs.push(m.text()); });
await p.evaluateOnNewDocument(() => {
  let ft = 0, lastTs = -1; window.__step = 200; window.__ft = () => ft;
  const raf = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = cb => raf(ts => { if (ts !== lastTs) { lastTs = ts; ft += window.__step; } cb(ft); });
  performance.now = () => ft;
});
await p.goto('http://localhost:8765/', { waitUntil: 'domcontentloaded' });
const ft = () => p.evaluate(() => window.__ft());
const waitFt = async t => { while (await ft() < t) await new Promise(r => setTimeout(r, 150)); };
const status = () => p.evaluate(() => [...document.querySelectorAll('body > div')].map(d => d.textContent).filter(t => /^scroll /.test(t))[0] ?? 'no status line');
// load-in: wait for the cover to go and the orb to arrive
while (await p.evaluate(() => !!document.getElementById('intro-cover') || document.querySelector('.cn-follow')?.style.opacity !== '1')) await new Promise(r => setTimeout(r, 300));
await p.evaluate(() => { window.__step = 50; });
await waitFt(await ft() + 500);
if (scrollPx) { await p.evaluate(y => scrollTo({ top: y, behavior: 'instant' }), scrollPx); await waitFt(await ft() + 1500); }
console.log('before press:', await status());
const st = await p.evaluate(() => { const t = document.querySelector('.cn-top'); return { oy: parseFloat(t.style.getPropertyValue('--cn-oy')), fade: t.style.getPropertyValue('--cn-fade'), fly: t.classList.contains('cn-fly') }; });
console.log(JSON.stringify(st));
await p.screenshot({ path: `${tag}-00.png` });
await p.mouse.move(W / 2, st.oy); await p.mouse.down();
const t0 = await ft();
for (const s of shots) {
  await waitFt(t0 + s * 1000);
  const n = String(Math.round(s * 100)).padStart(3, '0');
  await p.screenshot({ path: `${tag}-${n}.png` });
  console.log(s, await status());
}
await p.mouse.up();
console.log('errors', JSON.stringify(errs.slice(0, 5)));
await b.close();
