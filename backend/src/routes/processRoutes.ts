import { Router } from "express";
import { ProcessController } from "../controllers/processController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { AuthenticatedRequest } from "../types/auth";

const processRoutes = Router();

const processController = new ProcessController();
const asAuth = (req: unknown) => req as AuthenticatedRequest;

processRoutes.use(authMiddleware);
processRoutes.post("/", (req, res) =>
  processController.create(asAuth(req), res),
);
processRoutes.get("/", (req, res) =>
  processController.list(asAuth(req), res),
);
processRoutes.get("/tree", (req, res) =>
  processController.tree(asAuth(req), res),
);
processRoutes.put("/:id", (req, res) =>
  processController.update(asAuth(req), res),
);
processRoutes.delete("/:id", (req, res) =>
  processController.delete(asAuth(req), res),
);

export { processRoutes };
