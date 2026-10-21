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
