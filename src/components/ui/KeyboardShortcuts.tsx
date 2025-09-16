import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Keyboard, X } from 'lucide-react';

interface KeyboardShortcut {
  key: string;
  description: string;
  action: () => void;
  category: string;
}

export function KeyboardShortcuts() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showHelp, setShowHelp] = useState(false);

  const shortcuts: KeyboardShortcut[] = [
    // Navigation shortcuts
    {
      key: 'g d',
      description: 'Go to Dashboard',
      action: () => navigate('/dashboard'),
      category: 'Navigation'
    },
    {
      key: 'g s',
      description: 'Go to Search',
      action: () => navigate('/search'),
      category: 'Navigation'
    },
    {
      key: 'g a',
      description: 'Go to Analytics',
      action: () => navigate('/analytics'),
      category: 'Navigation'
    },
    {
      key: 'g r',
      description: 'Go to HCP Registration',
      action: () => navigate('/hcp-registration'),
      category: 'Navigation'
    },
    
    // Action shortcuts
    {
      key: 'n p',
      description: 'New Provider Registration',
      action: () => navigate('/hcp-registration'),
      category: 'Actions'
    },
    {
      key: 'ctrl+k',
      description: 'Search Providers',
      action: () => navigate('/search'),
      category: 'Actions'
    },
    
    // Help and utilities
    {
      key: '?',
      description: 'Show keyboard shortcuts',
      action: () => setShowHelp(true),
      category: 'Help'
    },
    {
      key: 'escape',
      description: 'Close modals/overlays',
      action: () => setShowHelp(false),
      category: 'Help'
    }
  ];

  // Handle keyboard events
  useEffect(() => {
    let keySequence = '';
    let sequenceTimeout: NodeJS.Timeout;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Handle escape key
      if (event.key === 'Escape') {
        setShowHelp(false);
        return;
      }

      // Handle help shortcut
      if (event.key === '?' && !event.ctrlKey && !event.metaKey && !event.altKey) {
        // Only trigger if not in an input field
        const target = event.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA' && !target.isContentEditable) {
          event.preventDefault();
          setShowHelp(true);
          return;
        }
      }

      // Handle Ctrl+K for search
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        navigate('/search');
        return;
      }

      // Handle key sequences (like 'g d' for go to dashboard)
      if (!event.ctrlKey && !event.metaKey && !event.altKey) {
        const target = event.target as HTMLElement;
        
        // Only handle sequences if not in an input field
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA' && !target.isContentEditable) {
          clearTimeout(sequenceTimeout);
          keySequence += event.key.toLowerCase();
          
          // Check for matching shortcuts
          const matchingShortcut = shortcuts.find(shortcut => 
            shortcut.key === keySequence
          );
          
          if (matchingShortcut) {
            event.preventDefault();
            matchingShortcut.action();
            keySequence = '';
          } else {
            // Reset sequence after 1 second
            sequenceTimeout = setTimeout(() => {
              keySequence = '';
            }, 1000);
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      clearTimeout(sequenceTimeout);
    };
  }, [navigate, shortcuts]);

  // Group shortcuts by category
  const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
    if (!acc[shortcut.category]) {
      acc[shortcut.category] = [];
    }
    acc[shortcut.category].push(shortcut);
    return acc;
  }, {} as Record<string, KeyboardShortcut[]>);

  if (!showHelp) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50"
        onClick={() => setShowHelp(false)}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <Keyboard className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Keyboard Shortcuts</h2>
            </div>
            <button
              onClick={() => setShowHelp(false)}
              className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-1"
              aria-label="Close keyboard shortcuts"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            <div className="space-y-6">
              {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
                <div key={category}>
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
                    {category}
                  </h3>
                  <div className="space-y-2">
                    {categoryShortcuts.map((shortcut, index) => (
                      <div key={index} className="flex items-center justify-between py-2">
                        <span className="text-sm text-gray-700">{shortcut.description}</span>
                        <div className="flex items-center space-x-1">
                          {shortcut.key.split(' ').map((key, keyIndex) => (
                            <React.Fragment key={keyIndex}>
                              {keyIndex > 0 && (
                                <span className="text-xs text-gray-400">then</span>
                              )}
                              <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded">
                                {key === 'ctrl+k' ? (
                                  <>
                                    <span className="text-xs">⌘</span>K
                                  </>
                                ) : key === 'escape' ? (
                                  'Esc'
                                ) : key === '?' ? (
                                  '?'
                                ) : (
                                  key.toUpperCase()
                                )}
                              </kbd>
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <p className="text-xs text-gray-600">
              Press <kbd className="px-1 py-0.5 text-xs font-semibold text-gray-800 bg-gray-200 border border-gray-300 rounded">?</kbd> to show this help again, or <kbd className="px-1 py-0.5 text-xs font-semibold text-gray-800 bg-gray-200 border border-gray-300 rounded">Esc</kbd> to close.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}