import React from 'react';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';
import { CheckInForm } from './CheckInForm';
import { CheckInDialogProps } from './types';
import { useCheckInStore } from '../../../store/checkInStore';
import { useSettingsStore } from '../../../store/settingsStore';
import { useContactStore } from '../../../store/contactStore';

export function CheckInDialog({ isOpen, onClose, contact, checkIn }: CheckInDialogProps) {
  const { add: addCheckIn, update: updateCheckIn, loading, error } = useCheckInStore();
  const { settings } = useSettingsStore();
  const [localError, setLocalError] = React.useState<Error | null>(null);

  const handleSubmit = async (formData: any) => {
    try {
      setLocalError(null);

      if (checkIn) {
        await updateCheckIn(checkIn.id, {
          check_in_date: formData.checkInDate,
          check_in_notes: formData.notes,
          check_in_type: formData.type,
          status: formData.status,
        });
      } else {
        await addCheckIn({
          contact_id: contact.id,
          check_in_date: formData.checkInDate,
          check_in_notes: formData.notes,
          check_in_type: formData.type,
          status: formData.status,
        });
      }

      // Refresh contacts to update next check-in dates
      await useContactStore.getState().fetch();
      
      onClose();
    } catch (err) {
      console.error('Error saving check-in:', err);
      setLocalError(err instanceof Error ? err : new Error('Failed to save check-in'));
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
        
        <div className="relative bg-white rounded-lg max-w-2xl w-full mx-4">
          <div className="bg-ocean-50 rounded-t-lg border-b border-neutral-200 p-6">
            <div className="flex justify-between items-center">
              <Dialog.Title className="text-xl font-semibold text-neutral-900">
                {checkIn ? `Update ${settings.checkInLabel}` : `Add ${settings.checkInLabel}`}
              </Dialog.Title>
              <button onClick={onClose} className="text-neutral-500 hover:text-neutral-700">
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="p-6">
            <CheckInForm
              contact={contact}
              checkIn={checkIn}
              onSubmit={handleSubmit}
              onCancel={onClose}
              loading={loading}
              error={localError || error}
            />
          </div>
        </div>
      </div>
    </Dialog>
  );
}