---
name: Structured Ollie risks
description: Compatibility boundary between stored structured risks and the existing latest-updates API and dashboard.
---

Keep the latest-updates API contract and dashboard aligned when exposing `{ text, severity }` risks. Normalize legacy string-array entries at the API response boundary as `{ text, severity: null }`; do not rewrite stored rows.

**Why:** Existing database rows may still contain string risks while newer rows store structured objects. Response-boundary normalization provides one stable API shape without changing stored history.

**How to apply:** Update the generated API schema and frontend together when the risk shape changes; pass structured objects through unchanged, convert only legacy strings, and show severity only when non-null.
