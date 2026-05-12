import { useState } from "react";
import {
  Bot,
  ChevronDown,
  ChevronRight,
  FileText,
  Hand,
  Layers3,
  Workflow,
} from "lucide-react";

import type { ProcessNode } from "../types/process";

interface ProcessTreeProps {
  processes: ProcessNode[];
  onSelectProcess: (process: ProcessNode) => void;
  depth?: number;
}

const executionLabels: Record<string, string> = {
  manual: "Manual",
  system: "Sistemico",
  hybrid: "Hibrido",
};

export function ProcessTree({
  processes,
  onSelectProcess,
  depth = 0,
}: ProcessTreeProps) {
  if (processes.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-500">
        Nenhum subprocesso vinculado.
      </div>
    );
  }

  return (
    <div className={depth === 0 ? "space-y-2" : "mt-2 space-y-2"}>
      {processes.map((process) => (
        <ProcessTreeItem
          key={process.id}
          process={process}
          onSelectProcess={onSelectProcess}
          depth={depth}
        />
      ))}
    </div>
  );
}

interface ProcessTreeItemProps {
  process: ProcessNode;
  onSelectProcess: (process: ProcessNode) => void;
  depth: number;
}

function ProcessTreeItem({
  process,
  onSelectProcess,
  depth,
}: ProcessTreeItemProps) {
  const [isOpen, setIsOpen] = useState(depth < 1);
  const hasChildren = process.children.length > 0;
  const ExecutionIcon = process.executionType === "system" ? Bot : Hand;

  return (
    <div className="min-w-0">
      <div
        className="group flex min-w-0 items-start gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-left shadow-sm transition duration-200 hover:border-sky-200 hover:bg-sky-50/50"
        style={{ marginLeft: depth > 0 ? Math.min(depth * 12, 48) : 0 }}
      >
        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md transition ${
            hasChildren
              ? "text-slate-500 hover:bg-white hover:text-sky-700"
              : "text-slate-300"
          }`}
          disabled={!hasChildren}
          title={hasChildren ? "Expandir subprocessos" : "Sem subprocessos"}
        >
          {hasChildren && isOpen ? (
            <ChevronDown size={16} />
          ) : (
            <ChevronRight size={16} />
          )}
        </button>

        <button
          type="button"
          onClick={() => onSelectProcess(process)}
          className="min-w-0 flex-1 text-left"
          title={process.name}
        >
          <span className="block break-words text-sm font-semibold leading-5 text-slate-900 [overflow-wrap:anywhere]">
            {process.name}
          </span>
          <span className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1">
              <ExecutionIcon size={13} />
              {executionLabels[process.executionType || ""] || "Processo"}
            </span>
            {hasChildren && (
              <span className="inline-flex items-center gap-1">
                <Layers3 size={13} />
                {process.children.length} subprocessos
              </span>
            )}
            {process.documentation && (
              <span className="inline-flex items-center gap-1">
                <FileText size={13} />
                Doc
              </span>
            )}
          </span>
        </button>

        <Workflow
          className="mt-1 shrink-0 text-slate-300 transition group-hover:text-sky-500"
          size={15}
        />
      </div>

      {hasChildren && isOpen && (
        <ProcessTree
          processes={process.children}
          onSelectProcess={onSelectProcess}
          depth={depth + 1}
        />
      )}
    </div>
  );
}
