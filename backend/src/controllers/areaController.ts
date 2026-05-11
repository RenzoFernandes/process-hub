import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export class AreaController {
  async create(req: Request, res: Response) {
    try {
      const { name, description } = req.body;

      if (!name?.trim()) {
        return res.status(400).json({ error: "Informe o nome da área." });
      }

      const area = await prisma.area.create({
        data: {
          name,
          description,
        },
      });

      return res.status(201).json(area);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        error: "Erro ao criar área.",
      });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const areas = await prisma.area.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });

      return res.json(areas);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        error: "Erro ao buscar áreas.",
      });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const { name, description } = req.body;

      if (!name?.trim()) {
        return res.status(400).json({ error: "Informe o nome da área." });
      }

      const area = await prisma.area.update({
        where: { id },
        data: {
          name,
          description,
        },
      });

      return res.json(area);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        error: "Erro ao atualizar área.",
      });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = String(req.params.id);

      await prisma.area.delete({
        where: { id },
      });

      return res.status(204).send();
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        error: "Erro ao excluir área.",
      });
    }
  }
}
