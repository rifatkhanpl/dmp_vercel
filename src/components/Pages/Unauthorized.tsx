import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldOff, Home, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function Unauthorized() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <ShieldOff className="h-16 w-16 text-red-500 mx-auto" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h1>

          <p className="text-gray-600 mb-6">
            You don't have permission to access this page.
          </p>

          {user && (
            <div className="mb-6 p-3 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-600">
                Logged in as: <span className="font-medium">{user.email}</span>
              </p>
              <p className="text-sm text-gray-600">
                Role: <span className="font-medium">{user.role.replace('-', ' ')}</span>
              </p>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={() => navigate(-1)}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition duration-200 flex items-center justify-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </button>

            <Link
              to="/dashboard"
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 flex items-center justify-center"
            >
              <Home className="h-4 w-4 mr-2" />
              Go to Dashboard
            </Link>
          </div>

          <p className="mt-6 text-sm text-gray-500">
            If you believe this is an error, please contact your administrator.
          </p>
        </div>
      </div>
    </div>
  );
}

export { Unauthorized }