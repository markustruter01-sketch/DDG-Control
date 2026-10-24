# Company plan, dependencies and worker scope

Design decision, 24 October 2026. This is a source contract, not an accepted
company plan, applied schema, worker permission or completed A-02 criterion.

Source increment: lib/company-plan.ts implements the strict parser, canonical
digest and pure binding/transitive-prerequisite evaluator. Real-owner
POST /api/company/plan/preview consumes it with bounded reads of referenced
existing records only. It never saves a plan or grants approval/readiness;
blocking questions, dispatch readiness and consistent snapshot are explicitly
unchecked. No new-table access, schema or migration is needed for this preview.
Revision storage/acceptance/UI/dispatch integration below remain unfinished.

## Existing authority

Managed outcomes own the approved goal and acceptance gates. Managed tasks own
the task plan, result and owner acceptance evidence. Fleet questions own blocking
questions. Project controls own OFF/completed state; Finance remains held.
The company board is a read projection, never a second queue.

The current schema has no dependency relation or accepted company-plan revision.
Do not infer dependencies from task order, prose, map arrows or matching names.
Do not use approval of one task or outcome as approval of a company plan.

## Smallest durable addition

Use one immutable company-plan revision record in the existing database, with a
server allocated ID, recorded owner, schema version and database timestamp.
Its bounded manifest stores references, not copies of task bodies or outcomes:

- Up to four known managed project keys.
- Up to 100 exact outcome ID/version pairs, bound to their project.
- Up to 200 exact task ID/plan-version/outcome-ID/outcome-version/gate bindings.
- Up to 400 directed prerequisite edges between those exact task bindings.
- Revision purpose: proposed, accepted or withdrawn; acceptance references the
  exact proposed revision and canonical manifest digest. A withdrawal references
  the exact accepted revision. No rewriting an accepted manifest.

This extra record is justified by cross-project dependencies and exact collective
approval; existing per-task events cannot represent a plan containing no tasks
or prevent ambiguous collective acceptance. It is not a duplicate task store.
Do not overload dispatch configuration, handover notes or outcome gate text.
No new service, package, scheduler or model call is needed.

New-table reads and writes must remain behind a false source gate until isolated
schema rollout and recovery are approved. No new columns on existing tables:
their current SELECT-all paths must continue to work before rollout. A missing
table must produce unavailable/blocked, never an accepted empty plan. Do not
apply a migration against the currently unverified database target.

## Validation and acceptance

Reject unknown/duplicate fields, IDs, keys, references, task bindings, edges,
self-edges, cycles and caps exceeded. Every prerequisite must be in the manifest.
No silently dropped edges or automatically inferred goals. Require one explicit
outcome version for each included task, and a valid gate of that exact outcome.
An empty or partial proposal may be saved only as a clearly unaccepted proposal;
acceptance requires its declared scope and all required references to be valid.

Owner acceptance requires the real owner session. Use the existing singleton
dispatch-config lock, project controls in fixed WORK_KEYS order, outcomes and
tasks by ascending ID, then the company-plan serialization lock. Every new
plan mutation uses this order. Resolve the target revision first without granting
authority; re-read it under the lock and compare the expected revision/digest.
Use a database transaction for validation and the immutable acceptance receipt.
Do not call a provider while holding locks.

Recheck OFF/Finance hold/completed, outcome status/version, task status/version,
scope and gate bindings under these locks. Acceptance cannot turn controls ON,
approve a task/outcome, clear a question, start work, spend or release a provider
reservation. Replays of the same acceptance are idempotent; conflicting active
accepted revisions are rejected under the same serialization lock.

Every consumer recomputes validity from current authoritative records. A changed
binding or withdrawn/superseded plan blocks its dependent tasks; no automatic
grandfathering. Avoid a second stale persisted Ready flag. Task proposal/revision,
approval, dispatch reservation and final pre-HTTP submission must all use the
same dependency evaluator wherever the plan feature is enabled. Automatic
selection must exclude blocked dependencies rather than repeatedly pick them.

A prerequisite is satisfied only by the exact referenced task plan and outcome
binding, owner-accepted completed state and nonempty saved acceptance evidence.
Saved evidence remains an owner record, not independent provider verification.
Task failure/rejection, changed versions and unknown evidence never satisfy it.
Cross-project edges may be shown to the owner but must not disclose the other
project's body to a worker. OFF-new-work does not itself cancel a running agent.

## Worker export boundary

Current buildCursorAgentPayload already selects the one task's title, objective,
outcome, checklist, checks, stop condition, bounds and one configured repository
and branch. It does not export the company board or other task records. The
existing dispatcher checks project/repository/branch/config, versions and open
blocking questions at reservation and before submission. Keep those guards.

Add only the selected task's exact plan/outcome/gate/accepted-company-revision
identities and the server-computed prerequisite verdict. Do not export dependency
task bodies, company-wide goals, messages, ledger JSON, credentials or private
thinking. A worker has no owner cookie or owner-wide read route. Machine tick
authentication is scheduling authority only, not company-data read authority.

This payload boundary is not a repository filesystem sandbox. The provider may
read the authorised repository; branch naming and prompt instructions cannot
enforce file-level isolation. Account repository permissions and provider routing
remain separately unverified live gates. Credential pattern checks are an extra
filter, not proof that arbitrary prose is secret-free.

## Finite implementation and acceptance sequence

1. Implement strict manifest parser/DAG validator and one shared dependency
   evaluator; bounded reference reads only, no model inference.
2. Add the isolated source-gated revision schema/service and owner proposal,
   exact-review acceptance/withdrawal routes with immutable receipts.
3. Connect lazy owner board review and all task approval/dispatch selection/
   pre-submission guards; extend the one-task export only as described above.
4. Review source, compile and build. Do not run tests unless asked.
5. Separately obtain schema isolation/recovery/rollout authority and verify
   restart, stale approval, cross-project scope and dependency behavior with
   actual owner acceptance. Builds alone do not satisfy these criteria.

No new provider, database operation, migration, test, release or owner action is
authorised by this design. Existing live flags stay false. Music is unchanged.
