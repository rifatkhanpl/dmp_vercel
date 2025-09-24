import React, { useState } from 'react';
import { Layout } from '../Layout/Layout';
import { ErrorBoundary } from '../ErrorBoundary';
import { useDebounce } from '../../hooks/useDebounce';
import { SecurityUtils } from '../../utils/security';
import { 
  Search,
  Filter,
  Download,
  ChevronDown,
  X,
  Eye,
  Edit,
  Building,
  MapPin,
  Users,
  GraduationCap,
  Globe,
  Mail,
  Phone,
  Award,
  Calendar,
  Bookmark,
  Ban,
  Trash2,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface GMEInstitution {
  id: string;
  institutionName: string;
  institutionType: string;
  city: string;
  state: string;
  zipCode: string;
  website?: string;
  mainPhone?: string;
  mainEmail?: string;
  gmeOfficePhone?: string;
  gmeOfficeEmail?: string;
  dioName?: string;
  totalResidents: number;
  totalPrograms: number;
  accreditationStatus: string;
  accreditationExpiry?: string;
  establishedYear?: number;
  hospitalBeds?: number;
  traumaLevel?: string;
  teachingAffiliations?: string[];
  researchFocus?: string[];
  specialtyStrengths?: string[];
  status: 'active' | 'inactive' | 'probation';
  managedBy?: string;
}

export function GMEInstitutionSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedInstitutions, setSelectedInstitutions] = useState<string[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    institutionType: '',
    state: '',
    accreditationStatus: '',
    traumaLevel: '',
    status: '',
    managedBy: ''
  });
  const [sortBy, setSortBy] = useState('institutionName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Mock GME institution data
  const allInstitutions: GMEInstitution[] = [
    {
      id: '1',
      institutionName: 'UCLA Medical Center',
      institutionType: 'Academic Medical Center',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90095',
      website: 'https://www.uclahealth.org',
      mainPhone: '(310) 825-9111',
      mainEmail: 'info@uclahealth.org',
      gmeOfficePhone: '(310) 825-6301',
      gmeOfficeEmail: 'gme@mednet.ucla.edu',
      dioName: 'Dr. Sarah Johnson, MD',
      totalResidents: 450,
      totalPrograms: 18,
      accreditationStatus: 'Accredited',
      accreditationExpiry: '2027-06-30',
      establishedYear: 1955,
      hospitalBeds: 520,
      traumaLevel: 'Level I',
      teachingAffiliations: ['David Geffen School of Medicine at UCLA', 'UCLA Fielding School of Public Health'],
      researchFocus: ['Cancer Research', 'Neuroscience', 'Cardiovascular Medicine', 'Stem Cell Research'],
      specialtyStrengths: ['Internal Medicine', 'Surgery', 'Pediatrics', 'Neurology', 'Oncology'],
      status: 'active',
      managedBy: 'Emily Rodriguez'
    },
    {
      id: '2',
      institutionName: 'Johns Hopkins Hospital',
      institutionType: 'Academic Medical Center',
      city: 'Baltimore',
      state: 'MD',
      zipCode: '21287',
      website: 'https://www.hopkinsmedicine.org',
      mainPhone: '(410) 955-5000',
      mainEmail: 'info@jhmi.edu',
      gmeOfficePhone: '(410) 955-3496',
      gmeOfficeEmail: 'gme@jhmi.edu',
      dioName: 'Dr. Michael Chen, MD',
      totalResidents: 680,
      totalPrograms: 25,
      accreditationStatus: 'Accredited',
      accreditationExpiry: '2026-12-31',
      establishedYear: 1889,
      hospitalBeds: 1154,
      traumaLevel: 'Level I',
      teachingAffiliations: ['Johns Hopkins University School of Medicine', 'Johns Hopkins Bloomberg School of Public Health'],
      researchFocus: ['Oncology', 'Cardiology', 'Neurosurgery', 'Infectious Diseases', 'Public Health'],
      specialtyStrengths: ['Emergency Medicine', 'Surgery', 'Internal Medicine', 'Pediatrics', 'Psychiatry'],
      status: 'active',
      managedBy: 'David Thompson'
    },
    {
      id: '3',
      institutionName: 'Mayo Clinic',
      institutionType: 'Academic Medical Center',
      city: 'Rochester',
      state: 'MN',
      zipCode: '55905',
      website: 'https://www.mayoclinic.org',
      mainPhone: '(507) 284-2511',
      mainEmail: 'info@mayo.edu',
      gmeOfficePhone: '(507) 284-8678',
      gmeOfficeEmail: 'gme@mayo.edu',
      dioName: 'Dr. Emily Rodriguez, MD',
      totalResidents: 520,
      totalPrograms: 22,
      accreditationStatus: 'Accredited',
      accreditationExpiry: '2028-03-31',
      establishedYear: 1889,
      hospitalBeds: 1265,
      traumaLevel: 'Level I',
      teachingAffiliations: ['Mayo Clinic Alix School of Medicine', 'Mayo Clinic Graduate School of Biomedical Sciences'],
      researchFocus: ['Cardiovascular Medicine', 'Gastroenterology', 'Endocrinology', 'Transplant Medicine'],
      specialtyStrengths: ['Cardiology', 'Gastroenterology', 'Endocrinology', 'Surgery', 'Internal Medicine'],
      status: 'active',
      managedBy: 'Emily Rodriguez'
    },
    {
      id: '4',
      institutionName: 'Massachusetts General Hospital',
      institutionType: 'Academic Medical Center',
      city: 'Boston',
      state: 'MA',
      zipCode: '02114',
      website: 'https://www.massgeneral.org',
      mainPhone: '(617) 726-2000',
      mainEmail: 'info@mgh.harvard.edu',
      gmeOfficePhone: '(617) 726-3478',
      gmeOfficeEmail: 'gme@mgh.harvard.edu',
      dioName: 'Dr. David Wilson, MD',
      totalResidents: 580,
      totalPrograms: 24,
      accreditationStatus: 'Accredited',
      accreditationExpiry: '2027-09-30',
      establishedYear: 1811,
      hospitalBeds: 999,
      traumaLevel: 'Level I',
      teachingAffiliations: ['Harvard Medical School', 'Harvard T.H. Chan School of Public Health'],
      researchFocus: ['Cancer Research', 'Neuroscience', 'Cardiovascular Research', 'Immunology'],
      specialtyStrengths: ['Internal Medicine', 'Surgery', 'Emergency Medicine', 'Neurology', 'Oncology'],
      status: 'active',
      managedBy: 'David Thompson'
    },
    {
      id: '5',
      institutionName: 'Boston Children\'s Hospital',
      institutionType: 'Children\'s Hospital',
      city: 'Boston',
      state: 'MA',
      zipCode: '02115',
      website: 'https://www.childrenshospital.org',
      mainPhone: '(617) 355-6000',
      mainEmail: 'info@childrens.harvard.edu',
      gmeOfficePhone: '(617) 355-7785',
      gmeOfficeEmail: 'gme@childrens.harvard.edu',
      dioName: 'Dr. Lisa Thompson, MD',
      totalResidents: 180,
      totalPrograms: 8,
      accreditationStatus: 'Accredited',
      accreditationExpiry: '2026-08-31',
      establishedYear: 1869,
      hospitalBeds: 404,
      teachingAffiliations: ['Harvard Medical School', 'Harvard School of Dental Medicine'],
      researchFocus: ['Pediatric Oncology', 'Pediatric Cardiology', 'Pediatric Neurology', 'Genetic Medicine'],
      specialtyStrengths: ['Pediatrics', 'Pediatric Surgery', 'Pediatric Cardiology', 'Pediatric Neurology'],
      status: 'active',
      managedBy: 'Emily Rodriguez'
    },
    {
      id: '6',
      institutionName: 'Stanford University Medical Center',
      institutionType: 'Academic Medical Center',
      city: 'Stanford',
      state: 'CA',
      zipCode: '94305',
      website: 'https://med.stanford.edu',
      mainPhone: '(650) 723-4000',
      mainEmail: 'info@stanford.edu',
      gmeOfficePhone: '(650) 723-6861',
      gmeOfficeEmail: 'gme@stanford.edu',
      dioName: 'Dr. Robert Martinez, MD',
      totalResidents: 420,
      totalPrograms: 19,
      accreditationStatus: 'Accredited',
      accreditationExpiry: '2027-12-31',
      establishedYear: 1959,
      hospitalBeds: 613,
      traumaLevel: 'Level I',
      teachingAffiliations: ['Stanford University School of Medicine', 'Stanford University School of Engineering'],
      researchFocus: ['Precision Medicine', 'Bioengineering', 'Neuroscience', 'Cancer Research'],
      specialtyStrengths: ['Surgery', 'Internal Medicine', 'Neurology', 'Radiology', 'Anesthesiology'],
      status: 'active',
      managedBy: 'David Thompson'
    },
    {
      id: '7',
      institutionName: 'University of Texas Southwestern Medical Center',
      institutionType: 'Academic Medical Center',
      city: 'Dallas',
      state: 'TX',
      zipCode: '75390',
      website: 'https://www.utsouthwestern.edu',
      mainPhone: '(214) 648-3111',
      mainEmail: 'info@utsouthwestern.edu',
      gmeOfficePhone: '(214) 648-9119',
      gmeOfficeEmail: 'gme@utsouthwestern.edu',
      dioName: 'Dr. Jennifer Lee, MD',
      totalResidents: 380,
      totalPrograms: 16,
      accreditationStatus: 'Accredited',
      accreditationExpiry: '2026-11-30',
      establishedYear: 1943,
      hospitalBeds: 965,
      traumaLevel: 'Level I',
      teachingAffiliations: ['UT Southwestern Medical School', 'UT Southwestern Graduate School'],
      researchFocus: ['Transplant Medicine', 'Neuroscience', 'Cancer Research', 'Cardiovascular Medicine'],
      specialtyStrengths: ['Family Medicine', 'Internal Medicine', 'Surgery', 'Emergency Medicine'],
      status: 'active',
      managedBy: 'Emily Rodriguez'
    },
    {
      id: '8',
      institutionName: 'University of Michigan Medical Center',
      institutionType: 'Academic Medical Center',
      city: 'Ann Arbor',
      state: 'MI',
      zipCode: '48109',
      website: 'https://medicine.umich.edu',
      mainPhone: '(734) 936-4000',
      mainEmail: 'info@umich.edu',
      gmeOfficePhone: '(734) 936-5531',
      gmeOfficeEmail: 'gme@umich.edu',
      dioName: 'Dr. Amanda Foster, MD',
      totalResidents: 460,
      totalPrograms: 21,
      accreditationStatus: 'Accredited',
      accreditationExpiry: '2027-05-31',
      establishedYear: 1850,
      hospitalBeds: 1000,
      traumaLevel: 'Level I',
      teachingAffiliations: ['University of Michigan Medical School', 'University of Michigan School of Public Health'],
      researchFocus: ['Radiology', 'Psychiatry', 'Biomedical Engineering', 'Health Services Research'],
      specialtyStrengths: ['Radiology', 'Psychiatry', 'Internal Medicine', 'Surgery', 'Pediatrics'],
      status: 'active',
      managedBy: 'David Thompson'
    },
    {
      id: '9',
      institutionName: 'Riverside Community Hospital',
      institutionType: 'Community Hospital',
      city: 'Riverside',
      state: 'CA',
      zipCode: '92501',
      website: 'https://www.riversidecommunity.org',
      mainPhone: '(951) 788-3000',
      mainEmail: 'info@rchc.org',
      gmeOfficePhone: '(951) 788-3456',
      gmeOfficeEmail: 'gme@rchc.org',
      dioName: 'Dr. Mark Johnson, MD',
      totalResidents: 85,
      totalPrograms: 4,
      accreditationStatus: 'Accredited',
      accreditationExpiry: '2025-12-31',
      establishedYear: 1960,
      hospitalBeds: 478,
      traumaLevel: 'Level II',
      teachingAffiliations: ['UC Riverside School of Medicine'],
      researchFocus: ['Community Health', 'Primary Care', 'Emergency Medicine'],
      specialtyStrengths: ['Family Medicine', 'Internal Medicine', 'Emergency Medicine'],
      status: 'active',
      managedBy: 'Emily Rodriguez'
    },
    {
      id: '10',
      institutionName: 'Hospital for Special Surgery',
      institutionType: 'Specialty Hospital',
      city: 'New York',
      state: 'NY',
      zipCode: '10021',
      website: 'https://www.hss.edu',
      mainPhone: '(212) 606-1000',
      mainEmail: 'info@hss.edu',
      gmeOfficePhone: '(212) 606-1234',
      gmeOfficeEmail: 'gme@hss.edu',
      dioName: 'Dr. Steven Rodriguez, MD',
      totalResidents: 45,
      totalPrograms: 3,
      accreditationStatus: 'Accredited',
      accreditationExpiry: '2026-10-31',
      establishedYear: 1863,
      hospitalBeds: 205,
      teachingAffiliations: ['Weill Cornell Medicine', 'Columbia University College of Physicians and Surgeons'],
      researchFocus: ['Orthopedic Surgery', 'Sports Medicine', 'Rheumatology', 'Musculoskeletal Research'],
      specialtyStrengths: ['Orthopedic Surgery', 'Sports Medicine', 'Rheumatology'],
      status: 'active',
      managedBy: 'David Thompson'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'probation':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4" />;
      case 'probation':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getAccreditationColor = (status: string) => {
    switch (status) {
      case 'Accredited':
        return 'bg-green-100 text-green-800';
      case 'Probation':
        return 'bg-red-100 text-red-800';
      case 'Warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'Withdrawn':
        return 'bg-gray-100 text-gray-800';
      case 'Pending':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Apply search and filter logic with debounced search
  const filteredInstitutions = allInstitutions.filter(institution => {
    const sanitizedQuery = SecurityUtils.sanitizeText(debouncedSearchQuery).toLowerCase();
    const matchesSearch = !sanitizedQuery || 
      institution.institutionName.toLowerCase().includes(sanitizedQuery) ||
      institution.city.toLowerCase().includes(sanitizedQuery) ||
      institution.state.toLowerCase().includes(sanitizedQuery) ||
      (institution.dioName && institution.dioName.toLowerCase().includes(sanitizedQuery)) ||
      (institution.specialtyStrengths && institution.specialtyStrengths.some(s => s.toLowerCase().includes(sanitizedQuery)));
    
    const matchesType = !filters.institutionType || institution.institutionType === filters.institutionType;
    const matchesState = !filters.state || institution.state === filters.state;
    const matchesAccreditation = !filters.accreditationStatus || institution.accreditationStatus === filters.accreditationStatus;
    const matchesTrauma = !filters.traumaLevel || institution.traumaLevel === filters.traumaLevel;
    const matchesStatus = !filters.status || institution.status === filters.status;
    const matchesManagedBy = !filters.managedBy || institution.managedBy === filters.managedBy;
    
    return matchesSearch && matchesType && matchesState && matchesAccreditation && 
           matchesTrauma && matchesStatus && matchesManagedBy;
  }).sort((a, b) => {
    let aValue = a[sortBy as keyof GMEInstitution] as string | number;
    let bValue = b[sortBy as keyof GMEInstitution] as string | number;
    
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
      institutionType: '',
      state: '',
      accreditationStatus: '',
      traumaLevel: '',
      status: '',
      managedBy: ''
    });
    setSearchQuery('');
  };

  const handleInstitutionSelect = (institutionId: string) => {
    setSelectedInstitutions(prev => 
      prev.includes(institutionId) 
        ? prev.filter(id => id !== institutionId)
        : [...prev, institutionId]
    );
  };

  const handleSelectAll = () => {
    if (selectedInstitutions.length === filteredInstitutions.length) {
      setSelectedInstitutions([]);
    } else {
      setSelectedInstitutions(filteredInstitutions.map(i => i.id));
    }
  };

  const handleBulkAction = (action: string) => {
    switch (action) {
      case 'export':
        console.log('Exporting selected institutions:', selectedInstitutions);
        break;
      case 'reassign':
        console.log('Reassigning selected institutions:', selectedInstitutions);
        break;
      case 'deactivate':
        if (confirm(`Are you sure you want to deactivate ${selectedInstitutions.length} institutions?`)) {
          console.log('Deactivating selected institutions:', selectedInstitutions);
          setSelectedInstitutions([]);
        }
        break;
      case 'delete':
        if (confirm(`Are you sure you want to delete ${selectedInstitutions.length} institutions? This action cannot be undone.`)) {
          console.log('Deleting selected institutions:', selectedInstitutions);
          setSelectedInstitutions([]);
        }
        break;
    }
  };

  // Get unique values for filter options
  const institutionTypes = [...new Set(allInstitutions.map(i => i.institutionType))];
  const states = [...new Set(allInstitutions.map(i => i.state))];
  const accreditationStatuses = [...new Set(allInstitutions.map(i => i.accreditationStatus))];
  const traumaLevels = [...new Set(allInstitutions.map(i => i.traumaLevel).filter(Boolean))];
  const statuses = ['active', 'inactive', 'probation'];
  const users = [...new Set(allInstitutions.map(i => i.managedBy).filter(Boolean))];

  const activeFilterCount = Object.values(filters).filter(v => v).length;

  return (
    <ErrorBoundary>
      <Layout>
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              GME Institution Search
            </h1>
            <p className="text-gray-600">
              Search and manage Graduate Medical Education institutions and their training programs
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
                    placeholder="Search institutions by name, location, DIO, or specialty strengths..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    aria-label="Search GME institutions"
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
                    <option value="institutionName">Sort by Name</option>
                    <option value="institutionType">Sort by Type</option>
                    <option value="state">Sort by State</option>
                    <option value="totalPrograms">Sort by Programs</option>
                    <option value="totalResidents">Sort by Residents</option>
                    <option value="establishedYear">Sort by Established</option>
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Institution Type
                    </label>
                    <select
                      value={filters.institutionType}
                      onChange={(e) => handleFilterChange('institutionType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Types</option>
                      {institutionTypes.map(type => (
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
                      Accreditation Status
                    </label>
                    <select
                      value={filters.accreditationStatus}
                      onChange={(e) => handleFilterChange('accreditationStatus', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Statuses</option>
                      {accreditationStatuses.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Trauma Level
                    </label>
                    <select
                      value={filters.traumaLevel}
                      onChange={(e) => handleFilterChange('traumaLevel', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Levels</option>
                      {traumaLevels.map(level => (
                        <option key={level} value={level}>{level}</option>
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
                  <div className="md:col-span-3 flex justify-end">
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
          {selectedInstitutions.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-900">
                  {selectedInstitutions.length} institution{selectedInstitutions.length !== 1 ? 's' : ''} selected
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
                  Institutions ({filteredInstitutions.length})
                </h2>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedInstitutions.length === filteredInstitutions.length && filteredInstitutions.length > 0}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="text-sm text-gray-600">Select All</label>
                </div>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {filteredInstitutions.map((institution) => (
                <div key={institution.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedInstitutions.includes(institution.id)}
                        onChange={() => handleInstitutionSelect(institution.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                        <Building className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-lg font-medium text-gray-900">
                            {institution.institutionName}
                          </h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            institution.institutionType === 'Academic Medical Center' 
                              ? 'bg-blue-100 text-blue-800' 
                              : institution.institutionType === 'Community Hospital'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}>
                            {institution.institutionType}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(institution.status)}`}>
                            {getStatusIcon(institution.status)}
                            <span className="ml-1 capitalize">{institution.status}</span>
                          </span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="h-4 w-4 mr-2" />
                            {institution.city}, {institution.state} {institution.zipCode}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <GraduationCap className="h-4 w-4 mr-1" />
                              {institution.totalPrograms} programs
                            </div>
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              {institution.totalResidents} residents
                            </div>
                            {institution.hospitalBeds && (
                              <div className="flex items-center">
                                <Building className="h-4 w-4 mr-1" />
                                {institution.hospitalBeds} beds
                              </div>
                            )}
                            {institution.traumaLevel && (
                              <div className="flex items-center">
                                <Shield className="h-4 w-4 mr-1" />
                                {institution.traumaLevel} Trauma
                              </div>
                            )}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Award className="h-4 w-4 mr-2" />
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAccreditationColor(institution.accreditationStatus)}`}>
                              {institution.accreditationStatus}
                            </span>
                            {institution.accreditationExpiry && (
                              <span className="ml-2">
                                expires {new Date(institution.accreditationExpiry).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                          {institution.dioName && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Users className="h-4 w-4 mr-2" />
                              DIO: {institution.dioName}
                            </div>
                          )}
                          {institution.specialtyStrengths && institution.specialtyStrengths.length > 0 && (
                            <div className="flex items-start text-sm text-gray-600">
                              <Award className="h-4 w-4 mr-2 mt-0.5" />
                              <div className="flex flex-wrap gap-1">
                                {institution.specialtyStrengths.slice(0, 3).map((strength, index) => (
                                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                                    {strength}
                                  </span>
                                ))}
                                {institution.specialtyStrengths.length > 3 && (
                                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                                    +{institution.specialtyStrengths.length - 3} more
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                          {institution.managedBy && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Users className="h-4 w-4 mr-2" />
                              Managed by: {institution.managedBy}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === institution.id ? null : institution.id)}
                        className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded-md"
                      >
                        <span>Actions</span>
                        <ChevronDown className="h-4 w-4" />
                      </button>
                      
                      {activeDropdown === institution.id && (
                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                          <div className="py-1">
                            <a
                              href={`/gme-institution-detail?id=${institution.id}`}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => setActiveDropdown(null)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Institution Details
                            </a>
                            <a
                              href={`/gme-program-search?institution=${encodeURIComponent(institution.institutionName)}`}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => setActiveDropdown(null)}
                            >
                              <GraduationCap className="h-4 w-4 mr-2" />
                              View Programs ({institution.totalPrograms})
                            </a>
                            <a
                              href={`/search?institution=${encodeURIComponent(institution.institutionName)}`}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => setActiveDropdown(null)}
                            >
                              <Users className="h-4 w-4 mr-2" />
                              View Residents ({institution.totalResidents})
                            </a>
                            {institution.website && (
                              <a
                                href={institution.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={() => setActiveDropdown(null)}
                              >
                                <Globe className="h-4 w-4 mr-2" />
                                Visit Website
                              </a>
                            )}
                            <button
                              onClick={() => {
                                setActiveDropdown(null);
                                // Handle edit action
                              }}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Institution
                            </button>
                            <button
                              onClick={() => {
                                setActiveDropdown(null);
                                // Handle bookmark action
                              }}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <Bookmark className="h-4 w-4 mr-2" />
                              Bookmark Institution
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
                                if (confirm('Are you sure you want to deactivate this institution?')) {
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
                                if (confirm('Are you sure you want to delete this institution? This action cannot be undone.')) {
                                  // Handle delete action
                                }
                              }}
                              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Institution
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