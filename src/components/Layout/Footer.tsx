import React from 'react';

export function Footer() {
  return (
    <footer className="bg-white text-gray-900 py-8 mt-auto border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="border-t border-gray-200 pt-4">
            <p className="text-sm text-gray-400">
              <a 
                href="https://www.practicelink.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                PracticeLink - Physician/APP Career Advancement & Job Search
              </a>
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Private Data Management Portal - Authorized Personnel Only
            </p>
            <p className="text-xs text-gray-500 mt-1">
              © {new Date().getFullYear()} PracticeLink. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}