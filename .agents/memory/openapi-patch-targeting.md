---
name: OpenAPI patch targeting
description: Avoid placing new properties in the wrong schema when editing OpenAPI components with repeated field names.
---

When modifying an OpenAPI component that repeats common keys such as `created_at`, use the component name as patch context rather than matching only the common property. After code generation, inspect the generated type corresponding to the target schema.

**Why:** broad context around repeated fields can match a different schema and silently attach a property to the wrong component.

**How to apply:** anchor edits to the named `components/schemas` block, run code generation, and verify the target client and validation types before proceeding.
