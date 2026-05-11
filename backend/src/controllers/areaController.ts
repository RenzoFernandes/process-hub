import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export class AreaController {
  async create(req: Request, res: Response) {
    try {
      const { name, description } = req.body;

      const area = await prisma.area.create({
        data: {
          name,
          description,
        },
      });

      return res.status(201).json(area);
    } catch (error) {
      return res.status(500).json({
        error: "Error creating area",
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
      return res.status(500).json({
        error: "Error fetching areas",
      });
    }
  }
}