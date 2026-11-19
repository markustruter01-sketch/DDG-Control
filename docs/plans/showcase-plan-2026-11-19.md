# Showcase pages on ddg.limited (plan, 19 Nov 2026)

Written by Claude (Opus 5.5, planning and coding; Fable was out of usage). Markus asked for public pages on
ddg.limited that show our own platforms working, as display-only demos, so visitors see what we build.

## What visitors get

| Page | What loads | What is switched off |
|---|---|---|
| `ddg.limited/live/finance` | The Finance main dashboard, looking almost exactly like Markus's, with real (paper-money) numbers updating | Every button, input, kill switch, settings and sub-page. One screen only |
| `ddg.limited/live/gods-eye-view` | The full 3D globe with live layers and the Director tour | Nothing a visitor could break; heavy data feeds cached |
| `ddg.limited/live/greenlight` | The full Greenlight app with its sample project: run the check and see the report | Uploading your own code and "Fix it with Claude" show "Paid service: get a quote" |
| `ddg.limited/live/hypest` | The Hypest app's main screens | Sign-up, payments |

Each page is a ddg.limited page with a browser-style window holding the live app, a one-line caption, "Built by DDG",
a full-screen button and "Get a fixed quote". Portfolio "Expand" links point to these pages. Phones get the
existing "best viewed on a computer" note where the app is computer-only.

## How it works (the safe way)

- **The apps stay where they are.** Each runs on its own Replit app. ddg.limited shows it in a window (an iframe).
  Each app allows ddg.limited, and only ddg.limited, to frame it.
- **Finance never opens its trading API.** The API needs a secret and stays that way. A new public, read-only
  endpoint returns one snapshot of exactly what the main dashboard shows, cached for 60 s, with account ids and
  anything secret left out. A new `/showcase` screen in the Finance dashboard draws the same components from that
  snapshot with a `readOnly` switch that hides every control.
- **Greenlight:** the checking engine is deterministic and free to run, so the sample project runs for anyone. The
  steps that cost money (AI fixes) and uploads are gated. Later: pay-per-use with Stripe (needs Markus's yes).
- **God's Eye View:** public feeds have rate limits (and Cesium has a free-tier cap). Its server already caches;
  we check the limits before it goes public.

## Order

1. Finance showcase (no new cost): public snapshot endpoint, `/showcase` screen, frame header, ddg.limited page.
2. The ddg.limited `/live/...` page template and portfolio links.
3. Greenlight demo: import into Markus's Replit, demo gate, publish (new cost: needs yes).
4. God's Eye View: publish (new cost, check feed limits: needs yes).
5. Hypest: frame its live app.

## Open decisions for Markus

- Web address prefix: `/live/...` (suggested), `/demo/...` or `/work/...`.
- Yes to publishing God's Eye View and Greenlight as their own Replit apps (each published app is a monthly Replit cost; the exact amount shows on the publish screen).
