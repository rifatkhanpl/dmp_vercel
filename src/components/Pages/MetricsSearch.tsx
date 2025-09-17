import React, { useState, useEffect } from 'react';
import { Layout } from '../Layout/Layout';
import { ErrorBoundary } from '../ErrorBoundary';
import { MetricsService } from '../../services/metricsService';
import { UserProductionMetric, MetricDefinition, MetricFilter, MetricSort } from '../../types/metrics';
import { useAuth } from '../../contexts/AuthContext';
import { useDebounce } from '../../hooks/useDebounce';
import { SecurityUtils } from '../../utils/security';
import { errorService } from '../../services/errorService';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { 
  Search,
  Filter,
  Download,
  ChevronDown,
  X,
  Eye,
  Edit,
  Trash2,
  BarChart3,
  Users,
  Calendar,
  Target,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Minus,
  CheckCircle,
  AlertTriangle,
  Clock,
  Award,
  Activity
} from 'lucide-react';

export function MetricsSearch() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<UserProductionMetric[]>([]);
  const [metricDefinitions, setMetricDefinitions] = useState<MetricDefinition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [metricsToDelete, setMetricsToDelete] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const pageSize = 50;

  const [filters, setFilters] = useState<MetricFilter>({
    dateRange: '30d'
  });

  const [sort, setSort] = useState<MetricSort>({
    field: 'createdAt',
    direction: 'desc'
  });

  const loadMetrics = async () => {
    try {
      setIsLoading(true);
      
      // Apply search to filters
      const searchFilters = { ...filters };
      if (debouncedSearchQuery) {
        // Search will be applied on the backend or client-side
      }

      const { data, total } = await MetricsService.searchMetrics(
        searchFilters,
        sort,
        currentPage,
        pageSize
      );
      
      setMetrics(data);
      setTotalRecords(total);
    } catch (error) {
      errorService.showError('Failed to load metrics');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMetricDefinitions = async () => {
    try {
      const definitions = await MetricsService.getMetricDefinitions();
      setMetricDefinitions(definitions);
    } catch (error) {
      errorService.showError('Failed to load metric definitions');
    }
  };

  useEffect(() => {
    loadMetricDefinitions();
  }, []);

  useEffect(() => {
    loadMetrics();
  }, [filters, sort, currentPage, debouncedSearchQuery]);

  const handleFilterChange = (key: keyof MetricFilter, value: string | number) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === '' ? undefined : value
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({ dateRange: '30d' });
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleSort = (field: MetricSort['field']) => {
    setSort(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleMetricSelect = (metricId: string) => {
    setSelectedMetrics(prev => 
      prev.includes(metricId) 
        ? prev.filter(id => id !== metricId)
        : [...prev, metricId]
    );
  };

  const handleSelectAll = () => {
    if (selectedMetrics.length === metrics.length) {
      setSelectedMetrics([]);
    } else {
      setSelectedMetrics(metrics.map(m => m.id));
    }
  };

  const handleBulkDelete = () => {
    if (selectedMetrics.length === 0) return;
    setMetricsToDelete(selectedMetrics);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await MetricsService.deleteMetrics(metricsToDelete);
      errorService.showSuccess(`Deleted ${metricsToDelete.length} metrics`);
      setSelectedMetrics([]);
      setShowDeleteDialog(false);
      setMetricsToDelete([]);
      await loadMetrics();
    } catch (error) {
      errorService.showError('Failed to delete metrics');
    }
  };

  const handleExport = async () => {
    try {
      const csvData = await MetricsService.exportMetrics(filters, 'csv');
      
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `metrics_export_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      errorService.showSuccess('Metrics exported successfully');
    } catch (error) {
      errorService.showError('Failed to export metrics');
    }
  };

  const getDimensionColor = (dimension: string) => {
    const colors: Record<string, string> = {
      productivity: 'bg-blue-100 text-blue-800',
      quality: 'bg-green-100 text-green-800',
      efficiency: 'bg-purple-100 text-purple-800',
      engagement: 'bg-orange-100 text-orange-800',
      coverage: 'bg-indigo-100 text-indigo-800',
      ai_performance: 'bg-pink-100 text-pink-800',
      compliance: 'bg-red-100 text-red-800'
    };
    return colors[dimension] || 'bg-gray-100 text-gray-800';
  };

  const getAchievementColor = (achievementRate?: number) => {
    if (!achievementRate) return 'text-gray-500';
    if (achievementRate >= 100) return 'text-green-600';
    if (achievementRate >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const calculateAchievementRate = (metric: UserProductionMetric): number | undefined => {
    if (!metric.definition?.targetValue) return undefined;
    return MetricsService.calculateAchievementRate(metric.value, metric.definition.targetValue, metric.unit);
  };

  // Get unique values for filters
  const dimensions = [...new Set(metrics.map(m => m.dimension))];
  const metricTypes = [...new Set(metrics.map(m => m.metricType))];
  const units = [...new Set(metrics.map(m => m.unit))];
  const users = [...new Set(metrics.map(m => m.user ? `${m.user.firstName} ${m.user.lastName}` : ''))].filter(Boolean);

  const activeFilterCount = Object.values(filters).filter(v => v !== undefined && v !== '30d').length;

  const totalPages = Math.ceil(totalRecords / pageSize);

  // Filter metrics by search query (client-side for now)
  const filteredMetrics = metrics.filter(metric => {
    if (!debouncedSearchQuery) return true;
    
    const sanitizedQuery = SecurityUtils.sanitizeText(debouncedSearchQuery).toLowerCase();
    const userName = metric.user ? `${metric.user.firstName} ${metric.user.lastName}`.toLowerCase() : '';
    const displayName = metric.definition?.displayName?.toLowerCase() || '';
    const metricType = metric.metricType.toLowerCase();
    const dimension = metric.dimension.toLowerCase();
    
    return userName.includes(sanitizedQuery) ||
           displayName.includes(sanitizedQuery) ||
           metricType.includes(sanitizedQuery) ||
           dimension.includes(sanitizedQuery);
  });

  return (
    <ErrorBoundary>
      <Layout breadcrumbs={[
        { label: 'Production Metrics', href: '/metrics-dashboard' },
        { label: 'Metrics Search' }
      ]}>
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Production Metrics Search</h1>
                <p className="text-gray-600 mt-1">
                  Search, filter, and manage user production metrics
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleExport}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </button>
                <a
                  href="/metrics-dashboard"
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>Dashboard</span>
                </a>
              </div>
            </div>
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
                    placeholder="Search metrics by user name, metric type, or dimension..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    maxLength={100}
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
              </div>

              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dimension</label>
                    <select
                      value={filters.dimension || ''}
                      onChange={(e) => handleFilterChange('dimension', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Dimensions</option>
                      {dimensions.map(dimension => (
                        <option key={dimension} value={dimension}>
                          {dimension.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Metric Type</label>
                    <select
                      value={filters.metricType || ''}
                      onChange={(e) => handleFilterChange('metricType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Metrics</option>
                      {metricDefinitions.map(def => (
                        <option key={def.metricType} value={def.metricType}>
                          {def.displayName}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                    <select
                      value={filters.dateRange || '30d'}
                      onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="7d">Last 7 days</option>
                      <option value="30d">Last 30 days</option>
                      <option value="90d">Last 90 days</option>
                      <option value="365d">Last year</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                    <select
                      value={filters.unit || ''}
                      onChange={(e) => handleFilterChange('unit', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Units</option>
                      {units.map(unit => (
                        <option key={unit} value={unit}>{unit}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Min Value</label>
                    <input
                      type="number"
                      value={filters.minValue || ''}
                      onChange={(e) => handleFilterChange('minValue', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Value</label>
                    <input
                      type="number"
                      value={filters.maxValue || ''}
                      onChange={(e) => handleFilterChange('maxValue', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="1000"
                    />
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
          {selectedMetrics.length > 0 && user?.role === 'administrator' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-900">
                  {selectedMetrics.length} metric{selectedMetrics.length !== 1 ? 's' : ''} selected
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={handleExport}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    <Download className="h-4 w-4" />
                    <span>Export Selected</span>
                  </button>
                  <button
                    onClick={handleBulkDelete}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete Selected</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Metrics ({totalRecords.toLocaleString()})
                </h2>
                {user?.role === 'administrator' && (
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedMetrics.length === metrics.length && metrics.length > 0}
                      onChange={handleSelectAll}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="text-sm text-gray-600">Select All</label>
                  </div>
                )}
              </div>
            </div>

            {isLoading ? (
              <div className="p-12 text-center">
                <LoadingSpinner size="lg" text="Loading metrics..." />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {user?.role === 'administrator' && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <input
                            type="checkbox"
                            checked={selectedMetrics.length === metrics.length && metrics.length > 0}
                            onChange={handleSelectAll}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </th>
                      )}
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('userName')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>User</span>
                          {sort.field === 'userName' && (
                            sort.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                          )}
                        </div>
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('metricType')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Metric</span>
                          {sort.field === 'metricType' && (
                            sort.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                          )}
                        </div>
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('dimension')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Dimension</span>
                          {sort.field === 'dimension' && (
                            sort.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                          )}
                        </div>
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('value')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Value</span>
                          {sort.field === 'value' && (
                            sort.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                          )}
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Target & Achievement
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('createdAt')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Created</span>
                          {sort.field === 'createdAt' && (
                            sort.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                          )}
                        </div>
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredMetrics.map((metric) => {
                      const achievementRate = calculateAchievementRate(metric);
                      return (
                        <tr key={metric.id} className="hover:bg-gray-50">
                          {user?.role === 'administrator' && (
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="checkbox"
                                checked={selectedMetrics.includes(metric.id)}
                                onChange={() => handleMetricSelect(metric.id)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                            </td>
                          )}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8">
                                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                  <span className="text-xs font-medium text-blue-600">
                                    {metric.user?.firstName?.[0]}{metric.user?.lastName?.[0]}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">
                                  {metric.user?.firstName} {metric.user?.lastName}
                                </div>
                                <div className="text-sm text-gray-500">{metric.user?.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {metric.definition?.displayName || metric.metricType}
                            </div>
                            <div className="text-sm text-gray-500">{metric.metricType}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDimensionColor(metric.dimension)}`}>
                              {metric.dimension.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {metric.unit === 'percentage' ? metric.value.toFixed(1) : metric.value.toLocaleString()} {metric.unit}
                            </div>
                            {metric.attribute && (
                              <div className="text-sm text-gray-500">{metric.attribute}</div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {metric.definition?.targetValue ? (
                              <div className="space-y-1">
                                <div className="text-sm text-gray-900">
                                  Target: {metric.definition.targetValue} {metric.unit}
                                </div>
                                {achievementRate && (
                                  <div className={`text-sm font-medium ${getAchievementColor(achievementRate)}`}>
                                    {achievementRate.toFixed(1)}% achieved
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-sm text-gray-500">No target</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(metric.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => {
                                  // View metric details
                                  console.log('View metric details:', metric);
                                }}
                                className="text-blue-600 hover:text-blue-900"
                                title="View Details"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              {user?.role === 'administrator' && (
                                <>
                                  <button
                                    onClick={() => {
                                      // Edit metric
                                      console.log('Edit metric:', metric);
                                    }}
                                    className="text-green-600 hover:text-green-900"
                                    title="Edit Metric"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      setMetricsToDelete([metric.id]);
                                      setShowDeleteDialog(true);
                                    }}
                                    className="text-red-600 hover:text-red-900"
                                    title="Delete Metric"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalRecords)} of {totalRecords} results
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <span className="px-3 py-2 text-gray-700">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Delete Confirmation Dialog */}
          <ConfirmDialog
            isOpen={showDeleteDialog}
            onClose={() => {
              setShowDeleteDialog(false);
              setMetricsToDelete([]);
            }}
            onConfirm={confirmDelete}
            title="Delete Metrics"
            message={`Are you sure you want to delete ${metricsToDelete.length} metric${metricsToDelete.length !== 1 ? 's' : ''}? This action cannot be undone.`}
            confirmText="Delete"
            type="danger"
          />
        </div>
      </Layout>
    </ErrorBoundary>
  );
}