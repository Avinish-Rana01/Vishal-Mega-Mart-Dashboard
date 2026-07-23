/**
 * POS Web Application - Live Data API Service
 * Handles API calls to C# ASP.NET WebMethod / Web API backend endpoints
 */

import { parseXmlDataSet } from '../utils/xmlParser';
import { API_DEFAULTS } from '../config/constants';

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
 * 1. Live Stock Data API call matching GetLiveStockDetails in C# Dashboard.aspx.cs
 */
export async function fetchLiveStockData(params = {}) {
  return await callBackendApi('/Dashboard.aspx/GetLiveStockDetails', {
    searchTerm: params.searchTerm || '',
    pageIndex: params.pageIndex || API_DEFAULTS.PAGE_INDEX,
    pageSize: params.pageSize || API_DEFAULTS.PAGE_SIZE,
    user_id: String(params.userId ?? API_DEFAULTS.USER_ID),
    sortColumn: params.sortColumn || API_DEFAULTS.SORT_COLUMN,
    sortDirection: params.sortDirection || API_DEFAULTS.SORT_DIRECTION,
    sortType: params.sortType || 'string'
  });
}

/**
 * 2. Cycle Count Data API call
 */
export async function fetchCycleCountData(params = {}) {
  return await callBackendApi('/Dashboard.aspx/GetCCDetails', {
    searchTerm: params.searchTerm || '',
    pageIndex: params.pageIndex || API_DEFAULTS.PAGE_INDEX,
    pageSize: params.pageSize || API_DEFAULTS.PAGE_SIZE,
    user_id: String(params.userId ?? API_DEFAULTS.USER_ID),
    sortColumn: params.sortColumn || 'STORE CODE',
    sortDirection: params.sortDirection || API_DEFAULTS.SORT_DIRECTION,
    sortType: params.sortType || 'string'
  });
}
