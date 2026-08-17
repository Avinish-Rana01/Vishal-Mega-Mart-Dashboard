import axios from 'axios';
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
  const response = await axios.get(`${API_BASE}/api/stock/live-details?pageIndex=${API_DEFAULTS.PAGE_INDEX}&pageSize=${API_DEFAULTS.PAGE_SIZE}&searchTerm=${term}&userId=${API_DEFAULTS.USER_ID}`, {
    headers: getHeaders(),
    signal
  });
  return response.data;
};

export const getCycleCount = async (searchQuery = '', signal) => {
  const term = encodeURIComponent(searchQuery || '');
  const response = await axios.get(`${API_BASE}/api/stock/cycle-count-dashboard?pageIndex=${API_DEFAULTS.PAGE_INDEX}&pageSize=${API_DEFAULTS.PAGE_SIZE}&searchTerm=${term}&sortColumn=STORE%20CODE&sortDirection=ASC&userId=${API_DEFAULTS.USER_ID}`, {
    headers: getHeaders(),
    signal
  });
  return response.data;
};

export const getVendorDiscrepancy = async (searchQuery = '', signal) => {
  const term = encodeURIComponent(searchQuery || '');
  const response = await axios.get(`${API_BASE}/api/stock/vendor-hu-discrepancy?pageIndex=${API_DEFAULTS.PAGE_INDEX}&pageSize=${API_DEFAULTS.PAGE_SIZE}&searchTerm=${term}&sortColumn=DIFF_TILL_DATE&sortDirection=asc&userId=${API_DEFAULTS.USER_ID}`, {
    headers: getHeaders(),
    signal
  });
  return response.data;
};

export const getTagLocation = async (signal) => {
  const response = await axios.get(`${API_BASE}/api/stock/tag-management-location`, {
    headers: getHeaders(),
    signal
  });
  return response.data;
};

export const getTagCycleCount = async (signal) => {
  const response = await axios.get(`${API_BASE}/api/stock/tag-cycle-count`, {
    headers: getHeaders(),
    signal
  });
  return response.data;
};

export const getStoreDashboard = async (searchQuery = '', signal) => {
  const term = encodeURIComponent(searchQuery || '');
  const response = await axios.get(`${API_BASE}/api/stock/store-dashboard?pageIndex=${API_DEFAULTS.PAGE_INDEX}&pageSize=${API_DEFAULTS.PAGE_SIZE}&searchTerm=${term}&sortColumn=Store&sortDirection=asc&userId=${API_DEFAULTS.USER_ID}`, {
    headers: getHeaders(),
    signal
  });
  return response.data;
};

export const getSaleDashboard = async (searchQuery = '', signal) => {
  const term = encodeURIComponent(searchQuery || '');
  const response = await axios.get(`${API_BASE}/api/stock/sale-dashboard?pageIndex=${API_DEFAULTS.PAGE_INDEX}&pageSize=${API_DEFAULTS.PAGE_SIZE}&searchTerm=${term}&sortColumn=Store&sortDirection=asc&userId=${API_DEFAULTS.USER_ID}`, {
    headers: getHeaders(),
    signal
  });
  return response.data;
};

export const getVoidDashboard = async (searchQuery = '', signal) => {
  const term = encodeURIComponent(searchQuery || '');
  const response = await axios.get(`${API_BASE}/api/stock/void-dashboard?pageIndex=${API_DEFAULTS.PAGE_INDEX}&pageSize=${API_DEFAULTS.PAGE_SIZE}&searchTerm=${term}&sortColumn=Store&sortDirection=asc&userId=${API_DEFAULTS.USER_ID}`, {
    headers: getHeaders(),
    signal
  });
  return response.data;
};

export const getReturnDashboard = async (searchQuery = '', signal) => {
  const term = encodeURIComponent(searchQuery || '');
  const response = await axios.get(`${API_BASE}/api/stock/return-dashboard?pageIndex=${API_DEFAULTS.PAGE_INDEX}&pageSize=${API_DEFAULTS.PAGE_SIZE}&searchTerm=${term}&sortColumn=Store&sortDirection=asc&userId=${API_DEFAULTS.USER_ID}`, {
    headers: getHeaders(),
    signal
  });
  return response.data;
};

export const getWarehouseEncoding = async (fromDate, toDate, signal) => {
  const defaultDate = new Date().toISOString().split('T')[0];
  const fDate = fromDate || defaultDate;
  const tDate = toDate || defaultDate;
  const response = await axios.get(`${API_BASE}/api/stock/warehouse-encoding?fromDate=${fDate}&toDate=${tDate}`, {
    headers: getHeaders(),
    signal
  });
  
  // Mock Data for Demo based on legacy screenshot
  if (response.data) {
    response.data.summary = { 
      hour8To9: 355, hour9To10: 990, hour10To11: 680, hour11To12: 820, 
      hour12To13: 2, hour13To14: 0, hour14To15: 0, hour15To16: 0, 
      hour16To17: 0, hour17To18: 0, hour18To19: 0, hour19To20: 0 
    };
  }
  
  return response.data;
};

export const getDcValidation = async (pageIndex = API_DEFAULTS.PAGE_INDEX, pageSize = API_DEFAULTS.PAGE_SIZE, userId = API_DEFAULTS.USER_ID, signal) => {
  const response = await axios.get(`${API_BASE}/api/stock/dc-validate-dashboard?pageIndex=${pageIndex}&pageSize=${pageSize}&userId=${userId}`, {
    headers: getHeaders(),
    signal
  });
  return response.data;
};

// ==============================================================
// Report APIs
// ==============================================================

export const getReportStores = async (signal) => {
  const response = await axios.get(`${API_BASE}/api/report/stores?userId=${API_DEFAULTS.USER_ID}`, {
    headers: getHeaders(),
    signal
  });
  return response.data;
};

export const searchReportArticles = async (searchTerm, storeCode, fromDate, toDate, signal) => {
  const term = encodeURIComponent(searchTerm || '');
  const store = encodeURIComponent(storeCode || '');
  const response = await axios.get(`${API_BASE}/api/report/articles/search?searchTerm=${term}&storeCode=${store}&fromDate=${fromDate}&toDate=${toDate}`, {
    headers: getHeaders(),
    signal
  });
  return response.data;
};

export const getReportLiveStock = async (storeCode, stockDate, articleNo, pageIndex, pageSize, signal) => {
  const store = encodeURIComponent(storeCode || '');
  const date = encodeURIComponent(stockDate || '');
  let url = `${API_BASE}/api/report/live-stock?pageIndex=${pageIndex}&pageSize=${pageSize}&storeName=${store}&stockDate=${date}&sortColumn=STOCK_DATE&sortDirection=asc`;
  
  if (articleNo) {
    url += `&articleNo=${encodeURIComponent(articleNo)}`;
  }
  
  const response = await axios.get(url, {
    headers: getHeaders(),
    signal
  });
  return response.data;
};

export const searchGrcHuNumbers = async (searchTerm, grcStatus = '1', storeCode = '', fromDate = '', toDate = '', signal) => {
  const term = encodeURIComponent(searchTerm || '');
  const url = `${API_BASE}/api/grc-report/hu-numbers/search?grcStatus=${grcStatus}&searchTerm=${term}&storeCode=${storeCode}&fromDate=${fromDate}&toDate=${toDate}`;
  const response = await axios.get(url, { headers: getHeaders(), signal });
  return response.data;
};

export const getGrcDetails = async (pageIndex, pageSize, grcStatus = '1', storeName = '', huNo = '', fromDate = '', toDate = '', signal) => {
  let url = `${API_BASE}/api/grc-report/details?pageIndex=${pageIndex}&pageSize=${pageSize}&grcStatus=${grcStatus}&storeName=${encodeURIComponent(storeName)}&fromDate=${fromDate}&toDate=${toDate}`;
  if (huNo) {
    url += `&huNo=${encodeURIComponent(huNo)}`;
  }
  const response = await axios.get(url, { headers: getHeaders(), signal });
  return response.data;
};

export const getStoreGrcReport = async (storeCode, fromDate, toDate, pageIndex = API_DEFAULTS.PAGE_INDEX, pageSize = API_DEFAULTS.PAGE_SIZE, signal) => {
  try {
    const store = encodeURIComponent(storeCode || '');
    const response = await axios.get(`${API_BASE}/api/stock/store-grc-report?storeCode=${store}&fromDate=${fromDate}&toDate=${toDate}&pageIndex=${pageIndex}&pageSize=${pageSize}`, {
      headers: getHeaders(),
      signal
    });
    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) throw error;
    console.error('Error fetching Store GRC Report data:', error);
    throw error;
  }
};

export const getStoreSaleReport = async (storeCode, fromDate, toDate, pageIndex = API_DEFAULTS.PAGE_INDEX, pageSize = API_DEFAULTS.PAGE_SIZE, signal) => {
  try {
    const store = encodeURIComponent(storeCode || '');
    const response = await axios.get(`${API_BASE}/api/stock/store-sale-report?userId=26&searchTerm=&storeCode=${store}&fromDate=${fromDate}&toDate=${toDate}&pageIndex=${pageIndex}&pageSize=${pageSize}&sortColumn=ITEM_CD&sortDirection=asc`, {
      headers: getHeaders(),
      signal
    });
    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) throw error;
    console.error('Error fetching Store Sale Report data:', error);
    throw error;
  }
};

export const getBindStores = async (fromDate, toDate, signal) => {
  const response = await axios.get(`${API_BASE}/api/report/stores?userId=${API_DEFAULTS.USER_ID}`, {
    headers: getHeaders(),
    signal
  });
  return response.data;
};

export const getCycleCountReport = async (pageIndex = API_DEFAULTS.PAGE_INDEX, pageSize = API_DEFAULTS.PAGE_SIZE, searchTerm = '', storeCode = '', fromDate = '', toDate = '', signal) => {
  const term = encodeURIComponent(searchTerm || '');
  const store = encodeURIComponent(storeCode || '');
  const response = await axios.get(`${API_BASE}/api/stock/cycle-count-report?pageIndex=${pageIndex}&pageSize=${pageSize}&searchTerm=${term}&storeCode=${store}&fromDate=${fromDate}&toDate=${toDate}&sortColumn=DATE&sortDirection=DESC`, {
    headers: getHeaders(),
    signal
  });
  return response.data;
};

export const getCycleCountDetails = async (pageIndex = API_DEFAULTS.PAGE_INDEX, pageSize = API_DEFAULTS.PAGE_SIZE, searchTerm = '', storeCode = '', fromDate = '', toDate = '', refNo = '', signal) => {
  const term = encodeURIComponent(searchTerm || '');
  const store = encodeURIComponent(storeCode || '');
  const ref = encodeURIComponent(refNo || '');
  const response = await axios.get(`${API_BASE}/api/stock/cycle-count-details?pageIndex=${pageIndex}&pageSize=${pageSize}&searchTerm=${term}&storeCode=${store}&fromDate=${fromDate}&toDate=${toDate}&refNo=${ref}&sortColumn=STORE_CODE&sortDirection=asc`, {
    headers: getHeaders(),
    signal
  });
  return response.data;
};

// ==============================================================
// Detailed Sale Report APIs
// ==============================================================

export const getSalePosCounters = async (store, fromDate, toDate, columnName, signal) => {
  const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/stock/sale/pos-counters?store=${encodeURIComponent(store)}&fromDate=${fromDate}&toDate=${toDate}&columnName=${encodeURIComponent(columnName || '')}`, {
    headers: getHeaders(),
    signal
  });
  return response.data || [];
};

export const getSaleArticles = async (store, fromDate, toDate, pos, searchTerm, columnName, signal) => {
  const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/stock/sale/articles?store=${encodeURIComponent(store)}&fromDate=${fromDate}&toDate=${toDate}&searchTerm=${encodeURIComponent(searchTerm || '')}&pos=${encodeURIComponent(pos || '')}&columnName=${encodeURIComponent(columnName || '')}`, {
    headers: getHeaders(),
    signal
  });
  return response.data || [];
};

export const getSaleEans = async (store, fromDate, toDate, pos, article, searchTerm, columnName, signal) => {
  const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/stock/sale/eans?store=${encodeURIComponent(store)}&fromDate=${fromDate}&toDate=${toDate}&searchTerm=${encodeURIComponent(searchTerm || '')}&pos=${encodeURIComponent(pos || '')}&material=${encodeURIComponent(article || '')}&columnName=${encodeURIComponent(columnName || '')}`, {
    headers: getHeaders(),
    signal
  });
  return response.data || [];
};

export const getDetailedSaleData = async (params, signal) => {
  const { storeName, fromDate, toDate, pageIndex, pageSize, pos, articleNo, ean, sortColumn, sortDirection, columnName } = params;
  
  // Base URL constructed according to the curl command format
  let url = `${import.meta.env.VITE_API_BASE_URL}/api/stock/sale-data?userId=${API_DEFAULTS.USER_ID}&storeName=${encodeURIComponent(storeName)}&fromDate=${fromDate}&toDate=${toDate}&pageIndex=${pageIndex}&pageSize=${pageSize}&pos=${encodeURIComponent(pos || '')}&articleNo=${encodeURIComponent(articleNo || '')}&ean=${encodeURIComponent(ean || '')}&sortColumn=${sortColumn || 'ITEM_CD'}&sortDirection=${sortDirection || 'asc'}&columnName=${columnName}`;

  const response = await axios.get(url, {
    headers: getHeaders(),
    signal
  });
  
  return response.data;
};
