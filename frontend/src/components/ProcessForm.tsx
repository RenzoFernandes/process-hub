import { useState } from "react";
import type { FormEvent } from "react";
import { ChevronDown, Plus, Save } from "lucide-react";
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
  const [isExpanded, setIsExpanded] = useState(false);
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

    onProcessCreated();
  }

  const allProcesses = flattenProcesses(processes);
  const inputClass =
    "min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100";
  const labelClass = "text-xs font-semibold uppercase tracking-wide text-slate-500";

  return (
    <section className="mb-6 rounded-lg border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setIsExpanded((current) => !current)}
        className="flex w-full items-center justify-between gap-4 p-4 text-left transition hover:bg-slate-50 sm:p-5"
      >
        <span className="flex min-w-0 items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-700">
            <Plus size={21} />
          </span>
          <span className="min-w-0">
            <span className="block text-lg font-semibold text-slate-950">
              Cadastrar processo
            </span>
            <span className="mt-1 block text-sm leading-5 text-slate-500">
              Abra o formulario para adicionar processos raiz ou subprocessos.
            </span>
          </span>
        </span>

        <ChevronDown
          className={`shrink-0 text-slate-400 transition duration-200 ${
            isExpanded ? "rotate-180" : ""
          }`}
          size={20}
        />
      </button>

      {isExpanded && (
        <form
          onSubmit={handleSubmit}
          className="border-t border-slate-200 p-4 sm:p-5"
        >
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
                <option value="in_progress">Em andamento</option>
                <option value="review">Em revisao</option>
                <option value="closed">Fechado</option>
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

          <button className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700 sm:w-auto">
            <Save size={17} />
            Salvar processo
          </button>
        </form>
      )}
    </section>
  );
}

function flattenProcesses(processes: ProcessNode[]): ProcessNode[] {
  return processes.flatMap((process) => [
    process,
    ...flattenProcesses(process.children),
  ]);
}
