import React from 'react';
import { Clock } from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';

type LabelOption = 'Check-In' | 'Interaction' | 'Session' | 'Follow-Up' | 'Meeting';

export function CheckInLabelSection() {
  const { settings, updateSettings } = useSettingsStore();

  const handleLabelChange = (value: LabelOption) => {
    updateSettings({ checkInLabel: value });
  };

  const options: { value: LabelOption; label: string }[] = [
    { value: 'Check-In', label: 'Check-Ins' },
    { value: 'Interaction', label: 'Interactions' },
    { value: 'Session', label: 'Sessions' },
    { value: 'Follow-Up', label: 'Follow-Ups' },
    { value: 'Meeting', label: 'Meetings' },
  ];

  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700 mb-2">
        Contact Interaction Label
      </label>
      <p className="text-sm text-neutral-500 mb-4">
        Choose how to refer to interactions with your contacts
      </p>
      <div className="grid grid-cols-2 gap-4">
        {options.map(({ value, label }) => (
          <label key={value} className="inline-flex items-center">
            <input
              type="radio"
              value={value}
              checked={settings.checkInLabel === value}
              onChange={(e) => handleLabelChange(e.target.value as LabelOption)}
              className="h-4 w-4 text-accent-600 focus:ring-accent-500 border-neutral-300"
            />
            <span className="ml-2 text-sm text-neutral-700">{label}</span>
          </label>
        ))}
      </div>
      <p className="mt-2 text-sm text-neutral-500">
        This setting affects how contact interactions are labeled throughout the application
      </p>
    </div>
  );
}