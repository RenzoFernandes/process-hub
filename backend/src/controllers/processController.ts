import { Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthenticatedRequest } from "../types/auth";

type ProcessTreeNode = Awaited<
  ReturnType<typeof prisma.process.findMany>
>[number] & {
  children: ProcessTreeNode[];
};

const allowedStatuses = ["open", "in_progress", "review", "closed"];
const allowedPriorities = ["low", "medium", "high", "critical"];
const allowedExecutionTypes = ["manual", "system", "hybrid"];

async function validateProcessPayload(
  payload: {
    name?: string;
    areaId?: string;
    parentId?: string | null;
    status?: string | null;
    priority?: string | null;
    executionType?: string | null;
  },
  organizationId: string,
  currentProcessId?: string,
) {
  if (!payload.name?.trim()) {
    return "Informe o nome do processo.";
  }

  if (!payload.areaId) {
    return "Selecione a area responsavel pelo processo.";
  }

  if (payload.status && !allowedStatuses.includes(payload.status)) {
    return "Status invalido para o processo.";
  }

  if (payload.priority && !allowedPriorities.includes(payload.priority)) {
    return "Prioridade invalida para o processo.";
  }

  if (
    payload.executionType &&
    !allowedExecutionTypes.includes(payload.executionType)
  ) {
    return "Tipo de execucao invalido para o processo.";
  }

  const areaExists = await prisma.area.findFirst({
    where: {
      id: payload.areaId,
      organizationId,
    },
    select: { id: true },
  });

  if (!areaExists) {
    return "A area informada nao existe neste workspace.";
  }

  if (!payload.parentId) {
    return null;
  }

  if (payload.parentId === currentProcessId) {
    return "Um processo nao pode ser subprocesso dele mesmo.";
  }

  const parent = await prisma.process.findFirst({
    where: {
      id: payload.parentId,
      organizationId,
    },
    select: { id: true, parentId: true },
  });

  if (!parent) {
    return "O processo pai informado nao existe neste workspace.";
  }

  let ancestorId = parent.parentId;

  while (ancestorId) {
    if (ancestorId === currentProcessId) {
      return "A alteracao criaria um ciclo na hierarquia de processos.";
    }

    const ancestor = await prisma.process.findFirst({
      where: {
        id: ancestorId,
        organizationId,
      },
      select: { parentId: true },
    });

    ancestorId = ancestor?.parentId ?? null;
  }

  return null;
}

async function collectDescendantIds(
  id: string,
  organizationId: string,
): Promise<string[]> {
  const children = await prisma.process.findMany({
    where: {
      parentId: id,
      organizationId,
    },
    select: { id: true },
  });

  const descendantIds = await Promise.all(
    children.map((child) => collectDescendantIds(child.id, organizationId)),
  );

  return children.flatMap((child, index) => [
    ...descendantIds[index],
    child.id,
  ]);
}

export class ProcessController {
  async create(req: AuthenticatedRequest, res: Response) {
    try {
      const {
        name,
        description,
        status,
        priority,
        executionType,
        tools,
        responsibles,
        documentation,
        areaId,
        parentId,
      } = req.body;

      const validationError = await validateProcessPayload(
        {
          name,
          areaId,
          parentId,
          status,
          priority,
          executionType,
        },
        req.user.organizationId,
      );

      if (validationError) {
        return res.status(400).json({ error: validationError });
      }

      const process = await prisma.process.create({
        data: {
          name,
          description,
          status,
          priority,
          executionType,
          tools,
          responsibles,
          documentation,
          areaId,
          parentId,
          organizationId: req.user.organizationId,
        },
      });

      return res.status(201).json(process);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        error: "Erro ao criar processo.",
      });
    }
  }

  async list(req: AuthenticatedRequest, res: Response) {
    try {
      const processes = await prisma.process.findMany({
        where: {
          organizationId: req.user.organizationId,
        },
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
        error: "Erro ao buscar processos.",
      });
    }
  }

  async tree(req: AuthenticatedRequest, res: Response) {
    try {
      const processes = await prisma.process.findMany({
        where: {
          organizationId: req.user.organizationId,
        },
        include: {
          area: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      const processMap = new Map<string, ProcessTreeNode>();

      processes.forEach((process) => {
        processMap.set(process.id, {
          ...process,
          children: [],
        });
      });

      const tree: ProcessTreeNode[] = [];

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
        error: "Erro ao buscar arvore de processos.",
      });
    }
  }

  async update(req: AuthenticatedRequest, res: Response) {
    try {
      const id = String(req.params.id);

      const existingProcess = await prisma.process.findFirst({
        where: {
          id,
          organizationId: req.user.organizationId,
        },
        select: { id: true },
      });

      if (!existingProcess) {
        return res.status(404).json({ error: "Processo nao encontrado." });
      }

      const {
        name,
        description,
        status,
        priority,
        executionType,
        tools,
        responsibles,
        documentation,
        areaId,
        parentId,
      } = req.body;

      const validationError = await validateProcessPayload(
        {
          name,
          areaId,
          parentId,
          status,
          priority,
          executionType,
        },
        req.user.organizationId,
        id,
      );

      if (validationError) {
        return res.status(400).json({ error: validationError });
      }

      const process = await prisma.process.update({
        where: { id },
        data: {
          name,
          description,
          status,
          priority,
          executionType,
          tools,
          responsibles,
          documentation,
          areaId,
          parentId,
        },
      });

      return res.json(process);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        error: "Erro ao atualizar processo.",
      });
    }
  }

  async delete(req: AuthenticatedRequest, res: Response) {
    try {
      const id = String(req.params.id);
      const process = await prisma.process.findFirst({
        where: {
          id,
          organizationId: req.user.organizationId,
        },
        select: { id: true },
      });

      if (!process) {
        return res.status(404).json({ error: "Processo nao encontrado." });
      }

      const descendantIds = await collectDescendantIds(
        id,
        req.user.organizationId,
      );

      await prisma.$transaction([
        prisma.process.deleteMany({
          where: {
            id: { in: descendantIds },
            organizationId: req.user.organizationId,
          },
        }),
        prisma.process.delete({
          where: { id },
        }),
      ]);

      return res.status(204).send();
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        error: "Erro ao excluir processo.",
      });
    }
  }
}
