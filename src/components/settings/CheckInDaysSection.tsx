import React from 'react';
import { Calendar } from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';

export function CheckInDaysSection() {
  const { settings, updateSettings } = useSettingsStore();
  const [pendingDays, setPendingDays] = React.useState(settings.upcomingCheckInsDays.toString());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const days = Math.min(90, Math.max(1, parseInt(pendingDays) || 30));
    updateSettings({ upcomingCheckInsDays: days });
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Upcoming {settings.checkInLabel} Range
          </label>
          <div className="flex gap-4">
            <input
              type="number"
              min="1"
              max="90"
              value={pendingDays}
              onChange={(e) => setPendingDays(e.target.value)}
              className="w-32 rounded-md border-neutral-300 shadow-sm focus:border-accent-500 focus:ring-accent-500"
            />
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent-600 hover:bg-accent-700"
            >
              Apply
            </button>
          </div>
          <p className="mt-2 text-sm text-neutral-500">
            Show {settings.checkInLabel.toLowerCase()}s due in the next 1-90 days
          </p>
        </div>
      </form>
    </div>
  );
}