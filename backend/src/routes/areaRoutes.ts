import { Router } from "express";
import { AreaController } from "../controllers/areaController";

const areaRoutes = Router();

const areaController = new AreaController();

areaRoutes.post("/", areaController.create);
areaRoutes.get("/", areaController.list);

export { areaRoutes };