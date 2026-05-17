import axios from 'axios';

export const BASE_URL = 'http://localhost:5000/api';

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('partnerToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch (e) {}
  return config;
});

export default api;