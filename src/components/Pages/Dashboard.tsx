import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useBookmarks } from '../../contexts/BookmarkContext';
import { Layout } from '../Layout/Layout';
import { Sidebar } from '../Layout/Sidebar';
import { 
  Users,
  UserPlus,
  Brain,
  Search,
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Star
} from 'lucide-react';

export function Dashboard() {
  const { user } = useAuth();
  const { bookmarks } = useBookmarks();

  const stats = [
    {
      name: 'Total HCPs',
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
      name: 'AI Imports',
      value: '89',
      change: '+23%',
      changeType: 'increase',
      icon: Brain
    },
    {
      name: 'Active Searches',
      value: '34',
      change: '-2%',
      changeType: 'decrease',
      icon: Search
    }
  ];

  const quickActions = [
    {
      name: 'Register New HCP',
      description: 'Add a new healthcare provider to the database',
      href: '/hcp-registration',
      icon: UserPlus,
      color: 'bg-blue-500'
    },
    {
      name: 'AI Bulk Import',
      description: 'Import multiple HCPs using AI text parsing',
      href: '/bulk-import',
      icon: Brain,
      color: 'bg-purple-500'
    },
    {
      name: 'Search HCPs',
      description: 'Find and filter healthcare providers',
      href: '/search',
      icon: Search,
      color: 'bg-green-500'
    },
    {
      name: 'View Analytics',
      description: 'Review system metrics and reports',
      href: '/analytics',
      icon: BarChart3,
      color: 'bg-orange-500'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'registration',
      message: 'Dr. Sarah Johnson registered',
      time: '2 hours ago',
      icon: UserPlus,
      color: 'text-blue-600'
    },
    {
      id: 2,
      type: 'import',
      message: '15 HCPs imported via AI',
      time: '4 hours ago',
      icon: Brain,
      color: 'text-purple-600'
    },
    {
      id: 3,
      type: 'search',
      message: 'Search completed for Cardiology',
      time: '6 hours ago',
      icon: Search,
      color: 'text-green-600'
    }
  ];

  return (
    <Layout breadcrumbs={[{ label: 'Dashboard' }]}>
      <div className="flex">
        <Sidebar currentPath="/dashboard" />
        
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.firstName}!
              </h1>
              <p className="text-gray-600 mt-2">
                Here's what's happening with your healthcare provider data today.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Icon className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            {stat.name}
                          </dt>
                          <dd className="flex items-baseline">
                            <div className="text-2xl font-semibold text-gray-900">
                              {stat.value}
                            </div>
                            <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                              stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {stat.change}
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="space-y-4">
                  {quickActions.map((action) => {
                    const Icon = action.icon;
                    return (
                      <a
                        key={action.name}
                        href={action.href}
                        className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className={`flex-shrink-0 p-2 rounded-md ${action.color}`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="ml-4">
                          <h3 className="text-sm font-medium text-gray-900">{action.name}</h3>
                          <p className="text-sm text-gray-500">{action.description}</p>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
                <div className="space-y-4">
                  {recentActivity.map((activity) => {
                    const Icon = activity.icon;
                    return (
                      <div key={activity.id} className="flex items-center">
                        <div className="flex-shrink-0">
                          <Icon className={`h-5 w-5 ${activity.color}`} />
                        </div>
                        <div className="ml-3 flex-1">
                          <p className="text-sm text-gray-900">{activity.message}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bookmarks Section */}
            {bookmarks.length > 0 && (
              <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Star className="h-5 w-5 text-yellow-500 mr-2" />
                  Your Bookmarks
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {bookmarks.slice(0, 6).map((bookmark) => (
                    <a
                      key={bookmark.id}
                      href={bookmark.url}
                      className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900">{bookmark.title}</h3>
                        {bookmark.category && (
                          <p className="text-xs text-gray-500">{bookmark.category}</p>
                        )}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </Layout>
  );
}