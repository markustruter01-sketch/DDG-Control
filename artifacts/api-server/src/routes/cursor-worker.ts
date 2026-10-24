import { createHmac, timingSafeEqual } from "node:crypto";
import { Router, type IRouter } from "express";
import { CURSOR_HOSTED_WORKER_VERIFIED } from "../lib/managed-work-controls";
import { runCursorWorkerTick } from "../lib/cursor-worker";

const router: IRouter = Router();
router.post("/internal/cursor-worker/tick", async (req, res): Promise<void> => {
  res.setHeader("Cache-Control", "no-store");
  if (!CURSOR_HOSTED_WORKER_VERIFIED) {
    res.status(423).json({ state: "disabled", automatic_pickup: false }); return;
  }
  const b = req.body;
  const timestamp = req.get("x-ddg-worker-timestamp");
  const signature = req.get("x-ddg-worker-signature");
  if (req.url.includes("?") || !b || typeof b !== "object" || Array.isArray(b) ||
      Object.keys(b).sort().join(",") !== "action,invocation_id" || b.action !== "tick" ||
      typeof b.invocation_id !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(b.invocation_id) ||
      !timestamp || !/^[0-9]{13}$/.test(timestamp) || Math.abs(Date.now() - Number(timestamp)) > 60_000 ||
      !signature || !/^[0-9a-f]{64}$/.test(signature)) {
    res.status(401).json({ state: "unauthorised" }); return;
  }
  // Dedicated machine credential; never owner cookies, dev bypass or provider
  // API keys. No secret/signature/header/body is returned or logged here.
  const secret = process.env.DDG_CURSOR_WORKER_SECRET;
  if (!secret || secret.length < 32) { res.status(503).json({ state: "unconfigured" }); return; }
  const canonical = `POST\n/internal/cursor-worker/tick\n${timestamp}\n${b.invocation_id}\ntick`;
  const expected = createHmac("sha256", secret).update(canonical).digest();
  if (!timingSafeEqual(expected, Buffer.from(signature, "hex"))) { res.status(401).json({ state: "unauthorised" }); return; }
  try {
    const result = await runCursorWorkerTick(b.invocation_id, Number(timestamp));
    res.status(result.status).json(result.body);
  } catch {
    res.status(503).json({ state: "unresolved", automatic_retry: false, message: "Inspect saved invocation and dispatch evidence before another attempt." });
  }
});
export default router;
