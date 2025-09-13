import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { Sidebar } from './Sidebar';
import { Breadcrumb } from './Breadcrumb';
import { BreadcrumbItem } from '../../types/navigation';

interface LayoutProps {
  children: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  showSidebar?: boolean;
}

export function Layout({ children, breadcrumbs = [], showSidebar = true }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex min-h-0">
        {showSidebar && <Sidebar />}
        
        <main className={`flex-1 bg-gray-50 ${showSidebar ? 'ml-0' : ''}`}>
          {breadcrumbs.length > 0 && (
            <div className="bg-white border-b border-gray-200 px-6 py-4">
              <Breadcrumb items={breadcrumbs} />
            </div>
          )}
          {children}
        </main>
      </div>
      
      <Footer />
    </div>
  );
}