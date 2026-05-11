import ReactFlow, {
  Background,
  Controls,
  MiniMap,
} from "reactflow";

import type { ProcessNode } from "../types/process";

import { ProcessNodeCard } from "./ProcessNodeCard";

import "reactflow/dist/style.css";

interface ProcessFlowProps {
  processes: ProcessNode[];
}

const nodeTypes = {
  processNode: ProcessNodeCard,
};

export function ProcessFlow({
  processes,
}: ProcessFlowProps) {

  const nodes = processes.flatMap((process, index) => [
    {
      id: process.id,

      position: {
        x: 250,
        y: index * 260,
      },

      data: {
        label: process.name,
        status: process.status,
        priority: process.priority,
        tools: process.tools,
        responsibles: process.responsibles,
      },

      type: "processNode",
    },

    ...process.children.map((child, childIndex) => ({
      id: child.id,

      position: {
        x: 700,
        y: index * 260 + childIndex * 180,
      },

      data: {
        label: child.name,
        status: child.status,
        priority: child.priority,
        tools: child.tools,
        responsibles: child.responsibles,
      },

      type: "processNode",
    })),
  ]);

  const edges = processes.flatMap((process) =>
    process.children.map((child) => ({
      id: `${process.id}-${child.id}`,
      source: process.id,
      target: child.id,
      animated: true,
    }))
  );

  return (
    <div className="w-full h-[700px] rounded-2xl overflow-hidden border border-slate-800">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}