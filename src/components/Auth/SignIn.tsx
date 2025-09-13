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

        </div>
      </div>
    </Layout>
  );
}