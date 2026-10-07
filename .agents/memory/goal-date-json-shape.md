---
name: Goal date JSON shape
description: Runtime representation of the goals API's date-only target_date values.
---

The goals list can serialize a PostgreSQL `DATE` target_date as an ISO timestamp such as `YYYY-MM-DDT00:00:00.000Z`, while create/update responses may return `YYYY-MM-DD`. The frontend date input and existing date-only formatter need the leading `YYYY-MM-DD`.

**Why:** Preview testing exposed different wire representations for the same date-only field across list and mutation responses.

**How to apply:** Normalize target_date with its first 10 characters for date-input/display comparisons. Do not parse it into a JavaScript Date or change the API/schema unless the task explicitly includes that scope.
