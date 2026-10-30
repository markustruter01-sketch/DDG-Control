import { GetPublicSummaryResponse } from '@workspace/api-zod';
import { Router, type IRouter } from 'express';
import { computeOverview } from './overview';
import { SERVICES_OPEN_ON, servicesOpen } from './build';

// The only numbers the public DDG website can see: social followers, views and likes, the charity total,
// and whether DDG Build enquiries are open.
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
        views_30d_total: o.social.views_30d,
        likes_30d_total: o.social.likes_30d,
        platforms: o.social.platforms.map((p) => ({
          platform: p.platform, followers: p.followers, views_30d: p.views_30d, likes_30d: p.likes_30d,
        })),
        coffee_bags_sold: o.businesses.coffee?.bags_sold ?? null,
        coffee_charity_cents: o.businesses.coffee?.charity_cents ?? null,
        services_open: servicesOpen(),
        services_open_on: SERVICES_OPEN_ON,
      }),
    };
  }
  res.setHeader('Cache-Control', 'public, max-age=300');
  res.json(cached.body);
});

export default router;
