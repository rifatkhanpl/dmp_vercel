import React, { useState } from 'react';
import { useBookmarks } from '../../contexts/BookmarkContext';
import { Layout } from '../Layout/Layout';
import { Breadcrumb } from '../Layout/Breadcrumb';
import { Search as SearchIcon, Filter, Download, Users, Bookmark, BookmarkCheck, ChevronDown, FileText, Save } from 'lucide-react';

export function Search() {
  const { addBookmark, bookmarks } = useBookmarks();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedResults, setSelectedResults] = useState<Set<number>>(new Set());
  const [showActionsDropdown, setShowActionsDropdown] = useState(false);
  const [filters, setFilters] = useState({
    specialty: '',
    location: '',
    experience: '',
    availability: ''
  });

  const isBookmarked = bookmarks.some(b => b.url === '/search');

  const handleBookmark = () => {
    if (!isBookmarked) {
      addBookmark('Search HCPs', '/search', 'Data Management');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search logic here
    console.log('Searching for:', searchTerm, filters);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const mockResults = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      location: 'New York, NY',
      experience: '15 years',
      availability: 'Available'
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      specialty: 'Emergency Medicine',
      location: 'Los Angeles, CA',
      experience: '8 years',
      availability: 'Available'
    },
    {
      id: 3,
      name: 'Dr. Emily Rodriguez',
      specialty: 'Pediatrics',
      location: 'Chicago, IL',
      experience: '12 years',
      availability: 'Unavailable'
    }
  ];

  const handleSelectResult = (resultId: number) => {
    const newSelected = new Set(selectedResults);
    if (newSelected.has(resultId)) {
      newSelected.delete(resultId);
    } else {
      newSelected.add(resultId);
    }
    setSelectedResults(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedResults.size === mockResults.length) {
      setSelectedResults(new Set());
    } else {
      setSelectedResults(new Set(mockResults.map((_, index) => index)));
    }
  };

  const handleAction = (action: string) => {
    const selectedData = mockResults.filter((_, index) => selectedResults.has(index));
    
    switch (action) {
      case 'bookmark-search':
        const searchQuery = searchTerm || 'All Providers';
        addBookmark(`Saved Search: ${searchQuery}`, `/search?q=${encodeURIComponent(searchTerm)}`, 'Saved Searches');
        alert(`Search "${searchQuery}" has been bookmarked!`);
        break;
      case 'download-pdf':
        console.log('Downloading PDF for:', selectedData);
        alert(`Generating PDF for ${selectedData.length} selected providers...`);
        break;
      case 'download-csv':
        // Create CSV content
        const csvContent = [
          ['Name', 'Specialty', 'Location', 'Experience', 'Availability'],
          ...selectedData.map(provider => [
            provider.name, provider.specialty, provider.location, provider.experience, provider.availability
          ])
        ].map(row => row.join(',')).join('\n');
        
        // Download CSV
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `search-results-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        break;
      default:
        break;
    }
    
    setShowActionsDropdown(false);
  };

  return (
    <Layout breadcrumbs={[
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Search HCPs' }
    ]}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Healthcare Provider Search</h1>
              <p className="text-gray-600">Search and filter healthcare providers in our database</p>
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

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-6">
            {/* Search Input */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search Healthcare Providers
              </label>
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, specialty, location..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-2">
                  Specialty
                </label>
                <select
                  id="specialty"
                  value={filters.specialty}
                  onChange={(e) => handleFilterChange('specialty', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Specialties</option>
                  <option value="cardiology">Cardiology</option>
                  <option value="emergency">Emergency Medicine</option>
                  <option value="pediatrics">Pediatrics</option>
                  <option value="surgery">Surgery</option>
                </select>
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <select
                  id="location"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Locations</option>
                  <option value="ny">New York</option>
                  <option value="ca">California</option>
                  <option value="il">Illinois</option>
                  <option value="tx">Texas</option>
                </select>
              </div>

              <div>
                <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
                  Experience
                </label>
                <select
                  id="experience"
                  value={filters.experience}
                  onChange={(e) => handleFilterChange('experience', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Any Experience</option>
                  <option value="0-5">0-5 years</option>
                  <option value="5-10">5-10 years</option>
                  <option value="10+">10+ years</option>
                </select>
              </div>

              <div>
                <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-2">
                  Availability
                </label>
                <select
                  id="availability"
                  value={filters.availability}
                  onChange={(e) => handleFilterChange('availability', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All</option>
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </div>
            </div>

            {/* Search Button */}
            <div className="flex justify-between items-center">
              <button
                type="submit"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <SearchIcon className="w-5 h-5 mr-2" />
                Search Providers
              </button>

              <div className="flex space-x-3">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Advanced Filters
                </button>
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Results
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Results */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <h2 className="text-lg font-semibold text-gray-900">Search Results</h2>
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="w-4 h-4 mr-1" />
                  {mockResults.length} providers found
                </div>
              </div>
              
              {selectedResults.size > 0 && (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">
                    {selectedResults.size} selected
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
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                        <div className="py-1">
                          <button
                            onClick={() => handleAction('bookmark-search')}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Bookmark className="w-4 h-4 mr-3" />
                            Bookmark as Saved Search
                          </button>
                          <button
                            onClick={() => handleAction('download-pdf')}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <FileText className="w-4 h-4 mr-3" />
                            Download to PDF
                          </button>
                          <button
                            onClick={() => handleAction('download-csv')}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Download className="w-4 h-4 mr-3" />
                            Download to CSV
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {mockResults.length > 0 && (
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedResults.size === mockResults.length && mockResults.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    Select All ({mockResults.length})
                  </span>
                </label>
              </div>
            )}
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {mockResults.map((provider) => (
              <div key={provider.id} className={`px-6 py-4 transition-colors ${
                selectedResults.has(provider.id) ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
              }`}>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center pt-1">
                    <input
                      type="checkbox"
                      checked={selectedResults.has(provider.id)}
                      onChange={() => handleSelectResult(provider.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between flex-1">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">{provider.name}</h3>
                      <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                        <span>{provider.specialty}</span>
                        <span>•</span>
                        <span>{provider.location}</span>
                        <span>•</span>
                        <span>{provider.experience}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          provider.availability === 'Available'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {provider.availability}
                      </span>
                      <a href={`/provider-profile?id=${provider.id}`} className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                        View Details
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {mockResults.length === 0 && (
            <div className="px-6 py-12 text-center">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No providers found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search criteria or filters.
              </p>
            </div>
          )}
      </div>
    </Layout>
  );
}