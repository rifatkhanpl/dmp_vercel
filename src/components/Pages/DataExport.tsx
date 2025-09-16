import React, { useState } from 'react';
import { Layout } from '../Layout/Layout';
import { 
  Download,
  Filter,
  Calendar,
  FileText,
  CheckCircle,
  Users,
  Stethoscope,
  MapPin,
  RefreshCw
} from 'lucide-react';

export function DataExport() {
  const [filters, setFilters] = useState({
    specialty: '',
    state: '',
    programType: '',
    status: '',
    dateRange: '30d',
    sourceType: ''
  });
  const [exportFormat, setExportFormat] = useState('csv');
  const [isExporting, setIsExporting] = useState(false);
  const [includeFields, setIncludeFields] = useState({
    personalInfo: true,
    contactInfo: true,
    professionalInfo: true,
    licenseInfo: true,
    gmeTraining: true,
    provenance: false
  });

  const specialties = [
    'Internal Medicine', 'Emergency Medicine', 'Family Medicine', 'Pediatrics',
    'Surgery', 'Cardiology', 'Neurology', 'Psychiatry', 'Radiology', 'Anesthesiology'
  ];

  const states = [
    'CA', 'TX', 'FL', 'NY', 'PA', 'IL', 'OH', 'GA', 'NC', 'MI', 'MD', 'MA'
  ];

  const programTypes = ['Residency', 'Fellowship'];
  const statuses = ['pending', 'validated', 'approved', 'rejected'];
  const sourceTypes = ['Template', 'AI-Map', 'URL'];

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleFieldToggle = (field: string) => {
    setIncludeFields(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate mock export data
      const headers = [];
      if (includeFields.personalInfo) headers.push('NPI', 'First Name', 'Last Name', 'Credentials', 'Gender', 'Date of Birth');
      if (includeFields.contactInfo) headers.push('Email', 'Phone', 'Alternate Phone');
      if (includeFields.professionalInfo) headers.push('Primary Specialty', 'Secondary Specialty', 'Taxonomy Code');
      if (includeFields.licenseInfo) headers.push('License State', 'License Number', 'License Issue Date', 'License Expire Date');
      if (includeFields.gmeTraining) headers.push('Program Name', 'Institution', 'Program Type', 'Training Start', 'Training End', 'PGY Year');
      if (includeFields.provenance) headers.push('Source Type', 'Source Artifact', 'Source URL', 'Entered By', 'Entered At');

      const sampleData = [
        '1234567890', 'John', 'Doe', 'MD', 'M', '1990-01-15',
        'john.doe@hospital.edu', '555-123-4567', '555-987-6543',
        'Internal Medicine', 'Cardiology', '207R00000X',
        'CA', 'A12345', '2020-06-15', '2025-06-15',
        'Internal Medicine Residency', 'UCLA Medical Center', 'Residency', '2020-07-01', '2023-06-30', 'PGY-3',
        'Template', 'residents_batch_2024.csv', '', 'John Doe', '2024-01-15T10:30:00Z'
      ].slice(0, headers.length);

      let content = '';
      if (exportFormat === 'csv') {
        content = `${headers.join(',')}\n${sampleData.join(',')}`;
      } else {
        // For Excel format, we'd use a library like xlsx
        content = `${headers.join('\t')}\n${sampleData.join('\t')}`;
      }

      const blob = new Blob([content], { 
        type: exportFormat === 'csv' ? 'text/csv' : 'application/vnd.ms-excel' 
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dmp_export_${new Date().toISOString().split('T')[0]}.${exportFormat}`;
      a.click();
      window.URL.revokeObjectURL(url);

      alert('Export completed successfully!');
      
    } catch (error) {
      console.error('Export error:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const getRecordCount = () => {
    // Mock calculation based on filters
    let count = 2847; // Base count
    
    if (filters.specialty) count = Math.floor(count * 0.3);
    if (filters.state) count = Math.floor(count * 0.4);
    if (filters.status) count = Math.floor(count * 0.8);
    
    return count;
  };

  return (
    <Layout breadcrumbs={[
      { label: 'DMP Dashboard', href: '/dmp' },
      { label: 'Data Export' }
    ]}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-3">
            <Download className="h-8 w-8 text-purple-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Data Export</h1>
              <p className="text-gray-600 mt-1">
                Generate filtered exports with full field compliance
              </p>
            </div>
          </div>
        </div>

        {/* Export Configuration */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Export Configuration</h2>
          
          {/* Filters */}
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-4 flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Data Filters
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Primary Specialty
                  </label>
                  <select
                    value={filters.specialty}
                    onChange={(e) => handleFilterChange('specialty', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">All States</option>
                    {states.map(state => (
                      <option key={state} value={state}>{state}</option>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">All Program Types</option>
                    {programTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">All Statuses</option>
                    {statuses.map(status => (
                      <option key={status} value={status} className="capitalize">{status}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date Range
                  </label>
                  <select
                    value={filters.dateRange}
                    onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="7d">Last 7 days</option>
                    <option value="30d">Last 30 days</option>
                    <option value="90d">Last 90 days</option>
                    <option value="1y">Last year</option>
                    <option value="all">All time</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Source Type
                  </label>
                  <select
                    value={filters.sourceType}
                    onChange={(e) => handleFilterChange('sourceType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">All Sources</option>
                    {sourceTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Field Selection */}
            <div>
              <h3 className="font-medium text-gray-900 mb-4">Include Field Groups</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(includeFields).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id={key}
                      checked={value}
                      onChange={() => handleFieldToggle(key)}
                      className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <label htmlFor={key} className="text-sm text-gray-700 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Export Format */}
            <div>
              <h3 className="font-medium text-gray-900 mb-4">Export Format</h3>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="exportFormat"
                    value="csv"
                    checked={exportFormat === 'csv'}
                    onChange={(e) => setExportFormat(e.target.value)}
                    className="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">CSV</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="exportFormat"
                    value="xlsx"
                    checked={exportFormat === 'xlsx'}
                    onChange={(e) => setExportFormat(e.target.value)}
                    className="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">Excel (XLSX)</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Export Preview */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Export Preview</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-900">Records to Export</span>
              </div>
              <p className="text-2xl font-bold text-blue-900 mt-1">{getRecordCount().toLocaleString()}</p>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-900">Fields Included</span>
              </div>
              <p className="text-2xl font-bold text-green-900 mt-1">
                {Object.values(includeFields).filter(Boolean).length * 6}
              </p>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Download className="h-5 w-5 text-purple-600" />
                <span className="font-medium text-purple-900">Format</span>
              </div>
              <p className="text-2xl font-bold text-purple-900 mt-1">{exportFormat.toUpperCase()}</p>
            </div>
          </div>

          {/* Active Filters Summary */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-900 mb-3">Active Filters</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(filters).map(([key, value]) => {
                if (!value || value === '30d') return null;
                return (
                  <span key={key} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {key}: {value}
                  </span>
                );
              })}
              {Object.entries(filters).filter(([key, value]) => value && value !== '30d').length === 0 && (
                <span className="text-sm text-gray-500 italic">No filters applied - exporting all records</span>
              )}
            </div>
          </div>

          {/* Export Button */}
          <div className="flex justify-center">
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="flex items-center space-x-2 px-8 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExporting ? (
                <>
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  <span>Generating Export...</span>
                </>
              ) : (
                <>
                  <Download className="h-5 w-5" />
                  <span>Generate Export</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Export Guidelines */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Export Guidelines</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Data Compliance</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• All exports include full provenance tracking</li>
                <li>• PHI handling follows institutional policies</li>
                <li>• Export logs maintained for audit purposes</li>
                <li>• Data use restricted to authorized personnel</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-3">File Formats</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• CSV: Universal compatibility, smaller file size</li>
                <li>• XLSX: Excel native, preserves formatting</li>
                <li>• All exports include data dictionary</li>
                <li>• Field headers match UDB schema</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}