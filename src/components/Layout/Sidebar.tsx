import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard,
  Search,
  UserPlus,
  Upload,
  Users,
  Ticket,
  User,
  Settings,
  ChevronDown,
  ChevronRight,
  Shield
} from 'lucide-react';

interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  requiredRole?: 'administrator';
  children?: NavigationItem[];
}

export function Sidebar() {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  if (!isAuthenticated) {
    return null;
  }

  const navigationItems: NavigationItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard
    },
    {
      id: 'search',
      label: 'Search Providers',
      path: '/search',
      icon: Search
    },
    {
      id: 'register',
      label: 'Register Provider',
      path: '/register',
      icon: UserPlus
    },
    {
      id: 'bulk-import',
      label: 'AI Bulk Import',
      path: '/bulk-import',
      icon: Upload
    },
    {
      id: 'profile',
      label: 'My Profile',
      path: '/profile',
      icon: User
    },
    // Admin-only items
    {
      id: 'user-management',
      label: 'User Management',
      path: '/user-management',
      icon: Users,
      requiredRole: 'administrator'
    },
    {
      id: 'support',
      label: 'Support Tickets',
      path: '/support',
      icon: Ticket,
      requiredRole: 'administrator'
    }
  ];

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const hasPermission = (item: NavigationItem) => {
    if (!item.requiredRole) return true;
    return user?.role === item.requiredRole;
  };

  const filteredItems = navigationItems.filter(hasPermission);

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 overflow-y-auto z-30">
      <div className="p-4">
        {/* User Info */}
        <div className="mb-6 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-medium">
                {user?.firstName?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">
                {user?.firstName} {user?.lastName}
              </div>
              <div className="text-xs text-gray-500 truncate">
                {user?.role === 'administrator' ? 'Administrator' : 'Coordinator'}
              </div>
            </div>
            {user?.role === 'administrator' && (
              <Shield className="w-4 h-4 text-purple-500" />
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {filteredItems.map((item) => (
            <div key={item.id}>
              <Link
                to={item.path}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive(item.path)
                    ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                <span className="flex-1">{item.label}</span>
                {item.children && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleExpanded(item.id);
                    }}
                    className="ml-2 p-1"
                  >
                    {expandedItems.has(item.id) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                )}
              </Link>

              {/* Sub-navigation */}
              {item.children && expandedItems.has(item.id) && (
                <div className="ml-6 mt-1 space-y-1">
                  {item.children.map((child) => (
                    <Link
                      key={child.id}
                      to={child.path}
                      className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                        isActive(child.path)
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                      }`}
                    >
                      <child.icon className="mr-3 h-4 w-4 flex-shrink-0" />
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Settings */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <Link
            to="/settings"
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <Settings className="mr-3 h-5 w-5 flex-shrink-0" />
            Settings
          </Link>
        </div>
      </div>
    </aside>
  );
}