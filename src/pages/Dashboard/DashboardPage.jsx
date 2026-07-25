import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import DataTableCard from '../../components/common/DataTableCard';
import DonutChartCard from '../../components/charts/DonutChartCard';
import SemiCircleChartCard from '../../components/charts/SemiCircleChartCard';
import '../TagManagement/TagManagement.css';
import './Dashboard.css';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('home');
  const [liveStockData, setLiveStockData] = useState([]);
  const [liveTotals, setLiveTotals] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSearch, setCurrentSearch] = useState('');

  // Cycle Count Data State
  const [cycleCountData, setCycleCountData] = useState([]);
  const [cycleCountTotals, setCycleCountTotals] = useState(null);
  const [isCycleCountLoading, setIsCycleCountLoading] = useState(true);
  const [cycleCountError, setCycleCountError] = useState(null);
  const [currentCycleSearch, setCurrentCycleSearch] = useState('');

  // Tag Management Mock Data
  const inventoryData = [
    { name: 'Inventory at Store', value: 244982, displayValue: '2,44,982', percent: 49.52, color: '#8b5cf6' },
    { name: 'Inventory at Warehouse', value: 249744, displayValue: '2,49,744', percent: 50.48, color: '#2dd4bf' }
  ];

  const recycleData = [
    { name: '1', value: 55578, displayValue: '55,578', percent: 11.23, color: '#4ade80' },
    { name: '2', value: 90487, displayValue: '90,487', percent: 18.29, color: '#fbbf24' },
    { name: '3', value: 112114, displayValue: '1,12,114', percent: 22.66, color: '#2dd4bf' },
    { name: '4', value: 106788, displayValue: '1,06,788', percent: 21.59, color: '#60a5fa' },
    { name: '>=5', value: 129759, displayValue: '1,29,759', percent: 26.23, color: '#c084fc' }
  ];

  // Vendor Discrepancy Data State
  const [vendorData, setVendorData] = useState([]);
  const [vendorTotals, setVendorTotals] = useState(null);
  const [isVendorLoading, setIsVendorLoading] = useState(true);
  const [vendorError, setVendorError] = useState(null);
  const [currentVendorSearch, setCurrentVendorSearch] = useState('');

  const fetchVendorDiscrepancyData = async (searchQuery = '') => {
    setIsVendorLoading(true);
    setVendorError(null);
    try {
      const response = await fetch(`http://localhost:5000/api/stock/vendor-hu-discrepancy?pageIndex=1&pageSize=100&searchTerm=${encodeURIComponent(searchQuery)}&sortColumn=DIFF_TILL_DATE&sortDirection=asc&userId=26`, {
        headers: {
          'Accept': 'application/json'
        }
      });
      if (!response.ok) throw new Error(`Failed to fetch vendor data: ${response.statusText}`);
      const data = await response.json();
      setVendorData(data.items || []);
      if (data.summary) {
        setVendorTotals({
          VENDOR_CODE: 'TOTAL',
          ACTUAL_QTY: data.summary.actualQty?.toLocaleString('en-IN') || 0,
          SCANNED_QTY: data.summary.scannedQty?.toLocaleString('en-IN') || 0,
          DIFF_QTY: data.summary.differenceQty?.toLocaleString('en-IN') || 0,
          DIFF_TILL_DATE: data.summary.differenceQtyTillDate?.toLocaleString('en-IN') || 0
        });
      }
    } catch (err) {
      console.error("Error fetching vendor data:", err);
      setVendorError("Unable to load vendor discrepancy data.");
    } finally {
      setIsVendorLoading(false);
    }
  };

  const fetchLiveStockData = async (searchQuery = '') => {
    setIsLoading(true);
    setError(null);
    try {
      // Using the exact API endpoint provided, with dynamic searchTerm
      const response = await fetch(`http://localhost:5000/api/stock/live-details?pageIndex=1&pageSize=100&searchTerm=${encodeURIComponent(searchQuery)}&userId=26`, {
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }

      const data = await response.json();

      setLiveStockData(data.items || []);

      if (data.summary) {
        setLiveTotals({
          STORE_CODE: 'TOTAL',
          SAP_STOCK: data.summary.sapQty?.toLocaleString('en-IN') || 0,
          RFID_STOCK: data.summary.rfidQty?.toLocaleString('en-IN') || 0,
          DIFFERENCE: data.summary.diffQty?.toLocaleString('en-IN') || 0
        });
      }
    } catch (err) {
      console.error("Error fetching live stock data:", err);
      setError("Unable to load live stock data. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCycleCountData = async (searchQuery = '') => {
    setIsCycleCountLoading(true);
    setCycleCountError(null);
    try {
      const response = await fetch(`http://localhost:5000/api/stock/cycle-count-dashboard?pageIndex=1&pageSize=100&searchTerm=${encodeURIComponent(searchQuery)}&sortColumn=STORE%20CODE&sortDirection=ASC&userId=26`, {
        headers: {
          'Accept': 'application/json'
        }
      });
      if (!response.ok) throw new Error(`Failed to fetch cycle count data: ${response.statusText}`);
      const data = await response.json();
      setCycleCountData(data.items || []);
      if (data.summary) {
        setCycleCountTotals({
          STORE_CODE: 'TOTAL',
          REF_NO: data.summary.refNo,
        });
      }
    } catch (err) {
      console.error("Error fetching cycle count data:", err);
      setCycleCountError("Unable to load cycle count data.");
    } finally {
      setIsCycleCountLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchLiveStockData(currentSearch);
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [currentSearch]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchCycleCountData(currentCycleSearch);
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [currentCycleSearch]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchVendorDiscrepancyData(currentVendorSearch);
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [currentVendorSearch]);

  // Columns for the Live Stock Table Headers based on API response
  const liveStockColumns = [
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
  const cycleCountColumns = [
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
  const vendorDiscrepancyColumns = [
    { key: 'VENDOR_CODE', label: 'Vendor Code' },
    { key: 'VENDOR_NAME', label: 'Vendor Name' },
    { key: 'ACTUAL_QTY', label: 'Expected Qty', render: (val) => <span className="vmm-link-num">{typeof val === 'number' ? val.toLocaleString('en-IN') : val}</span> },
    { key: 'SCANNED_QTY', label: 'Actual Qty', render: (val) => <span className="vmm-link-num">{typeof val === 'number' ? val.toLocaleString('en-IN') : val}</span> },
    { key: 'DIFF_QTY', label: 'Diff Qty', render: (val) => <span className="vmm-link-num">{typeof val === 'number' ? val.toLocaleString('en-IN') : val}</span> },
    { key: 'DIFF_TILL_DATE', label: 'Diff Qty (From 27-06-2026)', render: (val) => <span className="vmm-link-num">{typeof val === 'number' ? val.toLocaleString('en-IN') : val}</span> }
  ];

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
              onRefresh={() => fetchLiveStockData(currentSearch)}
              onSearch={(term) => setCurrentSearch(term)}
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
              onRefresh={() => fetchCycleCountData(currentCycleSearch)}
              onSearch={(term) => setCurrentCycleSearch(term)}
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
                    data={inventoryData}
                    totalValue="4,94,726"
                  />
                  <SemiCircleChartCard
                    data={recycleData}
                    totalValue="4,94,726"
                    avgCount="3"
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
              onRefresh={() => fetchVendorDiscrepancyData(currentVendorSearch)}
              onSearch={(term) => setCurrentVendorSearch(term)}
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
