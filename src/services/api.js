/**
 * POS Web Application - Live Data API Service
 * Handles API calls to C# ASP.NET WebMethod / Web API backend endpoints
 */

const BASE_URL = import.meta.env.VITE_USE_DIRECT_URL === 'true' ? (import.meta.env.VITE_API_BASE_URL || '') : '';

/**
 * Generic fetcher for ASP.NET WebMethods or Web API endpoints
 * @param {string} endpoint - Method endpoint (e.g. '/Dashboard.aspx/GetLiveStockDetails')
 * @param {object} params - Parameters object
 */
export async function callBackendApi(endpoint, params = {}) {
  const targetUrl = `${BASE_URL}${endpoint}`;
  try {
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/json, text/plain, */*',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const result = data.d !== undefined ? data.d : data;
    
    // Parse XML string if backend returns DataSet XML (via GetXml())
    if (typeof result === 'string' && result.trim().startsWith('<')) {
      return parseXmlDataSet(result);
    }

    return typeof result === 'string' ? JSON.parse(result) : result;
  } catch (error) {
    console.error(`API Error calling ${targetUrl}:`, error);
    throw error;
  }
}

/**
 * Robust XML parser for C# DataSet.GetXml() XML output
 */
function parseXmlDataSet(xmlString) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
  const result = { tables: {} };

  if (!xmlDoc.documentElement) return result;

  Array.from(xmlDoc.documentElement.children).forEach((node) => {
    const rawTableName = node.nodeName;
    const lowerName = rawTableName.toLowerCase();

    if (!result.tables[rawTableName]) result.tables[rawTableName] = [];
    if (!result.tables[lowerName]) result.tables[lowerName] = [];

    const rowObj = {};
    Array.from(node.children).forEach((child) => {
      rowObj[child.nodeName] = child.textContent;
      rowObj[child.nodeName.toUpperCase()] = child.textContent;
      rowObj[child.nodeName.toLowerCase()] = child.textContent;
    });

    result.tables[rawTableName].push(rowObj);
    if (lowerName !== rawTableName) {
      result.tables[lowerName].push(rowObj);
    }
  });

  return result;
}

/**
 * 1. Live Stock Data API call
 */
export async function fetchLiveStockData(params = {}) {
  return await callBackendApi('/Dashboard.aspx/GetLiveStockDetails', {
    searchTerm: params.searchTerm || '',
    pageIndex: params.pageIndex || 1,
    pageSize: params.pageSize || 100,
    user_id: String(params.userId ?? '0'),
    sortColumn: params.sortColumn || 'STORE',
    sortDirection: params.sortDirection || 'asc',
    sortType: params.sortType || 'string'
  });
}

/**
 * 2. Cycle Count Data API call
 */
export async function fetchCycleCountData(params = {}) {
  return await callBackendApi('/Dashboard.aspx/GetCCDetails', {
    searchTerm: params.searchTerm || '',
    pageIndex: params.pageIndex || 1,
    pageSize: params.pageSize || 100,
    user_id: String(params.userId ?? '0'),
    sortColumn: params.sortColumn || 'STORE CODE',
    sortDirection: params.sortDirection || 'asc',
    sortType: params.sortType || 'string'
  });
}

/**
 * 3. Store Validation Data API call
 */
export async function fetchStoreValidationData(params = {}) {
  return await callBackendApi('/Dashboard.aspx/GetStoreDetails', {
    searchTerm: params.searchTerm || '',
    pageIndex: params.pageIndex || 1,
    pageSize: params.pageSize || 100,
    user_id: String(params.userId ?? '0'),
    sortColumn: params.sortColumn || 'Store',
    sortDirection: params.sortDirection || 'asc',
    sortType: params.sortType || 'string'
  });
}

/**
 * 4. Sale Data API call
 */
export async function fetchSaleData(params = {}) {
  return await callBackendApi('/Dashboard.aspx/GetSaleDetails', {
    searchTerm: params.searchTerm || '',
    pageIndex: params.pageIndex || 1,
    pageSize: params.pageSize || 100,
    user_id: String(params.userId ?? '0'),
    sortColumn: params.sortColumn || 'STORE',
    sortDirection: params.sortDirection || 'asc',
    sortType: params.sortType || 'string'
  });
}

/**
 * 5. Void Data API call
 */
export async function fetchVoidData(params = {}) {
  return await callBackendApi('/Dashboard.aspx/GetVoidDetails', {
    searchTerm: params.searchTerm || '',
    pageIndex: params.pageIndex || 1,
    pageSize: params.pageSize || 100,
    user_id: String(params.userId ?? '0'),
    sortColumn: params.sortColumn || 'STORE',
    sortDirection: params.sortDirection || 'asc',
    sortType: params.sortType || 'string'
  });
}

/**
 * 6. Return Data API call
 */
export async function fetchReturnData(params = {}) {
  return await callBackendApi('/Dashboard.aspx/GetReturnDetails', {
    searchTerm: params.searchTerm || '',
    pageIndex: params.pageIndex || 1,
    pageSize: params.pageSize || 100,
    user_id: String(params.userId ?? '0'),
    sortColumn: params.sortColumn || 'STORE',
    sortDirection: params.sortDirection || 'asc',
    sortType: params.sortType || 'string'
  });
}

/**
 * 7. DC Validation Data API call
 */
export async function fetchDcValidationData(params = {}) {
  return await callBackendApi('/Dashboard.aspx/GetDCDetails', {
    searchTerm: params.searchTerm || '',
    pageIndex: params.pageIndex || 1,
    pageSize: params.pageSize || 100,
    user_id: String(params.userId ?? '0'),
    sortColumn: params.sortColumn || 'Store',
    sortDirection: params.sortDirection || 'asc',
    sortType: params.sortType || 'string'
  });
}
