import { Router, type IRouter } from 'express';
import healthRouter from './health';
import authRouter, { requireMonitorReadSession } from './auth';
import monitorRouter from './monitor';
import overviewRouter from './overview';
import financeRouter from './finance';
import socialRouter from './social';

const router: IRouter = Router();
router.use(healthRouter);
router.use(authRouter);
router.use(requireMonitorReadSession);
// The money ledger and social readings are the only things the owner edits here.
router.use(financeRouter);
router.use(socialRouter);
// Everything else is read only: work and approvals happen in their original tools.
router.use((req, res, next) => {
  if (req.method === 'GET' || req.method === 'HEAD') { next(); return; }
  res.setHeader('Allow', 'GET, HEAD');
  res.status(405).json({ error: 'This dashboard is read only. Use the original tool to manage work.' });
});
router.use(overviewRouter);
router.use(monitorRouter);
export default router;
