import React from 'react';
import DataTableCard from '../../../components/common/DataTableCard';
import { storeDashboardColumns } from '../dashboardColumns';
import { useStoreDashboard } from '../../../hooks/useDashboardData';

export default function StoreValidationSection() {
  const {
    data,
    totals,
    isLoading,
    error,
    setSearchQuery,
    refresh
  } = useStoreDashboard();

  return (
    <DataTableCard
      title="STORE VALIDATION"
      columns={storeDashboardColumns}
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
