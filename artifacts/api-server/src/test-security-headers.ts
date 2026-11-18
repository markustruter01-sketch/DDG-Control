/**
 * Security headers on the API (B1.1). Runs without a server or database.
 */
import assert from "node:assert/strict";
import type { Request, Response } from "express";
import { securityHeaders } from "./lib/security-headers";

function run(nodeEnv: string | undefined): Record<string, string> {
  const was = process.env["NODE_ENV"];
  if (nodeEnv === undefined) delete process.env["NODE_ENV"]; else process.env["NODE_ENV"] = nodeEnv;
  const headers: Record<string, string> = {};
  const res = {
    set(field: string | Record<string, string>, value?: string) {
      if (typeof field === "string") headers[field] = value ?? "";
      else Object.assign(headers, field);
      return this;
    },
  } as unknown as Response;
  let nextCalled = false;
  securityHeaders({} as Request, res, () => { nextCalled = true; });
  assert.ok(nextCalled, "the request must carry on to the routes");
  if (was === undefined) delete process.env["NODE_ENV"]; else process.env["NODE_ENV"] = was;
  return headers;
}

const dev = run("development");
assert.equal(dev["X-Content-Type-Options"], "nosniff");
assert.equal(dev["X-Frame-Options"], "DENY");
assert.equal(dev["Content-Security-Policy"], "default-src 'none'; frame-ancestors 'none'");
assert.equal(dev["Cross-Origin-Resource-Policy"], "same-origin");
assert.equal(dev["Referrer-Policy"], "strict-origin-when-cross-origin");
assert.equal(dev["Cache-Control"], "no-store");
assert.equal(dev["Strict-Transport-Security"], undefined, "no HSTS outside production");
assert.equal(run("production")["Strict-Transport-Security"], "max-age=31536000");
console.log("PASS: security headers (8 checks)");
