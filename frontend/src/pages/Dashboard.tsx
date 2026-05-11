import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  AlertCircle,
  BarChart3,
  Building2,
  CheckCircle2,
  GitBranch,
  Layers3,
  Network,
} from "lucide-react";

import { Sidebar } from "../components/Sidebar";
import { api } from "../services/api";
import type { Area, ProcessNode } from "../types/process";

const allAreasId = "all";

const statusLabels: Record<string, string> = {
  open: "Aberto",
  in_progress: "Em andamento",
  review: "Em revisão",
  closed: "Fechado",
  active: "Ativo",
  mapped: "Mapeado",
};

const priorityLabels: Record<string, string> = {
  critical: "Crítica",
  high: "Alta",
  medium: "Média",
  low: "Baixa",
};

const priorityOrder = ["critical", "high", "medium", "low"];

export function Dashboard() {
  const [processes, setProcesses] = useState<ProcessNode[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [selectedAreaId, setSelectedAreaId] = useState(allAreasId);

  async function loadProcesses() {
    try {
      const response = await api.get("/processes/tree");
      setProcesses(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function loadAreas() {
    try {
      const response = await api.get("/areas");
      setAreas(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    async function loadInitialData() {
      await loadProcesses();
      await loadAreas();
    }

    void loadInitialData();
  }, []);

  const flatProcesses = useMemo(() => flattenProcesses(processes), [processes]);
  const selectedAreaStillExists =
    selectedAreaId === allAreasId ||
    areas.some((area) => area.id === selectedAreaId);
  const effectiveSelectedAreaId = selectedAreaStillExists
    ? selectedAreaId
    : allAreasId;
  const selectedArea = areas.find((area) => area.id === effectiveSelectedAreaId);
  const visibleProcesses = useMemo(
    () =>
      effectiveSelectedAreaId === allAreasId
        ? flatProcesses
        : flatProcesses.filter(
            (process) => process.areaId === effectiveSelectedAreaId,
          ),
    [effectiveSelectedAreaId, flatProcesses],
  );

  const subprocessCount = visibleProcesses.filter(
    (item) => item.parentId,
  ).length;
  const rootProcessCount = visibleProcesses.length - subprocessCount;
  const criticalCount = visibleProcesses.filter(
    (item) => item.priority === "critical" || item.priority === "high",
  ).length;
  const closedCount = visibleProcesses.filter(
    (item) => item.status === "closed",
  ).length;

  const statusSummary = countBy(visibleProcesses, "status", statusLabels);
  const prioritySummary = countPrioritiesByImportance(visibleProcesses);

  function countProcessesByArea(areaId: string) {
    return flatProcesses.filter((process) => process.areaId === areaId).length;
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-100 text-slate-950 lg:flex-row">
      <Sidebar />

      <main className="min-w-0 flex-1 overflow-y-auto p-4 sm:p-6">
        <section className="mb-6 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">
            Visão geral
          </p>
          <h1 className="mt-2 text-2xl font-bold text-slate-950 sm:text-3xl">
            Dashboard do mapeamento
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Acompanhe rapidamente o tamanho do mapa por visão geral ou por área,
            incluindo processos, subprocessos, status e prioridades.
          </p>
        </section>

        <section className="mb-6 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">
                Navegação por área
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Selecione uma área para filtrar os indicadores do dashboard.
              </p>
            </div>

            <Building2 className="text-slate-400" size={22} />
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <AreaFilterButton
              label="Todas as áreas"
              description={`${flatProcesses.length} processos no mapa completo`}
              selected={effectiveSelectedAreaId === allAreasId}
              onClick={() => setSelectedAreaId(allAreasId)}
            />

            {areas.map((area) => {
              const processCount = countProcessesByArea(area.id);

              return (
                <AreaFilterButton
                  key={area.id}
                  label={area.name}
                  description={`${processCount} ${
                    processCount === 1
                      ? "processo vinculado"
                      : "processos vinculados"
                  }`}
                  selected={effectiveSelectedAreaId === area.id}
                  onClick={() => setSelectedAreaId(area.id)}
                />
              );
            })}
          </div>
        </section>

        <section className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            icon={<Layers3 size={20} />}
            label={
              selectedArea ? `Área selecionada: ${selectedArea.name}` : "Áreas cadastradas"
            }
            value={selectedArea ? 1 : areas.length}
          />
          <MetricCard
            icon={<Network size={20} />}
            label="Processos totais"
            value={visibleProcesses.length}
          />
          <MetricCard
            icon={<GitBranch size={20} />}
            label="Subprocessos"
            value={subprocessCount}
          />
          <MetricCard
            icon={<AlertCircle size={20} />}
            label="Alta prioridade"
            value={criticalCount}
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-3">
          <SummaryPanel
            title="Resumo rápido do mapa"
            icon={<CheckCircle2 size={20} />}
            items={[
              ["Processos raiz", rootProcessCount],
              ["Subprocessos", subprocessCount],
              ["Processos fechados", closedCount],
              [
                selectedArea ? "Área em foco" : "Áreas com processos",
                selectedArea
                  ? 1
                  : countAreasWithProcesses(areas, visibleProcesses),
              ],
            ]}
          />

          <SummaryPanel
            title="Processos por status"
            icon={<BarChart3 size={20} />}
            items={statusSummary}
          />

          <SummaryPanel
            title="Processos por prioridade"
            icon={<BarChart3 size={20} />}
            items={prioritySummary}
          />
        </section>
      </main>
    </div>
  );
}

interface AreaFilterButtonProps {
  label: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}

function AreaFilterButton({
  label,
  description,
  selected,
  onClick,
}: AreaFilterButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-w-0 rounded-lg border px-4 py-3 text-left text-sm transition ${
        selected
          ? "border-sky-300 bg-sky-50 text-sky-800 shadow-sm"
          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
      }`}
    >
      <span className="block truncate font-semibold">{label}</span>
      <span className="mt-1 block text-xs leading-5">{description}</span>
    </button>
  );
}

interface MetricCardProps {
  icon: ReactNode;
  label: string;
  value: number;
}

function MetricCard({ icon, label, value }: MetricCardProps) {
  return (
    <div className="min-w-0 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-sky-700">
        {icon}
      </div>
      <p className="text-2xl font-bold text-slate-950">{value}</p>
      <p className="mt-1 break-words text-sm text-slate-500">{label}</p>
    </div>
  );
}

interface SummaryPanelProps {
  title: string;
  icon: ReactNode;
  items: [string, number][];
}

function SummaryPanel({ title, icon, items }: SummaryPanelProps) {
  return (
    <div className="min-w-0 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-50 text-sky-700">
          {icon}
        </div>
        <h2 className="text-base font-semibold text-slate-950 sm:text-lg">
          {title}
        </h2>
      </div>

      <div className="space-y-3">
        {items.map(([label, value]) => (
          <div
            key={label}
            className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2"
          >
            <span className="min-w-0 break-words text-sm text-slate-600">
              {label}
            </span>
            <span className="text-sm font-semibold text-slate-950">
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function flattenProcesses(processes: ProcessNode[]): ProcessNode[] {
  return processes.flatMap((process) => [
    process,
    ...flattenProcesses(process.children),
  ]);
}

function countBy(
  processes: ProcessNode[],
  key: "status" | "priority",
  labels: Record<string, string>,
): [string, number][] {
  const summary = new Map<string, number>();

  processes.forEach((process) => {
    const value = process[key] || "Não informado";
    const label = labels[value] || value;
    summary.set(label, (summary.get(label) || 0) + 1);
  });

  if (summary.size === 0) {
    return [["Nenhum processo cadastrado", 0]];
  }

  return Array.from(summary.entries());
}

function countPrioritiesByImportance(processes: ProcessNode[]): [string, number][] {
  if (processes.length === 0) {
    return [["Nenhum processo cadastrado", 0]];
  }

  const counts = new Map<string, number>();

  processes.forEach((process) => {
    const priority = process.priority || "Não informado";
    counts.set(priority, (counts.get(priority) || 0) + 1);
  });

  const orderedPriorities: [string, number][] = priorityOrder.map((priority) => [
    priorityLabels[priority],
    counts.get(priority) || 0,
  ]);

  const unknownPriorities = Array.from(counts.entries())
    .filter(([priority]) => !priorityOrder.includes(priority))
    .map(([priority, count]): [string, number] => [priority, count]);

  return [...orderedPriorities, ...unknownPriorities];
}

function countAreasWithProcesses(areas: Area[], processes: ProcessNode[]) {
  return areas.filter((area) =>
    processes.some((process) => process.areaId === area.id),
  ).length;
}
