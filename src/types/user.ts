export type UserRole = 'provider-relations-coordinator' | 'administrator';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  isEmailVerified: boolean;
  createdAt: string;
  password?: string;
  verificationToken?: string;
  lastLogin?: string;
}