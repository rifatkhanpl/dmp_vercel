import { useState, useCallback, useRef } from 'react';
import { z } from 'zod';
import { SecurityUtils } from '../utils/security';
import { errorService } from '../services/errorService';

interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  warnings: Record<string, string>;
}

interface UseFormValidationOptions<T> {
  schema: z.ZodSchema<T>;
  onSubmit: (data: T) => Promise<void> | void;
  onValidationChange?: (result: ValidationResult) => void;
  sanitizeInputs?: boolean;
  debounceMs?: number;
}

export function useFormValidation<T extends Record<string, any>>({
  schema,
  onSubmit,
  onValidationChange,
  sanitizeInputs = true,
  debounceMs = 300
}: UseFormValidationOptions<T>) {
  const [data, setData] = useState<Partial<T>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [warnings, setWarnings] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  
  const validationTimeoutRef = useRef<NodeJS.Timeout>();
  const initialDataRef = useRef<Partial<T>>({});

  // Debounced validation
  const validateField = useCallback((fieldName: string, value: any) => {
    if (validationTimeoutRef.current) {
      clearTimeout(validationTimeoutRef.current);
    }

    validationTimeoutRef.current = setTimeout(() => {
      try {
        // Create partial schema for single field validation
        const fieldSchema = schema.pick({ [fieldName]: true } as any);
        const result = fieldSchema.safeParse({ [fieldName]: value });
        
        if (result.success) {
          setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[fieldName];
            return newErrors;
          });
        } else {
          const fieldError = result.error.errors.find(e => e.path[0] === fieldName);
          if (fieldError) {
            setErrors(prev => ({
              ...prev,
              [fieldName]: fieldError.message
            }));
          }
        }
      } catch (error) {
        errorService.logError(error as Error, { context: 'Field validation', fieldName });
      }
    }, debounceMs);
  }, [schema, debounceMs]);

  // Update field value
  const updateField = useCallback((fieldName: string, value: any) => {
    let processedValue = value;
    
    // Sanitize string inputs
    if (sanitizeInputs && typeof value === 'string') {
      processedValue = SecurityUtils.sanitizeText(value);
    }
    
    setData(prev => {
      const newData = { ...prev, [fieldName]: processedValue };
      setIsDirty(JSON.stringify(newData) !== JSON.stringify(initialDataRef.current));
      return newData;
    });
    
    // Mark field as touched
    setTouchedFields(prev => new Set(prev).add(fieldName));
    
    // Validate field if it's been touched
    if (touchedFields.has(fieldName)) {
      validateField(fieldName, processedValue);
    }
  }, [sanitizeInputs, validateField, touchedFields]);

  // Validate entire form
  const validateForm = useCallback((): ValidationResult => {
    try {
      const result = schema.safeParse(data);
      
      if (result.success) {
        const validationResult = { isValid: true, errors: {}, warnings };
        onValidationChange?.(validationResult);
        return validationResult;
      }
      
      const newErrors: Record<string, string> = {};
      result.error.errors.forEach(error => {
        const fieldName = error.path[0] as string;
        newErrors[fieldName] = error.message;
      });
      
      setErrors(newErrors);
      const validationResult = { isValid: false, errors: newErrors, warnings };
      onValidationChange?.(validationResult);
      return validationResult;
    } catch (error) {
      errorService.logError(error as Error, { context: 'Form validation' });
      const validationResult = { isValid: false, errors: { form: 'Validation failed' }, warnings: {} };
      onValidationChange?.(validationResult);
      return validationResult;
    }
  }, [data, schema, warnings, onValidationChange]);

  // Handle form submission
  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    const validation = validateForm();
    if (!validation.isValid) {
      errorService.showError('Please correct the errors before submitting');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit(data as T);
      
      // Reset form on successful submission
      setData({});
      setErrors({});
      setWarnings({});
      setTouchedFields(new Set());
      setIsDirty(false);
      initialDataRef.current = {};
      
      errorService.showSuccess('Form submitted successfully');
    } catch (error) {
      const errorMessage = errorService.handleApiError(error, 'Form submission');
      errorService.showError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [validateForm, onSubmit, data]);

  // Reset form
  const resetForm = useCallback(() => {
    setData(initialDataRef.current);
    setErrors({});
    setWarnings({});
    setTouchedFields(new Set());
    setIsDirty(false);
  }, []);

  // Set initial data
  const setInitialData = useCallback((initialData: Partial<T>) => {
    setData(initialData);
    initialDataRef.current = initialData;
    setIsDirty(false);
  }, []);

  // Get field props for easy integration
  const getFieldProps = useCallback((fieldName: string) => ({
    name: fieldName,
    value: data[fieldName] || '',
    onChange: (value: any) => updateField(fieldName, value),
    onBlur: () => validateField(fieldName, data[fieldName]),
    error: errors[fieldName],
    warning: warnings[fieldName]
  }), [data, errors, warnings, updateField, validateField]);

  return {
    data,
    errors,
    warnings,
    isSubmitting,
    isDirty,
    touchedFields,
    updateField,
    validateForm,
    handleSubmit,
    resetForm,
    setInitialData,
    getFieldProps,
    isValid: Object.keys(errors).length === 0
  };
}