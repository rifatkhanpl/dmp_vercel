import React, { useState } from 'react';
import { Layout } from '../Layout/Layout';
import { useAuth } from '../../contexts/AuthContext';
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
  Zap,
  GraduationCap,
  Building
} from 'lucide-react';

export function Dashboard() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('month');

  // Mock data for dashboard
  const gmeStats = [
    {
      title: 'GME-R Programs YTD',
      value: '847',
      change: '+18%',
      changeType: 'positive' as const,
      yoyChange: '+22%',
      yoyChangeType: 'positive' as const,
      icon: GraduationCap,
      description: 'from last month',
      yoyDescription: 'vs last year'
    },
    {
      title: 'GME-R Programs MTD',
      value: '67',
      change: '+14%',
      changeType: 'positive' as const,
      yoyChange: '+19%',
      yoyChangeType: 'positive' as const,
      icon: Building,
      description: 'from last month',
      yoyDescription: 'vs last year'
    },
    {
      title: 'GME-R Programs WTD',
      value: '12',
      change: '-3%',
      changeType: 'negative' as const,
      yoyChange: '+8%',
      yoyChangeType: 'positive' as const,
      icon: Calendar,
      description: 'from last week',
      yoyDescription: 'vs last year'
    },
    {
      title: 'GME-R Programs WIP',
      value: '823',
      change: '+16%',
      changeType: 'positive' as const,
      yoyChange: '+25%',
      yoyChangeType: 'positive' as const,
      icon: Activity,
      description: 'from last month',
      yoyDescription: 'vs last year'
    }
  ];

  const stats = [
    {
      title: 'HCP-Rs YTD',
      value: '2,847',
      change: '+12%',
      changeType: 'positive' as const,
      icon: Users,
      description: 'from last month'
    },
    {
      title: 'HCP-Rs MTD',
      value: '156',
      change: '+8%',
      changeType: 'positive' as const,
      icon: UserPlus,
      description: 'from last month'
    },
    {
      title: 'HCP-Rs WTD',
      value: '23',
      change: '-5%',
      changeType: 'negative' as const,
      icon: Clock,
      description: 'from last month'
    },
    {
      title: 'HCP-Rs in WIP',
      value: '2,824',
      change: '+15%',
      changeType: 'positive' as const,
      icon: CheckCircle,
      description: 'from last month'
    }
  ];

  const gmeFStats = [
    {
      title: 'GME-F Programs YTD',
      value: '234',
      change: '+15%',
      changeType: 'positive' as const,
      yoyChange: '+28%',
      yoyChangeType: 'positive' as const,
      icon: Award,
      description: 'from last month',
      yoyDescription: 'vs last year'
    },
    {
      title: 'GME-F Programs MTD',
      value: '18',
      change: '+11%',
      changeType: 'positive' as const,
      yoyChange: '+24%',
      yoyChangeType: 'positive' as const,
      icon: Target,
      description: 'from last month',
      yoyDescription: 'vs last year'
    },
    {
      title: 'GME-F Programs WTD',
      value: '4',
      change: '+0%',
      changeType: 'positive' as const,
      yoyChange: '+33%',
      yoyChangeType: 'positive' as const,
      icon: Zap,
      description: 'from last week',
      yoyDescription: 'vs last year'
    },
    {
      title: 'GME-F Programs WIP',
      value: '227',
      change: '+13%',
      changeType: 'positive' as const,
      yoyChange: '+31%',
      yoyChangeType: 'positive' as const,
      icon: TrendingUp,
      description: 'from last month',
      yoyDescription: 'vs last year'
    }
  ];

  const quickActions = [
    {
      title: 'Add RF-HCP',
      description: 'One at a time.',
      icon: UserPlus,
      href: '/hcp-registration',
      color: 'blue'
    },
    {
      title: 'Import RF-HCPs',
      description: 'With CSV, URL, or Copy/Paste.',
      icon: Upload,
      href: '/bulk-import',
      color: 'green'
    },
    {
      title: 'Search RF-HCPs WIP',
      description: 'Find and manage RF-HCPs in process.',
      icon: Search,
      href: '/search',
      color: 'purple'
    },
    {
      title: 'View RF-HCP Reports',
      description: 'Generate analytics and performance reports',
      icon: BarChart3,
      href: '/analytics',
      color: 'orange'
    }
  ];

  const recentActivity = [
    {
      id: '1',
      type: 'registration',
      title: 'New provider registered',
      description: 'Dr. Sarah Johnson, MD - Internal Medicine',
      time: '2 hours ago',
      icon: UserPlus,
      color: 'blue'
    },
    {
      id: '2',
      type: 'import',
      title: 'Bulk import completed',
      description: '45 providers imported successfully',
      time: '4 hours ago',
      icon: Upload,
      color: 'green'
    },
    {
      id: '3',
      type: 'update',
      title: 'Profile updated',
      description: 'Dr. Michael Chen, DO - Emergency Medicine',
      time: '6 hours ago',
      icon: FileText,
      color: 'purple'
    },
    {
      id: '4',
      type: 'verification',
      title: 'Verification completed',
      description: 'Dr. Emily Rodriguez, MD - Pediatrics',
      time: '1 day ago',
      icon: CheckCircle,
      color: 'green'
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
    <Layout showBreadcrumbs={false}>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user?.firstName}!
              </h1>
              <p className="text-gray-600 mt-1">
                Here's what's happening with the Resident & Fellow Data Management Portal today!
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
          {gmeStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start justify-between h-full">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    <div className="space-y-1 mt-2">
                      <div className="flex items-center">
                        <span className={`text-sm font-medium ${
                          stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {stat.change}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">{stat.description}</span>
                      </div>
                      <div className="flex items-center">
                        <span className={`text-sm font-medium ${
                          stat.yoyChangeType === 'positive' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {stat.yoyChange}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">{stat.yoyDescription}</span>
                      </div>
                    </div>
                  </div>
                  <div className={`p-3 rounded-full ${getIconColorClasses('purple')} flex-shrink-0 ml-4`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* HCP-Rs Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
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

        {/* GME-F Programs Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {gmeFStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start justify-between h-full">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    <div className="space-y-1 mt-2">
                      <div className="flex items-center">
                        <span className={`text-sm font-medium ${
                          stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {stat.change}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">{stat.description}</span>
                      </div>
                      <div className="flex items-center">
                        <span className={`text-sm font-medium ${
                          stat.yoyChangeType === 'positive' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {stat.yoyChange}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">{stat.yoyDescription}</span>
                      </div>
                    </div>
                  </div>
                  <div className={`p-3 rounded-full ${getIconColorClasses('orange')} flex-shrink-0 ml-4`}>
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
            <a href="/activity" className="text-sm text-blue-600 hover:text-blue-700">
              View all activity →
            </a>
          </div>
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