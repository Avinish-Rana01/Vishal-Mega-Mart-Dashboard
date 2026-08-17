import React, { memo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReactWrapper from 'highcharts-react-official';
const HighchartsReact = HighchartsReactWrapper.default || HighchartsReactWrapper;
import './Charts.css';

import { useIsInViewport } from '../../hooks/useIsInViewport';

export default memo(function WarehouseEncodingBarChart({
  title = "WAREHOUSE ENCODING DASHBOARD",
  data = [],
  isLoading = false
}) {
  const [containerRef, hasBeenVisible] = useIsInViewport({ threshold: 0.1 });

  if (isLoading) {
    return (
      <div className="vmm-chart-card vmm-flex-col" style={{ height: '100%' }}>
        <div className="vmm-chart-header vmm-mb-large">
          <h3 style={{ margin: 0, fontSize: '15px', color: '#1e293b' }}>{title}</h3>
        </div>
        <div className="vmm-chart-container" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px' }}>
          <div className="vmm-shimmer" style={{ width: '100%', height: '100%', borderRadius: '6px' }}></div>
        </div>
      </div>
    );
  }

  const formatTimeBlock = (tb) => {
    const parts = tb.split(' - ');
    if(parts.length === 2) {
      return `${parseInt(parts[0], 10)} to ${parseInt(parts[1], 10)}`;
    }
    return tb;
  };

  const categories = data.map(item => formatTimeBlock(item.timeBlock));
  const seriesData = data.map(item => item.count);
  const totalEncoding = seriesData.reduce((sum, val) => sum + val, 0);

  const options = {
    colors: ['#ef4444', '#a3e635', '#0ea5e9', '#ec4899', '#f59e0b', '#8b5cf6', '#14b8a6', '#f43f5e', '#84cc16', '#06b6d4', '#d946ef', '#64748b'],
    chart: {
      type: 'column',
      backgroundColor: 'transparent',
      height: 110
    },
    title: {
      text: null
    },
    legend: {
      enabled: false
    },
    xAxis: {
      categories: categories,
      crosshair: true,
      labels: {
        rotation: -45,
        style: {
          fontSize: '11px',
          fontWeight: '500',
          color: '#475569'
        }
      },
      lineColor: '#e2e8f0',
      tickColor: '#e2e8f0'
    },
    yAxis: {
      min: 0,
      maxPadding: 0.2,
      title: {
        text: 'EPC Count',
        style: {
          fontSize: '11px',
          color: '#64748b'
        }
      },
      gridLineDashStyle: 'Dash',
      gridLineColor: '#f1f5f9',
      labels: {
        style: {
          color: '#94a3b8'
        }
      }
    },
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
        '<td style="padding:0"><b>{point.y}</b></td></tr>',
      footerFormat: '</table>',
      shared: true,
      useHTML: true
    },
    plotOptions: {
      column: {
        pointPadding: 0.05,
        groupPadding: 0.1,
        borderWidth: 0,
        borderRadius: 2,
        colorByPoint: true,
        states: {
          hover: {
            halo: null,
            borderWidth: 0
          },
          select: {
            borderWidth: 0,
            color: null
          }
        },
        dataLabels: {
          enabled: true,
          inside: false,
          crop: false,
          overflow: 'allow',
          style: {
            fontSize: '11px',
            fontWeight: '600',
            color: '#1e293b',
            textOutline: 'none'
          }
        }
      }
    },
    credits: {
      enabled: false
    },
    series: [{
      name: 'EPC Count',
      data: seriesData
    }]
  };

  // Get current date for the header
  const now = new Date();
  const dayName = now.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
  const dateString = now.toISOString().split('T')[0];

  return (
    <div ref={containerRef} className="vmm-card vmm-flex-col" style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '19px', overflow: 'hidden' }}>
      <div className="vmm-table-header" style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#2f669a' }}>
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: '#fff', textTransform: 'uppercase' }}>{title}</h3>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ color: '#fff', fontSize: '12px', fontWeight: '500' }}>{dayName}</span>
          <span style={{ background: '#fff', color: '#1e293b', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '4px 12px', fontSize: '12px', fontWeight: '600' }}>{dateString}</span>
        </div>
      </div>
      
      <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: '#fff' }}>
        <button className="vmm-btn-primary" style={{ padding: '6px 16px', fontSize: '13px', fontWeight: '600' }}>View Summary</button>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a', marginBottom: '4px' }}>EPC Distribution By Range</div>
          <div style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a' }}>
            Total Encoding : <span style={{ color: '#0ea5e9' }}>{totalEncoding}</span>
          </div>
        </div>
      </div>

      <div className="vmm-chart-container" style={{ padding: '0 16px 16px 16px', background: '#fff', minHeight: '110px' }}>
        {hasBeenVisible ? (
          <HighchartsReact
            highcharts={Highcharts}
            options={options}
            containerProps={{ style: { height: '110px', width: '100%' } }}
          />
        ) : (
          <div className="vmm-shimmer" style={{ width: '100%', height: '110px', borderRadius: '6px' }}></div>
        )}
      </div>
    </div>
  );
});
