export interface GMEInstitution {
  id: string;
  institutionName: string;
  institutionType: 'Academic Medical Center' | 'Community Hospital' | 'Specialty Hospital' | 'Veterans Affairs' | 'Children\'s Hospital' | 'Cancer Center' | 'Rehabilitation Hospital' | 'Psychiatric Hospital';
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  website?: string;
  mainPhone?: string;
  mainEmail?: string;
  gmeOfficePhone?: string;
  gmeOfficeEmail?: string;
  dioName?: string;
  dioEmail?: string;
  totalResidents: number;
  totalPrograms: number;
  accreditationStatus: 'Accredited' | 'Probation' | 'Warning' | 'Withdrawn' | 'Pending';
  accreditationExpiry?: string;
  establishedYear?: number;
  hospitalBeds?: number;
  traumaLevel?: 'Level I' | 'Level II' | 'Level III' | 'Level IV';
  teachingAffiliations?: string[];
  researchFocus?: string[];
  specialtyStrengths?: string[];
  status: 'active' | 'inactive' | 'probation';
  notes?: string;
  managedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GMEProgram {
  id: string;
  programName: string;
  institution: string;
  institutionId?: string;
  profession: string;
  specialty: string;
  subspecialty?: string;
  city: string;
  state: string;
  programType: 'Residency' | 'Fellowship';
  accreditation: string;
  positions: number;
  programDirector: string;
  associateDirector?: string;
  website?: string;
  email?: string;
  phone?: string;
  description?: string;
  established?: number;
  duration?: string;
  applicationDeadline?: string;
  interviewSeason?: string;
  matchDate?: string;
  salaryPgy1?: number;
  salaryPgy2?: number;
  salaryPgy3?: number;
  benefits?: string[];
  rotations?: string[];
  requirements?: string[];
  statistics?: {
    totalApplications?: number;
    interviewsOffered?: number;
    matchRate?: string;
    boardPassRate?: string;
  };
  fellowshipPlacements?: string[];
  managedBy?: string;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  createdAt: string;
  updatedAt: string;
}

export interface InstitutionSummary {
  id: string;
  institutionName: string;
  institutionType: string;
  location: string;
  totalPrograms: number;
  totalResidents: number;
  accreditationStatus: string;
  specialtyStrengths: string[];
  managedBy?: string;
  status: string;
}