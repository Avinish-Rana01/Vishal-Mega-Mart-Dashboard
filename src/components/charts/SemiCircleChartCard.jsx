import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Recycle } from 'lucide-react';
import ProgressBar from '../common/ProgressBar';
import './Charts.css';

export default function SemiCircleChartCard({
  title = "RFID Tag Recycle Distribution",
  subtitle = "Distribution of tags based on the number of recycle cycles.",
  data = [],
  totalLabel = "Total Tag Count",
  totalValue = "0",
  avgCount = "0"
}) {
  return (
    <div className="vmm-chart-card vmm-flex-col">
      {/* Header spanning full width at top */}
      <div className="vmm-chart-header vmm-mb-large" style={{ position: 'relative' }}>
        <h3>{title}</h3>
        <p>{subtitle}</p>
        <div className="vmm-chart-badge-corner">
          <span className="vmm-trend-icon">&#x2197;</span> Avg Recycle Count : <strong>{avgCount}</strong>
        </div>
      </div>

      <div className="vmm-chart-container">
        {/* Left Side: Graphic */}
        <div className="vmm-chart-graphic vmm-semi-circle-wrapper">
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="100%"
                startAngle={180}
                endAngle={0}
                innerRadius={80}
                outerRadius={110}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Custom HTML overlay for the center text of the semi-circle */}
          <div className="vmm-semi-circle-center-text">
            <Recycle size={20} color="#22c55e" className="vmm-recycle-icon" />
            <div className="vmm-semi-circle-label">{totalLabel}</div>
            <div className="vmm-semi-circle-value">{totalValue}</div>
          </div>
        </div>

        {/* Right Side: Legend */}
        <div className="vmm-chart-legend">
          <div className="vmm-chart-legend-items vmm-compact-items">
            {data.map((item, index) => (
              <div key={index} className="vmm-legend-item vmm-compact">
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
                <ProgressBar percent={parseFloat(item.percent)} color={item.color} height={6} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
