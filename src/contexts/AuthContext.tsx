import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '../types/user';
import { sendVerificationEmail } from '../services/emailService';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: UserRole;
  }) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  verifyEmail: (token: string) => Promise<{ success: boolean; message: string }>;
  resendVerification: (email: string) => Promise<{ success: boolean; message: string }>;
  resetPassword: (token: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      // Check for demo accounts
      const demoAccounts = {
        'coordinator@practicelink.com': {
          id: '1',
          firstName: 'Demo',
          lastName: 'Coordinator',
          email: 'coordinator@practicelink.com',
          role: 'provider-relations-coordinator' as UserRole,
          isEmailVerified: true,
          createdAt: new Date().toISOString()
        },
        'admin@practicelink.com': {
          id: '2',
          firstName: 'Demo',
          lastName: 'Administrator',
          email: 'admin@practicelink.com',
          role: 'administrator' as UserRole,
          isEmailVerified: true,
          createdAt: new Date().toISOString()
        }
      };

      if (email in demoAccounts && password === 'password') {
        const userData = demoAccounts[email as keyof typeof demoAccounts];
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return { success: true, message: 'Login successful' };
      }

      // Check registered users
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const foundUser = users.find((u: User) => u.email === email);

      if (!foundUser) {
        return { success: false, message: 'Invalid email or password' };
      }

      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
      return { success: true, message: 'Login successful' };
    } catch (error) {
      return { success: false, message: 'An error occurred during login' };
    }
  };

  const register = async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: UserRole;
  }): Promise<{ success: boolean; message: string }> => {
    try {
      if (!userData.email.endsWith('@practicelink.com')) {
        return { success: false, message: 'Only @practicelink.com email addresses are allowed' };
      }

      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      if (users.find((u: User) => u.email === userData.email)) {
        return { success: false, message: 'An account with this email already exists' };
      }

      const verificationToken = Math.random().toString(36).substring(2, 15);
      
      const newUser: User = {
        id: Date.now().toString(),
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        role: userData.role,
        isEmailVerified: true,
        createdAt: new Date().toISOString(),
        verificationToken: undefined
      };

      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));

      return { 
        success: true, 
        message: 'Account created successfully! You can now sign in.' 
      };
    } catch (error) {
      return { success: false, message: 'An error occurred during registration' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const verifyEmail = async (token: string): Promise<{ success: boolean; message: string }> => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex((u: User) => u.verificationToken === token);

      if (userIndex === -1) {
        return { success: false, message: 'Invalid or expired verification token' };
      }

      users[userIndex].isEmailVerified = true;
      users[userIndex].verificationToken = undefined;
      localStorage.setItem('users', JSON.stringify(users));

      return { success: true, message: 'Email verified successfully! You can now sign in.' };
    } catch (error) {
      return { success: false, message: 'An error occurred during email verification' };
    }
  };

  const resendVerification = async (email: string): Promise<{ success: boolean; message: string }> => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u: User) => u.email === email);

      if (!user) {
        return { success: false, message: 'No account found with this email address' };
      }

      if (user.isEmailVerified) {
        return { success: false, message: 'This account is already verified' };
      }

      const newToken = Math.random().toString(36).substring(2, 15);
      user.verificationToken = newToken;
      localStorage.setItem('users', JSON.stringify(users));

      const emailSent = await sendVerificationEmail(
        email,
        newToken,
        `${user.firstName} ${user.lastName}`
      );

      if (emailSent) {
        return { success: true, message: 'Verification email sent successfully!' };
      } else {
        return { success: false, message: 'Failed to send verification email. Please try again.' };
      }
    } catch (error) {
      return { success: false, message: 'An error occurred while resending verification email' };
    }
  };

  const resetPassword = async (token: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    try {
      const resetTokens = JSON.parse(localStorage.getItem('resetTokens') || '{}');
      const email = resetTokens[token];

      if (!email) {
        return { success: false, message: 'Invalid or expired reset token' };
      }

      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex((u: User) => u.email === email);

      if (userIndex === -1) {
        return { success: false, message: 'User not found' };
      }

      // Update password (in real app, this would be hashed)
      users[userIndex].password = newPassword;
      localStorage.setItem('users', JSON.stringify(users));

      // Remove used reset token
      delete resetTokens[token];
      localStorage.setItem('resetTokens', JSON.stringify(resetTokens));

      return { success: true, message: 'Password reset successfully! You can now sign in with your new password.' };
    } catch (error) {
      return { success: false, message: 'An error occurred while resetting password' };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      verifyEmail,
      resendVerification,
      resetPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}