# Fleet question transaction proposal

## Sanity check
Needed: existing creation/answer writes were separate from their events and from approval's project lock. A failed later write could leave partial history, and duplicate creation returned a prior question without a matching scope check.

## Bounded change
- Reuse/export the existing project-first control lock and transaction type.
- Resolve question task/outcome versions through the same transaction.
- Creation requires real owner; Finance-held/completed projects reject writes. Owner can save questions while merely OFF; this never authorizes work.
- Creation and its history event commit together. Duplicate request IDs return only a conflict, not a prior record. The unique database constraint remains the final duplicate guard.
- Answer routing uses an initial project hint, then project lock and question row lock with scope/version/status rechecks. Answer, question status and history commit together. Stale marking/event are atomic. Existing answers are preserved.
- All responses are sent after transaction completion. No schema changes, model/provider calls, new permissions or queue starts.

## Limits and release
Source inspected only; no tests, compilation, independent peer review, database migration/write, backend restart, merge or deployment performed. Real-owner and Finance denial behavior needs an approved isolated runtime. DEV UI can still show an unavailable question action; server denies its write and no preview credential is a real owner.
This only coordinates these question writes with current project-locked operations. Messages, external provider submission/callback races, global stop/cancellation and future plan writers require separate review. A newly saved blocking question does not cancel an already reserved provider request. Keep both hard-false dispatch guards unchanged.
Rejected-plan revision is not implemented by this proposal. Old approval/question versions must never approve a later plan.
