# Checkpoint and communication acceptance audit

Checked 24 October 2026. Scope: current public v1 endpoint documentation and
DDG Control source, not account entitlement or a live provider operation.

## Primary evidence

[Cursor v1 endpoint documentation](https://cursor.com/docs/cloud-agent/api/endpoints)
documents these boundaries:

- Run git branches are agent-wide state, shared across runs. Artifacts are also
  agent-scoped; download provides a temporary URL for a produced artifact.
- A run stream supplies status/output/tool events and an expiring resume cursor.
  A stream heartbeat does not contain a code snapshot.
- A steer can enter the active turn or become a later run. Its acknowledgement
  has no run ID/request identity for matching the instruction to a run. Retrying
  an uncertain steer can duplicate the prompt. Availability is account-dependent.
- Ordinary follow-up creates a new run; cancellation ends the old run. v1
  webhooks are described as forthcoming. Inline MCP servers are documented.

No reviewed contract demonstrated automatic five-minute capture of changed and
uncommitted code, authenticated checkpoint delivery, or replacement restore.
This is a bounded evidence gap, not proof no Cursor capability could provide it.
The linked OpenAPI fetch failed; no schema-wide absence claim is made.

## Existing local behavior

fleet-desk.ts stores version-bound dashboard messages/questions/answers. It labels
provider delivery disconnected; an active-task message is queued only for possible
owner follow-up and is not sent. Answers do not grant approval or resume work.

work-management.ts saves append-only manual handover records. Its resume route
returns eligible local work for approval; any provider dispatch blocks automatic
restart. AIStack.tsx labels these manual records with no timed capture callback.
These behaviors adequately preserve the present dashboard boundary. No automatic
provider sender or checkpoint adapter was added merely to populate a status.

## Acceptance consequences and implementation gate

B-03 remains open: a supported sender still needs exact task/plan/outcome and
recipient binding, an explicit instruction authority, a durable send reservation,
disconnect/ambiguous-delivery handling, a stop/expiry boundary and verified
acknowledgement semantics. A queued steer must be treated as possible new work;
it cannot bypass global concurrency or silently extend an approved task.

B-04 remains open: before enabling timed capture, prove the worker produces actual
recoverable repository state at the required interval and transitions, identifies
its run, preserves changed/untracked work within the authorised scope, and can
restore it after interruption. A branch URL, assistant assertion, stream cursor,
manual note or temporary artifact link alone does not establish that result.
Inline MCP is a possible integration point requiring a concrete scoped design
and proof; its existence is not checkpoint acceptance or permission to launch it.

No completion criterion was removed or accepted. Continue finite management/source
acceptance work while retaining these explicit live gates. No tests, account,
database, credential, worker, provider, migration, merge or deployment operation
was performed. Finance held; Music/graphics unchanged; no new charges.
