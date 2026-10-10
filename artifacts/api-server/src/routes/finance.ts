import {
  CreateFinanceDebtBody,
  CreateFinanceDebtResponse,
  CreateFinanceExpenseBody,
  CreateFinanceExpenseResponse,
  CreateFinanceRevenueBody,
  CreateFinanceRevenueResponse,
  DeleteFinanceDebtResponse,
  DeleteFinanceExpenseResponse,
  DeleteFinanceRevenueResponse,
  GetFinanceSummaryResponse,
  ListFinanceDebtsResponse,
  ListFinanceExpensesResponse,
  ListFinanceRevenueResponse,
  UpdateFinanceDebtBody,
  UpdateFinanceDebtResponse,
  UpdateFinanceExpenseBody,
  UpdateFinanceExpenseResponse,
  UpdateFinanceRevenueBody,
  UpdateFinanceRevenueResponse,
} from "@workspace/api-zod";
import {
  db,
  debtsTable,
  expensesTable,
  metricSnapshotsV2Table,
  projectsTable,
  revenueEntriesTable,
} from "@workspace/db";
import { EXPENSE_KINDS } from "@workspace/project-constants";
import { and, asc, desc, eq, gte, inArray, lte } from "drizzle-orm";
import { Router, type IRouter, type Request, type Response } from "express";
import {
  getMissingRequiredFieldError,
  getUnknownFieldError,
  isCalendarDate,
  requestBodyRecord,
  validateCalendarDate,
  type ValidationResult,
  zodErrorText,
} from "./validation";
import {
  getCattleDogCoffeeProfit,
  type CattleDogCoffeeProfitResult,
} from "../lib/cdc-store";

const router: IRouter = Router();
type ExpenseKind = (typeof EXPENSE_KINDS)[number];
type FinanceCreateResult<T> =
  | { status: 200 | 201; data: T }
  | { status: 400 | 500; error: string };

const DEBT_FIELDS = ["project_slug", "name", "balance_cents", "note"] as const;
const EXPENSE_FIELDS = [
  "project_slug",
  "name",
  "kind",
  "amount_cents",
  "spent_on",
  "active",
  "note",
] as const;
const REVENUE_FIELDS = [
  "project_slug",
  "name",
  "amount_cents",
  "received_on",
  "note",
] as const;

const FINANCE_SUMMARY_NOTES = [
  "Recurring monthly costs count in full in the last 30 days.",
  "Next-month revenue is an estimate based on the last 30 days.",
  "Cattle Dog Coffee figures are from the store (all sales incl. in-person; profit after coffee, satchels, Stripe fees and RSPCA).",
] as const;

export function calculateFinanceSourceTotals({
  projects,
  revenueRows,
  recurringExpenseRows,
  oneOffExpenseRows,
  storeResult,
}: {
  projects: { id: number; slug: string }[];
  revenueRows: { project_id: number | null; amount_cents: bigint }[];
  recurringExpenseRows: { amount_cents: bigint }[];
  oneOffExpenseRows: { amount_cents: bigint }[];
  storeResult: CattleDogCoffeeProfitResult;
}) {
  const coffeeProject = projects.find(
    (project) => project.slug === "cattle-dog-coffee",
  );
  const validStoreProfit =
    storeResult.ok && storeResult.data.last30d.netProfitCents !== null;
  const cdcStoreRevenueCents = validStoreProfit
    ? BigInt(storeResult.data.last30d.grossRevenueCents)
    : 0n;
  const cdcStoreProfitCents = validStoreProfit
    ? BigInt(storeResult.data.last30d.netProfitCents!)
    : 0n;
  const otherManualRevenueRows = revenueRows.filter(
    (row) => !coffeeProject || row.project_id !== coffeeProject.id,
  );
  const otherManualRevenueCents = sumBigInts(
    otherManualRevenueRows.map((row) => row.amount_cents),
  );
  const recurringMonthlyCents = sumBigInts(
    recurringExpenseRows.map((row) => row.amount_cents),
  );
  const oneOff30dCents = sumBigInts(
    oneOffExpenseRows.map((row) => row.amount_cents),
  );
  const revenue30dCents = cdcStoreRevenueCents + otherManualRevenueCents;
  const expenses30dCents = recurringMonthlyCents + oneOff30dCents;
  const profit30dCents = cdcStoreProfitCents +
    otherManualRevenueCents - expenses30dCents;
  const otherProjectRevenueIds = new Set(
    otherManualRevenueRows.flatMap((row) =>
      row.project_id === null ? [] : [row.project_id],
    ),
  );
  const venturesWithoutRevenueSource = projects
    .filter(
      (project) =>
        (project.slug === "cattle-dog-coffee" && !validStoreProfit) ||
        (project.slug !== "cattle-dog-coffee" &&
          !otherProjectRevenueIds.has(project.id)),
    )
    .map((project) => project.slug);
  const notes = [...FINANCE_SUMMARY_NOTES];
  notes.push(
    "Cattle Dog Coffee figures are from the store (all sales incl. in-person; profit after coffee, satchels, Stripe fees and RSPCA).",
  );
  if (!validStoreProfit) {
    const error = storeResult.ok
      ? "net profit unavailable"
      : storeResult.error;
    notes.push(`Cattle Dog Coffee store figures unavailable: ${error}`);
  }

  return {
    revenue30dCents,
    expenses30dCents,
    profit30dCents,
    recurringMonthlyCents,
    venturesWithoutRevenueSource,
    notes,
  };
}

type ProjectReference = {
  project_id: number | null;
  project_slug: string | null;
};

type ApiFinanceRow = {
  id: number;
  project_slug: string | null;
  name: string;
  note: string | null;
  created_at: Date;
};

type ApiDebtRow = ApiFinanceRow & {
  balance_cents: bigint;
  updated_at: Date;
};

type ApiExpenseRow = ApiFinanceRow & {
  kind: string;
  amount_cents: bigint;
  spent_on: string | null;
  active: boolean;
  updated_at: Date;
};

type ApiRevenueRow = ApiFinanceRow & {
  amount_cents: bigint;
  received_on: string;
};

function requestBody(
  req: Request,
  res: Response,
  allowedFields: readonly string[],
  requiredFields: readonly string[],
  isPatch = false,
): Record<string, unknown> | null {
  const body = requestBodyRecord(req.body);
  if (!body) {
    res.status(400).json({ error: "request body must be an object" });
    return null;
  }

  const unknownFieldError = getUnknownFieldError(body, allowedFields);
  if (unknownFieldError) {
    res.status(400).json({ error: unknownFieldError });
    return null;
  }

  if (isPatch && Object.keys(body).length === 0) {
    res.status(400).json({ error: "nothing to update" });
    return null;
  }

  const requiredFieldError = getMissingRequiredFieldError(body, requiredFields);
  if (requiredFieldError) {
    res.status(400).json({ error: requiredFieldError });
    return null;
  }

  return body;
}

function parseFinanceId(
  rawId: string | string[] | undefined,
): number | null {
  const value = Array.isArray(rawId) ? rawId[0] : rawId;
  if (!value || !/^[1-9]\d*$/.test(value)) {
    return null;
  }
  const id = Number(value);
  return Number.isSafeInteger(id) && id <= 2_147_483_647 ? id : null;
}

function validateName(value: unknown): ValidationResult<string> {
  if (typeof value !== "string") {
    return { error: "name must be a string" };
  }
  const name = value.trim();
  const length = Array.from(name).length;
  if (length < 1 || length > 100) {
    return { error: "name must be 1 to 100 characters after trimming" };
  }
  return { value: name };
}

function validateNote(value: unknown): ValidationResult<string | null> {
  if (value !== null && typeof value !== "string") {
    return { error: "note must be a string or null" };
  }
  if (typeof value === "string" && Array.from(value).length > 300) {
    return { error: "note must not exceed 300 characters" };
  }
  return { value: value as string | null };
}

function validateCents(
  value: unknown,
  fieldName: string,
  minimum: number,
): ValidationResult<number> {
  if (
    typeof value !== "number" ||
    !Number.isSafeInteger(value) ||
    value < minimum
  ) {
    return {
      error: `${fieldName} must be a whole number of cents greater than or equal to ${minimum}`,
    };
  }
  return { value };
}

function validateRequiredDate(
  value: unknown,
  fieldName: string,
): ValidationResult<string> {
  const dateValue = validateCalendarDate(value, fieldName);
  if ("error" in dateValue) {
    return { error: dateValue.error };
  }
  if (dateValue.value === null) {
    return { error: `${fieldName} is required` };
  }
  return { value: dateValue.value };
}

async function resolveProjectReference(
  value: unknown,
): Promise<ValidationResult<ProjectReference>> {
  if (value === null) {
    return { value: { project_id: null, project_slug: null } };
  }
  if (typeof value !== "string") {
    return { error: "project_slug must be a string or null" };
  }

  const [project] = await db
    .select({ id: projectsTable.id, slug: projectsTable.slug })
    .from(projectsTable)
    .where(eq(projectsTable.slug, value))
    .limit(1);
  if (!project) {
    return { error: "unknown project" };
  }

  return {
    value: { project_id: project.id, project_slug: project.slug },
  };
}

function expenseKindIsValid(value: unknown): value is ExpenseKind {
  return (
    typeof value === "string" &&
    EXPENSE_KINDS.includes(value as ExpenseKind)
  );
}

function validateExpenseDatePair(
  kind: ExpenseKind,
  spentOn: string | null,
): string | null {
  if (kind === "one_off" && spentOn === null) {
    return "spent_on is required for one_off expenses";
  }
  if (kind === "recurring_monthly" && spentOn !== null) {
    return "spent_on must be null for recurring_monthly expenses";
  }
  return null;
}

function apiCents(value: bigint, fieldName: string): number {
  const numberValue = Number(value);
  if (!Number.isSafeInteger(numberValue)) {
    throw new Error(`${fieldName} exceeds the safe integer range`);
  }
  return numberValue;
}

function toApiDebt(row: ApiDebtRow) {
  return {
    id: row.id,
    project_slug: row.project_slug,
    name: row.name,
    balance_cents: apiCents(row.balance_cents, "balance_cents"),
    note: row.note,
    created_at: row.created_at.toISOString(),
    updated_at: row.updated_at.toISOString(),
  };
}

function toApiExpense(row: ApiExpenseRow) {
  return {
    id: row.id,
    project_slug: row.project_slug,
    name: row.name,
    kind: row.kind,
    amount_cents: apiCents(row.amount_cents, "amount_cents"),
    spent_on: row.spent_on,
    active: row.active,
    note: row.note,
    created_at: row.created_at.toISOString(),
    updated_at: row.updated_at.toISOString(),
  };
}

function toApiRevenue(row: ApiRevenueRow) {
  return {
    id: row.id,
    project_slug: row.project_slug,
    name: row.name,
    amount_cents: apiCents(row.amount_cents, "amount_cents"),
    received_on: row.received_on,
    note: row.note,
    created_at: row.created_at.toISOString(),
  };
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

function subtractCalendarDays(dateOnly: string, days: number): string {
  const [year, month, day] = dateOnly.split("-").map(Number);
  return new Date(Date.UTC(year!, month! - 1, day! - days))
    .toISOString()
    .slice(0, 10);
}

function sumBigInts(values: readonly bigint[]): bigint {
  return values.reduce((total, value) => total + value, 0n);
}

function safeMetricInteger(value: number, fieldName: string): number {
  if (!Number.isSafeInteger(value)) {
    throw new Error(`${fieldName} exceeds the safe integer range`);
  }
  return value;
}

router.get("/finance/debts", async (_req, res): Promise<void> => {
  const rows = await db
    .select({
      id: debtsTable.id,
      project_id: debtsTable.project_id,
      project_slug: projectsTable.slug,
      name: debtsTable.name,
      balance_cents: debtsTable.balance_cents,
      note: debtsTable.note,
      created_at: debtsTable.created_at,
      updated_at: debtsTable.updated_at,
    })
    .from(debtsTable)
    .leftJoin(projectsTable, eq(debtsTable.project_id, projectsTable.id))
    .orderBy(asc(debtsTable.id));
  const response = rows.map(toApiDebt);
  ListFinanceDebtsResponse.parse(response);
  res.json(response);
});

router.post("/finance/debts", async (req, res): Promise<void> => {
  const body = requestBody(req, res, DEBT_FIELDS, [
    "project_slug",
    "name",
    "balance_cents",
  ]);
  if (!body) return;

  const name = validateName(body.name);
  if ("error" in name) {
    res.status(400).json({ error: name.error });
    return;
  }
  const balance = validateCents(body.balance_cents, "balance_cents", 0);
  if ("error" in balance) {
    res.status(400).json({ error: balance.error });
    return;
  }
  const note = validateNote(body.note ?? null);
  if ("error" in note) {
    res.status(400).json({ error: note.error });
    return;
  }
  const project = await resolveProjectReference(body.project_slug);
  if ("error" in project) {
    res.status(400).json({ error: project.error });
    return;
  }

  const parsedBody = CreateFinanceDebtBody.safeParse({
    ...body,
    name: name.value,
    balance_cents: balance.value,
    note: note.value,
  });
  if (!parsedBody.success) {
    res.status(400).json({ error: zodErrorText(parsedBody.error) });
    return;
  }

  const [created] = await db
    .insert(debtsTable)
    .values({
      project_id: project.value.project_id,
      name: name.value,
      balance_cents: BigInt(balance.value),
      note: note.value,
    })
    .returning();
  if (!created) {
    res.status(500).json({ error: "unable to create debt" });
    return;
  }

  const response = toApiDebt({
    ...created,
    project_slug: project.value.project_slug,
  });
  CreateFinanceDebtResponse.parse(response);
  res.status(201).json(response);
});

router.patch("/finance/debts/:id", async (req, res): Promise<void> => {
  const id = parseFinanceId(req.params.id);
  if (id === null) {
    res.status(400).json({ error: "invalid finance entry id" });
    return;
  }

  const [existing] = await db
    .select({
      id: debtsTable.id,
      project_id: debtsTable.project_id,
      project_slug: projectsTable.slug,
      name: debtsTable.name,
      balance_cents: debtsTable.balance_cents,
      note: debtsTable.note,
      created_at: debtsTable.created_at,
      updated_at: debtsTable.updated_at,
    })
    .from(debtsTable)
    .leftJoin(projectsTable, eq(debtsTable.project_id, projectsTable.id))
    .where(eq(debtsTable.id, id))
    .limit(1);
  if (!existing) {
    res.status(404).json({ error: "not found" });
    return;
  }

  const body = requestBody(req, res, DEBT_FIELDS, [], true);
  if (!body) return;
  const fields: Partial<typeof debtsTable.$inferInsert> = {};
  let projectSlug = existing.project_slug;
  const normalizedBody = { ...body };

  if (Object.hasOwn(body, "project_slug")) {
    const project = await resolveProjectReference(body.project_slug);
    if ("error" in project) {
      res.status(400).json({ error: project.error });
      return;
    }
    fields.project_id = project.value.project_id;
    projectSlug = project.value.project_slug;
  }
  if (Object.hasOwn(body, "name")) {
    const name = validateName(body.name);
    if ("error" in name) {
      res.status(400).json({ error: name.error });
      return;
    }
    fields.name = name.value;
    normalizedBody.name = name.value;
  }
  if (Object.hasOwn(body, "balance_cents")) {
    const balance = validateCents(body.balance_cents, "balance_cents", 0);
    if ("error" in balance) {
      res.status(400).json({ error: balance.error });
      return;
    }
    fields.balance_cents = BigInt(balance.value);
    normalizedBody.balance_cents = balance.value;
  }
  if (Object.hasOwn(body, "note")) {
    const note = validateNote(body.note);
    if ("error" in note) {
      res.status(400).json({ error: note.error });
      return;
    }
    fields.note = note.value;
  }

  const parsedBody = UpdateFinanceDebtBody.safeParse(normalizedBody);
  if (!parsedBody.success) {
    res.status(400).json({ error: zodErrorText(parsedBody.error) });
    return;
  }
  const [updated] = await db
    .update(debtsTable)
    .set({ ...fields, updated_at: new Date() })
    .where(eq(debtsTable.id, id))
    .returning();
  if (!updated) {
    res.status(404).json({ error: "not found" });
    return;
  }
  const response = toApiDebt({ ...updated, project_slug: projectSlug });
  UpdateFinanceDebtResponse.parse(response);
  res.json(response);
});

router.delete("/finance/debts/:id", async (req, res): Promise<void> => {
  const id = parseFinanceId(req.params.id);
  if (id === null) {
    res.status(400).json({ error: "invalid finance entry id" });
    return;
  }
  const deleted = await db
    .delete(debtsTable)
    .where(eq(debtsTable.id, id))
    .returning({ id: debtsTable.id });
  if (deleted.length === 0) {
    res.status(404).json({ error: "not found" });
    return;
  }
  res.json(DeleteFinanceDebtResponse.parse({ ok: true }));
});

router.get("/finance/expenses", async (_req, res): Promise<void> => {
  const rows = await db
    .select({
      id: expensesTable.id,
      project_id: expensesTable.project_id,
      project_slug: projectsTable.slug,
      name: expensesTable.name,
      kind: expensesTable.kind,
      amount_cents: expensesTable.amount_cents,
      spent_on: expensesTable.spent_on,
      active: expensesTable.active,
      note: expensesTable.note,
      created_at: expensesTable.created_at,
      updated_at: expensesTable.updated_at,
    })
    .from(expensesTable)
    .leftJoin(projectsTable, eq(expensesTable.project_id, projectsTable.id))
    .orderBy(asc(expensesTable.id));
  const response = rows.map(toApiExpense);
  ListFinanceExpensesResponse.parse(response);
  res.json(response);
});

export async function createExpense(
  input: unknown,
  idempotencyKey?: string,
): Promise<FinanceCreateResult<ReturnType<typeof toApiExpense>>> {
  const getExisting = async () => {
    if (idempotencyKey === undefined) return null;
    const [existing] = await db
      .select({
        id: expensesTable.id,
        project_slug: projectsTable.slug,
        name: expensesTable.name,
        kind: expensesTable.kind,
        amount_cents: expensesTable.amount_cents,
        spent_on: expensesTable.spent_on,
        active: expensesTable.active,
        note: expensesTable.note,
        created_at: expensesTable.created_at,
        updated_at: expensesTable.updated_at,
      })
      .from(expensesTable)
      .leftJoin(projectsTable, eq(expensesTable.project_id, projectsTable.id))
      .where(eq(expensesTable.idempotency_key, idempotencyKey))
      .limit(1);
    return existing ? toApiExpense(existing) : null;
  };

  const existing = await getExisting();
  if (existing) {
    CreateFinanceExpenseResponse.parse(existing);
    return { status: 200, data: existing };
  }

  const body = requestBodyRecord(input);
  if (!body) return { status: 400, error: "request body must be an object" };
  const unknownFieldError = getUnknownFieldError(body, EXPENSE_FIELDS);
  if (unknownFieldError) return { status: 400, error: unknownFieldError };
  const requiredFieldError = getMissingRequiredFieldError(body, [
    "project_slug",
    "name",
    "kind",
    "amount_cents",
    "spent_on",
  ]);
  if (requiredFieldError) return { status: 400, error: requiredFieldError };

  const name = validateName(body.name);
  if ("error" in name) {
    return { status: 400, error: name.error };
  }
  if (!expenseKindIsValid(body.kind)) {
    return { status: 400, error: "invalid expense kind" };
  }
  const amount = validateCents(body.amount_cents, "amount_cents", 1);
  if ("error" in amount) {
    return { status: 400, error: amount.error };
  }
  const spentOn = validateCalendarDate(body.spent_on, "spent_on");
  if ("error" in spentOn) {
    return { status: 400, error: spentOn.error };
  }
  const dateError = validateExpenseDatePair(body.kind, spentOn.value);
  if (dateError) {
    return { status: 400, error: dateError };
  }
  const active =
    body.active === undefined
      ? true
      : typeof body.active === "boolean"
        ? body.active
        : null;
  if (active === null) {
    return { status: 400, error: "active must be a boolean" };
  }
  const note = validateNote(body.note ?? null);
  if ("error" in note) {
    return { status: 400, error: note.error };
  }
  const project = await resolveProjectReference(body.project_slug);
  if ("error" in project) {
    return { status: 400, error: project.error };
  }

  const normalizedBody = {
    ...body,
    name: name.value,
    amount_cents: amount.value,
    spent_on: spentOn.value,
    active,
    note: note.value,
  };
  const parsedBody = CreateFinanceExpenseBody.safeParse(normalizedBody);
  if (!parsedBody.success) {
    return { status: 400, error: zodErrorText(parsedBody.error) };
  }

  const values = {
    project_id: project.value.project_id,
    name: name.value,
    kind: body.kind,
    amount_cents: BigInt(amount.value),
    spent_on: spentOn.value,
    active,
    note: note.value,
    idempotency_key: idempotencyKey ?? null,
  };
  let created: typeof expensesTable.$inferSelect | undefined;
  if (idempotencyKey === undefined) {
    [created] = await db.insert(expensesTable).values(values).returning();
  } else {
    [created] = await db
      .insert(expensesTable)
      .values(values)
      .onConflictDoNothing({ target: expensesTable.idempotency_key })
      .returning();
  }
  if (!created && idempotencyKey !== undefined) {
    const conflictRow = await getExisting();
    if (conflictRow) {
      CreateFinanceExpenseResponse.parse(conflictRow);
      return { status: 200, data: conflictRow };
    }
  }
  if (!created) {
    return { status: 500, error: "unable to create expense" };
  }
  const response = toApiExpense({
    ...created,
    project_slug: project.value.project_slug,
  });
  CreateFinanceExpenseResponse.parse(response);
  return { status: 201, data: response };
}

router.post("/finance/expenses", async (req, res): Promise<void> => {
  const result = await createExpense(req.body);
  if ("error" in result) {
    res.status(result.status).json({ error: result.error });
    return;
  }
  res.status(result.status).json(result.data);
});

router.patch("/finance/expenses/:id", async (req, res): Promise<void> => {
  const id = parseFinanceId(req.params.id);
  if (id === null) {
    res.status(400).json({ error: "invalid finance entry id" });
    return;
  }
  const [existing] = await db
    .select({
      id: expensesTable.id,
      project_id: expensesTable.project_id,
      project_slug: projectsTable.slug,
      name: expensesTable.name,
      kind: expensesTable.kind,
      amount_cents: expensesTable.amount_cents,
      spent_on: expensesTable.spent_on,
      active: expensesTable.active,
      note: expensesTable.note,
      created_at: expensesTable.created_at,
      updated_at: expensesTable.updated_at,
    })
    .from(expensesTable)
    .leftJoin(projectsTable, eq(expensesTable.project_id, projectsTable.id))
    .where(eq(expensesTable.id, id))
    .limit(1);
  if (!existing) {
    res.status(404).json({ error: "not found" });
    return;
  }
  const body = requestBody(req, res, EXPENSE_FIELDS, [], true);
  if (!body) return;

  const fields: Partial<typeof expensesTable.$inferInsert> = {};
  const normalizedBody = { ...body };
  let projectSlug = existing.project_slug;
  let kind: ExpenseKind = existing.kind as ExpenseKind;
  let spentOn = existing.spent_on;

  if (Object.hasOwn(body, "project_slug")) {
    const project = await resolveProjectReference(body.project_slug);
    if ("error" in project) {
      res.status(400).json({ error: project.error });
      return;
    }
    fields.project_id = project.value.project_id;
    projectSlug = project.value.project_slug;
  }
  if (Object.hasOwn(body, "name")) {
    const name = validateName(body.name);
    if ("error" in name) {
      res.status(400).json({ error: name.error });
      return;
    }
    fields.name = name.value;
    normalizedBody.name = name.value;
  }
  if (Object.hasOwn(body, "kind")) {
    if (!expenseKindIsValid(body.kind)) {
      res.status(400).json({ error: "invalid expense kind" });
      return;
    }
    kind = body.kind;
    fields.kind = kind;
  }
  if (Object.hasOwn(body, "amount_cents")) {
    const amount = validateCents(body.amount_cents, "amount_cents", 1);
    if ("error" in amount) {
      res.status(400).json({ error: amount.error });
      return;
    }
    fields.amount_cents = BigInt(amount.value);
    normalizedBody.amount_cents = amount.value;
  }
  if (Object.hasOwn(body, "spent_on")) {
    const validatedDate = validateCalendarDate(body.spent_on, "spent_on");
    if ("error" in validatedDate) {
      res.status(400).json({ error: validatedDate.error });
      return;
    }
    spentOn = validatedDate.value;
    fields.spent_on = spentOn;
  }
  const dateError = validateExpenseDatePair(kind, spentOn);
  if (dateError) {
    res.status(400).json({ error: dateError });
    return;
  }
  if (Object.hasOwn(body, "active")) {
    if (typeof body.active !== "boolean") {
      res.status(400).json({ error: "active must be a boolean" });
      return;
    }
    fields.active = body.active;
  }
  if (Object.hasOwn(body, "note")) {
    const note = validateNote(body.note);
    if ("error" in note) {
      res.status(400).json({ error: note.error });
      return;
    }
    fields.note = note.value;
  }

  const parsedBody = UpdateFinanceExpenseBody.safeParse(normalizedBody);
  if (!parsedBody.success) {
    res.status(400).json({ error: zodErrorText(parsedBody.error) });
    return;
  }
  const [updated] = await db
    .update(expensesTable)
    .set({ ...fields, updated_at: new Date() })
    .where(eq(expensesTable.id, id))
    .returning();
  if (!updated) {
    res.status(404).json({ error: "not found" });
    return;
  }
  const response = toApiExpense({ ...updated, project_slug: projectSlug });
  UpdateFinanceExpenseResponse.parse(response);
  res.json(response);
});

router.delete("/finance/expenses/:id", async (req, res): Promise<void> => {
  const id = parseFinanceId(req.params.id);
  if (id === null) {
    res.status(400).json({ error: "invalid finance entry id" });
    return;
  }
  const deleted = await db
    .delete(expensesTable)
    .where(eq(expensesTable.id, id))
    .returning({ id: expensesTable.id });
  if (deleted.length === 0) {
    res.status(404).json({ error: "not found" });
    return;
  }
  res.json(DeleteFinanceExpenseResponse.parse({ ok: true }));
});

router.get("/finance/revenue", async (_req, res): Promise<void> => {
  const rows = await db
    .select({
      id: revenueEntriesTable.id,
      project_id: revenueEntriesTable.project_id,
      project_slug: projectsTable.slug,
      name: revenueEntriesTable.name,
      amount_cents: revenueEntriesTable.amount_cents,
      received_on: revenueEntriesTable.received_on,
      note: revenueEntriesTable.note,
      created_at: revenueEntriesTable.created_at,
    })
    .from(revenueEntriesTable)
    .leftJoin(
      projectsTable,
      eq(revenueEntriesTable.project_id, projectsTable.id),
    )
    .orderBy(asc(revenueEntriesTable.id));
  const response = rows.map(toApiRevenue);
  ListFinanceRevenueResponse.parse(response);
  res.json(response);
});

export async function createRevenue(
  input: unknown,
  idempotencyKey?: string,
): Promise<FinanceCreateResult<ReturnType<typeof toApiRevenue>>> {
  const getExisting = async () => {
    if (idempotencyKey === undefined) return null;
    const [existing] = await db
      .select({
        id: revenueEntriesTable.id,
        project_slug: projectsTable.slug,
        name: revenueEntriesTable.name,
        amount_cents: revenueEntriesTable.amount_cents,
        received_on: revenueEntriesTable.received_on,
        note: revenueEntriesTable.note,
        created_at: revenueEntriesTable.created_at,
      })
      .from(revenueEntriesTable)
      .leftJoin(
        projectsTable,
        eq(revenueEntriesTable.project_id, projectsTable.id),
      )
      .where(eq(revenueEntriesTable.idempotency_key, idempotencyKey))
      .limit(1);
    return existing ? toApiRevenue(existing) : null;
  };

  const existing = await getExisting();
  if (existing) {
    CreateFinanceRevenueResponse.parse(existing);
    return { status: 200, data: existing };
  }

  const body = requestBodyRecord(input);
  if (!body) return { status: 400, error: "request body must be an object" };
  const unknownFieldError = getUnknownFieldError(body, REVENUE_FIELDS);
  if (unknownFieldError) return { status: 400, error: unknownFieldError };
  const requiredFieldError = getMissingRequiredFieldError(body, [
    "project_slug",
    "name",
    "amount_cents",
    "received_on",
  ]);
  if (requiredFieldError) return { status: 400, error: requiredFieldError };

  const name = validateName(body.name);
  if ("error" in name) {
    return { status: 400, error: name.error };
  }
  const amount = validateCents(body.amount_cents, "amount_cents", 1);
  if ("error" in amount) {
    return { status: 400, error: amount.error };
  }
  const receivedOn = validateRequiredDate(body.received_on, "received_on");
  if ("error" in receivedOn) {
    return { status: 400, error: receivedOn.error };
  }
  const note = validateNote(body.note ?? null);
  if ("error" in note) {
    return { status: 400, error: note.error };
  }
  const project = await resolveProjectReference(body.project_slug);
  if ("error" in project) {
    return { status: 400, error: project.error };
  }
  const normalizedBody = {
    ...body,
    name: name.value,
    amount_cents: amount.value,
    received_on: receivedOn.value,
    note: note.value,
  };
  const parsedBody = CreateFinanceRevenueBody.safeParse(normalizedBody);
  if (!parsedBody.success) {
    return { status: 400, error: zodErrorText(parsedBody.error) };
  }

  const values = {
    project_id: project.value.project_id,
    name: name.value,
    amount_cents: BigInt(amount.value),
    received_on: receivedOn.value,
    note: note.value,
    idempotency_key: idempotencyKey ?? null,
  };
  let created: typeof revenueEntriesTable.$inferSelect | undefined;
  if (idempotencyKey === undefined) {
    [created] = await db.insert(revenueEntriesTable).values(values).returning();
  } else {
    [created] = await db
      .insert(revenueEntriesTable)
      .values(values)
      .onConflictDoNothing({ target: revenueEntriesTable.idempotency_key })
      .returning();
  }
  if (!created && idempotencyKey !== undefined) {
    const conflictRow = await getExisting();
    if (conflictRow) {
      CreateFinanceRevenueResponse.parse(conflictRow);
      return { status: 200, data: conflictRow };
    }
  }
  if (!created) {
    return { status: 500, error: "unable to create revenue entry" };
  }
  const response = toApiRevenue({
    ...created,
    project_slug: project.value.project_slug,
  });
  CreateFinanceRevenueResponse.parse(response);
  return { status: 201, data: response };
}

router.post("/finance/revenue", async (req, res): Promise<void> => {
  const result = await createRevenue(req.body);
  if ("error" in result) {
    res.status(result.status).json({ error: result.error });
    return;
  }
  res.status(result.status).json(result.data);
});

router.patch("/finance/revenue/:id", async (req, res): Promise<void> => {
  const id = parseFinanceId(req.params.id);
  if (id === null) {
    res.status(400).json({ error: "invalid finance entry id" });
    return;
  }
  const [existing] = await db
    .select({
      id: revenueEntriesTable.id,
      project_id: revenueEntriesTable.project_id,
      project_slug: projectsTable.slug,
      name: revenueEntriesTable.name,
      amount_cents: revenueEntriesTable.amount_cents,
      received_on: revenueEntriesTable.received_on,
      note: revenueEntriesTable.note,
      created_at: revenueEntriesTable.created_at,
    })
    .from(revenueEntriesTable)
    .leftJoin(
      projectsTable,
      eq(revenueEntriesTable.project_id, projectsTable.id),
    )
    .where(eq(revenueEntriesTable.id, id))
    .limit(1);
  if (!existing) {
    res.status(404).json({ error: "not found" });
    return;
  }
  const body = requestBody(req, res, REVENUE_FIELDS, [], true);
  if (!body) return;

  const fields: Partial<typeof revenueEntriesTable.$inferInsert> = {};
  const normalizedBody = { ...body };
  let projectSlug = existing.project_slug;
  if (Object.hasOwn(body, "project_slug")) {
    const project = await resolveProjectReference(body.project_slug);
    if ("error" in project) {
      res.status(400).json({ error: project.error });
      return;
    }
    fields.project_id = project.value.project_id;
    projectSlug = project.value.project_slug;
  }
  if (Object.hasOwn(body, "name")) {
    const name = validateName(body.name);
    if ("error" in name) {
      res.status(400).json({ error: name.error });
      return;
    }
    fields.name = name.value;
    normalizedBody.name = name.value;
  }
  if (Object.hasOwn(body, "amount_cents")) {
    const amount = validateCents(body.amount_cents, "amount_cents", 1);
    if ("error" in amount) {
      res.status(400).json({ error: amount.error });
      return;
    }
    fields.amount_cents = BigInt(amount.value);
    normalizedBody.amount_cents = amount.value;
  }
  if (Object.hasOwn(body, "received_on")) {
    const receivedOn = validateRequiredDate(body.received_on, "received_on");
    if ("error" in receivedOn) {
      res.status(400).json({ error: receivedOn.error });
      return;
    }
    fields.received_on = receivedOn.value;
    normalizedBody.received_on = receivedOn.value;
  }
  if (Object.hasOwn(body, "note")) {
    const note = validateNote(body.note);
    if ("error" in note) {
      res.status(400).json({ error: note.error });
      return;
    }
    fields.note = note.value;
  }

  const parsedBody = UpdateFinanceRevenueBody.safeParse(normalizedBody);
  if (!parsedBody.success) {
    res.status(400).json({ error: zodErrorText(parsedBody.error) });
    return;
  }
  const [updated] = await db
    .update(revenueEntriesTable)
    .set(fields)
    .where(eq(revenueEntriesTable.id, id))
    .returning();
  if (!updated) {
    res.status(404).json({ error: "not found" });
    return;
  }
  const response = toApiRevenue({ ...updated, project_slug: projectSlug });
  UpdateFinanceRevenueResponse.parse(response);
  res.json(response);
});

router.delete("/finance/revenue/:id", async (req, res): Promise<void> => {
  const id = parseFinanceId(req.params.id);
  if (id === null) {
    res.status(400).json({ error: "invalid finance entry id" });
    return;
  }
  const deleted = await db
    .delete(revenueEntriesTable)
    .where(eq(revenueEntriesTable.id, id))
    .returning({ id: revenueEntriesTable.id });
  if (deleted.length === 0) {
    res.status(404).json({ error: "not found" });
    return;
  }
  res.json(DeleteFinanceRevenueResponse.parse({ ok: true }));
});

export async function computeFinanceSummary() {
  const today = brisbaneDate(new Date());
  const startDate = subtractCalendarDays(today, 29);

  const [
    projects,
    debtRows,
    recurringExpenseRows,
    oneOffExpenseRows,
    revenueRows,
    storeResult,
  ] = await Promise.all([
      db
        .select({ id: projectsTable.id, slug: projectsTable.slug })
        .from(projectsTable)
        .orderBy(asc(projectsTable.sort_order)),
      db.select({ balance_cents: debtsTable.balance_cents }).from(debtsTable),
      db
        .select({ amount_cents: expensesTable.amount_cents })
        .from(expensesTable)
        .where(
          and(
            eq(expensesTable.kind, "recurring_monthly"),
            eq(expensesTable.active, true),
          ),
        ),
      db
        .select({ amount_cents: expensesTable.amount_cents })
        .from(expensesTable)
        .where(
          and(
            eq(expensesTable.kind, "one_off"),
            gte(expensesTable.spent_on, startDate),
            lte(expensesTable.spent_on, today),
          ),
        ),
      db
        .select({
          project_id: revenueEntriesTable.project_id,
          amount_cents: revenueEntriesTable.amount_cents,
        })
        .from(revenueEntriesTable)
        .where(
          and(
            gte(revenueEntriesTable.received_on, startDate),
            lte(revenueEntriesTable.received_on, today),
          ),
        ),
      getCattleDogCoffeeProfit(),
    ]);

  const coffeeProject = projects.find(
    (project) => project.slug === "cattle-dog-coffee",
  );
  const metricRows = coffeeProject
    ? await db
        .select({
          id: metricSnapshotsV2Table.id,
          key: metricSnapshotsV2Table.key,
          value: metricSnapshotsV2Table.value,
          captured_at: metricSnapshotsV2Table.captured_at,
        })
        .from(metricSnapshotsV2Table)
        .where(
          and(
            eq(metricSnapshotsV2Table.project_id, coffeeProject.id),
            inArray(metricSnapshotsV2Table.key, ["customers_30d"]),
          ),
        )
        .orderBy(
          desc(metricSnapshotsV2Table.captured_at),
          desc(metricSnapshotsV2Table.id),
        )
    : [];
  const latestMetrics = new Map<string, number>();
  for (const row of metricRows) {
    if (!latestMetrics.has(row.key)) {
      latestMetrics.set(row.key, row.value);
    }
  }

  const sourceTotals = calculateFinanceSourceTotals({
    projects,
    revenueRows,
    recurringExpenseRows,
    oneOffExpenseRows,
    storeResult,
  });
  const debtCents = sumBigInts(debtRows.map((row) => row.balance_cents));

  const customersValue = latestMetrics.get("customers_30d");
  const customers =
    customersValue === undefined
      ? null
      : safeMetricInteger(customersValue, "customers_30d");
  const expectedExpenses = sourceTotals.recurringMonthlyCents;
  const expectedRevenue = sourceTotals.revenue30dCents;
  const expectedProfit = expectedRevenue - expectedExpenses;

  return GetFinanceSummaryResponse.parse({
    profit_30d_cents: apiCents(sourceTotals.profit30dCents, "profit_30d_cents"),
    revenue_30d_cents: apiCents(sourceTotals.revenue30dCents, "revenue_30d_cents"),
    expenses_30d_cents: apiCents(sourceTotals.expenses30dCents, "expenses_30d_cents"),
    debt_cents: apiCents(debtCents, "debt_cents"),
    expected_expenses_next_month_cents: apiCents(
      expectedExpenses,
      "expected_expenses_next_month_cents",
    ),
    expected_revenue_next_month_cents: apiCents(
      expectedRevenue,
      "expected_revenue_next_month_cents",
    ),
    expected_profit_next_month_cents: apiCents(
      expectedProfit,
      "expected_profit_next_month_cents",
    ),
    customers,
    ventures_without_revenue_source: sourceTotals.venturesWithoutRevenueSource,
    notes: sourceTotals.notes,
  });
}

router.get("/finance/summary", async (_req, res): Promise<void> => {
  res.json(await computeFinanceSummary());
});

export default router;
