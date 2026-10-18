import { createHash, timingSafeEqual } from "node:crypto";
import {
  ListLatestAgentUpdatesResponse,
  ListProjectNotesParams,
  ListProjectNotesResponse,
} from "@workspace/api-zod";
import {
  agentProjectUpdatesTable,
  agentRunsTable,
  db,
  inboundNotesTable,
  membersTable,
  projectsTable,
} from "@workspace/db";
import { desc, eq, sql } from "drizzle-orm";
import { Router, type IRouter } from "express";
import { runOllie } from "../agents/ollie";

const router: IRouter = Router();

type CursorModel = {
  id: string;
  displayName: string;
  description?: string;
};

router.get("/cursor/models", async (_req, res): Promise<void> => {
  const apiKey = process.env.CURSOR_API_KEY?.trim();
  if (!apiKey) {
    res.json({ status: "not_configured", models: [] satisfies CursorModel[] });
    return;
  }

  try {
    const response = await fetch("https://api.cursor.com/v1/models", {
      headers: {
        Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString("base64")}`,
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      res.status(502).json({ error: "Cursor could not provide its model list." });
      return;
    }

    const payload: unknown = await response.json();
    if (
      payload === null ||
      typeof payload !== "object" ||
      !("items" in payload) ||
      !Array.isArray(payload.items)
    ) {
      res.status(502).json({ error: "Cursor returned an unreadable model list." });
      return;
    }

    const models = payload.items.flatMap((item): CursorModel[] => {
      if (
        item === null ||
        typeof item !== "object" ||
        !("id" in item) ||
        typeof item.id !== "string" ||
        !("displayName" in item) ||
        typeof item.displayName !== "string"
      ) {
        return [];
      }
      return [
        {
          id: item.id,
          displayName: item.displayName,
          ...("description" in item && typeof item.description === "string"
            ? { description: item.description }
            : {}),
        },
      ];
    });

    res.json({ status: "connected", models });
  } catch {
    res.status(502).json({ error: "Could not contact Cursor to get its model list." });
  }
});

export type LatestUpdateRisk = {
  text: string;
  severity: string | null;
};

export function convertStoredRisks(risks: unknown): LatestUpdateRisk[] {
  if (!Array.isArray(risks)) {
    throw new Error("invalid stored agent update risks");
  }
  return risks.map((risk) =>
    typeof risk === "string"
      ? { text: risk, severity: null }
      : (risk as LatestUpdateRisk),
  );
}

router.get("/projects/:slug/notes", async (req, res): Promise<void> => {
  const params = ListProjectNotesParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "invalid project slug" });
    return;
  }

  const [project] = await db
    .select({ id: projectsTable.id })
    .from(projectsTable)
    .where(eq(projectsTable.slug, params.data.slug))
    .limit(1);
  if (!project) {
    res.status(404).json({ error: "not found" });
    return;
  }

  const notes = await db
    .select({
      id: inboundNotesTable.id,
      kind: inboundNotesTable.kind,
      severity: inboundNotesTable.severity,
      text: inboundNotesTable.text,
      created_at: inboundNotesTable.created_at,
    })
    .from(inboundNotesTable)
    .where(eq(inboundNotesTable.project_id, project.id))
    .orderBy(
      sql`${inboundNotesTable.created_at} DESC NULLS LAST`,
      desc(inboundNotesTable.id),
    )
    .limit(50);

  res.json(
    ListProjectNotesResponse.parse(
      notes.map((note) => ({
        ...note,
        created_at: note.created_at?.toISOString() ?? null,
      })),
    ),
  );
});

router.post("/agents/ollie/cron", async (req, res): Promise<void> => {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    res.status(503).json({ error: "cron not configured" });
    return;
  }

  const authorization = req.get("authorization");
  const bearerToken = authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!bearerToken) {
    res.status(401).json({ error: "unauthorised" });
    return;
  }

  const expectedHash = createHash("sha256").update(cronSecret).digest();
  const tokenHash = createHash("sha256").update(bearerToken).digest();
  if (!timingSafeEqual(expectedHash, tokenHash)) {
    res.status(401).json({ error: "unauthorised" });
    return;
  }

  const result = await runOllie({ force: false });
  res.status(result.httpStatus).json(result.response);
});

router.get("/agent-updates/latest", async (_req, res): Promise<void> => {
  const rows = await db
    .select({
      project_id: agentProjectUpdatesTable.project_id,
      project_slug: projectsTable.slug,
      status_light: agentProjectUpdatesTable.status_light,
      summary: agentProjectUpdatesTable.summary,
      next_action: agentProjectUpdatesTable.next_action,
      priority: agentProjectUpdatesTable.priority,
      risks: agentProjectUpdatesTable.risks,
      created_at: agentProjectUpdatesTable.created_at,
    })
    .from(agentProjectUpdatesTable)
    .innerJoin(
      projectsTable,
      eq(agentProjectUpdatesTable.project_id, projectsTable.id),
    )
    .innerJoin(
      agentRunsTable,
      eq(agentProjectUpdatesTable.run_id, agentRunsTable.id),
    )
    .innerJoin(
      membersTable,
      eq(agentRunsTable.member_id, membersTable.id),
    )
    .where(eq(membersTable.name, "Ollie"))
    .orderBy(
      desc(agentRunsTable.started_at),
      desc(agentRunsTable.id),
      desc(agentProjectUpdatesTable.id),
    );

  const updatesByProject = new Map<
    number,
    {
      latest: {
        project_slug: string;
        status_light: string;
        summary: string;
        next_action: string;
        priority: string | null;
        risks: LatestUpdateRisk[];
        created_at: string | null;
      };
      previous: {
        status_light: string;
        priority: string | null;
        next_action: string;
        created_at: string | null;
      } | null;
    }
  >();

  for (const row of rows) {
    const update = {
      status_light: row.status_light,
      priority: row.priority,
      next_action: row.next_action,
      created_at: row.created_at?.toISOString() ?? null,
    };
    const existing = updatesByProject.get(row.project_id);
    if (!existing) {
      updatesByProject.set(row.project_id, {
        latest: {
          project_slug: row.project_slug,
          ...update,
          summary: row.summary,
          risks: convertStoredRisks(row.risks),
        },
        previous: null,
      });
    } else if (existing.previous === null) {
      existing.previous = update;
    }
  }

  const latestUpdates = Array.from(updatesByProject.values()).map(
    ({ latest, previous }) => ({ ...latest, previous }),
  );

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
