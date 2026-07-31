import React, { useState, useMemo } from 'react';
import BaseDataTable from './BaseDataTable';
import './LiveStockDataTable.css';

export default function ReportDataTableCard({
  columns = [],
  data = [],
  isLoading = false,
  skeletonRowsCount = 10,
  striped = true,
  onRowClick = null,
  totals = null
}) {
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Filter Data Internally (like the original LiveStockDataTable did)
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

  // Handle Export to CSV
  const handleExportCSV = () => {
    if (filteredData.length === 0) return;
    
    // Headers
    const headers = columns.map(c => c.label).join(',');
    
    // Rows
    const csvRows = filteredData.map(row => {
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
              onChange={(e) => setPageSize(Number(e.target.value))}
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
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <BaseDataTable
        columns={columns}
        data={filteredData}
        isLoading={isLoading}
        skeletonRowsCount={skeletonRowsCount}
        onRowClick={onRowClick}
        striped={striped}
        totals={totals}
        enablePagination={true}
        pageSize={pageSize}
        searching={false}
        lengthChange={false}
        domConfig='<"top">rt<"bottom"ip><"clear">'
      />
      
    </div>
  );
}
