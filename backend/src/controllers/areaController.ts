import { Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthenticatedRequest } from "../types/auth";

export class AreaController {
  async create(req: AuthenticatedRequest, res: Response) {
    try {
      const { name, description } = req.body;

      if (!name?.trim()) {
        return res.status(400).json({ error: "Informe o nome da area." });
      }

      const area = await prisma.area.create({
        data: {
          name,
          description,
          organizationId: req.user.organizationId,
        },
      });

      return res.status(201).json(area);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        error: "Erro ao criar area.",
      });
    }
  }

  async list(req: AuthenticatedRequest, res: Response) {
    try {
      const areas = await prisma.area.findMany({
        where: {
          organizationId: req.user.organizationId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return res.json(areas);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        error: "Erro ao buscar areas.",
      });
    }
  }

  async update(req: AuthenticatedRequest, res: Response) {
    try {
      const id = String(req.params.id);
      const { name, description } = req.body;

      if (!name?.trim()) {
        return res.status(400).json({ error: "Informe o nome da area." });
      }

      const area = await prisma.area.updateMany({
        where: {
          id,
          organizationId: req.user.organizationId,
        },
        data: {
          name,
          description,
        },
      });

      if (area.count === 0) {
        return res.status(404).json({ error: "Area nao encontrada." });
      }

      const updatedArea = await prisma.area.findFirst({
        where: {
          id,
          organizationId: req.user.organizationId,
        },
      });

      return res.json(updatedArea);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        error: "Erro ao atualizar area.",
      });
    }
  }

  async delete(req: AuthenticatedRequest, res: Response) {
    try {
      const id = String(req.params.id);

      const area = await prisma.area.deleteMany({
        where: {
          id,
          organizationId: req.user.organizationId,
        },
      });

      if (area.count === 0) {
        return res.status(404).json({ error: "Area nao encontrada." });
      }

      return res.status(204).send();
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        error: "Erro ao excluir area.",
      });
    }
  }
}
