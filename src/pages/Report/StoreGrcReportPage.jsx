import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import ReportDataTableCard from '../../components/common/ReportDataTableCard';
import SearchableDropdown from '../../components/common/SearchableDropdown';
import { getReportStores, getStoreGrcReport } from '../../services/stockService';
import './StoreGrcReport.css'; // We will create this or use LiveStockReport.css

export default function StoreGrcReportPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Helper to format date without timezone shift
  const formatDate = (date) => {
    const offset = date.getTimezoneOffset();
    const adjustedDate = new Date(date.getTime() - (offset * 60 * 1000));
    return adjustedDate.toISOString().split('T')[0];
  };

  // Determine dates for past 7 days by default, or from passed rowDate
  const rowDate = location.state?.rowDate;
  let defaultToDate, defaultFromDate;

  if (rowDate) {
    let passedDate = new Date(rowDate);
    
    // If it failed to parse natively, try to parse DD-MM-YYYY or DD-MMM-YYYY manually
    if (isNaN(passedDate)) {
      const parts = String(rowDate).split(/[-/ T]/);
      if (parts.length >= 3 && parts[0].length === 2 && parts[2].length === 4) {
        let monthStr = parts[1];
        if (isNaN(monthStr)) {
          const mNames = { jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06', jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12' };
          monthStr = mNames[monthStr.toLowerCase()] || '01';
        }
        passedDate = new Date(`${parts[2]}-${monthStr}-${parts[0]}`);
      }
    }

    if (!isNaN(passedDate)) {
      defaultToDate = formatDate(passedDate);
      const lastWeek = new Date(passedDate);
      lastWeek.setDate(lastWeek.getDate() - 7);
      defaultFromDate = formatDate(lastWeek);
    }
  }

  if (!defaultToDate || !defaultFromDate) {
    const today = new Date();
    defaultToDate = formatDate(today);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    defaultFromDate = formatDate(lastWeek);
  }

  const { store: initialStore = 'HD44' } = location.state || {};

  const [selectedStore, setSelectedStore] = useState(initialStore);
  const [fromDate, setFromDate] = useState(defaultFromDate);
  const [toDate, setToDate] = useState(defaultToDate);
  const [storeOptions, setStoreOptions] = useState([]);
  
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reportSummary, setReportSummary] = useState(null);

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Fetch Store Dropdown Options
  useEffect(() => {
    const controller = new AbortController();
    const fetchStores = async () => {
      try {
        const data = await getReportStores('2026-07-01', '2026-07-31', controller.signal);
        setStoreOptions(data);
      } catch (err) {
        if (err.name !== 'AbortError') console.error("Failed to fetch stores", err);
      }
    };
    fetchStores();
    return () => controller.abort();
  }, []);

  // Fetch Report Data
  useEffect(() => {
    const controller = new AbortController();
    const fetchReport = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await getStoreGrcReport(selectedStore, fromDate, toDate, pageIndex, pageSize, controller.signal);
        
        if (controller.signal.aborted) return;
        
        const mappedData = (result.items || []).map((item) => ({
          srNo: item.RowNumber || item.SR_NO || item.srNo,
          date: (item.GRC_DATE || item.DATE) ? (item.GRC_DATE || item.DATE).split('T')[0] : '',
          huReceivedQty: item.HU_RECEIVED_QTY,
          whValidatedQty: item.HU_VALIDATED_QTY,
          storeValidatedQty: item.HHT_VALIDATE_QTY,
          pendingQty: item.STORE_PENDING_QTY,
          wrongHuQty: item.HU_WRONG_QTY
        }));
        
        setTableData(mappedData);

        if (result.summary) {
          // Calculate pending if not provided directly in summary
          const received = result.summary.huReceivedQty || 0;
          const hhtValidated = result.summary.hhtValidateQty || 0;
          const pending = received - hhtValidated;

          setReportSummary({
            huReceivedQty: result.summary.huReceivedQty,
            whValidatedQty: result.summary.huValidatedQty,
            storeValidatedQty: result.summary.hhtValidateQty,
            pendingQty: pending,
            wrongHuQty: result.summary.wrongHuQty,
            totalRecords: result.summary.totalCount || result.totalRecords
          });
        }
      } catch (err) {
        if (err.name === 'AbortError') return;
        console.error("Error fetching store GRC report:", err);
        setError("Unable to load report data.");
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };
    fetchReport();
    return () => controller.abort();
  }, [selectedStore, fromDate, toDate, pageIndex, pageSize]);

  const numRenderer = (val) => <span className="vmm-link-num">{typeof val === 'number' ? val.toLocaleString('en-IN') : val}</span>;

  const columns = [
    { key: 'srNo', label: 'SR.NO' },
    { key: 'date', label: 'DATE' },
    { key: 'huReceivedQty', label: 'HU RECEIVED QTY', render: numRenderer },
    { key: 'whValidatedQty', label: 'WH VALIDATED QTY', render: numRenderer },
    { key: 'storeValidatedQty', label: 'STORE VALIDATED QTY', render: numRenderer },
    { key: 'pendingQty', label: 'STORE PENDING FOR VALIDATION (QTY)', render: numRenderer },
    { key: 'wrongHuQty', label: 'WRONG HU QTY', render: numRenderer }
  ];

  return (
    <div className="vmm-dashboard-layout">
      <Sidebar />

      <div className="vmm-main-wrapper">
        <Header 
          breadcrumb={<>HOME - PAGES - REPORT - <span className="active">STORE GRC REPORT</span></>}
          showBackButton={true}
          onBackClick={() => navigate('/dashboard')}
        />

        <main className="vmm-dashboard-body">
          {/* Search Card */}
          <div className="report-search-card">
            <div className="report-search-header">
              <span>NOTE : FIELDS MARKED WITH (*) ARE REQUIRED</span>
            </div>
            <div className="report-search-body" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
              <div className="search-field">
                <label>Store Code *</label>
                <SearchableDropdown
                  value={selectedStore}
                  onChange={(val) => {
                    setSelectedStore(val);
                    setPageIndex(1);
                  }}
                  options={storeOptions}
                  placeholder="Select Store Code"
                />
              </div>
              <div className="search-field">
                <label>From Date *</label>
                <div className="input-group">
                  <input 
                    type="date" 
                    value={fromDate} 
                    onChange={(e) => {
                      setFromDate(e.target.value);
                      setPageIndex(1);
                    }} 
                  />
                </div>
              </div>
              <div className="search-field">
                <label>To Date *</label>
                <div className="input-group">
                  <input 
                    type="date" 
                    value={toDate} 
                    onChange={(e) => {
                      setToDate(e.target.value);
                      setPageIndex(1);
                    }} 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Curved Cards */}
          <div className="report-curved-cards grc-report-cards">
            <div className="curve-card card-sap">
              <div className="card-top">
                <div className="card-content">
                  <p>HU RECEIVED QTY</p>
                  <h3>{reportSummary?.huReceivedQty?.toLocaleString('en-IN') || '0'}</h3>
                </div>
              </div>
            </div>

            <div className="curve-card card-rfid" style={{ backgroundColor: '#ffffffff' }}>
              <div className="card-top">
                <div className="card-content">
                  <p>WH VALIDATED QTY</p>
                  <h3>{reportSummary?.whValidatedQty?.toLocaleString('en-IN') || '0'}</h3>
                </div>
              </div>
            </div>

            <div className="curve-card card-rfid" style={{ backgroundColor: '#ffffffff' }}>
              <div className="card-top">
                <div className="card-content">
                  <p>STORE VALIDATED QTY</p>
                  <h3>{reportSummary?.storeValidatedQty?.toLocaleString('en-IN') || '0'}</h3>
                </div>
              </div>
            </div>

            <div className="curve-card card-diff" style={{ backgroundColor: '#ffffffff' }}>
              <div className="card-top">
                <div className="card-content">
                  <p>PENDING FOR VALIDATION</p>
                  <h3>{reportSummary?.pendingQty?.toLocaleString('en-IN') || '0'}</h3>
                </div>
              </div>
            </div>

            <div className="curve-card card-diff" style={{ backgroundColor: '#ffffffff' }}>
              <div className="card-top">
                <div className="card-content">
                  <p>WRONG HU QTY</p>
                  <h3>{reportSummary?.wrongHuQty?.toLocaleString('en-IN') || '0'}</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div style={{ padding: '0 15px', paddingBottom: '10px' }}>
            <ReportDataTableCard 
              columns={columns} 
              data={tableData} 
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
