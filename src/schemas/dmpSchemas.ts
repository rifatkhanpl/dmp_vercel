import { z } from 'zod';

/**
 * Zod validation schemas for DMP data structures
 */

// Phone number regex for US format
const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;

// NPI validation - exactly 10 digits
const npiRegex = /^\d{10}$/;

// Email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Date validation helper
const dateString = z.string().refine(
  (date) => !date || !isNaN(Date.parse(date)),
  { message: "Invalid date format" }
);

// Base resident/fellow schema
export const ResidentFellowSchema = z.object({
  // Required fields
  npi: z.string()
    .min(1, "NPI is required")
    .regex(npiRegex, "NPI must be exactly 10 digits"),
  
  firstName: z.string()
    .min(1, "First name is required")
    .max(50, "First name must be less than 50 characters"),
  
  lastName: z.string()
    .min(1, "Last name is required")
    .max(50, "Last name must be less than 50 characters"),
  
  credentials: z.string()
    .min(1, "Credentials are required")
    .max(20, "Credentials must be less than 20 characters"),
  
  practiceAddress1: z.string()
    .min(1, "Practice address is required")
    .max(100, "Address must be less than 100 characters"),
  
  practiceCity: z.string()
    .min(1, "Practice city is required")
    .max(50, "City must be less than 50 characters"),
  
  practiceState: z.string()
    .min(2, "Practice state is required")
    .max(2, "State must be 2 characters")
    .regex(/^[A-Z]{2}$/, "State must be 2 uppercase letters"),
  
  practiceZip: z.string()
    .min(5, "Practice ZIP is required")
    .max(10, "ZIP must be less than 10 characters")
    .regex(/^\d{5}(-\d{4})?$/, "ZIP must be in format 12345 or 12345-6789"),
  
  mailingAddress1: z.string()
    .min(1, "Mailing address is required")
    .max(100, "Address must be less than 100 characters"),
  
  mailingCity: z.string()
    .min(1, "Mailing city is required")
    .max(50, "City must be less than 50 characters"),
  
  mailingState: z.string()
    .min(2, "Mailing state is required")
    .max(2, "State must be 2 characters")
    .regex(/^[A-Z]{2}$/, "State must be 2 uppercase letters"),
  
  mailingZip: z.string()
    .min(5, "Mailing ZIP is required")
    .max(10, "ZIP must be less than 10 characters")
    .regex(/^\d{5}(-\d{4})?$/, "ZIP must be in format 12345 or 12345-6789"),
  
  primarySpecialty: z.string()
    .min(1, "Primary specialty is required")
    .max(100, "Specialty must be less than 100 characters"),
  
  licenseState: z.string()
    .min(2, "License state is required")
    .max(2, "State must be 2 characters")
    .regex(/^[A-Z]{2}$/, "State must be 2 uppercase letters"),
  
  licenseNumber: z.string()
    .min(1, "License number is required")
    .max(50, "License number must be less than 50 characters"),
  
  sourceType: z.enum(['Template', 'AI-Map', 'URL']),
  
  status: z.enum(['pending', 'validated', 'approved', 'rejected']),

  // Optional fields
  middleName: z.string().max(50).optional(),
  
  gender: z.enum(['M', 'F', 'Other']).optional(),
  
  dateOfBirth: dateString.optional(),
  
  email: z.string()
    .regex(emailRegex, "Invalid email format")
    .max(100, "Email must be less than 100 characters")
    .optional(),
  
  phone: z.string()
    .regex(phoneRegex, "Phone must be in format (555) 123-4567")
    .optional(),
  
  alternatePhone: z.string()
    .regex(phoneRegex, "Phone must be in format (555) 123-4567")
    .optional(),
  
  practiceAddress2: z.string().max(100).optional(),
  mailingAddress2: z.string().max(100).optional(),
  
  secondarySpecialty: z.string().max(100).optional(),
  taxonomyCode: z.string().max(20).optional(),
  
  licenseIssueDate: dateString.optional(),
  licenseExpireDate: dateString.optional(),
  
  boardName: z.string().max(100).optional(),
  certificateName: z.string().max(100).optional(),
  certificationStartDate: dateString.optional(),
  
  programName: z.string().max(100).optional(),
  institution: z.string().max(100).optional(),
  programType: z.enum(['Residency', 'Fellowship']).optional(),
  trainingStartDate: dateString.optional(),
  trainingEndDate: dateString.optional(),
  pgyYear: z.string().max(10).optional(),
  
  deaNumber: z.string().max(20).optional(),
  medicareNumber: z.string().max(20).optional(),
  medicaidNumber: z.string().max(20).optional(),
  soleProprietor: z.boolean().optional(),
  
  sourceArtifact: z.string().max(200).optional(),
  sourceUrl: z.string().url().max(500).optional(),
  sourceFetchDate: z.string().optional(),
  sourceHash: z.string().max(100).optional(),
  enteredBy: z.string().max(100).optional(),
  enteredAt: z.string().optional(),
  lastModifiedBy: z.string().max(100).optional(),
  lastModifiedAt: z.string().optional(),
  
  validationErrors: z.array(z.string()).optional(),
  duplicateOf: z.string().optional()
}).refine(
  (data) => {
    // Cross-field validation: license expiration after issue date
    if (data.licenseIssueDate && data.licenseExpireDate) {
      const issueDate = new Date(data.licenseIssueDate);
      const expireDate = new Date(data.licenseExpireDate);
      return expireDate > issueDate;
    }
    return true;
  },
  {
    message: "License expiration date must be after issue date",
    path: ["licenseExpireDate"]
  }
).refine(
  (data) => {
    // Cross-field validation: training end date after start date
    if (data.trainingStartDate && data.trainingEndDate) {
      const startDate = new Date(data.trainingStartDate);
      const endDate = new Date(data.trainingEndDate);
      return endDate > startDate;
    }
    return true;
  },
  {
    message: "Training end date must be after start date",
    path: ["trainingEndDate"]
  }
);

export const ValidationErrorSchema = z.object({
  row: z.number(),
  field: z.string(),
  message: z.string(),
  severity: z.enum(['error', 'warning']),
  value: z.string().optional()
});

export const ImportJobSchema = z.object({
  id: z.string(),
  type: z.enum(['template', 'ai-map', 'url']),
  status: z.enum(['processing', 'completed', 'failed', 'partial']),
  fileName: z.string().optional(),
  sourceUrl: z.string().url().optional(),
  totalRecords: z.number().min(0),
  successCount: z.number().min(0),
  errorCount: z.number().min(0),
  warningCount: z.number().min(0),
  errors: z.array(ValidationErrorSchema),
  createdAt: z.string(),
  completedAt: z.string().optional(),
  createdBy: z.string()
});

export const MappingProfileSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Profile name is required").max(100),
  sourceType: z.string(),
  fieldMappings: z.record(z.string()),
  confidence: z.number().min(0).max(1),
  createdBy: z.string(),
  createdAt: z.string(),
  lastUsed: z.string().optional()
});

// File upload validation schema
export const FileUploadSchema = z.object({
  file: z.instanceof(File),
  maxSize: z.number().default(10 * 1024 * 1024), // 10MB
  allowedTypes: z.array(z.string()).default([
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ])
});

// URL extraction validation schema
export const UrlExtractionSchema = z.object({
  url: z.string().url("Invalid URL format"),
  allowedDomains: z.array(z.string()).default([
    '.edu',
    'medicine.ucla.edu',
    'hopkinsmedicine.org',
    'mayoclinic.org',
    'utsouthwestern.edu',
    'childrenshospital.org',
    'medicine.yale.edu',
    'med.stanford.edu',
    'medicine.harvard.edu'
  ])
});

export type ResidentFellowType = z.infer<typeof ResidentFellowSchema>;
export type ValidationErrorType = z.infer<typeof ValidationErrorSchema>;
export type ImportJobType = z.infer<typeof ImportJobSchema>;
export type MappingProfileType = z.infer<typeof MappingProfileSchema>;