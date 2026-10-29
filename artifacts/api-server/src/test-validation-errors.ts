import assert from "node:assert/strict";
import http from "node:http";
import express from "express";
import { z, ZodError } from "zod/v4";
import financeRouter from "./routes/finance";
import { fleetInboundRouter } from "./routes/fleet";
import inboundRouter from "./routes/inbound";
import decisionsRouter from "./routes/decisions";
import { zodErrorText } from "./routes/validation";

const originalFleetKey = process.env.FLEET_INBOUND_KEY;
const originalOllieKey = process.env.OLLIE_INBOUND_KEY;
process.env.FLEET_INBOUND_KEY = "test-only-fleet-key";
process.env.OLLIE_INBOUND_KEY = "test-only-ollie-key";

const rootError = z.string().safeParse(1).error;
assert(rootError);
assert.equal(zodErrorText(rootError), rootError.issues[0]?.message);

const nestedError = z
  .object({ profile: z.object({ display_name: z.string() }) })
  .safeParse({ profile: { display_name: 7 } }).error;
assert(nestedError);
assert.equal(
  zodErrorText(nestedError),
  `profile.display_name: ${nestedError.issues[0]?.message}`,
);

const multipleIssues = z
  .object({
    field: z.string().refine(() => false, { message: "first issue\ncontinued" }),
    other: z.string(),
  })
  .safeParse({ field: "value", other: 2 }).error;
assert(multipleIssues);
assert.equal(zodErrorText(multipleIssues), "field: first issue continued");
assert.equal(zodErrorText(new ZodError([])), "invalid request");
process.stdout.write("PASS: helper handles first, root, nested, empty, and multiline issues\n");

const app = express();
app.use(express.json());
app.use(financeRouter);
app.use(fleetInboundRouter);
app.use(inboundRouter);
app.use(decisionsRouter);
app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (error instanceof URIError) {
    res.status(400).json({ error: "malformed request path" });
    return;
  }
  res.status(500).json({ error: "test server error" });
});

function request(
  port: number,
  method: string,
  path: string,
  body?: unknown,
  headers: Record<string, string> = {},
): Promise<{ status: number; body: unknown }> {
  return new Promise((resolve, reject) => {
    const request = http.request(
      {
        hostname: "127.0.0.1",
        port,
        method,
        path,
        headers: {
          ...(body === undefined ? {} : { "content-type": "application/json" }),
          ...headers,
        },
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
    request.end(body === undefined ? undefined : JSON.stringify(body));
  });
}

function assertShortError(
  label: string,
  result: { status: number; body: unknown },
): void {
  assert.equal(result.status, 400, `${label} should return HTTP 400`);
  assert(result.body && typeof result.body === "object");
  const body = result.body as Record<string, unknown>;
  assert.deepEqual(Object.keys(body), ["error"]);
  assert.equal(typeof body.error, "string");
  const errorText = body.error as string;
  assert.match(errorText, /^[^\r\n]+$/);
  assert.doesNotMatch(errorText, /[{}\[\]]/);
  process.stdout.write(`${label}: HTTP ${result.status} ${JSON.stringify(result.body)}\n`);
}

const server = app.listen(0, "127.0.0.1");

try {
  await new Promise<void>((resolve, reject) => {
    server.once("listening", resolve);
    server.once("error", reject);
  });
  const address = server.address();
  assert(address && typeof address !== "string");

  assertShortError(
    "finance invalid debt id",
    await request(address.port, "PATCH", "/finance/debts/0", {}),
  );
  assertShortError(
    "fleet invalid mode",
    await request(
      address.port,
      "POST",
      "/inbound/fleet",
      {
        generated_at: new Date().toISOString(),
        mode: "invalid",
        bots: [],
        errors: [],
      },
      { authorization: "Bearer test-only-fleet-key" },
    ),
  );
  assertShortError(
    "inbound invalid finance expense",
    await request(
      address.port,
      "POST",
      "/inbound/finance/expenses",
      {},
      { authorization: "Bearer test-only-ollie-key" },
    ),
  );
  assertShortError(
    "decisions invalid status",
    await request(address.port, "GET", "/decisions?status=invalid"),
  );

  process.stdout.write("PASS: 5 route validation/error responses; no database writes\n");
} finally {
  if (originalFleetKey === undefined) {
    delete process.env.FLEET_INBOUND_KEY;
  } else {
    process.env.FLEET_INBOUND_KEY = originalFleetKey;
  }
  if (originalOllieKey === undefined) {
    delete process.env.OLLIE_INBOUND_KEY;
  } else {
    process.env.OLLIE_INBOUND_KEY = originalOllieKey;
  }
  await new Promise<void>((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
}
