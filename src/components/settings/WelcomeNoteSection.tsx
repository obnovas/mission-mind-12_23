import React from 'react';
import { MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { useSettingsStore } from '../../store/settingsStore';

export function WelcomeNoteSection() {
  const { settings, updateSettings } = useSettingsStore();

  const handleStyleChange = (style: 'biblical' | 'inspirational' | 'simple') => {
    updateSettings({ welcomeNoteStyle: style });
  };

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  };

  return (
    <div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-4">
            Choose your preferred welcome message style
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="relative flex flex-col bg-white p-4 border rounded-lg cursor-pointer focus-within:ring-2 focus-within:ring-accent-500">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-neutral-900">Biblical</span>
                <input
                  type="radio"
                  name="welcome-style"
                  value="biblical"
                  checked={settings.welcomeNoteStyle === 'biblical'}
                  onChange={() => handleStyleChange('biblical')}
                  className="h-4 w-4 text-accent-600 focus:ring-accent-500 border-neutral-300"
                />
              </div>
              <p className="mt-2 text-xs text-neutral-500">
                Daily inspiration from scripture
              </p>
            </label>

            <label className="relative flex flex-col bg-white p-4 border rounded-lg cursor-pointer focus-within:ring-2 focus-within:ring-accent-500">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-neutral-900">Inspirational</span>
                <input
                  type="radio"
                  name="welcome-style"
                  value="inspirational"
                  checked={settings.welcomeNoteStyle === 'inspirational'}
                  onChange={() => handleStyleChange('inspirational')}
                  className="h-4 w-4 text-accent-600 focus:ring-accent-500 border-neutral-300"
                />
              </div>
              <p className="mt-2 text-xs text-neutral-500">
                Motivational quotes from great leaders
              </p>
            </label>

            <label className="relative flex flex-col bg-white p-4 border rounded-lg cursor-pointer focus-within:ring-2 focus-within:ring-accent-500">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-neutral-900">Simple</span>
                <input
                  type="radio"
                  name="welcome-style"
                  value="simple"
                  checked={settings.welcomeNoteStyle === 'simple'}
                  onChange={() => handleStyleChange('simple')}
                  className="h-4 w-4 text-accent-600 focus:ring-accent-500 border-neutral-300"
                />
              </div>
              <p className="mt-2 text-xs text-neutral-500">
                Clean and straightforward greeting
              </p>
            </label>
          </div>
        </div>

        <div className="mt-6 p-4 bg-neutral-50 rounded-lg">
          <h3 className="text-sm font-medium text-neutral-900 mb-2">Preview</h3>
          {settings.welcomeNoteStyle === 'biblical' && (
            <p className="text-sm text-neutral-600">
              Remember: "Be strong and courageous. Do not be afraid; do not be discouraged..."
            </p>
          )}
          {settings.welcomeNoteStyle === 'inspirational' && (
            <p className="text-sm text-neutral-600">
              Good {getTimeOfDay()}, {settings.userName || 'User'}!
              "The best way to predict the future is to create it."
            </p>
          )}
          {settings.welcomeNoteStyle === 'simple' && (
            <p className="text-sm text-neutral-600">
              Good {getTimeOfDay()}, {settings.userName || 'User'}! Succeed on your Mission today! <br />
              {format(new Date(), 'EEEE, MMMM d, yyyy')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}