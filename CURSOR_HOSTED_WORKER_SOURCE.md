# Bounded hosted pickup source — 24 October 2026

Source only. CURSOR_HOSTED_WORKER_VERIFIED is false. No scheduler, credential,
database table/migration, provider call, deployment or charge was configured or
performed. Automatic pickup and all existing dispatch safety flags remain false.
The route/service fail before DB access or credential reads while disabled.

## Entry and authentication

POST /api/internal/cursor-worker/tick is mounted before owner-session middleware
and performs its own dedicated machine authentication. Owner cookies, dev bypass,
provider keys and shared employee identities do not authenticate it.

Request body contains exactly action="tick" and invocation_id (lowercase UUIDv4).
No task ID, provider ID, prompt, approval, model, deadline or status is accepted.
Query strings are refused. Required headers are x-ddg-worker-timestamp (13-digit
Unix milliseconds) and x-ddg-worker-signature (64 lowercase hex characters).
The signature is HMAC SHA256 using a separate DDG_CURSOR_WORKER_SECRET of at
least 32 characters. Canonical signed UTF-8 text, with literal newline separators:

    POST
    /internal/cursor-worker/tick
    <timestamp>
    <invocation_id>
    tick

Both the server and DB clocks must accept the 60-second freshness window.
Constant-time signature comparison is used. The existing request serializer
records method/path/status, not headers/body; this route never logs credentials,
signatures or raw error/provider text. No real credential was read or generated.

## Durable invocation and dispatch

The source schema adds cursor_worker_invocations. A separate global receipt is
necessary because managed task events require a task: idle/blocked invocations
must also be remembered so replay cannot later pick newly approved work.
No SQL migration was created or applied, and no schema push was run. Before
enabling, an isolated recoverable target and reviewed schema rollout are required.

Each authenticated fresh invocation serializes on the singleton config row.
It saves either a finished idle/blocked/busy receipt or one task-bound 90-second
claim with random token, plan/outcome/config versions. One unexpired claim is
allowed globally by the shared config lock. Invocation IDs are unique; replay
returns saved state and never reruns the invocation, including after a crash.
No receipt retention cleanup is installed; safe retention needs a separate policy.

Selection considers only approved tasks in the configured project/repository/
branch, approved matching-project outcomes, ON/not-complete projects, zero spend,
remaining attempts, future deadline, no previous dispatch and no open blocking
question for the plan version. Finance is excluded. Selection picks one task,
not an unbounded loop. SQL repository normalization matches the shared service.

The shared dispatcher rechecks everything and validates the saved claim under
the config lock before reservation and again before HTTP. A stale/expired claim
cannot submit. Once a reservation exists it remains the global barrier even if
the worker crashes or its invocation lease expires. No DB lock is held during
HTTP. Finished invocation records contain only result code/status and task/
dispatch references, not provider prose or secrets. They do not prove the coding
run finished. Provider start, task acceptance and invocation completion differ.

Real-owner GET /api/work-worker-invocations/:id exposes a redacted saved receipt
without claim token or credential. It is not a provider poll or retry operation.
It also fails before DB access while the hosted-worker gate is false, so an
unapplied schema cannot be queried through this endpoint.

## Remaining acceptance

No hosted scheduler or worker has been installed or invoked. Durable storage
behavior, HMAC negative cases, concurrent/replayed/expired claims, restart,
included/no-overage operation and an isolated pilot remain unverified. No tests
were added or run. Source TypeScript/build checks do not pass those criteria.

Periodic deadline/recovery orchestration, provider hard stops, actual code
checkpoints and supported provider communications remain separate work. A timer
inside the web process is not substituted for an accepted durable scheduler.
The new source gate is not enabled by an environment variable or owner UI toggle.
