import React, { createContext, useContext, useState, ReactNode } from 'react';
import { BookmarkItem } from '../types/navigation';
import { useAuth } from './AuthContext';

interface BookmarkContextType {
  bookmarks: BookmarkItem[];
  addBookmark: (title: string, url: string, category?: string) => void;
  removeBookmark: (id: string) => void;
  getBookmarksByCategory: (category?: string) => BookmarkItem[];
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

export function BookmarkProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([
    {
      id: '1',
      title: 'AI Assist HCP Data Import',
      url: '/bulk-import',
      icon: 'Brain',
      category: 'Data Collection',
      userId: '1',
      createdAt: new Date()
    },
    {
      id: '2',
      title: 'Provider Dashboard',
      url: '/dashboard',
      icon: 'BarChart3',
      category: 'Analytics',
      userId: '1',
      createdAt: new Date()
    }
  ]);

  const addBookmark = (title: string, url: string, category?: string) => {
    if (!user) return;
    
    const newBookmark: BookmarkItem = {
      id: Date.now().toString(),
      title,
      url,
      category,
      userId: user.id,
      createdAt: new Date()
    };
    
    setBookmarks(prev => [...prev, newBookmark]);
  };

  const removeBookmark = (id: string) => {
    setBookmarks(prev => prev.filter(bookmark => bookmark.id !== id));
  };

  const getBookmarksByCategory = (category?: string) => {
    const userBookmarks = bookmarks.filter(b => b.userId === user?.id);
    if (!category) return userBookmarks;
    return userBookmarks.filter(b => b.category === category);
  };

  return (
    <BookmarkContext.Provider value={{
      bookmarks: bookmarks.filter(b => b.userId === user?.id),
      addBookmark,
      removeBookmark,
      getBookmarksByCategory
    }}>
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarks() {
  const context = useContext(BookmarkContext);
  if (context === undefined) {
    throw new Error('useBookmarks must be used within a BookmarkProvider');
  }
  return context;
}