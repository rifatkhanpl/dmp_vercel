import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { BookmarkProvider } from './contexts/BookmarkContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Toast } from './components/ui/Toast';
import { ProtectedRoute, AdminRoute } from './components/Auth/ProtectedRoute';

// Import components
import { LandingPage } from './components/Pages/LandingPage';
import { SignIn } from './components/Auth/SignIn';
import { SignUp } from './components/Auth/SignUp';
import { ForgotPassword } from './components/Auth/ForgotPassword';
import { EmailVerification } from './components/Auth/EmailVerification';
import { PasswordReset } from './components/Auth/PasswordReset';
import { Dashboard } from './components/Pages/Dashboard';
import { AdminDashboard } from './components/Pages/AdminDashboard';
import { UserDashboard } from './components/Pages/UserDashboard';
import { Unauthorized } from './components/Pages/Unauthorized';
import { Auth0Callback } from './components/Auth/Auth0Callback';
import { HCPRegistration } from './components/Pages/HCPRegistration';
import { BulkImport } from './components/Pages/BulkImport';
import { Search } from './components/Pages/Search';
import { HCPDetail } from './components/Pages/HCPDetail';
import { UserManagement } from './components/Pages/UserManagement';
import { AddUser } from './components/Pages/AddUser';
import { UserProfile } from './components/Pages/UserProfile';
import { UserSettings } from './components/Pages/UserSettings';
import { GMEProgramSearch } from './components/Pages/GMEProgramSearch';
import { GMEProgramDetail } from './components/Pages/GMEProgramDetail';
import { GMEInstitutionSearch } from './components/Pages/GMEInstitutionSearch';
import { GMEInstitutionDetail } from './components/Pages/GMEInstitutionDetail';
import { DMPDashboard } from './components/Pages/DMPDashboard';
import { TemplateUpload } from './components/Pages/TemplateUpload';
import { AIMapping } from './components/Pages/AIMapping';
import { URLExtraction } from './components/Pages/URLExtraction';
import { JobConsole } from './components/Pages/JobConsole';
import { DuplicateReview } from './components/Pages/DuplicateReview';
import { DataExport } from './components/Pages/DataExport';

import { Analytics } from './components/Pages/Analytics';
import { MetricsDashboard } from './components/Pages/MetricsDashboard';
import { MetricsSearch } from './components/Pages/MetricsSearch';

// Role-based Dashboard Component
function RoleDashboard() {
  const { user, isAdmin } = useAuth();

  if (isAdmin) {
    return <AdminDashboard />;
  }

  return <UserDashboard />;
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
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <BookmarkProvider>
            <Toast />
            <div className="App">
              <ErrorBoundary fallback={
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                  <div className="text-center">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Navigation Error</h2>
                    <p className="text-gray-600 mb-4">Unable to load the requested page.</p>
                    <a href="/dashboard" className="text-blue-600 hover:text-blue-700">
                      Return to Dashboard
                    </a>
                  </div>
                </div>
              }>
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

            {/* Auth0 Callback Route */}
            <Route path="/callback" element={<Auth0Callback />} />

            {/* Email Verification Routes */}
            <Route path="/verify-email" element={<EmailVerification />} />
            <Route path="/reset-password" element={<PasswordReset />} />

            {/* Unauthorized Route */}
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <RoleDashboard />
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
            <Route path="/hcp-detail" element={
              <ProtectedRoute>
                <HCPDetail />
              </ProtectedRoute>
            } />
            <Route path="/user-management" element={
              <AdminRoute>
                <UserManagement />
              </AdminRoute>
            } />
            <Route path="/add-user" element={
              <AdminRoute>
                <AddUser />
              </AdminRoute>
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
            <Route path="/gme-institution-search" element={
              <ProtectedRoute>
                <GMEInstitutionSearch />
              </ProtectedRoute>
            } />
            <Route path="/gme-institution-detail" element={
              <ProtectedRoute>
                <GMEInstitutionDetail />
              </ProtectedRoute>
            } />
            <Route path="/analytics" element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            } />
            <Route path="/metrics-dashboard" element={
              <ProtectedRoute>
                <MetricsDashboard />
              </ProtectedRoute>
            } />
            <Route path="/metrics-search" element={
              <ProtectedRoute>
                <MetricsSearch />
              </ProtectedRoute>
            } />
            <Route path="/institution-programs" element={
              <ProtectedRoute>
                <GMEInstitutionSearch />
              </ProtectedRoute>
            } />
            
            {/* DMP Routes - Admin Only */}
            <Route path="/dmp" element={
              <AdminRoute>
                <DMPDashboard />
              </AdminRoute>
            } />
            <Route path="/dmp/template-upload" element={
              <AdminRoute>
                <TemplateUpload />
              </AdminRoute>
            } />
            <Route path="/dmp/ai-mapping" element={
              <AdminRoute>
                <AIMapping />
              </AdminRoute>
            } />
            <Route path="/dmp/url-extraction" element={
              <AdminRoute>
                <URLExtraction />
              </AdminRoute>
            } />
            <Route path="/dmp/jobs" element={
              <AdminRoute>
                <JobConsole />
              </AdminRoute>
            } />
            <Route path="/dmp/duplicates" element={
              <AdminRoute>
                <DuplicateReview />
              </AdminRoute>
            } />
            <Route path="/dmp/export" element={
              <AdminRoute>
                <DataExport />
              </AdminRoute>
            } />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
              </ErrorBoundary>
            </div>
          </BookmarkProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;