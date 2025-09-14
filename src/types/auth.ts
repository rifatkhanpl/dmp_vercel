export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'provider-relations-coordinator' | 'administrator';
  isEmailVerified: boolean;
  createdAt: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  getAccessToken: () => Promise<string | undefined>;
}