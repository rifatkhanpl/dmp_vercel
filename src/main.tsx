import React from 'react';
import ReactDOM from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';
import { auth0Config } from './config/auth0';
import './index.css';

// Check if we're in development mode
const isDevelopment = window.location.hostname === 'localhost' || 
                     window.location.hostname.includes('bolt.new') ||
                     window.location.hostname.includes('127.0.0.1');

// Auth0 redirect callback
const onRedirectCallback = (appState?: { returnTo?: string }) => {
  console.log('Auth0 redirect callback:', appState);
  // Let React Router handle navigation naturally
};

// Auth0 error handler
const onError = (error: Error) => {
  console.error('Auth0 Provider Error:', error);
  
  // In development, don't throw errors for Auth0 connection issues
  if (isDevelopment) {
    console.warn('Auth0 error in development mode - this is expected if Auth0 is not properly configured');
    return;
  }
  
  console.error('Error details:', {
    name: error.name,
    message: error.message,
    stack: error.stack
  });
};

// Render with or without Auth0Provider based on environment
if (isDevelopment) {
  // In development, try Auth0 but don't fail if it doesn't work
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <Auth0Provider
        domain={auth0Config.domain}
        clientId={auth0Config.clientId}
        authorizationParams={{
          redirect_uri: auth0Config.redirectUri,
          ...(auth0Config.audience ? { audience: auth0Config.audience } : {}),
          scope: auth0Config.scope,
        }}
        useRefreshTokens={auth0Config.useRefreshTokens}
        cacheLocation={auth0Config.cacheLocation}
        onRedirectCallback={onRedirectCallback}
        onError={onError}
        skipRedirectCallback={true}
      >
        <App />
      </Auth0Provider>
    </React.StrictMode>
  );
} else {
  // Production mode - use full Auth0
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <Auth0Provider
        domain={auth0Config.domain}
        clientId={auth0Config.clientId}
        authorizationParams={{
          redirect_uri: auth0Config.redirectUri,
          ...(auth0Config.audience ? { audience: auth0Config.audience } : {}),
          scope: auth0Config.scope,
        }}
        useRefreshTokens={auth0Config.useRefreshTokens}
        cacheLocation={auth0Config.cacheLocation}
        onRedirectCallback={onRedirectCallback}
        onError={onError}
      >
        <App />
      </Auth0Provider>
    </React.StrictMode>
  );
}