// DDG's charity rule (Markus, 31 Oct 2026). One source for the server; the website reads it
// through /api/public/summary.
//  - Cattle Dog Coffee: $1 from every bag sold (counted by the shop itself).
//  - Every other DDG business (Finance, Fitness, Creative): 1% of its revenue, from 1 Jan 2027.
// All of it goes to RSPCA Queensland.
export const CHARITY = {
  partner: 'RSPCA Queensland',
  revenueSharePct: 1,
  revenueShareFrom: '2027-01-01',
} as const;

/** 1% of the given revenue, rounded to the nearest cent. */
export const revenueShareCents = (revenueCents: number) => Math.round((revenueCents * CHARITY.revenueSharePct) / 100);
