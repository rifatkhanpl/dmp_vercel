import React, { useState } from 'react';
import { useBookmarks } from '../../contexts/BookmarkContext';
import { Layout } from '../Layout/Layout';
import { Breadcrumb } from '../Layout/Breadcrumb';
import { 
  Upload, 
  Brain, 
  Users, 
  CheckCircle, 
  AlertCircle,
  Bookmark,
  BookmarkCheck,
  RefreshCw,
  Download,
  Eye,
  Save
} from 'lucide-react';

interface ParsedResident {
  name: string;
  specialty: string;
  pgyYear: string;
  confidence: number;
  rawText?: string;
}

export function BulkImport() {
  const { addBookmark, bookmarks } = useBookmarks();
  const [inputText, setInputText] = useState('');
  const [inputUrl, setInputUrl] = useState('');
  const [inputMode, setInputMode] = useState<'text' | 'url'>('text');
  const [parsedData, setParsedData] = useState<ParsedResident[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());

  const isBookmarked = bookmarks.some(b => b.url === '/bulk-import');

  const handleBookmark = () => {
    if (!isBookmarked) {
      addBookmark('AI Assist HCP Data Import', '/bulk-import', 'Data Collection');
    }
  };

  // Mock AI parsing function - in real implementation, this would call an AI service
  const parseResidentData = async (text: string): Promise<ParsedResident[]> => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock parsing logic - in reality, this would use AI/NLP
    const lines = text.split('\n').filter(line => line.trim());
    const residents: ParsedResident[] = [];

    for (const line of lines) {
      // Simple pattern matching for demonstration
      const nameMatch = line.match(/([A-Z][a-z]+ [A-Z][a-z]+(?:\s[A-Z][a-z]+)?)/);
      const specialtyMatch = line.match(/(Internal Medicine|Family Medicine|Pediatrics|Surgery|Psychiatry|Emergency Medicine|Radiology|Anesthesiology|Pathology|Dermatology|Ophthalmology|Orthopedics|Cardiology|Neurology|Oncology)/i);
      const pgyMatch = line.match(/PGY[-\s]?(\d+)|Year\s(\d+)|R(\d+)/i);

      if (nameMatch) {
        residents.push({
          name: nameMatch[1],
          specialty: specialtyMatch ? specialtyMatch[1] : 'Unknown',
          pgyYear: pgyMatch ? `PGY-${pgyMatch[1] || pgyMatch[2] || pgyMatch[3]}` : 'Unknown',
          confidence: Math.random() * 0.3 + 0.7, // Mock confidence score
          rawText: line.trim()
        });
      }
    }

    // Add some mock data if no patterns found
    if (residents.length === 0 && text.trim()) {
      residents.push(
        {
          name: 'Dr. Sarah Johnson',
          specialty: 'Internal Medicine',
          pgyYear: 'PGY-2',
          confidence: 0.95,
          rawText: 'Extracted from sample text'
        },
        {
          name: 'Dr. Michael Chen',
          specialty: 'Emergency Medicine',
          pgyYear: 'PGY-3',
          confidence: 0.88,
          rawText: 'Extracted from sample text'
        },
        {
          name: 'Dr. Emily Rodriguez',
          specialty: 'Pediatrics',
          pgyYear: 'PGY-1',
          confidence: 0.92,
          rawText: 'Extracted from sample text'
        }
      );
    }

    return residents;
  };

  // Mock URL fetching and parsing function
  const parseUrlContent = async (url: string): Promise<ParsedResident[]> => {
    // Simulate fetching and parsing delay
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Mock data that would be extracted from a typical residency program webpage
    const mockResidents: ParsedResident[] = [
      {
        name: 'Dr. Sarah Johnson',
        specialty: 'Internal Medicine',
        pgyYear: 'PGY-2',
        confidence: 0.95,
        rawText: `Extracted from ${url}`
      },
      {
        name: 'Dr. Michael Chen',
        specialty: 'Internal Medicine',
        pgyYear: 'PGY-3',
        confidence: 0.92,
        rawText: `Extracted from ${url}`
      },
      {
        name: 'Dr. Emily Rodriguez',
        specialty: 'Internal Medicine',
        pgyYear: 'PGY-1',
        confidence: 0.88,
        rawText: `Extracted from ${url}`
      },
      {
        name: 'Dr. James Wilson',
        specialty: 'Internal Medicine',
        pgyYear: 'PGY-4',
        confidence: 0.94,
        rawText: `Extracted from ${url}`
      },
      {
        name: 'Dr. Lisa Thompson',
        specialty: 'Internal Medicine',
        pgyYear: 'PGY-2',
        confidence: 0.90,
        rawText: `Extracted from ${url}`
      }
    ];

    return mockResidents;
  };

  const handleProcessText = async () => {
    if (inputMode === 'text' && !inputText.trim()) return;
    if (inputMode === 'url' && !inputUrl.trim()) return;

    setIsProcessing(true);
    setProcessingStatus('idle');

    try {
      const parsed = inputMode === 'text' 
        ? await parseResidentData(inputText)
        : await parseUrlContent(inputUrl);
      setParsedData(parsed);
      setSelectedItems(new Set(parsed.map((_, index) => index)));
      setProcessingStatus('success');
    } catch (error) {
      setProcessingStatus('error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedItems.size === parsedData.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(parsedData.map((_, index) => index)));
    }
  };

  const handleItemSelect = (index: number) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedItems(newSelected);
  };

  const handleImportSelected = async () => {
    const selectedData = parsedData.filter((_, index) => selectedItems.has(index));
    
    // Mock import process
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    alert(`Successfully imported ${selectedData.length} residents/fellows to the database!`);
    
    // Reset form
    if (inputMode === 'text') {
      setInputText('');
    } else {
      setInputUrl('');
    }
    setParsedData([]);
    setSelectedItems(new Set());
    setProcessingStatus('idle');
    setIsProcessing(false);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600 bg-green-50';
    if (confidence >= 0.7) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <Layout breadcrumbs={[
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'AI Bulk Import' }
    ]}>
      <div className="flex-1 max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Brain className="w-6 h-6 text-purple-600" />
              <h1 className="text-2xl font-bold text-gray-900">AI Assist HCP Data Import</h1>
            </div>
            <button
              onClick={handleBookmark}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                isBookmarked
                  ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                  : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
              }`}
              disabled={isBookmarked}
            >
              {isBookmarked ? (
                <BookmarkCheck className="w-4 h-4" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
              <span className="text-sm">
                {isBookmarked ? 'Bookmarked' : 'Bookmark'}
              </span>
            </button>
          </div>
          <p className="text-gray-600 mt-2">
            {inputMode === 'text' 
              ? 'Paste web content containing medical resident and fellow information. AI will automatically extract names, specialties, and PGY years.'
              : 'Enter a URL to a medical residency program webpage. AI will fetch and parse the content to extract resident information.'
            }
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Input Mode Toggle */}
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-700">Input Method:</span>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="inputMode"
                  value="text"
                  checked={inputMode === 'text'}
                  onChange={(e) => setInputMode(e.target.value as 'text' | 'url')}
                  className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">Paste Text Content</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="inputMode"
                  value="url"
                  checked={inputMode === 'url'}
                  onChange={(e) => setInputMode(e.target.value as 'text' | 'url')}
                  className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">Enter URL</span>
              </label>
            </div>
          </div>
          {/* Text Input Section */}
          {inputMode === 'text' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Paste Web Content
              </label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={12}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Paste content from hospital websites, residency program pages, or any text containing resident/fellow information...

Example content:
- Dr. Sarah Johnson, Internal Medicine, PGY-2
- Michael Chen MD, Emergency Medicine Resident, Year 3
- Emily Rodriguez, Pediatrics R1
- Dr. James Wilson, Surgery PGY-4"
              />
              <div className="mt-2 flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  {inputText.length} characters • AI will extract structured data from unstructured text
                </p>
                <button
                  onClick={handleProcessText}
                  disabled={!inputText.trim() || isProcessing}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Processing with AI...</span>
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4" />
                      <span>Parse with AI</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* URL Input Section */}
          {inputMode === 'url' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Residency Program URL
              </label>
              <div className="flex space-x-3">
                <input
                  type="url"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="https://hospital.edu/residency/internal-medicine/residents"
                />
                <button
                  onClick={handleProcessText}
                  disabled={!inputUrl.trim() || isProcessing}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Fetching & Parsing...</span>
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4" />
                      <span>Parse URL</span>
                    </>
                  )}
                </button>
              </div>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  AI will fetch the webpage content and extract resident/fellow information automatically
                </p>
              </div>
              
              {/* Example URLs */}
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <h4 className="text-sm font-medium text-blue-900 mb-2">Example URLs:</h4>
                <div className="space-y-1 text-xs text-blue-800">
                  <div>• https://medicine.yale.edu/intmed/education/residency/residents/</div>
                  <div>• https://www.hopkinsmedicine.org/som/education-training/graduate-medical-education/</div>
                  <div>• https://www.mayoclinic.org/departments-centers/mayo-clinic-alix-school-medicine/education/residencies-fellowships</div>
                </div>
              </div>
            </div>
          )}

          {/* Results Section */}
          {parsedData.length > 0 && (
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Parsed Results ({parsedData.length} found)
                </h3>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleSelectAll}
                    className="text-sm text-purple-600 hover:text-purple-700"
                  >
                    {selectedItems.size === parsedData.length ? 'Deselect All' : 'Select All'}
                  </button>
                  <button
                    onClick={handleImportSelected}
                    disabled={selectedItems.size === 0 || isProcessing}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>Import Selected ({selectedItems.size})</span>
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {parsedData.map((resident, index) => (
                  <div
                    key={index}
                    className={`p-4 border rounded-lg transition-colors ${
                      selectedItems.has(index)
                        ? 'border-purple-200 bg-purple-50'
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={selectedItems.has(index)}
                          onChange={() => handleItemSelect(index)}
                          className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <div>
                          <div className="flex items-center space-x-3">
                            <h4 className="font-medium text-gray-900">{resident.name}</h4>
                            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                              {resident.specialty}
                            </span>
                            <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                              {resident.pgyYear}
                            </span>
                          </div>
                          {resident.rawText && (
                            <p className="text-sm text-gray-500 mt-1">
                              Source: "{resident.rawText}"
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getConfidenceColor(resident.confidence)}`}>
                          {Math.round(resident.confidence * 100)}% confidence
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status Messages */}
          {processingStatus === 'success' && parsedData.length === 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-yellow-500" />
              <span className="text-yellow-700">No resident/fellow data found in the provided text. Try pasting content with names, specialties, and PGY years.</span>
            </div>
          )}

          {processingStatus === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-700">Error processing text. Please try again.</span>
            </div>
          )}

          {/* Help Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <h4 className="font-medium text-blue-900 mb-2">How it works:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• {inputMode === 'text' ? 'Paste any web content' : 'Enter a URL to a residency program webpage'} containing resident/fellow information</li>
              {inputMode === 'url' && <li>• AI fetches the webpage content automatically</li>}
              <li>• AI automatically identifies names, medical specialties, and PGY years</li>
              <li>• Review and select which entries to import</li>
              <li>• Data is added to your HCP database with proper formatting</li>
            </ul>
          </div>
        </div>
      </div>
      </div>
    </Layout>
  );
}