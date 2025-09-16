import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { NotificationCenter } from '../ui/NotificationCenter';
import { Menu, X, User, LogOut, Home } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export function Header({ onToggleSidebar, isSidebarOpen }: HeaderProps) {
  const { user, logout, isAuthenticated } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-40">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Left side - Logo and mobile menu */}
        <div className="flex items-center space-x-4">
          {isAuthenticated && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {isSidebarOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          )}
          
          <a href="/" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors">
            <Home className="h-8 w-8" />
            <div>
              <h1 className="text-xl font-bold">PracticeLink</h1>
              <p className="text-xs text-gray-500 hidden sm:block">Data Management Portal</p>
            </div>
          </a>
        </div>

        {/* Right side - User info or auth links */}
        <div className="flex items-center space-x-4">
          {isAuthenticated && <NotificationCenter />}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
                  <p className="text-xs text-gray-500 capitalize">
                    {user.role.replace(/-/g, ' ')}
                  </p>
                </div>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <a
                href="/signin"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Sign in
              </a>
              <a
                href="/signup"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Sign up
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}