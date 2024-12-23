import React from 'react';
import { UserCheck } from 'lucide-react';
import { ContactSelectDialog } from './ContactSelectDialog';
import { CheckInDialog } from '../contacts/CheckInDialog';
import { Contact } from '../../types';
import { useContactStore } from '../../store/contactStore';
import { Tooltip } from '../common/Tooltip';
import { useSettingsStore } from '../../store/settingsStore';
import { QuickContactSearch } from './QuickContactSearch';

export function CheckInButton() {
  const [isSelectingContact, setIsSelectingContact] = React.useState(false);
  const [isCheckingIn, setIsCheckingIn] = React.useState(false);
  const [selectedContact, setSelectedContact] = React.useState<Contact | null>(null);
  const { updateItem: updateContact } = useContactStore();
  const { settings } = useSettingsStore();

  const handleContactSelect = (contact: Contact) => {
    setSelectedContact(contact);
    setIsSelectingContact(false);
    setIsCheckingIn(true);
  };

  const handleCheckIn = (updates: Partial<Contact>) => {
    if (selectedContact) {
      updateContact(selectedContact.id, updates);
    }
    setIsCheckingIn(false);
    setSelectedContact(null);
  };

  return (
    <div className="flex items-center gap-2">
      <QuickContactSearch />
      
      <Tooltip 
        content={`Record ${settings.checkInLabel}`}
        className="right-full mr-4"
      >
        <button
          onClick={() => setIsSelectingContact(true)}
          className="inline-flex items-center px-6 py-2 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-accent-600 hover:bg-accent-700 transition-colors duration-200"
        >
          <UserCheck className="h-5 w-5 mr-2" />
          Add {settings.checkInLabel}
        </button>
      </Tooltip>

      <ContactSelectDialog
        isOpen={isSelectingContact}
        onClose={() => setIsSelectingContact(false)}
        onSelect={handleContactSelect}
      />

      {selectedContact && (
        <CheckInDialog
          isOpen={isCheckingIn}
          onClose={() => {
            setIsCheckingIn(false);
            setSelectedContact(null);
          }}
          contact={selectedContact}
          onCheckIn={handleCheckIn}
        />
      )}
    </div>
  );
}