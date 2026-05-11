import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

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
  currentProcessId?: string,
) {
  if (!payload.name?.trim()) {
    return "Informe o nome do processo.";
  }

  if (!payload.areaId) {
    return "Selecione a área responsável pelo processo.";
  }

  if (payload.status && !allowedStatuses.includes(payload.status)) {
    return "Status inválido para o processo.";
  }

  if (payload.priority && !allowedPriorities.includes(payload.priority)) {
    return "Prioridade inválida para o processo.";
  }

  if (
    payload.executionType &&
    !allowedExecutionTypes.includes(payload.executionType)
  ) {
    return "Tipo de execução inválido para o processo.";
  }

  const areaExists = await prisma.area.findUnique({
    where: { id: payload.areaId },
    select: { id: true },
  });

  if (!areaExists) {
    return "A área informada não existe.";
  }

  if (!payload.parentId) {
    return null;
  }

  if (payload.parentId === currentProcessId) {
    return "Um processo não pode ser subprocesso dele mesmo.";
  }

  const parent = await prisma.process.findUnique({
    where: { id: payload.parentId },
    select: { id: true, parentId: true },
  });

  if (!parent) {
    return "O processo pai informado não existe.";
  }

  // Ao editar, subimos pela cadeia de pais para impedir ciclos na árvore.
  let ancestorId = parent.parentId;

  while (ancestorId) {
    if (ancestorId === currentProcessId) {
      return "A alteração criaria um ciclo na hierarquia de processos.";
    }

    const ancestor = await prisma.process.findUnique({
      where: { id: ancestorId },
      select: { parentId: true },
    });

    ancestorId = ancestor?.parentId ?? null;
  }

  return null;
}

export class ProcessController {
  async create(req: Request, res: Response) {
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

      const validationError = await validateProcessPayload({
        name,
        areaId,
        parentId,
        status,
        priority,
        executionType,
      });

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
        error: "Erro ao buscar processos.",
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

      const processMap = new Map<string, ProcessTreeNode>();

      // Primeiro indexamos todos os processos por id para encontrar pais em O(1).
      processes.forEach((process) => {
        processMap.set(process.id, {
          ...process,
          children: [],
        });
      });

      const tree: ProcessTreeNode[] = [];

      // Depois conectamos cada processo ao seu parentId; sem parentId ele vira raiz.
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
        error: "Erro ao buscar árvore de processos.",
      });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = String(req.params.id);

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
        error: "Erro ao excluir processo.",
      });
    }
  }
}
