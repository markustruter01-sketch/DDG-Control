---
name: Goal date JSON shape
description: Runtime representation of the goals API's date-only target_date values.
---

All goals API responses return `target_date` as a date-only `YYYY-MM-DD` string or `null`. Keep this calendar date as a string throughout the API and frontend.

**Why:** The goals list previously sent the parsed Zod response, which converted the OpenAPI `format: date` field to a JavaScript `Date` and serialized it with a time part. Create and update responses already sent the original date-only string.

**How to apply:** Use `target_date` directly for date inputs, display, and comparisons. Do not parse it into a JavaScript Date or strip a timestamp prefix.
