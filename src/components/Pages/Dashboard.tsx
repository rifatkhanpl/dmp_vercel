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
  Building,
  User,
  Star,
  Trophy,
  Briefcase
} from 'lucide-react';

export function Dashboard() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('month');

  // Individual coordinator stats for GME-R Programs
  const myGmeRStats = [
    {
      title: 'My GME-R Programs YTD',
      value: '127',
      change: '+15%',
      changeType: 'positive' as const,
      yoyChange: '+28%',
      yoyChangeType: 'positive' as const,
      icon: GraduationCap,
      description: 'from last month',
      yoyDescription: 'vs last year'
    },
    {
      title: 'My GME-R Programs MTD',
      value: '12',
      change: '+20%',
      changeType: 'positive' as const,
      yoyChange: '+33%',
      yoyChangeType: 'positive' as const,
      icon: Building,
      description: 'from last month',
      yoyDescription: 'vs last year'
    },
    {
      title: 'My GME-R Programs WTD',
      value: '3',
      change: '+0%',
      changeType: 'positive' as const,
      yoyChange: '+50%',
      yoyChangeType: 'positive' as const,
      icon: Calendar,
      description: 'from last week',
      yoyDescription: 'vs last year'
    },
    {
      title: 'My GME-R Programs WIP',
      value: '124',
      change: '+18%',
      changeType: 'positive' as const,
      yoyChange: '+31%',
      yoyChangeType: 'positive' as const,
      icon: Activity,
      description: 'from last month',
      yoyDescription: 'vs last year'
    }
  ];

  // Individual coordinator stats for HCP-Rs
  const myHcpRStats = [
    {
      title: 'My HCP-Rs YTD',
      value: '347',
      change: '+18%',
      changeType: 'positive' as const,
      icon: Users,
      description: 'from last month'
    },
    {
      title: 'My HCP-Rs MTD',
      value: '28',
      change: '+12%',
      changeType: 'positive' as const,
      icon: UserPlus,
      description: 'from last month'
    },
    {
      title: 'My HCP-Rs WTD',
      value: '6',
      change: '+20%',
      changeType: 'positive' as const,
      icon: Clock,
      description: 'from last week'
    },
    {
      title: 'My HCP-Rs in WIP',
      value: '341',
      change: '+19%',
      changeType: 'positive' as const,
      icon: CheckCircle,
      description: 'from last month'
    }
  ];

  // Individual coordinator stats for GME-F Programs
  const myGmeFStats = [
    {
      title: 'My GME-F Programs YTD',
      value: '45',
      change: '+22%',
      changeType: 'positive' as const,
      yoyChange: '+35%',
      yoyChangeType: 'positive' as const,
      icon: Award,
      description: 'from last month',
      yoyDescription: 'vs last year'
    },
    {
      title: 'My GME-F Programs MTD',
      value: '4',
      change: '+33%',
      changeType: 'positive' as const,
      yoyChange: '+100%',
      yoyChangeType: 'positive' as const,
      icon: Target,
      description: 'from last month',
      yoyDescription: 'vs last year'
    },
    {
      title: 'My GME-F Programs WTD',
      value: '1',
      change: '+0%',
      changeType: 'positive' as const,
      yoyChange: '+100%',
      yoyChangeType: 'positive' as const,
      icon: Zap,
      description: 'from last week',
      yoyDescription: 'vs last year'
    },
    {
      title: 'My GME-F Programs WIP',
      value: '44',
      change: '+22%',
      changeType: 'positive' as const,
      yoyChange: '+38%',
      yoyChangeType: 'positive' as const,
      icon: TrendingUp,
      description: 'from last month',
      yoyDescription: 'vs last year'
    }
  ];

  // Individual coordinator stats for HCP-F
  const myHcpFStats = [
    {
      title: 'My HCP-F YTD',
      value: '189',
      change: '+25%',
      changeType: 'positive' as const,
      yoyChange: '+42%',
      yoyChangeType: 'positive' as const,
      icon: Award,
      description: 'from last month',
      yoyDescription: 'vs last year'
    },
    {
      title: 'My HCP-F MTD',
      value: '16',
      change: '+23%',
      changeType: 'positive' as const,
      yoyChange: '+45%',
      yoyChangeType: 'positive' as const,
      icon: Target,
      description: 'from last month',
      yoyDescription: 'vs last year'
    },
    {
      title: 'My HCP-F WTD',
      value: '3',
      change: '+50%',
      changeType: 'positive' as const,
      yoyChange: '+200%',
      yoyChangeType: 'positive' as const,
      icon: Zap,
      description: 'from last week',
      yoyDescription: 'vs last year'
    },
    {
      title: 'My HCP-F in WIP',
      value: '186',
      change: '+26%',
      changeType: 'positive' as const,
      yoyChange: '+44%',
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
      title: 'Search My RF-HCPs',
      description: 'Find and manage my assigned RF-HCPs.',
      icon: Search,
      href: '/search',
      color: 'purple'
    },
    {
      title: 'My Performance Reports',
      description: 'View my analytics and performance metrics',
      icon: BarChart3,
      href: '/metrics-dashboard',
      color: 'orange'
    }
  ];

  const myRecentActivity = [
    {
      id: '1',
      type: 'registration',
      title: 'I registered a new provider',
      description: 'Dr. Sarah Johnson, MD - Internal Medicine',
      time: '2 hours ago',
      icon: UserPlus,
      color: 'blue'
    },
    {
      id: '2',
      type: 'import',
      title: 'I completed a bulk import',
      description: '28 providers imported successfully',
      time: '4 hours ago',
      icon: Upload,
      color: 'green'
    },
    {
      id: '3',
      type: 'update',
      title: 'I updated a profile',
      description: 'Dr. Michael Chen, DO - Emergency Medicine',
      time: '6 hours ago',
      icon: FileText,
      color: 'purple'
    },
    {
      id: '4',
      type: 'verification',
      title: 'I completed verification',
      description: 'Dr. Emily Rodriguez, MD - Pediatrics',
      time: '1 day ago',
      icon: CheckCircle,
      color: 'green'
    }
  ];

  // Performance summary for the individual coordinator
  const myPerformanceSummary = {
    rank: 3,
    totalCoordinators: 8,
    performanceScore: 94.2,
    statesManaged: ['California', 'Nevada', 'Arizona'],
    gmeRProgramsManaged: ['Internal Medicine - UCLA', 'Emergency Medicine - USC', 'Family Medicine - UCSF'],
    gmeFProgramsManaged: ['Cardiology Fellowship - Stanford', 'GI Fellowship - UCSF'],
    topAchievements: [
      { metric: 'Data Quality Score', value: '98.5%', rank: 1 },
      { metric: 'Processing Speed', value: '2.3 min avg', rank: 2 },
      { metric: 'Monthly Registrations', value: '28 providers', rank: 3 }
    ]
  };

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
                Here's your individual performance summary for the Resident & Fellow Data Management Portal
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2 mb-1">
                <User className="h-4 w-4 text-gray-400" />
                <p className="text-sm text-gray-500">My Role:</p>
              </div>
              <p className="font-medium text-gray-900 capitalize">
                {user?.role === 'administrator' ? 'Administrator' : 'Provider Relations Data Coordinator'}
              </p>
            </div>
          </div>
        </div>

        {/* Performance Summary Card */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-sm p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2">My Performance Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-blue-100 text-sm">Team Ranking</p>
                  <p className="text-2xl font-bold">#{myPerformanceSummary.rank} of {myPerformanceSummary.totalCoordinators}</p>
                </div>
                <div>
                  <p className="text-blue-100 text-sm">Performance Score</p>
                  <p className="text-2xl font-bold">{myPerformanceSummary.performanceScore}%</p>
                </div>
                <div>
                  <p className="text-blue-100 text-sm">Specialties Managed</p>
                  <p className="text-lg font-semibold">{myPerformanceSummary.specialtiesManaged.length} specialties</p>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <Trophy className="h-16 w-16 text-yellow-300" />
            </div>
          </div>
        </div>

        {/* My GME-R Programs Stats */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">My GME-R Programs Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {myGmeRStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
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
        </div>

        {/* My HCP-Rs Stats */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">My HCP-Rs Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {myHcpRStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
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
        </div>

        {/* My GME-F Programs Stats */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">My GME-F Programs Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {myGmeFStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
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
        </div>

        {/* My HCP-F Stats */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">My HCP-F Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {myHcpFStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
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
                    <div className={`p-3 rounded-full ${getIconColorClasses('red')} flex-shrink-0 ml-4`}>
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* My Achievements & Goals */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
              My Top Achievements
            </h2>
            <div className="space-y-3">
              {myPerformanceSummary.topAchievements.map((achievement, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      achievement.rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                      achievement.rank === 2 ? 'bg-gray-100 text-gray-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      #{achievement.rank}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{achievement.metric}</p>
                      <p className="text-sm text-gray-600">{achievement.value}</p>
                    </div>
                  </div>
                  {achievement.rank === 1 && <Star className="h-5 w-5 text-yellow-500" />}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-blue-500" />
              My States Managed
            </h2>
            <div className="space-y-3">
              {myPerformanceSummary.statesManaged.map((state, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-gray-900">{state}</span>
                  </div>
                  <a
                    href={`/search?state=${encodeURIComponent(state)}&managedBy=${encodeURIComponent(user?.firstName + ' ' + user?.lastName)}`}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    View Providers →
                  </a>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <a
                href="/user-settings"
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Manage my state assignments →
              </a>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <GraduationCap className="h-5 w-5 mr-2 text-purple-500" />
              My GME Programs Managed
            </h2>
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">GME-R Programs</h3>
                <div className="space-y-2">
                  {myPerformanceSummary.gmeRProgramsManaged.map((program, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-purple-50 rounded">
                      <div className="flex items-center space-x-2">
                        <GraduationCap className="h-4 w-4 text-purple-600" />
                        <span className="text-sm text-gray-900">{program}</span>
                      </div>
                      <a
                        href={`/gme-program-search?program=${encodeURIComponent(program)}`}
                        className="text-xs text-purple-600 hover:text-purple-700"
                      >
                        View →
                      </a>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">GME-F Programs</h3>
                <div className="space-y-2">
                  {myPerformanceSummary.gmeFProgramsManaged.map((program, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-orange-50 rounded">
                      <div className="flex items-center space-x-2">
                        <Award className="h-4 w-4 text-orange-600" />
                        <span className="text-sm text-gray-900">{program}</span>
                      </div>
                      <a
                        href={`/gme-program-search?program=${encodeURIComponent(program)}`}
                        className="text-xs text-orange-600 hover:text-orange-700"
                      >
                        View →
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">My Quick Actions</h2>
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

        {/* My Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">My Recent Activity</h2>
            <a href="/metrics-search" className="text-sm text-blue-600 hover:text-blue-700">
              View my full activity log →
            </a>
          </div>
          <div className="space-y-4">
            {myRecentActivity.map((activity) => {
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