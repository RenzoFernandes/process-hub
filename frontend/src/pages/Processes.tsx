import { useEffect, useMemo, useState } from "react";
import { Building2, GitBranch, Users } from "lucide-react";

import { EditProcessModal } from "../components/EditProcessModal";
import { ProcessFlow } from "../components/ProcessFlow";
import { ProcessForm } from "../components/ProcessForm";
import { Sidebar } from "../components/Sidebar";
import { api } from "../services/api";
import type { Area, ProcessNode } from "../types/process";

const allAreasId = "all";

export function Processes() {
  const [processes, setProcesses] = useState<ProcessNode[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [selectedAreaId, setSelectedAreaId] = useState(allAreasId);
  const [selectedProcess, setSelectedProcess] = useState<ProcessNode | null>(
    null,
  );

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

  async function handleDeleteProcess(id: string) {
    const confirmDelete = window.confirm(
      "Deseja realmente excluir este processo?",
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/processes/${id}`);
      await loadProcesses();
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
        ? processes
        : filterProcessTreeByArea(processes, effectiveSelectedAreaId),
    [processes, effectiveSelectedAreaId],
  );
  const visibleAreas =
    effectiveSelectedAreaId === allAreasId
      ? areas
      : areas.filter((area) => area.id === effectiveSelectedAreaId);

  function countProcessesByArea(areaId: string) {
    return flatProcesses.filter((process) => process.areaId === areaId).length;
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-100 text-slate-950 lg:flex-row">
      <Sidebar />

      <main className="min-w-0 flex-1 overflow-y-auto p-4 sm:p-6">
        <section className="mb-6 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">
                Tela principal do case
              </p>
              <h1 className="mt-2 text-2xl font-bold text-slate-950 sm:text-3xl">
                Processos e subprocessos
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                Navegue por área para analisar mapas separados. Cada área pode
                ter sua própria cadeia de processos, subprocessos, ferramentas,
                responsáveis e documentação associada.
              </p>
            </div>

            <div className="flex w-full items-center gap-2 rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-medium text-sky-800 sm:w-auto">
              <GitBranch size={18} />
              Fluxograma navegável com React Flow
            </div>
          </div>
        </section>

        <section className="mb-6 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">
                Navegação por área
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Selecione uma área para focar o cadastro e o fluxograma apenas
                nos processos vinculados a ela.
              </p>
            </div>

            <Building2 className="text-slate-400" size={22} />
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <button
              type="button"
              onClick={() => setSelectedAreaId(allAreasId)}
              className={`min-w-0 rounded-lg border px-4 py-3 text-left text-sm transition ${
                effectiveSelectedAreaId === allAreasId
                  ? "border-sky-300 bg-sky-50 text-sky-800 shadow-sm"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <span className="block font-semibold">Todas as áreas</span>
              <span className="mt-1 block text-xs">
                {flatProcesses.length} processos no mapa completo
              </span>
            </button>

            {areas.map((area) => {
              const processCount = countProcessesByArea(area.id);
              const isSelected = effectiveSelectedAreaId === area.id;

              return (
                <button
                  key={area.id}
                  type="button"
                  onClick={() => setSelectedAreaId(area.id)}
                  className={`min-w-0 rounded-lg border px-4 py-3 text-left text-sm transition ${
                    isSelected
                      ? "border-sky-300 bg-sky-50 text-sky-800 shadow-sm"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <span className="block font-semibold">{area.name}</span>
                  <span className="mt-1 block text-xs">
                    {processCount}{" "}
                    {processCount === 1
                      ? "processo vinculado"
                      : "processos vinculados"}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <ProcessForm
          key={effectiveSelectedAreaId}
          areas={visibleAreas}
          processes={visibleProcesses}
          initialAreaId={
            effectiveSelectedAreaId === allAreasId
              ? undefined
              : effectiveSelectedAreaId
          }
          onProcessCreated={loadProcesses}
        />

        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">
                {selectedArea
                  ? `Fluxograma: ${selectedArea.name}`
                  : "Fluxograma geral"}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                As linhas indicam a relação entre processo pai e subprocesso.
                Use zoom, arraste e minimapa para navegar.
              </p>
            </div>

            <Users className="text-slate-400" size={22} />
          </div>

          <ProcessFlow
            processes={visibleProcesses}
            onDeleteProcess={handleDeleteProcess}
            onEditProcess={setSelectedProcess}
          />
        </section>

        {selectedProcess && (
          <EditProcessModal
            process={selectedProcess}
            areas={areas}
            processes={processes}
            onClose={() => setSelectedProcess(null)}
            onUpdated={loadProcesses}
          />
        )}
      </main>
    </div>
  );
}

function flattenProcesses(processes: ProcessNode[]): ProcessNode[] {
  return processes.flatMap((process) => [
    process,
    ...flattenProcesses(process.children),
  ]);
}

function filterProcessTreeByArea(
  processes: ProcessNode[],
  areaId: string,
): ProcessNode[] {
  return processes.flatMap((process) => {
    const filteredChildren = filterProcessTreeByArea(process.children, areaId);

    if (process.areaId === areaId) {
      return [
        {
          ...process,
          children: filteredChildren,
        },
      ];
    }

    return filteredChildren;
  });
}
