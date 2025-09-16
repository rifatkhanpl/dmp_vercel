import React, { useState, useEffect } from 'react';
import { Layout } from '../Layout/Layout';
import { BookmarkButton } from '../ui/BookmarkButton';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  FileText, 
  Calendar,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';

interface AnalyticsData {
  totalProviders: number;
  newProvidersThisMonth: number;
  totalImports: number;
  successRate: number;
  topSpecialties: Array<{ name: string; count: number }>;
  monthlyRegistrations: Array<{ month: string; count: number }>;
  importStats: Array<{ type: string; count: number; successRate: number }>;
}

export function Analytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30d');

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      setData({
        totalProviders: 1247,
        newProvidersThisMonth: 89,
        totalImports: 23,
        successRate: 94.2,
        topSpecialties: [
          { name: 'Internal Medicine', count: 234 },
          { name: 'Emergency Medicine', count: 187 },
          { name: 'Pediatrics', count: 156 },
          { name: 'Surgery', count: 143 },
          { name: 'Cardiology', count: 98 }
        ],
        monthlyRegistrations: [
          { month: 'Jan', count: 45 },
          { month: 'Feb', count: 67 },
          { month: 'Mar', count: 89 },
          { month: 'Apr', count: 76 },
          { month: 'May', count: 92 },
          { month: 'Jun', count: 89 }
        ],
        importStats: [
          { type: 'Template Upload', count: 12, successRate: 96.5 },
          { type: 'AI Mapping', count: 8, successRate: 91.2 },
          { type: 'URL Extraction', count: 3, successRate: 88.7 }
        ]
      });
      setIsLoading(false);
    }, 1000);
  }, [dateRange]);

  if (isLoading) {
    return (
      <Layout breadcrumbs={[{ label: 'Analytics' }]}>
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading analytics...</span>
        </div>
      </Layout>
    );
  }

  return (
    <Layout breadcrumbs={[{ label: 'Analytics' }]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-1">Provider registration and import analytics</p>
          </div>
          <div className="flex items-center space-x-3">
            <BookmarkButton
              title="Analytics Dashboard"
              url="/analytics"
              category="Analytics"
              icon="BarChart3"
            />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Providers</p>
                <p className="text-2xl font-bold text-gray-900">{data?.totalProviders.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">New This Month</p>
                <p className="text-2xl font-bold text-gray-900">{data?.newProvidersThisMonth}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Imports</p>
                <p className="text-2xl font-bold text-gray-900">{data?.totalImports}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">{data?.successRate}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Registrations */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Registrations</h3>
            <div className="space-y-3">
              {data?.monthlyRegistrations.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{item.month}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(item.count / 100) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Specialties */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Specialties</h3>
            <div className="space-y-3">
              {data?.topSpecialties.map((specialty, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{specialty.name}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${(specialty.count / 250) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8">{specialty.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Import Statistics */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Import Method Performance</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Import Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Imports
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Success Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performance
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data?.importStats.map((stat, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {stat.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {stat.count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {stat.successRate}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            stat.successRate >= 95 ? 'bg-green-600' :
                            stat.successRate >= 90 ? 'bg-yellow-600' : 'bg-red-600'
                          }`}
                          style={{ width: `${stat.successRate}%` }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}