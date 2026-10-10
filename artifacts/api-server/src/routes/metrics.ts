import {
  ListProjectDailySalesResponse,
  ListProjectMetricHistoryResponse,
  ListProjectOllieHistoryResponse,
  ListProjectMetricsResponse,
  GetCattleDogCoffeeProfitResponse,
  RefreshProjectMetricsResponse,
} from "@workspace/api-zod";
import {
  agentProjectUpdatesTable,
  agentRunsTable,
  dailySalesTable,
  db,
  membersTable,
  metricSnapshotsV2Table,
  projectsTable,
} from "@workspace/db";
import {
  METRIC_DEFINITIONS,
  type MetricKey,
} from "@workspace/project-constants";
import { and, asc, desc, eq, gte, lte, sql } from "drizzle-orm";
import { Router, type IRouter } from "express";
import { logger } from "../lib/logger";
import { getCattleDogCoffeeProfit } from "../lib/cdc-store";

const router: IRouter = Router();
const DATA_SOURCE_SLUG = "cattle-dog-coffee";
const STRIPE_CHARGES_URL = "https://api.stripe.com/v1/charges";
const THIRTY_DAYS_SECONDS = 30 * 24 * 60 * 60;
const SEVEN_DAYS_SECONDS = 7 * 24 * 60 * 60;
const DAILY_SALES_DAYS = 30;

type StripeCharge = {
  id: string;
  status: string;
  paid: boolean;
  currency: string;
  amount: number;
  amount_refunded: number;
  created: number;
  livemode: boolean;
  buyerIdentifier: string | null;
};

type StripeChargePage = {
  data: StripeCharge[];
  has_more: boolean;
};

function parseStripeCharge(value: unknown): StripeCharge | null {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const charge = value as Record<string, unknown>;
  if (
    typeof charge.id !== "string" ||
    typeof charge.status !== "string" ||
    typeof charge.paid !== "boolean" ||
    typeof charge.currency !== "string" ||
    !Number.isSafeInteger(charge.amount) ||
    !Number.isSafeInteger(charge.amount_refunded) ||
    !Number.isSafeInteger(charge.created) ||
    typeof charge.livemode !== "boolean"
  ) {
    return null;
  }

  const billingDetails =
    charge.billing_details !== null &&
    typeof charge.billing_details === "object" &&
    !Array.isArray(charge.billing_details)
      ? (charge.billing_details as Record<string, unknown>)
      : null;
  const email =
    typeof billingDetails?.email === "string" &&
    billingDetails.email.trim().length > 0
      ? billingDetails.email.trim().toLowerCase()
      : null;
  const customer =
    typeof charge.customer === "string"
      ? charge.customer
      : charge.customer !== null &&
          typeof charge.customer === "object" &&
          !Array.isArray(charge.customer) &&
          typeof (charge.customer as Record<string, unknown>).id === "string"
        ? ((charge.customer as Record<string, unknown>).id as string)
        : null;

  return {
    id: charge.id,
    status: charge.status,
    paid: charge.paid,
    currency: charge.currency,
    amount: charge.amount as number,
    amount_refunded: charge.amount_refunded as number,
    created: charge.created as number,
    livemode: charge.livemode,
    buyerIdentifier: email ?? (customer && customer.length > 0 ? customer : null),
  };
}

function parseStripeChargePage(value: unknown): StripeChargePage | null {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const page = value as Record<string, unknown>;
  if (!Array.isArray(page.data) || typeof page.has_more !== "boolean") {
    return null;
  }

  const data: StripeCharge[] = [];
  for (const item of page.data) {
    const charge = parseStripeCharge(item);
    if (!charge) {
      return null;
    }
    data.push(charge);
  }

  return { data, has_more: page.has_more };
}

async function findProjectId(slug: string): Promise<number | null> {
  const [project] = await db
    .select({ id: projectsTable.id })
    .from(projectsTable)
    .where(eq(projectsTable.slug, slug))
    .limit(1);

  return project?.id ?? null;
}

class MetricsRefreshError extends Error {
  constructor(
    readonly httpStatus: number,
    readonly response: { error: string },
  ) {
    super(response.error);
  }
}

function brisbaneDate(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Australia/Brisbane",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function lastBrisbaneSalesDays(today = brisbaneDate(new Date())): string[] {
  const [year, month, day] = today.split("-").map(Number);
  return Array.from({ length: DAILY_SALES_DAYS }, (_, index) =>
    new Date(Date.UTC(year!, month! - 1, day! - DAILY_SALES_DAYS + 1 + index))
      .toISOString()
      .slice(0, 10),
  );
}

function toApiMetric(row: typeof metricSnapshotsV2Table.$inferSelect) {
  const definition = METRIC_DEFINITIONS[row.key as MetricKey];
  if (!definition) {
    throw new Error(`Metric snapshot "${row.id}" has an invalid key`);
  }

  return {
    key: row.key,
    value: row.value,
    unit: definition.unit,
    label: definition.label,
    source: row.source,
    captured_at: row.captured_at.toISOString(),
  };
}

router.get(
  "/projects/:slug/metrics",
  async (req, res): Promise<void> => {
    const projectId = await findProjectId(req.params.slug);
    if (projectId === null) {
      res.status(404).json({ error: "not found" });
      return;
    }

    const rows = await db
      .select()
      .from(metricSnapshotsV2Table)
      .where(eq(metricSnapshotsV2Table.project_id, projectId))
      .orderBy(desc(metricSnapshotsV2Table.captured_at));

    const latestByKey = new Map<string, (typeof rows)[number]>();
    for (const row of rows) {
      if (!latestByKey.has(row.key)) {
        latestByKey.set(row.key, row);
      }
    }

    const response = Object.entries(METRIC_DEFINITIONS).flatMap(([key]) => {
      const row = latestByKey.get(key);
      return row ? [toApiMetric(row)] : [];
    });

    res.json(ListProjectMetricsResponse.parse(response));
  },
);

export async function refreshCattleDogMetrics() {
  const projectId = await findProjectId(DATA_SOURCE_SLUG);
  if (projectId === null) {
    throw new MetricsRefreshError(404, { error: "not found" });
  }

  const stripeKey = process.env.STRIPE_CDC_READ_KEY;
  if (!stripeKey) {
    throw new MetricsRefreshError(503, { error: "stripe not configured" });
  }

  const nowSeconds = Math.floor(Date.now() / 1000);
  const thirtyDayStart = nowSeconds - THIRTY_DAYS_SECONDS;
  const sevenDayStart = nowSeconds - SEVEN_DAYS_SECONDS;
  const charges: StripeCharge[] = [];
  let pagesRead = 0;
  let startingAfter: string | undefined;

  while (true) {
    const url = new URL(STRIPE_CHARGES_URL);
    url.searchParams.set("created[gte]", String(thirtyDayStart));
    url.searchParams.set("limit", "100");
    if (startingAfter) {
      url.searchParams.set("starting_after", startingAfter);
    }

    let stripeResponse: Response;
    try {
      stripeResponse = await fetch(url, {
        method: "GET",
        headers: { Authorization: `Bearer ${stripeKey}` },
        signal: AbortSignal.timeout(15_000),
      });
    } catch {
      throw new MetricsRefreshError(502, { error: "stripe error 502" });
    }

    if (!stripeResponse.ok) {
      const error =
        stripeResponse.status === 401 || stripeResponse.status === 403
          ? "stripe auth failed"
          : `stripe error ${stripeResponse.status}`;
      throw new MetricsRefreshError(502, { error });
    }

    let payload: unknown;
    try {
      payload = await stripeResponse.json();
    } catch {
      throw new MetricsRefreshError(502, { error: "stripe error 502" });
    }

    const page = parseStripeChargePage(payload);
    if (!page || (page.has_more && page.data.length === 0)) {
      throw new MetricsRefreshError(502, { error: "stripe error 502" });
    }

    pagesRead += 1;
    charges.push(...page.data);
    if (!page.has_more) {
      break;
    }

    startingAfter = page.data[page.data.length - 1]?.id;
    if (!startingAfter) {
      throw new MetricsRefreshError(502, { error: "stripe error 502" });
    }
  }

  const keptCharges = charges.filter(
    (charge) => charge.status === "succeeded" && charge.paid,
  );
  const nonAudCharges = keptCharges.filter(
    (charge) => charge.currency !== "aud",
  );
  const livemode = charges[0]?.livemode ?? null;

  logger.info(
    {
      stripe_pages_read: pagesRead,
      stripe_charges_seen: charges.length,
      stripe_charges_kept: keptCharges.length,
      stripe_livemode: livemode,
    },
    "Stripe metrics refresh read complete",
  );

  if (nonAudCharges.length > 0) {
    throw new MetricsRefreshError(502, {
      error: `non-AUD charges found: ${nonAudCharges.length}`,
    });
  }

  const sevenDayCharges = keptCharges.filter(
    (charge) => charge.created >= sevenDayStart,
  );
  const buyerChargeCounts = new Map<string, number>();
  for (const charge of keptCharges) {
    if (
      charge.amount - charge.amount_refunded > 0 &&
      charge.buyerIdentifier !== null
    ) {
      buyerChargeCounts.set(
        charge.buyerIdentifier,
        (buyerChargeCounts.get(charge.buyerIdentifier) ?? 0) + 1,
      );
    }
  }

  const today = brisbaneDate(new Date());
  const salesDays = lastBrisbaneSalesDays(today);
  const salesByDay = new Map(
    salesDays.map((day) => [day, { sales_cents: 0, orders: 0 }]),
  );
  for (const charge of keptCharges) {
    const day = brisbaneDate(new Date(charge.created * 1000));
    const totals = salesByDay.get(day);
    if (!totals) {
      continue;
    }
    const netAmount = charge.amount - charge.amount_refunded;
    totals.sales_cents += netAmount;
    if (netAmount > 0) {
      totals.orders += 1;
    }
  }

  const dailySalesValues = salesDays.map((day) => ({
    project_id: projectId,
    day,
    sales_cents: salesByDay.get(day)!.sales_cents,
    orders: salesByDay.get(day)!.orders,
  }));
  const values = Object.entries(METRIC_DEFINITIONS).map(
    ([key, definition]) => {
      const periodCharges = key.endsWith("_7d") ? sevenDayCharges : keptCharges;
      const value =
        key === "customers_30d"
          ? buyerChargeCounts.size
          : key === "repeat_customers_30d"
            ? [...buyerChargeCounts.values()].filter((count) => count >= 2)
                .length
            : definition.unit === "aud_cents"
              ? periodCharges.reduce(
                  (total, charge) =>
                    total + charge.amount - charge.amount_refunded,
                  0,
                )
              : periodCharges.reduce(
                  (total, charge) =>
                    total +
                    (charge.amount - charge.amount_refunded > 0 ? 1 : 0),
                  0,
                );

      return {
        project_id: projectId,
        key: key as MetricKey,
        value,
        source: "stripe",
      };
    },
  );

  for (const metric of values) {
    if (!Object.hasOwn(METRIC_DEFINITIONS, metric.key)) {
      throw new Error(`Invalid metric key: ${metric.key}`);
    }
  }

  const inserted = await db.transaction(async (tx) => {
    await tx
      .insert(dailySalesTable)
      .values(dailySalesValues)
      .onConflictDoUpdate({
        target: [dailySalesTable.project_id, dailySalesTable.day],
        set: {
          sales_cents: sql`excluded.sales_cents`,
          orders: sql`excluded.orders`,
          updated_at: sql`now()`,
        },
      });
    return tx.insert(metricSnapshotsV2Table).values(values).returning();
  });
  return inserted.map(toApiMetric);
}

router.get(
  "/projects/cattle-dog-coffee/profit",
  async (_req, res): Promise<void> => {
    const result = await getCattleDogCoffeeProfit();
    if (!result.ok) {
      res.status(result.status).json({ error: result.error });
      return;
    }

    res.json(result.data);
  },
);

router.get(
  "/projects/:slug/daily-sales",
  async (req, res): Promise<void> => {
    const projectId = await findProjectId(req.params.slug);
    if (projectId === null) {
      res.status(404).json({ error: "not found" });
      return;
    }

    const days = lastBrisbaneSalesDays();
    const rows = await db
      .select({
        day: dailySalesTable.day,
        sales_cents: dailySalesTable.sales_cents,
        orders: dailySalesTable.orders,
      })
      .from(dailySalesTable)
      .where(
        and(
          eq(dailySalesTable.project_id, projectId),
          gte(dailySalesTable.day, days[0]!),
          lte(dailySalesTable.day, days[days.length - 1]!),
        ),
      )
      .orderBy(asc(dailySalesTable.day));
    const byDay = new Map(rows.map((row) => [row.day, row]));
    const response = days.map((day) => {
      const row = byDay.get(day);
      return {
        day,
        sales_cents: row?.sales_cents ?? 0,
        orders: row?.orders ?? 0,
      };
    });

    const validated = ListProjectDailySalesResponse.parse(response);
    res.json(
      validated.map((row) => ({
        ...row,
        day: row.day.toISOString().slice(0, 10),
      })),
    );
  },
);

router.get(
  "/projects/:slug/metrics/history",
  async (req, res): Promise<void> => {
    const projectId = await findProjectId(req.params.slug);
    if (projectId === null) {
      res.status(404).json({ error: "not found" });
      return;
    }
    const key =
      typeof req.query.key === "string" ? req.query.key : undefined;
    if (!key || !METRIC_DEFINITIONS[key as MetricKey]) {
      res.status(400).json({ error: "invalid metric key" });
      return;
    }

    const rows = await db
      .select({
        value: metricSnapshotsV2Table.value,
        captured_at: metricSnapshotsV2Table.captured_at,
        id: metricSnapshotsV2Table.id,
      })
      .from(metricSnapshotsV2Table)
      .where(
        and(
          eq(metricSnapshotsV2Table.project_id, projectId),
          eq(metricSnapshotsV2Table.key, key),
        ),
      )
      .orderBy(
        desc(metricSnapshotsV2Table.captured_at),
        desc(metricSnapshotsV2Table.id),
      )
      .limit(90);
    const response = rows
      .reverse()
      .map(({ value, captured_at }) => ({
        value,
        captured_at: captured_at.toISOString(),
      }));

    res.json(ListProjectMetricHistoryResponse.parse(response));
  },
);

router.get(
  "/projects/:slug/ollie-history",
  async (req, res): Promise<void> => {
    const projectId = await findProjectId(req.params.slug);
    if (projectId === null) {
      res.status(404).json({ error: "not found" });
      return;
    }

    const rows = await db
      .select({
        id: agentProjectUpdatesTable.id,
        created_at: agentProjectUpdatesTable.created_at,
        status_light: agentProjectUpdatesTable.status_light,
        priority: agentProjectUpdatesTable.priority,
      })
      .from(agentProjectUpdatesTable)
      .innerJoin(
        agentRunsTable,
        eq(agentProjectUpdatesTable.run_id, agentRunsTable.id),
      )
      .innerJoin(membersTable, eq(agentRunsTable.member_id, membersTable.id))
      .where(
        and(
          eq(agentProjectUpdatesTable.project_id, projectId),
          eq(membersTable.name, "Ollie"),
        ),
      )
      .orderBy(
        sql`${agentProjectUpdatesTable.created_at} DESC NULLS LAST`,
        desc(agentProjectUpdatesTable.id),
      )
      .limit(30);
    const response = rows
      .reverse()
      .map(({ created_at, status_light, priority }) => ({
        created_at: created_at?.toISOString() ?? null,
        status_light,
        priority,
      }));

    res.json(ListProjectOllieHistoryResponse.parse(response));
  },
);

router.post(
  "/projects/:slug/metrics/refresh",
  async (req, res): Promise<void> => {
    const projectId = await findProjectId(req.params.slug);
    if (projectId === null) {
      res.status(404).json({ error: "not found" });
      return;
    }
    if (req.params.slug !== DATA_SOURCE_SLUG) {
      res.status(400).json({ error: "no data source yet" });
      return;
    }

    try {
      const response = await refreshCattleDogMetrics();
      res.json(RefreshProjectMetricsResponse.parse(response));
    } catch (error) {
      if (error instanceof MetricsRefreshError) {
        res.status(error.httpStatus).json(error.response);
        return;
      }
      throw error;
    }
  },
);

export default router;
