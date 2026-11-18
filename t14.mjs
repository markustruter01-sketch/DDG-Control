// Load the page on several phone sizes and measure the gaps between the six things on the first screen.
import { createRequire } from 'module'; const puppeteer = createRequire('/opt/npm-tools/node_modules/')('puppeteer');
const sizes = (process.argv[2] ?? '390x844,360x780,430x932').split(',').map(s => s.split('x').map(Number));
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
for (const [W, H] of sizes) {
  const p = await b.newPage(); await p.setViewport({ width: W, height: H, hasTouch: true, isMobile: true });
  const errs = []; p.on('pageerror', e => errs.push(String(e)));
  
  await p.goto('http://localhost:8765/', { waitUntil: 'domcontentloaded' });
  for (let i = 0; i < 40 && await p.evaluate(() => !!document.getElementById('intro-cover') || document.querySelector('.cn-follow')?.style.opacity !== '1'); i++) await new Promise(r => setTimeout(r, 1000));
  await p.evaluate(() => { document.querySelector('.tune [data-act="min"]')?.click(); [...document.querySelectorAll('body > div')].filter(d => /^scroll /.test(d.textContent)).forEach(d => d.style.display = 'none'); });
  await new Promise(r => setTimeout(r, 1500));
  const m = await p.evaluate(() => {
    const t = document.querySelector('.cn-top'), R = s => document.querySelector(s)?.getBoundingClientRect();
    const nav = R('.cn-hero .s-nav'), br = R('.cn-brand'), hi = R('.cn-scroll'), q = R('.cn-quote'), c = R('.cn-cta');
    const oy = parseFloat(t.style.getPropertyValue('--cn-oy')), orr = parseFloat(t.style.getPropertyValue('--cn-or')) / 1.22;
    const pad = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--qb-pady')) || 0;
    const edges = [['menu→name', nav.bottom, br.top], ['name→hint', br.bottom, hi.top], ['hint→orb', hi.bottom, oy - orr], ['orb→quote', oy + orr, q.top - pad], ['quote→button', q.bottom + pad, c.top]];
    return { lay: t.classList.contains('cn-lay'), gaps: edges.map(([n, a, b]) => n + ' ' + Math.round(b - a)).join(', ') };
  });
  console.log(`${W}x${H}`, JSON.stringify(m), 'errors', errs.length);
  await p.screenshot({ path: `o-${W}x${H}.png` });
  await p.close();
}
await b.close();
