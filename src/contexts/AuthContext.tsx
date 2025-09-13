import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isEmailVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (token: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if we're in development environment
  const isDevelopment = window.location.hostname === 'localhost' || 
                       window.location.hostname.includes('bolt.new') ||
                       window.location.hostname.includes('127.0.0.1') ||
                       window.location.port === '5173';

  useEffect(() => {
    // Check for existing authentication on mount
    const checkAuth = async () => {
      try {
        if (isDevelopment) {
          // In development, check localStorage for mock user
          const mockUser = localStorage.getItem('mockUser');
          if (mockUser) {
            setUser(JSON.parse(mockUser));
          }
        } else {
          // In production, check Auth0 authentication status
          // This would be implemented with actual Auth0 SDK
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [isDevelopment]);

  const login = () => {
    if (isDevelopment) {
      // Mock authentication for development
      const mockUser: User = {
        id: 'dev-user-123',
        email: 'dev@example.com',
        firstName: 'Development',
        lastName: 'User',
        role: 'admin',
        isEmailVerified: true
      };
      
      setUser(mockUser);
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
      
      // Redirect to dashboard after a brief delay
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 100);
    } else {
      // In production, redirect to Auth0
      window.location.href = '/api/auth/login';
    }
  };

  const logout = () => {
    setUser(null);
    if (isDevelopment) {
      localStorage.removeItem('mockUser');
      window.location.href = '/';
    } else {
      // In production, redirect to Auth0 logout
      window.location.href = '/api/auth/logout';
    }
  };

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    if (isDevelopment) {
      // Mock registration for development
      const mockUser: User = {
        id: 'dev-user-' + Date.now(),
        email,
        firstName,
        lastName,
        role: 'user',
        isEmailVerified: false
      };
      
      setUser(mockUser);
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
    } else {
      // In production, call Auth0 registration API
      throw new Error('Registration not implemented for production');
    }
  };

  const verifyEmail = async (token: string) => {
    if (isDevelopment) {
      // Mock email verification
      if (user) {
        const updatedUser = { ...user, isEmailVerified: true };
        setUser(updatedUser);
        localStorage.setItem('mockUser', JSON.stringify(updatedUser));
      }
    } else {
      // In production, call Auth0 email verification API
      throw new Error('Email verification not implemented for production');
    }
  };

  const resetPassword = async (email: string) => {
    if (isDevelopment) {
      // Mock password reset
      console.log('Mock password reset for:', email);
    } else {
      // In production, call Auth0 password reset API
      throw new Error('Password reset not implemented for production');
    }
  };

  const updatePassword = async (token: string, newPassword: string) => {
    if (isDevelopment) {
      // Mock password update
      console.log('Mock password update');
    } else {
      // In production, call Auth0 password update API
      throw new Error('Password update not implemented for production');
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    register,
    verifyEmail,
    resetPassword,
    updatePassword
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