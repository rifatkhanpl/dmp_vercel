import React, { useState } from 'react';
import { Layout } from '../Layout/Layout';
import { ImportJob } from '../../types/dmp';
import { 
  BarChart3,
  RefreshCw,
  Download,
  Eye,
  Filter,
  Calendar,
  User,
  FileText,
  Globe,
  Brain,
  Upload,
  CheckCircle,
  AlertTriangle,
  Clock,
  X
} from 'lucide-react';

export function JobConsole() {
  const [jobs, setJobs] = useState<ImportJob[]>([
    {
      id: 'job_1705123456789',
      type: 'template',
      status: 'completed',
      fileName: 'residents_batch_2024.csv',
      totalRecords: 45,
      successCount: 42,
      errorCount: 0,
      warningCount: 3,
      errors: [
        { row: 12, field: 'phone', message: 'Phone format corrected', severity: 'warning' },
        { row: 23, field: 'email', message: 'Email domain verified', severity: 'warning' },
        { row: 34, field: 'specialty', message: 'Specialty standardized', severity: 'warning' }
      ],
      createdAt: '2024-01-15T10:30:00Z',
      completedAt: '2024-01-15T10:32:15Z',
      createdBy: 'John Doe'
    },
    {
      id: 'job_1705123456790',
      type: 'url',
      status: 'partial',
      sourceUrl: 'https://medicine.ucla.edu/residents',
      totalRecords: 28,
      successCount: 25,
      errorCount: 3,
      warningCount: 5,
      errors: [
        { row: 5, field: 'npi', message: 'Invalid NPI format', severity: 'error' },
        { row: 12, field: 'licenseNumber', message: 'License number missing', severity: 'error' },
        { row: 18, field: 'email', message: 'Email not found', severity: 'warning' }
      ],
      createdAt: '2024-01-15T09:15:00Z',
      completedAt: '2024-01-15T09:18:30Z',
      createdBy: 'Sarah Johnson'
    },
    {
      id: 'job_1705123456791',
      type: 'ai-map',
      status: 'processing',
      fileName: 'fellowship_data.xlsx',
      totalRecords: 0,
      successCount: 0,
      errorCount: 0,
      warningCount: 0,
      errors: [],
      createdAt: '2024-01-15T08:45:00Z',
      createdBy: 'Mike Chen'
    },
    {
      id: 'job_1705123456792',
      type: 'template',
      status: 'failed',
      fileName: 'invalid_format.csv',
      totalRecords: 0,
      successCount: 0,
      errorCount: 1,
      warningCount: 0,
      errors: [
        { row: 0, field: 'file', message: 'File format not recognized', severity: 'error' }
      ],
      createdAt: '2024-01-14T16:20:00Z',
      completedAt: '2024-01-14T16:20:05Z',
      createdBy: 'Emily Rodriguez'
    }
  ]);

  const [filters, setFilters] = useState({
    type: '',
    status: '',
    createdBy: '',
    dateRange: '7d'
  });
  const [showFilters, setShowFilters] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'processing':
        return <RefreshCw className="h-4 w-4 animate-spin" />;
      case 'partial':
        return <AlertTriangle className="h-4 w-4" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'template':
        return <Upload className="h-4 w-4" />;
      case 'ai-map':
        return <Brain className="h-4 w-4" />;
      case 'url':
        return <Globe className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesType = !filters.type || job.type === filters.type;
    const matchesStatus = !filters.status || job.status === filters.status;
    const matchesCreatedBy = !filters.createdBy || job.createdBy.toLowerCase().includes(filters.createdBy.toLowerCase());
    
    // Date range filter
    const jobDate = new Date(job.createdAt);
    const now = new Date();
    const daysAgo = parseInt(filters.dateRange.replace('d', ''));
    const cutoffDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
    const matchesDate = jobDate >= cutoffDate;
    
    return matchesType && matchesStatus && matchesCreatedBy && matchesDate;
  });

  const handleRetryJob = (jobId: string) => {
    // TODO: Implement job retry
    console.log('Retrying job:', jobId);
    alert('Job retry initiated');
  };

  const handleDownloadReport = (job: ImportJob) => {
    const report = {
      jobId: job.id,
      type: job.type,
      status: job.status,
      fileName: job.fileName,
      sourceUrl: job.sourceUrl,
      totalRecords: job.totalRecords,
      successCount: job.successCount,
      errorCount: job.errorCount,
      warningCount: job.warningCount,
      errors: job.errors,
      createdAt: job.createdAt,
      completedAt: job.completedAt,
      createdBy: job.createdBy
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `job_report_${job.id}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      status: '',
      createdBy: '',
      dateRange: '7d'
    });
  };

  return (
    <Layout breadcrumbs={[
      { label: 'DMP Dashboard', href: '/dmp' },
      { label: 'Job Console' }
    ]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Import & Crawl Job Console</h1>
                <p className="text-gray-600 mt-1">
                  Monitor import job status, history, and error logs
                </p>
              </div>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{jobs.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  {jobs.filter(j => j.status === 'completed').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Processing</p>
                <p className="text-2xl font-bold text-blue-600">
                  {jobs.filter(j => j.status === 'processing').length}
                </p>
              </div>
              <RefreshCw className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Failed</p>
                <p className="text-2xl font-bold text-red-600">
                  {jobs.filter(j => j.status === 'failed').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Filter Jobs</h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
              {Object.values(filters).filter(v => v && v !== '7d').length > 0 && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {Object.values(filters).filter(v => v && v !== '7d').length}
                </span>
              )}
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Types</option>
                  <option value="template">Template Upload</option>
                  <option value="ai-map">AI Mapping</option>
                  <option value="url">URL Extraction</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Statuses</option>
                  <option value="completed">Completed</option>
                  <option value="processing">Processing</option>
                  <option value="partial">Partial</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Created By</label>
                <input
                  type="text"
                  value={filters.createdBy}
                  onChange={(e) => setFilters(prev => ({ ...prev, createdBy: e.target.value }))}
                  placeholder="User name..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                <select
                  value={filters.dateRange}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="1d">Last 24 hours</option>
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
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

        {/* Jobs Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Import Jobs ({filteredJobs.length})
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Records
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Issues
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {getTypeIcon(job.type)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {job.fileName || job.sourceUrl || 'Import Job'}
                          </div>
                          <div className="text-sm text-gray-500 capitalize">
                            {job.type.replace('-', ' ')} Import
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                        {getStatusIcon(job.status)}
                        <span className="ml-1 capitalize">{job.status}</span>
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {job.successCount} / {job.totalRecords}
                      </div>
                      <div className="text-sm text-gray-500">
                        {job.totalRecords > 0 ? Math.round((job.successCount / job.totalRecords) * 100) : 0}% success
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        {job.errorCount > 0 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            {job.errorCount} errors
                          </span>
                        )}
                        {job.warningCount > 0 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            {job.warningCount} warnings
                          </span>
                        )}
                        {job.errorCount === 0 && job.warningCount === 0 && job.status === 'completed' && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Clean
                          </span>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(job.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        by {job.createdBy}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleDownloadReport(job)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Download Report"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button
                          className="text-green-600 hover:text-green-900"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {job.status === 'failed' && (
                          <button
                            onClick={() => handleRetryJob(job.id)}
                            className="text-purple-600 hover:text-purple-900"
                            title="Retry Job"
                          >
                            <RefreshCw className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Job Details Modal would go here */}
        
      </div>
    </Layout>
  );
}