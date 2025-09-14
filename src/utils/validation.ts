import { VALIDATION } from './constants';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateEmail(email: string): ValidationResult {
  const errors: string[] = [];
  
  if (!email) {
    errors.push('Email is required');
  } else {
    if (email.length > VALIDATION.MAX_EMAIL_LENGTH) {
      errors.push(`Email must be less than ${VALIDATION.MAX_EMAIL_LENGTH} characters`);
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push('Please enter a valid email address');
    }
    
    if (!email.endsWith(VALIDATION.EMAIL_DOMAIN)) {
      errors.push(`Email must be a ${VALIDATION.EMAIL_DOMAIN} address`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validatePassword(password: string): ValidationResult {
  const errors: string[] = [];
  
  if (!password) {
    errors.push('Password is required');
  } else {
    if (password.length < VALIDATION.MIN_PASSWORD_LENGTH) {
      errors.push(`Password must be at least ${VALIDATION.MIN_PASSWORD_LENGTH} characters`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateName(name: string, fieldName: string): ValidationResult {
  const errors: string[] = [];
  
  if (!name) {
    errors.push(`${fieldName} is required`);
  } else {
    if (name.length > VALIDATION.MAX_NAME_LENGTH) {
      errors.push(`${fieldName} must be less than ${VALIDATION.MAX_NAME_LENGTH} characters`);
    }
    
    const nameRegex = /^[a-zA-Z\s'-]+$/;
    if (!nameRegex.test(name)) {
      errors.push(`${fieldName} can only contain letters, spaces, hyphens, and apostrophes`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateRequired(value: string, fieldName: string): ValidationResult {
  const errors: string[] = [];
  
  if (!value || value.trim().length === 0) {
    errors.push(`${fieldName} is required`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}