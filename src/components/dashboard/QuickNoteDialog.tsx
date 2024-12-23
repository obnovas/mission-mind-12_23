import React from 'react';
import { Dialog } from '@headlessui/react';
import { Search, X } from 'lucide-react';
import { Contact } from '../../types';
import { useContactStore } from '../../store/contactStore';

interface QuickNoteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  contacts: Contact[];
}

export function QuickNoteDialog({ isOpen, onClose, contacts }: QuickNoteDialogProps) {
  const [selectedContact, setSelectedContact] = React.useState<Contact | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [note, setNote] = React.useState('');
  const { update } = useContactStore();

  const filteredContacts = React.useMemo(() => {
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [contacts, searchQuery]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContact || !note.trim()) return;

    try {
      await update(selectedContact.id, {
        notes: selectedContact.notes 
          ? `${selectedContact.notes}\n\n${note}`
          : note,
        updated_at: new Date().toISOString(),
      });

      onClose();
      setSelectedContact(null);
      setNote('');
      setSearchQuery('');
    } catch (err) {
      console.error('Error saving note:', err);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
        
        <div className="relative bg-white rounded-lg max-w-md w-full mx-4">
          <div className="bg-sage-50 rounded-t-lg border-b border-neutral-200 p-6">
            <div className="flex justify-between items-center">
              <Dialog.Title className="text-xl font-semibold text-neutral-900">
                Add Quick Note
              </Dialog.Title>
              <button onClick={onClose} className="text-neutral-500 hover:text-neutral-700">
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Select Contact
              </label>
              <div className="relative">
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
              <div className="mt-2 max-h-40 overflow-y-auto border border-neutral-200 rounded-md">
                {filteredContacts.map((contact) => (
                  <button
                    key={contact.id}
                    type="button"
                    onClick={() => setSelectedContact(contact)}
                    className={`w-full text-left p-3 hover:bg-neutral-50 ${
                      selectedContact?.id === contact.id ? 'bg-neutral-50' : ''
                    }`}
                  >
                    <p className="font-medium text-neutral-900">{contact.name}</p>
                    <p className="text-sm text-neutral-500">{contact.email}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Note
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={4}
                className="w-full rounded-md border-neutral-300 shadow-sm focus:border-accent-500 focus:ring-accent-500"
                placeholder="Enter your note..."
                required
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-neutral-300 rounded-md shadow-sm text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!selectedContact || !note.trim()}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent-600 hover:bg-accent-700 disabled:opacity-50"
              >
                Save Note
              </button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
}