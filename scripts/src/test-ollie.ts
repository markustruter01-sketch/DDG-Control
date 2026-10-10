import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const requireFromDb = createRequire(resolve(workspaceRoot, "lib/db/package.json"));
const { count, eq, inArray } = requireFromDb("drizzle-orm");

const dbModule = await import(
  pathToFileURL(resolve(workspaceRoot, "lib/db/src/index.ts")).href
);
const {
  agentProjectUpdatesTable,
  agentRunsTable,
  db,
  decisionsTable,
  membersTable,
  projectsTable,
  tasksTable,
  pool,
} = dbModule;

const ollieModule = await import(
  pathToFileURL(resolve(workspaceRoot, "artifacts/api-server/src/agents/ollie.ts"))
    .href
);
const { ollieFormJsonSchema, slotOllieReport } = ollieModule;

type Counts = {
  agentRuns: number;
  projectUpdates: number;
  decisions: number;
  tasks: number;
};

type TestState = {
  beforeCounts: Counts;
  runIds: number[];
  decisionIds: number[];
};

type SampleForm = {
  report_date: string;
  projects: Array<{
    slug: string;
    status_light: string;
    summary: string;
    next_action: string;
    priority: string;
    risks: Array<{ text: string; severity: string }>;
  }>;
  decisions: Array<{
    project_slug: string;
    title: string;
    recommendation: string;
    cost_estimate_aud: number | null;
    risk: string;
    urgency: string;
    confidence: string;
    owner_name: string;
    due_date: string | null;
  }>;
  questions_for_claude: string[];
  council_vote_requests: Array<{ topic: string; options: string[] }>;
};

const testRunIds: number[] = [];
const testDecisionIds: number[] = [];
let beforeCounts: Counts | undefined;
let testFailure: unknown;
let ollieMemberId = 0;

async function getCounts(): Promise<Counts> {
  const [agentRuns] = await db
    .select({ value: count() })
    .from(agentRunsTable);
  const [projectUpdates] = await db
    .select({ value: count() })
    .from(agentProjectUpdatesTable);
  const [decisions] = await db
    .select({ value: count() })
    .from(decisionsTable);
  const [tasks] = await db.select({ value: count() }).from(tasksTable);

  return {
    agentRuns: Number(agentRuns.value),
    projectUpdates: Number(projectUpdates.value),
    decisions: Number(decisions.value),
    tasks: Number(tasks.value),
  };
}

const validForm: SampleForm = {
  report_date: "2026-10-08",
  projects: [
    {
      slug: "hypest",
      status_light: "green",
      summary: "Sample daily status for Hypest.",
      next_action: "Review the sample report.",
      priority: "investigate",
      risks: [],
    },
    {
      slug: "finance",
      status_light: "amber",
      summary: "Sample daily status for Finance.",
      next_action: "Review the sample report.",
      priority: "maintain",
      risks: [
        {
          text: "Financial sample data must be reviewed.",
          severity: "high",
        },
      ],
    },
    {
      slug: "cattle-dog-coffee",
      status_light: "green",
      summary: "Sample daily status for Cattle Dog Coffee.",
      next_action: "Review the sample report.",
      priority: "accelerate",
      risks: [],
    },
    {
      slug: "ddg-music",
      status_light: "red",
      summary: "Sample daily status for DDG Music.",
      next_action: "Review the sample report.",
      priority: "delay",
      risks: [
        {
          text: "Sample report only; no live progress was checked.",
          severity: "medium",
        },
      ],
    },
  ],
  decisions: [
    {
      project_slug: "cattle-dog-coffee",
      title: "Review sample coffee launch plan",
      recommendation: "Review the plan before making any commitment.",
      cost_estimate_aud: null,
      risk: "Sample decision; no spending is authorized.",
      urgency: "medium",
      confidence: "high",
      owner_name: "Markus",
      due_date: null,
    },
    {
      project_slug: "finance",
      title: "Review sample finance safeguards",
      recommendation: "Confirm the safeguards before any trading action.",
      cost_estimate_aud: 0,
      risk: "Trading activity is high-sensitivity.",
      urgency: "high",
      confidence: "medium",
      owner_name: "Hermes",
      due_date: "2026-10-15",
    },
  ],
  questions_for_claude: ["Sample question for Claude?"],
  council_vote_requests: [
    { topic: "Sample vote", options: ["Option A", "Option B"] },
  ],
};

async function runCase(
  name: string,
  form: unknown,
  expectedStatus: "ok" | "invalid",
  expectedUpdates: number,
  expectedDecisions: number,
): Promise<void> {
  const countsBeforeCase = await getCounts();
  const [run] = await db
    .insert(agentRunsTable)
    .values({ member_id: ollieMemberId, status: "running" })
    .returning();
  assert.ok(run, `${name}: run row was not created`);
  testRunIds.push(run.id);

  const rawText = JSON.stringify(form);
  const slotResult = await slotOllieReport(run.id, rawText);
  testDecisionIds.push(...slotResult.decisionIds);

  const [storedRun] = await db
    .select()
    .from(agentRunsTable)
    .where(eq(agentRunsTable.id, run.id));
  const counts = await getCounts();
  assert.equal(storedRun.status, expectedStatus, `${name}: run status`);
  assert.equal(slotResult.status, expectedStatus, `${name}: slot result`);
  assert.equal(
    counts.agentRuns,
    countsBeforeCase.agentRuns + 1,
    `${name}: run count`,
  );
  assert.equal(
    counts.projectUpdates,
    countsBeforeCase.projectUpdates + expectedUpdates,
    `${name}: update count`,
  );
  assert.equal(
    counts.decisions,
    countsBeforeCase.decisions + expectedDecisions,
    `${name}: decision count`,
  );
  assert.equal(counts.tasks, countsBeforeCase.tasks, `${name}: task count`);

  if (expectedStatus === "invalid") {
    assert.ok(storedRun.error, `${name}: error text missing`);
    assert.equal(storedRun.raw_output, rawText, `${name}: raw_output`);
    assert.deepEqual(slotResult.decisionIds, [], `${name}: decision ids`);
  } else {
    assert.equal(storedRun.error, null, `${name}: unexpected run error`);
    assert.equal(slotResult.decisionIds.length, expectedDecisions);
    const updates = await db
      .select()
      .from(agentProjectUpdatesTable)
      .where(eq(agentProjectUpdatesTable.run_id, run.id));
    assert.equal(updates.length, expectedUpdates, `${name}: update rows`);
    assert.ok(
      updates.every((update: { priority: string | null }) => update.priority),
      `${name}: an update has no priority`,
    );
    const storedDecisions = await db
      .select()
      .from(decisionsTable)
      .where(eq(decisionsTable.run_id, run.id));
    assert.equal(storedDecisions.length, expectedDecisions);
    assert.ok(
      storedDecisions.every((decision: { status: string }) => decision.status === "pending"),
      `${name}: a decision is not pending`,
    );
  }

  console.log(
    `${name}: ${JSON.stringify({ run: storedRun, counts }, null, 2)}`,
  );
}

async function cleanupTestRows(
  state: TestState,
  expectedTaskCount: number,
): Promise<void> {
  await db.transaction(async (tx: any) => {
    const decisionRows = await tx
      .select({ id: decisionsTable.id, task_id: decisionsTable.task_id })
      .from(decisionsTable)
      .where(inArray(decisionsTable.id, state.decisionIds));
    if (decisionRows.length !== state.decisionIds.length) {
      throw new Error(
        `cleanup expected ${state.decisionIds.length} test decisions, found ${decisionRows.length}; rolling back`,
      );
    }

    const taskIds = decisionRows.flatMap((decision: { task_id: number | null }) =>
      decision.task_id === null ? [] : [decision.task_id],
    );
    if (taskIds.length !== expectedTaskCount) {
      throw new Error(
        `cleanup expected ${expectedTaskCount} test task links, found ${taskIds.length}; rolling back`,
      );
    }

    const deletedDecisions = await tx
      .delete(decisionsTable)
      .where(inArray(decisionsTable.id, state.decisionIds))
      .returning({ id: decisionsTable.id });
    if (deletedDecisions.length !== state.decisionIds.length) {
      throw new Error(
        `cleanup expected ${state.decisionIds.length} decisions, deleted ${deletedDecisions.length}; rolling back`,
      );
    }

    const deletedTasks =
      taskIds.length > 0
        ? await tx
            .delete(tasksTable)
            .where(inArray(tasksTable.id, taskIds))
            .returning({ id: tasksTable.id })
        : [];
    if (deletedTasks.length !== expectedTaskCount) {
      throw new Error(
        `cleanup expected ${expectedTaskCount} tasks, deleted ${deletedTasks.length}; rolling back`,
      );
    }

    const deletedUpdates = await tx
      .delete(agentProjectUpdatesTable)
      .where(inArray(agentProjectUpdatesTable.run_id, state.runIds))
      .returning({ id: agentProjectUpdatesTable.id });
    if (deletedUpdates.length !== 4) {
      throw new Error(
        `cleanup expected 4 updates, deleted ${deletedUpdates.length}; rolling back`,
      );
    }

    const deletedRuns = await tx
      .delete(agentRunsTable)
      .where(inArray(agentRunsTable.id, state.runIds))
      .returning({ id: agentRunsTable.id });
    if (deletedRuns.length !== state.runIds.length) {
      throw new Error(
        `cleanup expected ${state.runIds.length} runs, deleted ${deletedRuns.length}; rolling back`,
      );
    }

    console.log(
      `cleanup delete counts: ${JSON.stringify({
        decisions: deletedDecisions.length,
        tasks: deletedTasks.length,
        updates: deletedUpdates.length,
        runs: deletedRuns.length,
      })}`,
    );
  });

  const afterCounts = await getCounts();
  assert.deepEqual(afterCounts, state.beforeCounts, "counts after cleanup");
  console.log(`after cleanup counts: ${JSON.stringify(afterCounts)}`);
}

async function cleanupMode(
  rawState: string,
  expectedTaskCount: number,
): Promise<void> {
  const state = JSON.parse(rawState) as TestState;
  assert.ok(state.beforeCounts, "test state is missing before counts");
  assert.ok(state.runIds.length > 0, "test state is missing run ids");
  assert.ok(state.decisionIds.length === 2, "expected 2 test decision ids");
  await cleanupTestRows(state, expectedTaskCount);
}

async function testMode(keepRows: boolean): Promise<void> {
  const [ollieMember] = await db
    .select({ id: membersTable.id, kind: membersTable.kind })
    .from(membersTable)
    .where(eq(membersTable.name, "Ollie"));
  assert.ok(ollieMember, "Ollie member is missing");
  assert.equal(ollieMember.kind, "agent");
  ollieMemberId = ollieMember.id;

  for (const name of ["Markus", "Hermes"]) {
    const [member] = await db
      .select({ id: membersTable.id })
      .from(membersTable)
      .where(eq(membersTable.name, name));
    assert.ok(member, `${name} member is missing`);
  }

  const [bobMember] = await db
    .select({ id: membersTable.id })
    .from(membersTable)
    .where(eq(membersTable.name, "Bob"));
  assert.equal(
    bobMember,
    undefined,
    "Bob exists, so the requested invalid-owner sample is not invalid",
  );

  const projectRows = await db
    .select({ slug: projectsTable.slug })
    .from(projectsTable);
  for (const slug of [
    "hypest",
    "finance",
    "cattle-dog-coffee",
    "ddg-music",
  ]) {
    assert.ok(
      projectRows.some((project: { slug: string }) => project.slug === slug),
      `Missing project: ${slug}`,
    );
  }

  beforeCounts = await getCounts();
  console.log(`before counts: ${JSON.stringify(beforeCounts)}`);
  console.log(
    `ollieFormJsonSchema:\n${JSON.stringify(ollieFormJsonSchema, null, 2)}`,
  );

  await runCase("valid v2 form", validForm, "ok", 4, 2);

  const invalidPriorityForm = structuredClone(validForm);
  invalidPriorityForm.projects[0]!.priority = "explode";
  await runCase(
    "invalid priority",
    invalidPriorityForm,
    "invalid",
    0,
    0,
  );

  const invalidOwnerForm = structuredClone(validForm);
  invalidOwnerForm.decisions[0]!.owner_name = "Bob";
  await runCase(
    "unknown decision owner",
    invalidOwnerForm,
    "invalid",
    0,
    0,
  );

  const state: TestState = {
    beforeCounts,
    runIds: [...testRunIds],
    decisionIds: [...testDecisionIds],
  };
  console.log(`TEST_STATE=${JSON.stringify(state)}`);
  if (!keepRows) {
    await cleanupTestRows(state, 0);
  }
}

try {
  const args = process.argv.slice(2);
  if (args[0] === "--cleanup") {
    if (!args[1]) {
      throw new Error("cleanup mode requires the TEST_STATE JSON argument");
    }
    const expectedTaskCount =
      args[2] === undefined ? 1 : Number.parseInt(args[2], 10);
    if (
      !Number.isInteger(expectedTaskCount) ||
      expectedTaskCount < 0
    ) {
      throw new Error("cleanup task count must be a non-negative integer");
    }
    await cleanupMode(args[1], expectedTaskCount);
  } else if (args.length === 0 || (args.length === 1 && args[0] === "--keep")) {
    await testMode(args[0] === "--keep");
  } else {
    throw new Error("usage: test-ollie.ts [--keep | --cleanup TEST_STATE_JSON]");
  }
} catch (error) {
  testFailure = error;
  console.error(
    `test failure: ${error instanceof Error ? error.message : String(error)}`,
  );
  if (beforeCounts) {
    console.log(
      `TEST_STATE=${JSON.stringify({
        beforeCounts,
        runIds: testRunIds,
        decisionIds: testDecisionIds,
      })}`,
    );
  }
} finally {
  await pool.end();
}

if (testFailure) {
  process.exitCode = 1;
}
