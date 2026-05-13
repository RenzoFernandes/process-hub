import {
  BarChart3,
  Building2,
  FolderKanban,
  Layers3,
  Network,
  Search,
} from "lucide-react";
import type { ReactElement } from "react";

import type { Area, ProcessNode } from "../types/process";
import { ProcessDetailsDrawer } from "./ProcessDetailsDrawer";
import { ProcessKanbanBoard } from "./ProcessKanbanBoard";

interface ProcessExplorerProps {
  areas: Area[];
  processes: ProcessNode[];
  allProcesses: ProcessNode[];
  selectedAreaId: string;
  allAreasId: string;
  selectedProcess: ProcessNode | null;
  onSelectArea: (areaId: string) => void;
  onSelectProcess: (process: ProcessNode | null) => void;
  onEditProcess: (process: ProcessNode) => void;
  onDeleteProcess: (id: string) => void;
  onMoveProcess: (process: ProcessNode, nextStatus: string) => Promise<void>;
  isLoading?: boolean;
}

const statusColumns = [
  {
    id: "open",
    title: "Aberto",
    description: "Itens recebidos e prontos para analise.",
    tone: "bg-slate-500",
  },
  {
    id: "in_progress",
    title: "Em Andamento",
    description: "Fluxos em execucao ou refinamento.",
    tone: "bg-sky-600",
  },
  {
    id: "review",
    title: "Em Revisao",
    description: "Validacao com stakeholders.",
    tone: "bg-amber-500",
  },
  {
    id: "closed",
    title: "Concluido",
    description: "Processos consolidados.",
    tone: "bg-emerald-600",
  },
];

export function ProcessExplorer({
  areas,
  processes,
  allProcesses,
  selectedAreaId,
  allAreasId,
  selectedProcess,
  onSelectArea,
  onSelectProcess,
  onEditProcess,
  onDeleteProcess,
  onMoveProcess,
  isLoading = false,
}: ProcessExplorerProps) {
  const visibleFlatProcesses = flattenProcesses(processes);
  const rootCount = processes.length;
  const subprocessCount = Math.max(visibleFlatProcesses.length - rootCount, 0);

  function countProcessesByArea(areaId: string) {
    return allProcesses.filter((process) => process.areaId === areaId).length;
  }

  return (
    <section className="flex min-h-[620px] flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="shrink-0 border-b border-slate-200 bg-white p-4">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">
              Workspace
            </p>
            <h2 className="mt-1 text-xl font-bold text-slate-950 sm:text-2xl">
              Pipeline de processos
            </h2>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">
              Acompanhe a operacao em colunas, abra detalhes em contexto e
              explore subprocessos sem perder a hierarquia.
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-3 xl:min-w-[460px]">
            <ExplorerMetric icon={<Network size={18} />} label="Processos" value={visibleFlatProcesses.length} />
            <ExplorerMetric icon={<Layers3 size={18} />} label="Subprocessos" value={subprocessCount} />
            <ExplorerMetric icon={<BarChart3 size={18} />} label="Raizes" value={rootCount} />
          </div>
        </div>
      </div>

      <div className="shrink-0 border-b border-slate-200 bg-slate-50/80 px-4 py-3">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
          <div className="flex shrink-0 items-center gap-3 text-sm">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-sm">
              <Building2 size={18} />
            </span>
            <div>
              <h3 className="font-semibold text-slate-950">Areas</h3>
              <p className="text-xs text-slate-500">
                Filtre por unidade.
              </p>
            </div>
          </div>

          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 shadow-sm xl:max-w-52">
            <Search size={15} />
            <span>Selecionar area</span>
          </div>

          <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto pb-1 xl:pb-0">
            <AreaButton
              label="Todas as areas"
              count={allProcesses.length}
              selected={selectedAreaId === allAreasId}
              onClick={() => onSelectArea(allAreasId)}
            />

            {areas.map((area) => (
              <AreaButton
                key={area.id}
                label={area.name}
                count={countProcessesByArea(area.id)}
                selected={selectedAreaId === area.id}
                onClick={() => onSelectArea(area.id)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1">
        <div className="min-w-0 overflow-hidden bg-white p-3 sm:p-4">
          {isLoading ? (
            <ProcessBoardSkeleton />
          ) : visibleFlatProcesses.length === 0 ? (
            <div className="flex min-h-[420px] items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
              <div className="max-w-md">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-sky-50 text-sky-700">
                  <FolderKanban size={24} />
                </div>
                <h3 className="text-lg font-semibold text-slate-950">
                  Nenhum processo mapeado
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Cadastre uma area e crie o primeiro processo para iniciar a
                  visao operacional.
                </p>
              </div>
            </div>
          ) : (
            <ProcessKanbanBoard
              columns={statusColumns}
              processes={visibleFlatProcesses}
              onMoveProcess={onMoveProcess}
              onSelectProcess={onSelectProcess}
              onEditProcess={onEditProcess}
              onDeleteProcess={onDeleteProcess}
            />
          )}
        </div>
      </div>

      {selectedProcess && (
        <ProcessDetailsDrawer
          process={selectedProcess}
          onClose={() => onSelectProcess(null)}
          onEditProcess={onEditProcess}
          onDeleteProcess={onDeleteProcess}
          onSelectProcess={onSelectProcess}
        />
      )}
    </section>
  );
}

interface AreaButtonProps {
  label: string;
  count: number;
  selected: boolean;
  onClick: () => void;
}

function AreaButton({ label, count, selected, onClick }: AreaButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-w-[190px] rounded-lg border px-3 py-2.5 text-left text-sm transition duration-200 ${
        selected
          ? "border-sky-300 bg-white text-sky-800 shadow-sm ring-2 ring-sky-100"
          : "border-slate-200 bg-white/80 text-slate-600 hover:border-slate-300 hover:bg-white hover:shadow-sm"
      }`}
    >
      <span className="block truncate font-semibold">{label}</span>
      <span className="mt-1 block text-xs text-slate-500">
        {count} {count === 1 ? "processo" : "processos"}
      </span>
    </button>
  );
}

interface ExplorerMetricProps {
  icon: ReactElement;
  label: string;
  value: number;
}

function ExplorerMetric({ icon, label, value }: ExplorerMetricProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 shadow-sm">
      <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        <span className="text-sky-700">{icon}</span>
        {label}
      </div>
      <p className="text-lg font-bold text-slate-950">{value}</p>
    </div>
  );
}

function flattenProcesses(processes: ProcessNode[]): ProcessNode[] {
  return processes.flatMap((process) => [
    process,
    ...flattenProcesses(process.children),
  ]);
}

function ProcessBoardSkeleton() {
  return (
    <div className="flex min-h-[500px] gap-4 overflow-x-auto pb-2">
      {statusColumns.map((column) => (
        <div
          key={column.id}
          className="min-h-[500px] w-[min(82vw,340px)] shrink-0 rounded-lg border border-slate-200 bg-slate-50 p-3 2xl:min-w-0 2xl:flex-1 2xl:shrink"
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
            <div className="h-6 w-8 animate-pulse rounded bg-slate-200" />
          </div>
          <div className="space-y-3">
            {[0, 1, 2].map((item) => (
              <div
                key={item}
                className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="mb-3 h-4 w-4/5 animate-pulse rounded bg-slate-200" />
                <div className="mb-4 h-10 animate-pulse rounded bg-slate-100" />
                <div className="flex gap-2">
                  <div className="h-6 w-16 animate-pulse rounded bg-slate-100" />
                  <div className="h-6 w-20 animate-pulse rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
