import React, { useState } from 'react';
import { Layout } from '../Layout/Layout';
import { 
  Search,
  Filter,
  GraduationCap,
  Building,
  MapPin,
  Users,
  Calendar,
  Globe,
  ChevronDown,
  X,
  Eye,
  Bookmark,
  Stethoscope
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
  applicationDeadline: string;
  matchDate: string;
  established: number;
}

export function GMEProgramSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    profession: '',
    specialty: '',
    programType: '',
    state: '',
    accreditation: ''
  });

  // Mock GME program data
  const programs: GMEProgram[] = [
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
      website: 'https://ucla.edu/internal-medicine',
      applicationDeadline: 'October 15, 2024',
      matchDate: 'March 15, 2025',
      established: 1965
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
      applicationDeadline: 'October 15, 2024',
      matchDate: 'March 15, 2025',
      established: 1978
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
      applicationDeadline: 'January 15, 2025',
      matchDate: 'June 15, 2025',
      established: 1985
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
      applicationDeadline: 'October 15, 2024',
      matchDate: 'March 15, 2025',
      established: 1972
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
      applicationDeadline: 'October 15, 2024',
      matchDate: 'March 15, 2025',
      established: 1960
    }
  ];

  const filteredPrograms = programs.filter(program => {
    const matchesSearch = 
      program.programName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.state.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesProfession = !filters.profession || program.profession === filters.profession;
    const matchesSpecialty = !filters.specialty || program.specialty === filters.specialty;
    const matchesProgramType = !filters.programType || program.programType === filters.programType;
    const matchesState = !filters.state || program.state === filters.state;
    const matchesAccreditation = !filters.accreditation || program.accreditation === filters.accreditation;
    
    return matchesSearch && matchesProfession && matchesSpecialty && matchesProgramType && matchesState && matchesAccreditation;
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
      programType: '',
      state: '',
      accreditation: ''
    });
  };

  const professions = ['Physician', 'Nurse Practitioner', 'Physician Assistant'];
  const specialties = ['Internal Medicine', 'Emergency Medicine', 'Cardiology', 'Family Medicine', 'Pediatrics', 'Surgery', 'Psychiatry', 'Radiology'];
  const programTypes = ['Residency', 'Fellowship'];
  const states = ['CA', 'TX', 'FL', 'NY', 'PA', 'IL', 'OH', 'GA', 'NC', 'MI', 'MD', 'MA', 'MN'];
  const accreditations = ['ACGME', 'AOA', 'COCA'];

  return (
    <Layout breadcrumbs={[{ label: 'GME Program Search' }]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">GME Program Search</h1>
          <p className="text-gray-600">
            Search and explore Graduate Medical Education programs across the United States
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
                  placeholder="Search programs, institutions, specialties, or locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                {Object.values(filters).some(v => v) && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {Object.values(filters).filter(v => v).length}
                  </span>
                )}
              </button>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4 bg-gray-50 rounded-lg">
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
                <div className="md:col-span-3 lg:col-span-5 flex justify-end">
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

        {/* Results */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Programs ({filteredPrograms.length})
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredPrograms.map((program) => (
              <div key={program.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                      <GraduationCap className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
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
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md">
                      <Bookmark className="h-4 w-4" />
                    </button>
                    <a
                      href={program.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 px-3 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md"
                    >
                      <Globe className="h-4 w-4" />
                      <span>Website</span>
                    </a>
                    <a
                      href={`/gme-program-detail?id=${program.id}`}
                      className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View Details</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}