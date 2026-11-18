// Thank-you panel after the enquiry form (19 Nov). Usage: node t22.mjs <width> <height> <out.png>
import { createRequire } from 'module'; const puppeteer = createRequire('/opt/npm-tools/node_modules/')('puppeteer');
const [W, H, out] = [+process.argv[2], +process.argv[3], process.argv[4]];
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', `--window-size=${W},${H}`] });
const p = await b.newPage(); await p.setViewport({ width: W, height: H, isMobile: W < 700, hasTouch: W < 700 });
const errs = []; p.on('pageerror', e => errs.push(String(e)));
await p.setRequestInterception(true);
let posted = null;
p.on('request', r => {
  if (r.url().includes('/api/public/enquiry') && r.method() === 'POST') { posted = JSON.parse(r.postData()); return r.respond({ status: 201, contentType: 'application/json', body: '{"received":true,"test":false}' }); }
  if (r.url().includes('/api/public/summary')) return r.respond({ status: 200, contentType: 'application/json', body: '{}' });
  r.continue();
});
await p.goto('http://localhost:8765/site.html', { waitUntil: 'domcontentloaded' });
await p.waitForSelector('form.s-form', { timeout: 60000 });
await p.evaluate(() => { const f = document.querySelector('form.s-form'); f.scrollIntoView();
  for (const fs of f.querySelectorAll('fieldset')) { const r = fs.querySelector('input[type=radio]'); if (r) r.click(); }
  for (const s of f.querySelectorAll('select')) { s.value = [...s.options].find(o => o.value)?.value ?? ''; s.dispatchEvent(new Event('change', { bubbles: true })); } });
await p.type('form.s-form input[name=name]', 'Test Person');
await p.type('form.s-form input[name=email]', 'someone@example.com');
await p.evaluate(() => document.querySelector('form.s-form button[type=submit]').click());
await p.waitForSelector('.s-done', { timeout: 10000 }).catch(() => {});
await new Promise(r => setTimeout(r, 1200));
const res = await p.evaluate(() => { const d = document.querySelector('.s-done'); if (!d) return { panel: false, error: document.querySelector('.s-form-error')?.textContent }; d.scrollIntoView({ block: 'center' }); document.querySelectorAll('.tune').forEach(t => t.style.display = 'none'); return { panel: true, text: d.innerText }; });
await new Promise(r => setTimeout(r, 600));
await p.screenshot({ path: out });
console.log(JSON.stringify({ posted: posted && { name: posted.name, email: posted.email, kind: posted.kind }, ...res, errs: errs.slice(0, 3) }));
await b.close();
