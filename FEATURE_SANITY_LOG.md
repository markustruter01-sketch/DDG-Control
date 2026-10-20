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
