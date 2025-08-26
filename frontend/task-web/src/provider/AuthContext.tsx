/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api, registerUnauthorizedHandler } from '../libs/api';

interface IAuthContext {
    token: string | null;
    isAuthed: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<IAuthContext | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}

export function AuthProvider({ children }: Readonly<React.PropsWithChildren>) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  const isAuthed = !!token;

  const login = useCallback(async (username: string, password: string) => {
    const { data } = await api.post('/auth/login', { username, password });
    localStorage.setItem('token', data.token);
    setToken(data.token);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
  }, []);

  useEffect(() => {
    registerUnauthorizedHandler(logout);
  }, [logout]);

  const value = useMemo(() => ({ token, isAuthed, login, logout }), [token, isAuthed, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

