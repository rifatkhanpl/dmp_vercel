import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingSpinner } from '../ui/LoadingSpinner';

export function Auth0Callback() {
  const { isAuthenticated: auth0IsAuthenticated, isLoading: auth0IsLoading, error } = useAuth0();
  const { isAuthenticated: contextIsAuthenticated, isLoading: contextIsLoading } = useAuth();
  const navigate = useNavigate();
  const [hasProcessed, setHasProcessed] = useState(false);

  useEffect(() => {
    console.log('Auth0Callback useEffect:', {
      hasProcessed,
      auth0IsLoading,
      auth0IsAuthenticated,
      contextIsLoading,
      contextIsAuthenticated,
      error: error?.message
    });

    if (hasProcessed) return;

    if (!auth0IsLoading) {
      if (error) {
        console.error('Auth0 callback error:', error);
        setHasProcessed(true);
        navigate('/signin?error=' + encodeURIComponent(error.message));
        return;
      }

      if (auth0IsAuthenticated) {
        console.log('Auth0 callback: Auth0 authenticated, waiting for AuthContext to process user');

        // Give AuthContext time to process but be more aggressive
        const maxWaitTime = 5000; // 5 seconds
        const startTime = Date.now();
        let attempts = 0;

        const waitForAuth = () => {
          attempts++;
          console.log(`Auth0 callback attempt ${attempts}: contextIsAuthenticated=${contextIsAuthenticated}, contextIsLoading=${contextIsLoading}`);

          if (contextIsAuthenticated && !contextIsLoading) {
            console.log('Auth0 callback: AuthContext has processed user, navigating to dashboard');
            setHasProcessed(true);
            navigate('/dashboard');
          } else if (Date.now() - startTime > maxWaitTime) {
            console.error('Auth0 callback: Timeout waiting for AuthContext');
            setHasProcessed(true);
            navigate('/signin?error=timeout');
          } else {
            // Wait a bit more
            setTimeout(waitForAuth, 100);
          }
        };

        // Start waiting immediately
        setTimeout(waitForAuth, 100);
      } else {
        // Not authenticated after callback processing
        console.log('Auth0 callback: Not authenticated after processing');
        setHasProcessed(true);
        navigate('/signin?error=authentication_failed');
      }
    }
  }, [auth0IsAuthenticated, auth0IsLoading, error, contextIsAuthenticated, contextIsLoading, navigate, hasProcessed]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner />
        <p className="mt-4 text-gray-600">
          {error ? 'Authentication failed...' : 'Completing authentication...'}
        </p>
        {error && (
          <p className="mt-2 text-sm text-red-600">
            {error.message}
          </p>
        )}
      </div>
    </div>
  );
}