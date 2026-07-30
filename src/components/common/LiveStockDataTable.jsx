import React, { useState, useMemo } from 'react';
import './LiveStockDataTable.css';

export default function LiveStockDataTable({
  columns = [],
  data = [],
  isLoading = false
}) {
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumnKey, setSortColumnKey] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' or 'desc'
  const [currentPage, setCurrentPage] = useState(1);

  // Handle Sorting
  const handleSort = (key) => {
    if (sortColumnKey === key) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumnKey(key);
      setSortDirection('asc');
    }
    setCurrentPage(1); // Reset to first page on sort
  };

  // 1. Filter Data
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;
    const term = searchTerm.toLowerCase();
    return data.filter((row) => {
      return columns.some((col) => {
        const val = row[col.key];
        return val !== undefined && val !== null && String(val).toLowerCase().includes(term);
      });
    });
  }, [data, searchTerm, columns]);

  // 2. Sort Data
  const sortedData = useMemo(() => {
    if (!sortColumnKey) return filteredData;
    
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortColumnKey] ?? '';
      const bVal = b[sortColumnKey] ?? '';

      // Try numeric sort first
      const numA = parseFloat(String(aVal).replace(/,/g, ''));
      const numB = parseFloat(String(bVal).replace(/,/g, ''));

      if (!isNaN(numA) && !isNaN(numB)) {
        return sortDirection === 'asc' ? numA - numB : numB - numA;
      }

      // Fallback to string sort
      const strA = String(aVal).toLowerCase();
      const strB = String(bVal).toLowerCase();

      if (strA < strB) return sortDirection === 'asc' ? -1 : 1;
      if (strA > strB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortColumnKey, sortDirection]);

  // 3. Paginate Data
  const totalEntries = sortedData.length;
  const totalPages = Math.ceil(totalEntries / pageSize) || 1;
  
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize]);

  // Handle Export to CSV
  const handleExportCSV = () => {
    if (sortedData.length === 0) return;
    
    // Headers
    const headers = columns.map(c => c.label).join(',');
    
    // Rows
    const csvRows = sortedData.map(row => {
      return columns.map(col => {
        let val = row[col.key];
        if (val === null || val === undefined) val = '';
        val = String(val).replace(/"/g, '""'); // escape quotes
        return `"${val}"`;
      }).join(',');
    });

    const csvContent = [headers, ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "LiveStock_Report.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Pagination Logic
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

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

  const pageNumbers = getPageNumbers();

  return (
    <div className="ls-table-wrapper">
      
      <div className="ls-toolbar-top">
        <button className="ls-export-btn" onClick={handleExportCSV}>
          Export Data To Excel
        </button>
        
        <div className="ls-toolbar-controls">
          <div className="ls-entries-select">
            <span>Show</span>
            <select 
              value={pageSize} 
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>entries</span>
          </div>
          
          <div className="ls-search-box">
            <span>Search:</span>
            <input 
              type="text" 
              placeholder="Search Records" 
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
      </div>

      <div className="ls-table-container">
        <table className="ls-table">
          <thead>
            <tr>
              {columns.map((col) => {
                const isSorted = sortColumnKey === col.key;
                const isAsc = isSorted && sortDirection === 'asc';
                const isDesc = isSorted && sortDirection === 'desc';
                
                return (
                  <th key={col.key} onClick={() => handleSort(col.key)}>
                    <div className="sort-arrows">
                      <span className={isAsc ? 'active' : ''}>↑</span>
                    </div>
                    {col.label}
                    <div className="sort-arrows">
                      <span className={isDesc ? 'active' : ''}>↓</span>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} style={{ padding: '20px' }}>Loading data...</td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} style={{ padding: '20px' }}>No entries found</td>
              </tr>
            ) : (
              paginatedData.map((row, idx) => (
                <tr key={idx}>
                  {columns.map((col) => (
                    <td key={col.key}>
                      {col.render ? col.render(row[col.key], row, idx) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="ls-toolbar-bottom">
        <div className="ls-pagination-info">
          Showing {totalEntries === 0 ? 0 : (currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalEntries)} of {totalEntries.toLocaleString('en-IN')} entries
        </div>
        
        {totalPages > 1 && (
          <div className="ls-pagination-controls">
            <button 
              className="ls-page-btn" 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            
            {pageNumbers[0] > 1 && (
              <>
                <button className="ls-page-btn" onClick={() => handlePageChange(1)}>1</button>
                {pageNumbers[0] > 2 && <span className="ls-page-ellipsis">...</span>}
              </>
            )}

            {pageNumbers.map(pg => (
              <button 
                key={pg} 
                className={`ls-page-btn ${currentPage === pg ? 'active' : ''}`}
                onClick={() => handlePageChange(pg)}
              >
                {pg}
              </button>
            ))}

            {pageNumbers[pageNumbers.length - 1] < totalPages && (
              <>
                {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && <span className="ls-page-ellipsis">...</span>}
                <button className="ls-page-btn" onClick={() => handlePageChange(totalPages)}>{totalPages}</button>
              </>
            )}
            
            <button 
              className="ls-page-btn" 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
      
    </div>
  );
}
