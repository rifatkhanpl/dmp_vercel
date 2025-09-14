import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  UserPlus, 
  Upload, 
  Search, 
  Database,
  User,
  Settings,
  FileText
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const { user } = useAuth();

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      current: location.pathname === '/dashboard'
    },
    {
      name: 'HCP Registration',
      href: '/hcp-registration',
      icon: UserPlus,
      current: location.pathname === '/hcp-registration'
    },
    {
      name: 'Bulk Import',
      href: '/bulk-import',
      icon: Upload,
      current: location.pathname === '/bulk-import'
    },
    {
      name: 'Search Providers',
      href: '/search',
      icon: Search,
      current: location.pathname === '/search'
    },
    {
      name: 'Provider Profile',
      href: '/provider-profile',
      icon: User,
      current: location.pathname === '/provider-profile'
    }
  ];

  // Admin-only items
  if (user?.role === 'administrator') {
    navigationItems.push(
      {
        name: 'Data Management',
        href: '/data-management',
        icon: Database,
        current: location.pathname === '/data-management'
      },
      {
        name: 'Reports',
        href: '/reports',
        icon: FileText,
        current: location.pathname === '/reports'
      },
      {
        name: 'Settings',
        href: '/settings',
        icon: Settings,
        current: location.pathname === '/settings'
      }
    );
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-16 left-0 z-40 w-64 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
      `}>
        <div className="flex flex-col h-full overflow-y-auto">
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => onClose()}
                  className={`
                    group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                    ${item.current
                      ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon className={`
                    mr-3 h-5 w-5 flex-shrink-0
                    ${item.current ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-500'}
                  `} />
                  {item.name}
                </a>
              );
            })}
          </nav>

          {/* User info at bottom */}
          {user && (
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-gray-500 truncate capitalize">
                    {user.role.replace(/-/g, ' ')}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}