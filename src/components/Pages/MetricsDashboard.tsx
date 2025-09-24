import React, { useState, useEffect } from 'react';
import { Layout } from '../Layout/Layout';
import { ErrorBoundary } from '../ErrorBoundary';
import { MetricsService } from '../../services/metricsService';
import { DashboardMetrics, MetricDimension } from '../../types/metrics';
import { useAuth } from '../../contexts/AuthContext';
import { errorService } from '../../services/errorService';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { 
  BarChart3,
  TrendingUp,
  Users,
  Target,
  Award,
  Activity,
  RefreshCw,
  Download,
  Filter,
  Calendar,
  Eye,
  ArrowUp,
  ArrowDown,
  Minus,
  CheckCircle,
  AlertTriangle,
  Clock
} from 'lucide-react';

export function MetricsDashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedDimension, setSelectedDimension] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const data = await MetricsService.getDashboardMetrics(timeRange);
      setDashboardData(data);
    } catch (error) {
      errorService.showError('Failed to load dashboard metrics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [timeRange]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadDashboardData();
    setIsRefreshing(false);
  };

  const handleExport = async () => {
    try {
      const csvData = await MetricsService.exportMetrics({
        dateRange: timeRange
      }, 'csv');
      
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `production_metrics_${timeRange}_${new Date().toISOString().split('T')[0]}.csv`;
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

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up':
        return <ArrowUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <ArrowDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getAchievementIcon = (achievementRate?: number) => {
    if (!achievementRate) return <Clock className="h-4 w-4 text-gray-400" />;
    if (achievementRate >= 100) return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (achievementRate >= 80) return <Target className="h-4 w-4 text-yellow-600" />;
    return <AlertTriangle className="h-4 w-4 text-red-600" />;
  };

  const filteredDimensions = selectedDimension === 'all' 
    ? Object.entries(dashboardData?.dimensionSummaries || {})
    : [[selectedDimension, dashboardData?.dimensionSummaries[selectedDimension] || []]];

  if (isLoading) {
    return (
      <Layout breadcrumbs={[{ label: 'Production Metrics Dashboard' }]}>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" text="Loading metrics dashboard..." />
        </div>
      </Layout>
    );
  }

  return (
    <ErrorBoundary>
      <Layout>
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Production Metrics Dashboard</h1>
                <p className="text-gray-600 mt-1">
                  Track user performance and system productivity metrics
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="365d">Last year</option>
                </select>
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50"
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
                <button
                  onClick={handleExport}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </button>
                <a
                  href="/metrics-search"
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  <Eye className="h-4 w-4" />
                  <span>View Details</span>
                </a>
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardData?.summary.totalUsers || 0}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold text-green-600">{dashboardData?.summary.activeUsers || 0}</p>
                </div>
                <Activity className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Metrics</p>
                  <p className="text-2xl font-bold text-purple-600">{dashboardData?.summary.totalMetrics || 0}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Performance</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {dashboardData?.summary.averagePerformance?.toFixed(1) || 0}%
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </div>

          {/* Dimension Filter */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Filter by Dimension:</span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedDimension('all')}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedDimension === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All Dimensions
                </button>
                {Object.keys(dashboardData?.dimensionSummaries || {}).map(dimension => (
                  <button
                    key={dimension}
                    onClick={() => setSelectedDimension(dimension)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedDimension === dimension
                        ? 'bg-blue-600 text-white'
                        : getDimensionColor(dimension)
                    }`}
                  >
                    {dimension.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Top Performers */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Top Performers</h2>
              <a href="/metrics-search?sort=performance" className="text-sm text-blue-600 hover:text-blue-700">
                View all →
              </a>
            </div>
            <div className="space-y-3">
              {dashboardData?.topPerformers.slice(0, 5).map((performer, index) => (
                <div key={performer.userId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0 ? 'bg-yellow-100 text-yellow-800' :
                      index === 1 ? 'bg-gray-100 text-gray-800' :
                      index === 2 ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{performer.userName}</p>
                      <p className="text-sm text-gray-500">
                        {Object.keys(performer.metrics).length} active metrics
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{performer.totalScore.toFixed(1)}</p>
                    <p className="text-sm text-gray-500">performance score</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Metrics by Dimension */}
          <div className="space-y-6">
            {filteredDimensions.map(([dimension, metrics]) => (
              <div key={dimension} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium mr-3 ${getDimensionColor(dimension)}`}>
                      {dimension.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                    Metrics
                  </h2>
                  <a 
                    href={`/metrics-search?dimension=${dimension}`}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    View details →
                  </a>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {metrics.map((metric) => (
                    <div key={metric.metricType} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 text-sm">{metric.displayName}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-2xl font-bold text-gray-900">
                              {metric.unit === 'percentage' ? metric.averageValue.toFixed(1) : metric.totalValue.toLocaleString()}
                            </span>
                            <span className="text-sm text-gray-500">{metric.unit}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          {metric.trend && getTrendIcon(metric.trend)}
                          {metric.achievementRate && getAchievementIcon(metric.achievementRate)}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {metric.targetValue && (
                          <div className="flex justify-between text-xs text-gray-600">
                            <span>Target: {metric.targetValue} {metric.unit}</span>
                            {metric.achievementRate && (
                              <span className={`font-medium ${
                                metric.achievementRate >= 100 ? 'text-green-600' :
                                metric.achievementRate >= 80 ? 'text-yellow-600' : 'text-red-600'
                              }`}>
                                {metric.achievementRate.toFixed(1)}%
                              </span>
                            )}
                          </div>
                        )}
                        
                        {metric.targetValue && (
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                (metric.achievementRate || 0) >= 100 ? 'bg-green-500' :
                                (metric.achievementRate || 0) >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${Math.min(metric.achievementRate || 0, 100)}%` }}
                            />
                          </div>
                        )}
                        
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>{metric.recordCount} records</span>
                          {metric.trendPercentage && (
                            <span className={`flex items-center space-x-1 ${
                              metric.trend === 'up' ? 'text-green-600' : 
                              metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                            }`}>
                              {getTrendIcon(metric.trend)}
                              <span>{Math.abs(metric.trendPercentage).toFixed(1)}%</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Metric Activity</h2>
              <a href="/metrics-search" className="text-sm text-blue-600 hover:text-blue-700">
                View all activity →
              </a>
            </div>
            <div className="space-y-3">
              {dashboardData?.recentActivity.slice(0, 10).map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {activity.userName}
                      </p>
                      <p className="text-sm text-gray-600">
                        {activity.metricType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}: {activity.value} {activity.unit}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(activity.createdAt).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    </ErrorBoundary>
  );
}