import axios from 'axios';

const API_BASE = (
  (import.meta).env?.VITE_API_URL ?? 'http://localhost:5000/api'
);

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('cs_token')
    if (token) {
      config.headers = config.headers ?? {}
      ;(config.headers as any)['Authorization'] = `Bearer ${token}`
    }
  } catch {
    // ignore
  }
  return config
})

export default api;
