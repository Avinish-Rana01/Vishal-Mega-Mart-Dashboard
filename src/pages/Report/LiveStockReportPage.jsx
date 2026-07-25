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

  // Mock data for specific store details
  const articleData = [
    { srNo: 1, stockDate: date, articleNo: '1114111497020', sapStock: 1, rfidStock: 0, diff: 1 },
    { srNo: 2, stockDate: date, articleNo: '111411575008', sapStock: 1, rfidStock: 0, diff: 1 },
    { srNo: 3, stockDate: date, articleNo: '111411641010', sapStock: 3, rfidStock: 0, diff: 3 },
    { srNo: 4, stockDate: date, articleNo: '111411648011', sapStock: 1, rfidStock: 0, diff: 1 },
    { srNo: 5, stockDate: date, articleNo: '111411731011', sapStock: 1, rfidStock: 0, diff: 1 },
    { srNo: 6, stockDate: date, articleNo: '111411737008', sapStock: 4, rfidStock: 0, diff: 4 },
    { srNo: 7, stockDate: date, articleNo: '111411795016', sapStock: 1, rfidStock: 0, diff: 1 },
    { srNo: 8, stockDate: date, articleNo: '111411796015', sapStock: 1, rfidStock: 0, diff: 1 },
    { srNo: 9, stockDate: date, articleNo: '111411798005', sapStock: 1, rfidStock: 0, diff: 1 },
    { srNo: 10, stockDate: date, articleNo: '111411833007', sapStock: 1, rfidStock: 0, diff: 1 },
  ];

  const columns = [
    { key: 'srNo', label: 'SR.NO' },
    { key: 'stockDate', label: 'STOCK DATE' },
    { key: 'articleNo', label: 'ARTICLE NO', render: (val) => <span className="vmm-link-num">{val}</span> },
    { key: 'sapStock', label: 'SAP STOCK' },
    { key: 'rfidStock', label: 'RFID STOCK' },
    { key: 'diff', label: 'DIFFERENCE' }
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
                  <h3>1,03,803</h3>
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
                  <h3>76,983</h3>
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
                  <h3>26,820</h3>
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
            />
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
