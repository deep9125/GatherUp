import axios from 'axios';

export const API_URL = 'http://localhost:3000/api';
export const SERVER_URL = 'http://localhost:3000'; // for building image URLs like `${SERVER_URL}/${imageUrl}`

const api = axios.create({
  baseURL: API_URL,
});

// Runs before every single request made with this instance.
// Reads the JWT saved at login and attaches it as a Bearer token,
// so every backend route wrapped in `protect` can identify the caller.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
