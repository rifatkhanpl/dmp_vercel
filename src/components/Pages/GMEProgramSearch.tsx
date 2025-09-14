import React, { useState } from 'react';
import { Layout } from '../Layout/Layout';
import { 
  GraduationCap,
  Search as SearchIcon, 
  Filter, 
  Building,
  MapPin, 
  Stethoscope,
  Users,
  Eye,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  Square,
  CheckSquare,
  Bookmark,
  FileText,
  Download,
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
  programType: 'Residency' | 'Fellowship' | 'Internship';
  accreditation: string;
  positions: number;
  programDirector: string;
  website: string;
  description: string;
  established: number;
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
  const [sortBy, setSortBy] = useState<'programName' | 'institution' | 'specialty' | 'state'>('programName');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedPrograms, setSelectedPrograms] = useState<Set<string>>(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [viewMode, setViewMode] = useState<'programs' | 'institutions'>('programs');
  const [selectedInstitution, setSelectedInstitution] = useState<string | null>(null);

  // Mock GME program data - 10 institutions with 5-20 programs each
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
      description: 'World-class neurosurgery training with pediatric and vascular subspecialties.',
      established: 1922
    },
    {
      id: '11',
      programName: 'Urology Residency',
      institution: 'Johns Hopkins Hospital',
      profession: 'Physician',
      specialty: 'Urology',
      city: 'Baltimore',
      state: 'MD',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 16,
      programDirector: 'Dr. Amanda Davis, MD',
      website: 'https://hopkinsmedicine.org/urology',
      description: 'Comprehensive urology training with robotic surgery and oncology focus.',
      established: 1915
    },
    {
      id: '12',
      programName: 'Dermatology Residency',
      institution: 'Johns Hopkins Hospital',
      profession: 'Physician',
      specialty: 'Dermatology',
      city: 'Baltimore',
      state: 'MD',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 12,
      programDirector: 'Dr. Kevin Martinez, MD',
      website: 'https://hopkinsmedicine.org/dermatology',
      description: 'Premier dermatology training with dermatopathology and Mohs surgery subspecialties.',
      established: 1930
    },
    {
      id: '13',
      programName: 'Ophthalmology Residency',
      institution: 'Johns Hopkins Hospital',
      profession: 'Physician',
      specialty: 'Ophthalmology',
      city: 'Baltimore',
      state: 'MD',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 16,
      programDirector: 'Dr. Rachel Thompson, MD',
      website: 'https://hopkinsmedicine.org/ophthalmology',
      description: 'World-renowned ophthalmology training with retinal and corneal subspecialties.',
      established: 1925
    },
    {
      id: '14',
      programName: 'Otolaryngology Residency',
      institution: 'Johns Hopkins Hospital',
      profession: 'Physician',
      specialty: 'Otolaryngology',
      city: 'Baltimore',
      state: 'MD',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 20,
      programDirector: 'Dr. Steven Clark, MD',
      website: 'https://hopkinsmedicine.org/otolaryngology',
      description: 'Comprehensive ENT training with head and neck surgery and facial plastic surgery focus.',
      established: 1920
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
      positions: 14,
      programDirector: 'Dr. Michelle Lewis, MD',
      website: 'https://hopkinsmedicine.org/plastic-surgery',
      description: 'Premier plastic surgery training with reconstructive and aesthetic surgery focus.',
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
      positions: 36,
      programDirector: 'Dr. Daniel Walker, MD',
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
      positions: 40,
      programDirector: 'Dr. Laura Young, MD',
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
      positions: 24,
      programDirector: 'Dr. Sandra Walker, MD',
      website: 'https://hopkinsmedicine.org/obgyn',
      description: 'Comprehensive OB/GYN training with maternal-fetal medicine and gynecologic oncology focus.',
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
      description: 'Historic internal medicine program with Harvard Medical School affiliation and research excellence.',
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
      description: 'Premier surgical training with innovation in minimally invasive and robotic techniques.',
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
      programDirector: 'Dr. Robert Johnson, MD',
      website: 'https://mgh.harvard.edu/emergency-medicine',
      description: 'High-volume emergency medicine training with Level I trauma center experience.',
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
      programDirector: 'Dr. Patricia Brown, MD',
      website: 'https://mgh.harvard.edu/anesthesiology',
      description: 'Advanced anesthesiology training with cardiac and neuroanesthesia subspecialties.',
      established: 1946
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
      programDirector: 'Dr. Michael Davis, MD',
      website: 'https://mgh.harvard.edu/neurology',
      description: 'World-class neurology training with stroke, epilepsy, and movement disorders focus.',
      established: 1920
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
      programDirector: 'Dr. Jennifer Wilson, MD',
      website: 'https://mgh.harvard.edu/psychiatry',
      description: 'Comprehensive psychiatry training with research in mood disorders and psychotherapy.',
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
      positions: 16,
      programDirector: 'Dr. David Miller, MD',
      website: 'https://mgh.harvard.edu/radiology',
      description: 'Cutting-edge radiology training with advanced imaging and interventional procedures.',
      established: 1955
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
      positions: 12,
      programDirector: 'Dr. Susan Garcia, MD',
      website: 'https://mgh.harvard.edu/pathology',
      description: 'Comprehensive pathology training with molecular diagnostics and surgical pathology.',
      established: 1900
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
      programDirector: 'Dr. Thomas Anderson, MD',
      website: 'https://mgh.harvard.edu/orthopedic-surgery',
      description: 'Premier orthopedic surgery training with sports medicine and trauma focus.',
      established: 1930
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
      positions: 8,
      programDirector: 'Dr. Lisa Martinez, MD',
      website: 'https://mgh.harvard.edu/neurosurgery',
      description: 'World-renowned neurosurgery training with brain tumor and spine surgery expertise.',
      established: 1935
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
      positions: 8,
      programDirector: 'Dr. Kevin Thompson, MD',
      website: 'https://mgh.harvard.edu/dermatology',
      description: 'Premier dermatology training with dermatopathology and cosmetic dermatology focus.',
      established: 1940
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
      positions: 12,
      programDirector: 'Dr. Rachel Clark, MD',
      website: 'https://mgh.harvard.edu/ophthalmology',
      description: 'World-class ophthalmology training with retinal and corneal subspecialties.',
      established: 1925
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
      positions: 32,
      programDirector: 'Dr. Steven Lewis, MD',
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
      positions: 36,
      programDirector: 'Dr. Michelle Walker, MD',
      website: 'https://mgh.harvard.edu/pediatrics',
      description: 'Comprehensive pediatric training with subspecialty rotations and research opportunities.',
      established: 1920
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
      positions: 20,
      programDirector: 'Dr. Daniel Young, MD',
      website: 'https://mgh.harvard.edu/obgyn',
      description: 'Comprehensive OB/GYN training with maternal-fetal medicine and reproductive endocrinology.',
      established: 1925
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
      programDirector: 'Dr. Laura Hall, MD',
      website: 'https://mgh.harvard.edu/urology',
      description: 'Premier urology training with robotic surgery and urologic oncology focus.',
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
      description: 'Premier surgical training with minimally invasive and transplant surgery focus.',
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
      description: 'High-volume emergency medicine training with trauma and critical care emphasis.',
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
      established: 1960
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
      positions: 16,
      programDirector: 'Dr. Robert Kim, MD',
      website: 'https://ucla.edu/psychiatry',
      description: 'Comprehensive psychiatry training with research in mood disorders and addiction.',
      established: 1965
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
      positions: 12,
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
      positions: 16,
      programDirector: 'Dr. David Lee, MD',
      website: 'https://ucla.edu/orthopedic-surgery',
      description: 'Premier orthopedic surgery training with sports medicine and joint replacement.',
      established: 1965
    },
    {
      id: '43',
      programName: 'Dermatology Residency',
      institution: 'UCLA Medical Center',
      profession: 'Physician',
      specialty: 'Dermatology',
      city: 'Los Angeles',
      state: 'CA',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 8,
      programDirector: 'Dr. Jennifer Brown, MD',
      website: 'https://ucla.edu/dermatology',
      description: 'Premier dermatology training with dermatopathology and cosmetic procedures.',
      established: 1975
    },
    {
      id: '44',
      programName: 'Ophthalmology Residency',
      institution: 'UCLA Medical Center',
      profession: 'Physician',
      specialty: 'Ophthalmology',
      city: 'Los Angeles',
      state: 'CA',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 12,
      programDirector: 'Dr. Thomas White, MD',
      website: 'https://ucla.edu/ophthalmology',
      description: 'World-class ophthalmology training with retinal and corneal subspecialties.',
      established: 1970
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
      positions: 28,
      programDirector: 'Dr. Amanda Davis, MD',
      website: 'https://ucla.edu/family-medicine',
      description: 'Community-focused family medicine training with underserved population emphasis.',
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
      positions: 32,
      programDirector: 'Dr. Kevin Martinez, MD',
      website: 'https://ucla.edu/pediatrics',
      description: 'Comprehensive pediatric training with subspecialty rotations and research.',
      established: 1965
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
      positions: 16,
      programDirector: 'Dr. Rachel Thompson, MD',
      website: 'https://ucla.edu/obgyn',
      description: 'Comprehensive OB/GYN training with maternal-fetal medicine and gynecologic oncology.',
      established: 1970
    },
    {
      id: '48',
      programName: 'Pathology Residency',
      institution: 'UCLA Medical Center',
      profession: 'Physician',
      specialty: 'Pathology',
      city: 'Los Angeles',
      state: 'CA',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 12,
      programDirector: 'Dr. Steven Clark, MD',
      website: 'https://ucla.edu/pathology',
      description: 'Comprehensive pathology training with molecular diagnostics and surgical pathology.',
      established: 1965
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
      programDirector: 'Dr. Michelle Lewis, MD',
      website: 'https://mayo.edu/internal-medicine',
      description: 'World-renowned internal medicine training with integrated research and patient care.',
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
      programDirector: 'Dr. Daniel Walker, MD',
      website: 'https://mayo.edu/surgery',
      description: 'Premier surgical training with innovation in minimally invasive techniques.',
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
      programDirector: 'Dr. Laura Young, MD',
      website: 'https://mayo.edu/emergency-medicine',
      description: 'Comprehensive emergency medicine training with rural and urban experience.',
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
      programDirector: 'Dr. Sandra Walker, MD',
      website: 'https://mayo.edu/anesthesiology',
      description: 'Advanced anesthesiology training with cardiac and neuroanesthesia focus.',
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
      positions: 16,
      programDirector: 'Dr. John Adams, MD',
      website: 'https://mayo.edu/neurology',
      description: 'World-class neurology training with movement disorders and epilepsy expertise.',
      established: 1920
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
      positions: 12,
      programDirector: 'Dr. Elizabeth Smith, MD',
      website: 'https://mayo.edu/psychiatry',
      description: 'Comprehensive psychiatry training with integrated medical and psychiatric care.',
      established: 1945
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
      positions: 16,
      programDirector: 'Dr. Robert Johnson, MD',
      website: 'https://mayo.edu/radiology',
      description: 'State-of-the-art radiology training with advanced imaging technologies.',
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
      programDirector: 'Dr. Patricia Brown, MD',
      website: 'https://mayo.edu/orthopedic-surgery',
      description: 'Premier orthopedic surgery training with sports medicine and joint replacement.',
      established: 1930
    },
    {
      id: '57',
      programName: 'Dermatology Residency',
      institution: 'Mayo Clinic Rochester',
      profession: 'Physician',
      specialty: 'Dermatology',
      city: 'Rochester',
      state: 'MN',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 8,
      programDirector: 'Dr. Michael Davis, MD',
      website: 'https://mayo.edu/dermatology',
      description: 'Premier dermatology training with dermatopathology and Mohs surgery.',
      established: 1950
    },
    {
      id: '58',
      programName: 'Family Medicine Residency',
      institution: 'Mayo Clinic Rochester',
      profession: 'Physician',
      specialty: 'Family Medicine',
      city: 'Rochester',
      state: 'MN',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 24,
      programDirector: 'Dr. Jennifer Wilson, MD',
      website: 'https://mayo.edu/family-medicine',
      description: 'Community-based family medicine training with rural health focus.',
      established: 1970
    },
    {
      id: '59',
      programName: 'Pediatrics Residency',
      institution: 'Mayo Clinic Rochester',
      profession: 'Physician',
      specialty: 'Pediatrics',
      city: 'Rochester',
      state: 'MN',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 28,
      programDirector: 'Dr. David Miller, MD',
      website: 'https://mayo.edu/pediatrics',
      description: 'Comprehensive pediatric training with subspecialty rotations and research.',
      established: 1920
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
      positions: 12,
      programDirector: 'Dr. Susan Garcia, MD',
      website: 'https://mayo.edu/pathology',
      description: 'Comprehensive pathology training with molecular diagnostics expertise.',
      established: 1915
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
      positions: 40,
      programDirector: 'Dr. Thomas Anderson, MD',
      website: 'https://clevelandclinic.org/internal-medicine',
      description: 'Comprehensive internal medicine training with cardiovascular disease emphasis.',
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
      programDirector: 'Dr. Lisa Martinez, MD',
      website: 'https://clevelandclinic.org/surgery',
      description: 'Premier surgical training with transplant and cardiac surgery focus.',
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
      programDirector: 'Dr. Kevin Thompson, MD',
      website: 'https://clevelandclinic.org/emergency-medicine',
      description: 'High-volume emergency medicine training with trauma and critical care.',
      established: 1975
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
      positions: 16,
      programDirector: 'Dr. Rachel Clark, MD',
      website: 'https://clevelandclinic.org/anesthesiology',
      description: 'Advanced anesthesiology training with cardiac and transplant anesthesia.',
      established: 1950
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
      positions: 12,
      programDirector: 'Dr. Steven Lewis, MD',
      website: 'https://clevelandclinic.org/neurology',
      description: 'World-class neurology training with stroke and movement disorders expertise.',
      established: 1930
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
      programDirector: 'Dr. Michelle Walker, MD',
      website: 'https://clevelandclinic.org/radiology',
      description: 'State-of-the-art radiology training with interventional and cardiac imaging.',
      established: 1960
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
      positions: 12,
      programDirector: 'Dr. Daniel Young, MD',
      website: 'https://clevelandclinic.org/orthopedic-surgery',
      description: 'Premier orthopedic surgery training with sports medicine and joint replacement.',
      established: 1940
    },
    {
      id: '68',
      programName: 'Neurosurgery Residency',
      institution: 'Cleveland Clinic',
      profession: 'Physician',
      specialty: 'Neurosurgery',
      city: 'Cleveland',
      state: 'OH',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 8,
      programDirector: 'Dr. Laura Hall, MD',
      website: 'https://clevelandclinic.org/neurosurgery',
      description: 'World-renowned neurosurgery training with brain tumor and spine surgery.',
      established: 1945
    },
    {
      id: '69',
      programName: 'Urology Residency',
      institution: 'Cleveland Clinic',
      profession: 'Physician',
      specialty: 'Urology',
      city: 'Cleveland',
      state: 'OH',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 8,
      programDirector: 'Dr. Sarah Johnson, MD',
      website: 'https://clevelandclinic.org/urology',
      description: 'Premier urology training with robotic surgery and urologic oncology.',
      established: 1950
    },
    {
      id: '70',
      programName: 'Family Medicine Residency',
      institution: 'Cleveland Clinic',
      profession: 'Physician',
      specialty: 'Family Medicine',
      city: 'Cleveland',
      state: 'OH',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 20,
      programDirector: 'Dr. Michael Chen, MD',
      website: 'https://clevelandclinic.org/family-medicine',
      description: 'Community-focused family medicine training with urban health emphasis.',
      established: 1980
    },
    {
      id: '71',
      programName: 'Pediatrics Residency',
      institution: 'Cleveland Clinic',
      profession: 'Physician',
      specialty: 'Pediatrics',
      city: 'Cleveland',
      state: 'OH',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 24,
      programDirector: 'Dr. Emily Rodriguez, MD',
      website: 'https://clevelandclinic.org/pediatrics',
      description: 'Comprehensive pediatric training with subspecialty rotations and research.',
      established: 1930
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
      positions: 36,
      programDirector: 'Dr. James Wilson, MD',
      website: 'https://stanford.edu/internal-medicine',
      description: 'Premier internal medicine training with Silicon Valley innovation and research focus.',
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
      programDirector: 'Dr. Lisa Anderson, MD',
      website: 'https://stanford.edu/surgery',
      description: 'Innovative surgical training with robotic surgery and transplant focus.',
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
      positions: 16,
      programDirector: 'Dr. Robert Kim, MD',
      website: 'https://stanford.edu/emergency-medicine',
      description: 'High-acuity emergency medicine training with trauma and critical care.',
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
      positions: 12,
      programDirector: 'Dr. Maria Garcia, MD',
      website: 'https://stanford.edu/anesthesiology',
      description: 'Advanced anesthesiology training with cardiac and pediatric subspecialties.',
      established: 1965
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
      positions: 12,
      programDirector: 'Dr. David Lee, MD',
      website: 'https://stanford.edu/neurology',
      description: 'Cutting-edge neurology training with movement disorders and epilepsy research.',
      established: 1960
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
      positions: 8,
      programDirector: 'Dr. Jennifer Brown, MD',
      website: 'https://stanford.edu/radiology',
      description: 'State-of-the-art radiology training with AI and advanced imaging technologies.',
      established: 1970
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
      programDirector: 'Dr. Thomas White, MD',
      website: 'https://stanford.edu/orthopedic-surgery',
      description: 'Premier orthopedic surgery training with sports medicine and innovation focus.',
      established: 1965
    },
    {
      id: '79',
      programName: 'Dermatology Residency',
      institution: 'Stanford University Medical Center',
      profession: 'Physician',
      specialty: 'Dermatology',
      city: 'Stanford',
      state: 'CA',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 4,
      programDirector: 'Dr. Amanda Davis, MD',
      website: 'https://stanford.edu/dermatology',
      description: 'Premier dermatology training with dermatopathology and cosmetic procedures.',
      established: 1975
    },
    {
      id: '80',
      programName: 'Family Medicine Residency',
      institution: 'Stanford University Medical Center',
      profession: 'Physician',
      specialty: 'Family Medicine',
      city: 'Stanford',
      state: 'CA',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 24,
      programDirector: 'Dr. Kevin Martinez, MD',
      website: 'https://stanford.edu/family-medicine',
      description: 'Community-based family medicine training with rural and underserved population focus.',
      established: 1972
    },
    {
      id: '81',
      programName: 'Pediatrics Residency',
      institution: 'Stanford University Medical Center',
      profession: 'Physician',
      specialty: 'Pediatrics',
      city: 'Stanford',
      state: 'CA',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 20,
      programDirector: 'Dr. Rachel Thompson, MD',
      website: 'https://stanford.edu/pediatrics',
      description: 'Comprehensive pediatric training with subspecialty rotations and research.',
      established: 1960
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
      positions: 32,
      programDirector: 'Dr. Steven Clark, MD',
      website: 'https://ucsf.edu/internal-medicine',
      description: 'Premier internal medicine training with public health and global health focus.',
      established: 1958
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
      programDirector: 'Dr. Michelle Lewis, MD',
      website: 'https://ucsf.edu/surgery',
      description: 'Innovative surgical training with transplant and minimally invasive surgery.',
      established: 1958
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
      positions: 32,
      programDirector: 'Dr. Daniel Walker, MD',
      website: 'https://ucsf.edu/emergency-medicine',
      description: 'High-volume emergency medicine training with trauma, pediatric, and critical care rotations.',
      established: 1978
    },
    {
      id: '85',
      programName: 'Anesthesiology Residency',
      institution: 'UCSF Medical Center',
      profession: 'Physician',
      specialty: 'Anesthesiology',
      city: 'San Francisco',
      state: 'CA',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 16,
      programDirector: 'Dr. Laura Young, MD',
      website: 'https://ucsf.edu/anesthesiology',
      description: 'Advanced anesthesiology training with cardiac and neuroanesthesia focus.',
      established: 1965
    },
    {
      id: '86',
      programName: 'Neurology Residency',
      institution: 'UCSF Medical Center',
      profession: 'Physician',
      specialty: 'Neurology',
      city: 'San Francisco',
      state: 'CA',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 16,
      programDirector: 'Dr. Sandra Walker, MD',
      website: 'https://ucsf.edu/neurology',
      description: 'World-class neurology training with stroke, epilepsy, and movement disorders.',
      established: 1960
    },
    {
      id: '87',
      programName: 'Psychiatry Residency',
      institution: 'UCSF Medical Center',
      profession: 'Physician',
      specialty: 'Psychiatry',
      city: 'San Francisco',
      state: 'CA',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 12,
      programDirector: 'Dr. John Adams, MD',
      website: 'https://ucsf.edu/psychiatry',
      description: 'Comprehensive psychiatry training with research in mood disorders and addiction.',
      established: 1970
    },
    {
      id: '88',
      programName: 'Radiology Residency',
      institution: 'UCSF Medical Center',
      profession: 'Physician',
      specialty: 'Radiology',
      city: 'San Francisco',
      state: 'CA',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 12,
      programDirector: 'Dr. Elizabeth Smith, MD',
      website: 'https://ucsf.edu/radiology',
      description: 'State-of-the-art radiology training with interventional and neuroradiology.',
      established: 1975
    },
    {
      id: '89',
      programName: 'Family Medicine Residency',
      institution: 'UCSF Medical Center',
      profession: 'Physician',
      specialty: 'Family Medicine',
      city: 'San Francisco',
      state: 'CA',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 20,
      programDirector: 'Dr. Robert Johnson, MD',
      website: 'https://ucsf.edu/family-medicine',
      description: 'Community-focused family medicine training with urban health and social justice.',
      established: 1975
    },
    {
      id: '90',
      programName: 'Pediatrics Residency',
      institution: 'UCSF Medical Center',
      profession: 'Physician',
      specialty: 'Pediatrics',
      city: 'San Francisco',
      state: 'CA',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 24,
      programDirector: 'Dr. Patricia Brown, MD',
      website: 'https://ucsf.edu/pediatrics',
      description: 'Comprehensive pediatric training with subspecialty rotations and global health.',
      established: 1960
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
      positions: 28,
      programDirector: 'Dr. Michael Davis, MD',
      website: 'https://cedars-sinai.edu/internal-medicine',
      description: 'Premier internal medicine training with cardiovascular disease emphasis.',
      established: 1961
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
      programDirector: 'Dr. Jennifer Wilson, MD',
      website: 'https://cedars-sinai.edu/surgery',
      description: 'Comprehensive surgical training with minimally invasive and robotic surgery.',
      established: 1961
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
      positions: 16,
      programDirector: 'Dr. David Miller, MD',
      website: 'https://cedars-sinai.edu/emergency-medicine',
      description: 'High-acuity emergency medicine training with trauma and critical care.',
      established: 1980
    },
    {
      id: '94',
      programName: 'Anesthesiology Residency',
      institution: 'Cedars-Sinai Medical Center',
      profession: 'Physician',
      specialty: 'Anesthesiology',
      city: 'Los Angeles',
      state: 'CA',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 12,
      programDirector: 'Dr. Susan Garcia, MD',
      website: 'https://cedars-sinai.edu/anesthesiology',
      description: 'Advanced anesthesiology training with cardiac and obstetric anesthesia.',
      established: 1970
    },
    {
      id: '95',
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
      id: '96',
      programName: 'Radiology Residency',
      institution: 'Cedars-Sinai Medical Center',
      profession: 'Physician',
      specialty: 'Radiology',
      city: 'Los Angeles',
      state: 'CA',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 8,
      programDirector: 'Dr. Thomas Anderson, MD',
      website: 'https://cedars-sinai.edu/radiology',
      description: 'State-of-the-art radiology training with interventional and cardiac imaging.',
      established: 1975
    },
    {
      id: '97',
      programName: 'Orthopedic Surgery Residency',
      institution: 'Cedars-Sinai Medical Center',
      profession: 'Physician',
      specialty: 'Orthopedic Surgery',
      city: 'Los Angeles',
      state: 'CA',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 8,
      programDirector: 'Dr. Lisa Martinez, MD',
      website: 'https://cedars-sinai.edu/orthopedic-surgery',
      description: 'Premier orthopedic surgery training with sports medicine and joint replacement.',
      established: 1970
    },
    {
      id: '98',
      programName: 'Family Medicine Residency',
      institution: 'Cedars-Sinai Medical Center',
      profession: 'Physician',
      specialty: 'Family Medicine',
      city: 'Los Angeles',
      state: 'CA',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 16,
      programDirector: 'Dr. Kevin Thompson, MD',
      website: 'https://cedars-sinai.edu/family-medicine',
      description: 'Community-focused family medicine training with urban health emphasis.',
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
      positions: 24,
      programDirector: 'Dr. Rachel Clark, MD',
      website: 'https://mountsinai.org/internal-medicine',
      description: 'Premier internal medicine training with urban health and global medicine focus.',
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
      programDirector: 'Dr. Steven Lewis, MD',
      website: 'https://mountsinai.org/surgery',
      description: 'Comprehensive surgical training with transplant and minimally invasive surgery.',
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
      positions: 12,
      programDirector: 'Dr. Michelle Walker, MD',
      website: 'https://mountsinai.org/emergency-medicine',
      description: 'High-volume emergency medicine training with trauma and critical care.',
      established: 1975
    },
    {
      id: '102',
      programName: 'Anesthesiology Residency',
      institution: 'Mount Sinai Hospital',
      profession: 'Physician',
      specialty: 'Anesthesiology',
      city: 'New York',
      state: 'NY',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 8,
      programDirector: 'Dr. Daniel Young, MD',
      website: 'https://mountsinai.org/anesthesiology',
      description: 'Advanced anesthesiology training with cardiac and transplant anesthesia.',
      established: 1960
    },
    {
      id: '103',
      programName: 'Family Medicine Residency',
      institution: 'Mount Sinai Hospital',
      profession: 'Physician',
      specialty: 'Family Medicine',
      city: 'New York',
      state: 'NY',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 12,
      programDirector: 'Dr. Laura Hall, MD',
      website: 'https://mountsinai.org/family-medicine',
      description: 'Community-focused family medicine training with urban health and social justice.',
      established: 1980
    },
    {
      id: '104',
      programName: 'Pediatrics Residency',
      institution: 'Mount Sinai Hospital',
      profession: 'Physician',
      specialty: 'Pediatrics',
      city: 'New York',
      state: 'NY',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 16,
      programDirector: 'Dr. Sarah Johnson, MD',
      website: 'https://mountsinai.org/pediatrics',
      description: 'Comprehensive pediatric training with subspecialty rotations and urban health.',
      established: 1860
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
      positions: 16,
      programDirector: 'Dr. Michael Chen, MD',
      website: 'https://communitymedical.org/internal-medicine',
      description: 'Community-based internal medicine training with primary care emphasis.',
      established: 2000
    },
    {
      id: '106',
      programName: 'Emergency Medicine Residency',
      institution: 'Community Medical Center',
      profession: 'Physician',
      specialty: 'Emergency Medicine',
      city: 'Phoenix',
      state: 'AZ',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 8,
      programDirector: 'Dr. Emily Rodriguez, MD',
      website: 'https://communitymedical.org/emergency-medicine',
      description: 'Community emergency medicine training with rural and underserved focus.',
      established: 2005
    },
    {
      id: '107',
      programName: 'Family Medicine Residency',
      institution: 'Community Medical Center',
      profession: 'Physician',
      specialty: 'Family Medicine',
      city: 'Phoenix',
      state: 'AZ',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 12,
      programDirector: 'Dr. James Wilson, MD',
      website: 'https://communitymedical.org/family-medicine',
      description: 'Community-based family medicine training with rural and underserved population focus.',
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
      positions: 8,
      programDirector: 'Dr. Lisa Anderson, MD',
      website: 'https://communitymedical.org/pediatrics',
      description: 'Community pediatric training with general pediatrics and adolescent medicine.',
      established: 2010
    },
    {
      id: '109',
      programName: 'Surgery Residency Program',
      institution: 'Community Medical Center',
      profession: 'Physician',
      specialty: 'Surgery',
      city: 'Phoenix',
      state: 'AZ',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 8,
      programDirector: 'Dr. Robert Kim, MD',
      website: 'https://communitymedical.org/surgery',
      description: 'Community surgical training with general surgery and trauma focus.',
      established: 2015
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
        program.programDirector.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (filters.profession) {
      filtered = filtered.filter(program =>
        program.profession.toLowerCase().includes(filters.profession.toLowerCase())
      );
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
    
    // Apply institution filter if selected
    if (selectedInstitution) {
      filtered = filtered.filter(program => program.institution === selectedInstitution);
    }
    
    setResults(filtered);
    setIsSearching(false);
  };

  const handleSort = (field: 'programName' | 'institution' | 'specialty' | 'state') => {
    const newOrder = sortBy === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortBy(field);
    setSortOrder(newOrder);
    
    const sorted = [...results].sort((a, b) => {
      let aValue = '';
      let bValue = '';
      
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
        case 'state':
          aValue = a.state.toLowerCase();
          bValue = b.state.toLowerCase();
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

  const getStatusColor = (programType: string) => {
    switch (programType) {
      case 'Residency':
        return 'bg-green-100 text-green-800';
      case 'Fellowship':
        return 'bg-blue-100 text-blue-800';
      case 'Internship':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSelectProgram = (programId: string) => {
    const newSelected = new Set(selectedPrograms);
    if (newSelected.has(programId)) {
      newSelected.delete(programId);
    } else {
      newSelected.add(programId);
    }
    setSelectedPrograms(newSelected);
    setShowBulkActions(newSelected.size > 0);
  };

  const handleSelectAll = () => {
    if (selectedPrograms.size === results.length) {
      setSelectedPrograms(new Set());
      setShowBulkActions(false);
    } else {
      setSelectedPrograms(new Set(results.map(p => p.id)));
      setShowBulkActions(true);
    }
  };

  const handleBulkAction = (action: 'save' | 'pdf' | 'csv') => {
    const selectedData = results.filter(p => selectedPrograms.has(p.id));
    
    switch (action) {
      case 'save':
        console.log('Saving to list:', selectedData);
        alert(`Saved ${selectedData.length} programs to list`);
        break;
      case 'pdf':
        console.log('Exporting to PDF:', selectedData);
        alert(`Exporting ${selectedData.length} programs to PDF`);
        break;
      case 'csv':
        console.log('Exporting to CSV:', selectedData);
        // Create CSV content
        const csvContent = [
          'Program Name,Institution,Specialty,City,State,Program Type,Positions,Director',
          ...selectedData.map(p => 
            `"${p.programName}","${p.institution}","${p.specialty}","${p.city}","${p.state}","${p.programType}","${p.positions}","${p.programDirector}"`
          )
        ].join('\n');
        
        // Download CSV
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `gme_programs_export_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        break;
    }
  };

  // Group programs by institution for institution view
  const groupedByInstitution = mockResults.reduce((acc, program) => {
    if (!acc[program.institution]) {
      acc[program.institution] = [];
    }
    acc[program.institution].push(program);
    return acc;
  }, {} as Record<string, GMEProgram[]>);

  const institutionStats = Object.entries(groupedByInstitution).map(([institution, programs]) => ({
    institution,
    programCount: programs.length,
    totalPositions: programs.reduce((sum, p) => sum + p.positions, 0),
    specialties: [...new Set(programs.map(p => p.specialty))],
    city: programs[0].city,
    state: programs[0].state
  }));

  const handleViewInstitutionPrograms = (institution: string) => {
    setSelectedInstitution(institution);
    setViewMode('programs');
    // Filter results to show only programs from this institution
    const institutionPrograms = mockResults.filter(p => p.institution === institution);
    setResults(institutionPrograms);
  };

  const handleBackToInstitutions = () => {
    setSelectedInstitution(null);
    setViewMode('institutions');
    setResults([]);
  };

  return (
    <Layout breadcrumbs={[{ label: 'GME Program Search' }]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <GraduationCap className="h-6 w-6 mr-3" />
                Graduate Medical Education Programs
              </h1>
              <p className="text-gray-600 mt-1">
                Search and explore GME programs by profession, specialty, subspecialty, and state.
              </p>
            </div>
          </div>
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
                  placeholder="Search by program name, institution, specialty, or director..."
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
                    <option value="Anesthesiology">Anesthesiology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Psychiatry">Psychiatry</option>
                    <option value="Radiology">Radiology</option>
                    <option value="Pathology">Pathology</option>
                    <option value="Orthopedic Surgery">Orthopedic Surgery</option>
                    <option value="Neurosurgery">Neurosurgery</option>
                    <option value="Urology">Urology</option>
                    <option value="Dermatology">Dermatology</option>
                    <option value="Ophthalmology">Ophthalmology</option>
                    <option value="Otolaryngology">Otolaryngology</option>
                    <option value="Plastic Surgery">Plastic Surgery</option>
                    <option value="Family Medicine">Family Medicine</option>
                    <option value="Pediatrics">Pediatrics</option>
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
                    <option value="TX">Texas</option>
                    <option value="FL">Florida</option>
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
                    <option value="Internship">Internship</option>
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
              <h2 className="text-lg font-semibold text-gray-900">
                Medical Institutions ({institutionStats.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {institutionStats.map((institution) => (
                <div key={institution.institution} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                        <Building className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{institution.institution}</h3>
                        <p className="text-sm text-gray-500 flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {institution.city}, {institution.state}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Programs</span>
                      <span className="text-sm font-medium text-gray-900">{institution.programCount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Positions</span>
                      <span className="text-sm font-medium text-gray-900">{institution.totalPositions}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Specialties</span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {institution.specialties.slice(0, 3).map((specialty, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {specialty}
                          </span>
                        ))}
                        {institution.specialties.length > 3 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            +{institution.specialties.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleViewInstitutionPrograms(institution.institution)}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View Programs</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Programs Results */}
        {(viewMode === 'programs' || selectedInstitution) && results.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {selectedInstitution && (
                    <button
                      onClick={handleBackToInstitutions}
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span>Back to Institutions</span>
                    </button>
                  )}
                  <h2 className="text-lg font-semibold text-gray-900">
                    {selectedInstitution ? `${selectedInstitution} Programs (${results.length})` : `Search Results (${results.length})`}
                  </h2>
                  {selectedPrograms.size > 0 && (
                    <span className="text-sm text-blue-600 font-medium">
                      {selectedPrograms.size} selected
                    </span>
                  )}
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
                      onClick={() => handleSort('state')}
                      className={`flex items-center space-x-1 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        sortBy === 'state' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <span>State</span>
                      {sortBy === 'state' ? (
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
                      {selectedPrograms.size} program{selectedPrograms.size !== 1 ? 's' : ''} selected
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
                    {selectedPrograms.size === results.length ? (
                      <CheckSquare className="h-4 w-4 text-blue-600" />
                    ) : (
                      <Square className="h-4 w-4" />
                    )}
                    <span>
                      {selectedPrograms.size === results.length ? 'Deselect All' : 'Select All'}
                    </span>
                  </button>
                </div>
              )}
            </div>
            <div className="divide-y divide-gray-200">
              {results.map((program) => (
                <div key={program.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleSelectProgram(program.id)}
                        className="flex items-center justify-center w-5 h-5 text-blue-600 hover:text-blue-700"
                      >
                        {selectedPrograms.has(program.id) ? (
                          <CheckSquare className="h-5 w-5" />
                        ) : (
                          <Square className="h-5 w-5 text-gray-400 hover:text-blue-600" />
                        )}
                      </button>
                      <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                        <GraduationCap className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-medium text-gray-900">
                            {program.programName}
                          </h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(program.programType)}`}>
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
        {results.length === 0 && searchQuery && !isSearching && viewMode === 'programs' && (
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