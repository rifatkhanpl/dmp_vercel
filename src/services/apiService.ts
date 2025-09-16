import { errorService } from './errorService';

/**
 * Centralized API service with security and performance optimizations
 */
class ApiService {
  private baseUrl: string;
  private requestQueue: Map<string, Promise<any>> = new Map();
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  }

  /**
   * Make authenticated API request with caching and deduplication
   */
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    cacheKey?: string,
    cacheTtl: number = 5 * 60 * 1000 // 5 minutes default
  ): Promise<T> {
    // Check cache first
    if (cacheKey && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)!;
      if (Date.now() - cached.timestamp < cached.ttl) {
        return cached.data;
      }
      this.cache.delete(cacheKey);
    }

    // Deduplicate identical requests
    const requestKey = `${endpoint}_${JSON.stringify(options)}`;
    if (this.requestQueue.has(requestKey)) {
      return this.requestQueue.get(requestKey);
    }

    const requestPromise = this.executeRequest<T>(endpoint, options);
    this.requestQueue.set(requestKey, requestPromise);

    try {
      const result = await requestPromise;
      
      // Cache successful responses
      if (cacheKey) {
        this.cache.set(cacheKey, {
          data: result,
          timestamp: Date.now(),
          ttl: cacheTtl
        });
      }
      
      return result;
    } finally {
      this.requestQueue.delete(requestKey);
    }
  }

  /**
   * Execute HTTP request with timeout and retry logic
   */
  private async executeRequest<T>(endpoint: string, options: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const requestOptions: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        ...options.headers
      },
      credentials: 'include'
    };

    return errorService.handleNetworkError(async () => {
      const response = await errorService.withTimeout(
        fetch(url, requestOptions),
        30000 // 30 second timeout
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return response.json();
    }, 3, 1000);
  }

  /**
   * Supabase proxy methods
   */
  async queryDatabase(table: string, operation: string, data?: any, filters?: any): Promise<any> {
    return this.makeRequest('/api/supabase/query', {
      method: 'POST',
      body: JSON.stringify({ table, operation, data, filters })
    });
  }

  /**
   * Parse HCP data via server proxy
   */
  async parseHcpData(type: 'text' | 'url', content: string): Promise<any> {
    return this.makeRequest('/api/parse-hcp-data', {
      method: 'POST',
      body: JSON.stringify({ type, content, allowedDegreesOnly: true })
    });
  }

  /**
   * Send verification email
   */
  async sendVerificationEmail(email: string, token: string, name: string): Promise<any> {
    return this.makeRequest('/api/send-verification-email', {
      method: 'POST',
      body: JSON.stringify({ email, token, name })
    });
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(email: string, resetToken: string, name: string): Promise<any> {
    return this.makeRequest('/api/send-password-reset-email', {
      method: 'POST',
      body: JSON.stringify({ email, resetToken, name })
    });
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<any> {
    return this.makeRequest('/api/health', {}, 'health', 30000); // Cache for 30 seconds
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// Export singleton instance
export const apiService = new ApiService();