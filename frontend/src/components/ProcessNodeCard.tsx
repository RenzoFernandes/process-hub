import { Handle, Position } from "reactflow";

import {
  Bot,
  ClipboardList,
  FileText,
  Hand,
  Pencil,
  Trash2,
  UserRound,
  Wrench,
} from "lucide-react";

interface ProcessNodeCardProps {
  data: {
    label: string;
    status?: string;
    priority?: string;
    executionType?: string;
    tools?: string;
    responsibles?: string;
    onEdit?: () => void;
    onDelete?: () => void;
    description?: string;
    documentation?: string;
  };
}

const statusLabels: Record<string, string> = {
  open: "Aberto",
  in_progress: "Em andamento",
  review: "Em revisão",
  closed: "Fechado",
  active: "Ativo",
  mapped: "Mapeado",
};

const priorityLabels: Record<string, string> = {
  low: "Baixa",
  medium: "Média",
  high: "Alta",
  critical: "Crítica",
};

const executionLabels: Record<string, string> = {
  manual: "Manual",
  system: "Sistêmico",
  hybrid: "Híbrido",
};

const priorityStyles: Record<
  string,
  {
    card: string;
    handle: string;
    badge: string;
    accent: string;
  }
> = {
  low: {
    card: "border-emerald-200 hover:border-emerald-300",
    handle: "!bg-emerald-600",
    badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
    accent: "bg-emerald-500",
  },
  medium: {
    card: "border-sky-200 hover:border-sky-300",
    handle: "!bg-sky-700",
    badge: "border-sky-200 bg-sky-50 text-sky-700",
    accent: "bg-sky-600",
  },
  high: {
    card: "border-amber-200 hover:border-amber-300",
    handle: "!bg-amber-600",
    badge: "border-amber-200 bg-amber-50 text-amber-700",
    accent: "bg-amber-500",
  },
  critical: {
    card: "border-rose-200 hover:border-rose-300",
    handle: "!bg-rose-700",
    badge: "border-rose-200 bg-rose-50 text-rose-700",
    accent: "bg-rose-600",
  },
};

const defaultPriorityStyle = priorityStyles.medium;

export function ProcessNodeCard({ data }: ProcessNodeCardProps) {
  const ExecutionIcon = data.executionType === "system" ? Bot : Hand;
  const priorityStyle =
    priorityStyles[data.priority || ""] || defaultPriorityStyle;

  return (
    <div
      className={`relative w-[280px] overflow-visible rounded-lg border bg-white p-3 shadow-sm transition hover:shadow-md sm:w-[320px] sm:p-4 ${priorityStyle.card}`}
    >
      <div className={`absolute inset-x-0 top-0 h-1 ${priorityStyle.accent}`} />

      <Handle
        type="target"
        position={Position.Left}
        className={`!left-[-9px] !h-4 !w-4 !border-2 !border-white ${priorityStyle.handle}`}
      />
      <Handle
        type="source"
        position={Position.Right}
        className={`!right-[-9px] !h-4 !w-4 !border-2 !border-white ${priorityStyle.handle}`}
      />

      <div className="mb-3 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-500">
            <ExecutionIcon size={15} />
            {executionLabels[data.executionType || ""] || "Processo"}
          </div>

          <h3 className="break-words text-base font-semibold leading-6 text-slate-950 [overflow-wrap:anywhere]">
            {data.label}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {data.onEdit && (
            <button
              onClick={data.onEdit}
              className="rounded-md p-1.5 text-slate-500 transition hover:bg-sky-50 hover:text-sky-700"
              title="Editar processo"
            >
              <Pencil size={16} />
            </button>
          )}

          {data.onDelete && (
            <button
              onClick={data.onDelete}
              className="rounded-md p-1.5 text-slate-500 transition hover:bg-rose-50 hover:text-rose-700"
              title="Excluir processo"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        {data.status && (
          <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-medium text-slate-700">
            {statusLabels[data.status] || data.status}
          </span>
        )}

        {data.priority && (
          <span
            className={`rounded-md border px-2 py-1 text-xs font-medium ${priorityStyle.badge}`}
          >
            Prioridade {priorityLabels[data.priority] || data.priority}
          </span>
        )}
      </div>

      {data.description && (
        <p className="mb-3 text-sm leading-5 text-slate-600">
          {data.description}
        </p>
      )}

      {data.tools && (
        <p className="mb-2 flex gap-2 text-sm text-slate-600">
          <Wrench className="mt-0.5 shrink-0 text-sky-600" size={15} />
          <span className="min-w-0 break-words [overflow-wrap:anywhere]">
            {data.tools}
          </span>
        </p>
      )}

      {data.responsibles && (
        <p className="mb-2 flex gap-2 text-sm text-slate-600">
          <UserRound className="mt-0.5 shrink-0 text-violet-600" size={15} />
          <span className="min-w-0 break-words [overflow-wrap:anywhere]">
            {data.responsibles}
          </span>
        </p>
      )}

      {data.documentation && (
        <p className="flex gap-2 text-sm text-slate-600">
          <FileText className="mt-0.5 shrink-0 text-slate-500" size={15} />
          <span className="min-w-0 break-words [overflow-wrap:anywhere]">
            {data.documentation}
          </span>
        </p>
      )}

      {!data.tools && !data.responsibles && !data.documentation && (
        <p className="flex gap-2 text-sm text-slate-400">
          <ClipboardList className="mt-0.5 shrink-0" size={15} />
          Detalhes ainda não informados
        </p>
      )}
    </div>
  );
}
