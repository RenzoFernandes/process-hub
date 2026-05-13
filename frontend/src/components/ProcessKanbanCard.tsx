import {
  Bot,
  CalendarDays,
  Eye,
  GripVertical,
  Hand,
  Pencil,
  Trash2,
  UserRound,
} from "lucide-react";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import type { ButtonHTMLAttributes } from "react";

import type { ProcessNode } from "../types/process";

interface ProcessKanbanCardProps {
  process: ProcessNode;
  onSelectProcess: (process: ProcessNode) => void;
  onEditProcess: (process: ProcessNode) => void;
  onDeleteProcess: (id: string) => void;
}

interface ProcessKanbanCardBodyProps extends ProcessKanbanCardProps {
  dragHandleProps?: {
    attributes: ButtonHTMLAttributes<HTMLButtonElement>;
    listeners?: ButtonHTMLAttributes<HTMLButtonElement>;
  };
  isDragging?: boolean;
}

const priorityLabels: Record<string, string> = {
  low: "Baixa",
  medium: "Media",
  high: "Alta",
  critical: "Critica",
};

const priorityStyles: Record<string, string> = {
  low: "border-emerald-200 bg-emerald-50 text-emerald-700",
  medium: "border-blue-200 bg-blue-50 text-blue-700",
  high: "border-amber-200 bg-amber-50 text-amber-700",
  critical: "border-rose-200 bg-rose-50 text-rose-700",
};

const priorityAccent: Record<string, string> = {
  low: "bg-emerald-500",
  medium: "bg-blue-600",
  high: "bg-amber-500",
  critical: "bg-rose-600",
};

const executionLabels: Record<string, string> = {
  manual: "Manual",
  system: "Sistemico",
  hybrid: "Hibrido",
};

export function ProcessKanbanCard({
  process,
  onSelectProcess,
  onEditProcess,
  onDeleteProcess,
}: ProcessKanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: process.id });

  return (
    <article
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={`group relative overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm ring-1 ring-transparent transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg hover:ring-blue-100 ${
        isDragging ? "z-20 rotate-[0.5deg] opacity-80 shadow-2xl" : ""
      }`}
    >
      <ProcessKanbanCardBody
        process={process}
        onSelectProcess={onSelectProcess}
        onEditProcess={onEditProcess}
        onDeleteProcess={onDeleteProcess}
        dragHandleProps={{ attributes, listeners }}
      />
    </article>
  );
}

export function ProcessKanbanCardPreview({
  process,
  onSelectProcess,
  onEditProcess,
  onDeleteProcess,
}: ProcessKanbanCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-lg border border-blue-200 bg-white shadow-2xl ring-2 ring-blue-100">
      <ProcessKanbanCardBody
        process={process}
        onSelectProcess={onSelectProcess}
        onEditProcess={onEditProcess}
        onDeleteProcess={onDeleteProcess}
        isDragging
      />
    </article>
  );
}

function ProcessKanbanCardBody({
  process,
  onSelectProcess,
  onEditProcess,
  onDeleteProcess,
  dragHandleProps,
  isDragging = false,
}: ProcessKanbanCardBodyProps) {
  const ExecutionIcon = process.executionType === "system" ? Bot : Hand;
  const priority = process.priority || "medium";
  const priorityStyle = priorityStyles[priority] || priorityStyles.medium;
  const accent = priorityAccent[priority] || priorityAccent.medium;

  return (
    <>
      <div className={`absolute inset-y-0 left-0 w-1 ${accent}`} />

      <div className="p-4 pl-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <button
            type="button"
            onClick={() => onSelectProcess(process)}
            className="min-w-0 flex-1 text-left"
          >
            <h3 className="break-words text-sm font-semibold leading-5 text-slate-950 [overflow-wrap:anywhere]">
              {process.name}
            </h3>
          </button>

          <button
            type="button"
            className="shrink-0 rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            title="Arrastar processo"
            disabled={!dragHandleProps}
            {...dragHandleProps?.attributes}
            {...dragHandleProps?.listeners}
          >
            <GripVertical size={16} />
          </button>
        </div>

        <p className="mb-4 line-clamp-2 min-h-[40px] text-sm leading-5 text-slate-600">
          {process.description || "Sem descricao curta cadastrada."}
        </p>

        <div className="mb-4 flex flex-wrap gap-2">
          <span
            className={`rounded-md border px-2 py-1 text-xs font-semibold ${priorityStyle}`}
          >
            {priorityLabels[priority] || "Media"}
          </span>
          <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-600">
            <ExecutionIcon size={13} />
            {executionLabels[process.executionType || ""] || "Manual"}
          </span>
        </div>

        <div className="space-y-2 text-xs text-slate-500">
          <p className="flex items-center gap-2">
            <UserRound size={14} className="shrink-0 text-slate-400" />
            <span className="truncate">
              {process.responsibles || "Responsavel nao informado"}
            </span>
          </p>
          <p className="flex items-center gap-2">
            <CalendarDays size={14} className="shrink-0 text-slate-400" />
            <span>{formatDate(process.updatedAt || process.createdAt)}</span>
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
          <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-500">
            {process.children.length} sub
          </span>

          <div className="flex items-center gap-1 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
            <button
              type="button"
              onClick={() => onSelectProcess(process)}
              className="rounded-md p-1.5 text-slate-500 transition hover:bg-blue-50 hover:text-blue-700"
              title="Ver detalhes"
            >
              <Eye size={15} />
            </button>
            <button
              type="button"
              onClick={() => onEditProcess(process)}
              className="rounded-md p-1.5 text-slate-500 transition hover:bg-blue-50 hover:text-blue-700"
              title="Editar processo"
            >
              <Pencil size={15} />
            </button>
            <button
              type="button"
              onClick={() => onDeleteProcess(process.id)}
              className="rounded-md p-1.5 text-slate-500 transition hover:bg-rose-50 hover:text-rose-700"
              title="Excluir processo"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      </div>
      {isDragging && (
        <div className="pointer-events-none absolute inset-0 rounded-lg bg-blue-50/10" />
      )}
    </>
  );
}

function formatDate(value?: string) {
  if (!value) return "Data nao informada";

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}
