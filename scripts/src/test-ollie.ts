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
  needsApprovalTasks: number;
};

const testRunIds: number[] = [];
const createdTaskIds: number[] = [];
let beforeCounts: Counts | undefined;
let testFailure: unknown;

async function getCounts(): Promise<Counts> {
  const [agentRuns] = await db
    .select({ value: count() })
    .from(agentRunsTable);
  const [projectUpdates] = await db
    .select({ value: count() })
    .from(agentProjectUpdatesTable);
  const [needsApprovalTasks] = await db
    .select({ value: count() })
    .from(tasksTable)
    .where(eq(tasksTable.status, "needs_approval"));

  return {
    agentRuns: Number(agentRuns.value),
    projectUpdates: Number(projectUpdates.value),
    needsApprovalTasks: Number(needsApprovalTasks.value),
  };
}

const validForm = {
  report_date: "2026-10-07",
  projects: [
    {
      slug: "hypest",
      status_light: "green",
      summary: "Sample daily status for Hypest.",
      next_action: "Review the sample report.",
      risks: [],
    },
    {
      slug: "finance",
      status_light: "amber",
      summary: "Sample daily status for Finance.",
      next_action: "Review the sample report.",
      risks: ["Sample risk for validation."],
    },
    {
      slug: "cattle-dog-coffee",
      status_light: "green",
      summary: "Sample daily status for Cattle Dog Coffee.",
      next_action: "Review the sample report.",
      risks: [],
    },
    {
      slug: "gods-eye-view",
      status_light: "red",
      summary: "Sample daily status for Gods Eye View.",
      next_action: "Review the sample report.",
      risks: [],
    },
  ],
  proposed_tasks: [
    {
      project_slug: "cattle-dog-coffee",
      title: "Review sample order flow",
      owner_name: "Markus",
      due_date: null,
      reason: "Sample task proposed by Ollie.",
    },
    {
      project_slug: "finance",
      title: "Review sample subscription notes",
      owner_name: "Ollie",
      due_date: "2026-10-09",
      reason: "Sample follow-up proposed by Ollie.",
    },
  ],
};

async function runCase(
  name: string,
  form: unknown,
  expectedStatus: "ok" | "invalid",
  expectedUpdates: number,
  expectedTasks: number,
  caseIndex: number,
): Promise<void> {
  const [run] = await db
    .insert(agentRunsTable)
    .values({ member_id: ollieMemberId, status: "running" })
    .returning();
  assert.ok(run, `${name}: run row was not created`);
  testRunIds.push(run.id);

  const rawText = JSON.stringify(form);
  const slotResult = await slotOllieReport(run.id, rawText);
  createdTaskIds.push(...slotResult.taskIds);

  const [storedRun] = await db
    .select()
    .from(agentRunsTable)
    .where(eq(agentRunsTable.id, run.id));
  const counts = await getCounts();
  assert.equal(storedRun.status, expectedStatus, `${name}: run status`);
  assert.equal(slotResult.status, expectedStatus, `${name}: slot result`);
  assert.equal(
    counts.agentRuns,
    beforeCounts!.agentRuns + caseIndex + 1,
    `${name}: run count`,
  );
  assert.equal(
    counts.projectUpdates,
    beforeCounts!.projectUpdates + expectedUpdates,
    `${name}: update count`,
  );
  assert.equal(
    counts.needsApprovalTasks,
    beforeCounts!.needsApprovalTasks + expectedTasks,
    `${name}: needs_approval task count`,
  );
  if (expectedStatus === "invalid") {
    assert.ok(storedRun.error, `${name}: error text missing`);
    assert.equal(storedRun.raw_output, rawText, `${name}: raw_output`);
  }

  console.log(
    `${name}: ${JSON.stringify({ run: storedRun, counts }, null, 2)}`,
  );
}

let ollieMemberId = 0;

try {
  const [ollieMember] = await db
    .select({ id: membersTable.id })
    .from(membersTable)
    .where(eq(membersTable.name, "Ollie"));
  assert.ok(ollieMember, "Ollie member is missing");
  ollieMemberId = ollieMember.id;

  const [markusMember] = await db
    .select({ id: membersTable.id })
    .from(membersTable)
    .where(eq(membersTable.name, "Markus"));
  assert.ok(markusMember, "Markus member is missing");

  const [bobMember] = await db
    .select({ id: membersTable.id })
    .from(membersTable)
    .where(eq(membersTable.name, "Bob"));
  assert.equal(bobMember, undefined, "Bob exists, so the requested invalid-owner sample is not invalid");

  const projectRows = await db
    .select({ slug: projectsTable.slug })
    .from(projectsTable);
  for (const slug of [
    "hypest",
    "finance",
    "cattle-dog-coffee",
    "gods-eye-view",
  ]) {
    assert.ok(
      projectRows.some((project: { slug: string }) => project.slug === slug),
      `Missing project: ${slug}`,
    );
  }

  beforeCounts = await getCounts();
  console.log(`before counts: ${JSON.stringify(beforeCounts)}`);
  console.log(`ollieFormJsonSchema:\n${JSON.stringify(ollieFormJsonSchema, null, 2)}`);

  await runCase("valid form", validForm, "ok", 4, 2, 0);

  const invalidSlugForm = structuredClone(validForm);
  invalidSlugForm.projects[0]!.slug = "no-such-project";
  await runCase("unknown project slug", invalidSlugForm, "invalid", 4, 2, 1);

  const invalidOwnerForm = structuredClone(validForm);
  invalidOwnerForm.proposed_tasks[0]!.owner_name = "Bob";
  await runCase("unknown task owner", invalidOwnerForm, "invalid", 4, 2, 2);

  const longSummaryForm = structuredClone(validForm);
  longSummaryForm.projects[0]!.summary = "x".repeat(201);
  await runCase("201-character summary", longSummaryForm, "invalid", 4, 2, 3);
} catch (error) {
  testFailure = error;
  console.error(
    `test failure: ${error instanceof Error ? error.message : String(error)}`,
  );
} finally {
  try {
    if (beforeCounts && testRunIds.length > 0) {
      await db.transaction(async (tx: any) => {
        const deletedTasks =
          createdTaskIds.length > 0
            ? await tx
                .delete(tasksTable)
                .where(inArray(tasksTable.id, createdTaskIds))
                .returning({ id: tasksTable.id })
            : [];
        if (deletedTasks.length !== 2) {
          throw new Error(
            `cleanup expected 2 test tasks, deleted ${deletedTasks.length}; rolling back`,
          );
        }

        const deletedUpdates = await tx
          .delete(agentProjectUpdatesTable)
          .where(inArray(agentProjectUpdatesTable.run_id, testRunIds))
          .returning({ id: agentProjectUpdatesTable.id });
        if (deletedUpdates.length !== 4) {
          throw new Error(
            `cleanup expected 4 test updates, deleted ${deletedUpdates.length}; rolling back`,
          );
        }

        const deletedRuns = await tx
          .delete(agentRunsTable)
          .where(inArray(agentRunsTable.id, testRunIds))
          .returning({ id: agentRunsTable.id });
        if (deletedRuns.length !== 4) {
          throw new Error(
            `cleanup expected 4 test runs, deleted ${deletedRuns.length}; rolling back`,
          );
        }

        console.log(
          `cleanup delete counts: ${JSON.stringify({ tasks: deletedTasks.length, updates: deletedUpdates.length, runs: deletedRuns.length })}`,
        );
      });

      const afterCounts = await getCounts();
      assert.deepEqual(afterCounts, beforeCounts, "counts after cleanup");
      const [ollieAfterCleanup] = await db
        .select({ id: membersTable.id, name: membersTable.name, kind: membersTable.kind })
        .from(membersTable)
        .where(eq(membersTable.name, "Ollie"));
      assert.ok(ollieAfterCleanup, "Ollie was removed during cleanup");
      assert.equal(ollieAfterCleanup.kind, "agent");
      console.log(`after cleanup counts: ${JSON.stringify(afterCounts)}`);
      console.log(`Ollie after cleanup: ${JSON.stringify(ollieAfterCleanup)}`);
    }
  } catch (cleanupError) {
    testFailure = testFailure ?? cleanupError;
    console.error(
      `cleanup failed: ${cleanupError instanceof Error ? cleanupError.message : String(cleanupError)}`,
    );
  } finally {
    await pool.end();
  }
}

if (testFailure) {
  process.exitCode = 1;
}
