import React, { useMemo, useState, useCallback } from 'react';
import { VirtualTable } from './VirtualTable';
import { FormField } from './FormField';
import { useDebounce } from '../../hooks/useDebounce';
import { SecurityUtils } from '../../utils/security';
import { 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  ChevronLeft, 
  ChevronRight,
  MoreVertical,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

interface DataTableColumn {
  key: string;
  label: string;
  width: number;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, row: any, index: number) => React.ReactNode;
}

interface DataTableAction {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: (row: any, index: number) => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: (row: any) => boolean;
}

interface DataTableProps {
  data: any[];
  columns: DataTableColumn[];
  actions?: DataTableAction[];
  onRowClick?: (row: any, index: number) => void;
  loading?: boolean;
  error?: string;
  emptyMessage?: string;
  searchable?: boolean;
  filterable?: boolean;
  exportable?: boolean;
  refreshable?: boolean;
  onRefresh?: () => void;
  onExport?: (data: any[]) => void;
  pageSize?: number;
  virtualScrolling?: boolean;
  height?: number;
  className?: string;
  ariaLabel?: string;
}

export const DataTable = React.memo<DataTableProps>(({
  data,
  columns,
  actions = [],
  onRowClick,
  loading = false,
  error,
  emptyMessage = 'No data available',
  searchable = true,
  filterable = true,
  exportable = true,
  refreshable = false,
  onRefresh,
  onExport,
  pageSize = 50,
  virtualScrolling = true,
  height = 600,
  className = '',
  ariaLabel = 'Data table'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sortColumn, setSortColumn] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Filter and sort data
  const processedData = useMemo(() => {
    let filtered = data;

    // Apply search filter
    if (debouncedSearchQuery && searchable) {
      const sanitizedQuery = SecurityUtils.sanitizeText(debouncedSearchQuery).toLowerCase();
      filtered = filtered.filter(row =>
        columns.some(column =>
          String(row[column.key] || '').toLowerCase().includes(sanitizedQuery)
        )
      );
    }

    // Apply column filters
    Object.entries(filters).forEach(([columnKey, filterValue]) => {
      if (filterValue) {
        const sanitizedFilter = SecurityUtils.sanitizeText(filterValue).toLowerCase();
        filtered = filtered.filter(row =>
          String(row[columnKey] || '').toLowerCase().includes(sanitizedFilter)
        );
      }
    });

    // Apply sorting
    if (sortColumn) {
      filtered.sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];
        
        let comparison = 0;
        if (aValue < bValue) comparison = -1;
        if (aValue > bValue) comparison = 1;
        
        return sortDirection === 'desc' ? -comparison : comparison;
      });
    }

    return filtered;
  }, [data, debouncedSearchQuery, filters, sortColumn, sortDirection, columns, searchable]);

  // Pagination
  const paginatedData = useMemo(() => {
    if (virtualScrolling) return processedData;
    
    const startIndex = (currentPage - 1) * pageSize;
    return processedData.slice(startIndex, startIndex + pageSize);
  }, [processedData, currentPage, pageSize, virtualScrolling]);

  const totalPages = Math.ceil(processedData.length / pageSize);

  // Handlers
  const handleSort = useCallback((column: string, direction: 'asc' | 'desc') => {
    setSortColumn(column);
    setSortDirection(direction);
  }, []);

  const handleFilterChange = useCallback((columnKey: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [columnKey]: value
    }));
    setCurrentPage(1); // Reset to first page when filtering
  }, []);

  const handleExport = useCallback(() => {
    if (onExport) {
      onExport(processedData);
    } else {
      // Default CSV export
      const headers = columns.map(col => col.label);
      const csvData = [
        headers.join(','),
        ...processedData.map(row =>
          columns.map(col => `"${String(row[col.key] || '').replace(/"/g, '""')}"`).join(',')
        )
      ].join('\n');

      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `export_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  }, [processedData, columns, onExport]);

  const handleRowSelect = useCallback((index: number) => {
    setSelectedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginatedData.map((_, index) => index)));
    }
  }, [selectedRows.size, paginatedData.length]);

  // Enhanced columns with actions
  const enhancedColumns = useMemo(() => {
    const cols = [...columns];
    
    // Add selection column if needed
    if (selectedRows.size > 0 || true) { // Always show for consistency
      cols.unshift({
        key: '_select',
        label: '',
        width: 50,
        render: (_, __, index) => (
          <input
            type="checkbox"
            checked={selectedRows.has(index)}
            onChange={() => handleRowSelect(index)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            aria-label={`Select row ${index + 1}`}
          />
        )
      });
    }

    // Add actions column if actions are provided
    if (actions.length > 0) {
      cols.push({
        key: '_actions',
        label: 'Actions',
        width: 120,
        render: (_, row, index) => (
          <div className="flex items-center space-x-1">
            {actions.slice(0, 2).map((action, actionIndex) => {
              const Icon = action.icon;
              const isDisabled = action.disabled?.(row) || false;
              
              return (
                <button
                  key={actionIndex}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isDisabled) action.onClick(row, index);
                  }}
                  disabled={isDisabled}
                  className={`p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed ${
                    action.variant === 'danger' ? 'text-red-600 hover:bg-red-50' :
                    action.variant === 'primary' ? 'text-blue-600 hover:bg-blue-50' :
                    'text-gray-600'
                  }`}
                  title={action.label}
                  aria-label={`${action.label} for row ${index + 1}`}
                >
                  <Icon className="h-4 w-4" />
                </button>
              );
            })}
            
            {actions.length > 2 && (
              <button
                className="p-1 rounded hover:bg-gray-100 text-gray-600"
                title="More actions"
                aria-label={`More actions for row ${index + 1}`}
              >
                <MoreVertical className="h-4 w-4" />
              </button>
            )}
          </div>
        )
      });
    }

    return cols;
  }, [columns, actions, selectedRows, handleRowSelect]);

  if (error) {
    return (
      <div className={`border border-red-200 rounded-lg p-8 text-center ${className}`}>
        <div className="text-red-600 mb-2">Error loading data</div>
        <p className="text-gray-600 text-sm">{error}</p>
        {refreshable && onRefresh && (
          <button
            onClick={onRefresh}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {searchable && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Search table data"
              />
            </div>
          )}
          
          {filterable && (
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              aria-label="Toggle filters"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
              {Object.values(filters).filter(Boolean).length > 0 && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {Object.values(filters).filter(Boolean).length}
                </span>
              )}
            </button>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {selectedRows.size > 0 && (
            <span className="text-sm text-gray-600">
              {selectedRows.size} selected
            </span>
          )}
          
          {refreshable && onRefresh && (
            <button
              onClick={onRefresh}
              className="p-2 border border-gray-300 rounded-md hover:bg-gray-50"
              aria-label="Refresh data"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          )}
          
          {exportable && (
            <button
              onClick={handleExport}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              aria-label="Export table data"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      {showFilters && filterable && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
          {columns.filter(col => col.filterable).map(column => (
            <FormField
              key={column.key}
              label={`Filter ${column.label}`}
              name={`filter_${column.key}`}
              value={filters[column.key] || ''}
              onChange={(value) => handleFilterChange(column.key, String(value))}
              placeholder={`Filter by ${column.label.toLowerCase()}...`}
            />
          ))}
        </div>
      )}

      {/* Table */}
      {virtualScrolling ? (
        <VirtualTable
          data={processedData}
          columns={enhancedColumns}
          height={height}
          onRowClick={onRowClick}
          onSort={handleSort}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          loading={loading}
          emptyMessage={emptyMessage}
          className="border border-gray-200 rounded-lg"
        />
      ) : (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          {/* Regular table implementation for smaller datasets */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200" role="table" aria-label={ariaLabel}>
              <thead className="bg-gray-50">
                <tr>
                  {enhancedColumns.map((column) => (
                    <th
                      key={column.key}
                      style={{ width: column.width }}
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedData.map((row, index) => (
                  <tr
                    key={index}
                    className={`hover:bg-gray-50 ${onRowClick ? 'cursor-pointer' : ''}`}
                    onClick={() => onRowClick?.(row, index)}
                    role={onRowClick ? 'button' : undefined}
                    tabIndex={onRowClick ? 0 : undefined}
                    onKeyDown={(e) => {
                      if (onRowClick && (e.key === 'Enter' || e.key === ' ')) {
                        e.preventDefault();
                        onRowClick(row, index);
                      }
                    }}
                  >
                    {enhancedColumns.map((column) => (
                      <td
                        key={column.key}
                        className="px-4 py-3 text-sm text-gray-900"
                        style={{ width: column.width }}
                      >
                        {column.render ? column.render(row[column.key], row, index) : row[column.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!virtualScrolling && totalPages > 1 && (
            <div className="bg-white px-4 py-3 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, processedData.length)} of {processedData.length} results
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                
                <span className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

DataTable.displayName = 'DataTable';