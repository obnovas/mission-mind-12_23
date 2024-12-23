import React from 'react';
import { Filter } from 'lucide-react';

interface TypeFilterProps {
  types: string[];
  selectedType: string | 'all';
  onChange: (type: string | 'all') => void;
}

export function TypeFilter({ types, selectedType, onChange }: TypeFilterProps) {
  return (
    <div className="flex items-center gap-2">
      <Filter className="h-4 w-4 text-neutral-500" />
      <select
        value={selectedType}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border-neutral-300 shadow-sm focus:border-accent-500 focus:ring-accent-500"
      >
        <option value="all">All Types</option>
        {types.map(type => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>
    </div>
  );
}