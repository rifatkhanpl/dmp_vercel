export interface User {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  role: 'user' | 'admin' | 'administrator' | 'provider-relations-coordinator';
  isEmailVerified?: boolean;
  createdAt?: string;
  lastLogin?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
}

export interface AuthContextType extends AuthState {
  login: (role: 'user' | 'admin') => void;
  logout: () => void;
  register?: (userData: RegisterData) => Promise<AuthResult>;
  verifyEmail?: (token: string) => Promise<AuthResult>;
  resetPassword?: (token: string, newPassword: string) => Promise<AuthResult>;
  resendVerification?: (email: string) => Promise<AuthResult>;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: User['role'];
}

export interface AuthResult {
  success: boolean;
  message: string;
  user?: User;
}