import { useState } from "react";
import type { FormEvent } from "react";
import { Boxes, Building2, Lock, LogIn, UserPlus } from "lucide-react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

type AuthMode = "login" | "register";

export function Auth() {
  const { isAuthenticated, login, register } = useAuth();
  const [mode, setMode] = useState<AuthMode>("login");
  const [name, setName] = useState("");
  const [workspaceName, setWorkspaceName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/processos" replace />;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register({
          name,
          email,
          password,
          workspaceName,
        });
      }
    } catch (requestError: unknown) {
      const fallback = "Nao foi possivel autenticar. Confira os dados.";
      const message =
        typeof requestError === "object" &&
        requestError !== null &&
        "response" in requestError
          ? (requestError as { response?: { data?: { error?: string } } })
              .response?.data?.error
          : undefined;

      setError(message || fallback);
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClass =
    "min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 lg:py-2";

  return (
    <main className="grid min-h-screen overflow-y-auto bg-[#f7f9fc] text-slate-950 lg:h-screen lg:overflow-hidden lg:grid-cols-[minmax(0,1fr)_440px]">
      <section className="relative hidden overflow-hidden border-r border-slate-200 bg-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between lg:p-8">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute left-10 top-16 h-56 w-56 rounded-full bg-sky-500 blur-3xl" />
          <div className="absolute bottom-20 right-8 h-64 w-64 rounded-full bg-emerald-400 blur-3xl" />
        </div>

        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white text-slate-950">
              <Boxes size={23} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">ProcessHub</h1>
              <p className="text-sm text-slate-300">Process workspace</p>
            </div>
          </div>

          <div className="mt-20 max-w-xl lg:mt-12">
            <p className="text-sm font-semibold uppercase tracking-wide text-sky-300">
              Multi-tenant SaaS
            </p>
            <h2 className="mt-3 text-4xl font-bold leading-tight lg:text-3xl">
              Organize processos por workspace, equipe e hierarquia.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-300 lg:mt-3 lg:text-sm lg:leading-6">
              Cada organizacao acessa apenas suas areas, processos,
              subprocessos e documentacao operacional.
            </p>
          </div>
        </div>

        <div className="relative grid gap-3 text-sm text-slate-300 lg:gap-2 lg:text-xs">
          <div className="rounded-lg border border-white/10 bg-white/5 p-4 lg:p-3">
            Isolamento de dados por workspace
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-4 lg:p-3">
            Login seguro com JWT e senha criptografada
          </div>
        </div>
      </section>

      <section className="flex items-center justify-center p-4 sm:p-6 lg:min-h-0 lg:p-4">
        <div className="w-full max-w-md">
          <div className="mb-6 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-950 text-white">
              <Boxes size={21} />
            </div>
            <div>
              <h1 className="text-xl font-bold">ProcessHub</h1>
              <p className="text-xs text-slate-500">Process workspace</p>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/60 sm:p-6 lg:p-4">
            <div className="mb-6 lg:mb-4">
              <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">
                {mode === "login" ? "Acessar workspace" : "Criar workspace"}
              </p>
              <h2 className="mt-2 text-2xl font-bold text-slate-950 lg:mt-1 lg:text-xl">
                {mode === "login" ? "Bem-vindo de volta" : "Comece sua organizacao"}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500 lg:mt-1 lg:leading-5">
                {mode === "login"
                  ? "Entre para visualizar os processos do seu workspace."
                  : "Crie sua conta e um workspace isolado para sua empresa."}
              </p>
            </div>

            <div className="mb-5 grid grid-cols-2 rounded-lg bg-slate-100 p-1 lg:mb-4">
              <button
                type="button"
                onClick={() => setMode("login")}
                className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
                  mode === "login"
                    ? "bg-white text-slate-950 shadow-sm"
                    : "text-slate-500 hover:text-slate-950"
                }`}
              >
                Entrar
              </button>
              <button
                type="button"
                onClick={() => setMode("register")}
                className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
                  mode === "register"
                    ? "bg-white text-slate-950 shadow-sm"
                    : "text-slate-500 hover:text-slate-950"
                }`}
              >
                Criar
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-4 lg:gap-3">
              {mode === "register" && (
                <>
                  <label className="grid gap-1.5">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Nome
                    </span>
                    <input
                      className={inputClass}
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Nome Sobrenome"
                      required
                    />
                  </label>

                  <label className="grid gap-1.5">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Workspace
                    </span>
                    <div className="relative">
                      <Building2
                        className="pointer-events-none absolute left-3 top-3 text-slate-400"
                        size={16}
                      />
                      <input
                        className={`${inputClass} w-full pl-9`}
                        value={workspaceName}
                        onChange={(event) =>
                          setWorkspaceName(event.target.value)
                        }
                        placeholder="Empresa"
                        required
                      />
                    </div>
                  </label>
                </>
              )}

              <label className="grid gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Email
                </span>
                <input
                  className={inputClass}
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="voce@empresa.com"
                  required
                />
              </label>

              <label className="grid gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Senha
                </span>
                <div className="relative">
                  <Lock
                    className="pointer-events-none absolute left-3 top-3 text-slate-400"
                    size={16}
                  />
                  <input
                    className={`${inputClass} w-full pl-9`}
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Minimo 6 caracteres"
                    required
                  />
                </div>
              </label>

              {error && (
                <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                  {error}
                </div>
              )}

              <button
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300 lg:py-2"
              >
                {mode === "login" ? <LogIn size={17} /> : <UserPlus size={17} />}
                {isSubmitting
                  ? "Processando..."
                  : mode === "login"
                    ? "Entrar"
                    : "Criar workspace"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
