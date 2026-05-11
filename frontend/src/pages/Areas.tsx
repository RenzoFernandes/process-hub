import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Building2, GitBranch, Pencil, Trash2, X } from "lucide-react";

import { AreaForm } from "../components/AreaForm";
import { Sidebar } from "../components/Sidebar";
import { api } from "../services/api";
import type { Area, ProcessNode } from "../types/process";

export function Areas() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [processes, setProcesses] = useState<ProcessNode[]>([]);
  const [editingArea, setEditingArea] = useState<Area | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  async function loadAreas() {
    try {
      const response = await api.get("/areas");
      setAreas(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function loadProcesses() {
    try {
      const response = await api.get("/processes/tree");
      setProcesses(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDeleteArea(id: string) {
    const confirmDelete = window.confirm(
      "Deseja realmente excluir esta área? Os processos vinculados também serão removidos.",
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/areas/${id}`);
      await loadAreas();
      await loadProcesses();
    } catch (error) {
      console.error(error);
    }
  }

  function startEdit(area: Area) {
    setEditingArea(area);
    setEditName(area.name);
    setEditDescription(area.description || "");
  }

  async function handleUpdateArea(event: FormEvent) {
    event.preventDefault();

    if (!editingArea) return;

    try {
      await api.put(`/areas/${editingArea.id}`, {
        name: editName,
        description: editDescription,
      });

      setEditingArea(null);
      await loadAreas();
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    async function loadInitialData() {
      await loadAreas();
      await loadProcesses();
    }

    void loadInitialData();
  }, []);

  const flatProcesses = useMemo(() => {
    function flatten(items: ProcessNode[]): ProcessNode[] {
      return items.flatMap((item) => [item, ...flatten(item.children)]);
    }

    return flatten(processes);
  }, [processes]);

  function countProcessesByArea(areaId: string) {
    return flatProcesses.filter((process) => process.areaId === areaId).length;
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-100 text-slate-950 lg:flex-row">
      <Sidebar />

      <main className="min-w-0 flex-1 overflow-y-auto p-4 sm:p-6">
        <section className="mb-6 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">
            Gestão organizacional
          </p>
          <h1 className="mt-2 text-2xl font-bold text-slate-950 sm:text-3xl">
            Áreas da empresa
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Crie, edite e acompanhe as áreas responsáveis pelos processos. Cada
            área exibe quantos processos e subprocessos estão vinculados a ela.
          </p>
        </section>

        <AreaForm onAreaCreated={loadAreas} />

        {areas.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center sm:p-10">
            <Building2 className="mx-auto text-slate-400" size={30} />
            <h3 className="mt-3 text-lg font-semibold text-slate-950">
              Nenhuma área cadastrada
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Cadastre a primeira área para iniciar o mapeamento de processos.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {areas.map((area) => {
              const processCount = countProcessesByArea(area.id);

              return (
                <article
                  key={area.id}
                  className="min-w-0 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold text-slate-950">
                        {area.name}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        {area.description || "Sem descrição cadastrada."}
                      </p>

                      <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-sm font-medium text-sky-800">
                        <GitBranch size={16} />
                        {processCount}{" "}
                        {processCount === 1
                          ? "processo vinculado"
                          : "processos vinculados"}
                      </div>
                    </div>

                    <div className="flex shrink-0 gap-1">
                      <button
                        onClick={() => startEdit(area)}
                        className="rounded-md p-2 text-slate-500 transition hover:bg-sky-50 hover:text-sky-700"
                        title="Editar área"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteArea(area.id)}
                        className="rounded-md p-2 text-slate-500 transition hover:bg-rose-50 hover:text-rose-700"
                        title="Excluir área"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      {editingArea && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <form
            onSubmit={handleUpdateArea}
            className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-lg border border-slate-200 bg-white p-4 shadow-2xl sm:p-6"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-950">
                  Editar área
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Ajuste o nome e a descrição do setor.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setEditingArea(null)}
                className="rounded-md p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-950"
                title="Fechar"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid gap-4">
              <input
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                placeholder="Nome da área"
                value={editName}
                onChange={(event) => setEditName(event.target.value)}
                required
              />

              <textarea
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                placeholder="Descrição"
                rows={3}
                value={editDescription}
                onChange={(event) => setEditDescription(event.target.value)}
              />
            </div>

            <button className="mt-5 rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700">
              Salvar alterações
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
