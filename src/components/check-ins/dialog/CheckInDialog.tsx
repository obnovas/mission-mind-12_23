import React from 'react';
import { Dialog } from '@headlessui/react';
import { Contact, CheckIn } from '../../../types';
import { X } from 'lucide-react';
import { useCheckInStore } from '../../../store/checkInStore';
import { useSettingsStore } from '../../../store/settingsStore';
import { CheckInForm } from './CheckInForm';
import { CheckInHeader } from './CheckInHeader';

interface CheckInDialogProps {
  isOpen: boolean;
  onClose: () => void;
  contact: Contact;
  checkIn?: CheckIn;
}

export function CheckInDialog({ isOpen, onClose, contact, checkIn }: CheckInDialogProps) {
  const { settings } = useSettingsStore();
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { add: addCheckIn, update: updateCheckIn } = useCheckInStore();

  const handleSubmit = async (formData: any) => {
    try {
      setIsUpdating(true);
      setError(null);

      if (checkIn) {
        await updateCheckIn(checkIn.id, formData);
      } else {
        await addCheckIn(formData);
      }

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      {/* Rest of the component remains the same... */}
    </Dialog>
  );
}