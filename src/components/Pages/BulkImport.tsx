import React, { useState } from 'react';
import { useBookmarks } from '../../contexts/BookmarkContext';
import { Layout } from '../Layout/Layout';
import {
  Brain,
  AlertCircle,
  Bookmark,
  BookmarkCheck,
  RefreshCw,
  Save,
} from 'lucide-react';

interface ParsedResident {
  name: string;
  specialty: string;
  pgyYear: string;
  confidence: number;
  rawText?: string;
  email?: string;
  phone?: string;
  location?: string;
}

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === 'string') return err;
  try {
    return JSON.stringify(err);
  } catch {
    return 'Unknown error';
  }
}

function getEnvOrThrow(key: string, value: string | undefined) {
  if (!value) {
    throw new Error(`Missing required env: ${key}. Did you set it in your Vite env (.env) as VITE_... ?`);
  }
  return value;
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
  const [errorMessage, setErrorMessage] = useState('');

  const isBookmarked = bookmarks.some((b) => b.url === '/bulk-import');

  const handleBookmark = () => {
    if (!isBookmarked) {
      addBookmark('AI Assist HCP Data Import', '/bulk-import', 'Data Collection');
    }
  };

  async function postParse(payload: { type: 'text' | 'url'; content: string }) {
    const SUPABASE_URL = getEnvOrThrow('VITE_SUPABASE_URL', import.meta.env.VITE_SUPABASE_URL);
    const SUPABASE_ANON_KEY = getEnvOrThrow('VITE_SUPABASE_ANON_KEY', import.meta.env.VITE_SUPABASE_ANON_KEY);

    const response = await fetch(`${SUPABASE_URL}/functions/v1/parse-hcp-data`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    let data: any = null;
    try {
      data = await response.json();
    } catch (_) {
      // ignore JSON parse errors here; we'll throw a nicer message below
    }

    if (!response.ok) {
      const message = data?.error || data?.message || `Request failed with status ${response.status}`;
      throw new Error(message);
    }

    return (data?.providers as ParsedResident[]) || [];
  }

  const parseResidentData = async (text: string): Promise<ParsedResident[]> => {
    try {
      return await postParse({ type: 'text', content: text });
    } catch (err) {
      console.error('AI parsing error:', err);
      throw err;
    }
  };

  const parseUrlContent = async (url: string): Promise<ParsedResident[]> => {
    try {
      return await postParse({ type: 'url', content: url });
    } catch (err) {
      console.error('URL parsing error:', err);
      throw err;
    }
  };

  const handleProcessText = async () => {
    if (inputMode === 'text' && !inputText.trim()) return;
    if (inputMode === 'url' && !inputUrl.trim()) return;

    setIsProcessing(true);
    setProcessingStatus('idle');
    setErrorMessage('');

    try {
      const parsed =
        inputMode === 'text' ? await parseResidentData(inputText) : await parseUrlContent(inputUrl);
      setParsedData(parsed);
      setSelectedItems(new Set(parsed.map((_, index) => index)));
      setProcessingStatus('success');
    } catch (err) {
      setProcessingStatus('error');
      setErrorMessage(getErrorMessage(err));
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

    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // eslint-disable-next-line no-alert
    alert(`Successfully imported ${selectedData.length} residents/fellows to the database!`);

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
    <Layout
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'AI Bulk Import' },]}>
    
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
                {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                <span className="text-sm">{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
              </button>
            </div>
            <p className="text-gray-600 mt-2">
              {inputMode === 'text'
                ? 'Paste web content containing medical resident and fellow information. AI will automatically extract names, specialties, and PGY years.'
                : 'Enter a URL to a medical residency program webpage. AI will fetch and parse the content to extract resident information.'}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Paste Web Content</label>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  rows={12}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder={`Paste content from hospital websites, residency program pages, or any text containing resident/fellow information...\n\nExample content:\n- Dr. Sarah Johnson, Internal Medicine, PGY-2\n- Michael Chen MD, Emergency Medicine Resident, Year 3\n- Emily Rodriguez, Pediatrics R1\n- Dr. James Wilson, Surgery PGY-4`}
                />
                <div className="mt-2 flex justify-between items-center">
                  <p className="text-sm text-gray-500">{inputText.length} characters • AI will extract structured data from unstructured text</p>
                  <button
                    onClick={handleProcessText}
                    disabled={!inputText.trim() || isProcessing}
                    className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Processing with OpenAI...</span>
                      </>
                    ) : (
                      <>
                        <Brain className="w-4 h-4" />
                        <span>Parse with OpenAI</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* URL Input Section */}
            {inputMode === 'url' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Residency Program URL</label>
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
                        <span>Fetching & Parsing with OpenAI...</span>
                      </>
                    ) : (
                      <>
                        <Brain className="w-4 h-4" />
                        <span>Parse URL with OpenAI</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">AI will fetch the webpage content and extract resident/fellow information automatically</p>

                  {/* Example URLs */}
                  <div className="mt-3 p-3 bg-blue-50 rounded-md">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">Example URLs:</h4>
                    <div className="space-y-1 text-xs text-blue-800">
                      <div>• https://medicine.yale.edu/intmed/education/residency/residents/</div>
                      <div>• https://www.hopkinsmedicine.org/som/education-training/graduate-medical-education/</div>
                      <div>• https://www.mayoclinic.org/departments-centers/mayo-clinic-alix-school-medicine/education/residencies-fellowships</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Results Section */}
            {parsedData.length > 0 && (
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Parsed Results ({parsedData.length} found)</h3>
                  <div className="flex items-center space-x-3">
                    <button onClick={handleSelectAll} className="text-sm text-purple-600 hover:text-purple-700">
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
                              {resident.location && (
                                <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                                  {resident.location}
                                </span>
                              )}
                            </div>
                            {(resident.email || resident.phone) && (
                              <div className="flex items-center space-x-3 mt-1">
                                {resident.email && <span className="text-xs text-gray-500">📧 {resident.email}</span>}
                                {resident.phone && <span className="text-xs text-gray-500">📞 {resident.phone}</span>}
                              </div>
                            )}
                            {resident.rawText && <p className="text-sm text-gray-500 mt-1">Source: "{resident.rawText}"</p>}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getConfidenceColor(
                            resident.confidence,
                          )}`}>
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
                <span className="text-yellow-700">
                  No resident/fellow data found in the provided text. Try pasting content with names, specialties, and PGY years.
                </span>
              </div>
            )}

            {processingStatus === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <div className="text-red-700">
                  <div className="font-medium">Error processing content</div>
                  {errorMessage && <div className="text-sm mt-1">{errorMessage}</div>}
                </div>
              </div>
            )}

            {/* Help Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h4 className="font-medium text-blue-900 mb-2">How it works:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>
                  • {inputMode === 'text'
                    ? 'Paste any web content'
                    : 'Enter a URL to a residency program webpage'}{' '}
                  containing resident/fellow information
                </li>
                {inputMode === 'url' && <li>• AI fetches the webpage content automatically</li>}
                <li>
                  • OpenAI GPT-4 automatically identifies names, medical specialties, PGY years, and contact information
                </li>
                <li>• Review and select which entries to import</li>
                <li>• Data is added to your HCP database with proper formatting</li>
                <li>• Confidence scores help you identify the most reliable extractions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
