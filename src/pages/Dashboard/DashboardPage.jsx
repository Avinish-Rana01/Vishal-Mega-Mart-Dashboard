import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import DataTableCard from '../../components/common/DataTableCard';
import './Dashboard.css';

export default function DashboardPage({ username = 'Admin User', onLogout, onNavigate }) {
  const [activeNav, setActiveNav] = useState('home');
  const [liveStockData, setLiveStockData] = useState([]);
  const [liveTotals, setLiveTotals] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSearch, setCurrentSearch] = useState('');

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

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchLiveStockData(currentSearch);
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [currentSearch]);

  // Columns for the Live Stock Table Headers based on API response
  const liveStockColumns = [
    { key: 'STORE_CODE', label: 'STORE', render: (val) => <span className="vmm-link-num">{val}</span> },
    { key: 'SAP_STOCK', label: 'SAP STOCK QTY', render: (val) => <span className="vmm-link-num">{typeof val === 'number' ? val.toLocaleString('en-IN') : val}</span> },
    { key: 'RFID_STOCK', label: 'RFID STOCK QTY', render: (val) => <span className="vmm-link-num">{typeof val === 'number' ? val.toLocaleString('en-IN') : val}</span> },
    { key: 'DIFFERENCE', label: 'DIFFERENCE QTY', render: (val) => <span className="vmm-link-num">{typeof val === 'number' ? val.toLocaleString('en-IN') : val}</span> },
    { key: 'DATE', label: 'SYNC DATE' },
    { key: 'PERCENTAGE', label: 'COVERAGE(%)', render: (val) => <span className="vmm-badge-coverage">{val}%</span> }
  ];

  return (
    <div className="vmm-dashboard-layout">
      <Sidebar activeNav={activeNav} onNavChange={setActiveNav} />

      <div className="vmm-main-wrapper">
        <Header username={username} onLogout={onLogout} />

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
              onRowClick={(row) => onNavigate('liveStockReport', { store: row.STORE_CODE, date: row.DATE })}
            />
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
