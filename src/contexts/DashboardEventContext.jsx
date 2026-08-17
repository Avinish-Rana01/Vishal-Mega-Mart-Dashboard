import React, { createContext, useContext, useState, useEffect } from 'react';

const DashboardEventContext = createContext();

export const useDashboardEvents = () => {
  return useContext(DashboardEventContext);
};

export const DashboardEventProvider = ({ children }) => {
  const [globalRefreshTrigger, setGlobalRefreshTrigger] = useState(0);

  useEffect(() => {
    // Connect to the backend SSE endpoint
    const sseUrl = `${import.meta.env.VITE_API_BASE_URL}/api/events/dashboard-refresh`;
    const eventSource = new EventSource(sseUrl);

    eventSource.onopen = () => {
      console.log('SSE connection opened to', sseUrl);
    };

    eventSource.onmessage = (event) => {
      console.log('SSE message received:', event.data);
      // Increment trigger to notify all listeners to refresh
      setGlobalRefreshTrigger(prev => prev + 1);
    };

    eventSource.onerror = (error) => {
      console.error('SSE connection error:', error);
      // EventSource automatically attempts to reconnect
    };

    return () => {
      console.log('Closing SSE connection');
      eventSource.close();
    };
  }, []);

  return (
    <DashboardEventContext.Provider value={{ globalRefreshTrigger }}>
      {children}
    </DashboardEventContext.Provider>
  );
};
