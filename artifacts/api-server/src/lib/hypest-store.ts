import { z } from "zod/v4";

// Hypest's read-only numbers for the Fitness card. HYPEST_SUMMARY_URL = Hypest's published address + /api/ddg/summary;
// HYPEST_STATS_KEY = the DDG_STATS_KEY secret set in Hypest. Either missing = card shows "—".
const HypestSummary = z
  .object({
    generatedAt: z.string().datetime({ offset: true }),
    currency: z.literal("usd"),
    planPurchases: z.number().int().nonnegative(),
    activeSubscribers: z.number().int().nonnegative(),
    monthlyRecurringCents: z.number().int().nonnegative(),
  })
  .strict();

export type HypestSummary = z.infer<typeof HypestSummary>;

export async function getHypestSummary(): Promise<HypestSummary | null> {
  const url = process.env.HYPEST_SUMMARY_URL?.trim();
  const key = process.env.HYPEST_STATS_KEY?.trim();
  if (!url || !key) return null;
  try {
    const response = await fetch(url, { headers: { "x-ddg-key": key }, signal: AbortSignal.timeout(10_000) });
    if (!response.ok) return null;
    const parsed = HypestSummary.safeParse(await response.json());
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}
