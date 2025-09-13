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
  register: (email: string, password: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check if we're in development environment
  const isDevelopment = window.location.hostname === 'localhost' || 
                       window.location.hostname.includes('bolt.new') ||
                       window.location.hostname.includes('127.0.0.1') ||
                       window.location.port === '5173';

  const login = () => {
    setIsLoading(true);
    
    if (isDevelopment) {
      // Mock authentication for development
      setTimeout(() => {
        setUser({
          id: 'dev-user-1',
          email: 'dev@example.com',
          name: 'Development User'
        });
        setIsLoading(false);
      }, 1000);
    } else {
      // In production, this would integrate with Auth0
      // For now, we'll use mock authentication
      setTimeout(() => {
        setUser({
          id: 'user-1',
          email: 'user@example.com',
          name: 'Test User'
        });
        setIsLoading(false);
      }, 1000);
    }
  };

  const logout = () => {
    setUser(null);
    window.location.href = '/';
  };

  const register = async (email: string, password: string) => {
    setIsLoading(true);
    // Mock registration
    setTimeout(() => {
      setUser({
        id: 'new-user-1',
        email,
        name: email.split('@')[0]
      });
      setIsLoading(false);
    }, 1000);
  };

  const verifyEmail = async (token: string) => {
    // Mock email verification
    console.log('Verifying email with token:', token);
  };

  const resetPassword = async (email: string) => {
    // Mock password reset
    console.log('Resetting password for:', email);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    register,
    verifyEmail,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
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