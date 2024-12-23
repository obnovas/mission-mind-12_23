import React from 'react';
import { useCheckInStore } from '../store/checkInStore';
import { useContactStore } from '../store/contactStore';
import { useSettingsStore } from '../store/settingsStore';
import { CheckInCalendar } from '../components/check-ins/CheckInCalendar';
import { SessionsList } from '../components/check-ins/SessionsList';
import { Calendar, UserCheck } from 'lucide-react';
import { CheckInDialog } from '../components/contacts/CheckInDialog';
import { ContactSelectDialog } from '../components/dashboard/ContactSelectDialog';
import { Contact, CheckIn } from '../types';

export function CheckIns() {
  const [isSelectingContact, setIsSelectingContact] = React.useState(false);
  const [isCheckingIn, setIsCheckingIn] = React.useState(false);
  const [selectedContact, setSelectedContact] = React.useState<Contact | null>(null);
  const [selectedCheckIn, setSelectedCheckIn] = React.useState<CheckIn | null>(null);
  const { items: checkIns, loading, error, fetch: fetchCheckIns } = useCheckInStore();
  const { items: contacts, fetch: fetchContacts } = useContactStore();
  const { settings } = useSettingsStore();

  React.useEffect(() => {
    Promise.all([
      fetchCheckIns(),
      fetchContacts()
    ]).catch(console.error);
  }, []);

  const handleContactSelect = (contact: Contact) => {
    setSelectedContact(contact);
    setSelectedCheckIn(null);
    setIsSelectingContact(false);
    setIsCheckingIn(true);
  };

  const handleCheckInSelect = (checkIn: CheckIn) => {
    const contact = contacts.find(c => c.id === checkIn.contact_id);
    if (contact) {
      setSelectedContact(contact);
      setSelectedCheckIn(checkIn);
      setIsCheckingIn(true);
    }
  };

  const handleCheckInClose = () => {
    setIsCheckingIn(false);
    setSelectedContact(null);
    setSelectedCheckIn(null);
    Promise.all([
      fetchCheckIns(),
      fetchContacts()
    ]).catch(console.error);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading check-ins: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg border border-neutral-200 border-l-4 border-l-accent-500 overflow-hidden">
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Calendar className="h-6 w-6 text-accent-600 mr-2" />
              <h1 className="text-2xl sm:text-3xl font-roboto font-bold text-neutral-900">
                {settings.checkInLabel} Calendar
              </h1>
            </div>
            <button
              onClick={() => setIsSelectingContact(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-accent-600 hover:bg-accent-700 transition-colors duration-200"
            >
              <UserCheck className="h-5 w-5 mr-2" />
              Add {settings.checkInLabel}
            </button>
          </div>
        </div>
      </div>

      <CheckInCalendar 
        checkIns={checkIns} 
        contacts={contacts} 
        onCheckInSelect={handleCheckInSelect}
      />
      
      <SessionsList
        checkIns={checkIns}
        contacts={contacts}
        onCheckInSelect={handleCheckInSelect}
      />

      <ContactSelectDialog
        isOpen={isSelectingContact}
        onClose={() => setIsSelectingContact(false)}
        onSelect={handleContactSelect}
      />

      {selectedContact && (
        <CheckInDialog
          isOpen={isCheckingIn}
          onClose={handleCheckInClose}
          contact={selectedContact}
          checkIn={selectedCheckIn}
        />
      )}
    </div>
  );
}