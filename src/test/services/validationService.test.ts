import { describe, it, expect, vi } from 'vitest';
import { ValidationService } from '../../services/validationService';
import { SecurityUtils } from '../../utils/security';

describe('ValidationService', () => {
  describe('validateRecord', () => {
    it('should validate a complete valid record', () => {
      const validRecord = {
        npi: '1234567890',
        firstName: 'John',
        lastName: 'Doe',
        credentials: 'MD',
        practiceAddress1: '123 Main St',
        practiceCity: 'Los Angeles',
        practiceState: 'CA',
        practiceZip: '90210',
        mailingAddress1: '123 Main St',
        mailingCity: 'Los Angeles',
        mailingState: 'CA',
        mailingZip: '90210',
        primarySpecialty: 'Internal Medicine',
        licenseState: 'CA',
        licenseNumber: 'A12345',
        sourceType: 'Template',
        status: 'pending'
      };

      const result = ValidationService.validateRecord(validRecord);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject record with invalid NPI', () => {
      const invalidRecord = {
        npi: '123', // Invalid - too short
        firstName: 'John',
        lastName: 'Doe',
        credentials: 'MD'
      };

      const result = ValidationService.validateRecord(invalidRecord);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.field === 'npi')).toBe(true);
    });

    it('should sanitize malicious input', () => {
      const maliciousRecord = {
        firstName: '<script>alert("xss")</script>John',
        lastName: 'Doe',
        email: 'test@example.com<script>alert("xss")</script>'
      };

      const result = ValidationService.validateRecord(maliciousRecord);
      // Should not contain script tags after sanitization
      expect(result.errors.some(e => e.value?.includes('<script>'))).toBe(false);
    });
  });

  describe('validateBusinessRules', () => {
    it('should warn about expiring license', () => {
      const record = {
        licenseExpireDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
      };

      const result = ValidationService.validateBusinessRules(record);
      expect(result.warnings.some(w => w.field === 'licenseExpireDate')).toBe(true);
    });

    it('should validate training date consistency', () => {
      const record = {
        trainingStartDate: '2023-07-01',
        trainingEndDate: '2022-06-30' // End before start - invalid
      };

      const result = ValidationService.validateBusinessRules(record);
      expect(result.warnings.some(w => w.field === 'trainingEndDate')).toBe(true);
    });
  });

  describe('validateFileUpload', () => {
    it('should accept valid CSV file', async () => {
      const csvContent = 'name,email\nJohn Doe,john@example.com';
      const file = new File([csvContent], 'test.csv', { type: 'text/csv' });

      const result = await ValidationService.validateFileUpload(file);
      expect(result.isValid).toBe(true);
    });

    it('should reject oversized file', async () => {
      const largeContent = 'x'.repeat(11 * 1024 * 1024); // 11MB
      const file = new File([largeContent], 'large.csv', { type: 'text/csv' });

      const result = await ValidationService.validateFileUpload(file);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('size');
    });

    it('should reject malicious CSV content', async () => {
      const maliciousContent = '=cmd|"/c calc",name\n=1+1,John Doe';
      const file = new File([maliciousContent], 'malicious.csv', { type: 'text/csv' });

      const result = await ValidationService.validateFileUpload(file);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('malicious');
    });
  });
});