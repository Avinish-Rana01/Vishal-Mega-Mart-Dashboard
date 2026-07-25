import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import DataTableCard from '../../components/common/DataTableCard';
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
        <Header />

        <main className="vmm-dashboard-body">
          {/* Breadcrumb */}
          <div className="vmm-page-header">
            <h2 className="vmm-page-title">REPORT - LIVE STOCK REPORT</h2>
            <div className="vmm-breadcrumb">
              HOME - PAGES - REPORT - <span className="active">LIVE STOCK REPORT</span>
              <button className="btn-back ml-4" onClick={() => navigate('/dashboard')}>
                &larr; Back
              </button>
            </div>
          </div>

          {/* Search Card */}
          <div className="report-search-card">
            <div className="report-search-header">
              <span>NOTE : FIELDS MARKED WITH (*) ARE REQUIRED</span>
            </div>
            <div className="report-search-body">
              <div className="search-field">
                <label>Store Code <span className="text-danger">*</span></label>
                <div className="input-group">
                  <input type="text" value={store} readOnly />
                  <button className="btn-input-clear">&times;</button>
                </div>
              </div>
              <div className="search-field">
                <label>Stock Date <span className="text-danger">*</span></label>
                <div className="input-group">
                  <input type="text" value={date} readOnly />
                  <span className="input-group-text"><i className="lucide-calendar"></i></span>
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
                  <h3>{reportSummary?.sapQty?.toLocaleString('en-IN') || '0'}</h3>
                </div>
                <div className="card-icon sap-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-box"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
                </div>
              </div>
            </div>

            <div className="curve-card card-rfid">
              <div className="card-top">
                <div className="card-content">
                  <p>RFID STOCK COUNT</p>
                  <h3>{reportSummary?.rfidQty?.toLocaleString('en-IN') || '0'}</h3>
                </div>
                <div className="card-icon rfid-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-tags"><path d="m15 5 6.3 6.3a2.4 2.4 0 0 1 0 3.4L17 19"/><path d="M9.586 5.586A2 2 0 0 0 8.172 5H3v5.172a2 2 0 0 0 .586 1.414l8.204 8.204a2 2 0 0 0 2.828 0l4.242-4.242a2 2 0 0 0 0-2.828Z"/><circle cx="6.5" cy="8.5" r=".5" fill="currentColor"/></svg>
                </div>
              </div>
            </div>

            <div className="curve-card card-diff">
              <div className="card-top">
                <div className="card-content">
                  <p>DIFFERENCE COUNT</p>
                  <h3>{reportSummary?.diffQty?.toLocaleString('en-IN') || '0'}</h3>
                </div>
                <div className="card-icon diff-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right-left"><path d="m16 3 4 4-4 4"/><path d="M20 7H4"/><path d="m8 21-4-4 4-4"/><path d="M4 17h16"/></svg>
                </div>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="vmm-cards-grid mt-4">
            <DataTableCard
              title="Export Data To Excel"
              columns={columns}
              data={articleData}
              searchPlaceholder="Search Records"
              isLoading={isLoading}
              error={error}
            />
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
