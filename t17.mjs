// Load site.html at several phone sizes and report each first-screen part as a share of the screen height.
import { createRequire } from 'module'; const puppeteer = createRequire('/opt/npm-tools/node_modules/')('puppeteer');
const url = process.argv[3] ?? 'http://localhost:8765/site.html';
const sizes = (process.argv[2] ?? '393x798,384x740,384x824').split(',').map(s => s.split('x').map(Number));
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
for (const [W, H] of sizes) {
  const p = await b.newPage(); await p.setViewport({ width: W, height: H, hasTouch: true, isMobile: true, deviceScaleFactor: 1 });
  const errs = []; p.on('pageerror', e => errs.push(String(e)));
  await p.goto(url, { waitUntil: 'domcontentloaded' });
  for (let i = 0; i < 40 && await p.evaluate(() => !!document.getElementById('intro-cover') || document.querySelector('.cn-follow')?.style.opacity !== '1'); i++) await new Promise(r => setTimeout(r, 1000));
  await p.evaluate(() => { document.querySelector('.tune [data-act="min"]')?.click(); [...document.querySelectorAll('body > div')].filter(d => /^scroll /.test(d.textContent)).forEach(d => d.style.display = 'none'); });
  await new Promise(r => setTimeout(r, 1500));
  const m = await p.evaluate(() => {
    const t = document.querySelector('.cn-top'), R = s => document.querySelector(s)?.getBoundingClientRect(), H = innerHeight;
    const nav = R('.cn-hero .s-nav'), br = R('.cn-brand'), hi = R('.cn-scroll'), q = R('.cn-quote'), c = R('.cn-cta');
    const orr = parseFloat(t.style.getPropertyValue('--cn-or')) / 1.22;
    const pc = v => (100 * v / H).toFixed(1) + '%';
    return { lay: t.classList.contains('cn-lay'), nameH: pc(br.height), nameW: Math.round(br.width), hintH: pc(hi.height), orbD: pc(2 * orr), quoteH: pc(q.height), quoteW: Math.round(q.width), btnH: pc(c.height), gap: pc(br.top - nav.bottom), navFont: getComputedStyle(document.querySelector('.s-nav nav a')).fontSize, brandFont: getComputedStyle(document.querySelector('.cn-brand')).fontSize, quoteFont: getComputedStyle(document.querySelector('.cn-quote')).fontSize };
  });
  console.log(`${W}x${H}`, JSON.stringify(m), errs.length ? 'ERR ' + errs[0] : '');
  await p.screenshot({ path: `r-${W}x${H}.png` });
  await p.close();
}
await b.close();
