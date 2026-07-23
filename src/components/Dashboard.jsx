import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Building2, 
  Tag, 
  Settings, 
  User, 
  LogOut, 
  TrendingUp, 
  Shirt, 
  Layers, 
  ScanLine 
} from 'lucide-react';
import DataTableCard from './DataTableCard';
import { fetchLiveStockData } from '../services/api';
import './Dashboard.css';

export default function Dashboard({ username = 'Admin User', onLogout }) {
  // Navigation active tab
  const [activeNav, setActiveNav] = useState('home');
  // User Profile Menu dropdown state
  const [showUserMenu, setShowUserMenu] = useState(false);
  // Modal state for View Details
  const [selectedModalData, setSelectedModalData] = useState(null);

  // 1. LIVE STOCK DATA STATE
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

  // 2. CYCLE COUNT DATA STATE
  const cycleCountData = [
    { store: 'HD44', type: 'FULL CYCLE', refNo: 'CC-2026-001', date: '2026-07-23', startedOn: '09:00 AM', endedOn: '11:30 AM', timeTaken: '2h 30m', articles: 1240, sysStock: 15400, scannedQty: 14850, diffQty: -550 },
    { store: 'HD55', type: 'PARTIAL CYCLE', refNo: 'CC-2026-002', date: '2026-07-22', startedOn: '02:15 PM', endedOn: '03:45 PM', timeTaken: '1h 30m', articles: 850, sysStock: 9200, scannedQty: 9150, diffQty: -50 },
    { store: 'HH15', type: 'HIGH VALUE', refNo: 'CC-2026-003', date: '2026-07-21', startedOn: '10:00 AM', endedOn: '11:15 AM', timeTaken: '1h 15m', articles: 430, sysStock: 4800, scannedQty: 4780, diffQty: -20 },
  ];

  // Load Live Stock Data from C# Backend Endpoint
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
            const sap = parseInt(row.SAP_STOCK || row.sap_stock || row.SAP_QTY || row.QTY || '0', 10);
            const rfid = parseInt(row.RFID_STOCK || row.rfid_stock || row.RFID_QTY || row.ENCODED_QTY || '0', 10);
            const diff = parseInt(row.DIFFERENCE || row.difference || row.DIFF_QTY || (sap - rfid).toString(), 10);
            
            let cov = row.PERCENTAGE || row.percentage || row.COVERAGE || '';
            if (!cov) {
              cov = sap > 0 ? ((rfid / sap) * 100).toFixed(2) + '%' : '0%';
            } else if (!cov.endsWith('%')) {
              cov = parseFloat(cov).toFixed(2) + '%';
            }

            const rawDate = row.DATE || row.date || row.SYNC_DATE || '';
            const dateStr = rawDate ? rawDate.split(' ')[0] : new Date().toISOString().split('T')[0];

            return {
              store: storeCode,
              sapQty: sap.toLocaleString('en-IN'),
              rfidQty: rfid.toLocaleString('en-IN'),
              diffQty: diff.toLocaleString('en-IN'),
              syncDate: dateStr,
              coverage: cov
            };
          });
          setLiveStockData(mappedRows);
        }

        if (pager) {
          setLiveTotals({
            store: 'TOTAL',
            sapQty: parseInt(pager.QTY || pager.qty || '0', 10).toLocaleString('en-IN'),
            rfidQty: parseInt(pager.ENCODED_QTY || pager.encoded_qty || '0', 10).toLocaleString('en-IN'),
            diffQty: parseInt(pager.DIFF_QTY || pager.diff_qty || '0', 10).toLocaleString('en-IN')
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

  // COLUMN CONFIGURATIONS
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
      {/* Left Vertical Navigation Bar */}
      <aside className="vmm-sidebar">
        <div className="vmm-sidebar-logo" title="Vishal Mega Mart">
          <img src="/assets/images/vishal_mega_mart_icon.png" alt="VMM Icon" />
        </div>
        <nav className="vmm-sidebar-nav">
          <button
            className={`vmm-nav-item ${activeNav === 'home' ? 'active' : ''}`}
            onClick={() => setActiveNav('home')}
            title="Dashboard Home"
          >
            <Home size={20} />
          </button>
          <button
            className={`vmm-nav-item ${activeNav === 'stores' ? 'active' : ''}`}
            onClick={() => setActiveNav('stores')}
            title="Store Reports"
          >
            <Building2 size={20} />
          </button>
          <button
            className={`vmm-nav-item ${activeNav === 'tags' ? 'active' : ''}`}
            onClick={() => setActiveNav('tags')}
            title="Tag Management"
          >
            <Tag size={20} />
          </button>
          <button
            className={`vmm-nav-item ${activeNav === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveNav('settings')}
            title="Settings"
          >
            <Settings size={20} />
          </button>
        </nav>
      </aside>

      {/* Main Container */}
      <div className="vmm-main-wrapper">
        {/* Top Header Bar */}
        <header className="vmm-top-header">
          <div className="vmm-brand-section">
            <h1 className="vmm-brand-title">VISHAL MEGA MART</h1>
            <div className="vmm-breadcrumbs">HOME - PAGES - DASHBOARD</div>
          </div>

          <div className="vmm-header-user">
            <button
              className="vmm-user-btn"
              onClick={() => setShowUserMenu(!showUserMenu)}
              title="User Account"
            >
              <User size={18} />
            </button>

            {showUserMenu && (
              <div className="vmm-user-dropdown">
                <div className="vmm-user-info">
                  <div className="vmm-user-name">{username}</div>
                  <div className="vmm-user-role">Administrator</div>
                </div>
                <button
                  className="vmm-dropdown-item"
                  onClick={() => {
                    setShowUserMenu(false);
                    if (onLogout) onLogout();
                  }}
                >
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Dashboard Main Scrollable Area */}
        <main className="vmm-dashboard-body">
          <div className="vmm-cards-grid">
            {/* 1. LIVE STOCK TABLE CARD */}
            <DataTableCard
              title="LIVE STOCK"
              columns={liveStockColumns}
              data={liveStockData}
              totals={liveTotals}
              isLoading={isLoadingLiveStock}
              error={apiError}
              onRefresh={loadLiveStock}
            />

            {/* 2. CYCLE COUNT TABLE CARD */}
            <DataTableCard
              title="CYCLE COUNT"
              columns={cycleCountColumns}
              data={cycleCountData}
              totals={{ store: 'TOTAL', type: '3 CYCLES', timeTaken: '5h 15m' }}
            />
          </div>
        </main>

        {/* Bottom Footer Line */}
        <footer className="vmm-footer">
          <div>
            Copyright &copy; {new Date().getFullYear()}. Markss Infotech Ltd | All Rights Reserved | V 3.4
          </div>
          <div className="vmm-footer-right">
            <span>Designed & Developed by</span>
            <span className="vmm-vyapti-tag">TeCMi Vyapti</span>
          </div>
        </footer>
      </div>

      {/* Details View Modal (CCModal) */}
      {selectedModalData && (
        <div className="vmm-modal-overlay">
          <div className="vmm-modal-content">
            <div className="vmm-modal-header">
              <div className="vmm-modal-title">VIEW CYCLE COUNT DETAILS</div>
              <button
                className="vmm-modal-close"
                onClick={() => setSelectedModalData(null)}
              >
                ✕
              </button>
            </div>
            <div className="vmm-modal-body">
              <div className="vmm-modal-meta-row">
                <div>STORE: <span style={{ color: '#2563eb', textTransform: 'uppercase' }}>{selectedModalData.store}</span></div>
                <div>CYCLE COUNT TYPE: <span style={{ color: '#2563eb', textTransform: 'uppercase' }}>{selectedModalData.type}</span></div>
                <div>DATE: <span>{selectedModalData.date}</span></div>
                <div>TIME: <span>{selectedModalData.startedOn} - {selectedModalData.endedOn}</span></div>
              </div>

              {/* 4 Stat Wave Cards */}
              <div className="vmm-modal-cards-grid">
                <div className="vmm-curve-card">
                  <div className="vmm-curve-card-header">
                    <div>
                      <div className="vmm-curve-title">No of Articles</div>
                      <div className="vmm-curve-val">{selectedModalData.articles}</div>
                    </div>
                    <div className="vmm-curve-icon">
                      <Shirt size={18} />
                    </div>
                  </div>
                </div>

                <div className="vmm-curve-card">
                  <div className="vmm-curve-card-header">
                    <div>
                      <div className="vmm-curve-title">System Stock</div>
                      <div className="vmm-curve-val">{selectedModalData.sysStock?.toLocaleString()}</div>
                    </div>
                    <div className="vmm-curve-icon">
                      <Layers size={18} />
                    </div>
                  </div>
                </div>

                <div className="vmm-curve-card">
                  <div className="vmm-curve-card-header">
                    <div>
                      <div className="vmm-curve-title">Scanned Qty</div>
                      <div className="vmm-curve-val">{selectedModalData.scannedQty?.toLocaleString()}</div>
                    </div>
                    <div className="vmm-curve-icon">
                      <ScanLine size={18} />
                    </div>
                  </div>
                </div>

                <div className="vmm-curve-card">
                  <div className="vmm-curve-card-header">
                    <div>
                      <div className="vmm-curve-title">Difference Qty</div>
                      <div className="vmm-curve-val" style={{ color: selectedModalData.diffQty < 0 ? '#dc2626' : '#16a34a' }}>
                        {selectedModalData.diffQty}
                      </div>
                    </div>
                    <div className="vmm-curve-icon">
                      <TrendingUp size={18} />
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 12 }}>
                <h4 style={{ fontSize: 13, marginBottom: 8, color: '#0f172a' }}>Article Breakdown</h4>
                <table className="vmm-table">
                  <thead>
                    <tr>
                      <th>EAN / ARTICLE NO</th>
                      <th>DESCRIPTION</th>
                      <th>SYSTEM QTY</th>
                      <th>SCANNED QTY</th>
                      <th>DIFF QTY</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>8907831002341</strong></td>
                      <td>MEN'S DENIM SLIM FIT BLUE 32</td>
                      <td>4,200</td>
                      <td>4,100</td>
                      <td style={{ color: '#dc2626' }}>-100</td>
                    </tr>
                    <tr>
                      <td><strong>8907831005612</strong></td>
                      <td>WOMEN'S COTTON TOP FLORAL M</td>
                      <td>3,500</td>
                      <td>3,480</td>
                      <td style={{ color: '#dc2626' }}>-20</td>
                    </tr>
                    <tr>
                      <td><strong>8907831009988</strong></td>
                      <td>BOYS TEESHIRT GRAPHIC YOUTH L</td>
                      <td>2,800</td>
                      <td>2,770</td>
                      <td style={{ color: '#dc2626' }}>-30</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
