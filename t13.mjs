import { createRequire } from 'module'; const puppeteer = createRequire('/opt/npm-tools/node_modules/')('puppeteer');
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--window-size=1200,800'] });
const p = await b.newPage(); await p.setViewport({ width: 1200, height: 800 });
const errs = []; p.on('pageerror', e => errs.push(String(e))); p.on('console', m => { if (m.type() === 'error' && !/404|ERR_/.test(m.text())) errs.push(m.text()); });
await p.goto('http://localhost:8765/', { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 60 && await p.evaluate(() => !!document.getElementById('intro-cover')); i++) await new Promise(r => setTimeout(r, 1000));
await p.evaluate(() => document.querySelector('.tune [data-act="min"]')?.click());
console.log('rows:', JSON.stringify(await p.evaluate(() => [...document.querySelectorAll('.j-ticks li')].map(li => li.querySelector('b')?.textContent.slice(0, 30) + ' | ' + (li.querySelector('.j-tick-screen')?.textContent ?? '-')))));
await p.evaluate(() => document.querySelector('#about').scrollIntoView({ behavior: 'instant' }));
await new Promise(r => setTimeout(r, 2500));
await p.screenshot({ path: 'n-list.png' });
for (const i of [0, 3, 1]) {
  await p.evaluate(i => document.querySelectorAll('.j-ticks .j-expand')[i].click(), i);
  await new Promise(r => setTimeout(r, 1200));
  console.log('pop', i, JSON.stringify(await p.evaluate(() => { const g = document.querySelector('.j-pop-go'); return g ? g.innerText.replace(/\n+/g, ' / ') : 'no pop'; })));
  if (i === 3) { await p.evaluate(() => document.querySelector('.j-pop-go')?.scrollIntoView({ block: 'center' })); await p.screenshot({ path: 'n-pop.png' }); }
  await p.keyboard.press('Escape'); await new Promise(r => setTimeout(r, 600));
}
console.log('errors', JSON.stringify(errs.slice(0, 5)));
await b.close();
