import { useState } from "react";
import type { FormEvent } from "react";
import { X } from "lucide-react";

import { api } from "../services/api";

import type { Area, ProcessNode } from "../types/process";

interface EditProcessModalProps {
  process: ProcessNode;
  areas: Area[];
  processes: ProcessNode[];
  onClose: () => void;
  onUpdated: () => void;
}

export function EditProcessModal({
  process,
  areas,
  processes,
  onClose,
  onUpdated,
}: EditProcessModalProps) {
  const [name, setName] = useState(process.name);
  const [description, setDescription] = useState(process.description || "");
  const [status, setStatus] = useState(process.status || "open");
  const [priority, setPriority] = useState(process.priority || "medium");
  const [executionType, setExecutionType] = useState(
    process.executionType || "manual",
  );
  const [tools, setTools] = useState(process.tools || "");
  const [responsibles, setResponsibles] = useState(process.responsibles || "");
  const [documentation, setDocumentation] = useState(
    process.documentation || "",
  );
  const [areaId, setAreaId] = useState(process.areaId);
  const [parentId, setParentId] = useState(process.parentId || "");

  async function handleUpdate(event: FormEvent) {
    event.preventDefault();

    try {
      await api.put(`/processes/${process.id}`, {
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

      onUpdated();
      onClose();
    } catch (error) {
      console.error(error);
    }
  }

  function flattenProcesses(items: ProcessNode[]): ProcessNode[] {
    return items.flatMap((item) => [item, ...flattenProcesses(item.children)]);
  }

  const availableParents = flattenProcesses(processes).filter(
    (item) => item.id !== process.id,
  );
  const inputClass =
    "min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100";
  const labelClass = "text-xs font-semibold uppercase tracking-wide text-slate-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-lg border border-slate-200 bg-white p-4 shadow-2xl sm:p-6">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-950">
              Editar processo
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Atualize a documentação e a posição na hierarquia.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-md p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-950"
            title="Fechar"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleUpdate} className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>Nome</span>
            <input
              className={inputClass}
              placeholder="Nome do processo"
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
              {availableParents.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
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
              placeholder="Ferramentas utilizadas"
              value={tools}
              onChange={(event) => setTools(event.target.value)}
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>Responsáveis</span>
            <input
              className={inputClass}
              placeholder="Times ou pessoas responsáveis"
              value={responsibles}
              onChange={(event) => setResponsibles(event.target.value)}
            />
          </label>

          <label className="flex flex-col gap-1.5 md:col-span-2">
            <span className={labelClass}>Descrição</span>
            <textarea
              className={inputClass}
              placeholder="Descrição do processo"
              rows={3}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </label>

          <label className="flex flex-col gap-1.5 md:col-span-2">
            <span className={labelClass}>Documentação</span>
            <textarea
              className={inputClass}
              placeholder="Links, políticas, checklists ou guias relacionados"
              rows={2}
              value={documentation}
              onChange={(event) => setDocumentation(event.target.value)}
            />
          </label>

          <button className="rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700 md:col-span-2">
            Salvar alterações
          </button>
        </form>
      </div>
    </div>
  );
}
