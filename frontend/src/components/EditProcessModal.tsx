import { useState } from "react";

import { api } from "../services/api";

import type { ProcessNode } from "../types/process";

interface EditProcessModalProps {
  process: ProcessNode;
  onClose: () => void;
  onUpdated: () => void;
}

export function EditProcessModal({
  process,
  onClose,
  onUpdated,
}: EditProcessModalProps) {
  const [name, setName] = useState(process.name);
  const [description, setDescription] = useState(process.description || "");
  const [tools, setTools] = useState(process.tools || "");
  const [responsibles, setResponsibles] = useState(
    process.responsibles || ""
  );
  const [documentation, setDocumentation] = useState(
    process.documentation || ""
  );

  async function handleUpdate(event: React.FormEvent) {
    event.preventDefault();

    try {
      await api.put(`/processes/${process.id}`, {
        name,
        description,
        status: process.status,
        priority: process.priority,
        tools,
        responsibles,
        documentation,
        areaId: process.areaId,
        parentId: process.parentId,
      });

      onUpdated();
      onClose();
    } catch (error) {
      console.error(error);
    }
  }

  const inputClass =
    "bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400/50 transition";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="w-full max-w-xl rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Edit Process</h2>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleUpdate} className="flex flex-col gap-4">
          <input
            className={inputClass}
            placeholder="Process name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />

          <textarea
            className={inputClass}
            placeholder="Description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />

          <input
            className={inputClass}
            placeholder="Tools used"
            value={tools}
            onChange={(event) => setTools(event.target.value)}
          />

          <input
            className={inputClass}
            placeholder="Responsibles"
            value={responsibles}
            onChange={(event) => setResponsibles(event.target.value)}
          />

          <textarea
            className={inputClass}
            placeholder="Documentation"
            value={documentation}
            onChange={(event) => setDocumentation(event.target.value)}
          />

          <button className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold rounded-xl py-3 transition">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}