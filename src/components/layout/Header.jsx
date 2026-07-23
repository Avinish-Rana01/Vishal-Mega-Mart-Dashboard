import React, { useState } from 'react';
import { User, LogOut } from 'lucide-react';
import { APP_INFO } from '../../config/constants';

export default function Header({ username = 'Admin User', breadcrumb = 'HOME - PAGES - DASHBOARD', onLogout }) {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="vmm-top-header">
      <div className="vmm-brand-section">
        <h1 className="vmm-brand-title">{APP_INFO.TITLE}</h1>
        <div className="vmm-breadcrumbs">{breadcrumb}</div>
      </div>

      <div className="vmm-header-user">
        <button
          className="vmm-user-btn"
          onClick={() => setShowUserMenu(!showUserMenu)}
          title="User Account"
        >
          <User size={18} />
        </button>

        {showUserMenu && (
          <div className="vmm-user-dropdown">
            <div className="vmm-user-info">
              <div className="vmm-user-name">{username}</div>
              <div className="vmm-user-role">Administrator</div>
            </div>
            <button
              className="vmm-dropdown-item"
              onClick={() => {
                setShowUserMenu(false);
                if (onLogout) onLogout();
              }}
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
