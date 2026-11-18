# DDG handover — start here if you are a new agent

Any Claude session, on any account, picks up DDG work from this file. Read it first. Update it last.

## 1. What to read (in this order)
1. This file.
2. The work list: `quant-terminal/docs/plans/fund-roadmap-build-guide-for-opus.md` (Part A = Finance, Part B = the rest of the company). It holds the rules. Follow them exactly.
3. Why: `DDG-Control/docs/plans/company-audit-2026-11-17.md` and `growth-plan-2026-11-17.md`.
4. The start-here file of the repo you are about to touch.

## 2. The four repos (GitHub user `markustruter01-sketch`)
`DDG-Control`, `cattle-dog-coffee`, `ddg-hypest`, `quant-terminal`. Touch no other repo on that account.

## 3. How to pick up where the last agent stopped
1. Read section 5 below, newest entry first.
2. In each repo you will touch, list the open pull requests and the branches starting `claude/`. An open pull request is unfinished work: read it before starting anything new.
3. In the work list, find the first order without "DONE".
4. Trust the code over the notes. If they disagree, say so in your entry.

## 4. How to hand over (do this every time)
- **After every merged pull request**, not only at the end: add one entry at the top of section 5. A session can run out of usage without warning, so never leave it for later.
- Mark the order "DONE, date, PR number" in the work list.
- Never leave uncommitted work. Push your branch and open a draft pull request even if it is half done, and say what is left in its description.
- Write VERIFIED, INFERRED or UNKNOWN. Never invent a number. No secrets in this file.

Entry shape:
```
### <date, Brisbane time> — <model>, <account 1 or 2>
- Order worked on:
- Done (with PR numbers):
- Half done (branch, what is left):
- Published live? (which app, checked how):
- Waiting on Markus:
- Next order to start:
```

## 5. Log (newest first)

### Thu 19 Nov 2026, 08:40 — Fable 5.2 plans, Opus 5.5 codes (Markus's rule from 19 Nov: Fable plans, Opus builds; tell him when to switch)
- Orders worked on: audit 19 Nov step 1 (enquiry email), orb on computers, thank-you panel.
- Done, merged and published live: #128 runbooks + handover; #132 audit + mobile plan; #133 Control → Ops → Connections shows an "Email" row (missing setting names, last sent, last failed; in memory only); #134 orb height set from its bottom edge, so the bigger computer orb no longer sinks into the water (phones unchanged).
- Published live? Yes, twice: Replit sync report `.local/claude_reports/sync-pr134.txt` (build passed; only "large file" warnings), publish status success, live page loads (WebFetch). Second publish only picked up new email secrets. Orb not checked on a real computer.
- Email: VERIFIED all three secrets are set (names only, from the sync report). Not working yet: Markus first had `%40` in EMAIL_FROM and OWNER_EMAIL (wrong; only inside the URL) and the URL was the bare app password. Both explained; still UNKNOWN if it works. Markus parked email: enquiries are saved and shown in Control → Clients and Needs you, and Heimdall is told. That never depended on email.
- This PR: the form's thank-you message no longer says "we have emailed you". New panel: tick, "Thank you. We have your enquiry.", "We'll be in touch with you shortly at <their email>.", "You don't need to do anything else." No time promise (Markus). Email only, no phone field (Markus).
- Preview: build ddg43 on `claude/preview-patched` (tests `t21.mjs` orb, `t22.mjs` thank-you).
- Waiting on Markus: merge this PR; heartbeat URLs; quant-terminal access; yes to open the God's Eye View and Greenlight repos.
- Next: Fable plans (1) phone front ends for God's Eye View and Greenlight (Markus: maybe landscape-only on phones), (2) a new "Designs" section on ddg.limited: up to 10 carousel windows, each a scrollable mini-browser showing a made-up company's site (water bottles with 3D, sports, law firm, tradie, two online stores, children's learning). Markus wants both before the site is promoted. Then the founding price (B0.1).

### Wed 18 Nov 2026, 22:00 — Fable 5.2 and Opus 5.5 (evening session, ddg.limited first screen)
- Orders worked on: ddg.limited first screen and hold-the-orb rounds with Markus; B1.11 runbooks.
- Done (with PR numbers), all merged by Markus and published live on ddg.limited: #119 hold polish; #120 settings; #121 hold anywhere, two-line hint, buzz, camera; #122 words back after the settle, no dark edges; #123 "best viewed on a computer screen"; #124 even phone spacing, camera 2x, logo left of the name; #125 same proportions on every phone, dent removed; #126 fix (@import order); #116 Finance paper rehearsal (from the morning session).
- Published live? Yes, each time: Replit sync report in `.local/claude_reports/sync-pr*.txt` (build passed), publish status success, live page loads. The 3D scene itself is not checked on a real phone.
- Half done: #127 water design 1 (glass) and a camera height slider (open); #128 runbooks B1.11 (open).
- Preview: claude.ai artifact "ddg.limited — preview" opens as an iPhone 15/16 screen; its files and patch tools are on branch `claude/preview-patched` (read its HANDOVER.md).
- Lesson: read every warning in the Replit sync report before publishing (#125 put a rule above `@import`; caught by the warning).
- Waiting on Markus: merge #127 and #128; check the live site on his S23 Ultra; same items as below (heartbeat URLs, kill switch, email secrets).
- Blocked: this session could not attach `quant-terminal` (access refused), so Part A (Finance) was not worked on.
- Next order to start: B1.9 GST meter (Control), then B1.12 bot keys.


### Wed 18 Nov 2026, 11:45 — Opus 5.5 (same session as 07:30; Fable 5.2 did the morning site work)
- Orders worked on: ddg.limited design rounds with Markus; B2.1 coffee gifts; Finance plan Phase 3a.
- Done (with PR numbers):
  - DDG-Control: #107 orb extras (bloom, glass, mirror, rainbow edge, sparks), black quote box with white outline, lightning that lights the land, Markus's 18 Nov settings; #108 scroll hint clear of the name, quote box fits on phones; #109 page line white again; #110 six real Greenlight screenshots with captions; #111 portfolio list shows short lines with Expand pop-ups (white-line flow, facts, Greenlight chart from its real run, one screenshot), orb size 1.24, quote in Space Grotesk 600. All merged.
  - quant-terminal: #126 plan Phase 3a (Gromen and Bianco public views in the AI layer, shadow only). Merged.
  - cattle-dog-coffee: #17 DRAFT, gift orders (B2.1). Built and green, switched off. See below.
- Half done: cattle-dog-coffee #17 waits for Markus's three card designs. Then: put them in `artifacts/store/public/gift-cards/` and `GIFT_CARD_DESIGNS` (`lib/pricing-core`), one paid sandbox order end to end, Markus publishes on the Replit website (6 order columns, ADD only), then sets the deployment secret `GIFTS_ENABLED=true`.
- Published live? ddg.limited with #107 to #111 (publish succeeded 01:3x UTC; checked in the browser: 5 Expand buttons, Greenlight pop-up with 6 bars, scroll hint clear of the name). DDG-Finance not republished (waits for #125).
- Waiting on Markus: merge quant-terminal #125 (publish crash fix) then #124 (quiet alarms); gift card artwork; 2 heartbeat URLs; arm the kill switch; ddg.limited email secrets (`EMAIL_SMTP_URL`, `EMAIL_FROM`, `OWNER_EMAIL`) are not set, so no enquiry emails send.
- Next order to start: Part B (B1.1 security headers on ddg.limited, then B1.2 type check). Publish Finance after #125 is merged, with the US market closed.


### Wed 18 Nov 2026, 07:30 — Opus 5.5 (17–18 Nov session)
- Orders worked on: Part A Phase 0 items 1–7; Markus's no-crypto rule; ddg.limited message audit and fixes.
- Done (with PR numbers):
  - quant-terminal: #116 broker time limits; #117 no-crypto order guard; #118 plan says no crypto; #119 BTC sold, `OWNER_KEPT` empty; #120 closing snapshot at 17:25 New York time. All merged and published.
  - BTC sold 17 Nov 07:41 UTC on Markus's yes (0.097758577 at 64,519.74; ledger row closed). No crypto on the Alpaca or OANDA accounts (VERIFIED, health check 17 Nov 20:44 UTC).
  - DDG-Control: #93 no-crypto wording; #94 no jump on flick-scroll; #95 offer and quote button on the first screen; #96 prices first, Coffee first, plain words; #97 search title, business details, privacy names Google Fonts; #98 button clears the browser bars; #99 logo size; #100 phone layout (orb higher, menu centred). All merged and published.
  - Audit write-up: DDG Project doc `claude/site-message-audit-2026-11-17.md`.
- Half done: quant-terminal #121 kill switch per bot (item 5, stays unarmed), #122 dead code (item 7, code part), #123 plan status. All tests green, waiting for merge.
- Published live? ddg.limited (checked at phone size in a browser, 18 Nov); DDG-Finance (publish succeeded 17 Nov ~10:07 UTC; health check read-only).
- Waiting on Markus: merge #121–#123; yes to close 11 stale alarms; yes to delete dead `bots_state` rows; arm the kill switch; 2 heartbeat URLs; where to keep backups; name and email on the site; visitor counting; lawyer on contract vs deposit; whether coffee gifts (B2.1, due 30 Nov) jump the queue.
- How Replit is updated: merging on GitHub does NOT update Replit. Sync the workspace (`git fetch` + normal merge), build, then publish. Finance: publish only with the US market closed.
- Next order to start: item 8 (heartbeat) when the URLs arrive; otherwise B2.1 if Markus says so.

### Tue 17 Nov 2026, 10:45 — Fable 5.2, planning session (no Opus work yet)
- Done: company audit, growth plan and the work list are written and merged. Charity wording, "Raised", and "four businesses" are live on ddg.limited (PR #87). Hypest is hidden from search engines (ddg-hypest PR #44, live).
- Half done: nothing. No open pull requests were left by this session.
- Published live? ddg.limited and Hypest: yes, checked on the live pages. Cattle Dog Coffee: NO. The live store is still the old build.
- Waiting on Markus: press Publish for Cattle Dog Coffee on the Replit website (database changed); answer whether order B2.1 (coffee gifts) goes before the Finance fixes; lawyer contract, insurance and GST answer before the first paid Build job; 2-step login on all accounts.
- Next order to start: ask Markus the B2.1 question, then Part A, Phase 0, item 1.
