import React, { useState } from 'react';
import { Layout } from '../Layout/Layout';
import { 
  GraduationCap,
  Search, 
  Filter, 
  Building,
  MapPin, 
  Stethoscope,
  Users,
  Eye,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  ArrowLeft
} from 'lucide-react';

interface GMEProgram {
  id: string;
  programName: string;
  institution: string;
  profession: string;
  specialty: string;
  subspecialty?: string;
  city: string;
  state: string;
  programType: 'Residency' | 'Fellowship';
  accreditation: string;
  positions: number;
  programDirector: string;
  website: string;
  description: string;
  established: number;
}

interface Institution {
  name: string;
  city: string;
  state: string;
  programs: GMEProgram[];
  totalPositions: number;
}

export function GMEProgramSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    profession: '',
    specialty: '',
    subspecialty: '',
    state: '',
    programType: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<GMEProgram[]>([]);
  const [viewMode, setViewMode] = useState<'programs' | 'institutions'>('programs');
  const [sortBy, setSortBy] = useState<'programName' | 'institution' | 'specialty' | 'positions'>('programName');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [institutionSortBy, setInstitutionSortBy] = useState<'name' | 'programs' | 'positions' | 'state'>('name');
  const [institutionSortOrder, setInstitutionSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedInstitution, setSelectedInstitution] = useState<string | null>(null);

  // Mock GME program data
  const mockResults: GMEProgram[] = [
    // Johns Hopkins Hospital - 18 programs
    {
      id: '1',
      programName: 'Internal Medicine Residency Program',
      institution: 'Johns Hopkins Hospital',
      profession: 'Physician',
      specialty: 'Internal Medicine',
      city: 'Baltimore',
      state: 'MD',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 52,
      programDirector: 'Dr. Sarah Johnson, MD',
      website: 'https://hopkinsmedicine.org/internal-medicine',
      description: 'Premier internal medicine training with world-class research opportunities and subspecialty rotations.',
      established: 1889
    },
    {
      id: '2',
      programName: 'Surgery Residency Program',
      institution: 'Johns Hopkins Hospital',
      profession: 'Physician',
      specialty: 'Surgery',
      city: 'Baltimore',
      state: 'MD',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 48,
      programDirector: 'Dr. Michael Chen, MD',
      website: 'https://hopkinsmedicine.org/surgery',
      description: 'Comprehensive surgical training with emphasis on innovation and minimally invasive techniques.',
      established: 1889
    },
    {
      id: '3',
      programName: 'Emergency Medicine Residency',
      institution: 'Johns Hopkins Hospital',
      profession: 'Physician',
      specialty: 'Emergency Medicine',
      city: 'Baltimore',
      state: 'MD',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 36,
      programDirector: 'Dr. Emily Rodriguez, MD',
      website: 'https://hopkinsmedicine.org/emergency-medicine',
      description: 'High-acuity emergency medicine training with trauma, pediatric, and critical care focus.',
      established: 1972
    },
    {
      id: '4',
      programName: 'Anesthesiology Residency',
      institution: 'Johns Hopkins Hospital',
      profession: 'Physician',
      specialty: 'Anesthesiology',
      city: 'Baltimore',
      state: 'MD',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 32,
      programDirector: 'Dr. James Wilson, MD',
      website: 'https://hopkinsmedicine.org/anesthesiology',
      description: 'Advanced anesthesiology training with cardiac, pediatric, and pain management subspecialties.',
      established: 1945
    },
    {
      id: '5',
      programName: 'Neurology Residency',
      institution: 'Johns Hopkins Hospital',
      profession: 'Physician',
      specialty: 'Neurology',
      city: 'Baltimore',
      state: 'MD',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 28,
      programDirector: 'Dr. Lisa Anderson, MD',
      website: 'https://hopkinsmedicine.org/neurology',
      description: 'World-renowned neurology training with cutting-edge research in neurological disorders.',
      established: 1925
    },
    {
      id: '6',
      programName: 'Psychiatry Residency',
      institution: 'Johns Hopkins Hospital',
      profession: 'Physician',
      specialty: 'Psychiatry',
      city: 'Baltimore',
      state: 'MD',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 24,
      programDirector: 'Dr. Robert Kim, MD',
      website: 'https://hopkinsmedicine.org/psychiatry',
      description: 'Comprehensive psychiatry training with research focus on mood disorders and psychopharmacology.',
      established: 1913
    },
    {
      id: '7',
      programName: 'Radiology Residency',
      institution: 'Johns Hopkins Hospital',
      profession: 'Physician',
      specialty: 'Radiology',
      city: 'Baltimore',
      state: 'MD',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 20,
      programDirector: 'Dr. Maria Garcia, MD',
      website: 'https://hopkinsmedicine.org/radiology',
      description: 'State-of-the-art radiology training with advanced imaging technologies and interventional procedures.',
      established: 1950
    },
    {
      id: '8',
      programName: 'Pathology Residency',
      institution: 'Johns Hopkins Hospital',
      profession: 'Physician',
      specialty: 'Pathology',
      city: 'Baltimore',
      state: 'MD',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 16,
      programDirector: 'Dr. David Lee, MD',
      website: 'https://hopkinsmedicine.org/pathology',
      description: 'Comprehensive pathology training with emphasis on molecular diagnostics and research.',
      established: 1889
    },
    {
      id: '9',
      programName: 'Orthopedic Surgery Residency',
      institution: 'Johns Hopkins Hospital',
      profession: 'Physician',
      specialty: 'Orthopedic Surgery',
      city: 'Baltimore',
      state: 'MD',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 20,
      programDirector: 'Dr. Jennifer Brown, MD',
      website: 'https://hopkinsmedicine.org/orthopedic-surgery',
      description: 'Premier orthopedic surgery training with sports medicine and joint replacement focus.',
      established: 1920
    },
    {
      id: '10',
      programName: 'Neurosurgery Residency',
      institution: 'Johns Hopkins Hospital',
      profession: 'Physician',
      specialty: 'Neurosurgery',
      city: 'Baltimore',
      state: 'MD',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 12,
      programDirector: 'Dr. Thomas White, MD',
      website: 'https://hopkinsmedicine.org/neurosurgery',
      description: 'World-class neurosurgery training with pediatric and vascular subspecialty tracks.',
      established: 1922
    },
    {
      id: '11',
      programName: 'Dermatology Residency',
      institution: 'Johns Hopkins Hospital',
      profession: 'Physician',
      specialty: 'Dermatology',
      city: 'Baltimore',
      state: 'MD',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 8,
      programDirector: 'Dr. Amanda Davis, MD',
      website: 'https://hopkinsmedicine.org/dermatology',
      description: 'Comprehensive dermatology training with dermatopathology and Mohs surgery exposure.',
      established: 1960
    },
    {
      id: '12',
      programName: 'Ophthalmology Residency',
      institution: 'Johns Hopkins Hospital',
      profession: 'Physician',
      specialty: 'Ophthalmology',
      city: 'Baltimore',
      state: 'MD',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 12,
      programDirector: 'Dr. Christopher Miller, MD',
      website: 'https://hopkinsmedicine.org/ophthalmology',
      description: 'Premier ophthalmology training with retinal, corneal, and pediatric subspecialties.',
      established: 1925
    },
    {
      id: '13',
      programName: 'Otolaryngology Residency',
      institution: 'Johns Hopkins Hospital',
      profession: 'Physician',
      specialty: 'Otolaryngology',
      city: 'Baltimore',
      state: 'MD',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 10,
      programDirector: 'Dr. Patricia Wilson, MD',
      website: 'https://hopkinsmedicine.org/otolaryngology',
      description: 'Comprehensive ENT training with head and neck surgery and rhinology focus.',
      established: 1930
    },
    {
      id: '14',
      programName: 'Urology Residency',
      institution: 'Johns Hopkins Hospital',
      profession: 'Physician',
      specialty: 'Urology',
      city: 'Baltimore',
      state: 'MD',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 14,
      programDirector: 'Dr. Kevin Taylor, MD',
      website: 'https://hopkinsmedicine.org/urology',
      description: 'Advanced urology training with robotic surgery and oncology subspecialty tracks.',
      established: 1915
    },
    {
      id: '15',
      programName: 'Plastic Surgery Residency',
      institution: 'Johns Hopkins Hospital',
      profession: 'Physician',
      specialty: 'Plastic Surgery',
      city: 'Baltimore',
      state: 'MD',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 8,
      programDirector: 'Dr. Michelle Johnson, MD',
      website: 'https://hopkinsmedicine.org/plastic-surgery',
      description: 'Comprehensive plastic surgery training with reconstructive and aesthetic surgery focus.',
      established: 1940
    },
    {
      id: '16',
      programName: 'Family Medicine Residency',
      institution: 'Johns Hopkins Hospital',
      profession: 'Physician',
      specialty: 'Family Medicine',
      city: 'Baltimore',
      state: 'MD',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 24,
      programDirector: 'Dr. Sandra Walker, MD',
      website: 'https://hopkinsmedicine.org/family-medicine',
      description: 'Community-focused family medicine training with underserved population emphasis.',
      established: 1970
    },
    {
      id: '17',
      programName: 'Pediatrics Residency',
      institution: 'Johns Hopkins Hospital',
      profession: 'Physician',
      specialty: 'Pediatrics',
      city: 'Baltimore',
      state: 'MD',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 36,
      programDirector: 'Dr. Rachel Green, MD',
      website: 'https://hopkinsmedicine.org/pediatrics',
      description: 'Comprehensive pediatric training with subspecialty rotations and research opportunities.',
      established: 1912
    },
    {
      id: '18',
      programName: 'Obstetrics and Gynecology Residency',
      institution: 'Johns Hopkins Hospital',
      profession: 'Physician',
      specialty: 'Obstetrics and Gynecology',
      city: 'Baltimore',
      state: 'MD',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 20,
      programDirector: 'Dr. Laura Martinez, MD',
      website: 'https://hopkinsmedicine.org/obgyn',
      description: 'Comprehensive OB/GYN training with maternal-fetal medicine and gynecologic oncology exposure.',
      established: 1920
    },

    // Massachusetts General Hospital - 16 programs
    {
      id: '19',
      programName: 'Internal Medicine Residency Program',
      institution: 'Massachusetts General Hospital',
      profession: 'Physician',
      specialty: 'Internal Medicine',
      city: 'Boston',
      state: 'MA',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 48,
      programDirector: 'Dr. John Adams, MD',
      website: 'https://mgh.harvard.edu/internal-medicine',
      description: 'Harvard-affiliated internal medicine training with emphasis on clinical excellence and research.',
      established: 1821
    },
    {
      id: '20',
      programName: 'Surgery Residency Program',
      institution: 'Massachusetts General Hospital',
      profession: 'Physician',
      specialty: 'Surgery',
      city: 'Boston',
      state: 'MA',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 44,
      programDirector: 'Dr. Elizabeth Smith, MD',
      website: 'https://mgh.harvard.edu/surgery',
      description: 'Premier surgical training with innovative techniques and multidisciplinary approach.',
      established: 1821
    },
    {
      id: '21',
      programName: 'Emergency Medicine Residency',
      institution: 'Massachusetts General Hospital',
      profession: 'Physician',
      specialty: 'Emergency Medicine',
      city: 'Boston',
      state: 'MA',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 32,
      programDirector: 'Dr. Mark Thompson, MD',
      website: 'https://mgh.harvard.edu/emergency-medicine',
      description: 'High-volume emergency medicine training with trauma and critical care emphasis.',
      established: 1970
    },
    {
      id: '22',
      programName: 'Anesthesiology Residency',
      institution: 'Massachusetts General Hospital',
      profession: 'Physician',
      specialty: 'Anesthesiology',
      city: 'Boston',
      state: 'MA',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 28,
      programDirector: 'Dr. Susan Clark, MD',
      website: 'https://mgh.harvard.edu/anesthesiology',
      description: 'Advanced anesthesiology training with cardiac and neuroanesthesia subspecialties.',
      established: 1940
    },
    {
      id: '23',
      programName: 'Neurology Residency',
      institution: 'Massachusetts General Hospital',
      profession: 'Physician',
      specialty: 'Neurology',
      city: 'Boston',
      state: 'MA',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 24,
      programDirector: 'Dr. Daniel Lewis, MD',
      website: 'https://mgh.harvard.edu/neurology',
      description: 'World-class neurology training with stroke, epilepsy, and movement disorder focus.',
      established: 1935
    },
    {
      id: '24',
      programName: 'Psychiatry Residency',
      institution: 'Massachusetts General Hospital',
      profession: 'Physician',
      specialty: 'Psychiatry',
      city: 'Boston',
      state: 'MA',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 20,
      programDirector: 'Dr. Jennifer Hall, MD',
      website: 'https://mgh.harvard.edu/psychiatry',
      description: 'Comprehensive psychiatry training with research in mood and anxiety disorders.',
      established: 1925
    },
    {
      id: '25',
      programName: 'Radiology Residency',
      institution: 'Massachusetts General Hospital',
      profession: 'Physician',
      specialty: 'Radiology',
      city: 'Boston',
      state: 'MA',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 18,
      programDirector: 'Dr. Robert Young, MD',
      website: 'https://mgh.harvard.edu/radiology',
      description: 'Cutting-edge radiology training with AI integration and interventional procedures.',
      established: 1945
    },
    {
      id: '26',
      programName: 'Pathology Residency',
      institution: 'Massachusetts General Hospital',
      profession: 'Physician',
      specialty: 'Pathology',
      city: 'Boston',
      state: 'MA',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 14,
      programDirector: 'Dr. Karen Wright, MD',
      website: 'https://mgh.harvard.edu/pathology',
      description: 'Advanced pathology training with molecular diagnostics and digital pathology.',
      established: 1850
    },
    {
      id: '27',
      programName: 'Orthopedic Surgery Residency',
      institution: 'Massachusetts General Hospital',
      profession: 'Physician',
      specialty: 'Orthopedic Surgery',
      city: 'Boston',
      state: 'MA',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 16,
      programDirector: 'Dr. Michael King, MD',
      website: 'https://mgh.harvard.edu/orthopedic-surgery',
      description: 'Premier orthopedic surgery training with sports medicine and trauma focus.',
      established: 1900
    },
    {
      id: '28',
      programName: 'Neurosurgery Residency',
      institution: 'Massachusetts General Hospital',
      profession: 'Physician',
      specialty: 'Neurosurgery',
      city: 'Boston',
      state: 'MA',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 10,
      programDirector: 'Dr. Lisa Scott, MD',
      website: 'https://mgh.harvard.edu/neurosurgery',
      description: 'World-renowned neurosurgery training with skull base and spine subspecialties.',
      established: 1920
    },
    {
      id: '29',
      programName: 'Dermatology Residency',
      institution: 'Massachusetts General Hospital',
      profession: 'Physician',
      specialty: 'Dermatology',
      city: 'Boston',
      state: 'MA',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 6,
      programDirector: 'Dr. Nancy Adams, MD',
      website: 'https://mgh.harvard.edu/dermatology',
      description: 'Comprehensive dermatology training with dermatopathology and cosmetic dermatology.',
      established: 1955
    },
    {
      id: '30',
      programName: 'Ophthalmology Residency',
      institution: 'Massachusetts General Hospital',
      profession: 'Physician',
      specialty: 'Ophthalmology',
      city: 'Boston',
      state: 'MA',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 10,
      programDirector: 'Dr. Paul Baker, MD',
      website: 'https://mgh.harvard.edu/ophthalmology',
      description: 'Premier ophthalmology training with retinal and corneal subspecialty focus.',
      established: 1930
    },
    {
      id: '31',
      programName: 'Family Medicine Residency',
      institution: 'Massachusetts General Hospital',
      profession: 'Physician',
      specialty: 'Family Medicine',
      city: 'Boston',
      state: 'MA',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 20,
      programDirector: 'Dr. Helen Carter, MD',
      website: 'https://mgh.harvard.edu/family-medicine',
      description: 'Community-based family medicine training with urban health focus.',
      established: 1975
    },
    {
      id: '32',
      programName: 'Pediatrics Residency',
      institution: 'Massachusetts General Hospital',
      profession: 'Physician',
      specialty: 'Pediatrics',
      city: 'Boston',
      state: 'MA',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 32,
      programDirector: 'Dr. Steven Davis, MD',
      website: 'https://mgh.harvard.edu/pediatrics',
      description: 'Comprehensive pediatric training with subspecialty rotations and research focus.',
      established: 1900
    },
    {
      id: '33',
      programName: 'Obstetrics and Gynecology Residency',
      institution: 'Massachusetts General Hospital',
      profession: 'Physician',
      specialty: 'Obstetrics and Gynecology',
      city: 'Boston',
      state: 'MA',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 16,
      programDirector: 'Dr. Maria Evans, MD',
      website: 'https://mgh.harvard.edu/obgyn',
      description: 'Comprehensive OB/GYN training with high-risk obstetrics and minimally invasive surgery.',
      established: 1910
    },
    {
      id: '34',
      programName: 'Urology Residency',
      institution: 'Massachusetts General Hospital',
      profession: 'Physician',
      specialty: 'Urology',
      city: 'Boston',
      state: 'MA',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 12,
      programDirector: 'Dr. Richard Foster, MD',
      website: 'https://mgh.harvard.edu/urology',
      description: 'Advanced urology training with robotic surgery and urologic oncology focus.',
      established: 1920
    },

    // UCLA Medical Center - 14 programs
    {
      id: '35',
      programName: 'Internal Medicine Residency Program',
      institution: 'UCLA Medical Center',
      profession: 'Physician',
      specialty: 'Internal Medicine',
      city: 'Los Angeles',
      state: 'CA',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 45,
      programDirector: 'Dr. Sarah Johnson, MD',
      website: 'https://ucla.edu/internal-medicine',
      description: 'Comprehensive internal medicine training with emphasis on primary care and subspecialty rotations.',
      established: 1965
    },
    {
      id: '36',
      programName: 'Surgery Residency Program',
      institution: 'UCLA Medical Center',
      profession: 'Physician',
      specialty: 'Surgery',
      city: 'Los Angeles',
      state: 'CA',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 40,
      programDirector: 'Dr. Michael Chen, MD',
      website: 'https://ucla.edu/surgery',
      description: 'Premier surgical training with minimally invasive and robotic surgery emphasis.',
      established: 1965
    },
    {
      id: '37',
      programName: 'Emergency Medicine Residency',
      institution: 'UCLA Medical Center',
      profession: 'Physician',
      specialty: 'Emergency Medicine',
      city: 'Los Angeles',
      state: 'CA',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 28,
      programDirector: 'Dr. Emily Rodriguez, MD',
      website: 'https://ucla.edu/emergency-medicine',
      description: 'High-volume emergency medicine training with trauma and disaster medicine focus.',
      established: 1975
    },
    {
      id: '38',
      programName: 'Anesthesiology Residency',
      institution: 'UCLA Medical Center',
      profession: 'Physician',
      specialty: 'Anesthesiology',
      city: 'Los Angeles',
      state: 'CA',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 24,
      programDirector: 'Dr. James Wilson, MD',
      website: 'https://ucla.edu/anesthesiology',
      description: 'Advanced anesthesiology training with cardiac and pediatric subspecialties.',
      established: 1970
    },
    {
      id: '39',
      programName: 'Neurology Residency',
      institution: 'UCLA Medical Center',
      profession: 'Physician',
      specialty: 'Neurology',
      city: 'Los Angeles',
      state: 'CA',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 20,
      programDirector: 'Dr. Lisa Anderson, MD',
      website: 'https://ucla.edu/neurology',
      description: 'Comprehensive neurology training with movement disorders and epilepsy focus.',
      established: 1980
    },
    {
      id: '40',
      programName: 'Psychiatry Residency',
      institution: 'UCLA Medical Center',
      profession: 'Physician',
      specialty: 'Psychiatry',
      city: 'Los Angeles',
      state: 'CA',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 18,
      programDirector: 'Dr. Robert Kim, MD',
      website: 'https://ucla.edu/psychiatry',
      description: 'Comprehensive psychiatry training with child and adolescent psychiatry focus.',
      established: 1975
    },
    {
      id: '41',
      programName: 'Radiology Residency',
      institution: 'UCLA Medical Center',
      profession: 'Physician',
      specialty: 'Radiology',
      city: 'Los Angeles',
      state: 'CA',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 16,
      programDirector: 'Dr. Maria Garcia, MD',
      website: 'https://ucla.edu/radiology',
      description: 'State-of-the-art radiology training with interventional and neuroradiology focus.',
      established: 1970
    },
    {
      id: '42',
      programName: 'Orthopedic Surgery Residency',
      institution: 'UCLA Medical Center',
      profession: 'Physician',
      specialty: 'Orthopedic Surgery',
      city: 'Los Angeles',
      state: 'CA',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 14,
      programDirector: 'Dr. Jennifer Brown, MD',
      website: 'https://ucla.edu/orthopedic-surgery',
      description: 'Premier orthopedic surgery training with sports medicine and joint replacement.',
      established: 1975
    },
    {
      id: '43',
      programName: 'Neurosurgery Residency',
      institution: 'UCLA Medical Center',
      profession: 'Physician',
      specialty: 'Neurosurgery',
      city: 'Los Angeles',
      state: 'CA',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 8,
      programDirector: 'Dr. Thomas White, MD',
      website: 'https://ucla.edu/neurosurgery',
      description: 'World-class neurosurgery training with pediatric and functional neurosurgery.',
      established: 1980
    },
    {
      id: '44',
      programName: 'Dermatology Residency',
      institution: 'UCLA Medical Center',
      profession: 'Physician',
      specialty: 'Dermatology',
      city: 'Los Angeles',
      state: 'CA',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 6,
      programDirector: 'Dr. Amanda Davis, MD',
      website: 'https://ucla.edu/dermatology',
      description: 'Comprehensive dermatology training with dermatopathology and cosmetic focus.',
      established: 1985
    },
    {
      id: '45',
      programName: 'Family Medicine Residency',
      institution: 'UCLA Medical Center',
      profession: 'Physician',
      specialty: 'Family Medicine',
      city: 'Los Angeles',
      state: 'CA',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 18,
      programDirector: 'Dr. Sandra Walker, MD',
      website: 'https://ucla.edu/family-medicine',
      description: 'Community-based family medicine training with underserved population focus.',
      established: 1980
    },
    {
      id: '46',
      programName: 'Pediatrics Residency',
      institution: 'UCLA Medical Center',
      profession: 'Physician',
      specialty: 'Pediatrics',
      city: 'Los Angeles',
      state: 'CA',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 28,
      programDirector: 'Dr. Rachel Green, MD',
      website: 'https://ucla.edu/pediatrics',
      description: 'Comprehensive pediatric training with subspecialty rotations and research.',
      established: 1970
    },
    {
      id: '47',
      programName: 'Obstetrics and Gynecology Residency',
      institution: 'UCLA Medical Center',
      profession: 'Physician',
      specialty: 'Obstetrics and Gynecology',
      city: 'Los Angeles',
      state: 'CA',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 14,
      programDirector: 'Dr. Laura Martinez, MD',
      website: 'https://ucla.edu/obgyn',
      description: 'Comprehensive OB/GYN training with maternal-fetal medicine focus.',
      established: 1975
    },
    {
      id: '48',
      programName: 'Urology Residency',
      institution: 'UCLA Medical Center',
      profession: 'Physician',
      specialty: 'Urology',
      city: 'Los Angeles',
      state: 'CA',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 10,
      programDirector: 'Dr. Kevin Taylor, MD',
      website: 'https://ucla.edu/urology',
      description: 'Advanced urology training with robotic surgery and oncology focus.',
      established: 1980
    },

    // Mayo Clinic Rochester - 12 programs
    {
      id: '49',
      programName: 'Internal Medicine Residency Program',
      institution: 'Mayo Clinic Rochester',
      profession: 'Physician',
      specialty: 'Internal Medicine',
      city: 'Rochester',
      state: 'MN',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 42,
      programDirector: 'Dr. John Adams, MD',
      website: 'https://mayo.edu/internal-medicine',
      description: 'Premier internal medicine training with integrated research and clinical excellence.',
      established: 1915
    },
    {
      id: '50',
      programName: 'Surgery Residency Program',
      institution: 'Mayo Clinic Rochester',
      profession: 'Physician',
      specialty: 'Surgery',
      city: 'Rochester',
      state: 'MN',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 36,
      programDirector: 'Dr. Elizabeth Smith, MD',
      website: 'https://mayo.edu/surgery',
      description: 'Comprehensive surgical training with innovation and patient-centered care.',
      established: 1915
    },
    {
      id: '51',
      programName: 'Emergency Medicine Residency',
      institution: 'Mayo Clinic Rochester',
      profession: 'Physician',
      specialty: 'Emergency Medicine',
      city: 'Rochester',
      state: 'MN',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 24,
      programDirector: 'Dr. Mark Thompson, MD',
      website: 'https://mayo.edu/emergency-medicine',
      description: 'High-quality emergency medicine training with rural and transport medicine.',
      established: 1980
    },
    {
      id: '52',
      programName: 'Anesthesiology Residency',
      institution: 'Mayo Clinic Rochester',
      profession: 'Physician',
      specialty: 'Anesthesiology',
      city: 'Rochester',
      state: 'MN',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 20,
      programDirector: 'Dr. Susan Clark, MD',
      website: 'https://mayo.edu/anesthesiology',
      description: 'Advanced anesthesiology training with cardiac and pain management focus.',
      established: 1950
    },
    {
      id: '53',
      programName: 'Neurology Residency',
      institution: 'Mayo Clinic Rochester',
      profession: 'Physician',
      specialty: 'Neurology',
      city: 'Rochester',
      state: 'MN',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 18,
      programDirector: 'Dr. Daniel Lewis, MD',
      website: 'https://mayo.edu/neurology',
      description: 'World-renowned neurology training with movement disorders and epilepsy.',
      established: 1935
    },
    {
      id: '54',
      programName: 'Psychiatry Residency',
      institution: 'Mayo Clinic Rochester',
      profession: 'Physician',
      specialty: 'Psychiatry',
      city: 'Rochester',
      state: 'MN',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 16,
      programDirector: 'Dr. Jennifer Hall, MD',
      website: 'https://mayo.edu/psychiatry',
      description: 'Comprehensive psychiatry training with integrated medical care approach.',
      established: 1960
    },
    {
      id: '55',
      programName: 'Radiology Residency',
      institution: 'Mayo Clinic Rochester',
      profession: 'Physician',
      specialty: 'Radiology',
      city: 'Rochester',
      state: 'MN',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 14,
      programDirector: 'Dr. Robert Young, MD',
      website: 'https://mayo.edu/radiology',
      description: 'Advanced radiology training with AI integration and subspecialty focus.',
      established: 1955
    },
    {
      id: '56',
      programName: 'Orthopedic Surgery Residency',
      institution: 'Mayo Clinic Rochester',
      profession: 'Physician',
      specialty: 'Orthopedic Surgery',
      city: 'Rochester',
      state: 'MN',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 12,
      programDirector: 'Dr. Michael King, MD',
      website: 'https://mayo.edu/orthopedic-surgery',
      description: 'Premier orthopedic surgery training with sports medicine and spine focus.',
      established: 1940
    },
    {
      id: '57',
      programName: 'Family Medicine Residency',
      institution: 'Mayo Clinic Rochester',
      profession: 'Physician',
      specialty: 'Family Medicine',
      city: 'Rochester',
      state: 'MN',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 15,
      programDirector: 'Dr. Helen Carter, MD',
      website: 'https://mayo.edu/family-medicine',
      description: 'Comprehensive family medicine training with rural and community focus.',
      established: 1975
    },
    {
      id: '58',
      programName: 'Pediatrics Residency',
      institution: 'Mayo Clinic Rochester',
      profession: 'Physician',
      specialty: 'Pediatrics',
      city: 'Rochester',
      state: 'MN',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 24,
      programDirector: 'Dr. Steven Davis, MD',
      website: 'https://mayo.edu/pediatrics',
      description: 'Comprehensive pediatric training with subspecialty and research focus.',
      established: 1950
    },
    {
      id: '59',
      programName: 'Obstetrics and Gynecology Residency',
      institution: 'Mayo Clinic Rochester',
      profession: 'Physician',
      specialty: 'Obstetrics and Gynecology',
      city: 'Rochester',
      state: 'MN',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 12,
      programDirector: 'Dr. Maria Evans, MD',
      website: 'https://mayo.edu/obgyn',
      description: 'Comprehensive OB/GYN training with maternal-fetal medicine and oncology.',
      established: 1960
    },
    {
      id: '60',
      programName: 'Pathology Residency',
      institution: 'Mayo Clinic Rochester',
      profession: 'Physician',
      specialty: 'Pathology',
      city: 'Rochester',
      state: 'MN',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 10,
      programDirector: 'Dr. Karen Wright, MD',
      website: 'https://mayo.edu/pathology',
      description: 'Advanced pathology training with molecular diagnostics and research.',
      established: 1920
    },

    // Cleveland Clinic - 11 programs
    {
      id: '61',
      programName: 'Internal Medicine Residency Program',
      institution: 'Cleveland Clinic',
      profession: 'Physician',
      specialty: 'Internal Medicine',
      city: 'Cleveland',
      state: 'OH',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 38,
      programDirector: 'Dr. Patricia Wilson, MD',
      website: 'https://clevelandclinic.org/internal-medicine',
      description: 'Comprehensive internal medicine training with quality improvement focus.',
      established: 1921
    },
    {
      id: '62',
      programName: 'Surgery Residency Program',
      institution: 'Cleveland Clinic',
      profession: 'Physician',
      specialty: 'Surgery',
      city: 'Cleveland',
      state: 'OH',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 32,
      programDirector: 'Dr. Kevin Taylor, MD',
      website: 'https://clevelandclinic.org/surgery',
      description: 'Premier surgical training with minimally invasive and robotic techniques.',
      established: 1921
    },
    {
      id: '63',
      programName: 'Emergency Medicine Residency',
      institution: 'Cleveland Clinic',
      profession: 'Physician',
      specialty: 'Emergency Medicine',
      city: 'Cleveland',
      state: 'OH',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 20,
      programDirector: 'Dr. Michelle Johnson, MD',
      website: 'https://clevelandclinic.org/emergency-medicine',
      description: 'High-volume emergency medicine training with trauma and critical care.',
      established: 1985
    },
    {
      id: '64',
      programName: 'Anesthesiology Residency',
      institution: 'Cleveland Clinic',
      profession: 'Physician',
      specialty: 'Anesthesiology',
      city: 'Cleveland',
      state: 'OH',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 18,
      programDirector: 'Dr. Christopher Miller, MD',
      website: 'https://clevelandclinic.org/anesthesiology',
      description: 'Advanced anesthesiology training with cardiac and pain management.',
      established: 1960
    },
    {
      id: '65',
      programName: 'Neurology Residency',
      institution: 'Cleveland Clinic',
      profession: 'Physician',
      specialty: 'Neurology',
      city: 'Cleveland',
      state: 'OH',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 16,
      programDirector: 'Dr. Amanda Davis, MD',
      website: 'https://clevelandclinic.org/neurology',
      description: 'World-class neurology training with stroke and movement disorders.',
      established: 1970
    },
    {
      id: '66',
      programName: 'Radiology Residency',
      institution: 'Cleveland Clinic',
      profession: 'Physician',
      specialty: 'Radiology',
      city: 'Cleveland',
      state: 'OH',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 12,
      programDirector: 'Dr. David Lee, MD',
      website: 'https://clevelandclinic.org/radiology',
      description: 'State-of-the-art radiology training with interventional focus.',
      established: 1975
    },
    {
      id: '67',
      programName: 'Orthopedic Surgery Residency',
      institution: 'Cleveland Clinic',
      profession: 'Physician',
      specialty: 'Orthopedic Surgery',
      city: 'Cleveland',
      state: 'OH',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 10,
      programDirector: 'Dr. Jennifer Brown, MD',
      website: 'https://clevelandclinic.org/orthopedic-surgery',
      description: 'Premier orthopedic surgery training with sports medicine focus.',
      established: 1980
    },
    {
      id: '68',
      programName: 'Family Medicine Residency',
      institution: 'Cleveland Clinic',
      profession: 'Physician',
      specialty: 'Family Medicine',
      city: 'Cleveland',
      state: 'OH',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 12,
      programDirector: 'Dr. Thomas White, MD',
      website: 'https://clevelandclinic.org/family-medicine',
      description: 'Community-based family medicine training with urban health focus.',
      established: 1985
    },
    {
      id: '69',
      programName: 'Pediatrics Residency',
      institution: 'Cleveland Clinic',
      profession: 'Physician',
      specialty: 'Pediatrics',
      city: 'Cleveland',
      state: 'OH',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 20,
      programDirector: 'Dr. Rachel Green, MD',
      website: 'https://clevelandclinic.org/pediatrics',
      description: 'Comprehensive pediatric training with subspecialty rotations.',
      established: 1975
    },
    {
      id: '70',
      programName: 'Obstetrics and Gynecology Residency',
      institution: 'Cleveland Clinic',
      profession: 'Physician',
      specialty: 'Obstetrics and Gynecology',
      city: 'Cleveland',
      state: 'OH',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 10,
      programDirector: 'Dr. Laura Martinez, MD',
      website: 'https://clevelandclinic.org/obgyn',
      description: 'Comprehensive OB/GYN training with minimally invasive surgery.',
      established: 1980
    },
    {
      id: '71',
      programName: 'Urology Residency',
      institution: 'Cleveland Clinic',
      profession: 'Physician',
      specialty: 'Urology',
      city: 'Cleveland',
      state: 'OH',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 8,
      programDirector: 'Dr. Nancy Adams, MD',
      website: 'https://clevelandclinic.org/urology',
      description: 'Advanced urology training with robotic surgery and oncology.',
      established: 1985
    },

    // Stanford University Medical Center - 10 programs
    {
      id: '72',
      programName: 'Internal Medicine Residency Program',
      institution: 'Stanford University Medical Center',
      profession: 'Physician',
      specialty: 'Internal Medicine',
      city: 'Stanford',
      state: 'CA',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 34,
      programDirector: 'Dr. Paul Baker, MD',
      website: 'https://stanford.edu/internal-medicine',
      description: 'Premier internal medicine training with innovation and technology focus.',
      established: 1959
    },
    {
      id: '73',
      programName: 'Surgery Residency Program',
      institution: 'Stanford University Medical Center',
      profession: 'Physician',
      specialty: 'Surgery',
      city: 'Stanford',
      state: 'CA',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 28,
      programDirector: 'Dr. Helen Carter, MD',
      website: 'https://stanford.edu/surgery',
      description: 'Innovative surgical training with robotic and minimally invasive techniques.',
      established: 1959
    },
    {
      id: '74',
      programName: 'Emergency Medicine Residency',
      institution: 'Stanford University Medical Center',
      profession: 'Physician',
      specialty: 'Emergency Medicine',
      city: 'Stanford',
      state: 'CA',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 18,
      programDirector: 'Dr. Steven Davis, MD',
      website: 'https://stanford.edu/emergency-medicine',
      description: 'High-tech emergency medicine training with disaster preparedness.',
      established: 1980
    },
    {
      id: '75',
      programName: 'Anesthesiology Residency',
      institution: 'Stanford University Medical Center',
      profession: 'Physician',
      specialty: 'Anesthesiology',
      city: 'Stanford',
      state: 'CA',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 16,
      programDirector: 'Dr. Maria Evans, MD',
      website: 'https://stanford.edu/anesthesiology',
      description: 'Advanced anesthesiology training with cardiac and pediatric focus.',
      established: 1970
    },
    {
      id: '76',
      programName: 'Neurology Residency',
      institution: 'Stanford University Medical Center',
      profession: 'Physician',
      specialty: 'Neurology',
      city: 'Stanford',
      state: 'CA',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 14,
      programDirector: 'Dr. Richard Foster, MD',
      website: 'https://stanford.edu/neurology',
      description: 'Cutting-edge neurology training with AI and digital health integration.',
      established: 1975
    },
    {
      id: '77',
      programName: 'Radiology Residency',
      institution: 'Stanford University Medical Center',
      profession: 'Physician',
      specialty: 'Radiology',
      city: 'Stanford',
      state: 'CA',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 10,
      programDirector: 'Dr. Lisa Scott, MD',
      website: 'https://stanford.edu/radiology',
      description: 'State-of-the-art radiology training with AI and machine learning.',
      established: 1980
    },
    {
      id: '78',
      programName: 'Orthopedic Surgery Residency',
      institution: 'Stanford University Medical Center',
      profession: 'Physician',
      specialty: 'Orthopedic Surgery',
      city: 'Stanford',
      state: 'CA',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 8,
      programDirector: 'Dr. Michael King, MD',
      website: 'https://stanford.edu/orthopedic-surgery',
      description: 'Premier orthopedic surgery training with sports medicine and innovation.',
      established: 1985
    },
    {
      id: '79',
      programName: 'Family Medicine Residency',
      institution: 'Stanford University Medical Center',
      profession: 'Physician',
      specialty: 'Family Medicine',
      city: 'Stanford',
      state: 'CA',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 12,
      programDirector: 'Dr. James Wilson, MD',
      website: 'https://stanford.edu/family-medicine',
      description: 'Community-based family medicine training with rural and underserved population focus.',
      established: 1972
    },
    {
      id: '80',
      programName: 'Pediatrics Residency',
      institution: 'Stanford University Medical Center',
      profession: 'Physician',
      specialty: 'Pediatrics',
      city: 'Stanford',
      state: 'CA',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 18,
      programDirector: 'Dr. Karen Wright, MD',
      website: 'https://stanford.edu/pediatrics',
      description: 'Comprehensive pediatric training with subspecialty and research focus.',
      established: 1970
    },
    {
      id: '81',
      programName: 'Psychiatry Residency',
      institution: 'Stanford University Medical Center',
      profession: 'Physician',
      specialty: 'Psychiatry',
      city: 'Stanford',
      state: 'CA',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 14,
      programDirector: 'Dr. Nancy Adams, MD',
      website: 'https://stanford.edu/psychiatry',
      description: 'Innovative psychiatry training with digital therapeutics and research.',
      established: 1980
    },

    // UCSF Medical Center - 9 programs
    {
      id: '82',
      programName: 'Internal Medicine Residency Program',
      institution: 'UCSF Medical Center',
      profession: 'Physician',
      specialty: 'Internal Medicine',
      city: 'San Francisco',
      state: 'CA',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 30,
      programDirector: 'Dr. Daniel Lewis, MD',
      website: 'https://ucsf.edu/internal-medicine',
      description: 'Premier internal medicine training with global health and research focus.',
      established: 1864
    },
    {
      id: '83',
      programName: 'Surgery Residency Program',
      institution: 'UCSF Medical Center',
      profession: 'Physician',
      specialty: 'Surgery',
      city: 'San Francisco',
      state: 'CA',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 24,
      programDirector: 'Dr. Jennifer Hall, MD',
      website: 'https://ucsf.edu/surgery',
      description: 'Innovative surgical training with transplant and oncology focus.',
      established: 1864
    },
    {
      id: '84',
      programName: 'Emergency Medicine Residency',
      institution: 'UCSF Medical Center',
      profession: 'Physician',
      specialty: 'Emergency Medicine',
      city: 'San Francisco',
      state: 'CA',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 16,
      programDirector: 'Dr. Robert Young, MD',
      website: 'https://ucsf.edu/emergency-medicine',
      description: 'High-volume emergency medicine training with trauma, pediatric, and critical care rotations.',
      established: 1978
    },
    {
      id: '85',
      programName: 'Neurology Residency',
      institution: 'UCSF Medical Center',
      profession: 'Physician',
      specialty: 'Neurology',
      city: 'San Francisco',
      state: 'CA',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 12,
      programDirector: 'Dr. Susan Clark, MD',
      website: 'https://ucsf.edu/neurology',
      description: 'World-class neurology training with movement disorders and epilepsy.',
      established: 1920
    },
    {
      id: '86',
      programName: 'Neurosurgery Residency',
      institution: 'UCSF Medical Center',
      profession: 'Physician',
      specialty: 'Neurosurgery',
      city: 'San Francisco',
      state: 'CA',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 6,
      programDirector: 'Dr. Mark Thompson, MD',
      website: 'https://ucsf.edu/neurosurgery',
      description: 'Premier neurosurgery training with pediatric and vascular focus.',
      established: 1925
    },
    {
      id: '87',
      programName: 'Radiology Residency',
      institution: 'UCSF Medical Center',
      profession: 'Physician',
      specialty: 'Radiology',
      city: 'San Francisco',
      state: 'CA',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 8,
      programDirector: 'Dr. Elizabeth Smith, MD',
      website: 'https://ucsf.edu/radiology',
      description: 'Advanced radiology training with interventional and neuroradiology.',
      established: 1950
    },
    {
      id: '88',
      programName: 'Family Medicine Residency',
      institution: 'UCSF Medical Center',
      profession: 'Physician',
      specialty: 'Family Medicine',
      city: 'San Francisco',
      state: 'CA',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 10,
      programDirector: 'Dr. John Adams, MD',
      website: 'https://ucsf.edu/family-medicine',
      description: 'Community-based family medicine training with urban health focus.',
      established: 1975
    },
    {
      id: '89',
      programName: 'Pediatrics Residency',
      institution: 'UCSF Medical Center',
      profession: 'Physician',
      specialty: 'Pediatrics',
      city: 'San Francisco',
      state: 'CA',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 14,
      programDirector: 'Dr. Patricia Wilson, MD',
      website: 'https://ucsf.edu/pediatrics',
      description: 'Comprehensive pediatric training with subspecialty rotations.',
      established: 1960
    },
    {
      id: '90',
      programName: 'Psychiatry Residency',
      institution: 'UCSF Medical Center',
      profession: 'Physician',
      specialty: 'Psychiatry',
      city: 'San Francisco',
      state: 'CA',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 12,
      programDirector: 'Dr. Kevin Taylor, MD',
      website: 'https://ucsf.edu/psychiatry',
      description: 'Comprehensive psychiatry training with research in mood disorders.',
      established: 1970
    },

    // Cedars-Sinai Medical Center - 8 programs
    {
      id: '91',
      programName: 'Internal Medicine Residency Program',
      institution: 'Cedars-Sinai Medical Center',
      profession: 'Physician',
      specialty: 'Internal Medicine',
      city: 'Los Angeles',
      state: 'CA',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 26,
      programDirector: 'Dr. Michelle Johnson, MD',
      website: 'https://cedars-sinai.edu/internal-medicine',
      description: 'Premier internal medicine training with celebrity and VIP patient care.',
      established: 1902
    },
    {
      id: '92',
      programName: 'Surgery Residency Program',
      institution: 'Cedars-Sinai Medical Center',
      profession: 'Physician',
      specialty: 'Surgery',
      city: 'Los Angeles',
      state: 'CA',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 20,
      programDirector: 'Dr. Christopher Miller, MD',
      website: 'https://cedars-sinai.edu/surgery',
      description: 'Advanced surgical training with minimally invasive and robotic techniques.',
      established: 1902
    },
    {
      id: '93',
      programName: 'Emergency Medicine Residency',
      institution: 'Cedars-Sinai Medical Center',
      profession: 'Physician',
      specialty: 'Emergency Medicine',
      city: 'Los Angeles',
      state: 'CA',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 12,
      programDirector: 'Dr. Amanda Davis, MD',
      website: 'https://cedars-sinai.edu/emergency-medicine',
      description: 'High-acuity emergency medicine training with trauma focus.',
      established: 1985
    },
    {
      id: '94',
      programName: 'Cardiology Fellowship Program',
      institution: 'Cedars-Sinai Medical Center',
      profession: 'Physician',
      specialty: 'Internal Medicine',
      subspecialty: 'Cardiology',
      city: 'Los Angeles',
      state: 'CA',
      programType: 'Fellowship',
      accreditation: 'ACGME',
      positions: 12,
      programDirector: 'Dr. Emily Rodriguez, MD',
      website: 'https://cedars-sinai.edu/cardiology',
      description: 'Advanced cardiology fellowship with interventional, electrophysiology, and heart failure tracks.',
      established: 1985
    },
    {
      id: '95',
      programName: 'Orthopedic Surgery Residency',
      institution: 'Cedars-Sinai Medical Center',
      profession: 'Physician',
      specialty: 'Orthopedic Surgery',
      city: 'Los Angeles',
      state: 'CA',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 8,
      programDirector: 'Dr. David Lee, MD',
      website: 'https://cedars-sinai.edu/orthopedic-surgery',
      description: 'Premier orthopedic surgery training with sports medicine focus.',
      established: 1990
    },
    {
      id: '96',
      programName: 'Radiology Residency',
      institution: 'Cedars-Sinai Medical Center',
      profession: 'Physician',
      specialty: 'Radiology',
      city: 'Los Angeles',
      state: 'CA',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 6,
      programDirector: 'Dr. Jennifer Brown, MD',
      website: 'https://cedars-sinai.edu/radiology',
      description: 'State-of-the-art radiology training with interventional procedures.',
      established: 1980
    },
    {
      id: '97',
      programName: 'Anesthesiology Residency',
      institution: 'Cedars-Sinai Medical Center',
      profession: 'Physician',
      specialty: 'Anesthesiology',
      city: 'Los Angeles',
      state: 'CA',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 10,
      programDirector: 'Dr. Thomas White, MD',
      website: 'https://cedars-sinai.edu/anesthesiology',
      description: 'Advanced anesthesiology training with cardiac and pain management.',
      established: 1975
    },
    {
      id: '98',
      programName: 'Obstetrics and Gynecology Residency',
      institution: 'Cedars-Sinai Medical Center',
      profession: 'Physician',
      specialty: 'Obstetrics and Gynecology',
      city: 'Los Angeles',
      state: 'CA',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 8,
      programDirector: 'Dr. Rachel Green, MD',
      website: 'https://cedars-sinai.edu/obgyn',
      description: 'Comprehensive OB/GYN training with high-risk obstetrics.',
      established: 1985
    },

    // Mount Sinai Hospital - 6 programs
    {
      id: '99',
      programName: 'Internal Medicine Residency Program',
      institution: 'Mount Sinai Hospital',
      profession: 'Physician',
      specialty: 'Internal Medicine',
      city: 'New York',
      state: 'NY',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 22,
      programDirector: 'Dr. Laura Martinez, MD',
      website: 'https://mountsinai.org/internal-medicine',
      description: 'Premier internal medicine training with urban health focus.',
      established: 1852
    },
    {
      id: '100',
      programName: 'Surgery Residency Program',
      institution: 'Mount Sinai Hospital',
      profession: 'Physician',
      specialty: 'Surgery',
      city: 'New York',
      state: 'NY',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 16,
      programDirector: 'Dr. Sandra Walker, MD',
      website: 'https://mountsinai.org/surgery',
      description: 'Comprehensive surgical training with transplant and oncology focus.',
      established: 1852
    },
    {
      id: '101',
      programName: 'Emergency Medicine Residency',
      institution: 'Mount Sinai Hospital',
      profession: 'Physician',
      specialty: 'Emergency Medicine',
      city: 'New York',
      state: 'NY',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 10,
      programDirector: 'Dr. Paul Baker, MD',
      website: 'https://mountsinai.org/emergency-medicine',
      description: 'High-volume emergency medicine training with trauma and critical care.',
      established: 1980
    },
    {
      id: '102',
      programName: 'Neurology Residency',
      institution: 'Mount Sinai Hospital',
      profession: 'Physician',
      specialty: 'Neurology',
      city: 'New York',
      state: 'NY',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 8,
      programDirector: 'Dr. Helen Carter, MD',
      website: 'https://mountsinai.org/neurology',
      description: 'Comprehensive neurology training with movement disorders focus.',
      established: 1960
    },
    {
      id: '103',
      programName: 'Radiology Residency',
      institution: 'Mount Sinai Hospital',
      profession: 'Physician',
      specialty: 'Radiology',
      city: 'New York',
      state: 'NY',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 6,
      programDirector: 'Dr. Steven Davis, MD',
      website: 'https://mountsinai.org/radiology',
      description: 'Advanced radiology training with interventional procedures.',
      established: 1970
    },
    {
      id: '104',
      programName: 'Family Medicine Residency',
      institution: 'Mount Sinai Hospital',
      profession: 'Physician',
      specialty: 'Family Medicine',
      city: 'New York',
      state: 'NY',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 8,
      programDirector: 'Dr. Maria Evans, MD',
      website: 'https://mountsinai.org/family-medicine',
      description: 'Urban family medicine training with underserved population focus.',
      established: 1985
    },

    // Community Medical Center - 5 programs
    {
      id: '105',
      programName: 'Internal Medicine Residency Program',
      institution: 'Community Medical Center',
      profession: 'Physician',
      specialty: 'Internal Medicine',
      city: 'Phoenix',
      state: 'AZ',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 18,
      programDirector: 'Dr. Richard Foster, MD',
      website: 'https://communitymedical.org/internal-medicine',
      description: 'Community-based internal medicine training with primary care focus.',
      established: 1995
    },
    {
      id: '106',
      programName: 'Family Medicine Residency',
      institution: 'Community Medical Center',
      profession: 'Physician',
      specialty: 'Family Medicine',
      city: 'Phoenix',
      state: 'AZ',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 12,
      programDirector: 'Dr. Lisa Scott, MD',
      website: 'https://communitymedical.org/family-medicine',
      description: 'Community-focused family medicine training with rural health emphasis.',
      established: 1995
    },
    {
      id: '107',
      programName: 'Emergency Medicine Residency',
      institution: 'Community Medical Center',
      profession: 'Physician',
      specialty: 'Emergency Medicine',
      city: 'Phoenix',
      state: 'AZ',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 8,
      programDirector: 'Dr. Nancy Adams, MD',
      website: 'https://communitymedical.org/emergency-medicine',
      description: 'Community emergency medicine training with rural and transport focus.',
      established: 2000
    },
    {
      id: '108',
      programName: 'Pediatrics Residency',
      institution: 'Community Medical Center',
      profession: 'Physician',
      specialty: 'Pediatrics',
      city: 'Phoenix',
      state: 'AZ',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 10,
      programDirector: 'Dr. Michael King, MD',
      website: 'https://communitymedical.org/pediatrics',
      description: 'Community pediatric training with general pediatrics focus.',
      established: 2005
    },
    {
      id: '109',
      programName: 'Obstetrics and Gynecology Residency',
      institution: 'Community Medical Center',
      profession: 'Physician',
      specialty: 'Obstetrics and Gynecology',
      city: 'Phoenix',
      state: 'AZ',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 6,
      programDirector: 'Dr. Karen Wright, MD',
      website: 'https://communitymedical.org/obgyn',
      description: 'Community OB/GYN training with general obstetrics and gynecology.',
      established: 2010
    }
  ];

  const handleSearch = async () => {
    setIsSearching(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Filter mock results based on search query and filters
    let filtered = mockResults;
    
    if (searchQuery) {
      filtered = filtered.filter(program =>
        program.programName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        program.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
        program.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        program.subspecialty?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply filters
    if (filters.profession) {
      filtered = filtered.filter(program => program.profession === filters.profession);
    }
    
    if (filters.specialty) {
      filtered = filtered.filter(program => 
        program.specialty.toLowerCase().includes(filters.specialty.toLowerCase())
      );
    }
    
    if (filters.subspecialty) {
      filtered = filtered.filter(program => 
        program.subspecialty?.toLowerCase().includes(filters.subspecialty.toLowerCase())
      );
    }
    
    if (filters.state) {
      filtered = filtered.filter(program => program.state === filters.state);
    }
    
    if (filters.programType) {
      filtered = filtered.filter(program => program.programType === filters.programType);
    }
    
    setResults(filtered);
    setIsSearching(false);
  };

  const handleSort = (field: 'programName' | 'institution' | 'specialty' | 'positions') => {
    const newOrder = sortBy === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortBy(field);
    setSortOrder(newOrder);
    
    const sorted = [...results].sort((a, b) => {
      let aValue: string | number = '';
      let bValue: string | number = '';
      
      switch (field) {
        case 'programName':
          aValue = a.programName.toLowerCase();
          bValue = b.programName.toLowerCase();
          break;
        case 'institution':
          aValue = a.institution.toLowerCase();
          bValue = b.institution.toLowerCase();
          break;
        case 'specialty':
          aValue = a.specialty.toLowerCase();
          bValue = b.specialty.toLowerCase();
          break;
        case 'positions':
          aValue = a.positions;
          bValue = b.positions;
          break;
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return newOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      } else {
        return newOrder === 'asc' ? (aValue as number) - (bValue as number) : (bValue as number) - (aValue as number);
      }
    });
    
    setResults(sorted);
  };

  const handleInstitutionSort = (field: 'name' | 'programs' | 'positions' | 'state') => {
    const newOrder = institutionSortBy === field && institutionSortOrder === 'asc' ? 'desc' : 'asc';
    setInstitutionSortBy(field);
    setInstitutionSortOrder(newOrder);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const getInstitutions = (): Institution[] => {
    const institutionMap = new Map<string, Institution>();
    
    let programsToProcess = results.length > 0 ? results : mockResults;
    
    // Apply search filter to institutions view
    if (searchQuery && viewMode === 'institutions') {
      programsToProcess = programsToProcess.filter(program =>
        program.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
        program.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        program.state.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    programsToProcess.forEach(program => {
      const key = program.institution;
      if (!institutionMap.has(key)) {
        institutionMap.set(key, {
          name: program.institution,
          city: program.city,
          state: program.state,
          programs: [],
          totalPositions: 0
        });
      }
      
      const institution = institutionMap.get(key)!;
      institution.programs.push(program);
      institution.totalPositions += program.positions;
    });
    
    let institutions = Array.from(institutionMap.values());
    
    // Sort institutions
    institutions.sort((a, b) => {
      let aValue: string | number = '';
      let bValue: string | number = '';
      
      switch (institutionSortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'programs':
          aValue = a.programs.length;
          bValue = b.programs.length;
          break;
        case 'positions':
          aValue = a.totalPositions;
          bValue = b.totalPositions;
          break;
        case 'state':
          aValue = a.state.toLowerCase();
          bValue = b.state.toLowerCase();
          break;
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return institutionSortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      } else {
        return institutionSortOrder === 'asc' ? (aValue as number) - (bValue as number) : (bValue as number) - (aValue as number);
      }
    });
    
    return institutions;
  };

  const getFilteredInstitutionPrograms = (institutionName: string): GMEProgram[] => {
    let programs = mockResults.filter(program => program.institution === institutionName);
    
    // Apply filters to institution programs
    if (filters.specialty) {
      programs = programs.filter(program => 
        program.specialty.toLowerCase().includes(filters.specialty.toLowerCase())
      );
    }
    
    if (filters.programType) {
      programs = programs.filter(program => program.programType === filters.programType);
    }
    
    return programs;
  };

  // Initialize results on component mount
  React.useEffect(() => {
    if (results.length === 0) {
      setResults(mockResults);
    }
  }, []);

  return (
    <Layout breadcrumbs={[{ label: 'GME Program Search' }]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-3 mb-4">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Graduate Medical Education Programs</h1>
              <p className="text-gray-600">Search and explore GME programs by profession, specialty, subspecialty, and state.</p>
            </div>
          </div>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="space-y-4">
            {/* Search Bar and View Toggle */}
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder={viewMode === 'programs' ? "Search programs by name, institution, or specialty..." : "Search institutions by name, city, or state..."}
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
                <Search className="h-4 w-4" />
                <span>{isSearching ? 'Searching...' : 'Search'}</span>
              </button>
              <button
                onClick={() => setViewMode(viewMode === 'programs' ? 'institutions' : 'programs')}
                className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Building className="h-4 w-4" />
                <span>{viewMode === 'programs' ? 'View by Institution' : 'View Programs'}</span>
              </button>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-gray-50 rounded-lg">
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
                  </select>
                </div>
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
                    <option value="Surgery">Surgery</option>
                    <option value="Emergency Medicine">Emergency Medicine</option>
                    <option value="Family Medicine">Family Medicine</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Anesthesiology">Anesthesiology</option>
                    <option value="Radiology">Radiology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Psychiatry">Psychiatry</option>
                    <option value="Orthopedic Surgery">Orthopedic Surgery</option>
                    <option value="Neurosurgery">Neurosurgery</option>
                    <option value="Dermatology">Dermatology</option>
                    <option value="Ophthalmology">Ophthalmology</option>
                    <option value="Urology">Urology</option>
                    <option value="Obstetrics and Gynecology">Obstetrics and Gynecology</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subspecialty
                  </label>
                  <select
                    value={filters.subspecialty}
                    onChange={(e) => handleFilterChange('subspecialty', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Subspecialties</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Gastroenterology">Gastroenterology</option>
                    <option value="Pulmonology">Pulmonology</option>
                    <option value="Endocrinology">Endocrinology</option>
                    <option value="Nephrology">Nephrology</option>
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
                    <option value="MD">Maryland</option>
                    <option value="MA">Massachusetts</option>
                    <option value="MN">Minnesota</option>
                    <option value="OH">Ohio</option>
                    <option value="AZ">Arizona</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Program Type
                  </label>
                  <select
                    value={filters.programType}
                    onChange={(e) => handleFilterChange('programType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Types</option>
                    <option value="Residency">Residency</option>
                    <option value="Fellowship">Fellowship</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Institution View */}
        {viewMode === 'institutions' && !selectedInstitution && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Institutions ({getInstitutions().length})
                </h2>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">Sort by:</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleInstitutionSort('name')}
                      className={`flex items-center space-x-1 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        institutionSortBy === 'name' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <span>Name</span>
                      {institutionSortBy === 'name' ? (
                        institutionSortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                      ) : (
                        <ArrowUpDown className="h-3 w-3" />
                      )}
                    </button>
                    <button
                      onClick={() => handleInstitutionSort('programs')}
                      className={`flex items-center space-x-1 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        institutionSortBy === 'programs' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <span>Programs</span>
                      {institutionSortBy === 'programs' ? (
                        institutionSortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                      ) : (
                        <ArrowUpDown className="h-3 w-3" />
                      )}
                    </button>
                    <button
                      onClick={() => handleInstitutionSort('positions')}
                      className={`flex items-center space-x-1 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        institutionSortBy === 'positions' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <span>Positions</span>
                      {institutionSortBy === 'positions' ? (
                        institutionSortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                      ) : (
                        <ArrowUpDown className="h-3 w-3" />
                      )}
                    </button>
                    <button
                      onClick={() => handleInstitutionSort('state')}
                      className={`flex items-center space-x-1 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        institutionSortBy === 'state' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <span>State</span>
                      {institutionSortBy === 'state' ? (
                        institutionSortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                      ) : (
                        <ArrowUpDown className="h-3 w-3" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {getInstitutions().map((institution) => (
                <div key={institution.name} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                        <Building className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">
                          {institution.name}
                        </h3>
                        <div className="mt-1 space-y-1">
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="h-4 w-4 mr-2" />
                            {institution.city}, {institution.state}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <GraduationCap className="h-4 w-4 mr-1" />
                              {institution.programs.length} programs
                            </div>
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              {institution.totalPositions} positions
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedInstitution(institution.name)}
                        className="flex items-center space-x-2 px-3 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View Programs</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Institution Programs View */}
        {viewMode === 'institutions' && selectedInstitution && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setSelectedInstitution(null)}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Institutions</span>
                  </button>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {selectedInstitution} Programs ({getFilteredInstitutionPrograms(selectedInstitution).length})
                  </h2>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">Sort by:</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleSort('programName')}
                      className={`flex items-center space-x-1 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        sortBy === 'programName' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <span>Program</span>
                      {sortBy === 'programName' ? (
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
                  </div>
                </div>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {getFilteredInstitutionPrograms(selectedInstitution).map((program) => (
                <div key={program.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                        <GraduationCap className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-medium text-gray-900">
                            {program.programName}
                          </h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            program.programType === 'Residency' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-purple-100 text-purple-800'
                          }`}>
                            {program.programType}
                          </span>
                        </div>
                        <div className="mt-1 space-y-1">
                          <div className="flex items-center text-sm text-gray-600">
                            <Building className="h-4 w-4 mr-2" />
                            {program.institution}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Stethoscope className="h-4 w-4 mr-2" />
                            {program.specialty}
                            {program.subspecialty && ` - ${program.subspecialty}`}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {program.city}, {program.state}
                            </div>
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              {program.positions} positions
                            </div>
                          </div>
                          <div className="text-sm text-gray-500">
                            Director: {program.programDirector}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <a
                        href={`/gme-program-detail?id=${program.id}`}
                        className="flex items-center space-x-2 px-3 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View Program</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Programs View */}
        {viewMode === 'programs' && results.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Programs ({results.length})
                </h2>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">Sort by:</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleSort('programName')}
                      className={`flex items-center space-x-1 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        sortBy === 'programName' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <span>Program</span>
                      {sortBy === 'programName' ? (
                        sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                      ) : (
                        <ArrowUpDown className="h-3 w-3" />
                      )}
                    </button>
                    <button
                      onClick={() => handleSort('institution')}
                      className={`flex items-center space-x-1 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        sortBy === 'institution' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <span>Institution</span>
                      {sortBy === 'institution' ? (
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
                      onClick={() => handleSort('positions')}
                      className={`flex items-center space-x-1 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        sortBy === 'positions' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <span>Positions</span>
                      {sortBy === 'positions' ? (
                        sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                      ) : (
                        <ArrowUpDown className="h-3 w-3" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {results.map((program) => (
                <div key={program.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                        <GraduationCap className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-medium text-gray-900">
                            {program.programName}
                          </h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            program.programType === 'Residency' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-purple-100 text-purple-800'
                          }`}>
                            {program.programType}
                          </span>
                        </div>
                        <div className="mt-1 space-y-1">
                          <div className="flex items-center text-sm text-gray-600">
                            <Building className="h-4 w-4 mr-2" />
                            {program.institution}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Stethoscope className="h-4 w-4 mr-2" />
                            {program.specialty}
                            {program.subspecialty && ` - ${program.subspecialty}`}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {program.city}, {program.state}
                            </div>
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              {program.positions} positions
                            </div>
                          </div>
                          <div className="text-sm text-gray-500">
                            Director: {program.programDirector}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <a
                        href={`/gme-program-detail?id=${program.id}`}
                        className="flex items-center space-x-2 px-3 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View Program</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {viewMode === 'programs' && results.length === 0 && searchQuery && !isSearching && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No programs found</h3>
            <p className="text-gray-600">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}