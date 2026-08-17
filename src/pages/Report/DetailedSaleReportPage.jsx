import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import CurvedCard from '../../components/common/CurvedCard';
import ReportDataTableCard from '../../components/common/ReportDataTableCard';
import SearchableDropdown from '../../components/common/SearchableDropdown';
import { useDetailedSaleReport } from '../../hooks/useDetailedSaleReport';
import { getReportStores } from '../../services/stockService';

import './StoreGrcReport.css'; // Reusing the same CSS for identical layout

export default function DetailedSaleReportPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract state passed from Dashboard
  const { store = '', rowDate = '', columnName = 'TOTAL_DPOS_SALE' } = location.state || {};

  // For this report, fromDate and toDate are initially set to the rowDate
  const [fromDate, setFromDate] = useState(rowDate || new Date().toISOString().split('T')[0]);
  const [toDate, setToDate] = useState(rowDate || new Date().toISOString().split('T')[0]);
  const [storeNameState, setStoreNameState] = useState(store);
  const [storeOptions, setStoreOptions] = useState([]);

  React.useEffect(() => {
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

  const {
    pos, setPos,
    articleNo, setArticleNo,
    ean, setEan,
    setArticleSearchTerm, setEanSearchTerm,
    posOptions, articleOptions, eanOptions,
    isLoadingPos, isLoadingArticles, isLoadingEans,
    data, summary, isLoading, error,
    pageIndex, setPageIndex,
    pageSize, setPageSize,
    clearFilters
  } = useDetailedSaleReport(storeNameState, fromDate, toDate, columnName);

  // Determine Title based on columnName
  const getReportTitle = () => {
    switch(columnName) {
      case 'TOTAL_RFID_CHECKOUT': return 'TOTAL RFID SALE';
      case 'TOTAL_MANUAL_SALE': return 'TOTAL MANUAL SALE';
      case 'TOTAL_DPOS_SALE': 
      default:
        return 'TOTAL DPOS SALE';
    }
  };

  const reportTitle = getReportTitle();

  const handleClear = () => {
    // Reset dates and store if needed, but usually we just clear dropdowns
    setFromDate(rowDate);
    setToDate(rowDate);
    setStoreNameState(store);
    clearFilters();
  };

  const columns = useMemo(() => {
    const srNoCol = { 
      key: 'srNo', 
      label: 'SR.NO',
      render: (_, __, rowIndex) => ((pageIndex - 1) * pageSize) + rowIndex + 1 
    };

    if (columnName === 'TOTAL_RFID_CHECKOUT') {
      return [
        srNoCol,
        { key: 'CHECKOUT_DATE', label: 'CHECKOUT DATE' },
        { key: 'STORE_CODE', label: 'STORE CODE' },
        { key: 'EAN', label: 'EAN' },
        { key: 'ITEM_CD', label: 'ARTICLE NO' },
        { key: 'ARTICLE_DESC', label: 'ARTICLE DESC' },
        { key: 'CHECKOUT_TAGS', label: 'RFID QTY', render: (val) => <span className="vmm-link-num">{val}</span> }
      ];
    } else if (columnName === 'TOTAL_MANUAL_SALE') {
      return [
        srNoCol,
        { key: 'CHECKOUT_DATE', label: 'SALE DATE' },
        { key: 'STORE_CODE', label: 'STORE CODE' },
        { key: 'POS_TYPE', label: 'POS TYPE' },
        { key: 'COUNTER_NO', label: 'POS COUNTER' },
        { key: 'ITEM_CD', label: 'ARTICLE NO' },
        { key: 'EAN', label: 'EAN' },
        { key: 'CHECKOUT_TAGS', label: 'MANUAL SALE QTY', render: (val) => <span className="vmm-link-num">{val}</span> }
      ];
    } else {
      // Default / TOTAL_DPOS_SALE
      return [
        srNoCol,
        { key: 'BILL_DATE', label: 'SALE DATE' },
        { key: 'STORE_CODE', label: 'STORE CODE' },
        { key: 'POS_TYPE', label: 'POS TYPE' },
        { key: 'COUNTER_NO', label: 'POS COUNTER' },
        { key: 'MAKER_ID', label: 'CASHIER ID' },
        { key: 'ITEM_CD', label: 'ARTICLE NO' },
        { key: 'EAN', label: 'EAN' },
        { key: 'SALE_QTY', label: 'SALE QTY', render: (val) => <span className="vmm-link-num">{val}</span> }
      ];
    }
  }, [pageIndex, pageSize, columnName]);

  return (
    <div className="vmm-dashboard-layout">
      <Sidebar />
      <div className="vmm-main-wrapper">
        <Header 
          breadcrumb={<>HOME - PAGES - REPORT - SALE REPORT - <span className="active">{reportTitle}</span></>}
          showBackButton={true}
          onBackClick={() => navigate('/dashboard', {
            state: {
              store: storeNameState,
              fromDate: fromDate,
              toDate: toDate
            }
          })}
        />

        <main className="vmm-dashboard-body">
          {/* Search Card */}
          <div className="report-search-card">
            <div className="report-search-header">
              <span>NOTE : FIELDS MARKED WITH (*) ARE REQUIRED</span>
            </div>

            <div className="report-search-body report-search-body-grid">
              {/* Store */}
              <div className="search-field">
                <label>Store <span>*</span></label>
                <SearchableDropdown
                  value={storeNameState}
                  onChange={(val) => {
                    setStoreNameState(val);
                    setPageIndex(1);
                  }}
                  options={storeOptions}
                  placeholder="Select Store Code"
                />
              </div>

              {/* From Date */}
              <div className="search-field">
                <label>From Date</label>
                <div className="input-group">
                  <input 
                    type="date" 
                    value={fromDate} 
                    onChange={(e) => setFromDate(e.target.value)}
                  />
                </div>
              </div>

              {/* To Date */}
              <div className="search-field">
                <label>To Date</label>
                <div className="input-group">
                  <input 
                    type="date" 
                    value={toDate} 
                    onChange={(e) => setToDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Only show these fields for TOTAL_DPOS_SALE */}
              {columnName === 'TOTAL_DPOS_SALE' && (
                <>
                  {/* POS Counter */}
                  <div className="search-field">
                    <label>POS Counter</label>
                    <SearchableDropdown
                      options={posOptions}
                      value={pos}
                      onChange={setPos}
                      placeholder={isLoadingPos ? 'Loading...' : 'Select POS Counter'}
                      disabled={isLoadingPos}
                    />
                  </div>

                  {/* Article No */}
                  <div className="search-field">
                    <label>Article No</label>
                    <SearchableDropdown
                      options={articleOptions}
                      value={articleNo}
                      onChange={setArticleNo}
                      placeholder={isLoadingArticles ? 'Loading...' : 'Select Article No'}
                      searchPlaceholder="Search Article No"
                      disabled={isLoadingArticles}
                      isAsync={true}
                      onSearchChange={setArticleSearchTerm}
                      isLoading={isLoadingArticles}
                    />
                  </div>

                  {/* EAN */}
                  <div className="search-field">
                    <label>EAN</label>
                    <SearchableDropdown
                      options={eanOptions}
                      value={ean}
                      onChange={setEan}
                      placeholder={isLoadingEans ? 'Loading...' : 'Select EAN'}
                      searchPlaceholder="Search EAN"
                      disabled={isLoadingEans}
                      isAsync={true}
                      onSearchChange={setEanSearchTerm}
                      isLoading={isLoadingEans}
                    />
                  </div>
                </>
              )}
            </div>

            <div className="search-buttons">
              <button onClick={handleClear} className="btn-clear">Clear</button>
              <button className="btn-back-summary" onClick={() => navigate('/reports/sale', {
                state: {
                  store: storeNameState,
                  fromDate: fromDate,
                  toDate: toDate
                }
              })}>Back to Sale Summary</button>
            </div>
          </div>

          {/* Stats Header */}
          <div className="report-stats-header">
            <div className="report-type-title">REPORT TYPE : {reportTitle}</div>
            <div className="date-info">
              FROM DATE : {fromDate} | TO DATE : {toDate}
            </div>
          </div>

          {/* Summary Cards */}
          <div className="report-curved-cards">
            <CurvedCard
              title="STORE"
              value={summary?.storeName || storeNameState || '-'}
              waveColor={['#a7f3d0', '#34d399', '#10b981']}
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              }
            />
            <CurvedCard
              title="EAN COUNT"
              value={summary?.eanCount?.toLocaleString('en-IN') || '0'}
              waveColor={['#e9d5ff', '#c084fc', '#a855f7']}
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="14 2 14 8 20 8" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              }
            />
            <CurvedCard
              title="SALE QTY"
              value={summary?.saleQty?.toLocaleString('en-IN') || '0'}
              waveColor={['#ffedd5', '#fdba74', '#f97316']}
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="7" y1="7" x2="7.01" y2="7" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              }
            />
          </div>

          {/* Data Table */}
          <div className="report-table-container">
            <ReportDataTableCard
              title=""
              columns={columns}
              data={data}
              isLoading={isLoading}
              error={error}
              enablePagination={true}
              pageSize={pageSize}
              pageIndex={pageIndex}
              onPageChange={setPageIndex}
              onPageSizeChange={setPageSize}
              totalRecords={summary?.recordCount || 0}
            />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
