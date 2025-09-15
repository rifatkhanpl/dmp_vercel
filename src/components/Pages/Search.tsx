import React, { useState } from 'react';
import { Layout } from '../Layout/Layout';
import { useLocation } from 'react-router-dom';
import { 
  Search as SearchIcon,
  Filter,
  Download,
  ChevronDown,
  X,
  Eye,
  Edit,
  User,
  Stethoscope,
  MapPin,
  Mail,
  Phone,
  FileText,
  Users,
  Ban,
  Trash2
} from 'lucide-react';

interface Provider {
  id: string;
  name: string;
  specialty: string;
  location: string;
  email: string;
  phone: string;
  npi?: string;
  status: 'active' | 'pending' | 'approved';
  credentials: string;
  managedBy?: string;
}

export function Search() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const managedBy = searchParams.get('managedBy');

  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    specialty: '',
    state: '',
    status: '',
    credentials: '',
    managedBy: ''
  });
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Mock search results data
  const allProviders: Provider[] = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson, MD',
      specialty: 'Internal Medicine',
      location: 'Los Angeles, CA',
      email: 'sarah.johnson@example.com',
      phone: '(555) 123-4567',
      npi: '1234567890',
      status: 'active',
      credentials: 'MD',
      managedBy: 'Emily Rodriguez'
    },
    {
      id: '2',
      name: 'Dr. Michael Chen, DO',
      specialty: 'Emergency Medicine',
      location: 'San Francisco, CA',
      email: 'michael.chen@example.com',
      phone: '(555) 234-5678',
      npi: '2345678901',
      status: 'active',
      credentials: 'DO',
      managedBy: 'David Thompson'
    },
    {
      id: '3',
      name: 'Dr. Emily Rodriguez, MD',
      specialty: 'Pediatrics',
      location: 'Miami, FL',
      email: 'emily.rodriguez@example.com',
      phone: '(555) 345-6789',
      npi: '3456789012',
      status: 'pending',
      credentials: 'MD',
      managedBy: 'Emily Rodriguez'
    },
    {
      id: '4',
      name: 'Dr. David Wilson, MD',
      specialty: 'Cardiology',
      location: 'Houston, TX',
      email: 'david.wilson@example.com',
      phone: '(555) 456-7890',
      npi: '4567890123',
      status: 'approved',
      credentials: 'MD',
      managedBy: 'David Thompson'
    },
    {
      id: '5',
      name: 'Dr. Lisa Thompson, DO',
      specialty: 'Family Medicine',
      location: 'Phoenix, AZ',
      email: 'lisa.thompson@example.com',
      phone: '(555) 567-8901',
      npi: '5678901234',
      status: 'active',
      credentials: 'DO',
      managedBy: 'Emily Rodriguez'
    },
    {
      id: '6',
      name: 'Dr. Robert Martinez, MD',
      specialty: 'Orthopedic Surgery',
      location: 'Denver, CO',
      email: 'robert.martinez@example.com',
      phone: '(555) 678-9012',
      npi: '6789012345',
      status: 'approved',
      credentials: 'MD',
      managedBy: 'David Thompson'
    },
    {
      id: '7',
      name: 'Dr. Jennifer Lee, DPT',
      specialty: 'Physical Therapy',
      location: 'Seattle, WA',
      email: 'jennifer.lee@example.com',
      phone: '(555) 789-0123',
      npi: '7890123456',
      status: 'approved',
      credentials: 'DPT',
      managedBy: 'David Thompson'
    },
    {
      id: '8',
      name: 'Dr. Amanda Foster, PsyD',
      specialty: 'Psychology',
      location: 'Portland, OR',
      email: 'amanda.foster@example.com',
      phone: '(555) 890-1234',
      npi: '8901234567',
      status: 'approved',
      credentials: 'PsyD',
      managedBy: 'Emily Rodriguez'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter providers by managedBy if specified, then apply other filters
  const baseProviders = managedBy 
    ? allProviders.filter(provider => provider.managedBy === managedBy)
    : allProviders;

  // Apply search and filter logic
  const filteredProviders = baseProviders.filter(provider => {
    const matchesSearch = 
      provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (provider.npi && provider.npi.includes(searchQuery));
    
    const matchesSpecialty = !filters.specialty || provider.specialty === filters.specialty;
    const matchesState = !filters.state || provider.location.includes(filters.state);
    const matchesStatus = !filters.status || provider.status === filters.status;
    const matchesCredentials = !filters.credentials || provider.credentials === filters.credentials;
    const matchesManagedBy = !filters.managedBy || provider.managedBy === filters.managedBy;
    
    return matchesSearch && matchesSpecialty && matchesState && matchesStatus && matchesCredentials && matchesManagedBy;
  }).sort((a, b) => {
    let aValue = a[sortBy as keyof Provider] as string;
    let bValue = b[sortBy as keyof Provider] as string;
    
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
      specialty: '',
      state: '',
      status: '',
      credentials: '',
      managedBy: ''
    });
    setSearchQuery('');
  };

  const handleProviderSelect = (providerId: string) => {
    setSelectedProviders(prev => 
      prev.includes(providerId) 
        ? prev.filter(id => id !== providerId)
        : [...prev, providerId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProviders.length === filteredProviders.length) {
      setSelectedProviders([]);
    } else {
      setSelectedProviders(filteredProviders.map(p => p.id));
    }
  };

  const handleBulkAction = (action: string) => {
    switch (action) {
      case 'export':
        console.log('Exporting selected providers:', selectedProviders);
        break;
      case 'reassign':
        console.log('Reassigning selected providers:', selectedProviders);
        break;
      case 'deactivate':
        if (confirm(`Are you sure you want to deactivate ${selectedProviders.length} providers?`)) {
          console.log('Deactivating selected providers:', selectedProviders);
          setSelectedProviders([]);
        }
        break;
      case 'delete':
        if (confirm(`Are you sure you want to delete ${selectedProviders.length} providers? This action cannot be undone.`)) {
          console.log('Deleting selected providers:', selectedProviders);
          setSelectedProviders([]);
        }
        break;
    }
  };

  // Get unique values for filter options from base providers
  const specialties = [...new Set(baseProviders.map(p => p.specialty))];
  const states = [...new Set(baseProviders.map(p => p.location.split(', ')[1]))];
  const statuses = ['active', 'pending', 'approved'];
  const credentials = [...new Set(baseProviders.map(p => p.credentials))];
  const users = [...new Set(baseProviders.map(p => p.managedBy).filter(Boolean))];

  const activeFilterCount = Object.values(filters).filter(v => v).length;

  const breadcrumbs = managedBy 
    ? [
        { label: 'User Management', href: '/user-management' },
        { label: `Providers managed by ${managedBy}` }
      ]
    : [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'HCP Search' }
      ];

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {managedBy ? `Providers managed by ${managedBy}` : 'Healthcare Provider Search'}
          </h1>
          <p className="text-gray-600">
            {managedBy 
              ? `View and manage all providers assigned to ${managedBy}`
              : 'Search and manage healthcare provider records in the system'
            }
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="space-y-4">
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search providers by name, specialty, location, email, or NPI..."
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
                  <option value="name">Sort by Name</option>
                  <option value="specialty">Sort by Specialty</option>
                  <option value="location">Sort by Location</option>
                  <option value="status">Sort by Status</option>
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
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-gray-50 rounded-lg">
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
                    Credentials
                  </label>
                  <select
                    value={filters.credentials}
                    onChange={(e) => handleFilterChange('credentials', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Credentials</option>
                    {credentials.map(credential => (
                      <option key={credential} value={credential}>{credential}</option>
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
                    <option value="">All Users</option>
                    {users.map(user => (
                      <option key={user} value={user}>{user}</option>
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
        {selectedProviders.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-900">
                {selectedProviders.length} provider{selectedProviders.length !== 1 ? 's' : ''} selected
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
                        Reassign to User
                      </button>
                      <div className="border-t border-gray-100"></div>
                      <button
                        onClick={() => {
                          handleBulkAction('deactivate');
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
                {managedBy ? 'Search Results' : 'Search Results'} ({filteredProviders.length})
              </h2>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedProviders.length === filteredProviders.length && filteredProviders.length > 0}
                  onChange={handleSelectAll}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="text-sm text-gray-600">Select All</label>
              </div>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredProviders.map((provider) => (
              <div key={provider.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedProviders.includes(provider.id)}
                      onChange={() => handleProviderSelect(provider.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-medium text-gray-900">
                          {provider.name}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(provider.status)}`}>
                          {provider.status}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-600">
                          <Stethoscope className="h-4 w-4 mr-2" />
                          {provider.specialty}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-2" />
                          {provider.location}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="h-4 w-4 mr-2" />
                          {provider.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="h-4 w-4 mr-2" />
                          {provider.phone}
                        </div>
                        {provider.npi && (
                          <div className="flex items-center text-sm text-gray-600">
                            <FileText className="h-4 w-4 mr-2" />
                            NPI: {provider.npi}
                          </div>
                        )}
                        {provider.managedBy && (
                          <div className="flex items-center text-sm text-gray-600">
                            <User className="h-4 w-4 mr-2" />
                            Managed by: {provider.managedBy}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === provider.id ? null : provider.id)}
                      className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                      <span>Actions</span>
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    
                    {activeDropdown === provider.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                        <div className="py-1">
                          <a
                            href={`/hcp-detail?id=${provider.id}`}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setActiveDropdown(null)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </a>
                          <button
                            onClick={() => {
                              setActiveDropdown(null);
                              // Handle edit action
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Provider
                          </button>
                          <button
                            onClick={() => {
                              setActiveDropdown(null);
                              // Handle reassign action
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Users className="h-4 w-4 mr-2" />
                            Reassign to User
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
                              if (confirm('Are you sure you want to deactivate this provider?')) {
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
                              if (confirm('Are you sure you want to delete this provider? This action cannot be undone.')) {
                                // Handle delete action
                              }
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Provider
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
  );
}