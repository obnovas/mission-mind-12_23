import React from 'react';
import { Contact } from '../../types';
import { ContactForm } from './form/ContactForm';

interface EditContactDialogProps {
  isOpen: boolean;
  onClose: () => void;
  contact: Contact;
}

export function EditContactDialog({ isOpen, onClose, contact }: EditContactDialogProps) {
  return (
    <ContactForm
      isOpen={isOpen}
      onClose={onClose}
      contact={contact}
    />
  );
}