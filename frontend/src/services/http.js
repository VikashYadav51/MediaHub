import axios from 'axios';
import { getToken } from '../utils/store.js';

const base = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

const http = axios.create({
  baseURL: base,
  withCredentials: true, 
});

http.interceptors.request.use((cfg) => {
  const t = getToken();
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

export default http;
