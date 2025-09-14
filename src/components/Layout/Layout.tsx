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
      
      <div className="flex min-h-screen pt-16">
        {isAuthenticated && (
          <Sidebar 
            isOpen={isSidebarOpen}
            onClose={closeSidebar}
          />
        )}
        
        <main className={`flex-1 flex flex-col ${isAuthenticated ? 'lg:ml-64' : ''}`}>
          <div className="flex-1 p-6">
            {showBreadcrumbs && breadcrumbs.length > 0 && (
              <Breadcrumb items={breadcrumbs} />
            )}
            {children}
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}