import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Layout } from '../Layout/Layout';
import { 
  Users, 
  UserPlus, 
  Search, 
  Upload, 
  Activity,
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle,
  Ticket,
  Shield
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardStats {
  totalProviders: number;
  newRegistrations: number;
  pendingVerifications: number;
  activeUsers: number;
  supportTickets: number;
  resolvedTickets: number;
}

export function Dashboard() {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalProviders: 0,
    newRegistrations: 0,
    pendingVerifications: 0,
    activeUsers: 0,
    supportTickets: 0,
    resolvedTickets: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading stats
    const loadStats = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStats({
        totalProviders: 12847,
        newRegistrations: 23,
        pendingVerifications: 8,
        activeUsers: 156,
        supportTickets: 12,
        resolvedTickets: 45
      });
      setLoading(false);
    };

    loadStats();
  }, []);

  const quickActions = [
    {
      title: 'Search Providers',
      description: 'Find healthcare providers in the database',
      icon: Search,
      href: '/search',
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600'
    },
    {
      title: 'Register Provider',
      description: 'Add a new healthcare provider',
      icon: UserPlus,
      href: '/register',
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600'
    },
    {
      title: 'Bulk Import',
      description: 'Import multiple providers from CSV',
      icon: Upload,
      href: '/bulk-import',
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600'
    }
  ];

  const adminActions = [
    {
      title: 'User Management',
      description: 'Manage user accounts and permissions',
      icon: Users,
      href: '/user-management',
      color: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600'
    },
    {
      title: 'Support Tickets',
      description: 'Handle user support requests',
      icon: Ticket,
      href: '/support-tickets',
      color: 'bg-red-500',
      hoverColor: 'hover:bg-red-600'
    }
  ];

  const StatCard = ({ title, value, icon: Icon, trend, color }: any) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">
            {loading ? (
              <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
            ) : (
              value.toLocaleString()
            )}
          </p>
          {trend && (
            <p className="text-sm text-green-600 flex items-center mt-1">
              <TrendingUp className="h-4 w-4 mr-1" />
              {trend}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  const ActionCard = ({ title, description, icon: Icon, href, color, hoverColor }: any) => (
    <Link
      to={href}
      className={`block p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 group`}
    >
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${color} ${hoverColor} transition-colors group-hover:scale-105`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </Link>
  );

  return (
    <Layout breadcrumbs={[{ label: 'Dashboard' }]}>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-sm">
          <div className="px-6 py-8 text-white">
            <div className="flex items-center">
              <Activity className="h-8 w-8 mr-3" />
              <div>
                <h1 className="text-2xl font-bold">
                  Welcome back, {user?.name || 'User'}!
                </h1>
                <p className="text-blue-100 mt-1">
                  {isAdmin ? 'Administrator Dashboard' : 'Provider Management Dashboard'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Providers"
            value={stats.totalProviders}
            icon={Users}
            trend="+12% from last month"
            color="bg-blue-500"
          />
          <StatCard
            title="New Registrations"
            value={stats.newRegistrations}
            icon={UserPlus}
            trend="+5% from last week"
            color="bg-green-500"
          />
          <StatCard
            title="Pending Verifications"
            value={stats.pendingVerifications}
            icon={Clock}
            color="bg-yellow-500"
          />
          <StatCard
            title="Active Users"
            value={stats.activeUsers}
            icon={Activity}
            trend="+8% from last month"
            color="bg-purple-500"
          />
        </div>

        {/* Admin Stats (only for admins) */}
        {isAdmin && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatCard
              title="Open Support Tickets"
              value={stats.supportTickets}
              icon={AlertCircle}
              color="bg-red-500"
            />
            <StatCard
              title="Resolved This Month"
              value={stats.resolvedTickets}
              icon={CheckCircle}
              trend="+15% resolution rate"
              color="bg-green-500"
            />
          </div>
        )}

        {/* Quick Actions */}
        <div className="space-y-6">
          <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <ActionCard key={index} {...action} />
            ))}
          </div>
        </div>

        {/* Admin Actions (only for admins) */}
        {isAdmin && (
          <div className="space-y-6">
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-gray-400 mr-2" />
              <h2 className="text-lg font-medium text-gray-900">Administration</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {adminActions.map((action, index) => (
                <ActionCard key={index} {...action} />
              ))}
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse flex items-center space-x-3">
                    <div className="bg-gray-200 h-8 w-8 rounded-full"></div>
                    <div className="flex-1">
                      <div className="bg-gray-200 h-4 w-3/4 rounded mb-2"></div>
                      <div className="bg-gray-200 h-3 w-1/2 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      New provider registered: Dr. Sarah Johnson
                    </p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Upload className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Bulk import completed: 45 providers added
                    </p>
                    <p className="text-xs text-gray-500">5 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <Users className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      User verification completed for 3 accounts
                    </p>
                    <p className="text-xs text-gray-500">1 day ago</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}