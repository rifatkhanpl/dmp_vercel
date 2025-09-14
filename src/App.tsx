import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { BookmarkProvider } from './contexts/BookmarkContext';

// Import all page components
import { LandingPage } from './components/Pages/LandingPage';
import { Dashboard } from './components/Pages/Dashboard';
import { Search } from './components/Pages/Search';
import { SearchResults } from './components/Pages/SearchResults';
import { HCPRegistration } from './components/Pages/HCPRegistration';
import { ProviderProfile } from './components/Pages/ProviderProfile';
import { HCPDetail } from './components/Pages/HCPDetail';
import { BulkImport } from './components/Pages/BulkImport';
import { UserManagement } from './components/Pages/UserManagement';
import { SupportTickets } from './components/Pages/SupportTickets';

// Import auth components
import { SignIn } from './components/Auth/SignIn';
import { SignUp } from './components/Auth/SignUp';
import { LoginForm } from './components/Auth/LoginForm';
import { RegistrationForm } from './components/Auth/RegistrationForm';
import { EmailVerification } from './components/Auth/EmailVerification';
import { ForgotPassword } from './components/Auth/ForgotPassword';
import { PasswordReset } from './components/Auth/PasswordReset';

// Protected Route Component
import { useAuth } from './contexts/AuthContext';

function ProtectedRoute({ children, requireAdmin = false }: { children: React.ReactNode; requireAdmin?: boolean }) {
  const { isAuthenticated, user, isLoading } = useAuth();

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

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  if (requireAdmin && user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <BookmarkProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegistrationForm />} />
              <Route path="/verify-email" element={<EmailVerification />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<PasswordReset />} />

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
              <Route path="/hcp-registration" element={
                <ProtectedRoute>
                  <HCPRegistration />
                </ProtectedRoute>
              } />
              <Route path="/provider-profile" element={
                <ProtectedRoute>
                  <ProviderProfile />
                </ProtectedRoute>
              } />
              <Route path="/hcp-detail" element={
                <ProtectedRoute>
                  <HCPDetail />
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