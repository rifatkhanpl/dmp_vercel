import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Home, 
  Search, 
  UserPlus, 
  Upload, 
  Users,
  LifeBuoy,
  User,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const { user, logout, userRole } = useAuth();

  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Search HCPs', href: '/search', icon: Search },
    { name: 'Register HCP', href: '/register', icon: UserPlus },
    { name: 'Bulk Import', href: '/bulk-import', icon: Upload },
  ];

  // Admin-only navigation items
  const adminItems = [
    { name: 'User Management', href: '/user-management', icon: Users },
    { name: 'Support Tickets', href: '/support-tickets', icon: LifeBuoy },
  ];

  const allItems = userRole === 'admin' ? [...navigationItems, ...adminItems] : navigationItems;

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full pt-16">
          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {allItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={`
                    flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200
                    ${active 
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon className={`mr-3 h-5 w-5 ${active ? 'text-blue-700' : 'text-gray-400'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User info and logout */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center mb-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.email || 'ken.allman@practicelink.com'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {userRole === 'admin' ? 'Administrator' : 'Provider Relations Coordinator'}
                </p>
              </div>
            </div>
            
            <button
              onClick={logout}
              className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200"
            >
              <LogOut className="mr-3 h-4 w-4 text-gray-400" />
              Sign out
            </button>
          </div>
        </div>
      </div>
    </>
  );
}