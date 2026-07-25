import React, { memo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Recycle } from 'lucide-react';
import ProgressBar from '../common/ProgressBar';
import './Charts.css';

export default memo(function SemiCircleChartCard({
  title = "TAG CYCLE COUNT",
  subtitle = "Distribution of Cycle Count ranges.",
  data = [],
  totalLabel = "Total Tag Count",
  totalValue = "0",
  avgCount = "0",
  isLoading = false
}) {
  if (isLoading) {
    return (
      <div className="vmm-chart-card vmm-flex-col">
        <div className="vmm-chart-header" style={{ marginBottom: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '15px', color: '#1e293b' }}>{title}</h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#64748b' }}>{subtitle}</p>
        </div>
        <div className="vmm-chart-container" style={{ flex: 1, flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <div className="vmm-chart-graphic vmm-semi-circle-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', height: '180px', width: '100%' }}>
             <div className="vmm-shimmer" style={{ width: '220px', height: '110px', borderTopLeftRadius: '110px', borderTopRightRadius: '110px' }}></div>
          </div>
          <div className="vmm-chart-legend" style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
            <div className="vmm-shimmer" style={{ width: '100%', height: '36px', borderRadius: '6px' }}></div>
            <div className="vmm-shimmer" style={{ width: '100%', height: '36px', borderRadius: '6px' }}></div>
            <div className="vmm-shimmer" style={{ width: '100%', height: '36px', borderRadius: '6px' }}></div>
          </div>
        </div>
      </div>
    );
  }

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
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="100%"
                startAngle={180}
                endAngle={0}
                innerRadius={70}
                outerRadius={95}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
                isAnimationActive={false}
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
});
