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
      "Deseja realmente excluir esta area? Os processos vinculados tambem serao removidos.",
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
    <div className="flex min-h-screen flex-col bg-[#f7f9fc] text-slate-950 lg:flex-row">
      <Sidebar />

      <main className="min-w-0 flex-1 overflow-y-auto p-4 sm:p-6 lg:h-screen lg:p-4">
        <section className="mb-6 border-b border-slate-200 pb-5 lg:mb-4 lg:pb-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">
            Organization
          </p>
          <h1 className="mt-2 text-2xl font-bold text-slate-950 sm:text-3xl lg:mt-1 lg:text-2xl">
            Areas da empresa
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 lg:mt-1 lg:leading-5">
            Estruture departamentos, donos de processo e unidades responsaveis
            para manter a operacao organizada.
          </p>
        </section>

        <AreaForm onAreaCreated={loadAreas} />

        {areas.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center shadow-sm sm:p-10 lg:p-8">
            <Building2 className="mx-auto text-slate-400" size={30} />
            <h3 className="mt-3 text-lg font-semibold text-slate-950">
              Nenhuma area cadastrada
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Crie uma area para conectar processos, pessoas e documentacao.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 lg:gap-3">
            {areas.map((area) => {
              const processCount = countProcessesByArea(area.id);

              return (
                <article
                  key={area.id}
                  className="min-w-0 rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:border-sky-200 hover:shadow-md sm:p-5 lg:p-3"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-sky-50 text-sky-700 lg:mb-2 lg:h-8 lg:w-8">
                        <Building2 size={19} />
                      </div>

                      <h3 className="break-words text-lg font-semibold text-slate-950 [overflow-wrap:anywhere] lg:text-base">
                        {area.name}
                      </h3>

                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500 lg:mt-1 lg:leading-5">
                        {area.description || "Descricao ainda nao informada."}
                      </p>

                      <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-sm font-medium text-sky-800 lg:mt-3 lg:py-1.5 lg:text-xs">
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
                        title="Editar area"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteArea(area.id)}
                        className="rounded-md p-2 text-slate-500 transition hover:bg-rose-50 hover:text-rose-700"
                        title="Excluir area"
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
                  Editar area
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Atualize a identificacao e a descricao da unidade.
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
                placeholder="Nome da area"
                value={editName}
                onChange={(event) => setEditName(event.target.value)}
                required
              />

              <textarea
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                placeholder="Descricao"
                rows={3}
                value={editDescription}
                onChange={(event) => setEditDescription(event.target.value)}
              />
            </div>

            <button className="mt-5 rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700">
              Salvar alteracoes
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
