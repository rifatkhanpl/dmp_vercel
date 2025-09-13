export const auth0Config = {
  domain: import.meta.env.VITE_AUTH0_DOMAIN || 'dev-c4u34lk8e3qzwt8q.us.auth0.com',
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID || 'Aha8XFlrZi7rMcOzb4Jaz3GQ9jFEC6M4',
  redirectUri: window.location.origin,
  audience: import.meta.env.VITE_AUTH0_AUDIENCE,
  scope: 'openid profile email',
  useRefreshTokens: true,
  cacheLocation: 'localstorage' as const,
  // Add error handling options
  skipRedirectCallback: false,
  onRedirectCallback: (appState: any) => {
    console.log('Auth0 redirect callback:', appState);
  },
};