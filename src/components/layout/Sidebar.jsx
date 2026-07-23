import React from 'react';
import { Home, Building2, Tag, Settings } from 'lucide-react';

export default function Sidebar({ activeNav = 'home', onNavChange }) {
  return (
    <aside className="vmm-sidebar">
      <div className="vmm-sidebar-logo" title="Vishal Mega Mart">
        <img src="/assets/images/vishal_mega_mart_icon.png" alt="VMM Icon" />
      </div>
      <nav className="vmm-sidebar-nav">
        <button
          className={`vmm-nav-item ${activeNav === 'home' ? 'active' : ''}`}
          onClick={() => onNavChange && onNavChange('home')}
          title="Dashboard Home"
        >
          <Home size={20} />
        </button>
        <button
          className={`vmm-nav-item ${activeNav === 'stores' ? 'active' : ''}`}
          onClick={() => onNavChange && onNavChange('stores')}
          title="Store Reports"
        >
          <Building2 size={20} />
        </button>
        <button
          className={`vmm-nav-item ${activeNav === 'tags' ? 'active' : ''}`}
          onClick={() => onNavChange && onNavChange('tags')}
          title="Tag Management"
        >
          <Tag size={20} />
        </button>
        <button
          className={`vmm-nav-item ${activeNav === 'settings' ? 'active' : ''}`}
          onClick={() => onNavChange && onNavChange('settings')}
          title="Settings"
        >
          <Settings size={20} />
        </button>
      </nav>
    </aside>
  );
}
