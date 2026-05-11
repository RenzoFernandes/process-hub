import ReactFlow, { Background, Controls, MiniMap } from "reactflow";

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

export function ProcessFlow({
  processes,
  onDeleteProcess,
  onEditProcess,
}: ProcessFlowProps) {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  function buildFlow(
    process: ProcessNode,
    depth: number,
    index: number,
    parentId?: string,
  ) {
    nodes.push({
      id: process.id,
      position: {
        x: depth * 420,
        y: index * 220,
      },
      data: {
        label: process.name,
        description: process.description,
        status: process.status,
        priority: process.priority,
        tools: process.tools,
        responsibles: process.responsibles,
        documentation: process.documentation,
        onEdit: () => onEditProcess(process),
        onDelete: () => onDeleteProcess(process.id),
      },
      type: "processNode",
    });

    if (parentId) {
      edges.push({
        id: `${parentId}-${process.id}`,
        source: parentId,
        target: process.id,
        animated: true,
      });
    }

    process.children.forEach((child, childIndex) => {
      buildFlow(child, depth + 1, index + childIndex + 1, process.id);
    });
  }

  processes.forEach((process, index) => {
    buildFlow(process, 0, index);
  });

  return (
    <div className="w-full h-[700px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-950/80">
      <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} fitView>
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}
