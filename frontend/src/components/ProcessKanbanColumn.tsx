import { FolderOpen } from "lucide-react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import type { ProcessNode } from "../types/process";
import { ProcessKanbanCard } from "./ProcessKanbanCard";

interface ProcessKanbanColumnProps {
  id: string;
  title: string;
  description: string;
  tone: string;
  processes: ProcessNode[];
  onSelectProcess: (process: ProcessNode) => void;
  onEditProcess: (process: ProcessNode) => void;
  onDeleteProcess: (id: string) => void;
}

export function ProcessKanbanColumn({
  id,
  title,
  description,
  tone,
  processes,
  onSelectProcess,
  onEditProcess,
  onDeleteProcess,
}: ProcessKanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <section
      ref={setNodeRef}
      className={`flex h-full min-h-[500px] w-[min(82vw,340px)] shrink-0 flex-col rounded-lg border bg-slate-50 shadow-sm transition duration-200 2xl:min-w-0 2xl:flex-1 2xl:shrink ${
        isOver
          ? "border-blue-300 bg-blue-50/70 ring-2 ring-blue-100"
          : "border-slate-200"
      }`}
    >
      <div className="shrink-0 border-b border-slate-200 p-3">
        <div className="min-w-0">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${tone}`} />
              <h3 className="truncate text-sm font-bold text-slate-950">
                {title}
              </h3>
            </div>
            <span className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-bold text-slate-600 shadow-sm">
              {processes.length}
            </span>
          </div>
          <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
            {description}
          </p>
        </div>
      </div>

      <SortableContext
        items={processes.map((process) => process.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3">
          {processes.length > 0 ? (
            processes.map((process) => (
              <ProcessKanbanCard
                key={process.id}
                process={process}
                onSelectProcess={onSelectProcess}
                onEditProcess={onEditProcess}
                onDeleteProcess={onDeleteProcess}
              />
            ))
          ) : (
            <div className="flex min-h-[180px] flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white/80 px-4 py-8 text-center text-sm text-slate-500">
              <FolderOpen className="mb-3 text-slate-300" size={28} />
              <p className="font-semibold text-slate-600">Sem tarefas aqui</p>
              <p className="mt-1 text-xs leading-5">
                Arraste cards para esta coluna quando o status mudar.
              </p>
            </div>
          )}
        </div>
      </SortableContext>
    </section>
  );
}
