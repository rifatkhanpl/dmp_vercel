import React from 'react';
import ReactDOM from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';
import { auth0Config } from './config/auth0';
import './index.css';

// Add error boundary for Auth0 initialization
const onRedirectCallback = (appState: any) => {
  console.log('Auth0 redirect callback:', appState);
  window.history.replaceState(
    {},
    document.title,
    appState?.returnTo || window.location.pathname
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Auth0Provider
      domain={auth0Config.domain}
      clientId={auth0Config.clientId}
      authorizationParams={{
        redirect_uri: auth0Config.redirectUri,
        audience: auth0Config.audience,
        scope: auth0Config.scope,
      }}
      useRefreshTokens={auth0Config.useRefreshTokens}
      cacheLocation={auth0Config.cacheLocation}
      onRedirectCallback={onRedirectCallback}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
);