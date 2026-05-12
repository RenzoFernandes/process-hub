import { useEffect, useMemo, useState } from "react";
import { FolderKanban } from "lucide-react";

import { EditProcessModal } from "../components/EditProcessModal";
import { ProcessExplorer } from "../components/ProcessExplorer";
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
  const [editingProcess, setEditingProcess] = useState<ProcessNode | null>(
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
      setSelectedProcess((current) => (current?.id === id ? null : current));
      setEditingProcess((current) => (current?.id === id ? null : current));
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

  return (
    <div className="flex min-h-screen flex-col bg-[#f7f9fc] text-slate-950 lg:flex-row">
      <Sidebar />

      <main className="min-w-0 flex-1 overflow-y-auto p-4 sm:p-6">
        <section className="mb-6 border-b border-slate-200 pb-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">
                Process management
              </p>
              <h1 className="mt-2 text-2xl font-bold text-slate-950 sm:text-3xl">
                Process Explorer
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                Organize processos por area, status e hierarquia com uma
                experiencia clara para operacao, gestao e melhoria continua.
              </p>
            </div>

            <div className="flex w-full items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm sm:w-auto">
              <FolderKanban size={18} />
              Corporate process workspace
            </div>
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

        <ProcessExplorer
          areas={areas}
          processes={visibleProcesses}
          allProcesses={flatProcesses}
          selectedAreaId={effectiveSelectedAreaId}
          allAreasId={allAreasId}
          selectedProcess={selectedProcess}
          onSelectArea={setSelectedAreaId}
          onSelectProcess={setSelectedProcess}
          onDeleteProcess={handleDeleteProcess}
          onEditProcess={setEditingProcess}
        />

        {editingProcess && (
          <EditProcessModal
            process={editingProcess}
            areas={areas}
            processes={processes}
            onClose={() => setEditingProcess(null)}
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
