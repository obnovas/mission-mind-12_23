import React from 'react';
import { Dialog } from '@headlessui/react';
import { Contact, Journey } from '../../types';
import { X, Search, UserPlus } from 'lucide-react';
import { ContactForm } from '../contacts/form/ContactForm';
import { useContactJourneyStore } from '../../store/contactJourneyStore';

interface AddContactToJourneyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  journey: Journey;
  contacts: Contact[];
  onAddContact: (contactId: string) => Promise<void>;
  existingContactIds: string[];
}

export function AddContactToJourneyDialog({
  isOpen,
  onClose,
  journey,
  contacts,
  onAddContact,
  existingContactIds,
}: AddContactToJourneyDialogProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedContact, setSelectedContact] = React.useState('');
  const [isAddingNewContact, setIsAddingNewContact] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { addContactToJourney } = useContactJourneyStore();

  const filteredContacts = contacts.filter(
    contact =>
      !existingContactIds.includes(contact.id) &&
      (contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       contact.email?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContact) return;

    try {
      setLoading(true);
      setError(null);

      // Add contact to journey
      await addContactToJourney({
        contactId: selectedContact,
        journeyId: journey.id,
        stage: journey.stages[0],
      });

      // Call parent handler
      await onAddContact(selectedContact);
      handleClose();
    } catch (err) {
      console.error('Error adding contact to journey:', err);
      setError(err instanceof Error ? err.message : 'Failed to add contact');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedContact('');
    setSearchQuery('');
    setIsAddingNewContact(false);
    setError(null);
    onClose();
  };

  if (isAddingNewContact) {
    return (
      <ContactForm
        isOpen={true}
        onClose={() => setIsAddingNewContact(false)}
      />
    );
  }

  return (
    <Dialog open={isOpen} onClose={handleClose} className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
        
        <div className="relative bg-white rounded-lg max-w-md w-full">
          <div className="bg-ocean-50 rounded-t-lg border-b border-neutral-200 p-6">
            <div className="flex justify-between items-center">
              <Dialog.Title className="text-xl font-semibold text-neutral-900">
                Add Contact to Journey
              </Dialog.Title>
              <button onClick={handleClose} className="text-neutral-500 hover:text-neutral-700">
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-neutral-700">
                  Select Contact
                </label>
                <button
                  type="button"
                  onClick={() => setIsAddingNewContact(true)}
                  className="inline-flex items-center text-sm text-accent-600 hover:text-accent-700"
                >
                  <UserPlus className="h-4 w-4 mr-1" />
                  New Contact
                </button>
              </div>
              <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-md leading-5 bg-white placeholder-neutral-500 focus:outline-none focus:ring-accent-500 focus:border-accent-500 sm:text-sm"
                  placeholder="Search contacts..."
                />
              </div>
              <div className="max-h-60 overflow-y-auto border border-neutral-200 rounded-md">
                {filteredContacts.map((contact) => (
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
                {filteredContacts.length === 0 && (
                  <div className="p-4 text-center text-neutral-500">
                    No available contacts found
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleClose}
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
                {loading ? 'Adding...' : 'Add to Journey'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
}