import { useEffect, useState } from "react";
import { api } from "../services/api";
import type { ProcessNode } from "../types/process";
import { ProcessFlow } from "../components/ProcessFlow";

export function Dashboard() {
  const [, setProcesses] = useState<ProcessNode[]>([]);

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
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">ProcessHub</h1>

      <ProcessFlow />
    </div>
  );
}