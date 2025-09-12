import React, { useState, useEffect } from 'react';
import { useBookmarks } from '../../contexts/BookmarkContext';
import { Layout } from '../Layout/Layout';
import { 
  Search as SearchIcon, 
  Filter, 
  Download, 
  Users, 
  Bookmark, 
  BookmarkCheck,
  ArrowLeft,
  Eye,
  MapPin,
  Mail,
  Phone,
  FileText,
  ChevronDown
} from 'lucide-react';

interface Provider {
  id: string;
  name: string;
  credential: string;
  specialty: string;
  location: string;
  experience: string;
  availability: 'Available' | 'Unavailable';
  email: string;
  phone: string;
}

export function SearchResults() {
  const { addBookmark, bookmarks } = useBookmarks();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'specialty' | 'location' | 'experience'>('name');
  const [filterBy, setFilterBy] = useState<'all' | 'available' | 'unavailable'>('all');
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProviders, setSelectedProviders] = useState<Set<string>>(new Set());
  const [showActionsDropdown, setShowActionsDropdown] = useState(false);

  const isBookmarked = bookmarks.some(b => b.url === '/search-results');

  useEffect(() => {
    // Simulate API call to fetch search results
    const fetchResults = async () => {
      setLoading(true);
      // Mock delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockProviders: Provider[] = [
        {
          id: '1',
          name: 'Dr. Sarah Johnson',
          credential: 'MD',
          specialty: 'Cardiology',
          location: 'New York, NY',
          experience: '15 years',
          availability: 'Available',
          email: 'sarah.johnson@hospital.com',
          phone: '(555) 123-4567'
        },
        {
          id: '2',
          name: 'Dr. Michael Chen',
          credential: 'MD',
          specialty: 'Emergency Medicine',
          location: 'Los Angeles, CA',
          experience: '8 years',
          availability: 'Available',
          email: 'michael.chen@hospital.com',
          phone: '(555) 234-5678'
        },
        {
          id: '3',
          name: 'Dr. Emily Rodriguez',
          credential: 'MD',
          specialty: 'Pediatrics',
          location: 'Chicago, IL',
          experience: '12 years',
          availability: 'Unavailable',
          email: 'emily.rodriguez@hospital.com',
          phone: '(555) 345-6789'
        },
        {
          id: '4',
          name: 'Dr. James Wilson',
          credential: 'DO',
          specialty: 'Family Medicine',
          location: 'Houston, TX',
          experience: '10 years',
          availability: 'Available',
          email: 'james.wilson@clinic.com',
          phone: '(555) 456-7890'
        },
        {
          id: '5',
          name: 'Dr. Lisa Thompson',
          credential: 'MD',
          specialty: 'Dermatology',
          location: 'Miami, FL',
          experience: '7 years',
          availability: 'Available',
          email: 'lisa.thompson@dermatology.com',
          phone: '(555) 567-8901'
        }
      ];
      
      setProviders(mockProviders);
      setLoading(false);
    };

    fetchResults();
  }, []);

  const handleBookmark = () => {
    if (!isBookmarked) {
      addBookmark('Search Results', '/search-results', 'Search');
    }
  };

  const handleViewDetails = (providerId: string) => {
    window.location.href = `/provider-profile?id=${providerId}`;
  };

  const handleBack = () => {
    window.history.back();
  };

  const handleSelectProvider = (providerId: string) => {
    const newSelected = new Set(selectedProviders);
    if (newSelected.has(providerId)) {
      newSelected.delete(providerId);
    } else {
      newSelected.add(providerId);
    }
    setSelectedProviders(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedProviders.size === filteredAndSortedProviders.length) {
      setSelectedProviders(new Set());
    } else {
      setSelectedProviders(new Set(filteredAndSortedProviders.map(p => p.id)));
    }
  };

  const handleBulkAction = (action: string) => {
    const selectedData = filteredAndSortedProviders.filter(p => selectedProviders.has(p.id));
    
    switch (action) {
      case 'export-pdf':
        console.log('Exporting to PDF:', selectedData);
        alert(`Exporting ${selectedData.length} providers to PDF...`);
        break;
      case 'export-csv':
        console.log('Exporting to CSV:', selectedData);
        // Create CSV content
        const csvContent = [
          ['Name', 'Credential', 'Specialty', 'Location', 'Experience', 'Availability', 'Email', 'Phone'],
          ...selectedData.map(p => [
            p.name, p.credential, p.specialty, p.location, p.experience, p.availability, p.email, p.phone
          ])
        ].map(row => row.join(',')).join('\n');
        
        // Download CSV
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `providers-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        break;
      case 'send-message':
        console.log('Sending message to:', selectedData);
        alert(`Sending message to ${selectedData.length} providers...`);
        break;
      case 'add-to-campaign':
        console.log('Adding to campaign:', selectedData);
        alert(`Adding ${selectedData.length} providers to campaign...`);
        break;
      default:
        break;
    }
    
    setShowActionsDropdown(false);
  };
  // Filter and sort providers
  const filteredAndSortedProviders = providers
    .filter(provider => {
      const matchesSearch = provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           provider.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           provider.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterBy === 'all' || 
                           (filterBy === 'available' && provider.availability === 'Available') ||
                           (filterBy === 'unavailable' && provider.availability === 'Unavailable');
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'specialty':
          return a.specialty.localeCompare(b.specialty);
        case 'location':
          return a.location.localeCompare(b.location);
        case 'experience':
          return parseInt(a.experience) - parseInt(b.experience);
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading search results...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout breadcrumbs={[
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Search HCPs', href: '/search' },
      { label: 'Results' }
    ]}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBack}
                className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-1" />
                Back to Search
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Search Results</h1>
                <p className="text-gray-600">
                  {filteredAndSortedProviders.length} healthcare providers found
                </p>
              </div>
            </div>
            <button
              onClick={handleBookmark}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                isBookmarked
                  ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                  : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
              }`}
              disabled={isBookmarked}
            >
              {isBookmarked ? (
                <BookmarkCheck className="w-4 h-4" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
              <span className="text-sm">
                {isBookmarked ? 'Bookmarked' : 'Bookmark'}
              </span>
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search providers..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="name">Name</option>
                <option value="specialty">Specialty</option>
                <option value="location">Location</option>
                <option value="experience">Experience</option>
              </select>
            </div>

            <div>
              <label htmlFor="filterBy" className="block text-sm font-medium text-gray-700 mb-2">
                Filter By
              </label>
              <select
                id="filterBy"
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Providers</option>
                <option value="available">Available Only</option>
                <option value="unavailable">Unavailable Only</option>
              </select>
            </div>

            <div className="flex items-end">
              <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                <Download className="w-4 h-4 mr-2" />
                Export Results
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <h2 className="text-lg font-semibold text-gray-900">Healthcare Providers</h2>
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="w-4 h-4 mr-1" />
                  {filteredAndSortedProviders.length} results
                </div>
              </div>
              
              {selectedProviders.size > 0 && (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">
                    {selectedProviders.size} selected
                  </span>
                  <div className="relative">
                    <button
                      onClick={() => setShowActionsDropdown(!showActionsDropdown)}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Actions
                      <ChevronDown className="ml-2 w-4 h-4" />
                    </button>
                    
                    {showActionsDropdown && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                        <div className="py-1">
                          <button
                            onClick={() => handleBulkAction('export-pdf')}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <FileText className="w-4 h-4 mr-3" />
                            Export to PDF
                          </button>
                          <button
                            onClick={() => handleBulkAction('export-csv')}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Download className="w-4 h-4 mr-3" />
                            Export to CSV
                          </button>
                          <button
                            onClick={() => handleBulkAction('send-message')}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Mail className="w-4 h-4 mr-3" />
                            Send Message
                          </button>
                          <button
                            onClick={() => handleBulkAction('add-to-campaign')}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Users className="w-4 h-4 mr-3" />
                            Add to Campaign
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {filteredAndSortedProviders.length > 0 && (
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedProviders.size === filteredAndSortedProviders.length && filteredAndSortedProviders.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    Select All ({filteredAndSortedProviders.length})
                  </span>
                </label>
              </div>
            )}
          </div>

          <div className="divide-y divide-gray-200">
            {filteredAndSortedProviders.map((provider) => (
              <div key={provider.id} className="px-6 py-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start space-x-4">
                  <div className="flex items-center pt-1">
                    <input
                      type="checkbox"
                      checked={selectedProviders.has(provider.id)}
                      onChange={() => handleSelectProvider(provider.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{provider.name}</h3>
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {provider.credential}
                      </span>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          provider.availability === 'Available'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {provider.availability}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{provider.specialty}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{provider.location}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium">{provider.experience} experience</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{provider.email}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{provider.phone}</span>
                      </div>
                    </div>
                  </div>
                
                  <div className="flex-shrink-0">
                    <button
                      onClick={() => handleViewDetails(provider.id)}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Details</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredAndSortedProviders.length === 0 && (
            <div className="px-6 py-12 text-center">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No providers found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search criteria or filters.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}