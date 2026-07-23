import React from 'react';
import { Shirt, Layers, ScanLine, TrendingUp } from 'lucide-react';
import { formatNumber } from '../../utils/formatters';

export default function CycleCountModal({ modalData, onClose }) {
  if (!modalData) return null;

  return (
    <div className="vmm-modal-overlay">
      <div className="vmm-modal-content">
        <div className="vmm-modal-header">
          <div className="vmm-modal-title">VIEW CYCLE COUNT DETAILS</div>
          <button className="vmm-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="vmm-modal-body">
          <div className="vmm-modal-meta-row">
            <div>STORE: <span style={{ color: '#2563eb', textTransform: 'uppercase' }}>{modalData.store}</span></div>
            <div>CYCLE COUNT TYPE: <span style={{ color: '#2563eb', textTransform: 'uppercase' }}>{modalData.type}</span></div>
            <div>DATE: <span>{modalData.date}</span></div>
            <div>TIME: <span>{modalData.startedOn} - {modalData.endedOn}</span></div>
          </div>

          {/* 4 Stat Wave Cards */}
          <div className="vmm-modal-cards-grid">
            <div className="vmm-curve-card">
              <div className="vmm-curve-card-header">
                <div>
                  <div className="vmm-curve-title">No of Articles</div>
                  <div className="vmm-curve-val">{formatNumber(modalData.articles)}</div>
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
                  <div className="vmm-curve-val">{formatNumber(modalData.sysStock)}</div>
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
                  <div className="vmm-curve-val">{formatNumber(modalData.scannedQty)}</div>
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
                  <div className="vmm-curve-val" style={{ color: modalData.diffQty < 0 ? '#dc2626' : '#16a34a' }}>
                    {formatNumber(modalData.diffQty)}
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
  );
}
