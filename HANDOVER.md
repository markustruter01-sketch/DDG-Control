# ddg.limited preview: handover (18 Nov 2026)

This branch holds the files of the claude.ai preview artifact "ddg.limited — preview"
(slug 20c6f92b-4f4f-457f-a9d2-254392a966ae, https://claude.ai/artifact/53khc6u73b5UadikMmubFT).
It is a compiled build of `artifacts/ddg-control/site` that has been PATCHED BY HAND to match the
source on branch `claude/hold-polish` (PR #119, draft). Source of truth = PR #119. Nothing here is live.

## Rules from Markus
- Do NOT use Replit for preview changes. Change source on `claude/hold-polish`, then patch the same change
  into the compiled files here and republish the artifact (publish_files, patch mode, rename the hashed
  files each time: currently assets/site-ddg11.js, assets/Stage-ddg11.js, assets/site-ddg6.css).
- Publish live (Replit sync + publish) only when Markus says.
- Short simple English. Say VERIFIED / UNKNOWN. One change per PR; Markus merges.

## How to patch
- No node_modules here, so no real build. esbuild is at /opt/npm-tools/node_modules/esbuild/bin/esbuild
  (single-file transpile only). New modules (spawn.ts, liquid.ts) are transpiled and appended to the Stage
  chunk as IIFEs (`__SP`, `__LQ`) with three.js names mapped to the minified ones (see _lqpatch.py).
- Minified names in the Stage chunk frame loop: nt = T (tuner values), $ = orbit, g = camera, d = scene,
  a = renderer, me = R, Et = ch, ie = charge, tt = novaT, Xt = away, oe = dt, zt = clock, ct = surge,
  Nt = chargeFx, Yt = topEl, ze = born, jt = skyTurn, de = hold.
- Tuner defaults live in site-ddgN.js (object containing `holdBuild:`); bump `ddg-scene-tune-N` when they change.
- ALWAYS test before publishing: serve this folder (`python3 -m http.server`) and load it with puppeteer
  (/opt/npm-tools/node_modules/puppeteer, /usr/bin/google-chrome, swiftshader flags). `node --check` needs
  the file copied to .mjs or it misses syntax errors (this caused a black screen once).

## Open problems (17:20)
1. Markus reports: press-and-hold does not start, and name/hint/quote/button look faded. NOT reproduced in
   headless Chrome (hold, nova and settle all work there). Suspect: page scrolled a little (scroll progress
   p > 0.08 cancels the hold and fades the words), or a real-GPU problem with the liquid vortex. Check first.
2. Liquid water vortex (liquid.ts, "Vortex made of" = 5) is too faint: only small dark blobs. Needs work on
   brightness, drop size and shape.
