import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

import type { ProcessNode } from "../types/process";
import { ProcessExplorerCard } from "./ProcessExplorerCard";

interface ProcessKanbanColumnProps {
  title: string;
  description: string;
  tone: string;
  processes: ProcessNode[];
  onSelectProcess: (process: ProcessNode) => void;
  onEditProcess: (process: ProcessNode) => void;
  onDeleteProcess: (id: string) => void;
}

export function ProcessKanbanColumn({
  title,
  description,
  tone,
  processes,
  onSelectProcess,
  onEditProcess,
  onDeleteProcess,
}: ProcessKanbanColumnProps) {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  function scrollCards(direction: "left" | "right") {
    scrollContainerRef.current?.scrollBy({
      left: direction === "left" ? -380 : 380,
      behavior: "smooth",
    });
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-slate-50 p-3 shadow-sm">
      <div className="mb-3 flex flex-col gap-3 border-b border-slate-200 pb-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${tone}`} />
            <h3 className="text-sm font-semibold text-slate-950">{title}</h3>
          </div>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            {description}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-600 shadow-sm">
            {processes.length}
          </span>

          <div className="hidden items-center gap-1 md:flex">
            <button
              type="button"
              onClick={() => scrollCards("left")}
              className="rounded-md border border-slate-200 bg-white p-1.5 text-slate-500 shadow-sm transition hover:border-sky-200 hover:text-sky-700"
              title="Ver processos anteriores"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={() => scrollCards("right")}
              className="rounded-md border border-slate-200 bg-white p-1.5 text-slate-500 shadow-sm transition hover:border-sky-200 hover:text-sky-700"
              title="Ver proximos processos"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex snap-x gap-3 overflow-x-auto pb-2"
      >
        {processes.length > 0 ? (
          processes.map((process) => (
            <div
              key={process.id}
              className="w-[300px] shrink-0 snap-start sm:w-[340px]"
            >
              <ProcessExplorerCard
                process={process}
                onSelectProcess={onSelectProcess}
                onEditProcess={onEditProcess}
                onDeleteProcess={onDeleteProcess}
              />
            </div>
          ))
        ) : (
          <div className="min-w-full rounded-lg border border-dashed border-slate-300 bg-white px-4 py-8 text-center text-sm text-slate-500">
            Nenhum processo nesta etapa.
          </div>
        )}
      </div>
    </section>
  );
}
