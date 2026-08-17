import { useState, useEffect, useCallback } from 'react';
import {
  getDetailedSaleData,
  getSalePosCounters,
  getSaleArticles,
  getSaleEans
} from '../services/stockService';
import { API_DEFAULTS } from '../config/constants';

export const useDetailedSaleReport = (store, fromDate, toDate, columnName) => {
  // Filters
  const [pos, setPos] = useState('');
  const [articleNo, setArticleNo] = useState('');
  const [ean, setEan] = useState('');

  const [articleSearchTerm, setArticleSearchTerm] = useState('');
  const [eanSearchTerm, setEanSearchTerm] = useState('');

  // Dropdown Options
  const [posOptions, setPosOptions] = useState([]);
  const [articleOptions, setArticleOptions] = useState([]);
  const [eanOptions, setEanOptions] = useState([]);

  // Dropdown Loading States
  const [isLoadingPos, setIsLoadingPos] = useState(false);
  const [isLoadingArticles, setIsLoadingArticles] = useState(false);
  const [isLoadingEans, setIsLoadingEans] = useState(false);

  // Grid Data State
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination
  const [pageIndex, setPageIndex] = useState(API_DEFAULTS.PAGE_INDEX);
  const [pageSize, setPageSize] = useState(10);
  const [sortColumn, setSortColumn] = useState('SALE_DATE');
  const [sortDirection, setSortDirection] = useState('asc');

  // Trigger for manual refreshes
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // ==========================================
  // Fetch Dropdown Options
  // ==========================================

  // 1. Fetch POS Counters (only depends on Store and Dates)
  useEffect(() => {
    if (!store || !fromDate || !toDate) return;
    
    const controller = new AbortController();
    const fetchPos = async () => {
      setIsLoadingPos(true);
      try {
        const result = await getSalePosCounters(store, fromDate, toDate, columnName, controller.signal);
        setPosOptions(result.map(p => ({ label: p.Text, value: p.Id })));
      } catch (err) {
        if (err.name !== 'AbortError') console.error("Failed to load POS options", err);
      } finally {
        if (!controller.signal.aborted) setIsLoadingPos(false);
      }
    };
    fetchPos();
    return () => controller.abort();
  }, [store, fromDate, toDate, columnName]);

  // 2. Fetch Articles (depends on Store, Dates, POS, search term)
  useEffect(() => {
    if (!store || !fromDate || !toDate) return;
    
    const controller = new AbortController();
    const delayDebounceFn = setTimeout(async () => {
      setIsLoadingArticles(true);
      try {
        const result = await getSaleArticles(store, fromDate, toDate, pos, articleSearchTerm, columnName, controller.signal);
        setArticleOptions(result.map(a => ({ label: a.Text, value: a.Id })));
      } catch (err) {
        if (err.name !== 'AbortError') console.error("Failed to load Article options", err);
      } finally {
        if (!controller.signal.aborted) setIsLoadingArticles(false);
      }
    }, 300);

    return () => {
      clearTimeout(delayDebounceFn);
      controller.abort();
    };
  }, [store, fromDate, toDate, pos, articleSearchTerm, columnName]);

  // 3. Fetch EANs (depends on Store, Dates, POS, Article, search term)
  useEffect(() => {
    if (!store || !fromDate || !toDate) return;
    
    const controller = new AbortController();
    const delayDebounceFn = setTimeout(async () => {
      setIsLoadingEans(true);
      try {
        const result = await getSaleEans(store, fromDate, toDate, pos, articleNo, eanSearchTerm, columnName, controller.signal);
        setEanOptions(result.map(e => ({ label: e.Text, value: e.Id })));
      } catch (err) {
        if (err.name !== 'AbortError') console.error("Failed to load EAN options", err);
      } finally {
        if (!controller.signal.aborted) setIsLoadingEans(false);
      }
    }, 300);

    return () => {
      clearTimeout(delayDebounceFn);
      controller.abort();
    };
  }, [store, fromDate, toDate, pos, articleNo, eanSearchTerm, columnName]);

  // ==========================================
  // Fetch Main Grid Data
  // ==========================================
  useEffect(() => {
    if (!store || !fromDate || !toDate || !columnName) {
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const params = {
          storeName: store,
          fromDate,
          toDate,
          pageIndex,
          pageSize,
          pos,
          articleNo,
          ean,
          sortColumn,
          sortDirection,
          columnName
        };
        
        const response = await getDetailedSaleData(params, controller.signal);
        if (controller.signal.aborted) return;

        const mappedData = (response.items || []).map(item => {
          const newItem = { ...item };
          // Format any date fields to YYYY-MM-DD
          ['BILL_DATE', 'CHECKOUT_DATE', 'DATE', 'Date', 'SALE_DATE'].forEach(dateField => {
            if (newItem[dateField]) {
              newItem[dateField] = newItem[dateField].split('T')[0];
            }
          });
          return newItem;
        });

        setData(mappedData);
        if (response.summary) {
          setSummary({
            storeName: response.summary.storeName || store,
            eanCount: response.summary.eanCount || 0,
            saleQty: response.summary.qty || 0, // Fallback to qty if saleQty isn't specifically named
            recordCount: response.summary.recordCount || 0
          });
        }
      } catch (err) {
        if (err.name === 'AbortError') return;
        console.error("Error fetching detailed sale data:", err);
        setError("Unable to load data. Please check your connection.");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    // Debounce the main fetch slightly to avoid rapid requests when clearing/setting dropdowns
    const timeout = setTimeout(() => {
      fetchData();
    }, 300);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [
    store, fromDate, toDate, columnName, 
    pos, articleNo, ean, 
    pageIndex, pageSize, sortColumn, sortDirection, 
    refreshTrigger
  ]);

  const search = useCallback(() => {
    setPageIndex(1);
    setRefreshTrigger(prev => prev + 1);
  }, []);

  const clearFilters = useCallback(() => {
    setPos('');
    setArticleNo('');
    setEan('');
    setPageIndex(1);
    // Let the useEffect handle the refetch based on state changes
  }, []);

  return {
    // Dropdown States
    pos, setPos,
    articleNo, setArticleNo,
    ean, setEan,
    
    // Search Terms
    setArticleSearchTerm,
    setEanSearchTerm,

    // Dropdown Options
    posOptions, articleOptions, eanOptions,
    isLoadingPos, isLoadingArticles, isLoadingEans,

    // Grid States
    data, summary, isLoading, error,
    pageIndex, setPageIndex,
    pageSize, setPageSize,
    
    // Actions
    search, clearFilters
  };
};
