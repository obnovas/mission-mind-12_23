import React from 'react';
import { CheckInType } from '../../../types';
import { Calendar, CalendarClock } from 'lucide-react';
import { useSettingsStore } from '../../../store/settingsStore';

interface CheckInTypeSelectorProps {
  type: CheckInType;
  onChange: (type: CheckInType) => void;
  disabled?: boolean;
}

export function CheckInTypeSelector({ type, onChange, disabled }: CheckInTypeSelectorProps) {
  const { settings } = useSettingsStore();
  const label = settings.checkInLabel.toLowerCase();

  return (
    <div className="flex gap-4">
      <button
        type="button"
        onClick={() => onChange('suggested')}
        disabled={disabled}
        className={`flex-1 p-4 rounded-lg border transition-colors duration-200 ${
          type === 'suggested'
            ? 'bg-neutral-50 border-neutral-300'
            : 'bg-white border-neutral-200 hover:border-neutral-300'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <div className="flex items-center justify-center mb-2">
          <CalendarClock className={`h-6 w-6 ${type === 'suggested' ? 'text-accent-600' : 'text-neutral-400'}`} />
        </div>
        <div className="text-center">
          <p className="font-medium text-neutral-900">Suggested {label}</p>
          <p className="text-sm text-neutral-500">Based on frequency</p>
        </div>
      </button>

      <button
        type="button"
        onClick={() => onChange('planned')}
        disabled={disabled}
        className={`flex-1 p-4 rounded-lg border transition-colors duration-200 ${
          type === 'planned'
            ? 'bg-neutral-50 border-neutral-300'
            : 'bg-white border-neutral-200 hover:border-neutral-300'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <div className="flex items-center justify-center mb-2">
          <Calendar className={`h-6 w-6 ${type === 'planned' ? 'text-accent-600' : 'text-neutral-400'}`} />
        </div>
        <div className="text-center">
          <p className="font-medium text-neutral-900">Planned {label}</p>
          <p className="text-sm text-neutral-500">Specific date & time</p>
        </div>
      </button>
    </div>
  );
}