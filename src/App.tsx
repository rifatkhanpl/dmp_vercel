import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { BookmarkProvider } from './contexts/BookmarkContext';

// Auth Components
import { SignIn } from './components/Auth/SignIn';
import { SignUp } from './components/Auth/SignUp';

// Page Components
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

// Protected Route Component
import { ProtectedRoute } from './components/Auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <BookmarkProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/search" element={
                <ProtectedRoute>
                  <Search />
                </ProtectedRoute>
              } />
              
              <Route path="/search-results" element={
                <ProtectedRoute>
                  <SearchResults />
                </ProtectedRoute>
              } />
              
              <Route path="/provider/:npi" element={
                <ProtectedRoute>
                  <HCPDetail />
                </ProtectedRoute>
              } />
              
              <Route path="/register" element={
                <ProtectedRoute>
                  <HCPRegistration />
                </ProtectedRoute>
              } />
              
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ProviderProfile />
                </ProtectedRoute>
              } />
              
              <Route path="/bulk-import" element={
                <ProtectedRoute>
                  <BulkImport />
                </ProtectedRoute>
              } />
              
              {/* Admin Only Routes */}
              <Route path="/user-management" element={
                <ProtectedRoute requireAdmin>
                  <UserManagement />
                </ProtectedRoute>
              } />
              
              <Route path="/support-tickets" element={
                <ProtectedRoute requireAdmin>
                  <SupportTickets />
                </ProtectedRoute>
              } />
              
              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </BookmarkProvider>
    </AuthProvider>
  );
}

export default App;