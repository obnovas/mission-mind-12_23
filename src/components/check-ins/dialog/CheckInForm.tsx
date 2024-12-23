import React from 'react';
import { Contact, CheckIn, CheckInStatus, CheckInType } from '../../../types';
import { FormField } from '../../common/forms/FormField';
import { SelectField } from '../../common/forms/SelectField';
import { CheckInTypeSelector } from './CheckInTypeSelector';
import { determineCheckInStatus } from '../../../utils/checkIn/status';
import { useSettingsStore } from '../../../store/settingsStore';

interface CheckInFormProps {
  contact: Contact;
  checkIn?: CheckIn;
  onSubmit: (data: any) => Promise<void>;
  isUpdating: boolean;
  error: string | null;
  onCancel: () => void;
}

export function CheckInForm({
  contact,
  checkIn,
  onSubmit,
  isUpdating,
  error,
  onCancel
}: CheckInFormProps) {
  const { settings } = useSettingsStore();
  const [formData, setFormData] = React.useState({
    date: checkIn?.check_in_date.split('T')[0] || new Date().toISOString().split('T')[0],
    time: checkIn?.check_in_date.split('T')[1].slice(0, 5) || new Date().toTimeString().slice(0, 5),
    notes: checkIn?.check_in_notes || '',
    status: checkIn?.status || 'Scheduled',
    type: checkIn?.check_in_type || 'suggested'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const checkInDate = new Date(`${formData.date}T${formData.time}`);
    const status = determineCheckInStatus(checkInDate.toISOString());

    await onSubmit({
      check_in_date: checkInDate.toISOString(),
      check_in_notes: formData.notes,
      status,
      check_in_type: formData.type,
      contact_id: contact.id
    });
  };

  const handleTypeChange = (type: CheckInType) => {
    setFormData(prev => ({ ...prev, type }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      <CheckInTypeSelector
        type={formData.type as CheckInType}
        onChange={handleTypeChange}
        disabled={isUpdating}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          id="date"
          name="date"
          label={`${settings.checkInLabel} Date`}
          type="date"
          value={formData.date}
          onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
          disabled={isUpdating}
          required
        />

        <FormField
          id="time"
          name="time"
          label={`${settings.checkInLabel} Time`}
          type="time"
          value={formData.time}
          onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
          disabled={isUpdating}
          required
        />
      </div>

      <FormField
        id="notes"
        name="notes"
        label="Notes"
        value={formData.notes}
        onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
        disabled={isUpdating}
        multiline
        rows={4}
        placeholder={`Add notes about this ${settings.checkInLabel.toLowerCase()}...`}
      />

      <div className="flex justify-end space-x-3 pt-6 border-t border-neutral-200">
        <button
          type="button"
          onClick={onCancel}
          disabled={isUpdating}
          className="px-4 py-2 border border-neutral-300 rounded-md shadow-sm text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isUpdating}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent-600 hover:bg-accent-700 disabled:opacity-50"
        >
          {isUpdating ? 'Saving...' : checkIn ? `Update ${settings.checkInLabel}` : `Add ${settings.checkInLabel}`}
        </button>
      </div>
    </form>
  );
}