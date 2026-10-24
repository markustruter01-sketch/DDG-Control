import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter, { requireAuth } from "./auth";
import projectsRouter from "./projects";
import tasksRouter from "./tasks";
import goalsRouter from "./goals";
import metricsRouter from "./metrics";
import agentsRouter from "./agents";
import decisionsRouter from "./decisions";
import fleetRouter from "./fleet";
import inboundRouter from "./inbound";
import financeRouter from "./finance";
import socialRouter from "./social";
import workManagementRouter from "./work-management";
import { companyActivityRouter } from "./company-activity";
import fleetDeskRouter from "./fleet-desk";
import notificationReceiptsRouter from "./notification-receipts";
import cursorWorkerRouter from "./cursor-worker";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
// Separate source-disabled machine route; it performs its own HMAC validation.
// Owner session/dev bypass cannot authenticate this endpoint.
router.use(cursorWorkerRouter);
router.use(requireAuth);
router.use(projectsRouter);
router.use(tasksRouter);
router.use(goalsRouter);
router.use(metricsRouter);
router.use(agentsRouter);
router.use(decisionsRouter);
router.use(fleetRouter);
router.use(inboundRouter);
router.use(financeRouter);
router.use(socialRouter);
router.use(workManagementRouter);
router.use(companyActivityRouter);
router.use(fleetDeskRouter);
router.use(notificationReceiptsRouter);

export default router;
