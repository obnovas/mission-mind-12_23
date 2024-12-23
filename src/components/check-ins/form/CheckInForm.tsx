import React from 'react';
import { format } from 'date-fns';
import { CheckInFormProps } from './types';
import { ContactDetails } from './sections/ContactDetails';
import { PrayerRequestsSection } from './sections/PrayerRequestsSection';
import { DateTimeSection } from './sections/DateTimeSection';
import { TypeSection } from './sections/TypeSection';
import { NotesSection } from './sections/NotesSection';
import { StatusSection } from './sections/StatusSection';
import { FormActions } from './sections/FormActions';
import { useSettingsStore } from '../../../store/settingsStore';
import { determineCheckInStatus } from '../../../utils/checkIn/status';

export function CheckInForm({
  contact,
  checkIn,
  onSubmit,
  onCancel,
  loading,
  error
}: CheckInFormProps) {
  const { settings } = useSettingsStore();
  const [formData, setFormData] = React.useState({
    date: checkIn?.check_in_date.split('T')[0] || format(new Date(), 'yyyy-MM-dd'),
    time: checkIn?.check_in_date.split('T')[1].slice(0, 5) || format(new Date(), 'HH:mm'),
    notes: checkIn?.check_in_notes || '',
    type: checkIn?.check_in_type || 'suggested' as const,
    status: checkIn?.status || 'Scheduled'
  });

  // Update status when date/time changes
  React.useEffect(() => {
    const checkInDate = new Date(`${formData.date}T${formData.time}`);
    const newStatus = determineCheckInStatus(checkInDate.toISOString());
    setFormData(prev => ({ ...prev, status: newStatus }));
  }, [formData.date, formData.time]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const checkInDate = new Date(`${formData.date}T${formData.time}`);
      
      await onSubmit({
        date: formData.date,
        time: formData.time,
        notes: formData.notes,
        type: formData.type,
        status: formData.status,
        checkInDate: checkInDate.toISOString()
      });
    } catch (err) {
      console.error('Form submission error:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
          {error.message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <ContactDetails contact={contact} />
          <PrayerRequestsSection contact={contact} />
        </div>

        <div className="space-y-6">
          <DateTimeSection
            date={formData.date}
            time={formData.time}
            onChange={(field, value) => setFormData(prev => ({ ...prev, [field]: value }))}
          />

          <StatusSection
            value={formData.status}
            onChange={(status) => setFormData(prev => ({ ...prev, status }))}
            checkInDate={new Date(`${formData.date}T${formData.time}`)}
          />

          <TypeSection
            value={formData.type}
            onChange={(type) => setFormData(prev => ({ ...prev, type }))}
          />

          <NotesSection
            value={formData.notes}
            onChange={(notes) => setFormData(prev => ({ ...prev, notes }))}
            label={settings.checkInLabel}
          />
        </div>
      </div>

      <FormActions
        onCancel={onCancel}
        loading={loading}
        isUpdate={!!checkIn}
        label={settings.checkInLabel}
      />
    </form>
  );
}