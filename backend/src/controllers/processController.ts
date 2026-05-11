import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export class ProcessController {
  async create(req: Request, res: Response) {
    try {
      const { name, description, status, priority, areaId, parentId } = req.body;

      const process = await prisma.process.create({
        data: {
          name,
          description,
          status,
          priority,
          areaId,
          parentId,
        },
      });

      return res.status(201).json(process);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        error: "Error creating process",
      });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const processes = await prisma.process.findMany({
        include: {
          area: true,
          parent: true,
          children: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return res.json(processes);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        error: "Error fetching processes",
      });
    }
  }
}