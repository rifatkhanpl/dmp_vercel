import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { User, UserRole } from '../types/user';
import { ROLES, ROLE_PERMISSIONS } from '../config/auth0';
import { errorService } from '../services/errorService';

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  isEmailVerified: boolean;
  createdAt: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => void;
  getAccessToken: () => Promise<string | undefined>;
  verifyEmail: (token: string) => Promise<{ success: boolean; message: string }>;
  resendVerification: (email: string) => Promise<{ success: boolean; message: string }>;
  hasRole: (role: UserRole) => boolean;
  hasPermission: (permission: string) => boolean;
  isAdmin: boolean;
  availableRoles: UserRole[];
  switchRole: (role: UserRole) => void;
}

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
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const [availableRoles, setAvailableRoles] = useState<UserRole[]>([]);

  // Check if we're in development mode
  const isDevelopment = window.location.hostname === 'localhost' || 
                       window.location.hostname.includes('bolt.new') ||
                       window.location.hostname.includes('127.0.0.1') ||
                       import.meta.env.DEV;

  // Mock user for development
  const [mockUser, setMockUser] = useState<AuthUser | null>(null);
  const [useMockAuth, setUseMockAuth] = useState(false);

  // Get persisted role from localStorage
  const getPersistedRole = (): UserRole | null => {
    const stored = localStorage.getItem('selectedRole');
    return stored as UserRole | null;
  };

  const [selectedRole, setSelectedRole] = useState<UserRole | null>(getPersistedRole());

  // Get all available roles from Auth0
  const getUserRoles = (auth0User: any): UserRole[] => {
    console.log('Auth0 User Object:', auth0User);
    console.log('Full user object keys:', Object.keys(auth0User));
    const roles: UserRole[] = [];

    // Check user_metadata first (most common place for custom data)
    if (auth0User.user_metadata?.role) {
      console.log('Found user_metadata role:', auth0User.user_metadata.role);
      const metaRole = auth0User.user_metadata.role;
      if (metaRole === 'administrator' || metaRole === 'admin' || metaRole === 'Admin') {
        roles.push('administrator');
      } else {
        roles.push('provider-relations-coordinator');
      }
    }

    // Check for roles array in user_metadata
    if (auth0User.user_metadata?.roles && Array.isArray(auth0User.user_metadata.roles)) {
      console.log('Found user_metadata roles array:', auth0User.user_metadata.roles);
      auth0User.user_metadata.roles.forEach((role: string) => {
        if ((role === 'administrator' || role === 'admin' || role === 'Admin') && !roles.includes('administrator')) {
          roles.push('administrator');
        } else if (!roles.includes('provider-relations-coordinator')) {
          roles.push('provider-relations-coordinator');
        }
      });
    }

    // Check custom claims (in case they exist - but they currently don't)
    const namespacedRoles = auth0User['https://practicelink.com/roles'];
    if (Array.isArray(namespacedRoles)) {
      console.log('Found namespaced roles array:', namespacedRoles);
      namespacedRoles.forEach(role => {
        if (role === 'Admin' || role === 'administrator') {
          if (!roles.includes('administrator')) roles.push('administrator');
        } else if (role === 'provider-relations-coordinator' || role === 'User') {
          if (!roles.includes('provider-relations-coordinator')) roles.push('provider-relations-coordinator');
        }
      });
    } else if (auth0User['https://practicelink.com/role']) {
      // Single role in custom claim
      const singleRole = auth0User['https://practicelink.com/role'];
      console.log('Found single namespaced role:', singleRole);
      if (singleRole === 'Admin' || singleRole === 'administrator') {
        if (!roles.includes('administrator')) roles.push('administrator');
      } else if (!roles.includes('provider-relations-coordinator')) {
        roles.push('provider-relations-coordinator');
      }
    }

    // Check app_metadata.authorization.roles (this is where your Auth0 stores roles!)
    if (auth0User.app_metadata?.authorization?.roles && Array.isArray(auth0User.app_metadata.authorization.roles)) {
      console.log('Found app_metadata.authorization.roles:', auth0User.app_metadata.authorization.roles);
      auth0User.app_metadata.authorization.roles.forEach((role: string) => {
        // Map Auth0 roles to application roles
        if (role === 'superadminudb' || role === 'administrator' || role === 'Admin') {
          if (!roles.includes('administrator')) roles.push('administrator');
        } else if ((role === 'user' || role === 'User') && !roles.includes('provider-relations-coordinator')) {
          roles.push('provider-relations-coordinator');
        }
      });
    }

    // Check app_metadata.roles (simpler structure)
    else if (auth0User.app_metadata?.roles) {
      console.log('Found app_metadata.roles:', auth0User.app_metadata.roles);
      auth0User.app_metadata.roles.forEach((role: string) => {
        if ((role === 'administrator' || role === 'Admin') && !roles.includes('administrator')) {
          roles.push('administrator');
        } else if (!roles.includes('provider-relations-coordinator')) {
          roles.push('provider-relations-coordinator');
        }
      });
    } else if (auth0User.app_metadata?.role) {
      const appRole = auth0User.app_metadata.role;
      console.log('Found app_metadata single role:', appRole);
      if (appRole === 'administrator' && !roles.includes('administrator')) {
        roles.push('administrator');
      }
    }

    // If no roles found, default to provider-relations-coordinator
    if (roles.length === 0) {
      console.log('No roles found, defaulting to provider-relations-coordinator');
      roles.push('provider-relations-coordinator');
    }

    console.log('Available roles:', roles);
    return roles;
  };

  useEffect(() => {
    console.log('AuthContext useEffect triggered:', {
      auth0IsAuthenticated,
      auth0IsLoading,
      hasAuth0User: !!auth0User,
      isDevelopment,
      useMockAuth
    });

    // In development, allow mock authentication if Auth0 fails
    if (isDevelopment && !auth0IsAuthenticated && !auth0IsLoading && !useMockAuth) {
      console.log('Development mode: Auth0 not working, enabling mock auth');
      setUseMockAuth(true);
      return;
    }

    if (useMockAuth && isDevelopment) {
      // Use mock authentication in development
      if (!mockUser) {
        const defaultMockUser: AuthUser = {
          id: 'mock-user-1',
          firstName: 'Demo',
          lastName: 'User',
          email: 'demo@practicelink.com',
          role: 'administrator',
          isEmailVerified: true,
          createdAt: new Date().toISOString()
        };
        setMockUser(defaultMockUser);
        setUser(defaultMockUser);
        setAvailableRoles(['administrator', 'provider-relations-coordinator']);
        setUserPermissions(ROLE_PERMISSIONS['administrator']);
        console.log('Mock auth enabled with demo user');
      }
      return;
    }

    if (!auth0IsLoading && !useMockAuth) {
      if (auth0IsAuthenticated && auth0User) {
        console.log('Auth0 authenticated, processing user...', auth0User);
        const roles = getUserRoles(auth0User);
        setAvailableRoles(roles);

        // Use persisted selected role if valid, otherwise use first available role
        let activeRole = selectedRole;
        if (!activeRole || !roles.includes(activeRole)) {
          // Only set default role on first load, not on every render
          const persistedRole = getPersistedRole();
          if (persistedRole && roles.includes(persistedRole)) {
            activeRole = persistedRole;
          } else {
            activeRole = roles.includes('administrator') ? 'administrator' : roles[0];
          }
          setSelectedRole(activeRole);
          localStorage.setItem('selectedRole', activeRole);
        }

        const authUser: AuthUser = {
          id: auth0User.sub || '',
          firstName: auth0User.given_name || auth0User.name?.split(' ')[0] || '',
          lastName: auth0User.family_name || auth0User.name?.split(' ')[1] || '',
          email: auth0User.email || '',
          role: activeRole,
          isEmailVerified: auth0User.email_verified || false,
          createdAt: new Date().toISOString()
        };
        console.log('Setting user with active role:', activeRole, 'Available roles:', roles);
        setUser(authUser);

        // Set permissions based on active role
        const permissions = ROLE_PERMISSIONS[activeRole] || [];
        setUserPermissions(permissions);

        console.log('Auth0 login successful, user set:', authUser);
      } else if (!auth0IsAuthenticated) {
        console.log('Auth0 not authenticated, clearing user');
        setUser(null);
        setUserPermissions([]);
        setAvailableRoles([]);
        setSelectedRole(null);
      }
    }
  }, [auth0IsAuthenticated, auth0User, auth0IsLoading, selectedRole]);

  const login = async () => {
    if (isDevelopment && useMockAuth) {
      // Mock login in development
      const mockUser: AuthUser = {
        id: 'mock-user-1',
        firstName: 'Demo',
        lastName: 'User',
        email: 'demo@practicelink.com',
        role: 'administrator',
        isEmailVerified: true,
        createdAt: new Date().toISOString()
      };
      setMockUser(mockUser);
      setUser(mockUser);
      setAvailableRoles(['administrator', 'provider-relations-coordinator']);
      setUserPermissions(ROLE_PERMISSIONS['administrator']);
      return;
    }

    try {
      console.log('AuthContext login called');
      console.log('Login config:', {
        domain: 'dev-c4u34lk8e3qzwt8q.us.auth0.com',
        clientId: 'Aha8XFlrZi7rMcOzb4Jaz3GQ9jFEC6M4',
        redirectUri: `${window.location.origin}/callback`
      });

      await loginWithRedirect({
        authorizationParams: {
          redirect_uri: `${window.location.origin}/callback`
        }
      });
    } catch (error) {
      console.error('AuthContext login error:', error);
      
      // In development, fall back to mock auth if Auth0 fails
      if (isDevelopment) {
        console.log('Auth0 failed in development, falling back to mock auth');
        setUseMockAuth(true);
        errorService.showWarning('Auth0 connection failed. Using development mode.');
        return;
      }
      
      throw error;
    }
  };

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    if (isDevelopment && useMockAuth) {
      // Mock registration in development
      const mockUser: AuthUser = {
        id: 'mock-user-2',
        firstName,
        lastName,
        email,
        role: 'provider-relations-coordinator',
        isEmailVerified: true,
        createdAt: new Date().toISOString()
      };
      setMockUser(mockUser);
      setUser(mockUser);
      setAvailableRoles(['provider-relations-coordinator']);
      setUserPermissions(ROLE_PERMISSIONS['provider-relations-coordinator']);
      return;
    }

    // Redirect to Auth0 signup
    await loginWithRedirect({
      authorizationParams: {
        redirect_uri: `${window.location.origin}/callback`,
        screen_hint: 'signup'
      }
    });
  };

  const logout = () => {
    if (isDevelopment && useMockAuth) {
      // Mock logout
      setMockUser(null);
      setUser(null);
      setUserPermissions([]);
      setAvailableRoles([]);
      localStorage.removeItem('selectedRole');
      return;
    }

    // Clear persisted role on logout
    localStorage.removeItem('selectedRole');
    auth0Logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  };

  const getAccessToken = async (): Promise<string | undefined> => {
    if (isDevelopment && useMockAuth) {
      return 'mock-access-token';
    }

    try {
      return await getAccessTokenSilently();
    } catch (error) {
      console.error('Error getting access token:', error);
      return undefined;
    }
  };

  const verifyEmail = async (token: string) => {
    if (isDevelopment && useMockAuth) {
      return { success: true, message: 'Email verified (mock)' };
    }

    // Email verification handled by Auth0
    console.log('Email verification handled by Auth0');
    return { success: true, message: 'Email verification handled by Auth0' };
  };

  const resendVerification = async (email: string) => {
    if (isDevelopment && useMockAuth) {
      return { success: true, message: 'Verification email sent (mock)' };
    }

    // Resend verification handled by Auth0
    console.log('Resend verification handled by Auth0');
    return { success: true, message: 'Resend verification handled by Auth0' };
  };

  const hasRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  const hasPermission = (permission: string): boolean => {
    return userPermissions.includes(permission);
  };

  const switchRole = (role: UserRole) => {
    if (availableRoles.includes(role)) {
      console.log('Switching role to:', role);
      setSelectedRole(role);
      localStorage.setItem('selectedRole', role);
      
      // Update current user role
      if (user) {
        const updatedUser = { ...user, role };
        setUser(updatedUser);
        if (mockUser) {
          setMockUser(updatedUser);
        }
        setUserPermissions(ROLE_PERMISSIONS[role] || []);
      }
      // Don't need page reload, useEffect will handle the update
    }
  };

  const isAdmin = user?.role === 'administrator' || (isDevelopment && useMockAuth && user?.role === 'administrator');

  const value: AuthContextType = {
    user,
    isLoading: useMockAuth ? false : auth0IsLoading,
    isAuthenticated: useMockAuth ? !!mockUser : (auth0IsAuthenticated && !!user),
    login,
    register,
    logout,
    getAccessToken,
    verifyEmail,
    resendVerification,
    hasRole,
    hasPermission,
    isAdmin,
    availableRoles,
    switchRole
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
