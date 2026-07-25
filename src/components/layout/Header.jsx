import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { APP_INFO } from '../../config/constants';

export default function Header({ breadcrumb = 'HOME - PAGES - DASHBOARD' }) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { loggedInUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    setShowUserMenu(false);
    logout();
    navigate('/login', { replace: true });
  };

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
              <div className="vmm-user-name">{loggedInUser || 'Admin User'}</div>
              <div className="vmm-user-role">Administrator</div>
            </div>
            <button
              className="vmm-dropdown-item"
              onClick={handleLogout}
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
