import axios from 'axios';

// One Axios instance used by the whole app.
// baseURL "/api" is forwarded to the backend by the Vite proxy (see vite.config.js).
const api = axios.create({ baseURL: '/api' });

// Before every request, attach the login token (if the user is logged in)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
