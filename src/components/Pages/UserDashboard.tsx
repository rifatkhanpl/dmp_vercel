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

/**
 * GOAL
 * ----
 * Keep the homepage components (from the previous version) but compose them
 * in the new dashboard. This file extracts the old "homepage" UI into
 * reusable, standalone components with stable names & props. You can
 * now import these components anywhere, or keep them colocated here.
 *
 * If you already have a components/homepage/ directory, you can move the
 * named components below into separate files without changing usage.
 */

/*************************
 * Reusable UI Components *
 *************************/

// 1) Role/Badge panel — previously the top info strip
export function RoleBadgePanel({ roleLabel, firstName, subtitle }) {
  return (
    <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center">
            <User className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-blue-800">Current Role:</span>
          </div>
          <p className="mt-1 text-lg font-bold text-blue-900 capitalize">
            {roleLabel}
          </p>
          <p className="mt-1 text-sm text-blue-700">
            {subtitle}
          </p>
        </div>
        <div className="text-right">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            {roleLabel?.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
}

// 2) Feature card and grid — the main homepage shortcuts
export function FeatureCard({ title, description, icon: Icon, color, to }) {
  return (
    <Link to={to} className="block group">
      <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200 p-6">
        <div className="flex items-center mb-4">
          <div className={`${color} p-3 rounded-lg`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>
        <p className="mt-2 text-sm text-gray-600">{description}</p>
      </div>
    </Link>
  );
}

export function FeatureCardsGrid({ cards }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((c) => (
        <FeatureCard
          key={c.link}
          title={c.title}
          description={c.description}
          icon={c.icon}
          color={c.color}
          to={c.link}
        />
      ))}
    </div>
  );
}

// 3) Simple stats panel — mirrors the old "Your Stats" box
export function StatsPanel({ title = 'Your Stats', items = [] }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
      <div className="space-y-3">
        {items.map((row) => (
          <div key={row.label} className="flex justify-between">
            <span className="text-gray-600">{row.label}</span>
            <span className="font-semibold">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// 4) Activity panel — mirrors the old "Recent Activity" timeline
export function ActivityPanel({ title = 'Recent Activity', events = [] }) {
  const dotColor = (variant) =>
    ({ blue: 'bg-blue-500', green: 'bg-green-500', purple: 'bg-purple-500', orange: 'bg-orange-500' }[variant] || 'bg-gray-400');

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
      <div className="space-y-3 text-sm">
        {events.map((e, idx) => (
          <div key={`${e.text}-${idx}`} className="flex items-start">
            <div className={`w-2 h-2 ${dotColor(e.variant)} rounded-full mt-1.5 mr-2`} />
            <div>
              <p className="text-gray-900">{e.text}</p>
              <p className="text-gray-500">{e.meta}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 5) Tip/announcement banner — mirrors the old gradient block
export function TipBanner({ title = 'Quick Tip', children }) {
  return (
    <div className="mt-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow p-6 text-white">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <div className="text-blue-50 text-sm lg:text-base">{children}</div>
    </div>
  );
}

/*************************************************
 * Backward-compatible exports (old naming shim) *
 *************************************************/
// If your previous version imported names like `HomepageFeatureCards`, `HomepageStats`, etc.,
// keep these exports so older imports continue to work while you migrate.
export const HomepageFeatureCards = FeatureCardsGrid;
export const HomepageStats = StatsPanel;
export const HomepageActivity = ActivityPanel;
export const HomepageRolePanel = RoleBadgePanel;
export const HomepageTip = TipBanner;

/**********************
 * Composed Dashboard *
 **********************/
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

  const stats = [
    { label: 'Providers Registered', value: 23 },
    { label: 'Searches Today', value: 12 },
    { label: 'Pending Reviews', value: 3 },
    { label: 'Reports Generated', value: 8 }
  ];

  const activity = [
    { text: 'Searched for cardiologists in NY', meta: '30 minutes ago', variant: 'blue' },
    { text: 'Registered Dr. Smith', meta: '2 hours ago', variant: 'green' },
    { text: 'Generated monthly report', meta: 'Yesterday', variant: 'purple' }
  ];

  const roleLabel = user?.role?.replace(/-/g, ' ');

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header (unchanged) */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome back, {user?.firstName}! What would you like to do today?
          </p>
        </div>

        {/* Preserved: Top role panel from previous homepage */}
        <RoleBadgePanel
          roleLabel={roleLabel}
          firstName={user?.firstName}
          subtitle="You have access to HCP management and GME search features."
        />

        {/* Preserved: Feature cards grid */}
        <FeatureCardsGrid cards={userCards} />

        {/* Preserved: Stats + Activity layout */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StatsPanel items={stats} />
          <ActivityPanel events={activity} />
        </div>

        {/* Preserved: Quick tip banner */}
        <TipBanner title="Quick Tip">
          Use the advanced search filters to find healthcare providers by specialty, location, and credentials.
          You can also save your frequently used searches for quick access.
        </TipBanner>
      </div>
    </Layout>
  );
}

export default UserDashboard;
