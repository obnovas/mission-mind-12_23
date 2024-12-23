import React from 'react';
import { HeartHandshake } from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';

type LabelOption = 'Prayers' | 'Actions' | 'Tasks' | 'Requests' | 'Needs';

export function FeatureLabelSection() {
  const { settings, updateSettings } = useSettingsStore();

  const handleLabelChange = (value: LabelOption) => {
    updateSettings({ featureLabel: value });
  };

  const options: { value: LabelOption; label: string }[] = [
    { value: 'Prayers', label: 'Prayers' },
    { value: 'Actions', label: 'Actions' },
    { value: 'Tasks', label: 'Tasks' },
    { value: 'Requests', label: 'Requests' },
    { value: 'Needs', label: 'Needs' },
  ];

  return (
    <div className="bg-white rounded-lg border border-neutral-200 border-l-4 border-l-ocean-500 overflow-hidden">
      <div className="bg-ocean-50 p-6 border-b border-neutral-200">
        <div className="flex items-center space-x-2">
          <HeartHandshake className="h-5 w-5 text-ocean-600" />
          <h2 className="text-xl font-semibold text-neutral-900">Needs Tracking Label</h2>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Choose how to refer to tracked needs
            </label>
            <div className="grid grid-cols-2 gap-4">
              {options.map(({ value, label }) => (
                <label key={value} className="inline-flex items-center">
                  <input
                    type="radio"
                    value={value}
                    checked={settings.featureLabel === value}
                    onChange={(e) => handleLabelChange(e.target.value as LabelOption)}
                    className="h-4 w-4 text-accent-600 focus:ring-accent-500 border-neutral-300"
                  />
                  <span className="ml-2 text-sm text-neutral-700">{label}</span>
                </label>
              ))}
            </div>
            <p className="mt-2 text-sm text-neutral-500">
              This setting affects how needs are labeled throughout the application
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}