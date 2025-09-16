import { ResidentFellowSchema, ValidationErrorSchema } from '../schemas/dmpSchemas';
import { SecurityUtils } from '../utils/security';
import { z } from 'zod';

/**
 * Enhanced validation service with security and business logic
 */
export class ValidationService {
  /**
   * Validate a single resident/fellow record
   */
  static validateRecord(record: any): { isValid: boolean; errors: any[] } {
    try {
      // Sanitize all string inputs
      const sanitizedRecord = this.sanitizeRecord(record);
      
      // Validate with Zod schema
      const result = ResidentFellowSchema.safeParse(sanitizedRecord);
      
      if (result.success) {
        return { isValid: true, errors: [] };
      }
      
      const errors = result.error.errors.map(error => ({
        field: error.path.join('.'),
        message: error.message,
        severity: 'error' as const,
        value: error.path.reduce((obj, key) => obj?.[key], record)
      }));
      
      return { isValid: false, errors };
    } catch (error) {
      return {
        isValid: false,
        errors: [{
          field: 'record',
          message: 'Failed to validate record structure',
          severity: 'error' as const
        }]
      };
    }
  }

  /**
   * Sanitize all string fields in a record
   */
  private static sanitizeRecord(record: any): any {
    const sanitized = { ...record };
    
    for (const [key, value] of Object.entries(sanitized)) {
      if (typeof value === 'string') {
        sanitized[key] = SecurityUtils.sanitizeText(value);
      }
    }
    
    return sanitized;
  }

  /**
   * Validate business logic rules
   */
  static validateBusinessRules(record: any): { isValid: boolean; warnings: any[] } {
    const warnings: any[] = [];
    
    // Check license expiration
    if (record.licenseExpireDate) {
      const expireDate = new Date(record.licenseExpireDate);
      const sixMonthsFromNow = new Date();
      sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
      
      if (expireDate <= sixMonthsFromNow) {
        warnings.push({
          field: 'licenseExpireDate',
          message: 'License expires within 6 months',
          severity: 'warning' as const,
          value: record.licenseExpireDate
        });
      }
    }
    
    // Check specialty-specific requirements
    if (record.primarySpecialty === 'Surgery' && !record.boardName) {
      warnings.push({
        field: 'boardName',
        message: 'Board certification recommended for surgical specialties',
        severity: 'warning' as const
      });
    }
    
    // Check training dates consistency
    if (record.trainingStartDate && record.trainingEndDate) {
      const startDate = new Date(record.trainingStartDate);
      const endDate = new Date(record.trainingEndDate);
      const yearsDiff = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
      
      if (record.programType === 'Residency' && (yearsDiff < 2 || yearsDiff > 7)) {
        warnings.push({
          field: 'trainingEndDate',
          message: 'Residency duration seems unusual (typically 3-5 years)',
          severity: 'warning' as const
        });
      }
    }
    
    return { isValid: warnings.length === 0, warnings };
  }

  /**
   * Validate file upload with security checks
   */
  static async validateFileUpload(file: File): Promise<{ isValid: boolean; error?: string }> {
    // Basic security validation
    const securityCheck = SecurityUtils.validateFileType(file);
    if (!securityCheck.isValid) {
      return securityCheck;
    }
    
    // Structure validation for CSV files
    if (file.type === 'text/csv' || file.name.toLowerCase().endsWith('.csv')) {
      return await SecurityUtils.validateCsvStructure(file);
    }
    
    return { isValid: true };
  }

  /**
   * Validate batch import data
   */
  static validateBatch(records: any[]): {
    validRecords: any[];
    invalidRecords: any[];
    totalErrors: number;
    totalWarnings: number;
  } {
    const validRecords: any[] = [];
    const invalidRecords: any[] = [];
    let totalErrors = 0;
    let totalWarnings = 0;

    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      
      // Validate record structure
      const validation = this.validateRecord(record);
      const businessRules = this.validateBusinessRules(record);
      
      const allErrors = [...validation.errors, ...businessRules.warnings];
      const errorCount = allErrors.filter(e => e.severity === 'error').length;
      const warningCount = allErrors.filter(e => e.severity === 'warning').length;
      
      totalErrors += errorCount;
      totalWarnings += warningCount;
      
      if (errorCount === 0) {
        validRecords.push({
          ...record,
          rowIndex: i + 1,
          warnings: businessRules.warnings
        });
      } else {
        invalidRecords.push({
          ...record,
          rowIndex: i + 1,
          errors: allErrors
        });
      }
    }

    return {
      validRecords,
      invalidRecords,
      totalErrors,
      totalWarnings
    };
  }

  /**
   * Create validation schema for dynamic field mapping
   */
  static createMappingSchema(fieldMappings: Record<string, string>) {
    const schemaFields: Record<string, z.ZodTypeAny> = {};
    
    for (const [sourceField, targetField] of Object.entries(fieldMappings)) {
      if (targetField) {
        // Get the validation rule for the target field from our main schema
        const fieldSchema = this.getFieldSchema(targetField);
        if (fieldSchema) {
          schemaFields[sourceField] = fieldSchema;
        }
      }
    }
    
    return z.object(schemaFields);
  }

  /**
   * Get validation schema for a specific field
   */
  private static getFieldSchema(fieldName: string): z.ZodTypeAny | null {
    const schemaShape = ResidentFellowSchema.shape;
    return schemaShape[fieldName as keyof typeof schemaShape] || null;
  }
}