import React from 'react';
import { Dialog } from '@headlessui/react';
import { Contact } from '../../types';
import { X, Search, Calendar } from 'lucide-react';
import { useContactStore } from '../../store/contactStore';
import { formatDate } from '../../utils/dates';

interface ContactSelectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (contact: Contact) => void;
}

export function ContactSelectDialog({ isOpen, onClose, onSelect }: ContactSelectDialogProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const contacts = useContactStore((state) => state.items);

  const filteredContacts = React.useMemo(() => {
    if (!searchQuery.trim()) return contacts;
    const query = searchQuery.toLowerCase();
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(query) ||
      contact.email.toLowerCase().includes(query)
    );
  }, [contacts, searchQuery]);

  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose} 
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen p-4">
        <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        
        <div className="relative bg-white rounded-lg w-full max-w-xl mx-auto shadow-xl">
          <div className="bg-ocean-50 rounded-t-lg border-b border-neutral-200 p-6">
            <div className="flex justify-between items-center">
              <Dialog.Title className="text-xl font-semibold text-neutral-900">
                Select Contact
              </Dialog.Title>
              <button 
                onClick={onClose}
                className="text-neutral-500 hover:text-neutral-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-md leading-5 bg-white placeholder-neutral-500 focus:outline-none focus:ring-accent-500 focus:border-accent-500 sm:text-sm"
                  placeholder="Search contacts..."
                  autoFocus
                />
              </div>

              <div className="max-h-96 overflow-y-auto">
                {filteredContacts.map((contact) => (
                  <button
                    key={contact.id}
                    onClick={() => onSelect(contact)}
                    className="w-full text-left p-4 hover:bg-neutral-50 border-b border-neutral-200 last:border-b-0"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-neutral-900">{contact.name}</p>
                        <p className="text-sm text-neutral-500">{contact.email}</p>
                      </div>
                      <div className="flex items-center text-sm text-neutral-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>Last: {formatDate(contact.last_contact_date)}</span>
                      </div>
                    </div>
                  </button>
                ))}
                {filteredContacts.length === 0 && (
                  <p className="text-center text-neutral-500 py-4">
                    No contacts found
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
}