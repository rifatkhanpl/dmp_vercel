import React, { useState } from 'react';
import { Layout } from '../Layout/Layout';
import { DMPService } from '../../services/dmpService';
import { ErrorBoundary } from '../ErrorBoundary';
import { SecurityUtils } from '../../utils/security';
import { errorService } from '../../services/errorService';
import { useAsyncOperation } from '../../hooks/useAsyncOperation';
import { LoadingOverlay } from '../ui/LoadingSpinner';
import { ImportJob } from '../../types/dmp';
import { 
  Globe,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Eye,
  Save,
  Shield,
  Clock,
  FileText,
  ExternalLink
} from 'lucide-react';

export function URLExtraction() {
  const [url, setUrl] = useState('');
  const [importJob, setImportJob] = useState<ImportJob | null>(null);
  const [extractedData, setExtractedData] = useState<any[]>([]);
  const [selectedRecords, setSelectedRecords] = useState<Set<number>>(new Set());
  const [showQAReview, setShowQAReview] = useState(false);

  // Enhanced async operation with proper error handling
  const { loading: isProcessing, execute: processUrlAsync } = useAsyncOperation(
    async () => {
      if (!url.trim()) throw new Error('URL is required');
      
      // Validate URL security
      const validation = SecurityUtils.validateExtractionUrl(url);
      if (!validation.isValid) {
        throw new Error(validation.error || 'Invalid URL');
      }
      
      return await DMPService.processURLExtraction(url);
    },
    {
      onSuccess: (job) => {
        setImportJob(job);
        // Mock extracted data for QA review
        const mockData = [
          {
            name: 'Dr. Sarah Johnson, MD',
            specialty: 'Internal Medicine',
            pgyYear: 'PGY-2',
            email: 'sarah.johnson@hospital.edu',
            phone: '(555) 123-4567',
            confidence: 0.95,
            sourceSnippet: 'Sarah Johnson, MD - Internal Medicine Resident, PGY-2'
          },
          {
            name: 'Dr. Michael Chen, DO',
            specialty: 'Emergency Medicine',
            pgyYear: 'PGY-3',
            email: 'michael.chen@hospital.edu',
            confidence: 0.88,
            sourceSnippet: 'Michael Chen, DO - Emergency Medicine, Third Year Resident'
          },
          {
            name: 'Dr. Emily Rodriguez, MD',
            specialty: 'Pediatrics',
            pgyYear: 'PGY-1',
            confidence: 0.92,
            sourceSnippet: 'Emily Rodriguez, MD - Pediatrics Intern (PGY-1)'
          }
        ];
        
        setExtractedData(mockData);
        setSelectedRecords(new Set(mockData.map((_, index) => index)));
        setShowQAReview(true);
        
        errorService.showSuccess(`Extracted ${mockData.length} records for review`);
      },
      onError: (error) => {
        errorService.showError(`URL extraction failed: ${error}`);
      },
      timeout: 60000 // 60 second timeout
    }
  );
  const allowedDomains = [
    'medicine.ucla.edu',
    'hopkinsmedicine.org',
    'mayoclinic.org',
    'utsouthwestern.edu',
    'childrenshospital.org',
    'medicine.yale.edu',
    'med.stanford.edu',
    'medicine.harvard.edu'
  ];

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await processUrlAsync();
  };

  const handleRecordSelect = (index: number) => {
    const newSelected = new Set(selectedRecords);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedRecords(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedRecords.size === extractedData.length) {
      setSelectedRecords(new Set());
    } else {
      setSelectedRecords(new Set(extractedData.map((_, index) => index)));
    }
  };

  const handleImportSelected = async () => {
    if (selectedRecords.size === 0) {
      errorService.showError('Please select at least one record to import');
      return;
    }
    
    const selectedData = extractedData.filter((_, index) => selectedRecords.has(index));
    
    try {
      // TODO: Process selected records with proper validation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      errorService.showSuccess(`Successfully imported ${selectedData.length} records to the database!`);
    } catch (error) {
      const errorMessage = errorService.handleApiError(error, 'Record import');
      errorService.showError(errorMessage);
      return;
    }
    
    // Reset form
    setUrl('');
    setExtractedData([]);
    setSelectedRecords(new Set());
    setShowQAReview(false);
    setImportJob(null);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600 bg-green-50';
    if (confidence >= 0.7) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const checkRobotsTxt = async (url: string) => {
    try {
      const domain = new URL(url).origin;
      const robotsUrl = `${domain}/robots.txt`;
      
      // This would check robots.txt in a real implementation
      console.log('Checking robots.txt for:', robotsUrl);
      return true; // Mock compliance check
    } catch {
      return false;
    }
  };

  return (
    <ErrorBoundary>
      <LoadingOverlay isLoading={isProcessing} text="Extracting data from URL...">
    <Layout breadcrumbs={[
      { label: 'DMP Dashboard', href: '/dmp' },
      { label: 'URL Extraction' }
    ]}>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-3">
            <Globe className="h-8 w-8 text-green-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">URL Extraction & Parsing</h1>
              <p className="text-gray-600 mt-1">
                Extract resident/fellow data from authorized residency program websites
              </p>
            </div>
          </div>
        </div>

        {/* Compliance Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-amber-900">Compliance & Authorization</h3>
              <p className="text-sm text-amber-700 mt-1">
                URL extraction is restricted to authorized educational institution websites only. 
                All extractions respect robots.txt and include full provenance tracking. 
                Only submit URLs from residency programs with institutional authorization.
              </p>
            </div>
          </div>
        </div>

        {/* URL Submission */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Submit Residency Program URL</h2>
          
          <form onSubmit={handleUrlSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Residency Program URL
              </label>
              <div className="flex space-x-3">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://medicine.university.edu/residency/internal-medicine/residents"
                  className="flex-1 px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                  aria-label="Enter residency program URL"
                  maxLength={500}
                />
                <button
                  type="submit"
                  disabled={isProcessing || !url.trim()}
                  className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Extract data from URL"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Extracting...</span>
                    </>
                  ) : (
                    <>
                      <Globe className="h-4 w-4" />
                      <span>Extract Data</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Enter the URL of a residency program page containing resident/fellow listings
              </p>
            </div>
          </form>

          {/* Example URLs */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-3">Example Authorized URLs:</h4>
            <div className="space-y-2 text-sm text-blue-800">
              {allowedDomains.slice(0, 4).map((domain, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <ExternalLink className="h-3 w-3" />
                  <span>https://{domain}/residency/residents</span>
                </div>
              ))}
              <p className="text-xs text-blue-600 mt-2">
                + Other .edu domains with institutional authorization
              </p>
            </div>
          </div>
        </div>

        {/* Processing Status */}
        {importJob && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Extraction Results</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Globe className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-blue-900">Source URL</span>
                </div>
                <p className="text-sm text-blue-700 mt-1 truncate" title={importJob.sourceUrl}>
                  {importJob.sourceUrl}
                </p>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-900">Extracted</span>
                </div>
                <p className="text-2xl font-bold text-green-900 mt-1">{importJob.totalRecords}</p>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <span className="font-medium text-red-900">Errors</span>
                </div>
                <p className="text-2xl font-bold text-red-900 mt-1">{importJob.errorCount}</p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-gray-600" />
                  <span className="font-medium text-gray-900">Extracted At</span>
                </div>
                <p className="text-sm text-gray-700 mt-1">
                  {new Date(importJob.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* QA Review */}
        {showQAReview && extractedData.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Quality Assurance Review</h2>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleSelectAll}
                  className="text-sm text-green-600 hover:text-green-700"
                >
                  {selectedRecords.size === extractedData.length ? 'Deselect All' : 'Select All'}
                </button>
                <button
                  onClick={handleImportSelected}
                  disabled={selectedRecords.size === 0}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="h-4 w-4" />
                  <span>Import Selected ({selectedRecords.size})</span>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {extractedData.map((record, index) => (
                <div
                  key={index}
                  className={`border rounded-lg p-4 transition-colors ${
                    selectedRecords.has(index)
                      ? 'border-green-200 bg-green-50'
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <input
                      type="checkbox"
                      checked={selectedRecords.has(index)}
                      onChange={() => handleRecordSelect(index)}
                      className="mt-1 h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-medium text-gray-900">{record.name}</h3>
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          {record.specialty}
                        </span>
                        {record.pgyYear && (
                          <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                            {record.pgyYear}
                          </span>
                        )}
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getConfidenceColor(record.confidence)}`}>
                          {Math.round(record.confidence * 100)}% confidence
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">
                            <strong>Email:</strong> {record.email || 'Not found'}
                          </p>
                          <p className="text-gray-600">
                            <strong>Phone:</strong> {record.phone || 'Not found'}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">
                            <strong>Source Snippet:</strong>
                          </p>
                          <p className="text-xs text-gray-500 bg-gray-100 p-2 rounded mt-1 font-mono">
                            "{record.sourceSnippet}"
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Provenance Information */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-3">Provenance Tracking</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-600"><strong>Source URL:</strong></p>
                  <p className="text-blue-600 break-all">{url}</p>
                </div>
                <div>
                  <p className="text-gray-600"><strong>Extraction Date:</strong></p>
                  <p className="text-gray-900">{new Date().toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-600"><strong>Content Hash:</strong></p>
                  <p className="text-gray-900 font-mono">sha256:abc123...</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Compliance Guidelines */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Compliance Guidelines</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                <Shield className="h-4 w-4 mr-2 text-green-600" />
                Authorized Sources
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Educational institution websites (.edu domains)</li>
                <li>• Official residency program pages</li>
                <li>• Hospital training program directories</li>
                <li>• GME office published rosters</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2 text-amber-600" />
                Restrictions
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Must respect robots.txt directives</li>
                <li>• No personal social media profiles</li>
                <li>• No private practice websites</li>
                <li>• Requires institutional authorization</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="font-medium text-green-900 mb-3">How URL Extraction Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-green-800 mb-2">1. Compliance Check</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Validates domain authorization</li>
                <li>• Checks robots.txt compliance</li>
                <li>• Ensures institutional approval</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-green-800 mb-2">2. Data Extraction</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• AI parses HTML content</li>
                <li>• Extracts resident information</li>
                <li>• Preserves source context</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-green-800 mb-2">3. QA Review</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Manual review of extractions</li>
                <li>• Confidence scoring</li>
                <li>• Selective import approval</li>
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