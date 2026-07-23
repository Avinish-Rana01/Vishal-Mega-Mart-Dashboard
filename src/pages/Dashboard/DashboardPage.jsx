import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import DataTableCard from '../../components/common/DataTableCard';
import CycleCountModal from '../../components/modals/CycleCountModal';
import { fetchLiveStockData } from '../../services/api';
import { formatNumber, formatDate, formatCoverage } from '../../utils/formatters';
import './Dashboard.css';

export default function DashboardPage({ username = 'Admin User', onLogout }) {
  const [activeNav, setActiveNav] = useState('home');
  const [selectedModalData, setSelectedModalData] = useState(null);

  // Live Stock Data State
  const [liveStockData, setLiveStockData] = useState([
    { store: 'HD44', sapQty: '1,03,803', rfidQty: '76,983', diffQty: '26,820', syncDate: '2026-07-20', coverage: '74.16%' },
    { store: 'HD55', sapQty: '89,838', rfidQty: '88,968', diffQty: '870', syncDate: '2026-07-20', coverage: '99.03%' },
    { store: 'HH15', sapQty: '62,274', rfidQty: '55,614', diffQty: '6,660', syncDate: '2026-07-20', coverage: '89.31%' },
  ]);

  const [liveTotals, setLiveTotals] = useState({
    store: 'TOTAL',
    sapQty: '2,55,915',
    rfidQty: '2,21,565',
    diffQty: '34,350'
  });

  const [isLoadingLiveStock, setIsLoadingLiveStock] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Cycle Count Data
  const cycleCountData = [
    { store: 'HD44', type: 'FULL CYCLE', refNo: 'CC-2026-001', date: '2026-07-23', startedOn: '09:00 AM', endedOn: '11:30 AM', timeTaken: '2h 30m', articles: 1240, sysStock: 15400, scannedQty: 14850, diffQty: -550 },
    { store: 'HD55', type: 'PARTIAL CYCLE', refNo: 'CC-2026-002', date: '2026-07-22', startedOn: '02:15 PM', endedOn: '03:45 PM', timeTaken: '1h 30m', articles: 850, sysStock: 9200, scannedQty: 9150, diffQty: -50 },
    { store: 'HH15', type: 'HIGH VALUE', refNo: 'CC-2026-003', date: '2026-07-21', startedOn: '10:00 AM', endedOn: '11:15 AM', timeTaken: '1h 15m', articles: 430, sysStock: 4800, scannedQty: 4780, diffQty: -20 },
  ];

  const loadLiveStock = async () => {
    setIsLoadingLiveStock(true);
    setApiError(null);
    try {
      const response = await fetchLiveStockData({
        searchTerm: '',
        pageIndex: 1,
        pageSize: 100,
        userId: '0'
      });

      if (response && response.tables) {
        const rows = response.tables.livestockdata || response.tables.LiveStockData || response.tables.stockdata || response.tables.StockData || [];
        const pager = (response.tables.pager || response.tables.Pager)?.[0] || null;

        if (rows.length > 0) {
          const mappedRows = rows.map((row) => {
            const storeCode = row.STORE_CODE || row.store_code || row.STORE || row.store || '';
            const sap = row.SAP_STOCK || row.sap_stock || row.SAP_QTY || row.QTY || '0';
            const rfid = row.RFID_STOCK || row.rfid_stock || row.RFID_QTY || row.ENCODED_QTY || '0';
            const diff = row.DIFFERENCE || row.difference || row.DIFF_QTY || (parseInt(sap, 10) - parseInt(rfid, 10)).toString();
            const cov = formatCoverage(sap, rfid, row.PERCENTAGE || row.percentage || row.COVERAGE);
            const dateStr = formatDate(row.DATE || row.date || row.SYNC_DATE);

            return {
              store: storeCode,
              sapQty: formatNumber(sap),
              rfidQty: formatNumber(rfid),
              diffQty: formatNumber(diff),
              syncDate: dateStr,
              coverage: cov
            };
          });
          setLiveStockData(mappedRows);
        }

        if (pager) {
          setLiveTotals({
            store: 'TOTAL',
            sapQty: formatNumber(pager.QTY || pager.qty),
            rfidQty: formatNumber(pager.ENCODED_QTY || pager.encoded_qty),
            diffQty: formatNumber(pager.DIFF_QTY || pager.diff_qty)
          });
        }
      }
    } catch (err) {
      console.warn('Live Backend call failed, keeping offline reference data:', err.message);
      setApiError('Connected to offline demo mode (Backend WebMethod endpoint offline)');
    } finally {
      setIsLoadingLiveStock(false);
    }
  };

  useEffect(() => {
    loadLiveStock();
  }, []);

  const liveStockColumns = [
    { key: 'store', label: 'STORE', render: (val) => <span className="vmm-link-num">{val}</span> },
    { key: 'sapQty', label: 'SAP STOCK QTY', render: (val) => <span className="vmm-link-num">{val}</span> },
    { key: 'rfidQty', label: 'RFID STOCK QTY', render: (val) => <span className="vmm-link-num">{val}</span> },
    { key: 'diffQty', label: 'DIFFERENCE QTY', render: (val) => <span className="vmm-link-num">{val}</span> },
    { key: 'syncDate', label: 'SYNC DATE' },
    { key: 'coverage', label: 'COVERAGE(%)', render: (val) => <span className="vmm-badge-coverage">{val}</span> }
  ];

  const cycleCountColumns = [
    { key: 'store', label: 'STORE', render: (val) => <strong>{val}</strong> },
    { key: 'type', label: 'CC TYPE' },
    { key: 'refNo', label: 'REF NO' },
    { key: 'date', label: 'DATE' },
    { key: 'startedOn', label: 'STARTED ON' },
    { key: 'timeTaken', label: 'TIME TAKEN' },
    { 
      key: 'action', 
      label: 'ACTION', 
      sortable: false, 
      render: (_, row) => (
        <button className="vmm-btn-action" onClick={() => setSelectedModalData(row)}>
          View Details
        </button>
      ) 
    }
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
              isLoading={isLoadingLiveStock}
              error={apiError}
              onRefresh={loadLiveStock}
            />

            <DataTableCard
              title="CYCLE COUNT"
              columns={cycleCountColumns}
              data={cycleCountData}
              totals={{ store: 'TOTAL', type: '3 CYCLES', timeTaken: '5h 15m' }}
            />
          </div>
        </main>

        <Footer />
      </div>

      <CycleCountModal
        modalData={selectedModalData}
        onClose={() => setSelectedModalData(null)}
      />
    </div>
  );
}
