import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const savedUser = localStorage.getItem('practicelink_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('practicelink_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (role: UserRole) => {
    setIsLoading(true);
    
    // Mock user data based on role
    const mockUser: User = {
      id: role === 'admin' ? 'admin-123' : 'user-456',
      email: role === 'admin' ? 'admin@practicelink.com' : 'user@practicelink.com',
      name: role === 'admin' ? 'System Administrator' : 'Healthcare User',
      role,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };

    // Simulate API call delay
    setTimeout(() => {
      setUser(mockUser);
      localStorage.setItem('practicelink_user', JSON.stringify(mockUser));
      setIsLoading(false);
    }, 1000);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('practicelink_user');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    isAdmin: user?.role === 'admin',
    login,
    logout,
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