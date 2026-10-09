import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

if (process.env.NODE_ENV === "production" || process.env.REPLIT_DEPLOYMENT) {
  throw new Error("business brief snapshot test is development-only");
}

const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const requireFromDb = createRequire(resolve(workspaceRoot, "lib/db/package.json"));
const { eq } = requireFromDb("drizzle-orm");
const { db, membersTable, pool } = await import(
  pathToFileURL(resolve(workspaceRoot, "lib/db/src/index.ts")).href
);
const { buildOllieSnapshot } = await import(
  pathToFileURL(resolve(workspaceRoot, "artifacts/api-server/src/agents/ollie.ts"))
    .href
);

try {
  const [ollie] = await db
    .select({ id: membersTable.id })
    .from(membersTable)
    .where(eq(membersTable.name, "Ollie"));
  assert.ok(ollie, "Ollie member is missing from the development database");

  const snapshot = JSON.parse(
    await buildOllieSnapshot("2026-10-10", ollie.id, "", "failed"),
  ) as {
    business_briefs?: Array<{
      project_slug: string;
      updated: string;
      text: string | null;
    }>;
  };
  assert.equal(snapshot.business_briefs?.length, 4);
  assert.deepEqual(
    snapshot.business_briefs?.map((brief) => brief.project_slug).sort(),
    ["cattle-dog-coffee", "finance", "gods-eye-view", "hypest"].sort(),
  );
  assert.ok(snapshot.business_briefs?.every((brief) => brief.updated === "2026-10-10"));
  console.log(
    `business_briefs: ${JSON.stringify(snapshot.business_briefs, null, 2)}`,
  );
  console.log("PASS: buildOllieSnapshot includes four dated business briefs.");
} finally {
  await pool.end();
}
