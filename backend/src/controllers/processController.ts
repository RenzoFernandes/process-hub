import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export class ProcessController {
  async create(req: Request, res: Response) {
    try {
      const { name, description, status, priority, areaId, parentId } =
        req.body;

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

  async tree(req: Request, res: Response) {
    try {
      const processes = await prisma.process.findMany({
        include: {
          area: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      const processMap = new Map();

      processes.forEach((process) => {
        processMap.set(process.id, {
          ...process,
          children: [],
        });
      });

      const tree: any[] = [];

      processMap.forEach((process) => {
        if (process.parentId) {
          const parent = processMap.get(process.parentId);

          if (parent) {
            parent.children.push(process);
          }
        } else {
          tree.push(process);
        }
      });

      return res.json(tree);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        error: "Error fetching process tree",
      });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const { name, description, status, priority, areaId, parentId } =
        req.body;

      const process = await prisma.process.update({
        where: { id },
        data: {
          name,
          description,
          status,
          priority,
          areaId,
          parentId,
        },
      });

      return res.json(process);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        error: "Error updating process",
      });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = String(req.params.id);

      await prisma.process.delete({
        where: { id },
      });

      return res.status(204).send();
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        error: "Error deleting process",
      });
    }
  }
}
