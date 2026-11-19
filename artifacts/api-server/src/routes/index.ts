import { Router, type IRouter } from 'express';
import healthRouter from './health';
import authRouter, { requireMonitorReadSession } from './auth';
import monitorRouter from './monitor';
import overviewRouter from './overview';
import financeRouter from './finance';
import socialRouter from './social';
import botsRouter from './bots';
import fleetRouter, { fleetInboundRouter } from './fleet';
import opsRouter from './ops';
import publicRouter from './public';
import { buildOwnerRouter, buildPublicRouter } from './build';
import { quotesOwnerRouter, quotesPublicRouter } from './quotes';
import { visitsOwnerRouter, visitsPublicRouter } from './visits';
import { showcaseInboundRouter, showcasePublicRouter } from './showcase';

const router: IRouter = Router();
router.use(healthRouter);
router.use(authRouter);
// Grok bots push numbers with their own key (DDG_BOT_KEY), not the owner login.
router.use(botsRouter);
router.use(fleetInboundRouter);
// The public website's numbers (followers + charity), no login.
router.use(publicRouter);
router.use(buildPublicRouter); // DDG Build enquiries (public from the opening date)
router.use(quotesPublicRouter); // DDG Build quotes: the client's private link
router.use(visitsPublicRouter); // ddg.limited visitor counting, no login
router.use(showcaseInboundRouter); // Finance pushes the showcase snapshot (its own key)
router.use(showcasePublicRouter); // ddg.limited/live/finance reads it, no login
router.use(requireMonitorReadSession);
// The owner edits money, social readings, the Needs-you list, and can undo bot pushes.
router.use(financeRouter);
router.use(socialRouter);
router.use(opsRouter);
router.use(buildOwnerRouter);
router.use(visitsOwnerRouter);
router.use(quotesOwnerRouter);
// Everything else is read only: work and approvals happen in their original tools.
router.use((req, res, next) => {
  if (req.method === 'GET' || req.method === 'HEAD') { next(); return; }
  res.setHeader('Allow', 'GET, HEAD');
  res.status(405).json({ error: 'This dashboard is read only. Use the original tool to manage work.' });
});
router.use(overviewRouter);
router.use(fleetRouter);
router.use(monitorRouter);
export default router;
