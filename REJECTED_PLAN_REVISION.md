# Rejected-plan revision source proposal

## Sanity check
A rejected task occupies the unique outcome/gate slot and cannot return through checkpoint recovery. This source proposal reuses the stable task ID and existing plan_version; no schema/index changes or duplicate gate tasks.

## Scope and guards
Real-owner POST revise-plan requires exact task plan/outcome ID/version, a reason and a complete bounded plan. Unknown fields and credential-like text are rejected. The project-first/task locks are reused. Finance-held/completed projects, non-rejected states, any dispatch/attempt/start/result/branch/review evidence, invalid bindings and unresolved open blocking questions are rejected. OFF alone permits an owner draft revision, not work.

The same row becomes pending_approval with plan_version incremented. Attempts, IDs, gate, repository and target branch are unchanged. Before/after plan snapshots and reason commit in one event transaction. Old credentials cannot be copied blindly to event history. Approval remains through the version-bound readiness/owner endpoint; both worker hard-false guards remain unchanged. No worker starts.

## UI
Collapsed per-task review form and loaded revision history use existing styling. No automatic source retargeting: draft captures the selected plan/outcome/context and locks saving when those change. Inputs freeze while saving. Explicit reason/confirmation, zero spend, local-device deadline label. Failures preserve drafts; ambiguous success instructs refresh, expected-version guards block duplicate revisions. History is loaded records only, not independent acceptance or a full signed audit.

## Evidence and limits
Source inspected only. No tests added/run, compilation, independent peer review, runtime authorization/transaction checks, database migration/write, backend restart, provider call, merge or deployment. No existing project has been revised. Provider-linked recovery is deliberately unsupported. Receipt migration remains conditionally approved development-only, with isolation/no-cost recovery unverified.

Before release review compiler output and isolated owner workflow for stale/double submissions, held/DEV/unknown control state, old questions, binding tampering, history retention, rollback and fresh approval. Compilation is not runtime or owner acceptance.
