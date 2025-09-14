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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header 
        onToggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
      />
      
      <div className="flex flex-1 pt-16">
        {isAuthenticated && (
          <Sidebar 
            isOpen={isSidebarOpen}
            onClose={closeSidebar}
          />
        )}
        
        <main className={`flex-1 flex flex-col min-h-0 ${isAuthenticated ? 'lg:ml-64' : ''}`}>
          <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
            {showBreadcrumbs && breadcrumbs.length > 0 && (
              <Breadcrumb items={breadcrumbs} />
            )}
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}