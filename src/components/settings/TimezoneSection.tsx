import React from 'react';
import { Clock } from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';

const timezones = Intl.supportedValuesOf('timeZone');

export function TimezoneSection() {
  const { settings, updateSettings } = useSettingsStore();
  const { user } = useAuthStore();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleTimezoneChange = async (timezone: string) => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // Update timezone in database
      const { error: dbError } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          timezone,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id',
        });

      if (dbError) throw dbError;

      // Update local settings
      updateSettings({ timezone });
    } catch (err) {
      console.error('Error updating timezone:', err);
      setError(err instanceof Error ? err.message : 'Failed to update timezone');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
          {error}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Select your timezone
        </label>
        <select
          value={settings.timezone}
          onChange={(e) => handleTimezoneChange(e.target.value)}
          disabled={loading}
          className="w-full rounded-md border-neutral-300 shadow-sm focus:border-accent-500 focus:ring-accent-500 disabled:opacity-50"
        >
          {timezones.map((tz) => (
            <option key={tz} value={tz}>
              {tz}
            </option>
          ))}
        </select>
        <p className="mt-2 text-sm text-neutral-500">
          Your current local time: {new Date().toLocaleTimeString(undefined, { timeZone: settings.timezone })}
        </p>
      </div>
    </div>
  );
}