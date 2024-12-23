import React from 'react';
import { SignUpData } from './SignUpContainer';
import timezones from '../../../utils/timezones';

interface ProfileStepProps {
  onSubmit: (data: Partial<SignUpData>) => void;
  loading: boolean;
  error: Error | null;
  initialData: SignUpData;
}

const INTENT_OPTIONS = [
  { value: 'network', label: 'I want to better track my network of friends' },
  { value: 'pastor', label: 'I want to be a better pastor or shepherd of my people' },
  { value: 'tasks', label: 'I want to do a better job of tracking tasks and to-dos' },
  { value: 'requests', label: 'I want to keep track of requests that have been asked of me' },
  { value: 'prayer', label: 'I want to remember and be diligent about prayer requests' },
  { value: 'other', label: 'I have other plans for using MissionMind' },
];

export function ProfileStep({ onSubmit, loading, error, initialData }: ProfileStepProps) {
  const [formData, setFormData] = React.useState({
    name: initialData.name || '',
    organization: initialData.organization || '',
    timezone: initialData.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
    intent: initialData.intent || '',
    otherIntentDetails: initialData.otherIntentDetails || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-700">{error.message}</p>
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-neutral-700">
          Name
        </label>
        <div className="mt-1">
          <input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            className="block w-full appearance-none rounded-md border border-neutral-300 px-3 py-2 placeholder-neutral-400 shadow-sm focus:border-accent-500 focus:outline-none focus:ring-accent-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label htmlFor="organization" className="block text-sm font-medium text-neutral-700">
          Organization (optional)
        </label>
        <div className="mt-1">
          <input
            id="organization"
            name="organization"
            type="text"
            value={formData.organization}
            onChange={handleChange}
            className="block w-full appearance-none rounded-md border border-neutral-300 px-3 py-2 placeholder-neutral-400 shadow-sm focus:border-accent-500 focus:outline-none focus:ring-accent-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label htmlFor="timezone" className="block text-sm font-medium text-neutral-700">
          Timezone
        </label>
        <div className="mt-1">
          <select
            id="timezone"
            name="timezone"
            required
            value={formData.timezone}
            onChange={handleChange}
            className="block w-full appearance-none rounded-md border border-neutral-300 px-3 py-2 placeholder-neutral-400 shadow-sm focus:border-accent-500 focus:outline-none focus:ring-accent-500 sm:text-sm"
          >
            {timezones.map(tz => (
              <option key={tz} value={tz}>{tz}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          How do you plan to use MissionMind?
        </label>
        <div className="space-y-3">
          {INTENT_OPTIONS.map(option => (
            <label key={option.value} className="flex items-start">
              <input
                type="radio"
                name="intent"
                value={option.value}
                checked={formData.intent === option.value}
                onChange={handleChange}
                className="mt-1 h-4 w-4 text-accent-600 focus:ring-accent-500 border-neutral-300"
                required
              />
              <span className="ml-3 text-sm text-neutral-700">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {formData.intent === 'other' && (
        <div>
          <label htmlFor="otherIntentDetails" className="block text-sm font-medium text-neutral-700">
            Tell me more about your plans
          </label>
          <div className="mt-1">
            <textarea
              id="otherIntentDetails"
              name="otherIntentDetails"
              rows={3}
              value={formData.otherIntentDetails}
              onChange={handleChange}
              className="block w-full appearance-none rounded-md border border-neutral-300 px-3 py-2 placeholder-neutral-400 shadow-sm focus:border-accent-500 focus:outline-none focus:ring-accent-500 sm:text-sm"
            />
          </div>
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={loading}
          className="flex w-full justify-center rounded-md border border-transparent bg-accent-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </div>
    </form>
  );
}