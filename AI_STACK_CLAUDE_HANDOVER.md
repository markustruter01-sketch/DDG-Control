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
