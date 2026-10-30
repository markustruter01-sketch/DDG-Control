import {
  CreateSocialSnapshotBody,
  CreateSocialSnapshotResponse,
  GetSocialSummaryResponse,
} from "@workspace/api-zod";
import { db, projectsTable, socialSnapshotsTable } from "@workspace/db";
import { asc, desc, eq } from "drizzle-orm";
import { Router, type IRouter, type RequestHandler } from "express";
import { zodErrorText } from "./validation";

const router: IRouter = Router();

function brisbaneToday(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Australia/Brisbane" }).format(new Date());
}

function minusDays(day: string, days: number): string {
  const [y, m, d] = day.split("-").map(Number);
  return new Date(Date.UTC(y!, m! - 1, d! - days)).toISOString().slice(0, 10);
}

export async function computeSocialSummary() {
  const [projects, rows] = await Promise.all([
    db.select({ id: projectsTable.id, slug: projectsTable.slug })
      .from(projectsTable)
      .orderBy(asc(projectsTable.sort_order)),
    db.select().from(socialSnapshotsTable)
      .orderBy(desc(socialSnapshotsTable.captured_on), desc(socialSnapshotsTable.id)),
  ]);
  const cutoff = minusDays(brisbaneToday(), 30);
  let total = 0;
  const ventures = projects.map((project) => {
    const mine = rows.filter((row) => row.project_id === project.id);
    const platforms = [...new Set(mine.map((row) => row.platform))].sort().map((platform) => {
      const readings = mine.filter((row) => row.platform === platform); // newest first
      const latest = readings[0]!;
      const old = readings.find((row) => row.captured_on <= cutoff);
      return {
        platform: latest.platform as never,
        followers: latest.followers,
        followers_change_30d: old ? latest.followers - old.followers : null,
        impressions_30d: latest.impressions_30d,
        engagements_30d: latest.engagements_30d,
        captured_on: latest.captured_on,
        source: latest.source,
      };
    });
    const followers = platforms.reduce((sum, p) => sum + p.followers, 0);
    total += followers;
    const changes = platforms.map((p) => p.followers_change_30d);
    return {
      project_slug: project.slug,
      total_followers: followers,
      // Only report a venture's change when every platform has a 30-day-old reading.
      followers_change_30d:
        platforms.length > 0 && changes.every((c) => c !== null)
          ? changes.reduce((sum, c) => sum! + c!, 0)
          : null,
      platforms,
    };
  });
  const summary = { total_followers: total, ventures };
  GetSocialSummaryResponse.parse(summary); // validate only; keep date strings as-is
  return summary;
}

router.get("/social/summary", async (_req, res): Promise<void> => {
  res.json(await computeSocialSummary());
});

type SocialResult = { status: 201; data: Record<string, unknown> } | { status: 400 | 500; error: string };

/** Saves one reading. Used by the Social page and by bots; which bot sent it is kept in the bot_pushes log. */
export async function recordSocialSnapshot(input: unknown): Promise<SocialResult> {
  const parsed = CreateSocialSnapshotBody.strict().safeParse(input);
  if (!parsed.success) return { status: 400, error: zodErrorText(parsed.error) };
  const body = parsed.data;
  const [project] = await db
    .select({ id: projectsTable.id, slug: projectsTable.slug })
    .from(projectsTable)
    .where(eq(projectsTable.slug, body.project_slug))
    .limit(1);
  if (!project) return { status: 400, error: "unknown project" };
  const [created] = await db
    .insert(socialSnapshotsTable)
    .values({
      project_id: project.id,
      platform: body.platform,
      followers: body.followers,
      impressions_30d: body.impressions_30d ?? null,
      engagements_30d: body.engagements_30d ?? null,
      views_all_time: body.views_all_time ?? null,
      likes_all_time: body.likes_all_time ?? null,
      captured_on: brisbaneToday(),
      source: "manual",
    })
    .returning();
  if (!created) return { status: 500, error: "unable to record social numbers" };
  const data = {
    id: created.id,
    project_slug: project.slug,
    platform: created.platform,
    followers: created.followers,
    impressions_30d: created.impressions_30d,
    engagements_30d: created.engagements_30d,
    views_all_time: created.views_all_time,
    likes_all_time: created.likes_all_time,
    captured_on: created.captured_on,
    source: created.source,
  };
  CreateSocialSnapshotResponse.parse(data);
  return { status: 201, data };
}

const createSocialSnapshot: RequestHandler = async (req, res): Promise<void> => {
  const result = await recordSocialSnapshot(req.body);
  if ("error" in result) res.status(result.status).json({ error: result.error });
  else res.status(201).json(result.data);
};

router.post("/social/snapshots", createSocialSnapshot);

export default router;
