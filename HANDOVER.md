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

## Testing tools in this folder
- `sim.mjs`: runs the liquid's drop motion with no browser and prints counts (fast).
- `t3.mjs TAG W H scrollPx "times"`: holds the orb in headless Chrome under a fake clock and saves pictures.
  Software drawing is very slow with the liquid (several seconds a frame): allow 5 to 8 minutes a run.

## State 18 Nov 18:10 (source commit afc7c5b on claude/hold-polish)
- VERIFIED headless: no charge by itself at load (was a negative first time step); press and hold starts;
  status line shows; liquid runs without error with the scene copy (refraction); early globules look right.
- NOT VERIFIED: the hold on Markus's own screen; the look of the full vortex (1.4 s to nova) and of the
  scatter with the new ropes and see-through shading (pictures were still being taken); a scrolled-page press.
- Next: look at pictures at 2.2 / 2.9 / 3.25 s, tune rope size, brightness and the mound; then Markus's view.
- Markus asked (18 Nov) for the vortex water to use the river's exact look and for gravity to seem to let go.

