import { useState, useEffect } from 'react';
import {
  getLiveStock,
  getCycleCount,
  getVendorDiscrepancy,
  getTagLocation,
  getTagCycleCount,
  getStoreDashboard,
  getSaleDashboard,
  getVoidDashboard,
  getReturnDashboard,
  getWarehouseEncoding,
  getDcValidation
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

export const useStoreDashboard = () => {
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
        const response = await getStoreDashboard(searchQuery);
        
        let items = response.items || [];
        if (searchQuery.trim()) {
          const term = searchQuery.toLowerCase();
          items = items.filter(row =>
            (row.STORE && row.STORE.toLowerCase().includes(term)) ||
            (row.STORE_NAME && row.STORE_NAME.toLowerCase().includes(term)) ||
            (row.DATE && row.DATE.toLowerCase().includes(term))
          );
        }
        setData(items);

        if (response.summary) {
          setTotals({
            STORE: 'TOTAL',
            HU_RECEIVED_QTY: response.summary.huReceivedQty?.toLocaleString('en-IN') || 0,
            HU_VALIDATED_QTY: response.summary.huValidatedQty?.toLocaleString('en-IN') || 0,
            HHT_VALIDATE_QTY: response.summary.hhtValidateQty?.toLocaleString('en-IN') || 0,
            HU_WRONG_QTY: response.summary.huWrongQty?.toLocaleString('en-IN') || 0,
            STORE_PENDING_QTY: ((response.summary.huReceivedQty || 0) - (response.summary.huValidatedQty || 0)).toLocaleString('en-IN')
          });
        }
      } catch (err) {
        console.error("Error fetching store dashboard data:", err);
        setError("Unable to load store validation data.");
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

export const useSaleDashboard = () => {
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
        const response = await getSaleDashboard(searchQuery);
        
        let items = response.items || [];
        if (searchQuery.trim()) {
          const term = searchQuery.toLowerCase();
          items = items.filter(row =>
            (row.STORE && row.STORE.toLowerCase().includes(term)) ||
            (row.STORE_NAME && row.STORE_NAME.toLowerCase().includes(term)) ||
            (row.DATE && row.DATE.toLowerCase().includes(term))
          );
        }
        setData(items);

        if (response.summary) {
          setTotals({
            STORE: 'TOTAL',
            TOTAL_DPOS_SALE: response.summary.totalDposSale?.toLocaleString('en-IN') || 0,
            TOTAL_RFID_CHECKOUT: response.summary.totalRfidCheckout?.toLocaleString('en-IN') || 0,
            RFID_CHECKOUT_MATCHING_WITH_DPOS_SALE: response.summary.totalRfidCheckoutMatch?.toLocaleString('en-IN') || 0,
            RFID_CHECKOUT_NOT_MATCHING_WITH_DPOS_SALE: response.summary.totalRfidCheckoutNotMatch?.toLocaleString('en-IN') || 0,
            TOTAL_MANUAL_SALE: response.summary.totalManualSale?.toLocaleString('en-IN') || 0,
            TOTAL_VOID: response.summary.totalVoid?.toLocaleString('en-IN') || 0
          });
        }
      } catch (err) {
        console.error("Error fetching sale dashboard data:", err);
        setError("Unable to load sale dashboard data.");
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

export const useVoidDashboard = () => {
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
        const response = await getVoidDashboard(searchQuery);
        
        let items = response.items || [];
        if (searchQuery.trim()) {
          const term = searchQuery.toLowerCase();
          items = items.filter(row =>
            (row.STORE && row.STORE.toLowerCase().includes(term)) ||
            (row.STORE_NAME && row.STORE_NAME.toLowerCase().includes(term)) ||
            (row.DATE && row.DATE.toLowerCase().includes(term))
          );
        }
        setData(items);

        if (response.summary) {
          setTotals({
            STORE: 'TOTAL',
            VOID_QTY: response.summary.returnQty?.toLocaleString('en-IN') || 0,
            ENCODE_QTY: response.summary.returnEncodedQty?.toLocaleString('en-IN') || 0,
            DIFFERENCE_QTY: response.summary.pendingQty?.toLocaleString('en-IN') || 0
          });
        }
      } catch (err) {
        console.error("Error fetching void dashboard data:", err);
        setError("Unable to load void dashboard data.");
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

export const useReturnDashboard = () => {
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
        const response = await getReturnDashboard(searchQuery);
        
        let items = response.items || [];
        if (searchQuery.trim()) {
          const term = searchQuery.toLowerCase();
          items = items.filter(row =>
            (row.Store_Code && row.Store_Code.toLowerCase().includes(term)) ||
            (row.STORE_NAME && row.STORE_NAME.toLowerCase().includes(term)) ||
            (row.DATE && row.DATE.toLowerCase().includes(term))
          );
        }
        setData(items);

        if (response.summary) {
          setTotals({
            Store_Code: 'TOTAL',
            RETURN_QTY: response.summary.returnQty?.toLocaleString('en-IN') || 0,
            ENCODE_QTY: response.summary.returnEncodedQty?.toLocaleString('en-IN') || 0,
            DIFFERENCE_QTY: response.summary.pendingQty?.toLocaleString('en-IN') || 0
          });
        }
      } catch (err) {
        console.error("Error fetching return dashboard data:", err);
        setError("Unable to load return dashboard data.");
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

export const useWarehouseEncoding = () => {
  const [data, setData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Date range state (default to today)
  const today = new Date().toISOString().split('T')[0];
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getWarehouseEncoding(fromDate, toDate);
        
        // Transform the summary object into an array for both table and chart
        if (response.summary) {
          const rawSummary = response.summary;
          const timeBlocks = [
            { label: '08 - 09', key: 'hour8To9' },
            { label: '09 - 10', key: 'hour9To10' },
            { label: '10 - 11', key: 'hour10To11' },
            { label: '11 - 12', key: 'hour11To12' },
            { label: '12 - 13', key: 'hour12To13' },
            { label: '13 - 14', key: 'hour13To14' },
            { label: '14 - 15', key: 'hour14To15' },
            { label: '15 - 16', key: 'hour15To16' },
            { label: '16 - 17', key: 'hour16To17' },
            { label: '17 - 18', key: 'hour17To18' },
            { label: '18 - 19', key: 'hour18To19' },
            { label: '19 - 20', key: 'hour19To20' }
          ];

          let total = 0;
          const formattedData = timeBlocks.map(block => {
            const count = rawSummary[block.key] || 0;
            total += count;
            return {
              timeBlock: block.label,
              count: count
            };
          });

          // Prepend a "TOTAL" row for the table view
          setData([
            { timeBlock: 'TOTAL', count: total },
            ...formattedData
          ]);

          // Set chart data (excluding the TOTAL row)
          setChartData(formattedData);
        } else {
          setData([]);
          setChartData([]);
        }

      } catch (err) {
        console.error("Error fetching warehouse encoding data:", err);
        setError("Unable to load warehouse encoding data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [fromDate, toDate]);

  return { data, chartData, isLoading, error, fromDate, setFromDate, toDate, setToDate };
};

export const useDcValidation = () => {
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
        const response = await getDcValidation(1, 100, 26);
        let items = response.items || [];
        
        if (searchQuery) {
          const lowerQuery = searchQuery.toLowerCase();
          items = items.filter(item => 
            (item.STORE_NAME && item.STORE_NAME.toLowerCase().includes(lowerQuery)) ||
            (item.Reciving_Plant && item.Reciving_Plant.toLowerCase().includes(lowerQuery))
          );
        }
        
        setData(items);
        if (response.summary) {
          setTotals({
            recordCount: response.summary.recordCount || 0,
            PROCESSED_HU: response.summary.processedHu || 0,
            UNPROCESSED_HU: response.summary.unprocessedHu || 0,
            PROCESSED_ARTICLE_QTY: response.summary.articleQty || 0
          });
        }
      } catch (err) {
        console.error("Error fetching DC validation data:", err);
        setError("Unable to load DC validation data.");
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



