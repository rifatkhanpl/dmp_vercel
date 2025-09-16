import React, { useState, useId } from 'react';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { SecurityUtils } from '../../utils/security';

interface FormFieldProps {
  label: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'number' | 'date' | 'textarea' | 'select';
  name: string;
  value: string | number;
  onChange: (value: string | number) => void;
  onBlur?: () => void;
  error?: string;
  warning?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  rows?: number;
  maxLength?: number;
  pattern?: string;
  autoComplete?: string;
  description?: string;
  className?: string;
}

export const FormField = React.memo<FormFieldProps>(({
  label,
  type = 'text',
  name,
  value,
  onChange,
  onBlur,
  error,
  warning,
  required = false,
  disabled = false,
  placeholder,
  options = [],
  rows = 3,
  maxLength,
  pattern,
  autoComplete,
  description,
  className = ''
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const fieldId = useId();
  const errorId = useId();
  const descriptionId = useId();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    let newValue: string | number = e.target.value;
    
    // Sanitize input for security
    if (typeof newValue === 'string') {
      newValue = SecurityUtils.sanitizeText(newValue);
    }
    
    // Apply maxLength for all input types
    if (maxLength && typeof newValue === 'string' && newValue.length > maxLength) {
      newValue = newValue.slice(0, maxLength);
    }
    
    onChange(newValue);
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const getInputClassName = () => {
    const baseClasses = 'block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition-colors';
    const stateClasses = error 
      ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
      : warning
      ? 'border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500'
      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500';
    const disabledClasses = disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'bg-white';
    
    return `${baseClasses} ${stateClasses} ${disabledClasses}`;
  };

  const renderInput = () => {
    const commonProps = {
      id: fieldId,
      name,
      value: value || '',
      onChange: handleChange,
      onBlur: handleBlur,
      onFocus: handleFocus,
      disabled,
      required,
      className: getInputClassName(),
      placeholder,
      maxLength,
      pattern,
      autoComplete,
      'aria-invalid': !!error,
      'aria-describedby': [
        error ? errorId : null,
        description ? descriptionId : null
      ].filter(Boolean).join(' ') || undefined
    };

    switch (type) {
      case 'textarea':
        return (
          <textarea
            {...commonProps}
            rows={rows}
            aria-label={`${label}${required ? ' (required)' : ''}`}
          />
        );
        
      case 'select':
        return (
          <select
            {...commonProps}
            aria-label={`${label}${required ? ' (required)' : ''}`}
          >
            <option value="">Select {label.toLowerCase()}...</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
        
      case 'password':
        return (
          <div className="relative">
            <input
              {...commonProps}
              type={showPassword ? 'text' : 'password'}
              aria-label={`${label}${required ? ' (required)' : ''}`}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={0}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
        );
        
      default:
        return (
          <input
            {...commonProps}
            type={type}
            aria-label={`${label}${required ? ' (required)' : ''}`}
          />
        );
    }
  };

  return (
    <div className={`space-y-1 ${className}`}>
      <label 
        htmlFor={fieldId}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
      </label>
      
      {renderInput()}
      
      {description && (
        <p id={descriptionId} className="text-sm text-gray-500">
          {description}
        </p>
      )}
      
      {maxLength && typeof value === 'string' && (
        <div className="flex justify-between items-center text-xs">
          <span></span>
          <span className={`${value.length > maxLength * 0.9 ? 'text-yellow-600' : 'text-gray-500'}`}>
            {value.length}/{maxLength}
          </span>
        </div>
      )}
      
      {error && (
        <div id={errorId} className="flex items-center space-x-1 text-sm text-red-600" role="alert">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      
      {warning && !error && (
        <div className="flex items-center space-x-1 text-sm text-yellow-600" role="alert">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{warning}</span>
        </div>
      )}
    </div>
  );
});

FormField.displayName = 'FormField';