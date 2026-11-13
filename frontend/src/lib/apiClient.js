import { getAccessToken } from './authStorage';

export class ApiError extends Error {
  constructor(message, status, payload) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;
  }
}

let onUnauthorized = null;

export function setUnauthorizedHandler(handler) {
  onUnauthorized = handler;
}

/**
 * Central HTTP client for the storefront.
 * Sends JWT via Authorization header and httpOnly cookie (credentials: include).
 */
export async function apiRequest(path, options = {}) {
  const token = getAccessToken();
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  const headers = {
    Accept: 'application/json',
    ...(options.body && !isFormData ? { 'Content-Type': 'application/json' } : {}),
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(path, {
    ...options,
    headers,
    credentials: 'include',
    body: isFormData
      ? options.body
      : options.body && typeof options.body !== 'string'
        ? JSON.stringify(options.body)
        : options.body,
  });

  let payload = {};
  try {
    payload = await res.json();
  } catch {
    payload = {};
  }

  if (res.status === 401 && onUnauthorized) {
    onUnauthorized();
  }

  const message =
    payload?.message || payload?.error || `Request failed (${res.status})`;

  if (!res.ok) {
    throw new ApiError(message, res.status, payload);
  }

  return payload;
}

export const api = {
  get: (path, options) => apiRequest(path, { ...options, method: 'GET' }),
  post: (path, body, options) => apiRequest(path, { ...options, method: 'POST', body }),
  put: (path, body, options) => apiRequest(path, { ...options, method: 'PUT', body }),
  patch: (path, body, options) => apiRequest(path, { ...options, method: 'PATCH', body }),
  delete: (path, options) => apiRequest(path, { ...options, method: 'DELETE' }),
};
