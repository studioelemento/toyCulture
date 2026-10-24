import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const AUTH_STORAGE_KEY = 'toyculture_auth_user';

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem(AUTH_STORAGE_KEY);
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      console.error('Failed to load auth state from localStorage', e);
      return null;
    }
  });

  const [isAuthDrawerOpen, setIsAuthDrawerOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register' | 'lost-password'

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to save auth state to localStorage', e);
    }
  }, [currentUser]);

  const openAuthDrawer = (mode = 'login') => {
    setAuthMode(mode);
    setIsAuthDrawerOpen(true);
  };

  const closeAuthDrawer = () => {
    setIsAuthDrawerOpen(false);
  };

  const login = (usernameOrEmail, password) => {
    const user = {
      name: usernameOrEmail.split('@')[0] || 'User',
      email: usernameOrEmail.includes('@') ? usernameOrEmail : `${usernameOrEmail}@example.com`,
      username: usernameOrEmail,
    };
    setCurrentUser(user);
    closeAuthDrawer();
    return user;
  };

  const register = (username, email, password) => {
    const user = {
      name: username || email.split('@')[0] || 'User',
      email: email,
      username: username || email,
    };
    setCurrentUser(user);
    closeAuthDrawer();
    return user;
  };

  const googleLogin = () => {
    const user = {
      name: 'Google User',
      email: 'user@gmail.com',
      username: 'google_user',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    };
    setCurrentUser(user);
    closeAuthDrawer();
    return user;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoggedIn: !!currentUser,
        isAuthDrawerOpen,
        authMode,
        setAuthMode,
        openAuthDrawer,
        closeAuthDrawer,
        login,
        register,
        googleLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
