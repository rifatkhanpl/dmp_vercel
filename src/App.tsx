import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { BookmarkProvider } from './contexts/BookmarkContext';
import { useAuth } from './contexts/AuthContext';

// Import components
import { LandingPage } from './components/Pages/LandingPage';
import { SignIn } from './components/Auth/SignIn';
import { Dashboard } from './components/Pages/Dashboard';
import { HCPRegistration } from './components/Pages/HCPRegistration';
import { BulkImport } from './components/Pages/BulkImport';
import { Search } from './components/Pages/Search';
import { SearchResults } from './components/Pages/SearchResults';
import { HCPDetail } from './components/Pages/HCPDetail';
import { ProviderProfile } from './components/Pages/ProviderProfile';

function AppRoutes() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route 
        path="/signin" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <SignIn />} 
      />
      
      {/* Protected routes */}
      <Route 
        path="/dashboard" 
        element={isAuthenticated ? <Dashboard /> : <Navigate to="/signin" replace />} 
      />
      <Route 
        path="/hcp-registration" 
        element={isAuthenticated ? <HCPRegistration /> : <Navigate to="/signin" replace />} 
      />
      <Route 
        path="/bulk-import" 
        element={isAuthenticated ? <BulkImport /> : <Navigate to="/signin" replace />} 
      />
      <Route 
        path="/search" 
        element={isAuthenticated ? <Search /> : <Navigate to="/signin" replace />} 
      />
      <Route 
        path="/search-results" 
        element={isAuthenticated ? <SearchResults /> : <Navigate to="/signin" replace />} 
      />
      <Route 
        path="/hcp-detail" 
        element={isAuthenticated ? <HCPDetail /> : <Navigate to="/signin" replace />} 
      />
      <Route 
        path="/provider-profile" 
        element={isAuthenticated ? <ProviderProfile /> : <Navigate to="/signin" replace />} 
      />
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <BookmarkProvider>
          <AppRoutes />
        </BookmarkProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;