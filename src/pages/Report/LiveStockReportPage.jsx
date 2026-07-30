import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import LiveStockDataTable from '../../components/common/LiveStockDataTable';
import './LiveStockReport.css';

export default function LiveStockReportPage() {
  const [activeNav, setActiveNav] = useState('Report');
  const location = useLocation();
  const navigate = useNavigate();

  const { store = 'HD44', date = '2026-07-20' } = location.state || {};

  const [articleData, setArticleData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reportSummary, setReportSummary] = useState(null);

  React.useEffect(() => {
    const fetchReport = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const queryUrl = `${import.meta.env.VITE_API_BASE_URL}/api/stock/report?StoreName=${encodeURIComponent(store)}&FromDate=${encodeURIComponent(date)}&ToDate=${encodeURIComponent(date)}&pageIndex=1&pageSize=100`;
        const response = await fetch(queryUrl, {
          headers: { 'Accept': 'application/json' }
        });
        if (!response.ok) throw new Error(`Failed to fetch report data`);
        const data = await response.json();
        
        // Map the API fields to the table columns expected
        const mappedData = (data.items || []).map((item, index) => ({
          srNo: index + 1,
          stockDate: item.DATETIME,
          articleNo: item.ARTICLE,
          sapStock: item.SAP_STOCK,
          rfidStock: item.RFID_STOCK,
          diff: item.DIFFERENCE
        }));
        
        setArticleData(mappedData);
        if (data.summary) {
          setReportSummary(data.summary);
        }
      } catch (err) {
        console.error("Error fetching live stock report:", err);
        setError("Unable to load report data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchReport();
  }, [store, date]);

  const columns = [
    { key: 'srNo', label: 'SR.NO' },
    { key: 'stockDate', label: 'STOCK DATE' },
    { key: 'articleNo', label: 'ARTICLE NO', render: (val) => <span className="vmm-link-num">{val}</span> },
    { key: 'sapStock', label: 'SAP STOCK', render: (val) => <span className="vmm-link-num">{typeof val === 'number' ? val.toLocaleString('en-IN') : val}</span> },
    { key: 'rfidStock', label: 'RFID STOCK', render: (val) => <span className="vmm-link-num">{typeof val === 'number' ? val.toLocaleString('en-IN') : val}</span> },
    { key: 'diff', label: 'DIFFERENCE', render: (val) => <span className="vmm-link-num">{typeof val === 'number' ? val.toLocaleString('en-IN') : val}</span> }
  ];

  return (
    <div className="vmm-dashboard-layout">
      <Sidebar />

      <div className="vmm-main-wrapper">
        <Header 
          breadcrumb={<>HOME - PAGES - REPORT - <span className="active">LIVE STOCK REPORT</span></>}
          showBackButton={true}
          onBackClick={() => navigate('/dashboard')}
        />

        <main className="vmm-dashboard-body">
          {/* Page Header Area */}


          {/* Search Card */}
          <div className="report-search-card">
            <div className="report-search-header">
              <span>NOTE : FIELDS MARKED WITH (*) ARE REQUIRED</span>
            </div>
            <div className="report-search-body">
              <div className="search-field">
                <label>Store Code</label>
                <div className="input-group">
                  <input type="text" value={store} readOnly />
                  <button className="btn-input-clear">&times;</button>
                </div>
              </div>
              <div className="search-field">
                <label>Stock Date</label>
                <div className="input-group">
                  <input type="text" value={date} readOnly />
                </div>
              </div>
              <div className="search-field">
                <label>Article No</label>
                <select>
                  <option>Select Article No</option>
                </select>
              </div>
              <div className="search-buttons">
                <button className="btn-search">Search</button>
                <button className="btn-clear">Clear</button>
              </div>
            </div>
          </div>

          {/* Stats Header */}
          <div className="report-stats-header">
            <div className="store-info">SELECTED STORE : {store} - UTTAM NAGAR 2</div>
            <div className="date-info">STOCK DATE : {date}</div>
          </div>

          {/* Curved Cards */}
          <div className="report-curved-cards">
            <div className="curve-card card-sap">
              <div className="card-top">
                <div className="card-content">
                  <p>SAP STOCK COUNT</p>
                  <h3>{reportSummary?.sapQty?.toLocaleString('en-IN') || '1,03,803'}</h3>
                </div>
                <div className="card-icon sap-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    {/* Top Clip */}
                    <rect x="9" y="3" width="6" height="4" rx="1" />
                    {/* Main Document Body */}
                    <path d="M9 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4" />
                    <path d="M15 3h2a2 2 0 0 1 2 2v4" />
                    {/* Side Tabs */}
                    <path d="M5 8h2" />
                    <path d="M17 8h2" />
                    {/* Document Lines */}
                    <path d="M9 11h6" />
                    <path d="M9 15h3" />
                    {/* Magnifying Glass */}
                    <circle cx="16" cy="16" r="4" fill="#ffffff" />
                    <path d="M18.8 18.8L22 22" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="curve-card card-rfid">
              <div className="card-top">
                <div className="card-content">
                  <p>RFID STOCK COUNT</p>
                  <h3>{reportSummary?.rfidQty?.toLocaleString('en-IN') || '76,983'}</h3>
                </div>
                <div className="card-icon rfid-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
                </div>
              </div>
            </div>

            <div className="curve-card card-diff">
              <div className="card-top">
                <div className="card-content">
                  <p>DIFFERENCE COUNT</p>
                  <h3>{reportSummary?.diffQty?.toLocaleString('en-IN') || '26,820'}</h3>
                </div>
                <div className="card-icon diff-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/></svg>
                </div>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="report-table-container">
            <LiveStockDataTable
              columns={columns}
              data={articleData}
              isLoading={isLoading}
            />
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
