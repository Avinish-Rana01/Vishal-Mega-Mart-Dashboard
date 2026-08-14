import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import ReportDataTableCard from '../../components/common/ReportDataTableCard';
import SearchableDropdown from '../../components/common/SearchableDropdown';
import CurvedCard from '../../components/common/CurvedCard';
import { getReportStores, getStoreSaleReport } from '../../services/stockService';
import './StoreGrcReport.css'; // Reusing the same CSS for identical layout

export default function SaleReportPage() {
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
    const dateOnlyStr = String(rowDate).split(' ')[0];
    let passedDate = new Date(dateOnlyStr);
    
    if (isNaN(passedDate)) {
      const parts = dateOnlyStr.split(/[-/]/);
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
  const [totalRecords, setTotalRecords] = useState(0);

  const [cardGradients, setCardGradients] = useState([
    ['#fff', '#fff'], ['#fff', '#fff'], ['#fff', '#fff'], ['#fff', '#fff']
  ]);

  // Generate 4 random distinct gradients on initial load
  useEffect(() => {
    const baseHue = Math.floor(Math.random() * 360);
    const gradients = [0, 1, 2, 3]
      .map(i => {
        const hue = Math.floor((baseHue + i * (360 / 4)) % 360);
        return [
          `hsl(${hue}, 80%, 75%)`, 
          `hsl(${(hue + 30) % 360}, 85%, 55%)`
        ];
      })
      .sort(() => Math.random() - 0.5);
    setCardGradients(gradients);
  }, []);

  // Fetch Store Dropdown Options
  useEffect(() => {
    const controller = new AbortController();
    const fetchStores = async () => {
      try {
        const data = await getReportStores(controller.signal);
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
        const result = await getStoreSaleReport(selectedStore, fromDate, toDate, pageIndex, pageSize, controller.signal);
        
        if (controller.signal.aborted) return;
        
        const mappedData = (result.items || []).map((item) => ({
          srNo: item.RowNumber || item.SR_NO || item.srNo,
          date: (item.DATE || item.Date) ? (item.DATE || item.Date).split('T')[0] : '',
          totalSaleQty: item.TOTAL_DPOS_SALE || item.TOTAL_SALE_QTY || 0,
          totalRfidCheckoutQty: item.TOTAL_RFID_CHECKOUT || item.TOTAL_RFID_CHECKOUT_QTY || 0,
          totalTaffetaSaleQty: item.TOTAL_TAFFETA_SALE || item.TOTAL_TAFETTA_SALE_QTY || 0,
          totalManualSaleQty: item.TOTAL_MANUAL_SALE || item.TOTAL_MANUAL_SALE_QTY || 0
        }));
        
        setTableData(mappedData);
        setTotalRecords(result.summary?.recordCount || result.summary?.totalCount || result.totalRecords || 0);

        if (result.summary) {
          setReportSummary({
            saleQty: result.summary.posSaleQty || result.summary.totalSaleQty || result.summary.saleQty || result.summary.TOTAL_DPOS_SALE || 0,
            rfidCheckoutQty: result.summary.rfidCheckoutQty || result.summary.totalRfidCheckoutQty || result.summary.TOTAL_RFID_CHECKOUT || 0,
            taffetaSaleQty: result.summary.taffetaSaleQty || result.summary.totalTaffetaSaleQty || result.summary.TOTAL_TAFFETA_SALE || 0,
            manualSaleQty: result.summary.manualSaleQty || result.summary.totalManualSaleQty || result.summary.TOTAL_MANUAL_SALE || 0,
            storeName: result.summary.storeName || (result.items && result.items.length > 0 ? result.items[0].STORE_NAME : null)
          });
        } else {
          // Calculate summary if not provided
          const sumSale = mappedData.reduce((acc, curr) => acc + curr.totalSaleQty, 0);
          const sumRfid = mappedData.reduce((acc, curr) => acc + curr.totalRfidCheckoutQty, 0);
          const sumTaffeta = mappedData.reduce((acc, curr) => acc + curr.totalTaffetaSaleQty, 0);
          const sumManual = mappedData.reduce((acc, curr) => acc + curr.totalManualSaleQty, 0);
          
          setReportSummary({
            saleQty: sumSale,
            rfidCheckoutQty: sumRfid,
            taffetaSaleQty: sumTaffeta,
            manualSaleQty: sumManual,
            storeName: (result.items && result.items.length > 0 ? result.items[0].STORE_NAME : null)
          });
        }
      } catch (err) {
        if (err.name === 'AbortError') return;
        console.error("Error fetching store sale report:", err);
        setError("Unable to load report data.");
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };
    fetchReport();
    return () => controller.abort();
  }, [selectedStore, fromDate, toDate, pageIndex, pageSize]);

  const getSelectedStoreName = () => {
    if (reportSummary?.storeName) return reportSummary.storeName;
    if (!selectedStore) return 'None';
    const options = Array.isArray(storeOptions) ? storeOptions : [];
    const opt = options.find(o => o?.STORE === selectedStore || o?.value === selectedStore);
    return opt?.STORE_NAME || opt?.label || selectedStore;
  };

  const numRenderer = (val) => <span className="vmm-link-num" style={{ color: '#28a745' }}>{typeof val === 'number' ? val.toLocaleString('en-IN') : val}</span>;

  const columns = [
    { key: 'srNo', label: 'SR.NO' },
    { key: 'date', label: 'DATE' },
    { key: 'totalSaleQty', label: 'TOTAL SALE QTY', render: numRenderer },
    { key: 'totalRfidCheckoutQty', label: 'TOTAL RFID CHECKOUT QTY', render: numRenderer },
    { key: 'totalTaffetaSaleQty', label: 'TOTAL TAFFETA SALE QTY', render: numRenderer },
    { key: 'totalManualSaleQty', label: 'TOTAL MANUAL SALE QTY', render: numRenderer }
  ];

  const tableTotals = reportSummary ? {
    srNo: 'TOTAL',
    date: '',
    totalSaleQty: reportSummary.saleQty,
    totalRfidCheckoutQty: reportSummary.rfidCheckoutQty,
    totalTaffetaSaleQty: reportSummary.taffetaSaleQty,
    totalManualSaleQty: reportSummary.manualSaleQty
  } : null;

  return (
    <div className="vmm-dashboard-layout">
      <Sidebar />

      <div className="vmm-main-wrapper">
        <Header 
          breadcrumb={<>HOME - PAGES - REPORT - <span className="active">SALE REPORT</span></>}
          showBackButton={true}
          onBackClick={() => navigate('/dashboard')}
        />

        <main className="vmm-dashboard-body">
          {/* Search Card */}
          <div className="report-search-card">
            <div className="report-search-header">
              <span>NOTE : FIELDS MARKED WITH (*) ARE REQUIRED</span>
            </div>
            <div className="report-search-body report-search-body-grid">
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

          {/* Selected Info Bar */}
          <div className="report-selected-info-bar">
            <div>
              SELECTED STORE : { getSelectedStoreName() }
            </div>
            <div>
              FROM DATE : {fromDate} | TO DATE : {toDate}
            </div>
          </div>

          {/* Curved Cards */}
          <div className="report-curved-cards sale-report-cards">
            <CurvedCard 
              title="SALE QTY" 
              value={reportSummary?.saleQty?.toLocaleString('en-IN') || '0'} 
              waveColor={cardGradients[0]}
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              }
            />

            <CurvedCard 
              title="RFID CHECKOUT QTY" 
              value={reportSummary?.rfidCheckoutQty?.toLocaleString('en-IN') || '0'} 
              waveColor={cardGradients[1]}
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="7" width="20" height="14" rx="2" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              }
            />

            <CurvedCard 
              title="TAFFETA SALE QTY" 
              value={reportSummary?.taffetaSaleQty?.toLocaleString('en-IN') || '0'} 
              waveColor={cardGradients[2]}
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M4 19V5a2 2 0 0 1 2-2h13.4a.6.6 0 0 1 .6.6v13.114M6 17h14M6 21h12" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              }
            />

            <CurvedCard 
              title="MANUAL SALE QTY" 
              value={reportSummary?.manualSaleQty?.toLocaleString('en-IN') || '0'} 
              waveColor={cardGradients[3]}
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 2v6h6" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 13H8M16 17H8M10 9H8" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              }
            />
          </div>

          {/* Data Table */}
          <div className="report-table-wrapper">
            <ReportDataTableCard 
              columns={columns} 
              data={tableData} 
              isLoading={isLoading} 
              striped={true}
              pageIndex={pageIndex}
              onPageChange={setPageIndex}
              pageSize={pageSize}
              onPageSizeChange={setPageSize}
              totalRecords={reportSummary?.totalRecords || totalRecords || 0}
              totals={tableTotals}
            />
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
