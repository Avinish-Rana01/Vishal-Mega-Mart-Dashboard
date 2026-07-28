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

// Columns for Store Validation Dashboard
export const storeDashboardColumns = [
  { key: 'DATE', label: 'DATE' },
  { key: 'STORE', label: 'STORE', render: (val) => <span className="vmm-link-num">{val}</span> },
  { key: 'STORE_NAME', label: 'STORE NAME' },
  { key: 'HU_RECEIVED_QTY', label: 'HU RECEIVED', render: (val) => <span className="vmm-link-num">{typeof val === 'number' ? val.toLocaleString('en-IN') : val}</span> },
  { key: 'HU_VALIDATED_QTY', label: 'HU VALIDATED', render: (val) => <span className="vmm-link-num">{typeof val === 'number' ? val.toLocaleString('en-IN') : val}</span> },
  { key: 'HHT_VALIDATE_QTY', label: 'HHT VALIDATE', render: (val) => <span className="vmm-link-num">{typeof val === 'number' ? val.toLocaleString('en-IN') : val}</span> },
  { key: 'STORE_PENDING_QTY', label: 'PENDING', render: (val) => <span className="vmm-link-num">{typeof val === 'number' ? val.toLocaleString('en-IN') : val}</span> },
  { key: 'HU_WRONG_QTY', label: 'WRONG QTY', render: (val) => <span className="vmm-link-num">{typeof val === 'number' ? val.toLocaleString('en-IN') : val}</span> }
];

// Columns for Sale Dashboard
export const saleDashboardColumns = [
  { key: 'DATE', label: 'DATE' },
  { key: 'STORE', label: 'STORE', render: (val) => <span className="vmm-link-num">{val}</span> },
  { key: 'STORE_NAME', label: 'STORE NAME' },
  { key: 'TOTAL_DPOS_SALE', label: 'DPOS SALE', render: (val) => <span className="vmm-link-num">{typeof val === 'number' ? val.toLocaleString('en-IN') : val}</span> },
  { key: 'TOTAL_RFID_CHECKOUT', label: 'RFID CHECKOUT', render: (val) => <span className="vmm-link-num">{typeof val === 'number' ? val.toLocaleString('en-IN') : val}</span> },
  { key: 'RFID_CHECKOUT_MATCHING_WITH_DPOS_SALE', label: 'MATCHING', render: (val) => <span className="vmm-link-num" style={{color: '#15803d'}}>{typeof val === 'number' ? val.toLocaleString('en-IN') : val}</span> },
  { key: 'RFID_CHECKOUT_NOT_MATCHING_WITH_DPOS_SALE', label: 'NOT MATCHING', render: (val) => <span className="vmm-link-num" style={{color: '#dc2626'}}>{typeof val === 'number' ? val.toLocaleString('en-IN') : val}</span> },
  { key: 'TOTAL_MANUAL_SALE', label: 'MANUAL SALE', render: (val) => <span className="vmm-link-num">{typeof val === 'number' ? val.toLocaleString('en-IN') : val}</span> },
  { key: 'TOTAL_VOID', label: 'VOID', render: (val) => <span className="vmm-link-num">{typeof val === 'number' ? val.toLocaleString('en-IN') : val}</span> }
];

// Columns for Void Dashboard
export const voidDashboardColumns = [
  { key: 'STORE', label: 'STORE', render: (val) => <span className="vmm-link-num">{val}</span> },
  { key: 'STORE_NAME', label: 'STORE NAME' },
  { key: 'VOID_QTY', label: 'VOID QTY', render: (val) => <span className="vmm-link-num">{typeof val === 'number' ? val.toLocaleString('en-IN') : val}</span> },
  { key: 'ENCODE_QTY', label: 'ENCODE QTY', render: (val) => <span className="vmm-link-num">{typeof val === 'number' ? val.toLocaleString('en-IN') : val}</span> },
  { key: 'DIFFERENCE_QTY', label: 'DIFFERENCE', render: (val) => <span className="vmm-link-num" style={{color: '#dc2626'}}>{typeof val === 'number' ? val.toLocaleString('en-IN') : val}</span> }
];

// Columns for Return Dashboard
export const returnDashboardColumns = [
  { key: 'DATE', label: 'DATE' },
  { key: 'Store_Code', label: 'STORE', render: (val) => <span className="vmm-link-num">{val}</span> },
  { key: 'STORE_NAME', label: 'STORE NAME' },
  { key: 'RETURN_QTY', label: 'RETURN QTY', render: (val) => <span className="vmm-link-num">{typeof val === 'number' ? val.toLocaleString('en-IN') : val}</span> },
  { key: 'ENCODE_QTY', label: 'ENCODE QTY', render: (val) => <span className="vmm-link-num">{typeof val === 'number' ? val.toLocaleString('en-IN') : val}</span> },
  { key: 'DIFFERENCE_QTY', label: 'DIFFERENCE', render: (val) => <span className="vmm-link-num" style={{color: '#dc2626'}}>{typeof val === 'number' ? val.toLocaleString('en-IN') : val}</span> }
];

// Columns for Warehouse Encoding Dashboard
export const warehouseEncodingColumns = [
  { key: 'timeBlock', label: 'TIME' },
  { key: 'count', label: 'ENCODING COUNT', render: (val) => <span className="vmm-link-num">{typeof val === 'number' ? val.toLocaleString('en-IN') : val}</span> }
];

export const dcValidationColumns = [
  { key: 'Reciving_Plant', label: 'STORE', minWidth: '150px' },
  { key: 'PROCESSED_HU', label: 'PROCESSED HU QTY', type: 'number', render: (val) => <span className="vmm-link-num">{typeof val === 'number' ? val.toLocaleString('en-IN') : val}</span> },
  { key: 'UNPROCESSED_HU', label: 'UNPROCESSED HU QTY', type: 'number', render: (val) => <span className="vmm-link-num">{typeof val === 'number' ? val.toLocaleString('en-IN') : val}</span> },
  { key: 'PROCESSED_ARTICLE_QTY', label: 'VALIDATED HU ARTICLE QTY', type: 'number', render: (val) => <span className="vmm-link-num">{typeof val === 'number' ? val.toLocaleString('en-IN') : val}</span> }
];
