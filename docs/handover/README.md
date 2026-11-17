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

### Tue 17 Nov 2026, 10:45 — Fable 5.2, planning session (no Opus work yet)
- Done: company audit, growth plan and the work list are written and merged. Charity wording, "Raised", and "four businesses" are live on ddg.limited (PR #87). Hypest is hidden from search engines (ddg-hypest PR #44, live).
- Half done: nothing. No open pull requests were left by this session.
- Published live? ddg.limited and Hypest: yes, checked on the live pages. Cattle Dog Coffee: NO. The live store is still the old build.
- Waiting on Markus: press Publish for Cattle Dog Coffee on the Replit website (database changed); answer whether order B2.1 (coffee gifts) goes before the Finance fixes; lawyer contract, insurance and GST answer before the first paid Build job; 2-step login on all accounts.
- Next order to start: ask Markus the B2.1 question, then Part A, Phase 0, item 1.
