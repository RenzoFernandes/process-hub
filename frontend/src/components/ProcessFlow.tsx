import ReactFlow, {
  Background,
  Controls,
  MiniMap,
} from "reactflow";

import "reactflow/dist/style.css";

export function ProcessFlow() {
  const nodes = [
    {
      id: "1",
      position: { x: 250, y: 100 },
      data: {
        label: "Recrutamento e Seleção",
      },
      type: "default",
    },
    {
      id: "2",
      position: { x: 250, y: 250 },
      data: {
        label: "Triagem de Currículos",
      },
      type: "default",
    },
  ];

  const edges = [
    {
      id: "e1-2",
      source: "1",
      target: "2",
      animated: true,
    },
  ];

  return (
    <div className="w-full h-[700px] rounded-2xl overflow-hidden border border-slate-800">
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}