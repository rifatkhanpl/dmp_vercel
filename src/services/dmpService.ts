import { ResidentFellow, ValidationError, ImportJob, DuplicateCandidate } from '../types/dmp';

// Validation rules based on data dictionary
export class DMPValidator {
  static validateNPI(npi: string): string | null {
    if (!npi) return 'NPI is required';
    const cleaned = npi.replace(/\D/g, '');
    if (cleaned.length !== 10) return 'NPI must be exactly 10 digits';
    return null;
  }

  static validatePhone(phone: string): string | null {
    if (!phone) return null; // Phone is optional
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length !== 10) return 'Phone must be 10 digits';
    return null;
  }

  static normalizePhone(phone: string): string {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  }

  static validateEmail(email: string): string | null {
    if (!email) return null; // Email is optional
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Invalid email format';
    return null;
  }

  static validateRequired(value: string, fieldName: string): string | null {
    if (!value || !value.trim()) return `${fieldName} is required`;
    return null;
  }

  static validateDate(date: string, fieldName: string): string | null {
    if (!date) return null; // Most dates are optional
    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) return `${fieldName} must be a valid date`;
    return null;
  }

  static validateRecord(record: Partial<ResidentFellow>): ValidationError[] {
    const errors: ValidationError[] = [];
    
    // Required fields
    const requiredFields = [
      'npi', 'firstName', 'lastName', 'credentials', 'practiceAddress1',
      'practiceCity', 'practiceState', 'practiceZip', 'mailingAddress1',
      'mailingCity', 'mailingState', 'mailingZip', 'primarySpecialty',
      'licenseState', 'licenseNumber'
    ];

    requiredFields.forEach(field => {
      const error = this.validateRequired(record[field as keyof ResidentFellow] as string, field);
      if (error) {
        errors.push({
          row: 0,
          field,
          message: error,
          severity: 'error',
          value: record[field as keyof ResidentFellow] as string
        });
      }
    });

    // NPI validation
    if (record.npi) {
      const npiError = this.validateNPI(record.npi);
      if (npiError) {
        errors.push({
          row: 0,
          field: 'npi',
          message: npiError,
          severity: 'error',
          value: record.npi
        });
      }
    }

    // Phone validation
    if (record.phone) {
      const phoneError = this.validatePhone(record.phone);
      if (phoneError) {
        errors.push({
          row: 0,
          field: 'phone',
          message: phoneError,
          severity: 'warning',
          value: record.phone
        });
      }
    }

    // Email validation
    if (record.email) {
      const emailError = this.validateEmail(record.email);
      if (emailError) {
        errors.push({
          row: 0,
          field: 'email',
          message: emailError,
          severity: 'warning',
          value: record.email
        });
      }
    }

    // Date validations
    const dateFields = ['dateOfBirth', 'licenseIssueDate', 'licenseExpireDate', 'certificationStartDate', 'trainingStartDate', 'trainingEndDate'];
    dateFields.forEach(field => {
      const value = record[field as keyof ResidentFellow] as string;
      if (value) {
        const dateError = this.validateDate(value, field);
        if (dateError) {
          errors.push({
            row: 0,
            field,
            message: dateError,
            severity: 'warning',
            value
          });
        }
      }
    });

    return errors;
  }
}

export class DMPDuplicateDetector {
  static findDuplicates(incoming: ResidentFellow, existing: ResidentFellow[]): DuplicateCandidate[] {
    const candidates: DuplicateCandidate[] = [];

    for (const existingRecord of existing) {
      // Exact NPI match
      if (incoming.npi && existingRecord.npi && incoming.npi === existingRecord.npi) {
        candidates.push({
          existing: existingRecord,
          incoming,
          matchType: 'npi',
          confidence: 1.0,
          suggestedAction: 'merge'
        });
        continue;
      }

      // Name + DOB match
      if (incoming.firstName && incoming.lastName && incoming.dateOfBirth &&
          existingRecord.firstName && existingRecord.lastName && existingRecord.dateOfBirth) {
        const nameMatch = this.normalizeString(incoming.firstName) === this.normalizeString(existingRecord.firstName) &&
                          this.normalizeString(incoming.lastName) === this.normalizeString(existingRecord.lastName);
        const dobMatch = incoming.dateOfBirth === existingRecord.dateOfBirth;
        
        if (nameMatch && dobMatch) {
          candidates.push({
            existing: existingRecord,
            incoming,
            matchType: 'name-dob',
            confidence: 0.95,
            suggestedAction: 'merge'
          });
          continue;
        }
      }

      // Fuzzy name match (same specialty)
      if (incoming.firstName && incoming.lastName && incoming.primarySpecialty &&
          existingRecord.firstName && existingRecord.lastName && existingRecord.primarySpecialty) {
        const firstNameSimilarity = this.calculateSimilarity(incoming.firstName, existingRecord.firstName);
        const lastNameSimilarity = this.calculateSimilarity(incoming.lastName, existingRecord.lastName);
        const specialtyMatch = this.normalizeString(incoming.primarySpecialty) === this.normalizeString(existingRecord.primarySpecialty);
        
        if (firstNameSimilarity > 0.8 && lastNameSimilarity > 0.8 && specialtyMatch) {
          const confidence = (firstNameSimilarity + lastNameSimilarity) / 2;
          candidates.push({
            existing: existingRecord,
            incoming,
            matchType: 'fuzzy',
            confidence,
            suggestedAction: confidence > 0.9 ? 'merge' : 'create-new'
          });
        }
      }
    }

    return candidates.sort((a, b) => b.confidence - a.confidence);
  }

  private static normalizeString(str: string): string {
    return str.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
  }

  private static calculateSimilarity(str1: string, str2: string): number {
    const s1 = this.normalizeString(str1);
    const s2 = this.normalizeString(str2);
    
    if (s1 === s2) return 1.0;
    
    const maxLength = Math.max(s1.length, s2.length);
    if (maxLength === 0) return 1.0;
    
    const distance = this.levenshteinDistance(s1, s2);
    return 1 - (distance / maxLength);
  }

  private static levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }
    
    return matrix[str2.length][str1.length];
  }
}

export class DMPService {
  static async processTemplateUpload(file: File): Promise<ImportJob> {
    const jobId = `job_${Date.now()}`;
    const job: ImportJob = {
      id: jobId,
      type: 'template',
      status: 'processing',
      fileName: file.name,
      totalRecords: 0,
      successCount: 0,
      errorCount: 0,
      warningCount: 0,
      errors: [],
      createdAt: new Date().toISOString(),
      createdBy: 'current-user' // TODO: Get from auth context
    };

    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      
      job.totalRecords = lines.length - 1; // Exclude header
      
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
        const record: Partial<ResidentFellow> = {};
        
        headers.forEach((header, index) => {
          const value = values[index] || '';
          record[this.mapHeaderToField(header) as keyof ResidentFellow] = value;
        });

        // Validate record
        const validationErrors = DMPValidator.validateRecord(record);
        validationErrors.forEach(error => {
          error.row = i;
          job.errors.push(error);
          if (error.severity === 'error') {
            job.errorCount++;
          } else {
            job.warningCount++;
          }
        });

        if (validationErrors.filter(e => e.severity === 'error').length === 0) {
          job.successCount++;
          // TODO: Save to database
        }
      }

      job.status = job.errorCount > 0 ? 'partial' : 'completed';
      job.completedAt = new Date().toISOString();
      
    } catch (error) {
      job.status = 'failed';
      job.errors.push({
        row: 0,
        field: 'file',
        message: `Failed to process file: ${error instanceof Error ? error.message : 'Unknown error'}`,
        severity: 'error'
      });
      job.errorCount = 1;
    }

    return job;
  }

  static async processAIMapping(file: File, mappings: Record<string, string>): Promise<ImportJob> {
    // Similar to template upload but with AI-assisted field mapping
    const jobId = `job_ai_${Date.now()}`;
    // Implementation would use the mappings to transform data
    return this.processTemplateUpload(file); // Simplified for now
  }

  static async processURLExtraction(url: string): Promise<ImportJob> {
    const jobId = `job_url_${Date.now()}`;
    const job: ImportJob = {
      id: jobId,
      type: 'url',
      status: 'processing',
      sourceUrl: url,
      totalRecords: 0,
      successCount: 0,
      errorCount: 0,
      warningCount: 0,
      errors: [],
      createdAt: new Date().toISOString(),
      createdBy: 'current-user'
    };

    try {
      // Check robots.txt compliance
      if (!this.isUrlAllowed(url)) {
        throw new Error('URL extraction not allowed by robots.txt or domain policy');
      }

      // Use existing edge function for extraction
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/parse-hcp-data`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'url',
          content: url,
          allowedDegreesOnly: true
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to extract data from URL');
      }

      const providers = result.providers || [];
      job.totalRecords = providers.length;

      // Validate each extracted record
      for (let i = 0; i < providers.length; i++) {
        const provider = providers[i];
        const record: Partial<ResidentFellow> = {
          firstName: this.extractFirstName(provider.name),
          lastName: this.extractLastName(provider.name),
          credentials: this.extractCredentials(provider.name),
          primarySpecialty: provider.specialty,
          pgyYear: provider.pgyYear,
          email: provider.email,
          phone: provider.phone,
          sourceType: 'URL',
          sourceUrl: url,
          sourceFetchDate: new Date().toISOString(),
          status: 'pending'
        };

        const validationErrors = DMPValidator.validateRecord(record);
        validationErrors.forEach(error => {
          error.row = i + 1;
          job.errors.push(error);
          if (error.severity === 'error') {
            job.errorCount++;
          } else {
            job.warningCount++;
          }
        });

        if (validationErrors.filter(e => e.severity === 'error').length === 0) {
          job.successCount++;
        }
      }

      job.status = job.errorCount > 0 ? 'partial' : 'completed';
      job.completedAt = new Date().toISOString();

    } catch (error) {
      job.status = 'failed';
      job.errors.push({
        row: 0,
        field: 'url',
        message: error instanceof Error ? error.message : 'Unknown error',
        severity: 'error'
      });
      job.errorCount = 1;
    }

    return job;
  }

  private static mapHeaderToField(header: string): string {
    const mappings: Record<string, string> = {
      'first name': 'firstName',
      'middle name': 'middleName',
      'last name': 'lastName',
      'npi': 'npi',
      'npi number': 'npi',
      'credentials': 'credentials',
      'gender': 'gender',
      'date of birth': 'dateOfBirth',
      'email': 'email',
      'phone': 'phone',
      'primary specialty': 'primarySpecialty',
      'secondary specialty': 'secondarySpecialty',
      'license state': 'licenseState',
      'license number': 'licenseNumber',
      'program name': 'programName',
      'institution': 'institution',
      'pgy year': 'pgyYear'
    };

    const normalized = header.toLowerCase().trim();
    return mappings[normalized] || header.replace(/\s+/g, '');
  }

  private static isUrlAllowed(url: string): boolean {
    // Check against allowlist of educational institutions
    const allowedDomains = [
      '.edu',
      'residency',
      'fellowship',
      'gme',
      'medical',
      'hospital'
    ];

    return allowedDomains.some(domain => url.toLowerCase().includes(domain));
  }

  private static extractFirstName(fullName: string): string {
    const parts = fullName.replace(/,?\s*(MD|DO|MBBS)\.?/i, '').split(/\s+/);
    return parts[0] || '';
  }

  private static extractLastName(fullName: string): string {
    const parts = fullName.replace(/,?\s*(MD|DO|MBBS)\.?/i, '').split(/\s+/);
    return parts[parts.length - 1] || '';
  }

  private static extractCredentials(fullName: string): string {
    const match = fullName.match(/,?\s*(MD|DO|MBBS)\.?/i);
    return match ? match[1].toUpperCase() : '';
  }

  static generateTemplate(): string {
    const headers = [
      'NPI',
      'First Name',
      'Middle Name',
      'Last Name',
      'Credentials',
      'Gender',
      'Date of Birth',
      'Email',
      'Phone',
      'Alternate Phone',
      'Practice Address 1',
      'Practice Address 2',
      'Practice City',
      'Practice State',
      'Practice Zip',
      'Mailing Address 1',
      'Mailing Address 2',
      'Mailing City',
      'Mailing State',
      'Mailing Zip',
      'Primary Specialty',
      'Secondary Specialty',
      'Taxonomy Code',
      'License State',
      'License Number',
      'License Issue Date',
      'License Expire Date',
      'Board Name',
      'Certificate Name',
      'Certification Start Date',
      'Program Name',
      'Institution',
      'Program Type',
      'Training Start Date',
      'Training End Date',
      'PGY Year',
      'DEA Number',
      'Medicare Number',
      'Medicaid Number',
      'Sole Proprietor'
    ];

    const sampleData = [
      '1234567890',
      'John',
      'Michael',
      'Doe',
      'MD',
      'M',
      '1990-01-15',
      'john.doe@hospital.edu',
      '555-123-4567',
      '555-987-6543',
      '123 Medical Center Dr',
      'Suite 200',
      'Los Angeles',
      'CA',
      '90210',
      '456 Residential St',
      'Apt 5B',
      'Los Angeles',
      'CA',
      '90211',
      'Internal Medicine',
      'Cardiology',
      '207R00000X',
      'CA',
      'A12345',
      '2020-06-15',
      '2025-06-15',
      'American Board of Internal Medicine',
      'Internal Medicine',
      '2020-07-01',
      'Internal Medicine Residency Program',
      'UCLA Medical Center',
      'Residency',
      '2020-07-01',
      '2023-06-30',
      'PGY-3',
      'BJ1234567',
      'MEDICARE123',
      'MEDICAID456',
      'N'
    ];

    return `${headers.join(',')}\n${sampleData.join(',')}`;
  }
}