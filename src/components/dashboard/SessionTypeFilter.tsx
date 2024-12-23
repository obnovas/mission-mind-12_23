import React from 'react';
import { CheckInType } from '../../types';

interface SessionTypeFilterProps {
  selectedTypes: CheckInType[];
  onChange: (types: CheckInType[]) => void;
}

export function SessionTypeFilter({ selectedTypes, onChange }: SessionTypeFilterProps) {
  const handleTypeToggle = (type: CheckInType) => {
    if (selectedTypes.includes(type)) {
      onChange(selectedTypes.filter(t => t !== type));
    } else {
      onChange([...selectedTypes, type]);
    }
  };

  return (
    <div className="flex items-center gap-2 text-sm">
      <label className="inline-flex items-center">
        <input
          type="checkbox"
          checked={selectedTypes.includes('planned')}
          onChange={() => handleTypeToggle('planned')}
          className="h-4 w-4 text-accent-600 focus:ring-accent-500 border-neutral-300 rounded"
        />
        <span className="ml-2 text-neutral-700">Planned</span>
      </label>
      <label className="inline-flex items-center">
        <input
          type="checkbox"
          checked={selectedTypes.includes('suggested')}
          onChange={() => handleTypeToggle('suggested')}
          className="h-4 w-4 text-accent-600 focus:ring-accent-500 border-neutral-300 rounded"
        />
        <span className="ml-2 text-neutral-700">Suggested</span>
      </label>
    </div>
  );
}