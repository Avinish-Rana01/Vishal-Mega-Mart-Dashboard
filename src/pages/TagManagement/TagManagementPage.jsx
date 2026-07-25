import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import DonutChartCard from '../../components/charts/DonutChartCard';
import SemiCircleChartCard from '../../components/charts/SemiCircleChartCard';
import './TagManagement.css';

export default function TagManagementPage() {
  const navigate = useNavigate();

  // Mock data matching the user's screenshot exactly
  const inventoryData = [
    { name: 'Inventory at Store', value: 244982, displayValue: '2,44,982', percent: 49.52, color: '#8b5cf6' }, // Purple
    { name: 'Inventory at Warehouse', value: 249744, displayValue: '2,49,744', percent: 50.48, color: '#2dd4bf' } // Teal
  ];

  const recycleData = [
    { name: '1', value: 55578, displayValue: '55,578', percent: 11.23, color: '#4ade80' }, // Green
    { name: '2', value: 90487, displayValue: '90,487', percent: 18.29, color: '#fbbf24' }, // Yellow
    { name: '3', value: 112114, displayValue: '1,12,114', percent: 22.66, color: '#2dd4bf' }, // Teal
    { name: '4', value: 106788, displayValue: '1,06,788', percent: 21.59, color: '#60a5fa' }, // Blue
    { name: '>=5', value: 129759, displayValue: '1,29,759', percent: 26.23, color: '#c084fc' } // Purple
  ];

  return (
    <div className="vmm-dashboard-layout">
      <Sidebar />

      <div className="vmm-main-wrapper">
        <Header breadcrumb="HOME - PAGES - TAG MANAGEMENT" />

        <main className="vmm-dashboard-body">
          
          <div className="vmm-page-header">
            <h2 className="vmm-page-title">TAG MANAGEMENT</h2>
            <div className="vmm-breadcrumb">
              SATURDAY <span className="vmm-date-badge">2026-07-25</span>
            </div>
          </div>

          <div className="vmm-tag-actions">
            <button className="vmm-btn-primary">View Summary</button>
          </div>

          <div className="vmm-charts-grid">
            <DonutChartCard 
              data={inventoryData} 
              totalValue="4,94,726" 
            />
            
            <SemiCircleChartCard 
              data={recycleData} 
              totalValue="4,94,726" 
              avgCount="3"
            />
          </div>
          
        </main>

        <Footer />
      </div>
    </div>
  );
}
