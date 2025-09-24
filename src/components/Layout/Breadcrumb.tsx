import React from 'react';
import { ChevronRight, Home, Building } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ComponentType<any>;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  showHomeLink?: boolean;
}

export function Breadcrumb({ items, showHomeLink = true }: BreadcrumbProps) {
  const location = useLocation();
  
  if (!items || items.length === 0) {
    return null;
  }

  // Don't show breadcrumbs on home page or landing page
  if (location.pathname === '/' || location.pathname === '/dashboard') {
    return null;
  }
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
      {showHomeLink && (
        <>
          <a 
            href="/dashboard" 
            className="flex items-center space-x-1 hover:text-gray-900 transition-colors"
          >
            <Home className="h-4 w-4" />
            <span>Dashboard</span>
          </a>
          {items.length > 0 && <ChevronRight className="h-4 w-4 text-gray-400" />}
        </>
      )}
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {(index > 0 || !showHomeLink) && <ChevronRight className="h-4 w-4 text-gray-400" />}
          {item.href && index < items.length - 1 ? (
            <a
              href={item.href}
              className="flex items-center space-x-1 hover:text-gray-900 transition-colors"
            >
              {item.icon && <item.icon className="h-4 w-4" />}
              <span>{item.label}</span>
            </a>
          ) : (
            <span className="flex items-center space-x-1 text-gray-900 font-medium">
              {item.icon && <item.icon className="h-4 w-4" />}
              <span>{item.label}</span>
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}