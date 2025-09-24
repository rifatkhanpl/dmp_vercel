import DOMPurify from 'dompurify';

/**
 * Security utilities for input sanitization and validation
 */
export class SecurityUtils {
  /**
   * Sanitize HTML content to prevent XSS attacks
   */
  static sanitizeHtml(dirty: string): string {
    return DOMPurify.sanitize(dirty, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
      ALLOWED_ATTR: []
    });
  }

  /**
   * Sanitize text input to prevent injection attacks
   */
  static sanitizeText(input: string): string {
    if (!input) return '';
    
    return input
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocols
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  }

  /**
   * Validate file type against whitelist
   */
  static validateFileType(file: File): { isValid: boolean; error?: string } {
    const allowedTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    const allowedExtensions = ['.csv', '.xls', '.xlsx'];
    
    // Check MIME type
    if (!allowedTypes.includes(file.type)) {
      // Fallback to extension check
      const hasValidExtension = allowedExtensions.some(ext => 
        file.name.toLowerCase().endsWith(ext)
      );
      
      if (!hasValidExtension) {
        return {
          isValid: false,
          error: 'Invalid file type. Only CSV and Excel files are allowed.'
        };
      }
    }
    
    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: 'File size exceeds 10MB limit.'
      };
    }
    
    return { isValid: true };
  }

  /**
   * Validate CSV file structure
   */
  static async validateCsvStructure(file: File): Promise<{ isValid: boolean; error?: string }> {
    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        return {
          isValid: false,
          error: 'CSV file must contain at least a header row and one data row.'
        };
      }
      
      const headerCount = lines[0].split(',').length;
      if (headerCount < 5) {
        return {
          isValid: false,
          error: 'CSV file must contain at least 5 columns.'
        };
      }
      
      // Check for potential CSV injection
      const suspiciousPatterns = /^[=+\-@]/;
      for (let i = 0; i < Math.min(lines.length, 10); i++) {
        const cells = lines[i].split(',');
        for (const cell of cells) {
          const cleanCell = cell.trim().replace(/^["']|["']$/g, '');
          if (suspiciousPatterns.test(cleanCell)) {
            return {
              isValid: false,
              error: 'CSV file contains potentially malicious content.'
            };
          }
        }
      }
      
      return { isValid: true };
    } catch (error) {
      return {
        isValid: false,
        error: 'Unable to validate CSV file structure.'
      };
    }
  }

  /**
   * Validate URL for extraction compliance
   */
  static validateExtractionUrl(url: string): { isValid: boolean; error?: string } {
    try {
      const urlObj = new URL(url);
      
      // Check protocol
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        return {
          isValid: false,
          error: 'Only HTTP and HTTPS URLs are allowed.'
        };
      }
      
      // Check domain allowlist
      const allowedDomains = [
        '.edu',
        'medicine.ucla.edu',
        'hopkinsmedicine.org',
        'mayoclinic.org',
        'utsouthwestern.edu',
        'childrenshospital.org',
        'medicine.yale.edu',
        'med.stanford.edu',
        'medicine.harvard.edu'
      ];
      
      const hostname = urlObj.hostname.toLowerCase();
      const isAllowed = allowedDomains.some(domain => 
        domain.startsWith('.') ? hostname.endsWith(domain) : hostname.includes(domain)
      );
      
      if (!isAllowed) {
        return {
          isValid: false,
          error: 'URL extraction is restricted to authorized educational institution websites only.'
        };
      }
      
      return { isValid: true };
    } catch {
      return {
        isValid: false,
        error: 'Invalid URL format.'
      };
    }
  }

  /**
   * Rate limiting utility
   */
  static createRateLimiter(maxRequests: number, windowMs: number) {
    const requests = new Map<string, number[]>();
    
    return (key: string): boolean => {
      const now = Date.now();
      const windowStart = now - windowMs;
      
      if (!requests.has(key)) {
        requests.set(key, []);
      }
      
      const userRequests = requests.get(key)!;
      
      // Remove old requests outside the window
      const validRequests = userRequests.filter(time => time > windowStart);
      
      if (validRequests.length >= maxRequests) {
        return false; // Rate limit exceeded
      }
      
      validRequests.push(now);
      requests.set(key, validRequests);
      
      return true; // Request allowed
    };
  }

  /**
   * Intercept and block invalid AI API requests
   */
  static interceptAIRequests() {
    // Note: AI request interception disabled to prevent interference with Bolt's screenshot functionality
    // The empty image error handling is now done at the service level instead
    console.log('AI request interception disabled to preserve Bolt functionality');
  }
}