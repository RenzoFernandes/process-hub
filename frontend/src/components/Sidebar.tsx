import {
  Boxes,
  Building2,
  Check,
  Pencil,
  FolderTree,
  LayoutDashboard,
  LogOut,
  X,
} from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function Sidebar() {
  const location = useLocation();
  const { user, organization, logout, updateWorkspace } = useAuth();
  const [isEditingWorkspace, setIsEditingWorkspace] = useState(false);
  const [workspaceName, setWorkspaceName] = useState(organization?.name || "");
  const [workspaceError, setWorkspaceError] = useState("");
  const [isSavingWorkspace, setIsSavingWorkspace] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const linkClass = (path: string) =>
    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
      isActive(path)
        ? "bg-sky-50 text-sky-700 ring-1 ring-sky-200"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
    }`;

  function openWorkspaceEditor() {
    setWorkspaceName(organization?.name || "");
    setWorkspaceError("");
    setIsEditingWorkspace(true);
  }

  async function handleWorkspaceUpdate(event: FormEvent) {
    event.preventDefault();
    setWorkspaceError("");

    if (!workspaceName.trim()) {
      setWorkspaceError("Informe o nome do workspace.");
      return;
    }

    try {
      setIsSavingWorkspace(true);
      await updateWorkspace(workspaceName.trim());
      setIsEditingWorkspace(false);
    } catch {
      setWorkspaceError("Nao foi possivel atualizar o workspace.");
    } finally {
      setIsSavingWorkspace(false);
    }
  }

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

      <div className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 lg:hidden">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-950">
            {organization?.name || "Workspace"}
          </p>
          <p className="truncate text-xs text-slate-500">{user?.name}</p>
        </div>
        <div className="flex shrink-0 gap-1">
          <button
            type="button"
            onClick={openWorkspaceEditor}
            className="rounded-md p-2 text-slate-500 transition hover:bg-sky-50 hover:text-sky-700"
            title="Editar workspace"
          >
            <Pencil size={16} />
          </button>
          <button
            type="button"
            onClick={logout}
            className="rounded-md p-2 text-slate-500 transition hover:bg-rose-50 hover:text-rose-700"
            title="Sair"
          >
            <LogOut size={17} />
          </button>
        </div>
      </div>

      <div className="mt-6 hidden rounded-lg border border-slate-200 bg-slate-50 p-3 lg:block">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Workspace atual
        </p>
        <div className="mt-2 flex items-start justify-between gap-2">
          <p className="min-w-0 break-words text-sm font-semibold text-slate-950 [overflow-wrap:anywhere]">
            {organization?.name || "Workspace"}
          </p>
          <button
            type="button"
            onClick={openWorkspaceEditor}
            className="shrink-0 rounded-md p-1.5 text-slate-500 transition hover:bg-sky-50 hover:text-sky-700"
            title="Editar workspace"
          >
            <Pencil size={14} />
          </button>
        </div>
        <p className="mt-1 break-words text-xs leading-5 text-slate-600 [overflow-wrap:anywhere]">
          {user?.name}
        </p>

        <button
          type="button"
          onClick={logout}
          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
        >
          <LogOut size={14} />
          Sair
        </button>
      </div>

      {isEditingWorkspace && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <form
            onSubmit={handleWorkspaceUpdate}
            className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-5 shadow-2xl"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-950">
                  Editar workspace
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Atualize o nome exibido para sua empresa.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsEditingWorkspace(false)}
                className="rounded-md p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-950"
                title="Fechar"
              >
                <X size={18} />
              </button>
            </div>

            <label className="grid gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Nome do workspace
              </span>
              <input
                className="min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                value={workspaceName}
                onChange={(event) => setWorkspaceName(event.target.value)}
                placeholder="Empresa"
                autoFocus
              />
            </label>

            {workspaceError && (
              <div className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {workspaceError}
              </div>
            )}

            <button
              disabled={isSavingWorkspace}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              <Check size={17} />
              {isSavingWorkspace ? "Salvando..." : "Salvar workspace"}
            </button>
          </form>
        </div>
      )}
    </aside>
  );
}
