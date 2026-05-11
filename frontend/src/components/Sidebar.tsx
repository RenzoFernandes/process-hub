import {
  LayoutDashboard,
  FolderTree,
  Building2,
  Settings,
} from "lucide-react";

export function Sidebar() {
  return (
    <aside className="w-72 bg-slate-900/80 backdrop-blur-xl border-r border-slate-800 flex flex-col p-6">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-white">
          ProcessHub
        </h1>

        <p className="text-slate-400 text-sm mt-2">
          Enterprise Process Mapping
        </p>
      </div>

      <nav className="flex flex-col gap-3">
        <button className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 hover:bg-cyan-500/20 transition">
          <LayoutDashboard size={18} />
          Dashboard
        </button>

        <button className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-300 hover:bg-slate-800 transition">
          <FolderTree size={18} />
          Processes
        </button>

        <button className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-300 hover:bg-slate-800 transition">
          <Building2 size={18} />
          Areas
        </button>
      </nav>

      <div className="mt-auto">
        <button className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-400 hover:bg-slate-800 transition w-full">
          <Settings size={18} />
          Settings
        </button>
      </div>
    </aside>
  );
}