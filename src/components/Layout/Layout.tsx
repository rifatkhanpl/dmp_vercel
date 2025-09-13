import React, { ReactNode } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { Breadcrumb } from './Breadcrumb';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface LayoutProps {
  children: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
}

export function Layout({ children, breadcrumbs }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <div className="flex flex-1 pt-16">
        <Sidebar />
        
        <main className="flex-1 flex flex-col">
          <div className="p-6 flex-1">
            {breadcrumbs && breadcrumbs.length > 0 && (
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