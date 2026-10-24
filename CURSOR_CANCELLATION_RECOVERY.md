# Cursor cancellation and recovery source batch — 24 October 2026

Status: source implementation, not live acceptance. No database migration or
provider operation performed. Existing dispatch safety flags and the new live
cancellation flag are false. Finance remains held; Music and graphics unchanged.

## Implementation

- Persist the reserved agent ID with the dispatch before any HTTP submission.
- Before submission, lock config -> control -> task -> dispatch, recheck current
  approval/outcome versions, deadline, controls and blocking questions, and save
  a submission event. No database lock is held during HTTP.
- Dashboard blocking saves an idempotent cancellation/recovery requirement for
  every dispatch, including locally failed/completed rows. This is a saved local
  requirement, not a provider cancellation request or proof of termination.
- A saved requirement survives stop followed by reenable. An accepted late start
  remains needs_owner; local-save recovery also records the requirement.
- Real-owner cancellation endpoint accepts a dispatch ID and explicit action,
  never browser-supplied provider IDs or terminal receipts. Its live gate returns
  423 before credentials, DB claims or HTTP are used.
- The integrated service saves a claim before HTTP, serializes across servers on
  the config row, expires claims after 90 seconds, allows at most three explicit
  attempts, and applies a further 60-second backoff after expiry. Expired workers
  cannot save evidence over a newer claim. Crashes consume the saved attempt.
- Each transport request has a 25-second timeout and refuses redirects. A cancel
  acknowledgement or 409 does not establish termination. A separate authenticated
  GET validates exact agent/run identity, allowlisted status and timestamp.
- Append-only observations exclude result prose, secrets and per-agent git
  snapshots. Unknown/malformed/error responses remain unresolved.
- Real-owner recovery GET returns saved ledger evidence and explicitly says it
  is not a current provider check. It performs no polling or state mutation.

## Storage and compatibility

Uses existing managed_work_dispatches and managed_work_events. No new schema,
executable migration, startup task, timer or dependency. Current DB uniqueness
allows one dispatch per task; intent deduplication depends on that invariant.
All writers for this cancellation protocol must hold the singleton config lock.
This is server-authored ledger evidence, not protection against a privileged
database administrator rewriting data. No public/inbound receipt writer added.

Existing dashboard block wording remains accurate: provider cancellation is
not requested or verified. A separately authorised cancel action is necessary
when the source gate is eventually enabled. The cancellation action never
automatically retries, creates/archives/deletes agents, resumes work, accepts
tasks or releases the global slot. Explicit source-gated release is described below.

## Evidence and remaining work

API TypeScript noEmit and direct API bundle passed for this code batch. Source
self-review covered lock order, late start, stop/reenable, bounded claims,
identity checks, HTTP outside locks and response privacy. No tests were added
or run. Database concurrency, restart and provider behavior remain unexercised.

Missing-run recovery now requires the exact server-reserved agent ID and one
matching durable pre-submit event. A saved claim bounds three authenticated GETs
(agent metadata, at most two listed runs, exact run). Only one run with no next
page, matching identities/latestRunId and valid creation times can be bound.
Empty, multiple, paginated, malformed, unavailable or stale results remain
unresolved. Missing agents are not proof that submission never happened.
Recovery only saves the binding and exact-run observation; it sends no cancel
request. A nonterminal recovered run requires a separate explicit cancel attempt,
subject to the same shared three-attempt ceiling and backoff. Late submission
writers cannot overwrite a different recovered binding. No task is started or
accepted and the global reservation remains held. Concurrent external follow-ups
cannot be ruled out by this snapshot; all-history release remains separate.

## Reservation release source extension

The dispatch barrier now inspects all saved dispatch history, including locally
failed/completed rows. Every row must have a valid server-authored release tied
to its exact saved binding, durable claim and settled submission. New protocol
events or a later/conflicting submission record invalidate an older release.
Unknown providers/IDs, missing evidence and unresolved history keep it blocked.

An explicit real-owner release endpoint accepts only the saved dispatch ID and
action. Both route and service fail before DB/HTTP while the new release and
exclusive-agent-control source gates are false. These are dispatch readiness
blockers. Provider polling cannot prevent external queued follow-ups or future
starts by another actor; exclusive submission authority must be independently
established before enabling these gates. No live enablement is claimed.

When eventually authorised, release saves a 90-second claim and performs at most
three GETs outside locks: exact terminal run, complete single-run history (limit2,
reject additional runs/pagination), then matching IDLE agent/latestRunId.
Lifecycle IDLE alone never proves termination. Status/timestamps must agree.
Three explicit release attempts maximum, with backoff and mutual exclusion with
cancellation claims. Crashed/expired attempts cannot save a release. Additional
runs require reconciliation; this code does not guess their ownership.

Release removes only that dispatch's reservation barrier. It does not accept or
complete its task, release other unresolved dispatches, restore project toggles,
retry the same task or resume coding. Existing unique dispatch-per-task, current
approvals, repository reservations and all live guards still apply. No tables,
migrations, startup worker, timer or provider side effects added.

## Saved deadline source extension

Reservation now atomically saves a server-authored execution bound: approved plan
version, owner deadline, time limit, and the earlier of owner deadline or dispatch
start plus time limit. Pre-submit and accepted-response handling also enforce this
frozen deadline, so a later delay or task change cannot extend the dispatch bound.

Explicit real-owner POST /work-dispatches/:id/check-deadline accepts only the saved
dispatch ID and action check_saved_cursor_deadline. It reads DB time under the
config/control/task/dispatch locks. Before due it records nothing. At/after due,
or for missing/invalid legacy bounds, it saves one durable cancellation/recovery
requirement and deadline event. Repeated calls reuse saved evidence. Active task
status becomes needs_owner; already accepted/completed task status is retained.
Dispatch remains needs_owner and its reservation stays held. No credential,
provider request, automatic retry, task acceptance or resume is performed.

This action survives process restart through existing storage. It is not a
hosted scheduler, automatic queue pickup, provider-side hard stop or periodic
deadline guarantee. Those runtime capabilities and their live safety flags remain
unverified/false. No schema, migration, helper, timer or external scheduler added.

Still owed: durable hosted pickup/provider deadline enforcement; actual recoverable
code checkpoints and supported message ingress/follow-up. These source tasks
can continue before authorising live operations. The existing isolation,
recovery, included-use and owner acceptance gates remain separate.

Primary API reference checked 24 October 2026:
https://cursor.com/docs/cloud-agent/api/endpoints
GET returns a top-level run object. Terminal statuses documented as FINISHED,
ERROR, CANCELLED and EXPIRED. Cancel returns an ID; 409 requires observation.
The returned git snapshot is per agent, so it is not used as a run checkpoint.
