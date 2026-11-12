import { GetPublicFinanceResponse, GetPublicSummaryResponse } from '@workspace/api-zod';
import { computePublicFinance } from '../lib/public-finance';
import { Router, type IRouter } from 'express';
import { computeOverview } from './overview';
import { SERVICES_OPEN_ON, servicesOpen } from './build';
import { CHARITY } from '../lib/charity';

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
        views_all_time_total: o.social.views_all_time,
        likes_all_time_total: o.social.likes_all_time,
        platforms: o.social.platforms.map((p) => ({
          platform: p.platform, followers: p.followers, views_30d: p.views_30d, likes_30d: p.likes_30d,
          views_all_time: p.views_all_time, likes_all_time: p.likes_all_time,
        })),
        coffee_bags_sold: o.businesses.coffee?.bags_sold ?? null,
        coffee_charity_cents: o.businesses.coffee?.charity_cents ?? null,
        charity_revenue_share_cents: o.money.charity_revenue_share_cents,
        charity_revenue_share_pct: CHARITY.revenueSharePct,
        charity_revenue_share_from: CHARITY.revenueShareFrom,
        services_open: servicesOpen(),
        services_open_on: SERVICES_OPEN_ON,
      }),
    };
  }
  res.setHeader('Cache-Control', 'public, max-age=300');
  res.json(cached.body);
});

// DDG Finance's public page: performance against the S&P 500 from the record start and
// what each bot holds, built only from the trading platform's hourly push. Cached 5 minutes.
let financeCached: { at: number; body: ReturnType<typeof GetPublicFinanceResponse.parse> } | null = null;

router.get('/public/finance', async (_req, res) => {
  if (!financeCached || Date.now() - financeCached.at > FIVE_MINUTES) {
    financeCached = { at: Date.now(), body: GetPublicFinanceResponse.parse(await computePublicFinance()) };
  }
  res.setHeader('Cache-Control', 'public, max-age=300');
  res.json(financeCached.body);
});

export default router;
