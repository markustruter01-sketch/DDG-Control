import {
  GetProjectFinanceFleetHistoryResponse,
  GetProjectFinanceFleetLatestResponse,
  PostInboundFleetBody,
  PostInboundFleetResponse,
} from "@workspace/api-zod";
import {
  db,
  fleetBotSnapshotsTable,
  fleetSnapshotsTable,
  type FleetBotSnapshot,
  type FleetSnapshot,
} from "@workspace/db";
import { and, asc, desc, eq, gte, lt, sql } from "drizzle-orm";
import { Router, type IRouter } from "express";
import { requireInboundKey } from "./inbound";
import { getUnknownFieldError, requestBodyRecord } from "./validation";

const router: IRouter = Router();

const topLevelFields = ["generated_at", "mode", "bots", "errors"] as const;
const botFields = [
  "bot_id",
  "equity_usd",
  "starting_usd",
  "cash_usd",
  "pnl_usd",
  "open_positions",
  "last_updated",
  "stale",
  "paused",
] as const;

function isIsoTimestamp(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/i.test(
      value,
    ) &&
    Number.isFinite(Date.parse(value))
  );
}

function usdToCents(value: number): number {
  const cents = Math.round(value * 100);
  if (!Number.isSafeInteger(cents)) {
    throw new RangeError("USD amount is outside the supported range");
  }
  return cents;
}

function sumCents(values: number[]): number {
  const total = values.reduce((sum, value) => sum + value, 0);
  if (!Number.isSafeInteger(total)) {
    throw new RangeError("Fleet total is outside the supported range");
  }
  return total;
}

function toApiBot(bot: FleetBotSnapshot) {
  return {
    ...bot,
    last_updated: bot.last_updated?.toISOString() ?? null,
  };
}

function toApiSnapshot(snapshot: FleetSnapshot, bots: FleetBotSnapshot[]) {
  return {
    ...snapshot,
    generated_at: snapshot.generated_at.toISOString(),
    received_at: snapshot.received_at.toISOString(),
    bots: bots.map(toApiBot),
  };
}

function brisbaneDate(date: Date): string {
  const parts = new Map(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "Australia/Brisbane",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
      .formatToParts(date)
      .map((part) => [part.type, part.value]),
  );
  return `${parts.get("year")}-${parts.get("month")}-${parts.get("day")}`;
}

function addCalendarDays(day: string, amount: number): string {
  const [year, month, date] = day.split("-").map(Number);
  return new Date(Date.UTC(year!, month! - 1, date! + amount))
    .toISOString()
    .slice(0, 10);
}

function brisbaneMidnightUtc(day: string): Date {
  const [year, month, date] = day.split("-").map(Number);
  return new Date(Date.UTC(year!, month! - 1, date!, -10));
}

router.post(
  "/inbound/fleet",
  requireInboundKey("FLEET_INBOUND_KEY"),
  async (req, res): Promise<void> => {
    const body = requestBodyRecord(req.body);
    if (!body) {
      res.status(400).json({ error: "request body must be an object" });
      return;
    }

    const unknownFieldError = getUnknownFieldError(body, topLevelFields);
    if (unknownFieldError) {
      res.status(400).json({ error: unknownFieldError });
      return;
    }
    if (!isIsoTimestamp(body.generated_at)) {
      res.status(400).json({ error: "generated_at must be an ISO timestamp" });
      return;
    }
    if (Array.isArray(body.bots)) {
      for (const rawBot of body.bots) {
        const bot = requestBodyRecord(rawBot);
        if (!bot) {
          continue;
        }
        const botUnknownFieldError = getUnknownFieldError(bot, botFields);
        if (botUnknownFieldError) {
          res.status(400).json({ error: botUnknownFieldError });
          return;
        }
        if (bot.last_updated !== null && !isIsoTimestamp(bot.last_updated)) {
          res
            .status(400)
            .json({ error: "last_updated must be an ISO timestamp or null" });
          return;
        }
      }
    }

    const parsed = PostInboundFleetBody.safeParse(body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }

    let convertedBots;
    let totals: {
      total_equity_cents: number;
      total_starting_cents: number;
      total_pnl_cents: number;
      open_positions: number;
      stale_bots: number;
      paused_bots: number;
    };
    try {
      convertedBots = parsed.data.bots.map((bot) => ({
        bot_id: bot.bot_id,
        equity_cents: usdToCents(bot.equity_usd),
        starting_cents: usdToCents(bot.starting_usd),
        cash_cents: bot.cash_usd === null ? null : usdToCents(bot.cash_usd),
        pnl_cents: usdToCents(bot.pnl_usd),
        open_positions: bot.open_positions,
        last_updated: bot.last_updated,
        stale: bot.stale,
        paused: bot.paused,
      }));
      totals = {
        total_equity_cents: sumCents(
          convertedBots.map((bot) => bot.equity_cents),
        ),
        total_starting_cents: sumCents(
          convertedBots.map((bot) => bot.starting_cents),
        ),
        total_pnl_cents: sumCents(convertedBots.map((bot) => bot.pnl_cents)),
        open_positions: sumCents(
          convertedBots.map((bot) => bot.open_positions),
        ),
        stale_bots: convertedBots.filter((bot) => bot.stale).length,
        paused_bots: convertedBots.filter((bot) => bot.paused).length,
      };
    } catch (error) {
      res.status(400).json({
        error: error instanceof Error ? error.message : "invalid fleet totals",
      });
      return;
    }

    const result = await db.transaction(async (tx) => {
      const [existing] = await tx
        .select()
        .from(fleetSnapshotsTable)
        .where(eq(fleetSnapshotsTable.generated_at, parsed.data.generated_at))
        .limit(1);
      if (existing) {
        const bots = await tx
          .select()
          .from(fleetBotSnapshotsTable)
          .where(eq(fleetBotSnapshotsTable.snapshot_id, existing.id))
          .orderBy(asc(fleetBotSnapshotsTable.id));
        return { status: 200 as const, snapshot: existing, bots };
      }

      const [snapshot] = await tx
        .insert(fleetSnapshotsTable)
        .values({
          generated_at: parsed.data.generated_at,
          mode: parsed.data.mode,
          ...totals,
          errors: parsed.data.errors,
        })
        .onConflictDoNothing({ target: fleetSnapshotsTable.generated_at })
        .returning();

      if (!snapshot) {
        const [conflictingSnapshot] = await tx
          .select()
          .from(fleetSnapshotsTable)
          .where(eq(fleetSnapshotsTable.generated_at, parsed.data.generated_at))
          .limit(1);
        if (!conflictingSnapshot) {
          throw new Error("snapshot conflict could not be resolved");
        }
        const bots = await tx
          .select()
          .from(fleetBotSnapshotsTable)
          .where(
            eq(fleetBotSnapshotsTable.snapshot_id, conflictingSnapshot.id),
          )
          .orderBy(asc(fleetBotSnapshotsTable.id));
        return { status: 200 as const, snapshot: conflictingSnapshot, bots };
      }

      const bots = await tx
        .insert(fleetBotSnapshotsTable)
        .values(
          convertedBots.map((bot) => ({
            ...bot,
            snapshot_id: snapshot.id,
          })),
        )
        .returning();
      return { status: 201 as const, snapshot, bots };
    });

    const response = PostInboundFleetResponse.parse(
      toApiSnapshot(result.snapshot, result.bots),
    );
    res.status(result.status).json(response);
  },
);

router.get(
  "/projects/finance/fleet/latest",
  async (_req, res): Promise<void> => {
    const [snapshot] = await db
      .select()
      .from(fleetSnapshotsTable)
      .orderBy(desc(fleetSnapshotsTable.generated_at))
      .limit(1);

    if (!snapshot) {
      res.json(GetProjectFinanceFleetLatestResponse.parse({ empty: true }));
      return;
    }

    const [peakRow] = await db
      .select({
        peak_equity_cents: sql<number>`coalesce(max(${fleetSnapshotsTable.total_equity_cents}), 0)::double precision`,
      })
      .from(fleetSnapshotsTable);
    const peakEquityCents = peakRow?.peak_equity_cents ?? 0;
    const bots = await db
      .select()
      .from(fleetBotSnapshotsTable)
      .where(eq(fleetBotSnapshotsTable.snapshot_id, snapshot.id))
      .orderBy(asc(fleetBotSnapshotsTable.id));
    const ageMinutes = Math.floor(
      (Date.now() - snapshot.generated_at.getTime()) / 60_000,
    );
    const drawdownPct =
      peakEquityCents === 0
        ? 0
        : Number(
            (
              ((peakEquityCents - snapshot.total_equity_cents) /
                peakEquityCents) *
              100
            ).toFixed(2),
          );

    const response = GetProjectFinanceFleetLatestResponse.parse({
      ...toApiSnapshot(snapshot, bots),
      peak_equity_cents: peakEquityCents,
      drawdown_pct: drawdownPct,
      age_minutes: ageMinutes,
      stale: ageMinutes > 120,
      currency: "USD",
    });
    res.json(response);
  },
);

router.get(
  "/projects/finance/fleet/history",
  async (_req, res): Promise<void> => {
    const today = brisbaneDate(new Date());
    const startDay = addCalendarDays(today, -29);
    const rows = await db
      .select({
        generated_at: fleetSnapshotsTable.generated_at,
        total_equity_cents: fleetSnapshotsTable.total_equity_cents,
        total_pnl_cents: fleetSnapshotsTable.total_pnl_cents,
      })
      .from(fleetSnapshotsTable)
      .where(
        and(
          gte(
            fleetSnapshotsTable.generated_at,
            brisbaneMidnightUtc(startDay),
          ),
          lt(
            fleetSnapshotsTable.generated_at,
            brisbaneMidnightUtc(addCalendarDays(today, 1)),
          ),
        ),
      )
      .orderBy(asc(fleetSnapshotsTable.generated_at));

    const lastSnapshotByDay = new Map<
      string,
      (typeof rows)[number]
    >();
    for (const row of rows) {
      lastSnapshotByDay.set(brisbaneDate(row.generated_at), row);
    }
    const parsed = GetProjectFinanceFleetHistoryResponse.parse(
      Array.from(lastSnapshotByDay, ([day, row]) => ({
        day,
        total_equity_cents: row.total_equity_cents,
        total_pnl_cents: row.total_pnl_cents,
      })),
    );
    res.json(
      parsed.map((row) => ({
        ...row,
        day: row.day.toISOString().slice(0, 10),
      })),
    );
  },
);

export default router;
