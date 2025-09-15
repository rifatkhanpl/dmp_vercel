import React, { useState } from 'react';
import { Layout } from '../Layout/Layout';
import { 
  Search as SearchIcon, 
  Filter, 
  User, 
  MapPin, 
  Stethoscope,
  Phone,
  Mail,
  Eye,
  Edit,
  MoreVertical,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  Square,
  CheckSquare,
  Bookmark,
  FileText,
  Download
} from 'lucide-react';

interface Provider {
  id: string;
  name: string;
  credentials: string;
  specialty: string;
  location: string;
  phone: string;
  email: string;
  npi: string;
  status: 'active' | 'inactive' | 'pending';
  profession: string;
  managedBy: string;
  licenseNumber: string;
  licenseState: string;
  deaNumber?: string;
  boardCertification?: string;
}

export function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    specialty: '',
    state: '',
    status: '',
    profession: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<Provider[]>([]);
  const [sortBy, setSortBy] = useState<'name' | 'specialty' | 'location' | 'status'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedProviders, setSelectedProviders] = useState<Set<string>>(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Comprehensive mock data with 100 HCP records
  const mockResults: Provider[] = [
    // Physicians - Internal Medicine
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      credentials: 'MD',
      specialty: 'Internal Medicine',
      profession: 'Physician',
      location: 'Los Angeles, CA',
      phone: '(555) 123-4567',
      email: 'sarah.johnson@example.com',
      npi: '1234567890',
      status: 'active',
      managedBy: 'John Doe',
      licenseNumber: 'A12345',
      licenseState: 'CA',
      deaNumber: 'BJ1234567',
      boardCertification: 'American Board of Internal Medicine'
    },
    {
      id: '2',
      name: 'Dr. Michael Chen',
      credentials: 'DO',
      specialty: 'Internal Medicine',
      profession: 'Physician',
      location: 'San Francisco, CA',
      phone: '(555) 234-5678',
      email: 'michael.chen@example.com',
      npi: '1234567891',
      status: 'active',
      managedBy: 'Sarah Johnson',
      licenseNumber: 'B23456',
      licenseState: 'CA',
      deaNumber: 'BM2345678',
      boardCertification: 'American Board of Internal Medicine'
    },
    // Physicians - Emergency Medicine
    {
      id: '3',
      name: 'Dr. Emily Rodriguez',
      credentials: 'MD',
      specialty: 'Emergency Medicine',
      profession: 'Physician',
      location: 'San Diego, CA',
      phone: '(555) 345-6789',
      email: 'emily.rodriguez@example.com',
      npi: '1234567892',
      status: 'active',
      managedBy: 'John Doe',
      licenseNumber: 'C34567',
      licenseState: 'CA',
      deaNumber: 'BE3456789',
      boardCertification: 'American Board of Emergency Medicine'
    },
    {
      id: '4',
      name: 'Dr. James Wilson',
      credentials: 'MD',
      specialty: 'Emergency Medicine',
      profession: 'Physician',
      location: 'Phoenix, AZ',
      phone: '(602) 456-7890',
      email: 'james.wilson@example.com',
      npi: '1234567893',
      status: 'active',
      managedBy: 'Sarah Johnson',
      licenseNumber: 'D45678',
      licenseState: 'AZ',
      deaNumber: 'BW4567890',
      boardCertification: 'American Board of Emergency Medicine'
    },
    // Physicians - Cardiology
    {
      id: '5',
      name: 'Dr. Lisa Thompson',
      credentials: 'MD',
      specialty: 'Cardiology',
      profession: 'Physician',
      location: 'Houston, TX',
      phone: '(713) 567-8901',
      email: 'lisa.thompson@example.com',
      npi: '1234567894',
      status: 'active',
      managedBy: 'John Doe',
      licenseNumber: 'E56789',
      licenseState: 'TX',
      deaNumber: 'BL5678901',
      boardCertification: 'American Board of Cardiovascular Disease'
    },
    {
      id: '6',
      name: 'Dr. Robert Kim',
      credentials: 'DO',
      specialty: 'Interventional Cardiology',
      profession: 'Physician',
      location: 'Dallas, TX',
      phone: '(214) 678-9012',
      email: 'robert.kim@example.com',
      npi: '1234567895',
      status: 'active',
      managedBy: 'Sarah Johnson',
      licenseNumber: 'F67890',
      licenseState: 'TX',
      deaNumber: 'BR6789012',
      boardCertification: 'American Board of Cardiovascular Disease'
    },
    // Physicians - Pediatrics
    {
      id: '7',
      name: 'Dr. Maria Garcia',
      credentials: 'MD',
      specialty: 'Pediatrics',
      profession: 'Physician',
      location: 'Miami, FL',
      phone: '(305) 789-0123',
      email: 'maria.garcia@example.com',
      npi: '1234567896',
      status: 'active',
      managedBy: 'John Doe',
      licenseNumber: 'G78901',
      licenseState: 'FL',
      deaNumber: 'BG7890123',
      boardCertification: 'American Board of Pediatrics'
    },
    {
      id: '8',
      name: 'Dr. David Lee',
      credentials: 'MD',
      specialty: 'Pediatric Cardiology',
      profession: 'Physician',
      location: 'Orlando, FL',
      phone: '(407) 890-1234',
      email: 'david.lee@example.com',
      npi: '1234567897',
      status: 'active',
      managedBy: 'Sarah Johnson',
      licenseNumber: 'H89012',
      licenseState: 'FL',
      deaNumber: 'BD8901234',
      boardCertification: 'American Board of Pediatrics'
    },
    // Physicians - Surgery
    {
      id: '9',
      name: 'Dr. Jennifer Brown',
      credentials: 'MD',
      specialty: 'General Surgery',
      profession: 'Physician',
      location: 'Atlanta, GA',
      phone: '(404) 901-2345',
      email: 'jennifer.brown@example.com',
      npi: '1234567898',
      status: 'active',
      managedBy: 'John Doe',
      licenseNumber: 'I90123',
      licenseState: 'GA',
      deaNumber: 'BJ9012345',
      boardCertification: 'American Board of Surgery'
    },
    {
      id: '10',
      name: 'Dr. Christopher Davis',
      credentials: 'MD',
      specialty: 'Orthopedic Surgery',
      profession: 'Physician',
      location: 'Charlotte, NC',
      phone: '(704) 012-3456',
      email: 'christopher.davis@example.com',
      npi: '1234567899',
      status: 'active',
      managedBy: 'Sarah Johnson',
      licenseNumber: 'J01234',
      licenseState: 'NC',
      deaNumber: 'BC0123456',
      boardCertification: 'American Board of Orthopedic Surgery'
    },
    // Physicians - Neurology
    {
      id: '11',
      name: 'Dr. Amanda Miller',
      credentials: 'MD',
      specialty: 'Neurology',
      profession: 'Physician',
      location: 'Boston, MA',
      phone: '(617) 123-4567',
      email: 'amanda.miller@example.com',
      npi: '1234567900',
      status: 'active',
      managedBy: 'John Doe',
      licenseNumber: 'K12345',
      licenseState: 'MA',
      deaNumber: 'BA1234567',
      boardCertification: 'American Board of Neurology'
    },
    {
      id: '12',
      name: 'Dr. Steven Wilson',
      credentials: 'DO',
      specialty: 'Neurosurgery',
      profession: 'Physician',
      location: 'Worcester, MA',
      phone: '(508) 234-5678',
      email: 'steven.wilson@example.com',
      npi: '1234567901',
      status: 'active',
      managedBy: 'Sarah Johnson',
      licenseNumber: 'L23456',
      licenseState: 'MA',
      deaNumber: 'BS2345678',
      boardCertification: 'American Board of Neurological Surgery'
    },
    // Physicians - Psychiatry
    {
      id: '13',
      name: 'Dr. Rachel Green',
      credentials: 'MD',
      specialty: 'Psychiatry',
      profession: 'Physician',
      location: 'New York, NY',
      phone: '(212) 345-6789',
      email: 'rachel.green@example.com',
      npi: '1234567902',
      status: 'active',
      managedBy: 'John Doe',
      licenseNumber: 'M34567',
      licenseState: 'NY',
      deaNumber: 'BR3456789',
      boardCertification: 'American Board of Psychiatry and Neurology'
    },
    {
      id: '14',
      name: 'Dr. Kevin Martinez',
      credentials: 'MD',
      specialty: 'Child Psychiatry',
      profession: 'Physician',
      location: 'Albany, NY',
      phone: '(518) 456-7890',
      email: 'kevin.martinez@example.com',
      npi: '1234567903',
      status: 'active',
      managedBy: 'Sarah Johnson',
      licenseNumber: 'N45678',
      licenseState: 'NY',
      deaNumber: 'BK4567890',
      boardCertification: 'American Board of Psychiatry and Neurology'
    },
    // Physicians - Radiology
    {
      id: '15',
      name: 'Dr. Nicole Taylor',
      credentials: 'MD',
      specialty: 'Diagnostic Radiology',
      profession: 'Physician',
      location: 'Chicago, IL',
      phone: '(312) 567-8901',
      email: 'nicole.taylor@example.com',
      npi: '1234567904',
      status: 'active',
      managedBy: 'John Doe',
      licenseNumber: 'O56789',
      licenseState: 'IL',
      boardCertification: 'American Board of Radiology'
    },
    {
      id: '16',
      name: 'Dr. Brian Anderson',
      credentials: 'DO',
      specialty: 'Interventional Radiology',
      profession: 'Physician',
      location: 'Springfield, IL',
      phone: '(217) 678-9012',
      email: 'brian.anderson@example.com',
      npi: '1234567905',
      status: 'active',
      managedBy: 'Sarah Johnson',
      licenseNumber: 'P67890',
      licenseState: 'IL',
      boardCertification: 'American Board of Radiology'
    },
    // Physicians - Anesthesiology
    {
      id: '17',
      name: 'Dr. Michelle White',
      credentials: 'MD',
      specialty: 'Anesthesiology',
      profession: 'Physician',
      location: 'Denver, CO',
      phone: '(303) 789-0123',
      email: 'michelle.white@example.com',
      npi: '1234567906',
      status: 'active',
      managedBy: 'John Doe',
      licenseNumber: 'Q78901',
      licenseState: 'CO',
      deaNumber: 'BM7890123',
      boardCertification: 'American Board of Anesthesiology'
    },
    {
      id: '18',
      name: 'Dr. Daniel Clark',
      credentials: 'MD',
      specialty: 'Pain Management',
      profession: 'Physician',
      location: 'Colorado Springs, CO',
      phone: '(719) 890-1234',
      email: 'daniel.clark@example.com',
      npi: '1234567907',
      status: 'active',
      managedBy: 'Sarah Johnson',
      licenseNumber: 'R89012',
      licenseState: 'CO',
      deaNumber: 'BD8901234',
      boardCertification: 'American Board of Anesthesiology'
    },
    // Physicians - Family Medicine
    {
      id: '19',
      name: 'Dr. Laura Lewis',
      credentials: 'MD',
      specialty: 'Family Medicine',
      profession: 'Physician',
      location: 'Seattle, WA',
      phone: '(206) 901-2345',
      email: 'laura.lewis@example.com',
      npi: '1234567908',
      status: 'active',
      managedBy: 'John Doe',
      licenseNumber: 'S90123',
      licenseState: 'WA',
      deaNumber: 'BL9012345',
      boardCertification: 'American Board of Family Medicine'
    },
    {
      id: '20',
      name: 'Dr. Mark Robinson',
      credentials: 'DO',
      specialty: 'Family Medicine',
      profession: 'Physician',
      location: 'Spokane, WA',
      phone: '(509) 012-3456',
      email: 'mark.robinson@example.com',
      npi: '1234567909',
      status: 'active',
      managedBy: 'Sarah Johnson',
      licenseNumber: 'T01234',
      licenseState: 'WA',
      deaNumber: 'BM0123456',
      boardCertification: 'American Board of Family Medicine'
    },
    // Physicians - Dermatology
    {
      id: '21',
      name: 'Dr. Jessica Walker',
      credentials: 'MD',
      specialty: 'Dermatology',
      profession: 'Physician',
      location: 'Portland, OR',
      phone: '(503) 123-4567',
      email: 'jessica.walker@example.com',
      npi: '1234567910',
      status: 'active',
      managedBy: 'John Doe',
      licenseNumber: 'U12345',
      licenseState: 'OR',
      boardCertification: 'American Board of Dermatology'
    },
    {
      id: '22',
      name: 'Dr. Ryan Hall',
      credentials: 'MD',
      specialty: 'Dermatopathology',
      profession: 'Physician',
      location: 'Eugene, OR',
      phone: '(541) 234-5678',
      email: 'ryan.hall@example.com',
      npi: '1234567911',
      status: 'active',
      managedBy: 'Sarah Johnson',
      licenseNumber: 'V23456',
      licenseState: 'OR',
      boardCertification: 'American Board of Dermatology'
    },
    // Physicians - Ophthalmology
    {
      id: '23',
      name: 'Dr. Stephanie Young',
      credentials: 'MD',
      specialty: 'Ophthalmology',
      profession: 'Physician',
      location: 'Las Vegas, NV',
      phone: '(702) 345-6789',
      email: 'stephanie.young@example.com',
      npi: '1234567912',
      status: 'active',
      managedBy: 'John Doe',
      licenseNumber: 'W34567',
      licenseState: 'NV',
      boardCertification: 'American Board of Ophthalmology'
    },
    {
      id: '24',
      name: 'Dr. Andrew King',
      credentials: 'MD',
      specialty: 'Retinal Surgery',
      profession: 'Physician',
      location: 'Reno, NV',
      phone: '(775) 456-7890',
      email: 'andrew.king@example.com',
      npi: '1234567913',
      status: 'active',
      managedBy: 'Sarah Johnson',
      licenseNumber: 'X45678',
      licenseState: 'NV',
      boardCertification: 'American Board of Ophthalmology'
    },
    // Physicians - Gastroenterology
    {
      id: '25',
      name: 'Dr. Melissa Wright',
      credentials: 'MD',
      specialty: 'Gastroenterology',
      profession: 'Physician',
      location: 'Salt Lake City, UT',
      phone: '(801) 567-8901',
      email: 'melissa.wright@example.com',
      npi: '1234567914',
      status: 'active',
      managedBy: 'John Doe',
      licenseNumber: 'Y56789',
      licenseState: 'UT',
      deaNumber: 'BM5678901',
      boardCertification: 'American Board of Gastroenterology'
    },
    // Nurse Practitioners
    {
      id: '26',
      name: 'Sarah Mitchell, NP',
      credentials: 'MSN, FNP-C',
      specialty: 'Family Practice',
      profession: 'Nurse Practitioner',
      location: 'Nashville, TN',
      phone: '(615) 678-9012',
      email: 'sarah.mitchell@example.com',
      npi: '1234567915',
      status: 'active',
      managedBy: 'John Doe',
      licenseNumber: 'RN123456',
      licenseState: 'TN'
    },
    {
      id: '27',
      name: 'Jennifer Adams, NP',
      credentials: 'MSN, ACNP-BC',
      specialty: 'Acute Care',
      profession: 'Nurse Practitioner',
      location: 'Memphis, TN',
      phone: '(901) 789-0123',
      email: 'jennifer.adams@example.com',
      npi: '1234567916',
      status: 'active',
      managedBy: 'Sarah Johnson',
      licenseNumber: 'RN234567',
      licenseState: 'TN'
    },
    {
      id: '28',
      name: 'Michael Torres, NP',
      credentials: 'MSN, PMHNP-BC',
      specialty: 'Psychiatric Mental Health',
      profession: 'Nurse Practitioner',
      location: 'Louisville, KY',
      phone: '(502) 890-1234',
      email: 'michael.torres@example.com',
      npi: '1234567917',
      status: 'active',
      managedBy: 'John Doe',
      licenseNumber: 'RN345678',
      licenseState: 'KY'
    },
    {
      id: '29',
      name: 'Lisa Campbell, NP',
      credentials: 'MSN, PNP-PC',
      specialty: 'Pediatric Primary Care',
      profession: 'Nurse Practitioner',
      location: 'Lexington, KY',
      phone: '(859) 901-2345',
      email: 'lisa.campbell@example.com',
      npi: '1234567918',
      status: 'active',
      managedBy: 'Sarah Johnson',
      licenseNumber: 'RN456789',
      licenseState: 'KY'
    },
    {
      id: '30',
      name: 'Robert Parker, NP',
      credentials: 'MSN, AGACNP-BC',
      specialty: 'Adult-Gerontology Acute Care',
      profession: 'Nurse Practitioner',
      location: 'Birmingham, AL',
      phone: '(205) 012-3456',
      email: 'robert.parker@example.com',
      npi: '1234567919',
      status: 'active',
      managedBy: 'John Doe',
      licenseNumber: 'RN567890',
      licenseState: 'AL'
    },
    // Physician Assistants
    {
      id: '31',
      name: 'Amanda Evans, PA-C',
      credentials: 'MPAS, PA-C',
      specialty: 'Emergency Medicine',
      profession: 'Physician Assistant',
      location: 'Mobile, AL',
      phone: '(251) 123-4567',
      email: 'amanda.evans@example.com',
      npi: '1234567920',
      status: 'active',
      managedBy: 'Sarah Johnson',
      licenseNumber: 'PA123456',
      licenseState: 'AL'
    },
    {
      id: '32',
      name: 'David Collins, PA-C',
      credentials: 'MMS, PA-C',
      specialty: 'Orthopedic Surgery',
      profession: 'Physician Assistant',
      location: 'Jackson, MS',
      phone: '(601) 234-5678',
      email: 'david.collins@example.com',
      npi: '1234567921',
      status: 'active',
      managedBy: 'John Doe',
      licenseNumber: 'PA234567',
      licenseState: 'MS'
    },
    {
      id: '33',
      name: 'Rachel Stewart, PA-C',
      credentials: 'MPAS, PA-C',
      specialty: 'Cardiology',
      profession: 'Physician Assistant',
      location: 'Little Rock, AR',
      phone: '(501) 345-6789',
      email: 'rachel.stewart@example.com',
      npi: '1234567922',
      status: 'active',
      managedBy: 'Sarah Johnson',
      licenseNumber: 'PA345678',
      licenseState: 'AR'
    },
    {
      id: '34',
      name: 'Christopher Morris, PA-C',
      credentials: 'MMS, PA-C',
      specialty: 'Family Medicine',
      profession: 'Physician Assistant',
      location: 'Oklahoma City, OK',
      phone: '(405) 456-7890',
      email: 'christopher.morris@example.com',
      npi: '1234567923',
      status: 'active',
      managedBy: 'John Doe',
      licenseNumber: 'PA456789',
      licenseState: 'OK'
    },
    {
      id: '35',
      name: 'Michelle Rogers, PA-C',
      credentials: 'MPAS, PA-C',
      specialty: 'Dermatology',
      profession: 'Physician Assistant',
      location: 'Tulsa, OK',
      phone: '(918) 567-8901',
      email: 'michelle.rogers@example.com',
      npi: '1234567924',
      status: 'active',
      managedBy: 'Sarah Johnson',
      licenseNumber: 'PA567890',
      licenseState: 'OK'
    },
    // Pharmacists
    {
      id: '36',
      name: 'Dr. James Reed, PharmD',
      credentials: 'PharmD, RPh',
      specialty: 'Clinical Pharmacy',
      profession: 'Pharmacist',
      location: 'Kansas City, MO',
      phone: '(816) 678-9012',
      email: 'james.reed@example.com',
      npi: '1234567925',
      status: 'active',
      managedBy: 'John Doe',
      licenseNumber: 'RPH123456',
      licenseState: 'MO'
    },
    {
      id: '37',
      name: 'Dr. Patricia Cook, PharmD',
      credentials: 'PharmD, RPh, BCPS',
      specialty: 'Pharmacotherapy',
      profession: 'Pharmacist',
      location: 'St. Louis, MO',
      phone: '(314) 789-0123',
      email: 'patricia.cook@example.com',
      npi: '1234567926',
      status: 'active',
      managedBy: 'Sarah Johnson',
      licenseNumber: 'RPH234567',
      licenseState: 'MO'
    },
    {
      id: '38',
      name: 'Dr. Steven Bailey, PharmD',
      credentials: 'PharmD, RPh, BCOP',
      specialty: 'Oncology Pharmacy',
      profession: 'Pharmacist',
      location: 'Des Moines, IA',
      phone: '(515) 890-1234',
      email: 'steven.bailey@example.com',
      npi: '1234567927',
      status: 'active',
      managedBy: 'John Doe',
      licenseNumber: 'RPH345678',
      licenseState: 'IA'
    },
    {
      id: '39',
      name: 'Dr. Karen Rivera, PharmD',
      credentials: 'PharmD, RPh, BCACP',
      specialty: 'Ambulatory Care Pharmacy',
      profession: 'Pharmacist',
      location: 'Cedar Rapids, IA',
      phone: '(319) 901-2345',
      email: 'karen.rivera@example.com',
      npi: '1234567928',
      status: 'active',
      managedBy: 'Sarah Johnson',
      licenseNumber: 'RPH456789',
      licenseState: 'IA'
    },
    // Physical Therapists
    {
      id: '40',
      name: 'Dr. Thomas Cooper, PT',
      credentials: 'DPT',
      specialty: 'Orthopedic Physical Therapy',
      profession: 'Physical Therapist',
      location: 'Omaha, NE',
      phone: '(402) 012-3456',
      email: 'thomas.cooper@example.com',
      npi: '1234567929',
      status: 'active',
      managedBy: 'John Doe',
      licenseNumber: 'PT123456',
      licenseState: 'NE'
    },
    {
      id: '41',
      name: 'Dr. Angela Richardson, PT',
      credentials: 'DPT, OCS',
      specialty: 'Sports Physical Therapy',
      profession: 'Physical Therapist',
      location: 'Lincoln, NE',
      phone: '(402) 123-4567',
      email: 'angela.richardson@example.com',
      npi: '1234567930',
      status: 'active',
      managedBy: 'Sarah Johnson',
      licenseNumber: 'PT234567',
      licenseState: 'NE'
    },
    {
      id: '42',
      name: 'Dr. Matthew Cox, PT',
      credentials: 'DPT, NCS',
      specialty: 'Neurologic Physical Therapy',
      profession: 'Physical Therapist',
      location: 'Topeka, KS',
      phone: '(785) 234-5678',
      email: 'matthew.cox@example.com',
      npi: '1234567931',
      status: 'active',
      managedBy: 'John Doe',
      licenseNumber: 'PT345678',
      licenseState: 'KS'
    },
    {
      id: '43',
      name: 'Dr. Kimberly Ward, PT',
      credentials: 'DPT, GCS',
      specialty: 'Geriatric Physical Therapy',
      profession: 'Physical Therapist',
      location: 'Wichita, KS',
      phone: '(316) 345-6789',
      email: 'kimberly.ward@example.com',
      npi: '1234567932',
      status: 'active',
      managedBy: 'Sarah Johnson',
      licenseNumber: 'PT456789',
      licenseState: 'KS'
    },
    // Occupational Therapists
    {
      id: '44',
      name: 'Dr. Jennifer Torres, OTR/L',
      credentials: 'OTD, OTR/L',
      specialty: 'Pediatric Occupational Therapy',
      profession: 'Occupational Therapist',
      location: 'Fargo, ND',
      phone: '(701) 456-7890',
      email: 'jennifer.torres@example.com',
      npi: '1234567933',
      status: 'active',
      managedBy: 'John Doe',
      licenseNumber: 'OT123456',
      licenseState: 'ND'
    },
    {
      id: '45',
      name: 'Dr. Daniel Peterson, OTR/L',
      credentials: 'OTD, OTR/L, CHT',
      specialty: 'Hand Therapy',
      profession: 'Occupational Therapist',
      location: 'Bismarck, ND',
      phone: '(701) 567-8901',
      email: 'daniel.peterson@example.com',
      npi: '1234567934',
      status: 'active',
      managedBy: 'Sarah Johnson',
      licenseNumber: 'OT234567',
      licenseState: 'ND'
    },
    {
      id: '46',
      name: 'Dr. Lisa Gray, OTR/L',
      credentials: 'MS, OTR/L',
      specialty: 'Mental Health Occupational Therapy',
      profession: 'Occupational Therapist',
      location: 'Sioux Falls, SD',
      phone: '(605) 678-9012',
      email: 'lisa.gray@example.com',
      npi: '1234567935',
      status: 'active',
      managedBy: 'John Doe',
      licenseNumber: 'OT345678',
      licenseState: 'SD'
    },
    // Speech-Language Pathologists
    {
      id: '47',
      name: 'Dr. Rebecca James, SLP',
      credentials: 'PhD, CCC-SLP',
      specialty: 'Pediatric Speech Therapy',
      profession: 'Speech-Language Pathologist',
      location: 'Rapid City, SD',
      phone: '(605) 789-0123',
      email: 'rebecca.james@example.com',
      npi: '1234567936',
      status: 'active',
      managedBy: 'Sarah Johnson',
      licenseNumber: 'SLP123456',
      licenseState: 'SD'
    },
    {
      id: '48',
      name: 'Dr. Kevin Watson, SLP',
      credentials: 'MS, CCC-SLP',
      specialty: 'Adult Speech Therapy',
      profession: 'Speech-Language Pathologist',
      location: 'Billings, MT',
      phone: '(406) 890-1234',
      email: 'kevin.watson@example.com',
      npi: '1234567937',
      status: 'active',
      managedBy: 'John Doe',
      licenseNumber: 'SLP234567',
      licenseState: 'MT'
    },
    {
      id: '49',
      name: 'Dr. Stephanie Brooks, SLP',
      credentials: 'MS, CCC-SLP, BCS-S',
      specialty: 'Swallowing Disorders',
      profession: 'Speech-Language Pathologist',
      location: 'Missoula, MT',
      phone: '(406) 901-2345',
      email: 'stephanie.brooks@example.com',
      npi: '1234567938',
      status: 'active',
      managedBy: 'Sarah Johnson',
      licenseNumber: 'SLP345678',
      licenseState: 'MT'
    },
    // Registered Nurses
    {
      id: '50',
      name: 'Jennifer Kelly, RN',
      credentials: 'BSN, RN',
      specialty: 'Medical-Surgical Nursing',
      profession: 'Registered Nurse',
      location: 'Boise, ID',
      phone: '(208) 012-3456',
      email: 'jennifer.kelly@example.com',
      npi: '1234567939',
      status: 'active',
      managedBy: 'John Doe',
      licenseNumber: 'RN678901',
      licenseState: 'ID'
    },
    {
      id: '51',
      name: 'Michael Sanders, RN',
      credentials: 'BSN, RN, CCRN',
      specialty: 'Critical Care Nursing',
      profession: 'Registered Nurse',
      location: 'Pocatello, ID',
      phone: '(208) 123-4567',
      email: 'michael.sanders@example.com',
      npi: '1234567940',
      status: 'active',
      managedBy: 'Sarah Johnson',
      licenseNumber: 'RN789012',
      licenseState: 'ID'
    },
    {
      id: '52',
      name: 'Sarah Price, RN',
      credentials: 'MSN, RN, CNL',
      specialty: 'Clinical Nurse Leader',
      profession: 'Registered Nurse',
      location: 'Cheyenne, WY',
      phone: '(307) 234-5678',
      email: 'sarah.price@example.com',
      npi: '1234567941',
      status: 'active',
      managedBy: 'John Doe',
      licenseNumber: 'RN890123',
      licenseState: 'WY'
    },
    {
      id: '53',
      name: 'Robert Bennett, RN',
      credentials: 'BSN, RN, CEN',
      specialty: 'Emergency Nursing',
      profession: 'Registered Nurse',
      location: 'Casper, WY',
      phone: '(307) 345-6789',
      email: 'robert.bennett@example.com',
      npi: '1234567942',
      status: 'active',
      managedBy: 'Sarah Johnson',
      licenseNumber: 'RN901234',
      licenseState: 'WY'
    },
    // Respiratory Therapists
    {
      id: '54',
      name: 'Amanda Wood, RRT',
      credentials: 'BS, RRT',
      specialty: 'Adult Critical Care',
      profession: 'Respiratory Therapist',
      location: 'Albuquerque, NM',
      phone: '(505) 456-7890',
      email: 'amanda.wood@example.com',
      npi: '1234567943',
      status: 'active',
      managedBy: 'John Doe',
      licenseNumber: 'RT123456',
      licenseState: 'NM'
    },
    {
      id: '55',
      name: 'Christopher Barnes, RRT',
      credentials: 'AS, RRT, CPFT',
      specialty: 'Pulmonary Function Testing',
      profession: 'Respiratory Therapist',
      location: 'Santa Fe, NM',
      phone: '(505) 567-8901',
      email: 'christopher.barnes@example.com',
      npi: '1234567944',
      status: 'active',
      managedBy: 'Sarah Johnson',
      licenseNumber: 'RT234567',
      licenseState: 'NM'
    },
    // Radiologic Technologists
    {
      id: '56',
      name: 'Michelle Ross, RT(R)',
      credentials: 'AS, RT(R)',
      specialty: 'Diagnostic Radiography',
      profession: 'Radiologic Technologist',
      location: 'Phoenix, AZ',
      phone: '(602) 678-9012',
      email: 'michelle.ross@example.com',
      npi: '1234567945',
      status: 'active',
      managedBy: 'John Doe',
      licenseNumber: 'RT345678',
      licenseState: 'AZ'
    },
    {
      id: '57',
      name: 'Daniel Henderson, RT(R)(CT)',
      credentials: 'BS, RT(R)(CT)',
      specialty: 'Computed Tomography',
      profession: 'Radiologic Technologist',
      location: 'Tucson, AZ',
      phone: '(520) 789-0123',
      email: 'daniel.henderson@example.com',
      npi: '1234567946',
      status: 'active',
      managedBy: 'Sarah Johnson',
      licenseNumber: 'RT456789',
      licenseState: 'AZ'
    },
    // Medical Laboratory Scientists
    {
      id: '58',
      name: 'Dr. Laura Coleman, MLS',
      credentials: 'MS, MLS(ASCP)',
      specialty: 'Clinical Chemistry',
      profession: 'Medical Laboratory Scientist',
      location: 'Las Vegas, NV',
      phone: '(702) 890-1234',
      email: 'laura.coleman@example.com',
      npi: '1234567947',
      status: 'active',
      managedBy: 'John Doe',
      licenseNumber: 'MLS123456',
      licenseState: 'NV'
    },
    {
      id: '59',
      name: 'Dr. Ryan Jenkins, MLS',
      credentials: 'BS, MLS(ASCP), MB',
      specialty: 'Microbiology',
      profession: 'Medical Laboratory Scientist',
      location: 'Reno, NV',
      phone: '(775) 901-2345',
      email: 'ryan.jenkins@example.com',
      npi: '1234567948',
      status: 'active',
      managedBy: 'Sarah Johnson',
      licenseNumber: 'MLS234567',
      licenseState: 'NV'
    },
    // Dietitians
    {
      id: '60',
      name: 'Dr. Nicole Perry, RD',
      credentials: 'MS, RD, CDE',
      specialty: 'Diabetes Education',
      profession: 'Registered Dietitian',
      location: 'Salt Lake City, UT',
      phone: '(801) 012-3456',
      email: 'nicole.perry@example.com',
      npi: '1234567949',
      status: 'active',
      managedBy: 'John Doe',
      licenseNumber: 'RD123456',
      licenseState: 'UT'
    },
    {
      id: '61',
      name: 'Dr. Andrew Powell, RD',
      credentials: 'MS, RD, CNSC',
      specialty: 'Clinical Nutrition',
      profession: 'Registered Dietitian',
      location: 'Provo, UT',
      phone: '(801) 123-4567',
      email: 'andrew.powell@example.com',
      npi: '1234567950',
      status: 'active',
      managedBy: 'Sarah Johnson',
      licenseNumber: 'RD234567',
      licenseState: 'UT'
    },
    // Social Workers
    {
      id: '62',
      name: 'Dr. Melissa Long, LCSW',
      credentials: 'MSW, LCSW',
      specialty: 'Clinical Social Work',
      profession: 'Licensed Clinical Social Worker',
      location: 'Denver, CO',
      phone: '(303) 234-5678',
      email: 'melissa.long@example.com',
      npi: '1234567951',
      status: 'active',
      managedBy: 'John Doe',
      licenseNumber: 'LCSW123456',
      licenseState: 'CO'
    },
    {
      id: '63',
      name: 'Dr. Brian Hughes, LCSW',
      credentials: 'MSW, LCSW, ACSW',
      specialty: 'Medical Social Work',
      profession: 'Licensed Clinical Social Worker',
      location: 'Colorado Springs, CO',
      phone: '(719) 345-6789',
      email: 'brian.hughes@example.com',
      npi: '1234567952',
      status: 'active',
      managedBy: 'Sarah Johnson',
      licenseNumber: 'LCSW234567',
      licenseState: 'CO'
    },
    // Psychologists
    {
      id: '64',
      name: 'Dr. Jennifer Flores, PhD',
      credentials: 'PhD, Licensed Psychologist',
      specialty: 'Clinical Psychology',
      profession: 'Psychologist',
      location: 'Portland, OR',
      phone: '(503) 456-7890',
      email: 'jennifer.flores@example.com',
      npi: '1234567953',
      status: 'active',
      managedBy: 'John Doe',
      licenseNumber: 'PSY123456',
      licenseState: 'OR'
    },
    {
      id: '65',
      name: 'Dr. David Washington, PsyD',
      credentials: 'PsyD, Licensed Psychologist',
      specialty: 'Neuropsychology',
      profession: 'Psychologist',
      location: 'Eugene, OR',
      phone: '(541) 567-8901',
      email: 'david.washington@example.com',
      npi: '1234567954',
      status: 'active',
      managedBy: 'Sarah Johnson',
      licenseNumber: 'PSY234567',
      licenseState: 'OR'
    },
    // Additional Physicians - Specialties
    {
      id: '66',
      name: 'Dr. Rachel Butler, MD',
      credentials: 'MD',
      specialty: 'Endocrinology',
      profession: 'Physician',
      location: 'Seattle, WA',
      phone: '(206) 678-9012',
      email: 'rachel.butler@example.com',
      npi: '1234567955',
      status: 'active',
      managedBy: 'John Doe',
      licenseNumber: 'Z67890',
      licenseState: 'WA',
      deaNumber: 'BR6789012',
      boardCertification: 'American Board of Endocrinology'
    },
    {
      id: '67',
      name: 'Dr. Kevin Simmons, DO',
      credentials: 'DO',
      specialty: 'Pulmonology',
      profession: 'Physician',
      location: 'Spokane, WA',
      phone: '(509) 789-0123',
      email: 'kevin.simmons@example.com',
      npi: '1234567956',
      status: 'active',
      managedBy: 'Sarah Johnson',
      licenseNumber: 'AA78901',
      licenseState: 'WA',
      deaNumber: 'BK7890123',
      boardCertification: 'American Board of Pulmonary Disease'
    },
    {
      id: '68',
      name: 'Dr. Stephanie Foster, MD',
      credentials: 'MD',
      specialty: 'Nephrology',
      profession: 'Physician',
      location: 'Portland, OR',
      phone: '(503) 890-1234',
      email: 'stephanie.foster@example.com',
      npi: '1234567957',
      status: 'active',
      managedBy: 'John Doe',
      licenseNumber: 'BB89012',
      licenseState: 'OR',
      deaNumber: 'BS8901234',
      boardCertification: 'American Board of Nephrology'
    },
    {
      id: '69',
      name: 'Dr. Andrew Gonzales, MD',
      credentials: 'MD',
      specialty: 'Rheumatology',
      profession: 'Physician',
      location: 'Eugene, OR',
      phone: '(541) 901-2345',
      email: 'andrew.gonzales@example.com',
      npi: '1234567958',
      status: 'active',
      managedBy: 'Sarah Johnson',
      licenseNumber: 'CC90123',
      licenseState: 'OR',
      deaNumber: 'BA9012345',
      boardCertification: 'American Board of Rheumatology'
    },
    {
      id: '70',
      name: 'Dr. Michelle Bryant, MD',
      credentials: 'MD',
      specialty: 'Hematology/Oncology',
      profession: 'Physician',
      location: 'Las Vegas, NV',
      phone: '(702) 012-3456',
      email: 'michelle.bryant@example.com',
      npi: '1234567959',
      status: 'active',
      managedBy: 'John Doe',
      licenseNumber: 'DD01234',
      licenseState: 'NV',
      deaNumber: 'BM0123456',
      boardCertification: 'American Board of Hematology'
    },
    {
      id: '71',
      name: 'Dr. Daniel Alexander, DO',
      credentials: 'DO',
      specialty: 'Infectious Disease',
      profession: 'Physician',
      location: 'Reno, NV',
      phone: '(775) 123-4567',
      email: 'daniel.alexander@example.com',
      npi: '1234567960',
      status: 'active',
      managedBy: 'Sarah Johnson',
      licenseNumber: 'EE12345',
      licenseState: 'NV',
      deaNumber: 'BD1234567',
      boardCertification: 'American Board of Infectious Disease'
    },
    {
      id: '72',
      name: 'Dr. Laura Griffin, MD',
      credentials: 'MD',
      specialty: 'Allergy and Immunology',
      profession: 'Physician',
      location: 'Salt Lake City, UT',
      phone: '(801) 234-5678',
      email: 'laura.griffin@example.com',
      npi: '1234567961',
      status: 'active',
      managedBy: 'John Doe',
      licenseNumber: 'FF23456',
      licenseState: 'UT',
      deaNumber: 'BL2345678',
      boardCertification: 'American Board of Allergy and Immunology'
    },
    {
      id: '73',
      name: 'Dr. Ryan Diaz, MD',
      credentials: 'MD',
      specialty: 'Plastic Surgery',
      profession: 'Physician',
      location: 'Provo, UT',
      phone: '(801) 345-6789',
      email: 'ryan.diaz@example.com',
      npi: '1234567962',
      status: 'active',
      managedBy: 'Sarah Johnson',
      licenseNumber: 'GG34567',
      licenseState: 'UT',
      deaNumber: 'BR3456789',
      boardCertification: 'American Board of Plastic Surgery'
    },
    {
      id: '74',
      name: 'Dr. Jessica Hayes, MD',
      credentials: 'MD',
      specialty: 'Pathology',
      profession: 'Physician',
      location: 'Denver, CO',
      phone: '(303) 456-7890',
      email: 'jessica.hayes@example.com',
      npi: '1234567963',
      status: 'active',
      managedBy: 'John Doe',
      licenseNumber: 'HH45678',
      licenseState: 'CO',
      boardCertification: 'American Board of Pathology'
    },
    {
      id: '75',
      name: 'Dr. Christopher Myers, DO',
      credentials: 'DO',
      specialty: 'Urology',
      profession: 'Physician',
      location: 'Colorado Springs, CO',
      phone: '(719) 567-8901',
      email: 'christopher.myers@example.com',
      npi: '1234567964',
      status: 'active',
      managedBy: 'Sarah Johnson',
      licenseNumber: 'II56789',
      licenseState: 'CO',
      deaNumber: 'BC5678901',
      boardCertification: 'American Board of Urology'
    },
    // Additional Nurse Practitioners
    {
      id: '76',
      name: 'Amanda Ford, NP',
      credentials: 'MSN, WHNP-BC',
      specialty: 'Women\'s Health',
      profession: 'Nurse Practitioner',
      location: 'Albuquerque, NM',
      phone: '(505) 678-9012',
      email: 'amanda.ford@example.com',
      npi: '1234567965',
      status: 'active',
      managedBy: 'John Doe',
      licenseNumber: 'RN012345',
      licenseState: 'NM'
    },
    {
      id: '77',
      name: 'David Hamilton, NP',
      credentials: 'MSN, AGNP-C',
      specialty: 'Adult-Gerontology Primary Care',
      profession: 'Nurse Practitioner',
      location: 'Santa Fe, NM',
      phone: '(505) 789-0123',
      email: 'david.hamilton@example.com',
      npi: '1234567966',
      status: 'active',
      managedBy: 'Sarah Johnson',
      licenseNumber: 'RN123450',
      licenseState: 'NM'
    },
    // Additional Physician Assistants
    {
      id: '78',
      name: 'Rachel Graham, PA-C',
      credentials: 'MPAS, PA-C',
      specialty: 'Neurology',
      profession: 'Physician Assistant',
      location: 'Phoenix, AZ',
      phone: '(602) 890-1234',
      email: 'rachel.graham@example.com',
      npi: '1234567967',
      status: 'active',
      managedBy: 'John Doe',
      licenseNumber: 'PA678901',
      licenseState: 'AZ'
    },
    {
      id: '79',
      name: 'Christopher Sullivan, PA-C',
      credentials: 'MMS, PA-C',
      specialty: 'Gastroenterology',
      profession: 'Physician Assistant',
      location: 'Tucson, AZ',
      phone: '(520) 901-2345',
      email: 'christopher.sullivan@example.com',
      npi: '1234567968',
      status: 'active',
      managedBy: 'Sarah Johnson',
      licenseNumber: 'PA789012',
      licenseState: 'AZ'
    },
    // Additional Pharmacists
    {
      id: '80',
      name: 'Dr. Michelle Russell, PharmD',
      credentials: 'PharmD, RPh, BCPS',
      specialty: 'Critical Care Pharmacy',
      profession: 'Pharmacist',
      location: 'Boise, ID',
      phone: '(208) 012-3456',
      email: 'michelle.russell@example.com',
      npi: '1234567969',
      status: 'active',
      managedBy: 'John Doe',
      licenseNumber: 'RPH678901',
      licenseState: 'ID'
    },
    {
      id: '81',
      name: 'Dr. Daniel Hunter, PharmD',
      credentials: 'PharmD, RPh, BCACP',
      specialty: 'Geriatric Pharmacy',
      profession: 'Pharmacist',
      location: 'Pocatello, ID',
      phone: '(208) 123-4567',
      email: 'daniel.hunter@example.com',
      npi: '1234567970',
      status: 'active',
      managedBy: 'Sarah Johnson',
      licenseNumber: 'RPH789012',
      licenseState: 'ID'
    },
    // Additional Physical Therapists
    {
      id: '82',
      name: 'Dr. Laura Holt, PT',
      credentials: 'DPT, WCS',
      specialty: 'Women\'s Health Physical Therapy',
      profession: 'Physical Therapist',
      location: 'Cheyenne, WY',
      phone: '(307) 234-5678',
      email: 'laura.holt@example.com',
      npi: '1234567971',
      status: 'active',
      managedBy: 'John Doe',
      licenseNumber: 'PT567890',
      licenseState: 'WY'
    },
    {
      id: '83',
      name: 'Dr. Ryan Jordan, PT',
      credentials: 'DPT, SCS',
      specialty: 'Sports Physical Therapy',
      profession: 'Physical Therapist',
      location: 'Casper, WY',
      phone: '(307) 345-6789',
      email: 'ryan.jordan@example.com',
      npi: '1234567972',
      status: 'active',
      managedBy: 'Sarah Johnson',
      licenseNumber: 'PT678901',
      licenseState: 'WY'
    },
    // Additional Occupational Therapists
    {
      id: '84',
      name: 'Dr. Jessica Reynolds, OTR/L',
      credentials: 'OTD, OTR/L',
      specialty: 'Stroke Rehabilitation',
      profession: 'Occupational Therapist',
      location: 'Fargo, ND',
      phone: '(701) 456-7890',
      email: 'jessica.reynolds@example.com',
      npi: '1234567973',
      status: 'active',
      managedBy: 'John Doe',
      licenseNumber: 'OT567890',
      licenseState: 'ND'
    },
    {
      id: '85',
      name: 'Dr. Kevin Fisher, OTR/L',
      credentials: 'MS, OTR/L, CDRS',
      specialty: 'Driver Rehabilitation',
      profession: 'Occupational Therapist',
      location: 'Bismarck, ND',
      phone: '(701) 567-8901',
      email: 'kevin.fisher@example.com',
      npi: '1234567974',
      status: 'active',
      managedBy: 'Sarah Johnson',
      licenseNumber: 'OT678901',
      licenseState: 'ND'
    },
    // Additional Speech-Language Pathologists
    {
      id: '86',
      name: 'Dr. Amanda Ellis, SLP',
      credentials: 'MS, CCC-SLP',
      specialty: 'Voice Disorders',
      profession: 'Speech-Language Pathologist',
      location: 'Sioux Falls, SD',
      phone: '(605) 678-9012',
      email: 'amanda.ellis@example.com',
      npi: '1234567975',
      status: 'active',
      managedBy: 'John Doe',
      licenseNumber: 'SLP456789',
      licenseState: 'SD'
    },
    {
      id: '87',
      name: 'Dr. Christopher Gibson, SLP',
      credentials: 'PhD, CCC-SLP',
      specialty: 'Fluency Disorders',
      profession: 'Speech-Language Pathologist',
      location: 'Rapid City, SD',
      phone: '(605) 789-0123',
      email: 'christopher.gibson@example.com',
      npi: '1234567976',
      status: 'active',
      managedBy: 'Sarah Johnson',
      licenseNumber: 'SLP567890',
      licenseState: 'SD'
    },
    // Additional Registered Nurses
    {
      id: '88',
      name: 'Michelle Knight, RN',
      credentials: 'BSN, RN, OCN',
      specialty: 'Oncology Nursing',
      profession: 'Registered Nurse',
      location: 'Billings, MT',
      phone: '(406) 890-1234',
      email: 'michelle.knight@example.com',
      npi: '1234567977',
      status: 'active',
      managedBy: 'John Doe',
      licenseNumber: 'RN012345',
      licenseState: 'MT'
    },
    {
      id: '89',
      name: 'Daniel Stone, RN',
      credentials: 'MSN, RN, CMSRN',
      specialty: 'Medical-Surgical Nursing',
      profession: 'Registered Nurse',
      location: 'Missoula, MT',
      phone: '(406) 901-2345',
      email: 'daniel.stone@example.com',
      npi: '1234567978',
      status: 'active',
      managedBy: 'Sarah Johnson',
      licenseNumber: 'RN123456',
      licenseState: 'MT'
    },
    // Additional Respiratory Therapists
    {
      id: '90',
      name: 'Laura Palmer, RRT',
      credentials: 'BS, RRT, NPS',
      specialty: 'Neonatal/Pediatric Respiratory Care',
      profession: 'Respiratory Therapist',
      location: 'Omaha, NE',
      phone: '(402) 012-3456',
      email: 'laura.palmer@example.com',
      npi: '1234567979',
      status: 'active',
      managedBy: 'John Doe',
      licenseNumber: 'RT567890',
      licenseState: 'NE'
    },
    {
      id: '91',
      name: 'Ryan Webb, RRT',
      credentials: 'AS, RRT, RPFT',
      specialty: 'Pulmonary Rehabilitation',
      profession: 'Respiratory Therapist',
      location: 'Lincoln, NE',
      phone: '(402) 123-4567',
      email: 'ryan.webb@example.com',
      npi: '1234567980',
      status: 'active',
      managedBy: 'Sarah Johnson',
      licenseNumber: 'RT678901',
      licenseState: 'NE'
    },
    // Additional Radiologic Technologists
    {
      id: '92',
      name: 'Jessica Tucker, RT(R)(M)',
      credentials: 'AS, RT(R)(M)',
      specialty: 'Mammography',
      profession: 'Radiologic Technologist',
      location: 'Topeka, KS',
      phone: '(785) 234-5678',
      email: 'jessica.tucker@example.com',
      npi: '1234567981',
      status: 'active',
      managedBy: 'John Doe',
      licenseNumber: 'RT789012',
      licenseState: 'KS'
    },
    {
      id: '93',
      name: 'Kevin Crawford, RT(R)(MR)',
      credentials: 'BS, RT(R)(MR)',
      specialty: 'Magnetic Resonance Imaging',
      profession: 'Radiologic Technologist',
      location: 'Wichita, KS',
      phone: '(316) 345-6789',
      email: 'kevin.crawford@example.com',
      npi: '1234567982',
      status: 'active',
      managedBy: 'Sarah Johnson',
      licenseNumber: 'RT890123',
      licenseState: 'KS'
    },
    // Additional Medical Laboratory Scientists
    {
      id: '94',
      name: 'Dr. Amanda Warren, MLS',
      credentials: 'MS, MLS(ASCP), H',
      specialty: 'Hematology',
      profession: 'Medical Laboratory Scientist',
      location: 'Nashville, TN',
      phone: '(615) 456-7890',
      email: 'amanda.warren@example.com',
      npi: '1234567983',
      status: 'active',
      managedBy: 'John Doe',
      licenseNumber: 'MLS345678',
      licenseState: 'TN'
    },
    {
      id: '95',
      name: 'Dr. Christopher Hart, MLS',
      credentials: 'BS, MLS(ASCP), BB',
      specialty: 'Blood Banking',
      profession: 'Medical Laboratory Scientist',
      location: 'Memphis, TN',
      phone: '(901) 567-8901',
      email: 'christopher.hart@example.com',
      npi: '1234567984',
      status: 'active',
      managedBy: 'Sarah Johnson',
      licenseNumber: 'MLS456789',
      licenseState: 'TN'
    },
    // Additional Dietitians
    {
      id: '96',
      name: 'Dr. Michelle Bell, RD',
      credentials: 'MS, RD, CSP',
      specialty: 'Pediatric Nutrition',
      profession: 'Registered Dietitian',
      location: 'Louisville, KY',
      phone: '(502) 678-9012',
      email: 'michelle.bell@example.com',
      npi: '1234567985',
      status: 'active',
      managedBy: 'John Doe',
      licenseNumber: 'RD345678',
      licenseState: 'KY'
    },
    {
      id: '97',
      name: 'Dr. Daniel West, RD',
      credentials: 'MS, RD, CSSD',
      specialty: 'Sports Nutrition',
      profession: 'Registered Dietitian',
      location: 'Lexington, KY',
      phone: '(859) 789-0123',
      email: 'daniel.west@example.com',
      npi: '1234567986',
      status: 'active',
      managedBy: 'Sarah Johnson',
      licenseNumber: 'RD456789',
      licenseState: 'KY'
    },
    // Additional Social Workers
    {
      id: '98',
      name: 'Dr. Laura Marshall, LCSW',
      credentials: 'MSW, LCSW',
      specialty: 'Pediatric Social Work',
      profession: 'Licensed Clinical Social Worker',
      location: 'Birmingham, AL',
      phone: '(205) 890-1234',
      email: 'laura.marshall@example.com',
      npi: '1234567987',
      status: 'active',
      managedBy: 'John Doe',
      licenseNumber: 'LCSW345678',
      licenseState: 'AL'
    },
    {
      id: '99',
      name: 'Dr. Ryan Cooper, LCSW',
      credentials: 'MSW, LCSW, ACSW',
      specialty: 'Geriatric Social Work',
      profession: 'Licensed Clinical Social Worker',
      location: 'Mobile, AL',
      phone: '(251) 901-2345',
      email: 'ryan.cooper@example.com',
      npi: '1234567988',
      status: 'active',
      managedBy: 'Sarah Johnson',
      licenseNumber: 'LCSW456789',
      licenseState: 'AL'
    },
    // Final Psychologist
    {
      id: '100',
      name: 'Dr. Jessica Reed, PhD',
      credentials: 'PhD, Licensed Psychologist',
      specialty: 'Child Psychology',
      profession: 'Psychologist',
      location: 'Jackson, MS',
      phone: '(601) 012-3456',
      email: 'jessica.reed@example.com',
      npi: '1234567989',
      status: 'active',
      managedBy: 'John Doe',
      licenseNumber: 'PSY345678',
      licenseState: 'MS'
    }
  ];

  const handleSearch = async () => {
    setIsSearching(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Filter mock results based on search query
    let filtered = mockResults;
    
    if (searchQuery) {
      filtered = filtered.filter(provider =>
        provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.npi.includes(searchQuery)
      );
    }
    
    if (filters.specialty) {
      filtered = filtered.filter(provider =>
        provider.specialty.toLowerCase().includes(filters.specialty.toLowerCase())
      );
    }
    
    if (filters.state) {
      filtered = filtered.filter(provider =>
        provider.location.includes(filters.state)
      );
    }
    
    if (filters.status) {
      filtered = filtered.filter(provider => provider.status === filters.status);
    }
    
    if (filters.profession) {
      filtered = filtered.filter(provider =>
        provider.profession.toLowerCase().includes(filters.profession.toLowerCase())
      );
    }
    
    setResults(filtered);
    setIsSearching(false);
  };

  const handleSort = (field: 'name' | 'specialty' | 'location' | 'status') => {
    const newOrder = sortBy === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortBy(field);
    setSortOrder(newOrder);
    
    const sorted = [...results].sort((a, b) => {
      let aValue = '';
      let bValue = '';
      
      switch (field) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'specialty':
          aValue = a.specialty.toLowerCase();
          bValue = b.specialty.toLowerCase();
          break;
        case 'location':
          aValue = a.location.toLowerCase();
          bValue = b.location.toLowerCase();
          break;
        case 'status':
          aValue = a.status.toLowerCase();
          bValue = b.status.toLowerCase();
          break;
      }
      
      if (newOrder === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });
    
    setResults(sorted);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSelectProvider = (providerId: string) => {
    const newSelected = new Set(selectedProviders);
    if (newSelected.has(providerId)) {
      newSelected.delete(providerId);
    } else {
      newSelected.add(providerId);
    }
    setSelectedProviders(newSelected);
    setShowBulkActions(newSelected.size > 0);
  };

  const handleSelectAll = () => {
    if (selectedProviders.size === results.length) {
      setSelectedProviders(new Set());
      setShowBulkActions(false);
    } else {
      setSelectedProviders(new Set(results.map(p => p.id)));
      setShowBulkActions(true);
    }
  };

  const handleBulkAction = (action: 'save' | 'pdf' | 'csv') => {
    const selectedData = results.filter(p => selectedProviders.has(p.id));
    
    switch (action) {
      case 'save':
        console.log('Saving to list:', selectedData);
        alert(`Saved ${selectedData.length} providers to list`);
        break;
      case 'pdf':
        console.log('Exporting to PDF:', selectedData);
        alert(`Exporting ${selectedData.length} providers to PDF`);
        break;
      case 'csv':
        console.log('Exporting to CSV:', selectedData);
        // Create CSV content
        const csvContent = [
          'Name,Credentials,Specialty,Location,Phone,Email,NPI,Status',
          ...selectedData.map(p => 
            `"${p.name}","${p.credentials}","${p.specialty}","${p.location}","${p.phone}","${p.email}","${p.npi}","${p.status}"`
          )
        ].join('\n');
        
        // Download CSV
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `providers_export_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        break;
    }
  };
  return (
    <Layout breadcrumbs={[{ label: 'HCP Search' }]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Search Healthcare Providers</h1>
          <p className="text-gray-600">
            Find and manage healthcare provider records in the system.
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name, specialty, or NPI..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </button>
              <button
                onClick={handleSearch}
                disabled={isSearching}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <SearchIcon className="h-4 w-4" />
                <span>{isSearching ? 'Searching...' : 'Search'}</span>
              </button>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Specialty
                  </label>
                  <select
                    value={filters.specialty}
                    onChange={(e) => handleFilterChange('specialty', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Specialties</option>
                    <option value="Internal Medicine">Internal Medicine</option>
                    <option value="Emergency Medicine">Emergency Medicine</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Family Medicine">Family Medicine</option>
                    <option value="Cardiology">Cardiology</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <select
                    value={filters.state}
                    onChange={(e) => handleFilterChange('state', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All States</option>
                    <option value="CA">California</option>
                    <option value="NY">New York</option>
                    <option value="TX">Texas</option>
                    <option value="FL">Florida</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Profession
                  </label>
                  <select
                    value={filters.profession}
                    onChange={(e) => handleFilterChange('profession', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Professions</option>
                    <option value="Physician">Physician</option>
                    <option value="Nurse Practitioner">Nurse Practitioner</option>
                    <option value="Physician Assistant">Physician Assistant</option>
                    <option value="Pharmacist">Pharmacist</option>
                    <option value="Physical Therapist">Physical Therapist</option>
                    <option value="Occupational Therapist">Occupational Therapist</option>
                    <option value="Speech-Language Pathologist">Speech-Language Pathologist</option>
                    <option value="Registered Nurse">Registered Nurse</option>
                    <option value="Respiratory Therapist">Respiratory Therapist</option>
                    <option value="Radiologic Technologist">Radiologic Technologist</option>
                    <option value="Medical Laboratory Scientist">Medical Laboratory Scientist</option>
                    <option value="Registered Dietitian">Registered Dietitian</option>
                    <option value="Licensed Clinical Social Worker">Licensed Clinical Social Worker</option>
                    <option value="Psychologist">Psychologist</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Search Results ({results.length})
                  </h2>
                  {selectedProviders.size > 0 && (
                    <span className="text-sm text-blue-600 font-medium">
                      {selectedProviders.size} selected
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">Sort by:</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleSort('name')}
                      className={`flex items-center space-x-1 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        sortBy === 'name' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <span>Name</span>
                      {sortBy === 'name' ? (
                        sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                      ) : (
                        <ArrowUpDown className="h-3 w-3" />
                      )}
                    </button>
                    <button
                      onClick={() => handleSort('specialty')}
                      className={`flex items-center space-x-1 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        sortBy === 'specialty' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <span>Specialty</span>
                      {sortBy === 'specialty' ? (
                        sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                      ) : (
                        <ArrowUpDown className="h-3 w-3" />
                      )}
                    </button>
                    <button
                      onClick={() => handleSort('location')}
                      className={`flex items-center space-x-1 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        sortBy === 'location' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <span>Location</span>
                      {sortBy === 'location' ? (
                        sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                      ) : (
                        <ArrowUpDown className="h-3 w-3" />
                      )}
                    </button>
                    <button
                      onClick={() => handleSort('status')}
                      className={`flex items-center space-x-1 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        sortBy === 'status' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <span>Status</span>
                      {sortBy === 'status' ? (
                        sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                      ) : (
                        <ArrowUpDown className="h-3 w-3" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Bulk Actions Bar */}
              {showBulkActions && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-900">
                      {selectedProviders.size} provider{selectedProviders.size !== 1 ? 's' : ''} selected
                    </span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleBulkAction('save')}
                        className="flex items-center space-x-2 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                      >
                        <Bookmark className="h-4 w-4" />
                        <span>Save to List</span>
                      </button>
                      <button
                        onClick={() => handleBulkAction('pdf')}
                        className="flex items-center space-x-2 px-3 py-1.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors"
                      >
                        <FileText className="h-4 w-4" />
                        <span>Export PDF</span>
                      </button>
                      <button
                        onClick={() => handleBulkAction('csv')}
                        className="flex items-center space-x-2 px-3 py-1.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors"
                      >
                        <Download className="h-4 w-4" />
                        <span>Export CSV</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Select All Row */}
              {results.length > 0 && (
                <div className="mt-4 flex items-center space-x-3 text-sm">
                  <button
                    onClick={handleSelectAll}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                  >
                    {selectedProviders.size === results.length ? (
                      <CheckSquare className="h-4 w-4 text-blue-600" />
                    ) : (
                      <Square className="h-4 w-4" />
                    )}
                    <span>
                      {selectedProviders.size === results.length ? 'Deselect All' : 'Select All'}
                    </span>
                  </button>
                </div>
              )}
            </div>
            <div className="divide-y divide-gray-200">
              {results.map((provider) => (
                <div key={provider.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleSelectProvider(provider.id)}
                        className="flex items-center justify-center w-5 h-5 text-blue-600 hover:text-blue-700"
                      >
                        {selectedProviders.has(provider.id) ? (
                          <CheckSquare className="h-5 w-5" />
                        ) : (
                          <Square className="h-5 w-5 text-gray-400 hover:text-blue-600" />
                        )}
                      </button>
                      <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                        <User className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-medium text-gray-900">
                            {provider.name}, {provider.credentials}
                          </h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(provider.status)}`}>
                            {provider.status}
                          </span>
                        </div>
                        <div className="mt-1 space-y-1">
                          <div className="flex items-center text-sm text-gray-600">
                            <Stethoscope className="h-4 w-4 mr-2" />
                            {provider.profession} - {provider.specialty}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="h-4 w-4 mr-2" />
                            {provider.location}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 mr-1" />
                              {provider.phone}
                            </div>
                            <div className="flex items-center">
                              <Mail className="h-4 w-4 mr-1" />
                              {provider.email}
                            </div>
                          </div>
                          <div className="text-sm text-gray-500">
                            NPI: {provider.npi}
                          </div>
                          <div className="text-sm text-gray-500">
                            Managed by: {provider.managedBy}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {results.length === 0 && searchQuery && !isSearching && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <SearchIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No providers found</h3>
            <p className="text-gray-600">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}