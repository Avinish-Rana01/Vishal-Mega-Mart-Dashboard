import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import DataTableCard from '../../components/common/DataTableCard';
import DonutChartCard from '../../components/charts/DonutChartCard';
import SemiCircleChartCard from '../../components/charts/SemiCircleChartCard';
import '../TagManagement/TagManagement.css';
import './Dashboard.css';

import {
  liveStockColumns,
  cycleCountColumns,
  vendorDiscrepancyColumns
} from './dashboardColumns';

import {
  useLiveStock,
  useCycleCount,
  useVendorDiscrepancy,
  useTagCharts
} from '../../hooks/useDashboardData';

export default function DashboardPage() {
  const navigate = useNavigate();

  const {
    data: liveStockData,
    totals: liveTotals,
    isLoading,
    error,
    setSearchQuery: setCurrentSearch,
    refresh: fetchLiveStockData
  } = useLiveStock();

  const {
    data: cycleCountData,
    totals: cycleCountTotals,
    isLoading: isCycleCountLoading,
    error: cycleCountError,
    setSearchQuery: setCurrentCycleSearch,
    refresh: fetchCycleCountData
  } = useCycleCount();

  const {
    data: vendorData,
    totals: vendorTotals,
    isLoading: isVendorLoading,
    error: vendorError,
    setSearchQuery: setCurrentVendorSearch,
    refresh: fetchVendorDiscrepancyData
  } = useVendorDiscrepancy();

  const {
    locationData: tagLocationData,
    locationTotal: tagLocationTotal,
    cycleData: tagCycleData,
    cycleTotal: tagCycleTotal,
    avgRecycle,
    isLoading: isTagChartsLoading
  } = useTagCharts();

  return (
    <div className="vmm-dashboard-layout">
      <Sidebar />
      <div className="vmm-main-wrapper">
        <Header />
        <main className="vmm-dashboard-body">
          <div className="vmm-cards-grid">
            <DataTableCard
              title="LIVE STOCK"
              columns={liveStockColumns}
              data={liveStockData}
              totals={liveTotals}
              isLoading={isLoading}
              error={error}
              onRefresh={fetchLiveStockData}
              onSearch={setCurrentSearch}
              onRowClick={(row) => navigate('/reports/live-stock', { state: { store: row.STORE_CODE, date: row.DATE } })}
              enablePagination={true}
              pageSize={3}
            />
            <DataTableCard
              title="CYCLE COUNT DASHBOARD"
              columns={cycleCountColumns}
              data={cycleCountData}
              totals={cycleCountTotals}
              isLoading={isCycleCountLoading}
              error={cycleCountError}
              onRefresh={fetchCycleCountData}
              onSearch={setCurrentCycleSearch}
              enablePagination={true}
              pageSize={3}
            />
            {/* Tag Management Charts in Full-Width Card */}
            <div className="vmm-card vmm-card-full-width">
              <div className="vmm-card-header">
                <span className="vmm-card-title">TAG MANAGEMENT</span>
                <div className="vmm-card-meta">
                  <span className="vmm-meta-btn">SATURDAY</span>
                  <span className="vmm-meta-btn">2026-07-25</span>
                </div>
              </div>
              <div className="vmm-card-body" style={{ background: '#f8fafc', padding: '12px 16px' }}>
                <div className="vmm-tag-actions">
                  <button className="vmm-btn-primary">View Summary</button>
                </div>
                <div className="vmm-charts-grid">
                  <DonutChartCard
                    data={tagLocationData}
                    totalValue={tagLocationTotal.toLocaleString('en-IN')}
                    isLoading={isTagChartsLoading}
                  />
                  <SemiCircleChartCard
                    data={tagCycleData}
                    totalValue={tagCycleTotal.toLocaleString('en-IN')}
                    avgCount={avgRecycle.toString()}
                    isLoading={isTagChartsLoading}
                  />
                </div>
              </div>
            </div>
            <DataTableCard
              title="VENDOR DISCREPANCY"
              columns={vendorDiscrepancyColumns}
              data={vendorData}
              totals={vendorTotals}
              isLoading={isVendorLoading}
              error={vendorError}
              onRefresh={fetchVendorDiscrepancyData}
              onSearch={setCurrentVendorSearch}
              enablePagination={true}
              pageSize={3}
              fullWidth={true}
            />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
