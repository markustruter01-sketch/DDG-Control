# Clean infrastructure and secure controls

Owner direction, 24 October 2026: keep this complex dashboard's infrastructure
clean, minimal and secure. These rules guide the remaining agreed development.

- Reuse the existing API, database, authentication and shared control services.
  Add a process, provider, dependency or table only for a concrete requirement
  that cannot safely use the existing components. Explain that requirement.
- Keep route authentication at the boundary and business checks in shared
  services. Other routes/agents import shared controls from the library, not
  another Express route module. Do not duplicate execution implementations.
- Development login bypass permits preview access, not owner write authority.
  Project, goal and task writes now use the same real-owner middleware as managed
  approvals. Existing OFF/Finance restrictions and input validation still apply.
- Machine identity is separate from owner sessions and provider credentials.
  Accept narrow fixed operations; never browser-supplied execution permissions,
  provider identities or terminal/checkpoint claims as verification.
- Keep secrets on the server and out of client bundles, logs, prompts, receipts
  and responses. Retain fixed provider origins, scoped credentials and bounded
  operations. New permission/configuration is not runtime acceptance.
- Keep ownership, replay handling and recovery in durable records. Never hold
  database locks over external HTTP; ambiguous starts retain their reservation.
  A web-process timer is not an accepted durable hosted scheduler.
- Preserve explicit source/runtime/owner/live evidence levels. Builds do not
  authorise a migration, provider action, merge, deployment or live enablement.

## Current source finding and correction

Five legacy writes (project update, goal create/update, task create/update) relied
only on the shared requireAuth middleware, which permits the development bypass.
They now additionally require requireRealOwnerSession, which denies bypass and
requires the real configured owner session. Production middleware already ignores
the development bypass; the change also closes preview write authority.

The same five writes also recheck OFF/hold/completed under the existing project
control lock and perform the mutation in that transaction. A concurrent OFF or
completion serializes with the write. Earlier read checks remain useful feedback
but no longer act as the final write authority. Unmanaged projects retain their
existing behavior. Runtime concurrency acceptance remains unverified.

The inbound task-status write also requires the real owner in addition to its
existing inbound key, and inbound task-status/note writes use the same atomic
project guard. A shared inbound key is not owner identity. Append-only inbound
notes retain their existing key/session contract and grant no execution approval.
Inbound decision approval already used owner authentication and project locking;
that adequate behavior was retained. Finance bookkeeping endpoints were unchanged.

All known existing shared-control consumers now import managed-work-controls.ts
directly. The existing work-management route re-exports remain for compatibility.
No infrastructure, dependency, credential, permission setting or schema was added
for this correction. Source review/compilation are separate from runtime proof.

The completion-outcome-version candidate was reviewed: current application writes
to managed outcomes approve or complete them; no sanctioned approved-outcome
revision/replacement mutation was found in the reviewed API source. The rejected
task-plan revision action preserves outcome identity and refuses execution history.
No speculative completion-version field or alternate outcome edit path was added.
