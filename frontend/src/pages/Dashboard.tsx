import { useEffect, useState } from "react";

import { api } from "../services/api";

import type { ProcessNode } from "../types/process";

import { ProcessFlow } from "../components/ProcessFlow";
import { Sidebar } from "../components/Sidebar";
import { ProcessForm } from "../components/ProcessForm";
import { EditProcessModal } from "../components/EditProcessModal";

interface Area {
  id: string;
  name: string;
}

export function Dashboard() {
  const [processes, setProcesses] = useState<ProcessNode[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
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
      "Are you sure you want to delete this process?",
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

  function handleEditProcess(process: ProcessNode) {
    setSelectedProcess(process);
  }

  return (
    <div className="h-screen bg-slate-950 text-white flex relative overflow-hidden">
      <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto relative z-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Process Map</h1>

          <p className="text-slate-400 mt-2">
            Visualize and manage organizational processes
          </p>
        </div>

        <ProcessForm
          areas={areas}
          processes={processes}
          onProcessCreated={loadProcesses}
        />

        <div className="mt-6 min-h-[700px]">
          <ProcessFlow
            processes={processes}
            onDeleteProcess={handleDeleteProcess}
            onEditProcess={handleEditProcess}
          />
          {selectedProcess && (
            <EditProcessModal
              process={selectedProcess}
              onClose={() => setSelectedProcess(null)}
              onUpdated={loadProcesses}
            />
          )}
        </div>
      </main>
    </div>
  );
}
