import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { Breadcrumb, BreadcrumbItem } from './Breadcrumb';

interface LayoutProps {
  children: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  showBreadcrumbs?: boolean;
  autoGenerateBreadcrumbs?: boolean;
}

export function Layout({ 
  children, 
  breadcrumbs = [], 
  showBreadcrumbs = true,
  autoGenerateBreadcrumbs = true 
}: LayoutProps) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Auto-generate breadcrumbs based on current route
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (!autoGenerateBreadcrumbs || breadcrumbs.length > 0) {
      return breadcrumbs;
    }

    const pathname = location.pathname;
    const segments = pathname.split('/').filter(Boolean);
    
    // Route mapping for better breadcrumb labels
    const routeMap: Record<string, { label: string; href?: string }> = {
      'dashboard': { label: 'Dashboard', href: '/dashboard' },
      'hcp-registration': { label: 'HCP Registration', href: '/hcp-registration' },
      'bulk-import': { label: 'Bulk Import', href: '/bulk-import' },
      'search': { label: 'HCP Search', href: '/search' },
      'hcp-detail': { label: 'Provider Details' },
      'user-management': { label: 'User Management', href: '/user-management' },
      'add-user': { label: 'Add User' },
      'user-profile': { label: 'My Profile', href: '/user-profile' },
      'user-settings': { label: 'Settings', href: '/user-settings' },
      'gme-program-search': { label: 'GME Program Search', href: '/gme-program-search' },
      'gme-program-detail': { label: 'Program Details' },
      'gme-institution-search': { label: 'GME Institution Search', href: '/gme-institution-search' },
      'gme-institution-detail': { label: 'Institution Details' },
      'analytics': { label: 'Analytics', href: '/analytics' },
      'metrics-dashboard': { label: 'Production Metrics', href: '/metrics-dashboard' },
      'metrics-search': { label: 'Metrics Search', href: '/metrics-search' },
      'dmp': { label: 'DMP Dashboard', href: '/dmp' },
      'template-upload': { label: 'Template Upload' },
      'ai-mapping': { label: 'AI-Assisted Mapping' },
      'url-extraction': { label: 'URL Extraction' },
      'jobs': { label: 'Job Console' },
      'duplicates': { label: 'Duplicate Review' },
      'export': { label: 'Data Export' },
      'admin': { label: 'Admin Dashboard', href: '/admin' },
      'signin': { label: 'Sign In' },
      'signup': { label: 'Sign Up' },
      'forgot-password': { label: 'Forgot Password' },
      'verify-email': { label: 'Email Verification' },
      'reset-password': { label: 'Reset Password' },
      'unauthorized': { label: 'Unauthorized' }
    };

    const generatedBreadcrumbs: BreadcrumbItem[] = [];
    let currentPath = '';

    // Handle special nested routes
    if (pathname.startsWith('/dmp/')) {
      generatedBreadcrumbs.push({ label: 'DMP Dashboard', href: '/dmp' });
      const dmpSegment = segments[1];
      if (dmpSegment && routeMap[dmpSegment]) {
        generatedBreadcrumbs.push({ label: routeMap[dmpSegment].label });
      }
    } else if (pathname.startsWith('/admin/')) {
      generatedBreadcrumbs.push({ label: 'Admin Dashboard', href: '/admin' });
      const adminSegment = segments[1];
      if (adminSegment && routeMap[adminSegment]) {
        generatedBreadcrumbs.push({ label: routeMap[adminSegment].label });
      }
    } else {
      // Handle regular routes
      for (let i = 0; i < segments.length; i++) {
        const segment = segments[i];
        currentPath += `/${segment}`;
        
        const routeInfo = routeMap[segment];
        if (routeInfo) {
          // For the last segment, don't include href (current page)
          const isLastSegment = i === segments.length - 1;
          generatedBreadcrumbs.push({
            label: routeInfo.label,
            href: isLastSegment ? undefined : (routeInfo.href || currentPath)
          });
        } else {
          // Fallback: capitalize and clean up segment
          const label = segment
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
          
          const isLastSegment = i === segments.length - 1;
          generatedBreadcrumbs.push({
            label,
            href: isLastSegment ? undefined : currentPath
          });
        }
      }
    }

    return generatedBreadcrumbs;
  };

  const finalBreadcrumbs = generateBreadcrumbs();
  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onToggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
      />
      
      {isAuthenticated && (
        <Sidebar 
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
        />
      )}
      
      <main className={`pt-16 ${isAuthenticated ? 'lg:pl-64' : ''}`}>
        <div className="p-6 min-h-[calc(100vh-4rem)]">
          {showBreadcrumbs && finalBreadcrumbs.length > 0 && (
            <Breadcrumb items={finalBreadcrumbs} />
          )}
          {children}
        </div>
      </main>
    </div>
  );
}