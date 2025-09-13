import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Layout } from '../Layout/Layout';
import { LogIn, AlertTriangle, User, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function SignIn() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const [selectedRole, setSelectedRole] = useState<'user' | 'admin'>('user');
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = () => {
    login(selectedRole);
  };

  // Check if we're in development environment
  const isDevelopment = window.location.hostname === 'localhost' || 
                       window.location.hostname.includes('bolt.new') ||
                       window.location.hostname.includes('127.0.0.1') ||
                       window.location.port === '5173';

  const handleSkipAuth = () => {
    // Bypass authentication for development
    window.location.href = '/dashboard';
  };
                       window.location.hostname.includes('bolt.new') ||
}