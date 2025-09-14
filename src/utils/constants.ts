// Application Constants
export const APP_NAME = 'PracticeLink';
export const APP_DESCRIPTION = 'Career Management Platform';

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Auth Configuration
export const AUTH_STORAGE_KEY = 'practicelink_auth';
export const TOKEN_STORAGE_KEY = 'practicelink_token';

// User Roles
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  ADMINISTRATOR: 'administrator',
  COORDINATOR: 'provider-relations-coordinator'
} as const;

// Route Paths
export const ROUTES = {
  HOME: '/',
  SIGNIN: '/signin',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  SEARCH: '/search',
  REGISTER_HCP: '/hcp-registration',
  BULK_IMPORT: '/bulk-import',
  USER_MANAGEMENT: '/user-management',
  SUPPORT_TICKETS: '/support-tickets'
} as const;

// Validation Rules
export const VALIDATION = {
  EMAIL_DOMAIN: '@practicelink.com',
  MIN_PASSWORD_LENGTH: 6,
  MAX_NAME_LENGTH: 50,
  MAX_EMAIL_LENGTH: 100
} as const;

// UI Constants
export const ITEMS_PER_PAGE = 20;
export const DEBOUNCE_DELAY = 300;
export const TOAST_DURATION = 5000;