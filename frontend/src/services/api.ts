import axios from "axios";

// Cliente HTTP centralizado para manter a comunicacao REST com o backend em um unico ponto.
export const api = axios.create({
  baseURL: "http://localhost:3333",
});
