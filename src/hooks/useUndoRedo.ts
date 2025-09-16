import { useState, useCallback, useRef } from 'react';
import { errorService } from '../services/errorService';

interface UndoRedoState<T> {
  past: T[];
  present: T;
  future: T[];
}

interface UseUndoRedoOptions {
  maxHistorySize?: number;
  debounceMs?: number;
}

export function useUndoRedo<T>(
  initialState: T,
  { maxHistorySize = 50, debounceMs = 1000 }: UseUndoRedoOptions = {}
) {
  const [state, setState] = useState<UndoRedoState<T>>({
    past: [],
    present: initialState,
    future: []
  });

  const debounceTimeoutRef = useRef<NodeJS.Timeout>();
  const pendingStateRef = useRef<T | null>(null);

  // Set new state with history tracking
  const set = useCallback((newState: T | ((prev: T) => T)) => {
    const resolvedState = typeof newState === 'function' 
      ? (newState as (prev: T) => T)(state.present)
      : newState;

    // Store pending state for debounced history update
    pendingStateRef.current = resolvedState;

    // Update present state immediately for responsive UI
    setState(prev => ({
      ...prev,
      present: resolvedState,
      future: [] // Clear future when new state is set
    }));

    // Debounce history updates to avoid excessive history entries
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      if (pendingStateRef.current) {
        setState(prev => {
          const newPast = [...prev.past, prev.present];
          
          // Limit history size
          if (newPast.length > maxHistorySize) {
            newPast.splice(0, newPast.length - maxHistorySize);
          }

          return {
            past: newPast,
            present: pendingStateRef.current!,
            future: []
          };
        });
        
        pendingStateRef.current = null;
      }
    }, debounceMs);
  }, [state.present, maxHistorySize, debounceMs]);

  // Undo operation
  const undo = useCallback(() => {
    setState(prev => {
      if (prev.past.length === 0) {
        errorService.showWarning('Nothing to undo');
        return prev;
      }

      const previous = prev.past[prev.past.length - 1];
      const newPast = prev.past.slice(0, prev.past.length - 1);

      return {
        past: newPast,
        present: previous,
        future: [prev.present, ...prev.future]
      };
    });
  }, []);

  // Redo operation
  const redo = useCallback(() => {
    setState(prev => {
      if (prev.future.length === 0) {
        errorService.showWarning('Nothing to redo');
        return prev;
      }

      const next = prev.future[0];
      const newFuture = prev.future.slice(1);

      return {
        past: [...prev.past, prev.present],
        present: next,
        future: newFuture
      };
    });
  }, []);

  // Reset to initial state
  const reset = useCallback(() => {
    setState({
      past: [],
      present: initialState,
      future: []
    });
  }, [initialState]);

  // Clear history
  const clearHistory = useCallback(() => {
    setState(prev => ({
      past: [],
      present: prev.present,
      future: []
    }));
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return {
    state: state.present,
    set,
    undo,
    redo,
    reset,
    clearHistory,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
    historySize: state.past.length
  };
}