import { ListLatestAgentUpdatesResponse } from "@workspace/api-zod";
import {
  agentProjectUpdatesTable,
  agentRunsTable,
  db,
  membersTable,
  projectsTable,
} from "@workspace/db";
import { desc, eq } from "drizzle-orm";
import { Router, type IRouter } from "express";
import { runOllie } from "../agents/ollie";

const router: IRouter = Router();

router.get("/agent-updates/latest", async (_req, res): Promise<void> => {
  const rows = await db
    .select({
      project_id: agentProjectUpdatesTable.project_id,
      project_slug: projectsTable.slug,
      status_light: agentProjectUpdatesTable.status_light,
      summary: agentProjectUpdatesTable.summary,
      next_action: agentProjectUpdatesTable.next_action,
      risks: agentProjectUpdatesTable.risks,
      created_at: agentProjectUpdatesTable.created_at,
    })
    .from(agentProjectUpdatesTable)
    .innerJoin(
      projectsTable,
      eq(agentProjectUpdatesTable.project_id, projectsTable.id),
    )
    .orderBy(
      desc(agentProjectUpdatesTable.created_at),
      desc(agentProjectUpdatesTable.id),
    );

  const seenProjectIds = new Set<number>();
  const latestUpdates = rows.flatMap((row) => {
    if (seenProjectIds.has(row.project_id)) return [];
    seenProjectIds.add(row.project_id);
    return [{
      project_slug: row.project_slug,
      status_light: row.status_light,
      summary: row.summary,
      next_action: row.next_action,
      risks: row.risks,
      created_at: row.created_at?.toISOString() ?? null,
    }];
  });

  res.json(ListLatestAgentUpdatesResponse.parse(latestUpdates));
});

router.post("/agents/ollie/run", async (req, res): Promise<void> => {
  if (
    req.body === null ||
    typeof req.body !== "object" ||
    Array.isArray(req.body)
  ) {
    res.status(400).json({ error: "request body must be an object" });
    return;
  }

  const body = req.body as Record<string, unknown>;
  if (
    Object.keys(body).some((key) => key !== "force") ||
    (body.force !== undefined && typeof body.force !== "boolean")
  ) {
    res.status(400).json({ error: "invalid request body" });
    return;
  }

  const result = await runOllie({ force: body.force as boolean | undefined });
  res.status(result.httpStatus).json(result.response);
});

router.get("/agents/runs", async (_req, res): Promise<void> => {
  const runs = await db
    .select({
      id: agentRunsTable.id,
      member_id: agentRunsTable.member_id,
      member_name: membersTable.name,
      status: agentRunsTable.status,
      model: agentRunsTable.model,
      input_tokens: agentRunsTable.input_tokens,
      output_tokens: agentRunsTable.output_tokens,
      raw_output: agentRunsTable.raw_output,
      error: agentRunsTable.error,
      started_at: agentRunsTable.started_at,
      finished_at: agentRunsTable.finished_at,
    })
    .from(agentRunsTable)
    .innerJoin(membersTable, eq(agentRunsTable.member_id, membersTable.id))
    .orderBy(desc(agentRunsTable.started_at), desc(agentRunsTable.id))
    .limit(20);

  res.json(
    runs.map((run) => ({
      ...run,
      started_at: run.started_at.toISOString(),
      finished_at: run.finished_at?.toISOString() ?? null,
    })),
  );
});

export default router;
