import {
  Bot,
  CalendarClock,
  FileText,
  Hand,
  Layers3,
  Pencil,
  Trash2,
  UserRound,
  Wrench,
  X,
} from "lucide-react";
import type { ReactElement } from "react";

import type { ProcessNode } from "../types/process";
import { ProcessTree } from "./ProcessTree";

interface ProcessDetailsDrawerProps {
  process: ProcessNode;
  onClose: () => void;
  onEditProcess: (process: ProcessNode) => void;
  onDeleteProcess: (id: string) => void;
  onSelectProcess: (process: ProcessNode) => void;
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

export function ProcessDetailsDrawer({
  process,
  onClose,
  onEditProcess,
  onDeleteProcess,
  onSelectProcess,
}: ProcessDetailsDrawerProps) {
  const ExecutionIcon = process.executionType === "system" ? Bot : Hand;
  const descendants = flattenChildren(process);
  const priorityStyle =
    priorityStyles[process.priority || ""] || priorityStyles.medium;

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-slate-950/40 backdrop-blur-sm">
      <button
        type="button"
        className="hidden flex-1 cursor-default lg:block"
        onClick={onClose}
        aria-label="Fechar detalhes"
      />

      <aside className="flex h-full w-full max-w-2xl flex-col border-l border-slate-200 bg-white shadow-2xl transition duration-300">
        <header className="border-b border-slate-200 px-4 py-4 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="mb-2 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide text-sky-700">
                <span className="inline-flex items-center gap-1">
                  <ExecutionIcon size={14} />
                  {executionLabels[process.executionType || ""] || "Processo"}
                </span>
                <span>{process.area?.name || "Area nao informada"}</span>
              </p>
              <h2 className="break-words text-xl font-bold leading-7 text-slate-950 [overflow-wrap:anywhere] sm:text-2xl">
                {process.name}
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-950"
              title="Fechar"
            >
              <X size={18} />
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-medium text-slate-700">
              {statusLabels[process.status || ""] || process.status || "Aberto"}
            </span>
            <span className={`rounded-md border px-2 py-1 text-xs font-medium ${priorityStyle}`}>
              Prioridade {priorityLabels[process.priority || ""] || "Media"}
            </span>
            <span className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700">
              {descendants.length} subprocessos
            </span>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6">
          <section className="mb-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <h3 className="text-sm font-semibold text-slate-950">Resumo</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {process.description || "Descricao ainda nao informada."}
            </p>
          </section>

          <section className="mb-5 grid gap-3 sm:grid-cols-2">
            <DetailItem icon={<UserRound size={17} />} label="Responsaveis" value={process.responsibles} />
            <DetailItem icon={<Wrench size={17} />} label="Ferramentas" value={process.tools} />
            <DetailItem icon={<FileText size={17} />} label="Documentacao" value={process.documentation} />
            <DetailItem icon={<Layers3 size={17} />} label="Subprocessos" value={`${descendants.length}`} />
          </section>

          <section className="mb-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-slate-950">
                Arvore hierarquica
              </h3>
              <Layers3 className="text-slate-400" size={18} />
            </div>
            <ProcessTree
              processes={process.children}
              onSelectProcess={onSelectProcess}
            />
          </section>

          <section>
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-slate-950">
                Timeline operacional
              </h3>
              <CalendarClock className="text-slate-400" size={18} />
            </div>

            <div className="space-y-3">
              {[process, ...descendants].map((item, index) => (
                <div key={item.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full border border-sky-200 bg-sky-50 text-xs font-semibold text-sky-700">
                      {index + 1}
                    </span>
                    {index < descendants.length && (
                      <span className="h-full min-h-5 w-px bg-slate-200" />
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => onSelectProcess(item)}
                    className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-left transition hover:border-sky-200 hover:bg-sky-50/60"
                  >
                    <span className="block break-words text-sm font-semibold text-slate-900 [overflow-wrap:anywhere]">
                      {item.name}
                    </span>
                    <span className="mt-1 block text-xs text-slate-500">
                      {statusLabels[item.status || ""] || item.status || "Aberto"}
                    </span>
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        <footer className="flex flex-col gap-2 border-t border-slate-200 p-4 sm:flex-row sm:justify-end sm:px-6">
          <button
            type="button"
            onClick={() => onEditProcess(process)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700"
          >
            <Pencil size={16} />
            Editar processo
          </button>
          <button
            type="button"
            onClick={() => onDeleteProcess(process.id)}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-rose-200 bg-white px-4 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-50"
          >
            <Trash2 size={16} />
            Excluir
          </button>
        </footer>
      </aside>
    </div>
  );
}

interface DetailItemProps {
  icon: ReactElement;
  label: string;
  value?: string;
}

function DetailItem({ icon, label, value }: DetailItemProps) {
  return (
    <div className="min-w-0 rounded-lg border border-slate-200 bg-white p-3">
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        <span className="text-sky-700">{icon}</span>
        {label}
      </div>
      <p className="break-words text-sm leading-5 text-slate-700 [overflow-wrap:anywhere]">
        {value || "Nao informado"}
      </p>
    </div>
  );
}

function flattenChildren(process: ProcessNode): ProcessNode[] {
  return process.children.flatMap((child) => [
    child,
    ...flattenChildren(child),
  ]);
}
