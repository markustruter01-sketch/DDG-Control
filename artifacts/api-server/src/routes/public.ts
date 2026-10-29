import { GetPublicSummaryResponse } from '@workspace/api-zod';
import { Router, type IRouter } from 'express';
import { computeOverview } from './overview';

// The only numbers the public DDG website can see: social followers and the charity total.
// No login. Cached so visitors never load the shop or database directly.
const router: IRouter = Router();
const FIVE_MINUTES = 5 * 60_000;
let cached: { at: number; body: ReturnType<typeof GetPublicSummaryResponse.parse> } | null = null;

router.get('/public/summary', async (_req, res) => {
  if (!cached || Date.now() - cached.at > FIVE_MINUTES) {
    const o = await computeOverview();
    cached = {
      at: Date.now(),
      body: GetPublicSummaryResponse.parse({
        updated_at: new Date().toISOString(),
        followers_total: o.social.followers,
        platforms: o.social.platforms.map((p) => ({ platform: p.platform, followers: p.followers })),
        coffee_bags_sold: o.businesses.coffee?.bags_sold ?? null,
        coffee_charity_cents: o.businesses.coffee?.charity_cents ?? null,
      }),
    };
  }
  res.setHeader('Cache-Control', 'public, max-age=300');
  res.json(cached.body);
});

export default router;
