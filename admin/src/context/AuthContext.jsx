import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  clearAuthStorage,
  getAccessToken,
  getStoredUser,
  setAccessToken,
  setStoredUser,
} from '../lib/authStorage';
import { setUnauthorizedHandler } from '../lib/apiClient';
import { fetchSession, login as loginApi, logout as logoutApi } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser());
  const [bootstrapping, setBootstrapping] = useState(true);

  const clearSession = useCallback(() => {
    setUser(null);
    clearAuthStorage();
  }, []);

  const applySession = useCallback((profile, token) => {
    setUser(profile);
    if (token) setAccessToken(token);
    if (profile) setStoredUser(profile);
  }, []);

  const bootstrap = useCallback(async () => {
    try {
      const res = await fetchSession();
      if (res?.data?.role === 'ADMIN') {
        applySession(res.data, getAccessToken());
      } else {
        clearSession();
      }
    } catch {
      clearSession();
    } finally {
      setBootstrapping(false);
    }
  }, [applySession, clearSession]);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  useEffect(() => {
    setUnauthorizedHandler(clearSession);
    return () => setUnauthorizedHandler(null);
  }, [clearSession]);

  const login = async (email, password) => {
    const res = await loginApi(email.trim().toLowerCase(), password);
    if (res?.data?.role !== 'ADMIN') {
      await logoutApi().catch(() => {});
      clearSession();
      throw new Error('This account does not have admin access.');
    }
    applySession(res.data, res.token);
    return res.data;
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch {
      /* ignore */
    }
    clearSession();
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === 'ADMIN',
      bootstrapping,
      login,
      logout,
    }),
    [user, bootstrapping, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
