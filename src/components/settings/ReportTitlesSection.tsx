import React from 'react';
import { FileText } from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';

export function ReportTitlesSection() {
  const { settings, updateSettings } = useSettingsStore();
  const [dailyTitle, setDailyTitle] = React.useState(settings.dailyReportTitle || '');
  const [monthlyTitle, setMonthlyTitle] = React.useState(settings.monthlyReportTitle || '');

  // Update local state when settings change
  React.useEffect(() => {
    setDailyTitle(settings.dailyReportTitle || '');
    setMonthlyTitle(settings.monthlyReportTitle || '');
  }, [settings.dailyReportTitle, settings.monthlyReportTitle]);

  const handleDailyTitleSave = () => {
    if (dailyTitle.trim()) {
      updateSettings({ dailyReportTitle: dailyTitle.trim() });
    }
  };

  const handleMonthlyTitleSave = () => {
    if (monthlyTitle.trim()) {
      updateSettings({ monthlyReportTitle: monthlyTitle.trim() });
    }
  };

  const handleDailyTitleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleDailyTitleSave();
    }
  };

  const handleMonthlyTitleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleMonthlyTitleSave();
    }
  };

  return (
    <div className="bg-white rounded-lg border border-neutral-200 border-l-4 border-l-ocean-500 overflow-hidden">
      <div className="bg-ocean-50 p-6 border-b border-neutral-200">
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-ocean-600" />
          <h2 className="text-xl font-semibold text-neutral-900">Report Settings</h2>
        </div>
      </div>
      <div className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Daily Report Title
          </label>
          <div className="flex gap-4">
            <input
              type="text"
              value={dailyTitle}
              onChange={(e) => setDailyTitle(e.target.value)}
              onKeyPress={handleDailyTitleKeyPress}
              className="flex-1 rounded-md border-neutral-300 shadow-sm focus:border-accent-500 focus:ring-accent-500"
              placeholder="Enter daily report title..."
            />
            <button
              onClick={handleDailyTitleSave}
              disabled={!dailyTitle.trim()}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent-600 hover:bg-accent-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save
            </button>
          </div>
          <p className="mt-2 text-sm text-neutral-500">
            This title will appear at the top of your daily reports
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Monthly Report Title
          </label>
          <div className="flex gap-4">
            <input
              type="text"
              value={monthlyTitle}
              onChange={(e) => setMonthlyTitle(e.target.value)}
              onKeyPress={handleMonthlyTitleKeyPress}
              className="flex-1 rounded-md border-neutral-300 shadow-sm focus:border-accent-500 focus:ring-accent-500"
              placeholder="Enter monthly report title..."
            />
            <button
              onClick={handleMonthlyTitleSave}
              disabled={!monthlyTitle.trim()}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent-600 hover:bg-accent-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save
            </button>
          </div>
          <p className="mt-2 text-sm text-neutral-500">
            This title will appear at the top of your monthly reports
          </p>
        </div>
      </div>
    </div>
  );
}