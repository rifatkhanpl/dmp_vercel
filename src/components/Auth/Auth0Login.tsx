import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { LogIn, LogOut, Loader2, User, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function Auth0Login() {
  const { loginWithRedirect, logout, isAuthenticated, isLoading: auth0Loading } = useAuth0();
  const { user, isAdmin, login, logout: mockLogout } = useAuth();

  // Check if we're in development mode
  const isDevelopment = window.location.hostname === 'localhost' ||
                        window.location.hostname.includes('127.0.0.1') ||
                        import.meta.env.DEV;

  const handleLogin = async (role?: 'admin' | 'user') => {
    if (isDevelopment) {
      // Use mock login in development
      await login(role);
    } else {
      // Use Auth0 in production
      await loginWithRedirect();
    }
  };

  const handleLogout = () => {
    if (isDevelopment) {
      mockLogout();
    } else {
      logout({
        logoutParams: {
          returnTo: window.location.origin
        }
      });
    }
  };

  if (auth0Loading && !isDevelopment) {
    return (
      <div className="flex items-center space-x-2 text-gray-600">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Loading...</span>
      </div>
    );
  }

  if (isAuthenticated || user) {
    return (
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          {isAdmin ? (
            <Shield className="h-5 w-5 text-yellow-500" />
          ) : (
            <User className="h-5 w-5 text-blue-500" />
          )}
          <div className="text-sm">
            <p className="font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
            <p className="text-gray-500">{user?.role.replace('-', ' ')}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      {isDevelopment ? (
        <>
          <button
            onClick={() => handleLogin('user')}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
          >
            <LogIn className="h-4 w-4" />
            <span>Login as User</span>
          </button>
          <button
            onClick={() => handleLogin('admin')}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition duration-200"
          >
            <Shield className="h-4 w-4" />
            <span>Login as Admin</span>
          </button>
        </>
      ) : (
        <button
          onClick={() => handleLogin()}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
        >
          <LogIn className="h-4 w-4" />
          <span>Login with Auth0</span>
        </button>
      )}
    </div>
  );
}

export function Auth0UserMenu() {
  const { user, isAdmin, logout } = useAuth();
  const { logout: auth0Logout } = useAuth0();

  const isDevelopment = window.location.hostname === 'localhost' ||
                        window.location.hostname.includes('127.0.0.1') ||
                        import.meta.env.DEV;

  const handleLogout = () => {
    if (isDevelopment) {
      logout();
    } else {
      auth0Logout({
        logoutParams: {
          returnTo: window.location.origin
        }
      });
    }
  };

  if (!user) return null;

  return (
    <div className="relative group">
      <button className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition duration-200">
        {isAdmin ? (
          <Shield className="h-5 w-5 text-yellow-500" />
        ) : (
          <User className="h-5 w-5 text-blue-500" />
        )}
        <span className="text-sm font-medium text-gray-900">
          {user.firstName} {user.lastName}
        </span>
      </button>

      <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="p-4 border-b border-gray-200">
          <p className="text-sm font-medium text-gray-900">{user.email}</p>
          <p className="text-xs text-gray-500 mt-1">
            {user.role.replace('-', ' ').charAt(0).toUpperCase() + user.role.replace('-', ' ').slice(1)}
          </p>
        </div>

        <div className="p-2">
          <a
            href="/user-profile"
            className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition duration-200"
          >
            My Profile
          </a>
          <a
            href="/user-settings"
            className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition duration-200"
          >
            Settings
          </a>
          {isAdmin && (
            <a
              href="/user-management"
              className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition duration-200"
            >
              Manage Users
            </a>
          )}
          <hr className="my-2" />
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}