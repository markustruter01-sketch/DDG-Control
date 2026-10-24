# Company KPI monitor — source review, 24 October 2026

Scope: bounded source inspection, not a runtime/security certification or owner
acceptance. No tests, database queries, provider operations or visual checks ran.

| Area | Source finding |
| --- | --- |
| Mounted surface | Existing health/auth, real-owner session check, GET/HEAD guard, one monitor route. No control/machine/provider route mounted; no startup seeding. |
| Data access | Bounded SELECTs over existing finance, metrics, social and project metadata. No new schema, write, queue, scheduler, model call or external API. |
| Amounts | BigInt cents converted only within safe integer bounds; unsafe/negative saved aggregates are unavailable. Empty records are unknown rather than zero. |
| Attribution | Business labels include stable IDs; unassigned company records are separate. Duplicate saved business names cannot collapse into one bar. |
| Accounting scope | Ledger income, recorded balances and recurring commitments remain partial; no inferred consolidated profit, FX conversion or complete expense claim. AUD is the existing convention only. |
| Customers/social | Latest saved readings per business/account, recorded dates, explicit non-deduplicated customer/account-follower scope. No unique-company-customer/audience or live-total claim. |
| Missing/stale data | Per-card missing/unavailable/partial states; recorded date ranges where present, read time distinguished from capture dates. A read failure preserves previous readings with an explicit message. |
| UI boundary | No avatars/village/task/control surface in the mounted graph. React escapes record labels; bar widths derive only from validated numeric values. No sample chart data. |
| Requests | Owner-only reads, no-store, 20-second browser timeout, manual refresh, no automatic polling/retry/focus/reconnect refresh. Login/logout remain existing auth operations. |
| Preservation | PR30/history/original dirty checkout preserved. PR31 is independent of its unmerged worker/plan schemas. No data migration or financial/trading change. |

## Remaining before acceptance

- Human source review and explicit merge permission for PR31.
- Actual preview identity, owner login and source-availability journey.
- Visual fit without scrolling at the owner's viewport, readable chart labels,
  dates/coverage, keyboard focus, day/night, smaller screens and zoom. Current
  responsive rules include very small text at compact sizes; readability is not
  proven by compilation and must be resolved in preview before acceptance.
- Owner acceptance of saved-source coverage; profit remains unavailable until
  the authoritative complete net-profit source is provided or separately scoped.

No merge, deployment, schema operation or provider connection is authorised by
this review. Compile/build evidence belongs to the exact published tree.
