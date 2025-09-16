import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { BookmarkButton } from '../ui/BookmarkButton';
import { 
  ArrowRight, 
  Shield, 
  Database, 
  Users, 
  BarChart3,
  CheckCircle,
  Zap,
  Globe
} from 'lucide-react';

export function LandingPage() {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: Shield,
      title: 'Secure Data Management',
      description: 'Enterprise-grade security with role-based access control and audit trails'
    },
    {
      icon: Database,
      title: 'Comprehensive Provider Database',
      description: 'Complete healthcare provider information with validation and verification'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Multi-user support with role-based permissions and workflow management'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Detailed insights and reporting on provider data and import performance'
    },
    {
      icon: Zap,
      title: 'AI-Powered Import',
      description: 'Intelligent data mapping and extraction from various sources'
    },
    {
      icon: Globe,
      title: 'Web Extraction',
      description: 'Automated data extraction from institutional websites and directories'
    }
  ];

  const stats = [
    { label: 'Providers Managed', value: '1,200+' },
    { label: 'Data Accuracy', value: '99.8%' },
    { label: 'Import Success Rate', value: '94.2%' },
    { label: 'Processing Speed', value: '< 2 min' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">PracticeLink</h1>
              <span className="ml-2 text-sm text-gray-500">Data Management Portal</span>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <BookmarkButton
                    title="Home"
                    url="/"
                    category="Main"
                    icon="Home"
                    variant="pill"
                  />
                  <a
                    href="/dashboard"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Go to Dashboard
                  </a>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <a
                    href="/signin"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md transition-colors"
                  >
                    Sign In
                  </a>
                  <a
                    href="/signin"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Get Started
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            <span className="text-blue-600">Data Management Platform</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Streamline your provider relations workflow with our comprehensive data collection, 
            validation, and management platform designed for healthcare organizations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={isAuthenticated ? "/dashboard" : "/signin"}
              className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              {isAuthenticated ? "Go to Dashboard" : "Get Started"}
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
            <a
              href="/analytics"
              className="inline-flex items-center px-8 py-4 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              View Demo
              <BarChart3 className="ml-2 h-5 w-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Powerful Features for Provider Management
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to efficiently manage healthcare provider data, 
              from registration to analytics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="p-2 bg-blue-100 rounded-lg w-fit mb-4">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to streamline your provider data management?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join healthcare organizations already using PracticeLink to manage their provider networks efficiently.
          </p>
          <a
            href={isAuthenticated ? "/dashboard" : "/signin"}
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          >
            {isAuthenticated ? "Access Dashboard" : "Start Free Trial"}
            <ArrowRight className="ml-2 h-5 w-5" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-xl font-bold mb-4">PracticeLink</h3>
              <p className="text-gray-400 mb-4">
                Comprehensive healthcare provider data management platform for modern healthcare organizations.
              </p>
              <div className="flex space-x-4">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span className="text-sm text-gray-400">HIPAA Compliant</span>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/dashboard" className="hover:text-white">Dashboard</a></li>
                <li><a href="/search" className="hover:text-white">Provider Search</a></li>
                <li><a href="/analytics" className="hover:text-white">Analytics</a></li>
                <li><a href="/bulk-import" className="hover:text-white">Bulk Import</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Documentation</a></li>
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Support</a></li>
                <li><a href="#" className="hover:text-white">System Status</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 PracticeLink. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}