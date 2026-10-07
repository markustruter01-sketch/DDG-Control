import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter, { requireAuth } from "./auth";
import projectsRouter from "./projects";
import tasksRouter from "./tasks";
import goalsRouter from "./goals";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(requireAuth);
router.use(projectsRouter);
router.use(tasksRouter);
router.use(goalsRouter);

export default router;
