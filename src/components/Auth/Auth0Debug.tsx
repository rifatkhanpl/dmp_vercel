import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { AlertCircle, CheckCircle, Info, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function Auth0Debug() {
  const {
    isAuthenticated,
    isLoading,
    user,
    error,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
    getIdTokenClaims
  } = useAuth0();

  const { availableRoles, switchRole } = useAuth();

  const [showToken, setShowToken] = useState(false);
  const [tokenClaims, setTokenClaims] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string>('');
  const [userRole, setUserRole] = useState<string>('No role found');

  useEffect(() => {
    const fetchTokenInfo = async () => {
      if (isAuthenticated && user) {
        try {
          // Get ID token claims
          const claims = await getIdTokenClaims();
          setTokenClaims(claims);
          console.log('Full ID Token Claims:', claims);

          // Try to get access token
          try {
            const token = await getAccessTokenSilently();
            setAccessToken(token);
          } catch (e) {
            console.log('Could not get access token:', e);
          }

          // Extract role from various possible locations
          const role =
            claims?.['https://practicelink.com/role'] ||
            claims?.['https://practicelink.com/roles']?.[0] ||
            user['https://practicelink.com/role'] ||
            user['https://practicelink.com/roles']?.[0] ||
            user.role ||
            user.app_metadata?.role ||
            'No role found';

          setUserRole(role);
          console.log('Detected role:', role);
        } catch (err) {
          console.error('Error fetching token info:', err);
        }
      }
    };

    fetchTokenInfo();
  }, [isAuthenticated, user, getIdTokenClaims, getAccessTokenSilently]);

  const handleTestLogin = async () => {
    try {
      console.log('Attempting Auth0 login...');
      console.log('Current config:', {
        domain: 'dev-c4u34lk8e3qzwt8q.us.auth0.com',
        clientId: 'Aha8XFlrZi7rMcOzb4Jaz3GQ9jFEC6M4',
        redirectUri: `${window.location.origin}/callback`,
        audience: 'none (commented out)'
      });

      // Test network connectivity to Auth0
      console.log('Testing network connectivity to Auth0...');
      try {
        const response = await fetch('https://dev-c4u34lk8e3qzwt8q.us.auth0.com/authorize?response_type=code&client_id=test', {
          method: 'HEAD',
          mode: 'no-cors'
        });
        console.log('Auth0 domain is reachable');
      } catch (fetchError) {
        console.warn('Network test failed (may be normal due to CORS):', fetchError);
      }

      await loginWithRedirect({
        authorizationParams: {
          redirect_uri: `${window.location.origin}/callback`
        }
      });
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  const handleTestToken = async () => {
    try {
      const token = await getAccessTokenSilently();
      console.log('Access token retrieved:', token);

      const claims = await getIdTokenClaims();
      console.log('ID Token Claims:', claims);

      alert('Token retrieved successfully! Check console for details.');
    } catch (err) {
      console.error('Token error:', err);
      alert('Error getting token. Check console.');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50">
      <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
        <Info className="h-4 w-4 mr-2" />
        Auth0 Debug Panel
      </h3>

      <div className="space-y-2 text-xs">
        <div className="flex items-start">
          <span className="font-medium w-24">Status:</span>
          <span className={isAuthenticated ? 'text-green-600' : 'text-red-600'}>
            {isLoading ? 'Loading...' : isAuthenticated ? 'Authenticated' : 'Not authenticated'}
          </span>
        </div>

        <div className="flex items-start">
          <span className="font-medium w-24">Domain:</span>
          <span className="text-gray-600">dev-c4u34lk8e3qzwt8q.us.auth0.com</span>
        </div>

        <div className="flex items-start">
          <span className="font-medium w-24">Client ID:</span>
          <span className="text-gray-600 break-all">Aha8XFlrZi7rMcOzb4Jaz3GQ9jFEC6M4</span>
        </div>

        <div className="flex items-start">
          <span className="font-medium w-24">Redirect URI:</span>
          <span className="text-gray-600">{window.location.origin}/callback</span>
        </div>

        <div className="flex items-start">
          <span className="font-medium w-24">Current URL:</span>
          <span className="text-gray-600 text-xs">{window.location.href}</span>
        </div>


        {error && (
          <div className="flex items-start">
            <span className="font-medium w-24">Error:</span>
            <span className="text-red-600">{error.message}</span>
          </div>
        )}

        {user && (
          <>
            <div className="flex items-start">
              <span className="font-medium w-24">User:</span>
              <span className="text-gray-600">{user.email || user.name || 'No email'}</span>
            </div>

            <div className="flex items-start">
              <span className="font-medium w-24 text-orange-600">ROLE:</span>
              <span className="text-orange-600 font-bold">{userRole}</span>
            </div>

            {availableRoles && availableRoles.length > 0 && (
              <div className="flex items-start">
                <span className="font-medium w-24 text-purple-600">ALL ROLES:</span>
                <span className="text-purple-600 text-xs">
                  {availableRoles.join(', ')}
                </span>
              </div>
            )}

            <div className="flex items-start">
              <span className="font-medium w-24">Sub (ID):</span>
              <span className="text-gray-600 break-all text-[10px]">{user.sub}</span>
            </div>
          </>
        )}
      </div>

      {isAuthenticated && tokenClaims && (
        <div className="mt-3 p-2 bg-gray-50 rounded border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-700">JWT Claims</span>
            <button
              onClick={() => setShowToken(!showToken)}
              className="text-xs text-blue-600 hover:text-blue-700 flex items-center"
            >
              {showToken ? <EyeOff className="h-3 w-3 mr-1" /> : <Eye className="h-3 w-3 mr-1" />}
              {showToken ? 'Hide' : 'Show'}
            </button>
          </div>
          {showToken && (
            <pre className="text-[10px] text-gray-600 overflow-auto max-h-32">
              {JSON.stringify(tokenClaims, null, 2)}
            </pre>
          )}
        </div>
      )}

      <div className="mt-3 space-y-2">
        <button
          onClick={handleTestLogin}
          className="w-full px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
        >
          Test Auth0 Login
        </button>

        {isAuthenticated && (
          <>
            <button
              onClick={handleTestToken}
              className="w-full px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
            >
              Test Get Token
            </button>

            <button
              onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
              className="w-full px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
            >
              Logout
            </button>
          </>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Check browser console for detailed logs
        </p>
      </div>
    </div>
  );
}