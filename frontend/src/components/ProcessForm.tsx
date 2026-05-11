import { useState } from "react";
import { api } from "../services/api";
import type { ProcessNode } from "../types/process";

interface ProcessFormProps {
  areas: {
    id: string;
    name: string;
  }[];
  processes: ProcessNode[];
  onProcessCreated: () => void;
}

export function ProcessForm({
  areas,
  processes,
  onProcessCreated,
}: ProcessFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const status = "active";
  const [priority, setPriority] = useState("medium");
  const [tools, setTools] = useState("");
  const [responsibles, setResponsibles] = useState("");
  const [documentation, setDocumentation] = useState("");
  const [areaId, setAreaId] = useState("");
  const [parentId, setParentId] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    await api.post("/processes", {
      name,
      description,
      status,
      priority,
      tools,
      responsibles,
      documentation,
      areaId,
      parentId: parentId || null,
    });

    setName("");
    setDescription("");
    setTools("");
    setResponsibles("");
    setDocumentation("");
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

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur-xl p-5 mb-6"
    >
      <h2 className="text-lg font-semibold mb-4">Create process</h2>

      <div className="grid grid-cols-2 gap-3">
        <input
          className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm"
          placeholder="Process name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />

        <select
          className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm"
          value={areaId}
          onChange={(event) => setAreaId(event.target.value)}
          required
        >
          <option value="">Select area</option>
          {areas.map((area) => (
            <option key={area.id} value={area.id}>
              {area.name}
            </option>
          ))}
        </select>

        <select
          className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm"
          value={parentId}
          onChange={(event) => setParentId(event.target.value)}
        >
          <option value="">No parent process</option>
          {allProcesses.map((process) => (
            <option key={process.id} value={process.id}>
              {process.name}
            </option>
          ))}
        </select>

        <select
          className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm"
          value={priority}
          onChange={(event) => setPriority(event.target.value)}
        >
          <option value="low">low</option>
          <option value="medium">medium</option>
          <option value="high">high</option>
        </select>

        <input
          className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm"
          placeholder="Tools"
          value={tools}
          onChange={(event) => setTools(event.target.value)}
        />

        <input
          className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm"
          placeholder="Responsibles"
          value={responsibles}
          onChange={(event) => setResponsibles(event.target.value)}
        />

        <textarea
          className="col-span-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm"
          placeholder="Description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />

        <textarea
          className="col-span-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm"
          placeholder="Documentation"
          value={documentation}
          onChange={(event) => setDocumentation(event.target.value)}
        />
      </div>

      <button className="mt-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold rounded-xl px-4 py-2 transition">
        Create
      </button>
    </form>
  );
}
