import React, { createContext, useContext, useEffect, useState } from 'react';
import { login as apiLogin, setAuthToken } from '../api/client';

interface AuthUser { id: string; email: string; name: string }

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const STORAGE_KEY = 'umrah-admin-auth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const { token, user } = JSON.parse(raw);
        setAuthToken(token);
        setUser(user);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const { token, user } = await apiLogin(email, password);
    setAuthToken(token);
    setUser(user);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user }));
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
