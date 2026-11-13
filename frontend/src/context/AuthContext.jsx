import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  fetchSession,
  forgetPassword,
  googleLogin,
  login as loginApi,
  logout as logoutApi,
  register as registerApi,
  resendOtp,
  resetPassword,
  verifyOtp,
  OTP_TYPES,
} from '../services/authService';
import {
  clearAuthStorage,
  getAccessToken,
  getStoredUser,
  setAccessToken,
  setStoredUser,
} from '../lib/authStorage';
import { setUnauthorizedHandler } from '../lib/apiClient';
import { mapLegacyUser } from '../lib/userDisplay';

const AuthContext = createContext(null);

function persistSession(token, user) {
  setAccessToken(token || null);
  setStoredUser(user || null);
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => mapLegacyUser(getStoredUser()));
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [isAuthDrawerOpen, setIsAuthDrawerOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authNotice, setAuthNotice] = useState('');
  const [pendingEmail, setPendingEmail] = useState(null);

  const applyUser = useCallback((user, token) => {
    const mapped = mapLegacyUser(user);
    setCurrentUser(mapped);
    if (token) persistSession(token, mapped);
    else if (mapped) setStoredUser(mapped);
  }, []);

  const clearSession = useCallback(() => {
    setCurrentUser(null);
    clearAuthStorage();
  }, []);

  const bootstrap = useCallback(async () => {
    if (!getAccessToken()) {
      clearSession();
      setIsBootstrapping(false);
      return;
    }
    try {
      const res = await fetchSession();
      if (res?.data) {
        applyUser(res.data, getAccessToken());
      } else {
        clearSession();
      }
    } catch {
      clearSession();
    } finally {
      setIsBootstrapping(false);
    }
  }, [applyUser, clearSession]);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      clearSession();
    });
    return () => setUnauthorizedHandler(null);
  }, [clearSession]);

  const openAuthDrawer = (mode = 'login', notice = '') => {
    setAuthMode(mode);
    setAuthNotice(notice || '');
    setIsAuthDrawerOpen(true);
  };

  const closeAuthDrawer = () => {
    setIsAuthDrawerOpen(false);
    setAuthNotice('');
  };

  const login = async (email, password) => {
    const res = await loginApi(email, password);
    applyUser(res.data, res.token);
    closeAuthDrawer();
    return mapLegacyUser(res.data);
  };

  const loginWithGoogle = async (code) => {
    const res = await googleLogin(code);
    applyUser(res.data, res.token);
    closeAuthDrawer();
    return mapLegacyUser(res.data);
  };

  const register = async (payload) => {
    const res = await registerApi({ ...payload, email: payload.email?.trim().toLowerCase() });
    setPendingEmail(payload.email?.trim().toLowerCase());
    setAuthMode('verify-otp');
    return res;
  };

  const verifyRegistrationOtp = async (otp_code) => {
    if (!pendingEmail) throw new Error('No pending registration email');
    const res = await verifyOtp(pendingEmail, otp_code, OTP_TYPES.SIGN_UP);
    applyUser(res.data, res.token);
    setPendingEmail(null);
    closeAuthDrawer();
    return mapLegacyUser(res.data);
  };

  const requestPasswordReset = async (email) => {
    const normalized = email.trim().toLowerCase();
    await forgetPassword(normalized);
    setPendingEmail(normalized);
    setAuthMode('reset-otp');
  };

  const completePasswordReset = async ({ otp_code, password, confirm_password }) => {
    if (!pendingEmail) throw new Error('No pending email for reset');
    await verifyOtp(pendingEmail, otp_code, OTP_TYPES.FORGET_PASSWORD);
    await resetPassword(pendingEmail, password, confirm_password);
    setPendingEmail(null);
    setAuthMode('login');
  };

  const resendVerificationOtp = async (type = OTP_TYPES.SIGN_UP) => {
    if (!pendingEmail) throw new Error('No pending email');
    return resendOtp(pendingEmail, type);
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch {
      /* still clear locally */
    }
    clearSession();
  };

  const value = useMemo(
    () => ({
      currentUser,
      isLoggedIn: Boolean(currentUser),
      isBootstrapping,
      isAuthDrawerOpen,
      authMode,
      setAuthMode,
      authNotice,
      pendingEmail,
      openAuthDrawer,
      closeAuthDrawer,
      login,
      loginWithGoogle,
      register,
      verifyRegistrationOtp,
      requestPasswordReset,
      completePasswordReset,
      resendVerificationOtp,
      logout,
      refreshSession: bootstrap,
    }),
    [
      currentUser,
      isBootstrapping,
      isAuthDrawerOpen,
      authMode,
      authNotice,
      pendingEmail,
      applyUser,
      bootstrap,
      clearSession,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
