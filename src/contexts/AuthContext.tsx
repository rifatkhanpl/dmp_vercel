import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Check if we're in development environment
const isDevelopment = window.location.hostname === 'localhost' || 
                     window.location.hostname.includes('bolt.new') ||
                     window.location.hostname.includes('127.0.0.1') ||
                     window.location.port === '5173';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In development, simulate authentication
    if (isDevelopment) {
      setIsLoading(false);
    } else {
      // In production, you would initialize Auth0 here
      setIsLoading(false);
    }
  }, []);

  const login = () => {
    if (isDevelopment) {
      // Mock login for development
      setUser({
        id: 'dev-user-123',
        email: 'dev@example.com',
        name: 'Development User'
      });
    } else {
      // In production, redirect to Auth0
      window.location.href = '/api/auth/login';
    }
  };

  const logout = () => {
    setUser(null);
    if (!isDevelopment) {
      // In production, redirect to Auth0 logout
      window.location.href = '/api/auth/logout';
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}