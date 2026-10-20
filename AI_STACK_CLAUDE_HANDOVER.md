# AI Stack dashboard handover for Claude

## Scope

This change adds a separate `/ai-stack` dashboard page with read-only Cursor Cloud Agent status and token usage. Existing business pages and the existing `/agents` page were not intentionally changed. The page does not launch, stop, or modify agents, make model calls, or switch providers. It never reads or displays API keys.

## Existing files changed to connect the new page

- `artifacts/ddg-control/src/components/header.tsx` — added one `AI Stack` navigation link pointing to `/ai-stack`.
- `artifacts/ddg-control/src/lib/router.tsx` — registered the `/ai-stack` route.
- `artifacts/ddg-control/src/ddg.css` — added styles under `.ai-stack-*`; keep future AI Stack styling scoped to these selectors.
- `artifacts/api-server/src/routes/agents.ts` — added authenticated `GET /api/cursor/cloud-agents`. It calls Cursor read-only list, agent, latest-run, and token-usage endpoints; the server caches the response for 30 seconds. The usage response includes input/output/cache read/cache write/total token counts. Cursor key stays server-side. Errors do not return API responses or secrets.

## New page

- `artifacts/ddg-control/src/pages/AIStack.tsx` — separate page with a 60-second status refresh, latest agent runs, final reply, branch, token chart, safety notes, draft provider order, and project list. The Work, Usage, and Safety summary panels open detail dialogs. The dialogs show all Cursor fields currently fetched, token breakdowns, known limits, and unavailable data. It clearly labels unconnected providers and does not start or control runs.

## Required follow-up

1. Cursor's run API exposes states and a final result, but this endpoint does not provide a reliable explicit "waiting for owner" status. The page says this instead of guessing. A future task queue must record owner approval waits itself.
2. Cursor's usage endpoint reports token counts only. It does not provide the plan's included allowance, remaining quota, or a reliable cost estimate here. Do not use these counts to trigger provider fallback.
3. Cursor Cloud Agent runs can incur model API charges. Do not add POST calls or automatic starts until the owner explicitly approves the billing setup and confirms the plan/usage terms.
4. Confirm model priority against current benchmarks and the owner's actual included plans before enabling automatic fallback. The displayed order is a draft, not a working rotation.
5. Use a separate branch per job, require owner review before merging, and keep each worker limited to its selected project repository.
6. Keep extra spending disabled unless the owner explicitly changes that setting.
7. Update this handover with verified implementation details and checks after further integration.

## New detail dialogs

- Clicking the Work, Usage, or Safety summary panel opens its details. Escape, the close button, or clicking the shaded background closes the dialog.
- Work details show up to eight recent Cursor agents, run state, repo, final result, branches, pull requests, and timestamps. Cursor does not provide the model ID or a reliable owner-wait flag in the data used here.
- Usage details show per-latest-run token categories (input, output, cache read, cache written, total) for up to eight Cursor agents. These are not costs, included quota, or remaining plan allowance. Other providers are not connected.
- Safety details explain the read-only access and remaining limits. Dialogs are summaries of known facts, not a full security certification.
- The new API fields are part of the existing read-only `GET /api/cursor/cloud-agents` response; no write or agent-start route was added.

## Guardrail

Do not refactor existing business pages or the existing `Agents` page as part of this work. If another existing file must change, tell the owner first and explain the exact file and reason. `AGENTS.md` had a separate pre-existing uncommitted change when this task began; it was not edited for this work and must not be included in this task's commit.

## 2026-10-19 visual/navigation update

- Updated the shared header navigation to five independent floating circular controls: Projects, Work, Home, AI Stack, and Finance. Home is centered, larger, and raised. The controls are not joined into a dock or bar.
- Projects scrolls to the existing project list on Home. Work opens an Agents / Approvals menu and retains the pending approval count; Organisation remains reachable as a secondary Work-menu link. Theme and logout remain small top-right utility controls.
- Updated the shared styles for the requested warm landscape and glass-like controls, with responsive spacing for desktop and phone.
- Kept the existing AI Stack sections, API polling, chart, read-only safety copy, and Work / Usage / Safety detail windows; no integration or business logic was changed.
- Files changed for this update: `artifacts/ddg-control/src/components/header.tsx`, `artifacts/ddg-control/src/pages/Home.tsx` (anchor only), and `artifacts/ddg-control/src/ddg.css`.
- Verification: `pnpm run typecheck` passed; `PORT=26196 BASE_PATH=/ pnpm --filter @workspace/ddg-control run build` passed with the existing large-chunk warning. Desktop and phone previews were checked. The current AI Stack view reports a Cursor connection error; GET `/api/cursor/cloud-agents` returned 404 during the check. This was not changed as part of the visual update.

## Display name

Heimdall is the current display name for the DDG Control GM/COO persona. Current UI copy, display-only member labels, and human-readable OpenAPI summaries use Heimdall. Legacy technical identifiers and stored values—including API routes, operation/schema IDs, the persisted `"Ollie"` member value, enum values, environment-variable names, generated client names, and archived prompt files—remain unchanged for compatibility. The UI formats the legacy member value as Heimdall without rewriting stored records.

## 2026-10-19 project work management completion pass

- Added additive work-control, owner-audit, managed-work, task-history, checkpoint, and checkpoint-event tables. Migration: `lib/db/migrations/20261019_work_management.sql`; reverse-order rollback: `lib/db/migrations/20261019_work_management_rollback.sql`. The migration was applied only to the confirmed Replit development database (`heliumdb`); production was not queried or changed.
- Four work controls default OFF: Finance, Fitness/Hypest, Coffee/Cattle Dog Coffee, and DDG Control AI Stack. DDG Music has no control. Dashboard-mediated recommendations, task approvals/updates, notes, and agent report updates check the project state. OFF cannot stop agents started outside this dashboard.
- Work items require a bounded objective/outcome/checklist, acceptance checks, a future deadline, attempt/time limits, zero spend, and a stop condition. They remain pending until owner approval; approval does not start an agent. Per-project active work uniqueness is enforced. Completion requires acceptance evidence; owner-completed projects reject further managed work.
- Heimdall suggestions are loaded from saved reports only; loading them makes no xAI/model call. Checkpoint save and resume are manual and auditable. Five minutes is a reminder target, not a verified automatic checkpoint.
- Model identity, quota, cost, and owner-wait status remain unknown without an authoritative source. No external agent start, merge, or deployment is performed.
- Review limits: development schema creation was verified. The rollback file was not executed against the feature tables because it would delete their records. Signed-in browser coverage and route-level integration tests remain release checks.
- Owner authorization update: Finance remains hard-held OFF until Claude's later review. Finance work cannot be enabled or queued through these controls; no trading strategy or trading logic was changed. The current global Heimdall run remains paused while any required work control is OFF.

## 2026-10-19 bounded queue/readiness continuation

- Added `managed_work_outcomes` and append-only `managed_work_outcome_events`, plus outcome/gate/repository/branch/dispatch metadata on managed work items. The additive migration is `lib/db/migrations/20261019_safe_work_orchestration.sql`; its destructive reverse is documented separately and must not be used without exporting these new records.
- Applied the additive schema only to the confirmed development database. Added one DDG Control outcome in `pending_approval` and four bounded `pending_approval` work items covering provider entitlement/no-overage, repository permissions, safe idempotent dispatch, and interruption recovery. All four have finite time/attempt limits, acceptance checks, stop instructions, zero app-side spend, and a repository/branch association.
- The UI now shows the outcome gates and activation blockers. `/work-readiness` explicitly reports dispatch disabled. Approval and `in_progress` transitions return HTTP 423 while no eligible dispatch adapter is configured; no endpoint starts a worker. Existing project OFF and Finance hard-hold checks still apply. Same-repository active work is guarded by a partial unique index.
- Manual checkpoint and resume remain the only supported checkpoint path. There is no verified worker callback or automatic five-minute capture. ChatGPT quota detection and automatic provider/model switching are not implemented.
- Cursor entitlement, included use, no-overage state, model eligibility, and repo permissions remain unverified for the owner's account. The worker/dispatch adapter is not implemented, so publication would expose a disabled queue rather than a working agent-start flow. No production migration, provider/model call, worker start, merge, or deployment was performed in this continuation.

## 2026-10-20 Cursor Cloud Agent adapter (dispatch remains owner-gated)

- Added a server-only Cursor Cloud Agents API v1 adapter. It sends one explicit model, one owner-approved repository/starting branch, a bounded task prompt, and `autoCreatePR: false`. No fallback, browser key, model call, or provider request was used during implementation or verification.
- Added additive dispatch configuration/ledger schema and rollback files: `20261020_cursor_dispatch_ledger.sql` / `_rollback.sql` and `20261020_cursor_dispatch_bindings.sql` / `_rollback.sql`. Both additive migrations were applied and verified only on the existing development database; default dispatch and all owner confirmation flags are false. Production was not queried or changed.
- Dispatch requires a real authenticated session (development auth bypass is explicitly rejected), project ON, non-Finance project, approved outcome and work item, future deadline, remaining attempt limit, zero spend, explicit model, owner confirmations, present server secret, and exact owner-approved repo/branch. Secret values are never returned or logged.
- Each task gets a durable unique dispatch reservation before the external request. A prior reservation blocks resubmission; an ambiguous request is recorded as `needs_owner`, with no blind retry. Provider/run identifiers and initial status are persisted when returned. Task and dispatch history is visible in the dashboard.
- The dispatch toggle and dispatch route are also hard-blocked because this adapter cannot enforce or verify an active provider run's wall-clock stop. Automatic queue pickup remains OFF: Replit deployment processes may restart or move and this app has no separate durable worker or verified callback. Five-minute checkpoints remain manual. Cursor plan/model entitlement, included allowance, no-overage protection, repository/branch/project binding, and an enforceable run stop must be verified before any future enablement. Finance remains hard-held and OFF; DDG Music is unchanged.
- The outcome still needs owner approval before its child work items can be approved. No task was dispatched, no API/model call was made, and no agent was started.

## 2026-10-20 Fleet Desk (dashboard-only handoff)

- Added `artifacts/ddg-control/src/components/FleetDesk.tsx` and placed it at the top of AI Stack in `src/pages/AIStack.tsx`. It provides project/task context, a Current task view, Needs your decision inbox, saved-report-only next-work preview, and expandable conversation/answer history.
- Added authenticated routes in `artifacts/api-server/src/routes/fleet-desk.ts` and mounted them from `src/routes/index.ts`. Dashboard drafts and notes are append-only, carry server-validated project/task/plan/outcome versions, and use idempotency IDs. A changed selection cannot silently retarget an unsaved draft.
- Owner questions have stable IDs, options, recommendation, blocking status, and version snapshots. Answers require a real owner session (development bypass is rejected), are append-only and duplicate-protected, and never approve or resume work. Stale task/outcome versions are rejected and recorded.
- Open blocking questions for a matching task plan version prevent approval, dispatch, status approval, and checkpoint resume; questions from older plan/outcome versions remain visible as stale history.
- Work-item status changes and checkpoint resume also reject development auth bypass; a genuine owner session is required before these owner actions can mutate state.
- Added `plan_version` and five additive Fleet Desk tables in `lib/db/src/schema/work-management.ts`; the migration and destructive rollback are `20261020_fleet_desk.sql` and `20261020_fleet_desk_rollback.sql`. The additive migration was applied and table presence verified only in the development database. Production was not accessed or changed.
- Provider messaging remains unavailable. Drafts are stored as drafts; notes are dashboard-only; notes composed during an active recorded run are queued only for owner follow-up and are not sent or allowed to interrupt that run. No provider/model call or worker start was made. The UI explicitly shows “No active worker”/“Unknown” when no durable run data exists; voice and quota detection remain planned/unavailable.
- Task proposals preview only a saved Heimdall report for one selected eligible project and hand it to the existing bounded approval form. Finance and DDG Music are excluded from this proposal action; existing OFF controls, Finance hard hold, and DDG Music data/status were not changed.
- Updated files: `AI_STACK_CLAUDE_HANDOVER.md`, `artifacts/api-server/src/routes/fleet-desk.ts`, `artifacts/api-server/src/routes/index.ts`, `artifacts/ddg-control/src/components/FleetDesk.tsx`, `artifacts/ddg-control/src/pages/AIStack.tsx`, `lib/db/src/schema/work-management.ts`, `lib/db/migrations/20261020_fleet_desk.sql`, and its rollback.
- Release limits: no Cursor dispatch or automatic pickup; no provider delivery; owner-answer submission has not been verified with a real signed-in owner session in this development preview. Migration rollback was inspected but not executed because it drops Fleet Desk records. Production remains untouched and this update was not published.

## 2026-10-20 Company Map (management visibility slice)

- `artifacts/ddg-control/src/components/CompanyMap.tsx` and `src/lib/company-map-data.ts` add a curated company map to the existing `/organisation` page. `src/components/company-map.css` scopes the ice/navy/cyan visual treatment. `src/pages/Home.tsx` adds a Company Map entry; no new route or primary navigation destination was added.
- The map is a versioned source/owner-evidence registry, not a live integration graph. Each node and relationship has stable IDs, source/date, evidence category, configuration and health distinguished, and a next action. Owner-supplied GitHub metadata is explicitly timestamped and described as metadata only.
- The company work board remains visibly pending. Existing `managed_work_items` stay the task source; the map resolves exact existing task titles through authenticated read-only `GET /api/work-items`. No company plan task table, agent export route, role grants, or new work item was created.
- Gaps are labeled as source findings or suspected bottlenecks, never incidents. Related task links only appear when an exact existing DDG Control task title is found; otherwise the UI explains no task record is linked.
- Finance remains held, DDG Music remains unchanged, the possible tenth Grokbot and creative-operations mapping remain unknown, and there is no provider/model call, agent start, repository rename, production mutation, or publication.
- The map records milestone A (verified company visibility/control) and milestone B (verified automated execution) as not accepted. Automatic takeover remains blocked pending scoped identity/export, real owner approvals, ledger/notifications, provider allowance/no-overage, durable worker/run-stop/recovery, actual messaging, and a tested five-minute checkpoint callback.
- Full Glacier Glitch redesign and exact logo transfer remain pending. Owner's final layout target is recorded as planned rather than presented as implemented. The existing Organisation roster remains static; the map flags that Tyr is not yet in the static source.
- No live health or production check was performed. `/api/healthz` is static; the map's repository metadata dates originate in owner-supplied Codex verification and are not rechecked on render.

## 2026-10-20 Glacier Glitch shared shell + AI Stack slice

- This is the bounded first slice of the owner-approved whole-platform redesign, not completion of the whole-platform visual phase. Updated the shared color tokens, common card surfaces, header and bottom navigation in `artifacts/ddg-control/src/ddg.css`; updated `src/components/header.tsx` to use text-only DDG Control branding and five separate primary destinations: Projects, Decisions, centered Home, AI Stack and Finance. The Agents and Company Map links are contextual.
- `src/pages/AIStack.tsx` now leads with a compact summary from existing work-control/Cursor response data, then Fleet Desk, agent activity, usage, safety, project/provider-plan, work-switch, handover and decisions/history categories. Long Cursor results and technical forms start collapsed; existing API calls, task binding, approval behavior, work-control state and history were preserved. Summary shows Unknown/stale when source data is unavailable; token totals are not represented as cost or quota.
- `src/components/FleetDesk.tsx` keeps project/task context and Needs your decision visible while proposal preview, conversation history, dashboard-note and owner-question entry forms start collapsed. The proposal entry point sits near the project/task context; mobile order keeps the owner decision card ahead of secondary panels. This slice adds no API route or data model.
- No exact official logo asset was found in the app, so the header uses clean “DDG Control” text and the former generic circle mark was removed. No production employee sprites are present; no replacement characters or hide/restore control were added. Sprite/animation work remains pending.
- The requested Home/Organisation/Company Map, Agents, Decisions, Finance, project-detail and authentication/loading/error/empty-state redesign remains outstanding; only shared shell styling and AI Stack/Fleet Desk were changed here. The full-page audit/redesign remains a later bounded phase.
- Finance controls and hold, DDG Music, project/task records, auth, backend/schema and deployment were not changed. The preview read existing control state as 0/4 work areas ON. API logs for the final preview show only dashboard GET reads; the development auth bypass disabled Cursor polling. No provider/model calls, worker starts, secret access, production mutation, merge or publication occurred.
- Final local checks: `pnpm --filter @workspace/ddg-control typecheck` passed; `PORT=3000 BASE_PATH=/ddg-control/ pnpm --filter @workspace/ddg-control build` passed. Vite emitted its existing >500 kB JavaScript chunk-size advisory, but the build completed. The web workflow restarted successfully and the `/ai-stack` preview rendered at desktop and 402px mobile widths without browser console errors. The inspected preview is development auth-bypass only; owner-signed-in and production behavior were not verified. Day-mode contrast rules were added, but only the dark-mode preview was visually captured. No automated feature tests were run in this slice.
- Current branch is `codex/company-map`; changes remain uncommitted for review. This preview is not a release sign-off and was not published.

## 2026-10-20 Shared navigation overlap correction

- Changed `artifacts/ddg-control/src/components/header.tsx` so the five-button primary navigation is a sibling of the top header, not a child positioned over page content.
- Changed `artifacts/ddg-control/src/ddg.css` to reserve a dedicated bottom grid row for the dock and use the page's main area as the scroll region. The dock includes device safe-area padding; expanded content remains reachable above it on narrow and tall screens. The five destinations, centered Home geometry, and button labels are unchanged.
- No content, routes, data, auth, project controls, or work behavior were removed or changed. Finance remains OFF/held; DDG Music remains unchanged.
- The broader redesign backlog remains: Home, Organisation/Company Map, Agents, Decisions, Finance, project detail, auth and shared loading/error/empty states still need page-by-page visual review. Exact logo assets remain unavailable in-app.
- This correction was visually checked in the development preview at desktop and mobile sizes after the layout change. No new tests, typecheck, or build were run per owner instruction. Owner-signed-in and production behavior remain unverified; no publish or production data change occurred.

## 2026-10-20 Home company cockpit slice

- Home (`/`) now presents company health first, business performance second, and saved project/Heimdall report activity third. Existing project links/cards, Company Map link, decision queue, social snapshot entry, and “Since last report” remain available.
- The health card reports project registry statuses separately from service health; operational service health stays Unknown because no dependency health source is available. Attention items link to existing pending Decisions records and saved red Heimdall report flags; no new approval source was added.
- Finance summaries use the existing finance summary endpoint. Periods are labelled (30 days/next-month estimate); the response has no source timestamp, so finance source date is explicitly Unknown. Social figures show saved source and capture date, label manual entries, and state that summed platform followers are not unique people. Missing social readings are Unknown, not zero.
- Project cards and latest saved report records use existing data/hooks only; no routes, APIs, schema, provider calls, workers, or production data were changed. Finance hold and DDG Music remain unchanged.
- Checklist status: Home cockpit is built in the development workspace; source/UI review is not a full functional test, and no new test/build/typecheck was run at owner request. Owner-session and production/live verification remain unverified. Other redesigned pages remain pending.

## 2026-10-20 Codex Decisions cockpit slice

- Codex is now primary coder. Branch codex/decisions-cockpit starts at Replit Home commit 809e24113c3e7956887c13068af905dc1a022c5c; older local dirty checkout preserved.
- Decisions uses shared Glacier Glitch cockpit panels, project filtering, source-record queue counts, collapsed pending recommendations and collapsed history. History failure is displayed rather than reported as an empty successful history; pending records load independently from history failures.
- No approval mutation, backend, worker, credentials, production data, Finance strategy or Music changes. Existing decision workflow remains unchanged; viewing is not approval.
- Missing outcome/time/recovery fields are not invented by this visual change. Authorization audit remains outstanding.
- No tests, build or typecheck run. Rendered desktop/mobile, real owner session, accessibility and live deployment remain unverified. Do not publish based solely on these source edits.

## 2026-10-20 Owner-reported regression corrections

- Owner screenshots exposed a Decisions runtime crash: stale isLoading reference after splitting pending/history queries. Changed remaining reference to historyLoading.
- Day Home used dark glass with navy text. Added paired semantic foreground/surface tokens, consistent Home/Decisions text, larger supporting type, visible navigation labels, and day work-card surfaces. This is a focused corrective pass, not whole-site visual acceptance.
- Owner explicitly rejected nested main scrolling. Removed viewport-locked grid/inner scrolling; document now grows naturally, with fixed dock and bottom safe-space reservation so final content remains reachable.
- Source changes saved on existing PR2 branch; no deployment, approval/backend or business-repository changes. No tests/build/typecheck run. Replit exact-revision preview requested; rendered acceptance and real-owner/live behavior remain outstanding. Do not mark complete until observed.

## 2026-10-20 Approved Company Atlas first source slice

- Owner chose Concept03: left metrics, central company structure map, right attention, lower finance/social panels. Codex added this first Home source layout with real reported profit and nine named-role count (not active agents).
- Map has accessible expandable nodes and existing project/context links; dashed cables explicitly represent agreed structural relationships, NOT verified data paths. No fabricated activity, health scores, workload percentages or animation. Finance remains labelled held; Music unchanged.
- Exact glacier photography, official logo, approved mythology sprites and event-backed transfer animation remain outstanding. Existing finance/social panels retained below; per-business metric attribution and live transfer ingress are not invented.
- No tests/build/typecheck/render checks performed in this slice. Same PR2 branch; do not merge/publish before review. Previous regression fixes still require preview/owner verification.
