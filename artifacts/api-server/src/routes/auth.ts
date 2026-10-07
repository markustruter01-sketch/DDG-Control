import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { Router, type IRouter, type Request, type RequestHandler } from "express";
import {
  GetSessionResponse,
  LoginBody,
  LoginResponse,
} from "@workspace/api-zod";
import { logger } from "../lib/logger";

const router: IRouter = Router();
const SESSION_COOKIE_NAME = "ddg_session";
const SESSION_DURATION_SECONDS = 30 * 24 * 60 * 60;
const FAILURE_WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILED_ATTEMPTS = 5;

type AuthConfiguration = {
  adminPassword: string;
  sessionSecret: string;
};

type FailedAttemptWindow = {
  firstFailureAt: number;
  count: number;
};

const failedAttemptsByAddress = new Map<string, FailedAttemptWindow>();
let missingConfigurationLogged = false;
let productionBypassWarningLogged = false;

function isAuthBypassed(): boolean {
  if (process.env.DDG_DEV_AUTH_BYPASS !== "true") {
    return false;
  }
  if (process.env.NODE_ENV === "production") {
    if (!productionBypassWarningLogged) {
      logger.error("DDG_DEV_AUTH_BYPASS ignored in production");
      productionBypassWarningLogged = true;
    }
    return false;
  }
  return true;
}

function getAuthConfiguration(): AuthConfiguration | null {
  const adminPassword = process.env.DDG_ADMIN_PASSWORD;
  const sessionSecret = process.env.SESSION_SECRET;
  if (!adminPassword || !sessionSecret) {
    const missingSecrets: string[] = [];
    if (!adminPassword) {
      missingSecrets.push("DDG_ADMIN_PASSWORD");
    }
    if (!sessionSecret) {
      missingSecrets.push("SESSION_SECRET");
    }
    if (!missingConfigurationLogged) {
      logger.error(
        { missingSecrets },
        "Authentication is not configured",
      );
      missingConfigurationLogged = true;
    }
    return null;
  }

  return { adminPassword, sessionSecret };
}

function getClientAddress(req: Request): string {
  return req.ip || req.socket.remoteAddress || "unknown";
}

function pruneExpiredFailureWindows(now: number): void {
  for (const [address, window] of failedAttemptsByAddress) {
    if (now - window.firstFailureAt >= FAILURE_WINDOW_MS) {
      failedAttemptsByAddress.delete(address);
    }
  }
}

function hashPassword(password: string): Buffer {
  return createHash("sha256").update(password).digest();
}

function makeSessionToken(sessionSecret: string, expiresAtSeconds: number): string {
  const payload = String(expiresAtSeconds);
  const signature = createHmac("sha256", sessionSecret)
    .update(payload)
    .digest("base64url");
  return `${payload}.${signature}`;
}

function getCookie(req: Request, name: string): string | null {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) {
    return null;
  }

  for (const entry of cookieHeader.split(";")) {
    const separatorIndex = entry.indexOf("=");
    if (separatorIndex === -1) {
      continue;
    }
    if (entry.slice(0, separatorIndex).trim() !== name) {
      continue;
    }
    return entry.slice(separatorIndex + 1).trim();
  }

  return null;
}

function hasValidSession(req: Request, sessionSecret: string): boolean {
  const token = getCookie(req, SESSION_COOKIE_NAME);
  if (!token) {
    return false;
  }

  const separatorIndex = token.indexOf(".");
  if (separatorIndex <= 0 || separatorIndex === token.length - 1) {
    return false;
  }

  const expiresAtText = token.slice(0, separatorIndex);
  const signatureText = token.slice(separatorIndex + 1);
  if (!/^\d+$/.test(expiresAtText) || !/^[A-Za-z0-9_-]{43}$/.test(signatureText)) {
    return false;
  }

  const expiresAtSeconds = Number(expiresAtText);
  if (
    !Number.isSafeInteger(expiresAtSeconds) ||
    expiresAtSeconds <= Math.floor(Date.now() / 1000)
  ) {
    return false;
  }

  const expectedSignature = createHmac("sha256", sessionSecret)
    .update(expiresAtText)
    .digest();
  const suppliedSignature = Buffer.from(signatureText, "base64url");

  return (
    suppliedSignature.length === expectedSignature.length &&
    timingSafeEqual(suppliedSignature, expectedSignature)
  );
}

function isExactLoginBody(body: unknown): body is { password: string } {
  if (body === null || typeof body !== "object" || Array.isArray(body)) {
    return false;
  }
  return Object.keys(body).length === 1 && Object.hasOwn(body, "password");
}

router.post("/login", (req, res): void => {
  const configuration = getAuthConfiguration();
  if (!configuration) {
    res.status(503).json({ error: "auth not configured" });
    return;
  }

  const now = Date.now();
  pruneExpiredFailureWindows(now);
  const address = getClientAddress(req);
  const existingWindow = failedAttemptsByAddress.get(address);
  if (existingWindow && existingWindow.count >= MAX_FAILED_ATTEMPTS) {
    res.status(429).json({ error: "too many attempts" });
    return;
  }

  const parsedBody = LoginBody.safeParse(req.body);
  const exactBody = isExactLoginBody(req.body) && parsedBody.success;
  const submittedPassword = exactBody ? parsedBody.data.password : "";
  const matchesPassword = timingSafeEqual(
    hashPassword(submittedPassword),
    hashPassword(configuration.adminPassword),
  );

  if (!exactBody || !matchesPassword) {
    const window = existingWindow ?? { firstFailureAt: now, count: 0 };
    window.count += 1;
    failedAttemptsByAddress.set(address, window);
    res.status(401).json({ error: "invalid credentials" });
    return;
  }

  failedAttemptsByAddress.delete(address);
  const expiresAtSeconds = Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS;
  const token = makeSessionToken(configuration.sessionSecret, expiresAtSeconds);
  res.cookie(SESSION_COOKIE_NAME, token, {
    expires: new Date(expiresAtSeconds * 1000),
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
  });
  res.status(200).json(LoginResponse.parse({ ok: true }));
});

router.post("/logout", (_req, res): void => {
  res.clearCookie(SESSION_COOKIE_NAME, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
  });
  res.status(200).json(LoginResponse.parse({ ok: true }));
});

router.get("/session", (req, res): void => {
  if (isAuthBypassed()) {
    res.status(200).json(
      GetSessionResponse.parse({ authenticated: true, dev_bypass: true }),
    );
    return;
  }

  const configuration = getAuthConfiguration();
  if (!configuration) {
    res.status(503).json({ error: "auth not configured" });
    return;
  }

  if (!hasValidSession(req, configuration.sessionSecret)) {
    res.status(401).json({ error: "not logged in" });
    return;
  }

  res.status(200).json(
    GetSessionResponse.parse({ authenticated: true, dev_bypass: false }),
  );
});

export const requireAuth: RequestHandler = (req, res, next): void => {
  if (isAuthBypassed()) {
    next();
    return;
  }

  const configuration = getAuthConfiguration();
  if (!configuration) {
    res.status(503).json({ error: "auth not configured" });
    return;
  }

  if (!hasValidSession(req, configuration.sessionSecret)) {
    res.status(401).json({ error: "not logged in" });
    return;
  }

  next();
};

export default router;
