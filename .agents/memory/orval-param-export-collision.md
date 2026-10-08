---
name: Orval parameter export collision
description: Workaround for generated API-Zod exports when an operation has both path and query parameters.
---

When Orval generates the same `<Operation>Params` name for a path-parameter Zod schema and a query-parameter TypeScript type, the shared barrel can fail with TS2308. Keep the wildcard exports, explicitly re-export the query type under its original name, and alias the path schema.

**Why:** OpenAPI-only parameter references did not change Orval's naming, while the explicit barrel exports resolved the collision without changing generated files.

**How to apply:** After codegen, confirm the conflicting symbols in `generated/api.ts` and `generated/types`; add only the explicit re-exports needed in the API-Zod barrel.
