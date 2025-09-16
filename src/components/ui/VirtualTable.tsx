import React, { useMemo, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Column {
  key: string;
  label: string;
  width: number;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

interface VirtualTableProps {
  data: any[];
  columns: Column[];
  height?: number;
  rowHeight?: number;
  onRowClick?: (row: any, index: number) => void;
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}

export const VirtualTable = React.memo<VirtualTableProps>(({
  data,
  columns,
  height = 400,
  rowHeight = 60,
  onRowClick,
  onSort,
  sortColumn,
  sortDirection,
  loading = false,
  emptyMessage = 'No data available',
  className = ''
}) => {
  const totalWidth = useMemo(() => 
    columns.reduce((sum, col) => sum + col.width, 0), 
    [columns]
  );

  const handleSort = useCallback((column: string) => {
    if (!onSort) return;
    
    const newDirection = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
    onSort(column, newDirection);
  }, [onSort, sortColumn, sortDirection]);

  const Row = useCallback(({ index, style }: { index: number; style: React.CSSProperties }) => {
    const row = data[index];
    
    return (
      <div
        style={style}
        className={`flex items-center border-b border-gray-200 hover:bg-gray-50 ${
          onRowClick ? 'cursor-pointer' : ''
        }`}
        onClick={() => onRowClick?.(row, index)}
        role={onRowClick ? 'button' : undefined}
        tabIndex={onRowClick ? 0 : undefined}
        onKeyDown={(e) => {
          if (onRowClick && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            onRowClick(row, index);
          }
        }}
        aria-label={onRowClick ? `View details for row ${index + 1}` : undefined}
      >
        {columns.map((column) => (
          <div
            key={column.key}
            style={{ width: column.width }}
            className="px-4 py-3 text-sm text-gray-900 truncate"
          >
            {column.render ? column.render(row[column.key], row) : row[column.key]}
          </div>
        ))}
      </div>
    );
  }, [data, columns, onRowClick]);

  if (loading) {
    return (
      <div className={`border border-gray-200 rounded-lg ${className}`}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-500">Loading data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={`border border-gray-200 rounded-lg ${className}`}>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`border border-gray-200 rounded-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div 
        className="flex bg-gray-50 border-b border-gray-200"
        style={{ width: totalWidth }}
      >
        {columns.map((column) => (
          <div
            key={column.key}
            style={{ width: column.width }}
            className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
              column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
            }`}
            onClick={() => column.sortable && handleSort(column.key)}
            role={column.sortable ? 'button' : undefined}
            tabIndex={column.sortable ? 0 : undefined}
            onKeyDown={(e) => {
              if (column.sortable && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                handleSort(column.key);
              }
            }}
            aria-label={column.sortable ? `Sort by ${column.label}` : column.label}
          >
            <div className="flex items-center space-x-1">
              <span>{column.label}</span>
              {column.sortable && sortColumn === column.key && (
                sortDirection === 'asc' ? 
                  <ChevronUp className="h-3 w-3" /> : 
                  <ChevronDown className="h-3 w-3" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Virtual List */}
      <List
        height={height}
        itemCount={data.length}
        itemSize={rowHeight}
        width={totalWidth}
        itemData={data}
      >
        {Row}
      </List>
    </div>
  );
});

VirtualTable.displayName = 'VirtualTable';