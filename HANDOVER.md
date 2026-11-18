# ddg.limited preview: handover (18 Nov 2026)

This branch holds the files of the claude.ai preview artifact "ddg.limited — preview"
(slug 20c6f92b-4f4f-457f-a9d2-254392a966ae, https://claude.ai/artifact/53khc6u73b5UadikMmubFT).
It is a compiled build of `artifacts/ddg-control/site` that has been PATCHED BY HAND to match the
source on branch `claude/hold-polish` (PR #119, draft). Source of truth = PR #119. Nothing here is live.

## Rules from Markus
- Do NOT use Replit for preview changes. Change source on `claude/hold-polish`, then patch the same change
  into the compiled files here and republish the artifact (publish_files, patch mode, rename the hashed
  files each time: currently assets/site-ddg12.js, assets/Stage-ddg12.js, assets/site-ddg6.css; the ddg11 files stay here as the base that patch12.py patches from).
- Publish live (Replit sync + publish) only when Markus says.
- Short simple English. Say VERIFIED / UNKNOWN. One change per PR; Markus merges.

## How to patch
- No node_modules here, so no real build. esbuild is at /opt/npm-tools/node_modules/esbuild/bin/esbuild
  (single-file transpile only). New modules (spawn.ts, liquid.ts) are transpiled and appended to the Stage
  chunk as IIFEs (`__SP`, `__LQ`) with three.js names mapped to the minified ones (see patch12.py: it builds ddg12 from ddg11; run repatch.sh after changing liquid.ts).
- Minified names in the Stage chunk frame loop: nt = T (tuner values), $ = orbit, g = camera, d = scene,
  a = renderer, me = R, Et = ch, ie = charge, tt = novaT, Xt = away, oe = dt, zt = clock, ct = surge,
  Nt = chargeFx, Yt = topEl, ze = born, jt = skyTurn, de = hold.
- Tuner defaults live in site-ddgN.js (object containing `holdBuild:`); bump `ddg-scene-tune-N` when they change.
- ALWAYS test before publishing: serve this folder (`python3 -m http.server`) and load it with puppeteer
  (/opt/npm-tools/node_modules/puppeteer, /usr/bin/google-chrome, swiftshader flags). `node --check` needs
  the file copied to .mjs or it misses syntax errors (this caused a black screen once).

## READ THIS FIRST: the mistake of 18 Nov 18:05 (build ddg12)
The scene chunk (Stage-ddgN.js) imports the site chunk BY NAME (`from"./site-ddgN.js"`). In ddg12 the site file was
renamed but that import was not, so the browser loaded the old site file as a second copy of the whole page:
two settings panels (Hide looked dead) and two 3D scenes (heavy lag). `patch.py` now changes that import.
After any rename, check: `grep -c "ddg<old>" assets/Stage-ddg<new>.js assets/site-ddg<new>.js index.html` must be 0.

## State 18 Nov 18:35 (source: claude/hold-polish, commit "remove the water vortex")
- Markus asked to undo the vortex look work and remove the vortex completely. Done: no liquid, no vortex sliders.
- Live files here: index.html -> assets/site-ddg23.js (+ site-ddg23.css) -> assets/Stage-ddg23.js, built by `python3 patch.py` (set NEW in it; nova wave text is in nova_glsl.py)
  from the ddg11 base files (keep those; they are not served).
- Kept: hold fixes (press works on a slightly scrolled page and jumps to the top; no charge by itself at load),
  a preview-only status line at the bottom left, Hide leaves one small Show button.
- VERIFIED headless (t4.mjs, fake clock): Hide works; no vortex sliders; press on a page scrolled 150 px starts
  the hold; charge to nova; one scene only.
- NOT VERIFIED: anything on Markus's own screen.
- Testing: `python3 -m http.server 8765` here, then `node t4.mjs` (write output to a log; about 5 minutes).

## 18 Nov 18:45: nova wave less uniform (build ddg14)
- water.ts `novaWave`: uneven front, crest height, chop, uneven trailing waves. Same text patched here (nova_glsl.py).
- VERIFIED headless (t5.mjs): shader compiles, no page errors, the crest is visibly uneven 0.5 s after the nova.
- NOT VERIFIED: how it looks in motion on Markus's screen. If too much or too little, the numbers to change are
  0.09 (front), 0.4 / 0.25 (crest height), 0.3 (chop), 1.1 / 0.6 (bend) in `novaWave`.

## 18 Nov 19:00: nova wave made smooth (build ddg15)
- Markus: ddg14 was jagged, too many spikes. Cause: fast chop, high harmonics round the ring, and a jump at the
  front in the trailing waves. Now only slow changes: broad drifting high/low patches (`tall`), a wider crest,
  a second lower swell at 0.55 of the front, longer trailing waves that start smoothly.
- VERIFIED headless (t5.mjs): compiles, no page errors, smooth uneven crest in a still 0.5 s after the nova.
- NOT VERIFIED: the look in motion on Markus's screen.

## 18 Nov 19:25: words fly back at the nova; quote white with black words, no frame (build ddg17)
- patch.py now also writes assets/site-ddgNEW.css (from site-ddg6.css) and points index.html at it.
- VERIFIED headless: t6.mjs (words off screen at 2.6 s, back 0.15 s after the nova, opacity 1, no errors);
  t7.mjs (quote words rgb(0,0,0), patch white, frame class qp-0, one panel, no errors).
- Markus said (18:51) the page may be published once this is done, and he merges PR #119 himself.
  Live publish = after his merge: Replit sync from main, then publish, with checks before and after.

## 18 Nov 19:10: quote back to black with the thin white frame, padding 32 x 18 (build ddg18)
- Markus's tuner settings: qbColour 0, qbPadX 32, qbPadY 18, plus "slim white frame" (qpFrame 1). Store 36.
- VERIFIED headless (t7.mjs): white words, black patch, 1 px white frame, padding 32 / 18, no errors.
- Markus said: merge and publish.

## 18 Nov 19:20: PR #119 merged and published; new settings (build ddg19)
- Markus said "merge and publish": PR #119 merged (d04f204), Replit synced (report .local/claude_reports/sync-pr119.txt:
  build passed), publish started (deployment 6c163ac2). Check its result if not recorded below.
- Then Markus sent new tuner settings (19:07). They are on branch `claude/scene-settings-1907` (new PR, tune.ts only)
  and in this preview (ddg19). NOT merged, NOT live: wait for Markus's yes.
- New source work starts from main now, not from claude/hold-polish.

## 18 Nov 19:45: drag anywhere while holding; scroll hint on two lines (build ddg22)
- PR #119 and PR #120 are merged and live on ddg.limited (Replit publish success, 19:20).
- New branch `claude/hold-anywhere` (PR open, NOT merged, NOT live): hold continues wherever the finger goes;
  scroll hint breaks after "or" ("|" in the words = new line). Same in this preview.
- VERIFIED headless with touch (t8.mjs: hide the panel first, it covers the orb on a narrow screen): hold stays on
  through drags, no pointercancel, no scroll, nova fires, hint is two lines, no errors.
- NOT VERIFIED: a real phone (iOS Safari especially).
- 19:40: holdNova default 0.05 (Markus), in PR #121 and preview ddg23. Page loads with no errors (t7.mjs).
