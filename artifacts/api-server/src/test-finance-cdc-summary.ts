import assert from "node:assert/strict";
import {
  getCattleDogCoffeeProfit,
} from "./lib/cdc-store";
import { calculateFinanceSourceTotals } from "./routes/finance";

const originalFetch = globalThis.fetch;
const originalStatsKey = process.env.DDG_STATS_KEY;
process.env.DDG_STATS_KEY = "test-only-ddg-stats-key";

const summary = {
  orderCount: 10,
  grossRevenueCents: 5000,
  coffeeRevenueCents: 4000,
  shippingCollectedCents: 1000,
  estimatedCoffeeCostCents: 1000,
  estimatedBagCostCents: 500,
  estimatedSatchelCostCents: 200,
  estimatedStripeFeeCents: 100,
  estimatedMarginCents: 1500,
  missingUnitCostProducts: [],
  bagCount: 2,
  charityCents: 200,
};

try {
  globalThis.fetch = async (input): Promise<Response> => {
    assert.equal(
      input instanceof Request ? input.url : input.toString(),
      "https://cattledogcoffee.com.au/api/ddg/summary",
    );
    return Response.json({
      generatedAt: "2026-10-10T00:00:00.000Z",
      currency: "aud",
      last30d: summary,
      allTime: summary,
    });
  };

  const storeResult = await getCattleDogCoffeeProfit();
  assert.equal(storeResult.ok, true);
  assert.equal(storeResult.data.last30d.netProfitCents, 1300);

  const testInputs = {
    projects: [
      { id: 1, slug: "cattle-dog-coffee" },
      { id: 2, slug: "finance" },
    ],
    revenueRows: [
      { project_id: 1, amount_cents: 700n },
      { project_id: 2, amount_cents: 800n },
      { project_id: null, amount_cents: 200n },
    ],
    recurringExpenseRows: [{ amount_cents: 100n }],
    oneOffExpenseRows: [{ amount_cents: 50n }],
  };
  const successful = calculateFinanceSourceTotals({
    ...testInputs,
    storeResult,
  });
  assert.equal(successful.revenue30dCents, 6000n);
  assert.equal(successful.expenses30dCents, 150n);
  assert.equal(successful.profit30dCents, 2150n);
  assert.equal(successful.venturesWithoutRevenueSource.includes("cattle-dog-coffee"), false);

  globalThis.fetch = async (): Promise<Response> =>
    Response.json({ error: "unavailable" }, { status: 503 });
  const failedStoreResult = await getCattleDogCoffeeProfit();
  assert.equal(failedStoreResult.ok, false);

  const failed = calculateFinanceSourceTotals({
    ...testInputs,
    storeResult: failedStoreResult,
  });
  assert.equal(failed.revenue30dCents, 1000n);
  assert.equal(failed.profit30dCents, 850n);
  assert.equal(failed.venturesWithoutRevenueSource.includes("cattle-dog-coffee"), true);
  assert(
    failed.notes.includes(
      "Cattle Dog Coffee store figures unavailable: store error 503",
    ),
  );

  console.log(
    JSON.stringify({
      success: {
        storeNetProfitCents: storeResult.data.last30d.netProfitCents,
        cdcManualRevenueExcludedCents: 700,
        otherAndProjectlessRevenueCents: 1000,
        revenue30dCents: successful.revenue30dCents.toString(),
        expenses30dCents: successful.expenses30dCents.toString(),
        profit30dCents: successful.profit30dCents.toString(),
      },
      storeFailure: {
        revenue30dCents: failed.revenue30dCents.toString(),
        profit30dCents: failed.profit30dCents.toString(),
        missingRevenueSource: failed.venturesWithoutRevenueSource,
        note: failed.notes.at(-1),
      },
      result: "PASS",
    }),
  );
} finally {
  globalThis.fetch = originalFetch;
  if (originalStatsKey === undefined) {
    delete process.env.DDG_STATS_KEY;
  } else {
    process.env.DDG_STATS_KEY = originalStatsKey;
  }
}
