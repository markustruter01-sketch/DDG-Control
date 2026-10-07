import {
  ListProjectMetricsResponse,
  RefreshProjectMetricsResponse,
} from "@workspace/api-zod";
import { db, metricSnapshotsTable, projectsTable } from "@workspace/db";
import {
  METRIC_DEFINITIONS,
  type MetricKey,
} from "@workspace/project-constants";
import { desc, eq } from "drizzle-orm";
import { Router, type IRouter } from "express";
import { logger } from "../lib/logger";

const router: IRouter = Router();
const DATA_SOURCE_SLUG = "cattle-dog-coffee";
const STRIPE_CHARGES_URL = "https://api.stripe.com/v1/charges";
const THIRTY_DAYS_SECONDS = 30 * 24 * 60 * 60;
const SEVEN_DAYS_SECONDS = 7 * 24 * 60 * 60;

type StripeCharge = {
  id: string;
  status: string;
  paid: boolean;
  currency: string;
  amount: number;
  amount_refunded: number;
  created: number;
  livemode: boolean;
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

  return {
    id: charge.id,
    status: charge.status,
    paid: charge.paid,
    currency: charge.currency,
    amount: charge.amount as number,
    amount_refunded: charge.amount_refunded as number,
    created: charge.created as number,
    livemode: charge.livemode,
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

function toApiMetric(row: typeof metricSnapshotsTable.$inferSelect) {
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
      .from(metricSnapshotsTable)
      .where(eq(metricSnapshotsTable.project_id, projectId))
      .orderBy(desc(metricSnapshotsTable.captured_at));

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

    const stripeKey = process.env.STRIPE_CDC_READ_KEY;
    if (!stripeKey) {
      res.status(503).json({ error: "stripe not configured" });
      return;
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
        res.status(502).json({ error: "stripe error 502" });
        return;
      }

      if (!stripeResponse.ok) {
        const error =
          stripeResponse.status === 401 || stripeResponse.status === 403
            ? "stripe auth failed"
            : `stripe error ${stripeResponse.status}`;
        res.status(502).json({ error });
        return;
      }

      let payload: unknown;
      try {
        payload = await stripeResponse.json();
      } catch {
        res.status(502).json({ error: "stripe error 502" });
        return;
      }

      const page = parseStripeChargePage(payload);
      if (!page || (page.has_more && page.data.length === 0)) {
        res.status(502).json({ error: "stripe error 502" });
        return;
      }

      pagesRead += 1;
      charges.push(...page.data);
      if (!page.has_more) {
        break;
      }

      startingAfter = page.data[page.data.length - 1]?.id;
      if (!startingAfter) {
        res.status(502).json({ error: "stripe error 502" });
        return;
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
      res.status(502).json({
        error: `non-AUD charges found: ${nonAudCharges.length}`,
      });
      return;
    }

    const sevenDayCharges = keptCharges.filter(
      (charge) => charge.created >= sevenDayStart,
    );
    const values = Object.entries(METRIC_DEFINITIONS).map(
      ([key, definition]) => {
        const periodCharges = key.endsWith("_7d")
          ? sevenDayCharges
          : keptCharges;
        const value =
          definition.unit === "aud_cents"
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

    const inserted = await db.transaction(async (tx) =>
      tx.insert(metricSnapshotsTable).values(values).returning(),
    );
    const response = inserted.map(toApiMetric);
    res.json(RefreshProjectMetricsResponse.parse(response));
  },
);

export default router;
