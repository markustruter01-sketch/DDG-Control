# DDG Build — contracting service

> Copy of the claude.ai Project doc `claude/ddg-build-plan.md` (written 31 Oct 2026), with one update below.
>
> **Update (from code, 11 Nov 2026):** enquiries open from **8 Nov 2026**, not 1 Jan 2027 — `artifacts/api-server/src/routes/build.ts`: `SERVICES_OPEN_ON = process.env.DDG_BUILD_OPENS_ON ?? '2026-11-08'`. The site shows "Taking new builds" and "Websites from $1,500". Confirm with Markus before changing any date.

Markus, 31 Oct 2026: ddg.limited becomes a portfolio and a "hire us" site. DDG builds websites, online stores, platforms, phone apps and AI for other businesses, priced about 25% below Australian industry rates.

## Decisions (Markus, 31 Oct)
- Prices on the site: yes, ranges plus "from" prices, and an instant ballpark after the form.
- No trading or quant system builds for clients. DDG Finance appears as our own work only (no performance claims; it is paper trading).
- Enquiries go to Control (Needs you plus a message to Heimdall) and to Markus's email.

## Prices (AUD, no GST: DDG is not GST-registered; registration is required from $75k turnover)
Market ranges from 2026 Australian guides (What's The Damage, WP Creative Brisbane, Expeed, Flowtivity), DDG ≈ 25% below:
| Service | Market | DDG |
|---|---|---|
| Business website (5–10 pages) | $2,000–6,000 | $1,500–4,500 |
| Online store with Stripe | $10,000–30,000 | $7,500–22,500 |
| Web platform / SaaS first version | $15,000–60,000 | $11,250–45,000 |
| Phone app first version | $15,000–40,000 | $11,250–30,000 |
| AI assistant (one job) / automation (multi-step) | $5,000–10,000 / $15,000–35,000 | $3,750–7,500 / $11,250–26,250 |
| Extra integration | $1,000–3,000 | $750–2,250 |
| Care plan website / app (monthly) | $50–300 / $300–2,500 | $40–225 / $225–1,875 |
| Hourly | $150–250 (agencies) | $110–185 |
One source in code: `artifacts/ddg-control/site/content.ts` (SERVICES, CARE).

## Client process
1. Tell us: short form with an instant ballpark. 2. Free call. 3. Fixed quote, paid in stages. 4. Build with weekly demos, launch, care plan.

## Built (PR #50, 31 Oct, and later website PRs)
- Website: portfolio, "Behind the scenes: DDG Control", DDG Build section, enquiry form (/start).
- Server: table `enquiries` (additive). `POST /api/public/enquiry` refused before the opening date unless the owner is logged in (saved as Test). Each enquiry: Needs you item, message to Heimdall (visitor words marked as information only), email to Markus once `EMAIL_SMTP_URL`, `EMAIL_FROM`, `OWNER_EMAIL` are set. Honeypot, 3 per address per hour, 40 per day.
- Control: Clients page (stages New, Call, Quote sent, Won, Lost; notes).

## Still to do
- Claude: client quote page (scope, price, DRAFT terms, Accept, Stripe deposit). Markus sets up Stripe for DDG.
- Lawyer: a simple fixed-price contract (stage payments, code ownership, support). Check professional indemnity insurance. Set a monthly limit on new projects.
- Email secrets set? UNVERIFIED.
