import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Layout } from '../Layout/Layout';
import { UserPlus } from 'lucide-react';

export function SignUp() {
  const { login } = useAuth();

  const handleSignUp = () => {
    // Auth0 will handle the sign-up process
    login();
  };

  return (
    <Layout breadcrumbs={[{ label: 'Sign Up' }]}>
      <div className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <a href="/" className="text-blue-600 hover:text-blue-700 transition-colors">
              <h1 className="text-4xl font-bold mb-2">PracticeLink</h1>
            </a>
            <p className="text-sm text-gray-600 mb-8">Career Management Platform</p>
            <h2 className="text-2xl font-bold text-gray-900">Create your account</h2>
            <p className="mt-2 text-sm text-gray-600">
              Join PracticeLink to manage healthcare provider data
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="space-y-6">
              <p className="text-center text-gray-600">
                Click the button below to create your account with Auth0
              </p>
              
              <button
                onClick={handleSignUp}
                className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <UserPlus className="mr-2 h-5 w-5" />
                Sign up with Auth0
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
                  Already have an account?{' '}
                  <a
                    href="/signin"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Sign in
                  </a>
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-md">
              <h3 className="text-sm font-medium text-blue-900 mb-2">What happens next?</h3>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• You'll be redirected to Auth0's secure sign-up page</li>
                <li>• Create your account with email and password</li>
                <li>• Verify your email address</li>
                <li>• You'll be automatically signed in and redirected back</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}