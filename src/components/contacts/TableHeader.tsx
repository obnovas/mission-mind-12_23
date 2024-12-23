import React from 'react';
import { ArrowUpDown, Search } from 'lucide-react';
import { SortConfig } from '../../hooks/useTableControls';

interface TableHeaderProps<T> {
  field: keyof T;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  sortConfig: SortConfig<T> | null;
  onSort: (field: keyof T) => void;
  onFilter: (field: string, value: string) => void;
  className?: string;
}

export function TableHeader<T>({
  field,
  label,
  sortable = true,
  filterable = true,
  sortConfig,
  onSort,
  onFilter,
  className = ''
}: TableHeaderProps<T>) {
  const getSortIcon = () => {
    if (!sortConfig || sortConfig.field !== field) {
      return <ArrowUpDown className="h-4 w-4 text-neutral-400" />;
    }
    return (
      <ArrowUpDown 
        className={`h-4 w-4 ${sortConfig.direction === 'asc' ? 'text-accent-600' : 'text-accent-600 rotate-180'}`} 
      />
    );
  };

  return (
    <th className={`px-6 py-3 ${className}`}>
      <div className="space-y-2">
        <button
          onClick={() => sortable && onSort(field)}
          className={`flex items-center space-x-1 text-xs font-medium text-neutral-500 uppercase tracking-wider ${
            sortable ? 'cursor-pointer hover:text-accent-600' : 'cursor-default'
          }`}
        >
          <span className="truncate">{label}</span>
          {sortable && getSortIcon()}
        </button>

        {filterable && (
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
              <Search className="h-3 w-3 text-neutral-400" />
            </div>
            <input
              type="text"
              onChange={(e) => onFilter(String(field), e.target.value)}
              className="w-full pl-7 pr-2 py-1 text-xs border border-neutral-200 rounded focus:border-accent-500 focus:ring-accent-500"
              placeholder={`Filter ${label.toLowerCase()}...`}
            />
          </div>
        )}
      </div>
    </th>
  );
}