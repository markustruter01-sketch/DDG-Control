import { Router, type IRouter } from 'express';
import healthRouter from './health';
import authRouter, { requireRealOwnerSession } from './auth';
import monitorRouter from './monitor';

const router: IRouter = Router();
router.use(healthRouter);
router.use(authRouter);
router.use(requireRealOwnerSession);
// The monitor has no task, approval, provider, worker or production write route.
router.use((req, res, next) => {
  if (req.method === 'GET' || req.method === 'HEAD') { next(); return; }
  res.setHeader('Allow', 'GET, HEAD');
  res.status(405).json({ error: 'This dashboard is read only. Use the original tool to manage work.' });
});
router.use(monitorRouter);
export default router;
