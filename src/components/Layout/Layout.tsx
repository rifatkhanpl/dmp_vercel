import React from 'react';
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
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex">
        {!hideSidebar && <Sidebar />}
        
        <main className={`flex-1 ${!hideSidebar ? 'ml-64' : ''}`}>
          {breadcrumbs && <Breadcrumb items={breadcrumbs} />}
          {children}
        </main>
      </div>
      
      <Footer />
    </div>
  );
}