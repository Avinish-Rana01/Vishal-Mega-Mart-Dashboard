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

// Tag Management Mock Data (Removed as it is now fetched via API)

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

  // Tag Management Charts State
  const [tagLocationData, setTagLocationData] = useState([]);
  const [tagLocationTotal, setTagLocationTotal] = useState(0);
  const [tagCycleData, setTagCycleData] = useState([]);
  const [tagCycleTotal, setTagCycleTotal] = useState(0);
  const [avgRecycle, setAvgRecycle] = useState(0);

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

  // Fetch Tag Management Chart Data on mount
  useEffect(() => {
    const fetchTagCharts = async () => {
      try {
        const [locResponse, cycleResponse] = await Promise.all([
          fetch('http://localhost:5000/api/stock/tag-management-location'),
          fetch('http://localhost:5000/api/stock/tag-cycle-count')
        ]);

        if (locResponse.ok) {
          const locData = await locResponse.json();
          const total = locData.summary?.recordCount || 0;
          const storeVal = locData.summary?.storeCount || 0;
          const whVal = locData.summary?.warehouseCount || 0;
          setTagLocationTotal(total);
          setTagLocationData([
            { name: 'Inventory at Store', value: storeVal, displayValue: storeVal.toLocaleString('en-IN'), percent: ((storeVal / (total || 1)) * 100).toFixed(2), color: '#8b5cf6' },
            { name: 'Inventory at Warehouse', value: whVal, displayValue: whVal.toLocaleString('en-IN'), percent: ((whVal / (total || 1)) * 100).toFixed(2), color: '#2dd4bf' }
          ]);
        }

        if (cycleResponse.ok) {
          const cycData = await cycleResponse.json();
          const total = cycData.summary?.recordCount || 0;
          setTagCycleTotal(total);
          setAvgRecycle(cycData.summary?.avgTagPercentage || 0);

          const colors = ['#4ade80', '#fbbf24', '#2dd4bf', '#60a5fa', '#c084fc'];
          if (cycData.distribution) {
            const chartData = cycData.distribution.map((item, idx) => ({
              name: item.Count_Range,
              value: item.EPC_Count,
              displayValue: item.EPC_Count.toLocaleString('en-IN'),
              percent: ((item.EPC_Count / (total || 1)) * 100).toFixed(2),
              color: colors[idx % colors.length]
            }));
            setTagCycleData(chartData);
          }
        }
      } catch (err) {
        console.error("Error fetching tag management charts:", err);
      }
    };
    
    fetchTagCharts();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchVendorDiscrepancyData(currentVendorSearch);
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [currentVendorSearch]);

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
                    data={tagLocationData}
                    totalValue={tagLocationTotal.toLocaleString('en-IN')}
                  />
                  <SemiCircleChartCard
                    data={tagCycleData}
                    totalValue={tagCycleTotal.toLocaleString('en-IN')}
                    avgCount={avgRecycle.toString()}
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
