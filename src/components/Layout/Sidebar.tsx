import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useBookmarks } from '../../contexts/BookmarkContext';
import { 
  Home,
  Users,
  UserPlus,
  Upload,
  Search,
  BarChart3,
  Settings,
  User,
  Shield,
  GraduationCap,
  Building,
  X,
  ChevronDown,
  ChevronRight,
  Bookmark,
  Brain,
  TrendingUp
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user } = useAuth();
  const { bookmarks } = useBookmarks();
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['main', 'analytics', 'admin', 'user']));

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const navigationItems = [
    {
      id: 'main',
      title: 'Main Navigation',
      items: [
        {
          name: 'Dashboard',
          href: '/dashboard',
          icon: Home,
          description: 'Overview and quick actions'
        },
        {
          name: 'GME Program Search',
          href: '/gme-program-search',
          icon: GraduationCap,
          description: 'Search graduate medical education programs'
        },
        {
          name: 'GME Institution Search',
          href: '/gme-institution-search',
          icon: Building,
          description: 'Search GME institutions and medical centers'
        },
        {
          name: 'HCP Import',
          href: '/bulk-import',
          icon: Upload,
          description: 'Import multiple resident/fellow records'
        },
        {
          name: 'HCP Registration',
          href: '/hcp-registration',
          icon: UserPlus,
          description: 'Register new resident/fellow'
        },
        {
          name: 'HCP Search',
          href: '/search',
          icon: Search,
          description: 'Find and manage resident/fellow records'
        },
        {
          name: 'DMP Console',
          href: '/dmp',
          icon: Brain,
          description: 'Resident & Fellow Data Management Platform'
        }
      ]
    },
    {
      id: 'analytics',
      title: 'Analytics & Reports',
      items: [
        {
          name: 'Analytics Dashboard',
          href: '/analytics',
          icon: BarChart3,
          description: 'Data insights and metrics'
        },
        {
          name: 'Production Metrics',
          href: '/metrics-dashboard',
          icon: TrendingUp,
          description: 'User performance and productivity metrics'
        }
      ]
    }
  ];

  // Add admin section if user is administrator
  if (user?.role === 'administrator') {
    navigationItems.push({
      id: 'admin',
      title: 'Administration',
      items: [
        {
          name: 'Admin Dashboard',
          href: '/admin',
          icon: Shield,
          description: 'System overview and admin tools'
        },
        {
          name: 'User Management',
          href: '/user-management',
          icon: Users,
          description: 'Manage user accounts and permissions'
        }
      ]
    });
  }

  // Add user section
  navigationItems.push({
    id: 'user',
    title: 'User Account',
    items: [
      {
        name: 'My Profile',
        href: '/user-profile',
        icon: User,
        description: 'View and edit your profile'
      },
      {
        name: 'Settings',
        href: '/user-settings',
        icon: Settings,
        description: 'Account settings and preferences'
      }
    ]
  });

  // Add bookmarks section if there are any
  if (bookmarks.length > 0) {
    navigationItems.unshift({
      id: 'bookmarks',
      title: 'Bookmarks',
      items: bookmarks.map(bookmark => ({
        name: bookmark.title,
        href: bookmark.url,
        icon: Bookmark,
        description: bookmark.category || 'Bookmarked page'
      }))
    });
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-16 left-0 z-50 w-64 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out overflow-y-auto lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
          <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="p-4 space-y-6">
          {navigationItems.map((section) => (
            <div key={section.id}>
              <div className="flex items-center justify-between w-full text-left text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                <span>{section.title}</span>
              </div>
              
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;

                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={onClose}
                      className={`
                        group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                        ${isActive
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                        }
                      `}
                      title={item.description}
                    >
                      <Icon className={`
                        mr-3 h-5 w-5 flex-shrink-0
                        ${isActive ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-500'}
                      `} />
                      <span className="truncate">{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

      </div>
    </>
  );
}