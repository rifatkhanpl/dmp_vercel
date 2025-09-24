import React, { useState } from 'react';
import { Layout } from '../Layout/Layout';
import { ErrorBoundary } from '../ErrorBoundary';
import { SecurityUtils } from '../../utils/security';
import { errorService } from '../../services/errorService';
import { LoadingOverlay } from '../ui/LoadingSpinner';
import { 
  Brain,
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Eye,
  Save,
  RefreshCw,
  ArrowRight,
  Target
} from 'lucide-react';

interface FieldMapping {
  sourceHeader: string;
  targetField: string;
  confidence: number;
  sampleValue: string;
}

interface MappingProfile {
  id: string;
  name: string;
  mappings: Record<string, string>;
  confidence: number;
  lastUsed: string;
}

export function AIMapping() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [mappings, setMappings] = useState<FieldMapping[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<string[][]>([]);
  const [fileValidationError, setFileValidationError] = useState<string | null>(null);

  // Mock saved profiles
  const savedProfiles: MappingProfile[] = [
    {
      id: '1',
      name: 'Hospital Residency Format',
      mappings: {
        'Full Name': 'firstName',
        'Specialty': 'primarySpecialty',
        'Year': 'pgyYear',
        'Email Address': 'email'
      },
      confidence: 0.92,
      lastUsed: '2024-01-10'
    },
    {
      id: '2',
      name: 'Fellowship Directory Format',
      mappings: {
        'Resident Name': 'firstName',
        'Program': 'programName',
        'Level': 'pgyYear',
        'Contact': 'email'
      },
      confidence: 0.88,
      lastUsed: '2024-01-08'
    }
  ];

  const targetFields = [
    { key: 'firstName', label: 'First Name', required: true },
    { key: 'lastName', label: 'Last Name', required: true },
    { key: 'credentials', label: 'Credentials', required: true },
    { key: 'npi', label: 'NPI', required: true },
    { key: 'email', label: 'Email', required: false },
    { key: 'phone', label: 'Phone', required: false },
    { key: 'primarySpecialty', label: 'Primary Specialty', required: true },
    { key: 'programName', label: 'Program Name', required: false },
    { key: 'institution', label: 'Institution', required: false },
    { key: 'pgyYear', label: 'PGY Year', required: false },
    { key: 'licenseState', label: 'License State', required: true },
    { key: 'licenseNumber', label: 'License Number', required: true }
  ];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileValidationError(null);
    
    // Enhanced file validation
    const validation = SecurityUtils.validateFileType(file);
    if (!validation.isValid) {
      setFileValidationError(validation.error || 'File validation failed');
      errorService.showError(validation.error || 'File validation failed');
      return;
    }

    setUploadedFile(file);
    setMappings([]);
    
    // Generate preview with error handling
    try {
      const text = await errorService.withTimeout(file.text(), 10000);
      const lines = text.split('\n').slice(0, 6);
      const preview = lines.map(line => 
        line.split(',').map(cell => SecurityUtils.sanitizeText(cell.trim().replace(/"/g, '')))
      );
      setPreviewData(preview);
    } catch (error) {
      errorService.logError(error as Error, { context: 'AI mapping preview generation', fileName: file.name });
      errorService.showWarning('Could not generate file preview');
    }
  };

  const analyzeHeaders = async () => {
    if (!uploadedFile) {
      errorService.showError('Please upload a file first');
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      // Simulate AI analysis with timeout
      await errorService.withTimeout(
        new Promise(resolve => setTimeout(resolve, 2000)),
        30000
      );
      
      // Mock AI-generated mappings
      const detectedMappings: FieldMapping[] = [
        {
          sourceHeader: 'Full Name',
          targetField: 'firstName',
          confidence: 0.95,
          sampleValue: 'Dr. John Smith, MD'
        },
        {
          sourceHeader: 'Specialty',
          targetField: 'primarySpecialty',
          confidence: 0.98,
          sampleValue: 'Internal Medicine'
        },
        {
          sourceHeader: 'Year',
          targetField: 'pgyYear',
          confidence: 0.85,
          sampleValue: 'PGY-2'
        },
        {
          sourceHeader: 'Email',
          targetField: 'email',
          confidence: 0.99,
          sampleValue: 'john.smith@hospital.edu'
        },
        {
          sourceHeader: 'Phone',
          targetField: 'phone',
          confidence: 0.92,
          sampleValue: '(555) 123-4567'
        }
      ];
      
      setMappings(detectedMappings);
      errorService.showSuccess('AI analysis completed successfully');
    } catch (error) {
      const errorMessage = errorService.handleApiError(error, 'AI header analysis');
      errorService.showError(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const updateMapping = (sourceHeader: string, targetField: string) => {
    setMappings(prev => prev.map(mapping => 
      mapping.sourceHeader === sourceHeader 
        ? { ...mapping, targetField, confidence: targetField ? 0.9 : 0 }
        : mapping
    ));
  };

  const applyProfile = (profileId: string) => {
    const profile = savedProfiles.find(p => p.id === profileId);
    if (!profile) return;

    setMappings(prev => prev.map(mapping => ({
      ...mapping,
      targetField: profile.mappings[mapping.sourceHeader] || '',
      confidence: profile.mappings[mapping.sourceHeader] ? profile.confidence : 0
    })));
  };

  const saveProfile = () => {
    const profileName = prompt('Enter a name for this mapping profile:');
    if (!profileName || !profileName.trim()) {
      errorService.showError('Profile name is required');
      return;
    }
    
    const sanitizedName = SecurityUtils.sanitizeText(profileName);
    if (sanitizedName.length > 100) {
      errorService.showError('Profile name must be less than 100 characters');
      return;
    }

    const newProfile: MappingProfile = {
      id: Date.now().toString(),
      name: sanitizedName,
      mappings: mappings.reduce((acc, mapping) => {
        if (mapping.targetField) {
          acc[mapping.sourceHeader] = mapping.targetField;
        }
        return acc;
      }, {} as Record<string, string>),
      confidence: mappings.reduce((sum, m) => sum + m.confidence, 0) / mappings.length,
      lastUsed: new Date().toISOString()
    };

    // TODO: Save to backend
    try {
      // TODO: Implement actual save logic
      console.log('Saving profile:', newProfile);
      errorService.showSuccess('Mapping profile saved successfully!');
    } catch (error) {
      errorService.logError(error as Error, { context: 'Profile save', profileName: sanitizedName });
      errorService.showError('Failed to save mapping profile');
    }
  };

  const processWithMappings = async () => {
    if (!uploadedFile) {
      errorService.showError('Please upload a file first');
      return;
    }
    
    if (mappings.length === 0) {
      errorService.showError('Please analyze headers first');
      return;
    }
    
    const mappingObject = mappings.reduce((acc, mapping) => {
      if (mapping.targetField) {
        acc[mapping.sourceHeader] = mapping.targetField;
      }
      return acc;
    }, {} as Record<string, string>);

    try {
      // TODO: Process file with mappings
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Processing with mappings:', mappingObject);
      errorService.showSuccess('File processed successfully with AI mappings!');
    } catch (error) {
      const errorMessage = errorService.handleApiError(error, 'AI mapping processing');
      errorService.showError(errorMessage);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600 bg-green-50';
    if (confidence >= 0.7) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <ErrorBoundary>
      <LoadingOverlay isLoading={isAnalyzing} text="Analyzing file headers with AI...">
        <Layout>
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-3">
                <Brain className="h-8 w-8 text-purple-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">AI-Assisted Field Mapping</h1>
                  <p className="text-gray-600 mt-1">
                    Upload files with any format - AI will intelligently map fields to our standard schema
                  </p>
                </div>
              </div>
            </div>

            {/* File Validation Error */}
            {fileValidationError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-red-900">File Validation Error</h3>
                    <p className="text-sm text-red-700 mt-1">{fileValidationError}</p>
                  </div>
                </div>
              </div>
            )}

            {/* File Upload */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload File for Analysis</h2>
              
              {!uploadedFile ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    Upload any CSV or Excel file
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    AI will analyze headers and suggest field mappings
                  </p>
                  <input
                    type="file"
                    accept=".csv,.xls,.xlsx"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="ai-file-upload"
                    aria-label="Select file for AI mapping analysis"
                  />
                  <label
                    htmlFor="ai-file-upload"
                    className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                  >
                    Choose File
                  </label>
                </div>
              ) : (
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-8 w-8 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">{uploadedFile.name}</p>
                        <p className="text-sm text-gray-500">
                          {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setShowPreview(!showPreview)}
                        className="flex items-center space-x-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                      >
                        <Eye className="h-4 w-4" />
                        <span>Preview</span>
                      </button>
                      <button
                        onClick={analyzeHeaders}
                        disabled={isAnalyzing}
                        className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
                        aria-label="Analyze file headers with AI"
                      >
                        {isAnalyzing ? (
                          <>
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            <span>Analyzing...</span>
                          </>
                        ) : (
                          <>
                            <Brain className="h-4 w-4" />
                            <span>Analyze with AI</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* File Preview */}
                  {showPreview && previewData.length > 0 && (
                    <div className="mt-4 border-t border-gray-200 pt-4">
                      <h3 className="font-medium text-gray-900 mb-3">File Preview</h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-xs">
                          <thead>
                            <tr className="bg-gray-50">
                              {previewData[0]?.map((header, index) => (
                                <th key={index} className="px-2 py-1 text-left font-medium text-gray-700 border-b">
                                  {header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {previewData.slice(1, 4).map((row, rowIndex) => (
                              <tr key={rowIndex} className="border-b">
                                {row.map((cell, cellIndex) => (
                                  <td key={cellIndex} className="px-2 py-1 text-gray-600">
                                    {cell.length > 15 ? `${cell.slice(0, 15)}...` : cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Saved Profiles */}
            {savedProfiles.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Saved Mapping Profiles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedProfiles.map((profile) => (
                    <div key={profile.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">{profile.name}</h3>
                          <p className="text-sm text-gray-500">
                            {Object.keys(profile.mappings).length} field mappings
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getConfidenceColor(profile.confidence)}`}>
                              {Math.round(profile.confidence * 100)}% confidence
                            </span>
                            <span className="text-xs text-gray-500">
                              Last used: {new Date(profile.lastUsed).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => applyProfile(profile.id)}
                          disabled={!uploadedFile}
                          className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Field Mappings */}
            {mappings.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Field Mappings</h2>
                  <div className="flex space-x-3">
                    <button
                      onClick={saveProfile}
                      className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                    >
                      <Save className="h-4 w-4" />
                      <span>Save Profile</span>
                    </button>
                    <button
                      onClick={processWithMappings}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Process Import</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {mappings.map((mapping, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Source Header
                          </label>
                          <p className="text-sm text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded">
                            {mapping.sourceHeader}
                          </p>
                        </div>
                        
                        <div className="flex justify-center">
                          <ArrowRight className="h-5 w-5 text-gray-400" />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Target Field
                          </label>
                          <select
                            value={mapping.targetField}
                            onChange={(e) => updateMapping(mapping.sourceHeader, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            <option value="">Select target field...</option>
                            {targetFields.map(field => (
                              <option key={field.key} value={field.key}>
                                {field.label} {field.required && '*'}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Confidence & Sample
                          </label>
                          <div className="space-y-1">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getConfidenceColor(mapping.confidence)}`}>
                              {Math.round(mapping.confidence * 100)}% confidence
                            </span>
                            <p className="text-xs text-gray-500 truncate" title={mapping.sampleValue}>
                              Sample: {mapping.sampleValue}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Validation Summary */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-3">Mapping Validation</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Required Fields Mapped</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {mappings.filter(m => m.targetField && targetFields.find(f => f.key === m.targetField)?.required).length} / {targetFields.filter(f => f.required).length}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Average Confidence</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {mappings.length > 0 ? Math.round((mappings.reduce((sum, m) => sum + m.confidence, 0) / mappings.length) * 100) : 0}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Ready to Import</p>
                      <p className={`text-lg font-semibold ${
                        mappings.filter(m => m.targetField && targetFields.find(f => f.key === m.targetField)?.required).length === targetFields.filter(f => f.required).length
                          ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {mappings.filter(m => m.targetField && targetFields.find(f => f.key === m.targetField)?.required).length === targetFields.filter(f => f.required).length ? 'Yes' : 'No'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Help Section */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h3 className="font-medium text-purple-900 mb-3">How AI-Assisted Mapping Works</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-purple-800 mb-2">Automatic Detection</h4>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>• AI analyzes your file headers and sample data</li>
                    <li>• Suggests mappings to standard DMP fields</li>
                    <li>• Provides confidence scores for each mapping</li>
                    <li>• Handles variations in naming conventions</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-purple-800 mb-2">Manual Review & Profiles</h4>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>• Review and adjust AI suggestions</li>
                    <li>• Save mapping profiles for reuse</li>
                    <li>• Apply saved profiles to similar files</li>
                    <li>• Validate before final import</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Layout>
      </LoadingOverlay>
    </ErrorBoundary>
  );
}