import React from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { useBookmarks } from '../../contexts/BookmarkContext';
import { useAuth } from '../../contexts/AuthContext';

interface BookmarkButtonProps {
  title: string;
  url: string;
  category?: string;
  icon?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal' | 'pill';
  className?: string;
  showText?: boolean;
}

export function BookmarkButton({ 
  title, 
  url, 
  category = 'General',
  icon = 'Bookmark',
  size = 'md',
  variant = 'default',
  className = '',
  showText = true
}: BookmarkButtonProps) {
  const { isAuthenticated } = useAuth();
  const { toggleBookmark, isBookmarked } = useBookmarks();
  
  if (!isAuthenticated) {
    return null;
  }

  const bookmarked = isBookmarked(url);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleBookmark(title, url, category, icon);
  };

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const buttonSizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'minimal':
        return bookmarked
          ? 'text-yellow-600 hover:text-yellow-700'
          : 'text-gray-400 hover:text-gray-600';
      case 'pill':
        return bookmarked
          ? 'bg-yellow-50 text-yellow-700 border border-yellow-200 hover:bg-yellow-100'
          : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100';
      default:
        return bookmarked
          ? 'bg-yellow-50 text-yellow-700 border border-yellow-200 hover:bg-yellow-100'
          : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50';
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`
        inline-flex items-center space-x-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${buttonSizeClasses[size]}
        ${getVariantClasses()}
        ${className}
      `}
      title={bookmarked ? `Remove "${title}" from bookmarks` : `Add "${title}" to bookmarks`}
      aria-label={bookmarked ? `Remove ${title} from bookmarks` : `Add ${title} to bookmarks`}
    >
      {bookmarked ? (
        <BookmarkCheck className={sizeClasses[size]} />
      ) : (
        <Bookmark className={sizeClasses[size]} />
      )}
      {showText && (
        <span className="font-medium">
          {bookmarked ? 'Bookmarked' : 'Bookmark'}
        </span>
      )}
    </button>
  );
}