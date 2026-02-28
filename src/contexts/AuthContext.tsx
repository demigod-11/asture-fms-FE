import React, { createContext, useContext, useState, useCallback } from 'react';

interface AuthContextValue {
  isAuthenticated: boolean;
  emailForVerification: string | null;
  login: () => void;
  logout: () => void;
  setEmailForVerification: (email: string | null) => void;
  completeVerification: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const AUTH_KEY = 'asture-fms-auth';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return sessionStorage.getItem(AUTH_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [emailForVerification, setEmailForVerificationState] = useState<string | null>(null);

  const login = useCallback(() => {
    sessionStorage.setItem(AUTH_KEY, 'true');
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
  }, []);

  const setEmailForVerification = useCallback((email: string | null) => {
    setEmailForVerificationState(email);
  }, []);

  const completeVerification = useCallback(() => {
    sessionStorage.setItem(AUTH_KEY, 'true');
    setIsAuthenticated(true);
  }, []);

  const value: AuthContextValue = {
    isAuthenticated,
    emailForVerification,
    login,
    logout,
    setEmailForVerification,
    completeVerification,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
