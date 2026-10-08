import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter, { requireAuth } from "./auth";
import projectsRouter from "./projects";
import tasksRouter from "./tasks";
import goalsRouter from "./goals";
import metricsRouter from "./metrics";
import agentsRouter from "./agents";
import decisionsRouter from "./decisions";
import inboundRouter from "./inbound";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(requireAuth);
router.use(projectsRouter);
router.use(tasksRouter);
router.use(goalsRouter);
router.use(metricsRouter);
router.use(agentsRouter);
router.use(decisionsRouter);
router.use(inboundRouter);

export default router;
