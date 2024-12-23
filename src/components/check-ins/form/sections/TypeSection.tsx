import React from 'react';
import { Calendar, CalendarClock } from 'lucide-react';
import { useSettingsStore } from '../../../../store/settingsStore';
import { CheckInType } from '../../../../types';

interface TypeSectionProps {
  value: CheckInType;
  onChange: (type: CheckInType) => void;
}

export function TypeSection({ value, onChange }: TypeSectionProps) {
  const { settings } = useSettingsStore();
  const label = settings.checkInLabel.toLowerCase();

  const types = [
    {
      value: 'suggested' as const,
      label: `Suggested ${label}`,
      description: 'Based on frequency',
      icon: CalendarClock,
      color: 'text-neutral-600',
    },
    {
      value: 'planned' as const,
      label: `Planned ${label}`,
      description: 'Specific date & time',
      icon: Calendar,
      color: 'text-accent-600',
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-lg text-neutral-900">Type</h3>
      <div className="grid grid-cols-2 gap-4">
        {types.map(({ value: typeValue, label, description, icon: Icon, color }) => (
          <button
            key={typeValue}
            type="button"
            onClick={() => onChange(typeValue)}
            className={`flex flex-col items-center p-4 rounded-lg border text-left transition-colors duration-200 ${
              value === typeValue
                ? 'bg-neutral-50 border-neutral-300'
                : 'bg-white border-neutral-200 hover:border-neutral-300'
            }`}
          >
            <Icon className={`h-6 w-6 ${color} mb-2`} />
            <span className="text-sm font-medium text-neutral-900">{label}</span>
            <span className="text-xs text-neutral-500">{description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}