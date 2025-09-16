import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../contexts/AuthContext';
import { AppStateProvider } from '../../contexts/AppStateContext';
import { BookmarkProvider } from '../../contexts/BookmarkContext';

// Mock providers for testing
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      <AppStateProvider>
        <AuthProvider>
          <BookmarkProvider>
            {children}
          </BookmarkProvider>
        </AuthProvider>
      </AppStateProvider>
    </BrowserRouter>
  );
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };

// Test data factories
export const createMockProvider = (overrides = {}) => ({
  id: '1',
  name: 'Dr. John Doe, MD',
  specialty: 'Internal Medicine',
  location: 'Los Angeles, CA',
  email: 'john.doe@example.com',
  phone: '(555) 123-4567',
  npi: '1234567890',
  status: 'active',
  credentials: 'MD',
  profession: 'Physician',
  ...overrides
});

export const createMockUser = (overrides = {}) => ({
  id: '1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@practicelink.com',
  role: 'provider-relations-coordinator',
  isEmailVerified: true,
  createdAt: new Date().toISOString(),
  ...overrides
});

export const createMockImportJob = (overrides = {}) => ({
  id: 'job_123',
  type: 'template',
  status: 'completed',
  fileName: 'test.csv',
  totalRecords: 10,
  successCount: 8,
  errorCount: 2,
  warningCount: 0,
  errors: [],
  createdAt: new Date().toISOString(),
  createdBy: 'Test User',
  ...overrides
});