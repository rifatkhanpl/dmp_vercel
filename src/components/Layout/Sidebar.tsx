import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useBookmarks } from '../../contexts/BookmarkContext';
import { BookmarkButton } from '../ui/BookmarkButton';
import { 
  Home, 
  Users, 
  Search, 
  BarChart3, 
  Settings,
  UserPlus,
  FileText,
  X,
  Bookmark,
  ExternalLink
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user } = useAuth();
  const { bookmarks } = useBookmarks();

  const navigationSections = [
    {
      id: 'main',
      title: 'Main Navigation',
      items: [
        { name: 'Dashboard', href: '/dashboard', icon: Home, description: 'Main dashboard overview' },
        { name: 'Analytics', href: '/analytics', icon: BarChart3, description: 'View analytics and reports' },
        { name: 'Provider Search', href: '/search', icon: Search, description: 'Search healthcare providers' },
        { name: 'HCP Registration', href: '/hcp-registration', icon: UserPlus, description: 'Register new providers' }
      ]
    },
    {
      id: 'account',
      title: 'Account',
      items: [
        { name: 'My Profile', href: '/user-profile', icon: Users, description: 'View and edit profile' },
        { name: 'Settings', href: '/user-settings', icon: Settings, description: 'Account settings' }
      ]
    }
  ];

  // Add bookmarks section if user has bookmarks
  if (bookmarks.length > 0) {
    navigationSections.push({
      id: 'bookmarks',
      title: 'Bookmarks',
      items: bookmarks.slice(0, 8).map(bookmark => ({
        name: bookmark.title,
        href: bookmark.url,
        icon: Bookmark,
        description: `Bookmarked: ${bookmark.category}`
      }))
    });
  }

  const currentPath = window.location.pathname;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-50 z-20 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 lg:hidden">
          <h2 className="text-lg font-semibold text-gray-900">Navigation</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-5 px-2 space-y-8 lg:mt-8" aria-label="Main navigation">
          {navigationSections.map((section) => (
            <div key={section.id}>
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {section.title}
              </h3>
              <div className="mt-2 space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPath === item.href;
                  
                  return (
                    <div key={item.name} className="relative group">
                      <a
                        href={item.href}
                        onClick={onClose}
                        className={`
                          group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors w-full
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
                        <span className="truncate flex-1">{item.name}</span>
                      </a>
                      {section.id !== 'bookmarks' && (
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <BookmarkButton
                            title={item.name}
                            url={item.href}
                            category={section.title}
                            icon={item.icon.name}
                            size="sm"
                            variant="minimal"
                            showText={false}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Show more bookmarks link */}
          {bookmarks.length > 8 && (
            <div className="px-3">
              <button
                onClick={() => {
                  // This would open the bookmark manager
                  console.log('Open bookmark manager');
                }}
                className="text-xs text-blue-600 hover:text-blue-700 flex items-center space-x-1"
              >
                <span>View all {bookmarks.length} bookmarks</span>
                <ExternalLink className="h-3 w-3" />
              </button>
            </div>
          )}
        </nav>
      </div>
    </>
  );
}