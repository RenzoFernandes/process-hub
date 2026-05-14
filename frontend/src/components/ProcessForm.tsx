import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Plus, Save, X } from "lucide-react";
import { api } from "../services/api";
import type { ProcessNode } from "../types/process";

interface ProcessFormProps {
  areas: {
    id: string;
    name: string;
  }[];
  processes: ProcessNode[];
  initialAreaId?: string;
  onProcessCreated: () => void;
}

export function ProcessForm({
  areas,
  processes,
  initialAreaId,
  onProcessCreated,
}: ProcessFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("open");
  const [priority, setPriority] = useState("medium");
  const [executionType, setExecutionType] = useState("manual");
  const [tools, setTools] = useState("");
  const [responsibles, setResponsibles] = useState("");
  const [documentation, setDocumentation] = useState("");
  const [areaId, setAreaId] = useState(initialAreaId || "");
  const [parentId, setParentId] = useState("");

  const resetForm = useCallback(() => {
    setName("");
    setDescription("");
    setStatus("open");
    setPriority("medium");
    setExecutionType("manual");
    setTools("");
    setResponsibles("");
    setDocumentation("");
    setAreaId(initialAreaId || "");
    setParentId("");
  }, [initialAreaId]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    resetForm();
  }, [resetForm]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    await api.post("/processes", {
      name,
      description,
      status,
      priority,
      executionType,
      tools,
      responsibles,
      documentation,
      areaId,
      parentId: parentId || null,
    });

    onProcessCreated();
    handleClose();
  }

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        handleClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleClose, isOpen]);

  const allProcesses = flattenProcesses(processes);
  const inputClass =
    "min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100";
  const labelClass = "text-xs font-semibold uppercase tracking-wide text-slate-500";

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="mb-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 sm:w-auto"
      >
        <Plus size={18} />
        Cadastrar processo
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              handleClose();
            }
          }}
        >
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-lg border border-slate-200 bg-white p-4 shadow-2xl sm:p-6">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-950">
                  Cadastrar processo
                </h2>
                <p className="mt-1 text-sm leading-5 text-slate-500">
                  Adicione processos raiz ou subprocessos vinculados a uma area.
                </p>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="rounded-md p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-950"
                title="Fechar"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-1.5">
                  <span className={labelClass}>Nome</span>
                  <input
                    className={inputClass}
                    placeholder="Ex.: Recrutamento e selecao"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                  />
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className={labelClass}>Area</span>
                  <select
                    className={inputClass}
                    value={areaId}
                    onChange={(event) => setAreaId(event.target.value)}
                    required
                  >
                    <option value="">Selecione uma area</option>
                    {areas.map((area) => (
                      <option key={area.id} value={area.id}>
                        {area.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className={labelClass}>Processo pai</span>
                  <select
                    className={inputClass}
                    value={parentId}
                    onChange={(event) => setParentId(event.target.value)}
                  >
                    <option value="">Processo raiz</option>
                    {allProcesses.map((process) => (
                      <option key={process.id} value={process.id}>
                        {process.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className={labelClass}>Status</span>
                  <select
                    className={inputClass}
                    value={status}
                    onChange={(event) => setStatus(event.target.value)}
                  >
                    <option value="open">Aberto</option>
                    <option value="in_progress">Em Andamento</option>
                    <option value="review">Em Revisao</option>
                    <option value="closed">Concluido</option>
                  </select>
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className={labelClass}>Prioridade</span>
                  <select
                    className={inputClass}
                    value={priority}
                    onChange={(event) => setPriority(event.target.value)}
                  >
                    <option value="low">Baixa</option>
                    <option value="medium">Media</option>
                    <option value="high">Alta</option>
                    <option value="critical">Critica</option>
                  </select>
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className={labelClass}>Tipo</span>
                  <select
                    className={inputClass}
                    value={executionType}
                    onChange={(event) => setExecutionType(event.target.value)}
                  >
                    <option value="manual">Manual</option>
                    <option value="system">Sistemico</option>
                    <option value="hybrid">Hibrido</option>
                  </select>
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className={labelClass}>Ferramentas</span>
                  <input
                    className={inputClass}
                    placeholder="Ex.: Trello, Notion, ERP"
                    value={tools}
                    onChange={(event) => setTools(event.target.value)}
                  />
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className={labelClass}>Responsaveis</span>
                  <input
                    className={inputClass}
                    placeholder="Ex.: RH e gestores"
                    value={responsibles}
                    onChange={(event) => setResponsibles(event.target.value)}
                  />
                </label>

                <label className="flex flex-col gap-1.5 md:col-span-2">
                  <span className={labelClass}>Descricao</span>
                  <textarea
                    className={inputClass}
                    placeholder="Explique o objetivo, entradas, saidas e pontos importantes do processo."
                    rows={3}
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                  />
                </label>

                <label className="flex flex-col gap-1.5 md:col-span-2">
                  <span className={labelClass}>Documentacao associada</span>
                  <textarea
                    className={inputClass}
                    placeholder="Ex.: link do procedimento, politica interna, checklist ou guia operacional."
                    rows={2}
                    value={documentation}
                    onChange={(event) => setDocumentation(event.target.value)}
                  />
                </label>
              </div>

              <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleClose}
                  className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancelar
                </button>

                <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700">
                  <Save size={17} />
                  Salvar processo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

function flattenProcesses(processes: ProcessNode[]): ProcessNode[] {
  return processes.flatMap((process) => [
    process,
    ...flattenProcesses(process.children),
  ]);
}
