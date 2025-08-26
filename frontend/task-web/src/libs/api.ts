import axios from 'axios';

export const api = axios.create({
  baseURL: '/api',
});

let onUnauthorized: (() => void) | null = null;
export function registerUnauthorizedHandler(fn: (() => void) | null) { onUnauthorized = fn; }

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401 && typeof onUnauthorized === 'function') {
      onUnauthorized();
    }
    return Promise.reject(err);
  }
);