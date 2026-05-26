import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Usuario } from '../api/auth';
import { login as apiLogin, getPainel } from '../api/auth';

interface AuthContextType {
  user: Usuario | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, senha: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const signOut = useCallback(() => {
    setUser(null);
  }, []);

  useEffect(() => {
    getPainel()
      .then(({ user: u }) => setUser(u))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  const signIn = useCallback(async (email: string, senha: string) => {
    await apiLogin(email, senha);
    const { user: u } = await getPainel();
    setUser(u);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}
