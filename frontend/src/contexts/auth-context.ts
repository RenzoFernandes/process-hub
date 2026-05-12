import { createContext } from "react";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthOrganization {
  id: string;
  name: string;
  slug: string;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
  organization: AuthOrganization;
}

export interface AuthContextValue {
  token: string | null;
  user: AuthUser | null;
  organization: AuthOrganization | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (input: {
    name: string;
    email: string;
    password: string;
    workspaceName: string;
  }) => Promise<void>;
  updateWorkspace: (name: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
