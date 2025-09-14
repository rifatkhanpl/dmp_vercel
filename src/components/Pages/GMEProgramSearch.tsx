import React, { useState } from 'react';
import { Layout } from '../Layout/Layout';
import { 
  Search as SearchIcon, 
  Filter, 
  GraduationCap,
  MapPin, 
  Stethoscope,
  Building,
  Users,
  Eye,
  Bookmark,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  Square,
  CheckSquare,
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
  website?: string;
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

  // Mock GME program data
  const mockResults: GMEProgram[] = [
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
      description: 'Comprehensive internal medicine training with emphasis on primary care and subspecialty rotations.',
      established: 1965
    },
    {
      id: '2',
      programName: 'Emergency Medicine Residency',
      institution: 'UCSF Medical Center',
      profession: 'Physician',
      specialty: 'Emergency Medicine',
      city: 'San Francisco',
      state: 'CA',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 32,
      programDirector: 'Dr. Michael Chen, MD',
      website: 'https://ucsf.edu/emergency-medicine',
      description: 'High-volume emergency medicine training with trauma, pediatric, and critical care rotations.',
      established: 1978
    },
    {
      id: '3',
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
      id: '4',
      programName: 'Family Medicine Residency',
      institution: 'Stanford University Medical Center',
      profession: 'Physician',
      specialty: 'Family Medicine',
      city: 'Stanford',
      state: 'CA',
      programType: 'Residency',
      accreditation: 'ACGME',
      positions: 24,
      programDirector: 'Dr. James Wilson, MD',
      website: 'https://stanford.edu/family-medicine',
      description: 'Community-based family medicine training with rural and underserved population focus.',
      established: 1972
    }
  ];

  // Group programs by institution
  const institutionGroups = mockResults.reduce((acc, program) => {
    if (!acc[program.institution]) {
      acc[program.institution] = [];
    }
    acc[program.institution].push(program);
    return acc;
  }, {} as Record<string, GMEProgram[]>);

  const institutions = Object.keys(institutionGroups).map(name => ({
    name,
    programs: institutionGroups[name],
    programCount: institutionGroups[name].length,
    specialties: [...new Set(institutionGroups[name].map(p => p.specialty))],
    totalPositions: institutionGroups[name].reduce((sum, p) => sum + p.positions, 0)
  }));

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
    
    setResults(filtered);
    setIsSearching(false);
  };

  const handleInstitutionSelect = (institutionName: string) => {
    setSelectedInstitution(institutionName);
    setResults(institutionGroups[institutionName] || []);
    setViewMode('programs');
  };

  const handleBackToInstitutions = () => {
    setSelectedInstitution(null);
    setViewMode('institutions');
    setResults([]);
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
          'Program Name,Institution,Profession,Specialty,Subspecialty,City,State,Program Type,Positions,Program Director',
          ...selectedData.map(p => 
            `"${p.programName}","${p.institution}","${p.profession}","${p.specialty}","${p.subspecialty || ''}","${p.city}","${p.state}","${p.programType}","${p.positions}","${p.programDirector}"`
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

  return (
    <Layout breadcrumbs={[{ label: 'GME Program Search' }]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
            <GraduationCap className="h-6 w-6 mr-3" />
            Graduate Medical Education Programs
          </h1>
          <p className="text-gray-600">
            Search and explore GME programs by profession, specialty, subspecialty, and state.
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
                    <option value="Emergency Medicine">Emergency Medicine</option>
                    <option value="Family Medicine">Family Medicine</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Surgery">Surgery</option>
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
        {viewMode === 'institutions' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Institutions ({institutions.length})
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              {institutions.map((institution) => (
                <div key={institution.name} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full">
                        <Building className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">
                          {institution.name}
                        </h3>
                        <div className="mt-1 space-y-1">
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <GraduationCap className="h-4 w-4 mr-1" />
                              {institution.programCount} program{institution.programCount !== 1 ? 's' : ''}
                            </div>
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              {institution.totalPositions} total positions
                            </div>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Stethoscope className="h-4 w-4 mr-2" />
                            <span>Specialties: {institution.specialties.join(', ')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleInstitutionSelect(institution.name)}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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

        {/* Results */}
        {results.length > 0 && viewMode === 'programs' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {selectedInstitution && (
                    <button
                      onClick={handleBackToInstitutions}
                      className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span>Back to Institutions</span>
                    </button>
                  )}
                  <h2 className="text-lg font-semibold text-gray-900">
                    {selectedInstitution ? `${selectedInstitution} Programs` : 'Search Results'} ({results.length})
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
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
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