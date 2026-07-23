import React, { useState } from 'react';
import { ArrowUpDown, RefreshCw, AlertCircle } from 'lucide-react';

/**
 * Reusable DataTableCard Component
 * Renders a card container with header, meta pills, search bar, sortable table, and total footer.
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
  summaryActions = null,
  searchPlaceholder = 'Search Records',
  fullWidth = false
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumnKey, setSortColumnKey] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (key) => {
    if (sortColumnKey === key) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumnKey(key);
      setSortDirection('asc');
    }
  };

  const filteredData = data.filter((row) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return columns.some((col) => {
      const val = row[col.key];
      return val !== undefined && val !== null && String(val).toLowerCase().includes(term);
    });
  });

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

  return (
    <div className={`vmm-card ${fullWidth ? 'vmm-card-full-width' : ''}`}>
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

        <div className="vmm-table-toolbar">
          <div className="vmm-search-input">
            <span>Search:</span>
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="vmm-table-container">
          <table className="vmm-table">
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
                <tr>
                  <td colSpan={columns.length} style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
                    Loading data...
                  </td>
                </tr>
              ) : sortedData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>
                    No matching records found
                  </td>
                </tr>
              ) : (
                sortedData.map((row, rowIdx) => (
                  <tr key={rowIdx}>
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
      </div>
    </div>
  );
}
