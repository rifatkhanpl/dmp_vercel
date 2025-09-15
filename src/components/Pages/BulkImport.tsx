import React, { useState } from 'react';
import { Layout } from '../Layout/Layout';
import { 
  Upload, 
  FileText, 
  Download, 
  AlertCircle, 
  CheckCircle,
  X,
  Eye
} from 'lucide-react';

export function BulkImport() {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<{
    success: number;
    errors: number;
    warnings: number;
    details: Array<{ row: number; message: string; type: 'error' | 'warning' }>;
  } | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    const allowedTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a CSV or Excel file');
      return;
    }
    
    setUploadedFile(file);
    setResults(null);
  };

  const processFile = async () => {
    if (!uploadedFile) return;
    
    setIsProcessing(true);
    
    // Simulate file processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock results
    setResults({
      success: 142,
      errors: 3,
      warnings: 8,
      details: [
        { row: 15, message: 'Invalid NPI number format', type: 'error' },
        { row: 23, message: 'Missing email address', type: 'error' },
        { row: 47, message: 'Invalid phone number format', type: 'error' },
        { row: 12, message: 'Specialty not recognized, using "General Practice"', type: 'warning' },
        { row: 34, message: 'State abbreviation corrected', type: 'warning' },
        { row: 56, message: 'Duplicate NPI found, skipping', type: 'warning' },
        { row: 78, message: 'Missing middle name', type: 'warning' },
        { row: 89, message: 'License expiration date in past', type: 'warning' }
      ]
    });
    
    setIsProcessing(false);
  };

  const removeFile = () => {
    setUploadedFile(null);
    setResults(null);
  };

  const downloadTemplate = () => {
    // In a real app, this would download an actual template file
    const csvContent = `First Name,Last Name,Credentials,Email,Phone,NPI,Primary Specialty,License State,License Number
John,Doe,MD,john.doe@example.com,555-0123,1234567890,Internal Medicine,CA,12345
Jane,Smith,DO,jane.smith@example.com,555-0124,1234567891,Family Medicine,NY,12346`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hcp_import_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Layout breadcrumbs={[{ label: 'HCP Import' }]}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Bulk Import Healthcare Providers</h1>
          <p className="text-gray-600">
            Upload a CSV or Excel file to import multiple healthcare providers at once.
          </p>
        </div>

        {/* Template Download */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-blue-900">Need a template?</h3>
              <p className="text-sm text-blue-700 mt-1">
                Download our CSV template to ensure your data is formatted correctly.
              </p>
              <button
                onClick={downloadTemplate}
                className="mt-2 inline-flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                <Download className="h-4 w-4" />
                <span>Download Template</span>
              </button>
            </div>
          </div>
        </div>

        {/* File Upload */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload File</h2>
          
          {!uploadedFile ? (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive 
                  ? 'border-blue-400 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                Drop your file here, or click to browse
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Supports CSV, XLS, and XLSX files up to 10MB
              </p>
              <input
                type="file"
                accept=".csv,.xls,.xlsx"
                onChange={handleFileInput}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
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
                <button
                  onClick={removeFile}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              {!results && (
                <div className="mt-4 flex space-x-3">
                  <button
                    onClick={processFile}
                    disabled={isProcessing}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Upload className="h-4 w-4" />
                    <span>{isProcessing ? 'Processing...' : 'Process File'}</span>
                  </button>
                  <button
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    <Eye className="h-4 w-4" />
                    <span>Preview</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Results */}
        {results && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Import Results</h2>
            
            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-900">Successful</span>
                </div>
                <p className="text-2xl font-bold text-green-900 mt-1">{results.success}</p>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <span className="font-medium text-red-900">Errors</span>
                </div>
                <p className="text-2xl font-bold text-red-900 mt-1">{results.errors}</p>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  <span className="font-medium text-yellow-900">Warnings</span>
                </div>
                <p className="text-2xl font-bold text-yellow-900 mt-1">{results.warnings}</p>
              </div>
            </div>

            {/* Details */}
            {results.details.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Issues Found</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {results.details.map((detail, index) => (
                    <div
                      key={index}
                      className={`flex items-start space-x-3 p-3 rounded-md ${
                        detail.type === 'error' 
                          ? 'bg-red-50 border border-red-200' 
                          : 'bg-yellow-50 border border-yellow-200'
                      }`}
                    >
                      <AlertCircle className={`h-4 w-4 mt-0.5 ${
                        detail.type === 'error' ? 'text-red-600' : 'text-yellow-600'
                      }`} />
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${
                          detail.type === 'error' ? 'text-red-900' : 'text-yellow-900'
                        }`}>
                          Row {detail.row}: {detail.message}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 flex space-x-3">
              <button
                onClick={() => setResults(null)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Import Another File
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
                Download Error Report
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}