export interface ResidentFellow {
  id?: string;
  npi: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  credentials: string;
  gender?: 'M' | 'F' | 'Other';
  dateOfBirth?: string;
  email?: string;
  phone?: string;
  alternatePhone?: string;
  
  // Practice Address
  practiceAddress1: string;
  practiceAddress2?: string;
  practiceCity: string;
  practiceState: string;
  practiceZip: string;
  
  // Mailing Address
  mailingAddress1: string;
  mailingAddress2?: string;
  mailingCity: string;
  mailingState: string;
  mailingZip: string;
  
  // Professional Information
  primarySpecialty: string;
  secondarySpecialty?: string;
  taxonomyCode?: string;
  
  // License Information
  licenseState: string;
  licenseNumber: string;
  licenseIssueDate?: string;
  licenseExpireDate?: string;
  
  // Board Certification
  boardName?: string;
  certificateName?: string;
  certificationStartDate?: string;
  
  // GME Training
  programName?: string;
  institution?: string;
  programType?: 'Residency' | 'Fellowship';
  trainingStartDate?: string;
  trainingEndDate?: string;
  pgyYear?: string;
  
  // Additional Fields
  deaNumber?: string;
  medicareNumber?: string;
  medicaidNumber?: string;
  soleProprietor?: boolean;
  
  // Provenance
  sourceType: 'Template' | 'AI-Map' | 'URL';
  sourceArtifact?: string;
  sourceUrl?: string;
  sourceFetchDate?: string;
  sourceHash?: string;
  enteredBy?: string;
  enteredAt?: string;
  lastModifiedBy?: string;
  lastModifiedAt?: string;
  
  // Status
  status: 'pending' | 'validated' | 'approved' | 'rejected';
  validationErrors?: string[];
  duplicateOf?: string;
}

export interface ValidationError {
  row: number;
  field: string;
  message: string;
  severity: 'error' | 'warning';
  value?: string;
}

export interface ImportJob {
  id: string;
  type: 'template' | 'ai-map' | 'url';
  status: 'processing' | 'completed' | 'failed' | 'partial';
  fileName?: string;
  sourceUrl?: string;
  totalRecords: number;
  successCount: number;
  errorCount: number;
  warningCount: number;
  errors: ValidationError[];
  createdAt: string;
  completedAt?: string;
  createdBy: string;
}

export interface MappingProfile {
  id: string;
  name: string;
  sourceType: string;
  fieldMappings: Record<string, string>;
  confidence: number;
  createdBy: string;
  createdAt: string;
  lastUsed?: string;
}

export interface DuplicateCandidate {
  existing: ResidentFellow;
  incoming: ResidentFellow;
  matchType: 'npi' | 'name-dob' | 'fuzzy';
  confidence: number;
  suggestedAction: 'merge' | 'skip' | 'create-new';
}