import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Usuario } from '../api/auth';
import { login as apiLogin, getPainel } from '../api/auth';

interface AuthContextType {
  user: Usuario | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, senha: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const signOut = useCallback(() => {
    localStorage.removeItem('@indietest:token');
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    const savedToken = localStorage.getItem('@indietest:token');
    if (!savedToken) {
      setIsLoading(false);
      return;
    }
    setToken(savedToken);
    getPainel()
      .then(({ user: u }) => setUser(u))
      .catch(() => {
        localStorage.removeItem('@indietest:token');
        setToken(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const signIn = useCallback(async (email: string, senha: string) => {
    const data = await apiLogin(email, senha);
    localStorage.setItem('@indietest:token', data.token);
    setToken(data.token);
    const { user: u } = await getPainel();
    setUser(u);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}
