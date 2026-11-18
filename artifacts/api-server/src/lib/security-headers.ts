import type { RequestHandler } from "express";

/**
 * Browser safety headers on every API response (build guide B1.1, copied from DDG Hypest).
 * The API only returns JSON, so it may never be framed, sniffed as another type, or loaded by
 * another site's page. No CORS headers: ddg.limited and DDG Control call the API from the same site.
 * Cache-Control defaults to no-store; the public routes set their own short public cache after this.
 * The web pages themselves are static files served by Replit, not by this server, so these headers
 * cover the API only.
 */
export const securityHeaders: RequestHandler = (_req, res, next) => {
  res.set({
    "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none'",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Cross-Origin-Resource-Policy": "same-origin",
    "Cache-Control": "no-store",
  });
  if (process.env["NODE_ENV"] === "production") res.set("Strict-Transport-Security", "max-age=31536000");
  next();
};
