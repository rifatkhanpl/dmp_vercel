import React from 'react';
import { Toaster } from 'react-hot-toast';

/**
 * Global toast notification component
 */
export function Toast() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        // Default options
        duration: 4000,
        style: {
          background: '#fff',
          color: '#363636',
          fontSize: '14px',
          fontWeight: '500',
          padding: '12px 16px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          maxWidth: '400px'
        },
        // Success
        success: {
          duration: 4000,
          iconTheme: {
            primary: '#10B981',
            secondary: '#fff',
          },
        },
        // Error
        error: {
          duration: 6000,
          iconTheme: {
            primary: '#EF4444',
            secondary: '#fff',
          },
        },
        // Loading
        loading: {
          duration: Infinity,
        },
      }}
    />
  );
}