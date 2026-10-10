import { GetCattleDogCoffeeProfitResponse } from "@workspace/api-zod";
import { z } from "zod/v4";

export const CDC_STORE_SUMMARY_URL =
  "https://cattledogcoffee.com.au/api/ddg/summary";

const CdcStoreSummarySchema = z
  .object({
    orderCount: z.number().int(),
    grossRevenueCents: z.number().int(),
    coffeeRevenueCents: z.number().int(),
    shippingCollectedCents: z.number().int(),
    estimatedCoffeeCostCents: z.number().int().nullable(),
    estimatedBagCostCents: z.number().int(),
    estimatedSatchelCostCents: z.number().int(),
    estimatedStripeFeeCents: z.number().int(),
    estimatedMarginCents: z.number().int().nullable(),
    missingUnitCostProducts: z.array(z.string()),
    bagCount: z.number().int(),
    charityCents: z.number().int(),
  })
  .strict();

const CdcStoreResponseSchema = z
  .object({
    generatedAt: z.string().datetime({ offset: true }),
    currency: z.literal("aud"),
    last30d: CdcStoreSummarySchema,
    allTime: CdcStoreSummarySchema,
  })
  .strict();

function addNetProfit(
  summary: z.infer<typeof CdcStoreSummarySchema>,
): z.infer<typeof CdcStoreSummarySchema> & { netProfitCents: number | null } {
  return {
    ...summary,
    netProfitCents:
      summary.estimatedMarginCents === null
        ? null
        : summary.estimatedMarginCents - summary.charityCents,
  };
}

export type CattleDogCoffeeProfit = {
  generatedAt: Date;
  last30d: z.infer<typeof CdcStoreSummarySchema> & {
    netProfitCents: number | null;
  };
  allTime: z.infer<typeof CdcStoreSummarySchema> & {
    netProfitCents: number | null;
  };
};

export type CattleDogCoffeeProfitResult =
  | { ok: true; data: CattleDogCoffeeProfit }
  | { ok: false; status: 502 | 503; error: string };

export async function getCattleDogCoffeeProfit(): Promise<CattleDogCoffeeProfitResult> {
  const statsKey = process.env.DDG_STATS_KEY;
  if (!statsKey) {
    return { ok: false, status: 503, error: "store not configured" };
  }

  let storeResponse: Response;
  try {
    storeResponse = await fetch(CDC_STORE_SUMMARY_URL, {
      method: "GET",
      headers: { "x-ddg-key": statsKey },
      signal: AbortSignal.timeout(15_000),
    });
  } catch {
    return { ok: false, status: 502, error: "store error 502" };
  }

  if (storeResponse.status === 401 || storeResponse.status === 403) {
    return { ok: false, status: 502, error: "store auth failed" };
  }
  if (!storeResponse.ok) {
    return {
      ok: false,
      status: 502,
      error: `store error ${storeResponse.status}`,
    };
  }

  let payload: unknown;
  try {
    payload = await storeResponse.json();
  } catch {
    return { ok: false, status: 502, error: "store bad response" };
  }

  const parsed = CdcStoreResponseSchema.safeParse(payload);
  if (!parsed.success || parsed.data.currency !== "aud") {
    return { ok: false, status: 502, error: "store bad response" };
  }

  return {
    ok: true,
      data: GetCattleDogCoffeeProfitResponse.parse({
      generatedAt: parsed.data.generatedAt,
      last30d: addNetProfit(parsed.data.last30d),
      allTime: addNetProfit(parsed.data.allTime),
      }) as CattleDogCoffeeProfit,
  };
}
