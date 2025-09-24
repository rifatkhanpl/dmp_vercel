import React, { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LogIn, AlertTriangle } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Auth0Debug } from './Auth0Debug';

export function SignIn() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async () => {
    await login();
  };

  const authError = searchParams.get('error');

  return (
    <>
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
              {authError && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <div className="flex">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        Authentication Error
                      </h3>
                      <div className="mt-2 text-sm text-red-700">
                        <p>
                          {authError === 'timeout' && 'Authentication timed out. Please try again.'}
                          {authError === 'authentication_failed' && 'Authentication failed. Please try again.'}
                          {authError !== 'timeout' && authError !== 'authentication_failed' && decodeURIComponent(authError)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleLogin}
                disabled={isLoading}
                className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LogIn className="mr-2 h-5 w-5" />
                {isLoading ? 'Signing in...' : 'Sign in with Auth0'}
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
              <h3 className="text-sm font-medium text-blue-900 mb-2">Authentication Info:</h3>
              <p className="text-xs text-blue-700 mb-2">
                This application uses Auth0 for secure authentication.
              </p>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Create a new account or sign in with existing credentials</li>
                <li>• Support for social logins (Google, GitHub, etc.)</li>
                <li>• Secure password reset and email verification</li>
                <li>• Enterprise-grade security and compliance</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Auth0Debug />
    </>
  );
}