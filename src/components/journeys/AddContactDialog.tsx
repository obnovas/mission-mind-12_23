import React from 'react';
import { Dialog } from '@headlessui/react';
import { X, Search } from 'lucide-react';
import { useContactStore } from '../../store/contactStore';
import { useContactJourneyStore } from '../../store/contactJourneyStore';

interface AddContactDialogProps {
  isOpen: boolean;
  onClose: () => void;
  journeyId: string;
  journeyName: string;
  stageName: string;
}

export function AddContactDialog({
  isOpen,
  onClose,
  journeyId,
  journeyName,
  stageName,
}: AddContactDialogProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedContact, setSelectedContact] = React.useState('');
  const [notes, setNotes] = React.useState('');
  const contacts = useContactStore((state) => state.items);
  const { loading, error, addContactToJourney } = useContactJourneyStore();

  // Filter available contacts
  const availableContacts = React.useMemo(() => {
    return contacts.filter(contact => 
      !contact.journeys?.some(j => j.journey_id === journeyId) &&
      (contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       contact.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [contacts, journeyId, searchQuery]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContact) return;

    try {
      await addContactToJourney({
        contactId: selectedContact,
        journeyId,
        stage: stageName,
        notes: notes.trim() || undefined,
      });

      // Refresh contacts to get updated data
      await useContactStore.getState().fetch();
      
      setSelectedContact('');
      setSearchQuery('');
      setNotes('');
      onClose();
    } catch (err) {
      console.error('Error adding contact to journey:', err);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-10 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
        
        <div className="relative bg-white rounded-lg max-w-md w-full mx-4 p-6">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-medium">
              Add Contact to {stageName}
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-neutral-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
              {error.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Search Contacts
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-md leading-5 bg-white placeholder-neutral-500 focus:outline-none focus:placeholder-neutral-400 focus:ring-1 focus:ring-accent-500 focus:border-accent-500 sm:text-sm"
                  placeholder="Search by name or email..."
                />
              </div>
            </div>

            <div className="max-h-60 overflow-y-auto border border-neutral-200 rounded-md">
              {availableContacts.map((contact) => (
                <label
                  key={contact.id}
                  className="flex items-center p-3 hover:bg-neutral-50 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="contact"
                    value={contact.id}
                    checked={selectedContact === contact.id}
                    onChange={(e) => setSelectedContact(e.target.value)}
                    className="h-4 w-4 text-accent-600 focus:ring-accent-500 border-neutral-300"
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-neutral-900">
                      {contact.name}
                    </p>
                    <p className="text-sm text-neutral-500">{contact.email}</p>
                  </div>
                </label>
              ))}
              {availableContacts.length === 0 && (
                <div className="p-4 text-center text-sm text-neutral-500">
                  No available contacts found
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Notes (optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full rounded-md border-neutral-300 shadow-sm focus:border-accent-500 focus:ring-accent-500 sm:text-sm"
                placeholder="Add any notes about adding this contact to the journey..."
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 border border-neutral-300 rounded-md shadow-sm text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !selectedContact}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent-600 hover:bg-accent-700 disabled:bg-neutral-300 disabled:cursor-not-allowed"
              >
                {loading ? 'Adding...' : 'Add Contact'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
}