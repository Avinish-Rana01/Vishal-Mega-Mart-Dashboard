import React, { useState, useEffect } from 'react';
import LoginPage from './pages/Login/LoginPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import LiveStockReportPage from './pages/Report/LiveStockReportPage';
import './App.css';

export default function App() {
  const [pageLoading, setPageLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [loggedInUser, setLoggedInUser] = useState('Admin User');
  
  // State-based routing
  const [currentRoute, setCurrentRoute] = useState({ path: 'dashboard', params: {} });

  // Pre-loader simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const handleLoginSuccess = (user) => {
    setLoggedInUser(user || 'Admin User');
    setIsLoggedIn(true);
    setCurrentRoute({ path: 'dashboard', params: {} });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleNavigate = (path, params = {}) => {
    setCurrentRoute({ path, params });
  };

  const renderPage = () => {
    switch (currentRoute.path) {
      case 'dashboard':
        return <DashboardPage username={loggedInUser} onLogout={handleLogout} onNavigate={handleNavigate} />;
      case 'liveStockReport':
        return <LiveStockReportPage username={loggedInUser} onLogout={handleLogout} onNavigate={handleNavigate} params={currentRoute.params} />;
      default:
        return <DashboardPage username={loggedInUser} onLogout={handleLogout} onNavigate={handleNavigate} />;
    }
  };

  return (
    <>
      {pageLoading && <div className="se-pre-con"></div>}

      {isLoggedIn ? (
        renderPage()
      ) : (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      )}
    </>
  );
}