import { useState } from "react";
import type { FormEvent } from "react";
import { Building2, Save } from "lucide-react";
import { api } from "../services/api";

interface AreaFormProps {
  onAreaCreated: () => void;
}

export function AreaForm({ onAreaCreated }: AreaFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    try {
      await api.post("/areas", {
        name,
        description,
      });

      setName("");
      setDescription("");

      onAreaCreated();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">
            Cadastrar área
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Use áreas para organizar processos por departamento ou setor.
          </p>
        </div>

        <Building2 className="text-sky-600" size={22} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <input
          className="min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
          placeholder="Nome da área"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />

        <input
          className="min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
          placeholder="Descrição"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </div>

      <button className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700 sm:w-auto">
        <Save size={17} />
        Salvar área
      </button>
    </form>
  );
}
