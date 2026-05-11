import { useEffect, useState } from "react";

import { api } from "../services/api";

import type { ProcessNode } from "../types/process";

import { ProcessFlow } from "../components/ProcessFlow";
import { Sidebar } from "../components/Sidebar";

export function Dashboard() {
  const [processes, setProcesses] = useState<ProcessNode[]>([]);

  useEffect(() => {
    async function loadProcesses() {
      try {
        const response = await api.get("/processes/tree");

        setProcesses(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    void loadProcesses();
  }, []);

  return (
    <div className="h-screen bg-slate-950 text-white flex relative overflow-hidden">
      <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

      <Sidebar />

      <main className="flex-1 p-8 overflow-hidden relative z-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Process Map</h1>

          <p className="text-slate-400 mt-2">
            Visualize and manage organizational processes
          </p>
        </div>

        <ProcessFlow processes={processes} />
      </main>
    </div>
  );
}