import React, { useState } from 'react';
import { Layout } from '../Layout/Layout';
import { DMPService, DMPValidator } from '../../services/dmpService';
import { ImportJob } from '../../types/dmp';
import { 
  Upload,
  FileText,
  Download,
  AlertCircle,
  CheckCircle,
  X,
  Eye,
  RefreshCw,
  Save
} from 'lucide-react';

export function TemplateUpload() {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importJob, setImportJob] = useState<ImportJob | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<string[][]>([]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
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

  const handleFile = async (file: File) => {
    const allowedTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(csv|xls|xlsx)$/i)) {
      alert('Please upload a CSV or Excel file (.csv, .xls, .xlsx)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      alert('File size must be less than 10MB');
      return;
    }

    setUploadedFile(file);
    setImportJob(null);
    
    // Generate preview
    try {
      const text = await file.text();
      const lines = text.split('\n').slice(0, 6); // First 5 rows + header
      const preview = lines.map(line => line.split(',').map(cell => cell.trim().replace(/"/g, '')));
      setPreviewData(preview);
    } catch (error) {
      console.error('Error generating preview:', error);
    }
  };

  const processFile = async () => {
    if (!uploadedFile) return;
    
    setIsProcessing(true);
    try {
      const job = await DMPService.processTemplateUpload(uploadedFile);
      setImportJob(job);
    } catch (error) {
      console.error('Error processing file:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadTemplate = () => {
    const template = DMPService.generateTemplate();
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'DMP_ResidentFellow_Template_v1.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const downloadErrorReport = () => {
    if (!importJob?.errors?.length) return;
    
    const headers = ['Row', 'Field', 'Severity', 'Message', 'Value'];
    const rows = importJob.errors.map(error => [
      error.row.toString(),
      error.field,
      error.severity,
      error.message,
      error.value || ''
    ]);
    
    const csv = [headers, ...rows].map(row => 
      row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')
    ).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `import_errors_${importJob.id}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const removeFile = () => {
    setUploadedFile(null);
    setImportJob(null);
    setPreviewData([]);
    setShowPreview(false);
  };

  return (
    <Layout breadcrumbs={[
      { label: 'DMP Dashboard', href: '/dmp' },
      { label: 'Template Upload' }
    ]}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Template Upload</h1>
          <p className="text-gray-600">
            Upload CSV or Excel files using our standardized template for validated data import
          </p>
        </div>

        {/* Template Download */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-blue-900">Download Official Template</h3>
              <p className="text-sm text-blue-700 mt-1">
                Use our standardized CSV template to ensure your data meets all validation requirements.
                Includes all required fields, proper formatting, and sample data.
              </p>
              <button
                onClick={downloadTemplate}
                className="mt-3 inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Download className="h-4 w-4" />
                <span>Download DMP_ResidentFellow_Template_v1.csv</span>
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
                dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                Drop your template file here, or click to browse
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
                className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
              >
                Choose File
              </label>
            </div>
          ) : (
            <div className="space-y-4">
              {/* File Info */}
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
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Preview */}
              {previewData.length > 0 && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-900">File Preview</h3>
                    <button
                      onClick={() => setShowPreview(!showPreview)}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      {showPreview ? 'Hide' : 'Show'} Preview
                    </button>
                  </div>
                  
                  {showPreview && (
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
                                  {cell.length > 20 ? `${cell.slice(0, 20)}...` : cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {previewData.length > 4 && (
                        <p className="text-xs text-gray-500 mt-2">
                          Showing first 3 rows of {previewData.length - 1} total records
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              {!importJob && (
                <div className="flex space-x-3">
                  <button
                    onClick={processFile}
                    disabled={isProcessing}
                    className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4" />
                        <span>Process & Validate</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="flex items-center space-x-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    <Eye className="h-4 w-4" />
                    <span>Preview Data</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Import Results */}
        {importJob && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Import Results</h2>
            
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-blue-900">Total Records</span>
                </div>
                <p className="text-2xl font-bold text-blue-900 mt-1">{importJob.totalRecords}</p>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-900">Successful</span>
                </div>
                <p className="text-2xl font-bold text-green-900 mt-1">{importJob.successCount}</p>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <span className="font-medium text-red-900">Errors</span>
                </div>
                <p className="text-2xl font-bold text-red-900 mt-1">{importJob.errorCount}</p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  <span className="font-medium text-yellow-900">Warnings</span>
                </div>
                <p className="text-2xl font-bold text-yellow-900 mt-1">{importJob.warningCount}</p>
              </div>
            </div>

            {/* Status Message */}
            <div className={`p-4 rounded-md mb-6 ${
              importJob.status === 'completed' ? 'bg-green-50 text-green-700' :
              importJob.status === 'partial' ? 'bg-yellow-50 text-yellow-700' :
              'bg-red-50 text-red-700'
            }`}>
              <div className="flex items-center space-x-2">
                {importJob.status === 'completed' && <CheckCircle className="h-5 w-5" />}
                {importJob.status === 'partial' && <AlertTriangle className="h-5 w-5" />}
                {importJob.status === 'failed' && <AlertCircle className="h-5 w-5" />}
                <span className="font-medium">
                  {importJob.status === 'completed' && 'Import completed successfully!'}
                  {importJob.status === 'partial' && 'Import completed with some errors'}
                  {importJob.status === 'failed' && 'Import failed'}
                </span>
              </div>
            </div>

            {/* Error Details */}
            {importJob.errors.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900">Validation Issues</h3>
                  <button
                    onClick={downloadErrorReport}
                    className="flex items-center space-x-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download Error Report</span>
                  </button>
                </div>
                
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {importJob.errors.slice(0, 20).map((error, index) => (
                    <div
                      key={index}
                      className={`flex items-start space-x-3 p-3 rounded-md ${
                        error.severity === 'error'
                          ? 'bg-red-50 border border-red-200'
                          : 'bg-yellow-50 border border-yellow-200'
                      }`}
                    >
                      <AlertCircle className={`h-4 w-4 mt-0.5 ${
                        error.severity === 'error' ? 'text-red-600' : 'text-yellow-600'
                      }`} />
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${
                          error.severity === 'error' ? 'text-red-900' : 'text-yellow-900'
                        }`}>
                          Row {error.row}, Field "{error.field}": {error.message}
                        </p>
                        {error.value && (
                          <p className="text-xs text-gray-600 mt-1">Value: "{error.value}"</p>
                        )}
                      </div>
                    </div>
                  ))}
                  {importJob.errors.length > 20 && (
                    <p className="text-sm text-gray-500 text-center py-2">
                      Showing first 20 of {importJob.errors.length} issues. Download full report for complete details.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex space-x-3 mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setUploadedFile(null);
                  setImportJob(null);
                  setPreviewData([]);
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Upload className="h-4 w-4" />
                <span>Import Another File</span>
              </button>
              
              {importJob.successCount > 0 && (
                <a
                  href="/search"
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  <Eye className="h-4 w-4" />
                  <span>View Imported Records</span>
                </a>
              )}
            </div>
          </div>
        )}

        {/* Validation Rules */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Validation Rules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Required Fields</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• NPI (10 digits)</li>
                <li>• First Name, Last Name</li>
                <li>• Credentials (MD, DO, etc.)</li>
                <li>• Practice Address (complete)</li>
                <li>• Mailing Address (complete)</li>
                <li>• Primary Specialty</li>
                <li>• License State & Number</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Format Requirements</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Phone: XXX-XXX-XXXX format</li>
                <li>• Dates: YYYY-MM-DD format</li>
                <li>• NPI: Exactly 10 numeric digits</li>
                <li>• Email: Valid email format</li>
                <li>• State: 2-letter abbreviation</li>
                <li>• Zip: 5 or 9 digit format</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}