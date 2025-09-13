import React from 'react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-auto border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Left side - PracticeLink branding */}
          <div className="flex items-center">
            <h3 className="text-xl font-semibold text-blue-400">
              PracticeLink<sup className="text-sm">®</sup>
            </h3>
          </div>
          
          {/* Right side - Copyright and links */}
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <span>© 2025 PracticeLink. All rights reserved.</span>
            <span className="text-gray-600">|</span>
            <a 
              href="#" 
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </a>
            <span className="text-gray-600">|</span>
            <a 
              href="#" 
              className="hover:text-white transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}