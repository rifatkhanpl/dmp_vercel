import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Home,
  Users,
  UserPlus,
  Brain,
  Search,
  BarChart3,
  Settings,
  Bookmark
} from 'lucide-react';

interface SidebarProps {
  currentPath?: string;
}

export function Sidebar({ currentPath = '' }: SidebarProps) {
  const { user } = useAuth();

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home,
      current: currentPath === '/dashboard'
    },
    {
      name: 'HCP Registration',
      href: '/hcp-registration',
      icon: UserPlus,
      current: currentPath === '/hcp-registration'
    },
    {
      name: 'AI Bulk Import',
      href: '/bulk-import',
      icon: Brain,
      current: currentPath === '/bulk-import'
    },
    {
      name: 'Search HCPs',
      href: '/search',
      icon: Search,
      current: currentPath === '/search'
    },
    {
      name: 'Analytics',
      href: '/analytics',
      icon: BarChart3,
      current: currentPath === '/analytics'
    },
    {
      name: 'Bookmarks',
      href: '/bookmarks',
      icon: Bookmark,
      current: currentPath === '/bookmarks'
    }
  ];

  // Add admin-only items
  if (user?.role === 'administrator') {
    navigationItems.push({
      name: 'Settings',
      href: '/settings',
      icon: Settings,
      current: currentPath === '/settings'
    });
  }

  return (
    <div className="flex flex-col w-64 bg-gray-50 border-r border-gray-200">
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <nav className="mt-5 flex-1 px-2 space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.name}
                href={item.href}
                className={`${
                  item.current
                    ? 'bg-blue-100 text-blue-900'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors`}
              >
                <Icon
                  className={`${
                    item.current ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                  } mr-3 flex-shrink-0 h-5 w-5`}
                />
                {item.name}
              </a>
            );
          })}
        </nav>
      </div>
    </div>
  );
}