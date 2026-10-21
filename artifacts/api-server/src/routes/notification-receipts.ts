import { createHash } from "node:crypto";
import { db, decisionsTable, notificationReadReceiptsTable } from "@workspace/db";
import { decisionNotificationPayload } from "@workspace/project-constants";
import { and, eq, inArray } from "drizzle-orm";
import { Router, type IRouter } from "express";
import { requireRealOwnerSession } from "./auth";

const router: IRouter = Router();
const MAX_IDS = 50;
const sourceVersion = (decision: typeof decisionsTable.$inferSelect) =>
  createHash("sha256").update(decisionNotificationPayload(decision)).digest("hex");
const validId = (value: unknown): value is number =>
  typeof value === "number" && Number.isSafeInteger(value) && value > 0 && value <= 2147483647;

// Both routes are owner-only, including in development. No worker/inbound key
// or DEV bypass can read/write the owner's cross-device receipt state.
router.get("/notification-receipts", requireRealOwnerSession, async (req, res): Promise<void> => {
  res.set("Cache-Control", "private, no-store");
  const raw = req.query.decision_ids;
  if (typeof raw !== "string" || raw.length > 600 || !/^[1-9][0-9]*(,[1-9][0-9]*)*$/.test(raw)) {
    res.status(400).json({ error: "Provide a comma-separated decision_ids list." }); return;
  }
  const ids = [...new Set(raw.split(",").map(Number))];
  if (!ids.length || ids.length > MAX_IDS || !ids.every(validId)) {
    res.status(400).json({ error: "Choose up to 50 valid decision IDs." }); return;
  }
  try {
    const rows = await db.select({ decision: decisionsTable, receipt: notificationReadReceiptsTable })
      .from(decisionsTable).leftJoin(notificationReadReceiptsTable, eq(notificationReadReceiptsTable.decision_id, decisionsTable.id))
      .where(and(inArray(decisionsTable.id, ids), eq(decisionsTable.status, "pending")));
    res.json({ items: rows.map(({ decision, receipt }) => {
      const version = sourceVersion(decision);
      return { decision_id: decision.id, source_version: version,
        read_at: receipt?.source_version === version ? receipt.read_at.toISOString() : null };
    }) });
  } catch {
    // Includes a not-yet-applied migration. Never expose SQL or connection data.
    res.status(503).json({ error: "Saved read markers are unavailable. Existing decisions remain separate and unchanged." });
  }
});

router.post("/notification-receipts", requireRealOwnerSession, async (req, res): Promise<void> => {
  res.set("Cache-Control", "private, no-store");
  const body = req.body;
  if (!body || typeof body !== "object" || Array.isArray(body) ||
      Object.keys(body).some((key) => !["decision_id", "source_version"].includes(key)) ||
      !validId(body.decision_id) || typeof body.source_version !== "string" || !/^[a-f0-9]{64}$/.test(body.source_version)) {
    res.status(400).json({ error: "Provide only decision_id and its displayed source_version." }); return;
  }
  try {
    const result = await db.transaction(async (tx) => {
      const [decision] = await tx.select().from(decisionsTable)
        .where(eq(decisionsTable.id, body.decision_id)).for("update").limit(1);
      if (!decision) return { kind: "missing" as const };
      if (decision.status !== "pending") return { kind: "resolved" as const };
      const version = sourceVersion(decision);
      if (version !== body.source_version) return { kind: "changed" as const };
      const [previous] = await tx.select().from(notificationReadReceiptsTable)
        .where(eq(notificationReadReceiptsTable.decision_id, decision.id)).limit(1);
      if (previous?.source_version === version) return { kind: "ok" as const, receipt: previous };
      const [receipt] = await tx.insert(notificationReadReceiptsTable)
        .values({ decision_id: decision.id, source_version: version })
        .onConflictDoUpdate({ target: notificationReadReceiptsTable.decision_id,
          set: { source_version: version, read_at: new Date() } }).returning();
      return { kind: "ok" as const, receipt };
    });
    if (result.kind !== "ok") {
      res.status(result.kind === "missing" ? 404 : 409).json({
        error: result.kind === "missing" ? "Decision no longer exists." :
          result.kind === "resolved" ? "Decision is no longer pending. Refresh the inbox." :
          "Decision content changed. Refresh and read the current record before marking it read.",
      }); return;
    }
    res.json({ decision_id: result.receipt.decision_id, source_version: result.receipt.source_version,
      read_at: result.receipt.read_at.toISOString() });
  } catch {
    res.status(503).json({ error: "Read marker save is unconfirmed. Refresh saved markers before retrying; no approval was requested." });
  }
});

export default router;
