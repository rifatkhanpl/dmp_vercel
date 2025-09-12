import React from 'react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-blue-400 mb-2">PracticeLink®</h3>
            <p className="text-gray-400">Working to make healthcare better.</p>
          </div>
          
          <div className="border-t border-gray-800 pt-4">
            <p className="text-sm text-gray-400">
              <a 
                href="https://www.practicelink.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-gray-300 transition-colors"
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