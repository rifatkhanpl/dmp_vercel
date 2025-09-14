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
  Users,
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
    }
  ];

  // Admin-only items
  if (user?.role === 'administrator') {
    navigationItems.push(
      {
        name: 'User Management',
        href: '/user-management',
        icon: Users,
        current: location.pathname === '/user-management'
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
        lg:translate-x-0
      `}>
        <div className="h-full overflow-y-auto p-4">
          <nav className="space-y-1">
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
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon className={`
                    mr-3 h-5 w-5 flex-shrink-0
                    ${item.current ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}
                  `} />
                  {item.name}
                </a>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}