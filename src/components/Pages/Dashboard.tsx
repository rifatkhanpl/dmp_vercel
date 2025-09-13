import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Layout } from '../Layout/Layout';
import { BarChart3, Users, FileText, Settings, Shield, User } from 'lucide-react';

export function Dashboard() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const isAdmin = user.role === 'admin';

  const stats = [
    {
      name: 'Total Providers',
      value: '2,847',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      name: 'Pending Enrollments',
      value: '23',
      icon: FileText,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      name: 'Active Licenses',
      value: '2,654',
      icon: BarChart3,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      name: 'System Health',
      value: '98.5%',
      icon: Settings,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  return (
    <Layout breadcrumbs={[{ label: 'Dashboard' }]}>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Welcome back, {user.name}!</h1>
              <p className="text-blue-100 mt-1">
                {isAdmin ? 'Administrator Dashboard' : 'Provider Relations Dashboard'}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {isAdmin ? (
                <Shield className="w-8 h-8 text-blue-200" />
              ) : (
                <User className="w-8 h-8 text-blue-200" />
              )}
            </div>
          </div>
          
          {isAdmin && (
            <div className="mt-4 p-3 bg-blue-500 bg-opacity-50 rounded-md">
              <p className="text-sm text-blue-100">
                <strong>Administrator Access:</strong> You have full system access including user management, 
                system configuration, and advanced reporting features.
              </p>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.name} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className={`${stat.bgColor} rounded-lg p-3`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="font-medium text-gray-900">Search Providers</div>
                <div className="text-sm text-gray-500">Find healthcare providers by name, NPI, or specialty</div>
              </button>
              <button className="w-full text-left p-3 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="font-medium text-gray-900">New Enrollment</div>
                <div className="text-sm text-gray-500">Start a new provider enrollment process</div>
              </button>
              {isAdmin && (
                <button className="w-full text-left p-3 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className="font-medium text-gray-900">Bulk Import</div>
                  <div className="text-sm text-gray-500">Import multiple provider records</div>
                </button>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Provider enrollment completed</p>
                  <p className="text-xs text-gray-500">Dr. Sarah Johnson - 2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">License verification updated</p>
                  <p className="text-xs text-gray-500">Dr. Michael Chen - 15 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Pending review required</p>
                  <p className="text-xs text-gray-500">Dr. Emily Rodriguez - 1 hour ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}