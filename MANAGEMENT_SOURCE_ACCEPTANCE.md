# Management source acceptance — 24 October 2026

Baseline: outer revised A/B finish criteria. This is a bounded source review, not
owner, runtime or production acceptance. No criterion is marked fully complete.

| Criterion | Current source evidence | Remaining acceptance/work |
| --- | --- | --- |
| A-01 map | Nine-role registry, evidence category/source/date/scope, directional links, drill-down and semantic text list in CompanyMap. | Actual owner journey, current relationship evidence and device/accessibility verification. Static records are not live connections. |
| A-02 board | CompanyWorkBoard now lazily projects existing saved controls, versioned outcomes, task plans and blocking question counts. Existing AI Stack records remain authoritative. | Dependencies, accepted company plan and scoped worker export remain incomplete. No missing business goal is invented. |
| A-03 controls | Real-owner managed/legacy/status writes; atomic project locks for OFF/hold; decision locks; disabled paid-call/dispatch boundaries; exact reservation/recovery source. | Runtime bypass/cross-project/replay/concurrency proof and accepted live operation. Finance hard hold retained. |
| A-04 Fleet Desk | Version-bound saved messages/questions/answers, stale/duplicate guards, explicit no-delivery/no-approval/no-resume wording. | Owner journey and B-03 genuine provider communication. Queued dashboard text is not provider delivery. |
| A-05 ledger | Existing task/outcome/question/handover/project events, dispatch bindings and worker invocation receipts have separate durable source contracts. | One navigable evidence projection and end-to-end reconstruction remain incomplete/unverified; no private thinking or provider prose should be imported. |
| A-06 inbox/dock | Decision inbox has exact-action links, version-bound independent read markers and reduced-motion/quiet source. Owner-only receipt APIs fail safely when storage is unavailable. | Receipt migration still unapplied; isolated/no-added-cost recovery and actual persistent read-state/owner/device acceptance. Employee ingress remains separate. No graphics changed by this review. |
| A-07 combined release | Seven page components plus shared login/layout/brand assets exist; no design replacement was performed here. | Combined serving commit/build/schema, backup/restore and owner theme/device/route acceptance. A local build is not a live release. |

## Company work projection boundaries

GET /api/company/work-board requires a real owner session, uses bounded reads
within the four existing managed project keys, returns no credential, prompt,
repository, acceptance prose or provider event payload, and makes no inserts or
provider calls. It reuses existing controls/outcomes/tasks/questions; there is
no new table, permission system, task store, service or dependency. Truncation is
explicit. Reads can change independently and must not be used to approve a stale
version; actual approval endpoints recheck their current versions under locks.

The collapsed Company Map work section loads on opening, does not poll, validates
the response, separates error/loading/empty/partial records and links task IDs to
the existing exact task view. Missing approved outcomes do not become Ready.
Dependencies and company-plan acceptance are explicitly not established. Viewing
the board never starts work, approves it, clears a blocker or releases a hold.

## Finite remaining source work

Finish the A-02 dependency/plan acceptance and scoped export design against the
existing records. COMPANY_PLAN_CONTRACT.md now records the bounded design;
implementation and runtime acceptance remain open. The A-05 bounded evidence projection is now source implemented;
complete runtime history reconstruction and owner acceptance remain open. Preserve adequate
current controls rather than add alternate task truth. B-03/B-04 capability gaps
are recorded in CURSOR_CHECKPOINT_COMMUNICATION_AUDIT.md; source adapters cannot
substitute for provider/worker proof. Remaining live checks require their existing
separate authority and safety prerequisites. Final open-source discovery stays last.

No tests, database/provider/worker operations, migration, merge, deployment or owner
acceptance occurred during this source review. Clean/minimal/secure infrastructure,
Finance hold, unchanged Music and parked graphics remain requirements.

## Activity projection source boundary — 24 October 2026

GET /api/company/activity requires the existing real owner session and no-store.
It reads at most 51 records from each of five existing event sources, returns 50
with per-source truncation, and limits scope to the four managed project keys.
Only named metadata is selected; raw details, prompts, private thinking and
provider output are excluded. Version values must be positive integers or become
unknown. No new storage, schema, dependency, service, worker access or write path.
The lazy Company Map activity section validates responses, filters the limited
records by project and links exact managed task IDs. Question/outcome/handover IDs
are separately labelled, never confused with managed tasks. Legacy project audit
has no established actor/timezone, so no invented actor/date or global chronology.
Independent reads are not a transaction snapshot or complete history. Missing
data is not success; no execution, recovery, cost, model or owner acceptance proof.
API/frontend TypeScript and direct API/Vite builds passed. No tests or live checks.

A02 increment: strict bounded manifest/DAG parsing, canonical digest and shared
pure version/binding/transitive-prerequisite evaluation are consumed by an
owner-only unsaved preview API. Invalid/duplicate/out-of-scope/cyclic references
are rejected. No task prose is accepted in the manifest or returned. Preview
always says accepted=false and execution_authorized=false; independently read
records are not an approval snapshot. API TypeScript/direct build passed; no
tests/runtime/DB operations. Durable revision service, owner review UI and
approval/selection/pre-HTTP enforcement remain required before enablement.

A02 revision source increment: one new source-only immutable company-plan
reference receipt table/service, owner history/propose/accept/withdraw API,
hardcoded false gate before any new-table access. Existing config lock serializes
writers; ordered controls/outcomes/tasks, exact head/digest/reference and replay
checks, immutable receipts, withdrawal even while OFF. No duplicate task bodies,
new service/package or existing-table columns. DB declaration/API compilation
and API build passed; no tests or actual database/schema operations. Owner review
UI and all work-consumer enforcement are still required; feature stays disabled.

A02 enforcement increment: source now shares the same current accepted-plan
context across approval, worker selection, reservation and pre-HTTP checks, plus
late-response recovery. Config/all-project locks precede task/outcome locks;
exact digest/bindings/transitive evidence and fixed allowed-task scope. Recorded
revision metadata and selected-task-only export added. Feature remains false;
owner review UI, rollout and actual runtime acceptance remain open. API TypeScript
and direct API build passed; no tests/provider/DB/runtime operations.
