import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { api, setAuthToken } from "../services/api";
import { AuthContext } from "./auth-context";
import type { AuthContextValue, AuthSession } from "./auth-context";

const storageKey = "processhub.session";

function readStoredSession(): AuthSession | null {
  const rawSession = localStorage.getItem(storageKey);

  if (!rawSession) return null;

  try {
    return JSON.parse(rawSession) as AuthSession;
  } catch {
    localStorage.removeItem(storageKey);
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(() =>
    readStoredSession(),
  );
  const [isLoading, setIsLoading] = useState(true);

  const persistSession = useCallback((nextSession: AuthSession) => {
    localStorage.setItem(storageKey, JSON.stringify(nextSession));
    setAuthToken(nextSession.token);
    setSession(nextSession);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(storageKey);
    setAuthToken(null);
    setSession(null);
  }, []);

  useEffect(() => {
    async function restoreSession() {
      if (!session?.token) {
        setAuthToken(null);
        setIsLoading(false);
        return;
      }

      try {
        setAuthToken(session.token);
        const response = await api.get("/auth/me");

        persistSession({
          token: session.token,
          user: response.data.user,
          organization: response.data.organization,
        });
      } catch {
        logout();
      } finally {
        setIsLoading(false);
      }
    }

    void restoreSession();
  }, [logout, persistSession, session?.token]);

  const login = useCallback(async (email: string, password: string) => {
    const response = await api.post("/auth/login", { email, password });
    persistSession(response.data);
  }, [persistSession]);

  const register = useCallback(
    async (input: {
      name: string;
      email: string;
      password: string;
      workspaceName: string;
    }) => {
      const response = await api.post("/auth/register", input);
      persistSession(response.data);
    },
    [persistSession],
  );

  const updateWorkspace = useCallback(
    async (name: string) => {
      if (!session?.token) return;

      const response = await api.put("/auth/workspace", { name });

      persistSession({
        token: session.token,
        user: response.data.user,
        organization: response.data.organization,
      });
    },
    [persistSession, session],
  );

  const deleteWorkspace = useCallback(async () => {
    if (!session?.token) return;

    await api.delete("/auth/workspace");
    logout();
  }, [logout, session?.token]);

  const value = useMemo<AuthContextValue>(
    () => ({
      token: session?.token ?? null,
      user: session?.user ?? null,
      organization: session?.organization ?? null,
      isAuthenticated: Boolean(session?.token),
      isLoading,
      login,
      register,
      updateWorkspace,
      deleteWorkspace,
      logout,
    }),
    [
      deleteWorkspace,
      isLoading,
      login,
      logout,
      register,
      session,
      updateWorkspace,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
