import React from 'react';
import { CheckInStatus } from '../../../types';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface StatusSelectorProps {
  value: CheckInStatus;
  onChange: (status: CheckInStatus) => void;
  date: Date;
}

export function StatusSelector({ value, onChange, date }: StatusSelectorProps) {
  const now = new Date();
  const isDateInFuture = date > now;
  const isDateInPast = date < now;

  const statuses: Array<{
    value: CheckInStatus;
    label: string;
    icon: typeof CheckCircle;
    disabled: boolean;
    color: string;
  }> = [
    {
      value: 'Scheduled',
      label: 'Scheduled',
      icon: Clock,
      disabled: isDateInPast,
      color: 'text-ocean-600',
    },
    {
      value: 'Completed',
      label: 'Completed',
      icon: CheckCircle,
      disabled: isDateInFuture,
      color: 'text-sage-600',
    },
    {
      value: 'Missed',
      label: 'Missed',
      icon: AlertCircle,
      disabled: isDateInFuture,
      color: 'text-coral-600',
    },
  ];

  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700 mb-2">
        Status
      </label>
      <div className="grid grid-cols-3 gap-4">
        {statuses.map(({ value: statusValue, label, icon: Icon, disabled, color }) => (
          <button
            key={statusValue}
            type="button"
            onClick={() => !disabled && onChange(statusValue)}
            disabled={disabled}
            className={`flex flex-col items-center p-3 rounded-lg border transition-colors duration-200 ${
              value === statusValue
                ? 'bg-neutral-50 border-neutral-300'
                : 'bg-white border-neutral-200 hover:border-neutral-300'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <Icon className={`h-5 w-5 ${color} mb-1`} />
            <span className="text-sm font-medium text-neutral-900">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}