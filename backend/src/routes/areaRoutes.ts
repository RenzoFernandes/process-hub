import { Router } from "express";
import { AreaController } from "../controllers/areaController";

const areaRoutes = Router();

const areaController = new AreaController();

areaRoutes.post("/", areaController.create);
areaRoutes.get("/", areaController.list);
areaRoutes.put("/:id", areaController.update);
areaRoutes.delete("/:id", areaController.delete);

export { areaRoutes };