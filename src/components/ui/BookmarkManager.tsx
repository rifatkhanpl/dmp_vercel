import React, { useState } from 'react';
import { useBookmarks } from '../../contexts/BookmarkContext';
import { 
  Bookmark, 
  BookmarkCheck, 
  Trash2, 
  Download, 
  Upload, 
  FolderOpen,
  Search,
  X,
  ExternalLink,
  Edit3
} from 'lucide-react';
import { AccessibleModal } from './AccessibleModal';

interface BookmarkManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BookmarkManager({ isOpen, onClose }: BookmarkManagerProps) {
  const { 
    bookmarks, 
    removeBookmark, 
    categories, 
    clearAllBookmarks, 
    exportBookmarks,
    importBookmarks,
    getBookmarksByCategory 
  } = useBookmarks();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [editingBookmark, setEditingBookmark] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const filteredBookmarks = bookmarks.filter(bookmark => {
    const matchesSearch = !searchQuery || 
      bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bookmark.url.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !selectedCategory || bookmark.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.bookmarks && Array.isArray(data.bookmarks)) {
          importBookmarks(data.bookmarks);
        } else {
          throw new Error('Invalid bookmark file format');
        }
      } catch (error) {
        console.error('Import error:', error);
        alert('Failed to import bookmarks. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  const startEdit = (bookmark: BookmarkItem) => {
    setEditingBookmark(bookmark.id);
    setEditTitle(bookmark.title);
  };

  const saveEdit = () => {
    // In a real implementation, this would update the bookmark
    setEditingBookmark(null);
    setEditTitle('');
  };

  const cancelEdit = () => {
    setEditingBookmark(null);
    setEditTitle('');
  };

  return (
    <AccessibleModal
      isOpen={isOpen}
      onClose={onClose}
      title="Bookmark Manager"
      size="lg"
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search bookmarks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Search bookmarks"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Filter by category"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            
            <button
              onClick={exportBookmarks}
              className="flex items-center space-x-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              title="Export bookmarks"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
            
            <label className="flex items-center space-x-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 cursor-pointer">
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">Import</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
                aria-label="Import bookmarks"
              />
            </label>
          </div>
        </div>

        {/* Category Summary */}
        {categories.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => {
                const count = getBookmarksByCategory(category).length;
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(selectedCategory === category ? '' : category)}
                    className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <FolderOpen className="h-3 w-3" />
                    <span>{category}</span>
                    <span className="bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full text-xs">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Bookmarks List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredBookmarks.length === 0 ? (
            <div className="text-center py-8">
              <Bookmark className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No bookmarks found</h3>
              <p className="text-gray-500">
                {searchQuery || selectedCategory 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Start bookmarking pages to access them quickly later'
                }
              </p>
            </div>
          ) : (
            filteredBookmarks.map((bookmark) => (
              <div
                key={bookmark.id}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 group"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <BookmarkCheck className="h-4 w-4 text-yellow-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    {editingBookmark === bookmark.id ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveEdit();
                            if (e.key === 'Escape') cancelEdit();
                          }}
                          autoFocus
                        />
                        <button
                          onClick={saveEdit}
                          className="text-green-600 hover:text-green-700"
                          title="Save changes"
                        >
                          <BookmarkCheck className="h-4 w-4" />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="text-gray-400 hover:text-gray-600"
                          title="Cancel editing"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {bookmark.title}
                          </h4>
                          {bookmark.category && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {bookmark.category}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 truncate" title={bookmark.url}>
                          {bookmark.url}
                        </p>
                        <p className="text-xs text-gray-400">
                          Added {bookmark.createdAt.toLocaleDateString()}
                        </p>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <a
                    href={bookmark.url}
                    className="p-1 text-gray-400 hover:text-blue-600 rounded"
                    title="Open bookmark"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                  <button
                    onClick={() => startEdit(bookmark)}
                    className="p-1 text-gray-400 hover:text-green-600 rounded"
                    title="Edit bookmark"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => removeBookmark(bookmark.id)}
                    className="p-1 text-gray-400 hover:text-red-600 rounded"
                    title="Remove bookmark"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        {bookmarks.length > 0 && (
          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              {bookmarks.length} bookmark{bookmarks.length !== 1 ? 's' : ''} total
            </p>
            <button
              onClick={clearAllBookmarks}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Clear All Bookmarks
            </button>
          </div>
        )}
      </div>
    </AccessibleModal>
  );
}