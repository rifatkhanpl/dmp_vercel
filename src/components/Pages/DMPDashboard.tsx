import React, { useState } from 'react';
import { Layout } from '../Layout/Layout';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Upload,
  Brain,
  Globe,
  Users,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Download,
  RefreshCw,
  Eye,
  Filter
} from 'lucide-react';

export function DMPDashboard() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('week');

  const stats = [
    {
      title: 'Total Records',
      value: '12,847',
      change: '+156',
      changeType: 'positive' as const,
      icon: Users,
      description: 'this week'
    },
    {
      title: 'Pending Validation',
      value: '23',
      change: '-5',
      changeType: 'negative' as const,
      icon: Clock,
      description: 'from last week'
    },
    {
      title: 'Import Jobs',
      value: '8',
      change: '+3',
      changeType: 'positive' as const,
      icon: Upload,
      description: 'this week'
    },
    {
      title: 'Data Quality',
      value: '98.2%',
      change: '+0.3%',
      changeType: 'positive' as const,
      icon: CheckCircle,
      description: 'validation rate'
    }
  ];

  const ingestionModes = [
    {
      title: 'Template Upload',
      description: 'Upload CSV/XLSX files using our standardized template',
      icon: Upload,
      href: '/dmp/template-upload',
      color: 'blue',
      features: ['Strict validation', 'Row-level errors', 'Partial commit']
    },
    {
      title: 'AI-Assisted Mapping',
      description: 'Smart mapping of arbitrary file formats with confidence scoring',
      icon: Brain,
      href: '/dmp/ai-mapping',
      color: 'purple',
      features: ['Header detection', 'Manual review', 'Saved profiles']
    },
    {
      title: 'URL Extraction',
      description: 'Extract resident data from residency program websites',
      icon: Globe,
      href: '/dmp/url-extraction',
      color: 'green',
      features: ['Compliance checks', 'Provenance tracking', 'QA review']
    }
  ];

  const recentJobs = [
    {
      id: '1',
      type: 'template',
      fileName: 'residents_batch_2024.csv',
      status: 'completed',
      records: 45,
      errors: 0,
      warnings: 2,
      createdAt: '2024-01-15T10:30:00Z',
      createdBy: 'John Doe'
    },
    {
      id: '2',
      type: 'url',
      sourceUrl: 'https://medicine.ucla.edu/residents',
      status: 'partial',
      records: 28,
      errors: 3,
      warnings: 5,
      createdAt: '2024-01-15T09:15:00Z',
      createdBy: 'Sarah Johnson'
    },
    {
      id: '3',
      type: 'ai-map',
      fileName: 'fellowship_data.xlsx',
      status: 'processing',
      records: 0,
      errors: 0,
      warnings: 0,
      createdAt: '2024-01-15T08:45:00Z',
      createdBy: 'Mike Chen'
    }
  ];

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

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-500 text-white hover:bg-blue-600',
      purple: 'bg-purple-500 text-white hover:bg-purple-600',
      green: 'bg-green-500 text-white hover:bg-green-600'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Residents/Fellows Data Management Platform
              </h1>
              <p className="text-gray-600 mt-1">
                Internal residents/fellows data collection and validation for PracticeLink Universal Data Bank
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="quarter">Last Quarter</option>
              </select>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                <Download className="h-4 w-4" />
                <span>Export Data</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      <span className={`text-sm font-medium ${
                        stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">{stat.description}</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Ingestion Modes */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Data Ingestion Modes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ingestionModes.map((mode, index) => {
              const Icon = mode.icon;
              return (
                <div key={index} className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-md transition-all">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg ${getColorClasses(mode.color)}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">{mode.title}</h3>
                      <p className="text-sm text-gray-600 mb-4">{mode.description}</p>
                      <ul className="text-xs text-gray-500 space-y-1 mb-4">
                        {mode.features.map((feature, idx) => (
                          <li key={idx}>• {feature}</li>
                        ))}
                      </ul>
                      <a
                        href={mode.href}
                        className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${getColorClasses(mode.color)}`}
                      >
                        Start Import
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Import Jobs */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Import Jobs</h2>
              <a href="/dmp/jobs" className="text-sm text-blue-600 hover:text-blue-700">
                View all jobs →
              </a>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {recentJobs.map((job) => (
              <div key={job.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full">
                      {job.type === 'template' && <Upload className="h-5 w-5 text-blue-600" />}
                      {job.type === 'ai-map' && <Brain className="h-5 w-5 text-purple-600" />}
                      {job.type === 'url' && <Globe className="h-5 w-5 text-green-600" />}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-gray-900">
                          {job.fileName || job.sourceUrl || 'Import Job'}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                          {getStatusIcon(job.status)}
                          <span className="ml-1 capitalize">{job.status}</span>
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                        <span>{job.records} records</span>
                        {job.errors > 0 && <span className="text-red-600">{job.errors} errors</span>}
                        {job.warnings > 0 && <span className="text-yellow-600">{job.warnings} warnings</span>}
                        <span>by {job.createdBy}</span>
                        <span>{new Date(job.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md">
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <a
              href="/dmp/template-upload"
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
            >
              <FileText className="h-8 w-8 text-blue-600 mb-3" />
              <h3 className="font-medium text-gray-900 mb-1">Download Template</h3>
              <p className="text-sm text-gray-600">Get the latest CSV template</p>
            </a>
            <a
              href="/dmp/jobs"
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
            >
              <BarChart3 className="h-8 w-8 text-green-600 mb-3" />
              <h3 className="font-medium text-gray-900 mb-1">View Job Console</h3>
              <p className="text-sm text-gray-600">Monitor import progress</p>
            </a>
            <a
              href="/dmp/duplicates"
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
            >
              <Users className="h-8 w-8 text-orange-600 mb-3" />
              <h3 className="font-medium text-gray-900 mb-1">Review Duplicates</h3>
              <p className="text-sm text-gray-600">Merge duplicate records</p>
            </a>
            <a
              href="/dmp/export"
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
            >
              <Download className="h-8 w-8 text-purple-600 mb-3" />
              <h3 className="font-medium text-gray-900 mb-1">Export Data</h3>
              <p className="text-sm text-gray-600">Generate filtered exports</p>
            </a>
          </div>
        </div>

        {/* Compliance Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-blue-900">Compliance & Data Governance</h3>
              <p className="text-sm text-blue-700 mt-1">
                This platform handles internal Employer Candidate Data. All imports must comply with PracticeLink Terms of Service. 
                URL extraction is restricted to authorized educational institution websites only. 
                All records include full provenance tracking for audit and compliance purposes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}