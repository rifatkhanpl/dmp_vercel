import { useState, useCallback } from 'react';
import { errorService } from '../services/errorService';

interface AsyncOperationState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseAsyncOperationOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
  showToast?: boolean;
  timeout?: number;
  retries?: number;
}

/**
 * Custom hook for handling async operations with error handling and loading states
 */
export function useAsyncOperation<T>(
  operation: () => Promise<T>,
  options: UseAsyncOperationOptions = {}
) {
  const [state, setState] = useState<AsyncOperationState<T>>({
    data: null,
    loading: false,
    error: null
  });

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const wrappedOperation = options.timeout 
        ? () => errorService.withTimeout(operation(), options.timeout!)
        : operation;

      const result = await errorService.handleNetworkError(
        wrappedOperation,
        options.retries || 3
      );

      setState({ data: result, loading: false, error: null });

      if (options.onSuccess) {
        options.onSuccess(result);
      }

      if (options.showToast !== false) {
        errorService.showSuccess('Operation completed successfully');
      }

      return result;
    } catch (error) {
      const errorMessage = errorService.handleApiError(error, 'Operation');
      
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage 
      }));

      if (options.onError) {
        options.onError(errorMessage);
      }

      if (options.showToast !== false) {
        errorService.showError(errorMessage);
      }

      throw error;
    }
  }, [operation, options]);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset
  };
}