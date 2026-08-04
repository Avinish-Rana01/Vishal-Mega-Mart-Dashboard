import { API_DEFAULTS } from '../config/constants';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

// Helper for default headers
const getHeaders = () => ({
  'Accept': 'application/json'
});

// ==============================================================
// Dashboard APIs
// ==============================================================

export const getLiveStock = async (searchQuery = '', signal) => {
  const term = encodeURIComponent(searchQuery || '');
  const response = await fetch(`${API_BASE}/api/stock/live-details?pageIndex=${API_DEFAULTS.PAGE_INDEX}&pageSize=${API_DEFAULTS.PAGE_SIZE}&searchTerm=${term}&userId=${API_DEFAULTS.USER_ID}`, {
    headers: getHeaders(),
    signal
  });
  if (!response.ok) throw new Error(`Failed to fetch live stock data: ${response.statusText}`);
  return response.json();
};

export const getCycleCount = async (searchQuery = '', signal) => {
  const term = encodeURIComponent(searchQuery || '');
  const response = await fetch(`${API_BASE}/api/stock/cycle-count-dashboard?pageIndex=${API_DEFAULTS.PAGE_INDEX}&pageSize=${API_DEFAULTS.PAGE_SIZE}&searchTerm=${term}&sortColumn=STORE%20CODE&sortDirection=ASC&userId=${API_DEFAULTS.USER_ID}`, {
    headers: getHeaders(),
    signal
  });
  if (!response.ok) throw new Error(`Failed to fetch cycle count data: ${response.statusText}`);
  return response.json();
};

export const getVendorDiscrepancy = async (searchQuery = '', signal) => {
  const term = encodeURIComponent(searchQuery || '');
  const response = await fetch(`${API_BASE}/api/stock/vendor-hu-discrepancy?pageIndex=${API_DEFAULTS.PAGE_INDEX}&pageSize=${API_DEFAULTS.PAGE_SIZE}&searchTerm=${term}&sortColumn=DIFF_TILL_DATE&sortDirection=asc&userId=${API_DEFAULTS.USER_ID}`, {
    headers: getHeaders(),
    signal
  });
  if (!response.ok) throw new Error(`Failed to fetch vendor data: ${response.statusText}`);
  return response.json();
};

export const getTagLocation = async (signal) => {
  const response = await fetch(`${API_BASE}/api/stock/tag-management-location`, {
    headers: getHeaders(),
    signal
  });
  if (!response.ok) throw new Error(`Failed to fetch tag location data: ${response.statusText}`);
  return response.json();
};

export const getTagCycleCount = async (signal) => {
  const response = await fetch(`${API_BASE}/api/stock/tag-cycle-count`, {
    headers: getHeaders(),
    signal
  });
  if (!response.ok) throw new Error(`Failed to fetch tag cycle count data: ${response.statusText}`);
  return response.json();
};

export const getStoreDashboard = async (searchQuery = '', signal) => {
  const term = encodeURIComponent(searchQuery || '');
  const response = await fetch(`${API_BASE}/api/stock/store-dashboard?pageIndex=${API_DEFAULTS.PAGE_INDEX}&pageSize=${API_DEFAULTS.PAGE_SIZE}&searchTerm=${term}&sortColumn=Store&sortDirection=asc&userId=${API_DEFAULTS.USER_ID}`, {
    headers: getHeaders(),
    signal
  });
  if (!response.ok) throw new Error(`Failed to fetch store dashboard data: ${response.statusText}`);
  return response.json();
};

export const getSaleDashboard = async (searchQuery = '', signal) => {
  const term = encodeURIComponent(searchQuery || '');
  const response = await fetch(`${API_BASE}/api/stock/sale-dashboard?pageIndex=${API_DEFAULTS.PAGE_INDEX}&pageSize=${API_DEFAULTS.PAGE_SIZE}&searchTerm=${term}&sortColumn=Store&sortDirection=asc&userId=${API_DEFAULTS.USER_ID}`, {
    headers: getHeaders(),
    signal
  });
  if (!response.ok) throw new Error(`Failed to fetch sale dashboard data: ${response.statusText}`);
  return response.json();
};

export const getVoidDashboard = async (searchQuery = '', signal) => {
  const term = encodeURIComponent(searchQuery || '');
  const response = await fetch(`${API_BASE}/api/stock/void-dashboard?pageIndex=${API_DEFAULTS.PAGE_INDEX}&pageSize=${API_DEFAULTS.PAGE_SIZE}&searchTerm=${term}&sortColumn=Store&sortDirection=asc&userId=${API_DEFAULTS.USER_ID}`, {
    headers: getHeaders(),
    signal
  });
  if (!response.ok) throw new Error(`Failed to fetch void dashboard data: ${response.statusText}`);
  return response.json();
};

export const getReturnDashboard = async (searchQuery = '', signal) => {
  const term = encodeURIComponent(searchQuery || '');
  const response = await fetch(`${API_BASE}/api/stock/return-dashboard?pageIndex=${API_DEFAULTS.PAGE_INDEX}&pageSize=${API_DEFAULTS.PAGE_SIZE}&searchTerm=${term}&sortColumn=Store&sortDirection=asc&userId=${API_DEFAULTS.USER_ID}`, {
    headers: getHeaders(),
    signal
  });
  if (!response.ok) throw new Error(`Failed to fetch return dashboard data: ${response.statusText}`);
  return response.json();
};

export const getWarehouseEncoding = async (fromDate, toDate, signal) => {
  const defaultDate = new Date().toISOString().split('T')[0];
  const fDate = fromDate || defaultDate;
  const tDate = toDate || defaultDate;
  const response = await fetch(`${API_BASE}/api/stock/warehouse-encoding?fromDate=${fDate}&toDate=${tDate}`, {
    headers: getHeaders(),
    signal
  });
  if (!response.ok) throw new Error(`Failed to fetch warehouse encoding data: ${response.statusText}`);
  return response.json();
};

export const getDcValidation = async (pageIndex = API_DEFAULTS.PAGE_INDEX, pageSize = API_DEFAULTS.PAGE_SIZE, userId = API_DEFAULTS.USER_ID, signal) => {
  const response = await fetch(`${API_BASE}/api/stock/dc-validate-dashboard?pageIndex=${pageIndex}&pageSize=${pageSize}&userId=${userId}`, {
    headers: getHeaders(),
    signal
  });
  if (!response.ok) throw new Error(`Failed to fetch DC validation data: ${response.statusText}`);
  return response.json();
};

// ==============================================================
// Report APIs
// ==============================================================

export const getReportStores = async (fromDate, toDate, signal) => {
  const response = await fetch(`${API_BASE}/api/report/stores?userId=${API_DEFAULTS.USER_ID}&fromDate=${fromDate}&toDate=${toDate}`, {
    headers: getHeaders(),
    signal
  });
  if (!response.ok) throw new Error(`Failed to fetch report stores: ${response.statusText}`);
  return response.json();
};

export const searchReportArticles = async (searchTerm, storeCode, fromDate, toDate, signal) => {
  const term = encodeURIComponent(searchTerm || '');
  const store = encodeURIComponent(storeCode || '');
  const response = await fetch(`${API_BASE}/api/report/articles/search?searchTerm=${term}&storeCode=${store}&fromDate=${fromDate}&toDate=${toDate}`, {
    headers: getHeaders(),
    signal
  });
  if (!response.ok) throw new Error(`Failed to search report articles: ${response.statusText}`);
  return response.json();
};

export const getReportLiveStock = async (storeCode, stockDate, articleNo, pageIndex, pageSize, signal) => {
  const store = encodeURIComponent(storeCode || '');
  const date = encodeURIComponent(stockDate || '');
  let url = `${API_BASE}/api/report/live-stock?pageIndex=${pageIndex}&pageSize=${pageSize}&storeName=${store}&stockDate=${date}&sortColumn=STOCK_DATE&sortDirection=asc`;
  
  if (articleNo) {
    url += `&articleNo=${encodeURIComponent(articleNo)}`;
  }
  
  const response = await fetch(url, {
    headers: getHeaders(),
    signal
  });
  if (!response.ok) throw new Error(`Failed to fetch report live stock: ${response.statusText}`);
  return response.json();
};

export const searchGrcHuNumbers = async (searchTerm, grcStatus = '1', storeCode = '', fromDate = '', toDate = '', signal) => {
  const term = encodeURIComponent(searchTerm || '');
  const url = `${API_BASE}/api/grc-report/hu-numbers/search?grcStatus=${grcStatus}&searchTerm=${term}&storeCode=${storeCode}&fromDate=${fromDate}&toDate=${toDate}`;
  const response = await fetch(url, { headers: getHeaders(), signal });
  if (!response.ok) throw new Error(`Failed to search HU numbers: ${response.statusText}`);
  return response.json();
};

export const getGrcDetails = async (pageIndex, pageSize, grcStatus = '1', storeName = '', huNo = '', fromDate = '', toDate = '', signal) => {
  let url = `${API_BASE}/api/grc-report/details?pageIndex=${pageIndex}&pageSize=${pageSize}&grcStatus=${grcStatus}&storeName=${encodeURIComponent(storeName)}&fromDate=${fromDate}&toDate=${toDate}`;
  if (huNo) {
    url += `&huNo=${encodeURIComponent(huNo)}`;
  }
  const response = await fetch(url, { headers: getHeaders(), signal });
  if (!response.ok) throw new Error(`Failed to fetch GRC details: ${response.statusText}`);
  return response.json();
};

