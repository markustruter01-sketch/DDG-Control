# Feature sanity checks

Owner rule recorded21October2026: before starting each new feature, confirm it is still needed, choose a simple suitable approach, look for useful improvements, and leave working parts intact. Record source, preview, acceptance and live evidence separately.

##21October — Employee identity consistency

- Need: confirmed. Exact source98ed9fe starts by inserting stale ORG_CHART entries as database agents. This mixes employee roles, legacy writer actors and venture labels. It can mislead task ownership and report context.
- Approach: one pure shared registry for the nine confirmed roles, preserving Company Map IDs and display roles. Stop roster-to-account insertion; keep existing member IDs, ownership/history and legacy writer lookup.
- Alternatives rejected: renaming/deleting existing members or automatically seeding nine replacements would create migration/assignment risk. A second employee database or another model call is unnecessary.
- Keep: existing Organisation layout, brand assets, report/decision formats, provider guards, project controls and legacy identifiers. No new permissions, migration or provider calls.
- Useful improvement included: fresh installs seed only the confirmed founder, with conflict-safe insertion; report writer clearly says it is not the external GM and describes members as historical/technical task actors.
- Limits: existing member cleanup and scoped snapshot privacy need separate read-only inventory/review. No claim that accounts are configured or that the writer ran. Independent review, compilation and runtime acceptance remain pending.

## Prior batch — Saved-decision read receipts

- Need: confirmed; current notification read state resets on reload.
- Approach: owner-only metadata receipts tied to actual displayed content, reusing Decisions, not a competing approval queue. No polling/model calls.
- Improvement after source review: explicit Mark read saves; links only navigate, avoiding lost save feedback on navigation. SQL/schema constraint names aligned.
- Keep: exact decision links, separate pending-action status, existing authorization and worker blocks.
- Limits: additive migration remains unapplied. Source review is complete; actual build/database/cross-device acceptance must be recorded, not assumed from source.

##21October — Home attention source coverage

- Need: source inspection found Home can display no red report flags while the report query failed, and show zero before both sources load.
- Approach: reuse current decision/report queries; unknown badge and separate loading/error/retry states until coverage is available. Keep healthy source records usable during partial failure. State that saved records are not live company health.
- Useful improvements: exact decision deep links; saved red flags show source date using the existing invalid-date-safe formatter.
- Keep: approved Atlas/glass/layout, API contracts, record order and limits, urgency values, no polling or new services. No inferred P0 incident labels or automatic action.
- Evidence: source inspection only. Compilation, interaction, owner acceptance and live release pending. No tests, database/provider calls, migration, merge or deployment.

##21October — Social coverage visibility

- Sanity check: retain working manual snapshot entry, missing-value handling, source labels, totals and per-platform detail. The existing data groups by venture/platform, not an actual account registry, so complete company coverage and overlap are unknown.
- Bounded improvement: collapsed coverage summary counts registered ventures with readings; lists missing ventures, oldest capture and explicit account/overlap/sync limits. A failed summary query does not present cached totals as current.
- No arbitrary freshness threshold, invented account identities, deduplication claim, external analytics calls or new schema. Registration, source-native metrics and read-only account ingestion remain separate owner-reviewed work.
- Source inspection only. No tests, compilation, database/provider operations, merge or deployment; queue for coherent batch.

##21October — Activity-ledger coverage

- Need: the inspector filters events/runs through loaded task IDs, silently excluding unassociated records. Refresh can also leave a selected project/task absent, yielding an empty export.
- Approach: preserve API, filters and metadata-only export; disclose excluded unassociated counts in the all-records view and state export limitations. Mark missing filter selection explicitly with a reset action; disable export until a valid selection.
- No guessed project attribution, raw payload exposure, new database/query, model call or tamper-proof claim. This does not fetch missing records or prove complete company history.
- Source inspected only. No tests, compilation, interaction, owner/live acceptance, database/provider operations, merge/deploy.

##21October — Atomic owner question history
- Need: partial answer/history writes, approval race and duplicate-question disclosure found in exact1146a10 source.
- Approach: existing project-first lock, transaction-scoped version reads, question row lock for answers, atomic state/history writes and generic duplicate conflicts.
- Keep: existing data/schema/IDs, current response meaning, stale-version checks, no automatic approval/resume, all dispatch-hard-false guards. No separate queue or model calls.
- Improvement: real-owner-only creation and held Finance/completed-project checks. OFF alone permits safe owner questions, not execution.
- Limits: no claim of provider interruption or full synchronization across all writers. Tests, compilation, independent peer review and runtime evidence remain pending.

##21October — Question UI compatibility
- Need: creation button remained enabled in DEV/held/completed contexts despite new server rejection. Editable fields/context switching during save could lose a newer draft on success.
- Approach: reuse owner/Finance and actual control state, expose specific blockers, guard handlers and freeze save inputs/context during requests. Keep task-ID adapter, layout and draft-retargeting logic.
- Limits: source only, no tests/compilation/interaction checks yet; browser gating never replaces server authorization.

##21October — Version-bound task approval
- Need: current approval posts only task ID, so a stale owner screen could approve a later plan revision. This must be corrected before adding plan revision.
- Approach: explicit expected plan/outcome versions in the existing approval request; check under existing locks before idempotent approval; record versions in approval event. Show plan version in task card. No new approval workflow.
- Keep: outcome/readiness/Finance/question/repository guards and hard-false dispatch blocks. Missing/old client versions fail closed. Source-only; no tests, compilation, approvals, database/provider operations or release.

##21October — Rejected proposal revision
- Need confirmed: rejected gate task cannot be replaced under existing uniqueness.
- Reuse stable task ID + existing plan version, atomic before/after event history and owner draft form; no new table/queue/model call.
- Refuse all execution/provider evidence and open blocking questions; preserve bindings/attempts and worker hard-false guards. Explicit version-bound fresh approval remains separate.
- Context-bound UI drafts, clear zero spend/deadline/reason/confirmation and loaded history.
- Source only; no tests, compilation/runtime/peer/owner/live evidence or data/provider operations.

##21October — Company Map view filters and task-lookup truth
- Need: view selectors use tab roles without tab keyboard behavior; use ordinary grouped toggle buttons and native Tab/Enter/Space interaction instead of adding custom focus machinery.
- Need: task-query loading/failure/malformed responses can be rendered as no matching task. Validate required record fields, distinguish loading/unavailable/loaded, limit absence claims to loaded records, and expose retry.
- Fetch task references only when findings are expanded; no automatic focus retries. Keep the same API, task records, exact-title/project matching and existing cockpit styling. No agent calls or data writes.
- Clear selected relationship when changing view/search so detail does not describe hidden prior context. Existing node buttons and source/date drill-down remain.
- Type/build and rendered keyboard/failure acceptance are separate; no tests or runtime acceptance claimed from source edits.

##21October — Exact work-record links
- Need: Company Map finding links name a task ID but navigate to the generic queue heading. Existing task cards already have stable work-item anchors and an ancestor-reveal/focus helper; reuse them rather than create another task view or API.
- Link to the exact saved card, reveal after task loading on initial navigation/hash/back-forward, and distinguish unavailable versus not-in-loaded-records. Never create a replacement, change approval state or start work.
- Bound fragments to known headings or positive database task IDs. Handle each navigation once so background refresh does not steal focus. Existing company-board links and queue remain intact.
- Source/compilation and rendered cross-route/keyboard/mobile acceptance remain separate; no tests or runtime writes are part of this change.

##21October — Project tabs and unknown routes
- Need: project tabs have tab roles but no arrow/Home/End focus handling, and label-derived IDs contain whitespace, breaking ARIA references. Keep real tab semantics with stable per-instance IDs and one tab stop; arrows move focus only, native Enter/Space/click activates so keyboard exploration does not switch away from a draft form.
- Revalidate visible tab selection for a different project so a hidden section does not stay selected. Preserve existing tab names, hidden-tab rules, bookmark format, forms and layout.
- Need: unmatched app routes render no page. Add a shared-shell not-found fallback with Home navigation, without moving routes, exposing URL contents or adding data/model calls.
- Compile changed frontend; browser keyboard/form/route/mobile and owner acceptance remain separate. No tests, database or production actions.


##21October - Delivery evidence snapshot
- Need: in-app snapshot describes merged receipt source as a separate draft and merged Control source as a review branch. Correct status using recorded source/check evidence.
- Keep delivery IDs, states, criteria, layout and unapplied conditional migration/runtime gates. No live acceptance or new API/worker operations.

##21October - Projects navigation focus and reduced motion
- Need: Projects dock navigation scrolls but leaves keyboard focus behind and forces smooth motion. Reuse one reveal helper, focus existing target without a tab stop, and honor reduced-motion preference.
- Keep layout, routes, records and safe-area padding. Browser focus/touch/screen-reader/mobile acceptance remains open; no new queries, calls or writes.
- Restored original UTF-8 log bytes before appending these entries; corrected local Windows encoding before delivery.


##21October - Notification response and navigation guards
- Need: malformed successful receipt responses can crash rendering or imply a confirmed save. Validate bounded IDs, SHA-256 versions, timestamps, duplicate/unrequested rows and exact save response identity; reject malformed data as unavailable/unconfirmed.
- Disable read actions while decisions refresh or fail. Keep existing API, source-version server checks, no automatic retries/writes, migration gate and decision navigation.
- Need: linked-decision effect can repeatedly scroll/focus on background query updates. Handle focus once per navigation version, retaining loading waits, explicit links and error states.
- Compile/build only; malformed response/browser/runtime and persistence acceptance remain open. No tests, data/provider/migration/release operations.


##21October - Approved mythology pixel art source
- Need: approved nine-character dock has no reusable assets. Inspected approved split-bottom concept and brand rules, reused canonical role IDs.
- First bounded step: code-native pixel SVG component with nine distinct costume/prop palettes, full feet, optional accessible title and decorative default. No official logo redraw, external asset/service, worker identity or activity claim.
- Source art is an implementation interpretation of the static concept, pending rendered/owner acceptance. No animation frames, dock integration, message ingress or live-state claim yet; these remain explicit next steps.


##21October - Employee presentation dock integration
- Need: connect nine source sprite variants to approved four-left/five-right desktop layout while retaining existing five navigation buttons. Reuse canonical roster only; no database agent bindings.
- Native buttons open static role details; mobile uses a bounded scrollable tray. Local hide/quiet preferences, reduced-motion CSS and hidden-document pause govern decorative one-pixel idle movement. No operational bubbles or fake employee activity.
- Portal fixed cast/panel outside glass header to avoid backdrop-filter containing-block bugs. Empty areas pass clicks; reserve central navigation gap and safe-area feet space. Existing Notifications stays independent.
- First idle motion only; varied facing/prop frames/neighbor routines and genuine-message ingress are still pending. Rendered small-screen/keyboard/focus/owner acceptance remains open. No tests/data/provider/migration/release actions.

- Dock source review: use a labeled compact Characters icon on narrow headers to avoid adding a long sixth header label; preserve full visible label on wider screens. Keyboard/touch/rendered acceptance remains open.
##21October - Load route code when needed
- Need: compiled dashboard ships every route in one 930.20kB entry bundle. Existing pages are independent route entries; React lazy imports and one accessible loading shell are the simplest suitable reduction in upfront code.
- Keep exact routes, named page components, auth gate, existing query/data semantics and route-reset error boundary. No prefetch loops, new dependency, provider call, schema or worker change.
- Build artifact sizes measure code distribution only, not network speed or browser/owner acceptance. Cold-route loading and failed-chunk recovery remain browser acceptance items; no tests run.

- Route-loading review found generic render retry cannot recover a cached lazy-import rejection. Add route-specific branded failure shell with working navigation and explicit Reload app (warns about unsaved changes), no raw internal error text or automatic reload loop. Route changes keep existing reset-key recovery. Browser failure/recovery acceptance remains open.

##21October - Coherent main preview batch
- Combine reviewed dock source with current main route loading so Replit can preview on stable main. Resolve only appended sanity-log conflict by preserving both histories; source files do not conflict.
- Static sprite rendering and compilation are recorded. Merge permission covers source integration; browser layout/owner/live acceptance stays a separate unmet gate. Do not publish from this merge.


##21October - Legacy report spending boundary
- Need: runOllie still contains a paid xAI request protected indirectly by project OFF checks; it has no explicit approved-budget gate and the Agents button is enabled. No provider call or key inspection performed in this audit.
- Add source-locked shared false policy before any run DB/provider work, covering manual/cron callers. UI disables invocation with the same reason, preserves saved history; keys/ON flags cannot authorize spending. Manual run route additionally requires real owner, DEV bypass insufficient.
- Preserve existing cron authentication, contracts/history, Finance hold and separate Cursor safety guards. No model selection, external budget/eligibility claim, migration or provider operation. Type/build checks only, no tests/runtime calls.


##21October - Explicit owner provider observations
- Need: Agents auto-fetches account model list on mount; AI Stack auto-fetches/polls provider status every60sec in owner mode. Legacy metadata endpoints accept general auth/DEV bypass. Source audit only, no provider request performed.
- Require real owner at both read endpoints; disable automatic mount/focus/reconnect/interval reads and use explicit one-check buttons. DEV blocked in UI/server. Not-checked/unknown states must not claim connected/zero agents.
- Preserve saved local histories, existing provider cache/timeouts, no dispatch/model-entitlement/fee claim. Show last-check timestamp instead of a live dot/recent freshness claim that would outlive manual observation. No tests, provider/data/migration/release operations.

##22October - Approved shaded employee artwork
- Need: owner rejected placeholder SVG characters and approved all nine shaded/gritty pixel heroes. Screenshot confirms individual names; group chats excluded. Preserve stable IDs and existing roles; display Mímir with owner-supplied accent. Heimdall remains the ninth existing employee (not visible in screenshot crop).
- Simplest delivery: local transparent WebP artwork imported through Vite, preserving proportions/full bodies and exact approved design. Full-resolution originals retained in AI Stack/output/ddg-avatar/shaded-heroes-v3; provenance SHA256/encoding facts included with delivery assets. No external image host, model/API/runtime request or new dependency.
- Reuse dock/mobile tray/native controls/portals/quiet/hide/reduced-motion/hidden-document pause; larger selected portrait and character title improve recognition. Restrained finite hover/keyboard/selection gestures are decorative cutout transforms, NOT articulated sprite frames or live worker signals.
- Asset encoding reduces the nine source PNGs from12.28MB to0.61MB combined. No logo/background/navigation/provider/DB/release change. Actual browser/touch/safe-area/animation acceptance and richer role/prop/facing frames remain outstanding; static approval does not close those gates.

##22October - Requested character banter, no model calls
- Need: approved avatar plan asks for occasional personality/preset humour, while the dock currently only shows names/roles. Reuse selected-character panel rather than nine unsolicited bubbles or another inbox.
- Add three authored remarks per existing employee and an explicit Character remark/Another remark control; one visible remark at a time, reset on selection/close, dismissible, clearly labelled preset banter/not work. No timer, provider/model call, notification badge or fabricated business action.
- Keep actual notifications separate and visible through existing inbox. No record mutation or real employee message claim. Browser/keyboard/screen-reader acceptance remains open; no tests requested.
- Heimdall generated idle pilot remains outside app: browser local-file security policy blocked preview, do not work around or silently accept its cloak/shape drift. Existing approved masters/static cutout gestures remain in source.

##22October - Avatar focus and mobile delivery audit
- Need: CSS-hidden desktop cast still mounted all9 image elements on mobile, even with tray closed. Match the existing1051px desktop breakpoint in presentation state and mount the cast only on desktop; mobile still accesses all9 via the tray, loading images on opening. Keep CSS breakpoint as fallback and central navigation layout unchanged.
- Escape/Close previously returned focus to header even after a bottom character opened the panel. Remember the actual opener and fall back to header if it disappears on resize/hide; move focus to header before focused cast unmounts on narrowing.
- Dismiss previously removed the focused button. Return to remark trigger, keep a mounted polite announcement region and respect previously-handled Escape events.
- Source review only at this stage; browser/assistive-technology behavior still needs actual acceptance. No tests/model/provider/backend/data/release actions; no repeated blocked browser or Replit network attempt.

##22October - Owner-requested village Atlas/headlines/3x employees
- Need: owner screenshots explicitly ask3x current52x60 employee size, Finance/Social reporting headlined at Company overview top, and a glacial pixel/voxel Viking village replacing only Atlas scenery. Earlier tiny same-row layout is superseded where larger characters cannot fit.
- Reuse existing financial/social queries/cards/source notes and move their section before health/map; no data/provider change or new figures. Existing source/failure/coverage labels retained.
- Built-in scene generation creates central great hall, fitness training hall, treasury, creative workshop, coffee roastery and music/skald harbor hall, physical paths between. Exact official creative logo overlaid separately on blank central flag; original logo pixels/file unchanged. Roads are structural, no fake transfer activity. Existing project-registry destinations/fallbacks and Finance/Music gates retained. Mobile gets labelled directory links below scenic map instead of cramped hotspots.
- Employees156x180 (3x52x60). Ordinary desktop gets scrollable cast shelf above unchanged navigation; >=2200px restores split sides where all9 fit. Reserve document end space, retain tray/hide/quiet/reduced motion. No scaling of official logos; no global nature background replacement.
- Local source/layout design only until compilation and rendered acceptance. No tests unless asked, backend/workflow start, data/migration/provider/release changes. Known blocked local preview path not retried. Blink experiment deferred, never started.

##22October - Owner-requested voxel purple world-serpent
- Need: owner likes village scene but asks for more visible pixel/voxel treatment and a giant Norse sea serpent, then approves direction and specifies purple/colourful serpent. Reuse scene layout,6business buildings and physical roads; no unrelated layout/features.
- Built-in edit creates more blocky terrain/architecture and peripheral world-serpent; targeted second edit changes serpent to purple/magenta/turquoise/gold. Originalv1 and blue study retained; full final PNG/prompts archived. One640300byte WebP delivered under versioned URL with source hash/provenance.
- Adjust flag overlay and shifted treasury/music/core hotspots to final scene. Exact official creative logo remains a separate unchanged asset; no generated logo or new business identity. No new pulses/data/worker claims; stronger purple is explicitly requested scene art, not global UI recolouring.
- Existing3x employees/top finance+social/mobile directory and all data/Finance/Music/spending gates retained. Rendered alignment/desktop/mobile acceptance remains open. No tests/provider/backend/DB/release operations or blocked browser/network workaround.

##22October - Resume management features; notification recovery
- Owner explicitly says animation work is taking too long: retain approved art/basic motion, stop blink/prop experiments and move on. No new avatar edits/generation in this batch.
- Sanity audit: existing notification inbox correctly separates pending decisions from read receipts, keeps decisions available when markers fail, and version-binds saves. Preserve it; no new inbox/store/schema/employee attribution needed.
- Gap: Refresh invalidated data but did not rerun browser hashing when its effect dependencies stayed unchanged after failure. Add explicit refresh generation, clear ready versions, rerun cancellable hashing. Gate repeat saves after a mutation error until the owner explicitly refreshes; idempotent server behavior unchanged.
- UI now describes server-confirmed marker saves rather than promising cross-device persistence before deployed DB readiness is proven. No migration (development approval still conditional), decision approval/action, provider/data operation or runtime test performed.
- Source/local compilation evidence remains distinct from real-owner recovery/persistence/browser acceptance.

##22October - Fleet Desk uncertain-save recovery
- Need: source audit found message/question forms generated a fresh request ID on every retry, defeating existing server duplicate guards after a lost response. Current context/version-retarget and busy guards are adequate and retained.
- Reuse an in-memory ID only for an unchanged submitted payload/context within the mounted form; clear it after confirmed callback success, new payload gets new ID. Messages reuse existing duplicate response; repeated question IDs keep existing409/history-inspection behavior. No claim of recovery across reload, no automatic resubmission or new local storage.
- Add explicit read-only Refresh conversation; keep drafts/answers intact and show clear uncertainty/history guidance. Parent checks refetch error. Use standards-format UUID fallback from browser secure random bytes; remove the old fleet-Date/Math.random fallback that failed server UUID validation. Fail closed without secure random support.
- No API/schema/database writes/migration or provider call performed in this source work; question/answer/Finance/owner/version gates unchanged. No tests unless requested. Actual failed-response/real-owner/reload acceptance remains open.

##22October - Task draft project scope
- Need: project changes and two report-to-draft paths retained inconsistent prior outcome/gate/repository fields or silently replaced typed text. Existing API project/outcome/version locks already reject invalid scope and stay unchanged.
- Simplest fix: one blank-draft factory and shared guarded replacement handler. Confirm before replacing a non-default draft; Cancel preserves it. Reset all project-bound fields, require explicit current-project outcome/gate choice, block invalid/loading scope on submit, and freeze draft controls during save. Both report paths use the same meaning: summary is objective, next action is intended outcome.
- No new store/provider/model calls or schema/API changes. No tests or actual task writes. Type/build evidence is distinct from browser/owner/cancel/persistence acceptance, which remains open.

##22October - Approved single-screen village cockpit
- Owner approved the visual layout and then requested opposite-facing heroes, much larger gestures, a roughly30-second animated village loop, inward illustrated data routes, and more finance/social numbers. This supersedes the earlier animation-stop instruction for this bounded visual task only.
- Existing art, source-backed queries, exact flag logo, roles/IDs, navigation, source-detail forms and backend guards are adequate and preserved. New compact presentation reuses those records; long project/source views remain in a native modal with Projects deep links preserved.
- Simplest suitable scene: lightweight SVG displacement/clipped copies of the existing approved image, water ripples, warm window glow and animated inward paths. No Three.js dependency or invented3D world, new generative character assets, provider calls or continuous canvas render loop. Illustrated flow is explicitly not telemetry; no claim these are verified transfers.
- Avatar facing uses a separate wrapper so mirroring survives gestures. Four heroes face inward/left, existing cutout jump/lean/sway gestures increased substantially; no claim of new articulated frames. One split bottom row at desktop widths replaces the shelf; reserve content space. Existing quiet/hide/reduced-motion controls retained; scene pause/reduced-motion and background-tab suspension added.
- Finance exposes reported revenue/expenses/profit/customers, derived same-window margin, next-month estimates and debt with source limits. Social exposes saved follower/impression/engagement/change figures and platform/venture coverage; each optional aggregate identifies known-reading coverage, missing values stay Unknown, no audience deduplication or live-connection claim.
- Acceptance pending: actual rendered desktop/laptop/mobile/day/night, modal/navigation/keyboard, no overlap, scene pause/reduced motion and actual owner data coverage. No tests or DB/task/provider/release operations authorized by this visual work.

##22October - Owner screenshot corrections
- Actual owner screenshot of527bcc29 shows side-card scrollbars, oversized empty Atlas gutters and disliked floating cutout motion. Source-only checks had not established rendered acceptance; owner screenshot is the new evidence.
- Stop every avatar idle/hover/selected cutout animation; preserve approved facing/art/name/focus/quiet controls. Increase scene displacement4 to7.2 (80%), route width2.5 to4.5, larger glow and brighter window cycle; preserve pause/reduced-motion/background-tab behavior and illustrated-not-live label.
- Reallocate unused Atlas gutters to wider side rails; three-column numeric summaries, short saved-update rows with full text/date on hover and destination, compact health/control rows. Remove all side-card overflow:auto; never replace it with clipping content. Full detail/source views remain available. Short/narrow viewports reflow the page rather than produce inner scroll boxes; target owner desktop1905x940 and standard1080p.
- Put original village image, exact supplied creative mark and pixel wooden business signs in one native SVG scene graphic. No logo regeneration, raster-master edit or new image model call. Transparent labelled building links preserve navigation and keyboard focus; mobile business directory retained.
- No API/schema/data/provider/release changes. No tests. Runtime viewport/contrast/motion/hover/keyboard acceptance remains open until actual preview inspection. Resume automatic checklist work after this bounded correction per explicit new owner request, preserving all gates.

##22October - Bind outcome approval to the reviewed version
- Need: task approval already submits expected plan/outcome versions, but outcome approval submits only an ID. The owner can be looking at an older outcome while a newer version is current. Existing owner/project/Finance/completion locks are adequate and stay unchanged.
- Simple approach: require expected_version in the existing private outcome-approval request, compare it under the existing project and outcome row locks before idempotent success or write, return409 for stale review, and record reviewed version in the existing event. No new store/schema/provider adapter.
- Update the only source caller to display/submit the loaded version, show failures explicitly, and provide read-only outcome refresh. Refresh clears the failed mutation only after a successful reload, so a newer outcome requires fresh owner review/click.
- No automatic approval, provider run, DB mutation or migration performed during implementation. Types/direct builds allowed; no tests unless owner asks. Real-owner stale/concurrent/replay acceptance remains open.

##22October - Ledger recorded-version correlation
- Need: source audit of A-05 finds existing task approval/dispatch events record plan/outcome/dispatch IDs, but the ledger view/export strips all detail fields, hiding even safe linkage needed to reconstruct approvals. Existing filtered metadata-only export and no-inferred-model rule are adequate and retained.
- Simple approach: allowlist only named positive safe-integer version/link fields from event details. Display/export those recorded values, check a recorded dispatch ID against loaded run/task metadata before calling the link matched, and label absent/unloaded/mismatched linkage explicitly. Never copy raw payloads, prose reasons, prompts, secrets or nested plans.
- Version the additive export format. No new API/store/provider call or mutation. Queue with existing draft approval batch; no new manual Pull. Browser/export/persistence acceptance remains open; no tests or runtime writes.

##22October - Owner animation boards and four-second scenes
- Need: owner explicitly supplies final pose sheets, requests all supplied animations, names above heads and an action every3–5seconds. This supersedes the earlier static-only animation correction for these supplied frames; whole-cutout floating remains rejected.
- Simple approach: source-only transparent WebP atlases, CSS stepped playback and one four-second presentation timer. Six supplied designs replace those six portraits; three unsupplied roster members stay static. No model calls/dependencies/worker activity inference.
- Supplied composite discussion/splash/high-five scenes include partners; temporarily hide the duplicate roster portrait, show both names, recover to idle. Quiet/visibility/reduced-motion/offscreen/focus and bounded recovery preserved. Source numbering is unreliable; explicit crop provenance and visible pose inventory retained.
- Every supplied sequence is exposed in Characters for finite replay. No avatar becomes a real call/order/task trigger. Finance/Music/provider/migration gates untouched. Local types/direct build; no tests. Browser and owner acceptance remain open.

##22October - Correct owner-recorded jitter and complete the supplied roster
- Need: actual25.97second owner video shows continuous rapid roster loops, size/position changes and disappearing composite participants; missing company-role captions. Owner supplies all nine updated designs and asks to finish this correction then return to platform checklist.
- Replace strip animation with explicit grid-cell stepping/finite holds, steady rest between4.5second turns, no hidden partner. Use source-only crops/global nonuniform gutter partition/fixed per-character scale/body registration; heuristic eligibility excludes suspected cut-through cells without inventing replacements. Separate single emotes instead of flashing unrelated poses as a montage.
- Names plus screenshot company roles above heads; preserve IDs/permissions and prior Heimdall GM/COO. Lazy full grids over small resting posters preserve visible characters while loading. Existing quiet/reduced-motion/tab/offscreen/focus/recovery retained. No dependency/model/real call/message/task/DB/provider/release operation.
- Source/video contact review and local types/build are evidence; actual corrected-browser timing/appearance/fit/owner acceptance remain open. No extra avatar experiments after this bounded delivery.

##23October - Preserve avatar bodies and equal standing height
- Owner screenshot confirms dark armour/cloak pixels missing and unequal silhouettes. Root cause: blanket dark-pixel alpha removal plus scaling constrained by unrelated action/effect extents.
- Replace blanket deletion with background-only flood removal from cell edges. Enclosed dark artwork remains. Use foreground occupancy for gutter placement, retain source-cell provenance and exclude fragment cells from playback. No image generation or invented poses.
- All nine rest silhouettes now measure132pixels tall in the same288x192 delivery cells, share last occupied row183, and use one fixed scale per character across its clips. Wider transparent padding renders at natural aspect outside the square dock slot so props do not squeeze the body. Actions can naturally crouch/turn; no per-frame scaling or floating motion added.
- Versioned v3 asset paths prevent reuse of damaged cached assets; previous v2 files remain for recovery. Source618cells retained,524eligible for playback,188actions; small posters114514bytes, grids7618860bytes. Crops derive only from supplied sheets; adjacent source art and flattened-sheet edge ambiguity remain limits.
- Visually inspected nine-character equal-height roster and sampled eligible action ends; no actual browser/live preview claim. Dashboard TypeScript and direct Vite build passed;760modules. No tests/backend/DB/provider/release operations. Prepare separate owner review PR; PR27 management batch untouched.

##23October - Backend global dispatch reservation
- Owner explicitly prioritizes full backend functionality and parks all frontend images. Scope is the finite A+B finish criteria, with real acceptance required; no implied provider, billing, database or deployment permission.
- Need: different project locks do not serialize global dispatch. The config snapshot read before a transaction can also age behind Stop All or a configuration change.
- Simple approach: lock existing singleton dispatch config before project/task locks, recheck current readiness and use that locked model/project/repository/branch snapshot. All dashboard reservations share the lock. No new table, migration, scheduler or paid call.
- Until authenticated provider termination evidence exists, ANY dispatch history blocks a second run, including locally terminal records. Do not delete history or fabricate a release to clear the barrier. This deliberately supports at most one future pilot, not an operating queue.
- Source review: Stop All takes singleton config before project controls; reservation follows the same order. Current hard safety flags still false. Existing task/outcome/Finance/deadline/attempt/repository/question guards retained.
- Remaining: stop after reservation but before provider request, atomic post-start persistence, real provider termination/verified release, durable worker pickup, authenticated checkpoints/messages and included-usage eligibility. This change alone does not verify safe stopping or B-02.
- API TypeScript noEmit exit0 and direct API build exit0 (2.5MB entry); diff check clear. No tests, backend start, DB/task/provider operation, merge or deployment. Runtime concurrency/stop/restart acceptance remains open.
- Follow-up in the same batch: accepted provider run IDs, task state and start event now save atomically. Recheck controls/config version/task version/deadline/blocking question after the network response; if they changed, record needs_owner while keeping external run status separate. This does not cancel a run or close the earlier network-start race. Title is now included in existing credential-like prompt screening. Recompiled API TypeScript/direct build exit0 after these changes; no tests/runtime operations.

##23October - Validate accepted Cursor identity before persistence
- Need: existing create adapter accepts any string agent/run IDs, without checking returned run.agentId or reserved agent identity. That can bind the wrong external run to a local task and undermine later cancellation/recovery.
- Minimal change in the existing used adapter: validate reserved bc-ID before HTTP, require returned agent.id and run.agentId to exactly match it, reject malformed run-ID/object/array responses. Treat mismatch as ambiguous so existing reservation/no-auto-retry behavior stays in force. No new provider route or transport.
- Wrap JSON parse failure in fixed text so parser excerpts of provider bodies do not enter persisted error summaries/events. No raw response logging added.
- API TypeScript noEmit exit0 and diff-check clear; direct API build required for changed adapter. No tests/backend/DB/task/provider calls, migration, publication or release. Hard guards remain false; actual provider-response/runtime acceptance still open.
- Direct API build after adapter change exit0/2.5MB entry. Source review follows documented v1 create response binding (agent.id, run.id, run.agentId); ID format checks deliberately fail closed on unsupported future identifiers. Not a provider run or verified cancellation.

##23October - Keep accepted run binding on local save failure
- Combined backend source review found accepted IDs were only in the failed start transaction: its failure entered the generic catch without saving that validated binding. Preserve accepted result in request scope; recovery transaction retains IDs and needs_owner with its event together when DB storage is available.
- Recovery follows config->control->task lock order, does not replay provider submission, change approval/task state or mark cancellation/termination. Current task status is used in the event rather than invented approved status. If recovery DB write also fails, existing reservation still blocks another dispatch; crash recovery is not proved.
- Persist fixed safe failure descriptions rather than arbitrary SQL/network errors. No raw exception/response log added. IDs are only copied after strict create response validation.
- API TypeScript noEmit exit0 and diff-check clear. No tests/backend/DB/task/provider/migration/publication/release. Hard flags false; durable start-intent/cancel receipts and runtime failure acceptance remain open.
- Direct API build exit0/2.5MB after recovery change. Reviewed complete backend diff against base45add2f; no UI/schema/dependency/provider enablement changes. Existing checks do not establish real concurrent/restart/cancellation behavior.

##24October - Resume authorised backend: durable cancellation recovery
- Owner explicitly reiterates finish development. Previous standby incorrectly treated live-operation prerequisites as a block on all source development. Source work resumes; no new permission request for already approved development.
- Need: preserve submission identity before HTTP, stop/reenable barrier, durable cancellation claims and exact-run evidence after restart. Reuse existing dispatch/event storage instead of creating an unnecessary migration. No timer or process-local lock substituted for durable state.
- Implemented reserved agent ID, locked submission preflight/event, durable local recovery requirements for all historical dispatch statuses, late-start/save-failure requirements, bounded claimed cancellation service, strict exact-run transport, real-owner recovery GET and source-gated cancellation POST. See CURSOR_CANCELLATION_RECOVERY.md.
- API TypeScript noEmit exit0 and direct API build exit0 (2.5MB). Source self-review, not independent/runtime review. No tests added/run; no backend, DB, provider, migration, merge or deployment operation. All live guards remain false. No global release/task acceptance/checkpoint claim from terminal observations.
- Remaining source work is active: ambiguous submissions, verified all-history release, durable pickup/deadline runner, genuine checkpoints and communications. Full A/B acceptance remains open; no invented percentage increase.
# 24 October 2026 — ambiguous Cursor submission recovery (PR30 extension)

Integrated bounded reserved-agent lookup into the durable cancellation service.
Requires server pre-submit evidence and a single unpaginated run; validates exact
agent/run identity and timestamps before saving a missing binding. Three GETs
maximum, no create/steer/resume/cancel during lookup. Unknown results preserve
the global reservation. Late accepted-start persistence cannot replace a
different recovered binding. Existing source gates remain false. No tests,
provider calls, DB operations, migration, merge or deployment performed.
API TypeScript noEmit and direct API build passed; source diff reviewed. Runtime
concurrency/provider recovery remains unverified, and live flags remain false.

## 24 October 2026 — trusted dispatch reservation release source

All-history barrier consumes only exact server-authored release evidence with
valid claim/settled submission. Local completed/failed state cannot release it.
Explicit real-owner release saves bounded claims and validates exact terminal run,
single unpaginated run history and IDLE agent. Source gates remain false until
exclusive submission authority and provider/recovery behavior are verified.
No task acceptance/resume, provider call, DB operation, migration or deployment.
No tests added or run. API TypeScript noEmit and direct API build passed; source
diff self-reviewed. Runtime concurrency/provider behavior remains unverified.

## 24 October 2026 — frozen execution bounds and durable deadline action

Save immutable execution bound with reservation; enforce earlier owner/time-cap
deadline before HTTP and on late acceptance. Explicit owner deadline check uses
DB time and saved bound, deduplicates recovery intent/event under shared locks,
and marks active work needs_owner without rewriting completed task acceptance.
No provider cancellation, slot release, retry, automatic scheduler or queue pickup
claim. Existing schema reused. No tests, DB/provider/runtime operations performed.
API TypeScript noEmit/direct API build passed and source diff self-reviewed.

## 24 October 2026 — shared bounded dispatch service

Extracted dispatch orchestration from the authenticated owner route into
cursor-work-dispatch.ts; response status/body mappings and all existing guards
remain. Shared project controls/locks/readiness now live in managed-work-controls.ts
with compatible route re-exports. No route/service circular dependency or internal
HTTP. No worker/scheduler/timer/provider/DB operation or live enablement performed.
No tests added or run. Final API TypeScript noEmit/direct API build passed; source
extraction reviewed. Runtime acceptance remains open.
