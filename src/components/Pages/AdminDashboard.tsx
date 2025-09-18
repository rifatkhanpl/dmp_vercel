import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  UserPlus,
  Settings,
  FileText,
  Database,
  Activity,
  Shield,
  Upload,
  Download,
  BarChart
} from 'lucide-react';
import { Layout } from '../Layout/Layout';
import { useAuth } from '../../contexts/AuthContext';

export function AdminDashboard() {
  const { user } = useAuth();

  const adminCards = [
    {
      title: 'User Management',
      description: 'Manage users, roles, and permissions',
      icon: Users,
      link: '/user-management',
      color: 'bg-blue-500'
    },
    {
      title: 'Add New User',
      description: 'Create new user accounts',
      icon: UserPlus,
      link: '/add-user',
      color: 'bg-green-500'
    },
    {
      title: 'System Settings',
      description: 'Configure system-wide settings',
      icon: Settings,
      link: '/user-settings',
      color: 'bg-gray-600'
    },
    {
      title: 'Analytics Dashboard',
      description: 'View system analytics and metrics',
      icon: BarChart,
      link: '/analytics',
      color: 'bg-purple-500'
    },
    {
      title: 'Bulk Operations',
      description: 'Import and manage bulk data',
      icon: Database,
      link: '/bulk-import',
      color: 'bg-indigo-500'
    },
    {
      title: 'Template Management',
      description: 'Manage data templates and mappings',
      icon: FileText,
      link: '/dmp/template-upload',
      color: 'bg-yellow-500'
    },
    {
      title: 'Data Export',
      description: 'Export system data and reports',
      icon: Download,
      link: '/dmp/export',
      color: 'bg-teal-500'
    },
    {
      title: 'Job Console',
      description: 'Monitor and manage background jobs',
      icon: Activity,
      link: '/dmp/jobs',
      color: 'bg-orange-500'
    },
    {
      title: 'Security Audit',
      description: 'View security logs and audit trails',
      icon: Shield,
      link: '/metrics-dashboard',
      color: 'bg-red-500'
    }
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome back, {user?.firstName}! Manage your system from here.
          </p>
        </div>

        <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-yellow-600 mr-2" />
                <span className="text-sm font-medium text-yellow-800">Current Role:</span>
              </div>
              <p className="mt-1 text-lg font-bold text-yellow-900 capitalize">
                {user?.role.replace(/-/g, ' ')}
              </p>
              <p className="mt-1 text-sm text-yellow-700">
                You have full system access. Please exercise caution when making changes.
              </p>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                {user?.role.replace(/-/g, ' ').toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.link}
                to={card.link}
                className="block group"
              >
                <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200 p-6">
                  <div className="flex items-center mb-4">
                    <div className={`${card.color} p-3 rounded-lg`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    {card.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Users</span>
                <span className="font-semibold">248</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Active Sessions</span>
                <span className="font-semibold">42</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pending Jobs</span>
                <span className="font-semibold">7</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">System Health</span>
                <span className="font-semibold text-green-600">Healthy</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-2"></div>
                <div>
                  <p className="text-gray-900">New user registered</p>
                  <p className="text-gray-500">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-2"></div>
                <div>
                  <p className="text-gray-900">Bulk import completed</p>
                  <p className="text-gray-500">15 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-1.5 mr-2"></div>
                <div>
                  <p className="text-gray-900">System backup started</p>
                  <p className="text-gray-500">1 hour ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}