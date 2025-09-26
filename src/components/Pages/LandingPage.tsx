import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Header } from '../Layout/Header';
import { Footer } from '../Layout/Footer';
import { 
  ArrowRight,
  Users,
  Brain,
  Database,
  Shield,
  CheckCircle,
  Star
} from 'lucide-react';

export function LandingPage() {
  const { user } = useAuth();

  const features = [
    {
      icon: Users,
      title: 'Talent Management & Recruitment',
      description: 'Comprehensive system for managing healthcare provider data, credentials, and placements.',
      color: 'blue'
    },
    {
      icon: Brain,
      title: 'Career Advancement & Management',
      description: 'Advanced AI tools to automatically extract and process provider information from various sources.',
      color: 'purple'
    },
    {
      icon: Database,
      title: 'Secure Data Collection',
      description: 'Enterprise-grade security for sensitive healthcare provider information and compliance.',
      color: 'green'
    }
  ];

  const stats = [
    { label: 'Physician/APP HCP Members', value: '500,000+' },
    { label: 'Employer/Organization HCO Members', value: '1,200+' },
    { label: 'Physician/APP Careers Advanced', value: '100,000\'s' }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'text-blue-600',
      purple: 'text-purple-600',
      green: 'text-green-600',
      red: 'text-red-600'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="pt-16">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-gray-900 mb-6">
              Residents & Fellows<br />
              <span className="text-blue-600">Data Management Portal</span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Powered by People | Assisted by AI™
            </p>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              We are working to make healthcare better.
            </p>
            
            {user ? (
              <div className="flex justify-center space-x-4">
                <a
                  href="/dashboard"
                  className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
                >
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5" />
                </a>
              </div>
            ) : (
              <div className="flex justify-center">
                <a
                  href="/signin"
                  className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
                >
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-blue-400 mb-2">{stat.value}</div>
                <div className="text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      </div>
      <Footer />
    </div>
  );
}