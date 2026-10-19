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
