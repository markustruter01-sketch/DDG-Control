import { createRequire } from 'module'; const puppeteer = createRequire('/opt/npm-tools/node_modules/')('puppeteer');
const W = 1000, H = 640;
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', `--window-size=${W},${H}`] });
const p = await b.newPage(); await p.setViewport({ width: W, height: H });
const errs = []; p.on('pageerror', e => errs.push(String(e))); p.on('console', m => { if (m.type() === 'error' && !/404/.test(m.text())) errs.push(m.text()); });
await p.evaluateOnNewDocument(() => { let ft = 0, lastTs = -1; window.__step = 200; window.__ft = () => ft; const raf = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = cb => raf(ts => { if (ts !== lastTs) { lastTs = ts; ft += window.__step; } cb(ft); }); performance.now = () => ft; });
await p.goto('http://localhost:8765/', { waitUntil: 'domcontentloaded' });
const ft = () => p.evaluate(() => window.__ft());
const waitFt = async t => { while (await ft() < t) await new Promise(r => setTimeout(r, 150)); };
const status = () => p.evaluate(() => [...document.querySelectorAll('body > div')].map(d => d.textContent).filter(t => /^scroll /.test(t))[0] ?? 'no status line');
while (await p.evaluate(() => !!document.getElementById('intro-cover') || document.querySelector('.cn-follow')?.style.opacity !== '1')) await new Promise(r => setTimeout(r, 300));
await p.evaluate(() => { window.__step = 50; });
// Hide button
const rect = () => p.evaluate(() => { const r = document.querySelector('.tune').getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height), document.querySelector('.tune button').textContent]; });
console.log('panel before', await rect()); await p.click('.tune [data-act="min"]'); console.log('panel after Hide', await rect());
await p.screenshot({ path: 'd-hide.png' });
console.log('sliders with Vortex in the name:', await p.evaluate(() => [...document.querySelectorAll('.tune label')].filter(l => /vortex/i.test(l.textContent)).length));
// press on a scrolled page

console.log('scrolled:', await status());
const st = await p.evaluate(() => { const t = document.querySelector('.cn-top'); return { oy: parseFloat(t.style.getPropertyValue('--cn-oy')), fade: t.style.getPropertyValue('--cn-fade') }; });
console.log(JSON.stringify(st));
await p.mouse.move(W / 2, st.oy); await p.mouse.down();
const t0 = await ft();
for (const s of [2.6, 3.15, 3.8, 4.4]) { await waitFt(t0 + s * 1000); await p.screenshot({ path: `g-${s * 10}.png` }); console.log(s, await status(), 'fly', await p.evaluate(() => [document.querySelector('.cn-top').classList.contains('cn-fly'), document.querySelector('.cn-follow')?.style.opacity, Math.round(document.querySelector('.cn-brand')?.getBoundingClientRect().left)]), 'fade', await p.evaluate(() => document.querySelector('.cn-top').style.getPropertyValue('--cn-fade')));  }
console.log('errors', JSON.stringify(errs.slice(0, 5)));
await b.close();
