import React, { useState } from 'react';
import { ArrowUpDown, RefreshCw, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Reusable DataTableCard Component
 * Renders a card container with header, meta pills, left/right toolbar, sortable table, total footer, and pagination.
 */
export default function DataTableCard({
  title,
  day = 'THURSDAY',
  date = '2026-07-23',
  columns = [],
  data = [],
  totals = null,
  isLoading = false,
  error = null,
  onRefresh = null,
  onSearch = null,
  summaryActions = null,
  toolbarLeft = null,
  searchPlaceholder = 'Search Records',
  fullWidth = false,
  skeletonRowsCount = 3,
  onRowClick = null,
  striped = true,
  enablePagination = false,
  pageSize = 10
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumnKey, setSortColumnKey] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);

  const handleSort = (key) => {
    if (sortColumnKey === key) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumnKey(key);
      setSortDirection('asc');
    }
  };

  // Filter Data
  const filteredData = data.filter((row) => {
    // If onSearch is provided, assume server-side filtering
    if (onSearch || !searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return columns.some((col) => {
      const val = row[col.key];
      return val !== undefined && val !== null && String(val).toLowerCase().includes(term);
    });
  });

  // Sort Data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumnKey) return 0;
    const aVal = a[sortColumnKey] ?? '';
    const bVal = b[sortColumnKey] ?? '';

    const numA = parseFloat(String(aVal).replace(/,/g, ''));
    const numB = parseFloat(String(bVal).replace(/,/g, ''));

    if (!isNaN(numA) && !isNaN(numB)) {
      return sortDirection === 'asc' ? numA - numB : numB - numA;
    }

    const strA = String(aVal).toLowerCase();
    const strB = String(bVal).toLowerCase();

    if (strA < strB) return sortDirection === 'asc' ? -1 : 1;
    if (strA > strB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination calculation
  const totalPages = enablePagination ? Math.ceil(sortedData.length / pageSize) || 1 : 1;
  const paginatedData = enablePagination
    ? sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : sortedData;

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Generate page numbers array (e.g. 1 2 3 4 ...)
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className={`vmm-card ${fullWidth ? 'vmm-card-full-width' : ''}`}>
      {/* Standardized Card Header */}
      <div className="vmm-card-header">
        <span className="vmm-card-title">{title}</span>
        <div className="vmm-card-meta">
          <span className="vmm-meta-btn">{day}</span>
          <span className="vmm-meta-btn">{date}</span>
          {onRefresh && (
            <button
              onClick={onRefresh}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '2px 4px'
              }}
              title="Refresh Data"
            >
              <RefreshCw size={14} className={isLoading ? 'spin-icon' : ''} />
            </button>
          )}
        </div>
      </div>

      {/* Standardized Card Body */}
      <div className="vmm-card-body">
        {error && (
          <div
            style={{
              fontSize: 11,
              background: '#fef2f2',
              color: '#991b1b',
              border: '1px solid #fecaca',
              padding: '4px 10px',
              borderRadius: 4,
              marginBottom: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <AlertCircle size={13} /> {error}
          </div>
        )}

        {summaryActions && (
          <div className="vmm-summary-actions" style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
            {summaryActions}
          </div>
        )}

        {/* Toolbar: Left actions & Right Search bar */}
        <div className="vmm-table-toolbar">
          <div className="vmm-toolbar-left">
            {toolbarLeft}
          </div>
          <div className="vmm-toolbar-right">
            <div className="vmm-search-input">
              <span>Search:</span>
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => {
                  const val = e.target.value;
                  setSearchTerm(val);
                  setCurrentPage(1);
                  if (onSearch) {
                    onSearch(val);
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Main Table Container */}
        <div className="vmm-table-container">
          <table className={`vmm-table ${striped ? 'vmm-table-striped' : ''}`}>
            <thead>
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={col.sortable !== false ? 'sortable' : ''}
                    onClick={() => col.sortable !== false && handleSort(col.key)}
                  >
                    {col.label}{' '}
                    {col.sortable !== false && (
                      <ArrowUpDown size={10} style={{ opacity: sortColumnKey === col.key ? 1 : 0.4 }} />
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                [...Array(skeletonRowsCount)].map((_, rIdx) => (
                  <tr key={`skel-row-${rIdx}`} className="vmm-skeleton-row">
                    {columns.map((col, cIdx) => (
                      <td key={`skel-col-${cIdx}`}>
                        <span
                          className="vmm-shimmer"
                          style={{
                            width:
                              cIdx === 0
                                ? '50%'
                                : col.key === 'coverage'
                                ? '45px'
                                : col.key === 'syncDate' || col.key === 'date'
                                ? '70%'
                                : '75%'
                          }}
                        />
                      </td>
                    ))}
                  </tr>
                ))
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>
                    No matching records found
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, rowIdx) => (
                  <tr 
                    key={rowIdx} 
                    onClick={() => onRowClick && onRowClick(row)}
                    style={{ cursor: onRowClick ? 'pointer' : 'default' }}
                  >
                    {columns.map((col) => (
                      <td key={col.key}>
                        {col.render ? col.render(row[col.key], row, rowIdx) : row[col.key]}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
            {totals && (
              <tfoot>
                <tr>
                  {columns.map((col, idx) => (
                    <td key={col.key}>
                      {idx === 0
                        ? totals[col.key] || 'TOTAL'
                        : totals[col.key] !== undefined
                        ? totals[col.key]
                        : ''}
                    </td>
                  ))}
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        {/* Optional Pagination Footer */}
        {enablePagination && totalPages > 0 && (
          <div className="vmm-pagination-container">
            <span className="vmm-pagination-info">
              Showing {sortedData.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} to{' '}
              {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} entries
            </span>
            <div className="vmm-pagination-controls">
              <button
                className="vmm-page-btn"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                <ChevronLeft size={13} /> Previous
              </button>
              {getPageNumbers().map((pg) => (
                <button
                  key={pg}
                  className={`vmm-page-btn ${currentPage === pg ? 'active' : ''}`}
                  onClick={() => handlePageChange(pg)}
                >
                  {pg}
                </button>
              ))}
              {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
                <>
                  <span className="vmm-page-ellipsis">...</span>
                  <button
                    className={`vmm-page-btn ${currentPage === totalPages ? 'active' : ''}`}
                    onClick={() => handlePageChange(totalPages)}
                  >
                    {totalPages}
                  </button>
                </>
              )}
              <button
                className="vmm-page-btn"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next <ChevronRight size={13} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
