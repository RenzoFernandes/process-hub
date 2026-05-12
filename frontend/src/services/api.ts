import axios from "axios";

// Cliente HTTP centralizado para manter a comunicacao REST com o backend em um unico ponto.
export const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL || "http://localhost:3333",
});

export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    return;
  }

  delete api.defaults.headers.common.Authorization;
}