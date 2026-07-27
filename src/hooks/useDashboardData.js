import { useState, useEffect } from 'react';
import {
  getLiveStock,
  getCycleCount,
  getVendorDiscrepancy,
  getTagLocation,
  getTagCycleCount
} from '../services/stockService';

export const useLiveStock = () => {
  const [data, setData] = useState([]);
  const [totals, setTotals] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getLiveStock(searchQuery);
        
        let items = response.items || [];
        if (searchQuery.trim()) {
          const term = searchQuery.toLowerCase();
          items = items.filter(row =>
            (row.STORE_CODE && row.STORE_CODE.toLowerCase().includes(term)) ||
            (row.STORE_NAME && row.STORE_NAME.toLowerCase().includes(term)) ||
            (row.DATE && row.DATE.toLowerCase().includes(term))
          );
        }
        setData(items);

        if (response.summary) {
          setTotals({
            STORE_CODE: 'TOTAL',
            SAP_STOCK: response.summary.sapQty?.toLocaleString('en-IN') || 0,
            RFID_STOCK: response.summary.rfidQty?.toLocaleString('en-IN') || 0,
            DIFFERENCE: response.summary.diffQty?.toLocaleString('en-IN') || 0
          });
        }
      } catch (err) {
        console.error("Error fetching live stock data:", err);
        setError("Unable to load live stock data. Please check your connection.");
      } finally {
        setIsLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchData();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, refreshTrigger]);

  const refresh = () => setRefreshTrigger(prev => prev + 1);

  return { data, totals, isLoading, error, searchQuery, setSearchQuery, refresh };
};

export const useCycleCount = () => {
  const [data, setData] = useState([]);
  const [totals, setTotals] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getCycleCount(searchQuery);
        
        let items = response.items || [];
        if (searchQuery.trim()) {
          const term = searchQuery.toLowerCase();
          items = items.filter(row =>
            (row.STORE_CODE && row.STORE_CODE.toLowerCase().includes(term)) ||
            (row.STORE_NAME && row.STORE_NAME.toLowerCase().includes(term)) ||
            (row.DATE && row.DATE.toLowerCase().includes(term)) ||
            (row.REF_NO && row.REF_NO.toLowerCase().includes(term))
          );
        }
        setData(items);
        if (response.summary) {
          setTotals({
            STORE_CODE: 'TOTAL',
            REF_NO: response.summary.refNo,
          });
        }
      } catch (err) {
        console.error("Error fetching cycle count data:", err);
        setError("Unable to load cycle count data.");
      } finally {
        setIsLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchData();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, refreshTrigger]);

  const refresh = () => setRefreshTrigger(prev => prev + 1);

  return { data, totals, isLoading, error, searchQuery, setSearchQuery, refresh };
};

export const useVendorDiscrepancy = () => {
  const [data, setData] = useState([]);
  const [totals, setTotals] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getVendorDiscrepancy(searchQuery);
        
        let items = response.items || [];
        if (searchQuery.trim()) {
          const term = searchQuery.toLowerCase();
          items = items.filter(row =>
            (row.VENDOR_NAME && row.VENDOR_NAME.toLowerCase().includes(term)) ||
            (row.VENDOR_CODE && row.VENDOR_CODE.toLowerCase().includes(term))
          );
        }
        setData(items);

        if (response.summary) {
          setTotals({
            VENDOR_CODE: 'TOTAL',
            ACTUAL_QTY: response.summary.actualQty?.toLocaleString('en-IN') || 0,
            SCANNED_QTY: response.summary.scannedQty?.toLocaleString('en-IN') || 0,
            DIFF_QTY: response.summary.differenceQty?.toLocaleString('en-IN') || 0,
            DIFF_TILL_DATE: response.summary.differenceQtyTillDate?.toLocaleString('en-IN') || 0
          });
        }
      } catch (err) {
        console.error("Error fetching vendor data:", err);
        setError("Unable to load vendor discrepancy data.");
      } finally {
        setIsLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchData();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, refreshTrigger]);

  const refresh = () => setRefreshTrigger(prev => prev + 1);

  return { data, totals, isLoading, error, searchQuery, setSearchQuery, refresh };
};

export const useTagCharts = () => {
  const [locationData, setLocationData] = useState([]);
  const [locationTotal, setLocationTotal] = useState(0);
  const [cycleData, setCycleData] = useState([]);
  const [cycleTotal, setCycleTotal] = useState(0);
  const [avgRecycle, setAvgRecycle] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTagCharts = async () => {
      setIsLoading(true);
      try {
        const [locData, cycData] = await Promise.all([
          getTagLocation(),
          getTagCycleCount()
        ]);

        const locTotal = locData.summary?.recordCount || 0;
        const storeVal = locData.summary?.storeCount || 0;
        const whVal = locData.summary?.warehouseCount || 0;
        setLocationTotal(locTotal);
        setLocationData([
          { name: 'Inventory at Store', value: storeVal, displayValue: storeVal.toLocaleString('en-IN'), percent: ((storeVal / (locTotal || 1)) * 100).toFixed(2), color: '#8b5cf6' },
          { name: 'Inventory at Warehouse', value: whVal, displayValue: whVal.toLocaleString('en-IN'), percent: ((whVal / (locTotal || 1)) * 100).toFixed(2), color: '#2dd4bf' }
        ]);

        const cycTotal = cycData.summary?.recordCount || 0;
        setCycleTotal(cycTotal);
        setAvgRecycle(cycData.summary?.avgTagPercentage || 0);

        const colors = ['#4ade80', '#fbbf24', '#2dd4bf', '#60a5fa', '#c084fc'];
        if (cycData.distribution) {
          const chartData = cycData.distribution.map((item, idx) => ({
            name: item.Count_Range,
            value: item.EPC_Count,
            displayValue: item.EPC_Count.toLocaleString('en-IN'),
            percent: ((item.EPC_Count / (cycTotal || 1)) * 100).toFixed(2),
            color: colors[idx % colors.length]
          }));
          setCycleData(chartData);
        }
      } catch (err) {
        console.error("Error fetching tag management charts:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTagCharts();
  }, []);

  return { locationData, locationTotal, cycleData, cycleTotal, avgRecycle, isLoading };
};
