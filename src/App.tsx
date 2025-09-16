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
import { HCPDetail } from './components/Pages/HCPDetail';
import { UserManagement } from './components/Pages/UserManagement';
import { AddUser } from './components/Pages/AddUser';
import { UserProfile } from './components/Pages/UserProfile';
import { UserSettings } from './components/Pages/UserSettings';
import { GMEProgramSearch } from './components/Pages/GMEProgramSearch';
import { GMEProgramDetail } from './components/Pages/GMEProgramDetail';
import { DMPDashboard } from './components/Pages/DMPDashboard';
import { TemplateUpload } from './components/Pages/TemplateUpload';
import { AIMapping } from './components/Pages/AIMapping';
import { URLExtraction } from './components/Pages/URLExtraction';
import { JobConsole } from './components/Pages/JobConsole';
import { DuplicateReview } from './components/Pages/DuplicateReview';
import { DataExport } from './components/Pages/DataExport';

import { Analytics } from './components/Pages/Analytics';

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
            <Route path="/hcp-detail" element={
              <ProtectedRoute>
                <HCPDetail />
              </ProtectedRoute>
            } />
            <Route path="/user-management" element={
              <ProtectedRoute>
                <UserManagement />
              </ProtectedRoute>
            } />
            <Route path="/add-user" element={
              <ProtectedRoute>
                <AddUser />
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
            <Route path="/analytics" element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            } />
            <Route path="/institution-programs" element={
              <ProtectedRoute>
                <GMEProgramSearch />
              </ProtectedRoute>
            } />
            
            {/* DMP Routes */}
            <Route path="/dmp" element={
              <ProtectedRoute>
                <DMPDashboard />
              </ProtectedRoute>
            } />
            <Route path="/dmp/template-upload" element={
              <ProtectedRoute>
                <TemplateUpload />
              </ProtectedRoute>
            } />
            <Route path="/dmp/ai-mapping" element={
              <ProtectedRoute>
                <AIMapping />
              </ProtectedRoute>
            } />
            <Route path="/dmp/url-extraction" element={
              <ProtectedRoute>
                <URLExtraction />
              </ProtectedRoute>
            } />
            <Route path="/dmp/jobs" element={
              <ProtectedRoute>
                <JobConsole />
              </ProtectedRoute>
            } />
            <Route path="/dmp/duplicates" element={
              <ProtectedRoute>
                <DuplicateReview />
              </ProtectedRoute>
            } />
            <Route path="/dmp/export" element={
              <ProtectedRoute>
                <DataExport />
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