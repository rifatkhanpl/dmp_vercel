import { HealthcareProviderService } from './healthcareProviderService';
import { ImportJobService } from './importJobService';
import { ValidationService } from './validationService';
import { SecurityUtils } from '../utils/security';
import { errorService } from './errorService';
import { ResidentFellow, ImportJob, ValidationError } from '../types/dmp';
import { ResidentFellowSchema } from '../schemas/dmpSchemas';

export class RealDMPService {
  /**
   * Process template upload with real database operations
   */
  static async processTemplateUpload(file: File, userId: string): Promise<ImportJob> {
    const startTime = Date.now();
    
    // Validate file security first
    const fileValidation = await ValidationService.validateFileUpload(file);
    if (!fileValidation.isValid) {
      throw new Error(fileValidation.error || 'File validation failed');
    }

    // Create import job record
    const jobId = await ImportJobService.createImportJob({
      type: 'template',
      fileName: file.name,
      fileSize: file.size,
      fileHash: await this.calculateFileHash(file)
    }, userId);

    try {
      // Parse CSV file
      const text = await errorService.withTimeout(file.text(), 30000);
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length === 0) {
        throw new Error('File appears to be empty');
      }
      
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      const totalRecords = lines.length - 1;
      
      const validRecords: Partial<ResidentFellow>[] = [];
      const allErrors: ValidationError[] = [];
      let successCount = 0;
      let errorCount = 0;
      let warningCount = 0;

      // Process each row
      for (let i = 1; i < lines.length; i++) {
        try {
          const values = lines[i].split(',').map(v => SecurityUtils.sanitizeText(v.trim().replace(/"/g, '')));
          const record: Partial<ResidentFellow> = {};
        
          headers.forEach((header, index) => {
            const value = values[index] || '';
            const fieldName = this.mapHeaderToField(header);
            if (fieldName) {
              (record as any)[fieldName] = value;
            }
          });

          // Validate record
          const validation = ResidentFellowSchema.safeParse(record);
          
          if (validation.success) {
            validRecords.push(validation.data);
            successCount++;
          } else {
            validation.error.errors.forEach(error => {
              const validationError: ValidationError = {
                row: i,
                field: error.path.join('.'),
                message: error.message,
                severity: 'error',
                value: error.path.reduce((obj, key) => obj?.[key], record) as string
              };
              allErrors.push(validationError);
            });
            errorCount++;
          }
        } catch (rowError) {
          allErrors.push({
            row: i,
            field: 'row',
            message: `Failed to process row: ${rowError instanceof Error ? rowError.message : 'Unknown error'}`,
            severity: 'error'
          });
          errorCount++;
        }
      }

      // Save validation errors
      if (allErrors.length > 0) {
        await ImportJobService.addValidationErrors(jobId, allErrors);
      }

      // Bulk import valid records
      if (validRecords.length > 0) {
        await HealthcareProviderService.bulkImportProviders(validRecords, userId);
      }

      // Update job status
      const processingTime = Date.now() - startTime;
      const finalStatus = errorCount > 0 ? 'partial' : 'completed';
      
      await ImportJobService.updateImportJob(jobId, {
        status: finalStatus,
        totalRecords,
        successCount,
        errorCount,
        warningCount,
        processingTimeMs: processingTime
      });

      // Return job summary
      return {
        id: jobId,
        type: 'template',
        status: finalStatus,
        fileName: file.name,
        totalRecords,
        successCount,
        errorCount,
        warningCount,
        errors: allErrors,
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        createdBy: userId
      };

    } catch (error) {
      // Update job as failed
      await ImportJobService.updateImportJob(jobId, {
        status: 'failed',
        errorCount: 1,
        processingTimeMs: Date.now() - startTime
      });

      // Add error to validation errors
      await ImportJobService.addValidationErrors(jobId, [{
        row: 0,
        field: 'file',
        message: error instanceof Error ? error.message : 'Unknown error',
        severity: 'error'
      }]);

      throw error;
    }
  }

  /**
   * Calculate file hash for provenance tracking
   */
  private static async calculateFileHash(file: File): Promise<string> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (error) {
      errorService.logError(error as Error, { context: 'File hash calculation' });
      return 'hash_error_' + Date.now();
    }
  }

  /**
   * Map CSV headers to database fields
   */
  private static mapHeaderToField(header: string): string | null {
    const mappings: Record<string, string> = {
      'npi': 'npi',
      'npi number': 'npi',
      'first name': 'firstName',
      'middle name': 'middleName',
      'last name': 'lastName',
      'credentials': 'credentials',
      'gender': 'gender',
      'date of birth': 'dateOfBirth',
      'email': 'email',
      'email address': 'email',
      'phone': 'phone',
      'phone number': 'phone',
      'alternate phone': 'alternatePhone',
      'practice address 1': 'practiceAddress1',
      'practice address 2': 'practiceAddress2',
      'practice city': 'practiceCity',
      'practice state': 'practiceState',
      'practice zip': 'practiceZip',
      'mailing address 1': 'mailingAddress1',
      'mailing address 2': 'mailingAddress2',
      'mailing city': 'mailingCity',
      'mailing state': 'mailingState',
      'mailing zip': 'mailingZip',
      'primary specialty': 'primarySpecialty',
      'secondary specialty': 'secondarySpecialty',
      'taxonomy code': 'taxonomyCode',
      'license state': 'licenseState',
      'license number': 'licenseNumber',
      'license issue date': 'licenseIssueDate',
      'license expire date': 'licenseExpireDate',
      'board name': 'boardName',
      'certificate name': 'certificateName',
      'certification start date': 'certificationStartDate',
      'program name': 'programName',
      'institution': 'institution',
      'program type': 'programType',
      'training start date': 'trainingStartDate',
      'training end date': 'trainingEndDate',
      'pgy year': 'pgyYear',
      'dea number': 'deaNumber',
      'medicare number': 'medicareNumber',
      'medicaid number': 'medicaidNumber',
      'sole proprietor': 'soleProprietor'
    };

    const normalized = header.toLowerCase().trim();
    return mappings[normalized] || null;
  }

  /**
   * Process AI-assisted import
   */
  static async processAIImport(
    parsedData: any[], 
    userId: string, 
    sourceType: 'text' | 'url',
    sourceContent: string
  ): Promise<ImportJob> {
    const startTime = Date.now();
    
    // Create import job
    const jobId = await ImportJobService.createImportJob({
      type: 'ai-map',
      sourceUrl: sourceType === 'url' ? sourceContent : undefined,
      metadata: { sourceType, contentLength: sourceContent.length }
    }, userId);

    try {
      const validRecords: Partial<ResidentFellow>[] = [];
      const allErrors: ValidationError[] = [];
      let successCount = 0;
      let errorCount = 0;

      // Process each parsed record
      for (let i = 0; i < parsedData.length; i++) {
        const parsed = parsedData[i];
        
        // Transform AI parsed data to our schema
        const record: Partial<ResidentFellow> = {
          firstName: this.extractFirstName(parsed.name),
          lastName: this.extractLastName(parsed.name),
          credentials: this.extractCredentials(parsed.name),
          primarySpecialty: parsed.specialty,
          email: parsed.email,
          phone: parsed.phone,
          pgyYear: parsed.pgyYear,
          sourceType: sourceType === 'url' ? 'URL' : 'AI-Map',
          sourceUrl: sourceType === 'url' ? sourceContent : undefined,
          sourceArtifact: sourceType === 'text' ? 'AI_PARSED_TEXT' : undefined,
          sourceFetchDate: new Date().toISOString(),
          status: 'pending',
          // Generate temporary values for required fields
          npi: this.generateTempNPI(),
          practiceAddress1: 'Unknown',
          practiceCity: 'Unknown',
          practiceState: 'CA',
          practiceZip: '00000',
          mailingAddress1: 'Unknown',
          mailingCity: 'Unknown',
          mailingState: 'CA',
          mailingZip: '00000',
          licenseState: 'CA',
          licenseNumber: 'TEMP' + Date.now()
        };

        // Validate record
        const validation = ResidentFellowSchema.safeParse(record);
        
        if (validation.success) {
          validRecords.push(validation.data);
          successCount++;
        } else {
          validation.error.errors.forEach(error => {
            allErrors.push({
              row: i + 1,
              field: error.path.join('.'),
              message: error.message,
              severity: 'error',
              value: String(error.path.reduce((obj, key) => obj?.[key], record) || '')
            });
          });
          errorCount++;
        }
      }

      // Save validation errors
      if (allErrors.length > 0) {
        await ImportJobService.addValidationErrors(jobId, allErrors);
      }

      // Bulk import valid records
      if (validRecords.length > 0) {
        await HealthcareProviderService.bulkImportProviders(validRecords, userId);
      }

      // Update job status
      const processingTime = Date.now() - startTime;
      const finalStatus = errorCount > 0 ? 'partial' : 'completed';
      
      await ImportJobService.updateImportJob(jobId, {
        status: finalStatus,
        totalRecords: parsedData.length,
        successCount,
        errorCount,
        warningCount: 0,
        processingTimeMs: processingTime
      });

      return {
        id: jobId,
        type: 'ai-map',
        status: finalStatus,
        sourceUrl: sourceType === 'url' ? sourceContent : undefined,
        totalRecords: parsedData.length,
        successCount,
        errorCount,
        warningCount: 0,
        errors: allErrors,
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        createdBy: userId
      };

    } catch (error) {
      // Update job as failed
      await ImportJobService.updateImportJob(jobId, {
        status: 'failed',
        errorCount: 1,
        processingTimeMs: Date.now() - startTime
      });

      throw error;
    }
  }

  private static extractFirstName(fullName: string): string {
    const parts = fullName.replace(/,?\s*(MD|DO|MBBS)\.?/i, '').split(/\s+/);
    return parts[0] || 'Unknown';
  }

  private static extractLastName(fullName: string): string {
    const parts = fullName.replace(/,?\s*(MD|DO|MBBS)\.?/i, '').split(/\s+/);
    return parts[parts.length - 1] || 'Unknown';
  }

  private static extractCredentials(fullName: string): string {
    const match = fullName.match(/,?\s*(MD|DO|MBBS)\.?/i);
    return match ? match[1].toUpperCase() : 'MD';
  }

  private static generateTempNPI(): string {
    return '9' + Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
  }
}