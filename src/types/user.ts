export type UserRole = 'provider-relations-coordinator' | 'administrator';

export type UserStatus = 'active' | 'inactive' | 'pending' | 'suspended';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  isEmailVerified: boolean;
  phone?: string;
  department?: string;
  location?: string;
  title?: string;
  bio?: string;
  avatar?: string;
  employeeId?: string;
  manager?: string;
  startDate?: string;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfileUpdate {
  firstName?: string;
  lastName?: string;
  phone?: string;
  title?: string;
  bio?: string;
  location?: string;
}

export interface AdminUserUpdate extends UserProfileUpdate {
  email?: string;
  role?: UserRole;
  status?: UserStatus;
  department?: string;
  employeeId?: string;
  manager?: string;
  isEmailVerified?: boolean;
}