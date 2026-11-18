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
two settings panels (Hide looked dead) and two 3D scenes (heavy lag). `patch13.py` now changes that import.
After any rename, check: `grep -c "ddg<old>" assets/Stage-ddg<new>.js assets/site-ddg<new>.js index.html` must be 0.

## State 18 Nov 18:35 (source: claude/hold-polish, commit "remove the water vortex")
- Markus asked to undo the vortex look work and remove the vortex completely. Done: no liquid, no vortex sliders.
- Live files here: index.html -> assets/site-ddg13.js -> assets/Stage-ddg13.js, built by `python3 patch13.py`
  from the ddg11 base files (keep those; they are not served).
- Kept: hold fixes (press works on a slightly scrolled page and jumps to the top; no charge by itself at load),
  a preview-only status line at the bottom left, Hide leaves one small Show button.
- VERIFIED headless (t4.mjs, fake clock): Hide works; no vortex sliders; press on a page scrolled 150 px starts
  the hold; charge to nova; one scene only.
- NOT VERIFIED: anything on Markus's own screen.
- Testing: `python3 -m http.server 8765` here, then `node t4.mjs` (write output to a log; about 5 minutes).
