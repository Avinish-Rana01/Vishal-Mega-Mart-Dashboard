import React from 'react';
import DataTableCard from '../../../components/common/DataTableCard';
import { cycleCountColumns } from '../dashboardColumns';
import { useCycleCount } from '../../../hooks/useDashboardData';

export default function CycleCountSection() {
  const {
    data,
    totals,
    isLoading,
    error,
    setSearchQuery,
    refresh
  } = useCycleCount();

  return (
    <DataTableCard
      title="CYCLE COUNT DASHBOARD"
      columns={cycleCountColumns}
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
