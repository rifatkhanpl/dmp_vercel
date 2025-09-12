import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, User, Bell } from 'lucide-react';

export function Header() {
  const { user, logout, isAuthenticated, login } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const handleLogin = () => {
    login();
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-600">PracticeLink</h1>
            <span className="ml-2 text-sm text-gray-500">Data Management Portal</span>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Bell className="w-5 h-5" />
                </button>
                
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <a href="/dashboard" className="hover:text-blue-600 transition-colors">
                      <User className="w-5 h-5 text-gray-400 hover:text-blue-600" />
                    </a>
                    <a href="/dashboard" className="text-sm hover:text-blue-600 transition-colors cursor-pointer">
                      <div className="font-medium text-gray-900">
                        {user?.firstName} {user?.lastName}
                      </div>
                      <div className="text-gray-500">{user?.email}</div>
                    </a>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-700 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={handleLogin}
                className="flex items-center space-x-1 px-3 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
              >
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}