import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, User, Shield } from 'lucide-react';

export function Header() {
  const { user, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">PracticeLink</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {user.role === 'admin' ? (
                <Shield className="w-4 h-4 text-blue-600" />
              ) : (
                <User className="w-4 h-4 text-gray-600" />
              )}
              <span className="text-sm text-gray-700">{user.email}</span>
              {user.role === 'admin' && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Administrator
                </span>
              )}
            </div>
            
            <button
              onClick={logout}
              className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Sign out</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}