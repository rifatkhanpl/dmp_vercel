import React, { useState, useEffect } from 'react';
import { Layout } from '../Layout/Layout';
import { useAuth } from '../../contexts/AuthContext';
import { HealthcareProviderService } from '../../services/healthcareProviderService';
import { ImportJobService } from '../../services/importJobService';
import { errorService } from '../../services/errorService';
import { 
  Users,
  UserPlus,
  Upload,
  Search,
  BarChart3,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  Activity,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Award,
  Target,
  Zap
} from 'lucide-react';

export function Dashboard() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('month');
  const [stats, setStats] = useState({
    totalProviders: 0,
    newThisMonth: 0,
    pendingVerification: 0,
    verifiedProfiles: 0
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load dashboard data
  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Get provider statistics
      const { total: totalProviders } = await HealthcareProviderService.getProviders({ limit: 1 });
      const { total: pendingCount } = await HealthcareProviderService.getProviders({ status: 'pending', limit: 1 });
      const { total: approvedCount } = await HealthcareProviderService.getProviders({ status: 'approved', limit: 1 });
      
      // Get recent import jobs for activity
      const { data: recentJobs } = await ImportJobService.getImportJobs({ limit: 10 });
      
      setStats({
        totalProviders,
        newThisMonth: Math.floor(totalProviders * 0.1), // Estimate
        pendingVerification: pendingCount,
        verifiedProfiles: approvedCount
      });
      
      // Transform jobs to activity format
      const activity = recentJobs.map(job => ({
        id: job.id,
        type: job.type === 'template' ? 'import' : job.type === 'url' ? 'extraction' : 'mapping',
        title: job.status === 'completed' ? 'Import completed' : 
               job.status === 'failed' ? 'Import failed' : 'Import in progress',
        description: job.file_name || job.source_url || 'Import job',
        time: new Date(job.created_at).toLocaleString(),
        icon: job.type === 'template' ? Upload : job.type === 'url' ? Globe : Brain,
        color: job.status === 'completed' ? 'green' : 
               job.status === 'failed' ? 'red' : 'blue'
      }));
      
      setRecentActivity(activity);
      
    } catch (error) {
      errorService.showError('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [timeRange]);

  const dashboardStats = [
    {
      title: 'Total Providers',
      value: stats.totalProviders.toLocaleString(),
      change: '+12%',
      changeType: 'positive' as const,
      icon: Users,
      description: 'from last month'
    },
    {
      title: 'New This Month',
      value: stats.newThisMonth.toLocaleString(),
      change: '+8%',
      changeType: 'positive' as const,
      icon: UserPlus,
      description: 'from last month'
    },
    {
      title: 'Pending Verification',
      value: stats.pendingVerification.toLocaleString(),
      change: '-5%',
      changeType: 'negative' as const,
      icon: Clock,
      description: 'from last week'
    },
    {
      title: 'Verified Profiles',
      value: stats.verifiedProfiles.toLocaleString(),
      change: '+15%',
      changeType: 'positive' as const,
      icon: CheckCircle,
      description: 'from last month'
    }
  ];

  const quickActions = [
    {
      title: 'Register New HCP',
      description: 'Add a new healthcare provider to the system',
      icon: UserPlus,
      href: '/hcp-registration',
      color: 'blue'
    },
    {
      title: 'Bulk Import',
      description: 'Import multiple providers from CSV or Excel',
      icon: Upload,
      href: '/bulk-import',
      color: 'green'
    },
    {
      title: 'Search Providers',
      description: 'Find and manage existing provider records',
      icon: Search,
      href: '/search',
      color: 'purple'
    },
    {
      title: 'View Reports',
      description: 'Generate analytics and performance reports',
      icon: BarChart3,
      href: '/analytics',
      color: 'orange'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-500 text-white',
      green: 'bg-green-500 text-white',
      purple: 'bg-purple-500 text-white',
      orange: 'bg-orange-500 text-white',
      red: 'bg-red-500 text-white'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getIconColorClasses = (color: string) => {
    const colors = {
      blue: 'text-blue-600 bg-blue-100',
      green: 'text-green-600 bg-green-100',
      purple: 'text-purple-600 bg-purple-100',
      orange: 'text-orange-600 bg-orange-100',
      red: 'text-red-600 bg-red-100'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <Layout breadcrumbs={[{ label: 'Dashboard' }]}>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user?.firstName}!
              </h1>
              <p className="text-gray-600 mt-1">
                Here's what's happening with the HCP-DMP today!
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Role:</p>
              <p className="font-medium text-gray-900 capitalize">
                {user?.role === 'administrator' ? 'Administrator' : 'Coordinator'}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start justify-between h-full">
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
                  <div className={`p-3 rounded-full ${getIconColorClasses('blue')} flex-shrink-0 ml-4`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <a
                  key={index}
                  href={action.href}
                  className="group p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${getColorClasses(action.color)}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 group-hover:text-blue-600">
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">{action.description}</p>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <a href="/dmp/jobs" className="text-sm text-blue-600 hover:text-blue-700">
              View all activity →
            </a>
          </div>
          {isLoading ? (
            <LoadingSpinner text="Loading recent activity..." />
          ) : (
          <div className="space-y-4">
            {recentActivity.map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`p-2 rounded-full ${getIconColorClasses(activity.color)}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center py-8">
          <p className="text-sm text-gray-500">
            PracticeLink<sup>®</sup> © 2025 PracticeLink. All rights reserved. | 
            <a href="#" className="text-blue-600 hover:text-blue-700 ml-1">Privacy Policy</a> | 
            <a href="#" className="text-blue-600 hover:text-blue-700 ml-1">Terms of Service</a>
          </p>
        </div>
      </div>
    </Layout>
  );
}