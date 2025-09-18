import React from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  FileText,
  User,
  Building,
  GraduationCap,
  Clipboard,
  BarChart2,
  Settings
} from 'lucide-react';
import { Layout } from '../Layout/Layout';
import { useAuth } from '../../contexts/AuthContext';

export function UserDashboard() {
  const { user } = useAuth();

  const userCards = [
    {
      title: 'HCP Search',
      description: 'Search for healthcare providers',
      icon: Search,
      link: '/search',
      color: 'bg-blue-500'
    },
    {
      title: 'HCP Registration',
      description: 'Register new healthcare providers',
      icon: Clipboard,
      link: '/hcp-registration',
      color: 'bg-green-500'
    },
    {
      title: 'My Profile',
      description: 'View and edit your profile',
      icon: User,
      link: '/user-profile',
      color: 'bg-purple-500'
    },
    {
      title: 'GME Programs',
      description: 'Search graduate medical education programs',
      icon: GraduationCap,
      link: '/gme-program-search',
      color: 'bg-indigo-500'
    },
    {
      title: 'GME Institutions',
      description: 'Browse medical institutions',
      icon: Building,
      link: '/gme-institution-search',
      color: 'bg-yellow-500'
    },
    {
      title: 'Reports',
      description: 'View available reports',
      icon: FileText,
      link: '/metrics-search',
      color: 'bg-teal-500'
    },
    {
      title: 'Analytics',
      description: 'View your activity analytics',
      icon: BarChart2,
      link: '/analytics',
      color: 'bg-orange-500'
    },
    {
      title: 'Settings',
      description: 'Manage your preferences',
      icon: Settings,
      link: '/user-settings',
      color: 'bg-gray-600'
    }
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome back, {user?.firstName}! What would you like to do today?
          </p>
        </div>

        <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center">
                <User className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-800">Current Role:</span>
              </div>
              <p className="mt-1 text-lg font-bold text-blue-900 capitalize">
                {user?.role.replace(/-/g, ' ')}
              </p>
              <p className="mt-1 text-sm text-blue-700">
                You have access to HCP management and GME search features.
              </p>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {user?.role.replace(/-/g, ' ').toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userCards.map((card) => {
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
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Stats</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Providers Registered</span>
                <span className="font-semibold">23</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Searches Today</span>
                <span className="font-semibold">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pending Reviews</span>
                <span className="font-semibold">3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Reports Generated</span>
                <span className="font-semibold">8</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-2"></div>
                <div>
                  <p className="text-gray-900">Searched for cardiologists in NY</p>
                  <p className="text-gray-500">30 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-2"></div>
                <div>
                  <p className="text-gray-900">Registered Dr. Smith</p>
                  <p className="text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 mr-2"></div>
                <div>
                  <p className="text-gray-900">Generated monthly report</p>
                  <p className="text-gray-500">Yesterday</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow p-6 text-white">
          <h2 className="text-xl font-semibold mb-2">Quick Tip</h2>
          <p className="text-blue-50">
            Use the advanced search filters to find healthcare providers by specialty, location, and credentials.
            You can also save your frequently used searches for quick access.
          </p>
        </div>
      </div>
    </Layout>
  );
}