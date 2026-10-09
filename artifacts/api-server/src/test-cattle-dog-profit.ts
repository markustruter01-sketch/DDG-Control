import assert from "node:assert/strict";
import http from "node:http";
import express from "express";
import metricsRouter from "./routes/metrics";

const TEST_STATS_KEY = "test-only-ddg-stats-key";
const STORE_URL = "https://cattledogcoffee.com.au/api/ddg/summary";
const originalFetch = globalThis.fetch;
const originalStatsKey = process.env.DDG_STATS_KEY;
let fetchCalls = 0;
let mockedResponse = new Response("{}", { status: 200 });

globalThis.fetch = async (input, init): Promise<Response> => {
  fetchCalls += 1;
  const requestUrl = input instanceof Request ? input.url : input.toString();
  assert.equal(requestUrl, STORE_URL);
  assert.equal(init?.method, "GET");
  assert.equal(new Headers(init?.headers).get("x-ddg-key"), TEST_STATS_KEY);
  return mockedResponse.clone();
};

const validPeriod = (overrides: Record<string, unknown> = {}) => ({
  orderCount: 3,
  grossRevenueCents: 10_000,
  coffeeRevenueCents: 9_000,
  shippingCollectedCents: 1_000,
  estimatedCoffeeCostCents: 3_000,
  estimatedBagCostCents: 300,
  estimatedSatchelCostCents: 100,
  estimatedStripeFeeCents: 250,
  estimatedMarginCents: 5_350,
  missingUnitCostProducts: [],
  bagCount: 2,
  charityCents: 200,
  ...overrides,
});

function storeResponse(
  status: number,
  body: unknown,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function requestProfit(port: number): Promise<{
  status: number;
  body: unknown;
}> {
  return new Promise((resolve, reject) => {
    const request = http.request(
      {
        hostname: "127.0.0.1",
        port,
        method: "GET",
        path: "/projects/cattle-dog-coffee/profit",
      },
      (response) => {
        const chunks: Buffer[] = [];
        response.on("data", (chunk: Buffer) => chunks.push(chunk));
        response.on("end", () => {
          try {
            resolve({
              status: response.statusCode ?? 0,
              body: JSON.parse(Buffer.concat(chunks).toString("utf8")),
            });
          } catch (error) {
            reject(error);
          }
        });
      },
    );
    request.on("error", reject);
    request.end();
  });
}

function output(label: string, result: { status: number; body: unknown }) {
  process.stdout.write(
    `${label}: HTTP ${result.status} ${JSON.stringify(result.body)}\n`,
  );
}

const app = express();
app.use(metricsRouter);
const server = app.listen(0, "127.0.0.1");

try {
  await new Promise<void>((resolve, reject) => {
    server.once("listening", resolve);
    server.once("error", reject);
  });
  const address = server.address();
  assert(address && typeof address !== "string");

  delete process.env.DDG_STATS_KEY;
  const callsBeforeMissingKey = fetchCalls;
  const missingKey = await requestProfit(address.port);
  assert.equal(missingKey.status, 503);
  assert.deepEqual(missingKey.body, { error: "store not configured" });
  assert.equal(fetchCalls, callsBeforeMissingKey);
  output("a) missing DDG_STATS_KEY", missingKey);

  process.env.DDG_STATS_KEY = TEST_STATS_KEY;
  mockedResponse = storeResponse(401, { error: "unauthorized" });
  const authFailed = await requestProfit(address.port);
  assert.equal(authFailed.status, 502);
  assert.deepEqual(authFailed.body, { error: "store auth failed" });
  output("b) store HTTP 401", authFailed);

  mockedResponse = storeResponse(200, {
    generatedAt: "2026-10-09T00:00:00.000Z",
    currency: "aud",
    last30d: { unexpected: true },
    allTime: { unexpected: true },
  });
  const badResponse = await requestProfit(address.port);
  assert.equal(badResponse.status, 502);
  assert.deepEqual(badResponse.body, { error: "store bad response" });
  output("c) wrong store response shape", badResponse);

  mockedResponse = storeResponse(200, {
    generatedAt: "2026-10-09T00:00:00.000Z",
    currency: "aud",
    last30d: validPeriod(),
    allTime: validPeriod({
      estimatedMarginCents: 15_000,
      charityCents: 400,
    }),
  });
  const validResponse = await requestProfit(address.port);
  assert.equal(validResponse.status, 200);
  const validBody = validResponse.body as {
    last30d: { estimatedMarginCents: number | null; charityCents: number; netProfitCents: number | null };
    allTime: { estimatedMarginCents: number | null; charityCents: number; netProfitCents: number | null };
  };
  assert.equal(
    validBody.last30d.netProfitCents,
    validBody.last30d.estimatedMarginCents! - validBody.last30d.charityCents,
  );
  assert.equal(
    validBody.allTime.netProfitCents,
    validBody.allTime.estimatedMarginCents! - validBody.allTime.charityCents,
  );
  output("d) valid store response", validResponse);

  mockedResponse = storeResponse(200, {
    generatedAt: "2026-10-09T00:00:00.000Z",
    currency: "aud",
    last30d: validPeriod({ estimatedMarginCents: null }),
    allTime: validPeriod(),
  });
  const nullMarginResponse = await requestProfit(address.port);
  assert.equal(nullMarginResponse.status, 200);
  const nullMarginBody = nullMarginResponse.body as {
    last30d: { netProfitCents: number | null };
  };
  assert.equal(nullMarginBody.last30d.netProfitCents, null);
  output("d) null estimated margin", nullMarginResponse);

  process.stdout.write(`PASS: ${fetchCalls} mocked store requests; no network used\n`);
} finally {
  globalThis.fetch = originalFetch;
  if (originalStatsKey === undefined) {
    delete process.env.DDG_STATS_KEY;
  } else {
    process.env.DDG_STATS_KEY = originalStatsKey;
  }
  await new Promise<void>((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
}
