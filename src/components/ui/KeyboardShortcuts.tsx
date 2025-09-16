import React, { useEffect, useCallback } from 'react';
import { errorService } from '../../services/errorService';

interface Shortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  action: () => void;
  description: string;
  disabled?: boolean;
}

interface KeyboardShortcutsProps {
  shortcuts: Shortcut[];
  enabled?: boolean;
}

export const KeyboardShortcuts = React.memo<KeyboardShortcutsProps>(({
  shortcuts,
  enabled = true
}) => {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!enabled) return;

    // Don't trigger shortcuts when user is typing in inputs
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      return;
    }

    for (const shortcut of shortcuts) {
      if (shortcut.disabled) continue;

      const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase();
      const ctrlMatch = !!shortcut.ctrlKey === (e.ctrlKey || e.metaKey);
      const shiftMatch = !!shortcut.shiftKey === e.shiftKey;
      const altMatch = !!shortcut.altKey === e.altKey;

      if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
        e.preventDefault();
        e.stopPropagation();
        
        try {
          shortcut.action();
        } catch (error) {
          errorService.logError(error as Error, { 
            context: 'Keyboard shortcut execution',
            shortcut: shortcut.description 
          });
        }
        break;
      }
    }
  }, [shortcuts, enabled]);

  useEffect(() => {
    if (enabled) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [handleKeyDown, enabled]);

  return null;
});

KeyboardShortcuts.displayName = 'KeyboardShortcuts';

// Hook for managing keyboard shortcuts
export function useKeyboardShortcuts(shortcuts: Shortcut[], enabled: boolean = true) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when user is typing
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      for (const shortcut of shortcuts) {
        if (shortcut.disabled) continue;

        const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatch = !!shortcut.ctrlKey === (e.ctrlKey || e.metaKey);
        const shiftMatch = !!shortcut.shiftKey === e.shiftKey;
        const altMatch = !!shortcut.altKey === e.altKey;

        if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
          e.preventDefault();
          e.stopPropagation();
          
          try {
            shortcut.action();
          } catch (error) {
            errorService.logError(error as Error, { 
              context: 'Keyboard shortcut',
              shortcut: shortcut.description 
            });
          }
          break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, enabled]);
}