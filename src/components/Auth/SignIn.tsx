import React, { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Layout } from '../Layout/Layout';
import { LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function SignIn() {
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

  return (
    <Layout breadcrumbs={[{ label: 'Sign In' }]}>
      <div className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <a href="/" className="text-blue-600 hover:text-blue-700 transition-colors">
            </a>
            <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to access your PracticeLink account
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="space-y-6">
              <button
                onClick={handleLogin}
                className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <LogIn className="mr-2 h-5 w-5" />
                Sign in with Auth0
              </button>

            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-md">
              <h3 className="text-sm font-medium text-blue-900 mb-2">Note:</h3>
              <p className="text-xs text-blue-700">
                Auth0 handles both sign in and sign up. Click "Sign in with Auth0" 
                and follow the prompts to create a new account or sign in to an 
                existing one.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}