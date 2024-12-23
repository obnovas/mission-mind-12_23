import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { useSettingsStore } from '../../store/settingsStore';
import { ChangePasswordSection } from './ChangePasswordSection';

export function UserDataSection() {
  const { user } = useAuthStore();
  const { settings, updateSettings } = useSettingsStore();
  const [name, setName] = React.useState<string>(settings.userName ?? '');

  React.useEffect(() => {
    // Update local state when settings change
    setName(settings.userName ?? '');
  }, [settings.userName]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    updateSettings({ userName: newName });
  };

  const handleOptInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSettings({ optInContact: e.target.checked });
  };

  return (
    <div className="space-y-8">
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Name
        </label>
        <input
          type="text"
          value={name}
          onChange={handleNameChange}
          className="w-full rounded-md border-neutral-300 shadow-sm focus:border-accent-500 focus:ring-accent-500"
          placeholder="Enter your name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Email Address
        </label>
        <p className="text-neutral-900">{user?.email}</p>
      </div>

      <div className="border-t border-neutral-200 pt-8">
        <h3 className="text-lg font-medium text-neutral-900 mb-4">Change Password</h3>
        <ChangePasswordSection />
      </div>

      <div className="flex items-start pt-6 border-t border-neutral-200">
        <div className="flex items-center h-5">
          <input
            id="opt-in"
            type="checkbox"
            checked={settings.optInContact ?? false}
            onChange={handleOptInChange}
            className="h-4 w-4 text-accent-600 focus:ring-accent-500 border-neutral-300 rounded"
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor="opt-in" className="font-medium text-neutral-700">
            Contact Permission
          </label>
          <p className="text-neutral-500">
            I agree to receive occasional updates and important information from Adventure Equity LLC
          </p>
        </div>
      </div>
    </div>
  );
}