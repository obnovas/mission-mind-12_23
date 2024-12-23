import { useState, useMemo } from 'react';

export type SortDirection = 'asc' | 'desc';

export interface SortConfig<T> {
  field: keyof T;
  direction: SortDirection;
}

export interface FilterConfig {
  [key: string]: string;
}

export function useTableControls<T extends Record<string, any>>(items: T[]) {
  const [sortConfig, setSortConfig] = useState<SortConfig<T> | null>(null);
  const [filters, setFilters] = useState<FilterConfig>({});

  const sortedAndFilteredItems = useMemo(() => {
    let result = [...items];

    // Apply filters
    Object.keys(filters).forEach(key => {
      const filterValue = filters[key].toLowerCase();
      if (filterValue) {
        result = result.filter(item => {
          const value = item[key];
          if (typeof value === 'string') {
            return value.toLowerCase().includes(filterValue);
          }
          return String(value).toLowerCase().includes(filterValue);
        });
      }
    });

    // Apply sorting
    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.field];
        const bValue = b[sortConfig.field];

        if (aValue === bValue) return 0;
        
        const compareResult = aValue < bValue ? -1 : 1;
        return sortConfig.direction === 'asc' ? compareResult : -compareResult;
      });
    }

    return result;
  }, [items, sortConfig, filters]);

  const handleSort = (field: keyof T) => {
    setSortConfig(current => {
      if (!current || current.field !== field) {
        return { field, direction: 'asc' };
      }
      if (current.direction === 'asc') {
        return { field, direction: 'desc' };
      }
      return null;
    });
  };

  const handleFilter = (field: string, value: string) => {
    setFilters(current => ({
      ...current,
      [field]: value
    }));
  };

  return {
    items: sortedAndFilteredItems,
    sortConfig,
    filters,
    handleSort,
    handleFilter
  };
}