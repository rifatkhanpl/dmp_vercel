import React, { useState } from 'react';
import { Layout } from '../Layout/Layout';
import { Breadcrumb } from '../Layout/Breadcrumb';
import { CheckCircle, AlertCircle, Mail, RefreshCw } from 'lucide-react';
import { sendPasswordResetEmail } from '../../services/emailService';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus('idle');
    setMessage('');

    try {
      // Generate reset token
      const resetToken = Math.random().toString(36).substring(2, 15);
      
      // Store reset token
      const resetTokens = JSON.parse(localStorage.getItem('resetTokens') || '{}');
      resetTokens[resetToken] = email;
      localStorage.setItem('resetTokens', JSON.stringify(resetTokens));

      // Send reset email
      const emailSent = await sendPasswordResetEmail(email, resetToken, 'User');
      
      if (emailSent) {
        setStatus('success');
        setMessage('Password reset instructions have been sent to your email address.');
      } else {
        setStatus('error');
        setMessage('Failed to send password reset email. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('An error occurred while processing your request.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout breadcrumbs={[
      { label: 'Sign In', href: '/signin' },
      { label: 'Forgot Password' }
    ]}>
      <div className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">PracticeLink</h1>
          <p className="text-sm text-gray-600 mb-8">Career Management Platform</p>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Reset Your Password
          </h2>
          <p className="text-gray-600">
            Enter your email address and we'll send you instructions to reset your password.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          {status === 'success' && (
            <div className="text-center mb-6">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Check Your Email</h3>
              <p className="text-gray-600 mb-6">{message}</p>
              <a
                href="/signin"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Back to Sign In
              </a>
            </div>
          )}

          {status !== 'success' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="yourname@practicelink.com"
                  />
                </div>
              </div>

              {message && status === 'error' && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <span className="text-red-700 text-sm">{message}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Sending Reset Instructions...
                  </>
                ) : (
                  'Send Reset Instructions'
                )}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <a href="/signin" className="text-sm text-blue-600 hover:text-blue-500">
              Back to Sign In
            </a>
          </div>
        </div>
      </div>
      </div>
    </Layout>
  );
}