import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import { SortConfig } from '../../../hooks/useTableControls';

interface TableHeaderProps<T> {
  field: keyof T;
  label: string;
  sortConfig: SortConfig<T> | null;
  onSort: (field: keyof T) => void;
  className?: string;
}

export function TableHeader<T>({
  field,
  label,
  sortConfig,
  onSort,
  className = ''
}: TableHeaderProps<T>) {
  const getSortIcon = () => {
    if (!sortConfig || sortConfig.field !== field) {
      return <ArrowUpDown className="h-4 w-4 text-neutral-400" />;
    }
    return (
      <ArrowUpDown 
        className={`h-4 w-4 ${
          sortConfig.direction === 'asc' 
            ? 'text-accent-600' 
            : 'text-accent-600 rotate-180'
        }`} 
      />
    );
  };

  return (
    <th className={`px-6 py-3 ${className}`}>
      <button
        onClick={() => onSort(field)}
        className="flex items-center space-x-1 text-xs font-medium text-neutral-500 uppercase tracking-wider hover:text-accent-600 transition-colors duration-200"
      >
        <span className="truncate">{label}</span>
        {getSortIcon()}
      </button>
    </th>
  );
}