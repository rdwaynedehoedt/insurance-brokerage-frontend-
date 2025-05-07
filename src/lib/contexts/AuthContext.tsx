'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authService, User, LoginCredentials } from '../services/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials, rememberMe?: boolean) => Promise<void>;
  logout: () => void;
  userRole: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Map roles to their dashboard paths
const roleDashboardMap = {
  'admin': '/admin/dashboard',
  'manager': '/manager-dashboard',
  'underwriter': '/underwriter-dashboard',
  'sales': '/sales-dashboard'
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    setIsLoading(true);
    try {
      if (authService.isAuthenticated()) {
        // First try to get user from storage for faster UI loading
        const storedUser = authService.getStoredUser();
        if (storedUser) {
          setUser(storedUser);
          setIsAuthenticated(true);
        }

        try {
          // Then fetch fresh user data from API
          const userData = await authService.getCurrentUser();
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          if (storedUser) {
            // If API fails but we have stored user, keep them logged in
            // They might be offline or API might be temporarily down
          } else {
            // If no stored user and API fails, log them out
            authService.logout();
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      authService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials, rememberMe = false) => {
    try {
      const { user } = await authService.login(credentials, rememberMe);
      setUser(user);
      setIsAuthenticated(true);
      
      // Redirect based on role
      redirectToDashboard(user.role);
    } catch (error) {
      setIsAuthenticated(false);
      throw error;
    }
  };

  const redirectToDashboard = (role: string) => {
    const dashboardPath = roleDashboardMap[role as keyof typeof roleDashboardMap];
    if (dashboardPath) {
      router.push(dashboardPath);
    } else {
      router.push('/');
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    router.push('/login');
  };

  const userRole = user?.role || authService.getUserRole();

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoading, 
        isAuthenticated, 
        login, 
        logout,
        userRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 