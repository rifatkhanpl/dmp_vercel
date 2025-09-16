import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { BookmarkItem } from '../types/navigation';
import { useAuth } from './AuthContext';
import { errorService } from '../services/errorService';

interface BookmarkContextType {
  bookmarks: BookmarkItem[];
  addBookmark: (title: string, url: string, category?: string, icon?: string) => void;
  removeBookmark: (id: string) => void;
  toggleBookmark: (title: string, url: string, category?: string, icon?: string) => boolean;
  isBookmarked: (url: string) => boolean;
  getBookmarksByCategory: (category?: string) => BookmarkItem[];
  categories: string[];
  clearAllBookmarks: () => void;
  exportBookmarks: () => void;
  importBookmarks: (bookmarks: BookmarkItem[]) => void;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

const STORAGE_KEY = 'practicelink_bookmarks';

export function BookmarkProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);

  // Load bookmarks from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedBookmarks = JSON.parse(stored);
        if (Array.isArray(parsedBookmarks)) {
          setBookmarks(parsedBookmarks);
        }
      }
    } catch (error) {
      errorService.logError(error as Error, { context: 'Loading bookmarks from storage' });
    }
  }, []);

  // Save bookmarks to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
    } catch (error) {
      errorService.logError(error as Error, { context: 'Saving bookmarks to storage' });
    }
  }, [bookmarks]);

  const addBookmark = (title: string, url: string, category?: string, icon?: string) => {
    if (!user) {
      errorService.showError('Please sign in to bookmark pages');
      return;
    }
    
    // Check if already bookmarked
    if (isBookmarked(url)) {
      errorService.showWarning('Page is already bookmarked');
      return;
    }
    
    const newBookmark: BookmarkItem = {
      id: `bookmark_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: title.trim(),
      url: url.trim(),
      icon: icon || 'Bookmark',
      category: category || 'General',
      userId: user.id,
      createdAt: new Date()
    };
    
    setBookmarks(prev => [...prev, newBookmark]);
    errorService.showSuccess(`"${title}" added to bookmarks`);
  };

  const removeBookmark = (id: string) => {
    const bookmark = bookmarks.find(b => b.id === id);
    setBookmarks(prev => prev.filter(bookmark => bookmark.id !== id));
    
    if (bookmark) {
      errorService.showSuccess(`"${bookmark.title}" removed from bookmarks`);
    }
  };

  const toggleBookmark = (title: string, url: string, category?: string, icon?: string): boolean => {
    if (isBookmarked(url)) {
      const bookmark = bookmarks.find(b => b.url === url && b.userId === user?.id);
      if (bookmark) {
        removeBookmark(bookmark.id);
        return false;
      }
    } else {
      addBookmark(title, url, category, icon);
      return true;
    }
    return false;
  };

  const isBookmarked = (url: string): boolean => {
    return bookmarks.some(b => b.url === url && b.userId === user?.id);
  };

  const getBookmarksByCategory = (category?: string): BookmarkItem[] => {
    const userBookmarks = bookmarks.filter(b => b.userId === user?.id);
    if (!category) return userBookmarks;
    return userBookmarks.filter(b => b.category === category);
  };

  const categories = [...new Set(bookmarks
    .filter(b => b.userId === user?.id)
    .map(b => b.category)
    .filter(Boolean)
  )];

  const clearAllBookmarks = () => {
    if (window.confirm('Are you sure you want to remove all bookmarks? This action cannot be undone.')) {
      setBookmarks(prev => prev.filter(b => b.userId !== user?.id));
      errorService.showSuccess('All bookmarks cleared');
    }
  };

  const exportBookmarks = () => {
    try {
      const userBookmarks = bookmarks.filter(b => b.userId === user?.id);
      const exportData = {
        bookmarks: userBookmarks,
        exportDate: new Date().toISOString(),
        version: '1.0'
      };
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `practicelink_bookmarks_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      errorService.showSuccess('Bookmarks exported successfully');
    } catch (error) {
      errorService.logError(error as Error, { context: 'Bookmark export' });
      errorService.showError('Failed to export bookmarks');
    }
  };

  const importBookmarks = (importedBookmarks: BookmarkItem[]) => {
    try {
      if (!Array.isArray(importedBookmarks)) {
        throw new Error('Invalid bookmark format');
      }
      
      const validBookmarks = importedBookmarks.filter(bookmark => 
        bookmark.title && bookmark.url && bookmark.id
      );
      
      // Update user ID for imported bookmarks
      const updatedBookmarks = validBookmarks.map(bookmark => ({
        ...bookmark,
        userId: user?.id || '',
        createdAt: new Date(bookmark.createdAt)
      }));
      
      setBookmarks(prev => {
        // Remove duplicates and add new ones
        const filtered = prev.filter(existing => 
          !updatedBookmarks.some(imported => imported.url === existing.url && imported.userId === existing.userId)
        );
        return [...filtered, ...updatedBookmarks];
      });
      
      errorService.showSuccess(`Imported ${validBookmarks.length} bookmarks`);
    } catch (error) {
      errorService.logError(error as Error, { context: 'Bookmark import' });
      errorService.showError('Failed to import bookmarks');
    }
  };

  const value: BookmarkContextType = {
    bookmarks: bookmarks.filter(b => b.userId === user?.id),
    addBookmark,
    removeBookmark,
    toggleBookmark,
    isBookmarked,
    getBookmarksByCategory,
    categories,
    clearAllBookmarks,
    exportBookmarks,
    importBookmarks
  };

  return (
    <BookmarkContext.Provider value={value}>
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarks(): BookmarkContextType {
  const context = useContext(BookmarkContext);
  if (context === undefined) {
    throw new Error('useBookmarks must be used within a BookmarkProvider');
  }
  return context;
}