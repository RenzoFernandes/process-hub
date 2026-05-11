interface ProcessNodeCardProps {
  data: {
    label: string;
    status?: string;
    priority?: string;
    tools?: string;
    responsibles?: string;
  };
}

export function ProcessNodeCard({ data }: ProcessNodeCardProps) {
  return (
    <div className="min-w-[260px] rounded-2xl border border-cyan-500/10 bg-slate-900/80 backdrop-blur-2xl shadow-[0_0_40px_rgba(6,182,212,0.08)] p-4 transition-all duration-300 hover:border-cyan-400/30 hover:shadow-[0_0_60px_rgba(6,182,212,0.18)]">
      <h3 className="text-white font-semibold text-lg mb-3">
        {data.label}
      </h3>

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

      {data.responsibles && (
        <p className="text-slate-400 text-sm">
          <span className="text-slate-200 font-medium">Responsible:</span>{" "}
          {data.responsibles}
        </p>
      )}
    </div>
  );
}