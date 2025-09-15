import React, { useMemo, useState } from 'react';
import { Layout } from '../Layout/Layout';
import {
  Upload,
  FileText,
  Download,
  AlertCircle,
  CheckCircle,
  X,
  Eye,
  Brain,
  Bookmark,
  BookmarkCheck,
  RefreshCw,
  Save,
} from 'lucide-react';

// If BookmarkContext exists, we’ll use it; otherwise we noop gracefully.
let useBookmarksSafe: undefined | (() => { addBookmark: (title: string, url: string, group?: string) => void; bookmarks: Array<{ url: string }> });
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mod = require('../../contexts/BookmarkContext');
  if (mod && typeof mod.useBookmarks === 'function') {
    useBookmarksSafe = mod.useBookmarks;
  }
  // eslint-disable-next-line no-empty
} catch {}

type IssueType = 'error' | 'warning';

interface ImportResults {
  success: number;
  errors: number;
  warnings: number;
  details: Array<{ row: number; message: string; type: IssueType }>;
}

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

// -------------------------
// Shared helpers
// -------------------------
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
    throw new Error(
      `Missing required env: ${key}. Did you set it in your Vite env (.env) as VITE_... ?`
    );
  }
  return value;
}

// -------------------------
// Supabase Edge Function call (from File 2)
// -------------------------
async function postParse(payload: { type: 'text' | 'url'; content: string }) {
  const SUPABASE_URL = getEnvOrThrow('VITE_SUPABASE_URL', import.meta.env.VITE_SUPABASE_URL);
  const SUPABASE_ANON_KEY = getEnvOrThrow(
    'VITE_SUPABASE_ANON_KEY',
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );

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
  } catch {
    // ignore JSON parse errors here; we'll throw a nicer message below
  }

  if (!response.ok) {
    const message =
      data?.error || data?.message || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return (data?.providers as ParsedResident[]) || [];
}

// -------------------------
// Component
// -------------------------
type MainMode = 'file' | 'ai';
type AIMode = 'text' | 'url';

export function BulkImport() {
  // Bookmarking (graceful if context missing)
  const bookmarksCtx = useBookmarksSafe ? useBookmarksSafe() : null;
  const isBookmarked = !!bookmarksCtx?.bookmarks?.some((b) => b.url === '/bulk-import');
  const handleBookmark = () => {
    if (!isBookmarked) {
      bookmarksCtx?.addBookmark?.('AI Assist HCP Data Import', '/bulk-import', 'Data Collection');
    }
  };

  // Top-level mode (combine both features)
  const [mode, setMode] = useState<MainMode>('file');

  // -------------------------
  // File Upload (from File 1)
  // -------------------------
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [results, setResults] = useState<ImportResults | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const isAllowedFileType = (file: File) => {
    const allowedMimes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];
    if (allowedMimes.includes(file.type)) return true;
    // Fallback to extension check—MIME can be unreliable.
    const name = file.name.toLowerCase();
    return name.endsWith('.csv') || name.endsWith('.xls') || name.endsWith('.xlsx');
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
    if (!isAllowedFileType(file)) {
      alert('Please upload a CSV or Excel file (.csv, .xls, .xlsx)');
      return;
    }
    setUploadedFile(file);
    setResults(null);
  };

  const processFile = async () => {
    if (!uploadedFile) return;
    setIsProcessingFile(true);

    // TODO: Replace with real parser/validator/importer.
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock results (from File 1)
    setResults({
      success: 142,
      errors: 3,
      warnings: 8,
      details: [
        { row: 15, message: 'Invalid NPI number format', type: 'error' },
        { row: 23, message: 'Missing email address', type: 'error' },
        { row: 47, message: 'Invalid phone number format', type: 'error' },
        {
          row: 12,
          message: 'Specialty not recognized, using "General Practice"',
          type: 'warning',
        },
        { row: 34, message: 'State abbreviation corrected', type: 'warning' },
        { row: 56, message: 'Duplicate NPI found, skipping', type: 'warning' },
        { row: 78, message: 'Missing middle name', type: 'warning' },
        { row: 89, message: 'License expiration date in past', type: 'warning' },
      ],
    });

    setIsProcessingFile(false);
  };

  const removeFile = () => {
    setUploadedFile(null);
    setResults(null);
  };

  const downloadTemplate = () => {
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

  const downloadErrorReport = () => {
    if (!results?.details?.length) return;
    const header = 'row,type,message';
    const rows = results.details
      .map((d) => `${d.row},${d.type},"${d.message.replace(/"/g, '""')}"`)
      .join('\n');
    const csv = `${header}\n${rows}`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hcp_import_errors.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // -------------------------
  // AI Assist (from File 2)
  // -------------------------
  const [aiMode, setAIMode] = useState<AIMode>('text');
  const [inputText, setInputText] = useState('');
  const [inputUrl, setInputUrl] = useState('');
  const [parsedData, setParsedData] = useState<ParsedResident[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const parseResidentData = async (text: string): Promise<ParsedResident[]> => {
    try {
      return await postParse({ type: 'text', content: text });
    } catch (err) {
      throw err;
    }
  };

  const parseUrlContent = async (url: string): Promise<ParsedResident[]> => {
    try {
      return await postParse({ type: 'url', content: url });
    } catch (err) {
      throw err;
    }
  };

  const handleProcessAI = async () => {
    if (aiMode === 'text' && !inputText.trim()) return;
    if (aiMode === 'url' && !inputUrl.trim()) return;

    setIsProcessingAI(true);
    setProcessingStatus('idle');
    setErrorMessage('');
    try {
      const parsed =
        aiMode === 'text' ? await parseResidentData(inputText) : await parseUrlContent(inputUrl);
      setParsedData(parsed);
      setSelectedItems(new Set(parsed.map((_, i) => i)));
      setProcessingStatus('success');
    } catch (err) {
      setProcessingStatus('error');
      setErrorMessage(getErrorMessage(err));
    } finally {
      setIsProcessingAI(false);
    }
  };

  const handleSelectAllAI = () => {
    if (selectedItems.size === parsedData.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(parsedData.map((_, index) => index)));
    }
  };

  const handleItemSelectAI = (index: number) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(index)) newSelected.delete(index);
    else newSelected.add(index);
    setSelectedItems(newSelected);
  };

  const handleImportSelectedAI = async () => {
    const selectedData = parsedData.filter((_, index) => selectedItems.has(index));
    setIsProcessingAI(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    alert(`Successfully imported ${selectedData.length} residents/fellows to the database!`);
    if (aiMode === 'text') setInputText('');
    else setInputUrl('');
    setParsedData([]);
    setSelectedItems(new Set());
    setProcessingStatus('idle');
    setIsProcessingAI(false);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600 bg-green-50';
    if (confidence >= 0.7) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const fileSizeMB = useMemo(
    () => (uploadedFile ? (uploadedFile.size / 1024 / 1024).toFixed(2) : '0.00'),
    [uploadedFile]
  );

  return (
    <Layout breadcrumbs={[{ label: 'HCP Import' }]} >
      <div className="max-w-6xl mx-auto space-y-6 p-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Bulk Import Healthcare Providers</h1>
            <p className="text-gray-600">
              Import via CSV/Excel or let AI parse residents/fellows from text or URLs.
            </p>
          </div>
          {bookmarksCtx && (
            <button
              onClick={handleBookmark}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                isBookmarked
                  ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                  : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
              }`}
              disabled={isBookmarked}
              title={isBookmarked ? 'Already bookmarked' : 'Bookmark'}
            >
              {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              <span className="text-sm">{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
            </button>
          )}
        </div>

        {/* Mode Toggle */}
        <div className="bg-white rounded-lg shadow-sm p-2 flex items-center space-x-2">
          <button
            onClick={() => setMode('file')}
            className={`w-1/2 inline-flex items-center justify-center px-4 py-3 rounded-md border text-sm font-medium ${
              mode === 'file'
                ? 'bg-blue-600 text-white border-blue-700'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload CSV / Excel
          </button>
          <button
            onClick={() => setMode('ai')}
            className={`w-1/2 inline-flex items-center justify-center px-4 py-3 rounded-md border text-sm font-medium ${
              mode === 'ai'
                ? 'bg-purple-600 text-white border-purple-700'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Brain className="h-4 w-4 mr-2" />
            Parse Text / URL (AI)
          </button>
        </div>

        {/* TEMPLATE DOWNLOAD (always visible) */}
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

        {/* ---------------- FILE MODE ---------------- */}
        {mode === 'file' && (
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
                role="button"
                tabIndex={0}
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Drop your file here, or click to browse
                </p>
                <p className="text-sm text-gray-500 mb-4">Supports CSV, XLS, and XLSX files up to 10MB</p>
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
                      <p className="text-sm text-gray-500">{fileSizeMB} MB</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button onClick={removeFile} className="p-1 text-gray-400 hover:text-gray-600" title="Remove file">
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {!results && (
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      onClick={processFile}
                      disabled={isProcessingFile}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Upload className="h-4 w-4" />
                      <span>{isProcessingFile ? 'Processing...' : 'Process File'}</span>
                    </button>
                    <button
                      onClick={() => alert('Preview not implemented in this mock.')}
                      className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                    >
                      <Eye className="h-4 w-4" />
                      <span>Preview</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Results */}
            {results && (
              <div className="mt-6">
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
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-900">Issues Found</h3>
                      <button
                        onClick={downloadErrorReport}
                        className="inline-flex items-center space-x-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm"
                      >
                        <Download className="h-4 w-4" />
                        <span>Download Error Report</span>
                      </button>
                    </div>
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
                          <AlertCircle
                            className={`h-4 w-4 mt-0.5 ${
                              detail.type === 'error' ? 'text-red-600' : 'text-yellow-600'
                            }`}
                          />
                          <div className="flex-1">
                            <p
                              className={`text-sm font-medium ${
                                detail.type === 'error' ? 'text-red-900' : 'text-yellow-900'
                              }`}
                            >
                              Row {detail.row}: {detail.message}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    onClick={() => setResults(null)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Import Another File
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ---------------- AI MODE ---------------- */}
        {mode === 'ai' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Brain className="w-6 h-6 text-purple-600" />
                  <h2 className="text-xl font-bold text-gray-900">AI Assist HCP Data Import</h2>
                </div>
              </div>
              <p className="text-gray-600 mt-2">
                {aiMode === 'text'
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
                      checked={aiMode === 'text'}
                      onChange={(e) => setAIMode(e.target.value as AIMode)}
                      className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700">Paste Text Content</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="inputMode"
                      value="url"
                      checked={aiMode === 'url'}
                      onChange={(e) => setAIMode(e.target.value as AIMode)}
                      className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700">Enter URL</span>
                  </label>
                </div>
              </div>

              {/* Text Input */}
              {aiMode === 'text' && (
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
                    <p className="text-sm text-gray-500">
                      {inputText.length} characters • AI will extract structured data from unstructured text
                    </p>
                    <button
                      onClick={handleProcessAI}
                      disabled={!inputText.trim() || isProcessingAI}
                      className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isProcessingAI ? (
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

              {/* URL Input */}
              {aiMode === 'url' && (
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
                      onClick={handleProcessAI}
                      disabled={!inputUrl.trim() || isProcessingAI}
                      className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isProcessingAI ? (
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
                    <p className="text-sm text-gray-500">
                      AI will fetch the webpage content and extract resident/fellow information automatically
                    </p>

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

              {/* Results */}
              {parsedData.length > 0 && (
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Parsed Results ({parsedData.length} found)
                    </h3>
                    <div className="flex items-center space-x-3">
                      <button onClick={handleSelectAllAI} className="text-sm text-purple-600 hover:text-purple-700">
                        {selectedItems.size === parsedData.length ? 'Deselect All' : 'Select All'}
                      </button>
                      <button
                        onClick={handleImportSelectedAI}
                        disabled={selectedItems.size === 0 || isProcessingAI}
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
                              onChange={() => handleItemSelectAI(index)}
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
                                  {resident.email && (
                                    <span className="text-xs text-gray-500">📧 {resident.email}</span>
                                  )}
                                  {resident.phone && (
                                    <span className="text-xs text-gray-500">📞 {resident.phone}</span>
                                  )}
                                </div>
                              )}
                              {resident.rawText && (
                                <p className="text-sm text-gray-500 mt-1">Source: "{resident.rawText}"</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${getConfidenceColor(
                                resident.confidence
                              )}`}
                            >
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
                    No resident/fellow data found in the provided content. Try pasting text with names, specialties, and PGY years.
                  </span>
                </div>
              )}

              {processingStatus === 'error' && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <div className="text-red-700">
                    <div className="font-medium">Error processing content</div>
                    {errorMessage && (
                      <div className="text-sm mt-1">
                        {errorMessage}
                        {errorMessage.toLowerCase().includes('openai api key') && (
                          <div className="mt-2 p-2 bg-red-100 rounded text-xs">
                            <strong>Setup Required:</strong> Go to your Supabase project dashboard → Edge Functions
                            → <code className="bg-red-200 px-1 rounded">parse-hcp-data</code> → Environment Variables and add:
                            <br />
                            <code className="bg-red-200 px-1 rounded">OPENAI_API_KEY = &lt;your-key-here&gt;</code>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Help Section */}
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <h4 className="font-medium text-blue-900 mb-2">How it works:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>
                    • {aiMode === 'text' ? 'Paste any web content' : 'Enter a URL to a residency program webpage'} containing resident/fellow information
                  </li>
                  {aiMode === 'url' && <li>• AI fetches the webpage content automatically</li>}
                  <li>• OpenAI automatically identifies names, medical specialties, PGY years, and contact information</li>
                  <li>• Review and select which entries to import</li>
                  <li>• Data is added to your HCP database with proper formatting</li>
                  <li>• Confidence scores help you identify the most reliable extractions</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
