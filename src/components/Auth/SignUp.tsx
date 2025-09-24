import React, { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { UserPlus, AlertTriangle, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function SignUp() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = () => {
    login();
  };

  // Check if we're in development environment
  const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname.includes('bolt.new');

  const handleSignUp = () => {
    // In development, just redirect to login
    if (isDevelopment) {
      login();
    } else {
      login(); // Auth0 handles both login and signup
    }
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
                          Auth0 may not work in this development environment. 
                          For testing, you can bypass authentication by going directly to{' '}
                          <a href="/dashboard" className="font-medium underline">
                            /dashboard
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <button
                onClick={handleSignUp}
                className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
                disabled={isLoading}
              >
                <LogIn className="mr-2 h-5 w-5" />
                {isLoading ? 'Signing up...' : isDevelopment ? 'Sign up (Development Mode)' : 'Sign up with Auth0'}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or</span>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <button
                    onClick={handleSignUp}
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Sign up
                  </button>
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-md">
              <h3 className="text-sm font-medium text-blue-900 mb-2">Note:</h3>
              <p className="text-xs text-blue-700">
                {isDevelopment 
                  ? 'Development mode active. Authentication will use demo credentials.'
                  : 'Auth0 handles both sign in and sign up. Click the button above and follow the prompts to create a new account or sign in to an existing one.'
                }
              </p>
            </div>
          </div>
      </div>
    </div>
  );
}