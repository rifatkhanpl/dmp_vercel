import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types/user';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  requiredPermission?: string;
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  requiredRole,
  requiredPermission,
  redirectTo = '/signin'
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user, hasRole, hasPermission } = useAuth();

  // Show loading spinner while authentication is being determined
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  // Check if we're in development mode and allow bypass
  const isDevelopment = window.location.hostname === 'localhost' || 
                       window.location.hostname.includes('bolt.new') ||
                       window.location.hostname.includes('127.0.0.1') ||
                       import.meta.env.DEV;

  // In development, if Auth0 isn't working, allow access to prevent redirect loops
  if (isDevelopment && !isAuthenticated && !user) {
    // Check if we're already on a sign-in page to prevent redirect loops
    const currentPath = window.location.pathname;
    if (currentPath === '/signin' || currentPath === '/signup' || currentPath === '/') {
      return <Navigate to={redirectTo} replace />;
    }
    
    // For other protected routes in development, show a bypass option
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">
            You need to be signed in to access this page.
          </p>
          <div className="space-y-3">
            <a
              href="/signin"
              className="block w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Sign In
            </a>
            <a
              href="/dashboard"
              className="block w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Skip Auth (Development Only)
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Redirect to sign-in if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to={redirectTo} replace />;
  }

  // Check role requirement
  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Check permission requirement
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}

// Admin-only route component
export function AdminRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole="administrator">
      {children}
    </ProtectedRoute>
  );
}

// User-only route component
export function UserRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole="provider-relations-coordinator">
      {children}
    </ProtectedRoute>
  );
}