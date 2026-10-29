# DDG website + DDG Control

The public DDG company website (at `/`) and DDG Control, the owner-only company dashboard (at a secret path, behind email + password + Google Authenticator).

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/ddg-control/index.html` + `site/` — public website (content in `site/content.ts`).
- `artifacts/ddg-control/<secret folder>/index.html` + `src/` — DDG Control. The folder name is set once in `vite.config.ts` (`CONTROL_DIR`) and must match the rewrite in `.replit-artifact/artifact.toml`.
- `src/lib/public-info.ts` — public facts shared by both; never put internal info there (the website bundles it).
- `src/tokens.css` — Night Glass brand tokens shared by both.
- `artifacts/api-server/src/routes/` — API. `public.ts` is the only unauthenticated data route (followers + charity). `bots.ts` = Grok bot pushes/messages (per-bot keys from secrets FREYA, TYR, HEIMDALL, PLUTUS; DDG_BOT_KEY = Claude).
- `lib/db/src/schema/` — DB schema. `lib/api-spec/openapi.yaml` — API contract.

## Architecture decisions

- One app, one domain: website and Control are two entry pages of one Vite build, so Control's code is never in the website bundle.
- Every Grok bot push and message is logged in `bot_pushes` / `bot_messages`; the owner can undo pushes from Control → Ops.
- Code changes come from GitHub (Claude). Don't edit code in Replit; pull from GitHub instead.

## Product

_Describe the high-level user-facing capabilities of this app once they exist._

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
