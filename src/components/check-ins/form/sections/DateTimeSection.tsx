import React from 'react';
import { useSettingsStore } from '../../../../store/settingsStore';

interface DateTimeSectionProps {
  date: string;
  time: string;
  onChange: (field: 'date' | 'time', value: string) => void;
}

export function DateTimeSection({ date, time, onChange }: DateTimeSectionProps) {
  const { settings } = useSettingsStore();
  
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-lg text-neutral-900">
        {settings.checkInLabel} Schedule
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => onChange('date', e.target.value)}
            className="w-full rounded-md border-neutral-300 shadow-sm focus:border-accent-500 focus:ring-accent-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Time
          </label>
          <input
            type="time"
            value={time}
            onChange={(e) => onChange('time', e.target.value)}
            className="w-full rounded-md border-neutral-300 shadow-sm focus:border-accent-500 focus:ring-accent-500"
            required
          />
        </div>
      </div>
    </div>
  );
}