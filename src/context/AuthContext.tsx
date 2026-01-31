import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { login as apiLogin, logout as apiLogout, getCurrentUser, isAuthenticated } from '@/lib/api/auth';
import { ApiException } from '@/lib/api/client';
import { USER_STORAGE_KEY } from '@/lib/api/config';
import type { User, LoginRequest, UserRole } from '@/types/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  // Role helpers
  role: UserRole | null;
  isPatient: boolean;
  isDoctor: boolean;
  isHospital: boolean;
  // Auth actions
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for existing auth on mount
  useEffect(() => {
    const checkAuth = () => {
      if (isAuthenticated()) {
        const storedUser = getCurrentUser();
        setUser(storedUser);
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const login = useCallback(async (credentials: LoginRequest) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiLogin(credentials);
      setUser(response.user);
    } catch (err) {
      if (err instanceof ApiException) {
        setError(err.detail);
      } else {
        setError('An unexpected error occurred');
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    apiLogout();
    setUser(null);
    setError(null);
  }, []);

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser(prev => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      // Also update localStorage
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Role helpers
  const role = user?.role || null;
  const isPatient = role === 'patient';
  const isDoctor = role === 'doctor';
  const isHospital = role === 'hospital';

  const value: AuthContextType = {
    user,
    isLoading,
    isLoggedIn: !!user,
    // Role helpers
    role,
    isPatient,
    isDoctor,
    isHospital,
    // Auth actions
    login,
    logout,
    updateUser,
    error,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Helper hook to require specific role
export function useRequireRole(requiredRole: UserRole) {
  const { user, isLoading, role } = useAuth();
  
  return {
    isLoading,
    isAuthorized: !!user && role === requiredRole,
    user,
    role,
  };
}
