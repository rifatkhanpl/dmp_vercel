import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { AuthUser, AuthContextType } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { 
    user: auth0User, 
    isAuthenticated: auth0IsAuthenticated, 
    isLoading: auth0IsLoading,
    loginWithRedirect,
    logout: auth0Logout,
    getAccessTokenSilently
  } = useAuth0();

  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock admin user for development
  const createMockAdmin = (): AuthUser => ({
    id: 'mock-admin-123',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@practicelink.com',
    role: 'administrator',
    isEmailVerified: true,
    createdAt: new Date().toISOString()
  });

  // Check if we're in development environment
  const isDevelopment = window.location.hostname === 'localhost' || 
                       window.location.hostname.includes('bolt.new') ||
                       window.location.hostname.includes('127.0.0.1') ||
                       window.location.hostname.includes('dmp.pl-udbs.com') ||
                       window.location.port === '5173' ||
                       import.meta.env.DEV;

  useEffect(() => {
    if (isDevelopment) {
      // In development, check for mock user in localStorage
      let mockUser = localStorage.getItem('mockUser');
      
      // If no mock user exists, create a default admin for testing
      if (!mockUser) {
        const defaultAdmin = createMockAdmin();
        localStorage.setItem('mockUser', JSON.stringify(defaultAdmin));
        setUser(defaultAdmin);
        setIsLoading(false);
        return;
      }
      
      // If no mock user exists, create a default admin for testing
      if (!mockUser) {
        const defaultAdmin = createMockAdmin();
        localStorage.setItem('mockUser', JSON.stringify(defaultAdmin));
        setUser(defaultAdmin);
        setIsLoading(false);
        return;
      }
      
      if (mockUser) {
        try {
          setUser(JSON.parse(mockUser));
        } catch (error) {
          console.error('Error parsing mock user:', error);
          localStorage.removeItem('mockUser');
          setUser(null);
        }
      }
      setIsLoading(false);
    } else {
      // In production, use Auth0
      if (auth0IsAuthenticated && auth0User) {
        const authUser: AuthUser = {
          id: auth0User.sub || '',
          firstName: auth0User.given_name || '',
          lastName: auth0User.family_name || '',
          email: auth0User.email || '',
          role: auth0User['https://practicelink.com/role'] || 'provider-relations-coordinator',
          isEmailVerified: auth0User.email_verified || false,
          createdAt: new Date().toISOString()
        };
        setUser(authUser);
      } else {
        setUser(null);
      }
      setIsLoading(auth0IsLoading);
    }
  }, [auth0IsAuthenticated, auth0User, auth0IsLoading, isDevelopment]);

  const login = async (role: 'user' | 'admin' = 'user') => {
    if (isDevelopment) {
      // Mock authentication for development
      const mockUser: AuthUser = {
        id: `mock-${role}-${Date.now()}`,
        firstName: role === 'admin' ? 'Admin' : 'John',
        lastName: role === 'admin' ? 'User' : 'Doe',
        email: role === 'admin' ? 'admin@practicelink.com' : 'user@practicelink.com',
        role: role === 'admin' ? 'administrator' : 'provider-relations-coordinator',
        isEmailVerified: true,
        createdAt: new Date().toISOString()
      };
      
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
      setUser(mockUser);
      return;
    } else {
      // Use Auth0 for production
      await loginWithRedirect();
    }
  };

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    if (isDevelopment) {
      // Mock registration for development
      const mockUser: AuthUser = {
        id: `mock-user-${Date.now()}`,
        firstName,
        lastName,
        email,
        role: 'provider-relations-coordinator',
        isEmailVerified: false,
        createdAt: new Date().toISOString()
      };
      
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
      setUser(mockUser);
      return;
    } else {
      // In production, redirect to Auth0 signup
      await loginWithRedirect({
        authorizationParams: {
          screen_hint: 'signup'
        }
      });
    }
  };

  const logout = () => {
    if (isDevelopment) {
      localStorage.removeItem('mockUser');
      setUser(null);
      // Force page reload to ensure clean state
      window.location.reload();
    } else {
      auth0Logout({
        logoutParams: {
          returnTo: window.location.origin
        }
      });
    }
  };

  const getAccessToken = async (): Promise<string | undefined> => {
    if (isDevelopment) {
      // Return a mock JWT-like token for development
      return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtb2NrLWFkbWluLTEyMyIsImVtYWlsIjoiYWRtaW5AcHJhY3RpY2VsaW5rLmNvbSIsInJvbGUiOiJhZG1pbmlzdHJhdG9yIiwiaWF0IjoxNzM3MDQ4MDAwfQ.mock-signature';
    } else {
      try {
        return await getAccessTokenSilently();
      } catch (error) {
        console.error('Error getting access token:', error);
        return undefined;
      }
    }
  };

  const verifyEmail = async (token: string) => {
    if (isDevelopment) {
      // Mock email verification
      if (user) {
        const updatedUser = { ...user, isEmailVerified: true };
        localStorage.setItem('mockUser', JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
      return { success: true, message: 'Email verified successfully' };
    } else {
      // In production, this would be handled by Auth0
      console.log('Email verification handled by Auth0');
      return { success: true, message: 'Email verification handled by Auth0' };
    }
  };

  const resendVerification = async (email: string) => {
    if (isDevelopment) {
      // Mock resend verification
      console.log('Mock: Verification email sent to', email);
      return { success: true, message: `Verification email sent to ${email}` };
    } else {
      // In production, this would be handled by Auth0
      console.log('Resend verification handled by Auth0');
      return { success: true, message: 'Resend verification handled by Auth0' };
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    getAccessToken,
    verifyEmail,
    resendVerification
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
