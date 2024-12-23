import React from 'react';
import { useSettingsStore } from '../../store/settingsStore';

const CELL_PROVIDERS = [
  { value: 'att', label: 'AT&T', domain: '@txt.att.net' },
  { value: 'verizon', label: 'Verizon', domain: '@vtext.com' },
  { value: 'tmobile', label: 'T-Mobile', domain: '@tmomail.net' },
  { value: 'sprint', label: 'Sprint', domain: '@messaging.sprintpcs.com' },
  { value: 'boost', label: 'Boost Mobile', domain: '@sms.myboostmobile.com' },
  { value: 'cricket', label: 'Cricket', domain: '@sms.cricketwireless.net' },
  { value: 'uscellular', label: 'US Cellular', domain: '@email.uscc.net' },
  { value: 'virgin', label: 'Virgin Mobile', domain: '@vmobl.com' },
  { value: 'republic', label: 'Republic Wireless', domain: '@text.republicwireless.com' },
  { value: 'googlefi', label: 'Google Fi', domain: '@msg.fi.google.com' },
];

export function AlertPreferencesSection() {
  const { settings, updateSettings } = useSettingsStore();
  const [formState, setFormState] = React.useState({
    emailAlerts: settings.emailAlerts || false,
    smsAlerts: settings.smsAlerts || false,
    alertPhoneNumber: settings.alertPhoneNumber || '',
    alertProvider: settings.alertProvider || '',
  });

  const handleEmailAlertsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newState = { ...formState, emailAlerts: e.target.checked };
    setFormState(newState);
    updateSettings(newState);
  };

  const handleSMSAlertsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newState = { ...formState, smsAlerts: e.target.checked };
    setFormState(newState);
    updateSettings(newState);
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    const newState = { ...formState, alertPhoneNumber: value };
    setFormState(newState);
    updateSettings(newState);
  };

  const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newState = { ...formState, alertProvider: e.target.value };
    setFormState(newState);
    updateSettings(newState);
  };

  const getGatewayAddress = () => {
    if (!formState.alertPhoneNumber || !formState.alertProvider) return null;
    const provider = CELL_PROVIDERS.find(p => p.value === formState.alertProvider);
    if (!provider) return null;
    return `${formState.alertPhoneNumber}${provider.domain}`;
  };

  return (
    <div className="space-y-6">
      {/* Email Alerts */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-neutral-900">Email Alerts</h3>
          <p className="text-sm text-neutral-500">Receive daily check-in reminders via email</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={formState.emailAlerts}
            onChange={handleEmailAlertsChange}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-ocean-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-ocean-600"></div>
        </label>
      </div>

      {/* SMS Alerts */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-neutral-900">SMS Alerts</h3>
          <p className="text-sm text-neutral-500">Receive daily check-in reminders via text message</p>
          <p className="text-xs text-neutral-400 mt-1">Message and data rates may apply from your carrier</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={formState.smsAlerts}
            onChange={handleSMSAlertsChange}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-ocean-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-ocean-600"></div>
        </label>
      </div>

      {/* Conditional SMS Settings */}
      {formState.smsAlerts && (
        <div className="space-y-4 pt-4 border-t border-neutral-200">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={formState.alertPhoneNumber}
              onChange={handlePhoneNumberChange}
              placeholder="Enter 10-digit phone number"
              className="w-full rounded-md border-neutral-300 shadow-sm focus:border-accent-500 focus:ring-accent-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Cell Provider
            </label>
            <select
              value={formState.alertProvider}
              onChange={handleProviderChange}
              className="w-full rounded-md border-neutral-300 shadow-sm focus:border-accent-500 focus:ring-accent-500"
              required
            >
              <option value="">Select your provider</option>
              {CELL_PROVIDERS.map(provider => (
                <option key={provider.value} value={provider.value}>
                  {provider.label}
                </option>
              ))}
            </select>
          </div>

          {getGatewayAddress() && (
            <div className="p-3 bg-neutral-50 rounded-md border border-neutral-200">
              <p className="text-sm text-neutral-600">
                Your SMS gateway address: <span className="font-mono">{getGatewayAddress()}</span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}