import React, { useState, useEffect } from 'react';
import { Layout } from '../Layout/Layout';
import { useAuth } from '../../contexts/AuthContext';
import { BookmarkButton } from '../ui/BookmarkButton';
import { 
  Search as SearchIcon, 
  Filter, 
  Download, 
  Eye,
  MapPin,
  Phone,
  Mail,
  Calendar,
  User,
  Stethoscope,
  Building,
  FileText,
  ExternalLink
} from 'lucide-react';

interface Provider {
  id: string;
  npi: string;
  firstName: string;
  lastName: string;
  credentials: string;
  specialty: string;
  city: string;
  state: string;
  phone?: string;
  email?: string;
  licenseState: string;
  licenseNumber: string;
  status: 'active' | 'inactive' | 'pending';
}

export function Search() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    specialty: '',
    state: '',
    status: '',
    credentials: ''
  });
  const [results, setResults] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Mock data for demonstration
  const mockProviders: Provider[] = [
    {
      id: '1',
      npi: '1234567890',
      firstName: 'Sarah',
      lastName: 'Johnson',
      credentials: 'MD',
      specialty: 'Internal Medicine',
      city: 'Los Angeles',
      state: 'CA',
      phone: '(555) 123-4567',
      email: 'sarah.johnson@hospital.edu',
      licenseState: 'CA',
      licenseNumber: 'A12345',
      status: 'active'
    },
    {
      id: '2',
      npi: '2345678901',
      firstName: 'Michael',
      lastName: 'Chen',
      credentials: 'DO',
      specialty: 'Emergency Medicine',
      city: 'San Francisco',
      state: 'CA',
      phone: '(555) 234-5678',
      email: 'michael.chen@hospital.edu',
      licenseState: 'CA',
      licenseNumber: 'B23456',
      status: 'active'
    },
    {
      id: '3',
      npi: '3456789012',
      firstName: 'Emily',
      lastName: 'Rodriguez',
      credentials: 'MD',
      specialty: 'Pediatrics',
      city: 'San Diego',
      state: 'CA',
      phone: '(555) 345-6789',
      email: 'emily.rodriguez@hospital.edu',
      licenseState: 'CA',
      licenseNumber: 'C34567',
      status: 'pending'
    }
  ];

  useEffect(() => {
    // Simulate search
    if (searchQuery || Object.values(filters).some(f => f)) {
      setIsLoading(true);
      setTimeout(() => {
        const filtered = mockProviders.filter(provider => {
          const matchesQuery = !searchQuery || 
            provider.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            provider.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            provider.npi.includes(searchQuery) ||
            provider.specialty.toLowerCase().includes(searchQuery.toLowerCase());
          
          const matchesFilters = 
            (!filters.specialty || provider.specialty === filters.specialty) &&
            (!filters.state || provider.state === filters.state) &&
            (!filters.status || provider.status === filters.status) &&
            (!filters.credentials || provider.credentials === filters.credentials);
          
          return matchesQuery && matchesFilters;
        });
        setResults(filtered);
        setIsLoading(false);
      }, 500);
    } else {
      setResults([]);
    }
  }, [searchQuery, filters]);

  const handleExport = () => {
    const csv = [
      ['NPI', 'First Name', 'Last Name', 'Credentials', 'Specialty', 'City', 'State', 'Status'].join(','),
      ...results.map(p => [
        p.npi, p.firstName, p.lastName, p.credentials, p.specialty, p.city, p.state, p.status
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `provider_search_results_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Layout breadcrumbs={[{ label: 'Provider Search' }]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Provider Search</h1>
            <p className="text-gray-600 mt-1">Search and filter healthcare providers in the database</p>
          </div>
          <BookmarkButton
            title="Provider Search"
            url="/search"
            category="Search"
            icon="Search"
          />
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, NPI, or specialty..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  aria-label="Search providers"
                />
              </div>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-4 py-3 border rounded-md transition-colors ${
                showFilters 
                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
              aria-label="Toggle filters"
            >
              <Filter className="h-5 w-5" />
              <span>Filters</span>
            </button>
            {results.length > 0 && (
              <button
                onClick={handleExport}
                className="flex items-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                aria-label="Export search results"
              >
                <Download className="h-5 w-5" />
                <span>Export</span>
              </button>
            )}
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Specialty</label>
                  <select
                    value={filters.specialty}
                    onChange={(e) => setFilters(prev => ({ ...prev, specialty: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Specialties</option>
                    <option value="Internal Medicine">Internal Medicine</option>
                    <option value="Emergency Medicine">Emergency Medicine</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Surgery">Surgery</option>
                    <option value="Cardiology">Cardiology</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <select
                    value={filters.state}
                    onChange={(e) => setFilters(prev => ({ ...prev, state: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All States</option>
                    <option value="CA">California</option>
                    <option value="NY">New York</option>
                    <option value="TX">Texas</option>
                    <option value="FL">Florida</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Credentials</label>
                  <select
                    value={filters.credentials}
                    onChange={(e) => setFilters(prev => ({ ...prev, credentials: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Credentials</option>
                    <option value="MD">MD</option>
                    <option value="DO">DO</option>
                    <option value="MBBS">MBBS</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="bg-white rounded-lg shadow-sm">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Searching providers...</p>
            </div>
          ) : results.length > 0 ? (
            <div>
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Search Results ({results.length})
                </h3>
              </div>
              <div className="divide-y divide-gray-200">
                {results.map((provider) => (
                  <div key={provider.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h4 className="text-lg font-medium text-gray-900">
                            {provider.firstName} {provider.lastName}, {provider.credentials}
                          </h4>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            provider.status === 'active' 
                              ? 'bg-green-100 text-green-800'
                              : provider.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {provider.status}
                          </span>
                        </div>
                        
                        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Stethoscope className="h-4 w-4" />
                            <span>{provider.specialty}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4" />
                            <span>{provider.city}, {provider.state}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4" />
                            <span>NPI: {provider.npi}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Building className="h-4 w-4" />
                            <span>License: {provider.licenseState}-{provider.licenseNumber}</span>
                          </div>
                          {provider.phone && (
                            <div className="flex items-center space-x-2">
                              <Phone className="h-4 w-4" />
                              <span>{provider.phone}</span>
                            </div>
                          )}
                          {provider.email && (
                            <div className="flex items-center space-x-2">
                              <Mail className="h-4 w-4" />
                              <span>{provider.email}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <BookmarkButton
                          title={`${provider.firstName} ${provider.lastName}, ${provider.credentials}`}
                          url={`/hcp-detail?id=${provider.id}`}
                          category="Providers"
                          icon="User"
                          size="sm"
                          variant="minimal"
                          showText={false}
                        />
                        <a
                          href={`/hcp-detail?id=${provider.id}`}
                          className="flex items-center space-x-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
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
          ) : searchQuery || Object.values(filters).some(f => f) ? (
            <div className="p-8 text-center">
              <SearchIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No providers found</h3>
              <p className="text-gray-500">Try adjusting your search criteria or filters</p>
            </div>
          ) : (
            <div className="p-8 text-center">
              <SearchIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Search Providers</h3>
              <p className="text-gray-500">Enter a search term or use filters to find providers</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}