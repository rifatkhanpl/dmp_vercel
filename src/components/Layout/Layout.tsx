import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LogIn, AlertTriangle, User, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function SignIn() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const [selectedRole, setSelectedRole] = useState<'user' | 'admin'>('user');
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = () => {
    login(selectedRole);
  };

  // Check if we're in development environment
  const isDevelopment = window.location.hostname === 'localhost' || 
                       window.location.hostname.includes('bolt.new') ||
                       window.location.hostname.includes('127.0.0.1') ||
                       window.location.port === '5173';

  const handleSkipAuth = () => {
    // Bypass authentication for development
    window.location.href = '/dashboard';
  };
                       window.location.hostname.includes('bolt.new') ||
                       window.location.hostname.includes('127.0.0.1') ||
                       window.location.port === '5173';

  const handleDirectLogin = (role: 'user' | 'admin') => {
    setSelectedRole(role);
    login(role);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <a href="/" className="text-blue-600 hover:text-blue-700 transition-colors">
            <h1 className="text-4xl font-bold mb-2">PracticeLink</h1>
          </a>
          <p className="text-sm text-gray-600 mb-8">Career Management Platform</p>
          <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to access your PracticeLink account
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="space-y-6">
            {/* Direct Access Buttons for Development */}
            <div className="space-y-3">
              <p className="text-center text-sm font-medium text-gray-700 mb-4">
                Quick Access (Development)
              </p>
              
              <button
                onClick={() => handleDirectLogin('user')}
                className="w-full flex items-center justify-center py-3 px-4 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <User className="mr-2 h-5 w-5" />
                Sign in as User
              </button>
              
              <button
                onClick={() => handleDirectLogin('admin')}
                className="w-full flex items-center justify-center py-3 px-4 border border-purple-300 rounded-md shadow-sm text-sm font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
              >
                <Shield className="mr-2 h-5 w-5" />
                Sign in as Administrator
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or use Auth0</span>
              </div>
            </div>

            {isDevelopment && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <div className="flex">
                  <AlertTriangle className="h-5 w-5 text-yellow-400" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Development Environment
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        You're in development mode. Select your role and click sign in to test with mock authentication.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {isDevelopment && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Role for Development:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('user')}
                    className={`flex items-center justify-center px-4 py-3 rounded-md border transition-colors ${
                      selectedRole === 'user'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <User className="w-4 h-4 mr-2" />
                    <div className="text-left">
                      <div className="font-medium">User</div>
                      <div className="text-xs opacity-75">Standard Access</div>
                    </div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setSelectedRole('admin')}
                    className={`flex items-center justify-center px-4 py-3 rounded-md border transition-colors ${
                      selectedRole === 'admin'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    <div className="text-left">
                      <div className="font-medium">Administrator</div>
                      <div className="text-xs opacity-75">Full Access</div>
                    </div>
                  </button>
                </div>
              </div>
            )}
            
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogIn className="mr-2 h-5 w-5" />
              {isLoading ? 'Signing in...' : (isDevelopment ? `Sign in as ${selectedRole === 'admin' ? 'Administrator' : 'User'}` : 'Sign in with Auth0')}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Don't have an account?{' '}
                  <button
                    onClick={handleLogin}
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Sign up
                  </button>
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-md">
            <h3 className="text-sm font-medium text-blue-900 mb-2">Note:</h3>
            <p className="text-xs text-blue-700">
              {isDevelopment 
                ? 'In development mode, authentication is mocked for testing purposes. Select your role above to test different permission levels.'
                : 'Auth0 handles both sign in and sign up for production'}
            </p>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Use "Quick Access" buttons for immediate development access</li>
              <li>• Auth0 handles both sign in and sign up for production</li>
              <li>• User role has standard permissions, Admin has full access</li>
            </ul>
        {isAuthenticated && <Sidebar />}
        
        <main className={`flex-1 ${isAuthenticated ? 'ml-64' : ''}`}>
          {showBreadcrumbs && breadcrumbs.length > 0 && (
            <div className="bg-white border-b border-gray-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                <Breadcrumb items={breadcrumbs} />
              </div>
            </div>
          )}
          
        </main>
      </div>
      
    </div>
  );
}