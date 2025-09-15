import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { Breadcrumb, BreadcrumbItem } from './Breadcrumb';

interface LayoutProps {
  children: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  showBreadcrumbs?: boolean;
}

export function Layout({ children, breadcrumbs = [], showBreadcrumbs = true }: LayoutProps) {
  const { isAuthenticated } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

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
        <div className="p-6 min-h-screen bg-gray-50">
          {showBreadcrumbs && breadcrumbs.length > 0 && (
            <Breadcrumb items={breadcrumbs} />
          )}
          {children}
        </div>
      </main>
    </div>
  );
}