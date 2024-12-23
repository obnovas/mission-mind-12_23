import React from 'react';
import { Filter } from 'lucide-react';

interface TableFiltersProps {
  selectedTypes: string[];
  onTypeChange: (types: string[]) => void;
}

export function TableFilters({ selectedTypes, onTypeChange }: TableFiltersProps) {
  const types = ['Individual', 'Organization', 'Business'];

  const handleTypeToggle = (type: string) => {
    if (selectedTypes.includes(type)) {
      onTypeChange(selectedTypes.filter(t => t !== type));
    } else {
      onTypeChange([...selectedTypes, type]);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <span className="text-sm text-neutral-500 flex items-center">
        <Filter className="h-4 w-4 mr-1" />
        Filter:
      </span>
      <div className="flex items-center space-x-2">
        {types.map(type => (
          <label key={type} className="inline-flex items-center">
            <input
              type="checkbox"
              checked={selectedTypes.includes(type)}
              onChange={() => handleTypeToggle(type)}
              className="h-4 w-4 text-accent-600 focus:ring-accent-500 border-neutral-300 rounded"
            />
            <span className="ml-2 text-sm text-neutral-700">{type}</span>
          </label>
        ))}
      </div>
    </div>
  );
}