import { useState } from "react";
import type { FormEvent } from "react";
import { Plus, Save } from "lucide-react";
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
    setAreaId("");
    setParentId("");

    onProcessCreated();
  }

  function flattenProcesses(processes: ProcessNode[]): ProcessNode[] {
    return processes.flatMap((process) => [
      process,
      ...flattenProcesses(process.children),
    ]);
  }

  const allProcesses = flattenProcesses(processes);
  const inputClass =
    "min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100";
  const labelClass = "text-xs font-semibold uppercase tracking-wide text-slate-500";

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">
            Cadastrar processo
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Inclua detalhes suficientes para documentar ferramentas,
            responsáveis e evidências do fluxo.
          </p>
        </div>

        <Plus className="text-sky-600" size={22} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className={labelClass}>Nome</span>
          <input
            className={inputClass}
            placeholder="Ex.: Recrutamento e seleção"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className={labelClass}>Área</span>
          <select
            className={inputClass}
            value={areaId}
            onChange={(event) => setAreaId(event.target.value)}
            required
          >
            <option value="">Selecione uma área</option>
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
            <option value="review">Em revisão</option>
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
            <option value="medium">Média</option>
            <option value="high">Alta</option>
            <option value="critical">Crítica</option>
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
            <option value="system">Sistêmico</option>
            <option value="hybrid">Híbrido</option>
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
          <span className={labelClass}>Responsáveis</span>
          <input
            className={inputClass}
            placeholder="Ex.: RH e gestores"
            value={responsibles}
            onChange={(event) => setResponsibles(event.target.value)}
          />
        </label>

        <label className="flex flex-col gap-1.5 md:col-span-2">
          <span className={labelClass}>Descrição</span>
          <textarea
            className={inputClass}
            placeholder="Explique o objetivo, entradas, saídas e pontos importantes do processo."
            rows={3}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </label>

        <label className="flex flex-col gap-1.5 md:col-span-2">
          <span className={labelClass}>Documentação associada</span>
          <textarea
            className={inputClass}
            placeholder="Ex.: link do procedimento, política interna, checklist ou guia operacional."
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
  );
}
