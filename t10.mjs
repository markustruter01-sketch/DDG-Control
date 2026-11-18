// Touch: press the orb, drag the finger far away (down and up the screen), and see that the hold goes on.
import { createRequire } from 'module'; const puppeteer = createRequire('/opt/npm-tools/node_modules/')('puppeteer');
const W = 420, H = 800, url = process.argv[2] ?? 'http://localhost:8765/';
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', `--window-size=${W},${H}`] });
const p = await b.newPage(); await p.setViewport({ width: W, height: H, hasTouch: true, isMobile: true, deviceScaleFactor: 1 });
const errs = []; p.on('pageerror', e => errs.push(String(e))); p.on('console', m => { if (m.type() === 'error' && !/404|ERR_/.test(m.text())) errs.push(m.text()); });
await p.evaluateOnNewDocument(() => { let ft = 0, lastTs = -1; window.__step = 200; window.__ft = () => ft; const raf = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = cb => raf(ts => { if (ts !== lastTs) { lastTs = ts; ft += window.__step; } cb(ft); }); performance.now = () => ft;
  window.__ev = []; window.__vib = []; navigator.vibrate = ms => { window.__vib.push(ms); return true; }; for (const t of ['pointerdown', 'pointerup', 'pointercancel', 'touchend', 'touchcancel']) addEventListener(t, () => window.__ev.push(t), true); });
await p.goto(url, { waitUntil: 'domcontentloaded' });
const ft = () => p.evaluate(() => window.__ft());
const waitFt = async t => { while (await ft() < t) await new Promise(r => setTimeout(r, 150)); };
const status = async () => (await p.evaluate(() => ([...document.querySelectorAll('body > div')].map(d => d.textContent).filter(t => /^scroll /.test(t))[0] ?? 'no status line') + ' | events ' + window.__ev.join(',') + ' | scrollY ' + Math.round(scrollY) + ' | buzz ' + window.__vib.slice(-6).join(',') + ' (' + window.__vib.length + ') | dent ' + (() => { const d = [...document.querySelectorAll('body > div')].find(e => e.style.borderRadius === '50%'); if (!d) return 'none'; const r = d.getBoundingClientRect(); return Math.round(r.left + r.width / 2) + ',' + Math.round(r.top + r.height / 2) + ' size ' + Math.round(r.width) + ' op ' + d.style.opacity; })()));
while (await p.evaluate(() => !!document.getElementById('intro-cover') || document.querySelector('.cn-follow')?.style.opacity !== '1')) await new Promise(r => setTimeout(r, 300));
await p.evaluate(() => { window.__step = 50; }); await waitFt(await ft() + 300);
await p.evaluate(() => document.querySelector('.tune [data-act="min"]')?.click());
console.log('hint:', JSON.stringify(await p.evaluate(() => { const w = document.querySelector('.cn-scroll-words'); return { lines: w.innerText.split('\n'), height: Math.round(w.getBoundingClientRect().height), lineHeight: getComputedStyle(w).lineHeight, fontSize: getComputedStyle(w).fontSize }; })));
await p.screenshot({ path: 'i-hint.png' });
const oy = await p.evaluate(() => parseFloat(document.querySelector('.cn-top').style.getPropertyValue('--cn-oy')));
console.log('orb y', oy, await status());
await p.touchscreen.touchStart(W / 2, oy);
const t0 = await ft(); await waitFt(t0 + 400); console.log('pressed', await status());
// drag: up the screen by 300 px (a scroll-down gesture), then far to the side, in steps
for (let i = 1; i <= 10; i++) { await p.touchscreen.touchMove(W / 2 + i * 12, oy - i * 30); await new Promise(r => setTimeout(r, 60)); }
await waitFt(t0 + 1200); console.log('after drag up', await status()); await p.screenshot({ path: 'k-dent.png' });
for (let i = 1; i <= 10; i++) { await p.touchscreen.touchMove(W / 2 + 120 - i * 30, oy - 300 + i * 55); await new Promise(r => setTimeout(r, 60)); }
await waitFt(t0 + 2000); console.log('after drag down', await status());
await p.touchscreen.touchEnd(); await waitFt(t0 + 2400); console.log('let go', await status());
console.log('errors', JSON.stringify(errs.slice(0, 5)));
await b.close();
