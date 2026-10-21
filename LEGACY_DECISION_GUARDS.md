# Legacy decision safety batch

Base: main a1da391a0f3921ee6499a51e7fee797ec35d1d5f. Source proposal only; compilation and runtime acceptance outstanding.

## Sanity check

Legacy dashboard Approve/Decline omitted real-owner middleware; inbound decisions immediately decide records with only a shared key. Reuse existing real-owner middleware for both, retaining inbound key authorization. This intentionally denies unattended legacy decision resolution; no new identity service or provider call is introduced.

Legacy decision ON checks were outside the shared project lock. Reuse project-first control locking inside the decision transaction, then reread and lock the decision. Inbound create-and-decide takes that lock before insertion to avoid a pending orphan on OFF refusal. Task creation and decision update remain atomic; existing result contracts are retained. Finance hard hold remains, Music's unmanaged state is not changed.

Company Map incorrectly said inbox and official logo assets were absent. Correct source status while retaining migration, runtime, brand and release acceptance gaps.

## Required evidence

- Compile affected API/dashboard against the combined main build. No tests unless owner requests.
- Verify DEV and key-only denial without database writes; real-session decisions require approved isolated data context.
- Verify OFF/completion concurrency, duplicate decisions, transaction rollback and unchanged caller contracts in approved isolated development.
- Read receipts remain unapplied until separate database/recovery prerequisites pass.
- Payload version binding, other inbound paths, mutable project metadata and full Milestone A authorization remain unresolved. Do not label this full end-to-end authorization coverage.

No migration, new charges, provider calls, worker activation or production publication is part of this batch. Main remains Replit's stable branch; this review branch is not an owner switch request.
