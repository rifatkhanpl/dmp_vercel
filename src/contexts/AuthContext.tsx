import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { User, UserRole } from '../types/user';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  getAccessToken: () => Promise<string | undefined>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const {
    user: auth0User,
    isLoading: auth0Loading,
    isAuthenticated,
    loginWithRedirect,
    logout: auth0Logout,
    getAccessTokenSilently,
  } = useAuth0();

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (isAuthenticated && auth0User) {
      // Transform Auth0 user to your User type
      // You may need to fetch additional user data from your API
      const transformedUser: User = {
        id: auth0User.sub || '',
        firstName: auth0User.given_name || auth0User.nickname || '',
        lastName: auth0User.family_name || '',
        email: auth0User.email || '',
        role: (auth0User['https://practicelink.com/role'] as UserRole) || 'provider-relations-coordinator',
        isEmailVerified: auth0User.email_verified || false,
        createdAt: auth0User.updated_at || new Date().toISOString(),
      };
      setUser(transformedUser);
    } else {
      setUser(null);
    }
  }, [isAuthenticated, auth0User]);

  const login = () => {
    loginWithRedirect().catch((error) => {
      console.error('Auth0 login error:', error);
      // You could show a user-friendly error message here
      alert('Authentication service is currently unavailable. Please try again later.');
    });
  };

  const logout = () => {
    auth0Logout({ 
      logoutParams: { 
        returnTo: window.location.origin 
      } 
    });
  };

  const getAccessToken = async () => {
    try {
      const token = await getAccessTokenSilently();
      return token;
    } catch (error) {
      console.error('Error getting access token:', error);
      return undefined;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading: auth0Loading,
      isAuthenticated,
      login,
      logout,
      getAccessToken,
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