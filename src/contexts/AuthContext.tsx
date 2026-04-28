import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  clearAccessToken,
  getAccessToken,
  setSessionExpiredCallback,
} from '@/services/authStorage';
import { logout as logoutApi } from '@/services/authApi';

interface AuthContextValue {
  isAuthenticated: boolean;
  emailForVerification: string | null;
  login: () => void;
  logout: () => void;
  setEmailForVerification: (email: string | null) => void;
  completeVerification: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!getAccessToken()
  );
  const [emailForVerification, setEmailForVerificationState] = useState<
    string | null
  >(null);

  const login = useCallback(() => {
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    void logoutApi()
      .catch(() => {})
      .finally(() => {
        clearAccessToken();
        setIsAuthenticated(false);
      });
  }, []);

  useEffect(() => {
    setSessionExpiredCallback(() => {
      clearAccessToken();
      setIsAuthenticated(false);
    });
    return () => setSessionExpiredCallback(null);
  }, []);

  const setEmailForVerification = useCallback((email: string | null) => {
    setEmailForVerificationState(email);
  }, []);

  const completeVerification = useCallback(() => {
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
