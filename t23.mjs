// Load-in smoothness (19 Nov). Usage: node t23.mjs <page> <cpuSlowdown>
// Records, every animation frame, the words' fade-in (.cn-follow opacity, which follows the orb's spawn 0.7 -> 1),
// the time the black cover lifts, and frame gaps. The biggest one-frame jump in that fade shows skipping.
import { createRequire } from 'module'; const puppeteer = createRequire('/opt/npm-tools/node_modules/')('puppeteer');
const [page, slow] = [process.argv[2], +process.argv[3] || 1];
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--window-size=900,600'] });
const p = await b.newPage(); await p.setViewport({ width: 900, height: 600 });
const errs = []; p.on('pageerror', e => errs.push(String(e)));
const cdp = await p.target().createCDPSession(); await cdp.send('Emulation.setCPUThrottlingRate', { rate: slow });
await p.evaluateOnNewDocument(() => {
  window.__rec = { t0: performance.now(), cover: null, samples: [] };
  const loop = (t) => { const f = document.querySelector('.cn-follow'); const c = document.getElementById('intro-cover');
    if (window.__rec.cover === null && (!c || getComputedStyle(c).opacity < 0.99)) window.__rec.cover = t;
    if (f) window.__rec.samples.push([t, +(f.style.opacity || 0)]); requestAnimationFrame(loop); };
  requestAnimationFrame(loop);
});
await p.goto('http://localhost:8765/' + page, { waitUntil: 'domcontentloaded' });
const deadline = Date.now() + 150000;
while (Date.now() < deadline) { const done = await p.evaluate(() => { const s = window.__rec.samples; return s.length && s[s.length - 1][1] >= 0.999; }); if (done) break; await new Promise(r => setTimeout(r, 1000)); }
const r = await p.evaluate(() => window.__rec);
const s = r.samples; let maxJump = 0, steps = 0, first = null, last = null;
for (let i = 1; i < s.length; i++) { const d = s[i][1] - s[i - 1][1]; if (d > 0) { steps++; maxJump = Math.max(maxJump, d); first ??= s[i - 1][0]; last = s[i][0]; } }
const gaps = s.slice(1).map((x, i) => x[0] - s[i][0]).sort((a, c) => a - c);
console.log(JSON.stringify({ page, slow, coverLiftedMs: r.cover && Math.round(r.cover - r.t0), wordsFadeFrames: steps, biggestJumpPct: Math.round(maxJump * 100), fadeMs: first && Math.round(last - first), medianFrameMs: Math.round(gaps[gaps.length >> 1] || 0), finished: s.length ? s[s.length - 1][1] : null, errors: errs.slice(0, 3) }));
await b.close();
