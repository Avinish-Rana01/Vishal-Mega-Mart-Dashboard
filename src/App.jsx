import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Login/LoginPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import LiveStockReportPage from './pages/Report/LiveStockReportPage';
import NotFoundPage from './pages/NotFound/NotFoundPage';
import ProtectedRoute from './components/common/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import './App.css';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/reports/live-stock" 
            element={
              <ProtectedRoute>
                <LiveStockReportPage />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/" 
            element={<Navigate to="/dashboard" replace />} 
          />
          
          <Route 
            path="*" 
            element={<NotFoundPage />} 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}