import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'administrator' | 'provider-relations-coordinator';
  isEmailVerified: boolean;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (role?: 'user' | 'admin') => void;
  logout: () => void;
  getAccessToken: () => Promise<string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { user: auth0User, isAuthenticated: auth0IsAuthenticated, isLoading: auth0IsLoading, loginWithRedirect, logout: auth0Logout, getAccessTokenSilently } = useAuth0();
  
  // Direct auth state for development
  const [directUser, setDirectUser] = useState<User | null>(null);
  const [isDirectAuth, setIsDirectAuth] = useState(false);

  // Combined auth state
  const isAuthenticated = auth0IsAuthenticated || isDirectAuth;
  const isLoading = auth0IsLoading;
  const user = isDirectAuth ? directUser : (auth0User ? {
    id: auth0User.sub || '',
    firstName: auth0User.given_name || '',
    lastName: auth0User.family_name || '',
    email: auth0User.email || '',
    role: (auth0User['https://practicelink.com/role'] as 'administrator' | 'provider-relations-coordinator') || 'provider-relations-coordinator',
    isEmailVerified: auth0User.email_verified || false,
    createdAt: auth0User.created_at || new Date().toISOString(),
  } : null);

  const login = (role: 'user' | 'admin' = 'user') => {
    // Check if we're in development environment
    const isDevelopment = window.location.hostname === 'localhost' || 
                         window.location.hostname.includes('bolt.new') ||
                         window.location.hostname.includes('127.0.0.1') ||
                         window.location.port === '5173';

    if (isDevelopment) {
      // Direct login for development
      const mockUser: User = {
        id: role === 'admin' ? 'admin-123' : 'user-123',
        firstName: role === 'admin' ? 'Admin' : 'User',
        lastName: role === 'admin' ? 'Administrator' : 'Coordinator',
        email: role === 'admin' ? 'admin@practicelink.com' : 'user@practicelink.com',
        role: role === 'admin' ? 'administrator' : 'provider-relations-coordinator',
        isEmailVerified: true,
        createdAt: new Date().toISOString(),
      };
      
      setDirectUser(mockUser);
      setIsDirectAuth(true);
      
      // Redirect after a short delay
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1000);
    } else {
      // Use Auth0 for production
      loginWithRedirect();
    }
  };

  const logout = () => {
    if (isDirectAuth) {
      setDirectUser(null);
      setIsDirectAuth(false);
      window.location.href = '/signin';
    } else {
      auth0Logout({ logoutParams: { returnTo: window.location.origin + '/signin' } });
    }
  };

  const getAccessToken = async (): Promise<string> => {
    if (isDirectAuth) {
      // Return a mock token for development
      return 'mock-access-token-' + (directUser?.role === 'administrator' ? 'admin' : 'user');
    }
    
    try {
      return await getAccessTokenSilently();
    } catch (error) {
      console.error('Error getting access token:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      login,
      logout,
      getAccessToken,
    }}>
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