export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  permissions: string[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export type UserRole = 'user' | 'admin';

export interface LoginCredentials {
  email: string;
  password: string;
}