import ReactFlow, {
  Background,
  Controls,
  MarkerType,
  MiniMap,
  Panel,
  Position,
} from "reactflow";

import type { Edge, Node } from "reactflow";
import type { ProcessNode } from "../types/process";

import { ProcessNodeCard } from "./ProcessNodeCard";

import "reactflow/dist/style.css";

interface ProcessFlowProps {
  processes: ProcessNode[];
  onDeleteProcess: (id: string) => void;
  onEditProcess: (process: ProcessNode) => void;
}

const nodeTypes = {
  processNode: ProcessNodeCard,
};

const horizontalSpacing = 500;
const verticalSpacing = 250;

const priorityColors: Record<string, string> = {
  low: "#059669",
  medium: "#0284c7",
  high: "#d97706",
  critical: "#be123c",
};

function getPriorityColor(priority?: string) {
  return priorityColors[priority || ""] || priorityColors.medium;
}

export function ProcessFlow({
  processes,
  onDeleteProcess,
  onEditProcess,
}: ProcessFlowProps) {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  let currentY = 0;

  // O frontend recebe uma árvore pronta do backend e a transforma em nós/arestas.
  // A posição é calculada recursivamente para manter filhos alinhados ao pai.
  function buildTree(
    process: ProcessNode,
    depth: number,
    parentId?: string,
  ): number {
    const childrenYPositions = process.children.map((child) =>
      buildTree(child, depth + 1, process.id),
    );

    let yPosition: number;

    if (childrenYPositions.length > 0) {
      const firstChildY = childrenYPositions[0];
      const lastChildY = childrenYPositions[childrenYPositions.length - 1];
      yPosition = (firstChildY + lastChildY) / 2;
    } else {
      yPosition = currentY;
      currentY += verticalSpacing;
    }

    nodes.push({
      id: process.id,
      type: "processNode",
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      position: {
        x: depth * horizontalSpacing,
        y: yPosition,
      },
      data: {
        label: process.name,
        description: process.description,
        status: process.status,
        priority: process.priority,
        executionType: process.executionType,
        tools: process.tools,
        responsibles: process.responsibles,
        documentation: process.documentation,
        onEdit: () => onEditProcess(process),
        onDelete: () => onDeleteProcess(process.id),
      },
    });

    if (parentId) {
      const edgeColor = getPriorityColor(process.priority);

      edges.push({
        id: `${parentId}-${process.id}`,
        source: parentId,
        target: process.id,
        type: "smoothstep",
        animated: false,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: edgeColor,
          width: 24,
          height: 24,
        },
        style: {
          stroke: edgeColor,
          strokeWidth: 3,
        },
        zIndex: 10,
      });
    }

    return yPosition;
  }

  processes.forEach((process, index) => {
    if (index > 0) {
      currentY += verticalSpacing;
    }

    buildTree(process, 0);
  });

  if (processes.length === 0) {
    return (
      <div className="flex min-h-[320px] items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white p-6 sm:min-h-[420px]">
        <div className="max-w-md text-center">
          <h3 className="text-lg font-semibold text-slate-950">
            Nenhum processo mapeado
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Cadastre uma área e depois crie o primeiro processo. Ele aparecerá
            aqui como uma cadeia visual com seus subprocessos.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[560px] w-full touch-none overflow-hidden rounded-lg border border-slate-200 bg-white sm:h-[680px] lg:h-[760px]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.18 }}
        minZoom={0.25}
        maxZoom={1.6}
        panOnDrag
        panOnScroll={false}
        zoomOnPinch
        zoomOnScroll
        zoomOnDoubleClick
        preventScrolling
      >
        <Panel position="top-left">
          <div className="max-w-[240px] rounded-lg border border-slate-200 bg-white/95 px-3 py-2 text-xs font-medium leading-5 text-slate-600 shadow-sm sm:max-w-none sm:text-sm">
            Arraste, aproxime e navegue pela cadeia de processos
          </div>
        </Panel>
        <MiniMap
          className="hidden sm:block"
          maskColor="rgba(15, 23, 42, 0.08)"
          nodeColor={(node) => getPriorityColor(node.data?.priority)}
          pannable
          zoomable
        />
        <Controls />
        <Background color="#cbd5e1" gap={22} />
      </ReactFlow>
    </div>
  );
}
