import React, { Suspense } from 'react';
import { Routes, Route, Navigate, Outlet, useLocation, Link } from 'react-router-dom';
import {
  Search,
  FileText,
  User,
  Building,
  GraduationCap,
  Clipboard,
  BarChart2,
  Settings,
  Users,
  UserPlus,
  Clock,
  CheckCircle
} from 'lucide-react';
import { Layout } from '../Layout/Layout';
import { useAuth } from '../../contexts/AuthContext';

/*************************
 * Guards (drop-in)
 *************************/
function RequireAuth() {
  const { user } = useAuth();
  const loc = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: loc }} />;
  return <Outlet />;
}

function RequireRole({ roles }) {
  const { user } = useAuth();
  const loc = useLocation();
  const role = user?.role?.replace(/-/g, ' ').toLowerCase();
  const ok = role && roles.map(r => r.toLowerCase().replace(/\s+/g, ' ')).includes(role);
  if (!ok) return <Navigate to="/unauthorized" replace state={{ from: loc }} />;
  return <Outlet />;
}

/*************************
 * KPI Stats Panel (new feel)
 *************************/
function KpiStats({ stats }) {
  const getIconColorClasses = (color) => {
    const colors = {
      blue: 'text-blue-600 bg-blue-100',
      green: 'text-green-600 bg-green-100',
      purple: 'text-purple-600 bg-purple-100',
      orange: 'text-orange-600 bg-orange-100'
    };
    return colors[color] || colors.blue;
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
                  <span className={`text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">{stat.description}</span>
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

/*************************
 * User Dashboard
 *************************/
export function UserDashboard() {
  const { user } = useAuth();
  const roleLabel = user?.role?.replace(/-/g, ' ');
  const isAdmin = roleLabel?.toLowerCase().includes('admin');

  const userCards = [
    { title: 'HCP Search', description: 'Search for healthcare providers', icon: Search, link: '/search', color: 'bg-blue-500' },
    { title: 'HCP Registration', description: 'Register new healthcare providers', icon: Clipboard, link: '/hcp-registration', color: 'bg-green-500' },
    { title: 'My Profile', description: 'View and edit your profile', icon: User, link: '/user-profile', color: 'bg-purple-500' },
    { title: 'GME Programs', description: 'Search graduate medical education programs', icon: GraduationCap, link: '/gme-program-search', color: 'bg-indigo-500' },
    { title: 'GME Institutions', description: 'Browse medical institutions', icon: Building, link: '/gme-institution-search', color: 'bg-yellow-500' },
    { title: 'Reports', description: 'View available reports', icon: FileText, link: '/metrics-search', color: 'bg-teal-500' },
    { title: 'Analytics', description: 'View your activity analytics', icon: BarChart2, link: '/analytics', color: 'bg-orange-500' },
    { title: 'Settings', description: 'Manage your preferences', icon: Settings, link: '/user-settings', color: 'bg-gray-600' },
    ...(isAdmin ? [{ title: 'Admin', description: 'Manage users, reports, and settings', icon: Settings, link: '/admin', color: 'bg-red-600' }] : [])
  ];

  const stats = [
    { title: 'Total Providers', value: '23', change: '+12%', changeType: 'positive', icon: Users, description: 'from last month', color: 'blue' },
    { title: 'New This Month', value: '5', change: '+8%', changeType: 'positive', icon: UserPlus, description: 'from last month', color: 'green' },
    { title: 'Pending Verification', value: '3', change: '-5%', changeType: 'negative', icon: Clock, description: 'from last week', color: 'purple' },
    { title: 'Verified Profiles', value: '15', change: '+15%', changeType: 'positive', icon: CheckCircle, description: 'from last month', color: 'orange' }
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">Welcome back, {user?.firstName}!</p>
        </div>
        <KpiStats stats={stats} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userCards.map((card) => {
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
      </div>
    </Layout>
  );
}

/*************************
 * Drop-in Routes (user + admin)
 *************************/
/* Inline admin components to avoid missing-file build errors */
function AdminLayout() {
  return (
    <div className="min-h-screen">
      <header className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Admin</h1>
          <nav className="flex gap-4 text-sm">
            <Link to="/admin">Overview</Link>
            <Link to="/admin/users">Users</Link>
            <Link to="/admin/reports">Reports</Link>
            <Link to="/admin/settings">Settings</Link>
          </nav>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-6">
        <Outlet />
      </main>
    </div>
  );
}
function AdminOverview()  { return <div className="bg-white rounded-lg shadow p-6">Admin overview</div>; }
function AdminUsers()     { return <div className="bg-white rounded-lg shadow p-6">User management</div>; }
function AdminReports()   { return <div className="bg-white rounded-lg shadow p-6">System reports</div>; }
function AdminSettings()  { return <div className="bg-white rounded-lg shadow p-6">Admin settings</div>; }

export function AppRoutes() {
  return (
    <Suspense fallback={<div className="p-6">Loading…</div>}>
      <Routes>
        <Route element={<RequireAuth />}>
          <Route path="/" element={<UserDashboard />} />
          {/* admin area */}
          <Route element={<RequireRole roles={["admin", "system admin"]} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminOverview />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Route>
        </Route>
        <Route path="/unauthorized" element={<div>Unauthorized</div>} />
        <Route path="*" element={<div>Not Found</div>} />
      </Routes>
    </Suspense>
  );
}
