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
            <div>STORE: <span className="text-blue-uppercase">{modalData.store}</span></div>
            <div>CYCLE COUNT TYPE: <span className="text-blue-uppercase">{modalData.type}</span></div>
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

          <div className="mt-12">
            <h4 className="breakdown-title">Article Breakdown</h4>
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
                {modalData.articleList && modalData.articleList.length > 0 ? (
                  modalData.articleList.map((article, idx) => (
                    <tr key={idx}>
                      <td><strong>{article.ean}</strong></td>
                      <td>{article.description}</td>
                      <td>{formatNumber(article.sysQty)}</td>
                      <td>{formatNumber(article.scannedQty)}</td>
                      <td style={{ color: article.diffQty < 0 ? '#dc2626' : (article.diffQty > 0 ? '#16a34a' : 'inherit') }}>
                        {formatNumber(article.diffQty)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="empty-table-msg">
                      No article breakdown available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
