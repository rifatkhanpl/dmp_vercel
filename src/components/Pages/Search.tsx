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
  ChevronDown
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
}

export function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    specialty: '',
    state: '',
    status: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<Provider[]>([]);
  const [sortBy, setSortBy] = useState<'name' | 'specialty' | 'location' | 'status'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedProviders, setSelectedProviders] = useState<Set<string>>(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Mock data
  const mockResults: Provider[] = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      credentials: 'MD',
      specialty: 'Internal Medicine',
      location: 'Los Angeles, CA',
      phone: '(555) 123-4567',
      email: 'sarah.johnson@example.com',
      npi: '1234567890',
      status: 'active'
    },
    {
      id: '2',
      name: 'Dr. Michael Chen',
      credentials: 'DO',
      specialty: 'Emergency Medicine',
      location: 'San Francisco, CA',
      phone: '(555) 234-5678',
      email: 'michael.chen@example.com',
      npi: '1234567891',
      status: 'active'
    },
    {
      id: '3',
      name: 'Dr. Emily Rodriguez',
      credentials: 'MD',
      specialty: 'Pediatrics',
      location: 'San Diego, CA',
      phone: '(555) 345-6789',
      email: 'emily.rodriguez@example.com',
      npi: '1234567892',
      status: 'pending'
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
    <Layout breadcrumbs={[{ label: 'Search Providers' }]}>
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
                            {provider.specialty}
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