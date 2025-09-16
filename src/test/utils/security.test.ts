import { describe, it, expect } from 'vitest';
import { SecurityUtils } from '../../utils/security';

describe('SecurityUtils', () => {
  describe('sanitizeHtml', () => {
    it('should remove script tags', () => {
      const dirty = '<p>Hello</p><script>alert("xss")</script>';
      const clean = SecurityUtils.sanitizeHtml(dirty);
      expect(clean).toBe('<p>Hello</p>');
      expect(clean).not.toContain('<script>');
    });

    it('should preserve allowed tags', () => {
      const dirty = '<p>Hello <strong>world</strong></p>';
      const clean = SecurityUtils.sanitizeHtml(dirty);
      expect(clean).toBe('<p>Hello <strong>world</strong></p>');
    });

    it('should remove event handlers', () => {
      const dirty = '<p onclick="alert(1)">Hello</p>';
      const clean = SecurityUtils.sanitizeHtml(dirty);
      expect(clean).not.toContain('onclick');
    });
  });

  describe('sanitizeText', () => {
    it('should remove HTML tags', () => {
      const dirty = 'Hello <script>alert("xss")</script> world';
      const clean = SecurityUtils.sanitizeText(dirty);
      expect(clean).toBe('Hello  world');
    });

    it('should remove javascript protocols', () => {
      const dirty = 'javascript:alert("xss")';
      const clean = SecurityUtils.sanitizeText(dirty);
      expect(clean).toBe('alert("xss")');
    });

    it('should handle empty input', () => {
      expect(SecurityUtils.sanitizeText('')).toBe('');
      expect(SecurityUtils.sanitizeText(null as any)).toBe('');
      expect(SecurityUtils.sanitizeText(undefined as any)).toBe('');
    });
  });

  describe('validateFileType', () => {
    it('should accept valid CSV file', () => {
      const file = new File(['test'], 'test.csv', { type: 'text/csv' });
      const result = SecurityUtils.validateFileType(file);
      expect(result.isValid).toBe(true);
    });

    it('should reject invalid file type', () => {
      const file = new File(['test'], 'test.exe', { type: 'application/x-executable' });
      const result = SecurityUtils.validateFileType(file);
      expect(result.isValid).toBe(false);
    });

    it('should reject oversized file', () => {
      const largeContent = 'x'.repeat(11 * 1024 * 1024); // 11MB
      const file = new File([largeContent], 'large.csv', { type: 'text/csv' });
      const result = SecurityUtils.validateFileType(file);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('size');
    });
  });

  describe('validateExtractionUrl', () => {
    it('should accept authorized educational domain', () => {
      const result = SecurityUtils.validateExtractionUrl('https://medicine.ucla.edu/residents');
      expect(result.isValid).toBe(true);
    });

    it('should reject unauthorized domain', () => {
      const result = SecurityUtils.validateExtractionUrl('https://malicious.com/data');
      expect(result.isValid).toBe(false);
    });

    it('should reject non-HTTPS URLs', () => {
      const result = SecurityUtils.validateExtractionUrl('ftp://medicine.ucla.edu/residents');
      expect(result.isValid).toBe(false);
    });
  });

  describe('createRateLimiter', () => {
    it('should allow requests within limit', () => {
      const limiter = SecurityUtils.createRateLimiter(5, 60000);
      
      expect(limiter('test-key')).toBe(true);
      expect(limiter('test-key')).toBe(true);
      expect(limiter('test-key')).toBe(true);
    });

    it('should block requests exceeding limit', () => {
      const limiter = SecurityUtils.createRateLimiter(2, 60000);
      
      expect(limiter('test-key')).toBe(true);
      expect(limiter('test-key')).toBe(true);
      expect(limiter('test-key')).toBe(false); // Should be blocked
    });

    it('should reset after time window', async () => {
      const limiter = SecurityUtils.createRateLimiter(1, 100); // 100ms window
      
      expect(limiter('test-key')).toBe(true);
      expect(limiter('test-key')).toBe(false);
      
      // Wait for window to reset
      await new Promise(resolve => setTimeout(resolve, 150));
      
      expect(limiter('test-key')).toBe(true);
    });
  });
});