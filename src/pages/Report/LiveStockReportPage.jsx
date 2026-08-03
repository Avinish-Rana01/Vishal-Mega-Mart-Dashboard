import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import ReportDataTableCard from '../../components/common/ReportDataTableCard';
import SearchableDropdown from '../../components/common/SearchableDropdown';
import './LiveStockReport.css';

export default function LiveStockReportPage() {
  const [activeNav, setActiveNav] = useState('Report');
  const location = useLocation();
  const navigate = useNavigate();

  const { store: initialStore = 'HD44', date: initialDate = '2026-07-20' } = location.state || {};

  const [selectedStore, setSelectedStore] = useState(initialStore);
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [storeOptions, setStoreOptions] = useState([]);
  
  const [articleData, setArticleData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reportSummary, setReportSummary] = useState(null);

  // Fetch Store Dropdown Options
  React.useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/report/stores?userId=26&fromDate=2026-07-01&toDate=2026-07-31`, {
          headers: { 'Accept': 'application/json' }
        });
        if (response.ok) {
          const data = await response.json();
          setStoreOptions(data);
        }
      } catch (err) {
        console.error("Failed to fetch stores", err);
      }
    };
    fetchStores();
  }, []);

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Article Autocomplete State
  const [articleSearchTerm, setArticleSearchTerm] = useState('');
  const [articleOptions, setArticleOptions] = useState([]);
  const [isArticleSearching, setIsArticleSearching] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState('');

  // Fetch Article Options based on search term
  React.useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      setIsArticleSearching(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/report/articles/search?searchTerm=${encodeURIComponent(articleSearchTerm)}&storeCode=${encodeURIComponent(selectedStore)}&fromDate=2026-07-01&toDate=2026-07-31`, {
          headers: { 'Accept': 'application/json' }
        });
        if (response.ok) {
          const data = await response.json();
          setArticleOptions(data);
        }
      } catch (err) {
        console.error("Failed to fetch articles", err);
      } finally {
        setIsArticleSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [articleSearchTerm, selectedStore]);

  React.useEffect(() => {
    const fetchReport = async () => {
      setIsLoading(true);
      setError(null);
      try {
        let queryUrl = `${import.meta.env.VITE_API_BASE_URL}/api/report/live-stock?pageIndex=${pageIndex}&pageSize=${pageSize}&storeName=${encodeURIComponent(selectedStore)}&stockDate=${encodeURIComponent(selectedDate)}&sortColumn=STOCK_DATE&sortDirection=asc`;
        if (selectedArticle) {
          queryUrl += `&articleNo=${encodeURIComponent(selectedArticle)}`;
        }
        
        const response = await fetch(queryUrl, {
          headers: { 'Accept': 'application/json' }
        });
        if (!response.ok) throw new Error(`Failed to fetch report data`);
        const result = await response.json();
        
        // Map the new API fields to the table columns expected
        const mappedData = (result.data || []).map((item) => ({
          srNo: item.RowNumber,
          stockDate: item.STOCK_DATE ? item.STOCK_DATE.split('T')[0] : '',
          articleNo: item.ARTICLE,
          sapStock: item.SAP_STOCK,
          rfidStock: item.RFID_STOCK,
          diff: item.DIFF
        }));
        
        setArticleData(mappedData);
        if (result.summary) {
          setReportSummary({
            sapQty: result.summary.sapStockCount,
            rfidQty: result.summary.rfidStockCount,
            diffQty: result.summary.differenceCount,
            totalRecords: result.summary.totalRecords
          });
        }
      } catch (err) {
        console.error("Error fetching live stock report:", err);
        setError("Unable to load report data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchReport();
  }, [selectedStore, selectedDate, pageIndex, pageSize, selectedArticle]);

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
                <SearchableDropdown
                  value={selectedStore}
                  onChange={(val) => setSelectedStore(val)}
                  options={storeOptions}
                  placeholder="Select Store Code"
                />
              </div>
              <div className="search-field">
                <label>Stock Date</label>
                <div className="input-group">
                  <input type="text" value={selectedDate} readOnly />
                </div>
              </div>
              <div className="search-field">
                <label>Article No</label>
                <SearchableDropdown
                  value={selectedArticle}
                  onChange={(val) => {
                    setSelectedArticle(val);
                    setArticleSearchTerm(val);
                  }}
                  options={articleOptions}
                  placeholder="Select Article No"
                  searchPlaceholder="Search Article No"
                  isAsync={true}
                  onSearchChange={setArticleSearchTerm}
                  isLoading={isArticleSearching}
                />
              </div>
              <div className="search-buttons">
                <button className="btn-search">Search</button>
                <button className="btn-clear">Clear</button>
              </div>
            </div>
          </div>

          {/* Stats Header */}
          <div className="report-stats-header">
            <div className="store-info">SELECTED STORE : {selectedStore} - UTTAM NAGAR 2</div>
            <div className="date-info">STOCK DATE : {selectedDate}</div>
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
          <div style={{ padding: '0 20px', marginBottom: '40px' }}>
            <ReportDataTableCard 
              columns={columns} 
              data={articleData} 
              isLoading={isLoading} 
              striped={true}
              pageIndex={pageIndex}
              onPageChange={setPageIndex}
              pageSize={pageSize}
              onPageSizeChange={setPageSize}
              totalRecords={reportSummary?.totalRecords || 0}
            />
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
