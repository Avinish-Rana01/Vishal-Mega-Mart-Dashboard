export const getLiveStock = async (searchQuery = '') => {
  const term = encodeURIComponent(searchQuery || '');
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/stock/live-details?pageIndex=1&pageSize=100&searchTerm=${term}&userId=26`, {
    headers: {
      'Accept': 'application/json'
    }
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch live stock data: ${response.statusText}`);
  }
  return response.json();
};

export const getCycleCount = async (searchQuery = '') => {
  const term = encodeURIComponent(searchQuery || '');
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/stock/cycle-count-dashboard?pageIndex=1&pageSize=100&searchTerm=${term}&sortColumn=STORE%20CODE&sortDirection=ASC&userId=26`, {
    headers: {
      'Accept': 'application/json'
    }
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch cycle count data: ${response.statusText}`);
  }
  return response.json();
};

export const getVendorDiscrepancy = async (searchQuery = '') => {
  const term = encodeURIComponent(searchQuery || '');
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/stock/vendor-hu-discrepancy?pageIndex=1&pageSize=100&searchTerm=${term}&sortColumn=DIFF_TILL_DATE&sortDirection=asc&userId=26`, {
    headers: {
      'Accept': 'application/json'
    }
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch vendor data: ${response.statusText}`);
  }
  return response.json();
};

export const getTagLocation = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/stock/tag-management-location`, {
    headers: {
      'Accept': 'application/json'
    }
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch tag location data: ${response.statusText}`);
  }
  return response.json();
};

export const getTagCycleCount = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/stock/tag-cycle-count`, {
    headers: {
      'Accept': 'application/json'
    }
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch tag cycle count data: ${response.statusText}`);
  }
  return response.json();
};

export const getStoreDashboard = async (searchQuery = '') => {
  const term = encodeURIComponent(searchQuery || '');
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/stock/store-dashboard?pageIndex=1&pageSize=100&searchTerm=${term}&sortColumn=Store&sortDirection=asc&userId=26`, {
    headers: {
      'Accept': 'application/json'
    }
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch store dashboard data: ${response.statusText}`);
  }
  return response.json();
};

export const getSaleDashboard = async (searchQuery = '') => {
  const term = encodeURIComponent(searchQuery || '');
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/stock/sale-dashboard?pageIndex=1&pageSize=100&searchTerm=${term}&sortColumn=Store&sortDirection=asc&userId=26`, {
    headers: {
      'Accept': 'application/json'
    }
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch sale dashboard data: ${response.statusText}`);
  }
  return response.json();
};

export const getVoidDashboard = async (searchQuery = '') => {
  const term = encodeURIComponent(searchQuery || '');
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/stock/void-dashboard?pageIndex=1&pageSize=100&searchTerm=${term}&sortColumn=Store&sortDirection=asc&userId=26`, {
    headers: {
      'Accept': 'application/json'
    }
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch void dashboard data: ${response.statusText}`);
  }
  return response.json();
};

export const getReturnDashboard = async (searchQuery = '') => {
  const term = encodeURIComponent(searchQuery || '');
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/stock/return-dashboard?pageIndex=1&pageSize=100&searchTerm=${term}&sortColumn=Store&sortDirection=asc&userId=26`, {
    headers: {
      'Accept': 'application/json'
    }
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch return dashboard data: ${response.statusText}`);
  }
  return response.json();
};

export const getWarehouseEncoding = async (fromDate, toDate) => {
  const defaultDate = new Date().toISOString().split('T')[0];
  const fDate = fromDate || defaultDate;
  const tDate = toDate || defaultDate;
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/stock/warehouse-encoding?fromDate=${fDate}&toDate=${tDate}`, {
    headers: {
      'Accept': 'application/json'
    }
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch warehouse encoding data: ${response.statusText}`);
  }
  return response.json();
};

export const getDcValidation = async (pageIndex = 1, pageSize = 100, userId = 26) => {
  const uId = userId || 26;
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/stock/dc-validate-dashboard?pageIndex=${pageIndex}&pageSize=${pageSize}&userId=${uId}`, {
    headers: {
      'Accept': 'application/json'
    }
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch DC validation data: ${response.statusText}`);
  }
  return response.json();
};
