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
when the source gate is eventually enabled. No automatic retry, agent creation,
archive, delete, resume, task acceptance or global-slot release is implemented by
the cancellation service.

## Evidence and remaining work

API TypeScript noEmit and direct API bundle passed for this code batch. Source
self-review covered lock order, late start, stop/reenable, bounded claims,
identity checks, HTTP outside locks and response privacy. No tests were added
or run. Database concurrency, restart and provider behavior remain unexercised.

Still owed: safely reconcile submissions without run IDs; all-history terminal
release policy; durable hosted pickup/deadline enforcement; actual recoverable
code checkpoints and supported message ingress/follow-up. These source tasks
can continue before authorising live operations. The existing isolation,
recovery, included-use and owner acceptance gates remain separate.

Primary API reference checked 24 October 2026:
https://cursor.com/docs/cloud-agent/api/endpoints
GET returns a top-level run object. Terminal statuses documented as FINISHED,
ERROR, CANCELLED and EXPIRED. Cancel returns an ID; 409 requires observation.
The returned git snapshot is per agent, so it is not used as a run checkpoint.
