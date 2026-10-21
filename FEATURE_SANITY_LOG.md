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
