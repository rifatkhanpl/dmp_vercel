import React, { createContext, useContext, useState, ReactNode } from 'react';

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
  login: (role?: 'user' | 'admin') => Promise<void>;
  logout: () => void;
  switchRole: (role: 'user' | 'admin') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (role: 'user' | 'admin' = 'user') => {
    console.log('Login called with role:', role);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: role === 'admin' ? 'admin-123' : 'user-456',
      email: role === 'admin' ? 'admin@practicelink.com' : 'user@practicelink.com',
      name: role === 'admin' ? 'Administrator' : 'John Doe',
      role,
      permissions: role === 'admin' 
        ? ['read', 'write', 'delete', 'admin'] 
        : ['read', 'write']
    };
    
    setUser(mockUser);
    setIsAuthenticated(true);
    console.log('User logged in:', mockUser);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const switchRole = (role: 'user' | 'admin') => {
    if (user) {
      const updatedUser: User = {
        ...user,
        role,
        id: role === 'admin' ? 'admin-123' : 'user-456',
        email: role === 'admin' ? 'admin@practicelink.com' : 'user@practicelink.com',
        name: role === 'admin' ? 'Administrator' : 'John Doe',
        permissions: role === 'admin' 
          ? ['read', 'write', 'delete', 'admin'] 
          : ['read', 'write']
      };
      setUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      login,
      logout,
      switchRole
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