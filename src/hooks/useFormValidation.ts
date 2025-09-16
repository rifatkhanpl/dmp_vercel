import { useState, useCallback, useEffect } from 'react';
import { z } from 'zod';
import { SecurityUtils } from '../utils/security';
import { errorService } from '../services/errorService';
import { useDebounce } from './useDebounce';

interface UseFormValidationOptions<T> {
  schema: z.ZodSchema<T>;
  onSubmit: (data: T) => Promise<void> | void;
  initialData?: Partial<T>;
  debounceMs?: number;
  sanitizeInputs?: boolean;
  validateOnChange?: boolean;
}

interface FormValidationState<T> {
  data: Partial<T>;
  errors: Record<string, string>;
  isValid: boolean;
  isDirty: boolean;
  isSubmitting: boolean;
}

export function useFormValidation<T extends Record<string, any>>({
  schema,
  onSubmit,
  initialData = {},
  debounceMs = 300,
  sanitizeInputs = true,
  validateOnChange = true
}: UseFormValidationOptions<T>) {
  const [state, setState] = useState<FormValidationState<T>>({
    data: initialData,
    errors: {},
    isValid: true,
    isDirty: false,
    isSubmitting: false
  });

  // Debounce validation to improve performance
  const debouncedData = useDebounce(state.data, debounceMs);

  // Validate form data
  const validateData = useCallback((data: Partial<T>) => {
    try {
      const result = schema.safeParse(data);
      
      if (result.success) {
        return { isValid: true, errors: {} };
      }
      
      const errors: Record<string, string> = {};
      result.error.errors.forEach(error => {
        const field = error.path.join('.');
        errors[field] = error.message;
      });
      
      return { isValid: false, errors };
    } catch (error) {
      errorService.logError(error as Error, { context: 'Form validation', data });
      return { 
        isValid: false, 
        errors: { form: 'Validation failed due to system error' } 
      };
    }
  }, [schema]);

  // Run validation when debounced data changes
  useEffect(() => {
    if (validateOnChange && state.isDirty) {
      const validation = validateData(debouncedData);
      setState(prev => ({
        ...prev,
        errors: validation.errors,
        isValid: validation.isValid
      }));
    }
  }, [debouncedData, validateData, validateOnChange, state.isDirty]);

  // Update field value
  const updateField = useCallback((field: keyof T, value: any) => {
    setState(prev => {
      const sanitizedValue = sanitizeInputs && typeof value === 'string' 
        ? SecurityUtils.sanitizeText(value)
        : value;
      
      const newData = {
        ...prev.data,
        [field]: sanitizedValue
      };

      return {
        ...prev,
        data: newData,
        isDirty: true
      };
    });
  }, [sanitizeInputs]);

  // Update multiple fields at once
  const updateFields = useCallback((updates: Partial<T>) => {
    setState(prev => {
      const sanitizedUpdates = sanitizeInputs 
        ? Object.entries(updates).reduce((acc, [key, value]) => {
            acc[key] = typeof value === 'string' ? SecurityUtils.sanitizeText(value) : value;
            return acc;
          }, {} as any)
        : updates;

      const newData = {
        ...prev.data,
        ...sanitizedUpdates
      };

      return {
        ...prev,
        data: newData,
        isDirty: true
      };
    });
  }, [sanitizeInputs]);

  // Reset form to initial state
  const reset = useCallback((newInitialData?: Partial<T>) => {
    setState({
      data: newInitialData || initialData,
      errors: {},
      isValid: true,
      isDirty: false,
      isSubmitting: false
    });
  }, [initialData]);

  // Handle form submission
  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    // Final validation before submission
    const validation = validateData(state.data);
    
    if (!validation.isValid) {
      setState(prev => ({
        ...prev,
        errors: validation.errors,
        isValid: false
      }));
      
      // Show error toast for invalid form
      errorService.showError('Please fix the form errors before submitting');
      return;
    }

    setState(prev => ({ ...prev, isSubmitting: true }));

    try {
      await onSubmit(state.data as T);
      
      // Show success message
      errorService.showSuccess('Form submitted successfully');
      
      // Reset form after successful submission
      reset();
    } catch (error) {
      const errorMessage = errorService.handleApiError(error, 'Form submission');
      errorService.showError(errorMessage);
      
      setState(prev => ({
        ...prev,
        errors: { form: errorMessage },
        isValid: false
      }));
    } finally {
      setState(prev => ({ ...prev, isSubmitting: false }));
    }
  }, [state.data, validateData, onSubmit, reset]);

  // Set field error manually
  const setFieldError = useCallback((field: keyof T, error: string) => {
    setState(prev => ({
      ...prev,
      errors: {
        ...prev.errors,
        [field as string]: error
      },
      isValid: false
    }));
  }, []);

  // Clear field error
  const clearFieldError = useCallback((field: keyof T) => {
    setState(prev => {
      const newErrors = { ...prev.errors };
      delete newErrors[field as string];
      
      return {
        ...prev,
        errors: newErrors,
        isValid: Object.keys(newErrors).length === 0
      };
    });
  }, []);

  // Get field value
  const getFieldValue = useCallback((field: keyof T) => {
    return state.data[field];
  }, [state.data]);

  // Check if field has error
  const hasFieldError = useCallback((field: keyof T) => {
    return !!(state.errors[field as string]);
  }, [state.errors]);

  return {
    // State
    data: state.data,
    errors: state.errors,
    isValid: state.isValid,
    isDirty: state.isDirty,
    isSubmitting: state.isSubmitting,
    
    // Actions
    updateField,
    updateFields,
    handleSubmit,
    reset,
    setFieldError,
    clearFieldError,
    
    // Utilities
    getFieldValue,
    hasFieldError,
    validateData
  };
}