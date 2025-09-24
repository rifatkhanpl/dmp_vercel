import React, { useState } from 'react';
import { Layout } from '../Layout/Layout';
import { DuplicateCandidate } from '../../types/dmp';
import { 
  Users,
  AlertTriangle,
  CheckCircle,
  X,
  ArrowRight,
  Eye,
  Merge,
  UserPlus,
  Ban
} from 'lucide-react';

export function DuplicateReview() {
  const [duplicates, setDuplicates] = useState<DuplicateCandidate[]>([
    {
      existing: {
        id: '1',
        npi: '1234567890',
        firstName: 'Sarah',
        lastName: 'Johnson',
        credentials: 'MD',
        primarySpecialty: 'Internal Medicine',
        email: 'sarah.johnson@hospital.edu',
        phone: '555-123-4567',
        practiceAddress1: '123 Medical Center Dr',
        practiceCity: 'Los Angeles',
        practiceState: 'CA',
        practiceZip: '90210',
        mailingAddress1: '123 Medical Center Dr',
        mailingCity: 'Los Angeles',
        mailingState: 'CA',
        mailingZip: '90210',
        licenseState: 'CA',
        licenseNumber: 'A12345',
        sourceType: 'Template',
        status: 'approved',
        enteredAt: '2024-01-10T10:00:00Z'
      },
      incoming: {
        npi: '1234567890',
        firstName: 'Sarah',
        lastName: 'Johnson',
        credentials: 'MD',
        primarySpecialty: 'Internal Medicine',
        email: 'sarah.johnson@ucla.edu',
        phone: '555-123-4567',
        practiceAddress1: '456 University Ave',
        practiceCity: 'Los Angeles',
        practiceState: 'CA',
        practiceZip: '90024',
        mailingAddress1: '456 University Ave',
        mailingCity: 'Los Angeles',
        mailingState: 'CA',
        mailingZip: '90024',
        licenseState: 'CA',
        licenseNumber: 'A12345',
        sourceType: 'URL',
        sourceUrl: 'https://medicine.ucla.edu/residents',
        status: 'pending',
        enteredAt: '2024-01-15T14:30:00Z'
      },
      matchType: 'npi',
      confidence: 1.0,
      suggestedAction: 'merge'
    },
    {
      existing: {
        id: '2',
        npi: '2345678901',
        firstName: 'Michael',
        lastName: 'Chen',
        credentials: 'DO',
        primarySpecialty: 'Emergency Medicine',
        email: 'michael.chen@hospital.com',
        practiceAddress1: '789 Emergency Way',
        practiceCity: 'San Francisco',
        practiceState: 'CA',
        practiceZip: '94102',
        mailingAddress1: '789 Emergency Way',
        mailingCity: 'San Francisco',
        mailingState: 'CA',
        mailingZip: '94102',
        licenseState: 'CA',
        licenseNumber: 'B67890',
        sourceType: 'Template',
        status: 'approved',
        enteredAt: '2024-01-08T15:20:00Z'
      },
      incoming: {
        npi: '2345678902',
        firstName: 'Mike',
        lastName: 'Chen',
        credentials: 'DO',
        primarySpecialty: 'Emergency Medicine',
        dateOfBirth: '1990-05-15',
        email: 'mike.chen@hospital.edu',
        practiceAddress1: '789 Emergency Way',
        practiceCity: 'San Francisco',
        practiceState: 'CA',
        practiceZip: '94102',
        mailingAddress1: '789 Emergency Way',
        mailingCity: 'San Francisco',
        mailingState: 'CA',
        mailingZip: '94102',
        licenseState: 'CA',
        licenseNumber: 'B67890',
        sourceType: 'AI-Map',
        status: 'pending',
        enteredAt: '2024-01-15T11:45:00Z'
      },
      matchType: 'fuzzy',
      confidence: 0.85,
      suggestedAction: 'create-new'
    }
  ]);

  const [selectedAction, setSelectedAction] = useState<Record<string, string>>({});

  const handleDuplicateAction = (index: number, action: string) => {
    const duplicate = duplicates[index];
    
    switch (action) {
      case 'merge':
        console.log('Merging records:', duplicate);
        alert('Records merged successfully');
        break;
      case 'skip':
        console.log('Skipping duplicate:', duplicate);
        alert('Duplicate skipped');
        break;
      case 'create-new':
        console.log('Creating new record:', duplicate);
        alert('New record created');
        break;
    }
    
    // Remove from duplicates list
    setDuplicates(prev => prev.filter((_, i) => i !== index));
  };

  const getMatchTypeColor = (matchType: string) => {
    switch (matchType) {
      case 'npi':
        return 'bg-red-100 text-red-800';
      case 'name-dob':
        return 'bg-orange-100 text-orange-800';
      case 'fuzzy':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600 bg-green-50';
    if (confidence >= 0.7) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'merge':
        return 'bg-blue-600 hover:bg-blue-700 text-white';
      case 'skip':
        return 'bg-gray-600 hover:bg-gray-700 text-white';
      case 'create-new':
        return 'bg-green-600 hover:bg-green-700 text-white';
      default:
        return 'bg-gray-300 text-gray-700';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-3">
            <Users className="h-8 w-8 text-orange-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Duplicate Record Review</h1>
              <p className="text-gray-600 mt-1">
                Review and resolve potential duplicate records before final import
              </p>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{duplicates.length}</div>
              <div className="text-sm text-gray-600">Potential Duplicates</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {duplicates.filter(d => d.matchType === 'npi').length}
              </div>
              <div className="text-sm text-gray-600">Exact NPI Matches</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {duplicates.filter(d => d.matchType === 'fuzzy').length}
              </div>
              <div className="text-sm text-gray-600">Fuzzy Matches</div>
            </div>
          </div>
        </div>

        {/* Duplicate Records */}
        {duplicates.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Duplicates Found</h3>
            <p className="text-gray-600">All records are unique and ready for import.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {duplicates.map((duplicate, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="h-5 w-5 text-orange-500" />
                      <h3 className="text-lg font-medium text-gray-900">
                        Potential Duplicate #{index + 1}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getMatchTypeColor(duplicate.matchType)}`}>
                        {duplicate.matchType.toUpperCase()} Match
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getConfidenceColor(duplicate.confidence)}`}>
                        {Math.round(duplicate.confidence * 100)}% confidence
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Existing Record */}
                    <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                      <h4 className="font-medium text-blue-900 mb-3 flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Existing Record (In Database)
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div><strong>Name:</strong> {duplicate.existing.firstName} {duplicate.existing.lastName}, {duplicate.existing.credentials}</div>
                        <div><strong>NPI:</strong> {duplicate.existing.npi}</div>
                        <div><strong>Specialty:</strong> {duplicate.existing.primarySpecialty}</div>
                        <div><strong>Email:</strong> {duplicate.existing.email}</div>
                        <div><strong>Phone:</strong> {duplicate.existing.phone}</div>
                        <div><strong>Address:</strong> {duplicate.existing.practiceAddress1}, {duplicate.existing.practiceCity}, {duplicate.existing.practiceState}</div>
                        <div><strong>Source:</strong> {duplicate.existing.sourceType}</div>
                        <div><strong>Entered:</strong> {new Date(duplicate.existing.enteredAt!).toLocaleString()}</div>
                      </div>
                    </div>

                    {/* Incoming Record */}
                    <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                      <h4 className="font-medium text-orange-900 mb-3 flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Incoming Record (New Import)
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div><strong>Name:</strong> {duplicate.incoming.firstName} {duplicate.incoming.lastName}, {duplicate.incoming.credentials}</div>
                        <div><strong>NPI:</strong> {duplicate.incoming.npi}</div>
                        <div><strong>Specialty:</strong> {duplicate.incoming.primarySpecialty}</div>
                        <div><strong>Email:</strong> {duplicate.incoming.email}</div>
                        <div><strong>Phone:</strong> {duplicate.incoming.phone}</div>
                        <div><strong>Address:</strong> {duplicate.incoming.practiceAddress1}, {duplicate.incoming.practiceCity}, {duplicate.incoming.practiceState}</div>
                        <div><strong>Source:</strong> {duplicate.incoming.sourceType}</div>
                        {duplicate.incoming.sourceUrl && (
                          <div><strong>Source URL:</strong> <a href={duplicate.incoming.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{duplicate.incoming.sourceUrl}</a></div>
                        )}
                        <div><strong>Imported:</strong> {new Date(duplicate.incoming.enteredAt!).toLocaleString()}</div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 flex justify-center space-x-4">
                    <button
                      onClick={() => handleDuplicateAction(index, 'merge')}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      <Merge className="h-4 w-4" />
                      <span>Merge Records</span>
                    </button>
                    
                    <button
                      onClick={() => handleDuplicateAction(index, 'create-new')}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      <UserPlus className="h-4 w-4" />
                      <span>Create New Record</span>
                    </button>
                    
                    <button
                      onClick={() => handleDuplicateAction(index, 'skip')}
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                    >
                      <Ban className="h-4 w-4" />
                      <span>Skip Import</span>
                    </button>
                  </div>

                  {/* Suggested Action */}
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong>AI Suggestion:</strong> {duplicate.suggestedAction.replace('-', ' ').toUpperCase()} 
                      (based on {duplicate.matchType} match with {Math.round(duplicate.confidence * 100)}% confidence)
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Help Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Duplicate Resolution Guide</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2 flex items-center">
                <Merge className="h-4 w-4 mr-2 text-blue-600" />
                Merge Records
              </h3>
              <p className="text-sm text-gray-600">
                Combine information from both records, keeping the most recent and complete data. 
                Preserves provenance from both sources.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2 flex items-center">
                <UserPlus className="h-4 w-4 mr-2 text-green-600" />
                Create New Record
              </h3>
              <p className="text-sm text-gray-600">
                Import as a separate record. Use when records represent different people 
                or different practice locations for the same person.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2 flex items-center">
                <Ban className="h-4 w-4 mr-2 text-gray-600" />
                Skip Import
              </h3>
              <p className="text-sm text-gray-600">
                Don't import the incoming record. Use when the existing record 
                is more accurate or complete.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}