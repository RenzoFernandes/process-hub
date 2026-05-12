import {
  Bot,
  ChevronDown,
  Eye,
  FileText,
  Hand,
  Layers3,
  Pencil,
  Trash2,
  UserRound,
  Wrench,
} from "lucide-react";
import type { ReactElement } from "react";
import { useState } from "react";

import type { ProcessNode } from "../types/process";
import { ProcessTree } from "./ProcessTree";

interface ProcessExplorerCardProps {
  process: ProcessNode;
  onSelectProcess: (process: ProcessNode) => void;
  onEditProcess: (process: ProcessNode) => void;
  onDeleteProcess: (id: string) => void;
}

const statusLabels: Record<string, string> = {
  open: "Aberto",
  in_progress: "Em andamento",
  review: "Em revisao",
  closed: "Fechado",
  active: "Ativo",
  mapped: "Mapeado",
};

const priorityLabels: Record<string, string> = {
  low: "Baixa",
  medium: "Media",
  high: "Alta",
  critical: "Critica",
};

const executionLabels: Record<string, string> = {
  manual: "Manual",
  system: "Sistemico",
  hybrid: "Hibrido",
};

const priorityStyles: Record<string, string> = {
  low: "border-emerald-200 bg-emerald-50 text-emerald-700",
  medium: "border-sky-200 bg-sky-50 text-sky-700",
  high: "border-amber-200 bg-amber-50 text-amber-700",
  critical: "border-rose-200 bg-rose-50 text-rose-700",
};

const priorityAccent: Record<string, string> = {
  low: "bg-emerald-500",
  medium: "bg-sky-600",
  high: "bg-amber-500",
  critical: "bg-rose-600",
};

export function ProcessExplorerCard({
  process,
  onSelectProcess,
  onEditProcess,
  onDeleteProcess,
}: ProcessExplorerCardProps) {
  const [showSubprocesses, setShowSubprocesses] = useState(
    process.children.length > 0,
  );
  const ExecutionIcon = process.executionType === "system" ? Bot : Hand;
  const descendantCount = countDescendants(process);
  const priorityStyle =
    priorityStyles[process.priority || ""] || priorityStyles.medium;
  const accent = priorityAccent[process.priority || ""] || priorityAccent.medium;

  return (
    <article className="group relative overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-md">
      <div className={`absolute inset-x-0 top-0 h-1 ${accent}`} />

      <div className="p-4">
        <div className="mb-3 flex items-start justify-between gap-3">
          <button
            type="button"
            onClick={() => onSelectProcess(process)}
            className="min-w-0 flex-1 text-left"
          >
            <span className="mb-2 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
              <span className="inline-flex items-center gap-1 rounded-md bg-slate-50 px-2 py-1">
                <ExecutionIcon size={14} />
                {executionLabels[process.executionType || ""] || "Processo"}
              </span>
              <span className="inline-flex items-center gap-1 rounded-md bg-slate-50 px-2 py-1">
                <Layers3 size={14} />
                {descendantCount} subprocessos
              </span>
            </span>
            <h3 className="break-words text-base font-semibold leading-6 text-slate-950 [overflow-wrap:anywhere]">
              {process.name}
            </h3>
          </button>

          <div className="flex shrink-0 items-center gap-1 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
            <button
              type="button"
              onClick={() => onSelectProcess(process)}
              className="rounded-md p-1.5 text-slate-500 transition hover:bg-sky-50 hover:text-sky-700"
              title="Ver detalhes"
            >
              <Eye size={16} />
            </button>
            <button
              type="button"
              onClick={() => onEditProcess(process)}
              className="rounded-md p-1.5 text-slate-500 transition hover:bg-sky-50 hover:text-sky-700"
              title="Editar processo"
            >
              <Pencil size={16} />
            </button>
            <button
              type="button"
              onClick={() => onDeleteProcess(process.id)}
              className="rounded-md p-1.5 text-slate-500 transition hover:bg-rose-50 hover:text-rose-700"
              title="Excluir processo"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        <div className="mb-3 flex flex-wrap gap-2">
          <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-medium text-slate-700">
            {statusLabels[process.status || ""] || process.status || "Aberto"}
          </span>
          <span className={`rounded-md border px-2 py-1 text-xs font-medium ${priorityStyle}`}>
            Prioridade {priorityLabels[process.priority || ""] || "Media"}
          </span>
        </div>

        {process.description && (
          <p className="mb-3 line-clamp-3 text-sm leading-5 text-slate-600">
            {process.description}
          </p>
        )}

        <div className="space-y-2 rounded-lg border border-slate-100 bg-slate-50/70 p-3 text-sm text-slate-600">
          <ProcessMeta icon={<UserRound size={15} />} value={process.responsibles} fallback="Responsaveis nao informados" />
          <ProcessMeta icon={<Wrench size={15} />} value={process.tools} fallback="Ferramentas nao informadas" />
          <ProcessMeta icon={<FileText size={15} />} value={process.documentation} fallback="Documentacao nao informada" />
        </div>

        {process.children.length > 0 && (
          <div className="mt-4 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={() => setShowSubprocesses((current) => !current)}
              className="mb-2 flex w-full items-center justify-between gap-3 rounded-md px-1 py-1 text-left transition hover:bg-slate-50"
              title={showSubprocesses ? "Reduzir subprocessos" : "Ampliar subprocessos"}
            >
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Subprocessos
              </span>
              <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                {process.children.length}
              </span>
              <ChevronDown
                className={`shrink-0 text-slate-400 transition ${
                  showSubprocesses ? "rotate-180" : ""
                }`}
                size={15}
              />
            </button>

            {showSubprocesses && (
              <ProcessTree
                processes={process.children}
                onSelectProcess={onSelectProcess}
              />
            )}
          </div>
        )}
      </div>
    </article>
  );
}

interface ProcessMetaProps {
  icon: ReactElement;
  value?: string;
  fallback: string;
}

function ProcessMeta({ icon, value, fallback }: ProcessMetaProps) {
  return (
    <p className={`flex gap-2 ${value ? "text-slate-600" : "text-slate-400"}`}>
      <span className="mt-0.5 shrink-0 text-sky-600">{icon}</span>
      <span className="min-w-0 break-words [overflow-wrap:anywhere]">
        {value || fallback}
      </span>
    </p>
  );
}

function countDescendants(process: ProcessNode): number {
  return process.children.reduce(
    (total, child) => total + 1 + countDescendants(child),
    0,
  );
}
