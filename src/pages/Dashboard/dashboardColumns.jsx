import React from 'react';

// Columns for the Live Stock Table Headers based on API response
export const liveStockColumns = [
  { key: 'STORE_CODE', label: 'STORE', render: (val) => <span className="vmm-link-num">{val}</span> },
  { key: 'SAP_STOCK', label: 'SAP STOCK QTY', render: (val) => <span className="vmm-link-num">{typeof val === 'number' ? val.toLocaleString('en-IN') : val}</span> },
  { key: 'RFID_STOCK', label: 'RFID STOCK QTY', render: (val) => <span className="vmm-link-num">{typeof val === 'number' ? val.toLocaleString('en-IN') : val}</span> },
  { key: 'DIFFERENCE', label: 'DIFFERENCE QTY', render: (val) => <span className="vmm-link-num">{typeof val === 'number' ? val.toLocaleString('en-IN') : val}</span> },
  { key: 'DATE', label: 'SYNC DATE' },
  {
    key: 'PERCENTAGE',
    label: 'COVERAGE(%)',
    render: (val) => {
      const percent = parseFloat(val) || 0;
      const opacity = Math.max(0.15, percent / 100);
      return (
        <span
          className="vmm-badge-coverage"
          style={{
            backgroundColor: `rgba(46, 125, 50, ${opacity})`,
            color: opacity > 0.6 ? '#ffffff' : '#083a1c'
          }}
        >
          {val}%
        </span>
      );
    }
  }
];

// Columns for Cycle Count Dashboard
export const cycleCountColumns = [
  { key: 'DATE', label: 'DATE' },
  { key: 'STORE_CODE', label: 'STORE', render: (val) => <span className="vmm-link-num">{val}</span> },
  { key: 'STORE_NAME', label: 'STORE NAME' },
  { key: 'CYCLE_COUNT_TYPE', label: 'TYPE' },
  { key: 'REF_NO', label: 'REF NO', render: (val) => <span className="vmm-link-num">{val}</span> },
  { key: 'Start_DateTime', label: 'START TIME' },
  { key: 'END_DateTime', label: 'END TIME' },
  { key: 'Time_Taken', label: 'TIME TAKEN' }
];

// Columns for Vendor Discrepancy
export const vendorDiscrepancyColumns = [
  { key: 'VENDOR_CODE', label: 'Vendor Code' },
  { key: 'VENDOR_NAME', label: 'Vendor Name' },
  { key: 'ACTUAL_QTY', label: 'Expected Qty', render: (val) => <span className="vmm-link-num">{typeof val === 'number' ? val.toLocaleString('en-IN') : val}</span> },
  { key: 'SCANNED_QTY', label: 'Actual Qty', render: (val) => <span className="vmm-link-num">{typeof val === 'number' ? val.toLocaleString('en-IN') : val}</span> },
  { key: 'DIFF_QTY', label: 'Diff Qty', render: (val) => <span className="vmm-link-num">{typeof val === 'number' ? val.toLocaleString('en-IN') : val}</span> },
  { key: 'DIFF_TILL_DATE', label: 'Diff Qty (From 27-06-2026)', render: (val) => <span className="vmm-link-num">{typeof val === 'number' ? val.toLocaleString('en-IN') : val}</span> }
];
