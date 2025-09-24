import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

function KpiStats({ stats }: {
  stats: { title: string; value: string | number; change: string; changeType: 'positive'|'negative'; description?: string; icon: any; color?: 'blue'|'green'|'purple'|'orange'|'red'; }[];
}) {
  const getIconColorClasses = (color?: string) => {
    const colors: Record<string,string> = {
      blue: 'text-blue-600 bg-blue-100',
      green: 'text-green-600 bg-green-100',
      purple: 'text-purple-600 bg-purple-100',
      orange: 'text-orange-600 bg-orange-100',
      red: 'text-red-600 bg-red-100',
    };
    return colors[color || 'blue'];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div key={idx} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-start justify-between h-full">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <span className={`text-sm font-medium ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </span>
                  {stat.description && (
                    <span className="text-sm text-gray-500 ml-1">{stat.description}</span>
                  )}
                </div>
              </div>
              <div className={`p-3 rounded-full ${getIconColorClasses(stat.color)} flex-shrink-0 ml-4`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect non-admin users
  React.useEffect(() => {
    if (user && user.role !== 'administrator') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const adminCards = [
    { title: 'User Management',  description: 'Manage users, roles, and permissions', icon: Users,    link: '/user-management',  color: 'bg-blue-500' },
    { title: 'Add New User',     description: 'Create new user accounts',            icon: UserPlus, link: '/add-user',          color: 'bg-green-500' },
    { title: 'System Settings',  description: 'Configure system-wide settings',      icon: Settings, link: '/user-settings',     color: 'bg-gray-600' },
    { title: 'Analytics Dashboard', description: 'View system analytics and metrics', icon: BarChart, link: '/analytics',         color: 'bg-purple-500' },
    { title: 'Bulk Operations',  description: 'Import and manage bulk data',         icon: Database, link: '/bulk-import',       color: 'bg-indigo-500' },
    { title: 'Template Management', description: 'Manage data templates and mappings', icon: FileText, link: '/dmp/template-upload', color: 'bg-yellow-500' },
    { title: 'Data Export',      description: 'Export system data and reports',      icon: Download, link: '/dmp/export',        color: 'bg-teal-500' },
    { title: 'Job Console',      description: 'Monitor and manage background jobs',  icon: Activity, link: '/dmp/jobs',          color: 'bg-orange-500' },
    { title: 'Security Audit',   description: 'View security logs and audit trails', icon: Shield,   link: '/metrics-dashboard', color: 'bg-red-500' }
  ];

  const kpiStats = [
    { title: 'Total Users',     value: '248', change: '+3%',  changeType: 'positive' as const, description: 'vs last week', icon: Users,   color: 'blue' },
    { title: 'Active Sessions', value: '42',  change: '+12%', changeType: 'positive' as const, description: 'past hour',    icon: Activity, color: 'green' },
    { title: 'Pending Jobs',    value: '7',   change: '-22%', changeType: 'negative' as const, description: 'vs yesterday', icon: Upload,  color: 'purple' },
    { title: 'System Health',   value: 'Healthy', change: '+0%', changeType: 'positive' as const, description: 'status',   icon: Shield,  color: 'orange' }
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome back, {user?.firstName}! Manage your system from here.
          </p>
        </div>

        {/* Role banner (unchanged) */}
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
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

        {/* NEW: KPI cards (replaces the old 'Quick Stats' box) */}
        <KpiStats stats={kpiStats} />

        {/* Admin action tiles (unchanged) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link key={card.link} to={card.link} className="block group">
                <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200 p-6">
                  <div className="flex items-center mb-4">
                    <div className={`${card.color} p-3 rounded-lg`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">{card.description}</p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Recent Activity (unchanged) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Removed the old Quick Stats box since KPIs replace it */}
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

          {/* Optional: keep a small info card or remove for symmetry */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Admin Tips</h2>
            <p className="text-sm text-gray-600">
              Use Bulk Operations for large updates and check the Job Console to monitor progress.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
