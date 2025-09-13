import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  permissions: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (role?: 'user' | 'admin') => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isAuthenticated = !!user;

  // Check if we're in development environment
  const isDevelopment = window.location.hostname === 'localhost' || 
                       window.location.hostname.includes('bolt.new') ||
                       window.location.hostname.includes('127.0.0.1') ||
                       window.location.port === '5173';

  const login = (role: 'user' | 'admin' = 'user') => {
    setIsLoading(true);
    
    // Simulate authentication delay
    setTimeout(() => {
      if (isDevelopment) {
        // Mock user data for development
        const mockUser: User = role === 'admin' 
          ? {
              id: 'admin-123',
              email: 'admin@practicelink.com',
              name: 'Administrator',
              role: 'admin',
              permissions: ['read', 'write', 'delete', 'admin']
            }
          : {
              id: 'user-456',
              email: 'user@practicelink.com',
              name: 'Standard User',
              role: 'user',
              permissions: ['read', 'write']
            };
        
        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
      } else {
        // In production, this would handle Auth0 authentication
        console.log('Production Auth0 login would happen here');
      }
      
      setIsLoading(false);
    }, 1000);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    if (isDevelopment) {
      window.location.href = '/signin';
    } else {
      // In production, this would handle Auth0 logout
      console.log('Production Auth0 logout would happen here');
    }
  };

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      login,
      logout
    }}>
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