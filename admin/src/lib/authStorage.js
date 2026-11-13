import { STORAGE_KEYS } from './storageKeys';

export function getAccessToken() {
  try {
    return localStorage.getItem(STORAGE_KEYS.accessToken) || null;
  } catch {
    return null;
  }
}

export function setAccessToken(token) {
  try {
    if (token) localStorage.setItem(STORAGE_KEYS.accessToken, token);
    else localStorage.removeItem(STORAGE_KEYS.accessToken);
  } catch {
    /* ignore */
  }
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.user);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user) {
  try {
    if (user) localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEYS.user);
  } catch {
    /* ignore */
  }
}

export function clearAuthStorage() {
  setAccessToken(null);
  setStoredUser(null);
}
