---
name: Structured Ollie risks
description: Compatibility boundary between stored structured risks and the existing latest-updates API and dashboard.
---

Keep the latest-updates API contract and dashboard aligned when changing project risks from strings to `{ text, severity }` objects. Preserve support for legacy string-array rows during that transition.

**Why:** Ollie's v2 report stores structured risks, but the current latest-updates API validator and dashboard still expect strings. The current task explicitly excluded those surfaces, so their contract was left unchanged.

**How to apply:** When structured risks need to be exposed, update the API response schema and frontend rendering together; handle both old string rows and new structured rows.
