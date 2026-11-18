import { createRequire } from 'module'; const puppeteer = createRequire('/opt/npm-tools/node_modules/')('puppeteer');
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const p = await b.newPage(); await p.setViewport({ width: 393, height: 798, isMobile: true, hasTouch: true });
const errs = []; p.on('pageerror', e => errs.push(String(e)));
await p.goto('http://localhost:8765/site.html', { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 40 && await p.evaluate(() => !!document.getElementById('intro-cover') || document.querySelector('.cn-follow')?.style.opacity !== '1'); i++) await new Promise(r => setTimeout(r, 1000));
const set = v => p.evaluate(v => { const l = [...document.querySelectorAll('.tune label')].find(l => /Camera: height/.test(l.textContent)); const i = l.querySelector('input'); i.value = String(v); i.dispatchEvent(new Event('input', { bubbles: true })); }, v);
console.log('slider found:', await p.evaluate(() => !![...document.querySelectorAll('.tune label')].find(l => /Camera: height/.test(l.textContent))));
await p.evaluate(() => document.querySelector('.tune [data-act="min"]')?.click());
for (const v of [0, 15]) { await set(v); await new Promise(r => setTimeout(r, 3500)); await p.screenshot({ path: `s-up${v}.png` }); console.log('camUp', v, 'orb y', await p.evaluate(() => document.querySelector('.cn-top').style.getPropertyValue('--cn-oy'))); }
console.log('errors', errs.length);
await b.close();
