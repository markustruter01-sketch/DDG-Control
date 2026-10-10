export const BUSINESS_BRIEFS: Record<
  string,
  { updated: string; text: string }
> = {
  finance: {
    updated: "2026-10-10",
    text: "Paper trading only (3 Alpaca accounts + 1 OANDA practice). Atlas: ETF trend; its registered test failed vs SPY; future undecided. Momentum: live but unvalidated; first real stock buys expected Mon 12 Oct after 23:30 Brisbane; fills and stops to be checked Tue morning. Bullion: BTC/ETH/GLD/SLV, quarterly; stop-out fix and partial-stop fix published 10 Oct. Forex: paused read-only monitor. 10 Oct checks: no stray orders; every position has a broker stop except fractions of EWT (0.036) and EWZ (0.88), which is by design. Open: 17 dead stop records to delete; about 593 old unresolved alarms (mostly noise). No strategy has yet beaten simply holding SPY.",
  },
  hypest: {
    updated: "2026-10-10",
    text: "Being rebuilt from scratch as a phone-first website (Replit app: Hypest Web). Navigation shell built, checked and cleaned up on 10 Oct; nothing published; no payments built. CRITICAL: the old Stripe live key leaked in the old code repo has NOT yet been rotated (Markus to do it 10 Oct); rotation of old AWS, Google, Apple and database keys is unverified. Old code repos are private. Stripe stays in test mode until the pre-launch checklist is complete. DDG is not GST registered. Next build step: sign-up, login and profile.",
  },
  "cattle-dog-coffee": {
    updated: "2026-10-10",
    text: "Online store live at cattledogcoffee.com.au; in-person and market sales are recorded in the store admin. To 9 Oct (all time): 8 active orders, $843.70 sales of which only $48.95 was online via Stripe; net profit $217.82 after coffee, satchels, estimated Stripe fees and the RSPCA donation of $1 per bag. Refunded orders are cancelled by hand. On the Revenue tab the 'Online' cards are Stripe only; the Profit & loss card is all sales. Since 10 Oct the company profit figure uses the store's own sales and net profit.",
  },
  "ddg-music": {
    updated: "2026-10-11",
    text: "New venture replacing Gods Eye View on this dashboard (11 Oct): DDG Music, a monetised AI-generated music channel on YouTube. Channel name: DDG Music. No social accounts or handles exist yet; no revenue or audience data. Gods Eye View continues on a separate Claude account and is no longer tracked here.",
  },
};
