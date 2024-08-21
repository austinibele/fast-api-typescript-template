import { useState, useEffect, useCallback } from 'react';

export function useDataManagement<T>(fetchData: () => Promise<T[]>, dependencies: any[] = []) {
  const [data, setData] = useState<T[]>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const loadData = useCallback(() => {
    fetchData()
      .then(response => {
        setData(response);
      })
      .catch(error => {
        console.error('Failed to fetch data:', error);
      });
  }, dependencies);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCheckboxChange = (ids: string[]) => {
    setSelectedRows(ids);
  };

  const handleRefresh = () => {
    loadData();
  };

  return {
    data,
    selectedRows,
    handleCheckboxChange,
    handleRefresh,
    setData,
  };
}