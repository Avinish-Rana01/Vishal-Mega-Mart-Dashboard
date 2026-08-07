import React from 'react';

export default function CurvedCard({ title, value, waveColor = ['#f472b6', '#db2777'], icon }) {
  // Ensure we have an array for gradient, fallback to same color if string passed
  const colors = Array.isArray(waveColor) ? waveColor : [waveColor, waveColor];
  // We need a unique ID for the SVG gradient so they don't clash on the page
  const gradientId = `wave-grad-${title.replace(/[^a-zA-Z0-9]/g, '')}`;

  return (
    <div className="curve-card" style={{ backgroundColor: '#ffffff', borderTop: 'none' }}>
      <div className="card-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div className="card-content">
          <p style={{ color: 'black' }}>{title}</p>
          <h3 style={{ color: 'black', background: 'none', WebkitTextFillColor: 'black' }}>{value}</h3>
        </div>
        
        {/* Dynamic Circular Icon */}
        <div className="card-icon" style={{ 
          position: 'relative', 
          width: '40px', 
          height: '40px', 
          borderRadius: '50%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          marginTop: 0 // override default css if any
        }}>
          {/* Soft light background for the icon */}
          <div style={{ position: 'absolute', inset: 0, backgroundColor: colors[0], opacity: 0.25, borderRadius: '50%' }}></div>
          
          {/* The Icon */}
          <div style={{ position: 'relative', zIndex: 1, display: 'flex' }}>
            {icon || (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="black">
                <path d="M21.6 5.34l-3.23-1.78c-.28-.15-.59-.22-.91-.22H6.54c-.32 0-.63.07-.91.22L2.4 5.34C1.56 5.81 1.25 6.89 1.7 7.73l.6 1.08c.46.84 1.53 1.15 2.38.68l.32-.18V20c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V9.31l.32.18c.85.47 1.92.16 2.38-.68l.6-1.08c.45-.84.14-1.92-.7-2.39zM12 4c1.1 0 2 .9 2 2h-4c0-1.1.9-2 2-2z"/>
              </svg>
            )}
          </div>
        </div>

      </div>
      <div style={{ position: 'absolute', bottom: -1, left: 0, right: 0, height: '40px', zIndex: 0 }}>
        <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }}>
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={colors[0]} />
              <stop offset="100%" stopColor={colors[1]} />
            </linearGradient>
          </defs>
          <path fill={`url(#${gradientId})`} fillOpacity="1" d="M0,192L48,202.7C96,213,192,235,288,218.7C384,203,480,149,576,144C672,139,768,181,864,202.7C960,224,1056,224,1152,192C1248,160,1344,96,1392,64L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
      <style>{`
        .curve-card::after { display: none !important; }
      `}</style>
    </div>
  );
}
