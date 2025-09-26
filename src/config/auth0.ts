export const auth0Config = {
  domain: import.meta.env.VITE_AUTH0_DOMAIN || 'dev-c4u34lk8e3qzwt8q.us.auth0.com',
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID || 'Aha8XFlrZi7rMcOzb4Jaz3GQ9jFEC6M4',
  redirectUri: `${window.location.origin}/callback`,
  // Only include audience if it's defined and not empty
  ...(import.meta.env.VITE_AUTH0_AUDIENCE && { audience: import.meta.env.VITE_AUTH0_AUDIENCE }),
  scope: 'openid profile email',
  useRefreshTokens: true,
  cacheLocation: 'localstorage' as const,
};

export const ROLES = {
  ADMIN: 'administrator',
  USER: 'provider-relations-coordinator',
} as const;

export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    'manage:users',
    'manage:system',
    'view:analytics',
    'export:data',
    'manage:templates',
    'manage:bulk_operations',
  ],
  ['provider-relations-coordinator']: [
    'view:dashboard',
    'manage:own_profile',
    'create:registrations',
    'view:search',
    'view:gme_data',
  ],
} as const;