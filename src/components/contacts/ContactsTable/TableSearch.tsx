import React from 'react';
import { Search } from 'lucide-react';

interface TableSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function TableSearch({ value, onChange }: TableSearchProps) {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-neutral-400" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search contacts..."
        className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-md text-sm placeholder-neutral-500 focus:outline-none focus:ring-accent-500 focus:border-accent-500"
      />
    </div>
  );
}