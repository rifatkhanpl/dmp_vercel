import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { Breadcrumb } from './Breadcrumb';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface LayoutProps {
  children: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  showBreadcrumbs?: boolean;
}

export function Layout({ children, breadcrumbs = [], showBreadcrumbs = true }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      {showBreadcrumbs && breadcrumbs.length > 0 && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <Breadcrumb items={breadcrumbs} />
          </div>
        </div>
      )}
      <div className="flex-1 flex">
        {children}
      </div>
      <Footer />
    </div>
  );
}