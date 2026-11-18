// Orb above the water on computers (19 Nov). Usage: node t21.mjs <site page> <width> <height> <out.png>
import { createRequire } from 'module'; const puppeteer = createRequire('/opt/npm-tools/node_modules/')('puppeteer');
const [page, W, H, out] = [process.argv[2], +process.argv[3], +process.argv[4], process.argv[5]];
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', `--window-size=${W},${H}`] });
const p = await b.newPage(); await p.setViewport({ width: W, height: H, isMobile: W < 700, hasTouch: W < 700, deviceScaleFactor: 1 });
const errs = []; p.on('pageerror', e => errs.push(String(e))); p.on('console', m => { if (m.type() === 'error' && !/404|ERR_/.test(m.text())) errs.push(m.text()); });
await p.goto('http://localhost:8765/' + page, { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 60 && await p.evaluate(() => !!document.getElementById('intro-cover') || document.querySelector('.cn-follow')?.style.opacity !== '1'); i++) await new Promise(r => setTimeout(r, 1000));
await p.evaluate(() => { const t = document.querySelector('.tune'); if (t) t.style.display = 'none'; const s = document.querySelector('.pv-status, #pv-status'); if (s) s.style.display = 'none'; });
await new Promise(r => setTimeout(r, +(process.env.WAIT||4000)));
await p.screenshot({ path: out });
console.log(out, 'errors', JSON.stringify(errs.slice(0, 5)));
await b.close();
