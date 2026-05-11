import { Router } from "express";
import { ProcessController } from "../controllers/processController";

const processRoutes = Router();

const processController = new ProcessController();

processRoutes.post("/", processController.create);
processRoutes.get("/", processController.list);

export { processRoutes };