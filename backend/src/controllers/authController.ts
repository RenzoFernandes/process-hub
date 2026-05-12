import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { AuthenticatedRequest } from "../types/auth";

const saltRounds = 10;

function createSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function createUniqueSlug(name: string) {
  const baseSlug = createSlug(name) || "workspace";
  let slug = baseSlug;
  let counter = 2;

  while (await prisma.organization.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }

  return slug;
}

function signToken(userId: string, organizationId: string) {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET nao configurado.");
  }

  return jwt.sign({ userId, organizationId }, secret, { expiresIn: "7d" });
}

function formatSession(user: {
  id: string;
  name: string;
  email: string;
  organization: {
    id: string;
    name: string;
    slug: string;
  };
}) {
  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    organization: user.organization,
  };
}

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { name, email, password, workspaceName } = req.body;

      if (!name?.trim()) {
        return res.status(400).json({ error: "Informe seu nome." });
      }

      if (!email?.trim()) {
        return res.status(400).json({ error: "Informe seu email." });
      }

      if (!password || String(password).length < 6) {
        return res.status(400).json({
          error: "A senha deve ter pelo menos 6 caracteres.",
        });
      }

      if (!workspaceName?.trim()) {
        return res.status(400).json({ error: "Informe o nome do workspace." });
      }

      const normalizedEmail = String(email).toLowerCase().trim();
      const existingUser = await prisma.user.findUnique({
        where: { email: normalizedEmail },
        select: { id: true },
      });

      if (existingUser) {
        return res.status(409).json({ error: "Email ja cadastrado." });
      }

      const passwordHash = await bcrypt.hash(String(password), saltRounds);
      const slug = await createUniqueSlug(workspaceName);

      const user = await prisma.user.create({
        data: {
          name,
          email: normalizedEmail,
          passwordHash,
          organization: {
            create: {
              name: workspaceName,
              slug,
            },
          },
        },
        include: {
          organization: true,
        },
      });

      const token = signToken(user.id, user.organizationId);

      return res.status(201).json({
        token,
        ...formatSession(user),
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({ error: "Erro ao criar conta." });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email?.trim() || !password) {
        return res.status(400).json({ error: "Informe email e senha." });
      }

      const user = await prisma.user.findUnique({
        where: { email: String(email).toLowerCase().trim() },
        include: { organization: true },
      });

      if (!user) {
        return res.status(401).json({ error: "Credenciais invalidas." });
      }

      const passwordMatches = await bcrypt.compare(
        String(password),
        user.passwordHash,
      );

      if (!passwordMatches) {
        return res.status(401).json({ error: "Credenciais invalidas." });
      }

      const token = signToken(user.id, user.organizationId);

      return res.json({
        token,
        ...formatSession(user),
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({ error: "Erro ao fazer login." });
    }
  }

  async me(req: AuthenticatedRequest, res: Response) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          id: req.user.userId,
          organizationId: req.user.organizationId,
        },
        include: { organization: true },
      });

      if (!user) {
        return res.status(404).json({ error: "Usuario nao encontrado." });
      }

      return res.json(formatSession(user));
    } catch (error) {
      console.error(error);

      return res.status(500).json({ error: "Erro ao buscar sessao." });
    }
  }

  async updateWorkspace(req: AuthenticatedRequest, res: Response) {
    try {
      const { name } = req.body;

      if (!name?.trim()) {
        return res.status(400).json({ error: "Informe o nome do workspace." });
      }

      await prisma.organization.update({
        where: { id: req.user.organizationId },
        data: { name },
      });

      const user = await prisma.user.findFirst({
        where: {
          id: req.user.userId,
          organizationId: req.user.organizationId,
        },
        include: { organization: true },
      });

      if (!user) {
        return res.status(404).json({ error: "Usuario nao encontrado." });
      }

      return res.json(formatSession(user));
    } catch (error) {
      console.error(error);

      return res.status(500).json({ error: "Erro ao atualizar workspace." });
    }
  }
}
