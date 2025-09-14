import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Layout } from '../Layout/Layout';
import { 
  Users, 
  UserPlus, 
  Upload, 
  Search, 
  BarChart3, 
  TrendingUp,
  Clock,
  CheckCircle
} from 'lucide-react';

export function Dashboard() {
  const { user } = useAuth();

  const stats = [
    {
      name: 'Total Providers',
      value: '2,847',
      change: '+12%',
      changeType: 'increase',
      icon: Users
    },
    {
      name: 'New This Month',
      value: '156',
      change: '+8%',
      changeType: 'increase',
      icon: UserPlus
    },
    {
      name: 'Pending Verification',
      value: '23',
      change: '-5%',
      changeType: 'decrease',
      icon: Clock
    },
    {
      name: 'Verified Profiles',
      value: '2,824',
      change: '+15%',
      changeType: 'increase',
      icon: CheckCircle
    }
  ];

  const quickActions = [
    {
      name: 'Register New HCP',
      description: 'Add a new healthcare provider to the system',
      href: '/hcp-registration',
      icon: UserPlus,
      color: 'bg-blue-500'
    },
    {
      name: 'Bulk Import',
      description: 'Import multiple providers from CSV or Excel',
      href: '/bulk-import',
      icon: Upload,
      color: 'bg-green-500'
    },
    {
      name: 'Search Providers',
      description: 'Find and manage existing provider records',
      href: '/search',
      icon: Search,
      color: 'bg-purple-500'
    },
    {
      name: 'View Reports',
      description: 'Generate analytics and performance reports',
      href: '/reports',
      icon: BarChart3,
      color: 'bg-orange-500'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      action: 'New provider registered',
      details: 'Dr. Sarah Johnson, MD - Internal Medicine',
      time: '2 hours ago',
      type: 'registration'
    },
    {
      id: 2,
      action: 'Bulk import completed',
      details: '45 providers imported successfully',
      time: '4 hours ago',
      type: 'import'
    },
    {
      id: 3,
      action: 'Profile updated',
      details: 'Dr. Michael Chen, DO - Emergency Medicine',
      time: '6 hours ago',
      type: 'update'
    },
    {
      id: 4,
      action: 'Verification completed',
      details: 'Dr. Emily Rodriguez, MD - Pediatrics',
      time: '1 day ago',
      type: 'verification'
    }
  ];

  return (
    <Layout breadcrumbs={[{ label: 'Dashboard' }]}>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user?.firstName}!
              </h1>
              <p className="text-gray-600 mt-1">
                Here's what's happening with your provider data today.
              </p>
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>Role:</span>
                <span className="font-medium text-gray-900 capitalize">
                  {user?.role.replace(/-/g, ' ')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.name} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-full">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <TrendingUp className={`h-4 w-4 ${
                    stat.changeType === 'increase' ? 'text-green-500' : 'text-red-500'
                  }`} />
                  <span className={`ml-2 text-sm font-medium ${
                    stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="ml-2 text-sm text-gray-500">from last month</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <a
                  key={action.name}
                  href={action.href}
                  className="group p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${action.color}`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 group-hover:text-blue-600">
                        {action.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.details}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <a
              href="/activity"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View all activity →
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}