import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { BookmarkProvider } from './contexts/BookmarkContext';

// Import components
import { LandingPage } from './components/Pages/LandingPage';
import { SignIn } from './components/Auth/SignIn';
import { SignUp } from './components/Auth/SignUp';
import { ForgotPassword } from './components/Auth/ForgotPassword';
import { EmailVerification } from './components/Auth/EmailVerification';
import { PasswordReset } from './components/Auth/PasswordReset';
import { Dashboard } from './components/Pages/Dashboard';
import { HCPRegistration } from './components/Pages/HCPRegistration';
import { BulkImport } from './components/Pages/BulkImport';
import { Search } from './components/Pages/Search';
import { SearchResults } from './components/Pages/SearchResults';
import { HCPDetail } from './components/Pages/HCPDetail';
import { ProviderProfile } from './components/Pages/ProviderProfile';
import { UserManagement } from './components/Pages/UserManagement';
import { UserProfile } from './components/Pages/UserProfile';
import { UserSettings } from './components/Pages/UserSettings';
import { GMEProgramSearch } from './components/Pages/GMEProgramSearch';
import { GMEProgramDetail } from './components/Pages/GMEProgramDetail';

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }
  
  return <>{children}</>;
}

// Public Route Component (redirect to dashboard if already logged in)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <BookmarkProvider>
          <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/signin" element={
              <PublicRoute>
                <SignIn />
              </PublicRoute>
            } />
            <Route path="/signup" element={
              <PublicRoute>
                <SignUp />
              </PublicRoute>
            } />
            <Route path="/forgot-password" element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            } />
            
            {/* Email Verification Routes */}
            <Route path="/verify-email" element={<EmailVerification />} />
            <Route path="/reset-password" element={<PasswordReset />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/hcp-registration" element={
              <ProtectedRoute>
                <HCPRegistration />
              </ProtectedRoute>
            } />
            <Route path="/bulk-import" element={
              <ProtectedRoute>
                <BulkImport />
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
            <Route path="/hcp-detail" element={
              <ProtectedRoute>
                <HCPDetail />
              </ProtectedRoute>
            } />
            <Route path="/provider-profile" element={
              <ProtectedRoute>
                <ProviderProfile />
              </ProtectedRoute>
            } />
            <Route path="/user-management" element={
              <ProtectedRoute>
                <UserManagement />
              </ProtectedRoute>
            } />
            <Route path="/user-profile" element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            } />
            <Route path="/user-settings" element={
              <ProtectedRoute>
                <UserSettings />
              </ProtectedRoute>
            } />
            <Route path="/gme-program-search" element={
              <ProtectedRoute>
                <GMEProgramSearch />
              </ProtectedRoute>
            } />
            <Route path="/gme-program-detail" element={
              <ProtectedRoute>
                <GMEProgramDetail />
              </ProtectedRoute>
            } />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          </div>
        </BookmarkProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;