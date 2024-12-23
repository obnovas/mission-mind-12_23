import React from 'react';
import { colors } from '../../../styles/colors';

export function GraphLegend() {
  const types = [
    { type: 'Individual', color: colors.ocean[500] },
    { type: 'Organization', color: colors.sage[500] },
    { type: 'Business', color: colors.coral[500] },
  ];

  return (
    <div className="bg-white p-3 rounded-lg shadow-lg border border-neutral-200">
      <div className="text-sm font-medium text-neutral-700 mb-2">Contact Types</div>
      <div className="space-y-2">
        {types.map(({ type, color }) => (
          <div key={type} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-sm text-neutral-600">{type}</span>
          </div>
        ))}
      </div>
    </div>
  );
}