import axios from 'axios';

const client = axios.create({
  // In dev: http://localhost:8080 (from .env.development)
  // In prod: '' — empty base so requests go to the same origin, proxied by Nginx
  baseURL: import.meta.env.VITE_API_URL ?? '',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default client;
