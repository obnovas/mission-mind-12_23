import React from 'react';
import { Search, StickyNote, Heart, UserCheck } from 'lucide-react';
import { QuickContactSearch } from './QuickContactSearch';
import { useContactStore } from '../../store/contactStore';
import { useSettingsStore } from '../../store/settingsStore';
import { Contact } from '../../types';
import { ContactCombobox } from '../common/ContactCombobox';
import { QuickNoteForm } from './QuickNoteForm';
import { PrayerRequestForm } from '../prayer-requests/PrayerRequestForm';
import { CheckInDialog } from '../contacts/CheckInDialog';

export function QuickActions() {
  const [isSelectingContactForNote, setIsSelectingContactForNote] = React.useState(false);
  const [isSelectingContactForPrayer, setIsSelectingContactForPrayer] = React.useState(false);
  const [isSelectingContactForCheckIn, setIsSelectingContactForCheckIn] = React.useState(false);
  const [selectedContact, setSelectedContact] = React.useState<Contact | null>(null);
  const [isNoteFormOpen, setIsNoteFormOpen] = React.useState(false);
  const [isPrayerFormOpen, setIsPrayerFormOpen] = React.useState(false);
  const [isCheckInFormOpen, setIsCheckInFormOpen] = React.useState(false);
  const contacts = useContactStore((state) => state.items);
  const { settings } = useSettingsStore();

  const handleContactSelectForNote = (contact: Contact) => {
    setSelectedContact(contact);
    setIsSelectingContactForNote(false);
    setIsNoteFormOpen(true);
  };

  const handleContactSelectForPrayer = (contact: Contact) => {
    setSelectedContact(contact);
    setIsSelectingContactForPrayer(false);
    setIsPrayerFormOpen(true);
  };

  const handleContactSelectForCheckIn = (contact: Contact) => {
    setSelectedContact(contact);
    setIsSelectingContactForCheckIn(false);
    setIsCheckInFormOpen(true);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {/* Quick Search */}
      <QuickContactSearch />

      {/* Add Session */}
      <button
        onClick={() => setIsSelectingContactForCheckIn(true)}
        className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-neutral-200 hover:border-ocean-300 transition-colors duration-200 group"
      >
        <div className="w-12 h-12 rounded-full bg-ocean-50 flex items-center justify-center mb-2 group-hover:bg-ocean-100 transition-colors duration-200">
          <UserCheck className="h-6 w-6 text-ocean-600" />
        </div>
        <span className="text-sm font-medium text-neutral-600 group-hover:text-neutral-900">
          Add {settings.checkInLabel}
        </span>
      </button>

      {/* Quick Note */}
      <button
        onClick={() => setIsSelectingContactForNote(true)}
        className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-neutral-200 hover:border-sage-300 transition-colors duration-200 group"
      >
        <div className="w-12 h-12 rounded-full bg-sage-50 flex items-center justify-center mb-2 group-hover:bg-sage-100 transition-colors duration-200">
          <StickyNote className="h-6 w-6 text-sage-600" />
        </div>
        <span className="text-sm font-medium text-neutral-600 group-hover:text-neutral-900">Quick Note</span>
      </button>

      {/* Quick Prayer */}
      <button
        onClick={() => setIsSelectingContactForPrayer(true)}
        className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-neutral-200 hover:border-sunset-300 transition-colors duration-200 group"
      >
        <div className="w-12 h-12 rounded-full bg-sunset-50 flex items-center justify-center mb-2 group-hover:bg-sunset-100 transition-colors duration-200">
          <Heart className="h-6 w-6 text-sunset-600" />
        </div>
        <span className="text-sm font-medium text-neutral-600 group-hover:text-neutral-900">
          Add {settings.featureLabel.slice(0, -1)}
        </span>
      </button>

      {/* Contact Selection Dialogs */}
      {isSelectingContactForNote && (
        <ContactCombobox
          isOpen={true}
          onClose={() => setIsSelectingContactForNote(false)}
          onSelect={handleContactSelectForNote}
          contacts={contacts}
          title="Select Contact for Note"
        />
      )}

      {isSelectingContactForPrayer && (
        <ContactCombobox
          isOpen={true}
          onClose={() => setIsSelectingContactForPrayer(false)}
          onSelect={handleContactSelectForPrayer}
          contacts={contacts}
          title={`Select Contact for ${settings.featureLabel.slice(0, -1)}`}
        />
      )}

      {isSelectingContactForCheckIn && (
        <ContactCombobox
          isOpen={true}
          onClose={() => setIsSelectingContactForCheckIn(false)}
          onSelect={handleContactSelectForCheckIn}
          contacts={contacts}
          title={`Select Contact for ${settings.checkInLabel}`}
        />
      )}

      {/* Forms */}
      {selectedContact && isNoteFormOpen && (
        <QuickNoteForm
          isOpen={true}
          onClose={() => {
            setIsNoteFormOpen(false);
            setSelectedContact(null);
          }}
          contact={selectedContact}
        />
      )}

      {selectedContact && isPrayerFormOpen && (
        <PrayerRequestForm
          isOpen={true}
          onClose={() => {
            setIsPrayerFormOpen(false);
            setSelectedContact(null);
          }}
          contacts={contacts}
          preSelectedContact={selectedContact}
        />
      )}

      {selectedContact && isCheckInFormOpen && (
        <CheckInDialog
          isOpen={true}
          onClose={() => {
            setIsCheckInFormOpen(false);
            setSelectedContact(null);
          }}
          contact={selectedContact}
        />
      )}
    </div>
  );
}