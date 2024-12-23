import React from 'react';
import { useSettingsStore } from '../store/settingsStore';
import { Settings as SettingsIcon, Layout, Tags } from 'lucide-react';
import { CheckInDaysSection } from '../components/settings/CheckInDaysSection';
import { TimezoneSection } from '../components/settings/TimezoneSection';
import { CalendarFeedSection } from '../components/settings/CalendarFeedSection';

export function Settings() {
  const { settings, updateSettings } = useSettingsStore();
  const [newContactType, setNewContactType] = React.useState('');
  const [pendingTitle, setPendingTitle] = React.useState(settings.dashboardTitle);

  const handleAddContactType = (e: React.FormEvent) => {
    e.preventDefault();
    if (newContactType.trim() && !settings.contactTypes.includes(newContactType.trim())) {
      updateSettings({
        contactTypes: [...settings.contactTypes, newContactType.trim()],
      });
      setNewContactType('');
    }
  };

  const handleRemoveContactType = (type: string) => {
    updateSettings({
      contactTypes: settings.contactTypes.filter((t) => t !== type),
    });
  };

  const handleApplyTitle = () => {
    updateSettings({ dashboardTitle: pendingTitle });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-4">
        <SettingsIcon className="h-8 w-8 text-accent-600" />
        <h1 className="text-3xl font-bold text-neutral-900">Settings</h1>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Dashboard Settings */}
        <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
          <div className="bg-ocean-50 p-6 border-b border-neutral-200">
            <div className="flex items-center space-x-2">
              <Layout className="h-5 w-5 text-ocean-600" />
              <h2 className="text-xl font-semibold text-neutral-900">Dashboard Settings</h2>
            </div>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Dashboard Title
              </label>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={pendingTitle}
                  onChange={(e) => setPendingTitle(e.target.value)}
                  className="flex-1 rounded-md border-neutral-300 shadow-sm focus:border-accent-500 focus:ring-accent-500"
                />
                <button
                  onClick={handleApplyTitle}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent-600 hover:bg-accent-700"
                >
                  Apply
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Feature Label
              </label>
              <div className="flex items-center space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="Prayer Requests"
                    checked={settings.featureLabel === 'Prayer Requests'}
                    onChange={(e) => updateSettings({ featureLabel: e.target.value as 'Prayer Requests' | 'Actions Required' })}
                    className="h-4 w-4 text-accent-600 focus:ring-accent-500 border-neutral-300"
                  />
                  <span className="ml-2 text-sm text-neutral-700">Prayer Requests</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="Actions Required"
                    checked={settings.featureLabel === 'Actions Required'}
                    onChange={(e) => updateSettings({ featureLabel: e.target.value as 'Prayer Requests' | 'Actions Required' })}
                    className="h-4 w-4 text-accent-600 focus:ring-accent-500 border-neutral-300"
                  />
                  <span className="ml-2 text-sm text-neutral-700">Actions Required</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <CheckInDaysSection />
        <TimezoneSection />
        <CalendarFeedSection />

        {/* Contact Types */}
        <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
          <div className="bg-coral-50 p-6 border-b border-neutral-200">
            <div className="flex items-center space-x-2">
              <Tags className="h-5 w-5 text-coral-600" />
              <h2 className="text-xl font-semibold text-neutral-900">Contact Types</h2>
            </div>
          </div>
          <div className="p-6 space-y-6">
            <form onSubmit={handleAddContactType} className="flex gap-4">
              <input
                type="text"
                value={newContactType}
                onChange={(e) => setNewContactType(e.target.value)}
                placeholder="Add new contact type..."
                className="flex-1 rounded-md border-neutral-300 shadow-sm focus:border-accent-500 focus:ring-accent-500"
              />
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent-600 hover:bg-accent-700"
              >
                Add Type
              </button>
            </form>

            <div className="grid grid-cols-2 gap-4">
              {settings.contactTypes.map((type) => (
                <div
                  key={type}
                  className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg border border-neutral-200"
                >
                  <span className="text-neutral-900">{type}</span>
                  <button
                    onClick={() => handleRemoveContactType(type)}
                    className="text-coral-600 hover:text-coral-700 text-sm"
                    disabled={['Individual', 'Organization', 'Business'].includes(type)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}