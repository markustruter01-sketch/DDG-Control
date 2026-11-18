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
- Live files here: index.html -> assets/site-ddg34.js (+ site-ddg34.css) -> assets/Stage-ddg34.js, built by `python3 patch.py` (set NEW in it; nova wave text is in nova_glsl.py)
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

## 18 Nov 20:00: camera twice as far, pressed-glass dent, phone buzz (build ddg25), all in PR #121 (NOT merged, NOT live)
- Markus wrote "done" at 19:40 but PR #121 was still open then; do not publish live until it is merged.
- holdCamBack 30, holdCamUp 10; sliders holdDent (dent under the finger) and holdVibrate (Vibration API).
- VERIFIED headless with touch (t10.mjs, navigator.vibrate stubbed): dent appears at the press, follows the finger,
  grows 80 -> 132 px, fades on release; buzz pulses grow 4 ms -> 72 ms, 320 ms at the nova; no errors.
- NOT VERIFIED: a real phone (buzz cannot work on iPhone: no Vibration API there); how the dent looks to Markus.

## 18 Nov 20:15: PR #121 merged and live; words return after the settle; no dark edges (build ddg27)
- PR #121 merged by Markus (0fcb9e2), Replit synced (sync-pr121.txt: build passed), published, status success.
- New branch `claude/words-back-after-settle` (PR open, NOT merged, NOT live): words fly back when the charge has
  run out after the blast (end of holdCalm), not at the blast; holdVignette default 0. Same in this preview.
- VERIFIED headless (t11.mjs): words away at 5.6 s, back at 6.3 s (blast at 3.0 s, settle 3 s); no errors.
- 20:25 (build ddg28, also in PR #122): the dent fades towards its edge (mask); the buzz starts with a faint tick every
  0.48 s and builds to 49 ms ticks every 0.1 s, then stops at the blast (no long pulse). VERIFIED headless with touch
  (t12.mjs, vibrate stubbed): 6 ms @ 450 ms apart -> 49 ms @ 100 ms apart, then 0 at the blast; no errors.

## 18 Nov 20:20: PR #122 merged and live
- Merged by Markus (c8ad032), Replit synced (sync-pr122.txt: build passed), published, status success.
- Live now: words return after the settle, no dark edges, dent fades at its edge, buzz starts slow and stops at the blast.
- Preview (ddg28) and main now match. Nothing open.

## 18 Nov 20:40: "Best viewed on a computer screen" (build ddg30)
- Branch `claude/best-viewed-on-screen`, PR open, NOT merged, NOT live. God's Eye View and Greenlight only.
- VERIFIED headless (t13.mjs): note on those two list rows and their pop-ups only; no errors.

## 18 Nov 21:00: even phone spacing + camera at load 2x (build ddg32)
- Branch `claude/phone-even-spacing`, PR open, NOT merged, NOT live. PR #123 (best viewed) also still open.
  This preview holds both.
- VERIFIED headless (t14.mjs gaps equal within 1 px at 3 phone sizes; t12.mjs phone hold to the blast; t7.mjs desktop).
- NOT VERIFIED: real phone; whether Markus likes the smaller orb at 2x distance.
- Markus also asked (20:41) for research on making the page run faster while looking the same: see the project doc
  `claude/site-performance-plan-2026-11-18.md` once written.
- 21:20 (build ddg34, also in PR #124): logo left of the name (setting logoPlace, default left); camera slider renamed
  "Camera: distance from the orb", first in the Orb group. VERIFIED headless (t15.mjs): slider moves the orb's size
  on screen (81 px at 1, 37 at 2, 24 at 3); logo and name on one row; phone gaps still even (t14.mjs). No errors.

## 18 Nov 21:30: the preview opens as an iPhone 15/16 screen (393 x 852)
- index.html is now the phone frame (source: phone.html). The site itself is site.html (built by patch.py from
  site-base.html). The frame moves the settings panel out beside the phone and shows the status line above it.
  "Open full size" opens site.html on its own.
- When republishing, upload index.html AND site.html (plus the new asset files). Do not upload phone.html or
  site-base.html; they are build inputs only.
- VERIFIED headless (t16.mjs): page inside is 393 wide, phone layout on, panel beside the phone, a slider in the
  moved panel still changes the scene, Reset all works, no errors.

## 18 Nov 21:40: PR #123 and #124 merged and live
- Merged by Markus (df9f0a1, 581008c), Replit synced (sync-pr124.txt: build passed), published, status success twice.
- Live now: best viewed on a computer screen; even phone spacing; camera at load 2x with slider; logo left of name.
- Preview and main match (apart from the preview-only phone frame and status line). Nothing open.

## 18 Nov 21:30: same on every phone; dent removed (build ddg36)
- Branch `claude/same-on-all-phones`, PR open, NOT merged, NOT live.
- Phone zoom --z (Stage.tsx phoneLayout): min(W/393, H/798) / text boost (100 px probe letter). CSS divides the
  measured tops by --z because zoomed boxes multiply their own lengths.
- VERIFIED headless (t17.mjs): shares equal at 393x798, 384x740, 320x617; t12.mjs hold works, no dent.
- NOT VERIFIED: a real Samsung, a phone with text scaling on.
