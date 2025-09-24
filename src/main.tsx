import React from 'react';
import ReactDOM from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';
import { auth0Config } from './config/auth0';
import './index.css';

// Initialize security interceptors
import { SecurityUtils } from './utils/security';
SecurityUtils.interceptAIRequests();

// Auth0 redirect callback
const onRedirectCallback = (appState?: { returnTo?: string }) => {
  console.log('Auth0 redirect callback:', appState);
  // Let React Router handle navigation naturally
};

// Auth0 error handler
const onError = (error: Error) => {
  console.error('Auth0 Provider Error:', error);
  console.error('Error details:', {
    name: error.name,
    message: error.message,
    stack: error.stack
  });
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Auth0Provider
      domain={auth0Config.domain}
      clientId={auth0Config.clientId}
      authorizationParams={{
        redirect_uri: auth0Config.redirectUri,
        // Only include audience if it exists in config
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