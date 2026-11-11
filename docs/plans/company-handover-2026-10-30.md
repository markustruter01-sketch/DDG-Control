# DDG company overview — as of Fri 30 Oct 2026

> From the claude.ai Project doc `claude/handover-2026-10-30.md`. Finance and Coffee details here are OLDER than those repos' own `docs/plans/README.md`; trust those for current state. UNVERIFIED = not checked. ESTIMATE = Claude's judgement.

## The company — intent and how it connects
- **Digital Dynamics Group Pty Ltd (DDG)**, Brisbane. Solo founder Markus (ex-RAAF). Aim: financial freedom through altruistic value creation — businesses that make money and give back.
- **How it runs:** Claude writes all the code (GitHub), nine Grok bots are the staff (Heimdall GM/COO, Freya marketing/socials, Tyr coffee sales, Plutus finance/analytics active; Hermes, Harald, Mímir, Njord, Daedalus paused), Replit hosts everything. Markus directs and decides; he doesn't code.
- **Four businesses:**
  - **DDG Coffee** — Cattle Dog Coffee (cattledogcoffee.com.au), live since late Sep 2026. $1 from every bag goes to RSPCA Queensland.
  - **DDG Finance** — in-house algorithmic trading platform (paper accounts: 3 Alpaca + 1 OANDA). Goal: an honest, pre-registered public track record. Not open to outside money; not financial advice.
  - **DDG Fitness** — Hypest: phone-first AI fitness coaching app. Not live yet.
  - **DDG Creative** — vlogs (building DDG in public), daily shorts 9:30pm Brisbane, gaming clips, DDG Music (not started), and the novel *Threads of Empire* (release late Jan 2027).
- **How it connects:** the public website (ddg.limited) is the hub for all four. DDG Control (secret path, 2FA) is Markus's private view of the whole company: money equation (expenses − gross revenue = debt → charity → net profit), social footprint, each business's key numbers, the bots, his to-do list. Data flows in automatically: Finance pushes hourly, Coffee is read live, Hypest once published, the Grok bots push socials/costs/to-dos twice a day — every bot push audited and undoable. Charity given is shown publicly.
- **Launch date: 1 Jan 2027.** Marketing mode Nov 2026 – Mar 2027.

## Completion snapshot (ESTIMATE, 30 Oct)
| Project | ~Done | What's left (as of 30 Oct) |
|---|---|---|
| DDG Control | 95% | External feeds: Hypest (when it publishes), Freya's first full social push, TikTok/Facebook links |
| DDG website | 85% | Markus's copy review, TikTok/Facebook links, company email |
| DDG Coffee | 90% (live) | Refund handling, today/month totals |
| DDG Finance | ~60% UNVERIFIED | Since then: see quant-terminal `docs/plans/` |
| DDG Fitness (Hypest) | ~40% UNVERIFIED | Home design, exercise guides, reviews (lawyer, physiologist), payments check, publish |
| DDG Creative | ~50% | Vlogs/shorts running; novel late Jan 2027; DDG Music not started |

## How we work (Markus's rules)
- Claude does merges, Replit syncs, publishes and checks itself where allowed; Markus only gets steps that truly need him (logins, secrets, payments, clicks Claude can't reach). His steps must be exact: where to click, what to paste.
- Short, simple replies. Numbered [ME]/[REPLIT] steps placed right above the copy block. 🔴 for anything risky/irreversible.
- Never invent facts. Say what's unknown. Always look for a better option B.
- Finance publishes only while the US market is closed, with read-only checks before and after.
- Never put live Stripe keys in Replit before a launch checklist. Secrets only in Replit Secrets; never print them. Never connect to the old Hypest backend. Tests never touch production DBs.

## Repos and apps
- GitHub owner: markustruter01-sketch. Repos: DDG-Control (website + Control), cattle-dog-coffee, ddg-hypest, quant-terminal (Finance), ddg-website (empty, unused).
- Replit apps (replId): DDG-Control 0355effe-3533-4c3b-be29-95ce418e1c72; DDG - Finance 479b9041-b193-4ed4-a556-02be48b883b3 (git remote "gh"); Cattle Dog Coffee 43c6d7a1-0917-46b0-809f-9153f2162830 (git remote "origin"); Hypest 2ec14be6-1a32-491f-a656-4a16a460621b.
- Replit sync: always fetch + NORMAL merge of main (never fast-forward-only — every publish adds a "Published your App" commit). Don't send the Replit agent a new message while it's busy. The Replit agent refuses to use secret values.
- Publishing: Claude can publish when there's no schema change. With a schema change Markus publishes after checking "Generated migrations" shows only CREATE/ADD (never tick overwrite data).

## Brand: Night Glass v5
- Full landscape photo only on home pages; other pages use "dusk" (the same photo blurred, fading into graphite #141518); shared style `src/dusk.css`.
- Mostly white text and lines; colour only for important things. Tokens in `src/tokens.css`. Accents: Mint finance, Amber coffee, Volt fitness, Violet creative, Ice DDG; problems shown in amber (Markus dislikes red). Fonts Geist / Geist Mono.
