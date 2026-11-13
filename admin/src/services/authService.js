import { api } from '../lib/apiClient';

const AUTH_BASE = '/api/auth';

export function login(email, password) {
  return api.post(`${AUTH_BASE}/login`, { email, password });
}

export function logout() {
  return api.post(`${AUTH_BASE}/logout`, {});
}

export function fetchSession() {
  return api.get(`${AUTH_BASE}/me`);
}
