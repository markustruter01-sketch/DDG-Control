import { Router, type IRouter } from "express";
import healthRouter from "./health";
import projectsRouter from "./projects";
import tasksRouter from "./tasks";
import goalsRouter from "./goals";

const router: IRouter = Router();

router.use(healthRouter);
router.use(projectsRouter);
router.use(tasksRouter);
router.use(goalsRouter);

export default router;
