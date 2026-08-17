import React from 'react';
import { useNavigate } from 'react-router-dom';
import DataTableCard from '../../../components/common/DataTableCard';
import { saleDashboardColumns } from '../dashboardColumns';
import { useSaleDashboard } from '../../../hooks/useDashboardData';

export default function SaleDashboardSection() {
  const navigate = useNavigate();
  const {
    data,
    totals,
    isLoading,
    error,
    setSearchQuery,
    refresh
  } = useSaleDashboard();

  // Override specific columns to be clickable
  const columns = saleDashboardColumns.map(col => {
    if (col.key === 'STORE') {
      return { 
        ...col, 
        render: (val, row) => (
          <span 
            className="vmm-link-num" 
            onClick={(e) => {
              e.stopPropagation();
              navigate('/reports/sale', { 
                state: { 
                  store: val,
                  rowDate: row.DATE || row.Date || row.date
                } 
              });
            }}
          >
            {val}
          </span>
        ) 
      };
    }
    if (['TOTAL_DPOS_SALE', 'TOTAL_RFID_CHECKOUT', 'TOTAL_MANUAL_SALE'].includes(col.key)) {
      return {
        ...col,
        render: (val, row) => (
          <span 
            className="vmm-link-num" 
            onClick={(e) => {
              e.stopPropagation();
              navigate('/reports/sale/detailed', { 
                state: { 
                  store: row.STORE || row.Store || '',
                  rowDate: row.DATE || row.Date || row.date,
                  columnName: col.key
                } 
              });
            }}
          >
            {typeof val === 'number' ? val.toLocaleString('en-IN') : val}
          </span>
        )
      };
    }
    return col;
  });

  return (
    <DataTableCard
      title="SALE"
      columns={columns}
      data={data}
      totals={totals}
      isLoading={isLoading}
      error={error}
      onRefresh={refresh}
      onSearch={setSearchQuery}
      enablePagination={true}
      pageSize={3}
    />
  );
}
