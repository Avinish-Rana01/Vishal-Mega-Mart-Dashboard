export const getLiveStock = async (searchQuery) => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/stock/live-details?pageIndex=1&pageSize=100&searchTerm=${encodeURIComponent(searchQuery)}&userId=26`, {
    headers: {
      'Accept': 'application/json'
    }
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch live stock data: ${response.statusText}`);
  }
  return response.json();
};

export const getCycleCount = async (searchQuery) => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/stock/cycle-count-dashboard?pageIndex=1&pageSize=100&searchTerm=${encodeURIComponent(searchQuery)}&sortColumn=STORE%20CODE&sortDirection=ASC&userId=26`, {
    headers: {
      'Accept': 'application/json'
    }
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch cycle count data: ${response.statusText}`);
  }
  return response.json();
};

export const getVendorDiscrepancy = async (searchQuery) => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/stock/vendor-hu-discrepancy?pageIndex=1&pageSize=100&searchTerm=${encodeURIComponent(searchQuery)}&sortColumn=DIFF_TILL_DATE&sortDirection=asc&userId=26`, {
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
