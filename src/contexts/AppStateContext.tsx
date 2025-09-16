import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { errorService } from '../services/errorService';

// State interfaces
interface AppState {
  importJobs: ImportJob[];
  providers: any[];
  currentUser: any;
  notifications: Notification[];
  isOnline: boolean;
  lastSync: string | null;
}

interface ImportJob {
  id: string;
  status: 'processing' | 'completed' | 'failed' | 'partial';
  type: 'template' | 'ai-map' | 'url';
  progress: number;
  totalRecords: number;
  successCount: number;
  errorCount: number;
  createdAt: string;
  createdBy: string;
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

// Action types
type AppAction = 
  | { type: 'ADD_IMPORT_JOB'; payload: ImportJob }
  | { type: 'UPDATE_IMPORT_JOB'; payload: { id: string; updates: Partial<ImportJob> } }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'SET_ONLINE_STATUS'; payload: boolean }
  | { type: 'UPDATE_LAST_SYNC'; payload: string }
  | { type: 'CLEAR_NOTIFICATIONS' }
  | { type: 'RESET_STATE' };

// Initial state
const initialState: AppState = {
  importJobs: [],
  providers: [],
  currentUser: null,
  notifications: [],
  isOnline: navigator.onLine,
  lastSync: null
};

// Reducer with optimistic updates and conflict resolution
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_IMPORT_JOB':
      return {
        ...state,
        importJobs: [action.payload, ...state.importJobs]
      };
      
    case 'UPDATE_IMPORT_JOB':
      return {
        ...state,
        importJobs: state.importJobs.map(job =>
          job.id === action.payload.id
            ? { ...job, ...action.payload.updates }
            : job
        )
      };
      
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications.slice(0, 49)] // Keep last 50
      };
      
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload
            ? { ...notification, read: true }
            : notification
        )
      };
      
    case 'SET_ONLINE_STATUS':
      return {
        ...state,
        isOnline: action.payload
      };
      
    case 'UPDATE_LAST_SYNC':
      return {
        ...state,
        lastSync: action.payload
      };
      
    case 'CLEAR_NOTIFICATIONS':
      return {
        ...state,
        notifications: []
      };
      
    case 'RESET_STATE':
      return initialState;
      
    default:
      return state;
  }
}

// Context
interface AppStateContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  addImportJob: (job: Omit<ImportJob, 'id' | 'createdAt'>) => string;
  updateImportJob: (id: string, updates: Partial<ImportJob>) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

// Provider component
interface AppStateProviderProps {
  children: ReactNode;
}

export function AppStateProvider({ children }: AppStateProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => dispatch({ type: 'SET_ONLINE_STATUS', payload: true });
    const handleOffline = () => dispatch({ type: 'SET_ONLINE_STATUS', payload: false });

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // State persistence
  useEffect(() => {
    const savedState = localStorage.getItem('dmp-app-state');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        // Restore only non-sensitive state
        if (parsed.importJobs) {
          parsed.importJobs.forEach((job: ImportJob) => {
            dispatch({ type: 'ADD_IMPORT_JOB', payload: job });
          });
        }
      } catch (error) {
        errorService.logError(error as Error, { context: 'State restoration' });
      }
    }
  }, []);

  // Save state to localStorage (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      try {
        const stateToSave = {
          importJobs: state.importJobs.slice(0, 10), // Keep last 10 jobs
          lastSync: state.lastSync
        };
        localStorage.setItem('dmp-app-state', JSON.stringify(stateToSave));
      } catch (error) {
        errorService.logError(error as Error, { context: 'State persistence' });
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [state.importJobs, state.lastSync]);

  // Helper functions
  const addImportJob = (job: Omit<ImportJob, 'id' | 'createdAt'>) => {
    const id = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const fullJob: ImportJob = {
      ...job,
      id,
      createdAt: new Date().toISOString()
    };
    dispatch({ type: 'ADD_IMPORT_JOB', payload: fullJob });
    return id;
  };

  const updateImportJob = (id: string, updates: Partial<ImportJob>) => {
    dispatch({ type: 'UPDATE_IMPORT_JOB', payload: { id, updates } });
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const fullNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      read: false
    };
    dispatch({ type: 'ADD_NOTIFICATION', payload: fullNotification });
  };

  const markNotificationRead = (id: string) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id });
  };

  const clearNotifications = () => {
    dispatch({ type: 'CLEAR_NOTIFICATIONS' });
  };

  const value: AppStateContextType = {
    state,
    dispatch,
    addImportJob,
    updateImportJob,
    addNotification,
    markNotificationRead,
    clearNotifications
  };

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState(): AppStateContextType {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
}