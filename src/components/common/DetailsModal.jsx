import React, { useState } from 'react';
import CurvedCard from './CurvedCard';
import ReportDataTableCard from './ReportDataTableCard';

export default function DetailsModal({
  onClose,
  title = 'VIEW DETAILS',
  metaInfo = [], 
  summaryCards = [], 
  tableColumns = [],
  tableData = [],
  totalRecords = 0,
}) {
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  return (
    <div className="vmm-modal-overlay" style={{ zIndex: 9999, backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
      <div className="vmm-modal-content" style={{ width: '95%', maxWidth: '1600px', height: '90vh', display: 'flex', flexDirection: 'column', backgroundColor: '#e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
        
        {/* Header */}
        <div className="vmm-modal-header" style={{ backgroundColor: '#e2e8f0', borderBottom: '2px solid #cbd5e1', padding: '15px 25px', display: 'flex', justifyContent: 'space-between' }}>
          <div className="vmm-modal-title" style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e293b', textTransform: 'uppercase' }}>{title}</div>
          <button onClick={onClose} style={{ border: 'none', background: 'transparent', fontSize: '18px', cursor: 'pointer', fontWeight: 'bold', color: '#1e293b' }}>X</button>
        </div>

        {/* Body */}
        <div className="vmm-modal-body" style={{ flex: 1, overflowY: 'auto', padding: '25px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Meta Info */}
          {metaInfo && metaInfo.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '13px', color: '#334155', padding: '0 10px' }}>
              {metaInfo.map((meta, idx) => (
                <div key={idx}>
                  {meta.label} : <span style={{ color: meta.valueColor || 'inherit' }}>{meta.value}</span>
                </div>
              ))}
            </div>
          )}

          {/* CurvedCards Grid */}
          {summaryCards && summaryCards.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(summaryCards.length, 6)}, 1fr)`, gap: '15px' }}>
              {summaryCards.map((card, idx) => (
                <CurvedCard 
                  key={idx}
                  title={card.title} 
                  value={card.value} 
                  waveColor={card.waveColor} 
                  icon={card.icon} 
                />
              ))}
            </div>
          )}

          {/* Data Table */}
          {tableColumns && tableColumns.length > 0 && (
            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <ReportDataTableCard 
                columns={tableColumns}
                data={tableData}
                pageIndex={pageIndex}
                onPageChange={setPageIndex}
                pageSize={pageSize}
                onPageSizeChange={setPageSize}
                totalRecords={totalRecords || tableData.length}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
