import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Home, Building2, Tag, Settings } from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="vmm-sidebar">
      <div className="vmm-sidebar-logo" title="Vishal Mega Mart">
       <Link to="/dashboard"> <img src="/assets/images/vishal_mega_mart_icon.png" alt="VMM Icon" /></Link>
      </div>
      <nav className="vmm-sidebar-nav">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => `vmm-nav-item ${isActive ? 'active' : ''}`}
          title="Dashboard Home"
        >
          <Home size={20} />
        </NavLink>
        <NavLink
          to="/stores"
          className={({ isActive }) => `vmm-nav-item ${isActive ? 'active' : ''}`}
          title="Store Reports"
        >
          <Building2 size={20} />
        </NavLink>
        <NavLink
          to="/tags"
          className={({ isActive }) => `vmm-nav-item ${isActive ? 'active' : ''}`}
          title="Tag Management"
        >
          <Tag size={20} />
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) => `vmm-nav-item ${isActive ? 'active' : ''}`}
          title="Settings"
        >
          <Settings size={20} />
        </NavLink>
      </nav>
    </aside>
  );
}