import React, { useState, useEffect } from 'react';
import LoginPage from './pages/Login/LoginPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import './App.css';

export default function App() {
  const [pageLoading, setPageLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [loggedInUser, setLoggedInUser] = useState('Admin User');

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
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <>
      {pageLoading && <div className="se-pre-con"></div>}

      {isLoggedIn ? (
        <DashboardPage username={loggedInUser} onLogout={handleLogout} />
      ) : (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      )}
    </>
  );
}