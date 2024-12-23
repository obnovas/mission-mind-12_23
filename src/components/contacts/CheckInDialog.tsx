import React from 'react';
import { Contact, CheckIn } from '../../types';
import { CheckInDialog as CheckInFormDialog } from '../check-ins/form';

interface CheckInDialogProps {
  isOpen: boolean;
  onClose: () => void;
  contact: Contact;
  checkIn?: CheckIn;
  onCheckIn?: () => void;
}

export function CheckInDialog({ isOpen, onClose, contact, checkIn, onCheckIn }: CheckInDialogProps) {
  const handleClose = () => {
    onCheckIn?.();
    onClose();
  };

  return (
    <CheckInFormDialog
      isOpen={isOpen}
      onClose={handleClose}
      contact={contact}
      checkIn={checkIn}
    />
  );
}