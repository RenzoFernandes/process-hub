import { Request } from "express";

export interface AuthUser {
  userId: string;
  organizationId: string;
}

export interface AuthenticatedRequest extends Request {
  user: AuthUser;
}
