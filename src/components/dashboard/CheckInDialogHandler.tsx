import React from 'react';
import { Contact, CheckIn } from '../../types';
import { CheckInDialog } from '../contacts/CheckInDialog';

interface CheckInDialogHandlerProps {
  contacts: Contact[];
  children: (handleCheckInSelect: (checkIn: CheckIn) => void) => React.ReactNode;
}

export function CheckInDialogHandler({ contacts, children }: CheckInDialogHandlerProps) {
  const [isCheckingIn, setIsCheckingIn] = React.useState(false);
  const [selectedContact, setSelectedContact] = React.useState<Contact | null>(null);
  const [selectedCheckIn, setSelectedCheckIn] = React.useState<CheckIn | null>(null);

  const handleCheckInSelect = (checkIn: CheckIn) => {
    const contact = contacts.find(c => c.id === checkIn.contact_id);
    if (contact) {
      setSelectedContact(contact);
      setSelectedCheckIn(checkIn);
      setIsCheckingIn(true);
    }
  };

  const handleClose = () => {
    setIsCheckingIn(false);
    setSelectedContact(null);
    setSelectedCheckIn(null);
  };

  return (
    <>
      {children(handleCheckInSelect)}

      {selectedContact && (
        <CheckInDialog
          isOpen={isCheckingIn}
          onClose={handleClose}
          contact={selectedContact}
          checkIn={selectedCheckIn}
        />
      )}
    </>
  );
}