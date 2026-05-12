import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest, AuthUser } from "../types/auth";

interface TokenPayload {
  userId: string;
  organizationId: string;
}

export const authMiddleware: RequestHandler = (req, res, next) => {
  const authenticatedReq = req as AuthenticatedRequest;
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token de autenticacao ausente." });
  }

  const token = authHeader.replace("Bearer ", "");
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return res.status(500).json({ error: "JWT_SECRET nao configurado." });
  }

  try {
    const payload = jwt.verify(token, secret) as TokenPayload;

    const user: AuthUser = {
      userId: payload.userId,
      organizationId: payload.organizationId,
    };

    authenticatedReq.user = user;

    return next();
  } catch {
    return res.status(401).json({ error: "Token de autenticacao invalido." });
  }
};
