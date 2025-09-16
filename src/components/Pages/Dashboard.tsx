import React, { useState, useEffect } from 'react';
import { Layout } from '../Layout/Layout';
import { useAuth } from '../../contexts/AuthContext';
import { BookmarkButton } from '../ui/BookmarkButton';
import { 
  Users, 
  FileText, 
  TrendingUp, 
  AlertTriangle,
  Plus,
  Search,
  BarChart3,
  Database,
  Clock,
  CheckCircle,
  XCircle,
  Activity
} from 'lucide-react';

interface DashboardStats {
  totalProviders: number;
  pendingApprovals: number;
  recentImports: number;
  dataQualityScore: number;
  recentActivity: Array<{
    id: string;
    type: 'registration' | 'import' | 'update' | 'approval';
    description: string;
    timestamp: string;
    user: string;
  }>;
}

export function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      setStats({
        totalProviders: 1247,
        pendingApprovals: 23,
        recentImports: 5,
        dataQualityScore: 94.2,
        recentActivity: [
          {
            id: '1',
            type: 'registration',
            description: 'New provider registered: Dr. Sarah Johnson, MD',
            timestamp: '2 hours ago',
            user: 'John Doe'
          },
          {
            id: '2',
            type: 'import',
            description: 'Bulk import completed: 45 providers from UCLA',
            timestamp: '4 hours ago',
            user: 'Jane Smith'
          },
          {
            id: '3',
            type: 'approval',
            description: 'Provider approved: Dr. Michael Chen, DO',
            timestamp: '6 hours ago',
            user: 'Admin User'
          },
          {
            id: '4',
            type: 'update',
            description: 'Provider profile updated: Dr. Emily Rodriguez, MD',
            timestamp: '1 day ago',
            user: 'John Doe'
          }
        ]
      });
      setIsLoading(false);
    }, 1000);
  }, []);

  const quickActions = [
    {
      title: 'Register New Provider',
      description: 'Add a new healthcare provider to the system',
      href: '/hcp-registration',
      icon: Plus,
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Bulk Import',
      description: 'Import multiple providers from CSV or Excel',
      href: '/bulk-import',
      icon: FileText,
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Search Providers',
      description: 'Search and filter existing providers',
      href: '/search',
      icon: Search,
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: 'View Analytics',
      description: 'View detailed analytics and reports',
      href: '/analytics',
      icon: BarChart3,
      color: 'bg-orange-500 hover:bg-orange-600'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'registration': return <Plus className="h-4 w-4 text-blue-500" />;
      case 'import': return <FileText className="h-4 w-4 text-green-500" />;
      case 'approval': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'update': return <Activity className="h-4 w-4 text-purple-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user?.firstName}!
            </h1>
            <p className="text-gray-600 mt-1">
              Here's what's happening with your provider data today.
            </p>
          </div>
          <BookmarkButton
            title="Dashboard"
            url="/dashboard"
            category="Main"
            icon="Home"
          />
        </div>

        {/* Key Metrics */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Providers</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.totalProviders.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.pendingApprovals}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Recent Imports</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.recentImports}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Database className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Data Quality</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.dataQualityScore}%</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <div key={index} className="relative group">
                  <a
                    href={action.href}
                    className={`block p-4 rounded-lg text-white transition-colors ${action.color}`}
                  >
                    <Icon className="h-8 w-8 mb-3" />
                    <h3 className="font-semibold mb-1">{action.title}</h3>
                    <p className="text-sm opacity-90">{action.description}</p>
                  </a>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <BookmarkButton
                      title={action.title}
                      url={action.href}
                      category="Quick Actions"
                      icon={action.icon.name}
                      size="sm"
                      variant="minimal"
                      showText={false}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <a href="/analytics" className="text-sm text-blue-600 hover:text-blue-700">
              View all analytics →
            </a>
          </div>
          
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-start space-x-3 animate-pulse">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {stats?.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-500">
                      {activity.timestamp} • by {activity.user}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}