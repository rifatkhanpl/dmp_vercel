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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

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