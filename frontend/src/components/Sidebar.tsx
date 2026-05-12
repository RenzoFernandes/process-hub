import { Boxes, Building2, FolderTree, LayoutDashboard } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function Sidebar() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const linkClass = (path: string) =>
    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
      isActive(path)
        ? "bg-sky-50 text-sky-700 ring-1 ring-sky-200"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
    }`;

  return (
    <aside className="w-full shrink-0 border-b border-slate-200 bg-white/95 p-4 lg:min-h-screen lg:w-72 lg:border-b-0 lg:border-r lg:p-4">
      <div className="mb-4 lg:mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-950 text-white shadow-sm">
            <Boxes size={22} />
          </div>

          <div className="min-w-0">
            <h1 className="text-xl font-bold text-slate-950">ProcessHub</h1>
            <p className="text-xs text-slate-500">Operations workspace</p>
          </div>
        </div>
      </div>

      <nav className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
        <Link to="/" className={linkClass("/")}>
          <LayoutDashboard className="shrink-0" size={18} />
          <span className="whitespace-nowrap">Dashboard</span>
        </Link>

        <Link to="/processos" className={linkClass("/processos")}>
          <FolderTree className="shrink-0" size={18} />
          <span className="whitespace-nowrap">Processos</span>
        </Link>

        <Link to="/areas" className={linkClass("/areas")}>
          <Building2 className="shrink-0" size={18} />
          <span className="whitespace-nowrap">Areas</span>
        </Link>
      </nav>

      <div className="mt-6 hidden rounded-lg border border-slate-200 bg-slate-50 p-3 lg:block">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Workspace
        </p>
        <p className="mt-2 text-xs leading-5 text-slate-600">
          Centralize processos, responsaveis, areas e documentacao operacional
          em uma unica experiencia.
        </p>
      </div>
    </aside>
  );
}
