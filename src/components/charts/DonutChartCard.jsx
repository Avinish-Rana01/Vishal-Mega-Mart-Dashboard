import React, { memo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import ProgressBar from '../common/ProgressBar';
import './Charts.css';

export default memo(function DonutChartCard({ 
  title = "Inventory Breakdown", 
  subtitle = "Tag distribution across sites",
  data = [],
  totalLabel = "Total Tags",
  totalValue = "0",
  isLoading = false
}) {
  if (isLoading) {
    return (
      <div className="vmm-chart-card">
        <div className="vmm-chart-container">
          <div className="vmm-chart-graphic" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
            <div className="vmm-shimmer" style={{ width: '170px', height: '170px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '120px', height: '120px', borderRadius: '50%', backgroundColor: 'white' }}></div>
            </div>
          </div>
          <div className="vmm-chart-legend">
            <div className="vmm-chart-header" style={{ marginBottom: '16px' }}>
              <h3>{title}</h3>
              <p>{subtitle}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="vmm-shimmer" style={{ width: '60%', height: '24px', borderRadius: '4px' }}></div>
              <div className="vmm-shimmer" style={{ width: '80%', height: '14px', borderRadius: '4px', marginBottom: '8px' }}></div>
              <div className="vmm-shimmer" style={{ width: '100%', height: '36px', borderRadius: '6px' }}></div>
              <div className="vmm-shimmer" style={{ width: '100%', height: '36px', borderRadius: '6px' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="vmm-chart-card">
      <div className="vmm-chart-container">
        <div className="vmm-chart-graphic">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data}
                innerRadius={60}
                outerRadius={85}
                paddingAngle={0}
                dataKey="value"
                stroke="none"
                isAnimationActive={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              {/* Custom SVG Text in the center of the donut */}
              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
                <tspan x="50%" dy="-0.2em" fontSize="24" fontWeight="bold" fill="#1e293b">
                  {totalValue}
                </tspan>
                <tspan x="50%" dy="1.5em" fontSize="13" fill="#64748b">
                  {totalLabel}
                </tspan>
              </text>
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="vmm-chart-legend">
          <div className="vmm-chart-header">
            <h3>{title}</h3>
            <p>{subtitle}</p>
          </div>
          
          <div className="vmm-chart-legend-items">
            {data.map((item, index) => (
              <div key={index} className="vmm-legend-item">
                <div className="vmm-legend-header">
                  <div className="vmm-legend-label">
                    <span className="vmm-legend-dot" style={{ backgroundColor: item.color }}></span>
                    {item.name}
                  </div>
                  <div className="vmm-legend-stats">
                    <span className="vmm-legend-value">{item.displayValue || item.value}</span>
                    <span className="vmm-legend-percent">{item.percent}%</span>
                  </div>
                </div>
                <ProgressBar percent={parseFloat(item.percent)} color={item.color} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});
