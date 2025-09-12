import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Breadcrumb } from '../Layout/Breadcrumb';
import { CheckCircle, AlertCircle, Mail, RefreshCw } from 'lucide-react';

export function EmailVerification() {
  const { verifyEmail, resendVerification } = useAuth();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error' | 'expired'>('verifying');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      handleVerification(token);
    } else {
      setStatus('error');
      setMessage('No verification token provided');
    }
  }, []);

  const handleVerification = async (token: string) => {
    try {
      const result = await verifyEmail(token);
      if (result.success) {
        setStatus('success');
        setMessage(result.message);
        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 3000);
      } else {
        if (result.message.includes('expired')) {
          setStatus('expired');
        } else {
          setStatus('error');
        }
        setMessage(result.message);
      }
    } catch (error) {
      setStatus('error');
      setMessage('An error occurred during verification');
    }
  };

  const handleResendVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsResending(true);
    try {
      const result = await resendVerification(email);
      if (result.success) {
        setMessage(result.message);
      } else {
        setMessage(result.message);
      }
    } catch (error) {
      setMessage('Failed to resend verification email');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">PracticeLink</h1>
          <p className="text-sm text-gray-600 mb-8">Career Management Platform</p>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Email Verification
          </h2>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          {status === 'verifying' && (
            <div className="text-center">
              <RefreshCw className="w-12 h-12 text-blue-500 mx-auto mb-4 animate-spin" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Verifying your email...</h3>
              <p className="text-gray-600">Please wait while we verify your account.</p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Email Verified Successfully!</h3>
              <p className="text-gray-600 mb-4">{message}</p>
              <p className="text-sm text-gray-500">
                Redirecting to dashboard in 3 seconds...
              </p>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Verification Failed</h3>
              <p className="text-gray-600 mb-6">{message}</p>
              <div className="space-y-4">
                <a
                  href="/signup"
                  className="block w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors text-center"
                >
                  Register Again
                </a>
                <a
                  href="/signin"
                  className="block w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors text-center"
                >
                  Back to Sign In
                </a>
              </div>
            </div>
          )}

          {status === 'expired' && (
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Verification Link Expired</h3>
              <p className="text-gray-600 mb-6">{message}</p>
              
              <form onSubmit={handleResendVerification} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Enter your email to resend verification
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
                
                <button
                  type="submit"
                  disabled={isResending}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isResending ? 'Sending...' : 'Resend Verification Email'}
                </button>
              </form>

              <div className="mt-4 space-y-2">
                <a
                  href="/signup"
                  className="block w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors text-center"
                >
                  Register Again
                </a>
                <a
                  href="/signin"
                  className="block text-sm text-blue-600 hover:text-blue-500 text-center"
                >
                  Back to Sign In
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}