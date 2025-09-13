import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Search, 
  UserPlus, 
  Upload,
  Users,
  Ticket,
  Settings,
  LogOut
} from 'lucide-react';

export function Sidebar() {
  const { user, logout, isAdmin } = useAuth();

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      current: window.location.pathname === '/dashboard'
    },
    {
      name: 'Search HCPs',
      href: '/search',
      icon: Search,
      current: window.location.pathname === '/search'
    },
    {
      name: 'Register HCP',
      href: '/register',
      icon: UserPlus,
      current: window.location.pathname === '/register'
    },
    {
      name: 'Bulk Import',
      href: '/bulk-import',
      icon: Upload,
      current: window.location.pathname === '/bulk-import'
    }
  ];

  const adminItems = [
    {
      name: 'User Management',
      href: '/user-management',
      icon: Users,
      current: window.location.pathname === '/user-management'
    },
    {
      name: 'Support Tickets',
      href: '/support',
      icon: Ticket,
      current: window.location.pathname === '/support'
    }
  ];

  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200 pt-16">
      <div className="flex flex-col h-full">
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.name}
                href={item.href}
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  item.current
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.name}
              </a>
            );
          })}

          {isAdmin && (
            <>
              <div className="border-t border-gray-200 my-4"></div>
              <div className="px-3 py-2">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Administration
                </h3>
              </div>
              {adminItems.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      item.current
                        ? 'bg-purple-50 text-purple-700 border-r-2 border-purple-700'
                        : 'text-gray-700 hover:text-purple-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </a>
                );
              })}
            </>
          )}
        </nav>

        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </span>
              </div>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          </div>
          <div className="mt-3 flex space-x-2">
            <button className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-xs font-medium text-gray-700 hover:bg-gray-50">
              <Settings className="w-4 h-4 mr-1" />
              Settings
            </button>
            <button 
              onClick={logout}
              className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              <LogOut className="w-4 h-4 mr-1" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}