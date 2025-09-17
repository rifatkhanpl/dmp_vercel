import React, { useState } from 'react';
import { Layout } from '../Layout/Layout';
import { ErrorBoundary } from '../ErrorBoundary';
import { useDebounce } from '../../hooks/useDebounce';
import { SecurityUtils } from '../../utils/security';
import { useLocation } from 'react-router-dom';
import { 
  Search,
  Filter,
  Download,
  ChevronDown,
  X,
  Eye,
  Edit,
  GraduationCap,
  Building,
  MapPin,
  Users,
  Calendar,
  Globe,
  Mail,
  Phone,
  FileText,
  Bookmark,
  Ban,
  Trash2,
  Award,
  DollarSign
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
  associateDirector?: string;
  website: string;
  email: string;
  phone: string;
  applicationDeadline: string;
  interviewSeason: string;
  matchDate: string;
  established: number;
  duration: string;
  salaryPgy1?: number;
  salaryPgy2?: number;
  salaryPgy3?: number;
  benefits: string[];
  requirements: string[];
  statistics: {
    totalApplications: number;
    interviewsOffered: number;
    matchRate: string;
    boardPassRate: string;
  };
  managedBy?: string;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
}

export function GMEProgramSearch() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const institution = searchParams.get('institution');

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    profession: '',
    specialty: '',
    subspecialty: '',
    programType: '',
    state: '',
    accreditation: '',
    status: '',
    managedBy: ''
  });
  const [sortBy, setSortBy] = useState('programName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Mock GME program data
  const allPrograms: GMEProgram[] = [
    {
      id: '1',
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
      associateDirector: 'Dr. Michael Chen, MD',
      website: 'https://ucla.edu/internal-medicine',
      email: 'internal.medicine@ucla.edu',
      phone: '(310) 825-6301',
      applicationDeadline: 'October 15, 2024',
      interviewSeason: 'November 2024 - February 2025',
      matchDate: 'March 15, 2025',
      established: 1965,
      duration: '3 years',
      salaryPgy1: 65000,
      salaryPgy2: 67000,
      salaryPgy3: 69000,
      benefits: ['Health Insurance', 'Dental Insurance', 'Vision Insurance', 'Educational Allowance'],
      requirements: ['MD/DO Degree', 'USMLE Step 1', 'USMLE Step 2 CK', 'Letters of Recommendation'],
      statistics: {
        totalApplications: 2800,
        interviewsOffered: 180,
        matchRate: '95%',
        boardPassRate: '98%'
      },
      managedBy: 'Emily Rodriguez',
      status: 'active'
    },
    {
      id: '2',
      programName: 'Emergency Medicine Residency Program',
      institution: 'Johns Hopkins Hospital',
      profession: 'Physician',
      specialty: 'Emergency Medicine',
      city: 'Baltimore',
      state: 'MD',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 36,
      programDirector: 'Dr. Michael Chen, MD',
      website: 'https://hopkinsmedicine.org/emergency',
      email: 'emergency.medicine@jhmi.edu',
      phone: '(410) 955-5000',
      applicationDeadline: 'October 15, 2024',
      interviewSeason: 'November 2024 - February 2025',
      matchDate: 'March 15, 2025',
      established: 1978,
      duration: '4 years',
      salaryPgy1: 62000,
      salaryPgy2: 64000,
      salaryPgy3: 66000,
      benefits: ['Health Insurance', 'Malpractice Insurance', 'Educational Allowance', 'Housing Assistance'],
      requirements: ['MD/DO Degree', 'USMLE Step 1', 'USMLE Step 2 CK', 'Emergency Medicine Experience'],
      statistics: {
        totalApplications: 3200,
        interviewsOffered: 200,
        matchRate: '92%',
        boardPassRate: '96%'
      },
      managedBy: 'David Thompson',
      status: 'active'
    },
    {
      id: '3',
      programName: 'Cardiology Fellowship Program',
      institution: 'Mayo Clinic',
      profession: 'Physician',
      specialty: 'Cardiology',
      city: 'Rochester',
      state: 'MN',
      programType: 'Fellowship',
      accreditation: 'ACGME',
      positions: 12,
      programDirector: 'Dr. Emily Rodriguez, MD',
      website: 'https://mayoclinic.org/cardiology',
      email: 'cardiology.fellowship@mayo.edu',
      phone: '(507) 284-2511',
      applicationDeadline: 'January 15, 2025',
      interviewSeason: 'February 2025 - April 2025',
      matchDate: 'June 15, 2025',
      established: 1985,
      duration: '1 year',
      salaryPgy1: 75000,
      benefits: ['Health Insurance', 'Research Stipend', 'Conference Allowance'],
      requirements: ['Internal Medicine Residency', 'Board Certification', 'Research Experience'],
      statistics: {
        totalApplications: 450,
        interviewsOffered: 60,
        matchRate: '88%',
        boardPassRate: '100%'
      },
      managedBy: 'Emily Rodriguez',
      status: 'active'
    },
    {
      id: '4',
      programName: 'Family Medicine Residency Program',
      institution: 'University of Texas Southwestern',
      profession: 'Physician',
      specialty: 'Family Medicine',
      city: 'Dallas',
      state: 'TX',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 24,
      programDirector: 'Dr. David Wilson, MD',
      website: 'https://utsouthwestern.edu/family-medicine',
      email: 'family.medicine@utsouthwestern.edu',
      phone: '(214) 648-3111',
      applicationDeadline: 'October 15, 2024',
      interviewSeason: 'November 2024 - February 2025',
      matchDate: 'March 15, 2025',
      established: 1972,
      duration: '3 years',
      salaryPgy1: 58000,
      salaryPgy2: 60000,
      salaryPgy3: 62000,
      benefits: ['Health Insurance', 'Dental Insurance', 'Educational Allowance', 'Vacation Time'],
      requirements: ['MD/DO Degree', 'USMLE Step 1', 'USMLE Step 2 CK', 'Primary Care Interest'],
      statistics: {
        totalApplications: 1800,
        interviewsOffered: 120,
        matchRate: '97%',
        boardPassRate: '94%'
      },
      managedBy: 'David Thompson',
      status: 'active'
    },
    {
      id: '5',
      programName: 'Pediatrics Residency Program',
      institution: 'Boston Children\'s Hospital',
      profession: 'Physician',
      specialty: 'Pediatrics',
      city: 'Boston',
      state: 'MA',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 42,
      programDirector: 'Dr. Lisa Thompson, MD',
      website: 'https://childrenshospital.org/pediatrics',
      email: 'pediatrics.residency@childrens.harvard.edu',
      phone: '(617) 355-6000',
      applicationDeadline: 'October 15, 2024',
      interviewSeason: 'November 2024 - February 2025',
      matchDate: 'March 15, 2025',
      established: 1960,
      duration: '3 years',
      salaryPgy1: 63000,
      salaryPgy2: 65000,
      salaryPgy3: 67000,
      benefits: ['Health Insurance', 'Childcare Assistance', 'Educational Allowance', 'Research Support'],
      requirements: ['MD/DO Degree', 'USMLE Step 1', 'USMLE Step 2 CK', 'Pediatric Experience'],
      statistics: {
        totalApplications: 2400,
        interviewsOffered: 160,
        matchRate: '93%',
        boardPassRate: '97%'
      },
      managedBy: 'Emily Rodriguez',
      status: 'active'
    },
    {
      id: '6',
      programName: 'Surgery Residency Program',
      institution: 'Stanford University Medical Center',
      profession: 'Physician',
      specialty: 'Surgery',
      city: 'Stanford',
      state: 'CA',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 18,
      programDirector: 'Dr. Robert Martinez, MD',
      website: 'https://med.stanford.edu/surgery',
      email: 'surgery.residency@stanford.edu',
      phone: '(650) 723-4000',
      applicationDeadline: 'October 15, 2024',
      interviewSeason: 'November 2024 - February 2025',
      matchDate: 'March 15, 2025',
      established: 1970,
      duration: '5 years',
      salaryPgy1: 66000,
      salaryPgy2: 68000,
      salaryPgy3: 70000,
      benefits: ['Health Insurance', 'Malpractice Insurance', 'Research Opportunities', 'Conference Support'],
      requirements: ['MD/DO Degree', 'USMLE Step 1', 'USMLE Step 2 CK', 'Surgical Experience', 'Research Experience'],
      statistics: {
        totalApplications: 1200,
        interviewsOffered: 80,
        matchRate: '89%',
        boardPassRate: '95%'
      },
      managedBy: 'David Thompson',
      status: 'active'
    },
    {
      id: '7',
      programName: 'Psychiatry Residency Program',
      institution: 'Harvard Medical School',
      profession: 'Physician',
      specialty: 'Psychiatry',
      city: 'Boston',
      state: 'MA',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 28,
      programDirector: 'Dr. Amanda Foster, MD',
      website: 'https://hms.harvard.edu/psychiatry',
      email: 'psychiatry.residency@hms.harvard.edu',
      phone: '(617) 432-1000',
      applicationDeadline: 'October 15, 2024',
      interviewSeason: 'November 2024 - February 2025',
      matchDate: 'March 15, 2025',
      established: 1968,
      duration: '4 years',
      salaryPgy1: 64000,
      salaryPgy2: 66000,
      salaryPgy3: 68000,
      benefits: ['Health Insurance', 'Mental Health Support', 'Educational Allowance', 'Research Funding'],
      requirements: ['MD/DO Degree', 'USMLE Step 1', 'USMLE Step 2 CK', 'Psychiatry Interest', 'Clinical Experience'],
      statistics: {
        totalApplications: 2100,
        interviewsOffered: 140,
        matchRate: '91%',
        boardPassRate: '93%'
      },
      managedBy: 'Emily Rodriguez',
      status: 'active'
    },
    {
      id: '8',
      programName: 'Radiology Residency Program',
      institution: 'University of Michigan',
      profession: 'Physician',
      specialty: 'Radiology',
      city: 'Ann Arbor',
      state: 'MI',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 20,
      programDirector: 'Dr. Jennifer Lee, MD',
      website: 'https://medicine.umich.edu/radiology',
      email: 'radiology.residency@umich.edu',
      phone: '(734) 936-4000',
      applicationDeadline: 'October 15, 2024',
      interviewSeason: 'November 2024 - February 2025',
      matchDate: 'March 15, 2025',
      established: 1975,
      duration: '4 years',
      salaryPgy1: 63000,
      salaryPgy2: 65000,
      salaryPgy3: 67000,
      benefits: ['Health Insurance', 'Technology Allowance', 'Educational Support', 'Conference Travel'],
      requirements: ['MD/DO Degree', 'USMLE Step 1', 'USMLE Step 2 CK', 'Strong Academic Record'],
      statistics: {
        totalApplications: 1600,
        interviewsOffered: 100,
        matchRate: '94%',
        boardPassRate: '99%'
      },
      managedBy: 'David Thompson',
      status: 'active'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter programs by institution if specified, then apply other filters
  const basePrograms = institution 
    ? allPrograms.filter(program => program.institution === institution)
    : allPrograms;

  // Apply search and filter logic with debounced search
  const filteredPrograms = basePrograms.filter(program => {
    const sanitizedQuery = SecurityUtils.sanitizeText(debouncedSearchQuery).toLowerCase();
    const matchesSearch = !sanitizedQuery || 
      program.programName.toLowerCase().includes(sanitizedQuery) ||
      program.institution.toLowerCase().includes(sanitizedQuery) ||
      program.specialty.toLowerCase().includes(sanitizedQuery) ||
      program.city.toLowerCase().includes(sanitizedQuery) ||
      program.state.toLowerCase().includes(sanitizedQuery) ||
      program.programDirector.toLowerCase().includes(sanitizedQuery);
    
    const matchesProfession = !filters.profession || program.profession === filters.profession;
    const matchesSpecialty = !filters.specialty || program.specialty === filters.specialty;
    const matchesSubspecialty = !filters.subspecialty || program.subspecialty === filters.subspecialty;
    const matchesProgramType = !filters.programType || program.programType === filters.programType;
    const matchesState = !filters.state || program.state === filters.state;
    const matchesAccreditation = !filters.accreditation || program.accreditation === filters.accreditation;
    const matchesStatus = !filters.status || program.status === filters.status;
    const matchesManagedBy = !filters.managedBy || program.managedBy === filters.managedBy;
    
    return matchesSearch && matchesProfession && matchesSpecialty && matchesSubspecialty && 
           matchesProgramType && matchesState && matchesAccreditation && matchesStatus && matchesManagedBy;
  }).sort((a, b) => {
    let aValue = a[sortBy as keyof GMEProgram] as string | number;
    let bValue = b[sortBy as keyof GMEProgram] as string | number;
    
    // Convert to string for comparison
    aValue = String(aValue);
    bValue = String(bValue);
    
    if (sortDirection === 'asc') {
      return aValue.localeCompare(bValue);
    } else {
      return bValue.localeCompare(aValue);
    }
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      profession: '',
      specialty: '',
      subspecialty: '',
      programType: '',
      state: '',
      accreditation: '',
      status: '',
      managedBy: ''
    });
    setSearchQuery('');
  };

  const handleProgramSelect = (programId: string) => {
    setSelectedPrograms(prev => 
      prev.includes(programId) 
        ? prev.filter(id => id !== programId)
        : [...prev, programId]
    );
  };

  const handleSelectAll = () => {
    if (selectedPrograms.length === filteredPrograms.length) {
      setSelectedPrograms([]);
    } else {
      setSelectedPrograms(filteredPrograms.map(p => p.id));
    }
  };

  const handleBulkAction = (action: string) => {
    switch (action) {
      case 'export':
        console.log('Exporting selected programs:', selectedPrograms);
        break;
      case 'reassign':
        console.log('Reassigning selected programs:', selectedPrograms);
        break;
      case 'deactivate':
        if (confirm(`Are you sure you want to deactivate ${selectedPrograms.length} programs?`)) {
          console.log('Deactivating selected programs:', selectedPrograms);
          setSelectedPrograms([]);
        }
        break;
      case 'delete':
        if (confirm(`Are you sure you want to delete ${selectedPrograms.length} programs? This action cannot be undone.`)) {
          console.log('Deleting selected programs:', selectedPrograms);
          setSelectedPrograms([]);
        }
        break;
    }
  };

  // Get unique values for filter options from base programs
  const professions = [...new Set(basePrograms.map(p => p.profession))];
  const specialties = [...new Set(basePrograms.map(p => p.specialty))];
  const subspecialties = [...new Set(basePrograms.map(p => p.subspecialty).filter(Boolean))];
  const programTypes = [...new Set(basePrograms.map(p => p.programType))];
  const states = [...new Set(basePrograms.map(p => p.state))];
  const accreditations = [...new Set(basePrograms.map(p => p.accreditation))];
  const statuses = ['active', 'inactive', 'pending', 'suspended'];
  const users = [...new Set(basePrograms.map(p => p.managedBy).filter(Boolean))];

  const activeFilterCount = Object.values(filters).filter(v => v).length;

  const breadcrumbs = institution 
    ? [
        { label: 'GME Program Search', href: '/gme-program-search' },
        { label: `Programs at ${institution}` }
      ]
    : [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'GME Program Search' }
      ];

  return (
    <ErrorBoundary>
      <Layout breadcrumbs={breadcrumbs}>
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {institution ? `Programs at ${institution}` : 'GME Program Search'}
            </h1>
            <p className="text-gray-600">
              {institution 
                ? `View and manage all GME programs at ${institution}`
                : 'Search and explore Graduate Medical Education programs across the United States'
              }
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="space-y-4">
              <div className="flex space-x-4">
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search programs by name, institution, specialty, location, or director..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    aria-label="Search GME programs"
                    maxLength={100}
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  aria-label="Toggle search filters"
                >
                  <Filter className="h-4 w-4" />
                  <span>Filters</span>
                  {activeFilterCount > 0 && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
                <div className="flex items-center space-x-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="programName">Sort by Program Name</option>
                    <option value="institution">Sort by Institution</option>
                    <option value="specialty">Sort by Specialty</option>
                    <option value="state">Sort by State</option>
                    <option value="positions">Sort by Positions</option>
                    <option value="established">Sort by Established</option>
                  </select>
                  <button
                    onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                    className="p-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    <ChevronDown className={`h-4 w-4 transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                  </button>
                </div>
                <button
                  onClick={() => console.log('Exporting all results')}
                  className="flex items-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </button>
              </div>

              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Profession
                    </label>
                    <select
                      value={filters.profession}
                      onChange={(e) => handleFilterChange('profession', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Professions</option>
                      {professions.map(profession => (
                        <option key={profession} value={profession}>{profession}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Specialty
                    </label>
                    <select
                      value={filters.specialty}
                      onChange={(e) => handleFilterChange('specialty', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Specialties</option>
                      {specialties.map(specialty => (
                        <option key={specialty} value={specialty}>{specialty}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Program Type
                    </label>
                    <select
                      value={filters.programType}
                      onChange={(e) => handleFilterChange('programType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Types</option>
                      {programTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <select
                      value={filters.state}
                      onChange={(e) => handleFilterChange('state', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All States</option>
                      {states.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Accreditation
                    </label>
                    <select
                      value={filters.accreditation}
                      onChange={(e) => handleFilterChange('accreditation', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Accreditations</option>
                      {accreditations.map(accreditation => (
                        <option key={accreditation} value={accreditation}>{accreditation}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={filters.status}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Statuses</option>
                      {statuses.map(status => (
                        <option key={status} value={status} className="capitalize">{status}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Managed By
                    </label>
                    <select
                      value={filters.managedBy}
                      onChange={(e) => handleFilterChange('managedBy', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Managers</option>
                      {users.map(user => (
                        <option key={user} value={user}>{user}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subspecialty
                    </label>
                    <select
                      value={filters.subspecialty}
                      onChange={(e) => handleFilterChange('subspecialty', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Subspecialties</option>
                      {subspecialties.map(subspecialty => (
                        <option key={subspecialty} value={subspecialty}>{subspecialty}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-4 flex justify-end">
                    <button
                      onClick={clearFilters}
                      className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
                    >
                      <X className="h-4 w-4" />
                      <span>Clear Filters</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedPrograms.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-900">
                  {selectedPrograms.length} program{selectedPrograms.length !== 1 ? 's' : ''} selected
                </span>
                <div className="relative">
                  <button
                    onClick={() => setActiveDropdown(activeDropdown === 'bulk' ? null : 'bulk')}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    <span>Bulk Actions</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  
                  {activeDropdown === 'bulk' && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                      <div className="py-1">
                        <button
                          onClick={() => {
                            setActiveDropdown(null);
                            handleBulkAction('export');
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Export Selected
                        </button>
                        <button
                          onClick={() => {
                            setActiveDropdown(null);
                            handleBulkAction('reassign');
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Users className="h-4 w-4 mr-2" />
                          Reassign Manager
                        </button>
                        <div className="border-t border-gray-100"></div>
                        <button
                          onClick={() => {
                            setActiveDropdown(null);
                            handleBulkAction('deactivate');
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Ban className="h-4 w-4 mr-2" />
                          Deactivate Selected
                        </button>
                        <button
                          onClick={() => {
                            setActiveDropdown(null);
                            handleBulkAction('delete');
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Selected
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Programs ({filteredPrograms.length})
                </h2>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedPrograms.length === filteredPrograms.length && filteredPrograms.length > 0}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="text-sm text-gray-600">Select All</label>
                </div>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {filteredPrograms.map((program) => (
                <div key={program.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedPrograms.includes(program.id)}
                        onChange={() => handleProgramSelect(program.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                        <GraduationCap className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-lg font-medium text-gray-900">
                            {program.programName}
                          </h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            program.programType === 'Residency' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-purple-100 text-purple-800'
                          }`}>
                            {program.programType}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(program.status)}`}>
                            {program.status}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-600">
                            <Building className="h-4 w-4 mr-2" />
                            {program.institution}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Stethoscope className="h-4 w-4 mr-2" />
                            {program.specialty}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="h-4 w-4 mr-2" />
                            {program.city}, {program.state}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              {program.positions} positions
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              Est. {program.established}
                            </div>
                            <div className="flex items-center">
                              <Award className="h-4 w-4 mr-1" />
                              {program.accreditation}
                            </div>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="h-4 w-4 mr-2" />
                            {program.email}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="h-4 w-4 mr-2" />
                            {program.phone}
                          </div>
                          {program.salaryPgy1 && (
                            <div className="flex items-center text-sm text-gray-600">
                              <DollarSign className="h-4 w-4 mr-2" />
                              Salary: ${program.salaryPgy1.toLocaleString()} - ${(program.salaryPgy3 || program.salaryPgy1).toLocaleString()}
                            </div>
                          )}
                          {program.managedBy && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Users className="h-4 w-4 mr-2" />
                              Managed by: {program.managedBy}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === program.id ? null : program.id)}
                        className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded-md"
                      >
                        <span>Actions</span>
                        <ChevronDown className="h-4 w-4" />
                      </button>
                      
                      {activeDropdown === program.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                          <div className="py-1">
                            <a
                              href={`/gme-program-detail?id=${program.id}`}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => setActiveDropdown(null)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </a>
                            <a
                              href={`/search?program=${encodeURIComponent(program.programName)}&institution=${encodeURIComponent(program.institution)}`}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => setActiveDropdown(null)}
                            >
                              <Users className="h-4 w-4 mr-2" />
                              View Alumni & Residents
                            </a>
                            <a
                              href={program.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => setActiveDropdown(null)}
                            >
                              <Globe className="h-4 w-4 mr-2" />
                              Visit Website
                            </a>
                            <button
                              onClick={() => {
                                setActiveDropdown(null);
                                // Handle edit action
                              }}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Program
                            </button>
                            <button
                              onClick={() => {
                                setActiveDropdown(null);
                                // Handle bookmark action
                              }}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <Bookmark className="h-4 w-4 mr-2" />
                              Bookmark Program
                            </button>
                            <button
                              onClick={() => {
                                setActiveDropdown(null);
                                // Handle export action
                              }}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Export Data
                            </button>
                            <div className="border-t border-gray-100"></div>
                            <button
                              onClick={() => {
                                setActiveDropdown(null);
                                if (confirm('Are you sure you want to deactivate this program?')) {
                                  // Handle deactivate action
                                }
                              }}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <Ban className="h-4 w-4 mr-2" />
                              Deactivate
                            </button>
                            <button
                              onClick={() => {
                                setActiveDropdown(null);
                                if (confirm('Are you sure you want to delete this program? This action cannot be undone.')) {
                                  // Handle delete action
                                }
                              }}
                              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Program
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    </ErrorBoundary>
  );
}