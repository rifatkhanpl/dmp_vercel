import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { errorService } from '../services/errorService';

interface AppState {
  isOnline: boolean;
  notifications: Notification[];
  theme: 'light' | 'dark';
  sidebarCollapsed: boolean;
  activeJobs: string[];
  lastActivity: Date;
  memoryUsage?: {
    used: number;
    total: number;
    limit: number;
  };
}

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actions?: Array<{
    label: string;
    action: () => void;
  }>;
}

type AppAction = 
  | { type: 'SET_ONLINE_STATUS'; payload: boolean }
  | { type: 'ADD_NOTIFICATION'; payload: Omit<Notification, 'id' | 'timestamp' | 'read'> }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'CLEAR_NOTIFICATIONS' }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_SIDEBAR_COLLAPSED'; payload: boolean }
  | { type: 'ADD_ACTIVE_JOB'; payload: string }
  | { type: 'REMOVE_ACTIVE_JOB'; payload: string }
  | { type: 'UPDATE_LAST_ACTIVITY' }
  | { type: 'UPDATE_MEMORY_USAGE'; payload: AppState['memoryUsage'] };

const initialState: AppState = {
  isOnline: navigator.onLine,
  notifications: [],
  theme: 'light',
  sidebarCollapsed: false,
  activeJobs: [],
  lastActivity: new Date()
};

function appStateReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_ONLINE_STATUS':
      return { ...state, isOnline: action.payload };
    
    case 'ADD_NOTIFICATION':
      const newNotification: Notification = {
        ...action.payload,
        id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
        read: false
      };
      return {
        ...state,
        notifications: [newNotification, ...state.notifications].slice(0, 50) // Keep max 50 notifications
      };
    
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(n => 
          n.id === action.payload ? { ...n, read: true } : n
        )
      };
    
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      };
    
    case 'CLEAR_NOTIFICATIONS':
      return { ...state, notifications: [] };
    
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed };
    
    case 'SET_SIDEBAR_COLLAPSED':
      return { ...state, sidebarCollapsed: action.payload };
    
    case 'ADD_ACTIVE_JOB':
      return {
        ...state,
        activeJobs: [...state.activeJobs, action.payload]
      };
    
    case 'REMOVE_ACTIVE_JOB':
      return {
        ...state,
        activeJobs: state.activeJobs.filter(id => id !== action.payload)
      };
    
    case 'UPDATE_LAST_ACTIVITY':
      return { ...state, lastActivity: new Date() };
    
    case 'UPDATE_MEMORY_USAGE':
      return { ...state, memoryUsage: action.payload };
    
    default:
      return state;
  }
}

interface AppStateContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  toggleTheme: () => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  addActiveJob: (jobId: string) => void;
  removeActiveJob: (jobId: string) => void;
  updateLastActivity: () => void;
  unreadNotificationCount: number;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appStateReducer, initialState);

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

  // Activity tracking
  useEffect(() => {
    const handleActivity = () => dispatch({ type: 'UPDATE_LAST_ACTIVITY' });
    
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, []);

  // Memory monitoring
  useEffect(() => {
    const monitorMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        dispatch({
          type: 'UPDATE_MEMORY_USAGE',
          payload: {
            used: memory.usedJSHeapSize,
            total: memory.totalJSHeapSize,
            limit: memory.jsHeapSizeLimit
          }
        });
      }
    };

    const interval = setInterval(monitorMemory, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
  };

  const markNotificationRead = (id: string) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id });
  };

  const removeNotification = (id: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  };

  const clearNotifications = () => {
    dispatch({ type: 'CLEAR_NOTIFICATIONS' });
  };

  const toggleTheme = () => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    dispatch({ type: 'SET_THEME', payload: newTheme });
  };

  const toggleSidebar = () => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  };

  const setSidebarCollapsed = (collapsed: boolean) => {
    dispatch({ type: 'SET_SIDEBAR_COLLAPSED', payload: collapsed });
  };

  const addActiveJob = (jobId: string) => {
    dispatch({ type: 'ADD_ACTIVE_JOB', payload: jobId });
  };

  const removeActiveJob = (jobId: string) => {
    dispatch({ type: 'REMOVE_ACTIVE_JOB', payload: jobId });
  };

  const updateLastActivity = () => {
    dispatch({ type: 'UPDATE_LAST_ACTIVITY' });
  };

  const unreadNotificationCount = state.notifications.filter(n => !n.read).length;

  const value: AppStateContextType = {
    state,
    dispatch,
    addNotification,
    markNotificationRead,
    removeNotification,
    clearNotifications,
    toggleTheme,
    toggleSidebar,
    setSidebarCollapsed,
    addActiveJob,
    removeActiveJob,
    updateLastActivity,
    unreadNotificationCount
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