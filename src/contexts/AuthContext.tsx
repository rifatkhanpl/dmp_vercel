import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { User, UserRole } from '../types/user';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (role?: 'user' | 'admin') => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { loginWithRedirect, logout: auth0Logout, user: auth0User, isAuthenticated: auth0IsAuthenticated, isLoading: auth0IsLoading } = useAuth0();
  const [directUser, setDirectUser] = useState<User | null>(null);
  const [isDirectAuth, setIsDirectAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check for stored direct authentication on mount
  useEffect(() => {
    const storedAuth = localStorage.getItem('directAuth');
    const storedUser = localStorage.getItem('directUser');
    
    if (storedAuth === 'true' && storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setDirectUser(user);
        setIsDirectAuth(true);
        console.log('Restored direct auth for:', user.email);
      } catch (error) {
        console.error('Failed to restore direct auth:', error);
        localStorage.removeItem('directAuth');
        localStorage.removeItem('directUser');
      }
    }
    
    // Set loading to false after checking stored auth
    setTimeout(() => setIsLoading(false), 100);
  }, []);

  const login = (role?: 'user' | 'admin') => {
    if (role) {
      // Direct login bypass
      const mockUser: User = role === 'admin' 
        ? {
            id: 'admin-1',
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@practicelink.com',
            role: 'administrator',
            isEmailVerified: true,
            createdAt: new Date().toISOString()
          }
        : {
            id: 'user-1',
            firstName: 'Standard',
            lastName: 'User',
            email: 'user@practicelink.com',
            role: 'provider-relations-coordinator',
            isEmailVerified: true,
            createdAt: new Date().toISOString()
          };

      setDirectUser(mockUser);
      setIsDirectAuth(true);
      
      // Store in localStorage for persistence
      localStorage.setItem('directAuth', 'true');
      localStorage.setItem('directUser', JSON.stringify(mockUser));
      
      console.log('Direct login successful for:', mockUser.email);
    } else {
      // Auth0 login
      loginWithRedirect();
    }
  };

  const logout = () => {
    if (isDirectAuth) {
      // Direct auth logout
      setDirectUser(null);
      setIsDirectAuth(false);
      localStorage.removeItem('directAuth');
      localStorage.removeItem('directUser');
      console.log('Direct logout successful');
    } else {
      // Auth0 logout
      auth0Logout({ logoutParams: { returnTo: window.location.origin } });
    }
  };

  // Determine current user and auth state
  const user = isDirectAuth ? directUser : (auth0User ? {
    id: auth0User.sub || '',
    firstName: auth0User.given_name || auth0User.name?.split(' ')[0] || 'User',
    lastName: auth0User.family_name || auth0User.name?.split(' ').slice(1).join(' ') || '',
    email: auth0User.email || '',
    role: (auth0User['https://practicelink.com/role'] as UserRole) || 'provider-relations-coordinator',
    isEmailVerified: auth0User.email_verified || false,
    createdAt: new Date().toISOString()
  } : null);

  const isAuthenticated = isDirectAuth || auth0IsAuthenticated;
  const finalIsLoading = isLoading || (!isDirectAuth && auth0IsLoading);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading: finalIsLoading,
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