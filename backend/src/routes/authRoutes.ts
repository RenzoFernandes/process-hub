import { Router } from "express";
import { AuthController } from "../controllers/authController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { AuthenticatedRequest } from "../types/auth";

const authRoutes = Router();
const authController = new AuthController();
const asAuth = (req: unknown) => req as AuthenticatedRequest;

authRoutes.post("/register", authController.register);
authRoutes.post("/login", authController.login);
authRoutes.get("/me", authMiddleware, (req, res) =>
  authController.me(asAuth(req), res),
);
authRoutes.put("/workspace", authMiddleware, (req, res) =>
  authController.updateWorkspace(asAuth(req), res),
);
authRoutes.delete("/workspace", authMiddleware, (req, res) =>
  authController.deleteWorkspace(asAuth(req), res),
);

export { authRoutes };
