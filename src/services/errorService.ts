import toast from 'react-hot-toast';

/**
 * Centralized error handling and logging service
 */
export class ErrorService {
  private static instance: ErrorService;
  private rateLimiter: Map<string, number[]> = new Map();

  static getInstance(): ErrorService {
    if (!ErrorService.instance) {
      ErrorService.instance = new ErrorService();
    }
    return ErrorService.instance;
  }

  /**
   * Log error to monitoring service
   */
  logError(error: Error, context?: Record<string, any>) {
    const errorData = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      context: context || {}
    };

    console.error('Error logged:', errorData);

    // In production, send to monitoring service
    // Example: Sentry.captureException(error, { extra: context });
  }

  /**
   * Handle API errors with user-friendly messages
   */
  handleApiError(error: any, operation: string): string {
    let message = 'An unexpected error occurred';

    if (error?.response?.status) {
      switch (error.response.status) {
        case 400:
          message = 'Invalid request. Please check your input and try again.';
          break;
        case 401:
          message = 'You are not authorized to perform this action.';
          break;
        case 403:
          message = 'Access denied. Please contact your administrator.';
          break;
        case 404:
          message = 'The requested resource was not found.';
          break;
        case 429:
          message = 'Too many requests. Please wait a moment and try again.';
          break;
        case 500:
          message = 'Server error. Please try again later.';
          break;
        default:
          message = `Error ${error.response.status}: ${operation} failed`;
      }
    } else if (error?.message) {
      message = error.message;
    }

    this.logError(new Error(`${operation}: ${message}`), { 
      originalError: error,
      operation 
    });

    return message;
  }

  /**
   * Show user-friendly error toast
   */
  showError(message: string, options?: { duration?: number; id?: string }) {
    toast.error(message, {
      duration: options?.duration || 5000,
      id: options?.id,
      style: {
        background: '#FEF2F2',
        color: '#991B1B',
        border: '1px solid #FECACA'
      }
    });
  }

  /**
   * Show success toast
   */
  showSuccess(message: string, options?: { duration?: number; id?: string }) {
    toast.success(message, {
      duration: options?.duration || 4000,
      id: options?.id,
      style: {
        background: '#F0FDF4',
        color: '#166534',
        border: '1px solid #BBF7D0'
      }
    });
  }

  /**
   * Show warning toast
   */
  showWarning(message: string, options?: { duration?: number; id?: string }) {
    toast(message, {
      duration: options?.duration || 4000,
      id: options?.id,
      icon: '⚠️',
      style: {
        background: '#FFFBEB',
        color: '#92400E',
        border: '1px solid #FDE68A'
      }
    });
  }

  /**
   * Rate limiting for error reporting
   */
  private isRateLimited(key: string, maxRequests: number = 5, windowMs: number = 60000): boolean {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    if (!this.rateLimiter.has(key)) {
      this.rateLimiter.set(key, []);
    }
    
    const requests = this.rateLimiter.get(key)!;
    const validRequests = requests.filter(time => time > windowStart);
    
    if (validRequests.length >= maxRequests) {
      return true; // Rate limited
    }
    
    validRequests.push(now);
    this.rateLimiter.set(key, validRequests);
    
    return false;
  }

  /**
   * Handle network errors with retry logic
   */
  async handleNetworkError<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        // Don't retry on client errors (4xx)
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          throw error;
        }
        
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, delay * attempt));
        }
      }
    }
    
    throw lastError!;
  }

  /**
   * Handle AI API requests with empty image data
   */
  handleAIImageError(error: any): void {
    // Silently handle empty image data errors and Bolt screenshot errors
    if (error?.message?.includes('image cannot be empty') || 
        error?.message?.includes('base64') ||
        error?.message?.includes('Failed to fetch') ||
        error?.message?.includes('Screenshot failed') ||
        error?.type === 'invalid_request_error') {
      // Don't log or show these errors as they're often Bolt infrastructure issues
      return;
    }
    
    // Show other AI errors normally
    this.showError('AI processing failed. Please try again.');
  }

  /**
   * Create timeout wrapper for async operations
   */
  withTimeout<T>(promise: Promise<T>, timeoutMs: number = 30000): Promise<T> {
    return Promise.race([
      promise,
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(`Operation timed out after ${timeoutMs}ms`)), timeoutMs)
      )
    ]);
  }
}

// Export singleton instance
export const errorService = ErrorService.getInstance();