# DDG company audit — 17 Nov 2026

Written by Claude (Fable 5.2) for Markus, Tue 17 Nov 2026 (Brisbane).

**What was looked at:** DDG Control and ddg.limited, Cattle Dog Coffee, DDG Finance (quant-terminal), DDG Fitness (Hypest), DDG Creative (the novel), and DDG Build because it is on the website. Nothing outside DDG was looked at.

**This is not legal, tax or financial advice.** I am not a lawyer or an accountant. Where a rule is mentioned, the official page is linked and the item says who to ask.

**Five hats used:** security engineer, operations manager, compliance reviewer, bookkeeper, brand owner.

**Marks used on every finding**
- ✅ = I checked it myself today (code, live site or test run).
- 📝 = it is written in the repo notes; I did not re-test it.
- ❓ = I could not check it from here. You need to confirm.

---

## Update, 17 Nov, later the same day (after Markus's answers)

- ✅ **Live on ddg.limited:** no charity is named ("animal charities"), "Raised" replaces "Given", the page says the money is paid over in $100 lots, and the description says four businesses. (Control PR #87, published and checked on the live page.)
- ✅ **Live:** Hypest tells search engines not to list it. (Hypest PR #44, checked on the live page.)
- 🔴 **Merged but not live:** the same charity wording on the coffee store (coffee PR #15). At about 10:15 the live store still ran the old build with the old wording and flat postage. The database changed, so only Markus can publish it, on the Replit website.
- **Markus's answers:** Coffee Alliance roasts in Brisbane and says its beans are sustainably harvested, so both claims stay; get that in writing and file it. The charity asked to be paid in $100 lots, so the $61 is not overdue. The DDG Build form stays open.
- ✅ The coffee store does not load the Replit script (closes the question in 3.3).
- Everything else in the table below is still open. The build order is in `quant-terminal/docs/plans/fund-roadmap-build-guide-for-opus.md`, Part B. The money plan is `growth-plan-2026-11-17.md`.

---

## 1. The verdict

1. **The code is in better shape than the paperwork.** No leaked passwords or keys in the current files, private pages refuse strangers, prices are worked out on the server, and tests run on GitHub.
2. **The biggest risks are not code.** They are: what the coffee site says in public, Hypest being public before it is ready, how GST is counted, and everything depending on one person and one host.
3. **Coffee is the only business taking real money today**, so its paperwork comes first.
4. **Nothing found needs a rebuild.** Most fixes are small.

---

## 2. Top actions, in order

🔴 = do this week. 🟠 = do before 1 Jan 2027. 🟢 = when convenient.

| # | | Action | Who | Why |
|---|---|---|---|---|
| 1 | 🔴 | Coffee: change the charity and product words on the site (section 3.1) | Markus decides words, Claude changes | The site names RSPCA before the agreement is signed, and makes two claims that need proof |
| 2 | 🔴 | Coffee: pay the charity money owed and keep the receipt | Markus | Admin shows "Charity owed $61.00 · not yet paid" |
| 3 | 🔴 | Coffee: press Publish on the Replit website | Markus | Postage by weight, delivery notes and the `/admin` fix are waiting |
| 4 | 🔴 | Hypest: hide it from Google and add a "preview" banner | Claude (say yes) | It is public and searchable with draft legal pages |
| 5 | 🔴 | Turn on 2-step login everywhere and save the recovery codes (section 7.1) | Markus | One stolen password could take the whole company |
| 6 | 🔴 | DDG Build: decide if the enquiry form should be open yet (section 7.5) | Markus | It is open now; notes say 1 Jan 2027; contract and insurance are not done |
| 7 | 🟠 | GST: count the whole company's sales, not coffee alone | Markus + accountant, Claude fixes the meter | The $75,000 line is for all businesses added together |
| 8 | 🟠 | Backups: turn on daily backups for Coffee and Hypest; test one restore | Markus (Replit setting), Claude checks | Notes say Coffee's scheduled backups are off |
| 9 | 🟠 | Finance: take the production database copy out of GitHub | Claude (say yes) | A full copy of the live database sits in the repo |
| 10 | 🟠 | Add security headers to ddg.limited and the coffee site | Claude | Missing on both; Hypest already has them |
| 11 | 🟠 | Put the coffee partner deal in writing | Markus + lawyer | The site says DDG operates the store; notes say a partner runs it with you |
| 12 | 🟠 | Hypest: lawyer review of terms, privacy and health wording before live payments | Markus + lawyer | Health data brings privacy law in, whatever the company's size |
| 13 | 🟠 | Finance: start the Phase 0 fixes already agreed | Opus 5.5 or Claude | Nothing has been fixed yet since the gate was stopped |
| 14 | 🟠 | Insurance check for Coffee, Hypest and Build | Markus + broker | Not visible from here |
| 15 | 🟢 | Protect the `main` branch on GitHub | Markus | Not available on the current GitHub plan |
| 16 | 🟢 | Add a mail rule (SPF) for ddg.limited | Markus (domain settings) | Stops others faking email from your domain |
| 17 | 🟢 | Creative: make three choices before publishing (section 6) | Markus | They are hard to undo later |

---

## 3. Cattle Dog Coffee

### 3.1 What the site says in public 🔴

| Words on the live site | Mark | Problem | What I would do |
|---|---|---|---|
| Coffee site: "$1 from every bag purchase goes to animal charities like RSPCA" · "$1 from every bag still goes to RSPCA QLD" · "$1 from every bag goes to the RSPCA and other animal shelters". ddg.limited: "Helping RSPCA Queensland" · "$1 from every bag goes to RSPCA Queensland" | ✅ | The RSPCA agreement is not signed yet (you told me). RSPCA Qld's website terms say nothing there gives anyone the right to use its names or logos without its written agreement. Five places say three different things. | Until signed: "**$1 from every bag goes to animal welfare charities.**" One sentence, same on both sites. Add RSPCA's name and logo the day the agreement is signed. |
| ddg.limited: "**Given** from coffee sales" next to a dollar figure | ✅ | The coffee admin shows the money as owed, not yet paid. "Given" is not true until it is paid. | Say "Raised" until paid, then show "Raised" and "Paid" side by side. |
| ddg.limited: "From 1 January 2027, 1% of everything else DDG earns, from Finance and Fitness, goes to them too" | ✅ | A public promise with a start date. Fine if you mean it and track it. "Earns" is unclear: sales or profit? | Say which ("1% of sales"), and name RSPCA only once signed. |
| "LOCALLY ROASTED" | ✅ | True only if the supplier roasts near here. Notes say beans arrive already roasted from Coffee Alliance. | Keep it only with a line from the supplier saying where they roast. File that line. |
| "SUSTAINABLY HARVESTED" | ✅ | The ACCC expects proof for any green claim. I found no proof in the repo. | Get the supplier's certificate or statement, or remove the words. |
| "AUSTRALIAN OWNED" | ✅ | Fine if the owners are Australian. | Keep. |
| "Christmas 2026" 10% sale | ✅ | Fine as long as the "before" price was the real price. | No change. ❓ I did not check price history. |

**Queensland charity rules.** The Queensland Government page for charities dealing with businesses says a deal where a business takes a reward must be in writing and approved by the Office of Fair Trading. It lists one exception: a business that sells a product as normal and "occasionally" gives part of the sale to the charity. "Every bag, always" may not count as "occasionally". **Ask RSPCA Qld's partnership team and the Office of Fair Trading which side of that line you are on.** RSPCA runs these deals often and will know.

**The $61.** ✅ The admin screen shows $61.00 owed and not yet paid. The site promises $1 per bag. Pay it, save the receipt, and pick a rhythm (monthly is simple). Then show "paid so far" on the site next to "raised so far". That is the strongest proof a customer can see.

### 3.2 Store and payments

- ✅ Private pages (admin, customer account) refuse strangers.
- ✅ The browser never sends a price; the server works it out.
- ✅ Card details never touch your site (Stripe handles them).
- ✅ Postage by weight, admin postage screen, delivery notes and "dog in the yard" are merged and tested in the test store. **Not live until you press Publish.**
- Not yet tested by anyone: one real paid order end to end with delivery notes, and saving from the Postage screen.
- 📝 No handler for refunds made inside Stripe. A refund there does not update your order or the charity count.
- 📝 No branded order email yet.
- 📝 Scheduled database backups are off.
- 📝 Hardening list still open: limit how fast checkout can be called, tighten which sites may call the API, make the waitlist export safe to open in Excel, narrow the admin login code.
- 📝 Postage and pricing sums exist in two places (server and shop page). One should be the only source.

### 3.3 Legal pages

- ✅ Privacy policy exists (dated 26 Sep 2026) and names Digital Dynamics Group with its ABN.
- ✅ Shipping & Returns page exists and keeps Australian Consumer Law rights intact. Good wording.
- 🟠 After Publish, the privacy policy needs two new lines: delivery instructions and the "dog in the yard" answer are now collected.
- ❓ The privacy policy says the site runs no third-party trackers. The DDG and Hypest sites load a small Replit script. I did not confirm whether the coffee site does too. If it does, the sentence needs a tweak.
- ✅ No real sitemap (the address returns the home page). Small job; helps Google.
- ❓ Customer account page has a cancel option in the code. I did not test that a subscriber can cancel alone. From 1 July 2027 Australian law bans "subscription traps" (sign-ups that are hard to leave), so test this before then.

### 3.4 Things only you can confirm ❓

- What is on the bag label: business name and address, weight, best-before, batch number, where the coffee comes from. Ask the supplier or a food-label check.
- Whether Brisbane City Council needs you to hold a food business licence for reselling packed coffee. Not researched.
- Product liability insurance.
- The partner: who owns what share, who is owed what, who can sign. The site says DDG operates the store; the notes say it has its own Stripe account run with a partner. Write it down and both sign.

---

## 4. DDG Finance (quant-terminal)

- ✅ Tests run on GitHub on every change: 291 + 1,055 pass.
- ✅ The live dashboard is private (a stranger is sent to Replit instead of seeing it).
- ✅ **A full copy of the production database is saved inside the GitHub repo** (`backups/`, dated 3 Sep, 73 tables). The repo is private and the file's own notes say it holds no passwords. It should still not live in code. Move it to private storage and remove it from the repo.
- 📝 The trading key is built into the dashboard page. Safe only while the dashboard stays private. **Never make that dashboard public without fixing this first.**
- 📝 Known gaps, all in the agreed roadmap: double-order fix not published, no broker time limits, Bitcoin stop-fill not closing in the ledger, no closing snapshot, kill switch only alerts, no outside heartbeat. **None fixed yet.**
- ✅ Roadmap and build guide are in the repo and in the DDG Project.

**The public performance page (ddg.limited/finance)**

- ✅ It says: "Paper trading on broker practice accounts. Not financial advice. We don't take outside money." Good.
- ASIC says running a financial services business without a licence is an offence, and that a disclaimer alone does not decide whether something counts as advice. So keep the page to facts: what the bots did, next to the S&P 500. No "you should", no sign-up, no broker links.
- 🟠 **Before real-money results go public, and well before anyone else's money is involved, get a one-hour lawyer view.** The roadmap already says this for Phase 5.
- 🟢 The page describes the current four bots. When Defensive Stocks replaces Atlas V2 at the lock, the page words must change the same day.

---

## 5. DDG Fitness (Hypest)

**State today**
- ✅ Live and public at `ddg-hypest.replit.app`, and it tells Google to list it.
- ✅ Payments are in test mode. AI is off. Email is off.
- ✅ Terms, Privacy and Health pages say "DRAFT … not yet reviewed by a lawyer".
- ✅ Prices are shown in US dollars ($2.50 first plan; $4.99 / $12.99 / $19.99 a month).

**What is already good** ✅
- Security headers on the API. Login attempts are limited.
- 18+ only. Health check before the first plan. "This hurts" button. Emergency numbers. Delete-my-account option (I read the page; I did not test the delete).
- Privacy page names who gets data (Replit, Stripe, Google, Anthropic when AI is on) and says it goes overseas.
- Live payments are locked behind a switch (`STRIPE_LIVE_APPROVED`).
- A written, phased build plan. Watches (Strava, Fitbit, Apple Health) are Phase 4.

**What to fix**

| | Finding | What I would do |
|---|---|---|
| 🔴 | Public and searchable with draft legal pages and test payments. | Tell Google not to list it and show a "Preview — not open yet" banner until launch. Ten-minute change. |
| 🟠 | **Privacy law applies.** The privacy regulator says any business that provides a health service and holds health information is covered, whatever its size, and lists gyms and weight-loss clinics as examples. A "health service" includes helping someone improve their physical health. Hypest very likely fits. | Lawyer-reviewed privacy policy, a plan for data leaks, clear consent for health answers. Ask the lawyer about the new rule from 10 Dec 2026 (privacy policies must explain decisions made by computer programs). |
| 🟠 | **"Strong caveats" have limits.** Australian law lets a sport or recreation business ask customers to waive claims for death or injury only. Waivers that reach further have been thrown out in court. Reckless conduct cannot be waived. | Keep the current soft wording ("to the extent the law allows"). Have the lawyer write the injury waiver properly. The real protection is what you already built: screening, pain stops, no medical claims — plus insurance. |
| 🟠 | **Stay a wellness app, not a medical one.** The medicines regulator leaves general fitness and coaching apps alone, but not apps that deal with serious conditions or diagnose. | When watches arrive, never say the app detects, diagnoses or treats anything. "Your heart rate was high" is fine. "You may have a heart problem" is not. |
| 🟠 | **App stores.** Apple forbids using health data for ads or data mining, and forbids storing personal health data in iCloud. | Already your approach. Write it into the privacy policy before Phase 4. |
| 🟢 | Lives on a Replit address. Support email is `support@hypestapp.com`. | ❓ Confirm you own hypestapp.com and that the mailbox works. Point the domain at the app before launch. |
| 🟢 | From 1 July 2027 the law bans subscriptions that are hard to cancel. | Draft terms already say "cancel any time in Me". Test it before launch. |
| ❓ | Insurance, and whether "Hypest" is free to use as a name. | Broker; trademark search. |

---

## 6. DDG Creative (the novel)

No code yet, so this is three choices to make **before** publishing.

1. **Where to sell.** Amazon's optional "KDP Select" programme locks the ebook to Amazon for 90 days at a time: no selling or giving it away on your own site. To sell at $9.90 on your own site, publish on Amazon **without** Select. You then keep the right to sell anywhere.
2. **Say how AI was used.** Amazon asks at upload whether text, images or translations were made by AI. Text you wrote and AI helped polish does not need declaring; text AI wrote does, even after edits. Keep a short dated note of how each chapter was written. A publisher will ask the same question.
3. **How to sell it yourself.** The coffee store already takes payments. A small "pay, then get a download link by email" page can reuse that. No new service needed.

❓ Not researched: ISBN, sending a copy to the National and State libraries, tax on overseas ebook sales. Ask when the book is close.

---

## 7. Whole company

### 7.1 Logins and access 🔴 ❓

I cannot see any of this. Please tick each one yourself:

| Account | 2-step login on? | Recovery codes saved offline? | Who else can get in? |
|---|---|---|---|
| GitHub | | | |
| Replit | | | |
| Stripe (DDG) | | | |
| Stripe (Coffee) | | | |
| Domain company (ddg.limited, cattledogcoffee.com.au, hypestapp.com) | | | |
| Google (email) | | | |
| Brokers (Alpaca, OANDA, Kraken) | | | |
| Bank | | | |

- 📝 DDG Control itself already uses email + password + authenticator.
- Also check each domain is on auto-renew with a card that will not expire.
- **One trusted person** should be able to reach these if you cannot. A sealed envelope is enough.

### 7.2 Code and GitHub

- ✅ All four DDG repos are private.
- ✅ No passwords or keys in the current files of any of them. Old history was not scanned.
- ✅ `main` is not protected in any repo. GitHub does not offer it on your current plan for private repos. Until then the rule is: every change goes through a pull request with green checks. That is how I have worked all session.
- ✅ Automatic checks on GitHub: Finance (tests), Coffee (type check), Hypest (checks). **DDG Control has none.** Worth adding a type check.
- ❓ Dependabot alerts (warnings about unsafe libraries). Free. Turn on in each repo: Settings → Security.
- ✅ `attached_assets/ddg-auth-evidence/` in DDG Control holds six login screenshots. I did not open them. If they show anything private, move them out.

### 7.3 Websites

| | ddg.limited | Coffee | Hypest |
|---|---|---|---|
| Forces secure connection | ✅ | ✅ | ✅ |
| Security headers | ✅ missing | ✅ missing | ✅ present on API |
| Says "built with Express" to strangers | ✅ yes | ✅ yes | — |
| Private pages refuse strangers | ✅ | ✅ | ✅ |
| Enquiry form limited (3 an hour per person) | ✅ | — | — |

- ✅ ddg.limited's page description still says "three businesses".
- ✅ ddg.limited collects a name and email on the Build form. The form says "We only use your details to reply", but the site has no privacy page. One short page fixes it.
- ✅ ddg.limited has no SPF mail rule. It sends no mail, so add `v=spf1 -all`. This tells the world that no one may send email as ddg.limited.
- ✅ Coffee's mail rules are in place (SPF and DMARC).

### 7.4 Money and tax

- ✅ The website says "DDG is not registered for GST".
- ✅ The coffee admin's GST meter counts coffee sales only ($1,791.60 of $75,000).
- The tax office says the $75,000 line is gross income from **all** your businesses, checked every month, looking both back 12 months and forward 12 months, and you have 21 days to register once you expect to pass it.
- DDG Build quotes start at $1,500 and run to $45,000. **A few Build jobs could cross the line on their own.**
- 🟠 Ask the accountant; then I change the meter to add Coffee + Build + Hypest + book.
- ❓ Separate bank account per business, bookkeeping tool, who the accountant is.

### 7.5 DDG Build (client work)

- ✅ Prices are public: from $1,500 (website) to $45,000 (platform).
- ✅ The site says "about 25% below typical Australian prices". Keep a note of the prices you compared against, in case anyone asks.
- 📝 Still open in the Build plan: lawyer-written contract, professional indemnity insurance, monthly limit on new projects.
- ✅ 🔴 **The Build enquiry form is open on the live site now** (opened 8 Nov 2026). The notes say it opens 1 Jan 2027. Either is fine, but pick one. **Do not take a paid job before the contract and insurance exist.**

### 7.6 Running the company

- **One person, one host.** Everything depends on you and on Replit. If either stops, all five things stop.
  - Fix for "you": the sealed envelope (7.1) and the start-here notes (already good).
  - Fix for "Replit": the code is safe on GitHub. The data is not, until backups are on (action 8).
- **AI staff.** 📝 Claude writes code; four Grok bots hold keys (Heimdall, Freya, Tyr, Plutus). ❓ I did not audit what each bot key can do. Each key should reach only what that bot needs, and be easy to switch off.
- **Watching.** 📝 Finance's outside heartbeat is off. ❓ Nothing checks from outside that the coffee checkout is up. A free uptime checker on the three public sites takes ten minutes.
- **When something breaks.** No written "what to do" page exists for: site down, wrong charge, data leak, bot misbehaving. One page per business, five lines each.

---

## 8. If it were my company

1. **Fix Coffee's words and pay the charity this week.** Trust is the product.
2. **Hide Hypest until it is ready.** A draft in public can only hurt.
3. **One page called "Company register"**: who owns what, every account and its renewal date, which bank and Stripe belong to which business, insurance, accountant, lawyer.
4. **One calendar of dates**: monthly GST check, charity payment, 10 Dec 2026 privacy rule, 1 Jan 2027 launch, 1 Jul 2027 subscription rule, domain renewals.
5. **One launch gate for every business.** Nothing goes public until: legal pages reviewed, backups on, uptime watched, one real payment tested end to end, insurance in place.
6. **Same safety basics in every app**, copied from Hypest, which does it best.
7. **Order of effort:** Coffee (earns now) → Finance Phase 0 (already planned) → Hypest legal → Build contract → the novel.

---

## 9. What I can do next without you

Say "go" to any of these:
- **A.** Hide Hypest from Google and add the preview banner.
- **B.** Security headers on ddg.limited and the coffee site; fix "three businesses"; add a short privacy page to ddg.limited.
- **C.** Take the database copy out of the Finance repo (I will tell you where to keep it first).
- **D.** Coffee: update the privacy page, add a real sitemap, add the refund handler.
- **E.** Add a type check on GitHub for DDG Control.

Needs your words first:
- **F.** The new charity sentence (both sites), "Given" → "Raised", and what to do with "locally roasted" and "sustainably harvested".
- **G.** Whether to close the Build form until the contract and insurance are done.

---

## 10. Sources

- ATO, registering for GST: https://www.ato.gov.au/businesses-and-organisations/gst-excise-and-indirect-taxes/gst/registering-for-gst
- business.gov.au, register for GST: https://business.gov.au/registrations/register-for-taxes/register-for-goods-and-services-tax-gst
- OAIC, health information and who is covered: https://www.oaic.gov.au/privacy/privacy-legislation/the-privacy-act/health-and-and-medical-research
- OAIC, small business and the Privacy Act: https://www.oaic.gov.au/privacy/the-privacy-act/rights-and-responsibilities
- Privacy rule from 10 Dec 2026 (law firm summaries): https://www.gtlaw.com.au/insights/automated-decision-making-transparency-under-the-privacy-act · https://www.allens.com.au/insights-news/insights/2026/06/automated-decision-making-transparency-what-app-entities-need-to-know-about-the-app-1-amendments/
- Queensland Government, charities dealing with businesses: https://www.qld.gov.au/law/laws-regulated-industries-and-accountability/queensland-laws-and-regulations/associations-charities-and-non-for-profits/charities-and-fundraising/running-an-appeal-for-fundraising-support/dealing-with-businesses
- RSPCA Queensland, terms (names and logos): https://rspcaqld.org.au/terms-and-conditions · partnerships: https://rspcaqld.org.au/how-you-can-help/get-your-business-involved/partnership
- ACCC green-claims guidance (law firm summaries): https://cm.twobirds.com/en/insights/2024/australia/navigating-greenwashing-the-acccs-definitive-guide-for-businesses-making-sustainability-claims · https://www.corrs.com.au/insights/clean-is-out-robust-evidence-is-in-the-accc-publishes-its-final-guidance-for-businesses-making-environmental-claims
- ASIC, discussing financial products online (INFO 269): https://asic.gov.au/regulatory-resources/financial-services/giving-financial-product-advice/discussing-financial-products-and-services-online/
- Disclaimers and financial advice: https://www.hsfkramer.com/fr/notes/fsraustralia/2022-04/financial-services-in-the-social-media-age-the-rise-and-risks-of-finfluencers
- Waivers for recreation services: https://lawyersalliance.com.au/opinion/are-waivers-enforceable-it-depends · https://legalvision.com.au/gym-disclaimer-include
- TGA, software left outside medical-device rules: https://www.tga.gov.au/resources/resource/guidance/excluded-software
- Apple, health and fitness apps: https://developer.apple.com/HealthKit/
- Subscription-trap law from 1 July 2027: https://www.ashurstperkinscoie.com/en/insights/australia-bans-unfair-trading-practices-strengthens-laws-against-drip-pricing-and-subscription-traps/ · https://www.brightlaw.com.au/unfair-trading-practices-ban-passed-by-parliament/
- Amazon KDP, AI content rules: https://kdp.amazon.com/help/topic/G200672390
- KDP Select exclusivity (author guides): https://scribecount.com/author-resource/publishing-a-book/KDP-Select:-The-Complete-Operational-Guide · https://justpublishingadvice.com/does-amazon-kdp-select-help-sell-more-ebooks/

---

## 11. What this audit did not cover

- Old GitHub history (only current files were scanned for secrets).
- Anything behind a login I do not have: Stripe, banks, brokers, domain company, Google, Replit settings.
- The Grok bots' permissions.
- A full penetration test. I tested from outside what a visitor can reach.
- The six login screenshots in DDG Control and the contents of the Finance database copy.
- Trading strategy quality (covered on 17 Nov in the Finance roadmap).
