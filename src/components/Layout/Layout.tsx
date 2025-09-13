import React, { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { Breadcrumb } from './Breadcrumb';
import { BreadcrumbItem } from '../../types/navigation';

interface LayoutProps {
  children: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  hideSidebar?: boolean;
}

export function Layout({ children, breadcrumbs, hideSidebar = false }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header spans full width across top */}
      <Header />
      
      {/* Main content area with sidebar */}
      <div className="flex flex-1">
        {!hideSidebar && (
          <Sidebar 
            isOpen={sidebarOpen} 
            onClose={() => setSidebarOpen(false)} 
          />
        )}
        
        {/* Main content */}
        <main className={`flex-1 flex flex-col ${!hideSidebar ? 'lg:ml-64' : ''}`}>
          <div className="flex-1 p-6 bg-gray-50">
            {breadcrumbs && (
              <div className="mb-6">
                <Breadcrumb items={breadcrumbs} />
              </div>
            )}
            {children}
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
}