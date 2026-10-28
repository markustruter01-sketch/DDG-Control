// Shared number formatting for every page.

export const aud = (cents: number | null | undefined): string =>
  cents === null || cents === undefined
    ? '—'
    : new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(cents / 100);

export const count = (value: number | null | undefined): string =>
  value === null || value === undefined
    ? '—'
    : new Intl.NumberFormat('en-AU', { notation: value >= 10_000 ? 'compact' : 'standard', maximumFractionDigits: 1 }).format(value);

/** Whole days from today (Brisbane) until an ISO date. */
export function daysUntil(isoDate: string): number {
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Australia/Brisbane' }).format(new Date());
  return Math.round((Date.parse(`${isoDate}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / 86_400_000);
}
