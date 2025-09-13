import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { BookmarkProvider } from './contexts/BookmarkContext';
import { LandingPage } from './components/Pages/LandingPage';
import { Dashboard } from './components/Pages/Dashboard';
import { Search } from './components/Pages/Search';
import { SearchResults } from './components/Pages/SearchResults';
import { HCPDetail } from './components/Pages/HCPDetail';
import { HCPRegistration } from './components/Pages/HCPRegistration';
import { ProviderProfile } from './components/Pages/ProviderProfile';
import { BulkImport } from './components/Pages/BulkImport';
import { UserManagement } from './components/Pages/UserManagement';
import { SupportTickets } from './components/Pages/SupportTickets';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <BookmarkProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signin" element={<LandingPage />} />
            <Route path="/signup" element={<LandingPage />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/search" 
              element={
                <ProtectedRoute>
                  <Search />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/search-results" 
              element={
                <ProtectedRoute>
                  <SearchResults />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/provider/:npi" 
              element={
                <ProtectedRoute>
                  <HCPDetail />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/register" 
              element={
                <ProtectedRoute>
                  <HCPRegistration />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <ProviderProfile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/bulk-import" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <BulkImport />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/user-management" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <UserManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/support" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <SupportTickets />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </BookmarkProvider>
    </AuthProvider>
  );
}

export default App;