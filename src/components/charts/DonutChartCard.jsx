import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import ProgressBar from '../common/ProgressBar';
import './Charts.css';

export default function DonutChartCard({ 
  title = "Inventory Breakdown", 
  subtitle = "Tag distribution across sites",
  data = [],
  totalLabel = "Total Tags",
  totalValue = "0"
}) {
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
}
