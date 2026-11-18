# DDG Control and ddg.limited: what to do when something breaks

Work order B1.11 (company build list). Five lines each: how you notice, first step, who to tell, how to undo, where the logs are.
Marks: VERIFIED = checked in the code, 18 Nov 2026. UNKNOWN = not checkable from the code; Markus to confirm.

**Health address to watch (free uptime monitor):** `https://ddg.limited/api/healthz` (VERIFIED: `artifacts/api-server/src/routes/health.ts`).

## 1. Site down (ddg.limited or the Control room does not load)
- **Notice:** the uptime monitor alerts, or the page shows an error or stays black.
- **First step:** open the Replit app (DDG-Control) → Deployments. If the last publish failed, republish the last good one.
- **Tell:** Markus. Nobody else needs to know unless it lasts more than an hour.
- **Undo:** Replit keeps earlier publishes; roll back to the last one that worked. On GitHub, revert the last merged pull request.
- **Logs:** Replit app → Deployments → Logs.

## 2. Wrong charge or wrong money number
- **Notice:** a client or Stripe email, or a number on ddg.limited or in Control that looks wrong.
- **First step:** do not change anything in Stripe from the site. Check the number at its source (Stripe dashboard, the coffee admin, or the Finance push).
- **Tell:** Markus; the client in writing if their money is involved.
- **Undo:** refunds only from the Stripe dashboard, by Markus. Fix the code by a pull request.
- **Logs:** Stripe dashboard → Events; Replit deployment logs for `/api/public/*`.

## 3. Data leak (a secret, an email address or a client's details shown where they should not be)
- **Notice:** anyone reports it, or a secret appears in a page, a log or GitHub.
- **First step:** change (rotate) the secret at once, in Replit Secrets and at the service that issued it. Take the page down if needed (republish without it).
- **Tell:** Markus. If client personal details leaked, Australian law may require telling them and the privacy regulator (OAIC): ask the lawyer the same day.
- **Undo:** remove the content; GitHub history keeps old files, so a rotated secret is the real fix.
- **Logs:** Replit deployment logs; GitHub → the commit that added it.

## 4. A bot misbehaving (Heimdall, Freya, Tyr, Plutus or another bot key)
- **Notice:** odd posts, messages or pushes in Control, or a bot doing work it should not.
- **First step:** switch that bot off by deleting its key in Replit Secrets (the secret named after the bot, for example `FREYA`). Each key is separate, so the others keep working (VERIFIED: `artifacts/api-server/src/lib/bot-keys.ts`).
- **Tell:** Markus.
- **Undo:** add a new key when it is fixed. Nothing a bot does is public without Markus's yes.
- **Logs:** Replit deployment logs (each push is signed with the bot's name).

## 5. Finance numbers missing or stale on ddg.limited/finance
- **Notice:** the page says data is waiting, or the time shown is hours old.
- **First step:** check the trading platform (DDG-Finance) is running; it pushes once an hour. Do not touch the trading platform while the US market is open.
- **Tell:** Markus.
- **Undo:** none needed on this site; it shows the newest push it has.
- **Logs:** the DDG-Finance app's logs on Replit.

UNKNOWN: who besides Markus can log in to Replit, GitHub and Stripe (company audit 7.1).
