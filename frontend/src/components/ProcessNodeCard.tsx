import { Pencil, Trash2 } from "lucide-react";

interface ProcessNodeCardProps {
  data: {
    label: string;
    status?: string;
    priority?: string;
    tools?: string;
    responsibles?: string;
    onEdit?: () => void;
    onDelete?: () => void;
    description?: string;
    documentation?: string;
  };
}

export function ProcessNodeCard({ data }: ProcessNodeCardProps) {
  return (
    <div className="min-w-[260px] rounded-2xl border border-cyan-500/10 bg-slate-900/80 backdrop-blur-2xl shadow-[0_0_40px_rgba(6,182,212,0.08)] p-4 transition-all duration-300 hover:border-cyan-400/30 hover:shadow-[0_0_60px_rgba(6,182,212,0.18)]">
      <div className="flex items-start justify-between gap-4 mb-3">
        <h3 className="text-white font-semibold text-lg">{data.label}</h3>

        <div className="flex items-center gap-2">
          {data.onEdit && (
            <button
              onClick={data.onEdit}
              className="text-slate-500 hover:text-cyan-300 transition"
              title="Edit process"
            >
              <Pencil size={16} />
            </button>
          )}

          {data.onDelete && (
            <button
              onClick={data.onDelete}
              className="text-slate-500 hover:text-red-400 transition"
              title="Delete process"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-2 mb-3">
        {data.status && (
          <span className="px-2 py-1 text-xs rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            {data.status}
          </span>
        )}

        {data.priority && (
          <span className="px-2 py-1 text-xs rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            {data.priority}
          </span>
        )}
      </div>

      {data.tools && (
        <p className="text-slate-400 text-sm mb-2">
          <span className="text-slate-200 font-medium">Tools:</span>{" "}
          {data.tools}
        </p>
      )}

      {data.description && (
        <p className="text-slate-400 text-sm mb-3">{data.description}</p>
      )}

      {data.responsibles && (
        <p className="text-slate-400 text-sm">
          <span className="text-slate-200 font-medium">Responsible:</span>{" "}
          {data.responsibles}
        </p>
      )}

      {data.documentation && (
        <p className="text-slate-400 text-sm mt-2">
          <span className="text-slate-200 font-medium">Docs:</span>{" "}
          {data.documentation}
        </p>
      )}
    </div>
  );
}
