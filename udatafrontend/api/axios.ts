import axios, { AxiosRequestConfig } from "axios";

export const TOKEN_KEY = "udata_token";
const API_BASE = "http://localhost:8080";

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config: AxiosRequestConfig = {}) => {
    // ensure headers object exists
    config.headers = config.headers ?? {};
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      // ensure header type shape is compatible
      (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      localStorage.removeItem(TOKEN_KEY);
    }
    return Promise.reject(error);
  }
);

export default api;
