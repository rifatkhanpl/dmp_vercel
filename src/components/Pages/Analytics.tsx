import React, { useState } from 'react';
import { Layout } from '../Layout/Layout';
import { useAuth } from '../../contexts/AuthContext';
import { 
  BarChart3,
  TrendingUp,
  Users,
  UserPlus,
  Activity,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Building,
  GraduationCap,
  Stethoscope,
  MapPin,
  Award,
  CheckCircle,
  AlertTriangle,
  Clock
} from 'lucide-react';

export function Analytics() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('month');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for institutions
  const institutionStats = {
    total: 847,
    active: 823,
    pending: 15,
    inactive: 9,
    byType: {
      'Academic Medical Center': 245,
      'Community Hospital': 387,
      'Specialty Hospital': 89,
      'Veterans Affairs': 67,
      'Children\'s Hospital': 59
    },
    byState: {
      'CA': 156,
      'TX': 98,
      'NY': 87,
      'FL': 76,
      'PA': 65,
      'Others': 365
    },
    recentActivity: [
      { type: 'new', name: 'Stanford Medical Center', date: '2024-01-15', status: 'active' },
      { type: 'updated', name: 'UCLA Medical Center', date: '2024-01-14', status: 'accreditation_renewed' },
      { type: 'new', name: 'Riverside Community Hospital', date: '2024-01-13', status: 'pending' }
    ]
  };

  // Mock data for programs
  const programStats = {
    total: 2847,
    residency: 2156,
    fellowship: 691,
    active: 2789,
    pending: 58,
    bySpecialty: {
      'Internal Medicine': 387,
      'Family Medicine': 298,
      'Emergency Medicine': 245,
      'Surgery': 189,
      'Pediatrics': 167,
      'Others': 1561
    },
    byAccreditation: {
      'ACGME': 2654,
      'AOA': 156,
      'Other': 37
    },
    recentActivity: [
      { type: 'new', name: 'Cardiology Fellowship - Mayo Clinic', date: '2024-01-15', positions: 8 },
      { type: 'updated', name: 'Internal Medicine - Johns Hopkins', date: '2024-01-14', positions: 45 },
      { type: 'new', name: 'Emergency Medicine - UCLA', date: '2024-01-13', positions: 36 }
    ]
  };

  // Mock data for HCP-RF (Healthcare Provider - Residents/Fellows)
  const hcpRfStats = {
    total: 45678,
    residents: 34567,
    fellows: 11111,
    active: 44234,
    pending: 1234,
    validated: 43456,
    bySpecialty: {
      'Internal Medicine': 8934,
      'Surgery': 6789,
      'Emergency Medicine': 5678,
      'Family Medicine': 4567,
      'Pediatrics': 3456,
      'Others': 16254
    },
    byPgyYear: {
      'PGY-1': 15234,
      'PGY-2': 12345,
      'PGY-3': 9876,
      'PGY-4': 5432,
      'PGY-5+': 2791
    },
    byState: {
      'CA': 8934,
      'TX': 6789,
      'NY': 5678,
      'FL': 4567,
      'PA': 3456,
      'Others': 16254
    },
    recentActivity: [
      { type: 'registered', name: 'Dr. Sarah Johnson, MD', specialty: 'Internal Medicine', date: '2024-01-15' },
      { type: 'validated', name: 'Dr. Michael Chen, DO', specialty: 'Emergency Medicine', date: '2024-01-14' },
      { type: 'updated', name: 'Dr. Emily Rodriguez, MD', specialty: 'Pediatrics', date: '2024-01-13' }
    ]
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleExport = () => {
    const dataToExport = {
      institutions: institutionStats,
      programs: programStats,
      hcpRf: hcpRfStats,
      exportedAt: new Date().toISOString(),
      timeRange
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics_export_${timeRange}_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Comprehensive analytics for Institutions, Programs, and Residents/Fellows
              </p>
            </div>
            <div className="flex space-x-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="quarter">Last Quarter</option>
                <option value="year">Last Year</option>
              </select>
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
              <button
                onClick={handleExport}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('institutions')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'institutions'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Institutions
              </button>
              <button
                onClick={() => setActiveTab('programs')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'programs'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Programs
              </button>
              <button
                onClick={() => setActiveTab('hcp-rf')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'hcp-rf'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Residents/Fellows
              </button>
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Processed Institutions</p>
                    <p className="text-2xl font-bold text-gray-900">{institutionStats.total.toLocaleString()}</p>
                    <p className="text-sm text-green-600 mt-1">+{institutionStats.pending} pending</p>
                  </div>
                  <Building className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Programs</p>
                    <p className="text-2xl font-bold text-gray-900">{programStats.total.toLocaleString()}</p>
                    <p className="text-sm text-blue-600 mt-1">{programStats.residency} residency, {programStats.fellowship} fellowship</p>
                  </div>
                  <GraduationCap className="h-8 w-8 text-green-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Residents/Fellows</p>
                    <p className="text-2xl font-bold text-gray-900">{hcpRfStats.total.toLocaleString()}</p>
                    <p className="text-sm text-purple-600 mt-1">{hcpRfStats.residents.toLocaleString()} residents, {hcpRfStats.fellows.toLocaleString()} fellows</p>
                  </div>
                  <Stethoscope className="h-8 w-8 text-purple-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Data Quality</p>
                    <p className="text-2xl font-bold text-gray-900">98.2%</p>
                    <p className="text-sm text-green-600 mt-1">Validation rate</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-orange-600" />
                </div>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Institution Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Active</span>
                    <span className="text-sm font-medium text-green-600">{institutionStats.active}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Pending Review</span>
                    <span className="text-sm font-medium text-yellow-600">{institutionStats.pending}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Inactive</span>
                    <span className="text-sm font-medium text-gray-600">{institutionStats.inactive}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Program Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Residency Programs</span>
                    <span className="text-sm font-medium text-blue-600">{programStats.residency.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Fellowship Programs</span>
                    <span className="text-sm font-medium text-purple-600">{programStats.fellowship.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">ACGME Accredited</span>
                    <span className="text-sm font-medium text-green-600">{programStats.byAccreditation.ACGME.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">HCP-RF Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Validated Records</span>
                    <span className="text-sm font-medium text-green-600">{hcpRfStats.validated.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Pending Validation</span>
                    <span className="text-sm font-medium text-yellow-600">{hcpRfStats.pending.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Validation Rate</span>
                    <span className="text-sm font-medium text-green-600">
                      {((hcpRfStats.validated / hcpRfStats.total) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Institutions Tab */}
        {activeTab === 'institutions' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Processed Institutions</p>
                    <p className="text-2xl font-bold text-gray-900">{institutionStats.total}</p>
                    <p className="text-sm text-green-600 mt-1">+12 this month</p>
                  </div>
                  <Building className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active</p>
                    <p className="text-2xl font-bold text-green-600">{institutionStats.active}</p>
                    <p className="text-sm text-gray-500 mt-1">{((institutionStats.active / institutionStats.total) * 100).toFixed(1)}% of total</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending Review</p>
                    <p className="text-2xl font-bold text-yellow-600">{institutionStats.pending}</p>
                    <p className="text-sm text-gray-500 mt-1">Awaiting approval</p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Academic Medical Centers</p>
                    <p className="text-2xl font-bold text-purple-600">{institutionStats.byType['Academic Medical Center']}</p>
                    <p className="text-sm text-gray-500 mt-1">Major teaching hospitals</p>
                  </div>
                  <Award className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </div>

            {/* Institution Type Distribution */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Institution Type Distribution</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {Object.entries(institutionStats.byType).map(([type, count]) => (
                  <div key={type} className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">{count}</p>
                    <p className="text-sm text-gray-600 mt-1">{type}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {((count / institutionStats.total) * 100).toFixed(1)}%
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Top States by Institution Count */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Top States by Institution Count</h2>
              <div className="space-y-3">
                {Object.entries(institutionStats.byState).slice(0, 5).map(([state, count]) => (
                  <div key={state} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-gray-900">{state}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-gray-900">{count}</span>
                      <span className="text-sm text-gray-500 ml-2">institutions</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Institution Activity */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Institution Activity</h2>
              <div className="space-y-4">
                {institutionStats.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full ${
                      activity.type === 'new' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      <Building className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.type === 'new' ? 'New institution added' : 'Institution updated'}
                      </p>
                      <p className="text-sm text-gray-600">{activity.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{new Date(activity.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Programs Tab */}
        {activeTab === 'programs' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Programs</p>
                    <p className="text-2xl font-bold text-gray-900">{programStats.total.toLocaleString()}</p>
                    <p className="text-sm text-green-600 mt-1">+{programStats.pending} pending</p>
                  </div>
                  <GraduationCap className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Residency Programs</p>
                    <p className="text-2xl font-bold text-blue-600">{programStats.residency.toLocaleString()}</p>
                    <p className="text-sm text-gray-500 mt-1">{((programStats.residency / programStats.total) * 100).toFixed(1)}% of total</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Fellowship Programs</p>
                    <p className="text-2xl font-bold text-purple-600">{programStats.fellowship.toLocaleString()}</p>
                    <p className="text-sm text-gray-500 mt-1">{((programStats.fellowship / programStats.total) * 100).toFixed(1)}% of total</p>
                  </div>
                  <Award className="h-8 w-8 text-purple-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">ACGME Accredited</p>
                    <p className="text-2xl font-bold text-green-600">{programStats.byAccreditation.ACGME.toLocaleString()}</p>
                    <p className="text-sm text-gray-500 mt-1">{((programStats.byAccreditation.ACGME / programStats.total) * 100).toFixed(1)}% of total</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </div>

            {/* Program Specialty Distribution */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Specialties by Program Count</h2>
              <div className="space-y-3">
                {Object.entries(programStats.bySpecialty).slice(0, 5).map(([specialty, count]) => (
                  <div key={specialty} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Stethoscope className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-gray-900">{specialty}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-gray-900">{count}</span>
                      <span className="text-sm text-gray-500 ml-2">programs</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Program Activity */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Program Activity</h2>
              <div className="space-y-4">
                {programStats.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full ${
                      activity.type === 'new' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      <GraduationCap className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.type === 'new' ? 'New program added' : 'Program updated'}
                      </p>
                      <p className="text-sm text-gray-600">{activity.name}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {activity.positions} positions • {new Date(activity.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* HCP-RF Tab */}
        {activeTab === 'hcp-rf' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total HCP-RF</p>
                    <p className="text-2xl font-bold text-gray-900">{hcpRfStats.total.toLocaleString()}</p>
                    <p className="text-sm text-green-600 mt-1">+{hcpRfStats.pending.toLocaleString()} pending</p>
                  </div>
                  <Stethoscope className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Residents</p>
                    <p className="text-2xl font-bold text-blue-600">{hcpRfStats.residents.toLocaleString()}</p>
                    <p className="text-sm text-gray-500 mt-1">{((hcpRfStats.residents / hcpRfStats.total) * 100).toFixed(1)}% of total</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Fellows</p>
                    <p className="text-2xl font-bold text-purple-600">{hcpRfStats.fellows.toLocaleString()}</p>
                    <p className="text-sm text-gray-500 mt-1">{((hcpRfStats.fellows / hcpRfStats.total) * 100).toFixed(1)}% of total</p>
                  </div>
                  <Award className="h-8 w-8 text-purple-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Validated</p>
                    <p className="text-2xl font-bold text-green-600">{hcpRfStats.validated.toLocaleString()}</p>
                    <p className="text-sm text-gray-500 mt-1">{((hcpRfStats.validated / hcpRfStats.total) * 100).toFixed(1)}% validation rate</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </div>

            {/* HCP-RF by Specialty */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Specialties by HCP Count</h2>
              <div className="space-y-3">
                {Object.entries(hcpRfStats.bySpecialty).slice(0, 5).map(([specialty, count]) => (
                  <div key={specialty} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Stethoscope className="h-5 w-5 text-purple-600" />
                      <span className="font-medium text-gray-900">{specialty}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-gray-900">{count.toLocaleString()}</span>
                      <span className="text-sm text-gray-500 ml-2">residents/fellows</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* HCP-RF by PGY Year */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Distribution by PGY Year</h2>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {Object.entries(hcpRfStats.byPgyYear).map(([pgyYear, count]) => (
                  <div key={pgyYear} className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">{count.toLocaleString()}</p>
                    <p className="text-sm text-gray-600 mt-1">{pgyYear}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {((count / hcpRfStats.total) * 100).toFixed(1)}%
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent HCP-RF Activity */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent HCP-RF Activity</h2>
              <div className="space-y-4">
                {hcpRfStats.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full ${
                      activity.type === 'registered' ? 'bg-green-100 text-green-600' :
                      activity.type === 'validated' ? 'bg-blue-100 text-blue-600' :
                      'bg-purple-100 text-purple-600'
                    }`}>
                      <UserPlus className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.type === 'registered' ? 'New provider registered' :
                         activity.type === 'validated' ? 'Provider validated' :
                         'Provider updated'}
                      </p>
                      <p className="text-sm text-gray-600">{activity.name} - {activity.specialty}</p>
                      <p className="text-xs text-gray-500 mt-1">{new Date(activity.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* HCP-RF by State */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Top States by HCP Count</h2>
              <div className="space-y-3">
                {Object.entries(hcpRfStats.byState).slice(0, 5).map(([state, count]) => (
                  <div key={state} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-gray-900">{state}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-gray-900">{count.toLocaleString()}</span>
                      <span className="text-sm text-gray-500 ml-2">residents/fellows</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Charts Placeholder - keeping original for overview */}
        {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Institution Growth Trends</h3>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Chart visualization would go here</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Program Type Distribution</h3>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Chart visualization would go here</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">HCP-RF Specialty Distribution</h3>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Chart visualization would go here</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Geographic Distribution</h3>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Chart visualization would go here</p>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Recent Activity */}
        {activeTab === 'overview' && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent System Activity</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <UserPlus className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">New institution added</p>
                <p className="text-xs text-gray-500">Stanford Medical Center - Academic Medical Center</p>
                <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <GraduationCap className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">New program approved</p>
                <p className="text-xs text-gray-500">Cardiology Fellowship - Mayo Clinic (8 positions)</p>
                <p className="text-xs text-gray-500 mt-1">4 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <Stethoscope className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">HCP-RF bulk import completed</p>
                <p className="text-xs text-gray-500">156 residents/fellows imported successfully</p>
                <p className="text-xs text-gray-500 mt-1">6 hours ago</p>
              </div>
            </div>
          </div>
        </div>
        )}
      </div>
    </Layout>
  );
}