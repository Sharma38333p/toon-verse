import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

const DEFAULT_SAVED_ACCOUNTS = [
  {
    username: 'admin',
    email: 'admin@toonverse.com',
    password: 'admin123',
    role: 'admin',
    avatarColor: 'linear-gradient(135deg, #FDCB6E, #E17055)',
  },
  {
    username: 'toonfan',
    email: 'user@toonverse.com',
    password: 'user123',
    role: 'user',
    avatarColor: 'linear-gradient(135deg, #00CEC9, #81ECEC)',
  },
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('toonverse_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('toonverse_token') || null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'register'
  const [loading, setLoading] = useState(false);

  // Saved accounts for 1-click quick sign-in
  const [savedAccounts, setSavedAccounts] = useState(() => {
    try {
      const saved = localStorage.getItem('toonverse_saved_accounts');
      return saved ? JSON.parse(saved) : DEFAULT_SAVED_ACCOUNTS;
    } catch {
      return DEFAULT_SAVED_ACCOUNTS;
    }
  });

  // Keep savedAccounts synchronized with localStorage
  useEffect(() => {
    localStorage.setItem('toonverse_saved_accounts', JSON.stringify(savedAccounts));
  }, [savedAccounts]);

  useEffect(() => {
    if (token) {
      api.getMe()
        .then((res) => {
          if (res?.success && res?.user) {
            setUser(res.user);
            localStorage.setItem('toonverse_user', JSON.stringify(res.user));
          }
        })
        .catch(() => {
          // If token expired, logout
          logout();
        });
    }
  }, [token]);

  const saveAccountLocally = (acc) => {
    setSavedAccounts((prev) => {
      const filtered = prev.filter(a => a.email.toLowerCase() !== acc.email.toLowerCase());
      const colors = [
        'linear-gradient(135deg, #6C5CE7, #A29BFE)',
        'linear-gradient(135deg, #00CEC9, #81ECEC)',
        'linear-gradient(135deg, #FDCB6E, #E17055)',
        'linear-gradient(135deg, #FF6B6B, #FD79A8)',
      ];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      return [{ ...acc, avatarColor: acc.avatarColor || randomColor, lastUsed: new Date() }, ...filtered];
    });
  };

  const removeSavedAccount = (email) => {
    setSavedAccounts((prev) => prev.filter(a => a.email.toLowerCase() !== email.toLowerCase()));
  };

  const login = async (credentials, rememberMe = true) => {
    setLoading(true);
    try {
      const res = await api.login(credentials);
      if (res.success && res.token) {
        setToken(res.token);
        setUser(res.user);
        localStorage.setItem('toonverse_token', res.token);
        localStorage.setItem('toonverse_user', JSON.stringify(res.user));
        setAuthModalOpen(false);

        if (rememberMe) {
          saveAccountLocally({
            username: res.user.username,
            email: res.user.email,
            password: credentials.password,
            role: res.user.role,
          });
        }

        return { success: true };
      }
      return { success: false, message: res.message || 'Login failed' };
    } catch (err) {
      return { success: false, message: err.message || 'Network error' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData, rememberMe = true) => {
    setLoading(true);
    try {
      const res = await api.register(userData);
      if (res.success && res.token) {
        setToken(res.token);
        setUser(res.user);
        localStorage.setItem('toonverse_token', res.token);
        localStorage.setItem('toonverse_user', JSON.stringify(res.user));
        setAuthModalOpen(false);

        if (rememberMe) {
          saveAccountLocally({
            username: res.user.username,
            email: res.user.email,
            password: userData.password,
            role: res.user.role,
          });
        }

        return { success: true };
      }
      return { success: false, message: res.message || 'Registration failed' };
    } catch (err) {
      return { success: false, message: err.message || 'Network error' };
    } finally {
      setLoading(false);
    }
  };

  const quickSignIn = async (account) => {
    return login({ emailOrUsername: account.email, password: account.password }, true);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('toonverse_token');
    localStorage.removeItem('toonverse_user');
  };

  const openAuth = (mode = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuth = () => setAuthModalOpen(false);

  const isAdmin = user?.role === 'admin';
  const isAuthenticated = Boolean(user && token);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAdmin,
        isAuthenticated,
        loading,
        savedAccounts,
        saveAccountLocally,
        removeSavedAccount,
        quickSignIn,
        authModalOpen,
        authModalMode,
        openAuth,
        closeAuth,
        setAuthModalMode,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
