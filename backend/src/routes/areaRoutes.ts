import { Router } from "express";
import { AreaController } from "../controllers/areaController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { AuthenticatedRequest } from "../types/auth";

const areaRoutes = Router();

const areaController = new AreaController();
const asAuth = (req: unknown) => req as AuthenticatedRequest;

areaRoutes.use(authMiddleware);
areaRoutes.post("/", (req, res) =>
  areaController.create(asAuth(req), res),
);
areaRoutes.get("/", (req, res) =>
  areaController.list(asAuth(req), res),
);
areaRoutes.put("/:id", (req, res) =>
  areaController.update(asAuth(req), res),
);
areaRoutes.delete("/:id", (req, res) =>
  areaController.delete(asAuth(req), res),
);

export { areaRoutes };
