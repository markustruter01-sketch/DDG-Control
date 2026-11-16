# DDG — company map and plans (start here)

Last updated: Tue 17 Nov 2026 Brisbane (UTC+10) by Claude. For any Claude (any account) picking up DDG work. No secret values in these files; secrets are named only.

## The company
- **Digital Dynamics Group Pty Ltd (DDG)**, Brisbane. Solo founder Markus (ex-RAAF). Aim: financial freedom through altruistic value creation. Not GST-registered.
- **How it runs:** Claude writes the code (GitHub), Grok bots are the staff (Heimdall GM/COO, Freya marketing, Tyr coffee sales, Plutus finance; others paused), Replit hosts everything. Markus directs and decides; he does not code.
- **Launch date: 1 Jan 2027** — everything public and ready (Coffee is already live).

## Where each platform's plan lives
| Business / platform | Repo | Start-here file | State (11 Nov 2026) |
|---|---|---|---|
| DDG Control (private command centre) + public website ddg.limited | DDG-Control (this repo) | this folder | Live. Control done; new home page live 17 Nov. DDG Build enquiry form is open on the live site since 8 Nov (earlier notes said 1 Jan 2027; Markus to decide, see the audit) |
| DDG Finance (trading platform, paper) | quant-terminal | `docs/plans/README.md`, `docs/plans/finance-2027-plan.md` | Live on paper accounts. 5-day gate stopped 17 Nov; fund roadmap agreed 17 Nov (`docs/plans/fund-roadmap-2026-11-17.md`); Phase 0 fixes not started |
| DDG Coffee (Cattle Dog Coffee) | cattle-dog-coffee | `docs/plans/README.md` | Live and trading |
| DDG Fitness (Hypest app) | ddg-hypest | `docs/HYPEST-BUILD-PLAN.md` (single plan, steps ticked as done) + `docs/TIERS-AND-BODY-SPEC.md`, `docs/COACH-AGENT-SPEC.md` | In development: Phase 3 work merged (PR #39); see the plan's ticks for what is done; not launched |
| DDG Creative (vlogs, shorts, novel) | — | — | Content work; website page /creative |

## End state (what "done" means for 1 Jan 2027)
- **Website (ddg.limited):** one hub for all four businesses, live numbers (followers, charity), DDG Build enquiries open 1 Jan 2027, and (NEW, Markus 11 Nov) a public DDG Finance section: live performance vs the S&P 500, what each bot holds, the strategy paper including failed tests, how the platform works. Shows all financials; never keys, account numbers, order ids or internal alarms. Built here; data comes only from Finance's existing hourly push to `/api/inbound/fleet`, so the public site adds no way into the trading system.
- **DDG Control:** private 40,000-ft view: money equation, socials, each business's key numbers, bots, to-dos. Data flows in automatically (Finance push hourly, Coffee read live, Hypest once published, bots twice a day).
- **Finance:** 4 bots running registered strategies with an honest record for all of 2027 (see the Finance plan).
- **Coffee:** live; remaining: refund handling, branded order email, loyalty on renewals.
- **Fitness (Hypest):** MVP launch after payments test, lawyer and physiologist reviews, AI key decision.
- **DDG Build (client work):** quote page + Stripe deposit, lawyer contract, insurance, monthly limit on new projects (see `ddg-build-plan.md`).

## Files in this folder
- `company-audit-2026-11-17.md` — **read this first for what to fix**: whole-company audit (sites, security, legal pages, money, operations), top actions in order, each finding marked checked / from notes / not checked.
- `ddg-build-plan.md` — the contracting service (prices, process, what is built, what is left).
- `company-handover-2026-10-30.md` — company overview, how it runs, completion snapshot (as of 30 Oct; Finance and Coffee sections are older than their own repos' files).
- `website-and-control.md` — where the website and Control live, endpoints.

## DDG Control quick facts
- Replit app DDG-Control, replId 0355effe-3533-4c3b-be29-95ce418e1c72. Public site https://ddg.limited. Control lives at a secret path set once in `vite.config.ts` (CONTROL_DIR), with email + password + authenticator login.
- Website words: `artifacts/ddg-control/site/content.ts`. Public links: `src/lib/public-info.ts`. Public endpoint: `/api/public/summary` (cached 5 min).
- Inbound: Finance `POST /api/inbound/fleet` (FLEET_INBOUND_KEY); Coffee read via `/api/ddg/summary` (DDG_STATS_KEY); Hypest via HYPEST_SUMMARY_URL / HYPEST_STATS_KEY. Bot keys: secrets FREYA, TYR, HEIMDALL, PLUTUS; DDG_BOT_KEY = Claude's key.

## How to work with Markus (all repos)
- Short, simple words. Numbered [ME]/[REPLIT] steps right above the copy block they belong to. 🔴 for risky, costly or irreversible.
- Never invent facts, numbers, times or behaviour; say what is unknown and where each number came from.
- Always check for a better option B. Check date/time (Brisbane, UTC+10) before anything market-related.
- Claude builds, opens PRs, syncs Replit and publishes where allowed; Markus does only what Claude cannot (logins, secrets, payments, some merges).
- Replit sync: fetch + normal merge of GitHub main (never fast-forward-only). One Replit task at a time. Have tasks write reports to `.local/claude_reports/NAME.txt`.
- Secrets only in Replit Secrets; never in files, chat or GitHub.
