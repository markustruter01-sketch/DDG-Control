# Owner-supplied employee animations — 22 October 2026

## Superseding video correction and complete newer roster

The owner's25.97-second screen recording demonstrates that the first continuous
idle/composite implementation is too fast and jittery. Newer sheets have now
been supplied for ALL NINE characters; the older six-design status below is
historical. Canonical identities stay; company role text follows the owner's
roster screenshot, including Tyr as Cattle Dog Coffee Venture Manager. Heimdall
keeps prior GM/COO because it is not listed in that screenshot.

Nine grid atlases retain618 source cells. Explicit playable indices omit43
suspected cut-through cells (heuristic border filter), leaving575 eligible cells
across188 finite sequences including individual held emotes. Do not call these
618 registered, newly drawn or independently accepted animation frames. Source
board pose/scale changes remain. Source SHA/rectangles/body anchors/eligibility
are in `public/employee-animations/owner-v2-provenance.json`.

Current playback holds a static rest pose, then starts one finite turn every
4.5seconds. Source steps are180–320ms, normally300–320; final pose holds500ms,
single-pose emotes1600ms. Always return to rest;3900ms recovery. Everyone stays
visible. Call/response pairs face each other but do not reuse old-design
composite actors, teleport neighbours or invent extra poses. All sequences are
available for manual replay. Quiet/reduced-motion/visibility/offscreen/focus
guards remain. Names and wrapped company roles appear above heads.

Nine resting posters total80,966bytes. Full grids load on demand while the
resting poster remains visible, preventing load-time disappearance. No new
dependencies/model calls/audio. The parent workspace video review and prepared
source are under `output/avatar-playback-review-20261022`. Build evidence is
recorded separately from actual corrected-browser/owner acceptance, still open.
After this correction, continue platform checklist work; no extra art polish.

## Historical first batch

## Scope

The owner approved the animation boards as the final designs, including the new
white-bearded Plutus. Six supplied characters: Freya, Plutus, Mímir, Daedalus,
Harald and Njord. Heimdall, Tyr and Hermes keep their existing static assets.
Canonical role IDs, names and business roles are unchanged by artwork subtitles.
No image generation, invented poses, provider calls, dependencies or audio.

43 lossless WebP atlases contain 360 extracted cells, including two held
high-five composite cells. These are not 360 newly drawn animation frames.
Rows run left to right at supplied timing (80–120ms where stated); emote panels
hold longer because the source labels them as single frames/short loops.
The inconsistent printed numbers are not treated as an accurate frame inventory.
In particular, Plutus's finance-spell artwork has nine visible character poses,
not thirteen separate poses inferred from its captions; Mímir's data spell has
ten visible stages. The source rectangles and hashes are recorded in
`artifacts/ddg-control/public/employee-animations/provenance.json`.

## Playback

- Fixed crop window, pixel rendering, discrete atlas steps. No floating, jumping,
  smooth tweening, character redraws or invented walking across the navigation.
- One decorative scene starts every four seconds on the visible desktop dock.
  Solo laptop/phone/magic/build actions alternate with supplied discussion,
  splash and high-five scenes. This is presentation, never real work telemetry.
- Composite interaction art already includes the other person. Hide that
  person's separate dock sprite for the scene and show both names above the
  actor; restore on completion or the bounded 2.8-second recovery timer.
- Names above heads; existing bottom navigation and split dock kept.
- Characters panel exposes every sequence for one-shot replay; returns to idle.
  Tray thumbnails are still. Quiet, hidden tab, reduced motion, open panel and
  keyboard focus suspend the automatic dock scenes. Hidden/offscreen sprite
  playback pauses, and timers/listeners are disposed on unmount.
- Only requested atlases load; the full 43-atlas collection is about 6.3MB on
  disk, not an up-front animation download.

## Evidence and limits

Owner boards preserved unchanged in the workspace avatar intake. Deterministic
source-only cropping, near-black matte removal by alpha, retained source RGB,
nearest-neighbour sizing, numeric-caption/gutter inventory and explicit dense-row
cuts. No generated art. Six contact sheets inspected; working files/previews and
preparation script retained under `output/avatar-package-20261022` in the parent
workspace. The artwork is a presentation board rather than registered animation
export: source pose/effect scale and silhouette changes remain deliberately
visible, consistent with the owner's jagged low-FPS direction. Closely touching
spell effects may have hard boundaries. No promise of redrawn seamless frames.

Local dashboard TypeScript and direct Vite build passed during implementation.
No tests were run. Browser fit, real animation playback/timing and owner visual
acceptance remain open; a successful build does not establish them. No DB,
backend restart, provider dispatch, publishing or release operation.
